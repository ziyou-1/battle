# -*- coding: utf-8 -*-
"""短信业务：发送记录、模板、群发、短信设置（本地版不真正外发，只记录）"""
import json, datetime
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .order import dec

SMS_TYPES = [(15, '录单时'), (16, '改代练中时'), (17, '代练接手时'), (18, '改代验收时'), (19, '改已完成时'), (20, '改问题单时'), (21, '改已暂停时'), (22, '改异常中时'),
             (23, '指派后通知打手'), (24, '改已暂停通知打手'), (100009, '团1开打时短信'), (100010, '团2开打时短信')]
DEFAULT_CONTENT = {15: '【{公司}】您的订单{单号}已录入系统，我们会尽快安排代练。', 16: '【{公司}】您的订单{单号}已开始代练。', 17: '【{公司}】您的订单{单号}已有代练接手。',
                   18: '【{公司}】您的订单{单号}已完成，等待验收。', 19: '【{公司}】您的订单{单号}已完成，感谢支持！', 20: '【{公司}】您的订单{单号}出现问题，请联系客服。',
                   21: '【{公司}】您的订单{单号}已暂停。', 22: '【{公司}】您的订单{单号}出现异常，请联系客服。', 23: '【{公司}】你有新的订单{单号}被指派，请及时上号。',
                   24: '【{公司}】订单{单号}已暂停，请停止操作。', 100009: '【{公司}】团1即将开打，请准时上线。', 100010: '【{公司}】团2即将开打，请准时上线。'}


def _settings(game):
    rows = db.find('sms_settings', lambda r: r.get('gameName') == game)
    if not rows:
        for t, title in SMS_TYPES:
            rows.append(db.insert('sms_settings', dict(gameName=game, SmsType=t, SmsTitle=title, SmsContent=DEFAULT_CONTENT.get(t, ''), SmsSwicth='N', SelectTbSwicth='N',
                                                       SendOpport=(30 if t in (100009, 100010) else 0))))
    return sorted(rows, key=lambda r: r['SmsType'])


@route('/SmsAjax/GetSmsSettingMangeList')
def sms_setting_list():
    p = P()
    game = p.get('gameName') or '全部游戏'
    gm = None
    try:
        gm = db.get('games', int(game))
    except (TypeError, ValueError):
        pass
    if gm:
        game = gm['gameName']
    rows = _settings(game)
    return table([dict(r, id=r['id'], SmsSetting_Id=r['id'], SelectTbSwicth=r.get('SelectTbSwicth') or r.get('asnyTbSms') or 'N', SendOpport=r.get('SendOpport') or 0) for r in rows])


@route('/SmsAjax/SaveModitySmsContent')
def sms_save_content():
    p = P()
    r = db.get('sms_settings', p.int('id'))
    if not r:
        return json_err('记录不存在')
    db.update('sms_settings', r['id'], dict(SmsContent=p.get('content'), SelectTbSwicth=p.get('asnyTbSms') or 'N', SendOpport=p.int('sendOpport') or r.get('SendOpport') or 0))
    return json_ok('保存成功')


@route('/SmsAjax/SaveModitySmsSwictht')
def sms_switch():
    r = db.get('sms_settings', P().int('id'))
    if not r:
        return json_err('记录不存在')
    if r.get('SmsSwicth') != 'Y':
        return json_err('短信通道尚未接入，不能开启自动发送')
    db.update('sms_settings', r['id'], dict(SmsSwicth='N'))
    return json_ok('已关闭')


@route('/SmsAjax/SaveModitySmsApplyAllGame')
def sms_apply_all():
    r = db.get('sms_settings', P().int('id'))
    if not r:
        return json_err('记录不存在')
    for g in db.all_('games'):
        for x in _settings(g['gameName']):
            if x['SmsType'] == r['SmsType']:
                db.update('sms_settings', x['id'], dict(SmsContent=r['SmsContent'], SmsSwicth=r['SmsSwicth'], SelectTbSwicth=r.get('SelectTbSwicth', 'N')))
    return json_ok('已应用到全部游戏')


@route('/SystemAjax/SmsSetting')
def sms_setting_save():
    p = P()
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        f = p.all()
    cur = db.setting('sms', {})
    cur.update(f)
    db.set_setting('sms', cur)
    return json_ok('保存成功')


