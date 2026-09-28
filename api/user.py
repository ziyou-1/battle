# -*- coding: utf-8 -*-
"""系统人员：人员管理、新开账号、我的资料、消息、打卡、黑名单、登录限制、入职申请、合同等"""
import json, datetime
from flask import jsonify, request
from werkzeug.security import generate_password_hash
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now, S
from .login import verify_pwd


def public_user(u):
    d = dict(u)
    d.pop('pwdHash', None); d.pop('password', None)
    d['uid'] = u['id']
    d['userId'] = u['id']
    d['jobRole'] = u.get('jobId')
    return d


def user_options(rows, sel=None):
    sels = set(str(x) for x in str(sel or '').replace('，', ',').split(',') if x)
    return [dict(name=r['userName'], value=r['id'], selected=('selected' if (str(r['id']) in sels or r['userName'] in sels) else ''), disabled=False,
                 jobName=r.get('jobName'), games=r.get('games'), complateRate=r.get('complateRate')) for r in rows]


def active_users(game=None, roles=None):
    def ok(r):
        if r.get('sta') == 'N':
            return False
        if roles and r.get('jobName') not in roles:
            return False
        if game and game not in ('', '全部游戏', '0'):
            gs = str(r.get('games') or '')
            if '全部游戏' not in gs and game not in gs:
                return False
        return True
    rows = db.find('users', ok)
    rows.sort(key=lambda r: (-(r.get('orderBy') or 0), r['id']))
    return rows


# ---------------- 下拉数据 ----------------
@route(['/UserAjax/GetAllUserByGameName', '/UserAjax/GetAllUser', '/UserAjax/GetUserSelect', '/OrderAjax/GetAllUserByGameName'])
def all_user_by_game():
    p = P()
    rows = active_users(p.get('gameName') or p.get('game'))
    kw = p.get('seachKey') or p.get('key')
    if kw:
        rows = [r for r in rows if db.like(r, ['userName', 'loginAcc', 'rname'], kw)]
    data = user_options(rows, p.get('selectValue'))
    sys_set = db.setting('system', {})
    return jsonify(dict(code=1, msg='', count=len(data), data=data, defAssRecManUid=int(sys_set.get('defAssRecManUid') or 0), defAssRecMan=sys_set.get('defAssRecMan', '')))


@route('/UserAjax/GetSysUserSelect')
def sys_user_select():
    p = P()
    rows = [r for r in active_users() if db.like(r, ['userName', 'loginAcc'], p.get('key'))]
    return json_ok('', data=[dict(id=r['id'], name=r['userName'], value=r['id'], userName=r['userName'], loginAcc=r['loginAcc']) for r in rows])


@route(['/UserAjax/GetAllUserByGroupName', '/UserAjax/GetUserByGroup'])
def user_by_group():
    p = P()
    gt = p.get('groupType')
    roles = None
    if gt == '10':
        roles = ['打手', '团长']
    rows = active_users(None, roles)
    return json_ok('', data=[dict(id=r['id'], name=r['userName'], value=r['id'], userName=r['userName'], jobName=r.get('jobName')) for r in rows])


@route(['/SystemAjax/GetAllRoleList', '/UserAjax/GetAllRoleList'])
def all_role_list():
    sel = P().get('selectValue')
    rows = db.all_('roles')
    return jsonify(dict(code=1, msg='', data=[dict(name=r['roleName'], value=r['id'], selected=('selected' if str(r['id']) == str(sel) else ''), disabled=False) for r in rows]))


@route('/UserAjax/GetJdpUidList')
def jdp_uid_list():
    return json_ok('', data=[])


