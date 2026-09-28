# -*- coding: utf-8 -*-
"""订单管理：录入/管理/指派/抢单/回收站/日志/退款/标签等"""
import json, re, datetime, urllib.parse, html, secrets
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now, S, is_dashou
from .game import resolve_game
from .user import active_users
from integrations.wecom import publish_order, order_message

STATUS_KEYS = {'未分配': 'WFP', '待上号': 'DSH', '代练中': 'DLZ', '待验收': 'DYS', '已完成': 'YWC', '已暂停': 'YZT', '问题单': 'WTD', '异常中': 'YCZ',
               '已退单': 'YTD', '撤销中': 'CXZ', '仲裁中': 'ZCZ', '已仲裁': 'YZC', '已撤销': 'YCX'}
STATUS_COLOR = {'未分配': '#ff5722', '待上号': '#ff9900', '代练中': '#289f16', '待验收': '#1e9fff', '已完成': '#009688', '已暂停': '#a233c6',
                '问题单': '#ff0000', '已退单': '#999', '异常中': '#ff0000'}
ORDER_DEFAULTS = dict(orderIdView='', roleName='', gameArea='', gameServer='', gameJob='', gameGroup='', levelMark='0', itemRemark='', otherRemark='', orderLabel='',
                      orderLabelColor=None, orderRemark='', dynamicRemark=None, customizeTag='', project='', projectTypeName='', orderContent='', gameInfo='',
                      orderSta='未分配', price=0, recFee=0, netReceipts='0', refundFee=0, originPrice=0, serviceAmount=0, discount=100, payMethod=0, orderSoure='',
                      WangWang='', qq='', moblie=None, sphone=None, customerId=0, recMan=0, recManName='', kefu='', assUserName='', inputOrderManName='',
                      addOrderUserName='', gameAcc=None, gamePwd=None, accPwd=None, zgameAcc=None, isLock='N', isDel='N', isJiaJi='N', isThrowOrder='N',
                      isSplitOrder='N', isAutoAssignment='N', isPushJdp='N', pushJdpOrderState=None, tid=None, fromId='', isRead='Y', isSettStatus='未结算',
                      recSettCount=0, throwCount=0, backListId=0, groupMangeUid=0, taskId=0, taskName=None, splitId=None, isAllowChangeOrderFee='Y', refundModel='',
                      refundTimeStr=None, refundUserName='', autoAssignmentManName=None, bussType=1, days=1, hours=0, orderHoursDescStr='', createTime='',
                      recOrderTime=None, startTime='', completeTime=None, expectEndTime='', assTime='', delTime=None, delUserName=None, transfType=0,
                      imgCount=0, fsid=0, groupId=None, orderFromOrderId=None, soureFromHost=None, recOrderInsureAmount=0, labels=None, imgs=None, jiwei=None)


def serialize(o):
    d = dict(ORDER_DEFAULTS)
    d.update(o)
    d['oid'] = o['id']
    d['orderId'] = str(o.get('orderId') or o['id'])
    d['hoursDesc'] = d.get('orderHoursDescStr') or ('%s天%s小时' % (d.get('days', 0), d.get('hours', 0)))
    d['orderHoursDescStr'] = d['hoursDesc']
    d['imgCount'] = len(o.get('imgs') or [])
    if d.get('orderSta') == '已完成' and not d.get('completeTime'):
        d['completeTime'] = d.get('createTime')
    try:
        st = datetime.datetime.strptime((o.get('startTime') or o.get('createTime'))[:19], '%Y-%m-%d %H:%M:%S')
        d['expectEndTime'] = (st + datetime.timedelta(days=float(o.get('days') or 0), hours=float(o.get('hours') or 0))).strftime('%Y-%m-%d %H:%M:%S')
    except (TypeError, ValueError):
        d['expectEndTime'] = ''
    return d


def staff_order_row(o):
    d = serialize(o)
    u = current_user() or {}
    if u.get('prohibitedViewOrderPwd') == 'Y':
        d['gamePwd'] = d['accPwd'] = d['loginKey'] = '******'
    return d


def all_orders(include_deleted=False):
    rows = db.all_('orders')
    if not include_deleted:
        rows = [o for o in rows if o.get('isDel') != 'Y']
    return rows


def find_order(val):
    """orderId(20位字符串) 或 oid(数字) 或 orderIdView"""
    if val in (None, ''):
        return None
    val = str(val).strip()
    for o in db.all_('orders'):
        if str(o.get('orderId')) == val or str(o['id']) == val or (o.get('orderIdView') and str(o.get('orderIdView')) == val):
            return o
    return None


def new_order_id():
    return datetime.datetime.now().strftime('%Y%m%d%H%M%S') + ('%06d' % (db.count('orders') + 1))[-6:]


def add_log(o, content, log_type='操作', user=None):
    db.insert('order_logs', dict(orderId=o['id'], orderIdStr=str(o.get('orderId')), content=content, userName=user or uname(), logType=log_type))
    log(log_type, content, orderId=o.get('orderIdView') or str(o.get('orderId')), gameName=o.get('gameName'), roleName=o.get('roleName'))


def dec(v):
    try:
        return urllib.parse.unquote(v or '')
    except Exception:
        return v or ''


def can_view_order(o, u=None):
    """Order detail access follows the same ownership rule as order lists."""
    u = current_user() if u is None else u
    if not o or not u:
        return False
    if u.get('isSuper') or u.get('jobName') in ('系统管理员', '老板', '客服', '财务', '团长'):
        return True
    return o.get('recMan') == u['id'] or o.get('kefuId') == u['id']


def visible_orders_for(u):
    """打手只看自己接手的单"""
    return [o for o in all_orders() if can_view_order(o, u)]


_MANAGE_ORDER_ACTIONS = {
    '/orderajax/delorderbyidx', '/orderajax/reforderrecycle',
    '/orderajax/changesorderprice', '/orderajax/changeorderprice',
    '/orderajax/changeordernetreceiptsprice', '/orderajax/updateorderrevpricebyorderid',
    '/orderajax/addorderrefundlogs', '/orderajax/upsettlementorderbyidx',
    '/orderajax/changeorderlock', '/orderajax/setorderzhipaibyidx',
    '/orderajax/cleanorderzhipaibyidx',
}


# 排团接口里这几个是只读的；其余 /pvetaskajax/ 都当写操作，要有排团管理权限
_PVE_READ_ACTIONS = {
    '/pvetaskajax/getgrouplist', '/pvetaskajax/getmygroup', '/pvetaskajax/getnewsgrouplist',
    '/pvetaskajax/getnewsgrouporderlist', '/pvetaskajax/getjdppublictaskdata',
    '/pvetaskajax/getjdppublictaskcontactdata', '/pvetaskajax/getcurrentweekdaytaskgrapneedjob',
    '/pvetaskajax/gettaskneedjobtemplate', '/pvetaskajax/gettaskneedjobtemplatebytid',
    '/pvetaskajax/checkgroupfullinfo', '/pvetaskajax/checkorderinsidetask',
    '/pvetaskajax/getnewordertogrouplist', '/pvetaskajax/gettaskonlyassuserlist',
}
_PVE_TASK_KEYS = {'group/addeditgroup', 'group/grouplist', 'group/grouplist2020', 'group/grouplist2025'}

# 对外发短信、给订单传图：只绑定在客服工作台上的动作，财务/团长/打手不该做
_ORDER_ACTION_ROLES = {
    '/orderajax/sendsmsbyorderidx': ('系统管理员', '老板', '客服'),
    '/orderajax/sendsms': ('系统管理员', '老板', '客服'),
    '/orderajax/uploadorderpic': ('系统管理员', '老板', '客服', '打手'),
    '/orderajax/saveorderimg': ('系统管理员', '老板', '客服', '打手'),
    '/orderajax/uploadpic': ('系统管理员', '老板', '客服', '打手'),
}


