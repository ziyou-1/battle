# -*- coding: utf-8 -*-
"""游戏报价器（/Game/pricecalculator、/Game/pricecalculatorsetting、/Game/commonpricesetting）
数据：price_calc 行 = {gameName, project, LeveName1, LeveName2, StartPoint, EndPoint, PAmount, DAmount, Hours, sort, PriceCalculatorSetId(1 段位/2 分数区间)}；
      kv pricebase:<game>:<project> = 套餐/利润/首单/挽留等参数（页面 form "pro" 的字段映射成原站的 BaseSetting JSON）；
      price_lol_jinji = 英雄联盟晋级赛系数行。
段位阶梯（青铜3 1星 …）按各游戏公开的段位体系内置在 LADDERS，王者荣耀首次访问自动生成，其他游戏在“通用报价设置”里点“初始化数据”生成。"""
import json, re
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, log

WZ = '王者荣耀'
# 行里存的是“整段价格”（页面标题为 整段价格 / 整段时间）的游戏；其余游戏（每级 / 每100分）按行取值
WHOLE_TIER_GAMES = {WZ, '英雄联盟手游', '英雄联盟手游2', '英雄联盟', '幻塔', '和平精英', '金铲铲之战', '云顶之弈', '哈利波特', 'APEX英雄', '穿越火线', 'QQ飞车', '跑跑卡丁车手游', '暗区突围', '第五人格'}


def _tiers(names, subs, stars, unit='星'):
    """names: 段位名列表；subs: 每段小段数（4 → 4,3,2,1）；stars: 每小段星数（0 → 单行 '0分'）"""
    out = []
    for n, sub, st in zip(names, subs, stars):
        for i in range(sub, 0, -1):
            out.append(('%s%d' % (n, i), ['%d%s' % (k, unit) for k in range(1, st + 1)] if st else ['0分']))
    return out


def _levels(n, name='等级'):
    return [(name, ['%d级' % i for i in range(1, n + 1)])]


_LOL_PC = _tiers(['黑铁', '青铜', '白银', '黄金', '铂金', '翡翠', '钻石'], [4] * 7, [0] * 7) + [('大师上分', ['0分']), ('宗师上分', ['0分']), ('王者上分', ['0分'])]
_LOL_M = _tiers(['黑铁', '青铜', '白银', '黄金', '铂金', '翡翠', '钻石'], [4] * 7, [3, 3, 3, 4, 4, 5, 5]) + [('大师上星', ['0星']), ('传说上分', ['0分']), ('宗师上分', ['0分']), ('王者上分', ['0分'])]
_TFT = _tiers(['黑铁', '青铜', '白银', '黄金', '铂金', '翡翠', '钻石'], [4] * 7, [0] * 7) + [('大师上分', ['0分'])]
_NARAKA = _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '修罗'], [5] * 6, [0] * 6) + [('人上人上分', ['0分'])]
_HP = _tiers(['青铜', '白银', '黄金', '铂金', '钻石'], [3] * 5, [3, 3, 4, 4, 5]) + [('传奇上分', ['0分'])]
_CF = _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '大师'], [3] * 6, [3] * 6) + [('荣耀枪王上分', ['0分'])]
LADDERS = {
    (WZ, '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '星耀'], [3, 3, 4, 4, 5, 5], [3, 3, 4, 4, 5, 5]) + [('王者', ['%d星' % i for i in range(1, 51)])],
    ('英雄联盟手游', '段位'): _LOL_M, ('英雄联盟手游', '段位-峡谷之巅'): _LOL_M,
    ('英雄联盟手游2', '段位'): _LOL_M, ('英雄联盟手游2', '段位-峡谷之巅'): _LOL_M,
    ('英雄联盟', '段位'): _LOL_PC,
    ('幻塔', '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '将星'], [3] * 6, [3, 3, 4, 4, 5, 5]) + [('元帅上分', ['0分'])],
    ('永劫无间', '段位'): _NARAKA, ('永劫无间', '段位-单排'): _NARAKA,
    ('和平精英', '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '皇冠'], [5] * 6, [0] * 6) + [('王牌上分', ['0分'])],
    ('金铲铲之战', '段位'): _TFT, ('云顶之弈', '段位'): _TFT,
    ('原神', '段位'): _levels(90), ('原神', '段位-冒险等级'): _levels(90),
    ('哈利波特', '段位'): _HP, ('哈利波特', '段位-单排'): _HP,
    ('APEX英雄', '大逃杀段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石'], [4] * 5, [0] * 5) + [('大师上分', ['0分'])],
    ('APEX英雄', '竞技段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石'], [4] * 5, [0] * 5) + [('大师上分', ['0分'])],
    ('新世界', '段位'): _levels(65),
    ('穿越火线', '段位'): _CF, ('穿越火线', '军衔等级段位'): _levels(100),
    ('QQ飞车', '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石', '星耀'], [3] * 6, [3, 3, 4, 4, 5, 5]) + [('车神上分', ['0分'])],
    ('跑跑卡丁车手游', '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石'], [3] * 5, [3, 3, 4, 4, 5]) + [('车王上星', ['0星'])],
    ('暗区突围', '段位'): _tiers(['青铜', '白银', '黄金', '铂金', '钻石'], [3] * 5, [0] * 5) + [('传说上分', ['0分'])],
    ('暗区突围', '段位-等级'): _levels(80), ('暗区突围', '段位-通行证等级'): _levels(100),
    ('暗黑不朽', '段位-普通等级'): _levels(60), ('暗黑不朽', '段位-巅峰等级'): _levels(300),
    ('第五人格', '段位'): _tiers(['一阶', '二阶', '三阶', '四阶', '五阶', '六阶'], [3] * 6, [3, 3, 3, 4, 4, 5]) + [('七阶上星', ['0星'])],
}
LOL_JINJI = ['0胜0负', '1胜0负', '0胜1负', '1胜1负', '2胜0负', '0胜2负', '2胜1负', '1胜2负']


