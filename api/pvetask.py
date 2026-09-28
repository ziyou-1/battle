# -*- coding: utf-8 -*-
"""游戏排团（PveTask）：新建排团、旧版/2021版/2025版排团、我参与的排团、公开坑位"""
import json, datetime, re
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .game import resolve_game
from .order import find_order, add_log, dec

WEEK = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']


def task_row(t):
    d = dict(t)
    d['taskId'] = t['id']
    jobs = t.get('jobs') or []
    d['totalCount'] = len(jobs)
    d['gameAccCount'] = len([j for j in jobs if j.get('userName') or j.get('orderId')])
    d['lackJobName'] = ','.join(j.get('jobName', '') for j in jobs if not (j.get('userName') or j.get('orderId')))
    d['postionAmount'] = sum(float(j.get('postionPrice') or 0) for j in jobs)
    d['orderId'] = ','.join(str(j.get('orderId')) for j in jobs if j.get('orderId')) or t.get('orderId') or ''
    return d


def find_task(val):
    try:
        return db.get('pve_tasks', int(float(val)))
    except (TypeError, ValueError):
        return None


def _filter(rows, p):
    g = p.get('gameId') or p.get('gameName')
    if g and g not in ('0', '全部游戏', ''):
        gm = resolve_game(g)
        name = gm['gameName'] if gm else g
        if name != '全部游戏':
            rows = [t for t in rows if t.get('gameName') == name]
    lid = p.get('leaderId') or p.get('leaderIds')
    if lid and lid not in ('0', ''):
        ids = set(str(x) for x in str(lid).split(',') if x)
        rows = [t for t in rows if str(t.get('leaderId')) in ids or t.get('leaderUserName') in ids]
    sta = p.get('taskStatus') or p.get('groupSta') or p.get('sta')
    if sta:
        stas = set(x for x in str(sta).split(',') if x)
        rows = [t for t in rows if t.get('taskStatus') in stas]
    gg = dec(p.get('groupName') or p.get('gameGroup'))
    if gg and gg != '全部':
        rows = [t for t in rows if t.get('gameGroup') == gg]
    kw = dec(p.get('key'))
    if kw:
        rows = [t for t in rows if db.like(t, ['taskName', 'proJectName', 'remark', 'leaderUserName'], kw)]
    dt = dec(p.get('date'))
    if dt and re.fullmatch(r'-?\d+(,-?\d+)*', dt):
        # 2021 版看板：0=本周CD 1=下个CD -1=上个CD 2=本月（CD 周从周三算起）
        today = datetime.date.today()
        wed = today - datetime.timedelta(days=(today.weekday() - 2) % 7)
        wins = []
        for x in dt.split(','):
            x = int(x)
            if x == 2:
                wins.append((today.replace(day=1), (today.replace(day=28) + datetime.timedelta(days=4)).replace(day=1)))
            else:
                a = wed + datetime.timedelta(days=7 * x)
                wins.append((a, a + datetime.timedelta(days=7)))
        def in_win(t):
            d = (t.get('startTime') or '')[:10]
            return any(a.strftime('%Y-%m-%d') <= d < b.strftime('%Y-%m-%d') for a, b in wins)
        rows = [t for t in rows if in_win(t)]
    elif dt:
        rows = [t for t in rows if (t.get('startTime') or '')[:10] == dt[:10]]
    ob = p.get('orderBy') or p.get('taskSort') or '0'
    if ob == '1':
        rows.sort(key=lambda t: t.get('createTime') or '', reverse=True)
    elif ob == '2':
        rows.sort(key=lambda t: t.get('createTime') or '')
    elif ob == '3':
        rows.sort(key=lambda t: t.get('startTime') or '', reverse=True)
    elif ob == '4':
        rows.sort(key=lambda t: t.get('startTime') or '')
    else:
        rows.sort(key=lambda t: (-(t.get('orderBy') or 0), t.get('startTime') or ''), reverse=False)
    return rows


# ---------------- 列表 ----------------
@route('/PveTaskAjax/GetGroupList')
def group_list():
    rows = _filter(db.all_('pve_tasks'), P())
    return paged([task_row(t) for t in rows])


