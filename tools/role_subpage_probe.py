# -*- coding: utf-8 -*-
"""分角色子页可达性：拿各角色自己的订单，逐个打开订单相关弹窗子页，看是不是真能打开。

用法: python tools/role_subpage_probe.py
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

SUBPAGES = ['/order/orderview?orderId=%s', '/order/assignation?orderId=%s', '/order/sendsms?orderId=%s',
            '/order/uploadpic?orderId=%s', '/emp/changerecpricebyorder?orderId=%s', '/group/ordergroup?orderId=%s',
            '/order/orderremark?orderId=%s', '/order/setordersta?orderId=%s']
ROLES = [('打手', 'ds星尘', '123456'), ('客服', 'kf小晴', '123456'), ('财务', 'cw01', '123456'), ('团长', 'tz01', '123456')]


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='sub', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else None)


if __name__ == '__main__':
    db.init()
    dasher = db.first('users', lambda x: x.get('loginAcc') == 'ds星尘')
    kefu = db.first('users', lambda x: x.get('loginAcc') == 'kf小晴')
    mine = [o for o in db.all_('orders') if o.get('recMan') == dasher['id']]
    kefu_mine = [o for o in db.all_('orders') if o.get('kefuId') == kefu['id']]
    print('ds星尘(id=%s) 名下的订单：%d 条' % (dasher['id'], len(mine)))
    print('kf小晴(id=%s) 经手的订单：%d 条' % (kefu['id'], len(kefu_mine)))
    mine_oid = mine[0]['orderId'] if mine else None
    kefu_oid = kefu_mine[0]['orderId'] if kefu_mine else None
    other_oid = (db.all_('orders') or [{}])[0].get('orderId')
    print('打手自己的单=%s  客服自己的单=%s  他人的单=%s\n' % (mine_oid, kefu_oid, other_oid))

    for role, acc, pwd in ROLES:
        c, H, code = login(acc, pwd)
        print('=== %s (%s) 登录=%s ===' % (role, acc, code))
        if code != 1:
            continue
        target = mine_oid if role == '打手' else kefu_oid
        for tpl in SUBPAGES:
            url = tpl % (target or other_oid)
            r = c.get(url, headers=H)
            ct = (r.headers.get('Content-Type') or '').split(';')[0]
            print('   自己的单 %-44s HTTP %-4s %s' % (url, r.status_code, ct))
        if role == '打手':
            url = '/order/orderview?orderId=%s' % other_oid
            r = c.get(url, headers=H)
            print('   别人的单 %-44s HTTP %-4s %s' % (url, r.status_code, (r.headers.get('Content-Type') or '').split(';')[0]))
        print()
