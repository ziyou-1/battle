# -*- coding: utf-8 -*-
"""系统维护：角色权限、分组、标签、来源、公告、日志、录单识别/修正、系统设置、平台对接等"""
from flask import request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .menu import MENU


def all_menu_keys():
    keys = []
    for m in MENU:
        if m['key']:
            keys.append(m['key'])
        keys += [c['key'] for c in m['children']]
    return keys


def menu_id_by_key():
    d = {}
    for m in MENU:
        if m['key']:
            d[m['key']] = m['id']
        for c in m['children']:
            d[c['key']] = c['id']
    return d


def menu_key_by_id():
    return {v: k for k, v in menu_id_by_key().items()}


def user_permissions(u=None):
    """返回该用户可访问的菜单 key 集合"""
    u = u or current_user()
    if not u:
        return set()
    if u.get('isSuper'):
        return set(all_menu_keys())
    role = db.get('roles', u.get('jobId'))
    if not role:
        return {'index/console', 'user/myinfo', 'user/mymessage'}
    if role.get('isSuper'):
        return set(all_menu_keys())
    return set(role.get('permissions') or []) | {'index/console', 'user/myinfo', 'user/mymessage'}


# ---------------- 角色职位 ----------------
@route('/SystemAjax/GetAllRoleJobList')
def role_list():
    p = P()
    rows = db.find('roles', lambda r: db.like(r, ['roleName', 'remark'], p.get('key') or p.get('roleName')))
    out = []
    for r in rows:
        cnt = db.count('users', lambda u: u.get('jobId') == r['id'])
        out.append(dict(r, roleId=r['id'], userCount=cnt, permissions=None, permCount=len(r.get('permissions') or [])))
    return paged(out)


@route('/SystemAjax/GetUserRole')
def get_user_role():
    p = P()
    role = db.get('roles', p.get('menuId') or p.get('roleId'))
    perms = set(role.get('permissions') or []) if role else set()
    if role and role.get('isSuper'):
        perms = set(all_menu_keys())
    out = []
    for m in MENU:
        children = [dict(Menu_ID=c['id'], Name=c['name'], Note='/' + c['key'], IsChecked=1 if c['key'] in perms else 0, MenuChildrenList=None) for c in m['children']]
        checked = (m['key'] in perms) if m['key'] else any(c['IsChecked'] for c in children)
        out.append(dict(Menu_ID=m['id'], Name=m['name'], Note=('/' + m['key']) if m['key'] else '', IsChecked=1 if checked else 0, MenuChildrenList=children))
    from flask import jsonify
    return jsonify(out)


@route('/SystemAjax/AddEditRole')
def add_edit_role():
    p = P()
    name = p.get('roleName').strip()
    if not name:
        return json_err('角色名称不能为空')
    key_by_id = menu_key_by_id()
    perms = []
    for x in p.list('selectId'):
        try:
            k = key_by_id.get(int(x))
        except ValueError:
            k = None
        if k and k not in perms:
            perms.append(k)
    rid = p.int('roleId')
    if rid:
        role = db.get('roles', rid)
        if not role:
            return json_err('角色不存在')
        db.update('roles', rid, dict(roleName=name, remark=p.get('remark'), permissions=perms))
        for u in db.find('users', lambda r: r.get('jobId') == rid):
            db.update('users', u['id'], dict(jobName=name))
        log('角色', '修改角色职位【%s】' % name)
        return json_ok('修改成功')
    if db.first('roles', lambda r: r.get('roleName') == name):
        return json_err('已存在同名角色')
    db.insert('roles', dict(roleName=name, remark=p.get('remark'), permissions=perms, isSuper=False))
    log('角色', '新增角色职位【%s】' % name)
    return json_ok('新增成功')


@route('/SystemAjax/CopyRoelNewJob')
def copy_role():
    p = P()
    role = db.get('roles', p.get('roleId') or p.get('id'))
    if not role:
        return json_err('角色不存在')
    name = p.get('roleName') or (role['roleName'] + '-副本')
    db.insert('roles', dict(roleName=name, remark=role.get('remark'), permissions=list(role.get('permissions') or []), isSuper=False))
    return json_ok('复制成功')


