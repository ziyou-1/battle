# -*- coding: utf-8 -*-
"""客户维护：会员管理、余额明细、会员等级、分析报表、黑名单"""
import json, datetime, collections, random, secrets, string
from flask import jsonify, request
from werkzeug.security import generate_password_hash
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now, S
from .order import dec


def level_of(total, cust=None):
    mode = S('LevelCalculationMethod', '1')
    if mode == '0':
        return None
    if mode == '2' and cust is not None:
        total = cust.get('historRecharge')
    lv = None
    for l in sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0)):
        if float(total or 0) >= float(l.get('StartValue') or 0):
            lv = l
    return lv


def customer_row(c):
    d = dict(c)
    lv = level_of(c.get('totalConsAmount'), c)
    d['levelName'] = lv['IntervalName'] if lv else (c.get('levelName') or '')
    d['levelColor'] = (lv.get('ExtensionStr') or '#1E9FFF') if lv else ''
    d['discount'] = c.get('buyDiscount')
    nxt = None
    for l in sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0)):
        if float(l.get('StartValue') or 0) > float(c.get('totalConsAmount') or 0):
            nxt = l; break
    d['levelGap'] = ('距%s还差%.2f元' % (nxt['IntervalName'], float(nxt['StartValue']) - float(c.get('totalConsAmount') or 0))) if nxt else '已是最高等级'
    d['createPersonUserNicke'] = c.get('createUser', '')
    d['birthday'] = c.get('brithDay', '')
    d['discountLevelInfluence'] = 1 if c.get('discountLevelInfluence') == 'Y' else 0
    return d


# ---------------- 会员列表 ----------------
@route('/api/CustomerApi/GetCustomerList')
def customer_list():
    p = P()
    rows = db.all_('customers')
    kw = dec(p.get('keyword') or p.get('key'))
    if kw:
        rows = [c for c in rows if db.like(c, ['customerNo', 'bossName', 'phone', 'wxNo', 'platName', 'remark', 'tips'], kw)]
    pa = dec(p.get('phoneOrAcc'))
    if pa:
        rows = [c for c in rows if db.like(c, ['phone', 'loginAcc'], pa)]
    nm = dec(p.get('name'))
    if nm:
        rows = [c for c in rows if db.like(c, ['bossName', 'customerNo'], nm)]
    lv = dec(p.get('level'))
    if lv:
        rows = [c for c in rows if customer_row(c)['levelName'] == lv or str(c.get('levelId')) == lv]
    cu = p.get('createUserId')
    if cu and cu not in ('0', ''):
        u = db.get('users', cu)
        rows = [c for c in rows if str(c.get('createUserId')) == str(cu) or (u and c.get('createUser') == u['userName'])]
    if p.get('seachDebt') in ('Y', 'on', '1', 'true'):
        rows = [c for c in rows if c.get('arrearsNote')]
    mn, mx = p.float('min'), p.float('max')
    if mn:
        rows = [c for c in rows if float(c.get('totalConsAmount') or 0) >= mn]
    if mx:
        rows = [c for c in rows if float(c.get('totalConsAmount') or 0) <= mx]
    st, et = dec(p.get('minDate')), dec(p.get('maxDate'))
    if st:
        rows = [c for c in rows if (c.get('createTime') or '')[:10] >= st[:10]]
    if et:
        rows = [c for c in rows if (c.get('createTime') or '')[:10] <= et[:10]]
    om = p.get('orderMethod')
    if om in ('1', 'balance'):
        rows.sort(key=lambda c: -float(c.get('balance') or 0))
    elif om in ('2', 'total'):
        rows.sort(key=lambda c: -float(c.get('totalConsAmount') or 0))
    else:
        rows.sort(key=lambda c: c.get('createTime') or '', reverse=True)
    return paged([customer_row(c) for c in rows], ext=dict(totalBalance=round(sum(float(c.get('balance') or 0) for c in rows), 2), totalConsumeFee=round(sum(float(c.get('totalConsAmount') or 0) for c in rows), 2)))


