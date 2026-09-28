# -*- coding: utf-8 -*-
"""客户端（/app，手机与电脑自适应）接口：/api/client/*
客户 = 后台“会员管理”里的 customers 记录（手机号登录），下单进后台 orders，积分商城/抽奖/满减/会员折扣用的是后台“客户端内容管理”里的配置，
订单状态变化通过 order.apply_status 写入 client_notices 通知客户。"""
import json, random, datetime, re
from flask import jsonify, request, session, g
from werkzeug.security import generate_password_hash, check_password_hash
import db
from . import route, P, json_ok, json_err, now, S, uname
from .order import serialize, new_order_id, add_log, apply_status, _deduct_member, notify_customer, STATUS_COLOR
from .customer import customer_row, level_of
from integrations.wecom import publish_order

SOURCE = '客户端下单'
INTEGRAL_PER_YUAN = 1          # 消费 1 元返 1 积分


def cid():
    return session.get('cid')


def current_customer():
    c = cid()
    if not c:
        return None
    cu = db.get('customers', c)
    if not cu or cu.get('isDisabled') == 'Y':
        return None
    return cu


def need_login():
    return jsonify(dict(code=-1, msg='请先登录', data=None))


def _phone_ok(p):
    return bool(re.fullmatch(r'1\d{10}', p or ''))


def _rand_no():
    # 与后台“会员号长度”设置一致：0 = 随机 6-8 位
    n = {'6': 6, '8': 8}.get(S('MemberNumberLength', '0'), random.choice([6, 7, 8]))
    for _ in range(50):
        no = ''.join(random.choice('0123456789') for _ in range(n))
        if not db.first('customers', lambda r: r.get('customerNo') == no):
            return no
    return str(int(datetime.datetime.now().timestamp()))


def _me(cu):
    r = customer_row(cu)
    unread = db.count('client_notices', lambda n: n.get('customerId') == cu['id'] and n.get('isRead') != 'Y')
    coupons = [c for c in db.find('client_coupons', lambda c: c.get('customerId') == cu['id']) if c.get('status') == '未使用']
    return dict(id=cu['id'], name=cu.get('bossName'), phone=cu.get('phone'), customerNo=cu.get('customerNo'), wxNo=cu.get('wxNo') or '', qq=cu.get('qq') or '', inviteCode=cu.get('inviteCode') or '',
                balance=round(float(cu.get('balance') or 0), 2), integral=int(cu.get('integral') or 0), totalConsAmount=round(float(cu.get('totalConsAmount') or 0), 2),
                levelName=r.get('levelName') or '普通会员', levelColor=r.get('levelColor') or '#1E9FFF', levelGap=r.get('levelGap'), discount=_discount_of(cu), unread=unread,
                coupons=len(coupons), servicePerson=cu.get('servicePerson') or '', createTime=(cu.get('createTime') or '')[:10])


def _discount_of(cu):
    """折扣（0.97 = 9.7折，1 或 0 = 无折扣）：先看会员本身设置的折扣，再看客户端内容管理中按等级名配置的会员折扣（9.5 表示 95 折），最后看等级折扣"""
    d = float(cu.get('buyDiscount') or 0)
    if 0 < d < 1:
        return d
    r = customer_row(cu)
    hy = db.first('mp_hydisc', lambda x: x.get('hyName') == r.get('levelName'))
    if hy and 0 < float(hy.get('decValue') or 0) < 10:
        return round(float(hy['decValue']) / 10.0, 4)
    lv = level_of(cu.get('totalConsAmount'), cu)
    if lv and 0 < float(lv.get('LevelDiscount') or 0) < 1:
        return float(lv['LevelDiscount'])
    return 1.0


# ---------------- 注册 / 登录 ----------------
@route('/api/client/register', public=True)
def register():
    p = P()
    phone, pwd, name = (p.get('phone') or '').strip(), p.get('pwd') or '', (p.get('name') or '').strip()
    if not _phone_ok(phone):
        return json_err('请输入正确的手机号')
    if len(pwd) < 6:
        return json_err('密码至少 6 位')
    if not name:
        name = '用户' + phone[-4:]
    if db.first('customers', lambda r: r.get('phone') == phone or r.get('loginAcc') == phone):
        return json_err('该手机号已注册，请直接登录')
    if db.first('customer_backlist', lambda r: r.get('moblie') == phone):
        return json_err('该手机号无法注册，请联系客服')
    cu = db.insert('customers', dict(customerNo=_rand_no(), bossName=name, levelName='', phone=phone, loginAcc=phone, pwdHash=generate_password_hash(pwd), wxNo='', qq='', buyDiscount=0,
                                     platName=SOURCE, arrearsNote='', balance=0, totalConsAmount=0, historRecharge=0, levelGap='', servicePerson='', createUser='客户端注册', tips='', brithDay='',
                                     integral=0, discountLevelInfluence='Y'))
    session['cid'] = cu['id']
    db.insert('client_notices', dict(customerId=cu['id'], orderId=0, orderNo='', title='欢迎加入%s' % db.system_info().get('company', ''), content='注册成功，下单请先选择游戏和项目，有问题随时联系在线客服。', isRead='N'))
    from .client_ext import on_register
    on_register(cu, (p.get('inviteCode') or '').strip())
    return json_ok('注册成功', data=_me(db.get('customers', cu['id'])))


@route('/api/client/login', public=True)
def login():
    p = P()
    phone, pwd = (p.get('phone') or '').strip(), p.get('pwd') or ''
    cu = db.first('customers', lambda r: r.get('loginAcc') == phone or r.get('phone') == phone)
    if cu and cu.get('isDisabled') == 'Y':
        return json_err('账号已停用，请联系客服')
    if not cu or not cu.get('pwdHash') or not check_password_hash(cu['pwdHash'], pwd):
        return json_err('手机号或密码不正确')
    session['cid'] = cu['id']
    return json_ok('登录成功', data=_me(cu))