# ---------------- 人员列表 ----------------
@route('/UserAjax/GetUserList')
def user_list():
    p = P()
    game, role, sta, utype = p.get('game'), p.get('userRole'), p.get('sta'), p.get('userType')
    key, key2, key3, buss, cert, dis = p.get('key'), p.get('key2'), p.get('key3'), p.get('bussType'), p.get('isCert'), p.get('isDisSett')

    def ok(r):
        if game and game not in ('', '全部游戏') and '全部游戏' not in str(r.get('games', '')) and game not in str(r.get('games', '')):
            return False
        if role and str(r.get('jobId')) != str(role) and r.get('jobName') != role:
            return False
        if sta == 'true' and r.get('sta') == 'N':
            return False
        if sta == 'false' and r.get('sta') != 'N':
            return False
        if utype not in ('', '-1', None) and str(r.get('userType', 0)) != str(utype):
            return False
        if buss not in ('', '0', None) and str(r.get('bussType', 1)) != str(buss):
            return False
        if cert and r.get('isCert', 'N') != cert:
            return False
        if dis and r.get('isProhibitSettStatus', 'N') != dis:
            return False
        if key3 and key3 not in str(r.get('mark', '')):
            return False
        if key2 and not db.like(r, ['remark', 'mark', 'qq', 'moblie'], key2):
            return False
        return db.like(r, ['userName', 'loginAcc', 'rname', 'qq', 'moblie'], key)
    rows = db.find('users', ok)
    rows.sort(key=lambda r: (-(r.get('orderBy') or 0), r['id']))
    return paged([public_user(r) for r in rows], disableCount=len([r for r in rows if r.get('sta') == 'N']),
                 totalInsureAmount=round(sum(float(r.get('insureAmount') or 0) for r in rows), 2))


@route('/UserAjax/GetRecOrderTotalList')
def rec_order_total():
    p = P()
    st, et = p.get('stime'), p.get('etime')
    out = []
    for i, u in enumerate(active_users(None, ['打手', '团长'])):
        mine = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('recMan') == u['id'] and (not st or o['createTime'][:10] >= st[:10]) and (not et or o['createTime'][:10] <= et[:10])]
        nosett = sum(float(o.get('recFee') or 0) for o in mine if o.get('orderSta') == '已完成' and o.get('isSettStatus') != '已结算')
        out.append(dict(idx=i + 1, userName=u['userName'], orderCount=len(mine), noSettAmount=round(nosett, 2), complateRate=u.get('complateRate', 100),
                        createUserDate=u.get('createTime', '')[:10], lastRecOrderDate=max([o.get('recOrderTime') or '' for o in mine] + [''])[:19]))
    out.sort(key=lambda r: -r['orderCount'])
    return paged(out)


@route('/UserAjax/GetCheckIdenticalAliPayAcc')
def check_identical_alipay():
    accs = {}
    for u in db.all_('users'):
        a = (u.get('alipayAcc') or '').strip()
        if a:
            accs.setdefault(a, []).append(u['userName'])
    rows = [dict(str1=a, str2=','.join(v), str3=len(v), id2=len(v), str4='') for a, v in accs.items() if len(v) > 1]
    return table(rows)


@route('/UserAjax/TotalAllUserOrderComplateRat')
def total_complate_rate():
    for u in db.all_('users'):
        mine = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('recMan') == u['id'] and o.get('orderSta') in ('已完成', '已退单', '问题单')]
        if mine:
            rate = round(len([o for o in mine if o['orderSta'] == '已完成']) * 100.0 / len(mine), 2)
            db.update('users', u['id'], dict(complateRate=rate))
    return json_ok('统计完成')


# ---------------- 新开 / 修改账号 ----------------
@route('/UserAjax/CheckAddUserIsContainsBlack')
def check_black():
    p = P()
    hit = db.first('user_backlist', lambda r: (p.get('phone') and r.get('moblie') == p.get('phone')) or (p.get('qq') and r.get('qq') == p.get('qq')) or (p.get('rname') and r.get('rname') == p.get('rname')))
    if hit:
        return json_ok('该人员在黑名单中：' + (hit.get('remark') or ''), data=hit, code=2)
    return json_err('不在黑名单', code=0)


