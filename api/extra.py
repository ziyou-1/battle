# -*- coding: utf-8 -*-
"""补充接口：各设置页的保存/开关/删除、下拉数据、上传等（对应原站前端扫描出的其余接口名）"""
import json, os, re
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .system import generic_list, generic_save, generic_del
from .misc import _save_file
from integrations.wecom import validate_webhook, retry_delivery


def _can_manage_integrations():
    user = current_user() or {}
    return is_super() or user.get('jobName') == '老板'


def _toggle(coll, field, on='Y', off='N', id_keys=('id', 'ptid', 'ids')):
    def fn():
        p = P()
        rid = 0
        for k in id_keys:
            rid = p.int(k)
            if rid:
                break
        r = db.get(coll, rid)
        if not r:
            return json_err('记录不存在')
        v = p.get('status') or p.get('value') or p.get('sta')
        newv = (on if v in ('Y', '1', 'true', 'on') else off) if v else (off if r.get(field) == on else on)
        db.update(coll, rid, {field: newv})
        return json_ok('操作成功')
    return fn


# ---- 交易平台对接（/System/tripartiteplatformsetting）
PLATFORMS = {'8': '全能代(交易中心)', '10': '代练通', '30': '代练妈妈', '50': '咕噜代练', '60': '易代练', '70': '代练宝', '80': '代练丸子', '90': '趣代练', '91': '代练多', '92': '代游通', '93': '天玩代练'}


@route('/SystemAJax/SaveTransfromInterfaceAddModify')
def save_platform_interface():
    p = P()
    pid = str(p.get('platformId') or '')
    if pid not in PLATFORMS:
        return json_err('请选择交易平台')
    d = dict(platformId=int(pid), platformName=PLATFORMS[pid], platformAcc=p.get('platformAcc').strip(), appId=p.get('appId'), appSecret=p.get('appSecret'), remark=p.get('remark'),
             concactQQ=p.get('concactQQ'), concactPhone=p.get('concactPhone'))
    if p.get('platformLoginPwd'):
        d['loginPwd'] = p.get('platformLoginPwd')
    if p.get('platformPayPwd'):
        d['payPwd'] = p.get('platformPayPwd'); d['isFillPlatmPayPwd'] = 'Y'
    if not d['platformAcc']:
        return json_err('请输入平台账号')
    rid = p.int('id')
    if rid and db.get('platform_interfaces', rid):
        db.update('platform_interfaces', rid, d)
        return json_ok('修改成功')
    if db.first('platform_interfaces', lambda r: str(r.get('platformId')) == pid and r.get('platformAcc') == d['platformAcc']):
        return json_err('该平台账号已对接过')
    d.update(status='Y', isDefault='N', isAutoAccep='N', isNotifyPushMan='N', isAutoSelect='N', isFillPlatmPayPwd=d.get('isFillPlatmPayPwd', 'N'))
    db.insert('platform_interfaces', d)
    return json_ok('对接成功（本地版不会真正连接交易平台）')


@route('/SystemAjax/SaveTripartitlePlatForm')
def save_tripartite_settings():
    p = P()
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        f = {}
    cur = db.setting('system', {})
    cur.update({k: v for k, v in f.items() if k.startswith('SK')})
    db.set_setting('system', cur)
    return json_ok('保存成功')


@route('/SystemAjax/ModifyTransfromInterfaceHelperSwitch')
def platform_switch():
    p = P()
    r = db.get('platform_interfaces', p.int('id'))
    if not r:
        return json_err('记录不存在')
    field = {'10': 'status', '20': 'isAutoAccep', '30': 'isNotifyPushMan', '40': 'isAutoSelect', '50': 'isDefault'}.get(str(p.get('modifyType')))
    if not field:
        return json_err('未知的开关类型')
    newv = 'N' if r.get(field) == 'Y' else 'Y'
    if field == 'isDefault' and newv == 'Y':
        for o in db.all_('platform_interfaces'):
            if o.get('isDefault') == 'Y':
                db.update('platform_interfaces', o['id'], dict(isDefault='N'))
    db.update('platform_interfaces', r['id'], {field: newv})
    return json_ok('操作成功')


