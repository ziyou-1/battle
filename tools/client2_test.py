# 客户端第二批：常用角色 / 再来一单 / 评价 / 售后 / 会话 / 新客券 / 邀请 / 自助报价 / 打手风采 / 协议注销 / 搜索 + 后台评价回复、售后处理、客户端设置
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
admin = appmod.app.test_client(); c = appmod.app.test_client(); c2 = appmod.app.test_client()
J = lambda r: r.get_json()
J(admin.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))
P1, P2 = '13900000001', '13900000002'


def purge(cid_):
    for x in db.find('orders', lambda o: o.get('customerId') == cid_):
        db.delete('orders', x['id'])
        for y in db.find('order_logs', lambda y: y.get('orderId') == x['id']): db.delete('order_logs', y['id'])
        for y in db.find('emp_pay', lambda y: y.get('orderId') == x['id']): db.delete('emp_pay', y['id'])
    for coll in ('client_notices', 'client_coupons', 'client_integral_logs', 'customer_fees', 'client_roles', 'order_reviews', 'aftersales'):
        for x in db.find(coll, lambda r: r.get('customerId') == cid_): db.delete(coll, x['id'])
    db.delete('customers', cid_)


for x in db.find('customers', lambda r: r.get('phone') in (P1, P2)): purge(x['id'])
for coll in ('order_reviews', 'aftersales'):   # 上次中断留下的孤儿记录
    for x in db.find(coll, lambda r: r.get('customerName') in ('邀请人', '被邀请', '邀请人（已注销）')): db.delete(coll, x['id'])
CS = dict(db.setting('clientSetting', {}))
db._local.conn.commit()

# 后台页面 + 客户端设置
for u in ('/System/clientsetting', '/Order/clientreviews', '/Order/aftersales'):
    assert admin.get(u).status_code == 200, u
h = admin.get('/').get_data(as_text=True); assert '/Order/clientreviews' in h and '/System/clientsetting' in h, '菜单未加入'
ok(J(admin.post('/SystemAjax/SaveClientSetting', data=dict(newCouponOn='Y', newCouponName='新客券', newCouponValue='10', newCouponMin='50', inviteOn='Y', inviteReward='100', inviteeReward='30', activityOn='Y', activityTitle='国庆特惠', activityDesc='全场 9 折', activityEnd='2030-10-07 23:59', activityLink='/shop'))))
assert '国庆特惠' in admin.get('/System/clientsetting').get_data(as_text=True)
home = J(c.get('/api/client/home'))['data']; assert home['activity']['title'] == '国庆特惠' and home['types'], home.get('activity')
print('OK 后台设置/菜单/活动位')

# 注册：新客券 + 邀请码；邀请人首单奖励
r = J(c.post('/api/client/register', data=dict(phone=P1, pwd='abc123', name='邀请人'))); ok(r)
cu1 = db.first('customers', lambda x: x.get('phone') == P1); assert cu1.get('inviteCode') and r['data']['inviteCode'] == cu1['inviteCode']
cps = J(c.get('/api/client/coupons'))['data']; assert len(cps) == 1 and cps[0]['faceValue'] == 10 and cps[0]['source'] == '新客礼', cps
inv = J(c.get('/api/client/invite'))['data']; assert inv['code'] == cu1['inviteCode'] and 'register?invite=' in inv['link']
r = J(c2.post('/api/client/register', data=dict(phone=P2, pwd='abc123', name='被邀请', inviteCode=cu1['inviteCode']))); ok(r)
cu2 = db.first('customers', lambda x: x.get('phone') == P2); assert cu2['invitedBy'] == cu1['id'] and int(cu2['integral']) == 30, cu2.get('integral')
assert len(J(c.get('/api/client/invite'))['data']['friends']) == 1
print('OK 新客券/邀请注册')