@route('/SystemAjax/DelRole')
def del_role():
    p = P()
    rid = p.int('roleId') or p.int('id')
    role = db.get('roles', rid)
    if not role:
        return json_err('角色不存在')
    if role.get('isSuper'):
        return json_err('系统管理员角色不能删除')
    if db.count('users', lambda u: u.get('jobId') == rid):
        return json_err('该角色下还有人员，不能删除')
    db.delete('roles', rid)
    log('角色', '删除角色职位【%s】' % role['roleName'])
    return json_ok('删除成功')


@route('/SystemAjax/GetRoleJobList')
@route('/UserAjax/GetRoleJobList')
@route('/SystemAjax/GetRoleList')
def role_options():
    rows = [dict(id=r['id'], roleId=r['id'], name=r['roleName'], roleName=r['roleName'], value=r['id']) for r in db.all_('roles')]
    return json_ok('', data=rows)


# ---------------- 角色分组 ----------------
@route('/SystemAjax/GetUserGroupList')
def user_group_list():
    p = P()
    rows = db.find('user_groups', lambda r: db.like(r, ['groupName', 'containJobName'], p.get('key')))
    return paged([dict(r, groupId=r['id']) for r in rows])


@route(['/SystemAjax/AddEditUserGroup', '/UserAjax/AddEditUserGroup', '/SystemAjax/SaveUserGroup'])
def add_edit_user_group():
    p = P()
    name = p.get('groupName').strip()
    if not name:
        return json_err('分组名称不能为空')
    jobs = p.get('containJobName') or p.get('jobNames') or ','.join(p.list('jobIds'))
    gid = p.int('groupId') or p.int('id')
    if gid and db.get('user_groups', gid):
        db.update('user_groups', gid, dict(groupName=name, containJobName=jobs))
        return json_ok('修改成功')
    db.insert('user_groups', dict(groupName=name, containJobName=jobs))
    return json_ok('新增成功')


@route(['/SystemAjax/DelUserGroup', '/UserAjax/DelUserGroup'])
def del_user_group():
    p = P()
    db.delete('user_groups', p.int('groupId') or p.int('id'))
    return json_ok('删除成功')


# ---------------- 订单标签 ----------------
@route('/SystemAjax/GetOrderLabelList')
def label_list():
    p = P()
    g = p.get('gameName')
    status = p.get('status')
    rows = db.find('labels', lambda r: (not g or g in ('全部游戏', '') or r.get('gameName') in (g, '全部游戏')) and db.like(r, ['labelName', 'keywords'], p.get('key')), 'orderBy')
    if status not in ('', None):
        rows = [r for r in rows if r.get('labelStatus') == ('Y' if str(status) in ('0', 'Y') else 'N')]
    return paged([dict(r, labelId=r['id']) for r in rows])


@route(['/SystemAjax/AddEditOrderLabel', '/SystemAjax/SaveOrderLabel'])
def add_edit_label():
    p = P()
    d = dict(labelName=p.get('labelName').strip(), gameName=p.get('gameName') or '全部游戏', remark=p.get('remark'), keywords=p.get('keywords'),
             colorValue=p.get('colorValue') or '#1E9FFF', labelStatus=p.get('labelStatus') or 'Y', orderBy=p.int('orderBy'))
    if not d['labelName']:
        return json_err('标签名称不能为空')
    lid = p.int('labelId') or p.int('id')
    if lid and db.get('labels', lid):
        db.update('labels', lid, d)
        return json_ok('修改成功')
    db.insert('labels', d)
    return json_ok('新增成功')


@route(['/SystemAjax/DelOrderLabel', '/SystemAjax/DeleteOrderLabel'])
def del_label():
    p = P()
    db.delete('labels', p.int('labelId') or p.int('id'))
    return json_ok('删除成功')