@route('/UserAjax/AddEditUser')
def add_edit_user():
    if not is_super():
        return json_err('仅系统管理员可新建或修改员工账号')
    p = P()
    raw = p.get('strparameter')
    try:
        f = json.loads(raw) if raw else {}
    except ValueError:
        f = {}
    f = {k: v for k, v in f.items()}
    f.setdefault('games', p.get('games'))
    acc = (f.get('loginAcc') or '').strip()
    name = (f.get('userName') or '').strip()
    if not acc or not name:
        return json_err('登录账号和昵称不能为空')
    role = db.get('roles', f.get('userRole'))
    if not role:
        return json_err('请选择角色职位')
    try:
        uid_ = int(f.get('uid') or 0)
    except ValueError:
        uid_ = 0
    d = dict(loginAcc=acc, userName=name, jobId=role['id'], jobName=role['roleName'], isSuper=bool(role.get('isSuper')), qq=f.get('qq', ''), moblie=f.get('moblie', ''),
             remark=f.get('remark', ''), tips=f.get('tips', ''), keywords=f.get('keywords', ''), description=f.get('description', ''), bussType=int(f.get('bussType') or 1),
             userType=int(f.get('userType') or 0), insureAmount=float(f.get('insureAmount') or 0), recOrderMaxCount=int(f.get('recOrderMaxCount') or 5),
             recPriceMinValue=float(f.get('recPriceMin') or 0), recPriceMaxValue=float(f.get('recPriceMax') or 0), games=f.get('games') or '全部游戏',
             alipayAcc=f.get('setAlipayAcc', ''), alipayName=f.get('setAlipayAccName', ''), bankCardNo=f.get('setBankCardNo', ''), bankName=f.get('setBankName', ''),
             basicSalary=float(f.get('basicSalary') or 0), brokerageAmount=float(f.get('brokerageAmount') or 0), autoBrokerageType=f.get('autoBrokerageType', ''),
             livestreaming=f.get('livestreaming', ''), addOrderNotSendSms=f.get('addOrderNotSendSms', 'N'), inputDate=f.get('inputDate', ''), recommend=f.get('recommend', ''))
    if uid_:
        u = db.get('users', uid_)
        if not u:
            return json_err('人员不存在')
        other = db.first('users', lambda r: r.get('loginAcc') == acc and r['id'] != uid_)
        if other:
            return json_err('登录账号已被使用')
        if f.get('pwd'):
            d['pwdHash'] = generate_password_hash(f['pwd'])
        db.update('users', uid_, d)
        log('人员', '修改人员【%s】资料' % name)
        return json_ok('修改成功')
    if db.first('users', lambda r: r.get('loginAcc') == acc):
        return json_err('登录账号已存在')
    pwd = f.get('pwd') or f.get('password') or '123456'
    d.update(pwdHash=generate_password_hash(pwd), sta='Y', signStatus='N', complateRate=100, isExcuseLoginVer='N', isAutoSett='N', isProhibitSettStatus='N',
             isNeedPrivatePhone='N', prohibitedViewOrderPwd='N', prohibitedViewOrderPhone=('Y' if S('SK138') == 'Y' else 'N'), isProhibitPublicRecOrder='N', forbidViewOrderContent='N', mark='', orderBy=0,
             createUserName=uname(), photo='/images/user.jpg', isCert='N', lastLoginTime='', balance=0)
    u = db.insert('users', d)
    db.insert('messages', dict(userId=u['id'], msgType=0, title='欢迎您使用%s管理系统' % db.system_info()['company'],
                               content='%s为您开通了系统账户：%s，登录账号：%s，职位：%s，初始密码：%s' % (db.system_info()['company'], name, acc, role['roleName'], pwd),
                               sendUserName='系统', isRead='N', orderId=''))
    log('人员', '新开系统账号【%s】(%s)' % (name, acc))
    return json_ok('新增成功，初始密码：' + pwd, data=u['id'])


def _user_flag(field, on='Y', off='N', msg='设置成功'):
    def fn():
        p = P()
        u = db.get('users', p.int('uid'))
        if not u:
            return json_err('人员不存在')
        val = p.get('sta') or p.get('status') or p.get('value')
        if val in ('Y', 'N', '1', '0', 'true', 'false'):
            newv = on if val in ('Y', '1', 'true') else off
        else:
            newv = off if u.get(field, off) == on else on
        db.update('users', u['id'], {field: newv})
        return json_ok(msg)
    return fn


route('/UserAjax/UpUserSta')(_user_flag('sta', 'Y', 'N', '状态已切换'))
route('/UserAjax/UpUserVerSta')(_user_flag('isExcuseLoginVer'))
route('/UserAjax/ChangeUserIsAutoSett')(_user_flag('isAutoSett'))
route('/UserAjax/SetUserPrivatePhone')(_user_flag('isNeedPrivatePhone'))
route('/UserAjax/SetUserProhibitedViewOrderPwd')(_user_flag('prohibitedViewOrderPwd'))
route('/UserAjax/ChangeProhibitedViewOrderPwd')(_user_flag('prohibitedViewOrderPwd'))
route('/UserAjax/ChangeProhibitedViewOrderPhone')(_user_flag('prohibitedViewOrderPhone'))
route('/UserAjax/SetIsProhibitPublicRecOrder')(_user_flag('isProhibitPublicRecOrder'))
route('/UserAjax/SetForbidViewOrderContent')(_user_flag('forbidViewOrderContent'))
route('/UserAjax/UpUserDisSettSta')(_user_flag('isProhibitSettStatus'))