# 常用角色 CRUD → 下单带入 + 保存为角色
games = J(c.get('/api/client/games'))['data']; g = [x for x in games if x['projects'] > 0][0]
gd = J(c.get('/api/client/game', data=dict(id=g['id'])))['data']; proj = [p for p in gd['projects'] if p['price'] > 0][0]
ok(J(c.post('/api/client/roles/save', data=dict(gameId=g['id'], gameArea=gd['areas'][0]['name'], roleName='常用角色A', gameAcc='accA', gamePwd='pwdA'))))
assert J(c.post('/api/client/roles/save', data=dict(gameId=g['id'], roleName='')))['code'] == 0
roles = J(c.get('/api/client/roles'))['data']; assert len(roles) == 1 and roles[0]['hasPwd'] and 'gamePwd' not in roles[0]
rid = roles[0]['id']
assert J(c.get('/api/client/roles', data=dict(gameName=g['name'])))['data'][0]['gamePwd'] == 'pwdA'
ok(J(admin.post('/api/CustomerApi/Recharge', data=dict(Id=cu1['id'], Amount=2000, GiftAmount=0, PayMode='微信', Remark='测试'))))
form = dict(gameId=g['id'], projectId=proj['id'], gameArea=gd['areas'][0]['name'], roleName='常用角色A', gameAcc='accA', gamePwd='pwdA', payMethod='balance', roleId=rid)
r = J(c.post('/api/client/order/create', data=form)); ok(r); o1 = db.get('orders', r['data']['oid'])
assert db.get('client_roles', rid)['useCount'] == 1
# 邀请人在被邀请人首次付款后得奖励：给 cu2 充值并下单
ok(J(admin.post('/api/CustomerApi/Recharge', data=dict(Id=cu2['id'], Amount=500, GiftAmount=0, PayMode='微信', Remark='测试'))))
it1 = int(db.get('customers', cu1['id'])['integral'])
r = J(c2.post('/api/client/order/create', data=dict(gameId=g['id'], projectId=proj['id'], gameArea=gd['areas'][0]['name'], roleName='角色B', gameAcc='b', gamePwd='b', payMethod='balance', saveRole='1'))); ok(r)
assert int(db.get('customers', cu1['id'])['integral']) == it1 + 100 and db.get('customers', cu2['id'])['inviteRewarded'] == 'Y'
assert len(J(c2.get('/api/client/roles'))['data']) == 1   # saveRole=1 自动保存
# 再来一单：按项目名 + 角色信息
r = J(c.get('/api/client/order/quote', data=dict(gameId=g['id'], project=proj['name']))); ok(r); assert r['data']['base'] == proj['price']
# 客户端传价格不采信
assert J(c.get('/api/client/order/quote', data=dict(gameId=g['id'], project='乱写的项目', price=1)))['code'] == 0
print('OK 常用角色/下单带入/再来一单/邀请奖励')

# 会话：客户留言 → 客服回复 → 未读 → 打开会话已读
ok(J(c.post('/api/client/order/message', data=dict(oid=o1['id'], content='请尽快'))))
ok(J(admin.post('/OrderAjax/ReplyOrderCustomerMsg', data=dict(orderId=o1['orderId'], content='马上安排'))))
row = [x for x in J(c.get('/api/client/orders', data=dict(status='all')))['data']['rows'] if x['oid'] == o1['id']][0]; assert row['unread'] == 1, row['unread']
chat = J(c.get('/api/client/order/chat', data=dict(oid=o1['id'])))['data']
assert [m for m in chat['msgs'] if m.get('mine')][0]['content'] == '请尽快' and [m for m in chat['msgs'] if not m.get('mine') and not m.get('system')][0]['content'] == '马上安排', chat['msgs']
assert [x for x in J(c.get('/api/client/orders', data=dict(status='all')))['data']['rows'] if x['oid'] == o1['id']][0]['unread'] == 0
print('OK 订单会话')