def guard_order_request(path):
    """Reject ID based access before the handler can read or change an order."""
    from .system import user_permissions
    p = P()
    if path in _ORDER_ACTION_ROLES:
        u = current_user() or {}
        if not (u.get('isSuper') or u.get('jobName') in _ORDER_ACTION_ROLES[path]):
            return json_err('无权执行该订单操作'), 403
    if path.startswith('/pvetaskajax/') and path not in _PVE_READ_ACTIONS:
        # 原来 /pvetaskajax/ 只做了订单可见性检查，财务/客服/打手都能直接改排团
        if not user_permissions().intersection(_PVE_TASK_KEYS):
            return json_err('无权管理排团'), 403
    if path == '/orderajax/addorderajax' and 'order/addorder' not in user_permissions():
        return json_err('无权录入或编辑订单'), 403
    if path in _MANAGE_ORDER_ACTIONS and 'order/orderlist' not in user_permissions():
        return json_err('无权执行订单管理操作'), 403
    if path == '/orderajax/recorderbyinternal':
        return None  # Claiming an available order is intentionally open to staff.
    identifiers = [p.get(k) for k in ('orderId', 'orderIdx', 'oid') if p.get(k)]
    if path != '/orderajax/updateitemneedlistcount':
        identifiers.extend(p.list('ids'))
    if path == '/orderajax/addorderajax' and p.get('strParameter'):
        try:
            payload = json.loads(urllib.parse.unquote(p.get('strParameter')))
            identifiers.append(payload.get('orderID'))
        except (ValueError, TypeError):
            pass
    for identifier in identifiers:
        o = find_order(identifier)
        if o and not can_view_order(o):
            return json_err('无权访问该订单'), 403
    return None


def totals(rows):
    t = dict(TotalCount=len(rows), TotalPrice=round(sum(float(o.get('price') or 0) for o in rows), 2), TotalRecFee=round(sum(float(o.get('recFee') or 0) for o in rows), 2),
             TotalNetReceipts=round(sum(float(o.get('netReceipts') or 0) for o in rows), 2), TotalReFundAmount=round(sum(float(o.get('refundFee') or 0) for o in rows), 2),
             TotalReturnPrice=0, payMethodByHB=len([o for o in rows if o.get('payMethod') == 10]), payMethodByHBAmount=round(sum(float(o.get('serviceAmount') or 0) for o in rows if o.get('payMethod') == 10), 2),
             payMethodBycreditCard=len([o for o in rows if o.get('payMethod') == 20]), payMethodBycreditCardAmount=round(sum(float(o.get('serviceAmount') or 0) for o in rows if o.get('payMethod') == 20), 2),
             paySuccessAmount=0, waitPayAmount=0)
    for k in STATUS_KEYS.values():
        t[k] = 0
    for o in rows:
        k = STATUS_KEYS.get(o.get('orderSta'))
        if k:
            t[k] += 1
    return t


# ---------------- 管理订单列表 ----------------
@route('/OrderAjax/GetOrderList')
def order_list():
    p = P()
    u = current_user()
    rows = visible_orders_for(u)
    g = p.get('gameName')
    if g and g != '全部游戏':
        gm = resolve_game(g)
        gname = gm['gameName'] if gm else g
        if gname != '全部游戏':  # 传的是“全部游戏”的 id 时不过滤
            rows = [o for o in rows if o.get('gameName') == gname]
    st, et = dec(p.get('stime'))[:19], dec(p.get('etime'))[:19]
    tt = p.get('timeType') or '10'
    tfield = {'10': 'createTime', '20': 'startTime', '30': 'completeTime', '40': 'payTime', '50': 'refundTimeStr'}.get(str(tt), 'createTime')
    batch = dec(p.get('batchOrderId'))
    if batch or p.get('selectSeach1') == '10':
        ids = set(x.strip() for x in re.split(r'[\s,，;；]+', batch or dec(p.get('key1'))) if x.strip())
        if ids:
            rows = [o for o in rows if str(o.get('orderId')) in ids or str(o.get('orderIdView')) in ids]
    elif st or et:
        def in_time(o):
            v = (o.get(tfield) or '')[:19]
            if not v:
                return tfield == 'createTime'
            return (not st or v >= st) and (not et or v <= (et if len(et) > 10 else et + ' 23:59:59'))
        rows = [o for o in rows if in_time(o)]
    sta = p.get('orderSta')
    if not sta and S('SK27', 'N') == 'Y':
        rows = [o for o in rows if o.get('orderSta') != '已完成']
    if sta:
        if sta == '已超时':
            nowstr = now()
            rows = [o for o in rows if o.get('orderSta') in ('代练中', '待上号') and serialize(o).get('expectEndTime', '') < nowstr]
        else:
            rows = [o for o in rows if o.get('orderSta') == sta]
    rec = p.get('recUserId')
    if rec and rec not in ('0', ''):
        rt = p.get('recType')
        if rt == '10':
            rows = [o for o in rows if str(o.get('assUserId') or o.get('kefuId')) == str(rec) or o.get('assUserName') == rec]
        else:
            rows = [o for o in rows if str(o.get('recMan')) == str(rec) or o.get('recManName') == rec]
    kf = p.get('customerServiceUserId')
    if kf and kf not in ('0', ''):
        kt = p.get('kefuType')
        field = {'5': 'addOrderUserId', '10': 'refundUserId'}.get(str(kt), 'kefuId')
        rows = [o for o in rows if str(o.get(field)) == str(kf) or o.get('kefu') == kf]
    src = dec(p.get('orderSoure'))
    if src:
        rows = [o for o in rows if o.get('orderSoure') == src]
    ss = p.get('setSta')
    if ss:
        rows = [o for o in rows if o.get('isSettStatus') == ss]
    if p.get('isJiaji') in ('Y', '1', 'true'):
        rows = [o for o in rows if o.get('isJiaJi') == 'Y']
    bt = p.get('bussType')
    if bt not in ('', '0', None):
        rows = [o for o in rows if str(o.get('bussType', 1)) == str(bt)]
    ptn = dec(p.get('projectTypeName'))
    if ptn:
        rows = [o for o in rows if o.get('projectTypeName') == ptn]
    pj = dec(p.get('project'))
    if pj:
        rows = [o for o in rows if pj in (o.get('project') or '')]
    for f in ('gameServer', 'gameJob', 'gameArea'):
        v = dec(p.get(f))
        if v:
            rows = [o for o in rows if o.get(f) == v]
    task = p.get('taskId')
    if task and task not in ('0', ''):
        rows = [o for o in rows if str(o.get('taskId')) == str(task)]
    lbl = p.get('orderLabel')
    if lbl == 'NoLael':
        rows = [o for o in rows if not o.get('orderLabel')]
    elif lbl:
        rows = [o for o in rows if lbl in (o.get('orderLabel') or '')]
    mn, mx = p.float('minPrice'), p.float('maxPrice')
    pf = {'1': 'recFee', '2': 'refundFee'}.get(str(p.get('showPriceType')), 'price')
    if mn:
        rows = [o for o in rows if float(o.get(pf) or 0) >= mn]
    if mx:
        rows = [o for o in rows if float(o.get(pf) or 0) <= mx]
    k1 = dec(p.get('key1'))
    if k1 and p.get('selectSeach1') != '10':
        rows = [o for o in rows if db.like(o, ['orderId', 'orderIdView', 'roleName', 'WangWang', 'qq', 'moblie', 'project', 'orderContent', 'gameAcc', 'customizeTag'], k1)]
    k2 = dec(p.get('key2'))
    if k2:
        rows = [o for o in rows if db.like(o, ['roleName', 'gameInfo', 'project', 'orderContent'], k2)]
    k3 = dec(p.get('key3'))
    if k3:
        rows = [o for o in rows if db.like(o, ['gameAcc', 'zgameAcc'], k3)]
    k4 = dec(p.get('key4'))
    if k4:
        fields = ['customizeTag', 'levelMark'] if p.get('key4Type') == '1' else ['orderRemark', 'jiwei', 'dynamicRemark', 'otherRemark']
        rows = [o for o in rows if db.like(o, fields, k4)]
    tid = dec(p.get('keytid'))
    if tid:
        rows = [o for o in rows if tid in str(o.get('tid') or '')]
    rows.sort(key=lambda o: (o.get('isJiaJi') == 'Y', o.get('createTime') or ''), reverse=True)
    t = totals(rows)
    page, limit = p.int('page', 1), p.int('limit', 20)
    data = [staff_order_row(o) for o in db.paginate(rows, page, limit)]
    return jsonify(dict(code=0, msg='', count=len(rows), data=data, total=t))


