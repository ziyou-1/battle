"""Enterprise WeChat group bot delivery. Only the official webhook host is allowed."""
import http.client
import json
import re
from urllib.parse import parse_qs, urlsplit

import db


HOST = 'qyapi.weixin.qq.com'
PATH = '/cgi-bin/webhook/send'


def validate_webhook(url):
    parsed = urlsplit((url or '').strip())
    values = parse_qs(parsed.query, keep_blank_values=True)
    if (parsed.scheme != 'https' or parsed.hostname != HOST or parsed.port is not None
            or parsed.username or parsed.password or parsed.path != PATH or parsed.fragment
            or set(values) != {'key'} or len(values['key']) != 1
            or not re.fullmatch(r'[A-Za-z0-9-]{20,100}', values['key'][0])):
        raise ValueError('请填写企业微信群机器人的官方 HTTPS Webhook 地址')
    return 'https://' + HOST + PATH + '?key=' + values['key'][0]


def _clean(value, limit=120):
    return re.sub(r'\s+', ' ', str(value or '')).strip()[:limit]


def order_message(order, event, remark=''):
    title = '新订单' if event == 'created' else '订单状态变更'
    parts = [title, '订单号：' + _clean(order.get('orderIdView') or order.get('orderId')),
             '游戏：' + _clean(order.get('gameName')),
             '项目：' + _clean(order.get('project'), 180)]
    if event != 'created':
        parts.append('状态：' + _clean(order.get('orderSta')))
    if remark:
        parts.append('说明：' + _clean(remark, 100))
    return '\n'.join(parts)


def send(webhook, content, *, markdown=False, mention_all=False):
    url = validate_webhook(webhook)
    if markdown:
        payload = {'msgtype': 'markdown', 'markdown': {'content': content + ('\n<@all>' if mention_all else '')}}
    else:
        payload = {'msgtype': 'text', 'text': {'content': content}}
        if mention_all:
            payload['text']['mentioned_list'] = ['@all']
    conn = http.client.HTTPSConnection(HOST, timeout=5)
    try:
        conn.request('POST', urlsplit(url).path + '?' + urlsplit(url).query,
                     body=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                     headers={'Content-Type': 'application/json; charset=utf-8'})
        response = conn.getresponse()
        raw = response.read(8192)
        if response.status != 200:
            raise RuntimeError('企业微信返回 HTTP %s' % response.status)
        result = json.loads(raw.decode('utf-8'))
        if result.get('errcode') != 0:
            raise RuntimeError('企业微信返回错误码 %s：%s' % (result.get('errcode'),
                                                     _clean(result.get('errmsg'), 120)))
    finally:
        conn.close()


def publish_order(order, event, remark=''):
    """Send one notification per applicable rule; delivery errors never change the order."""
    if event not in ('created', 'status'):
        return
    for rule in db.all_('push_group_msg'):
        if rule.get('switchStatus') != 'Y' or not rule.get('webhookUrl'):
            continue
        games = [name.strip() for name in str(rule.get('gameName') or '').split(',')]
        if order.get('gameName') not in games:
            continue
        occasion = int(rule.get('replyOcc') or 0)
        if event == 'created' and occasion not in (0, 10):
            continue
        if event == 'status' and occasion != 30:
            continue
        event_key = '%s:%s:%s:%s' % (order['id'], event,
                                      order.get('statusEventId', 'initial') if event == 'status' else 'initial',
                                      rule['id'])
        if db.first('group_deliveries', lambda d: d.get('eventKey') == event_key):
            continue
        content = order_message(order, event, remark)
        if rule.get('remark'):
            content += '\n备注：' + _clean(rule['remark'], 100)
        delivery = db.insert('group_deliveries', {'eventKey': event_key, 'orderId': order['id'],
                                                  'ruleId': rule['id'], 'event': event,
                                                  'content': content, 'attempts': 1,
                                                  'status': 'sending', 'error': ''})
        outcome, error = 'sent', ''
        try:
            send(rule['webhookUrl'], content, markdown=int(rule.get('msgType') or 0) == 0,
                 mention_all=int(rule.get('callAll') or 10) == 0)
        except (OSError, ValueError, RuntimeError, http.client.HTTPException) as exc:
            outcome, error = 'failed', _clean(exc, 180)
        db.update('group_deliveries', delivery['id'], {'status': outcome, 'error': error})


def retry_delivery(delivery):
    if not delivery or delivery.get('status') != 'failed':
        raise ValueError('仅能重试发送失败的记录')
    rule = db.get('push_group_msg', delivery.get('ruleId'))
    if not rule or rule.get('switchStatus') != 'Y' or not rule.get('webhookUrl'):
        raise ValueError('请先启用并配置对应的企业微信群规则')
    db.update('group_deliveries', delivery['id'], {'status': 'sending',
                                                  'attempts': int(delivery.get('attempts') or 1) + 1})
    try:
        send(rule['webhookUrl'], delivery['content'], markdown=int(rule.get('msgType') or 0) == 0,
             mention_all=int(rule.get('callAll') or 10) == 0)
    except (OSError, ValueError, RuntimeError, http.client.HTTPException) as exc:
        error = _clean(exc, 180)
        db.update('group_deliveries', delivery['id'], {'status': 'failed', 'error': error})
        raise RuntimeError(error) from exc
    db.update('group_deliveries', delivery['id'], {'status': 'sent', 'error': ''})
