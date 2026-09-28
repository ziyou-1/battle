# -*- coding: utf-8 -*-
"""游戏号库：新增/导入/管理内部账号、售卖预览、指定给我的账号"""
import json, datetime
from flask import jsonify, request, g
from markupsafe import escape
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .game import resolve_game
from .order import dec

USE_TYPES = [('A', '内部账号'), ('E', '售卖账号'), ('Z', '出租账号'), ('C', '借用账号'), ('D', '临时账号'), ('B', '客户账号')]
ACC_STATUS = {10: '正常', 20: '库存', 50: '出租中', 21: '已卖出', 55: '密码错误', 60: '临时停用', 30: '已借出'}


def can_view_account(a, u=None):
    from .system import user_permissions
    u = current_user() if u is None else u
    if not a or not u:
        return False
    return bool(u.get('isSuper') or 'gameaccounts/accountlist' in user_permissions(u)
                or a.get('recUserId') == u.get('id'))


def guard_account_request(path):
    from .system import user_permissions
    p = P()
    managed_actions = {
        '/gameaccountsajax/addeditgameaccount', '/gameaccountsajax/delgameaccountbyidx',
        '/gameaccountsajax/changegameaccountprice', '/gameaccountsajax/changegameaccountusestatus',
        '/gameaccountsajax/changegameaccountusetype', '/gameaccountsajax/sellaccaction',
        '/gameaccountsajax/zhipaigameaccount', '/gameaccountsajax/cleanrecgameaccount',
        '/gameaccountsajax/importgameaccount', '/gameaccountsajax/importacc',
    }
    if path in managed_actions and 'gameaccounts/accountlist' not in user_permissions():
        return json_err('无权管理游戏账号'), 403
    if path in ('/gameaccountsajax/getsellacclistbypreview', '/gameaccountsajax/getsellacctipslist') and 'gameaccounts/sellaccpreview' not in user_permissions():
        return json_err('无权查看待售游戏账号'), 403
    identifiers = [p.get(k) for k in ('gameAccId', 'gid', 'accId', 'idx') if p.get(k)]
    if getattr(g, 'path_arg', None):
        identifiers.append(g.path_arg)
    if path == '/gameaccountsajax/addeditgameaccount' and p.get('param'):
        try:
            identifiers.append(json.loads(p.get('param')).get('gameAccId'))
        except (ValueError, TypeError):
            pass
    for identifier in identifiers:
        a = find_acc(identifier)
        if a and not can_view_account(a):
            return json_err('无权访问该游戏账号'), 403
    return None


def _may_view_password(a):
    u = current_user() or {}
    if u.get('prohibitedViewOrderPwd') == 'Y':
        return False
    return bool(is_super() or u.get('jobName') in ('老板', '客服') or a.get('recUserId') == u.get('id'))


def _may_view_private():
    u = current_user() or {}
    return bool(is_super() or u.get('jobName') in ('老板', '客服'))


def acc_row(a):
    d = dict(a)
    d['gameAccId'] = a['id']
    d['idx'] = a['id']
    d['accStatusStr'] = ACC_STATUS.get(a.get('accStatus'), str(a.get('accStatus')))
    d['accType'] = a.get('accUseType')
    d['accUseTypeStr'] = dict(USE_TYPES).get(a.get('accUseType'), a.get('accUseType'))
    d['profit'] = round(float(a.get('sellPrice') or 0) - float(a.get('costPrice') or 0), 2)
    if not _may_view_password(a):
        d['gamePwd'] = '******' if d.get('gamePwd') else ''
    if not _may_view_private():
        for field in ('privateInfo', 'useInfo', 'safePhone', 'safeEmail', 'secondPwd', 'idInfo', 'privateRemark'):
            d.pop(field, None)
    return d


def find_acc(val):
    try:
        return db.get('game_accounts', int(float(val)))
    except (TypeError, ValueError):
        return None


