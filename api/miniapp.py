# -*- coding: utf-8 -*-
"""客户端内容管理（兼容路由 /System/wechatappmange）：新闻、商品、商品分类、满减/会员折扣、积分商品与兑换、抽奖奖品与发放、抽奖设置
字段名与状态值均按原站 wechatappmange.js 的取值：商品/积分商品 Status 20=已上架 10=已下架；兑换 shipStatus 10=待发货 20=已发货；
奖品发放 GrantStatus 0=未发放 10=已发放；奖品 AwardType 0=自定义 10=优惠券 15=充积分 18=充余额 20=未中奖；新闻 newsType 10=公告 20=Banner"""
import json
from flask import jsonify, request, Response, g
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, log, now


def _param():
    p = P()
    try:
        return json.loads(p.get('param') or '{}')
    except ValueError:
        return {}


def _num(v, cast=float, default=0):
    try:
        return cast(v)
    except (TypeError, ValueError):
        return default


# ---------------- 新闻 / 公告 ----------------
@route('/SystemAjax/GetPublicNewsList')
def news_list():
    p = P()
    rows = db.find('mp_news', lambda r: db.like(r, ['title', 'summary'], p.get('key') or p.get('keywords') or p.get('keyword')), 'createTime')
    return paged([dict(r, id=r['id'], url='/Public/News/%s' % r['id'], CreateTime=(r.get('createTime') or '')[:10]) for r in rows])


