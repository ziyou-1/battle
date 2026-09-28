# -*- coding: utf-8 -*-
"""主框架 / 后台首页（控制台）相关接口"""
import datetime, json
from flask import jsonify
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, now


def orders_active():
    return [o for o in db.all_('orders') if o.get('isDel') != 'N' and o.get('isDel') is not None and o.get('isDel') != 'Y' or o.get('isDel') == 'N']


def day_range(day, stime=''):
    """day: 0 今天 1 昨天 7 近7天 30 近30天；stime 指定日期"""
    today = datetime.date.today()
    if stime and stime not in ('undefined', 'null'):
        try:
            d = datetime.datetime.strptime(stime[:10], '%Y-%m-%d').date()
            return d, d
        except ValueError:
            pass
    try:
        day = int(day)
    except (TypeError, ValueError):
        day = 0
    if day == 0:
        return today, today
    if day == 1:
        y = today - datetime.timedelta(days=1)
        return y, y
    return today - datetime.timedelta(days=day - 1), today


def in_range(ts, a, b):
    if not ts:
        return False
    d = ts[:10]
    return a.strftime('%Y-%m-%d') <= d <= b.strftime('%Y-%m-%d')


# ---------- 主框架 ----------
@route('/Home/GetMsgServiceToken')
def msg_service_token():
    # 本地版没有消息推送服务（原站为 wss://msg.jidanpu.com），返回失败让前端跳过 WebSocket
    return jsonify(dict(success=False, message='本地版未启用消息推送服务'))


@route('/Home/GetSystemAgreeUseProtocol')
def agree_protocol():
    u = current_user()
    return jsonify(dict(code=1, data='Y' if u.get('agreeProtocol', 'Y') == 'Y' else 'N'))


@route('/Home/AgreeSystemProtocol')
def agree_protocol_set():
    db.update('users', uid(), dict(agreeProtocol='Y'))
    return json_ok('已同意')


@route('/Home/GetSystemInsideNotity')
def inside_notity():
    u = current_user()
    read = set(u.get('readNotices') or [])
    # Keep both the current API names and the legacy names consumed by the
    # desktop notification widget.  This lets a restarted service serve old
    # clients without relying on the jQuery compatibility shim.
    rows = [dict(
        id=n['id'],
        title=n['title'],
        content=n['content'],
        createTime=n['createTime'],
        SystemNoticeID=n['id'],
        Remark=n['content'],
        createTimeStr=n['createTime'],
    ) for n in db.find('notices', lambda r: r.get('popup') == 'Y' and r['id'] not in read)]
    return jsonify(dict(code=len(rows), data=rows))


@route('/Home/ReadSystemInsideNotityByMe')
def read_inside_notity():
    p = P()
    u = current_user()
    read = set(u.get('readNotices') or [])
    for x in p.ids('ids') or [p.int('id')]:
        if x:
            read.add(x)
    db.update('users', uid(), dict(readNotices=sorted(read)))
    return json_ok('已确认')


@route('/api/ImApi/AcceptAgreement')
def accept_im():
    db.update('users', uid(), dict(imAgree='Y'))
    return json_ok('ok')


@route('/api/IMApi/CheckImAuth')
def check_im():
    return json_ok('ok', data=dict(auth=True))


# ---------- 控制台 ----------
@route('/api/UserApi/GetUserInfo')
def get_user_info():
    u = current_user()
    return json_ok(None, data=dict(Id=u['id'], Account=u['loginAcc'], Name=u.get('userName'), Email=u.get('email') or None, Phone=u.get('moblie') or '',
                                   JdpUid=None, IsSuper=bool(u.get('isSuper'))))


@route('/api/UserApi/SendEmailCode')
def send_email_code():
    p = P()
    email = p.get('email').strip()
    if '@' not in email:
        return json_err('邮箱格式不正确')
    code = '%06d' % (abs(hash(email + str(uid()))) % 1000000)
    db.set_setting('bindmail:%s' % uid(), dict(email=email, code=code))
    print('[绑定邮箱] 用户 %s 邮箱 %s 验证码: %s' % (uname(), email, code))
    return json_ok('验证码已发送(本地版请查看控制台输出)')


@route('/api/UserApi/BindEmail')
def bind_email():
    p = P()
    rec = db.setting('bindmail:%s' % uid())
    if not rec or rec['email'] != p.get('email').strip() or rec['code'] != p.get('code').strip():
        return json_err('验证码错误')
    db.update('users', uid(), dict(email=rec['email']))
    return json_ok('绑定成功')