# 售后：开打后申请退款 → 后台处理退款 → 客户端可见
ds = [u for u in db.all_('users') if u['jobName'] == '打手'][0]
ok(J(admin.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=o1['orderId'], strParameter=json.dumps([dict(userId=ds['id'], userName=ds['userName'], fee=10, hours=1, project='p')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0))))
ok(J(admin.post('/OrderAjax/SetOrderSta', data=dict(orderId=o1['orderId'], sta='代练中'))))
assert J(c.post('/api/client/order/aftersale', data=dict(oid=o1['id'], type='退款', reason='短', amount=10)))['code'] == 0
r = J(c.post('/api/client/order/aftersale', data=dict(oid=o1['id'], type='退款', reason='打手中途掉线两小时', amount=999))); ok(r)
assert J(c.post('/api/client/order/aftersale', data=dict(oid=o1['id'], type='投诉', reason='重复申请测试一下')))['code'] == 0
mine = J(c.get('/api/client/aftersales'))['data']; assert len(mine) == 1 and mine[0]['status'] == '待处理' and mine[0]['amount'] == o1['price'], mine
lst = J(admin.get('/OrderAjax/GetAfterSaleList?status=待处理')); assert lst['count'] >= 1 and lst['total']['pending'] >= 1
aid = mine[0]['id']
bal0 = float(db.get('customers', cu1['id'])['balance'])
ok(J(admin.post('/OrderAjax/HandleAfterSale', data=dict(id=aid, status='已完成', result='核实属实，退一半', refundAmount=20))))
assert J(admin.post('/OrderAjax/HandleAfterSale', data=dict(id=aid, status='已完成', result='再退', refundAmount=20)))['code'] == 0   # 不能重复退
assert round(float(db.get('customers', cu1['id'])['balance']), 2) == round(bal0 + 20, 2)
d = J(c.get('/api/client/order/detail', data=dict(oid=o1['id'])))['data']; assert d['aftersales'][0]['status'] == '已完成' and d['aftersales'][0]['refundAmount'] == 20 and not d['canAftersale'] is None
assert any('售后' in n['title'] for n in J(c.get('/api/client/notices'))['data'])
print('OK 售后申请/后台处理退款')

# 评价：完成后评价 → 后台列表/回复 → 打手风采评分
sysset = dict(db.setting('system', {})); orig91 = sysset.get('SK91'); sysset['SK91'] = 'N'; db.set_setting('system', sysset); db._local.conn.commit()
assert J(c.post('/api/client/order/review', data=dict(oid=o1['id'], stars=5)))['code'] == 0   # 未完成
ok(J(admin.post('/OrderAjax/SetOrderSta', data=dict(orderId=o1['orderId'], sta='待验收')))); ok(J(c.post('/api/client/order/confirm', data=dict(oid=o1['id']))))
it0 = int(db.get('customers', cu1['id'])['integral'])
ok(J(c.post('/api/client/order/review', data=dict(oid=o1['id'], stars=4, content='速度很快'))))
assert J(c.post('/api/client/order/review', data=dict(oid=o1['id'], stars=4)))['code'] == 0
assert int(db.get('customers', cu1['id'])['integral']) == it0 + 5
d = J(c.get('/api/client/order/detail', data=dict(oid=o1['id'])))['data']; assert d['review']['stars'] == 4 and not d['canReview']
lst = J(admin.get('/OrderAjax/GetClientReviewList?key=速度')); assert lst['count'] == 1 and lst['data'][0]['recManName'] == ds['userName'] and lst['total']['avg'] == 4
ok(J(admin.post('/OrderAjax/ReplyClientReview', data=dict(id=lst['data'][0]['id'], reply='感谢支持'))))
assert J(c.get('/api/client/order/detail', data=dict(oid=o1['id'])))['data']['review']['reply'] == '感谢支持'
bs = J(c.get('/api/client/boosters'))['data']; b = [x for x in bs if x['id'] == ds['id']][0]; assert b['rating'] == 4 and b['reviews'] == 1 and b['done'] >= 1, b
print('OK 评价/后台回复/打手风采')