@route('/UserAjax/UpUserStaBatch')
def up_user_sta_batch():
    p = P()
    for x in p.ids('uid'):
        u = db.get('users', x)
        if u and not u.get('isSuper'):
            db.update('users', x, dict(sta='N' if u.get('sta') != 'N' else 'Y'))
    return json_ok('批量操作成功')


@route('/UserAjax/ChangeUserEnsureAmount')
def change_ensure():
    p = P()
    if not db.get('users', p.int('uid')):
        return json_err('人员不存在')
    db.update('users', p.int('uid'), dict(insureAmount=p.float('value')))
    return json_ok('修改成功')


@route('/UserAJax/ChangeUserBussType')
def change_buss_type():
    p = P()
    db.update('users', p.int('uid'), dict(bussType=p.int('value')))
    return json_ok('修改成功')


@route('/UserAJax/ChangeUserRecOrderPrice')
def change_rec_price():
    p = P()
    db.update('users', p.int('uid'), dict(recPriceMinValue=p.float('min'), recPriceMaxValue=p.float('max')))
    return json_ok('修改成功')


@route('/UserAjax/EditUserMark')
def edit_mark():
    p = P()
    db.update('users', p.int('uid'), dict(mark=p.get('tag')))
    return json_ok('修改成功')


@route('/UserAjax/ChangeUserBalance')
def change_balance():
    p = P()
    u = db.get('users', p.int('uid'))
    if not u:
        return json_err('人员不存在')
    db.update('users', u['id'], dict(balance=round(float(u.get('balance') or 0) + p.float('amount'), 2)))
    log('人员', '调整【%s】余额 %s' % (u['userName'], p.get('amount')))
    return json_ok('操作成功')


@route('/UserAjax/ChangeUserOrderBy')
def change_order_by():
    p = P()
    db.update('users', p.int('uid'), dict(orderBy=p.int('by')))
    return json_ok('修改成功')


@route('/UserAjax/SetUserSelfRecOrderMaxCount')
def set_max_count():
    p = P()
    db.update('users', p.int('uid'), dict(recOrderMaxCount=p.int('count')))
    return json_ok('修改成功')


@route('/UserAjax/RefChangePwd')
def ref_change_pwd():
    p = P()
    u = db.get('users', p.int('uid'))
    if not u:
        return json_err('人员不存在')
    newpwd = p.get('pwd') or '123456'
    db.update('users', u['id'], dict(pwdHash=generate_password_hash(newpwd)))
    log('人员', '重置【%s】登录密码' % u['userName'])
    return json_ok('密码已重置为：' + newpwd)


@route('/UserAjax/DelUser')
def del_user():
    p = P()
    u = db.get('users', p.int('uid'))
    if not u:
        return json_err('人员不存在')
    if u.get('isSuper') or u['id'] == uid():
        return json_err('不能删除管理员或自己')
    db.delete('users', u['id'])
    log('人员', '删除人员【%s】' % u['userName'])
    return json_ok('删除成功')


@route('/UserAjax/ResetRnameCert')
def reset_cert():
    db.update('users', P().int('uid'), dict(isCert='N', rname=''))
    return json_ok('已重置')


@route('/UserAjax/CreateGroupOrInvitation')
def create_group_invite():
    return json_ok('本地版不支持平台群邀请', data=None, code=0)


# ---------------- 我的资料 ----------------
def _param_json():
    p = P()
    raw = p.get('paramStr') or p.get('param')
    try:
        return json.loads(raw) if raw else {}
    except ValueError:
        return dict(x.split('=', 1) for x in raw.split('&') if '=' in x)


@route('/UserAjax/saveMyInfo')
def save_my_info():
    f = _param_json()
    allowed = ['userName', 'qq', 'moblie', 'description', 'keywords', 'livestreaming', 'setAlipayAcc', 'setAlipayAccName', 'setBankCardNo', 'setBankName']
    d = {k: f[k] for k in allowed if k in f}
    acc = (f.get('loginAcc') or '').strip()
    if acc and acc != current_user().get('loginAcc'):
        if db.first('users', lambda r: r.get('loginAcc') == acc and r['id'] != uid()):
            return json_err('该登录账号已被其他人使用')
        d['loginAcc'] = acc
    if 'setAlipayAcc' in d:
        d['alipayAcc'] = d.pop('setAlipayAcc')
    if 'setAlipayAccName' in d:
        d['alipayName'] = d.pop('setAlipayAccName')
    db.update('users', uid(), d)
    return json_ok('保存成功')


