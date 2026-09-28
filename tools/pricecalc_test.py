# 报价器：段位阶梯 / 分数区间 / 基础参数 / 计算报价 全链路
import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
c = appmod.app.test_client()
J = lambda r: r.get_json()
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))

# 页面
for u in ('/Game/pricecalculator', '/Game/pricecalculator?gameName=英雄联盟手游', '/Game/pricecalculatorsetting', '/Game/commonpricesetting?gameName=英雄联盟手游'):
    h = c.get(u).get_data(as_text=True); assert 'layui' in h, u
assert 'value="英雄联盟手游"' in c.get('/Game/pricecalculator?gameName=英雄联盟手游').get_data(as_text=True)
assert 'value="王者荣耀"' in c.get('/Game/pricecalculator').get_data(as_text=True)
print('OK 页面')

# 王者荣耀 段位阶梯自动生成
r = J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=王者荣耀&project=段位'))
assert r['count'] == 3 * 3 + 3 * 3 + 4 * 4 + 4 * 4 + 5 * 5 + 5 * 5 + 50, r['count']
rows = r['data']
assert rows[0]['LeveName1'] == '青铜3' and rows[0]['LeveName2'] == '1星' and rows[-1]['LeveName1'] == '王者' and rows[-1]['LeveName2'] == '50星'
qt3 = [x for x in rows if x['LeveName1'] == '青铜3']; qt2 = [x for x in rows if x['LeveName1'] == '青铜2']
# 先把演示价清零（演示数据由 seed_calc_demo 写入，结束后恢复）
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in rows), ctype=20, value=0))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in rows), ctype=10, value=0))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in rows), ctype=30, value=0))))
# 整段价格：青铜3 整段 30 元 / 3 小时；青铜2 整段 60 元；王者每星 10 元
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt3), ctype=20, value=30))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt3), ctype=30, value=3))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt2), ctype=20, value=60))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in qt2), ctype=10, value=90))))
assert J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=qt3[0]['PriceCalculatorId'], ctype=20, value=-1)))['code'] == 0
wz = [x for x in rows if x['LeveName1'] == '王者']
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in wz), ctype=20, value=10))))
r = J(c.post('/GameAjax/GetPriceCalculatorSettingPriceDW', data=dict(gameName='王者荣耀', project='段位')))
assert [x for x in r['data'] if x['LeveName1'] == '青铜3'][0]['DAmount'] == 30 and [x for x in r['data'] if x['LeveName1'] == '王者'][0]['DAmount'] == 10
print('OK 段位阶梯 / 整段价格')

# 基础参数：利润 10%，苹果 +20%，套餐 2 个，首单固定 5 元，挽留 8.5 折，铭文 青铜 p1=50%
form = {'dw_profit': '10', 'dw_iosPercent': '20', 'dw_packgeName': '大神代练套餐', 'dw_packgeName1': '普通代练', 'dw_packgePar1': '0', 'dw_pkmark1': '(不指定英雄)', 'dw_ServiceType1': '10',
        'dw_packgeName2': '指定英雄', 'dw_packgePar2': '50', 'dw_pkmark2': '', 'dw_ServiceType2': '10', 'dw_packgeName3': '陪练', 'dw_packgePar3': '0', 'dw_ServiceType3': '20',
        'dw_stayPackgeName': '挽留价', 'dw_stayPar': '8.5', 'dw_stayWords': '亲，这是最低价了', 'dw_words': '#代练内容#\n#套餐价格#\n耗时#代练耗时#小时\n#首单内容#',
        'dw_firstOrderValue': '5', 'dw_firstOrderModel': '1', 'dw_firstOrderAppendModel': '1', 'dw_firstOrderMark': '★{project}★首单特价只需{price}元', 'qt1': '50', 'qt2': '0', 'qt3': '0', 'qt4': '0', 'qt5': '0'}
assert J(c.post('/GameAjax/SavePriceCalculatorSettingPriceParamByDwBase', data=dict(gameName='王者荣耀', project='段位', param=json.dumps(dict(form, dw_stayPar='12'), ensure_ascii=False))))['code'] == 0
ok(J(c.post('/GameAjax/SavePriceCalculatorSettingPriceParamByDwBase', data=dict(gameName='王者荣耀', project='段位', param=json.dumps(form, ensure_ascii=False)))))
b = J(c.post('/GameAjax/GetPriceCalculatorSettingPriceParamByBase', data=dict(gameName='王者荣耀', project='段位')))
m = json.loads(b['data']['BaseSetting'])
assert m['profit_rate'] == 10 and m['packgeName2'] == '指定英雄' and m['packge_rate2'] == 50 and m['stay_rate'] == 8.5 and m['packge_ServiceType3'] == 20 and m['firstOrderModel'] == 1, m
assert [x for x in m['mingwen'] if x['ptitle'] == '青铜'][0]['p1'] == 50
pk = J(c.post('/GameAjax/GetPriceSettPackgeName', data=dict(gameName='王者荣耀', project='段位')))
assert pk['data'] == ['普通代练', '指定英雄', '陪练'], pk
assert J(c.post('/GameAjax/GetPriceCalculatorSettingPriceParamByBase', data=dict(gameName='王者荣耀', project='巅峰赛')))['data']['BaseSetting'] == ''
print('OK 基础参数')

