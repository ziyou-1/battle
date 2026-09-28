# 补齐的四个弹窗：排团详情（旧版/2025）、游戏号详情、指派游戏号
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
c = appmod.app.test_client()
J = lambda r: r.get_json()
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))

# 排团详情
t = db.all_('pve_tasks')[0]
for u in ('/Group/GroupDetails?taskID=%d' % t['id'], '/Group/GroupDetails2025?taskID=%d' % t['id']):
    h = c.get(u).get_data(as_text=True)
    assert t['taskName'] in h and t['leaderUserName'] in h and t['jobs'][0]['jobName'] in h and '没有权限' not in h, u
assert '排团不存在' in c.get('/Group/GroupDetails?taskID=999999').get_data(as_text=True)
print('OK 排团详情')

# 游戏号详情
a = db.all_('game_accounts')[0]
h = c.get('/GameAccounts/GameAccDetails?gameAccId=%d' % a['id']).get_data(as_text=True)
assert a['gameRoleName'] in h and a['gameName'] in h and 'id="accId" name="accId" value="%d"' % a['id'] in h and '提取使用资料' in h, '详情页未渲染账号'
r = J(c.post('/GameAccountsAjax/GetGameAccountUseInfoByDetail', data=dict(idx=a['id']))); ok(r); assert a['gameAcc'] in r['msg'] and a['gamePwd'] in r['msg'], r
r = J(c.post('/GameAccountsAjax/GetGameAccountPrivateInfoByDetail', data=dict(idx=a['id']))); ok(r); assert '机密资料' in r['msg'], r
ok(J(c.post('/GameAccountsAjax/AddGameAccountLogRemark', data=dict(accId=a['id'], remark='测试备注'))))
assert J(c.post('/GameAccountsAjax/AddGameAccountLogRemark', data=dict(accId=a['id'], remark='')))['code'] == 0
lg = J(c.post('/GameAccountsAjax/GetGameAccountLog', data=dict(accId=a['id'])))
assert lg['code'] == 1 and any('(说)测试备注' in x['content'] for x in lg['data']) and any('使用资料' in x['content'] for x in lg['data']) and any('机密资料' in x['content'] for x in lg['data']), lg
# 打手看不到机密资料
ds = [u for u in db.all_('users') if u['jobName'] == '打手'][0]
c2 = appmod.app.test_client(); J(c2.post('/Login/Login', data=dict(acc=ds['loginAcc'], pwd='123456')))
assert J(c2.post('/GameAccountsAjax/GetGameAccountPrivateInfoByDetail', data=dict(idx=a['id'])))['code'] == 0
print('OK 游戏号详情')

# 指派游戏号
h = c.get('/GameAccounts/AssignationGamAcc?gameAccId=%d' % a['id']).get_data(as_text=True)
assert 'id="gameName" name="gameName" value="%s"' % a['gameName'] in h and 'id="accId" name="accId" value="%d"' % a['id'] in h and 'title="打手"' in h and '系统开发员' not in h, '指派页未按本地角色渲染'
lst = J(c.get('/UserAjax/GetAllUserTableByGameName?gameName=%s&userRoleId=0&key=' % a['gameName'])); assert lst['count'] > 0, lst
uid_ = lst['data'][0]['id']
ok(J(c.post('/GameAccountsAjax/ZhiPaiGameAccount', data=dict(gameAccId=a['id'], userId=uid_))))
assert db.get('game_accounts', a['id'])['recUserName'] == lst['data'][0]['userName']
ok(J(c.post('/GameAccountsAjax/CleanRecGameAccount', data=dict(gameAccId=a['id']))))
assert db.get('game_accounts', a['id'])['recUserName'] == ''
print('OK 指派游戏号')

# 还原
db._local.conn = db.connect()
db.update('game_accounts', a['id'], dict(recUserName=a.get('recUserName', ''), recUserId=a.get('recUserId', 0), proStatus=a.get('proStatus', 10)))
for x in db.find('acc_logs', lambda x: x.get('accId') == a['id']): db.delete('acc_logs', x['id'])
db._local.conn.commit()
print('ALL POPUP OK')