@route('/UserAjax/saveMyLoginPwd')
def save_my_pwd():
    f = _param_json()
    u = current_user()
    old, new, re_ = f.get('ypwd', ''), f.get('newPwd', ''), f.get('renewPwd', '')
    if not verify_pwd(u, old):
        return json_err('原密码不正确')
    if len(new) < 6:
        return json_err('新密码至少6位')
    if new != re_:
        return json_err('两次输入的新密码不一致')
    db.update('users', u['id'], dict(pwdHash=generate_password_hash(new), password=None))
    log('人员', '修改了自己的登录密码')
    return json_ok('密码修改成功')


@route(['/UserAjax/saveMyFeaturesMySystemSet', '/UserAjax/saveMyFeaturesMyJdpSet'])
def save_my_features():
    f = _param_json()
    u = current_user()
    feat = u.get('features') or {}
    feat.update(f)
    db.update('users', u['id'], dict(features=feat))
    return json_ok('保存成功')


@route('/UserAjax/GetUserPhoneReport')
def phone_report():
    return json_ok('', data=[])


@route(['/UserAjax/QueryRnameCertResult', '/UserAjax/RnameCertInit', '/Api/UserApi/getUserRnameCertToSystem'])
def rname_cert():
    return json_err('本地版未接入实名认证服务')


@route('/UserAjax/CreatePhoneNoAReport')
def phone_no_report():
    return json_err('本地版未接入虚拟号码服务')


@route('/UserAjax/GetDyplsOSSInfoForUploadFile')
def oss_info():
    return json_err('本地版未接入对象存储，请使用本地上传')


@route('/api/UserApi/VerifyEmailCode')
def verify_email_code():
    p = P()
    rec = db.setting('bindmail:%s' % uid())
    if rec and rec['code'] == p.get('code').strip():
        return json_ok('验证成功')
    return json_err('验证码错误')


# ---------------- 我的消息 ----------------
@route('/UserAjax/GetMyMessageList')
def my_message_list():
    p = P()
    is_read, mtype = p.get('isRead'), p.get('msgType')
    mine = db.find('messages', lambda r: r.get('userId') == uid(), 'createTime')
    rows = [r for r in mine if (not is_read or r.get('isRead') == is_read) and (mtype in ('', None) or str(r.get('msgType')) == str(mtype))]
    rows = [dict(r, msgId=r['id']) for r in rows]
    unread = [r for r in mine if r.get('isRead') == 'N']
    total = dict(totalCount=len(mine), totalUnread0=len([r for r in unread if r.get('msgType') == 0]), totalUnread10=len([r for r in unread if r.get('msgType') == 10]),
                 totalUnread20=len([r for r in unread if r.get('msgType') == 20]), totalUnreadCount=len(unread))
    page, limit = p.int('page', 1), p.int('limit', 10)
    return jsonify(dict(code=0, count=len(rows), data=db.paginate(rows, page, limit), total=total))


@route('/UserAjax/SetMyMessageRead')
def set_message_read():
    p = P()
    ids = p.ids('msgId') or p.ids('ids')
    if not ids:
        for r in db.find('messages', lambda r: r.get('userId') == uid() and r.get('isRead') == 'N'):
            db.update('messages', r['id'], dict(isRead='Y'))
    for i in ids:
        db.update('messages', i, dict(isRead='Y'))
    return json_ok('已标记为已读')


@route('/UserAjax/SaveUserConfigForMsgSoundSwichtByUserId')
def msg_sound_switch():
    v = 'N' if P().get('status') == 'N' else 'Y'
    db.update('users', uid(), dict(isPlayMsgSound=v))
    return json_ok('已关闭消息提示音' if v == 'N' else '已开启消息提示音')


@route('/UserAjax/SaveUserConfigForMsgSoundSoureByUserId')
def msg_sound_source():
    v = '2' if str(P().get('value')) == '2' else '0'
    db.update('users', uid(), dict(myMsgSoundSoure=v))
    return json_ok('提示音已切换，刷新页面后生效')