@route('/SystemAjax/OpenSmsSig')
def sms_sig():
    db.set_setting('smsSignature', P().get('signature'))
    return json_ok('签名已提交（本地版不做审核）')


@route('/SmsAjax/GetSmsSendLogList')
def sms_logs():
    p = P()
    rows = db.all_('sms_logs')
    kw = dec(p.get('key') or p.get('moblie'))
    if kw:
        rows = [r for r in rows if db.like(r, ['moblie', 'smsContent'], kw)]
    st, et = dec(p.get('stime') or p.get('sDate')), dec(p.get('etime') or p.get('eDate'))
    if st:
        rows = [r for r in rows if (r.get('sendTime') or '')[:10] >= st[:10]]
    if et:
        rows = [r for r in rows if (r.get('sendTime') or '')[:10] <= et[:10]]
    rows.sort(key=lambda r: r.get('sendTime') or '', reverse=True)
    return paged(rows)


@route('/SmsAjax/GetSmsTemplateList')
def sms_templates():
    p = P()
    rows = db.find('sms_templates', lambda r: db.like(r, ['content', 'tempType', 'tempID'], dec(p.get('key'))), 'createTime')
    return paged(rows)


@route('/SmsAjax/AddSmsTemplate')
def add_sms_template():
    p = P()
    content = p.get('content').strip()
    if not content:
        return json_err('模板内容不能为空')
    db.insert('sms_templates', dict(tempID='T%d' % (1000 + db.count('sms_templates')), content=content, tempType=p.get('smsType') or '通知', reviewSta='待审核', reviewRemark='本地版自动通过'))
    return json_ok('模板已提交')


@route(['/SmsAjax/DelSmsTemplate'])
def del_sms_template():
    db.delete('sms_templates', P().int('id'))
    return json_ok('删除成功')


def _bulk_targets(p):
    rows = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('moblie')]
    g = p.get('gameName')
    if g and g not in ('', '全部游戏'):
        rows = [o for o in rows if o.get('gameName') == g]
    sta = p.get('orderSta')
    if sta:
        rows = [o for o in rows if o.get('orderSta') == sta]
    kf = dec(p.get('customerServiceUserName'))
    if kf:
        rows = [o for o in rows if o.get('kefu') == kf]
    src = dec(p.get('orderSoure'))
    if src:
        rows = [o for o in rows if o.get('orderSoure') == src]
    st, et = dec(p.get('stime')), dec(p.get('etime'))
    if st:
        rows = [o for o in rows if (o.get('createTime') or '')[:10] >= st[:10]]
    if et:
        rows = [o for o in rows if (o.get('createTime') or '')[:10] <= et[:10]]
    return sorted(set(o['moblie'] for o in rows))


@route('/SmsAjax/GetSmsBulkHairMoblieCount')
def bulk_count():
    n = len(_bulk_targets(P()))
    return jsonify(dict(code=n, msg=str(n), data=n))


@route('/SmsAjax/UploadMoblieTxt')
def upload_moblie_txt():
    f = request.files.get('file')
    if not f:
        return json_err('没有文件')
    nums = [x.strip() for x in f.read().decode('utf-8', 'ignore').replace(',', '\n').splitlines() if x.strip()]
    db.set_setting('bulkMobiles:%s' % uid(), nums)
    return json_ok('已读取 %d 个号码' % len(nums), data=len(nums))


@route('/SystemAjax/QSendSms')
def bulk_send():
    p = P()
    content = p.get('smsContent').strip()
    if not content:
        return json_err('短信内容不能为空')
    targets = _bulk_targets(p) if p.get('soure') != 'file' else db.setting('bulkMobiles:%s' % uid(), [])
    for m in targets:
        db.insert('sms_logs', dict(moblie=m, smsContent=content, isSucess='N', sendCount=1, fee=0, Msg='本地版未接入短信通道，仅记录', sendTime=now(), userName=uname()))
    log('短信', '群发短信 %d 条（本地未真正发送）' % len(targets))
    return json_ok('已记录 %d 条群发任务（本地版不会真正发送）' % len(targets))