@route('/SystemAjax/ModifyPlatformPayPassWord')
def modify_pay_pwd():
    p = P()
    r = db.get('platform_interfaces', p.int('id') or p.int('ptid'))
    if not r:
        return json_err('记录不存在')
    db.update('platform_interfaces', r['id'], dict(payPwd=p.get('pwd') or p.get('payPwd'), isFillPlatmPayPwd='Y'))
    return json_ok('保存成功')


# ---- 淘宝店 / 其它平台店铺对接（/System/taobaoshipsetting、/System/pddshipsetting）
SHOP_PLATFORMS = {0: '淘宝', 10: '拼多多', 15: '京东', 20: '闲鱼', 30: '抖音', 40: '快手', 60: '小红书'}


@route('/SystemAJax/AddModtifyTaobaoInterface')
def save_shop_interface():
    if not _can_manage_integrations():
        return json_err('无权修改外部接口配置')
    p = P()
    pt = p.int('platformType')
    if pt not in SHOP_PLATFORMS:
        return json_err('请选择支持的电商平台')
    rid = p.int('id')
    previous = db.get('taobao_interfaces', rid) if rid else None
    app_id = (p.get('appId') or '').strip()
    if app_id in ('0000000000000000000', '2019071918003165108'):
        return json_err('请使用客户自有的阿奇索应用 AppId')
    same_identity = previous and app_id == previous.get('appId') and pt == int(previous.get('platformType') or 0)
    secret = (p.get('appSecret') or '').strip() or ((previous or {}).get('appSecret', '') if same_identity else '')
    token = (p.get('accessToken') or '').strip() or ((previous or {}).get('accessToken', '') if same_identity else '')
    d = dict(platformType=pt, platformName=SHOP_PLATFORMS[pt], appId=app_id, appSecret=secret, accessToken=token, remark=p.get('remark'),
             soureName=p.get('soureName'), shopSellerNick=p.get('shopSellerNick'), shopName=p.get('shopSellerNick') or p.get('soureName') or (SHOP_PLATFORMS.get(pt, '') + '店铺'))
    if not (app_id and secret and token):
        return json_err('请填写客户自有应用 AppId、AppSecret 和店铺授权 AccessToken')
    d['integrationStatus'] = '待接口授权与联调'
    if previous:
        db.update('taobao_interfaces', rid, d)
        return json_ok('配置已保存，待平台接口授权与联调')
    db.insert('taobao_interfaces', d)
    return json_ok('配置已保存，待平台接口授权与联调')


def _save_shop_settings(key):
    def fn():
        p = P()
        try:
            f = json.loads(p.get('param') or '{}')
        except ValueError:
            f = {}
        cur = db.setting(key, {})
        cur.update({k: v for k, v in f.items() if k not in ('ptid', 'appId', 'appSecret', 'accessToken', 'remark', 'shopSellerNick')})
        db.set_setting(key, cur)
        return json_ok('配置已保存；订单读取和自动发货待客户接口授权与联调后生效')
    return fn


route('/SystemAjax/TaobaoShipSetting')(_save_shop_settings('taobaoShip'))
route('/SystemAjax/PddShipSetting')(_save_shop_settings('pddShip'))

# ---- 交易平台自动回复（/System/PlatformAutoReply）
def _platform_names(ids):
    names = []
    for x in str(ids or '').split(','):
        x = x.strip()
        if x == '0':
            names.append('全部平台')
        elif x in PLATFORMS:
            names.append(PLATFORMS[x])
    return ','.join(names)


@route('/SystemAJax/SavePlatformAutoReplySetModify')
def save_auto_reply():
    p = P()
    content = (p.get('replycontent') or '').strip()
    if not content and not p.get('pic'):
        return json_err('请输入回复内容')
    ids = ','.join(p.list('platformIds'))
    d = dict(GameName=p.get('gameName') or '全部游戏', ReplyOccasion=p.int('replyOcc'), AssUserType=p.int('replyUserType', -1), UserName=p.get('userName') or '',
             ReplyMsg=content, AppleImageUrl=p.get('pic') or '', UsePlatformId=ids, PlatformName=_platform_names(ids))
    rid = p.int('id')
    if rid and db.get('platform_autoreply', rid):
        db.update('platform_autoreply', rid, d)
        return json_ok('修改成功')
    db.insert('platform_autoreply', dict(d, ReplyStatus='Y'))
    return json_ok('新增成功')


