# 系统各项设置：保存 → 页面回显 → 行为生效
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
c = appmod.app.test_client()
J = lambda r: r.get_json()
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
orig = dict(db.setting('system', {}))


def save(**kw):
    cur = dict(db.setting('system', {}))
    cur.update(kw)
    r = J(c.post('/SystemAjax/SystemOrderSetting', data=dict(param=json.dumps(cur, ensure_ascii=False))))
    assert r['code'] > 0, r


def page_checked(name):
    h = c.get('/System/systemsetting').get_data(as_text=True)
    m = re.search(r'<input type="radio" name="%s" value="([^"]*)"[^>]*checked' % name, h)
    return m.group(1) if m else None


# 1) 回显
save(SK10='N', SK1='N', SystemLoginStyle='2', ExpOdMax='888')
assert page_checked('SK10') == 'N' and page_checked('SK1') == 'N' and page_checked('SystemLoginStyle') == '2', (page_checked('SK10'), page_checked('SK1'))
assert 'value="888"' in c.get('/System/systemsetting').get_data(as_text=True)
print('OK 设置回显')
# 2) 登录风格
h = c.get('/Login/index.html').get_data(as_text=True)
assert '#be123c' in h, '登录风格未切换（风格2 应为红橙渐变）'
print('OK 登录界面风格')
# 3) 录单必填开关 SK10=N 时不填来源单号也能录
gid = db.all_('games')[1]['id']
form = dict(orderID='', gameName=gid, gameRole='设置测试', project='设置测试项目', price=10, day=1, hours=0, dlcontent='x', orderSoures2='闲鱼')
r = J(c.post('/OrderAjax/AddOrderAjax', data=dict(strParameter=json.dumps(form, ensure_ascii=False), gameName=db.all_('games')[1]['gameName'], gameArea='', gameServer='', gameJob='', gameGroup='', emps='[]')))
assert r['code'] > 0, r
oid = db.all_('orders')[-1]['orderId']
# 4) SK1=N：指派后应为待上号
ds = [u for u in db.all_('users') if u['jobName'] == '打手'][0]
J(c.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=oid, strParameter=json.dumps([dict(userId=ds['id'], userName=ds['userName'], fee=5, hours=1, project='x')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0)))
o = [x for x in db.all_('orders') if x['orderId'] == oid][0]
assert o['orderSta'] == '待上号', o['orderSta']
print('OK SK1=N 指派后待上号')
# 5) SK1=Y：指派后代练中
save(SK1='Y')
J(c.post('/OrderAjax/CleanOrderZhiPaiByIDX', data=dict(orderId=oid)))
J(c.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=oid, strParameter=json.dumps([dict(userId=ds['id'], userName=ds['userName'], fee=5, hours=1, project='x')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0)))
o = [x for x in db.all_('orders') if x['orderId'] == oid][0]
assert o['orderSta'] == '代练中', o['orderSta']
print('OK SK1=Y 指派后代练中')
# 6) 打手改问题单限制 SK30=Y
save(SK30='Y', SK46='Y')
c2 = appmod.app.test_client(); J(c2.post('/Login/Login', data=dict(acc=ds['loginAcc'], pwd='123456')))
r = J(c2.post('/OrderAjax/SetOrderSta', data=dict(orderId=oid, sta='问题单', remark='r')))
assert r['code'] == 0 and '不允许打手' in r['msg'], r
r = J(c.post('/OrderAjax/SetOrderSta', data=dict(orderId=oid, sta='问题单', remark='')))
assert r['code'] == 0 and '原因' in r['msg'], r
print('OK 打手改状态限制 / 问题单原因必填')
# 7) 打手交单 SK91=Y → 已完成
save(SK91='Y', SK30='N')
r = J(c2.post('/OrderAjax/SetOrderSta', data=dict(orderId=oid, sta='待验收')))
o = [x for x in db.all_('orders') if x['orderId'] == oid][0]
assert o['orderSta'] == '已完成', (r, o['orderSta'])
print('OK SK91 打手交单直接完成')
# 8) 会员：名称非必填 + 固定6位会员号
save(RequiredMemberName='0', MemberNumberLength='6')
r = J(c.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=0, bossName='', phone='13100000000')))
assert r['code'] > 0, r
cst = db.get('customers', r['data']); assert len(cst['customerNo']) == 6 and cst['bossName'].startswith('会员'), cst
print('OK 会员设置')
# 9) 消息提示音：开关 / 音源 → 我的消息页与主框架回显
J(c.post('/UserAjax/SaveUserConfigForMsgSoundSwichtByUserId', data=dict(status='N'))); J(c.post('/UserAjax/SaveUserConfigForMsgSoundSoureByUserId', data=dict(value='2')))
h = c.get('/User/mymessage').get_data(as_text=True)
assert re.search(r'name="msgsound"[^>]*value="N"[^>]*checked', h) and re.search(r'name="selectsound"[^>]*value="2"[^>]*checked', h), '提示音设置未回显'
h = c.get('/').get_data(as_text=True)
assert 'id="isPlayMsgSound" value="N"' in h and 'id="myMsgSoundSoure" value="2"' in h and '/media/msg2.wav' in h, '主框架未读取提示音设置'
J(c.post('/UserAjax/SaveUserConfigForMsgSoundSwichtByUserId', data=dict(status='Y'))); J(c.post('/UserAjax/SaveUserConfigForMsgSoundSoureByUserId', data=dict(value='0')))
print('OK 消息提示音设置')
# 还原
db._local.conn = db.connect()
db.set_setting('system', orig); db._local.conn.commit()
for x in db.find('orders', lambda x: x.get('roleName') == '设置测试'):
    db.delete('orders', x['id'])
    for y in db.find('emp_pay', lambda y: y.get('orderId') == x['id']): db.delete('emp_pay', y['id'])
    for y in db.find('order_logs', lambda y: y.get('orderId') == x['id']): db.delete('order_logs', y['id'])
db.delete('customers', cst['id']); db._local.conn.commit()
print('ALL SETTINGS OK')