@route('/api/customerApi/GetCustomerSelect')
def customer_select():
    kw = dec(P().get('keyword'))
    rows = [c for c in db.all_('customers') if db.like(c, ['customerNo', 'bossName', 'phone', 'wxNo'], kw)][:30]
    return json_ok('', data=[dict(id=c['id'], customerId=c['id'], name='%s(%s)' % (c.get('bossName'), c.get('customerNo')), value=c['id'], bossName=c.get('bossName'),
                                  customerNo=c.get('customerNo'), balance=c.get('balance'), discount=c.get('buyDiscount'), phone=c.get('phone')) for c in rows])


@route('/CustomerAjax/GetMemberBalance')
def member_balance():
    bn = dec(P().get('bossName'))
    c = db.first('customers', lambda r: r.get('bossName') == bn or r.get('customerNo') == bn)
    if not c:
        return json_err('未找到会员')
    return json_ok('', data=dict(balance=c.get('balance'), discount=c.get('buyDiscount'), customerId=c['id'], levelName=customer_row(c)['levelName']))


@route('/api/CustomerApi/CustomerDetail')
def customer_detail():
    from flask import g
    hid = getattr(g, 'path_arg', None) or P().get('hid') or P().get('id')
    c = db.get('customers', hid)
    if not c:
        return json_err('会员不存在')
    d = customer_row(c)
    d.update(id=c['id'], setDiscount=c.get('buyDiscount'),
             servicePersonUserId=c.get('servicePersonUserId'), description=c.get('description', ''), keywords=c.get('keywords', ''))
    return json_ok('', data=d)


@route('/api/CustomerApi/randBuilderNo')
def rand_no():
    while True:
        no = 'C%05d' % random.randint(10000, 99999)
        if not db.first('customers', lambda r: r.get('customerNo') == no):
            return json_ok(no, data=no)


@route('/api/CustomerApi/CreateModifyCustomer')
def create_modify_customer():
    p = P()
    f = p.all()
    if request.is_json:
        f.update({k.lower(): v for k, v in (request.get_json(silent=True) or {}).items()})
    name = (f.get('bossname') or '').strip()
    if not name:
        if S('RequiredMemberName', '1') == '1':
            return json_err('老板名称不能为空')
        name = '会员' + str(random.randint(1000, 9999))
    sp = db.get('users', f.get('servicepersonuserid'))
    d = dict(customerNo=(f.get('customerno') or '').strip(), bossName=name, phone=f.get('phone') or '', wxNo=f.get('wxno') or '', platName=f.get('platname') or '',
             buyDiscount=float(f.get('buydiscount') or f.get('setdiscount') or 0), brithDay=f.get('brithday') or '', remark=f.get('remark') or '', tips=f.get('tips') or '',
             description=f.get('description') or '', keywords=f.get('keywords') or '', servicePerson=sp['userName'] if sp else (f.get('serviceperson') or ''),
             servicePersonUserId=sp['id'] if sp else 0, discountLevelInfluence='Y' if f.get('discountlevelinfluence') in ('on', 'Y', '1', 1, True) else 'N')
    hid = f.get('hid') or f.get('id') or 0
    try:
        hid = int(hid)
    except (TypeError, ValueError):
        hid = 0
    pwd = (f.get('clientpwd') or '').strip()
    if pwd:
        if len(pwd) < 6:
            return json_err('客户端密码至少 6 位')
        from werkzeug.security import generate_password_hash
        d['pwdHash'] = generate_password_hash(pwd)
        if d.get('phone'):
            d['loginAcc'] = d['phone']
    if hid:
        c = db.get('customers', hid)
        if c and not d.get('customerNo'):   # 编辑时没传会员号 → 保留原号
            d['customerNo'] = c.get('customerNo') or ''
        if not c:
            return json_err('会员不存在')
        db.update('customers', hid, d)
        log('会员', '修改会员【%s】资料' % name)
        return json_ok('保存成功')
    if not d['customerNo']:
        n = {'6': 6, '8': 8}.get(S('MemberNumberLength', '0'), random.choice([6, 7, 8]))
        d['customerNo'] = ''.join(random.choice('0123456789') for _ in range(n))
    if db.first('customers', lambda r: r.get('customerNo') == d['customerNo']):
        return json_err('会员号已存在')
    init = float(f.get('initamount') or 0)
    gift = float(f.get('giftamount') or 0)
    d.update(balance=init + gift, totalConsAmount=float(f.get('totalconsamount') or 0), historRecharge=float(f.get('historrecharge') or init), createUser=uname(), createUserId=uid(),
             arrearsNote='', loginAcc='', integral=0, levelName=(level_of(f.get('totalconsamount')) or {}).get('IntervalName', ''))
    c = db.insert('customers', d)
    if init or gift:
        db.insert('customer_fees', dict(customerId=c['id'], customerNo=c['customerNo'], bossName=name, usageType='充值', amount=init, giftAmount=gift, balance=c['balance'],
                                        orderNo=f.get('orderno') or '', payMode=f.get('paymode') or '', remark='开户初始充值', actionUserName=uname()))
    log('会员', '新开会员【%s】' % name)
    return json_ok('保存成功', data=c['id'])