@route('/api/client/logout', public=True)
def logout():
    session.pop('cid', None)
    return json_ok('已退出')


@route('/api/client/me', public=True)
def me():
    cu = current_customer()
    if not cu:
        return need_login()
    return json_ok('', data=_me(cu))


@route('/api/client/profile', public=True)
def profile():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    d = {}
    if 'name' in p:
        if not (p.get('name') or '').strip():
            return json_err('昵称不能为空')
        d['bossName'] = p.get('name').strip()[:20]
    for k in ('wxNo', 'qq'):
        if k in p:
            d[k] = (p.get(k) or '').strip()[:30]
    db.update('customers', cu['id'], d)
    return json_ok('已保存', data=_me(db.get('customers', cu['id'])))


@route('/api/client/password', public=True)
def password():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    if not check_password_hash(cu.get('pwdHash') or '', p.get('old') or ''):
        return json_err('原密码不正确')
    if len(p.get('new') or '') < 6:
        return json_err('新密码至少 6 位')
    db.update('customers', cu['id'], dict(pwdHash=generate_password_hash(p.get('new'))))
    return json_ok('密码已修改')


# ---------------- 首页 / 内容 ----------------
def _games():
    gs = [x for x in db.all_('games') if x.get('gameName') != '全部游戏']
    gs.sort(key=lambda x: -float(x.get('orderNum') or 0))
    return gs


def _shop_row(r):
    return dict(id=r['id'], title=r.get('title'), gameName=r.get('gameName'), itemType=r.get('itemType') or '默认', price=r.get('price'), yprice=r.get('yprice'), img=r.get('img') or '',
                sellCount=r.get('sellCount', 0), isNeedGroup=r.get('isNeedGroup', 'N'))


@route('/api/client/home', public=True)
def home():
    sysinfo = db.system_info()
    news = db.find('mp_news', None, 'createTime')
    items = [r for r in db.find('mp_shop_items', lambda r: r.get('status', 20) == 20, 'createTime')]
    items.sort(key=lambda r: -float(r.get('sellCount') or 0))
    bulletin = S('PublicSeachOrderBulletin', '')
    return json_ok('', data=dict(company=sysinfo.get('company', ''), banners=[dict(id=r['id'], title=r.get('title'), img=r.get('coverImg') or '') for r in news if r.get('newsType') == 20][:5],
                                 notices=[dict(id=r['id'], title=r.get('title'), summary=r.get('summary') or '', time=(r.get('createTime') or '')[:10]) for r in news if r.get('newsType') != 20][:5],
                                 games=[dict(id=x['id'], name=x['gameName'], isMobile=x.get('isMoblieGame') == 'Y', projects=db.count('projects', lambda r: r.get('gameId') == x['id'])) for x in _games()],
                                 hot=[_shop_row(r) for r in items[:6]], bulletin=bulletin, loggedIn=bool(current_customer()), activity=_activity(), types=_shop_types(items)))


def _shop_types(items):
    out = []
    for r in items:
        t = r.get('itemType') or '默认'
        if t not in out:
            out.append(t)
    return out


def _activity():
    cs = db.setting('clientSetting', {}) or {}
    if cs.get('activityOn') != 'Y' or not cs.get('activityTitle'):
        return None
    return dict(title=cs.get('activityTitle'), desc=cs.get('activityDesc') or '', end=cs.get('activityEnd') or '', link=cs.get('activityLink') or '')


@route('/api/client/news', public=True)
def news_list():
    rows = db.find('mp_news', lambda r: r.get('newsType') != 20, 'createTime')
    return json_ok('', data=[dict(id=r['id'], title=r.get('title'), summary=r.get('summary') or '', time=(r.get('createTime') or '')[:10]) for r in rows])


@route('/api/client/news/detail', public=True)
def news_detail():
    r = db.get('mp_news', P().get('id'))
    if not r:
        return json_err('文章不存在')
    return json_ok('', data=dict(id=r['id'], title=r.get('title'), content=r.get('content') or '', time=(r.get('createTime') or '')[:16]))


@route('/api/client/faq', public=True)
def faq():
    rows = [q for q in db.all_('search_questions') if q.get('Status') != 'N']
    rows.sort(key=lambda q: -float(q.get('Hot') or 0))
    return json_ok('', data=[dict(id=q['id'], title=q.get('SeachQuestion_Title') or q.get('title') or '', content=q.get('SeachQuestion_Content') or q.get('content') or '') for q in rows])


@route('/api/client/levels', public=True)
def levels():
    lv = sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0))
    return json_ok('', data=[dict(name=l.get('IntervalName'), start=l.get('StartValue'), end=l.get('EndValue'), discount=l.get('LevelDiscount') or 0, note=l.get('LevelNote') or '') for l in lv])


@route('/api/client/games', public=True)
def games():
    return json_ok('', data=[dict(id=x['id'], name=x['gameName'], isMobile=x.get('isMoblieGame') == 'Y', needAcc=x.get('isNotAccPwd') != 'Y',
                                  projects=db.count('projects', lambda r: r.get('gameId') == x['id']), items=db.count('mp_shop_items', lambda r: r.get('gameName') == x['gameName'] and r.get('status', 20) == 20))
                             for x in _games()])