@route('/PveTaskAjax/GetMyGroup')
def my_group():
    u = current_user()
    rows = [t for t in db.all_('pve_tasks') if t.get('leaderId') == u['id'] or any(j.get('userId') == u['id'] or j.get('userName') == u['userName'] for j in (t.get('jobs') or []))]
    rows = _filter(rows, P())
    return paged([task_row(t) for t in rows])


@route('/PveTaskAjax/GetNewsGroupList')
def news_group_list():
    """2021 版排团看板：每个团是一组行，item[0] 带团信息，每行一个坑位"""
    p = P()
    rows = _filter(db.all_('pve_tasks'), p)
    page, limit = p.int('page', 1), p.int('limit', 10)
    out = []
    for t in db.paginate(rows, page, limit):
        try:
            st = datetime.datetime.strptime((t.get('startTime') or now())[:19], '%Y-%m-%d %H:%M:%S')
            week = WEEK[st.weekday()]
            gap = st - datetime.datetime.now()
            gap_str = ('还有%d天%d小时开团' % (gap.days, gap.seconds // 3600)) if gap.total_seconds() > 0 else '已到开团时间'
        except ValueError:
            week, gap_str = '', ''
        base = dict(taskId=t['id'], taskName=t.get('taskName'), taskStatus=t.get('taskStatus'), startTime=t.get('startTime'), startTimeStr=(t.get('startTime') or '')[5:16],
                    startTimeWeek=week, taskColorValue=t.get('taskColorValue') or '', taskGameGroup=t.get('gameGroup') or '', taskRemark=t.get('remark') or '',
                    proJect=t.get('proJectName') or '', gameServer=t.get('gameServer') or t.get('gameArea') or '', leaderID=t.get('leaderId') or 0,
                    thisTaskGapStr=gap_str, leaderUserName=t.get('leaderUserName') or '', gameName=t.get('gameName'))
        jobs = t.get('jobs') or []
        lst = []
        for idx, j in enumerate(jobs):
            o = find_order(j.get('orderId')) if j.get('orderId') else None
            lst.append(dict(base, pid=j.get('pid') or (idx + 1), taskAccLogId=j.get('taskAccLogId') or 0, gameJob=j.get('jobName') or '', recUser=j.get('userName') or '',
                            orderId=str(j.get('orderId') or ''), gameAccId=j.get('gameAccId') or 0, accType=('B' if o else ('A' if j.get('gameAccId') else '')),
                            gameRoleName=(o.get('roleName') if o else j.get('roleName') or ''), gameGroup=(o.get('gameGroup') if o else j.get('gameTf') or ''),
                            isPublic=j.get('isPublic') or 'N', itemRemark=(o.get('itemRemark') if o else ''), orderTips=(o.get('orderRemark') if o else ''),
                            otherRemark=(o.get('otherRemark') if o else ''), dlProject=(o.get('project') if o else j.get('remark') or ''), remark=j.get('remark') or '',
                            customizeOrderBy=j.get('orderBy') or 0, needItemLevel=j.get('needItemLevel') or '', postionPrice=j.get('postionPrice') or 0))
        if not lst:
            lst.append(dict(base, pid=0, taskAccLogId=0, gameJob='', recUser='', orderId='', gameAccId=0, accType='', gameRoleName='', gameGroup='', isPublic='N', itemRemark='',
                            orderTips='', otherRemark='', dlProject='', remark='', customizeOrderBy=0))
        out.append(lst)
    return jsonify(dict(code=0, msg='', count=len(rows), data=out))


@route('/PveTaskAjax/GetNewsGroupOrderList')
def news_group_order_list():
    """看板右侧：可拖进团的订单"""
    p = P()
    rows = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('orderSta') in ('未分配', '待上号', '代练中')]
    g = p.get('gameId') or p.get('gameName')
    if g and g not in ('0', '', '全部游戏'):
        gm = resolve_game(g)
        if (gm['gameName'] if gm else g) != '全部游戏':
            rows = [o for o in rows if o.get('gameName') == (gm['gameName'] if gm else g)]
    gg = dec(p.get('gameGroup') or p.get('gameGroup_order'))
    if gg and gg != '全部':
        rows = [o for o in rows if o.get('gameGroup') == gg]
    sta = p.get('orderSta')
    if sta:
        rows = [o for o in rows if o.get('orderSta') == sta]
    ts = p.get('taskSelect')
    if ts == '10':
        rows = [o for o in rows if not o.get('taskId')]
    elif ts == '20':
        rows = [o for o in rows if o.get('taskId')]
    kw = dec(p.get('key'))
    if kw:
        rows = [o for o in rows if db.like(o, ['orderIdView', 'roleName', 'project', 'gameInfo'], kw)]
    rows.sort(key=lambda o: o.get('createTime') or '', reverse=True)
    out = [dict(action='', orderIdView=o.get('orderIdView'), orderId=str(o.get('orderId')), oid=o['id'], gameGroup=o.get('gameGroup'), project=o.get('project'), gameInfo=o.get('gameInfo'),
                orderSta=o.get('orderSta'), orderSoure=o.get('orderSoure'), price=o.get('price'), recMan=o.get('recManName'), orderRemark=o.get('orderRemark'), createTime=o.get('createTime'),
                roleName=o.get('roleName'), gameJob=o.get('gameJob'), taskId=o.get('taskId') or 0, gameName=o.get('gameName')) for o in rows]
    from .order import totals
    return paged(out, total=totals(rows))


# ---------------- 新建 / 编辑 ----------------
@route('/PveTaskAjax/AddEditPveTask')
def add_edit_task():
    p = P()
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        f = {}
    try:
        jobcfg = json.loads(p.get('jobConfig') or '[]')
    except ValueError:
        jobcfg = []
    name = (f.get('taskName') or f.get('groupName') or '').strip()
    if not name:
        return json_err('排团名称不能为空')
    gm = resolve_game(f.get('gameName') or f.get('gameId'))
    leader = db.get('users', f.get('leaderID') or f.get('taskMangeUid'))
    jobs = []
    for i, j in enumerate(jobcfg if isinstance(jobcfg, list) else []):
        ru = db.get('users', j.get('userId')) if j.get('userId') else None
        jobs.append(dict(pid=i + 1, index=i + 1, jobName=j.get('jobName') or j.get('name') or ('坑位%d' % (i + 1)), needItemLevel=j.get('needItemLevel') or '', gameTf=j.get('gameTf') or '',
                         postionPrice=float(j.get('postionPrice') or j.get('price') or 0), remark=j.get('remark') or '', userName=ru['userName'] if ru else (j.get('userName') or ''),
                         userId=ru['id'] if ru else 0, orderId=j.get('orderId') or 0, gameAccId=0, isPublic='N', orderBy=0))
    d = dict(taskName=name, proJectName=f.get('project') or f.get('selectProject') or f.get('proJectName') or '', gameName=gm['gameName'] if gm else (f.get('gameName') or ''),
             gameId=gm['id'] if gm else 0, gameArea=f.get('gameArea') or '', gameServer=f.get('gameServer') or '', gameGroup=f.get('gameGroup') or f.get('groupName') or '',
             leaderId=leader['id'] if leader else 0, leaderUserName=leader['userName'] if leader else '', startTime=(f.get('startDate') or f.get('startTime') or now())[:19],
             endTime=(f.get('endDate') or f.get('endTime') or '')[:19], difficulty=f.get('difficulty') or '', remark=f.get('remark') or '', isConfigJob=p.get('isConfigJob') or 'N',
             isPublic='N', taskColorValue='')
    tid = f.get('taskId') or p.get('taskId')
    try:
        tid = int(tid or 0)
    except ValueError:
        tid = 0
    if tid:
        t = db.get('pve_tasks', tid)
        if not t:
            return json_err('排团不存在')
        if jobs:
            d['jobs'] = jobs
        db.update('pve_tasks', tid, d)
        log('排团', '修改排团【%s】' % name)
        return json_ok('修改成功', data=tid)
    d.update(taskStatus='A', jobs=jobs, orderBy=0)
    t = db.insert('pve_tasks', d)
    log('排团', '新建排团【%s】' % name)
    return json_ok('新建成功', data=t['id'])


@route('/PveTaskAjax/CopyToNewGroup')
def copy_group():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    d = {k: v for k, v in t.items() if k != 'id'}
    d.update(taskName=p.get('taskName') or (t['taskName'] + '-副本'), gameGroup=p.get('groupName') or t.get('gameGroup'), startTime=(p.get('startDate') or t.get('startTime'))[:19],
             remark=p.get('remark') or '', proJectName=p.get('project') or t.get('proJectName'), gameServer=p.get('gameServer') or t.get('gameServer'), taskStatus='A',
             jobs=[dict(j, userName='', userId=0, orderId=0, gameAccId=0, taskAccLogId=0) for j in (t.get('jobs') or [])], createTime=now())
    n = db.insert('pve_tasks', d)
    return json_ok('复制成功', data=n['id'])


@route('/PveTaskAjax/ChangeTaskMainInfo')
def change_task_main():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    leader = db.get('users', p.get('taskMangeUid'))
    db.update('pve_tasks', t['id'], dict(taskName=p.get('taskName') or t['taskName'], gameGroup=p.get('groupName') or t.get('gameGroup'), startTime=(p.get('startDate') or t.get('startTime'))[:19],
                                         remark=p.get('remark'), proJectName=p.get('project') or t.get('proJectName'), gameServer=p.get('gameServer') or t.get('gameServer'),
                                         leaderId=leader['id'] if leader else t.get('leaderId'), leaderUserName=leader['userName'] if leader else t.get('leaderUserName')))
    return json_ok('保存成功')


def _task_field(field, key='value'):
    def fn():
        p = P()
        t = find_task(p.get('taskId'))
        if not t:
            return json_err('排团不存在')
        db.update('pve_tasks', t['id'], {field: p.get(key)})
        return json_ok('修改成功')
    return fn


route('/PveTaskAjax/ChangeTaskStrartTime')(_task_field('startTime', 'stime'))
route('/PveTaskAjax/EditPveTeamProject')(_task_field('proJectName', 'project'))
route('/PveTaskAjax/SetTaskColorValue')(_task_field('taskColorValue', 'color'))


@route('/PveTaskAjax/ChangeTaskOrderBy')
def task_order_by():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    db.update('pve_tasks', t['id'], dict(orderBy=p.int('value')))
    return json_ok('修改成功')


@route('/PveTaskAjax/EditPveTeamPostionAmount')
def team_postion_amount():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    amt = p.float('amount')
    jobs = t.get('jobs') or []
    for j in jobs:
        j['postionPrice'] = amt
    db.update('pve_tasks', t['id'], dict(jobs=jobs, postionAmount=amt * len(jobs)))
    return json_ok('修改成功')


@route('/PveTaskAjax/UpPveTaskSta')
def task_status():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    sta = p.get('sta') or 'B'
    db.update('pve_tasks', t['id'], dict(taskStatus=sta))
    names = {'A': '未开始', 'B': '进行中', 'C': '已完成', 'D': '已暂停'}
    log('排团', '排团【%s】状态改为 %s' % (t['taskName'], names.get(sta, sta)))
    return json_ok('状态已更新')


@route('/PveTaskAjax/DelPveTask')
def del_task():
    t = find_task(P().get('taskId'))
    if not t:
        return json_err('排团不存在')
    for j in t.get('jobs') or []:
        o = find_order(j.get('orderId')) if j.get('orderId') else None
        if o:
            db.update('orders', o['id'], dict(taskId=0, taskName=None))
    db.delete('pve_tasks', t['id'])
    log('排团', '删除排团【%s】' % t['taskName'])
    return json_ok('删除成功')


# ---------------- 坑位操作 ----------------
def _job(t, pid):
    for j in t.get('jobs') or []:
        if str(j.get('pid')) == str(pid) or str(j.get('index')) == str(pid):
            return j
    return None


@route('/PveTaskAjax/ChangeTaskNeedJobRecUser')
def change_job_user():
    p = P()
    pid = p.get('pid')
    for t in db.all_('pve_tasks'):
        j = _job(t, pid)
        if j and (str(t['id']) == str(p.get('taskId')) or not p.get('taskId')):
            ru = db.get('users', p.get('userId'))
            j['userName'] = ru['userName'] if ru else ''
            j['userId'] = ru['id'] if ru else 0
            db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
            return json_ok('已指定打手')
    return json_err('坑位不存在')


@route('/PveTaskAjax/SetTaskPostionOrder')
def set_postion_order():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    o = find_order(p.get('orderId') or p.get('oid'))
    if not o:
        return json_err('订单不存在')
    j = _job(t, p.get('pid'))
    if not j:
        j = dict(pid=len(t.get('jobs') or []) + 1, jobName=o.get('gameJob') or '成员', needItemLevel='', gameTf='', postionPrice=0, remark='', userName='', userId=0, isPublic='N', orderBy=0)
        t.setdefault('jobs', []).append(j)
    j['orderId'] = o['id']; j['taskAccLogId'] = o['id']; j['gameAccId'] = 0
    if o.get('recManName'):
        j['userName'] = o['recManName']; j['userId'] = o['recMan']
    if p.float('throwFee'):
        j['postionPrice'] = p.float('throwFee')
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
    db.update('orders', o['id'], dict(taskId=t['id'], taskName=t['taskName']))
    add_log(o, '加入排团【%s】' % t['taskName'], '排团')
    return json_ok('订单已放入坑位')


@route('/PveTaskAjax/SetTaskAddPostionOrder')
def add_postion_order():
    p = P()
    t = find_task(p.get('currentTaskId'))
    o = find_order(p.get('oid'))
    if not t or not o:
        return json_err('排团或订单不存在')
    t.setdefault('jobs', []).append(dict(pid=len(t['jobs']) + 1, jobName=o.get('gameJob') or '成员', needItemLevel='', gameTf='', postionPrice=0, remark='', userName=o.get('recManName') or '',
                                         userId=o.get('recMan') or 0, orderId=o['id'], taskAccLogId=o['id'], gameAccId=0, isPublic='N', orderBy=0))
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
    db.update('orders', o['id'], dict(taskId=t['id'], taskName=t['taskName']))
    return json_ok('已添加坑位并放入订单')


@route('/PveTaskAjax/SetTaskReplacePostionOrder')
def replace_postion_order():
    p = P()
    o = find_order(p.get('oid'))
    if not o:
        return json_err('订单不存在')
    for t in db.all_('pve_tasks'):
        for j in t.get('jobs') or []:
            if str(j.get('taskAccLogId')) == str(p.get('accLogId')):
                j['orderId'] = o['id']; j['taskAccLogId'] = o['id']
                db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
                db.update('orders', o['id'], dict(taskId=t['id'], taskName=t['taskName']))
                return json_ok('已替换')
    return json_err('坑位不存在')


@route('/PveTaskAjax/DelGroupAccByTaskIDAccId')
def del_group_acc():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    for j in t.get('jobs') or []:
        if str(j.get('taskAccLogId')) == str(p.get('accId')) or str(j.get('orderId')) == str(p.get('accId')) or str(j.get('gameAccId')) == str(p.get('accId')):
            o = find_order(j.get('orderId')) if j.get('orderId') else None
            if o:
                db.update('orders', o['id'], dict(taskId=0, taskName=None))
            j['orderId'] = 0; j['taskAccLogId'] = 0; j['gameAccId'] = 0
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
    return json_ok('已移出坑位')


@route('/PveTaskAjax/DelGroupNeedJobByPid')
def del_need_job():
    p = P()
    for t in db.all_('pve_tasks'):
        jobs = t.get('jobs') or []
        n = [j for j in jobs if str(j.get('pid')) != str(p.get('pid'))]
        if len(n) != len(jobs):
            db.update('pve_tasks', t['id'], dict(jobs=n))
            return json_ok('坑位已删除')
    return json_err('坑位不存在')


@route('/PveTaskAjax/DelGroupItemByTaskIDAccId')
def del_group_item():
    return del_group_acc()


@route('/PveTaskAjax/SetJobNeedItemLevel')
def set_job_level():
    p = P()
    for t in db.all_('pve_tasks'):
        j = _job(t, p.get('pid'))
        if j:
            j['needItemLevel'] = p.get('value')
            db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
            return json_ok('修改成功')
    return json_err('坑位不存在')


@route('/PveTaskAjax/SetNeedItemRemark')
def set_need_item_remark():
    p = P()
    for t in db.all_('pve_tasks'):
        j = _job(t, p.get('pid'))
        if j:
            j['remark'] = p.get('remark') or p.get('value')
            db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
            return json_ok('修改成功')
    return json_err('坑位不存在')


@route('/PveTaskAjax/SetPveAccGroup')
def set_acc_group():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    j = _job(t, p.get('pid'))
    if j:
        j['gameTf'] = p.get('groupName')
        db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
    return json_ok('修改成功')


@route('/PveTaskAjax/ChangeGroupPostionOrderBy')
def change_postion_order_by():
    p = P()
    for t in db.all_('pve_tasks'):
        j = _job(t, p.get('id'))
        if j:
            j['orderBy'] = p.int('value')
            t['jobs'].sort(key=lambda x: -(x.get('orderBy') or 0))
            db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
            return json_ok('修改成功')
    return json_err('坑位不存在')


@route('/PveTaskAjax/SetTaskPostionMutual')
def postion_mutual():
    p = P()
    a, b = find_task(p.get('cTaskId')), find_task(p.get('toTaskId'))
    if not a or not b:
        return json_err('排团不存在')
    ja, jb = _job(a, p.get('cpid')), _job(b, p.get('toPid'))
    if not ja or not jb:
        return json_err('坑位不存在')
    for k in ('orderId', 'taskAccLogId', 'gameAccId', 'userName', 'userId'):
        ja[k], jb[k] = jb.get(k), ja.get(k)
    db.update('pve_tasks', a['id'], dict(jobs=a['jobs']))
    db.update('pve_tasks', b['id'], dict(jobs=b['jobs']))
    return json_ok('已互换')


@route('/PveTaskAjax/StartAutoMatchGroup')
def auto_match():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    cand = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and not o.get('taskId') and o.get('gameName') == t.get('gameName')]
    sta = p.get('matchOrderStatus')
    stas = {'10': ['未分配'], '20': ['待上号'], '30': ['代练中'], '40': ['未分配', '待上号', '代练中']}.get(str(sta), ['未分配', '待上号'])
    cand = [o for o in cand if o.get('orderSta') in stas]
    gg = dec(p.get('gameGroup'))
    if gg and gg != '全部':
        cand = [o for o in cand if o.get('gameGroup') == gg]
    ass = p.get('matchAss')
    if ass == '10':
        cand = [o for o in cand if not o.get('recMan')]
    elif ass == '20':
        cand = [o for o in cand if o.get('recMan')]
    n = 0
    for j in t.get('jobs') or []:
        if j.get('orderId'):
            continue
        pick = next((o for o in cand if not j.get('jobName') or o.get('gameJob') == j.get('jobName')), None) or (cand[0] if cand else None)
        if not pick:
            break
        cand.remove(pick)
        j['orderId'] = pick['id']; j['taskAccLogId'] = pick['id']
        if pick.get('recManName'):
            j['userName'] = pick['recManName']; j['userId'] = pick['recMan']
        db.update('orders', pick['id'], dict(taskId=t['id'], taskName=t['taskName']))
        n += 1
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs']))
    return json_ok('自动匹配完成，放入 %d 笔订单' % n)