@route('/OrderAjax/GetOrderJobGroupTotal')
def order_job_group_total():
    p = P()
    rows = all_orders()
    g = p.get('gameName')
    if g and g != '全部游戏':
        rows = [o for o in rows if o.get('gameName') == g]
    cnt = {}
    for o in rows:
        k = o.get('gameJob') or '未填'
        cnt[k] = cnt.get(k, 0) + 1
    total = sum(cnt.values()) or 1
    data = [dict(alias=k, total=v, ratios='%.1f%%' % (v * 100.0 / total)) for k, v in sorted(cnt.items(), key=lambda x: -x[1])]
    return jsonify(dict(code=0, msg='', count=len(data), data=data))


# ---------------- 我的订单 / 抢单大厅 / 回收站 / 异常 ----------------
@route('/OrderAjax/GetMyOrderList')
def my_order_list():
    p = P()
    u = current_user()
    rows = [o for o in all_orders() if o.get('recMan') == u['id']]
    g = p.get('gameName')
    if g and g != '全部游戏':
        gm = resolve_game(g)
        if (gm['gameName'] if gm else g) != '全部游戏':
            rows = [o for o in rows if o.get('gameName') == (gm['gameName'] if gm else g)]
    sta = p.get('orderSta') or p.get('sta')
    if sta:
        rows = [o for o in rows if o.get('orderSta') == sta]
    else:
        if S('SK9', 'N') != 'Y':
            rows = [o for o in rows if o.get('orderSta') != '已完成']
        if S('SK38', 'N') != 'Y':
            rows = [o for o in rows if o.get('orderSta') != '已退单']
    kw = dec(p.get('key') or p.get('key1'))
    if kw:
        rows = [o for o in rows if db.like(o, ['orderId', 'orderIdView', 'roleName', 'project', 'orderRemark'], kw)]
    rows.sort(key=lambda o: (o.get('isJiaJi') == 'Y', o.get('createTime') or ''), reverse=True)
    return paged([staff_order_row(o) for o in rows], total=totals(rows))


@route('/OrderAjax/GetInternalOrderGrabbingList')
def grabbing_list():
    p = P()
    rows = [o for o in all_orders() if o.get('orderSta') in ('未分配', '抢单中') and not o.get('recMan')]
    g = p.get('gameName')
    if g and g != '全部游戏':
        gm = resolve_game(g)
        if (gm['gameName'] if gm else g) != '全部游戏':
            rows = [o for o in rows if o.get('gameName') == (gm['gameName'] if gm else g)]
    for f in ('gameArea', 'gameServer'):
        v = dec(p.get(f))
        if v:
            rows = [o for o in rows if o.get(f) == v]
    kw = dec(p.get('key') or p.get('key1'))
    if kw:
        rows = [o for o in rows if db.like(o, ['roleName', 'project', 'gameInfo'], kw)]
    sort_mode = S('SK136', '0')
    key_f = 'createTime' if sort_mode in ('0', '1') else 'assTime'
    rows.sort(key=lambda o: o.get(key_f) or o.get('createTime') or '', reverse=(sort_mode in ('1', '3')))
    u = current_user()
    out = []
    for o in rows:
        d = serialize(o)
        # 抢单大厅不暴露账号密码；SK67 禁止显示角色名
        d['gameAcc'] = d['gamePwd'] = d['accPwd'] = None
        if S('SK67', 'Y') == 'Y':
            d['roleName'] = '***'
        if S('SK153', '0') == '1':
            d['imgs'] = []; d['imgCount'] = 0
        out.append(d)
    return paged(out, total=totals(rows))


@route('/OrderAjax/RecOrderByInternal')
def rec_order_internal():
    p = P()
    u = current_user()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    if o.get('recMan'):
        return json_err('该订单已被【%s】抢走了' % o.get('recManName'))
    if u.get('isProhibitPublicRecOrder') == 'Y':
        return json_err('你被禁止在抢单大厅抢单')
    busy = ('待上号', '代练中', '待验收') if S('SK133') == 'Y' else ('待上号', '代练中')
    mine = [x for x in all_orders() if x.get('recMan') == u['id'] and x.get('orderSta') in busy]
    if len(mine) >= int(u.get('recOrderMaxCount') or 5):
        return json_err('你手上未完成的订单已达上限 %s 单' % (u.get('recOrderMaxCount') or 5))
    if S('SK51') == 'Y' and float(u.get('insureAmount') or 0) < float(o.get('recOrderInsureAmount') or 0):
        return json_err('你交纳的保证金(%s)低于该订单要求(%s)，不能抢单' % (u.get('insureAmount') or 0, o.get('recOrderInsureAmount')))
    interval = int(float(S('recOrderInterval', '0') or 0))
    if interval > 0 and u.get('lastRecOrderTime'):
        try:
            gap = (datetime.datetime.now() - datetime.datetime.strptime(u['lastRecOrderTime'][:19], '%Y-%m-%d %H:%M:%S')).total_seconds()
            if gap < interval * 60:
                return json_err('抢单间隔限制：%d 分钟内只能抢一单' % interval)
        except ValueError:
            pass
    sta = '代练中' if S('SK1', 'Y') == 'Y' else '待上号'
    db.update('orders', o['id'], dict(recMan=u['id'], recManName=u['userName'], orderSta=sta, recOrderTime=now(), assTime=now(), startTime=(now() if sta == '代练中' else ''),
                                      assignees=[dict(userId=u['id'], userName=u['userName'], fee=o.get('recFee') or 0, hours=o.get('hours') or 0, project=o.get('project'))]))
    db.update('users', u['id'], dict(lastRecOrderTime=now(), lastRecOrderDate=now()))
    add_log(o, '【%s】在内部抢单大厅抢到了此单' % u['userName'], '抢单')
    return json_ok('抢单成功，请尽快上号')


@route('/OrderAjax/GetOrderRecycleList')
def recycle_list():
    p = P()
    rows = [o for o in all_orders(True) if o.get('isDel') == 'Y']
    kw = dec(p.get('key') or p.get('key1'))
    if kw:
        rows = [o for o in rows if db.like(o, ['orderId', 'orderIdView', 'roleName', 'project'], kw)]
    st, et = dec(p.get('stime') or p.get('minD')), dec(p.get('etime') or p.get('maxD'))
    if st:
        rows = [o for o in rows if (o.get('delTime') or '')[:10] >= st[:10]]
    if et:
        rows = [o for o in rows if (o.get('delTime') or '')[:10] <= et[:10]]
    rows.sort(key=lambda o: o.get('delTime') or '', reverse=True)
    u = current_user()
    rows = [o for o in rows if o in visible_orders_for(u)]
    return paged([staff_order_row(o) for o in rows], total=len(rows))


@route('/OrderAjax/RefOrderRecycle')
def recycle_restore():
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(isDel='N', delTime=None, delUserName=None))
    add_log(o, '从回收站找回了订单', '找回')
    return json_ok('订单已找回')


@route('/orderajax/GetExceptionOrderLogs')
def exception_logs():
    rows = db.find('exception_orders', None, 'CreatetTime')
    return paged(rows)