@route('/api/CustomerApi/delCustomer')
def del_customer():
    for x in P().ids('keys'):
        c = db.get('customers', x)
        if c:
            db.delete('customers', x)
            log('会员', '删除会员【%s】' % c.get('bossName'))
    return json_ok('删除成功')


@route('/api/CustomerApi/Recharge')
def recharge():
    p = P()
    c = db.get('customers', p.get('Id'))
    if not c:
        return json_err('会员不存在')
    amt, gift = p.float('Amount'), p.float('GiftAmount')
    if amt <= 0 and S('RechargeLimit', 'N') != 'Y':
        return json_err('系统设置不允许实际充值 0 元')
    if amt <= 0 and gift <= 0:
        return json_err('充值金额不正确')
    if S('AllowCustomerOrderNo', '0') == '1' and not (p.get('OrderNo') or '').strip():
        return json_err('系统设置要求充值时必须填写付款单号')
    bal = round(float(c.get('balance') or 0) + amt + gift, 2)
    db.update('customers', c['id'], dict(balance=bal, historRecharge=round(float(c.get('historRecharge') or 0) + amt, 2)))
    db.insert('customer_fees', dict(customerId=c['id'], customerNo=c['customerNo'], bossName=c['bossName'], usageType='充值', amount=amt, giftAmount=gift, balance=bal,
                                    orderNo=p.get('OrderNo'), payMode=p.get('PayMode'), remark=p.get('Remark'), actionUserName=uname(), canRevoke='Y'))
    log('会员', '会员【%s】充值 %s 元（赠送 %s）' % (c['bossName'], amt, gift))
    return json_ok('充值成功')


@route('/api/CustomerApi/DeducBalance')
def deduct_balance():
    p = P()
    f = p.all()
    if request.is_json:
        f.update({k.lower(): v for k, v in (request.get_json(silent=True) or {}).items()})
    c = db.get('customers', f.get('id') or f.get('customerid'))
    if not c:
        return json_err('会员不存在')
    amt = float(f.get('amount') or f.get('actionbalance') or 0)
    bal = round(float(c.get('balance') or 0) - amt, 2)
    db.update('customers', c['id'], dict(balance=bal, totalConsAmount=round(float(c.get('totalConsAmount') or 0) + max(amt, 0), 2)))
    db.insert('customer_fees', dict(customerId=c['id'], customerNo=c['customerNo'], bossName=c['bossName'], usageType='消费' if amt >= 0 else '退还', amount=-amt, giftAmount=0, balance=bal,
                                    orderNo=f.get('corresorderid') or f.get('orderno') or '', payMode='余额', remark=f.get('baremark') or f.get('remark') or '', actionUserName=uname()))
    return json_ok('操作成功')