@route('/SystemAjax/ModifyPlatformAutoReplySetStatus')
def auto_reply_status():
    r = db.get('platform_autoreply', P().int('id'))
    if not r:
        return json_err('记录不存在')
    db.update('platform_autoreply', r['id'], dict(ReplyStatus='N' if r.get('ReplyStatus') == 'Y' else 'Y'))
    return json_ok('操作成功')


@route('/SystemAjax/BatchEditReplyContent')
def batch_reply():
    p = P()
    for x in p.ids('ids'):
        db.update('platform_autoreply', x, dict(ReplyMsg=p.get('content') or p.get('ReplyMsg')))
    return json_ok('批量修改成功')


# ---- 平台快速发单设置（/System/PlatformPushOrderConfig）：每款游戏一行，id = 游戏 id
PUSH_FIELDS = ('pushPlatformIds', 'pushPlatfromPriceScale', 'pushPlatformSafeAmount', 'pushPlatformEffAmount', 'pushPlatformPhone', 'pushPlatformQQ', 'isAutoWritePhone',
               'pushPlatfromBuilderPrivePhone', 'pushPlatformRequire')


@route('/SystemAjax/GetPlatformPushOrderConfigList')
def push_config_list():
    cfg = {str(r.get('gameId')): r for r in db.all_('platform_pushconfig')}
    rows = []
    for g in sorted(db.all_('games'), key=lambda g: -(g.get('orderNum') or 0)):
        if g['gameName'] == '全部游戏':
            continue
        c = cfg.get(str(g['id']), {})
        row = dict(id=g['id'], gameName=g['gameName'])
        for f in PUSH_FIELDS:
            row[f] = c.get(f, '' if f not in ('pushPlatfromPriceScale',) else 0)
        row['pushPlatformNames'] = _platform_names(row['pushPlatformIds'])
        rows.append(row)
    return paged(rows)


@route('/SystemAjax/GetPlatformPushOrderConfig')
def get_push_config():
    p = P()
    r = db.first('platform_pushconfig', lambda r: str(r.get('gameId')) == str(p.get('id') or p.get('gameId')))
    return json_ok('', data=r or {})


@route('/SystemAJax/SavePlatformPushOrderConfig')
def save_push_config():
    p = P()
    ids = p.list('id') or p.ids('id')
    if not ids:
        return json_err('请选择要设置的游戏')
    d = dict(pushPlatformIds=','.join(p.list('platformIds')), pushPlatfromPriceScale=p.float('pushPlatfromPriceScale'), pushPlatformSafeAmount=p.get('pushordersafeamount'),
             pushPlatformEffAmount=p.get('pushordereffamount'), pushPlatformPhone=p.get('pushorderphone'), pushPlatformQQ=p.get('pushorderqq'), isAutoWritePhone=p.get('autowritephone') or '0',
             pushPlatfromBuilderPrivePhone=p.get('autobuilderprivtephone') or 'N', pushPlatformRequire=p.get('pushorderquire'))
    n = 0
    for gid in ids:
        g = db.get('games', gid)
        if not g:
            continue
        r = db.first('platform_pushconfig', lambda r: str(r.get('gameId')) == str(g['id']))
        if r:
            db.update('platform_pushconfig', r['id'], d)
        else:
            db.insert('platform_pushconfig', dict(d, gameId=g['id'], gameName=g['gameName']))
        n += 1
    return json_ok('已保存 %d 款游戏的发单设置' % n)


@route('/SystemAjax/ClearPlatformPushOrderConfig')
def clear_push_config():
    p = P()
    for gid in p.list('id') or p.ids('ids'):
        for r in db.find('platform_pushconfig', lambda r: str(r.get('gameId')) == str(gid)):
            db.delete('platform_pushconfig', r['id'])
    return json_ok('已清除')


