# 小程序维护页（/System/wechatappmange）：新闻/商品/分类/满减/会员折扣/积分商品/兑换/奖品/发放/抽奖设置 全链路
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
db.init()
c = appmod.app.test_client()
J = lambda r: r.get_json()
J(c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607')))
db._local.conn = db.connect()
ok = lambda r: (r['code'] > 0, r)[0] or (_ for _ in ()).throw(AssertionError(r))
MP = ('mp_news', 'mp_shop_items', 'mp_shop_types', 'mp_fulldec', 'mp_hydisc', 'mp_integral', 'mp_exchange', 'mp_awards', 'mp_award_grants')
SNAP = {coll: db.all_(coll) for coll in MP}; SNAP_AWARD = db.setting('award', {})
for coll in MP:
    for x in SNAP[coll]: db.delete(coll, x['id'])
db._local.conn.commit()

# 新闻
r = J(c.post('/SystemAjax/SavePublicNew', data=dict(title='测试公告', imgUrl='', conetnt='<p>正文内容</p>', contentTxt='正文内容', id=0, newsType=10))); ok(r)
lst = J(c.get('/SystemAjax/GetPublicNewsList?key=测试公告'))
assert lst['count'] == 1 and lst['data'][0]['newsType'] == 10 and lst['data'][0]['summary'] == '正文内容', lst
nid = lst['data'][0]['id']
r = J(c.post('/SystemAjax/GetPublicNews', data=dict(id=nid))); assert r['data']['Title'] == '测试公告' and r['data']['PublicNews_ID'] == nid, r
assert '正文内容' in c.get('/Public/News/%d' % nid).get_data(as_text=True)
r = J(c.post('/SystemAjax/SavePublicNew', data=dict(title='测试公告2', imgUrl='/x.png', conetnt='<p>改</p>', contentTxt='改', id=nid, newsType=20))); ok(r)
assert J(c.post('/SystemAjax/GetPublicNews', data=dict(id=nid)))['data']['NewsType'] == 20
assert J(c.post('/SystemAjax/SavePublicNew', data=dict(title='', conetnt='x')))['code'] == 0
print('OK 新闻')

# 商品 + 分类
def shop(**kw):
    f = dict(shopTitle='测试商品', gameName='王者荣耀', itemType='', shopYPrice='100', shopPrice='88', itemPic='/a.png', shopItemId=0)
    f.update(kw)
    return J(c.post('/SystemAjax/SaveShopItem', data=dict(param=json.dumps(f, ensure_ascii=False), contentTxt='<p>详情</p>')))
assert shop(itemPic='')['code'] == 0 and '商品图' in shop(itemPic='')['msg']
ok(shop()); ok(shop(shopTitle='商品B', itemType='皮肤'))
lst = J(c.get('/SystemAjax/GetShopItemList?gameName=王者荣耀'))
first = [x for x in lst['data'] if x['Shop_Title'] == '测试商品'][0]
assert lst['count'] == 2 and first['Status'] == 20 and first['ShopType'] == '默认', lst
sid = [x for x in lst['data'] if x['Shop_Title'] == '商品B'][0]['ShopItem_Id']
assert J(c.get('/SystemAjax/GetShopItemList?gameName=全部'))['count'] >= 2
t = J(c.post('/SystemAjax/GetWechatAppShopItemTypeList', data=dict(gameName='王者荣耀'))); assert t['data'] == ['皮肤'], t
ok(J(c.post('/SystemAjax/EditWechatAppShopItemTypeName', data=dict(yname='皮肤', newname='段位'))))
assert J(c.post('/SystemAjax/GetShopItemInfoById', data=dict(id=sid)))['msg']['ShopType'] == '段位'
info = J(c.post('/SystemAjax/GetShopItemInfoById', data=dict(id=sid)))['msg']; assert info['Price'] == 88 and info['Shop_Deatils'] == '<p>详情</p>', info
ok(J(c.post('/SystemAjax/UpDownShopItem', data=dict(id=sid, type=10))))
assert [x for x in J(c.get('/SystemAjax/GetShopItemList?gameName=王者荣耀'))['data'] if x['ShopItem_Id'] == sid][0]['Status'] == 10
ok(J(c.post('/SystemAjax/ChangeWehcatAppShopItemIsNeedGroup', data=dict(shopId=sid))))
ok(J(c.post('/SystemAjax/ModityShopItemSellCount', data=dict(id=sid, value=7))))
row = [x for x in J(c.get('/SystemAjax/GetShopItemList?gameName=王者荣耀'))['data'] if x['ShopItem_Id'] == sid][0]
assert row['IsNeedGroup'] == 'Y' and row['Sell_Count'] == 7, row
ok(J(c.post('/SystemAjax/DelWechatAppShopItemTypeName', data=dict(typeName='段位'))))
assert J(c.post('/SystemAjax/GetShopItemInfoById', data=dict(id=sid)))['msg']['ShopType'] == '默认'
print('OK 商品/分类')

# 满减 / 会员折扣
assert J(c.post('/SystemAjax/SaveWechatAppShopFulDec', data=dict(id=0, shopItemId=sid, fullValue=100, decValue=100)))['code'] == 0
ok(J(c.post('/SystemAjax/SaveWechatAppShopFulDec', data=dict(id=0, shopItemId=sid, fullValue=100, decValue=10))))
ok(J(c.post('/SystemAjax/SaveWechatAppHyDisc', data=dict(id=0, hyName='黄金会员', decValue=9.5))))
assert J(c.post('/SystemAjax/SaveWechatAppHyDisc', data=dict(id=0, hyName='黄金会员', decValue=9)))['code'] == 0
d = J(c.get('/SystemAjax/GetWechatAppShopFulDecList'))
assert d['fullDecData'][-1]['id2'] == sid and d['fullDecData'][-1]['id3'] == 100 and d['hyDisCData'][-1]['str1'] == '黄金会员' and d['hyDisCData'][-1]['d1'] == 9.5, d
fid, hid = d['fullDecData'][-1]['id'], d['hyDisCData'][-1]['id']
ok(J(c.post('/SystemAjax/SaveWechatAppHyDisc', data=dict(id=hid, hyName='黄金会员', decValue=9))))
ok(J(c.post('/SystemAjax/DelWechatAppShopFulDec', data=dict(id=fid)))); ok(J(c.post('/SystemAjax/DelWechatAppHyDisc', data=dict(id=hid))))
print('OK 满减/会员折扣')

# 积分商品 / 兑换
def integ(**kw):
    f = dict(intral_shopTitle='10元券', ctype=20, depositoryNumber=5, needIntegral=100, faceValue=10, available=50, itemPic3='/c.png', integralCommodityId=0)
    f.update(kw)
    return J(c.post('/SystemAjax/SaveIntegralCommodity', data=dict(param=json.dumps(f, ensure_ascii=False), contentTxt='<p>说明</p>')))
assert integ(available='')['code'] == 0
ok(integ()); ok(integ(intral_shopTitle='实体周边', ctype=10, available=''))
lst = J(c.get('/SystemAjax/GetIntegralCommodityList'))
assert lst['count'] == 2 and all(x['Status'] == 20 and x['coverImage'] == '/c.png' for x in lst['data']), lst
cid = [x for x in lst['data'] if x['cname'] == '10元券'][0]['cid']
info = J(c.post('/SystemAjax/GetIntegarlItemInfoById', data=dict(id=cid)))['msg']; assert info['availableAmount'] == 50 and info['commodityMask'] == '<p>说明</p>', info
byt = J(c.get('/SystemAjax/GetIntegralCommodityByTypeList?typeId=20')); assert byt['count'] == 1 and byt['data'][0]['cid'] == cid, byt
ok(J(c.post('/SystemAjax/UpDownIntegralItem', data=dict(id=cid, type=10))))
assert J(c.get('/SystemAjax/GetIntegralCommodityByTypeList?typeId=20'))['count'] == 0
ok(J(c.post('/SystemAjax/UpDownIntegralItem', data=dict(id=cid, type=20))))
# 兑换记录（本地造一条实体类）
eid = db.insert('mp_exchange', dict(cid=cid, cname='实体周边', ctype=10, needIntegral=100, faceValue=10, address='xx路1号', recName='测试', phone='13000000000', shipStatus=10, shipNo='', shipNo2='', remark=''))['id']
db._local.conn.commit()
lst = J(c.get('/SystemAjax/GetIntegralCommodityExchangeList?status=10&key=')); assert any(x['eid'] == eid for x in lst['data']), lst
assert J(c.get('/SystemAjax/GetIntegralCommodityExchangeList?status=20&key='))['count'] == 0
ok(J(c.post('/SystemAjax/SaveIntegralExChangeItem', data=dict(eid=eid, param=json.dumps(dict(expree='顺丰速运', expressNo='SF123', shipStatus=20, shipRemark='已寄'), ensure_ascii=False)))))
info = J(c.post('/SystemAjax/GetIntegarlExchangeItemInfoById', data=dict(id=eid)))['msg']
assert info['ShipStatus'] == 20 and info['ShipNo'] == '顺丰速运' and info['ShipNo2'] == 'SF123' and info['Remark'] == '已寄', info
assert J(c.get('/SystemAjax/GetIntegralCommodityExchangeList?status=20&key=SF123'))['count'] == 1
print('OK 积分商品/兑换')

# 奖品 / 发放 / 抽奖设置
assert J(c.post('/SystemAjax/SaveAward', data=dict(id=0, title='优惠券奖', atype=10, cid=0, range=10, prizeimg='', prizeValue=0, awardunit='积分', stockNumber=5)))['code'] == 0
ok(J(c.post('/SystemAjax/SaveAward', data=dict(id=0, title='优惠券奖', atype=10, cid=cid, range=10, prizeimg='', prizeValue=0, awardunit='积分', stockNumber=5))))
ok(J(c.post('/SystemAjax/SaveAward', data=dict(id=0, title='谢谢参与', atype=20, cid=0, range=80, prizeimg='', prizeValue=0, awardunit='积分', stockNumber=0))))
assert J(c.post('/SystemAjax/SaveAward', data=dict(id=0, title='超概率', atype=0, cid=0, range=20, prizeimg='', prizeValue=0, awardunit='积分', stockNumber=1)))['code'] == 0
lst = J(c.get('/SystemAjax/GetAllLotteryAwardList')); assert lst['count'] == 2 and lst['data'][0]['AwardType'] == 10 and lst['data'][0]['RangeValue'] == 10, lst
aid = lst['data'][0]['LotteryAwardId']
gid = db.insert('mp_award_grants', dict(LotteryAwardId=aid, AwardTitle='优惠券奖', AwardType=10, UseIntegral=100, SurplusIntegral=50, Moblie='13000000000', GrantStatus=0, GrantTimeStr='', Remark=''))['id']
db._local.conn.commit()
g = J(c.get('/SystemAjax/GetLotteryAwardGrantList?grantStatus=0&key=')); assert g['count'] == 1 and g['total']['waitGranCount'] == 1 and g['total']['totalUseValue'] == 100, g
ok(J(c.post('/SystemAjax/DeliverAward', data=dict(id=gid))))
assert J(c.post('/SystemAjax/DeliverAward', data=dict(id=gid)))['code'] == 0
g = J(c.get('/SystemAjax/GetLotteryAwardGrantList?grantStatus=10&key=')); assert g['count'] == 1 and g['data'][0]['GrantStatus'] == 10 and g['total']['waitGranCount'] == 0, g
assert J(c.get('/SystemAjax/GetLotteryAwardGrantList?grantStatus=-1&key='))['count'] == 1
assert J(c.post('/SystemAjax/SaveAwardSetting', data=dict(awardStatus=10, awardamount=100, awardcount=0, awardWay=1, awardunit='爆肝值')))['code'] == 0
ok(J(c.post('/SystemAjax/SaveAwardSetting', data=dict(awardStatus=10, awardamount=100, awardcount=3, awardWay=1, awardunit='爆肝值'))))
h = c.get('/System/wechatappmange').get_data(as_text=True)
assert re.search(r'name="awardStatus" value="10"[^>]*checked', h) and re.search(r'name="awardWay" value="1"[^>]*checked', h) and 'value="爆肝值"' in h and 'value="100"' in h and 'value="3"' in h, '抽奖设置未回显'
print('OK 奖品/发放/抽奖设置回显')

# 清理
db._local.conn = db.connect()
for coll in MP:
    for x in db.all_(coll):
        db.delete(coll, x['id'])
    for x in SNAP[coll]:
        db.insert_with_id(coll, x['id'], dict((k, v) for k, v in x.items() if k not in ('id',)))
db.set_setting('award', SNAP_AWARD); db._local.conn.commit()
print('ALL MINIAPP OK')
