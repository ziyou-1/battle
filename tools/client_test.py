# 客户端 /api/client：注册登录 → 浏览 → 报价/下单（余额 & 线下）→ 订单流转/留言/验收/撤单退款 → 积分兑换 → 抽奖 → 通知
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
admin = appmod.app.test_client(); c = appmod.app.test_client()
J = lambda r: r.get_json()
J(admin.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))
PHONE = '13912345678'
for x in db.find('customers', lambda r: r.get('phone') == PHONE): db.delete('customers', x['id'])
db._local.conn.commit()

# 静态壳
assert 'id="app"' in c.get('/app').get_data(as_text=True) and c.get('/app/app.js').status_code == 200 and c.get('/app/lib/vue.global.prod.js').status_code == 200
# 未登录
assert J(c.get('/api/client/me'))['code'] == -1 and J(c.get('/api/client/home'))['code'] > 0
# 注册 / 登录
assert J(c.post('/api/client/register', data=dict(phone='123', pwd='123456')))['code'] == 0
assert J(c.post('/api/client/register', data=dict(phone=PHONE, pwd='123')))['code'] == 0
r = J(c.post('/api/client/register', data=dict(phone=PHONE, pwd='abc123', name='测试客户'))); ok(r); assert r['data']['name'] == '测试客户' and r['data']['balance'] == 0
assert J(c.post('/api/client/register', data=dict(phone=PHONE, pwd='abc123')))['code'] == 0
ok(J(c.post('/api/client/logout'))); assert J(c.get('/api/client/me'))['code'] == -1
assert J(c.post('/api/client/login', data=dict(phone=PHONE, pwd='wrong')))['code'] == 0
ok(J(c.post('/api/client/login', data=dict(phone=PHONE, pwd='abc123'))))
me = J(c.get('/api/client/me'))['data']; assert me['unread'] >= 1 and me['levelName'] == '普通会员' and me['customerNo'], me
cust = db.first('customers', lambda r: r.get('phone') == PHONE)
ok(J(c.post('/api/client/profile', data=dict(name='客户A', wxNo='wx_a')))); assert db.get('customers', cust['id'])['bossName'] == '客户A'
assert J(c.post('/api/client/password', data=dict(old='x', new='123456')))['code'] == 0
ok(J(c.post('/api/client/password', data=dict(old='abc123', new='abc1234')))); ok(J(c.post('/api/client/login', data=dict(phone=PHONE, pwd='abc1234'))))
print('OK 注册登录/资料')

# 浏览
home = J(c.get('/api/client/home'))['data']; assert home['games'] and home['loggedIn'], home.keys()
games = J(c.get('/api/client/games'))['data']; g = [x for x in games if x['projects'] > 0][0]
gd = J(c.get('/api/client/game', data=dict(id=g['id'])))['data']; assert gd['projects'] and gd['areas'], gd.keys()
proj = [p for p in gd['projects'] if p['price'] > 0][0]
assert J(c.get('/api/client/faq'))['code'] > 0 and J(c.get('/api/client/levels'))['data']
print('OK 浏览')

# 报价：无折扣 → 后台设置会员折扣 9 折 → 报价变化
q = J(c.get('/api/client/order/quote', data=dict(gameId=g['id'], projectId=proj['id'])))['data']
assert q['base'] == proj['price'] and q['discount'] == 1 and q['final'] == round(proj['price'] - q['fullDec'], 2), q   # 演示数据有满减规则，末价要减掉
db.update('customers', cust['id'], dict(buyDiscount=0.9)); db._local.conn.commit()
q = J(c.get('/api/client/order/quote', data=dict(gameId=g['id'], projectId=proj['id'])))['data']
assert q['final'] == round(round(proj['price'] * 0.9, 2) - q['fullDec'], 2) and q['discountText'] == '9折', q
# 余额不足且不允许欠款 → 拒绝；改线下付款 → 成功
sysset = dict(db.setting('system', {})); orig_debt = sysset.get('AllowDebt'); sysset['AllowDebt'] = 'N'; db.set_setting('system', sysset); db._local.conn.commit()
form = dict(gameId=g['id'], projectId=proj['id'], gameArea=gd['areas'][0]['name'], roleName='客户角色', gameAcc='acc', gamePwd='pwd', remark='别用皮肤', payMethod='balance')
assert '余额不足' in J(c.post('/api/client/order/create', data=form))['msg']
assert J(c.post('/api/client/order/create', data=dict(form, roleName='')))['code'] == 0
r = J(c.post('/api/client/order/create', data=dict(form, payMethod='offline', urgent='1'))); ok(r)
o1 = db.get('orders', r['data']['oid']); assert o1['customerId'] == cust['id'] and o1['price'] == q['final'] and o1['orderSoure'] == '客户端下单' and o1['isJiaJi'] == 'Y' and o1['payStatus'] == '未付款' and o1['gameArea'] == gd['areas'][0]['name'], o1
assert any(m.get('title') == '客户端新订单' for m in db.all_('messages'))
# 后台充值 100 → 余额支付
ok(J(admin.post('/api/CustomerApi/Recharge', data=dict(Id=cust['id'], Amount=1000, GiftAmount=0, PayMode='微信', Remark='测试充值'))))
r = J(c.post('/api/client/order/create', data=form)); ok(r)
o2 = db.get('orders', r['data']['oid']); c2 = db.get('customers', cust['id'])
assert o2['payStatus'] == '已付款' and o2['memberDeducted'] == 'Y' and round(1000 - q['final'], 2) == round(float(c2['balance']), 2) and int(c2['integral']) == int(q['final']), (o2['payStatus'], c2['balance'], c2['integral'])
print('OK 报价/下单/余额支付/返积分')