@route('/api/client/game', public=True)
def game_detail():
    gm = db.get('games', P().get('id'))
    if not gm or gm.get('gameName') == '全部游戏':
        return json_err('游戏不存在')
    gd = db.find('game_data', lambda r: r.get('gameId') == gm['id'])
    gd.sort(key=lambda r: -float(r.get('orderBy') or 0))
    areas = [dict(id=r['id'], name=r['name'], servers=[x['name'] for x in gd if x.get('type') == 30 and x.get('parentId') == r['id']]) for r in gd if r.get('type') == 20]
    projects = db.find('projects', lambda r: r.get('gameId') == gm['id'])
    projects.sort(key=lambda r: -float(r.get('orderBy') or 0))
    items = [r for r in db.find('mp_shop_items', lambda r: r.get('gameName') == gm['gameName'] and r.get('status', 20) == 20, 'createTime')]
    return json_ok('', data=dict(id=gm['id'], name=gm['gameName'], needAcc=gm.get('isNotAccPwd') != 'Y', isMobile=gm.get('isMoblieGame') == 'Y', areas=areas,
                                 jobs=[r['name'] for r in gd if r.get('type') == 40], groups=[r['name'] for r in gd if r.get('type') == 50],
                                 projects=[dict(id=r['id'], name=r.get('projectName'), price=r.get('price') or 0, hours=r.get('hours') or 0, remark=r.get('remark') or '') for r in projects],
                                 items=[_shop_row(r) for r in items]))


@route('/api/client/shop', public=True)
def shop():
    p = P()
    rows = [r for r in db.find('mp_shop_items', lambda r: r.get('status', 20) == 20, 'createTime')]
    if p.get('game'):
        rows = [r for r in rows if r.get('gameName') == p.get('game')]
    if p.get('type'):
        rows = [r for r in rows if (r.get('itemType') or '默认') == p.get('type')]
    kw = (p.get('key') or '').strip()
    if kw:
        rows = [r for r in rows if kw in (r.get('title') or '')]
    types = []
    for r in rows:
        t = r.get('itemType') or '默认'
        if t not in types:
            types.append(t)
    return json_ok('', data=dict(items=[_shop_row(r) for r in rows], types=types))


@route('/api/client/shop/detail', public=True)
def shop_detail():
    r = db.get('mp_shop_items', P().get('id'))
    if not r or r.get('status', 20) != 20:
        return json_err('商品不存在或已下架')
    gm = db.first('games', lambda x: x.get('gameName') == r.get('gameName'))
    d = _shop_row(r)
    d.update(details=r.get('details') or '', gameId=gm['id'] if gm else 0, needAcc=(gm.get('isNotAccPwd') != 'Y') if gm else True)
    return json_ok('', data=d)


# ---------------- 下单 ----------------
def _fulldec(shop_id, amount):
    """商品满减：优先商品专属，其次通用（shopItemId 0）"""
    best = 0.0
    for r in db.all_('mp_fulldec'):
        sid = int(r.get('shopItemId') or 0)
        if sid not in (0, int(shop_id or 0)):
            continue
        if amount >= float(r.get('fullValue') or 0) > 0:
            best = max(best, float(r.get('decValue') or 0))
    return best


def _coupon(cu, coupon_id, amount):
    if not coupon_id:
        return None
    c = db.get('client_coupons', coupon_id)
    if not c or c.get('customerId') != cu['id'] or c.get('status') != '未使用':
        return None
    if amount < float(c.get('availableAmount') or 0):
        return None
    return c


def _quote(cu, f):
    """f: Params；返回 (dict 明细, err)。价格只认服务器数据：常用项目价 / 套餐商品价 / 报价器算价，客户端传的价格一律不采信"""
    gm = db.get('games', f.get('gameId'))
    item_id = f.get('shopItemId')
    item = db.get('mp_shop_items', item_id) if item_id else None
    if item_id and not item:
        return None, '商品不存在或已下架'
    if item and item.get('status', 20) != 20:
        return None, '商品不存在或已下架'
    hours = 0
    if item:
        item_gm = db.first('games', lambda x: x.get('gameName') == item.get('gameName'))
        if gm and item_gm and gm.get('id') != item_gm.get('id'):
            return None, '商品与游戏不匹配'
        gm = gm or item_gm
        project = item.get('title')
        base = float(item.get('price') or 0)
    elif f.get('calc'):
        # 自助报价器：按客户选的段位区间 + 套餐在服务器重新算一遍
        try:
            cp_ = json.loads(f.get('calc'))
        except ValueError:
            return None, '报价参数错误'
        from .pricecalc import compute_quote
        items, err = compute_quote(cp_)
        if err:
            return None, err
        pkg = (cp_.get('packgeName') or '').strip()
        hit = [x for x in items if x.get('packgeName') == pkg] or items
        if not hit:
            return None, '没有可用的报价'
        hit = hit[0]
        gm = gm or db.first('games', lambda x: x.get('gameName') == cp_.get('gameName'))
        project = '%s %s%s' % (cp_.get('gameName') or '', hit.get('project') or '', ('（%s）' % hit['packgeName']) if hit.get('packgeName') else '')
        base = float(hit.get('price') or 0)
        hours = float(hit.get('hours') or 0)
    else:
        if not gm:
            return None, '请选择游戏'
        pr_id = f.get('projectId')
        pr = db.get('projects', pr_id) if pr_id else None
        if pr_id and not pr:
            return None, '项目不存在或已下架'
        if pr and int(pr.get('gameId') or 0) != int(gm.get('id') or 0):
            return None, '项目与游戏不匹配'
        name = (f.get('project') or '').strip()
        if not pr and name:   # 再来一单 / 按名称复购：按游戏 + 项目名找回常用项目
            pr = db.first('projects', lambda r: r.get('gameId') == gm['id'] and r.get('projectName') == name)
        project = (pr.get('projectName') if pr else name).strip()
        if not project:
            return None, '请选择或填写代练项目'
        base = float(pr.get('price') or 0) if pr else 0
        hours = float(pr.get('hours') or 0) if pr else 0
    if base <= 0:
        return None, '该项目需要客服报价，请先联系在线客服'
    disc = _discount_of(cu) if cu else 1.0
    after_disc = round(base * disc, 2)
    dec = _fulldec(item['id'] if item else 0, after_disc)
    cp = _coupon(cu, f.get('couponId'), after_disc - dec) if cu else None
    cp_val = float(cp.get('faceValue') or 0) if cp else 0
    final = max(0.0, round(after_disc - dec - cp_val, 2))
    return dict(gameId=gm['id'] if gm else 0, gameName=gm['gameName'] if gm else ((item or {}).get('gameName') or project.split(' ')[0]), project=project, shopItemId=item['id'] if item else 0, base=base, discount=disc,
                discountText=('%g折' % round(disc * 10, 2)) if disc < 1 else '无折扣', afterDiscount=after_disc, fullDec=dec, coupon=cp_val, couponId=cp['id'] if cp else 0, final=final, hours=hours), None