# ---- 自动发消息到微信群（/System/OrderPushGroupMsgSet）
@route('/SystemAJax/SavePushOrderGroupMsgSetModify')
def save_group_msg():
    if not _can_manage_integrations():
        return json_err('无权修改群推送配置')
    p = P()
    games = ','.join(p.list('gameName'))
    if not games:
        return json_err('请选择限定游戏')
    rid = p.int('id')
    previous = db.get('push_group_msg', rid) if rid else None
    webhook = (p.get('webhookUrl') or '').strip() or (previous or {}).get('webhookUrl', '')
    if not webhook:
        return json_err('请填写企业微信群机器人 Webhook，原平台内部群 ID 在本地无法发送')
    try:
        webhook = validate_webhook(webhook)
    except ValueError as exc:
        return json_err(str(exc))
    d = dict(gameName=games, replyOcc=p.int('replyOcc'), webhookUrl=webhook, kurl=p.get('kurl') or '0', callAll=p.int('callAll', 10), msgType=p.int('msgType'),
             remark=p.get('remark'), groupId=p.get('groupId'))
    if previous:
        db.update('push_group_msg', rid, d)
        return json_ok('设置已保存，订单触发时将推送至企业微信群')
    db.insert('push_group_msg', dict(d, switchStatus='Y'))
    return json_ok('设置已保存，订单触发时将推送至企业微信群')


@route('/SystemAjax/ModityPushOrderGroupMsgStatus')
def group_msg_status():
    if not _can_manage_integrations():
        return json_err('无权修改群推送配置')
    r = db.get('push_group_msg', P().int('id'))
    if not r:
        return json_err('记录不存在')
    if r.get('switchStatus') != 'Y':
        try:
            validate_webhook(r.get('webhookUrl'))
        except ValueError as exc:
            return json_err(str(exc))
    db.update('push_group_msg', r['id'], dict(switchStatus='N' if r.get('switchStatus') == 'Y' else 'Y'))
    return json_ok('操作成功')


@route('/SystemAjax/DelPushOrderGroupMsg')
def delete_group_msg():
    if not _can_manage_integrations():
        return json_err('无权修改群推送配置')
    rule = db.get('push_group_msg', P().int('id'))
    if not rule:
        return json_err('记录不存在')
    db.delete('push_group_msg', rule['id'])
    return json_ok('删除成功')


@route('/SystemAjax/RetryPushOrderGroupMsg')
def retry_group_msg():
    if not _can_manage_integrations():
        return json_err('无权重试群推送')
    delivery = db.get('group_deliveries', P().int('id'))
    try:
        retry_delivery(delivery)
    except (ValueError, RuntimeError) as exc:
        return json_err(str(exc))
    return json_ok('企业微信群消息已重新发送')


# ---- 交易单自动调价（/System/AutomaticAdJustPriceSet）：列表字段沿用原站的 str/id/d 命名
def _adjust_row(r):
    return dict(id2=r['id'], id=r['id'], str1=r.get('gameName'), str2=r.get('projectType') or '全部', id3=int(r.get('addPriceMode') or 0), d3=r.get('addPrice'), d2=r.get('maxPushPrice'),
                id4=r.get('actionInterval'), d4=r.get('lossCap'), id7=r.get('actionShour'), id8=r.get('actionEhour'), str10='%s点-%s点' % (r.get('actionShour', ''), r.get('actionEhour', '')),
                id5=1 if r.get('enabled', 'Y') == 'Y' else 0, str3=r.get('loopAction') or 'N', createTime=r.get('createTime'))


@route('/SystemAjax/GetAutomaticAdJustPriceSetList')
def adjust_price_list():
    return paged([_adjust_row(r) for r in db.all_('auto_adjust_price')])


@route('/SystemAJax/SaveAddModiftyAutomaticAdJustPriceSet')
def save_adjust_price():
    p = P()
    if not p.get('gameName'):
        return json_err('请选择游戏')
    d = dict(gameName=p.get('gameName'), projectType=p.get('projectType') or '全部', loopAction=('Y' if p.get('loopAction') in ('on', 'Y', '1', 'true') else 'N'), addPrice=p.float('addPrice'),
             actionInterval=p.int('actionInterval'), maxPushPrice=p.float('maxPushPrice'), lossCap=p.float('lossCap'), addPriceMode=p.int('addPriceMode'), actionShour=p.get('actionShour'),
             actionEhour=p.get('actionEhour'))
    rid = p.int('id')
    if rid and db.get('auto_adjust_price', rid):
        db.update('auto_adjust_price', rid, d)
        return json_ok('修改成功')
    db.insert('auto_adjust_price', dict(d, enabled='Y'))
    return json_ok('新增成功')