# 订单列表、详情、留言、状态流转、验收
lst = J(c.get('/api/client/orders', data=dict(status='active')))['data']; assert lst['total'] == 2 and lst['rows'][0]['canCancel']
d = J(c.get('/api/client/order/detail', data=dict(oid=o2['id'])))['data']; assert d['orderNo'] == o2['orderIdView'] and any('自助下单' in l['content'] for l in d['logs'])
assert J(c.get('/api/client/order/detail', data=dict(oid=db.all_('orders')[0]['id'])))['code'] == 0   # 别人的订单
ok(J(c.post('/api/client/order/message', data=dict(oid=o2['id'], content='请尽快安排'))))
assert any('客户留言' in m.get('title', '') for m in db.all_('messages'))
ok(J(admin.post('/OrderAjax/ReplyOrderCustomerMsg', data=dict(orderId=o2['orderId'], content='已安排'))))   # 客服回复 → 客户端可见 + 通知
assert any('客服回复：已安排' in l['content'] for l in J(c.get('/api/client/order/detail', data=dict(oid=o2['id'])))['data']['logs'])
assert J(c.post('/api/client/order/confirm', data=dict(oid=o2['id'])))['code'] == 0   # 未到待验收
ds = [u for u in db.all_('users') if u['jobName'] == '打手'][0]
ok(J(admin.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=o2['orderId'], strParameter=json.dumps([dict(userId=ds['id'], userName=ds['userName'], fee=10, hours=1, project='p')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0))))
sysset = dict(db.setting('system', {})); orig_sk91 = sysset.get('SK91'); sysset['SK91'] = 'N'; db.set_setting('system', sysset); db._local.conn.commit()
ok(J(admin.post('/OrderAjax/SetOrderSta', data=dict(orderId=o2['orderId'], sta='待验收'))))
notices = J(c.get('/api/client/notices'))['data']; assert any('待验收' in n['title'] for n in notices), notices
d = J(c.get('/api/client/order/detail', data=dict(oid=o2['id'])))['data']; assert d['canConfirm'] and not d['canCancel']
ok(J(c.post('/api/client/order/confirm', data=dict(oid=o2['id']))))
assert db.get('orders', o2['id'])['orderSta'] == '已完成' and db.find('emp_pay', lambda e: e.get('orderId') == o2['id'])
print('OK 订单流转/留言/验收')

# 撤单退款：o1 线下未付 → 撤销无退款；再下一单余额付后撤销 → 退款回余额、积分扣回
ok(J(c.post('/api/client/order/cancel', data=dict(oid=o1['id'], reason='不需要了'))))
assert db.get('orders', o1['id'])['orderSta'] == '已撤销'
bal0 = float(db.get('customers', cust['id'])['balance']); it0 = int(db.get('customers', cust['id'])['integral'])
r = J(c.post('/api/client/order/create', data=form)); ok(r); o3 = db.get('orders', r['data']['oid'])
ok(J(c.post('/api/client/order/cancel', data=dict(oid=o3['id']))))
c3 = db.get('customers', cust['id']); assert round(float(c3['balance']), 2) == round(bal0, 2) and int(c3['integral']) == it0 and db.get('orders', o3['id'])['payStatus'] == '已退款', c3
fees = J(c.get('/api/client/fees'))['data']; assert any(f['type'] == '退款' for f in fees) and any(f['type'] == '充值' for f in fees)
print('OK 撤单退款')