# ---------------- 录入 / 编辑订单 ----------------
@route('/OrderAjax/AddOrderAjax')
def add_order():
    p = P()
    raw = p.get('strParameter')
    try:
        f = json.loads(urllib.parse.unquote(raw)) if raw else {}
    except ValueError:
        try:
            f = json.loads(raw)
        except ValueError:
            return json_err('参数格式错误')
    try:
        emps = json.loads(p.get('emps') or '[]')
    except ValueError:
        emps = []
    gm = resolve_game(p.get('gameName') or f.get('gameName'))
    if not gm:
        return json_err('请选择游戏')
    project = (f.get('project') or '').strip()
    if not project:
        return json_err('请填写代练项目')
    price = float(f.get('price') or 0)
    u = current_user()
    src = f.get('orderSoures2') or f.get('orderSoures') or f.get('editOrderSoure') or ''
    days = float(f.get('day') or 0); hours = float(f.get('hours') or 0)
    if days == 0 and hours == 0:
        hours = float(S('DefulatDLHours', '1') or 1)
    cust = None
    if f.get('customerId'):
        cust = db.get('customers', f.get('customerId'))
    # 系统设置里的录单校验
    if S('SK102') == 'Y' and not (f.get('gameAcc') and (f.get('gamePwd') or f.get('ypwd'))):
        return json_err('系统设置要求录单时必须填写游戏账号和密码')
    if S('SK142') == 'Y' and not (f.get('gameRole') or '').strip():
        return json_err('系统设置要求录单时必须填写角色名')
    if S('SK146') == 'Y' and not (f.get('moblie') or '').strip():
        return json_err('系统设置要求录单时必须填写联系电话')
    if S('SK10') == 'Y' and not (f.get('souresOrderID') or '').strip():
        return json_err('系统设置要求录单时必须填写订单来源单号')
    if S('SK141') == 'Y' and not (f.get('orderType') or f.get('defOrderType')) and db.count('order_types', lambda r: r.get('gameId') == gm['id']):
        return json_err('系统设置要求录单时必须选择项目分类')
    if S('SK32') == 'Y' and (f.get('souresOrderID') or '').strip() and not (f.get('orderID') or p.get('orderID')):
        dup = db.first('orders', lambda o: o.get('isDel') != 'Y' and o.get('orderSoure') == src and o.get('orderIdView') == (f.get('souresOrderID') or '').strip())
        if dup:
            return json_err('已存在相同来源 + 相同来源单号的订单：%s' % dup.get('orderIdView'))
    if S('SK134', 'N') != 'Y':
        keys = [x for x in (f.get('moblie'), f.get('ww'), f.get('qq')) if x]
        hit = db.first('customer_backlist', lambda r: any(k and k in (r.get('moblie'), r.get('ww'), r.get('qq')) for k in keys)) if keys else None
        if hit:
            return json_err('该客户（手机/旺旺/QQ）在客户黑名单中，系统设置不允许录入：%s' % (hit.get('remark') or ''))
    d = dict(gameId=gm['id'], gameName=gm['gameName'], gameArea=p.get('gameArea') or f.get('tGameArea') or '', gameServer=p.get('gameServer') or f.get('tGameServer') or '',
             gameJob=p.get('gameJob') or f.get('tGameJob') or '', gameGroup=p.get('gameGroup') or f.get('tGameGroup') or '', roleName=f.get('gameRole') or '',
             project=project, projectTypeName=f.get('orderType') or f.get('defOrderType') or '', orderContent=f.get('dlcontent') or '', gameInfo=f.get('gameSQ') or '',
             price=price, originPrice=price, netReceipts=str(f.get('priceReceipts') or price), serviceAmount=float(f.get('desServiceFee') or 0),
             payMethod=int(f.get('payMethed') or 0), orderSoure=src, WangWang=f.get('ww') or '', qq=f.get('qq') or '', moblie=f.get('moblie') or '',
             gameAcc=f.get('gameAcc') or '', gamePwd=f.get('gamePwd') or f.get('ypwd') or '', zgameAcc=f.get('gameZAcc') or '', loginKey=f.get('loginKey') or '',
             orderIdView=(f.get('souresOrderID') or '').strip(), orderRemark=f.get('remark') or '', customizeTag=f.get('tag') or '', days=days, hours=hours,
             isJiaJi='Y' if f.get('jiaji') in ('Y', 'on', '1', True) else 'N', bussType=2 if str(f.get('bussType') or '') == '2' or '陪玩' in (f.get('orderType') or '') else 1,
             customerId=cust['id'] if cust else 0, throwPrice=float(f.get('throwPrice') or 0), throwFee=float(f.get('throwFee') or 0),
             safeAmount=float(f.get('safeAmount') or 0), effAmount=float(f.get('effAmount') or 0), keywords=f.get('keywords') or '', isDis=f.get('isDis') or 'N')
    oid = f.get('orderID') or p.get('orderID')
    if oid:
        o = find_order(oid)
        if not o:
            return json_err('要编辑的订单不存在')
        if o.get('isLock') == 'Y' and not is_super():
            return json_err('订单已锁定，不能修改')
        kefu_name = f.get('editCustomerService') or o.get('kefu')
        d['kefu'] = kefu_name
        db.update('orders', o['id'], d)
        add_log(o, '修改了订单资料', '编辑')
        _assign_emps(db.get('orders', o['id']), emps)
        return jsonify(dict(code=o['id'], msg='订单修改成功', remark=''))
    if not d['orderIdView']:
        d['orderIdView'] = datetime.datetime.now().strftime('%y%m%d%H%M%S') + '%03d' % (db.count('orders') % 1000)
    d.update(orderId=new_order_id(), orderSta=S('DefSta', '未分配') or '未分配', recMan=0, recManName='', recFee=0, kefu=u['userName'], kefuId=u['id'], assUserName=u['userName'],
             inputOrderManName=u['userName'], addOrderUserName=u['userName'], addOrderUserId=u['id'], isLock='N', isDel='N', isSettStatus='未结算', refundFee=0,
             discount=cust.get('buyDiscount', 1) if cust else 1, labels=[], imgs=[], startTime='', completeTime=None, recOrderTime=None, jiwei='')
    o = db.insert('orders', d)
    add_log(o, '录入订单', '录单')
    if cust:
        db.update('customers', cust['id'], dict(totalConsAmount=round(float(cust.get('totalConsAmount') or 0) + price, 2), lastOrderTime=now()))
        if f.get('memberDedSwitch') in ('on', 'Y', True) or (S('SK148') == 'Y' and f.get('vipDedCheck') in ('on', 'Y', True)):
            _deduct_member(o, cust, price, when='录单')
    _assign_emps(o, emps)
    if f.get('recUser') and str(f.get('recUser')) not in ('0', ''):
        ru = db.get('users', f.get('recUser'))
        if ru:
            _assign(o, [dict(userId=ru['id'], userName=ru['userName'], fee=float(f.get('throwPrice') or 0) or round(price * 0.7, 2), hours=hours, project=project)])
    publish_order(o, 'created')
    return jsonify(dict(code=o['id'], msg='订单录入成功', remark='', data=o['orderId']))


def _assign_emps(o, emps):
    lst = []
    for e in emps or []:
        ru = db.get('users', e.get('userId') or e.get('id'))
        if ru:
            lst.append(dict(userId=ru['id'], userName=ru['userName'], fee=float(e.get('fee') or 0), hours=float(e.get('hours') or 0), project=e.get('project') or o.get('project')))
    if lst:
        _assign(o, lst)


def _assign(o, lst, auto='N'):
    """把订单指派给一个或多个打手；主接手人 = 第一个"""
    first = lst[0]
    o = db.get('orders', o['id'])
    total_fee = round(sum(float(x['fee']) for x in lst), 2)
    if S('SK135') == 'Y' and total_fee > 0 and total_fee > float(o.get('price') or 0):
        raise ValueError('系统设置：发单价(%s)大于接单价(%s)时禁止指派' % (total_fee, o.get('price')))
    if o.get('recMan') and o.get('recMan') != first['userId']:
        add_log(o, '释放了原接手人【%s】' % o.get('recManName'), '指派')
    new_sta = o.get('orderSta')
    if new_sta in ('未分配', '抢单中', '待上号'):
        new_sta = '代练中' if S('SK1', 'Y') == 'Y' else '待上号'
    db.update('orders', o['id'], dict(recMan=first['userId'], recManName=first['userName'], recFee=total_fee, orderSta=new_sta,
                                      startTime=(now() if new_sta == '代练中' and not o.get('startTime') else o.get('startTime')), recOrderTime=now(), assTime=now(),
                                      assUserName=uname(), isAutoAssignment=auto, assignees=lst))
    for x in lst:
        add_log(o, '指派给打手【%s】，接单价 %s 元' % (x['userName'], x['fee']), '指派')
        db.insert('messages', dict(userId=x['userId'], msgType=10, title='你有新的订单被指派', content='订单 %s（%s）已指派给你，接单价 %s 元，请及时上号。' % (o.get('orderIdView'), o.get('project'), x['fee']),
                                   sendUserName=uname(), isRead='N', orderId=str(o.get('orderId'))))