@route('/PveTaskAjax/CheckGroupFullInfo')
def check_full():
    t = find_task(P().get('taskId'))
    if not t:
        return json_err('排团不存在')
    jobs = t.get('jobs') or []
    lack = [j['jobName'] for j in jobs if not j.get('orderId') and not j.get('userName')]
    return json_ok('缺：' + ','.join(lack) if lack else '已满员', data=dict(full=not lack, lack=lack))


@route('/PveTaskAjax/DisSelectFileToGroup')
def dis_file_group():
    return json_err('本地版不支持文件识别导入')


# ---------------- 公开坑位 / 模板 ----------------
@route('/PveTaskAjax/PublicNeedJobPostion')
def public_postion():
    p = P()
    t = find_task(p.get('taskId'))
    if not t:
        return json_err('排团不存在')
    for j in t.get('jobs') or []:
        if not j.get('orderId') and not j.get('userName'):
            j['isPublic'] = 'Y'
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs'], isPublic='Y', publicTitle=p.get('title'), publicStart=p.get('startDate'), concantwechat=p.get('concantwechat'), concantqq=p.get('concantqq')))
    return json_ok('已公开空缺坑位')


@route('/PveTaskAjax/PublicNeedJobPostionCancel')
def public_postion_cancel():
    t = find_task(P().get('taskId'))
    if not t:
        return json_err('排团不存在')
    for j in t.get('jobs') or []:
        j['isPublic'] = 'N'
    db.update('pve_tasks', t['id'], dict(jobs=t['jobs'], isPublic='N'))
    return json_ok('已取消公开')