@route('/api/client/order/quote', public=True)
def order_quote():
    cu = current_customer()
    q, err = _quote(cu, P())
    if err:
        return json_err(err)
    q['balance'] = round(float(cu.get('balance') or 0), 2) if cu else 0
    q['allowDebt'] = S('AllowDebt', 'Y') == 'Y'
    return json_ok('', data=q)


@route('/api/client/order/create', public=True)
def order_create():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    q, err = _quote(cu, p)
    if err:
        return json_err(err)
    gm = db.get('games', q['gameId'])
    need_acc = gm.get('isNotAccPwd') != 'Y' if gm else True
    acc, pwd, role = (p.get('gameAcc') or '').strip(), (p.get('gamePwd') or '').strip(), (p.get('roleName') or '').strip()
    if need_acc and (not acc or not pwd):
        return json_err('请填写游戏账号和密码，打手需要上号')
    if not role:
        return json_err('请填写角色名')
    mob = (p.get('moblie') or cu.get('phone') or '').strip()
    if db.first('customer_backlist', lambda r: r.get('moblie') == mob or (cu.get('qq') and r.get('qq') == cu.get('qq'))):
        return json_err('暂时无法下单，请联系客服')
    pay = p.get('payMethod') or 'balance'
    if pay not in ('balance', 'offline'):
        return json_err('支付方式不正确')
    if pay == 'balance':
        if float(cu.get('balance') or 0) < q['final'] and S('AllowDebt', 'Y') != 'Y':
            return json_err('余额不足，请先充值或选择联系客服付款')
    hours = q['hours'] or float(S('DefulatDLHours', '1') or 1)
    kefu = cu.get('servicePerson') or ''
    kf = db.first('users', lambda u: u.get('userName') == kefu and u.get('sta') != 'N') if kefu else None
    d = dict(gameId=q['gameId'], gameName=q['gameName'], gameArea=(p.get('gameArea') or '').strip(), gameServer=(p.get('gameServer') or '').strip(), gameJob=(p.get('gameJob') or '').strip(),
             gameGroup=(p.get('gameGroup') or '').strip(), roleName=role, project=q['project'], projectTypeName='', orderContent=(p.get('remark') or '').strip(), gameInfo='',
             price=q['final'], originPrice=q['base'], netReceipts=str(q['final']), serviceAmount=0, payMethod=1 if pay == 'balance' else 0, orderSoure=SOURCE, WangWang=cu.get('wxNo') or '',
             qq=(p.get('qq') or cu.get('qq') or '').strip(), moblie=mob, gameAcc=acc, gamePwd=pwd, zgameAcc='', loginKey='', orderIdView='', orderRemark='客户端自助下单' + ('（余额支付）' if pay == 'balance' else '（待线下付款）'),
             customizeTag='', days=0, hours=hours, isJiaJi='Y' if p.get('urgent') in ('1', 'Y', 'true') else 'N', bussType=1, customerId=cu['id'], throwPrice=0, throwFee=0, safeAmount=0,
             effAmount=0, keywords='', isDis='N', orderId=new_order_id(), orderSta=S('DefSta', '未分配') or '未分配', recMan=0, recManName='', recFee=0, kefu=kf['userName'] if kf else '',
             kefuId=kf['id'] if kf else 0, assUserName='', inputOrderManName='客户端', addOrderUserName=cu.get('bossName'), addOrderUserId=0, isLock='N', isDel='N', isSettStatus='未结算',
             refundFee=0, discount=q['discount'], labels=[], imgs=[], startTime='', completeTime=None, recOrderTime=None, jiwei='', shopItemId=q['shopItemId'], payStatus='未付款')
    d['orderIdView'] = 'C' + datetime.datetime.now().strftime('%y%m%d%H%M%S') + '%02d' % (db.count('orders') % 100)
    o = db.insert('orders', d)
    add_log(o, '客户【%s】通过客户端自助下单，原价 %s，%s%s，实付 %s 元' % (cu.get('bossName'), q['base'], q['discountText'], ('，满减 %s' % q['fullDec']) if q['fullDec'] else '', q['final']), '录单', user=cu.get('bossName'))
    if q['couponId']:
        db.update('client_coupons', q['couponId'], dict(status='已使用', useTime=now(), orderNo=d['orderIdView']))
    if pay == 'balance':
        _deduct_member(o, db.get('customers', cu['id']), q['final'], when='下单')
        db.update('orders', o['id'], dict(payStatus='已付款'))
        gain = int(q['final'] * INTEGRAL_PER_YUAN)
        if gain > 0:
            c2 = db.get('customers', cu['id'])
            db.update('customers', cu['id'], dict(integral=int(c2.get('integral') or 0) + gain))
            db.insert('client_integral_logs', dict(customerId=cu['id'], change=gain, reason='下单消费返积分（订单 %s）' % d['orderIdView']))
    c2 = db.get('customers', cu['id'])
    customer_patch = dict(lastOrderTime=now())
    if pay == 'balance':
        customer_patch['totalConsAmount'] = round(float(c2.get('totalConsAmount') or 0) + q['final'], 2)
    db.update('customers', cu['id'], customer_patch)
    if item := (db.get('mp_shop_items', q['shopItemId']) if q['shopItemId'] else None):
        db.update('mp_shop_items', item['id'], dict(sellCount=int(item.get('sellCount') or 0) + 1))
    # 通知客服
    targets = [kf] if kf else [u for u in db.all_('users') if u.get('jobName') in ('客服', '系统管理员') and u.get('sta') != 'N']
    for u in targets:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='客户端新订单', content='客户【%s】下单：%s / %s，实付 %s 元%s，请及时安排。' % (cu.get('bossName'), q['gameName'], q['project'], q['final'], '' if pay == 'balance' else '（待线下付款）'),
                                   sendUserName='客户端', isRead='N', orderId=d['orderIdView']))
    notify_customer(o, '下单成功', '订单 %s 已提交，客服会尽快为您安排打手。' % d['orderIdView'])
    from .client_ext import on_order_created
    on_order_created(db.get('customers', cu['id']), o, paid=(pay == 'balance'), save_role=p.get('saveRole') in ('1', 'Y', 'true'), role_id=p.int('roleId'))
    publish_order(o, 'created')
    return json_ok('下单成功', data=dict(orderNo=d['orderIdView'], oid=o['id'], price=q['final'], balance=round(float(db.get('customers', cu['id']).get('balance') or 0), 2)))