@route('/api/CustomerApi/SetArrearsNote')
def set_arrears():
    p = P()
    c = db.get('customers', p.get('Id'))
    if not c:
        return json_err('会员不存在')
    db.update('customers', c['id'], dict(arrearsNote=p.get('Note')))
    return json_ok('保存成功')


@route('/api/CustomerApi/ModiftyDiscountInfluenceMode')
def discount_mode():
    c = db.get('customers', P().get('id'))
    if not c:
        return json_err('会员不存在')
    db.update('customers', c['id'], dict(discountLevelInfluence='N' if c.get('discountLevelInfluence') == 'Y' else 'Y'))
    return json_ok('已切换')


@route('/api/CustomerApi/restCustomerLoginPwd')
def reset_customer_pwd():
    c = db.get('customers', P().get('customerId'))
    if not c:
        return json_err('会员不存在')
    # 后台旧版本这里只返回提示，没有真正写入密码，导致历史会员始终无法登录客户端。
    # 支持显式传入新密码；未传时生成一次性临时密码，避免继续使用弱口令 123456。
    pwd = (P().get('newPassword') or P().get('pwd') or '').strip()
    if not pwd:
        alphabet = string.ascii_letters + string.digits
        pwd = ''.join(secrets.choice(alphabet) for _ in range(12))
    if len(pwd) < 6:
        return json_err('客户端密码至少 6 位')
    patch = {'pwdHash': generate_password_hash(pwd)}
    if (c.get('phone') or '').strip():
        patch['loginAcc'] = c['phone'].strip()
    db.update('customers', c['id'], patch)
    log('会员', '重置会员【%s】客户端登录密码' % (c.get('bossName') or c.get('phone') or c['id']))
    return json_ok('密码已重置为：' + pwd, data=dict(customerId=c['id'], loginAcc=patch.get('loginAcc') or c.get('loginAcc') or '', temporaryPassword=pwd))


@route(['/api/customerapi/CalculateRecharge', '/api/customerapi/CalculateConsumer'])
def recalc():
    for x in P().ids('Keys'):
        c = db.get('customers', x)
        if not c:
            continue
        fees = db.find('customer_fees', lambda r: r.get('customerId') == x)
        if 'Recharge' in request.path:
            db.update('customers', x, dict(historRecharge=round(sum(float(r.get('amount') or 0) for r in fees if r.get('usageType') == '充值'), 2)))
        else:
            spent = sum(float(o.get('price') or 0) for o in db.all_('orders') if o.get('customerId') == x and o.get('isDel') != 'Y' and o.get('orderSta') != '已退单')
            db.update('customers', x, dict(totalConsAmount=round(spent, 2)))
    return json_ok('重算完成')


@route('/api/CustomerApi/rechargeRank')
def recharge_rank():
    t = P().get('type')
    rows = db.all_('customers')
    key = 'historRecharge' if str(t) in ('1', 'recharge') else 'totalConsAmount'
    rows.sort(key=lambda c: -float(c.get(key) or 0))
    return table([dict(rankNo=i + 1, customerNo=c['customerNo'], customerName=c['bossName'], total=c.get(key)) for i, c in enumerate(rows[:20])])


@route('/UserAjax/GetAllUserByGroupName')
def all_user_by_group():
    p = P()
    rows = [u for u in db.all_('users') if u.get('sta') != 'N']
    if p.get('groupType') == '20':
        rows = [u for u in rows if u.get('jobName') in ('客服', '系统管理员', '老板', '团长', '财务')]
    elif p.get('groupType') == '10':
        rows = [u for u in rows if u.get('jobName') in ('打手', '团长')]
    sel = p.get('editUserName')
    return jsonify(dict(code=1, msg='', data=[dict(name=u['userName'], value=u['id'], selected=('selected' if (sel and u['userName'] == sel) or (p.get('isSelectCurrentUser') == 'Y' and not sel and u['id'] == uid()) else ''), disabled=False) for u in rows]))