@route('/UserAjax/ResetInterNalNewOrderPushWechatMsgSetting')
def reset_wechat_push():
    return json_ok('已重置')


# ---------------- 打卡记录 / 分析 ----------------
@route('/UserAjax/GetUserCheckInList')
def checkin_list():
    p = P()
    user, role, st, et = p.get('userList') or p.get('userId') or p.get('user'), p.get('jobRole') or p.get('role'), p.get('stime') or p.get('sTime'), p.get('etime') or p.get('eTime')
    users = set(str(x) for x in str(user or '').split(',') if x)
    roles = set(str(x) for x in str(role or '').split(',') if x)
    rows = db.find('checkin_logs', lambda r: (not users or str(r.get('userId')) in users) and (not roles or str(db.first('roles', lambda x: x['roleName'] == r.get('roleName')) or {}).get('id', '') in roles or r.get('roleName') in roles)
                   and (not st or r['createTime'][:10] >= st[:10]) and (not et or r['createTime'][:10] <= et[:10]) and db.like(r, ['userName', 'loginAcc', 'ip'], p.get('key')), 'createTime')
    return paged(rows)


@route('/UserAjax/GetUserCheckInStaticList')
def checkin_static():
    p = P()
    st, et = p.get('stime') or p.get('sTime'), p.get('etime') or p.get('eTime')
    cnt = {}
    for r in db.all_('checkin_logs'):
        if (st and r['createTime'][:10] < st[:10]) or (et and r['createTime'][:10] > et[:10]):
            continue
        k = r.get('userId')
        cnt.setdefault(k, dict(loginAcc=r.get('loginAcc'), userName=r.get('userName'), roleName=r.get('roleName'), checkinNumber=0))
        cnt[k]['checkinNumber'] += 1
    rows = sorted(cnt.values(), key=lambda r: -r['checkinNumber'])
    return paged(rows)


# ---------------- 人员黑名单 ----------------
@route('/UserAjax/GetSystemUserBackList')
def user_backlist():
    p = P()
    rows = db.find('user_backlist', lambda r: db.like(r, ['moblie', 'ww', 'qq', 'rname', 'alipayacc', 'remark'], p.get('key')), 'createTime')
    return paged([dict(r, bid=r['id']) for r in rows])


@route('/UserAjax/AddModiftySystemUserBackList')
def add_user_backlist():
    p = P()
    if p.int('uid') and not p.get('moblie'):
        u = db.get('users', p.int('uid'))
        if not u:
            return json_err('人员不存在')
        d = dict(moblie=u.get('moblie', ''), ww='', qq=u.get('qq', ''), rname=u.get('rname') or u['userName'], cid='', yy='', alipayacc=u.get('alipayAcc', ''), remark=p.get('remark') or '由人员列表加入', lastTime=now(), addUserName=uname())
        db.insert('user_backlist', d)
        db.update('users', u['id'], dict(sta='N'))
        return json_ok('已加入黑名单并禁用账号')
    d = dict(moblie=p.get('moblie'), ww=p.get('wechat') or p.get('ww'), qq=p.get('qq'), rname=p.get('rname'), cid=p.get('cid'), yy=p.get('yy'), alipayacc=p.get('alipayacc'),
             remark=p.get('remark'), lastTime=now(), addUserName=uname())
    bid = p.int('bid')
    if bid and db.get('user_backlist', bid):
        db.update('user_backlist', bid, d)
        return json_ok('修改成功')
    db.insert('user_backlist', d)
    return json_ok('新增成功')


@route('/UserAjax/DelSystemUserBackListByID')
def del_user_backlist():
    for x in P().ids('ids'):
        db.delete('user_backlist', x)
    return json_ok('删除成功')


# ---------------- 登录限制（/User/userloginrestrict）----------------
RESTRICT_TYPES = {0: 'IP白名单限制', 1: '允许登录', 2: '禁止登录', 3: 'IP黑名单'}


def restrict_row(r):
    u = db.get('users', r.get('userId'))
    return dict(r, UserLoginRestrictId=r['id'], idx=r['id'], UserId=(u['userName'] if u else r.get('userName', '')), userId=r.get('userId'), WeekDay=str(r.get('weekDay') or ''),
                RestrictTimeS=r.get('restrictTimeS', 0), RestrictTimeE=r.get('restrictTimeE', 24), RestrictType=int(r.get('restrictType') or 0), IPWhitelist=r.get('ipWhitelist', ''),
                Status=str(r.get('status', '0')), CreateTime=(r.get('createTime') or '')[:16], UpdateTime=(r.get('updateTime') or '')[:16], LastModifyUserName=r.get('lastModifyUserName', ''))