def _filter(rows, p):
    g_ = p.get('gameName') or p.get('gameId')
    if g_ and g_ not in ('', '0', '全部游戏'):
        gm = resolve_game(g_)
        if (gm['gameName'] if gm else g_) != '全部游戏':
            rows = [a for a in rows if a.get('gameName') == (gm['gameName'] if gm else g_)]
    at = p.get('accType') or p.get('useType')
    if at:
        rows = [a for a in rows if a.get('accUseType') == at]
    st = p.get('accStatus')
    if st and st != '0':
        rows = [a for a in rows if str(a.get('accStatus')) == str(st)]
    ps = p.get('proStatus')
    if ps and ps != '0':
        rows = [a for a in rows if str(a.get('proStatus')) == str(ps)]
    for f in ('gameArea', 'gameServer', 'gameGroup'):
        v = dec(p.get(f))
        if v:
            rows = [a for a in rows if a.get(f) == v]
    ru = dec(p.get('recUser'))
    if ru:
        rows = [a for a in rows if a.get('recUserName') == ru or str(a.get('recUserId')) == ru]
    kw = dec(p.get('key') or p.get('key1'))
    if kw:
        rows = [a for a in rows if db.like(a, ['gameRoleName', 'gameAcc', 'gameInfo', 'remark', 'Tips', 'jiwei', 'sellTradeNo'], kw)]
    tp = dec(p.get('tipsSelect'))
    if tp:
        rows = [a for a in rows if a.get('Tips') == tp]
    st_, et_ = dec(p.get('stime') or p.get('sDate')), dec(p.get('etime') or p.get('eDate'))
    tf = 'sellTime' if p.get('timeType') == '10' else 'createTime'
    if st_:
        rows = [a for a in rows if (a.get(tf) or '')[:10] >= st_[:10]]
    if et_:
        rows = [a for a in rows if (a.get(tf) or '')[:10] <= et_[:10]]
    rows.sort(key=lambda a: a.get('createTime') or '', reverse=True)
    return rows


@route('/GameAccountsAjax/GetGameAccList')
def acc_list():
    from .system import user_permissions
    if 'gameaccounts/accountlist' not in user_permissions():
        return json_err('无权查看游戏号库'), 403
    p = P()
    rows = _filter(db.all_('game_accounts'), p)
    u = current_user()
    out = []
    for a in rows:
        d = acc_row(a)
        out.append(d)
    return paged(out, totalCostPrice=round(sum(float(a.get('costPrice') or 0) for a in rows), 2), totalSellPrice=round(sum(float(a.get('sellPrice') or 0) for a in rows), 2))


@route('/GameAccountsAjax/GetMyGameAccList')
def my_acc_list():
    p = P()
    u = current_user()
    rows = _filter([a for a in db.all_('game_accounts') if a.get('recUserId') == u['id'] or a.get('recUserName') == u['userName']], p)
    return paged([acc_row(a) for a in rows])


@route('/GameAccountsAjax/GetAllGameAccountUseTypeSelect')
def use_type_select():
    return json_ok('', data=[dict(name=n, value=v) for v, n in USE_TYPES])


@route('/GameAccountsAjax/GetAccTipsList')
def acc_tips():
    tips = sorted(set(a.get('Tips') for a in db.all_('game_accounts') if a.get('Tips')))
    return json_ok('', data=[dict(name=t, value=t) for t in tips])