@route('/OrderAjax/AddOrderAutoDisKeys')
def auto_discern():
    """按录单识别设置从订单文本里抓字段"""
    p = P()
    content = p.get('content') or ''
    out = {}
    for r in db.all_('auto_discern'):
        for k in re.split(r'[|｜]', r.get('disKey') or ''):
            k = k.strip()
            if not k:
                continue
            m = re.search(re.escape(k) + r'\s*[:：]?\s*([^\n\r，,；;]+)', content)
            if m:
                out[r['typeName']] = m.group(1).strip()
                break
    for r in db.all_('verify_keys'):
        for k, v in out.items():
            if r.get('key') and r['key'] in v:
                out[k] = v.replace(r['key'], r.get('resultStr') or '')
    return json_ok('识别完成', data=out)


@route('/OrderAjax/DisGameNameByContent')
def discern_game():
    content = P().get('content') or ''
    for g in db.all_('games'):
        if g['gameName'] != '全部游戏' and g['gameName'] in content:
            return json_ok(g['gameName'], data=g['id'])
    return json_err('未识别到游戏')


# ---- 交易平台发单（原站对接平台等第三方平台；本地版只维护"常用要求模板"与用户配置，
#      真正发单/余额/推荐价这三个动作没有平台凭证，返回明确提示而不是 404）----
def _push_templates():
    rows = db.setting('pushJdpTemplates', [])
    return rows if isinstance(rows, list) else []


@route('/SystemAjax/GetPushJdp_TemplateList')
def push_templates():
    g = dec(P().get('gameName'))
    rows = [r for r in _push_templates() if not g or g in ('全部游戏', '', '0') or r.get('gameName') == g]
    return json_ok('', data=rows)


@route('/SystemAjax/AddUpdatePushJdpRequestTemplate')
def add_push_template():
    p = P()
    rows = _push_templates()
    tid = p.int('tid')
    item = dict(tid=tid or (max([r.get('tid') or 0 for r in rows] + [0]) + 1),
                gameName=dec(p.get('gameName')) or '全部游戏',
                title=p.get('title'), content=p.get('content'),
                platformType=p.get('platformType'), isdef=dec(p.get('isdef')) or 'N')
    if tid and any(r.get('tid') == tid for r in rows):
        rows = [dict(r, **item) if r.get('tid') == tid else r for r in rows]
    else:
        rows.append(item)
    db.set_setting('pushJdpTemplates', rows)
    return json_ok('保存成功')


@route('/SystemAjax/DelPushJdpRequestTemplateById')
def del_push_template():
    tid = P().int('tid') or P().int('id')
    db.set_setting('pushJdpTemplates', [r for r in _push_templates() if r.get('tid') != tid])
    return json_ok('删除成功')


@route('/SystemAjax/SetPushJdpRequestTemplateDefaultById')
def set_push_template_default():
    tid = P().int('tid') or P().int('id')
    rows = _push_templates()
    game = next((r.get('gameName') for r in rows if r.get('tid') == tid), None)
    for r in rows:
        if r.get('gameName') == game:
            r['isdef'] = 'Y' if r.get('tid') == tid else 'N'
    db.set_setting('pushJdpTemplates', rows)
    return json_ok('已设为默认')


@route('/OrderAjax/PushTransctionToPlatform')
def push_transction():
    """把这笔订单发到第三方交易平台。本地版没有平台凭证：记进订单日志 + 明确提示。"""
    raw = P().get('strParameter') or ''
    try:
        payload = json.loads(urllib.parse.unquote(raw)) if raw else {}
    except ValueError:
        payload = {}
    oid = payload.get('orderId') or payload.get('OrderId') or P().get('orderId')
    o = find_order(oid) if oid else None
    if o:
        add_log(o, '发起交易平台发单（本地版未外发）', uname())
    return json_err('本地版未接入第三方交易平台发单：请到「系统维护 → 平台快速发单设置 / 交易平台对接设置」填好平台账号，'
                    '服务端完成对接后才能发单。本次操作已记入订单日志。')


@route('/OrderAjax/GetTradingPlatformBalance')
def trading_platform_balance():
    return json_err('本地版未接入第三方交易平台，查不到平台余额')


@route('/OrderAjax/DLT_GetRecommendPrice')
def dlt_recommend_price():
    return json_err('本地版未接入第三方交易平台，没有推荐价')


@route('/OrderAjax/GetPushPlatfromAssisUserLog')
def push_assist_log():
    rows = db.find('push_assist_log', lambda r: True, 'createTime')
    return json_ok('', data=rows)


@route('/OrderAjax/DelPushPlatfromAssisUserLog')
def del_push_assist_log():
    db.set_setting('pushAssistLog', [])
    return json_ok('已删除')


@route(['/UserAjax/SaveUserConfigForPushOrderToPlatformOrderNoRecAction',
        '/UserAjax/SaveUserConfigForThreePlatformThrowOrderAccept',
        '/UserAjax/SaveUserConfigForThreePlatformThrowOrderCantac'])
def save_push_config():
    """发单相关的个人配置开关：原样存到当前用户身上，键名沿用原站接口名"""
    key = request.path.rsplit('/', 1)[-1]
    field = key[0].lower() + key[1:]
    db.update('users', uid(), {field: P().get('value') or P().get('val') or P().get('sta') or 'Y'})
    return json_ok('已保存')


@route('/UserAjax/SaveUserConfigForAssOrderByUserId')
def save_ass_orderby():
    db.update('users', uid(), dict(assOrderBy=P().get('orderBy')))
    return json_ok('ok')


@route('/UserAjax/SaveUserConfigForAssSeachJobId')
def save_ass_job():
    db.update('users', uid(), dict(assSeachJobId=P().get('jobId')))
    return json_ok('ok')


# ---------------- 指派弹窗 ----------------
@route('/UserAjax/GetAllUserTableByGameName')
def user_table_by_game():
    p = P()
    rows = active_users(p.get('gameName'), ['打手', '团长'] if not p.get('userRoleId') else None)
    rid = p.get('userRoleId')
    if rid and rid not in ('0', ''):
        rows = [r for r in rows if str(r.get('jobId')) == str(rid)]
    kw = p.get('key')
    if kw:
        rows = [r for r in rows if db.like(r, ['userName', 'loginAcc', 'mark', 'remark'], kw)]
    data = [dict(id=r['id'], userName=r['userName'], roleName=r.get('jobName'), tips=r.get('mark') or '', remark=r.get('remark') or '', taskIsHaveMe='N',
                 tichen=float(r.get('brokerageAmount') or 0), brokerageType=int(r.get('autoBrokerageType') or 0), complateRate=r.get('complateRate')) for r in rows]
    page, limit = p.int('page', 1), p.int('limit', 100)
    return jsonify(dict(code=0, msg='', count=len(data), data=db.paginate(data, page, limit)))


@route('/OrderAjax/GetOrderAssLogs')
def order_ass_logs():
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在', data=[])
    lst = o.get('assignees') or ([dict(userId=o['recMan'], userName=o['recManName'], fee=o.get('recFee', 0), hours=o.get('hours', 0), project=o.get('project'))] if o.get('recMan') else [])
    return jsonify(dict(code=1, msg='', data=lst))


@route('/OrderAjax/SetOrderZhiPaiByIDX')
def set_zhipai():
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    try:
        lst = json.loads(p.get('strParameter') or '[]')
    except ValueError:
        return json_err('参数错误')
    lst = [dict(userId=int(x.get('userId')), userName=x.get('userName'), fee=float(x.get('fee') or 0), hours=float(x.get('hours') or 0), project=x.get('project') or o.get('project')) for x in lst if x.get('userId')]
    if not lst:
        return json_err('请选择接手人')
    if p.get('sphone'):
        db.update('orders', o['id'], dict(sphone=p.get('sphone')))
    try:
        _assign(o, lst, 'Y' if p.get('isAutoAss') == 'Y' else 'N')
    except ValueError as e:
        return json_err(str(e))
    return json_ok('指派成功')