@route('/SystemAjax/UpdateAutomaticAdJustPriceSetStatus')
def adjust_price_status():
    p = P()
    r = db.get('auto_adjust_price', p.int('id'))
    if not r:
        return json_err('记录不存在')
    if p.get('type') == '1':
        db.update('auto_adjust_price', r['id'], dict(loopAction='N' if r.get('loopAction') == 'Y' else 'Y'))
    else:
        db.update('auto_adjust_price', r['id'], dict(enabled='N' if r.get('enabled', 'Y') == 'Y' else 'Y'))
    return json_ok('操作成功')


route('/SystemAjax/DelAutomaticAdJustPriceSet')(generic_del('auto_adjust_price', 'id'))


# ---- 内部沟通通讯设置（/System/OnlineConsultationSet）：4 个接待场景 + 群主
SCENES = {10: ('userList1', 'title1'), 20: ('userList2', 'title2'), 30: ('userList3', 'title3'), 40: ('userList4', 'title4')}


@route('/SystemAjax/ModifyOnlineConsultationSet')
def save_consultation():
    p = P()
    try:
        f = json.loads(p.get('strparameter') or '{}')
    except ValueError:
        f = p.all()
    names = {str(u['id']): u['userName'] for u in db.all_('users')}
    for st, (ul, tl) in SCENES.items():
        ids = [x for x in str(f.get(ul) or '').replace('，', ',').split(',') if x]
        d = dict(ScenesType=st, SystemUserIds=','.join(ids), SystemUserNames=','.join(names.get(i, i) for i in ids), ShowNickName=f.get(tl) or '')
        r = db.first('online_consult', lambda r: r.get('ScenesType') == st)
        if r:
            db.update('online_consult', r['id'], d)
        else:
            db.insert('online_consult', d)
    if f.get('userList5'):
        db.set_setting('imGroupOwner', str(f.get('userList5')))
    return json_ok('保存成功')


@route('/SystemAjax/GetUserListByOnlineConsultationSet')
def consult_users():
    """每个场景一份人员下拉（selected 标记当前接待人员）+ 当前昵称"""
    rows = [u for u in db.all_('users') if u.get('sta') != 'N']
    out = dict(code=1, msg='')
    cur = {r.get('ScenesType'): r for r in db.all_('online_consult')}
    for st, (ul, tl) in SCENES.items():
        r = cur.get(st, {})
        ids = set(str(r.get('SystemUserIds') or '').split(','))
        n = ul[-1]
        out['data' + n] = [dict(name=u['userName'], value=u['id'], selected=('selected' if str(u['id']) in ids else ''), disabled=False) for u in rows]
        out['title' + n] = r.get('ShowNickName', '')
        out['userJob' + n] = r.get('SystemUserIds', '')
    owner = db.setting('imGroupOwner', '')
    out['data5'] = [dict(name=u['userName'], value=u['id'], selected=('selected' if str(u['id']) == str(owner) else ''), disabled=False) for u in rows]
    return jsonify(out)


# ---- 上家系统 / 客户填单 / 虚拟号 / 微信 / 抽奖设置：存 kv
def _save_kv(key):
    def fn():
        p = P()
        cur = db.setting(key, {})
        try:
            f = json.loads(p.get('param')) if p.get('param') else p.all()
        except ValueError:
            f = p.all()
        cur.update(f)
        db.set_setting(key, cur)
        return json_ok('保存成功')
    return fn




@route('/SystemAjax/SaveBindHomeSystemVer')
def bind_home_system():
    p = P()
    company, host, acc, pwd = p.get('company').strip(), p.get('homeHost').strip(), p.get('homeAcc').strip(), p.get('homePwd')
    if not (company and host and acc and pwd):
        return json_err('请填写完整的上家信息')
    if db.first('home_systems', lambda r: r.get('HomeHost') == host and r.get('HomeAcc') == acc):
        return json_err('该上家账号已绑定过')
    db.insert('home_systems', dict(HomeCompany=company, HomeHost=host, HomeAcc=acc, UserName=uname(), BindTimeStr=now(), status='本地版未真正验证'))
    return json_ok('已记录绑定信息（本地版不会真正连接上家系统）')


@route('/SystemAjax/UnBindHomeSystem')
def unbind_home_system():
    p = P()
    db.delete('home_systems', p.int('sid') or p.int('bid') or p.int('id'))
    return json_ok('已解绑')