@route('/GameAccountsAjax/AddEditGameAccount')
def add_edit_acc():
    p = P()
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        f = {}
    gm = resolve_game(p.get('gameName') or f.get('gameName'))
    if not gm:
        return json_err('请选择游戏')
    acc = (f.get('gameAcc') or '').strip()
    if not acc:
        return json_err('游戏账号不能为空')
    d = dict(gameName=gm['gameName'], gameId=gm['id'], gameArea=p.get('gameArea') or f.get('tGameArea') or '', gameServer=p.get('gameServer') or f.get('tGameServer') or '',
             gameJob=p.get('gameJob') or f.get('tGameJob') or '', gameGroup=p.get('gameGroup') or f.get('tGameGroup') or '', gameRoleName=f.get('gameRole') or '',
             gameInfo=f.get('gameSQ') or '', gameTF=f.get('gaemTf') or '', gameAcc=acc, gamePwd=f.get('gamePwd') or '', zgameAcc=f.get('gameZAcc') or '', moblie=f.get('moblie') or '',
             costPrice=float(f.get('costPrice') or 0), sellPrice=float(f.get('sellPrice') or 0), accStatus=int(f.get('accStatus') or 10), accUseType=p.get('useType') or f.get('useType') or f.get('accType') or 'A',
             accUseTypeTxt=f.get('accUseTypeTxt') or '', Tips=f.get('tips') or '', remark=f.get('remark') or '', description=f.get('description') or '', keywords=f.get('keywords') or '',
             privateInfo=f.get('privateInfo') or '', useInfo=f.get('useInfo') or '', safeKeyType=f.get('safeKeyType') or '', cd=f.get('cd') or '', tempDisableTime=f.get('disableTime') or '',
             otherLevel='', otherMark='')
    aid = f.get('gameAccId') or p.get('gameAccId')
    try:
        aid = int(aid or 0)
    except ValueError:
        aid = 0
    if aid:
        a = db.get('game_accounts', aid)
        if not a:
            return json_err('账号不存在')
        db.update('game_accounts', aid, d)
        db.insert('acc_logs', dict(accId=aid, content='修改了账号资料', userName=uname()))
        return json_ok('修改成功')
    d.update(sellTradeNo='', profit=0, recUserName='', recUserId=0, img='', jiwei='', proStatus=10)
    a = db.insert('game_accounts', d)
    db.insert('acc_logs', dict(accId=a['id'], content='录入账号', userName=uname()))
    log('号库', '新增游戏号【%s】' % acc)
    return json_ok('新增成功', data=a['id'])


@route('/GameAccountsAjax/DisAddGameAccountContent')
def dis_acc_content():
    import re
    content = P().get('value') or ''
    out = {}
    for key, names in (('gameAcc', ['账号', '帐号']), ('gamePwd', ['密码']), ('gameRole', ['角色', '角色名']), ('gameArea', ['区服', '大区']), ('moblie', ['手机', '电话'])):
        for n in names:
            m = re.search(re.escape(n) + r'\s*[:：]\s*([^\s，,；;]+)', content)
            if m:
                out[key] = m.group(1); break
    return json_ok('识别完成', data=out)


@route('/GameAccountsAjax/DelGameAccountByIDX')
def del_acc():
    p = P()
    for x in p.ids('gameAccId') or [p.int('gameAccId')]:
        if x:
            db.delete('game_accounts', x)
    return json_ok('删除成功')


def _acc_update(fn_name, apply):
    def fn():
        p = P()
        a = find_acc(p.get('idx') or p.get('gameAccId'))
        if not a:
            return json_err('账号不存在')
        patch = apply(p, a)
        db.update('game_accounts', a['id'], patch)
        db.insert('acc_logs', dict(accId=a['id'], content=fn_name + '：' + ', '.join('%s=%s' % kv for kv in patch.items()), userName=uname()))
        return json_ok('操作成功')
    return fn


route('/GameAccountsAjax/ChangeAccRemark')(_acc_update('修改备注', lambda p, a: dict(remark=p.get('remark'))))
route('/GameAccountsAjax/ChangeGameAccountJiWei')(_acc_update('修改机位', lambda p, a: dict(jiwei=p.get('remark'))))
route('/GameAccountsAjax/ChangeGameAccountPrice')(_acc_update('修改价格', lambda p, a: dict(costPrice=p.float('fee')) if p.get('changeType') in ('cost', '1', '10') else dict(sellPrice=p.float('fee'))))
route('/GameAccountsAjax/ChangeGameAccountProStatus')(_acc_update('修改进度', lambda p, a: dict(proStatus=p.int('status'), remark=p.get('remark') or a.get('remark'))))
route('/GameAccountsAjax/ChangeGameAccountUseStatus')(_acc_update('修改状态', lambda p, a: dict(accStatus=p.int('status'), tempDisableTime=p.get('ftime') or '')))
route('/GameAccountsAjax/ChangeGameAccountUseType')(_acc_update('修改类型', lambda p, a: dict(accUseType=p.get('useType'))))