def _num(v, cast=float, default=0):
    try:
        return cast(v)
    except (TypeError, ValueError):
        return default


def _is_dw(project):
    return '段位' in (project or '')


def _row(r):
    return dict(PriceCalculatorId=r['id'], PriceCalculatorSetId=r.get('PriceCalculatorSetId', 1), LeveName1=r.get('LeveName1', ''), LeveName2=r.get('LeveName2', ''),
                StartPoint=r.get('StartPoint', ''), EndPoint=r.get('EndPoint', ''), PAmount=r.get('PAmount', 0), DAmount=r.get('DAmount', 0), Hours=r.get('Hours', 0))


def _rows(game, project):
    rows = db.find('price_calc', lambda r: r.get('gameName') == game and r.get('project') == project)
    rows.sort(key=lambda r: (r.get('sort', 0), r['id']))
    if not rows and game == WZ and _is_dw(project) and (game, project) in LADDERS:
        _init_ladder(game, project)
        return _rows(game, project)
    return rows


def _init_ladder(game, project):
    ladder = LADDERS.get((game, project))
    if not ladder:
        return 0
    n = 0
    for l1, stars in ladder:
        for l2 in stars:
            db.insert('price_calc', dict(gameName=game, project=project, LeveName1=l1, LeveName2=l2, StartPoint='', EndPoint='', PAmount=0, DAmount=0, Hours=0, sort=n, PriceCalculatorSetId=1))
            n += 1
    return n


def _base(game, project):
    return db.setting('pricebase:%s:%s' % (game, project), {})


# ---------------- 阶梯 / 区间数据 ----------------
@route('/GameAjax/GetSystemPriceCalculatorByGame')
def calc_rows():
    p = P()
    rows = _rows(p.get('game') or p.get('gameName') or WZ, p.get('project') or '段位')
    return jsonify(dict(code=1, msg='', count=len(rows), data=[_row(r) for r in rows]))


@route('/GameAjax/GetPriceCalculatorSettingPriceDW')
def calc_dw():
    p = P()
    rows = _rows(p.get('gameName') or WZ, p.get('project') or '段位')
    if not rows:
        return jsonify(dict(code=0, msg='该游戏还没有初始化报价参数', count=0, data=[]))
    return jsonify(dict(code=1, msg='', count=len(rows), data=[_row(r) for r in rows]))