@route('/PveTaskAjax/GetJdpPublicTaskData')
def public_task_data():
    p = P()
    rows = []
    for t in db.all_('pve_tasks'):
        if t.get('isPublic') != 'Y':
            continue
        for j in t.get('jobs') or []:
            if j.get('isPublic') == 'Y':
                st = t.get('startTime') or ''
                try:
                    wk = WEEK[datetime.datetime.strptime(st[:19], '%Y-%m-%d %H:%M:%S').weekday()]
                except ValueError:
                    wk = ''
                rows.append(dict(wid=t['id'], title=t.get('publicTitle') or t.get('taskName'), taskName=t.get('taskName'), gameName=t.get('gameName'), gameServer=t.get('gameServer') or t.get('gameArea'),
                                 gameGroup=t.get('gameGroup'), gameJob=j.get('jobName'), itemLevel=j.get('needItemLevel'), gameTf=j.get('gameTf'), startTime=st, startDateShort=st[5:16],
                                 startTimeWeek=wk, price=j.get('postionPrice'), company=db.system_info()['company']))
    kw = dec(p.get('key'))
    if kw:
        rows = [r for r in rows if db.like(r, ['taskName', 'gameJob', 'gameServer'], kw)]
    return paged(rows)


@route('/PveTaskAjax/GetJdpPublicTaskContactData')
def public_task_contact():
    t = find_task(P().get('wid'))
    if not t:
        return json_err('排团不存在')
    return json_ok('', data=dict(wechat=t.get('concantwechat') or '', qq=t.get('concantqq') or '', leader=t.get('leaderUserName')))