@route('/GameAccountsAjax/SellAccGetInfo')
def sell_acc_info():
    a = find_acc(P().get('gid'))
    if not a:
        return json_err('账号不存在')
    return json_ok('', data=acc_row(a))


@route('/GameAccountsAjax/SellAccAction')
def sell_acc():
    p = P()
    a = find_acc(p.get('gid'))
    if not a:
        return json_err('账号不存在')
    choose = p.get('sellChoee')
    sta = 50 if choose in ('rent', '2', '20') else 21
    db.update('game_accounts', a['id'], dict(accStatus=sta, sellPrice=p.float('sellPrice') or a.get('sellPrice'), sellTradeNo=p.get('tradeNo'), sellTime=now(),
                                             changeBindPhone=p.get('changeBindPhone')))
    db.insert('acc_logs', dict(accId=a['id'], content='%s，价格 %s，交易号 %s' % ('出租' if sta == 50 else '卖出', p.get('sellPrice'), p.get('tradeNo')), userName=uname()))
    log('号库', '游戏号【%s】%s' % (a.get('gameAcc'), '出租' if sta == 50 else '卖出'))
    return json_ok('操作成功')


@route('/GameAccountsAjax/GetSellAccListByPreview')
def sell_preview():
    p = P()
    rows = [a for a in db.all_('game_accounts') if a.get('accUseType') in ('E', 'Z') and a.get('accStatus') in (10, 20)]
    g_ = p.get('gameName')
    if g_ and g_ not in ('', '全部游戏'):
        rows = [a for a in rows if a.get('gameName') == g_]
    sv = dec(p.get('server'))
    if sv:
        rows = [a for a in rows if a.get('gameServer') == sv or a.get('gameArea') == sv]
    ot = p.get('orderType')
    if ot in ('1', 'price'):
        rows.sort(key=lambda a: float(a.get('sellPrice') or 0))
    out = [dict(accId=a['id'], price=a.get('sellPrice'), gameArea=a.get('gameArea'), gameServer=a.get('gameServer'), roleName=a.get('gameRoleName'), info1=a.get('gameInfo'),
                info2=a.get('otherLevel') or a.get('gameJob'), tips=a.get('Tips'), img=a.get('img'), gameName=a.get('gameName')) for a in rows]
    return jsonify(dict(code=0, msg='', count=len(out), data=out))


@route('/GameAccountsAjax/GetSellAccTipsList')
def sell_tips():
    tips = sorted(set(a.get('Tips') for a in db.all_('game_accounts') if a.get('Tips') and a.get('accUseType') in ('E', 'Z')))
    return json_ok('', data=[dict(name=t, value=t) for t in tips])


def _acc_arg(p):
    return p.get('idx') or p.get('gameAccId') or p.get('accId') or getattr(g, 'path_arg', None)


@route('/GameAccountsAjax/GetGameAccountUseInfoByDetail')
def acc_use_info():
    """详情页“提取使用资料”：返回账号/密码 HTML（data.msg），并写账号日志（原站同样会留痕）"""
    a = find_acc(_acc_arg(P()))
    if not a:
        return json_err('账号不存在')
    if not _may_view_password(a):
        return json_err('没有权限查看使用资料')
    html = '<span style="color:#E03636">使用资料：</span>账号 <b>%s</b>　密码 <b>%s</b>%s' % (escape(a.get('gameAcc') or ''), escape(a.get('gamePwd') or ''), ('　登录方式 ' + str(escape(a['loginType']))) if a.get('loginType') else '')
    db.insert('acc_logs', dict(accId=a['id'], content='提取了使用资料（账号密码）', userName=uname()))
    return jsonify(dict(code=1, msg=html, data=None))