# 计算：青铜3 1星 → 青铜2 2星 = 青铜3 2星,3星 (2×10) + 青铜2 1星,2星 (2×20) = 60；利润10% → 66
st, et = qt3[0]['PriceCalculatorId'], qt2[1]['PriceCalculatorId']
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='段位', serviceType=10, st=st, et=et, fst=0, fet=0, mw='', priceType='', ssd='', esd='', platfrom=0)))
ok(r); d = r['data']
assert len(d) == 3 and d[0]['packgeName'] == '普通代练' and d[0]['price'] == 66 and d[0]['project'] == '青铜3/1星-青铜2/2星' and d[0]['packgeMark'] == '(不指定英雄)', d
assert d[1]['price'] == 99 and d[0]['hours'] == 2 and d[0]['firstOrderPrice'] == 5 and d[0]['firstOrderMark'] == '★青铜3/1星-青铜2/2星★首单特价只需5元', d
assert d[2]['packgeName'] == '陪练' and d[2]['price'] == round(2 * 30 * 1.1, 2), d[2]   # 陪练套餐按陪练价：青铜2 陪练整段 90 → 每星 30
# 苹果 +20%、铭文区间1（青铜 +50%）
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='段位', serviceType=10, st=st, et=et, fst=0, fet=0, mw=1, priceType='', platfrom=1)))
assert r['data'][0]['price'] == round(60 * 1.5 * 1.1 * 1.2, 2), r['data'][0]
# 挽留折扣
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='段位', serviceType=10, st=st, et=et, priceType=10, platfrom=0)))
assert len(r['data']) == 1 and r['data'][0]['packgeName'] == '挽留价' and r['data'][0]['price'] == round(66 * 0.85, 2) and r['data'][0]['words'] == '亲，这是最低价了', r
# 王者 3星 → 王者 8星 = 5 × 10 × 1.1 = 55
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='段位', serviceType=10, st=wz[2]['PriceCalculatorId'], et=wz[7]['PriceCalculatorId'], platfrom=0)))
assert r['data'][0]['price'] == 55 and r['data'][0]['project'] == '王者/3星-王者/8星', r['data'][0]
print('OK 段位计算')

# 分数区间（巅峰赛）：添加两行 1000-1500 每分 0.1 元、1501-2000 每分 0.2 元
r = J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=0, ctype=10, value=1000, gameName='王者荣耀', project='巅峰赛'))); assert r['code'] > 0
rid = r['code']
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=rid, ctype=20, value=1500, gameName='王者荣耀', project='巅峰赛'))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=rid, ctype=30, value=0.1, gameName='王者荣耀', project='巅峰赛'))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=rid, ctype=40, value=0.01, gameName='王者荣耀', project='巅峰赛'))))
r2 = J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=0, ctype=10, value=1501, gameName='王者荣耀', project='巅峰赛')))['code']
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=r2, ctype=20, value=2000, gameName='王者荣耀', project='巅峰赛'))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=r2, ctype=30, value=0.2, gameName='王者荣耀', project='巅峰赛'))))
assert J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=r2, ctype=20, value='abc', gameName='王者荣耀', project='巅峰赛')))['code'] == 0
lst = J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=王者荣耀&project=巅峰赛'))
assert lst['count'] == 2 and lst['data'][0]['StartPoint'] == 1000 and lst['data'][0]['EndPoint'] == 1500 and lst['data'][1]['DAmount'] == 0.2, lst
# 1200 → 1700：1200-1500 300 分 ×0.1 = 30，1500-1700 200 分 ×0.2 = 40 → 70（无基础参数）
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='巅峰赛', serviceType=10, st=1200, et=1700, platfrom=0)))
assert r['data'][0]['price'] == 70 and r['data'][0]['hours'] == 3 and r['data'][0]['project'] == '巅峰赛 1200-1700', r['data'][0]
assert J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='王者荣耀', project='巅峰赛', serviceType=10, st=1700, et=1200)))['code'] == 0
ok(J(c.post('/GameAjax/DelPriceCalculatorSettingPriceParamByDFS', data=dict(sid=r2))))
assert J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=王者荣耀&project=巅峰赛'))['count'] == 1
print('OK 分数区间')

