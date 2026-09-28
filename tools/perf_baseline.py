# -*- coding: utf-8 -*-
"""性能基线：关键接口在本机的响应时间（P50 / P95 / 最大）。

本地演示环境跑出来的数字只用来横向比较"哪个接口慢"，不能当容量结论。
用法: python tools/perf_baseline.py [每项轮数]
"""
import os
import re
import statistics
import sys
import time

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

ROUNDS = int(sys.argv[1]) if len(sys.argv) > 1 else 30


def login(acc, pwd):
    c = appmod.app.test_client()
    m = re.search(r'name="csrf-token" content="([^"]+)"', c.get('/Login/index.html').get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='perf', isRemember=0), headers=H)
    return c, H


def bench(label, fn, rounds=ROUNDS):
    times = []
    for _ in range(rounds):
        t0 = time.perf_counter()
        fn()
        times.append((time.perf_counter() - t0) * 1000)
    times.sort()
    p50 = statistics.median(times)
    p95 = times[int(len(times) * 0.95) - 1]
    print('%-34s P50 %7.1f ms   P95 %7.1f ms   最大 %7.1f ms' % (label, p50, p95, times[-1]))
    return p50


if __name__ == '__main__':
    db.init()
    c, H = login('1234567890', '394607')
    oid = (db.all_('orders') or [{}])[0].get('orderId')
    print('每项 %d 轮\n' % ROUNDS)
    bench('后台登录', lambda: login('1234567890', '394607'))
    bench('后台首页 index', lambda: c.get('/', headers=H))
    bench('订单列表页 /Order/orderlist', lambda: c.get('/Order/orderlist', headers=H))
    bench('订单详情页 /Order/OrderView', lambda: c.get('/Order/OrderView?orderId=%s' % oid, headers=H))
    bench('订单列表接口 20 条', lambda: c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=20), headers=H))
    bench('会员列表接口', lambda: c.get('/api/CustomerApi/GetCustomerList?page=1&limit=20', headers=H))
    bench('报酬明细接口', lambda: c.get('/EmpAjax/GetEmpList?page=1&limit=20', headers=H))
    bench('结算记录接口', lambda: c.get('/EmpAjax/GetBillSummaryList?page=1&limit=20', headers=H))
    bench('结算导出 xlsx', lambda: c.get('/Emp/ExportEmp?page=1&limit=50', headers=H), rounds=max(5, ROUNDS // 6))
    bench('客户端首页 /api/client/home', lambda: c.get('/api/client/home', headers=H))
    bench('客户端商品列表', lambda: c.get('/api/client/shop?page=1&limit=20', headers=H))
    bench('静态资源 layui.js', lambda: c.get('/layuiadmin/layui/layui.js', headers=H))
    bench('静态资源 admin.css', lambda: c.get('/layuiadmin/style/admin.css', headers=H))
    print('\n订单总数 %d，会员 %d，报酬记录 %d' % (db.count('orders'), db.count('customers'), db.count('emp_pay')))