@route('/GameAjax/InitializationGamePriceSettingParas')
def calc_init():
    p = P()
    game, project = p.get('gameName'), p.get('project') or '段位'
    if not game:
        return json_ok('已初始化基础参数')
    if not _is_dw(project):
        return json_err('分数区间项目请直接在列表里“添加一行”设置区间')
    if db.count('price_calc', lambda r: r.get('gameName') == game and r.get('project') == project):
        return json_err('该项目已有段位数据，如需重建请先“删除以下段位参数”')
    n = _init_ladder(game, project)
    if not n:
        return json_err('本地版没有内置「%s - %s」的段位阶梯' % (game, project))
    log('报价器', '初始化 %s %s 段位数据 %d 行' % (game, project, n))
    return json_ok('初始化成功，共 %d 行' % n)


@route('/GameAjax/DelGamePriceDwSetting')
def calc_del_ladder():
    p = P()
    sid, eid = p.int('sid'), p.int('eid')
    a = db.get('price_calc', sid)
    if not a:
        return json_err('记录不存在')
    n = 0
    for r in db.find('price_calc', lambda r: r.get('gameName') == a.get('gameName') and r.get('project') == a.get('project') and sid <= r['id'] <= max(sid, eid)):
        db.delete('price_calc', r['id'])
        n += 1
    return json_ok('已清空 %d 行段位参数' % n)


@route('/GameAjax/ChangePriceCalculatorSettingPriceParam')
def calc_change():
    p = P()
    field = {10: 'PAmount', 20: 'DAmount', 30: 'Hours'}.get(p.int('ctype'))
    if not field:
        return json_err('参数错误')
    v = _num(p.get('value'))
    if v < 0:
        return json_err('请输入正确格式的金额，默认为0')
    n = 0
    for x in p.ids('idx'):
        if db.get('price_calc', x):
            db.update('price_calc', x, {field: v})
            n += 1
    return json_ok('保存成功') if n else json_err('记录不存在')


@route('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS')
def calc_change_dfs():
    p = P()
    field = {10: 'StartPoint', 20: 'EndPoint', 30: 'DAmount', 40: 'Hours'}.get(p.int('ctype'))
    if not field:
        return json_err('参数错误')
    v = p.get('value')
    if field in ('StartPoint', 'EndPoint'):
        if not re.fullmatch(r'-?\d+', str(v or '')):
            return json_err('分数请填写整数')
        v = int(v)
    else:
        v = _num(v)
        if v < 0:
            return json_err('请填写不小于0的数字')
    r = db.get('price_calc', p.int('sid'))
    if r:
        db.update('price_calc', r['id'], {field: v})
        rid = r['id']
    else:
        game, project = p.get('gameName') or WZ, p.get('project') or '分数区间'
        rows = db.find('price_calc', lambda r: r.get('gameName') == game and r.get('project') == project)
        d = dict(gameName=game, project=project, LeveName1='', LeveName2='', StartPoint='', EndPoint='', PAmount=0, DAmount=0, Hours=0, sort=len(rows), PriceCalculatorSetId=2)
        d[field] = v
        rid = db.insert('price_calc', d)['id']
    return jsonify(dict(code=rid, msg='保存成功', data=None))


@route('/GameAjax/DelPriceCalculatorSettingPriceParamByDFS')
def calc_del_dfs():
    r = db.get('price_calc', P().int('sid'))
    if r:
        db.delete('price_calc', r['id'])
    return json_ok('删除成功')


# ---------------- 基础参数（套餐 / 利润 / 首单 / 挽留 / 铭文） ----------------
WZ_MW = [('青铜', 'qt'), ('白银', 'by'), ('黄金', 'hj'), ('铂金', 'bj'), ('钻石', 'zs'), ('星耀', 'xy'), ('王者', 'wz')]