CUSTOMER_LOG_TYPES = ('录单', '状态', '客户', '会员', '退款', '回复', '评价', '售后')


def _order_row(o):
    d = serialize(o)
    prog = {'未分配': 10, '待上号': 30, '代练中': 60, '待验收': 90, '已完成': 100}.get(d['orderSta'], 50)
    return dict(oid=o['id'], orderNo=d.get('orderIdView'), gameName=d.get('gameName'), project=d.get('project'), roleName=d.get('roleName'), gameArea=d.get('gameArea'), gameServer=d.get('gameServer'),
                price=d.get('price'), originPrice=d.get('originPrice'), orderSta=d['orderSta'], staColor=STATUS_COLOR.get(d['orderSta'], '#999'), progress=prog, payStatus=o.get('payStatus') or ('已付款' if o.get('memberDeducted') == 'Y' else ('未付款' if o.get('orderSoure') == SOURCE else '')),
                createTime=(d.get('createTime') or '')[:16], startTime=(d.get('startTime') or '')[:16], completeTime=(d.get('completeTime') or '')[:16], expectEndTime=(d.get('expectEndTime') or '')[:16],
                hoursDesc=d.get('hoursDesc'), isJiaJi=d.get('isJiaJi'), remark=d.get('orderContent') or '', imgs=o.get('imgs') or [], canConfirm=d['orderSta'] == '待验收',
                canCancel=d['orderSta'] in ('未分配', '待上号'), canMessage=d['orderSta'] not in ('已退单', '已撤销'),
                unread=db.count('client_notices', lambda n: n.get('customerId') == o.get('customerId') and n.get('orderId') == o['id'] and n.get('isRead') != 'Y' and '回复' in (n.get('title') or '')),
                reviewed=bool(db.first('order_reviews', lambda r: r.get('orderId') == o['id'])), canReview=d['orderSta'] == '已完成' and not db.first('order_reviews', lambda r: r.get('orderId') == o['id']),
                canAftersale=d['orderSta'] in ('代练中', '待验收', '已完成', '已暂停', '问题单', '异常中') and not db.first('aftersales', lambda a: a.get('orderId') == o['id'] and a.get('status') in ('待处理', '处理中')),
                shopItemId=o.get('shopItemId') or 0, gameId=o.get('gameId') or 0)


@route('/api/client/orders', public=True)
def orders():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    rows = [o for o in db.all_('orders') if o.get('customerId') == cu['id'] and o.get('isDel') != 'Y']
    st = p.get('status')
    if st == 'active':
        rows = [o for o in rows if o.get('orderSta') not in ('已完成', '已退单', '已撤销')]
    elif st == 'done':
        rows = [o for o in rows if o.get('orderSta') in ('已完成', '已退单', '已撤销')]
    rows.sort(key=lambda o: o.get('createTime') or '', reverse=True)
    page, limit = p.int('page', 1), p.int('limit', 20)
    return json_ok('', data=dict(total=len(rows), rows=[_order_row(o) for o in db.paginate(rows, page, limit)]))


def _own_order(cu):
    o = db.get('orders', P().get('oid'))
    if not o or o.get('customerId') != cu['id'] or o.get('isDel') == 'Y':
        return None
    return o


@route('/api/client/order/detail', public=True)
def order_detail():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    logs = [dict(time=(l.get('createTime') or '')[:16], content=l['content'], mine=l.get('logType') == '客户')
            for l in db.find('order_logs', lambda l: l.get('orderId') == o['id'], 'createTime') if l.get('logType') in CUSTOMER_LOG_TYPES]
    d = _order_row(o)
    rv = db.first('order_reviews', lambda r: r.get('orderId') == o['id'])
    d.update(logs=logs, gameAcc=o.get('gameAcc') or '', gameJob=o.get('gameJob') or '', gameGroup=o.get('gameGroup') or '', kefu=o.get('kefu') or '', discount=o.get('discount'),
             review=dict(stars=rv.get('stars'), content=rv.get('content'), reply=rv.get('reply') or '', time=(rv.get('createTime') or '')[:16]) if rv else None,
             aftersales=[dict(id=a['id'], type=a.get('type'), reason=a.get('reason'), amount=a.get('amount'), status=a.get('status'), result=a.get('result') or '', refundAmount=a.get('refundAmount') or 0,
                              time=(a.get('createTime') or '')[:16]) for a in db.find('aftersales', lambda a: a.get('orderId') == o['id'], 'createTime')],
             recManName=o.get('recManName') or '')
    return json_ok('', data=d)