@route('/SystemAjax/SavePrivacyPhoneServiceSetting')
def save_privacy_phone():
    p = P()
    cur = db.setting('privacyPhone', {})
    if p.get('privacyPhoneServiceSwicth'):
        cur['PrivacyPhoneServiceSwicth'] = p.get('privacyPhoneServiceSwicth')
    if p.get('param'):
        try:
            cur.update(json.loads(p.get('param')))
        except ValueError:
            pass
    db.set_setting('privacyPhone', cur)
    return json_ok('保存成功')
route('/SystemAjax/WeChatSetting')(_save_kv('wechat'))


@route(['/SystemAjax/WeChatChangeBind', '/SystemAjax/WeChatUnBind'])
def wechat_bind_stub():
    return json_err('本地版未接入微信公众号')


# ---- 录单识别 / 修正 / 学习资料
route('/SystemAjax/EditAutoDiscernSet')(generic_save('auto_discern', 'disID', 'typeName', dict(gameName='全部游戏')))


@route('/SystemAjax/ResetVerifiAddOrderKeyStr')
def reset_verify_keys():
    for r in db.all_('verify_keys'):
        db.delete('verify_keys', r['id'])
    return json_ok('已重置')


@route('/SystemAjax/AddEditLearmInformation')
def add_edit_learn_alias():
    from .emp import add_edit_learn
    return add_edit_learn()


# ---- 客户端内容管理：见 api/miniapp.py（保留原站兼容文件名）
route('/SystemAjax/GetOrderGuideTemplateList')(generic_list('order_guide_templates', 'id', ('title',)))
route('/SystemAjax/DelOrderGuideTemplate')(generic_del('order_guide_templates', 'id'))

# ---- 排团 / 人员 下拉
@route('/PveTaskAjax/GetAllTaskSelectListData')
def task_select():
    p = P()
    rows = db.all_('pve_tasks')
    if p.get('status') == '10':
        rows = [t for t in rows if t.get('taskStatus') in ('A', 'B')]
    g = p.get('gameId')
    if g and g not in ('0', '', '21714'):
        try:
            rows = [t for t in rows if t.get('gameId') == int(g)]
        except ValueError:
            pass
    return json_ok('', data=[dict(name=t.get('taskName'), value=str(t['id'])) for t in rows])


@route('/PveTaskAjax/GetGroupJobNeedList')
def group_job_need():
    t = db.get('pve_tasks', P().int('taskId'))
    if not t:
        return json_ok('', data=[])
    return json_ok('', data=[dict(pid=j.get('pid'), name=j.get('jobName'), value=j.get('pid'), recUser=j.get('userName')) for j in (t.get('jobs') or [])])


@route('/UserAjax/GetGroupUserSelect')
def group_user_select():
    rows = [u for u in db.all_('users') if u.get('sta') != 'N']
    return json_ok('', data=[dict(name=u['userName'], value=u['id']) for u in rows])


@route('/GameAjax/GetGameAttrInfoTitle')
def game_attr_title():
    return json_ok('', data=dict(area='大区/平台', server='服务器', job='职业', group='阵营/门派'))


@route('/CustomerAjax/GetIntervalLevel')
def interval_level():
    rows = sorted(db.all_('customer_levels'), key=lambda r: float(r.get('StartValue') or 0))
    return json_ok('', data=rows)


@route('/CustomerAjax/GetMemberAddOrderSimpInfo')
def member_simp_info():
    from .customer import customer_row
    p = P()
    kw = p.get('key') or p.get('bossName') or p.get('customerNo')
    c = db.first('customers', lambda r: r.get('bossName') == kw or r.get('customerNo') == kw or str(r['id']) == str(kw))
    if not c:
        return json_err('未找到会员')
    return json_ok('', data=customer_row(c))


# ---- 上传（头像 / 二维码 / 文本）
@route(['/UserAjax/UploadMyPic'])
def upload_my_pic():
    f = list(request.files.values())[0] if request.files else None
    if not f:
        return json_err('没有文件')
    try:
        url = _save_file(f)
    except ValueError as exc:
        return json_err(str(exc))
    db.update('users', uid(), dict(photo=url))
    return jsonify(dict(code=1, msg='上传成功', data=dict(src=url), src=url))


@route(['/UserAjax/UploadQrCode'])
def upload_qrcode():
    f = list(request.files.values())[0] if request.files else None
    if not f:
        return json_err('没有文件')
    try:
        url = _save_file(f)
    except ValueError as exc:
        return json_err(str(exc))
    db.update('users', uid(), dict(qrCode1=url))
    return jsonify(dict(code=1, msg='上传成功', data=dict(src=url), src=url))


