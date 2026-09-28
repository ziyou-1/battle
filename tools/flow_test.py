# 业务流程测试：录单→指派→状态→完成→结算 / 人员 / 角色 / 客户 / 游戏 等
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
# 流程测试造的数据：开头清掉上次的，结尾再清一次，避免残留污染演示库（会在客户端游戏列表里冒出“永劫无间”）
import db as _db


def _purge_flow_data():
    _db._local.conn = _db.connect()
    for coll, key, val in [('games', 'gameName', '永劫无间'), ('users', 'loginAcc', 'test_ds01'), ('roles', 'roleName', '测试角色'), ('customers', 'bossName', '流程测试老板'),
                           ('labels', 'labelName', '流程标签'), ('sources', 'soureName', '流程来源'), ('books', 'title', '流程账本'), ('pve_tasks', 'taskName', '流程排团'),
                           ('game_accounts', 'gameAcc', 'flow_acc')]:
        for r in _db.find(coll, lambda r: r.get(key) == val):
            _db.delete(coll, r['id'])
    for coll in ('projects', 'game_data', 'game_items', 'price_calc'):
        for r in _db.find(coll, lambda r: r.get('gameName') == '永劫无间'):
            _db.delete(coll, r['id'])
    for r in _db.find('orders', lambda r: r.get('roleName') == '流程角色' or r.get('gameName') == '永劫无间'):
        _db.delete('orders', r['id'])
        for x in _db.find('emp_pay', lambda x: x.get('orderId') == r['id']): _db.delete('emp_pay', x['id'])
        for x in _db.find('order_logs', lambda x: x.get('orderId') == r['id']): _db.delete('order_logs', x['id'])
    for r in _db.find('bills', lambda r: r.get('userName') == '测试打手'): _db.delete('bills', r['id'])
    _db._local.conn.commit(); _db._local.conn.close(); _db._local.conn = None


_purge_flow_data()
c = appmod.app.test_client()
def J(r):
    j = r.get_json(); assert j is not None, r.get_data(as_text=True)[:300]; return j
