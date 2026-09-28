# -*- coding: utf-8 -*-
"""游戏维护：游戏管理、区服/职业/阵营、订单分类、常用项目、游戏物品、报价计算器"""
import json, os
from flask import jsonify
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, log, now

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def games_sorted():
    return sorted(db.all_('games'), key=lambda g: (-(g.get('orderNum') or 0), g['id']))


def game_by_id(gid):
    try:
        return db.get('games', int(gid))
    except (TypeError, ValueError):
        return None


def game_by_name(name):
    return db.first('games', lambda g: g.get('gameName') == name)


def resolve_game(val):
    """gameId 或 gameName → game"""
    if val in (None, ''):
        return None
    g = game_by_id(val)
    return g or game_by_name(str(val))


def catalog():
    p = os.path.join(BASE, 'data', 'game_catalog.json')
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else []


# ---------------- 游戏管理 ----------------
@route('/GameAjax/GetGameServerMangeList')
def game_list():
    rows = [dict(g, id=g['id']) for g in games_sorted()]
    return paged(rows)


@route(['/GameAjax/GetGameList', '/GameAjax/GetMyGameList', '/OrderAjax/GetGameList', '/UserAjax/GetGameList'])
def game_options():
    rows = [dict(gameId=g['id'], gameName=g['gameName'], name=g['gameName'], value=g['id'], isMoblieGame=g.get('isMoblieGame'), isPw=g.get('isPw')) for g in games_sorted()]
    return json_ok('', data=rows)


@route('/GameAjax/AddEditGame')
def add_edit_game():
    p = P()
    name = p.get('gameName').strip()
    gid = p.int('gameId')
    if not name:
        return json_err('游戏名称不能为空')
    if gid:
        g = db.get('games', gid)
        if not g:
            return json_err('游戏不存在')
        old = g['gameName']
        db.update('games', gid, dict(gameName=name))
        for coll in ('game_data', 'order_types', 'projects', 'orders', 'game_accounts', 'pve_tasks'):
            for r in db.find(coll, lambda r: r.get('gameName') == old):
                db.update(coll, r['id'], dict(gameName=name))
        log('游戏', '修改游戏名称 %s → %s' % (old, name))
        return json_ok('修改成功')
    if game_by_name(name):
        return json_err('该游戏已存在于本系统')
    cat = next((c for c in catalog() if c['name'] == name), None)
    is_mob = p.get('isMoblieGame') or ('Y' if cat and str(cat.get('isMoblie')) == '20' else 'N')
    is_pw = p.get('isPw') or (cat.get('isPw') if cat else 'N')
    g = db.insert('games', dict(gameName=name, isDefulat='N', isMoblieGame=is_mob, isPw=is_pw or 'N', isNotAccPwd='N', isDisbleSendSms=0, orderNum=1))
    db.update('games', g['id'], dict(gameId=g['id']))
    for area in ['官服', 'B服', '国际服'] if is_mob == 'Y' else ['电信区', '网通区']:
        db.insert('game_data', dict(gameId=g['id'], gameName=name, type=20, name=area, orderBy=0, parentId=0))
    log('游戏', '新增游戏【%s】' % name)
    return json_ok('添加成功', data=g['id'])


@route('/GameAjax/DelGame')
def del_game():
    g = db.get('games', P().int('gameId'))
    if not g:
        return json_err('游戏不存在')
    if db.count('orders', lambda o: o.get('gameName') == g['gameName']):
        return json_err('该游戏下已有订单，不能删除')
    for coll in ('game_data', 'order_types', 'projects'):
        for r in db.find(coll, lambda r: r.get('gameId') == g['id']):
            db.delete(coll, r['id'])
    db.delete('games', g['id'])
    log('游戏', '删除游戏【%s】' % g['gameName'])
    return json_ok('删除成功')


@route('/GameAjax/UpdateGameOrderNum')
def game_order_num():
    p = P()
    g = db.get('games', p.int('gameId'))
    if not g:
        return json_err('游戏不存在')
    db.update('games', g['id'], dict(orderNum=p.int('orderNum') or p.int('value')))
    return json_ok('修改成功')