@route('/CommonPermissionAjax/UploadSingleTxtToRoot')
def upload_txt():
    f = list(request.files.values())[0] if request.files else None
    if not f:
        return json_err('没有文件')
    txt = f.read().decode('utf-8', 'ignore')
    return json_ok('读取成功', data=txt)


# ---- 订单：文件导入 / 客户填单 / 交易平台占位
@route('/OrderAjax/ImputAddOrderByFile')
def import_order_file():
    from .game import resolve_game
    f = list(request.files.values())[0] if request.files else None
    gm = resolve_game(P().get('gameName') or P().get('importGameName'))
    if not f or not gm:
        return json_err('请选择游戏并上传文件')
    txt = f.read().decode('utf-8', 'ignore')
    n = 0
    from .order import new_order_id, add_log
    import datetime as _dt
    for block in [b.strip() for b in re.split(r'\n\s*\n', txt) if b.strip()]:
        first = block.splitlines()[0][:60]
        o = db.insert('orders', dict(orderId=new_order_id(), orderIdView=_dt.datetime.now().strftime('%y%m%d%H%M%S') + '%02d' % (n % 100), gameId=gm['id'], gameName=gm['gameName'], project=first,
                                     orderContent=block, orderSta='未分配', price=0, recFee=0, netReceipts='0', kefu=uname(), kefuId=uid(), addOrderUserName=uname(), inputOrderManName=uname(),
                                     assUserName=uname(), isDel='N', isLock='N', isSettStatus='未结算', labels=[], imgs=[], days=1, hours=0, bussType=1, orderSoure='文件导入', roleName='', gameArea='', gameServer='', gameJob='', gameGroup=''))
        add_log(o, '文件导入订单', '录单')
        n += 1
    return json_ok('导入 %d 笔订单' % n)


# 客户填单：见 api/clientorder.py
@route(['/OrderAjax/ReadTaobaoOrderData'])
def read_taobao():
    return json_err('待客户阿奇索应用完成店铺授权并提供订单 API 文档后，才能读取真实淘宝订单')


@route(['/OrderAjax/SendAgin', '/OrderAjax/SendAginByTxt', '/OrderAjax/SynchTransctionOrderStatus', '/OrderAjax/ConfigmTransctionOrder', '/OrderAjax/ChangeTransctionOrderArbitration',
        '/OrderAjax/AppendTransctionOrderPrice', '/OrderAjax/GetPlatformOrderList'])
def platform_stub():
    return json_err('本地版未对接交易平台')


@route(['/OrderAjax/DismissRecPlayerChat', '/OrderAjax/SaveRecPlayerChatMsgFilterKey'])
def chat_stub():
    return json_ok('操作成功')


@route('/OrderAjax/GetRecPlayerChatMsgFilterKey')
def chat_filter_key():
    return json_ok('', data=db.setting('chatFilterKey', ''))


@route('/OrderAjax/ViewPic')
def view_pic():
    from .order import find_order
    o = find_order(P().get('orderId'))
    return json_ok('', data=(o.get('imgs') or []) if o else [])


@route(['/api/ImApi/CreateGroup', '/api/ImApi/DestroyGroup'])
def im_stub():
    return json_err('本地版未接入内部沟通(IM)服务')


# ---- 订单微信群（原站调微信接口建临时群、出群二维码；本地版明确提示而不是 404）----
@route(['/orderajax/CreateTempGroup', '/OrderAjax/CreateTempGroup'])
def create_temp_group():
    from .order import find_order
    if not find_order(P().get('orderId')):
        return json_err('订单不存在')
    return json_err('本地版未接入微信建群服务：订单临时群无法自动创建，请用微信群设置里的机器人推送')


@route(['/orderajax/GetGroupWxQrCode', '/OrderAjax/GetGroupWxQrCode'])
def group_wx_qrcode():
    return json_err('本地版未接入微信建群服务，没有群二维码')