@route('/api/userapi/getSign')
def get_sign():
    u = current_user()
    if u.get('signStatus') == 'Y':
        return json_ok('已签署', data=dict(sign='local', type=1, ts=now()), code=2)
    return json_err('本地版不需要签署电子合同')


@route('/UserAjax/GetMySystemAccBalance')
def my_balance():
    u = current_user()
    return jsonify(dict(code=1, msg=float(u.get('balance') or 0), data=float(u.get('cashAmount') or 0)))


@route('/UserAjax/GetHomePageMyRecOrderTotalData')
def my_rec_total():
    u = current_user()
    mine = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('recMan') == u['id']]
    fee = sum(float(o.get('recFee') or 0) for o in mine)
    nosett = [o for o in mine if o.get('orderSta') == '已完成' and o.get('isSettStatus') != '已结算']
    nocomp = [o for o in mine if o.get('orderSta') in ('待上号', '代练中', '待验收', '已暂停', '问题单')]
    return jsonify(dict(code=1, msg=dict(orderCount=len(mine), orderFee=round(fee, 2), noSettCount=len(nosett), noSettAmount=round(sum(float(o.get('recFee') or 0) for o in nosett), 2),
                                         noComplateCount=len(nocomp), noComplateAmount=round(sum(float(o.get('recFee') or 0) for o in nocomp), 2))))


@route('/UserAjax/GetMyRecommendCode')
def my_rec_code():
    return json_ok('SQ%05d' % uid())


@route('/EmpAjax/GetHomeToDayOrderDataStatistics')
def today_stat():
    """今日每小时录单数(msg)与金额(data)"""
    today = datetime.date.today().strftime('%Y-%m-%d')
    counts = [0] * 24
    amounts = [0.0] * 24
    for o in db.all_('orders'):
        if o.get('isDel') == 'Y' or not o.get('createTime', '').startswith(today):
            continue
        h = int(o['createTime'][11:13])
        counts[h] += 1
        amounts[h] += float(o.get('price') or 0)
    return jsonify(dict(code=20, msg=counts, data=[round(a, 2) for a in amounts], remark=[]))


@route('/EmpAjax/GetMyDayOperationData')
def day_operation():
    p = P()
    a, b = day_range(p.get('day', 0), p.get('stime'))
    rows = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and in_range(o.get('createTime'), a, b)]
    add = len(rows)
    price = sum(float(o.get('price') or 0) for o in rows)
    pay = sum(float(o.get('recFee') or 0) for o in rows)
    rec = [o for o in rows if o.get('recMan')]
    cancel = [o for o in rows if o.get('orderSta') in ('已撤销', '已退单')]
    refund = [o for o in rows if float(o.get('refundFee') or 0) > 0]
    finish = [o for o in rows if o.get('orderSta') == '已完成']
    refund_amt = sum(float(o.get('refundFee') or 0) for o in refund)
    profit = price - pay - refund_amt
    pct = lambda n: round(n * 100.0 / add, 2) if add else 0.0
    return jsonify(dict(code=1, msg='', data=dict(addCount=add, orderPrice=round(price, 2), payPrice=round(pay, 2), recOrderCount=len(rec), cancelCount=len(cancel),
                                                  refundCount=len(refund), refundPriceAmount=round(refund_amt, 2), refundPayAmount=0.0, finishCount=len(finish),
                                                  profitAmount=round(profit, 2), profitRate=round(profit * 100.0 / price, 2) if price else 0.0,
                                                  recOrderRate=pct(len(rec)), cancelOrderRate=pct(len(cancel)), refundOrderRate=pct(len(refund)), finishOrderRate=pct(len(finish)))))


@route('/EmpAjax/GetHomePushOrderOperateReport')
def push_report():
    p = P()
    a, b = day_range(p.get('day', 0), p.get('stime'))
    rows = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and in_range(o.get('createTime'), a, b)]
    internal = [o for o in rows if o.get('isPushJdp') != 'Y']
    plats = {}
    for o in rows:
        if o.get('isPushJdp') == 'Y':
            plats[o.get('pushPlatformName') or '交易平台'] = plats.get(o.get('pushPlatformName') or '交易平台', 0) + 1
    return jsonify(dict(code=len(rows), msg='', internalCount=len(internal), data=[dict(str2=k, id=v) for k, v in plats.items()]))


@route('/Index/ReadExptimeWarr')
def read_exp_warr():
    db.update('users', uid(), dict(readExpWarr=now()))
    return json_ok('ok')