@route('/PveTaskAjax/GetCurrentWeekDayTaskGrapNeedJob')
def week_gap():
    out = []
    for t in db.all_('pve_tasks'):
        lack = [j['jobName'] for j in (t.get('jobs') or []) if not j.get('orderId') and not j.get('userName')]
        if lack:
            out.append(dict(taskId=t['id'], taskName=t.get('taskName'), startTime=t.get('startTime'), lack=','.join(lack)))
    return json_ok('', data=out)


@route('/PveTaskAjax/GetTaskNeedJobTemplate')
def job_templates():
    return json_ok('', data=[dict(tid=r['id'], title=r.get('title'), param=r.get('param')) for r in db.all_('job_templates')])


@route('/PveTaskAjax/GetTaskNeedJobTemplateByTid')
def job_template_by_id():
    r = db.get('job_templates', P().get('tid'))
    return json_ok('', data=r) if r else json_err('模板不存在')


@route('/PveTaskAjax/SaveTaskNeedJobTemplate')
def save_job_template():
    p = P()
    tid = p.int('tid')
    d = dict(title=p.get('title'), param=p.get('param'))
    if tid and db.get('job_templates', tid):
        db.update('job_templates', tid, d)
        return json_ok('修改成功')
    db.insert('job_templates', d)
    return json_ok('保存成功')