# ---- 前端扫描出来、但本地版还没有的接口（原来点了就 404）----
@route('/CustomerAjax/AddBackOfList')
def add_back_of_list():
    """客户维护 → 黑名单管理 → 新增"""
    p = P()
    if not (p.get('moblie') or p.get('qq') or p.get('ww')):
        return json_err('手机号 / QQ / 微信 至少填一项')
    row = db.insert('customer_backlist', dict(moblie=p.get('moblie'), qq=p.get('qq'), ww=p.get('ww'),
                                              roleType=p.get('roleType') or '客户', remark=p.get('remark'),
                                              userName=uname(), userId=uid()))
    log('黑名单', '新增黑名单：%s' % (p.get('moblie') or p.get('qq') or p.get('ww')))
    return json_ok('已加入黑名单', data=row)


@route('/UserAjax/SetUserGames')
def set_user_games():
    """人员管理 → 设置游戏：勾选某人可接的游戏"""
    p = P()
    target = p.int('uid') or uid()
    if target != uid() and not is_super():
        return json_err('只有系统管理员可以修改他人的游戏权限')
    db.update('users', target, dict(games=p.get('games'), setGamesMode=p.get('setMode')))
    return json_ok('设置成功')


def _drop_order_pics(ids):
    """删除订单图片。picID 可能是图片地址、"<orderId>:<序号>"，或配合 orderId 的纯序号"""
    from .order import find_order, add_log
    order_id = P().get('orderId')
    ids = [str(i) for i in ids if str(i) != '']
    if not ids:
        return json_err('没有要删除的图片')
    removed = 0
    candidates = [find_order(order_id)] if order_id else db.all_('orders')
    for o in candidates:
        if not o:
            continue
        imgs = list(o.get('imgs') or [])
        keep = []
        for idx, url in enumerate(imgs, start=1):
            tag = '%s:%d' % (o.get('orderId'), idx)
            if url in ids or tag in ids or (order_id and str(idx) in ids):
                removed += 1
                continue
            keep.append(url)
        if len(keep) != len(imgs):
            db.update('orders', o['id'], dict(imgs=keep))
            add_log(o, '删除订单图片 %d 张' % (len(imgs) - len(keep)), uname())
    if not removed:
        return json_err('没找到要删除的图片（可能已经被删过）')
    return json_ok('已删除 %d 张图片' % removed)


@route('/OrderAjax/DelPic')
def del_order_pic():
    return _drop_order_pics([P().get('picID') or P().get('id')])


@route('/OrderAjax/DelPicMultiple')
def del_order_pics():
    return _drop_order_pics(P().list('ids'))


@route('/OrderAjax/SendSmsByOrderIDX')
def send_sms_by_order():
    """给订单客户发短信：本地版没有短信通道，只落库不外发（短信记录页能看到）"""
    from .order import find_order, add_log
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    content = p.get('smsContent') or ''
    if not content.strip():
        return json_err('短信内容不能为空')
    db.insert('sms_logs', dict(moblie=o.get('moblie') or '', smsContent=content, isSucess='N', sendCount=1, fee=0,
                               orderId=o.get('orderId'), tempType=p.get('smsTemplteType'), userName=uname(),
                               Msg='本地版未接入短信通道，仅记录未外发'))
    add_log(o, '发送短信（本地版未外发）', uname())
    return json_ok('短信已记录（本地版未接入短信通道，不会真的发出去）')


@route('/CommonPermissionAjax/GetAliOssFileView')
def ali_oss_file_view():
    """预览已上传的图片：原站回云存储地址，本地版回本机 /upload/ 地址"""
    from .misc import UPLOAD_DIR, LEGACY_UPLOAD_DIR
    key = str(P().get('fileKey') or P().get('key') or P().get('url') or '')
    name = os.path.basename(key.split('?')[0].replace('\\', '/'))
    for folder, prefix in ((os.path.join(UPLOAD_DIR, 'public'), '/upload/public/'),
                           (os.path.join(UPLOAD_DIR, 'private'), '/upload/private/'),
                           (LEGACY_UPLOAD_DIR, '/upload/')):
        if name and os.path.isfile(os.path.join(folder, name)):
            return json_ok('', data=prefix + name)
    return json_err('找不到这张图片（本地版没有云存储，只能预览本机上传的文件）')


@route('/UserAjax/SaveOrderToTaskPostionSeachConfig')
def save_task_position_search():
    p = P()
    db.update('users', uid(), dict(taskPositionSearch=dict(selectUserId=p.get('selectUserId'), key=p.get('key'))))
    return json_ok('已保存')