@route('/OrderAjax/CleanOrderZhiPaiByIDX')
def clean_zhipai():
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    add_log(o, '清除了接手人【%s】' % o.get('recManName'), '指派')
    sta = '未分配' if (S('SK11', 'Y') == 'Y' and o.get('orderSta') in ('待上号', '代练中')) else o.get('orderSta')
    db.update('orders', o['id'], dict(recMan=0, recManName='', recFee=0, assignees=[], orderSta=sta))
    return json_ok('已清除接手人')


@route('/OrderAjax/RelesOrderAndTaskByOrderID')
def release_order():
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在')
    add_log(o, '释放了订单（原接手人【%s】）' % o.get('recManName'), '释放')
    db.update('orders', o['id'], dict(recMan=0, recManName='', recFee=0, assignees=[], orderSta='未分配', taskId=0, taskName=None))
    return json_ok('订单已释放')


@route('/OrderAjax/RelesOrderToHomeByOrderID')
def release_to_home():
    return json_err('本地版未绑定上家系统')


@route('/OrderAjax/SaveOrderPublieMark')
def save_public_mark():
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(dynamicRemark=p.get('remark') or p.get('content')))
    add_log(o, '添加了订单备注：' + (p.get('remark') or p.get('content') or ''), '备注')
    return json_ok('保存成功')


# ---------------- 订单日志 / 内容 ----------------
@route('/OrderAjax/GetOrderLogs')
def order_logs():
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在', data=[])
    rows = db.find('order_logs', lambda r: r.get('orderId') == o['id'], 'createTime')
    return jsonify(dict(code=1, msg='', data=[dict(ID=r['id'], Note='【%s】%s' % (r.get('userName'), r.get('content')), createTime=r.get('createTime'), logType=r.get('logType')) for r in rows]))


@route('/OrderAjax/GetSysmteLogByOrderList')
def order_system_logs():
    o = find_order(P().get('orderId'))
    rows = db.find('system_logs', lambda r: o and r.get('joinOrderId') in (o.get('orderIdView'), str(o.get('orderId'))), 'createTime') if o else []
    return paged(rows)


@route('/OrderAjax/CopyOrderLog')
def copy_order_log():
    o = find_order(P().get('orderId'))
    if o:
        add_log(o, '复制了订单内容', '复制')
    return json_ok('ok')


@route('/OrderAjax/GetOrderContentById')
def order_content():
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在')
    return json_ok('', data=o.get('orderContent') or '')


@route('/OrderAjax/ReplyOrderCustomerMsg')
def reply_customer():
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    txt = (p.get('content') or '').strip()
    if not txt:
        return json_err('请输入回复内容')
    add_log(o, '客服回复：' + txt, '回复')
    if o.get('customerId'):
        notify_customer(o, '客服回复（订单 %s）' % o.get('orderIdView'), txt)
        return json_ok('已回复，客户在客户端可看到')
    return json_ok('回复已记录（该订单不是客户端会员下的单，短信通道本地未接入）')


# ---------------- 状态 / 价格 / 备注 等单项修改 ----------------
def _get(p_key='orderId'):
    p = P()
    o = find_order(p.get(p_key) or p.get('orderID') or p.get('orderIdx') or p.get('idx') or p.get('orderId'))
    return o if can_view_order(o) else None


@route('/OrderAjax/SetOrderSta')
def set_order_sta():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    sta = p.get('sta') or p.get('status')
    if sta not in STATUS_KEYS and sta != '抢单中':
        return json_err('状态不正确')
    remark = p.get('remark') or ''
    if sta == '问题单' and S('SK46') == 'Y' and not remark.strip():
        return json_err('系统设置要求改成问题单时必须填写原因备注')
    if is_dashou():
        if sta == '问题单' and S('SK30', 'N') == 'Y':
            return json_err('系统设置不允许打手将订单改成问题单')
        if o.get('orderSta') == '问题单' and S('SK31', 'N') != 'Y':
            return json_err('系统设置不允许打手更改问题单的状态')
        if o.get('orderSta') == '已暂停' and S('SK84', 'N') == 'Y':
            return json_err('系统设置不允许打手更改已暂停订单的状态')
        if o.get('orderSta') == '待验收' and S('SK72', 'N') == 'Y':
            return json_err('系统设置不允许打手更改待验收订单的状态')
        if sta == '待验收' and S('SK80') == 'Y' and not (o.get('imgs') or []):
            return json_err('系统设置要求交单前至少上传 1 张截图')
        if sta == '待验收' and S('SK91', 'Y') == 'Y':
            sta = '已完成'
    apply_status(o, sta, remark)
    return json_ok('状态已更新')


CUSTOMER_NOTICE = {'待上号': '您的订单已安排打手，等待上号', '代练中': '您的订单已开始代练', '待验收': '您的订单已完成代练，请验收', '已完成': '您的订单已完成，感谢支持',
                   '已暂停': '您的订单已暂停，如有疑问请联系客服', '问题单': '您的订单出现问题，客服会尽快联系您', '异常中': '您的订单出现异常，客服会尽快处理', '已退单': '您的订单已退单'}


def notify_customer(o, title, content):
    """客户端（/app）里的通知"""
    if o.get('customerId'):
        db.insert('client_notices', dict(customerId=o['customerId'], orderId=o['id'], orderNo=o.get('orderIdView'), title=title, content=content, isRead='N'))


def apply_status(o, sta, remark='', user=None):
    """状态流转的落库部分（后台 SetOrderSta 与客户端确认验收/撤单共用）"""
    old_status = o.get('orderSta')
    patch = dict(orderSta=sta)
    if old_status != sta:
        patch['statusEventId'] = secrets.token_hex(8)
    if sta == '代练中' and not o.get('startTime'):
        patch['startTime'] = now()
    if sta == '已完成':
        patch['completeTime'] = now()
        _create_emp_pay(o)
        if S('DeductionTiming', '0') == '1' and o.get('customerId') and not o.get('memberDeducted'):
            cust = db.get('customers', o['customerId'])
            if cust:
                _deduct_member(o, cust, float(o.get('price') or 0), when='交单')
    if sta == '待验收' and S('DeductionTiming', '0') == '1' and o.get('customerId') and not o.get('memberDeducted'):
        cust = db.get('customers', o['customerId'])
        if cust:
            _deduct_member(o, cust, float(o.get('price') or 0), when='交单')
    clear_at = {'Z': '代练中', 'Y': '已完成'}.get(S('SK137', 'N'))
    if clear_at and sta == clear_at:
        patch['gamePwd'] = ''
    db.update('orders', o['id'], patch)
    add_log(o, '将订单状态改为【%s】%s' % (sta, ('，原因：' + remark) if remark else ''), '状态', user=user)
    if sta in CUSTOMER_NOTICE:
        notify_customer(o, '订单 %s：%s' % (o.get('orderIdView'), sta), CUSTOMER_NOTICE[sta])
    if old_status != sta:
        publish_order(db.get('orders', o['id']), 'status', remark)


def _deduct_member(o, cust, amount, when='录单'):
    """从会员余额扣款（AllowDebt 允许欠款）"""
    bal = float(cust.get('balance') or 0)
    if bal < amount and S('AllowDebt', 'Y') != 'Y':
        add_log(o, '会员余额不足，未扣款（系统设置不允许欠款）', '会员')
        return
    newbal = round(bal - amount, 2)
    db.update('customers', cust['id'], dict(balance=newbal, arrearsNote=('欠款%.2f元' % -newbal) if newbal < 0 else cust.get('arrearsNote', '')))
    db.insert('customer_fees', dict(customerId=cust['id'], customerNo=cust.get('customerNo'), bossName=cust.get('bossName'), usageType='消费', amount=-amount, giftAmount=0, balance=newbal,
                                    orderNo=o.get('orderIdView'), payMode='余额', remark='%s时扣款' % when, actionUserName=uname()))
    db.update('orders', o['id'], dict(memberDeducted='Y'))
    add_log(o, '%s时从会员【%s】余额扣款 %.2f 元，余额 %.2f' % (when, cust.get('bossName'), amount, newbal), '会员')