@route('/PveTaskAjax/DelTaskNeedJobTemplateByTid')
def del_job_template():
    db.delete('job_templates', P().int('tid'))
    return json_ok('删除成功')


@route('/PveTaskAjax/SaveGroupLevelImg')
def save_level_img():
    db.set_setting('groupLevelImg', P().get('value'))
    return json_ok('保存成功')


@route('/UserAjax/SaveTaskListSeachConfigConfig')
def save_task_search_config():
    db.update('users', uid(), dict(taskSearchConfig=P().get('config')))
    return json_ok('ok')


# ---- 订单 → 排团（订单列表/订单详情里的「加入排团」弹窗，原站这 6 个接口本地版原来没实现）----
def _task_by_id(tid):
    try:
        tid = int(tid)
    except (TypeError, ValueError):
        return None
    for t in db.all_('pve_tasks'):
        if t.get('taskId') == tid or t.get('id') == tid:
            return t
    return None


@route('/PveTaskAjax/CheckOrderInsideTask')
def check_order_inside_task():
    """检查这笔订单是不是已经在某个排团里"""
    oid = str(P().get('orderId') or '')
    if not oid:
        return json_err('缺少 orderId')
    for t in db.all_('pve_tasks'):
        for j in (t.get('jobs') or []):
            if str(j.get('orderId') or '') == oid:
                return json_ok('该订单已在排团【%s】里' % t.get('taskName'), data=dict(taskId=t.get('taskId')))
    return json_err('该订单还没有加入任何排团')


