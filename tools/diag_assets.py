# -*- coding: utf-8 -*-
"""静态资源探针：找出「页面引用了、服务器上没有」的 JS / CSS / 图片。

服务端渲染的页面本身是 200，所以冒烟测试看不见；而前端脚本 404 之后，
按钮点了没反应、列表一直转圈、弹窗空白 —— 用户看到的就是「找不到页面」。

用法: python tools/diag_assets.py
"""
import collections
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod, db

db.init()
c = appmod.app.test_client()
_r0 = c.get('/Login/index.html')
_m = re.search(r'name="csrf-token" content="([^"]+)"', _r0.get_data(as_text=True))
H = {'X-CSRF-Token': _m.group(1)} if _m else {}
c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='',
                                 deviceInfo='probe', isRemember=0), headers=H)

_orders = db.all_('orders') or [{}]
_oid = _orders[0].get('orderId')
QUERY = {'order/orderview': '?orderId=%s' % _oid, 'order/assignation': '?orderId=%s' % _oid,
         'emp/changerecpricebyorder': '?orderId=%s' % _oid, 'order/sendsms': '?orderId=%s' % _oid,
         'order/uploadpic': '?orderId=%s' % _oid, 'order/addorder': '?orderID=%s' % _oid,
         'order/setordersta': '?orderId=%s' % _oid, 'order/orderremark': '?orderId=%s' % _oid,
         'group/newordertogroup': '?orderId=%s' % _oid, 'group/ordergroup': '?orderId=%s' % _oid}

REF = re.compile(
    r'''(?:src|href|data-src)\s*=\s*["'](/[^"'>\s]+?\.(?:js|css|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|json))(?:\?[^"']*)?["']''',
    re.I)

refs = collections.defaultdict(set)
pages = sorted(k for k in appmod.TEMPLATES if k != 'noauth')
for k in pages:
    if k.startswith('login/') or k in ('notfound', 'index'):
        continue
    url = '/' + k + QUERY.get(k, '')
    resp = c.get(url, headers=H)
    html = resp.get_data(as_text=False).decode('utf-8', 'ignore')
    for asset in REF.findall(html):
        refs[asset].add(url)

print('页面数 %d，引用到的本地静态资源 %d 个' % (len(pages), len(refs)))
bad = []
for asset, srcs in sorted(refs.items()):
    resp = c.get(asset, headers=H)
    ctype = (resp.headers.get('Content-Type') or '').split(';')[0]
    if resp.status_code != 200 or ctype == 'application/json':
        bad.append((asset, resp.status_code, ctype, sorted(srcs)))

print('\n=== 404 / 非静态资源（前端会哑掉）: %d ===' % len(bad))
for asset, sc, ctype, srcs in bad:
    print('  [RED] %-52s HTTP %-4s %-18s  ← %s%s' % (asset, sc, ctype,
          ', '.join(srcs[:2]), (' 等%d页' % len(srcs)) if len(srcs) > 2 else ''))
print('\n=== 正常 %d ===' % (len(refs) - len(bad)))