@route('/api/client/order/message', public=True)
def order_message():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    txt = (P().get('content') or '').strip()
    if not txt:
        return json_err('请输入留言内容')
    add_log(o, '客户留言：' + txt[:200], '客户', user=cu.get('bossName'))
    targets = [u for u in db.all_('users') if u.get('userName') == o.get('kefu')] or [u for u in db.all_('users') if u.get('jobName') in ('客服', '系统管理员') and u.get('sta') != 'N']
    for u in targets:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='客户留言（订单 %s）' % o.get('orderIdView'), content='【%s】：%s' % (cu.get('bossName'), txt[:200]), sendUserName='客户端', isRead='N', orderId=o.get('orderIdView')))
    return json_ok('留言已发送给客服')


@route('/api/client/order/confirm', public=True)
def order_confirm():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    if o.get('orderSta') != '待验收':
        return json_err('当前状态不能验收')
    apply_status(o, '已完成', '客户确认验收', user=cu.get('bossName'))
    return json_ok('已确认完成，感谢您的支持')


@route('/api/client/order/cancel', public=True)
def order_cancel():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    if o.get('orderSta') not in ('未分配', '待上号'):
        return json_err('订单已开始，如需取消请联系客服')
    reason = (P().get('reason') or '').strip()
    if o.get('memberDeducted') == 'Y':
        amt = float(o.get('price') or 0)
        c2 = db.get('customers', cu['id'])
        bal = round(float(c2.get('balance') or 0) + amt, 2)
        db.update('customers', cu['id'], dict(balance=bal, totalConsAmount=max(0.0, round(float(c2.get('totalConsAmount') or 0) - amt, 2))))
        db.insert('customer_fees', dict(customerId=cu['id'], customerNo=cu.get('customerNo'), bossName=cu.get('bossName'), usageType='退款', amount=amt, giftAmount=0, balance=bal,
                                        orderNo=o.get('orderIdView'), payMode='余额', remark='客户端撤单退回余额', actionUserName='客户端'))
        gain = int(amt * INTEGRAL_PER_YUAN)
        if gain:
            db.update('customers', cu['id'], dict(integral=max(0, int(c2.get('integral') or 0) - gain)))
            db.insert('client_integral_logs', dict(customerId=cu['id'], change=-gain, reason='撤单扣回积分（订单 %s）' % o.get('orderIdView')))
        db.update('orders', o['id'], dict(refundFee=amt, memberDeducted='N', payStatus='已退款'))
        add_log(o, '撤单退款 %.2f 元回会员余额' % amt, '退款', user=cu.get('bossName'))
    if o.get('recMan'):
        db.update('orders', o['id'], dict(recMan=0, recManName='', recFee=0, assignees=[]))
    apply_status(db.get('orders', o['id']), '已撤销', '客户端撤单' + ('：' + reason if reason else ''), user=cu.get('bossName'))
    for u in [x for x in db.all_('users') if x.get('userName') == o.get('kefu')]:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='客户撤单（订单 %s）' % o.get('orderIdView'), content='客户【%s】撤销了订单 %s%s' % (cu.get('bossName'), o.get('orderIdView'), ('，原因：' + reason) if reason else ''), sendUserName='客户端', isRead='N', orderId=o.get('orderIdView')))
    return json_ok('订单已撤销')


# ---------------- 通知 / 余额明细 / 优惠券 ----------------
@route('/api/client/notices', public=True)
def notices():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('client_notices', lambda n: n.get('customerId') == cu['id'], 'createTime')
    data = [dict(id=n['id'], title=n.get('title'), content=n.get('content'), time=(n.get('createTime') or '')[:16], isRead=n.get('isRead'), orderId=n.get('orderId') or 0) for n in rows[:100]]
    for n in rows:
        if n.get('isRead') != 'Y':
            db.update('client_notices', n['id'], dict(isRead='Y'))
    return json_ok('', data=data)


@route('/api/client/fees', public=True)
def fees():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('customer_fees', lambda r: r.get('customerId') == cu['id'], 'createTime')
    return json_ok('', data=[dict(type=r.get('usageType'), amount=r.get('amount'), gift=r.get('giftAmount') or 0, balance=r.get('balance'), orderNo=r.get('orderNo') or '', remark=r.get('remark') or '',
                                  time=(r.get('createTime') or '')[:16]) for r in rows[:200]])


@route('/api/client/coupons', public=True)
def coupons():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('client_coupons', lambda c: c.get('customerId') == cu['id'], 'createTime')
    return json_ok('', data=[dict(id=c['id'], name=c.get('name'), faceValue=c.get('faceValue'), availableAmount=c.get('availableAmount') or 0, status=c.get('status'), time=(c.get('createTime') or '')[:10],
                                  source=c.get('source') or '') for c in rows])


# ---------------- 积分商城 / 兑换 ----------------
def _integral_log(cu_id, change, reason):
    db.insert('client_integral_logs', dict(customerId=cu_id, change=change, reason=reason))