@route('/GameAccountsAjax/GetGameAccountPrivateInfoByDetail')
def acc_private_info():
    a = find_acc(_acc_arg(P()))
    if not a:
        return json_err('账号不存在')
    if not _may_view_private():
        return json_err('没有权限查看机密资料')
    items = [(k, a.get(f)) for k, f in (('密保手机', 'safePhone'), ('密保邮箱', 'safeEmail'), ('二级密码', 'secondPwd'), ('身份信息', 'idInfo'), ('机密备注', 'privateRemark')) if a.get(f)]
    html = '<span style="color:#E03636">机密资料：</span>' + ('　'.join('%s <b>%s</b>' % (escape(k), escape(v)) for k, v in items) if items else '该账号没有登记机密资料')
    db.insert('acc_logs', dict(accId=a['id'], content='提取了机密资料', userName=uname()))
    return jsonify(dict(code=1, msg=html, data=None))


@route('/GameAccountsAjax/GetGameAccountLog')
def acc_log():
    aid = _acc_arg(P())
    rows = db.find('acc_logs', lambda r: str(r.get('accId')) == str(aid), 'createTime')
    return jsonify(dict(code=1, msg='', count=len(rows), data=[dict(createTime=(r.get('createTime') or '')[:16], userName=r.get('userName') or '', content=r.get('content') or '') for r in rows]))


@route('/GameAccountsAjax/AddGameAccountLogRemark')
def acc_log_remark():
    p = P()
    a = find_acc(_acc_arg(p))
    if not a:
        return json_err('账号不存在')
    txt = (p.get('remark') or p.get('content') or '').strip()
    if not txt:
        return json_err('备注内容不能为空！')
    db.insert('acc_logs', dict(accId=a['id'], content='(说)' + txt, userName=uname()))
    return json_ok('已添加')


@route('/GameAccountsAjax/ZhiPaiGameAccount')
def zhipai_acc():
    p = P()
    a = find_acc(_acc_arg(p))
    if not a:
        return json_err('账号不存在')
    try:
        lst = json.loads(p.get('strParameter') or '[]')
    except ValueError:
        lst = []
    ru = db.get('users', (lst[0].get('userId') if lst else None) or p.get('userId') or p.get('uid'))
    if not ru:
        return json_err('请选择打手')
    db.update('game_accounts', a['id'], dict(recUserName=ru['userName'], recUserId=ru['id'], proStatus=20))
    db.insert('acc_logs', dict(accId=a['id'], content='指定给打手【%s】' % ru['userName'], userName=uname()))
    return json_ok('指派成功')


@route('/GameAccountsAjax/CleanRecGameAccount')
def clean_rec_acc():
    a = find_acc(_acc_arg(P()))
    if not a:
        return json_err('账号不存在')
    db.update('game_accounts', a['id'], dict(recUserName='', recUserId=0, proStatus=10))
    return json_ok('已清除接手人')


@route(['/GameAccountsAjax/ImportGameAccount', '/GameAccountsAjax/ImportAcc'])
def import_acc():
    p = P()
    gm = resolve_game(p.get('gameName') or p.get('gameId'))
    if not gm:
        return json_err('请选择游戏')
    content = p.get('content') or p.get('value') or ''
    n = 0
    for line in content.splitlines():
        parts = [x.strip() for x in line.replace('----', '|').replace('\t', '|').replace('，', ',').replace(',', '|').split('|') if x.strip()]
        if len(parts) < 2:
            continue
        db.insert('game_accounts', dict(gameName=gm['gameName'], gameId=gm['id'], gameAcc=parts[0], gamePwd=parts[1], gameRoleName=parts[2] if len(parts) > 2 else '',
                                        gameArea=parts[3] if len(parts) > 3 else '', gameServer='', gameJob='', gameGroup='', gameInfo='', gameTF='', costPrice=0, sellPrice=0,
                                        accStatus=10, accUseType=p.get('useType') or 'A', Tips='', remark='导入', sellTradeNo='', profit=0, recUserName='', recUserId=0, img='', jiwei='', proStatus=10,
                                        otherLevel='', otherMark='', zgameAcc='', moblie='', tempDisableTime=''))
        n += 1
    return json_ok('成功导入 %d 个账号' % n)