@route('/SystemAjax/ChangeOrderLabelStatus')
def label_status():
    p = P()
    lid = p.int('labelId') or p.int('id')
    r = db.get('labels', lid)
    if not r:
        return json_err('标签不存在')
    db.update('labels', lid, dict(labelStatus=p.get('status') or ('N' if r.get('labelStatus') == 'Y' else 'Y')))
    return json_ok('操作成功')


# ---------------- 订单来源 ----------------
@route('/SystemAjax/GetOrderSoureMangeList')
def source_list():
    p = P()
    rows = db.find('sources', lambda r: db.like(r, ['soureName', 'remark'], p.get('key')), 'orderBy')
    return paged([dict(r, soureId=r['id']) for r in rows])


@route(['/SystemAjax/GetOrderSoureList', '/OrderAjax/GetOrderSoureList', '/SystemAjax/GetSoureList', '/OrderAjax/GetOrderSoureSelect'])
def source_options():
    rows = db.find('sources', lambda r: r.get('status', 'Y') != 'N', 'orderBy')
    return json_ok('', data=[dict(id=r['id'], soureId=r['id'], soureName=r['soureName'], name=r['soureName'], value=r['soureName'], shopType=r.get('shopType', '')) for r in rows])


@route(['/SystemAjax/AddEditOrderSoure', '/SystemAjax/SaveOrderSoure'])
def add_edit_source():
    p = P()
    d = dict(soureName=p.get('soureName').strip(), remark=p.get('remark'), shopType=p.get('shopType'), smsSign=p.get('smsSign'),
             doNotSendSms=p.get('doNotSendSms') or 'N', orderBy=p.int('orderBy'))
    if not d['soureName']:
        return json_err('来源名称不能为空')
    sid = p.int('soureId') or p.int('id')
    if sid and db.get('sources', sid):
        db.update('sources', sid, d)
        return json_ok('修改成功')
    if db.first('sources', lambda r: r['soureName'] == d['soureName']):
        return json_err('已存在同名来源')
    db.insert('sources', dict(d, status='Y'))
    return json_ok('新增成功')


@route(['/SystemAjax/DelOrderSoure', '/SystemAjax/DeleteOrderSoure'])
def del_source():
    p = P()
    db.delete('sources', p.int('soureId') or p.int('id'))
    return json_ok('删除成功')


# ---------------- 公告 / 更新 / 新闻 ----------------
@route('/SystemAjax/GetSystemNoticeList')
def notice_list():
    p = P()
    rows = db.find('notices', lambda r: db.like(r, ['title', 'content'], p.get('key')), 'createTime')
    limit = p.int('limit', 10)
    if 'page' not in p:
        return table(rows[:limit], len(rows))
    return paged(rows)


@route(['/SystemAjax/AddEditSystemNotice', '/SystemAjax/SaveSystemNotice'])
def add_edit_notice():
    p = P()
    d = dict(title=p.get('title').strip(), content=p.get('content'), userName=uname())
    if not d['title']:
        return json_err('标题不能为空')
    nid = p.int('id') or p.int('noticeId')
    if nid and db.get('notices', nid):
        db.update('notices', nid, d)
        return json_ok('修改成功')
    db.insert('notices', d)
    return json_ok('发布成功')


@route(['/SystemAjax/DelSystemNotice', '/SystemAjax/DeleteSystemNotice'])
def del_notice():
    p = P()
    db.delete('notices', p.int('id') or p.int('noticeId'))
    return json_ok('删除成功')


@route('/SystemAjax/GetSystemUpdateList')
def update_list():
    # 旧版控制台的原平台更新公告已停用，保留路由供缓存页面兼容。
    return table([], 0)


@route('/SystemAjax/GetNewsContent')
def news_content():
    return json_err('更新公告已停用')


@route('/SystemAjax/GetSystemExpireTime')
def expire_time():
    return json_err('授权到期信息已停用')