@route('/api/client/points', public=True)
def points():
    cu = current_customer()
    items = [r for r in db.find('mp_integral', lambda r: r.get('status', 20) == 20, 'createTime')]
    data = dict(integral=int((cu or {}).get('integral') or 0), unit=(db.setting('award', {}) or {}).get('awardunit') or '积分', rule='下单消费每 1 元返 %d 积分，积分可兑换商品或参与抽奖' % INTEGRAL_PER_YUAN,
                items=[dict(id=r['id'], name=r.get('cname'), ctype=r.get('ctype'), ctypeName={10: '实体商品', 20: '抵扣券', 30: '虚拟商品'}.get(r.get('ctype'), '商品'), stock=r.get('depositoryNumber') or 0,
                            need=r.get('needIntegral') or 0, faceValue=r.get('faceValue') or 0, available=r.get('availableAmount') or 0, img=r.get('coverImage') or '', desc=r.get('commodityMask') or '',
                            exchanged=r.get('exchangeCount') or 0) for r in items])
    if cu:
        data['logs'] = [dict(change=l.get('change'), reason=l.get('reason'), time=(l.get('createTime') or '')[:16]) for l in db.find('client_integral_logs', lambda l: l.get('customerId') == cu['id'], 'createTime')[:50]]
        data['exchanges'] = [dict(id=e['id'], name=e.get('cname'), ctype=e.get('ctype'), need=e.get('needIntegral'), status={10: '待发货', 20: '已发货'}.get(e.get('shipStatus'), '处理中'), shipNo=e.get('shipNo') or '',
                                  shipNo2=e.get('shipNo2') or '', time=(e.get('createTime') or '')[:16], remark=e.get('remark') or '') for e in db.find('mp_exchange', lambda e: e.get('customerId') == cu['id'], 'createTime')]
    return json_ok('', data=data)


@route('/api/client/points/exchange', public=True)
def points_exchange():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    it = db.get('mp_integral', p.get('id'))
    if not it or it.get('status', 20) != 20:
        return json_err('商品不存在或已下架')
    need = int(it.get('needIntegral') or 0)
    have = int(cu.get('integral') or 0)
    if have < need:
        return json_err('积分不足，还差 %d 积分' % (need - have))
    if int(it.get('depositoryNumber') or 0) <= 0:
        return json_err('该商品已兑完')
    ctype = int(it.get('ctype') or 10)
    addr, name, phone = (p.get('address') or '').strip(), (p.get('recName') or cu.get('bossName') or '').strip(), (p.get('phone') or cu.get('phone') or '').strip()
    if ctype == 10 and (not addr or not name or not phone):
        return json_err('实体商品请填写收货人、电话和地址')
    if ctype == 30 and not addr:
        addr = cu.get('wxNo') or cu.get('qq') or phone
    db.update('customers', cu['id'], dict(integral=have - need))
    _integral_log(cu['id'], -need, '兑换「%s」' % it.get('cname'))
    db.update('mp_integral', it['id'], dict(depositoryNumber=int(it.get('depositoryNumber') or 0) - 1, exchangeCount=int(it.get('exchangeCount') or 0) + 1))
    ship = 20 if ctype == 20 else 10
    ex = db.insert('mp_exchange', dict(customerId=cu['id'], cid=it['id'], cname=it.get('cname'), ctype=ctype, needIntegral=need, faceValue=it.get('faceValue') or 0, address=addr, recName=name, phone=phone,
                                       shipStatus=ship, shipNo='', shipNo2='', remark='', shipTime=now()[:16] if ship == 20 else ''))
    if ctype == 20:   # 抵扣券：直接发到客户账户，下单时可用
        db.insert('client_coupons', dict(customerId=cu['id'], name=it.get('cname'), faceValue=float(it.get('faceValue') or 0), availableAmount=float(it.get('availableAmount') or 0), status='未使用',
                                         source='积分兑换', exchangeId=ex['id']))
        return json_ok('兑换成功，抵扣券已放入你的账户', data=dict(integral=have - need))
    return json_ok('兑换成功，%s' % ('请等待客服发货' if ctype == 10 else '客服会尽快把卡密发给你'), data=dict(integral=have - need))


# ---------------- 抽奖 ----------------
def _award_settings():
    a = db.setting('award', {}) or {}
    return dict(on=str(a.get('awardStatus') or '0') == '10', cost=int(float(a.get('awardamount') or 0)), perDay=int(float(a.get('awardcount') or 1)), way='balance' if str(a.get('awardWay')) == '1' else 'integral',
                unit=a.get('awardunit') or '积分')


def _award_row(r):
    return dict(id=r['id'], title=r.get('title'), atype=r.get('atype', 0), typeName={0: '奖品', 10: '优惠券', 15: '积分', 18: '余额', 20: '未中奖'}.get(r.get('atype', 0), '奖品'), prob=r.get('range') or 0,
                img=r.get('prizeimg') or '', value=r.get('prizeValue') or 0, unit=r.get('awardunit') or '', stock=r.get('stockNumber') or 0)


@route('/api/client/lottery', public=True)
def lottery():
    cu = current_customer()
    st = _award_settings()
    data = dict(settings=st, awards=[_award_row(r) for r in db.all_('mp_awards')])
    if cu:
        today = now()[:10]
        mine = db.find('mp_award_grants', lambda r: r.get('customerId') == cu['id'], 'createTime')
        data['todayCount'] = len([r for r in mine if (r.get('createTime') or '')[:10] == today])
        data['mine'] = [dict(id=r['id'], title=r.get('AwardTitle'), atype=r.get('AwardType'), status='已发放' if int(r.get('GrantStatus') or 0) == 10 else '待发放', time=(r.get('createTime') or '')[:16], remark=r.get('Remark') or '') for r in mine[:30]]
        data['integral'] = int(cu.get('integral') or 0)
        data['balance'] = round(float(cu.get('balance') or 0), 2)
    return json_ok('', data=data)