@route('/UserAjax/GetUserLoginRestrictList')
def login_restrict_list():
    p = P()
    users = set(x for x in (p.get('userList') or '').replace('，', ',').split(',') if x)
    ip = (p.get('ip') or '').strip()
    rows = db.find('login_restrict', lambda r: (not users or str(r.get('userId')) in users) and (not ip or ip in str(r.get('ipWhitelist') or '')), 'createTime')
    return paged([restrict_row(r) for r in rows])


@route('/UserAjax/GetUserListByLoginRestrict')
def users_for_restrict():
    r = db.get('login_restrict', P().int('userLoginRestrictId'))
    sel = str(r.get('userId')) if r else ''
    rows = active_users()
    return json_ok('', data=[dict(name=u['userName'], value=u['id'], selected=('selected' if str(u['id']) == sel else ''), disabled=False) for u in rows])


@route('/UserAjax/AddEditUserLoginRestrict')
def add_edit_login_restrict():
    p = P()
    try:
        f = json.loads(p.get('strparameter') or '{}')
    except ValueError:
        return json_err('参数错误')
    uid_ = f.get('userList')
    u = db.get('users', uid_)
    if not u:
        return json_err('请选择系统用户')
    week = str(f.get('weekDayStr') or '').strip()
    rtype = int(f.get('restrictType') or 0)
    ips = (f.get('ipWhitelist') or '').strip()
    if rtype in (0, 3) and not ips:
        return json_err('IP限制方式必须填写 IP 或网段')
    d = dict(userId=u['id'], userName=u['userName'], weekDay=week, restrictTimeS=int(f.get('restrictTimeS') or 0), restrictTimeE=int(f.get('restrictTimeE') or 24), restrictType=rtype,
             ipWhitelist=ips, updateTime=now(), lastModifyUserName=uname())
    rid = int(f.get('userLoginRestrictIds') or 0)
    if rid and db.get('login_restrict', rid):
        db.update('login_restrict', rid, d)
        return json_ok('修改成功')
    db.insert('login_restrict', dict(d, status='0'))
    return json_ok('新增成功')


@route('/UserAjax/AddUserLoginRestrictByIP')
def add_restrict_ip():
    """管理页“加入IP黑名单”：为该规则追加禁止 IP"""
    p = P()
    r = db.get('login_restrict', p.int('id'))
    if not r:
        return json_err('记录不存在')
    ips = [x.strip() for x in str(r.get('blackIP') or '').split(',') if x.strip()]
    if p.get('ip') not in ips:
        ips.append(p.get('ip').strip())
    db.update('login_restrict', r['id'], dict(blackIP=','.join(ips), updateTime=now(), lastModifyUserName=uname()))
    return json_ok('已加入黑名单')


@route('/UserAjax/UpUserLoginRestrictStatus')
def restrict_status():
    p = P()
    r = db.get('login_restrict', p.int('userLoginRestrictId'))
    if not r:
        return json_err('记录不存在')
    st = str(p.get('status'))
    # 原站：status=0 生效、1 禁用；开关传 true/false 时按开关方向处理
    newv = '0' if st in ('true', 'True', 'on', 'Y', '0') else '1'
    db.update('login_restrict', r['id'], dict(status=newv, updateTime=now(), lastModifyUserName=uname()))
    return json_ok('规则已生效' if newv == '0' else '规则已禁用')


@route('/UserAjax/DelUserLoginRestrict')
def del_restrict():
    p = P()
    for x in p.ids('idx') or p.ids('ids'):
        db.delete('login_restrict', x)
    return json_ok('删除成功')


def _ip_match(ip, spec):
    import ipaddress
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return False
    for item in str(spec or '').replace(',', '\n').splitlines():
        item = item.strip()
        if not item:
            continue
        try:
            if '/' in item:
                if addr in ipaddress.ip_network(item, strict=False):
                    return True
            elif addr == ipaddress.ip_address(item):
                return True
        except ValueError:
            continue
    return False