def _create_emp_pay(o):
    if not o.get('recMan') or db.first('emp_pay', lambda r: r.get('orderId') == o['id']):
        return
    lst = o.get('assignees') or [dict(userId=o['recMan'], userName=o['recManName'], fee=o.get('recFee') or 0)]
    for x in lst:
        db.insert('emp_pay', dict(empPayId=o['id'], userId=x['userId'], userName=x['userName'], orderId=o['id'], orderIdView=o.get('orderIdView'), gameName=o.get('gameName'),
                                  gameRole=o.get('roleName'), dlProject=o.get('project'), tempAmount=float(x.get('fee') or 0), bonusAmount=0, deductFee=0, price=o.get('price'),
                                  netReceipts=o.get('netReceipts'), refundFee=o.get('refundFee', 0), empType='打手', taskId=o.get('taskId', 0), imgCount=len(o.get('imgs') or []),
                                  kefu=o.get('kefu'), orderSta='已完成', wangwang=o.get('WangWang'), taobaoPrice=o.get('price'), taobaoSta='', createTime=o.get('createTime'),
                                  completeTime=now(), exceedHours=0, logUserName=uname(), settingSta='N', settingTime='', applicationSett='N', empRemark='', payMode=1, orderSoure=o.get('orderSoure')))


@route(['/OrderAjax/ChangeOrderPrice', '/OrderAjax/ChangeOrderNetReceiptsPrice'])
def change_price():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    fee = p.float('fee')
    if S('SK15') == 'Y' and o.get('isSettStatus') == '已结算' and 'NetReceipts' not in request.path:
        return json_err('系统设置：已收款的订单禁止编辑价格')
    if 'NetReceipts' in request.path:
        db.update('orders', o['id'], dict(netReceipts=str(fee)))
        add_log(o, '修改实收款为 %s 元' % fee, '改价')
    else:
        db.update('orders', o['id'], dict(price=fee))
        add_log(o, '修改发单价 %s → %s 元' % (o.get('price'), fee), '改价')
    return json_ok('修改成功')


@route('/OrderAjax/UpdateDLOrderRevPriceByOrderID')
def change_rec_fee():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    fee = p.float('fee')
    db.update('orders', o['id'], dict(recFee=fee, recOrderInsureAmount=p.float('insureFee')))
    add_log(o, '修改接单价为 %s 元' % fee, '改价')
    return json_ok('修改成功')


@route('/EmpAjax/ChangeOrderRecPrice')
def change_rec_price_emp():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    fee = p.float('fee') or p.float('price')
    lst = o.get('assignees') or []
    for x in lst:
        if str(x.get('userId')) == str(p.get('uid') or p.get('userId')):
            x['fee'] = fee
    db.update('orders', o['id'], dict(recFee=round(sum(float(x['fee']) for x in lst), 2) if lst else fee, assignees=lst))
    add_log(o, '修改接手人接单价为 %s 元' % fee, '改价')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderRemark')
def change_remark():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(orderRemark=p.get('remark')))
    add_log(o, '修改重要备注：' + p.get('remark'), '备注')
    return json_ok('修改成功')


@route('/OrderAjax/upOrderTips')
def up_order_tips():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(otherRemark=p.get('content')))
    add_log(o, '修改提示：' + p.get('content'), '备注')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderProject')
def change_project():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(project=p.get('newProject')))
    add_log(o, '修改代练项目为：' + p.get('newProject'), '编辑')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderGameRoleNameByOrderId')
def change_role_name():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(roleName=p.get('newRoleName')))
    add_log(o, '修改角色名为：' + p.get('newRoleName'), '编辑')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderSoureId')
def change_source():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    src = db.get('sources', p.get('value'))
    name = src['soureName'] if src else p.get('value')
    db.update('orders', o['id'], dict(orderSoure=name))
    add_log(o, '修改订单来源为：' + name, '编辑')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderShphone')
def change_sphone():
    p = P()
    o = _get('idx')
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(sphone=p.get('sphone')))
    add_log(o, '修改指定电话', '编辑')
    return json_ok('修改成功')


@route('/OrderAjax/RevealOrderPassword')
def reveal_order_password():
    o = _get()
    if not o:
        return json_err('订单不存在')
    if current_user().get('prohibitedViewOrderPwd') == 'Y':
        return json_err('无权查看游戏登录密码'), 403
    add_log(o, '查看了游戏登录密码', '敏感资料')
    return json_ok('', data={'gamePwd': o.get('gamePwd') or ''})


@route('/OrderAjax/ChangeOrderPwd')
def change_pwd():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    new_password = p.get('pwd') or p.get('newPwd') or p.get('value')
    if not new_password:
        return json_err('新密码不能为空')
    db.update('orders', o['id'], dict(gamePwd=new_password))
    add_log(o, '更改了游戏登录密码', '编辑')
    return json_ok('修改成功')


@route('/OrderAjax/ChangeOrderLock')
def change_lock():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    v = p.get('value')
    lock = 'Y' if v in ('Y', '1', 'true') else ('N' if v in ('N', '0', 'false') else ('N' if o.get('isLock') == 'Y' else 'Y'))
    db.update('orders', o['id'], dict(isLock=lock))
    add_log(o, '锁定订单' if lock == 'Y' else '解锁订单', '锁定')
    return json_ok('已锁定' if lock == 'Y' else '已解锁')


@route(['/OrderAjax/UrgentOrderByIDX', '/OrderAjax/changeOrderJiaji'])
def urgent_order():
    o = _get()
    if not o:
        return json_err('订单不存在')
    v = 'N' if o.get('isJiaJi') == 'Y' else 'Y'
    db.update('orders', o['id'], dict(isJiaJi=v))
    add_log(o, '标记为加急' if v == 'Y' else '取消加急', '加急')
    return json_ok('已加急' if v == 'Y' else '已取消加急')


@route('/OrderAJax/ChangeOrderBussType')
def change_buss_type():
    p = P()
    o = _get('orderIdx')
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(bussType=p.int('value') or 1))
    return json_ok('修改成功')


@route('/OrderAjax/SetOrderJiWei')
def set_jiwei():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    db.update('orders', o['id'], dict(jiwei=p.get('jiwei')))
    add_log(o, '设置机位：' + p.get('jiwei'), '编辑')
    return json_ok('设置成功')


@route('/OrderAjax/UpSettlementOrderByIDX')
def up_settlement():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    sta = p.get('sta') or '已结算'
    db.update('orders', o['id'], dict(isSettStatus=sta))
    add_log(o, '收款状态改为【%s】' % sta, '结算')
    return json_ok('修改成功')


@route('/OrderAjax/UpdateOrderLabel')
def update_label():
    p = P()
    label = p.get('label')
    lb = db.first('labels', lambda r: r['labelName'] == label or str(r['id']) == str(label))
    for x in p.list('ids'):
        o = find_order(x)
        if o:
            db.update('orders', o['id'], dict(orderLabel=lb['labelName'] if lb else label, orderLabelColor=lb.get('colorValue') if lb else None))
            add_log(o, '设置标签：' + (lb['labelName'] if lb else label), '标签')
    return json_ok('标签已更新')


@route('/OrderAjax/DelOrderByIDX')
def del_order():
    p = P()
    o = _get('orderID')
    if not o:
        return json_err('订单不存在')
    if o.get('isLock') == 'Y':
        return json_err('订单已锁定，不能删除')
    db.update('orders', o['id'], dict(isDel='Y', delTime=now(), delUserName=uname()))
    if p.get('isDelEmp') in ('Y', '1', 'true'):
        for r in db.find('emp_pay', lambda r: r.get('orderId') == o['id']):
            db.delete('emp_pay', r['id'])
    add_log(o, '删除了订单（可在回收站找回）', '删除')
    return json_ok('删除成功')


@route('/OrderAjax/CopyOrderToNewOrder')
def copy_order():
    if S('SK150') == 'Y':
        return json_err('系统设置已关闭“一键复制成新单”功能')
    o = _get()
    if not o:
        return json_err('订单不存在')
    d = {k: v for k, v in o.items() if k not in ('id',)}
    d.update(orderId=new_order_id(), orderIdView=datetime.datetime.now().strftime('%y%m%d%H%M%S') + 'C', orderSta='未分配', recMan=0, recManName='', recFee=0, assignees=[],
             createTime=now(), startTime='', completeTime=None, recOrderTime=None, isSettStatus='未结算', refundFee=0, isDel='N', delTime=None, delUserName=None, labels=[], imgs=[],
             kefu=uname(), kefuId=uid(), addOrderUserName=uname(), addOrderUserId=uid())
    n = db.insert('orders', d)
    add_log(n, '由订单 %s 复制生成' % o.get('orderIdView'), '录单')
    return json_ok('复制成功，新订单号 ' + n['orderIdView'], data=n['orderId'])