def _toggle(field, on='Y', off='N'):
    def fn():
        g = db.get('games', P().int('gameId'))
        if not g:
            return json_err('游戏不存在')
        if field == 'isDefulat':
            for o in db.all_('games'):
                if o.get('isDefulat') == 'Y':
                    db.update('games', o['id'], dict(isDefulat='N'))
            db.update('games', g['id'], dict(isDefulat='Y'))
        else:
            db.update('games', g['id'], {field: off if g.get(field) == on else on})
        return json_ok('设置成功')
    return fn


route('/GameAjax/TopGameByGameID')(_toggle('isDefulat'))
route('/GameAjax/SetGameIsMoblieGame')(_toggle('isMoblieGame'))
route('/GameAjax/PWGameByGameID')(_toggle('isPw'))
route('/GameAjax/ChangeGameSendSmsSwitch')(_toggle('isDisbleSendSms', 1, 0))


@route('/GameAjax/ReshrefGameServerCache')
def refresh_cache():
    return json_ok('刷新成功')


# ---------------- 区服 / 职业 / 阵营 ----------------
@route('/GameAjax/getGameData')
def get_game_data():
    """type: 20 大区(parentId=游戏名/ID) 30 服务器(parentId=大区ID) 40 职业 50 阵营；formSelects 本地数据格式 {name,value,selected}"""
    p = P()
    t = p.int('type')
    parent = p.get('parentId')
    sel = p.get('selectValue')
    if t == 30:
        try:
            pid = int(float(parent))
        except (TypeError, ValueError):
            pid = 0
        rows = db.find('game_data', lambda r: r.get('type') == 30 and r.get('parentId') == pid)
        if not rows and pid:
            area = db.get('game_data', pid)
            rows = db.find('game_data', lambda r: r.get('type') == 30 and r.get('gameName') == (area or {}).get('gameName') and r.get('parentId') in (0, None))
    else:
        g = resolve_game(parent)
        rows = db.find('game_data', lambda r: r.get('type') == t and (g is None or r.get('gameId') == g['id']))
    rows.sort(key=lambda r: (-(r.get('orderBy') or 0), r['id']))
    sels = set(str(x) for x in (sel or '').replace('，', ',').split(',') if x)
    data = [dict(name=r['name'], value=r['id'], selected=(str(r['id']) in sels or r['name'] in sels), disabled=False) for r in rows]
    return jsonify(dict(code=1, msg='', data=data))


@route(['/GameAjax/AddGameData', '/GameAjax/SaveGameData', '/GameAjax/AddEditGameData'])
def add_game_data():
    p = P()
    g = resolve_game(p.get('gameId') or p.get('gameName'))
    if not g:
        return json_err('请先选择游戏')
    name = p.get('name').strip()
    if not name:
        return json_err('名称不能为空')
    r = db.insert('game_data', dict(gameId=g['id'], gameName=g['gameName'], type=p.int('type'), name=name, orderBy=p.int('orderBy'), parentId=p.int('parentId')))
    return json_ok('添加成功', data=r['id'])


@route(['/GameAjax/DelGameData', '/GameAjax/DeleteGameData'])
def del_game_data():
    db.delete('game_data', P().int('id'))
    return json_ok('删除成功')


# ---------------- 订单项目分类 ----------------
@route('/GameAjax/GetAllOrderTypeList')
def order_type_list():
    p = P()
    g = resolve_game(p.get('gameId'))
    rows = db.find('order_types', lambda r: (g is None or g['gameName'] == '全部游戏' or r.get('gameId') == g['id']) and db.like(r, ['TypeName'], p.get('key')))
    rows.sort(key=lambda r: (-(r.get('OrderBy') or 0), r['id']))
    return paged([dict(r, pid=r['id']) for r in rows])


@route(['/GameAjax/GetOrderTypeList', '/OrderAjax/GetOrderTypeList', '/GameAjax/getOrderType'])
def order_type_options():
    g = resolve_game(P().get('gameId') or P().get('gameName'))
    rows = db.find('order_types', lambda r: g is None or r.get('gameId') == g['id'])
    rows.sort(key=lambda r: (-(r.get('OrderBy') or 0), r['id']))
    return json_ok('', data=[dict(id=r['id'], name=r['TypeName'], value=r['id'], TypeName=r['TypeName'], assPlatName=r.get('assPlatName', '')) for r in rows])


