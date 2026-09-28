# -*- coding: utf-8 -*-
"""客户填单（/Order/ClientOrderGenerate）：客服先填最基本信息生成链接，客户打开公开页补充账号资料后生成订单；
填单设置（成功后提示语 / 展示图片 / 是否显示查订单进度入口）存 kv clientWriteOrder，字段名与原站一致：mark / pic / swtich"""
import secrets
from flask import jsonify, request, render_template, redirect
import db
from . import route, P, json_ok, json_err, table, current_user, uname, uid, log, now, S
from .game import resolve_game
from .order import find_order, new_order_id, add_log, serialize
from integrations.wecom import publish_order


def _link(key):
    return request.host_url.rstrip('/') + '/Public/WriteOrder?key=' + key


@route('/SystemAjax/SaveClientWriteOrderSetting')
def save_client_setting():
    p = P()
    mark = (p.get('mark') or '').strip()
    if not mark:
        return json_err('请填写成功后提示语')
    cur = db.setting('clientWriteOrder', {})
    cur.update(dict(mark=mark, pic=p.get('pic') or '', swtich='N' if p.get('swtich') == 'N' else 'Y'))
    db.set_setting('clientWriteOrder', cur)
    return json_ok('保存成功')


@route('/OrderAjax/GenerateCustomerOrderAjax')
def generate_link():
    p = P()
    gm = resolve_game(p.get('gameName'))
    if not gm:
        return json_err('游戏名称不可为空')
    if not (p.get('orderSoure') or '').strip():
        return json_err('订单来源不可为空')
    if p.get('price') in (None, ''):
        return json_err('价格不可为空')
    try:
        price = float(p.get('price'))
    except ValueError:
        return json_err('价格格式不正确')
    key = secrets.token_hex(8)
    d = dict(key=key, gameId=gm['id'], gameName=gm['gameName'], project=(p.get('project') or '').strip(), orderSoure=p.get('orderSoure'), soureOrderId=(p.get('soureOrderId') or '').strip(),
             price=price, day=p.float('day'), hours=p.float('hours'), ww=(p.get('ww') or '').strip(), creator=uname(), creatorId=uid(), status='待客户填写', orderId='', link=_link(key))
    db.insert('customer_order_links', d)
    log('录单', '生成客户填单链接 %s' % gm['gameName'], gameName=gm['gameName'], soureOrderId=d['soureOrderId'])
    return json_ok('生成成功，请把链接发给客户', data=d['link'])


@route('/OrderAjax/GetGeneRateCustomerOrderLogList')
def link_list():
    rows = db.find('customer_order_links', None, 'createTime')
    data = [dict(str1=(r.get('orderId') or ('待填写 ' + r['key'])), str2=r.get('gameName'), str3=r.get('project'), str4=r.get('soureOrderId'), str5=r.get('price'), str6=r.get('creator'),
                 str7=(r.get('createTime') or '')[:16], str8=r.get('link'), status=r.get('status'), trade_type=0) for r in rows]
    return jsonify(dict(code=0, msg='', count=len(data), data=data))


# ---------------- 公开页：客户补充资料 ----------------
def _cfg():
    c = db.setting('clientWriteOrder', {})
    return dict(mark=c.get('mark') or '资料已提交，我们会尽快为您安排！', pic=c.get('pic') or '', swtich=c.get('swtich', 'Y'))


@route('/Public/WriteOrder', public=True)
def write_order_page():
    key = (P().get('key') or '').strip()
    lk = db.first('customer_order_links', lambda r: r.get('key') == key) if key else None
    gm = db.get('games', lk['gameId']) if lk else None
    areas = db.find('game_data', lambda r: r.get('gameId') == (gm or {}).get('id') and r.get('type') == 20) if gm else []
    def fmt(v):
        try:
            v = float(v)
            return str(int(v)) if v == int(v) else ('%g' % v)
        except (TypeError, ValueError):
            return v
    return render_template('Public/WriteOrder.html', lk=lk, gm=gm, areas=areas, cfg=_cfg(), company=db.system_info().get('company', ''), done=(lk or {}).get('status') == '已生成订单', fmt=fmt)