# ---------------- 系统操作日志 ----------------
@route('/SystemAjax/GetSysmteLogList')
def system_log_list():
    p = P()
    kw = p.get('key') or p.get('keyword')
    lt = p.get('logType')
    st, et = p.get('stime') or p.get('sTime'), p.get('etime') or p.get('eTime')
    rows = db.find('system_logs', lambda r: db.like(r, ['joinOrderId', 'gameRoleName', 'remark', 'userName', 'soureOrderId'], kw)
                   and (not lt or r.get('logType') == lt) and (not st or r['createTime'][:10] >= st[:10]) and (not et or r['createTime'][:10] <= et[:10]), 'createTime')
    return paged(rows)


@route(['/SystemAjax/DelSystemLog', '/SystemAjax/ClearSystemLog'])
def clear_system_log():
    p = P()
    lid = p.int('id')
    if lid:
        db.delete('system_logs', lid)
    else:
        for r in db.all_('system_logs'):
            db.delete('system_logs', r['id'])
    return json_ok('操作成功')


# ---------------- 录单识别 / 修正 ----------------
@route('/SystemAjax/GetAutoDiscernSetList')
def discern_list():
    p = P()
    g = p.get('gameName')
    rows = db.find('auto_discern', lambda r: (not g or r.get('gameName') in (g, '全部游戏')) and db.like(r, ['typeName', 'disKey'], p.get('key')))
    return paged([dict(r, disID=r['id']) for r in rows])


@route(['/SystemAjax/AddEditAutoDiscernSet', '/SystemAjax/SaveAutoDiscernSet'])
def add_edit_discern():
    p = P()
    d = dict(typeName=p.get('typeName').strip(), disKey=p.get('disKey').strip(), gameName=p.get('gameName') or '全部游戏')
    if not d['typeName'] or not d['disKey']:
        return json_err('类型和识别关键字不能为空')
    did = p.int('disID') or p.int('id')
    if did and db.get('auto_discern', did):
        db.update('auto_discern', did, d)
        return json_ok('修改成功')
    db.insert('auto_discern', d)
    return json_ok('新增成功')


@route(['/SystemAjax/DelAutoDiscernSet', '/SystemAjax/DeleteAutoDiscernSet'])
def del_discern():
    db.delete('auto_discern', P().int('disID') or P().int('id'))
    return json_ok('删除成功')


@route('/SystemAjax/GetVerifiAddOrderKeyStrByGameList')
def verify_key_list():
    p = P()
    g = p.get('gameName')
    rows = db.find('verify_keys', lambda r: (not g or r.get('gameName') in (g, '全部游戏')) and db.like(r, ['key', 'resultStr', 'veriType'], p.get('key')))
    return paged([dict(r, disID=r['id']) for r in rows])


@route(['/SystemAjax/AddEditVerifiAddOrderKeyStr', '/SystemAjax/SaveVerifiAddOrderKeyStr', '/SystemAjax/AddVerifiAddOrderKeyStr'])
def add_edit_verify_key():
    p = P()
    d = dict(veriType=p.get('veriType'), key=p.get('key').strip(), resultStr=p.get('resultStr').strip(), gameName=p.get('gameName') or '全部游戏')
    if not d['key']:
        return json_err('关键字不能为空')
    did = p.int('disID') or p.int('id')
    if did and db.get('verify_keys', did):
        db.update('verify_keys', did, d)
        return json_ok('修改成功')
    db.insert('verify_keys', d)
    return json_ok('新增成功')


@route(['/SystemAjax/DelVerifiAddOrderKeyStr', '/SystemAjax/DeleteVerifiAddOrderKeyStr'])
def del_verify_key():
    db.delete('verify_keys', P().int('disID') or P().int('id'))
    return json_ok('删除成功')


# ---------------- 通用设置读写（系统各项设置 / 短信 / 微信 / 平台等）----------------
@route(['/SystemAjax/GetSystemSetting', '/SystemAjax/GetSystemSettingInfo', '/SystemAjax/GetSystemSet'])
def get_system_setting():
    return json_ok('', data=db.setting('system', {}))


@route(['/SystemAjax/SaveSystemSetting', '/SystemAjax/SetSystemSetting', '/SystemAjax/UpdateSystemSetting', '/SystemAjax/SaveSystemSet', '/SystemAjax/SetSystemSet'])
def save_system_setting():
    p = P()
    cur = db.setting('system', {})
    cur.update({k: v for k, v in p.all().items() if k not in ('_',)})
    db.set_setting('system', cur)
    log('设置', '修改系统设置')
    return json_ok('保存成功')