@route('/GameAjax/AddModityOrderType')
def add_edit_order_type():
    p = P()
    g = resolve_game(p.get('gameId'))
    if not g:
        return json_err('请选择游戏')
    name = (p.get('projectName') or p.get('TypeName') or p.get('typeName')).strip()
    if not name:
        return json_err('分类名称不能为空')
    d = dict(gameId=g['id'], gameName=g['gameName'], TypeName=name, OrderBy=p.int('orderBy'), assPlatName=p.get('assPlatName'),
             AppendTitleByFront=p.get('before'), AppendTitleByEnd=p.get('after'))
    pid = p.int('pid')
    if pid and db.get('order_types', pid):
        db.update('order_types', pid, d)
        return json_ok('修改成功')
    db.insert('order_types', d)
    return json_ok('新增成功')


@route('/GameAjax/DelOrderType')
def del_order_type():
    p = P()
    db.delete('order_types', p.int('pid') or p.int('id'))
    return json_ok('删除成功')


# ---------------- 常用代练项目 ----------------
@route('/GameAjax/GetProjectList')
def project_list():
    p = P()
    g = resolve_game(p.get('gameId'))
    rows = db.find('projects', lambda r: (g is None or g['gameName'] == '全部游戏' or r.get('gameId') == g['id']) and db.like(r, ['projectName'], p.get('key')))
    rows.sort(key=lambda r: (-(r.get('orderBy') or 0), r['id']))
    return paged([dict(r, pid=r['id']) for r in rows])


@route('/GameAjax/getProject')
def project_options():
    g = resolve_game(P().get('gameId') or P().get('gameName'))
    rows = db.find('projects', lambda r: g is None or r.get('gameId') == g['id'])
    rows.sort(key=lambda r: (-(r.get('orderBy') or 0), r['id']))
    return json_ok('', data=[dict(id=r['id'], name=r['projectName'], value=r['projectName'], price=r.get('price', 0), hours=r.get('hours', 0)) for r in rows])


@route('/GameAjax/AddEditProject')
def add_edit_project():
    p = P()
    g = resolve_game(p.get('gameId'))
    if not g:
        return json_err('请选择游戏')
    name = p.get('projectName').strip()
    if not name:
        return json_err('项目名称不能为空')
    d = dict(gameId=g['id'], gameName=g['gameName'], projectName=name, orderBy=p.int('orderBy'), price=p.float('price'), hours=p.float('hours'), remark=p.get('remark'))
    pid = p.int('pid')
    if pid and db.get('projects', pid):
        db.update('projects', pid, d)
        return json_ok('修改成功')
    db.insert('projects', d)
    return json_ok('新增成功')


@route('/GameAjax/DelProject')
def del_project():
    p = P()
    db.delete('projects', p.int('pid') or p.int('id'))
    return json_ok('删除成功')


# ---------------- 游戏物品 ----------------
@route('/GameAjax/GetGameItemList')
def game_item_list():
    p = P()
    g = resolve_game(p.get('gameId') or p.get('gameName'))
    rows = db.find('game_items', lambda r: (g is None or g['gameName'] == '全部游戏' or r.get('gameName') == g['gameName']) and db.like(r, ['itemName', 'postion', 'gameBoss'], p.get('key') or p.get('itemName')))
    return paged([dict(r, itemId=r['id']) for r in rows])


@route(['/GameAjax/AddEditGameItem', '/GameAjax/SaveGameItem'])
def add_edit_game_item():
    p = P()
    g = resolve_game(p.get('gameId') or p.get('gameName'))
    d = dict(itemName=p.get('itemName').strip(), postion=p.get('postion'), gameGroup=p.get('gameGroup'), gameBoss=p.get('gameBoss'),
             gameName=g['gameName'] if g else p.get('gameName'), gameId=g['id'] if g else 0, remark=p.get('remark'))
    if not d['itemName']:
        return json_err('物品名称不能为空')
    iid = p.int('itemId') or p.int('id')
    if iid and db.get('game_items', iid):
        db.update('game_items', iid, d)
        return json_ok('修改成功')
    db.insert('game_items', d)
    return json_ok('新增成功')


@route('/GameAjax/getGameItemInfoByItemID')
def game_item_info():
    r = db.get('game_items', P().int('itemId') or P().int('id'))
    return json_ok('', data=r) if r else json_err('物品不存在')


@route('/GameAjax/DelGameItem')
def del_game_item():
    db.delete('game_items', P().int('itemId') or P().int('id'))
    return json_ok('删除成功')


# ---------------- 报价计算器：见 api/pricecalc.py ----------------