@route('/Public/SubmitWriteOrder', public=True)
def write_order_submit():
    p = P()
    lk = db.first('customer_order_links', lambda r: r.get('key') == (p.get('key') or '').strip())
    if not lk:
        return json_err('链接无效或已失效')
    if lk.get('status') == '已生成订单':
        return json_err('该链接的资料已提交过，无需重复提交')
    gm = db.get('games', lk['gameId'])
    if not gm:
        return json_err('游戏不存在')
    acc, pwd, role, mob = (p.get('gameAcc') or '').strip(), (p.get('gamePwd') or '').strip(), (p.get('gameRole') or '').strip(), (p.get('moblie') or '').strip()
    if gm.get('isNotAccPwd') != 'Y' and not acc:
        return json_err('请填写游戏账号')
    if gm.get('isNotAccPwd') != 'Y' and not pwd:
        return json_err('请填写游戏密码')
    if not role:
        return json_err('请填写角色名')
    if not mob or len(mob) < 6:
        return json_err('请填写正确的联系手机')
    hours = lk.get('hours') or 0
    if not lk.get('day') and not hours:
        hours = float(S('DefulatDLHours', '1') or 1)
    d = dict(gameId=gm['id'], gameName=gm['gameName'], gameArea=p.get('gameArea') or '', gameServer=p.get('gameServer') or '', gameJob='', gameGroup='', roleName=role,
             project=lk.get('project') or '', projectTypeName='', orderContent=(p.get('dlcontent') or '').strip(), gameInfo='', price=lk.get('price') or 0, originPrice=lk.get('price') or 0,
             netReceipts=str(lk.get('price') or 0), serviceAmount=0, payMethod=0, orderSoure=lk.get('orderSoure') or '', WangWang=lk.get('ww') or '', qq=(p.get('qq') or '').strip(), moblie=mob,
             gameAcc=acc, gamePwd=pwd, zgameAcc='', loginKey='', orderIdView=lk.get('soureOrderId') or '', orderRemark='客户自行填单', customizeTag='', days=lk.get('day') or 0, hours=hours,
             isJiaJi='N', bussType=1, customerId=0, throwPrice=0, throwFee=0, safeAmount=0, effAmount=0, keywords='', isDis='N', orderId=new_order_id(),
             orderSta=S('DefSta', '未分配') or '未分配', recMan=0, recManName='', recFee=0, kefu=lk.get('creator') or '', kefuId=lk.get('creatorId') or 0, assUserName=lk.get('creator') or '',
             inputOrderManName=lk.get('creator') or '', addOrderUserName=lk.get('creator') or '', addOrderUserId=lk.get('creatorId') or 0, isLock='N', isDel='N', isSettStatus='未结算',
             refundFee=0, discount=1, labels=[], imgs=[], startTime='', completeTime=None, recOrderTime=None, jiwei='')
    if not d['orderIdView']:
        d['orderIdView'] = now().replace('-', '').replace(' ', '').replace(':', '')[2:14] + '%03d' % (db.count('orders') % 1000)
    o = db.insert('orders', d)
    add_log(o, '客户通过填单链接补充资料后生成订单', '录单', user=lk.get('creator') or '客户')
    db.update('customer_order_links', lk['id'], dict(status='已生成订单', orderId=o['orderId'], fillTime=now()))
    publish_order(o, 'created')
    cfg = _cfg()
    search = (request.host_url.rstrip('/') + '/Public/SearchOrder?no=' + (d['orderIdView'] or '')) if cfg['swtich'] == 'Y' else ''
    return json_ok(cfg['mark'], data=dict(mark=cfg['mark'], pic=cfg['pic'], searchUrl=search, orderNo=d['orderIdView']))


# ---------------- 公开页：客户查订单进度 ----------------
@route('/Public/SearchOrder', public=True)
def search_order_page():
    p = P()
    no = (p.get('no') or '').strip()
    o = logs = None
    if no:
        o = db.first('orders', lambda x: x.get('isDel') != 'Y' and (str(x.get('orderIdView')) == no or str(x.get('orderId')) == no))
        if o:
            # 只给客户看状态变化，不暴露打手、接单价、备注等内部信息
            logs = [dict(l, content=('订单已录入' if l.get('logType') == '录单' else l['content'])) for l in db.find('order_logs', lambda l: l.get('orderId') == o['id'], 'createTime')
                    if l.get('logType') in ('录单', '状态')]
            o = serialize(o)
    return render_template('Public/SearchOrder.html', no=no, o=o, logs=logs or [], bulletin=S('PublicSeachOrderBulletin', ''), questions=db.all_('search_questions'),
                           company=db.system_info().get('company', ''))
