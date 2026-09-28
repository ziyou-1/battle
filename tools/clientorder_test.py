# 客户填单：填单设置回显 → 生成链接 → 客户公开页补充资料 → 生成订单 → 查进度
import os, sys, re, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
c = appmod.app.test_client()
J = lambda r: r.get_json()
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))

# 填单设置
assert J(c.post('/SystemAjax/SaveClientWriteOrderSetting', data=dict(mark='', pic='', swtich='Y')))['code'] == 0
ok(J(c.post('/SystemAjax/SaveClientWriteOrderSetting', data=dict(mark='资料已收到，稍后安排', pic='/upload/x.png', swtich='N'))))
h = c.get('/Order/ClientOrderGenerate').get_data(as_text=True)
assert '>资料已收到，稍后安排</textarea>' in h and re.search(r'name="swtich" value="N"[^>]*checked', h) and 'src="/upload/x.png"' in h, '填单设置未回显'
print('OK 填单设置回显')

# 生成链接
gm = db.all_('games')[1]
assert J(c.post('/OrderAjax/GeneRateCustomerOrderAjax', data=dict(gameName=gm['gameName'], project='上分', orderSoure='', price=100)))['code'] == 0
assert J(c.post('/OrderAjax/GeneRateCustomerOrderAjax', data=dict(gameName=gm['gameName'], project='上分', orderSoure='闲鱼', price='')))['code'] == 0
r = J(c.post('/OrderAjax/GeneRateCustomerOrderAjax', data=dict(gameName=gm['gameName'], project='青铜到黄金', orderSoure='闲鱼', soureOrderId='XY123456', price=100, day=1, hours=2, ww='买家A')))
ok(r); link = r['data']; assert '/Public/WriteOrder?key=' in link, link
key = link.split('key=')[1]
lst = J(c.get('/OrderAjax/GetGeneRateCustomerOrderLogList'))
row = [x for x in lst['data'] if x['str8'] == link][0]
assert row['str2'] == gm['gameName'] and row['str3'] == '青铜到黄金' and row['str4'] == 'XY123456' and row['str5'] == 100 and row['str1'].startswith('待填写'), row
print('OK 生成链接')

# 客户端（未登录）打开公开页并提交
c2 = appmod.app.test_client()
h = c2.get('/Public/WriteOrder?key=' + key).get_data(as_text=True)
assert '青铜到黄金' in h and 'XY123456' in h and 'name="gameAcc"' in h, '公开填单页内容不对'
assert '链接无效' in c2.get('/Public/WriteOrder?key=nokey').get_data(as_text=True)
assert J(c2.post('/Public/SubmitWriteOrder', data=dict(key=key, gameAcc='acc1', gamePwd='', gameRole='R', moblie='13000000000')))['code'] == 0
assert J(c2.post('/Public/SubmitWriteOrder', data=dict(key=key, gameAcc='acc1', gamePwd='p1', gameRole='', moblie='13000000000')))['code'] == 0
r = J(c2.post('/Public/SubmitWriteOrder', data=dict(key=key, gameAcc='acc1', gamePwd='p1', gameRole='客户角色', moblie='13000000000', gameArea='微信区', dlcontent='别用皮肤')))
ok(r); assert r['data']['mark'] == '资料已收到，稍后安排' and r['data']['searchUrl'] == '' and r['data']['pic'] == '/upload/x.png', r
assert J(c2.post('/Public/SubmitWriteOrder', data=dict(key=key, gameAcc='acc1', gamePwd='p1', gameRole='客户角色', moblie='13000000000')))['code'] == 0
o = db.first('orders', lambda x: x.get('orderIdView') == 'XY123456')
assert o and o['gameAcc'] == 'acc1' and o['roleName'] == '客户角色' and o['price'] == 100 and o['orderSoure'] == '闲鱼' and o['kefu'] == 'admin' or o['kefu'], o
assert o['gameArea'] == '微信区' and o['orderContent'] == '别用皮肤' and o['days'] == 1 and o['hours'] == 2 and o['WangWang'] == '买家A', o
assert any(l['orderId'] == o['id'] for l in db.all_('order_logs'))
lst = J(c.get('/OrderAjax/GetGeneRateCustomerOrderLogList'))
assert [x for x in lst['data'] if x['str8'] == link][0]['str1'] == o['orderId']
assert '已提交' in c2.get('/Public/WriteOrder?key=' + key).get_data(as_text=True) or '资料已收到' in c2.get('/Public/WriteOrder?key=' + key).get_data(as_text=True)
print('OK 客户填单生成订单')

# 查进度入口开关 + 公开查单页
ok(J(c.post('/SystemAjax/SaveClientWriteOrderSetting', data=dict(mark='ok', pic='', swtich='Y'))))
r2 = J(c.post('/OrderAjax/GeneRateCustomerOrderAjax', data=dict(gameName=gm['gameName'], project='p', orderSoure='淘宝', price=50)))
k2 = r2['data'].split('key=')[1]
r = J(c2.post('/Public/SubmitWriteOrder', data=dict(key=k2, gameAcc='a', gamePwd='b', gameRole='c', moblie='13000000001')))
assert '/Public/SearchOrder?no=' in r['data']['searchUrl'], r
h = c2.get('/Public/SearchOrder?no=XY123456').get_data(as_text=True)
assert '客户角色' in h and o['orderSta'] in h and '订单已录入' in h and '客户通过填单链接' not in h, '查单页内容不对'
# 内部信息（打手/接单价）不能出现在公开查单页
J(c.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=o['orderId'], strParameter=json.dumps([dict(userId=[u for u in db.all_('users') if u['jobName'] == '打手'][0]['id'], userName='打手X', fee=66, hours=1, project='p')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0)))
h = c2.get('/Public/SearchOrder?no=XY123456').get_data(as_text=True); assert '接单价' not in h and '打手X' not in h, '查单页泄露内部信息'
assert '没有查到' in c2.get('/Public/SearchOrder?no=NOPE').get_data(as_text=True)
print('OK 公开查单')

# 清理
db._local.conn = db.connect()
for x in db.find('orders', lambda x: x.get('orderRemark') == '客户自行填单'):
    db.delete('orders', x['id'])
    for y in db.find('order_logs', lambda y: y.get('orderId') == x['id']): db.delete('order_logs', y['id'])
for x in db.all_('customer_order_links'): db.delete('customer_order_links', x['id'])
db.set_setting('clientWriteOrder', {}); db._local.conn.commit()
print('ALL CLIENTORDER OK')
