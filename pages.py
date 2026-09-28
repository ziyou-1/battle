# -*- coding: utf-8 -*-
"""页面渲染时注入的上下文（原站由服务端渲染的下拉/隐藏值/编辑态数据）"""
import datetime
from flask import abort, request
import db
from api import current_user
from api.game import games_sorted, catalog
from api.order import can_view_order, find_order, serialize, STATUS_COLOR


def _q(*names):
    for n in names:
        for k in request.args:
            if k.lower() == n.lower():
                return request.args.get(k)
    return ''


def order_ctx(ctx):
    o = find_order(_q('orderId', 'orderID', 'oid', 'id'))
    if not o:
        return
    if not can_view_order(o):
        abort(403)
    so = serialize(o)
    ctx['o'] = so
    ctx['staColor'] = STATUS_COLOR.get(so.get('orderSta'), '#666')
    try:
        end = datetime.datetime.strptime(so['expectEndTime'], '%Y-%m-%d %H:%M:%S')
        left = end - datetime.datetime.now()
        secs = int(left.total_seconds())
        sign = '' if secs >= 0 else '-'
        secs = abs(secs)
        ctx['remain'] = '%s%d天%d时%d分' % (sign, secs // 86400, secs % 86400 // 3600, secs % 3600 // 60)
    except (TypeError, ValueError):
        ctx['remain'] = '0天0时0分'


def page_context(key, base):
    u = current_user() or {}
    games = games_sorted()
    ctx = dict(games=games, games_real=[g for g in games if g['gameName'] != '全部游戏'], catalog=catalog(),
               user_games=[x for x in str(u.get('games') or '').split(',') if x],
               defaultGame=next((g['gameName'] for g in games if g.get('isDefulat') == 'Y'), games[0]['gameName'] if games else ''),
               payAlipayAccs=[dict(id=r['id'], acc=r['alipayAcc']) for r in db.all_('users') if r.get('alipayAcc') and r.get('jobName') in ('系统管理员', '老板', '财务')],
               settings=db.setting('system', {}), roles=db.all_('roles'), viewType=_q('viewType') or '10',
               taskId=_q('taskId') or '0', taskNeedJobId=_q('taskNeedJobId') or '0', accId=_q('gameAccId') or _q('ids') or '')
    from api.system import user_permissions
    perms = user_permissions(u) if u else set()
    ctx['can'] = lambda href: href.lower().lstrip('/') in perms
    ctx['perms'] = perms
    ctx['sms_settings'] = db.setting('sms', {})
    for k in ('privacyPhone', 'wechat', 'homeSystem', 'clientWriteOrder', 'award', 'certSetting', 'contractSetting', 'taobaoShip', 'pddShip'):
        ctx[k + '_settings'] = db.setting(k, {})
    S = ctx['settings']
    admin_like = bool(u) and (u.get('isSuper') or u.get('jobName') in ('系统管理员', '老板', '财务'))
    ctx['flags'] = dict(IsViewServer=S.get('SK47', 'Y'), moreOpenOrderDetails=S.get('SK42', 'N'), remarkLocation=S.get('SK55', 'N'), isEnableServiceAmount=S.get('SK111', 'N'),
                        rightMenuCopyOrder=S.get('SK66', 'Y'), taskPullDownListIsViewAll=S.get('SK71', 'N'), orderSoureOnlyViewSoure=S.get('SK74', 'N'), isViewSoure=S.get('SK101', 'N'),
                        isViewNetReceipts=S.get('SK143', 'N'), isViewWW=S.get('SK60', 'N'), isChangeService='N' if S.get('SK43', 'Y') == 'Y' else 'Y', memberDedSwitch=S.get('SK148', 'N'),
                        serviceObject=S.get('OnlinePayDecPt', '0'), isAdmin=20 if admin_like else 10, readPriceIsAllowEdit=S.get('SK44', 'N'), hideFindWork=(S.get('SK70', 'Y') == 'Y' and bool(u) and u.get('jobName') == '打手'))
    # 编辑态：订单 / 人员
    if key in ('order/orderview', 'order/addorder', 'order/assignation', 'emp/changerecpricebyorder', 'order/sendsms', 'order/uploadpic', 'group/neworder togroup'.replace(' ', ''),
               'group/ordergroup', 'order/clientordergenerate'):
        order_ctx(ctx)
    if key in ('user/adduser', 'user/setgames', 'user/edituser'):
        eu = db.get('users', _q('uid', 'id', 'userId'))
        if eu:
            ctx['eu'] = eu
            ctx['eu_games'] = [x for x in str(eu.get('games') or '').split(',') if x]
    if key == 'emp/settlementemp':
        ids = [x for x in (_q('ids') or '').replace('，', ',').split(',') if x.strip().isdigit()]
        recs = [r for r in (db.get('emp_pay', int(x)) for x in ids) if r]
        total = round(sum(float(r.get('tempAmount') or 0) for r in recs), 2)
        real = round(sum(float(r.get('tempAmount') or 0) + float(r.get('bonusAmount') or 0) - float(r.get('deductFee') or 0) for r in recs), 2)
        ctx['sett'] = dict(count=len(recs), total='%.2f' % total, real='%.2f' % real, names='、'.join(sorted(set(r.get('userName', '') for r in recs))), ids=','.join(str(r['id']) for r in recs),
                           allSettled=bool(recs) and all(r.get('settingSta') == 'Y' for r in recs))
    if key in ('group/groupdetails', 'group/groupdetails2025'):
        from api.pvetask import task_row
        t = db.get('pve_tasks', _q('taskID', 'taskId', 'id'))
        if t:
            ctx['task'] = task_row(t)
            for j in ctx['task'].get('jobs') or []:
                o = db.get('orders', j.get('orderId')) if j.get('orderId') else None
                j['orderIdView'] = o.get('orderIdView') if o else ''
            ctx['task_logs'] = [l for l in db.find('system_logs', lambda l: l.get('logType') == '排团' and ('【%s】' % t.get('taskName')) in (l.get('remark') or ''), 'createTime')]
            for l in ctx['task_logs']:
                l['content'] = l.get('remark')
    if key in ('gameaccounts/gameaccdetails', 'gameaccounts/assignationgamacc'):
        from api.gameaccounts import acc_row
        a = db.get('game_accounts', _q('gameAccId', 'accId', 'id'))
        if a:
            from api.gameaccounts import can_view_account
            if not can_view_account(a):
                abort(403)
            ctx['acc'] = acc_row(a)
    if key == 'system/clientsetting':
        ctx['c'] = db.setting('clientSetting', {}) or {}
    if key == 'user/editusergroup':
        ctx['group'] = db.get('user_groups', _q('groupId', 'id'))
        ctx['group_roles'] = [x for x in str((ctx['group'] or {}).get('containJobName') or '').split(',') if x]
    if key == 'user/adduserloginrestrict':
        ctx['rr'] = db.get('login_restrict', _q('id'))
    if key in ('system/addeditroleauthority', 'system/roleauthorityview'):
        ctx['role'] = db.get('roles', _q('roleId', 'id'))
    today = datetime.date.today()
    ctx['taskDates'] = [dict(value=(today + datetime.timedelta(days=i)).strftime('%Y-%m-%d'), title=(today + datetime.timedelta(days=i)).strftime('%m月%d日')) for i in range(-6, 6)]
    return ctx