# 积分商城：后台建两个积分商品（抵扣券 / 实体）→ 兑换 → 优惠券可用于下单
db.update('customers', cust['id'], dict(integral=500)); db._local.conn.commit()
ok(J(admin.post('/SystemAjax/SaveIntegralCommodity', data=dict(param=json.dumps(dict(intral_shopTitle='10元抵扣券', ctype=20, depositoryNumber=5, needIntegral=100, faceValue=10, available=30, itemPic3='', integralCommodityId=0)), contentTxt='x'))))
ok(J(admin.post('/SystemAjax/SaveIntegralCommodity', data=dict(param=json.dumps(dict(intral_shopTitle='鼠标垫', ctype=10, depositoryNumber=1, needIntegral=200, faceValue=20, available='', itemPic3='', integralCommodityId=0)), contentTxt='x'))))
pts = J(c.get('/api/client/points'))['data']; assert pts['integral'] == 500 and len(pts['items']) >= 2
coupon_item = [i for i in pts['items'] if i['name'] == '10元抵扣券'][0]; goods = [i for i in pts['items'] if i['name'] == '鼠标垫'][0]
ok(J(c.post('/api/client/points/exchange', data=dict(id=coupon_item['id']))))
assert J(c.post('/api/client/points/exchange', data=dict(id=goods['id'])))['code'] == 0     # 实体缺地址
ok(J(c.post('/api/client/points/exchange', data=dict(id=goods['id'], recName='客户A', phone=PHONE, address='xx路1号'))))
assert J(c.post('/api/client/points/exchange', data=dict(id=goods['id'], recName='客户A', phone=PHONE, address='xx路1号')))['code'] == 0   # 已兑完
cps = [x for x in J(c.get('/api/client/coupons'))['data'] if x['source'] == '积分兑换']; assert len(cps) == 1 and cps[0]['faceValue'] == 10 and cps[0]['status'] == '未使用'
assert int(db.get('customers', cust['id'])['integral']) == 200
ex = J(admin.get('/SystemAjax/GetIntegralCommodityExchangeList?status=10&key=')); assert any(x['cname'] == '鼠标垫' for x in ex['data'])
q = J(c.get('/api/client/order/quote', data=dict(gameId=g['id'], projectId=proj['id'], couponId=cps[0]['id'])))['data']
assert q['coupon'] == 10 and q['final'] == round(round(proj['price'] * 0.9, 2) - q['fullDec'] - 10, 2), q
r = J(c.post('/api/client/order/create', data=dict(form, couponId=cps[0]['id'], payMethod='offline'))); ok(r)
assert db.get('orders', r['data']['oid'])['price'] == q['final'] and [x for x in J(c.get('/api/client/coupons'))['data'] if x['id'] == cps[0]['id']][0]['status'] == '已使用'
print('OK 积分兑换/优惠券')

# 抽奖：后台配置 → 客户端抽（先把演示奖品挪开，结束后恢复）
AW_SNAP = db.all_('mp_awards'); AW_SET = db.setting('award', {})
for x in AW_SNAP: db.delete('mp_awards', x['id'])
db._local.conn.commit()
ok(J(admin.post('/SystemAjax/SaveAwardSetting', data=dict(awardStatus=10, awardamount=50, awardcount=2, awardWay=0, awardunit='积分'))))
ok(J(admin.post('/SystemAjax/SaveAward', data=dict(id=0, title='100积分', atype=15, cid=0, range=100, prizeimg='', prizeValue=100, awardunit='积分', stockNumber=9))))
lt = J(c.get('/api/client/lottery'))['data']; assert lt['settings']['on'] and lt['settings']['cost'] == 50 and len(lt['awards']) == 1
it1 = int(db.get('customers', cust['id'])['integral'])
r = J(c.post('/api/client/lottery/draw')); ok(r); assert r['data']['hit'] and r['data']['title'] == '100积分' and r['data']['integral'] == it1 - 50 + 100, r
ok(J(c.post('/api/client/lottery/draw')))
assert '用完' in J(c.post('/api/client/lottery/draw'))['msg']
grants = J(admin.get('/SystemAjax/GetLotteryAwardGrantList?grantStatus=-1&key=')); assert grants['count'] >= 2 and grants['data'][0]['GrantStatus'] == 10
print('OK 抽奖')

# 在线客服留言
ok(J(c.post('/api/client/contact', data=dict(content='怎么充值'))))
assert any('客户咨询' in m.get('title', '') for m in db.all_('messages'))
print('OK 客服留言')

# 清理
db._local.conn = db.connect()
sysset = dict(db.setting('system', {})); sysset['AllowDebt'] = orig_debt or 'Y'; sysset['SK91'] = orig_sk91 or 'Y'; db.set_setting('system', sysset)
for x in db.find('orders', lambda o: o.get('customerId') == cust['id']):
    db.delete('orders', x['id'])
    for y in db.find('order_logs', lambda y: y.get('orderId') == x['id']): db.delete('order_logs', y['id'])
    for y in db.find('emp_pay', lambda y: y.get('orderId') == x['id']): db.delete('emp_pay', y['id'])
for coll in ('client_notices', 'client_coupons', 'client_integral_logs', 'customer_fees', 'mp_exchange', 'mp_award_grants'):
    for x in db.find(coll, lambda r: r.get('customerId') == cust['id']): db.delete(coll, x['id'])
for x in db.find('mp_integral', lambda r: r.get('cname') in ('10元抵扣券', '鼠标垫')): db.delete('mp_integral', x['id'])
for x in db.all_('mp_awards'): db.delete('mp_awards', x['id'])
for x in AW_SNAP: db.insert_with_id('mp_awards', x['id'], dict((k, v) for k, v in x.items() if k != 'id'))
for x in db.find('messages', lambda m: m.get('sendUserName') == '客户端'): db.delete('messages', x['id'])
db.set_setting('award', AW_SET); db.delete('customers', cust['id']); db._local.conn.commit()
print('ALL CLIENT OK')