@route('/SystemAjax/GetSystemGroupList')
def system_group_list():
    p = P()
    gt = p.get('groupType')
    rows = db.find('system_groups', lambda r: gt in ('', '-1', None) or str(r.get('GroupType')) == str(gt))
    return paged([dict(r, GroupId=r['id']) for r in rows])


@route(['/SystemAjax/AddEditSystemGroup', '/SystemAjax/SaveSystemGroup'])
def add_edit_system_group():
    p = P()
    d = dict(GroupName=p.get('GroupName') or p.get('groupName'), GroupType=p.int('GroupType') or p.int('groupType'), CreateTime=now())
    gid = p.int('GroupId') or p.int('groupId') or p.int('id')
    if gid and db.get('system_groups', gid):
        db.update('system_groups', gid, d)
        return json_ok('修改成功')
    db.insert('system_groups', d)
    return json_ok('新增成功')


@route(['/SystemAjax/DelSystemGroup', '/SystemAjax/DeleteSystemGroup'])
def del_system_group():
    db.delete('system_groups', P().int('GroupId') or P().int('groupId') or P().int('id'))
    return json_ok('删除成功')


def generic_list(coll, id_field, search_fields=()):
    def fn():
        p = P()
        rows = db.find(coll, lambda r: db.like(r, list(search_fields), p.get('key') or p.get('keyword')), 'createTime')
        return paged([dict(r, **{id_field: r['id']}) for r in rows])
    return fn


def generic_save(coll, id_field, required=None, defaults=None):
    def fn():
        p = P()
        d = {k: v for k, v in p.all().items() if k not in ('page', 'limit', '_')}
        if required and not d.get(required.lower()):
            return json_err('必填项不能为空')
        rid = p.int(id_field) or p.int('id')
        for k in (defaults or {}):
            d.setdefault(k, defaults[k])
        if rid and db.get(coll, rid):
            db.update(coll, rid, d)
            return json_ok('修改成功')
        db.insert(coll, d)
        return json_ok('新增成功')
    return fn


def generic_del(coll, id_field):
    def fn():
        p = P()
        rid = p.int(id_field) or p.int('id')
        for x in (p.ids('ids') or [rid]):
            if x:
                db.delete(coll, x)
        return json_ok('删除成功')
    return fn


# 交易平台 / 淘宝 / 拼多多 / 自动回复 / 快速发单 / 自动调价 / 群消息 / 内部沟通 / 微信 / 上家系统


@route('/SystemAjax/GetTransfromInterfaceList')
def platform_interface_list():
    rows = db.all_('platform_interfaces')
    out = [dict(r, id=r['id'], ptid=r['id'], platformLoginPwd='', payPwd='') for r in rows]
    return paged(out)


route(['/SystemAjax/DelTransfromInterface', '/SystemAjax/DeleteTransfromInterface'])(generic_del('platform_interfaces', 'ptid'))


@route('/SystemAjax/GetTaoBaoInterfaceList')
def shop_interface_list():
    p = P()
    plat = p.get('platform')
    rows = db.all_('taobao_interfaces')
    if plat not in ('', None):
        selected = {part.strip() for part in str(plat).split(',')}
        rows = [r for r in rows if str(r.get('platformType', 0)) in selected]
    else:
        rows = [r for r in rows if int(r.get('platformType') or 0) != 0]
    return paged([dict(r, id=r['id'], ptid=r['id'], appSecret='', accessToken='',
                       hasAppSecret=bool(r.get('appSecret')), hasAccessToken=bool(r.get('accessToken')),
                       integrationStatus=('原平台凭据，不可用' if str(r.get('appId') or '') in ('0000000000000000000', '2019071918003165108')
                                          else '待授权联调'))
                  for r in rows])