# ---------------- 余额明细 ----------------
@route('/api/CustomerApi/GetCustomerFeeDetailsList')
def fee_details():
    p = P()
    rows = db.all_('customer_fees')
    kw = dec(p.get('keyword') or p.get('key'))
    if kw:
        rows = [r for r in rows if db.like(r, ['customerNo', 'bossName', 'orderNo', 'remark'], kw)]
    ut = dec(p.get('usageType'))
    if ut:
        rows = [r for r in rows if r.get('usageType') == ut]
    cid = p.get('customerId')
    if cid:
        rows = [r for r in rows if str(r.get('customerId')) == str(cid)]
    st, et = dec(p.get('minDate') or p.get('stime')), dec(p.get('maxDate') or p.get('etime'))
    if st:
        rows = [r for r in rows if (r.get('createTime') or '')[:10] >= st[:10]]
    if et:
        rows = [r for r in rows if (r.get('createTime') or '')[:10] <= et[:10]]
    rows.sort(key=lambda r: r.get('createTime') or '', reverse=True)
    return paged(rows, ext=dict(TotalRecharge=round(sum(float(r.get('amount') or 0) for r in rows if r.get('usageType') == '充值'), 2),
                                TotalConsumer=round(-sum(float(r.get('amount') or 0) for r in rows if r.get('usageType') == '消费'), 2),
                                TotalGiftAmount=round(sum(float(r.get('giftAmount') or 0) for r in rows), 2)))


@route('/api/CustomerApi/RevocationMemberRecharge')
def revoke_recharge():
    r = db.get('customer_fees', P().get('id'))
    if not r or r.get('usageType') != '充值':
        return json_err('只能撤销充值记录')
    c = db.get('customers', r.get('customerId'))
    if c:
        newbal = round(float(c.get('balance') or 0) - float(r.get('amount') or 0) - float(r.get('giftAmount') or 0), 2)
        if newbal < 0 and S('NegativeBalance', 'Y') != 'Y':
            return json_err('系统设置不允许撤销后余额为负数')
        db.update('customers', c['id'], dict(balance=newbal, historRecharge=round(float(c.get('historRecharge') or 0) - float(r.get('amount') or 0), 2)))
    db.delete('customer_fees', r['id'])
    return json_ok('已撤销')


# ---------------- 会员等级 ----------------
@route('/api/CustomerApi/GetLevelList')
def level_list():
    rows = sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0))
    return table([dict(r, Index=i + 1, Id=r['id']) for i, r in enumerate(rows)])


@route('/api/CustomerApi/GetLevelSelectList')
def level_select():
    rows = sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0))
    return json_ok('', data=[dict(id=r['id'], name=r['IntervalName'], value=r['IntervalName'], levelName=r['IntervalName']) for r in rows])


@route(['/api/CustomerApi/SaveLevel', '/CustomerAjax/SaveIntervalLevel'])
def save_levels():
    p = P()
    raw = p.get('models') or request.get_data(as_text=True)
    try:
        models = json.loads(raw) if raw else []
    except ValueError:
        models = []
    if isinstance(models, dict):
        models = models.get('models') or [models]
    if not models:
        return json_err('没有要保存的等级')
    for r in db.all_('customer_levels'):
        db.delete('customer_levels', r['id'])
    for i, m in enumerate(models):
        m = {k: v for k, v in m.items()}
        db.insert('customer_levels', dict(Index=i + 1, BusinessTypeId=int(m.get('BusinessTypeId') or 1), StartValue=float(m.get('StartValue') or 0), EndValue=float(m.get('EndValue') or 0),
                                          IntervalName=m.get('IntervalName') or ('等级%d' % (i + 1)), LevelDiscount=float(m.get('LevelDiscount') or 1), LevelNote=m.get('LevelNote') or '',
                                          ExtensionStr=m.get('ExtensionStr') or ''))
    return json_ok('保存成功')