@route('/Public/News', public=True)
def news_view():
    from html import escape
    r = db.get('mp_news', _num(getattr(g, 'path_arg', None) or P().get('id'), int))
    if not r:
        return Response('<h3 style="text-align:center;margin-top:40px">文章不存在</h3>', mimetype='text/html')
    # 标题是纯文本，必须转义；正文是后台富文本，保留原样
    title = escape(r.get('title') or '')
    html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title>' \
           '<style>body{max-width:720px;margin:0 auto;padding:16px;font:14px/1.7 -apple-system,Microsoft YaHei,sans-serif;color:#333}img{max-width:100%%}h2{font-size:20px}</style></head>' \
           '<body><h2>%s</h2><div style="color:#999;font-size:12px">%s</div><hr>%s</body></html>' % (title, title, (r.get('createTime') or '')[:16], r.get('content') or '')
    return Response(html, mimetype='text/html')


@route('/SystemAjax/SavePublicNew')
def save_news():
    p = P()
    title = (p.get('title') or '').strip()
    if not title:
        return json_err('标题不能为空')
    content = p.get('conetnt') or p.get('content') or ''
    if not content.strip():
        return json_err('文章内容不能为空')
    txt = (p.get('contentTxt') or '').strip()
    d = dict(title=title, newsType=p.int('newsType') or 10, coverImg=p.get('imgUrl') or '', content=content, summary=(txt or content)[:80])
    nid = p.int('id')
    if nid and db.get('mp_news', nid):
        db.update('mp_news', nid, d)
        log('客户端内容', '修改文章 %s' % title)
        return json_ok('修改成功')
    db.insert('mp_news', d)
    log('客户端内容', '发布文章 %s' % title)
    return json_ok('发布成功')


@route('/SystemAjax/GetPublicNews')
def get_news():
    r = db.get('mp_news', P().int('id'))
    if not r:
        return json_err('记录不存在')
    return json_ok('', data=dict(Title=r.get('title'), NewsType=r.get('newsType'), PublicNews_ID=r['id'], CoverImg=r.get('coverImg'), NewsContent=r.get('content')))


@route('/SystemAjax/DelPublicNewsByIds')
def del_news():
    n = 0
    for x in P().ids('ids'):
        if db.get('mp_news', x):
            db.delete('mp_news', x)
            n += 1
    return json_ok('删除成功') if n else json_err('记录不存在')


# ---------------- 商品 ----------------
def _shop_row(r):
    return dict(ShopItem_Id=r['id'], id=r['id'], Shop_Title=r.get('title'), GameName=r.get('gameName'), ShopType=r.get('itemType') or '默认', IsNeedGroup=r.get('isNeedGroup', 'N'),
                Price=r.get('price'), Yprice=r.get('yprice'), Shop_Img=r.get('img'), Sell_Count=r.get('sellCount', 0), Status=r.get('status', 20), createTimeStr=(r.get('createTime') or '')[:16])


@route('/SystemAjax/GetShopItemList')
def shop_item_list():
    p = P()
    game = p.get('gameName') or p.get('selectGameName')
    if game == '全部':
        game = ''
    rows = db.find('mp_shop_items', lambda r: (not game or r.get('gameName') == game) and db.like(r, ['title'], p.get('key') or p.get('keyword')), 'createTime')
    return paged([_shop_row(r) for r in rows])


def _type_names(game):
    names = []
    for r in db.all_('mp_shop_types'):
        if (not game or r.get('gameName') in (game, '')) and r.get('name') not in names:
            names.append(r.get('name'))
    for it in db.all_('mp_shop_items'):
        t = it.get('itemType')
        if t and t != '默认' and (not game or it.get('gameName') == game) and t not in names:
            names.append(t)
    return names


@route('/SystemAjax/SaveShopItem')
def save_shop_item():
    p = P()
    f = _param()
    title = (f.get('shopTitle') or '').strip()
    if not title:
        return json_err('商品标题不能为空')
    if not f.get('itemPic'):
        return json_err('请上传商品图')
    if not (p.get('contentTxt') or '').strip():
        return json_err('商品详情内容不能为空')
    game = f.get('gameName') or '全部'
    itype = (f.get('itemType') or '').strip() or '默认'
    if itype != '默认' and itype not in _type_names(game):
        if len(_type_names(game)) >= 4:
            return json_err('每个游戏最多 4 个商品分类')
        db.insert('mp_shop_types', dict(name=itype, gameName=game))
    d = dict(title=title, gameName=game, itemType=itype, price=_num(f.get('shopPrice')), yprice=_num(f.get('shopYPrice')), img=f.get('itemPic') or '', details=p.get('contentTxt') or '')
    sid = _num(f.get('shopItemId'), int)
    if sid and db.get('mp_shop_items', sid):
        db.update('mp_shop_items', sid, d)
        return json_ok('修改成功')
    db.insert('mp_shop_items', dict(d, sellCount=0, status=20, isNeedGroup='N'))
    return json_ok('新增成功')


@route('/SystemAjax/GetShopItemInfoById')
def shop_item_info():
    r = db.get('mp_shop_items', P().int('id'))
    if not r:
        return json_err('商品不存在')
    return jsonify(dict(code=1, msg=dict(Shop_Title=r.get('title'), GameName=r.get('gameName'), ShopType=r.get('itemType'), Yprice=r.get('yprice'), Price=r.get('price'), Shop_Img=r.get('img'),
                                         Shop_Deatils=r.get('details')), data=None))


@route('/SystemAjax/UpDownShopItem')
def shop_updown():
    p = P()
    r = db.get('mp_shop_items', p.int('id'))
    if not r:
        return json_err('商品不存在')
    st = 20 if p.int('type') == 20 else 10
    db.update('mp_shop_items', r['id'], dict(status=st))
    return json_ok('已上架' if st == 20 else '已下架')


@route('/SystemAjax/ChangeWehcatAppShopItemIsNeedGroup')
def shop_need_group():
    r = db.get('mp_shop_items', P().int('shopId') or P().int('id'))
    if not r:
        return json_err('商品不存在')
    v = 'N' if r.get('isNeedGroup') == 'Y' else 'Y'
    db.update('mp_shop_items', r['id'], dict(isNeedGroup=v))
    return json_ok('下单时需要选排团' if v == 'Y' else '下单时不需要选排团')


@route('/SystemAjax/ModityShopItemSellCount')
def shop_sell_count():
    p = P()
    r = db.get('mp_shop_items', p.int('id'))
    if not r:
        return json_err('商品不存在')
    db.update('mp_shop_items', r['id'], dict(sellCount=max(0, p.int('value'))))
    return json_ok('修改成功')


@route('/SystemAjax/DelShopItem')
def del_shop_item():
    r = db.get('mp_shop_items', P().int('id'))
    if not r:
        return json_err('商品不存在')
    db.delete('mp_shop_items', r['id'])
    for x in db.find('mp_fulldec', lambda x: x.get('shopItemId') == r['id']):
        db.delete('mp_fulldec', x['id'])
    return json_ok('删除成功')


# ---------------- 商品分类（页面按游戏加载，最多 4 个） ----------------
@route('/SystemAjax/GetWechatAppShopItemTypeList')
def shop_type_list():
    game = P().get('gameName')
    if game == '全部':
        game = ''
    names = _type_names(game)
    return jsonify(dict(code=1, msg='', count=len(names), data=names))


@route('/SystemAjax/EditWechatAppShopItemTypeName')
def edit_shop_type():
    p = P()
    old, new = (p.get('yname') or '').strip(), (p.get('newname') or '').strip()
    if not new:
        return json_err('分类名称不能为空')
    if new in ('默认', '全部'):
        return json_err('分类名称不能为“默认”或“全部”')
    if old == new:
        return json_ok('修改成功')
    if new in _type_names(''):
        return json_err('已有同名分类')
    for r in db.find('mp_shop_types', lambda r: r.get('name') == old):
        db.update('mp_shop_types', r['id'], dict(name=new))
    for it in db.find('mp_shop_items', lambda x: x.get('itemType') == old):
        db.update('mp_shop_items', it['id'], dict(itemType=new))
    return json_ok('修改成功')


@route('/SystemAjax/DelWechatAppShopItemTypeName')
def del_shop_type():
    name = (P().get('typeName') or '').strip()
    if not name or name == '默认':
        return json_err('默认分类不能删除')
    for r in db.find('mp_shop_types', lambda r: r.get('name') == name):
        db.delete('mp_shop_types', r['id'])
    for it in db.find('mp_shop_items', lambda x: x.get('itemType') == name):
        db.update('mp_shop_items', it['id'], dict(itemType='默认'))
    return json_ok('删除成功，该分类下商品已归入默认分类')


# ---------------- 满减 / 会员折扣 ----------------
@route('/SystemAjax/GetWechatAppShopFulDecList')
def discount_lists():
    full = [dict(id=r['id'], id2=r.get('shopItemId') or 0, id3=r.get('fullValue'), id4=r.get('decValue')) for r in db.all_('mp_fulldec')]
    hy = [dict(id=r['id'], str1=r.get('hyName'), d1=r.get('decValue')) for r in db.all_('mp_hydisc')]
    return jsonify(dict(code=1, msg='', fullDecData=full, hyDisCData=hy))


@route('/SystemAjax/SaveWechatAppShopFulDec')
def save_fulldec():
    p = P()
    d = dict(shopItemId=p.int('shopItemId'), fullValue=p.float('fullValue'), decValue=p.float('decValue'))
    if d['fullValue'] <= 0:
        return json_err('请输入满多少金额')
    if d['decValue'] <= 0:
        return json_err('请输入减多少金额')
    if d['decValue'] >= d['fullValue']:
        return json_err('减的金额必须小于满的金额')
    rid = p.int('id')
    if rid and db.get('mp_fulldec', rid):
        db.update('mp_fulldec', rid, d)
        return json_ok('修改成功')
    db.insert('mp_fulldec', d)
    return json_ok('新增成功')


@route('/SystemAjax/DelWechatAppShopFulDec')
def del_fulldec():
    if not db.get('mp_fulldec', P().int('id')):
        return json_err('记录不存在')
    db.delete('mp_fulldec', P().int('id'))
    return json_ok('删除成功')


@route('/SystemAjax/SaveWechatAppHyDisc')
def save_hydisc():
    p = P()
    d = dict(hyName=(p.get('hyName') or '').strip(), decValue=p.float('decValue'))
    if not d['hyName']:
        return json_err('请输入会员等级完整名称')
    if not (0 < d['decValue'] <= 10):
        return json_err('折扣值应在 0 到 10 之间（如 9.5 表示 95 折）')
    rid = p.int('id')
    dup = db.first('mp_hydisc', lambda r: r.get('hyName') == d['hyName'] and r['id'] != rid)
    if dup:
        return json_err('该等级已设置过折扣')
    if rid and db.get('mp_hydisc', rid):
        db.update('mp_hydisc', rid, d)
        return json_ok('修改成功')
    db.insert('mp_hydisc', d)
    return json_ok('新增成功')


@route('/SystemAjax/DelWechatAppHyDisc')
def del_hydisc():
    if not db.get('mp_hydisc', P().int('id')):
        return json_err('记录不存在')
    db.delete('mp_hydisc', P().int('id'))
    return json_ok('删除成功')


# ---------------- 积分商品 / 兑换 ----------------
def _integral_row(r):
    return dict(cid=r['id'], id=r['id'], cname=r.get('cname'), ctype=r.get('ctype'), depositoryNumber=r.get('depositoryNumber'), needIntegral=r.get('needIntegral'), faceValue=r.get('faceValue'),
                availableAmount=r.get('availableAmount'), coverImage=r.get('coverImage'), exchangeCount=r.get('exchangeCount', 0), Status=r.get('status', 20), createTimeStr=(r.get('createTime') or '')[:16])


@route('/SystemAjax/GetIntegralCommodityList')
def integral_list():
    p = P()
    rows = db.find('mp_integral', lambda r: db.like(r, ['cname'], p.get('key') or p.get('keyword')), 'createTime')
    return paged([_integral_row(r) for r in rows])


@route('/SystemAjax/GetIntegralCommodityByTypeList')
def integral_by_type():
    t = P().int('typeId')
    rows = db.find('mp_integral', lambda r: (not t or r.get('ctype') == t) and r.get('status', 20) == 20)
    return jsonify(dict(code=1, msg='', count=len(rows), data=[dict(cid=r['id'], cname=r.get('cname')) for r in rows]))


@route('/SystemAjax/SaveIntegralCommodity')
def save_integral():
    p = P()
    f = _param()
    name = (f.get('intral_shopTitle') or '').strip()
    if not name:
        return json_err('积分商品标题不能为空')
    ctype = _num(f.get('ctype'), int, 10)
    if f.get('needIntegral') in (None, ''):
        return json_err('请输入兑换所需积分')
    if f.get('faceValue') in (None, ''):
        return json_err('请输入商品面值/抵扣额')
    if ctype == 20 and f.get('available') in (None, ''):
        return json_err('满多少金额可用不能为空')
    if not (p.get('contentTxt') or '').strip():
        return json_err('商品详情内容不能为空')
    d = dict(cname=name, ctype=ctype, depositoryNumber=_num(f.get('depositoryNumber'), int), needIntegral=_num(f.get('needIntegral'), int), faceValue=_num(f.get('faceValue')),
             availableAmount=_num(f.get('available')), coverImage=f.get('itemPic3') or '', commodityMask=p.get('contentTxt') or '')
    cid = _num(f.get('integralCommodityId'), int)
    if cid and db.get('mp_integral', cid):
        db.update('mp_integral', cid, d)
        return json_ok('修改成功')
    db.insert('mp_integral', dict(d, exchangeCount=0, status=20))
    return json_ok('新增成功')


@route('/SystemAjax/GetIntegarlItemInfoById')
def integral_info():
    r = db.get('mp_integral', P().int('id'))
    if not r:
        return json_err('商品不存在')
    return jsonify(dict(code=1, msg=dict(cname=r.get('cname'), ctype=r.get('ctype'), depositoryNumber=r.get('depositoryNumber'), needIntegral=r.get('needIntegral'), faceValue=r.get('faceValue'),
                                         availableAmount=r.get('availableAmount'), coverImage=r.get('coverImage'), commodityMask=r.get('commodityMask')), data=None))


@route('/SystemAjax/UpDownIntegralItem')
def integral_updown():
    p = P()
    r = db.get('mp_integral', p.int('id'))
    if not r:
        return json_err('商品不存在')
    st = 20 if p.int('type') == 20 else 10
    db.update('mp_integral', r['id'], dict(status=st))
    return json_ok('已上架' if st == 20 else '已下架')


@route('/SystemAjax/DeldelIntegralItem')
def del_integral():
    r = db.get('mp_integral', P().int('id'))
    if not r:
        return json_err('商品不存在')
    db.delete('mp_integral', r['id'])
    return json_ok('删除成功')


@route('/SystemAjax/GetIntegralCommodityExchangeList')
def exchange_list():
    p = P()
    st = p.int('status') or p.int('selectShipStatus')
    rows = db.find('mp_exchange', lambda r: (not st or r.get('shipStatus') == st) and db.like(r, ['cname', 'recName', 'phone', 'shipNo2'], p.get('key') or p.get('keyword')), 'createTime')
    return paged([dict(r, eid=r['id'], createTime=(r.get('createTime') or '')[:16]) for r in rows])


@route('/SystemAjax/GetIntegarlExchangeItemInfoById')
def exchange_info():
    r = db.get('mp_exchange', P().int('id'))
    if not r:
        return json_err('记录不存在')
    return jsonify(dict(code=1, msg=dict(NeedIntegral=r.get('needIntegral'), Remark=r.get('remark'), ShipNo=r.get('shipNo'), ShipNo2=r.get('shipNo2'), ShipStatus=r.get('shipStatus')), data=None))


@route('/SystemAjax/SaveIntegralExChangeItem')
def save_exchange():
    p = P()
    f = _param()
    r = db.get('mp_exchange', p.int('eid'))
    if not r:
        return json_err('无法获取到发货编号，请刷新列表重新发货')
    if r.get('ctype') == 20:
        return json_err('该商品为抵扣类商品，已自动发放，无需手动操作')
    st = 20 if _num(f.get('shipStatus'), int, 20) == 20 else 10
    d = dict(shipNo=f.get('expree') or '无', shipNo2=(f.get('expressNo') or '').strip(), shipStatus=st, remark=(f.get('shipRemark') or '').strip())
    if st == 20 and r.get('shipStatus') != 20:
        d['shipTime'] = now()[:16]
    elif st == 10:
        d['shipTime'] = ''
    db.update('mp_exchange', r['id'], d)
    return json_ok('保存成功')


# ---------------- 抽奖奖品 / 发放 / 抽奖设置 ----------------
def _award_row(r):
    return dict(LotteryAwardId=r['id'], id=r['id'], AwardTitle=r.get('title'), AwardType=r.get('atype', 0), Cid=r.get('cid') or 0, RangeValue=r.get('range'), PrizeValue=r.get('prizeValue'),
                AwardUnit=r.get('awardunit'), StockCount=r.get('stockNumber'), PrizeImg=r.get('prizeimg'))


@route('/SystemAjax/GetAllLotteryAwardList')
def award_list():
    return paged([_award_row(r) for r in db.all_('mp_awards')])


@route('/SystemAjax/SaveAward')
def save_award():
    p = P()
    title = (p.get('title') or '').strip()
    if not title:
        return json_err('奖品名称不能为空')
    atype = p.int('atype')
    rng = p.float('range')
    if not (0 <= rng <= 100):
        return json_err('中奖概率须为 0-100 之间的整数')
    if atype == 10 and not p.int('cid'):
        return json_err('优惠券类奖品请选择对应的抵扣商品')
    if atype in (15, 18) and p.float('prizeValue') <= 0:
        return json_err('请输入奖励数，且大于0')
    stock = p.int('stockNumber')
    if stock < 0:
        return json_err('库存数最小为0')
    rid = p.int('id')
    others = [r for r in db.all_('mp_awards') if r['id'] != rid]
    if sum(_num(r.get('range')) for r in others) + rng > 100:
        return json_err('所有奖品的中奖概率合计不能超过 100%%（当前其他奖品合计 %g%%）' % sum(_num(r.get('range')) for r in others))
    d = dict(title=title, atype=atype, cid=p.int('cid'), range=rng, prizeimg=p.get('prizeimg') or '', prizeValue=p.float('prizeValue'), awardunit=p.get('awardunit') or '', stockNumber=stock)
    if rid and db.get('mp_awards', rid):
        db.update('mp_awards', rid, d)
        return json_ok('修改成功')
    if len(others) >= 8:
        return json_err('最多设置 8 个奖品')
    db.insert('mp_awards', d)
    return json_ok('新增成功')


@route('/SystemAjax/DelAwardByIds')
def del_award():
    n = 0
    for x in P().ids('id'):
        if db.get('mp_awards', x):
            db.delete('mp_awards', x)
            n += 1
    return json_ok('删除成功') if n else json_err('记录不存在')


@route('/SystemAjax/GetLotteryAwardGrantList')
def award_grant_list():
    p = P()
    gs = p.get('grantStatus')
    gs = None if gs in ('', '-1', None) else int(gs)
    rows = db.find('mp_award_grants', lambda r: (gs is None or int(r.get('GrantStatus') or 0) == gs) and db.like(r, ['AwardTitle', 'Moblie', 'Remark'], p.get('key') or p.get('keyword')), 'createTime')
    return paged([dict(r, LotteryAwardGrantId=r['id'], CreateTimeStr=(r.get('createTime') or '')[:16]) for r in rows],
                 total=dict(totalCount=len(rows), totalUseValue=sum(_num(r.get('UseIntegral')) for r in rows), waitGranCount=len([r for r in rows if int(r.get('GrantStatus') or 0) != 10])))


@route('/SystemAjax/DeliverAward')
def deliver_award():
    n = 0
    for x in P().ids('id'):
        r = db.get('mp_award_grants', x)
        if r and int(r.get('GrantStatus') or 0) != 10:
            db.update('mp_award_grants', x, dict(GrantStatus=10, GrantTimeStr=now()[:16]))
            n += 1
    return json_ok('已发放 %d 条' % n) if n else json_err('没有待发放的记录')


@route('/SystemAjax/SaveAwardSetting')
def save_award_setting():
    p = P()
    amount, count = p.int('awardamount'), p.int('awardcount')
    if amount < 0:
        return json_err('满足条件金额不能小于0')
    if count < 1:
        return json_err('满足条件每次不能少于1次抽奖')
    unit = (p.get('awardunit') or '').strip()
    if not unit:
        return json_err('奖品单位不能为空')
    cur = db.setting('award', {})
    cur.update(dict(awardStatus='10' if p.get('awardStatus') == '10' else '0', awardamount=str(amount), awardcount=str(count), awardWay='1' if p.get('awardWay') == '1' else '0', awardunit=unit))
    db.set_setting('award', cur)
    return json_ok('保存成功')