@route('/GameAjax/SavePriceCalculatorSettingPriceParamByDwBase')
def calc_save_base():
    p = P()
    game, project = p.get('gameName') or WZ, p.get('project') or '段位'
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        return json_err('参数格式错误')
    pre = 'dw_' if _is_dw(project) else 'dfs_'
    g = lambda k, d='': f.get(pre + k, d)
    stay = _num(g('stayPar'))
    if stay and (stay >= 10 or stay < 0):
        return json_err('折扣值应小于10，请重新填写')
    if bool(stay) != bool((g('stayPackgeName') or '').strip()):
        return json_err('折扣名称及折扣值请填写完整')
    m = dict(profit_rate=_num(g('profit')), iosPercent=_num(g('iosPercent')), packgeName=g('packgeName') or '', words=g('words') or '', stay_packName=g('stayPackgeName') or '',
             stay_rate=stay, stay_word=g('stayWords') or '', firstOrderValue=_num(g('firstOrderValue')), firstOrderModel=_num(g('firstOrderModel'), int), firstOrderAppendModel=_num(g('firstOrderAppendModel', 1), int, 1),
             firstOrderMark=g('firstOrderMark') or '')
    for i in range(1, 8):
        m['packgeName%d' % i] = (g('packgeName%d' % i) or '').strip()
        m['packge_rate%d' % i] = _num(g('packgePar%d' % i))
        m['packgeMark%d' % i] = g('pkmark%d' % i) or ''
        m['packge_ServiceType%d' % i] = _num(g('ServiceType%d' % i, 10), int, 10)
    if game == WZ and _is_dw(project):
        m['mingwen'] = [dict(ptitle=t, **{'p%d' % k: _num(f.get('%s%d' % (pre_, k))) for k in range(1, 6)}) for t, pre_ in WZ_MW]
    else:
        m['mingwen'] = [dict(ptitle='', **{'p%d' % k: _num(f.get('p%d' % k)) for k in range(1, 6)})]
    db.set_setting('pricebase:%s:%s' % (game, project), m)
    return json_ok('保存成功')


@route('/GameAjax/GetPriceCalculatorSettingPriceParamByBase')
def calc_get_base():
    p = P()
    m = _base(p.get('gameName') or WZ, p.get('project') or '段位')
    return jsonify(dict(code=1, msg='', data=dict(BaseSetting=json.dumps(m, ensure_ascii=False) if m else '')))


def _packages(m):
    return [(m.get('packgeName%d' % i), _num(m.get('packge_rate%d' % i)), m.get('packgeMark%d' % i) or '', _num(m.get('packge_ServiceType%d' % i), int, 10)) for i in range(1, 8) if m.get('packgeName%d' % i)]


@route('/GameAjax/GetPriceSettPackgeName')
def calc_packages():
    p = P()
    m = _base(p.get('gameName') or WZ, p.get('project') or '段位')
    names = [x[0] for x in _packages(m)] or [m.get('packgeName') or '标准套餐']
    return jsonify(dict(code=1, msg='', data=names))


# ---------------- 英雄联盟晋级赛系数 ----------------
@route('/GameAjax/GetLolJinjiDataList')
def lol_list():
    rows = db.all_('price_lol_jinji')
    return jsonify(dict(code=1, msg='', count=len(rows), data=[dict(PriceCalculatorId=r['id'], LeveName1=r.get('LeveName1'), DAmount=r.get('DAmount', ''), PAmount=r.get('PAmount', '')) for r in rows]))


@route('/GameAjax/InitLOL_JinjiData')
def lol_init():
    if db.count('price_lol_jinji'):
        return json_err('已有晋级赛数据')
    for n in LOL_JINJI:
        db.insert('price_lol_jinji', dict(LeveName1=n, DAmount='', PAmount=''))
    return json_ok('初始化成功')


@route('/GameAjax/AddChangeGamePriceLOLJinji')
def lol_save():
    p = P()
    for k in ('dfee', 'pfee'):
        v = p.get(k)
        if v not in (None, '', '-') and not re.fullmatch(r'-?\d+(\.\d+)?', str(v)):
            return json_err('请填写数字')
    r = db.get('price_lol_jinji', p.int('pid'))
    d = dict(LeveName1=p.get('names') or (r or {}).get('LeveName1') or '', DAmount=p.get('dfee') or '', PAmount=p.get('pfee') or '')
    if r:
        db.update('price_lol_jinji', r['id'], d)
    else:
        db.insert('price_lol_jinji', d)
    return json_ok('保存成功')


@route('/GameAjax/DelGamePriceLOLJinji')
def lol_del():
    db.delete('price_lol_jinji', P().int('pid'))
    return json_ok('删除成功')


