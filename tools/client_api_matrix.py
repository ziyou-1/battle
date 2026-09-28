# -*- coding: utf-8 -*-
"""客户端接口矩阵：把 /api/client/* 全部接口在「游客」和「已登录会员」两种身份下跑一遍。

后台做过 144 页 × 6 岗位的遍历，客户端一直只有测试脚本覆盖到的主干。这里补齐：
  · 公开接口：游客必须能拿到数据（不能要求登录）
  · 需要登录的接口：游客必须返回 code=-1（前端据此弹登录），登录后必须成功
  · 任何接口都不允许 500 / 非 JSON

登录态走**真实登录接口**，并且**每个接口用一对全新的 client** —— test_client 的会话
在连续请求间会互相干扰，复用同一个 client 会测出"登录了却说未登录"的假象。

用法: python tools/client_api_matrix.py
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
from werkzeug.security import generate_password_hash  # noqa: E402
import app as appmod  # noqa: E402
import db  # noqa: E402
from api import REG  # noqa: E402

NEEDS_LOGIN = {'/api/client/me', '/api/client/profile', '/api/client/password', '/api/client/orders',
               '/api/client/order/detail', '/api/client/order/message', '/api/client/order/confirm',
               '/api/client/order/cancel', '/api/client/notices', '/api/client/fees', '/api/client/coupons',
               '/api/client/points/exchange', '/api/client/lottery/draw', '/api/client/roles',
               '/api/client/roles/save', '/api/client/roles/del', '/api/client/order/review',
               '/api/client/order/aftersale', '/api/client/aftersales', '/api/client/order/chat',
               '/api/client/invite', '/api/client/close', '/api/client/circle/publish',
               '/api/client/circle/mine', '/api/client/circle/del', '/api/client/circle/refresh',
               '/api/client/contact', '/api/client/order/create'}
WRITE = {'/api/client/roles/save', '/api/client/roles/del', '/api/client/points/exchange',
         '/api/client/lottery/draw', '/api/client/order/review', '/api/client/order/aftersale',
         '/api/client/circle/publish', '/api/client/circle/del', '/api/client/circle/refresh'}
PROBLEMS = []
PHONE = '13900009999'
PWD = 'matrix123456'


def admin_client():
    c = appmod.app.test_client()
    m = re.search(r'name="csrf-token" content="([^"]+)"', c.get('/Login/index.html').get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='', deviceInfo='matrix', isRemember=0), headers=H)
    return c, H


def fresh_guest():
    c = appmod.app.test_client()
    t = (c.get('/api/csrf').get_json() or {}).get('token')
    return c, {'X-CSRF-Token': t}


def fresh_member():
    c = appmod.app.test_client()
    t = (c.get('/api/csrf').get_json() or {}).get('token')
    c.post('/api/client/login', data=dict(phone=PHONE, pwd=PWD), headers={'X-CSRF-Token': t})
    return c, {'X-CSRF-Token': t}


def cleanup_member():
    for r in db.find('customers', lambda x: x.get('phone') == PHONE):
        for coll in ('client_coupons', 'client_notices', 'client_integral_logs'):
            for x in db.find(coll, lambda y, i=r['id']: y.get('customerId') == i):
                db.delete(coll, x['id'])
        db.delete('customers', r['id'])
    db.conn().commit()


def state(r):
    if r.status_code >= 500:
        return 'HTTP %s' % r.status_code
    try:
        jj = r.get_json() or {}
    except Exception:
        return '非JSON'
    if jj.get('code') == -1:
        return '未登录(-1)'
    if r.status_code == 200 and jj.get('code') in (0, 1, -2):
        return 'code=%s' % jj.get('code')
    return 'HTTP %s/code=%s' % (r.status_code, jj.get('code'))


if __name__ == '__main__':
    db.init()
    cleanup_member()
    adm, AH = admin_client()
    j = adm.post('/api/CustomerApi/CreateModifyCustomer', data=dict(hid=0, bossName='矩阵测试会员', phone=PHONE,
                                                                    platName='测试', initAmount=0, giftAmount=0), headers=AH).get_json() or {}
    cid = j.get('data')
    db.update('customers', cid, dict(pwdHash=generate_password_hash(PWD)))
    db.conn().commit()
    _, _ = fresh_member()

    urls = sorted(u for u in REG if u.startswith('/api/client/'))
    print('客户端接口共 %d 个（每个接口用一对全新会话，避免会话串味）\n' % len(urls))
    print('%-30s %-14s %-14s %s' % ('接口', '游客', '已登录', ''))
    print('-' * 72)
    for u in urls:
        g, GH = fresh_guest()
        a, AH2 = fresh_member()
        if u in WRITE:
            gr = g.post(u, data={}, headers=GH)
            mr = a.post(u, data={}, headers=AH2)
        else:
            gr = g.get(u, headers=GH)
            mr = a.get(u, headers=AH2)
        gs, ms = state(gr), state(mr)
        need = u in NEEDS_LOGIN
        bad = []
        if gs.startswith('HTTP') or gs == '非JSON':
            bad.append('游客 500/非JSON')
        if ms.startswith('HTTP') or ms == '非JSON':
            bad.append('登录后 500/非JSON')
        if need and not gs.startswith('未登录'):
            bad.append('该要登录的接口游客也能用')
        if need and ms.startswith('未登录'):
            bad.append('登录后仍说未登录')
        if not need and gs.startswith('未登录'):
            bad.append('公开接口却要求登录')
        if bad:
            PROBLEMS.append((u, '; '.join(bad), gs, ms))
        print('%-30s %-14s %-14s %s' % (u.replace('/api/client/', ''), gs, ms, '!' if bad else ''))

    cleanup_member()
    print('\n== 汇总 ==')
    print('检查 %d 个接口，异常 %d 个' % (len(urls), len(PROBLEMS)))
    for u, why, gs, ms in PROBLEMS:
        print('  · %-28s %s（游客 %s / 登录 %s）' % (u.replace('/api/client/', ''), why, gs, ms))
