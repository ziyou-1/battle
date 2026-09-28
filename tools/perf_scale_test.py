# -*- coding: utf-8 -*-
"""数据量放大后的性能：临时插入 N 条订单，看关键接口会不会随数据量线性变慢。

跑完会把自己造的订单全部删掉（只删带 PERFTEST 前缀的，不碰演示数据）。
用法: python tools/perf_scale_test.py [条数]
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

N = int(sys.argv[1]) if len(sys.argv) > 1 else 500
PREFIX = 'PERFTEST'


def login(acc, pwd):
    c = appmod.app.test_client()
    m = re.search(r'name="csrf-token" content="([^"]+)"', c.get('/Login/index.html').get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='scale', isRemember=0), headers=H)
    return c, H


def make_orders(n):
    now = db.now_str()
    for i in range(n):
        db.insert('orders', dict(orderId='%s%08d' % (PREFIX, i), orderIdView='%s%06d' % (PREFIX, i),
                                 gameId=1, gameName='扩容测试游戏', project='扩容测试项目', orderType='段位代练',
                                 orderSta='未分配', price=100 + i % 50, recFee=60, netReceipts=str(90 + i % 50),
                                 isDel='N', isLock='N', isSettStatus='未结算', labels=[], imgs=[], days=1, hours=0,
                                 bussType=1, orderSoure='扩容测试', roleName='扩容角色', gameArea='电信区',
                                 gameServer='', gameJob='', gameGroup='', kefu='扩容', kefuId=9, recMan=0,
                                 createTime=now, completeTime=''))
    db.conn().commit()


def clean():
    for o in db.find('orders', lambda r: str(r.get('orderId', '')).startswith(PREFIX)):
        db.delete('orders', o['id'])
    db.conn().commit()


def bench(label, fn, rounds=10):
    ts = []
    for _ in range(rounds):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    ts.sort()
    print('  %-30s P50 %8.1f ms   P95 %8.1f ms' % (label, statistics.median(ts), ts[int(len(ts) * 0.95) - 1]))


if __name__ == '__main__':
    db.init()
    clean()
    base = db.count('orders')
    c, H = login('1234567890', '394607')
    print('先量一次基线（演示数据 %d 条订单）' % base)
    bench('订单列表 20 条', lambda: c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=20), headers=H))
    bench('订单列表 100 条', lambda: c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=100), headers=H))
    bench('后台首页', lambda: c.get('/', headers=H))
    bench('报酬明细', lambda: c.get('/EmpAjax/GetEmpList?page=1&limit=50', headers=H))
    bench('导出 xlsx', lambda: c.get('/Emp/ExportEmp?page=1&limit=50', headers=H), rounds=5)

    print('\n插入 %d 条订单（合计 %d 条）后重测' % (N, base + N))
    t0 = time.perf_counter()
    make_orders(N)
    print('  插入耗时 %.1f ms（平均 %.2f ms/条）' % ((time.perf_counter() - t0) * 1000, (time.perf_counter() - t0) * 1000 / N))
    bench('订单列表 20 条', lambda: c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=20), headers=H))
    bench('订单列表 100 条', lambda: c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=100), headers=H))
    bench('后台首页', lambda: c.get('/', headers=H))
    bench('报酬明细', lambda: c.get('/EmpAjax/GetEmpList?page=1&limit=50', headers=H))
    bench('导出 xlsx', lambda: c.get('/Emp/ExportEmp?page=1&limit=50', headers=H), rounds=5)
    bench('客户端首页', lambda: c.get('/api/client/home', headers=H))

    clean()
    print('\n已清理扩容测试数据，订单数回到 %d' % db.count('orders'))