# ---------------- 计算报价 ----------------
def _group_size(rows):
    cnt = {}
    for r in rows:
        cnt[r['LeveName1']] = cnt.get(r['LeveName1'], 0) + 1
    return cnt


def _unit(r, field, sizes, whole):
    v = _num(r.get(field))
    if whole and r['LeveName1'] not in ('王者', '等级'):
        return v / max(1, sizes.get(r['LeveName1'], 1))
    return v


def _mw_rate(m, l1, mw):
    """铭文区间加成百分比：王者荣耀按段位名取 p{mw}，其他游戏取通用 p{mw}"""
    if not mw or mw not in ('1', '2', '3', '4', '5'):
        return 0
    for it in m.get('mingwen') or []:
        if not it.get('ptitle') or l1.startswith(it['ptitle']):
            return _num(it.get('p' + mw))
    return 0


def _dfs_calc(game, project, field, st, et):
    """分数区间：按每分单价累计 [st, et] 区间"""
    price = hours = 0.0
    for r in _rows(game, project):
        a, b = _num(r.get('StartPoint'), int, 0), _num(r.get('EndPoint'), int, 0)
        if b < a:
            a, b = b, a
        lo, hi = max(st, a - 1), min(et, b)
        if hi > lo:
            price += (hi - lo) * _num(r.get(field))
            hours += (hi - lo) * _num(r.get('Hours'))
    return price, hours


class DictParams:
    """让内部调用（客户端自助报价）能复用下面按 P() 写的计算逻辑"""
    def __init__(self, d):
        self.d = {str(k).lower(): v for k, v in (d or {}).items()}

    def get(self, k, default=''):
        v = self.d.get(k.lower(), default)
        return default if v is None else v

    def int(self, k, default=0):
        try:
            return int(float(self.get(k, default) or default))
        except (TypeError, ValueError):
            return default

    def float(self, k, default=0.0):
        try:
            return float(self.get(k, default) or default)
        except (TypeError, ValueError):
            return default


def compute_quote(d):
    """返回 (items, err)：items 与 GetCalculationPrice 的 data 相同"""
    r = _calc(DictParams(d))
    j = r.get_json()
    return (j.get('data') or [], None) if j.get('code', 0) > 0 else (None, j.get('msg'))


@route('/GameAjax/GetCalculationPrice')
def calc_price():
    return _calc(P())