def check_login_restrict(u, ip):
    """登录时按规则校验；返回拒绝原因或 None"""
    import datetime as _dt
    nowt = _dt.datetime.now()
    wd = str(nowt.isoweekday() % 7)  # 0=周日
    for r in db.find('login_restrict', lambda r: r.get('userId') == u['id'] and str(r.get('status', '0')) == '0'):
        days = [x for x in str(r.get('weekDay') or '').split(',') if x]
        if days and wd not in days:
            continue
        s_, e_ = int(r.get('restrictTimeS') or 0), int(r.get('restrictTimeE') or 24)
        if not (s_ <= nowt.hour < (e_ if e_ > s_ else 24)):
            continue
        t = int(r.get('restrictType') or 0)
        if t == 0 and not _ip_match(ip, r.get('ipWhitelist')):
            return '登录限制：当前 IP 不在允许的白名单内'
        if t == 2:
            return '登录限制：该时段禁止登录'
        if t == 3 and _ip_match(ip, r.get('ipWhitelist')):
            return '登录限制：当前 IP 已被禁止登录'
        if r.get('blackIP') and _ip_match(ip, r.get('blackIP')):
            return '登录限制：当前 IP 已被加入黑名单'
    return None


# ---------------- 入职申请 / 实名 / 合同（本地版占位）----------------
@route('/UserAjax/GetOnboardingList')
def onboarding_list():
    rows = db.find('onboarding', None, 'createTime')
    return paged(rows)


@route('/UserAjax/AuditOnboarding')
def audit_onboarding():
    p = P()
    try:
        m = json.loads(request.get_data(as_text=True) or '{}')
    except ValueError:
        m = p.all()
    r = db.get('onboarding', m.get('id') or p.int('id'))
    if r:
        db.update('onboarding', r['id'], dict(status=m.get('status', 1)))
    return json_ok('审核完成')


@route('/UserAjax/DeleteOnboarding')
def delete_onboarding():
    for x in P().ids('ids') or [P().int('id')]:
        if x:
            db.delete('onboarding', x)
    return json_ok('删除成功')


@route('/UserAjax/GetUserRnameCertLogList')
def cert_log_list():
    return paged(db.all_('cert_logs'))


@route('/UserAjax/SaveCertSetting')
def save_cert_setting():
    cur = db.setting('certSetting', {})
    cur.update(_param_json())
    db.set_setting('certSetting', cur)
    return json_ok('保存成功')


@route('/api/SignContract/GetSystemContarctList')
def contract_list():
    return paged(db.all_('contracts'))


@route('/api/SignContract/GetSystemContractTotal')
def contract_total():
    rows = db.all_('contracts')
    return json_ok('', data=dict(total=len(rows), signed=len([r for r in rows if r.get('status') == 1]), unsigned=len([r for r in rows if r.get('status') != 1])))


@route(['/api/SignContract/GetContractTemplateList'])
def contract_templates():
    return json_ok('', data=[dict(id=1, name='标准劳务合作协议'), dict(id=2, name='代练服务协议')])


@route(['/api/SignContract/GetContractUrl', '/api/SignContract/GetSignContractUrl'])
def contract_url():
    return json_err('本地版未接入电子签约服务')


@route('/api/SignContract/SaveSignConfig')
def save_sign_config():
    p = P()
    raw = p.get('param') or request.get_data(as_text=True)
    try:
        f = json.loads(raw) if raw else {}
    except ValueError:
        f = p.all()
    cur = db.setting('contractSetting', {})
    cur.update(f if isinstance(f, dict) else {})
    db.set_setting('contractSetting', cur)
    return json_ok('保存成功')


@route('/UserAjax/SaveContractWhitelist')
def save_contract_whitelist():
    try:
        ids = json.loads(request.get_data(as_text=True) or '[]')
    except ValueError:
        ids = P().list('ids')
    db.set_setting('contractWhitelist', ids)
    return json_ok('保存成功')


@route(['/api/SignContract/ContractRescission', '/api/SignContract/DeleteContract', '/api/SignContract/ContractRevoke',
        '/api/SignContract/ContractBindSysUser', '/api/SignContract/CreateContract', '/api/SignContract/BatchCreateContract', '/api/SignContract/SetSignStatus'])
def contract_ops():
    return json_err('本地版未接入电子签约服务，无法发起/处理合同')


@route('/api/SignContract/CheckContract')
def check_contract():
    return json_ok('', data=[])


@route('/UserAjax/GetContractWhitelist')
def contract_whitelist():
    return json_ok('', data=db.setting('contractWhitelist', []))