@route('/PveTaskAjax/GetNewOrderToGroupDataList')
def new_order_to_group_list():
    """可排团的订单列表（原站按日期 / 游戏 / 团长过滤）"""
    p = P()
    gid = p.int('gameId')
    kw = dec(p.get('key'))
    rows = [o for o in db.all_('orders')
            if o.get('isDel') != 'Y' and o.get('orderSta') in ('未分配', '待上号', '代练中')]
    if gid:
        rows = [o for o in rows if o.get('gameId') == gid]
    if kw:
        rows = [o for o in rows if db.like(o, ['orderId', 'gameName', 'project', 'orderContent'], kw)]
    return table([dict(o, orderIdView=o.get('orderIdView') or o.get('orderId')) for o in rows])


@route('/PveTaskAjax/GetTaskOnlyAssUserList')
def task_ass_user_list():
    """该排团里已经指派过的人（原站用来给"指派给谁"做单选）"""
    t = _task_by_id(P().get('taskId'))
    if not t:
        return json_err('排团不存在')
    users, seen = [], set()
    for j in (t.get('jobs') or []):
        u, name = j.get('userId'), j.get('userName')
        if name and u and u not in seen:
            seen.add(u)
            users.append(dict(userId=u, userName=name))
    return json_ok('', data=users)