@route('/api/client/lottery/draw', public=True)
def lottery_draw():
    cu = current_customer()
    if not cu:
        return need_login()
    st = _award_settings()
    if not st['on']:
        return json_err('抽奖活动暂未开启')
    awards = [r for r in db.all_('mp_awards') if float(r.get('range') or 0) > 0]
    if not awards:
        return json_err('暂无奖品')
    today = now()[:10]
    used = db.count('mp_award_grants', lambda r: r.get('customerId') == cu['id'] and (r.get('createTime') or '')[:10] == today)
    if used >= st['perDay']:
        return json_err('今天的 %d 次抽奖机会已用完，明天再来' % st['perDay'])
    cost = st['cost']
    if st['way'] == 'integral':
        if int(cu.get('integral') or 0) < cost:
            return json_err('%s不足，抽一次需要 %d %s' % (st['unit'], cost, st['unit']))
        db.update('customers', cu['id'], dict(integral=int(cu.get('integral') or 0) - cost))
        if cost:
            _integral_log(cu['id'], -cost, '参与抽奖')
    else:
        if float(cu.get('balance') or 0) < cost:
            return json_err('余额不足，抽一次需要 %d 元' % cost)
        bal = round(float(cu.get('balance') or 0) - cost, 2)
        db.update('customers', cu['id'], dict(balance=bal))
        if cost:
            db.insert('customer_fees', dict(customerId=cu['id'], customerNo=cu.get('customerNo'), bossName=cu.get('bossName'), usageType='消费', amount=-cost, giftAmount=0, balance=bal, orderNo='', payMode='余额',
                                            remark='参与抽奖', actionUserName='客户端'))
    # 按概率抽：各奖品概率之和不足 100% 的部分视为未中奖
    x = random.uniform(0, 100)
    acc = 0.0
    hit = None
    for r in awards:
        acc += float(r.get('range') or 0)
        if x < acc:
            hit = r
            break
    if hit and int(hit.get('atype') or 0) != 20 and int(hit.get('stockNumber') or 0) <= 0:
        hit = None
    atype = int(hit.get('atype') or 0) if hit else 20
    title = hit.get('title') if hit else '谢谢参与'
    grant = 10 if atype in (10, 15, 18, 20) else 0
    remark = ''
    cu2 = db.get('customers', cu['id'])
    if hit and atype != 20:
        db.update('mp_awards', hit['id'], dict(stockNumber=int(hit.get('stockNumber') or 0) - 1))
    if atype == 15:
        v = int(float(hit.get('prizeValue') or 0))
        db.update('customers', cu['id'], dict(integral=int(cu2.get('integral') or 0) + v))
        _integral_log(cu['id'], v, '抽奖获得「%s」' % title)
        remark = '已到账 %d %s' % (v, st['unit'])
    elif atype == 18:
        v = float(hit.get('prizeValue') or 0)
        bal = round(float(cu2.get('balance') or 0) + v, 2)
        db.update('customers', cu['id'], dict(balance=bal))
        db.insert('customer_fees', dict(customerId=cu['id'], customerNo=cu.get('customerNo'), bossName=cu.get('bossName'), usageType='充值', amount=v, giftAmount=0, balance=bal, orderNo='', payMode='抽奖',
                                        remark='抽奖获得「%s」' % title, actionUserName='客户端'))
        remark = '已到账 %g 元余额' % v
    elif atype == 10:
        it = db.get('mp_integral', hit.get('cid')) if hit.get('cid') else None
        db.insert('client_coupons', dict(customerId=cu['id'], name=(it or {}).get('cname') or title, faceValue=float((it or {}).get('faceValue') or hit.get('prizeValue') or 0),
                                         availableAmount=float((it or {}).get('availableAmount') or 0), status='未使用', source='抽奖'))
        remark = '优惠券已放入账户'
    elif atype == 0:
        remark = '请等待客服发放'
    db.insert('mp_award_grants', dict(customerId=cu['id'], LotteryAwardId=hit['id'] if hit else 0, AwardTitle=title, AwardType=atype, UseIntegral=cost, SurplusIntegral=int(db.get('customers', cu['id']).get('integral') or 0),
                                      Moblie=cu.get('phone'), GrantStatus=grant, GrantTimeStr=now()[:16] if grant == 10 else '', Remark=remark))
    c3 = db.get('customers', cu['id'])
    return json_ok('中奖啦：' + title if atype != 20 else '很遗憾，没有中奖', data=dict(hit=atype != 20, title=title, atype=atype, remark=remark, integral=int(c3.get('integral') or 0), balance=round(float(c3.get('balance') or 0), 2),
                                                                                left=st['perDay'] - used - 1))


# ---------------- 在线客服（留言到后台消息） ----------------
@route('/api/client/contact', public=True)
def contact():
    cu = current_customer()
    if not cu:
        return need_login()
    txt = (P().get('content') or '').strip()
    if not txt:
        return json_err('请输入内容')
    kefu = cu.get('servicePerson')
    targets = [u for u in db.all_('users') if u.get('userName') == kefu and u.get('sta') != 'N'] or [u for u in db.all_('users') if u.get('jobName') in ('客服', '系统管理员') and u.get('sta') != 'N']
    for u in targets:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='客户咨询（%s）' % cu.get('bossName'), content='【%s %s】：%s' % (cu.get('bossName'), cu.get('phone'), txt[:300]), sendUserName='客户端', isRead='N', orderId=''))
    db.insert('client_notices', dict(customerId=cu['id'], orderId=0, orderNo='', title='已收到您的咨询', content='客服会尽快回复，回复会显示在这里。您的留言：' + txt[:100], isRead='Y'))
    return json_ok('已发送给客服')