@route('/api/CustomerApi/DelLevel')
def del_level():
    db.delete('customer_levels', P().int('id'))
    return json_ok('删除成功')


@route('/Api/CustomerApi/UpdateCustomerLevel')
def update_customer_levels():
    n = 0
    for c in db.all_('customers'):
        lv = level_of(c.get('totalConsAmount'), c)
        if lv:
            db.update('customers', c['id'], dict(levelName=lv['IntervalName'], buyDiscount=lv.get('LevelDiscount') if c.get('discountLevelInfluence') != 'N' else c.get('buyDiscount')))
            n += 1
    return json_ok('已更新 %d 位会员等级' % n)


# ---------------- 分析报表 ----------------
@route('/CustomerAjax/GetConseReport')
def conse_report():
    rows = db.all_('customers')
    buckets = [('0-500', 0, 500), ('500-2000', 500, 2000), ('2000-5000', 2000, 5000), ('5000-20000', 5000, 20000), ('20000以上', 20000, 1e12)]
    data = [dict(name=n, value=len([c for c in rows if a <= float(c.get('totalConsAmount') or 0) < b])) for n, a, b in buckets]
    return json_ok('', data=data, legend=[d['name'] for d in data])


@route('/CustomerAjax/GetHyRaiseReporyYears')
def raise_report():
    by = collections.defaultdict(int)
    for c in db.all_('customers'):
        by[(c.get('createTime') or '')[:7]] += 1
    months = sorted(k for k in by if k)[-12:]
    return json_ok('', data=dict(months=months, counts=[by[m] for m in months]))


@route('/CustomerAjax/GetSourTypeReport')
def source_report():
    by = collections.defaultdict(int)
    for c in db.all_('customers'):
        by[c.get('platName') or '未知'] += 1
    return json_ok('', data=[dict(name=k, value=v) for k, v in sorted(by.items(), key=lambda x: -x[1])])


# ---------------- 黑名单 ----------------
@route('/CustomerAjax/GetCustomerBackList')
def customer_backlist():
    p = P()
    rows = db.find('customer_backlist', lambda r: db.like(r, ['moblie', 'ww', 'qq', 'remark'], dec(p.get('key'))), 'createTime')
    return paged([dict(r, bid=r['id']) for r in rows])


@route(['/CustomerAjax/AddBack', '/CustomerAjax/AddEditBack', '/CustomerAjax/SaveBack'])
def add_back():
    p = P()
    d = dict(moblie=p.get('moblie'), ww=p.get('ww'), qq=p.get('qq'), remark=p.get('remark'), lastTime=now(), addUserName=uname())
    if not (d['moblie'] or d['ww'] or d['qq']):
        return json_err('手机、旺旺、QQ 至少填一项')
    bid = p.int('bid') or p.int('id')
    if bid and db.get('customer_backlist', bid):
        db.update('customer_backlist', bid, d)
        return json_ok('修改成功')
    ex = db.first('customer_backlist', lambda r: (d['moblie'] and r.get('moblie') == d['moblie']) or (d['ww'] and r.get('ww') == d['ww']))
    if ex:
        db.update('customer_backlist', ex['id'], dict(backCount=int(ex.get('backCount') or 0) + 1, lastTime=now(), remark=d['remark']))
        return json_ok('已存在，已累加拉黑次数')
    db.insert('customer_backlist', dict(d, backCount=1))
    return json_ok('新增成功')


@route('/CustomerAjax/DelBack')
def del_back():
    for x in P().ids('ids'):
        db.delete('customer_backlist', x)
    return json_ok('删除成功')