@route('/OrderAjax/AddOrderRefundLogs')
def add_refund():
    p = P()
    o = _get('orderIdx')
    if not o:
        return json_err('订单不存在')
    fee = p.float('fee')
    patch = dict(refundFee=round(float(o.get('refundFee') or 0) + fee, 2), refundModel=p.get('refundModel'), refundTimeStr=p.get('sdate') or now(), refundUserName=uname(), refundUserId=uid())
    if p.get('changeOrderStatus') in ('Y', '1', 'true'):
        patch['orderSta'] = '已退单'
    db.update('orders', o['id'], patch)
    db.insert('refund_logs', dict(orderId=o['id'], orderIdView=o.get('orderIdView'), fee=fee, refundModel=p.get('refundModel'), tranNo=p.get('tranNo'), remark=p.get('remark'), userName=uname()))
    add_log(o, '记录退款 %s 元（%s）%s' % (fee, p.get('refundModel'), p.get('remark') or ''), '退款')
    return json_ok('退款记录已保存')


@route('/OrderAjax/GetRecEmpAmountByOrderId')
def rec_emp_amount():
    p = P()
    out = []
    for x in p.list('orderIds'):
        o = find_order(x)
        if o:
            out.append(dict(orderId=str(o.get('orderId')), recFee=o.get('recFee', 0), recManName=o.get('recManName')))
    return json_ok('', data=out)


@route('/OrderAjax/BuilderSellEmpOrderLog')
def builder_sell_emp():
    o = _get()
    if not o:
        return json_err('订单不存在')
    if not o.get('recMan'):
        return json_err('订单还没有接手人')
    _create_emp_pay(o)
    return json_ok('已生成打手报酬记录')


@route('/OrderAjax/GetUserQQByOrderId')
def user_qq_by_order():
    o = _get()
    if not o:
        return json_err('订单不存在')
    return json_ok(o.get('qq') or '', data=o.get('qq') or '')


@route(['/OrderAjax/GetOrderClientOrderUrlLink', '/OrderAjax/GetBuiderGameScanQrCode', '/orderajax/GetGroupCode', '/orderajax/GetCustomerGroupCode'])
def order_links():
    o = _get()
    if not o:
        return json_err('订单不存在')
    return json_ok(request.host_url.rstrip('/') + '/Order/ClientOrderGenerate?oid=' + str(o['id']), data=request.host_url.rstrip('/') + '/Order/ClientOrderGenerate?oid=' + str(o['id']))


@route('/OrderAjax/GetSendGroupNewOrderMsg')
def group_new_order_message():
    ids = P().ids('ids')[:20]
    orders = [db.get('orders', order_id) for order_id in ids]
    messages = [order_message(o, 'created') for o in orders if o and can_view_order(o)]
    if not messages:
        return json_err('没有可查看的订单')
    content = '\n\n'.join(messages)
    return json_ok('已生成群消息', data=content, layer='<pre style="white-space:pre-wrap">%s</pre>' % html.escape(content))


@route(['/OrderAjax/SendOrderToMySystem', '/OrderAjax/ChcekAsynFailOrder', '/OrderAjax/NoticeGamePalyerSmsCode', '/OrderAjax/SendShNotityToPalyer',
        '/OrderAjax/GetPrivatePhone', '/OrderAjax/OrderUnVirtualPhone'])
def order_external_stub():
    return json_err('本地版未接入该外部服务')


@route('/OrderAjax/SplitOrderByLine')
def split_order():
    p = P()
    o = _get()
    if not o:
        return json_err('订单不存在')
    lines = [x.strip() for x in (p.get('content') or o.get('orderContent') or '').splitlines() if x.strip()]
    if len(lines) < 2:
        return json_err('订单内容不足两行，无法拆分')
    made = 0
    for ln in lines[1:]:
        d = {k: v for k, v in o.items() if k != 'id'}
        d.update(orderId=new_order_id(), orderIdView=o.get('orderIdView') + '-%d' % (made + 2), project=ln, orderContent=ln, isSplitOrder='Y', splitId=o['id'], orderSta='未分配',
                 recMan=0, recManName='', recFee=0, assignees=[], createTime=now(), startTime='', completeTime=None, isSettStatus='未结算', labels=[], imgs=[])
        db.insert('orders', d); made += 1
    db.update('orders', o['id'], dict(project=lines[0], isSplitOrder='Y'))
    add_log(o, '拆分为 %d 笔订单' % (made + 1), '拆分')
    return json_ok('拆分成功，生成 %d 笔新订单' % made)


# ---------------- 团长 / 交易平台相关（本地占位） ----------------
@route('/UserAjax/GetGroupMangeList')
def group_manage_list():
    rows = active_users(P().get('gameName'), ['团长', '打手'])
    return json_ok('', data=[dict(id=r['id'], name=r['userName'], value=r['id']) for r in rows])


@route('/UserAjax/GetZpRootUsers')
def zp_root_users():
    return json_ok('', data=[dict(id=r['id'], name=r['userName'], value=r['id']) for r in active_users(None, ['团长'])])


@route('/OrderAjax/SaveOrderToGroupManger')
def save_group_manager():
    p = P()
    o = _get('orderIdx')
    if not o:
        return json_err('订单不存在')
    ru = db.get('users', p.get('uid'))
    if not ru:
        return json_err('人员不存在')
    patch = dict(groupMangeUid=ru['id'], groupMangeName=ru['userName'])
    if p.get('changeOrderStatus') in ('Y', '1', 'true') and o.get('orderSta') == '未分配':
        patch['orderSta'] = '待上号'
    db.update('orders', o['id'], patch)
    add_log(o, '交给团长【%s】管理，费用 %s' % (ru['userName'], p.get('fee')), '指派')
    return json_ok('保存成功')


@route('/OrderAjax/GetOrderGroupMangerLog')
def group_manager_log():
    o = _get()
    return json_ok('', data=[dict(userName=o.get('groupMangeName'), createTime=o.get('createTime'))] if o and o.get('groupMangeUid') else [])


@route('/OrderAjax/ClearOrderToGroupManger')
def clear_group_manager():
    o = _get('orderIdx')
    if o:
        db.update('orders', o['id'], dict(groupMangeUid=0, groupMangeName=''))
        add_log(o, '清除了团长', '指派')
    return json_ok('已清除')


@route(['/OrderAjax/GetTransactionOrderByOrderIdFunc', '/OrderAjax/GetTransactionOrderListSimpl', '/OrderAjax/GetPlatfromOrderIdList', '/OrderAjax/GetPushPlatfromOrderActionLogList',
        '/OrderAjax/GetPlatmPushOperateReport', '/OrderAjax/GetPushPlatfromOrderActionLogMangeList', '/OrderAjax/GetTbSendRecordList',
        '/OrderAjax/GetSoureOrderChangePriceLogList', '/OrderAjax/GetRecPlayerChatMsgList', '/OrderAjax/GetRecPlayerChatMsgDetailsList'])
def platform_lists():
    return table([])


@route(['/OrderAjax/ChangeTransctionOrderRevoke', '/OrderAjax/ChangeTransctionOrderLock', '/OrderAjax/EditTransctionOrderPrice', '/OrderAjax/DeTransctionPlatformOrder',
        '/OrderAjax/DeTransctionAllPlatformOrder', '/OrderAjax/AppendAllTransctionOrderPrice', '/OrderAjax/sendDLOrderRevPriceByOrderID'])
def platform_ops():
    return json_err('本地版未对接交易平台')


@route('/OrderAjax/GetOrderItemNeedLIst')
def order_item_need():
    return table([])


@route(['/OrderAjax/UpdateItemNeedListCount'])
def order_item_need_update():
    return json_ok('ok')