def _calc(p):
    game, project = p.get('gameName') or WZ, p.get('project') or '段位'
    service = p.int('serviceType') or 10
    m = _base(game, project)
    field = 'PAmount' if service == 20 else 'DAmount'
    st, et = p.int('st'), p.int('et')
    if _is_dw(project):
        rows = _rows(game, project)
        idx = {r['id']: i for i, r in enumerate(rows)}
        if st not in idx or et not in idx:
            return json_err('请选择段位')
        i1, i2 = idx[st], idx[et]
        if i1 > i2:
            i1, i2 = i2, i1
        sizes, whole = _group_size(rows), game in WHOLE_TIER_GAMES
        seg = rows[i1 + 1:i2 + 1]
        price = sum(_unit(r, field, sizes, whole) * (1 + _mw_rate(m, r['LeveName1'], p.get('mw')) / 100.0) for r in seg)
        hours = sum(_unit(r, 'Hours', sizes, whole) for r in seg)
        # 英雄联盟类：起始/结束胜点（0-99）按比例折算
        ssd, esd = _num(p.get('ssd')), _num(p.get('esd'))
        if seg and 0 < ssd < 100:
            price -= _unit(seg[0], field, sizes, whole) * ssd / 100.0
            hours -= _unit(seg[0], 'Hours', sizes, whole) * ssd / 100.0
        if 0 < esd < 100 and i2 + 1 < len(rows):
            price += _unit(rows[i2 + 1], field, sizes, whole) * esd / 100.0
            hours += _unit(rows[i2 + 1], 'Hours', sizes, whole) * esd / 100.0
        # 结束/起始为“XX上分/上星”：分数部分按对应的分数区间项目计价
        fst, fet = p.int('fst'), p.int('fet')
        a, b = rows[i1], rows[i2]
        if fet > 0 and ('上分' in b['LeveName1'] or '上星' in b['LeveName1']):
            dp, dh = _dfs_calc(game, '分数区间-' + b['LeveName1'], field, 0, fet)
            price += dp
            hours += dh
        if fst > 0 and ('上分' in a['LeveName1'] or '上星' in a['LeveName1']):
            dp, dh = _dfs_calc(game, '分数区间-' + a['LeveName1'], field, 0, fst)
            price -= dp
            hours -= dh
        # 项目名写法同原站示例「黄金4-黄金3/1星」：段位/星数，上分类写成 大师上星/20星
        name = lambda r, pts: r['LeveName1'] + (('/%d' % pts + r['LeveName2'][-1]) if pts else ('' if r['LeveName2'] in ('0分', '0星') else '/' + r['LeveName2']))
        proj = '%s-%s' % (name(a, fst), name(b, fet))
    else:
        if et <= st:
            return json_err('目标分不能低于当前分')
        price, hours = _dfs_calc(game, project, field, st, et)
        proj = '%s %d-%d' % (project.replace('分数区间-', '').replace('分数区间', '分数'), st, et)
    price *= 1 + _num(m.get('profit_rate')) / 100.0
    if str(p.get('platfrom')) == '1':
        price *= 1 + _num(m.get('iosPercent')) / 100.0
    price = max(0.0, price)
    hours = max(0.0, hours)
    def r2(v):
        v = round(v + 1e-9, 2)
        return int(v) if v == int(v) else v
    if p.int('priceType') == 10:
        rate = _num(m.get('stay_rate'))
        if not rate:
            return json_err('还没有设置挽留折扣，请先到报价设置里填写')
        return jsonify(dict(code=1, msg='', data=[dict(project=proj, packgeName=m.get('stay_packName') or '', price=r2(price * rate / 10.0), hours=r2(hours), words=m.get('stay_word') or '',
                                                     packgeMark='', firstOrderAppendModel=1, firstOrderMark='', firstOrderPrice=0)]))
    fo_model, fo_val = _num(m.get('firstOrderModel'), int), _num(m.get('firstOrderValue'))
    fo_append = _num(m.get('firstOrderAppendModel'), int, 1)

    def first_price(base):
        return r2(fo_val) if fo_model == 1 else r2(base * (1 + fo_val / 100.0))

    def first_mark(base):
        # 首单内容支持 {price} 变量（原站提示：★黄金4-黄金3/1星★首单特价只需{price}元）；没写变量就把价格接在后面
        if not fo_val:
            return ''
        txt = (m.get('firstOrderMark') or '首单特惠').replace('{project}', proj)
        return txt.replace('{price}', str(first_price(base))) if '{price}' in txt else '%s：%s元' % (txt, first_price(base))
    pk = _packages(m)
    items = []
    if pk:
        for n, rate, mark, stype in pk:
            base = price
            if stype != service:  # 套餐指定了代练/陪练时按该类型价格算
                f2 = 'PAmount' if stype == 20 else 'DAmount'
                if _is_dw(project):
                    base = sum(_unit(r, f2, sizes, whole) * (1 + _mw_rate(m, r['LeveName1'], p.get('mw')) / 100.0) for r in seg) * (1 + _num(m.get('profit_rate')) / 100.0)
                else:
                    base = _dfs_calc(game, project, f2, st, et)[0] * (1 + _num(m.get('profit_rate')) / 100.0)
                if str(p.get('platfrom')) == '1':
                    base *= 1 + _num(m.get('iosPercent')) / 100.0
            v = base * (1 + rate / 100.0)
            items.append(dict(project=proj, packgeName=n, price=r2(v), hours=r2(hours), words=m.get('words') or '', packgeMark=mark, firstOrderAppendModel=fo_append,
                              firstOrderMark=first_mark(v), firstOrderPrice=first_price(v)))
    else:
        items.append(dict(project=proj, packgeName=m.get('packgeName') or '', price=r2(price), hours=r2(hours), words=m.get('words') or '', packgeMark='', firstOrderAppendModel=fo_append,
                          firstOrderMark=first_mark(price), firstOrderPrice=first_price(price)))
    return jsonify(dict(code=1, msg='', data=items))