@route('/PveTaskAjax/JoinOrderByGroupID')
def join_order_by_group():
    """把订单挂到排团里第一个空坑位"""
    p = P()
    t = _task_by_id(p.get('taskId'))
    o = find_order(p.get('orderId'))
    if not t:
        return json_err('排团不存在')
    if not o:
        return json_err('订单不存在')
    jobs = t.get('jobs') or []
    for j in jobs:
        if not j.get('userName') and not j.get('orderId'):
            j['orderId'] = o.get('orderId')
            db.update('pve_tasks', t['id'], dict(jobs=jobs))
            add_log(o, '加入排团【%s】' % t.get('taskName'), uname())
            return json_ok('已加入排团【%s】' % t.get('taskName'))
    return json_err('排团【%s】没有空余坑位了' % t.get('taskName'))


@route('/PveTaskAjax/NewOrderToTaskAss')
def new_order_to_task_ass():
    """把订单指派给排团里的某个打手（弹窗：选人 + 填费用）"""
    p = P()
    t = _task_by_id(p.get('taskId'))
    o = find_order(p.get('order'))
    u = db.get('users', p.int('recUserId'))
    if not t or not o or not u:
        return json_err('排团 / 订单 / 打手 有一项找不到')
    jobs = t.get('jobs') or []
    fee = p.get('fee')

    def _assign(job):
        job['orderId'] = o.get('orderId')
        job.setdefault('userId', u['id'])
        job.setdefault('userName', u.get('userName'))
        if fee not in ('', None):
            job['postionPrice'] = float(fee)
        db.update('pve_tasks', t['id'], dict(jobs=jobs))
        add_log(o, '指派到排团【%s】给 %s' % (t.get('taskName'), u.get('userName')), uname())
        return json_ok('已指派')

    for j in jobs:
        if j.get('userId') == u['id']:
            return _assign(j)
    for j in jobs:
        if not j.get('userName'):
            j['userId'] = u['id']
            j['userName'] = u.get('userName')
            return _assign(j)
    return json_err('排团【%s】没有空余坑位' % t.get('taskName'))


@route('/PveTaskAjax/NewOrderToTaskReplaceOldOrder')
def replace_old_order():
    """用新订单替换排团里某个坑位上的旧订单"""
    p = P()
    t = _task_by_id(p.get('taskId'))
    o = find_order(p.get('orderId'))
    if not t or not o:
        return json_err('排团或订单不存在')
    idx = p.int('taskAccLogId')
    jobs = t.get('jobs') or []
    for j in jobs:
        if j.get('index') == idx or j.get('id') == idx:
            old = j.get('orderId')
            j['orderId'] = o.get('orderId')
            db.update('pve_tasks', t['id'], dict(jobs=jobs))
            add_log(o, '替换排团【%s】坑位 %s 的旧订单（原 %s）' % (t.get('taskName'), idx, old), uname())
            return json_ok('已替换')
    return json_err('找不到要替换的坑位')