# 其他游戏：初始化 / 删除 / 上分
r = J(c.post('/GameAjax/GetPriceCalculatorSettingPriceDW', data=dict(gameName='英雄联盟手游', project='段位'))); assert r['code'] == 0
ok(J(c.post('/GameAjax/InitializationGamePriceSettingParas', data=dict(gameName='英雄联盟手游', project='段位'))))
assert J(c.post('/GameAjax/InitializationGamePriceSettingParas', data=dict(gameName='英雄联盟手游', project='段位')))['code'] == 0
r = J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=英雄联盟手游&project=段位'))
rows = r['data']; assert rows[0]['LeveName1'] == '黑铁4' and rows[-1]['LeveName1'] == '王者上分' and [x for x in rows if x['LeveName1'] == '翡翠1'].__len__() == 5, r['count']
zs1 = [x for x in rows if x['LeveName1'] == '钻石1']; dsf = [x for x in rows if x['LeveName1'] == '大师上星'][0]
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in zs1), ctype=20, value=100))))
# 大师上星 的分数区间：1-100 星 每星 3 元
sid = J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=0, ctype=10, value=1, gameName='英雄联盟手游', project='分数区间-大师上星')))['code']
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=sid, ctype=20, value=100, gameName='英雄联盟手游', project='分数区间-大师上星'))))
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS', data=dict(sid=sid, ctype=30, value=3, gameName='英雄联盟手游', project='分数区间-大师上星'))))
# 钻石1 1星 → 大师 20 星：钻石1 剩 4 星 × 20 + 大师上星行(0) + 20 星 × 3 = 140
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='英雄联盟手游', project='段位', serviceType=10, st=zs1[0]['PriceCalculatorId'], et=dsf['PriceCalculatorId'], fst=0, fet=20, platfrom=0)))
assert r['data'][0]['price'] == 140 and r['data'][0]['project'] == '钻石1/1星-大师上星/20星', r['data'][0]
ok(J(c.post('/GameAjax/DelGamePriceDwSetting', data=dict(sid=rows[0]['PriceCalculatorId'], eid=rows[-1]['PriceCalculatorId']))))
assert J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=英雄联盟手游&project=段位'))['count'] == 0
assert J(c.post('/GameAjax/InitializationGamePriceSettingParas', data=dict(gameName='不存在的游戏', project='段位')))['code'] == 0
# 英雄联盟 胜点折算：黑铁4 30胜点 → 黑铁2 = 黑铁3(50) ×0.7 + 黑铁2(50) = 85
ok(J(c.post('/GameAjax/InitializationGamePriceSettingParas', data=dict(gameName='英雄联盟', project='段位'))))
rows = J(c.get('/GameAjax/GetSystemPriceCalculatorByGame?game=英雄联盟&project=段位'))['data']
ok(J(c.post('/GameAjax/ChangePriceCalculatorSettingPriceParam', data=dict(idx=','.join(str(x['PriceCalculatorId']) for x in rows[:4]), ctype=20, value=50))))
r = J(c.post('/GameAjax/GetCalculationPrice', data=dict(gameName='英雄联盟', project='段位', serviceType=10, st=rows[0]['PriceCalculatorId'], et=rows[2]['PriceCalculatorId'], ssd=30, esd='', platfrom=0)))
assert r['data'][0]['price'] == 85 and r['data'][0]['project'] == '黑铁4-黑铁2', r['data'][0]
# 晋级赛系数
ok(J(c.post('/GameAjax/InitLOL_JinjiData')))
lj = J(c.post('/GameAjax/GetLolJinjiDataList')); assert lj['count'] == 8 and lj['data'][0]['LeveName1'] == '0胜0负'
ok(J(c.post('/GameAjax/AddChangeGamePriceLOLJinji', data=dict(pid=lj['data'][1]['PriceCalculatorId'], names='1胜0负', dfee='-5', pfee=''))))
assert J(c.post('/GameAjax/AddChangeGamePriceLOLJinji', data=dict(pid=lj['data'][1]['PriceCalculatorId'], names='1胜0负', dfee='x', pfee='')))['code'] == 0
assert J(c.post('/GameAjax/GetLolJinjiDataList'))['data'][1]['DAmount'] == '-5'
ok(J(c.post('/GameAjax/DelGamePriceLOLJinji', data=dict(pid=lj['data'][0]['PriceCalculatorId']))))
assert J(c.post('/GameAjax/GetLolJinjiDataList'))['count'] == 7
print('OK 其他游戏初始化 / 上分 / 胜点 / 晋级赛')

# 清理
db._local.conn = db.connect()
for coll in ('price_calc', 'price_lol_jinji'):
    for x in db.all_(coll):
        db.delete(coll, x['id'])
for k in ('pricebase:王者荣耀:段位',):
    db.set_setting(k, {})
db._local.conn.commit()
# 恢复客户端演示价（不能包在 test_request_context 里，否则写入落到另一条连接上不会提交）
import seed
seed.seed_calc_demo()
db._local.conn.commit()
print('ALL PRICECALC OK')