# 自助报价：给王者荣耀阶梯填价 → 客户端算价 → 按报价下单（服务器重算）
rows = J(admin.get('/GameAjax/GetSystemPriceCalculatorByGame?game=王者荣耀&project=段位'))['data']
qt3 = [x for x in rows if x['LeveName1'] == '青铜3']; qt2 = [x for x in rows if x['LeveName1'] == '青铜2']
ok(J(admin.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt3 + qt2), ctype=20, value=30))))
ok(J(admin.post('/GameAjax/SavePriceCalculatorSettingPriceParamByDwBase', data=dict(gameName='王者荣耀', project='段位', param=json.dumps({'dw_profit': '0', 'dw_packgeName1': '普通', 'dw_packgePar1': '0', 'dw_packgeName2': '指定英雄', 'dw_packgePar2': '50'})))))
cg = J(c.get('/api/client/calc/games'))['data']; assert any(x['name'] == '王者荣耀' and '段位' in x['projects'] for x in cg), cg
ld = J(c.get('/api/client/calc/ladder', data=dict(gameName='王者荣耀', project='段位')))['data']; assert ld['isDw'] and ld['packages'] == ['普通', '指定英雄']
q = J(c.get('/api/client/calc/quote', data=dict(gameName='王者荣耀', project='段位', st=qt3[0]['PriceCalculatorId'], et=qt2[2]['PriceCalculatorId'], serviceType=10, platfrom=0)))['data']
assert q[0]['price'] == 50 and q[1]['price'] == 75, q   # 青铜3 剩 2 星 ×10 + 青铜2 3 星 ×10 = 50；指定英雄 +50%
calc = json.dumps(dict(gameName='王者荣耀', project='段位', st=qt3[0]['PriceCalculatorId'], et=qt2[2]['PriceCalculatorId'], serviceType=10, platfrom=0, packgeName='指定英雄'))
qq = J(c.get('/api/client/order/quote', data=dict(calc=calc)))['data']; assert qq['base'] == 75 and '指定英雄' in qq['project'], qq
r = J(c.post('/api/client/order/create', data=dict(calc=calc, roleName='王者角色', gameAcc='a', gamePwd='b', payMethod='offline'))); ok(r)
oc = db.get('orders', r['data']['oid']); assert oc['price'] == 75 and oc['gameName'] == '王者荣耀' and '青铜3' in oc['project'], oc['project']
print('OK 自助报价下单')

# 后台重置客户端密码（会员编辑弹窗的“客户端密码”字段）
assert 'name="clientPwd"' in admin.get('/Customer/CustomerEdit?hid=%d' % cu1['id']).get_data(as_text=True)
assert J(admin.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=cu1['id'], bossName='邀请人', phone=P1, clientPwd='123')))['code'] == 0
ok(J(admin.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=cu1['id'], bossName='邀请人', phone=P1, clientPwd='newpass6'))))
assert J(c.post('/api/client/login', data=dict(phone=P1, pwd='abc123')))['code'] == 0 and J(c.post('/api/client/login', data=dict(phone=P1, pwd='newpass6')))['code'] > 0
ok(J(admin.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=cu1['id'], bossName='邀请人', phone=P1, clientPwd='abc123'))))
print('OK 后台重置客户端密码')

# 搜索 / 协议 / 注销
sr = J(c.get('/api/client/search', data=dict(key=proj['name'][:2])))['data']; assert sr['projects'] or sr['items'] or sr['games']
lg = J(c.get('/api/client/legal'))['data']; assert lg['agreement'] and lg['privacy']
assert J(c2.post('/api/client/close', data=dict(pwd='abc123')))['code'] == 0   # c2 有进行中订单
ok(J(c.post('/api/client/order/cancel', data=dict(oid=oc['id']))))
assert J(c.post('/api/client/close', data=dict(pwd='wrong')))['code'] == 0
ok(J(c.post('/api/client/close', data=dict(pwd='abc123'))))
assert J(c.get('/api/client/me'))['code'] == -1 and J(c.post('/api/client/login', data=dict(phone=P1, pwd='abc123')))['code'] == 0
print('OK 搜索/协议/注销')

# 清理（先走接口，再用本地连接写，避免锁库）
ok(J(admin.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt3 + qt2), ctype=20, value=0))))
db._local.conn = db.connect()
sysset = dict(db.setting('system', {})); sysset['SK91'] = orig91 or 'Y'; db.set_setting('system', sysset)
db.set_setting('clientSetting', CS)
db.set_setting('pricebase:王者荣耀:段位', {})
for cid_ in (cu1['id'], cu2['id']):
    purge(cid_)
for x in db.find('messages', lambda m: m.get('sendUserName') == '客户端'): db.delete('messages', x['id'])
import seed
seed.seed_calc_demo()   # 把上面清零的段位价和基础参数恢复成演示值，别把演示库留成半残状态
db._local.conn.commit()
print('ALL CLIENT2 OK')