@route(['/SystemAjax/DelTaobaoInterface', '/SystemAjax/DelTaoBaoInterface'])
def delete_shop_interface():
    user = current_user() or {}
    if not (is_super() or user.get('jobName') == '老板'):
        return json_err('无权修改外部接口配置')
    row = db.get('taobao_interfaces', P().int('id'))
    if not row:
        return json_err('记录不存在')
    db.delete('taobao_interfaces', row['id'])
    return json_ok('删除成功')


@route('/SystemAjax/GetPlatformAutoReplySetList')
def auto_reply_list():
    p = P()
    g = p.get('gameName')
    rows = db.find('platform_autoreply', lambda r: (not g or g in ('', '全部游戏') or r.get('GameName') in (g, '全部游戏')) and db.like(r, ['ReplyMsg', 'UserName'], p.get('key')), 'createTime')
    return paged([dict(r, PlatformAutoReplySetId=r['id'], id=r['id']) for r in rows])


route(['/SystemAjax/DelPlatformAutoReplySet', '/SystemAjax/DeletePlatformAutoReplySet'])(generic_del('platform_autoreply', 'ptid'))
@route('/SystemAjax/GetPushOrderGroupMsgSetList')
def group_msg_list():
    p = P()
    rows = db.find('push_group_msg', lambda r: db.like(r, ('gameName', 'remark'), p.get('key')))
    deliveries = db.all_('group_deliveries')
    latest = {}
    for delivery in deliveries:
        latest[delivery.get('ruleId')] = delivery
    labels = {'sent': '发送成功', 'failed': '发送失败', 'sending': '发送中'}
    return paged([dict(r, webhookUrl='', hasWebhook=bool(r.get('webhookUrl')),
                       deliveryStatus=labels.get(latest[r['id']]['status'], '尚未发送') if r['id'] in latest else ('尚未发送' if r.get('webhookUrl') else '未配置'),
                       lastDeliveryId=latest[r['id']]['id'] if r['id'] in latest else 0,
                       lastDeliveryFailed=(r['id'] in latest and latest[r['id']].get('status') == 'failed'))
                  for r in rows])


@route('/SystemAjax/GetPushOrderGroupDeliveryList')
def group_delivery_list():
    user = current_user() or {}
    if not (is_super() or user.get('jobName') == '老板'):
        return json_err('无权查看群推送记录')
    rule_id = P().int('ruleId')
    rows = db.find('group_deliveries', lambda r: not rule_id or r.get('ruleId') == rule_id,
                   'createTime')
    labels = {'sent': '发送成功', 'failed': '发送失败', 'sending': '发送中'}
    out = []
    for row in rows:
        order = db.get('orders', row.get('orderId')) or {}
        out.append({'id': row['id'], 'createTime': row.get('createTime'),
                    'orderNo': order.get('orderIdView') or '',
                    'event': '新订单' if row.get('event') == 'created' else '状态变更',
                    'status': labels.get(row.get('status'), '未知'),
                    'attempts': row.get('attempts', 1), 'error': row.get('error') or ''})
    return paged(out)


@route('/SystemAjax/GetOnlineConsultationSetList')
def consultation_list():
    rows = sorted(db.all_('online_consult'), key=lambda r: r.get('ScenesType') or 0)
    return paged(rows)


@route('/SystemAjax/GetMyBindHomeSystemList')
def home_system_list():
    return paged([dict(r, bid=r['id'], sid=r['id']) for r in db.all_('home_systems')])
route('/SystemAjax/GetWeChatCustomerList')(generic_list('wechat_customers', 'id', ('moblie',)))
route('/SystemAjax/GetPublicSeachOrderQuestionMList')(generic_list('search_questions', 'id', ('SeachQuestion_Title',)))
route(['/SystemAjax/AddEditPublicSeachOrderQuestion', '/SystemAjax/SavePublicSeachOrderQuestion'])(generic_save('search_questions', 'id', None, dict(Hot=0, Status='Y', createTimeStr=now())))
route(['/SystemAjax/DelPublicSeachOrderQuestion'])(generic_del('search_questions', 'id'))
# 客户端内容管理相关列表：见 api/miniapp.py（保留原站兼容文件名）