def ok(j, what):
    assert j.get('code', 0) > 0 or j.get('code') == 0 and 'count' in j, '%s failed: %s' % (what, json.dumps(j, ensure_ascii=False)[:300])
    print('OK', what, '->', (j.get('msg') or '')[:40])
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
# 游戏
j = J(c.post('/GameAjax/AddEditGame', data=dict(gameName='永劫无间', isMoblieGame='N', isPw='N'))); ok(j, '新增游戏'); gid = j['data']
ok(J(c.post('/GameAjax/AddModityOrderType', data=dict(gameId=gid, pid=0, projectName='段位代练', orderBy=1))), '新增分类')
ok(J(c.post('/GameAjax/AddEditProject', data=dict(gameId=gid, pid=0, projectName='上分到王者', orderBy=1, price=200))), '新增项目')
gd = J(c.get('/GameAjax/getGameData?type=20&parentId=永劫无间')); assert gd['data'], gd
# 人员 + 角色
roles = J(c.get('/SystemAjax/GetAllRoleJobList?page=1&limit=50'))['data']; dashou = next(r for r in roles if r['roleName'] == '打手')
j = J(c.post('/UserAjax/AddEditUser', data=dict(strparameter=json.dumps(dict(uid=0, loginAcc='test_ds01', userName='测试打手', userRole=dashou['roleId'], qq='1', moblie='13800000000', bussType=1, recOrderMaxCount=5)), games='永劫无间'))); ok(j, '新开账号'); new_uid = j['data']
tree = J(c.get('/SystemAjax/GetUserRole?menuId=%s' % dashou['roleId'])); assert isinstance(tree, list) and tree[0]['Menu_ID']
ok(J(c.post('/SystemAjax/AddEditRole', data=dict(roleId=0, roleName='测试角色', remark='r', selectId='100,200,601,602'))), '新增角色')
# 客户
j = J(c.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=0, bossName='流程测试老板', phone='13900000000', platName='淘宝店', initAmount=500, giftAmount=50))); ok(j, '新开会员'); cid = j['data']
ok(J(c.post('/api/CustomerApi/Recharge', data=dict(Id=cid, Amount=100, GiftAmount=0, PayMode='支付宝', OrderNo='x', Remark=''))), '会员充值')
cust = J(c.get('/api/CustomerApi/CustomerDetail/%s' % cid)); assert cust['data']['balance'] == 650, cust
# 录单
form = dict(orderID='', gameName=gid, gameRole='流程角色', souresOrderID='FLOW' + str(__import__('time').time_ns())[-8:], project='上分到王者', orderType='段位代练', price=300, priceReceipts=300, desServiceFee=0, day=2, hours=0, ww='流程测试老板', qq='', moblie='13900000000', remark='测试备注', tag='', dlcontent='上分到王者，要求安全', orderSoures2='淘宝店-云序工作室', gameAcc='acc1', gamePwd='pwd1', recUser='0', customerId=cid)
j = J(c.post('/OrderAjax/AddOrderAjax', data=dict(strParameter=json.dumps(form, ensure_ascii=False), gameName='永劫无间', gameArea='电信区', gameServer='', gameJob='', gameGroup='', emps='[]'))); ok(j, '录入订单'); oid = j['code']
lst = J(c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=5, gameName='永劫无间', timeType=10))); assert lst['count'] >= 1 and lst['data'][0]['project'] == '上分到王者', lst['data'][:1]
order_id = lst['data'][0]['orderId']
# 指派
ok(J(c.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(orderId=order_id, strParameter=json.dumps([dict(userId=new_uid, userName='测试打手', fee=180, hours=48, project='上分到王者')]), isAutoAss='N', sphone='', isOpenThrowOrderPricePerce='N', taskNeedJobId=0))), '指派打手')
ass = J(c.get('/OrderAjax/GetOrderAssLogs?orderId=%s' % order_id)); assert ass['data'][0]['userName'] == '测试打手'
ok(J(c.post('/OrderAjax/SetOrderSta', data=dict(orderId=order_id, sta='代练中'))), '改代练中')
ok(J(c.post('/OrderAjax/SetOrderSta', data=dict(orderId=order_id, sta='已完成'))), '改已完成')
emp = J(c.get('/EmpAjax/GetEmpList?page=1&limit=50&settingSta=N&gameName=永劫无间')); mine = [r for r in emp['data'] if r['userName'] == '测试打手']; assert mine and mine[0]['tempAmount'] == 180, emp['data'][:1]
ok(J(c.post('/EmpAjax/UpEmpSta', data=dict(empId=mine[0]['empPayId'], sta='Y', syncexp='N'))), '结算')
bills = J(c.get('/EmpAjax/GetBillSummaryList?page=1&limit=5')); assert bills['data'][0]['userName'] == '测试打手' and bills['data'][0]['amount'] == 180, bills['data'][:1]
logs = J(c.post('/OrderAjax/GetOrderLogs', data=dict(orderId=order_id, viewType=10))); assert len(logs['data']) >= 4, logs
# 编辑订单页 / 详情页
r = c.get('/Order/OrderView?orderId=%s&viewType=10' % order_id); assert '流程角色' in r.get_data(as_text=True) and '上分到王者' in r.get_data(as_text=True)
r = c.get('/Order/addorder?orderID=%s' % order_id); html = r.get_data(as_text=True); assert 'value="300' in html and "selected='selected'" in html
# 其它
ok(J(c.post('/SystemAjax/AddModityOrderLabel', data=dict(id=0, gameName='全部游戏', labelName='流程标签', remark='', orderBy=1, colorValue='#f00'))), '新增标签')
ok(J(c.post('/SystemAjax/AddEdiSoure', data=dict(soureId=0, soureName='流程来源', remark='', orderBy=1, shopType='其它'))), '新增来源')
ok(J(c.post('/SystemAjax/SaveSystemNotice', data=dict(id=0, content='<p>流程公告</p>'))), '发布公告')
ok(J(c.post('/EmpAjax/AddEditBook', data=dict(bookId=0, title='流程账本', price=12.5, bookType='支出', remark=''))), '记账')
ok(J(c.post('/PveTaskAjax/AddEditPveTask', data=dict(param=json.dumps(dict(taskId=0, taskName='流程排团', gameName='永劫无间', project='上分到王者', leaderID=new_uid, startDate='2026-09-20 20:00:00'), ensure_ascii=False), jobConfig=json.dumps([dict(jobName='主C', price=50), dict(jobName='辅助', price=40)]), isConfigJob='Y'))), '新建排团')
board = J(c.post('/PveTaskAjax/GetNewsGroupList', data=dict(gameId=gid, page=1, limit=10))); assert board['count'] >= 1 and board['data'][0][0]['taskName'] == '流程排团'
ok(J(c.post('/GameAccountsAjax/AddEditGameAccount', data=dict(param=json.dumps(dict(gameAccId=0, gameAcc='flow_acc', gamePwd='p', gameRole='r', accStatus=10)), gameName='永劫无间', gameArea='', gameServer='', gameJob='', gameGroup='', useType='A'))), '新增游戏号')
r = c.get('/Login/loginout'); assert r.status_code == 302
r = c.post('/OrderAjax/GetOrderList', data=dict(page=1)); assert J(r)['msg'] == '请先登录'
_purge_flow_data()
print('ALL FLOWS OK')
