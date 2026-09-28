# -*- coding: utf-8 -*-
"""并发压测：多线程同时打关键接口，看 QPS、延迟分位和错误率。

只打读接口（列表/首页/静态资源）与一次登录，不做写操作，不会改数据。
用法: python tools/concurrency_test.py [总请求数] [并发数]
"""
import concurrent.futures as cf
import http.cookiejar
import re
import statistics
import sys
import time
import urllib.parse
import urllib.request

BASE = 'http://127.0.0.1:8090'
TOTAL = int(sys.argv[1]) if len(sys.argv) > 1 else 200
WORKERS = int(sys.argv[2]) if len(sys.argv) > 2 else 20


def opener_with_login():
    cj = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    html = op.open(BASE + '/Login/index.html', timeout=20).read().decode('utf-8', 'ignore')
    m = re.search(r'name="csrf-token" content="([^"]+)"', html)
    token = m.group(1) if m else ''
    data = urllib.parse.urlencode(dict(acc='1234567890', pwd='394607', code='', deviceInfo='bench', isRemember=0)).encode()
    req = urllib.request.Request(BASE + '/Login/Login', data=data, headers={'X-CSRF-Token': token})
    op.open(req, timeout=20).read()
    return op, token


def hit(op, token, path, data=None):
    # 注意：GET 也要带 X-CSRF-Token —— 注册在接口表里的 GET 路径同样会过 CSRF 校验，
    # 否则压测结果里会清一色 403，看着像接口坏了。
    if data is not None:
        req = urllib.request.Request(BASE + path, data=urllib.parse.urlencode(data).encode(),
                                     headers={'X-CSRF-Token': token})
        return op.open(req, timeout=30).read()
    req = urllib.request.Request(BASE + path, headers={'X-CSRF-Token': token})
    return op.open(req, timeout=30).read()


def bench(label, op, token, path, data=None, total=TOTAL, workers=WORKERS):
    def one(_):
        t0 = time.perf_counter()
        try:
            hit(op, token, path, data)
            return (time.perf_counter() - t0) * 1000, None
        except Exception as exc:
            return (time.perf_counter() - t0) * 1000, str(exc)[:60]

    t0 = time.perf_counter()
    with cf.ThreadPoolExecutor(max_workers=workers) as pool:
        out = list(pool.map(one, range(total)))
    wall = time.perf_counter() - t0
    times = sorted(t for t, _ in out)
    errs = [e for _, e in out if e]
    print('%-30s %6.1f QPS  P50 %6.1f ms  P95 %6.1f ms  错误 %d/%d' % (
        label, total / wall, statistics.median(times), times[int(len(times) * 0.95) - 1], len(errs), total))
    for e in errs[:3]:
        print('     错误样例：%s' % e)


if __name__ == '__main__':
    print('目标 %s，总请求 %d，并发 %d\n' % (BASE, TOTAL, WORKERS))
    op, token = opener_with_login()
    print('并发打读接口（共享同一个登录会话）：')
    bench('订单列表接口', op, token, '/OrderAjax/GetOrderList', dict(page=1, limit=20))
    bench('后台首页', op, token, '/')
    bench('订单管理页', op, token, '/Order/orderlist')
    bench('客户端首页接口', op, token, '/api/client/home')
    bench('静态资源 layui.css', op, token, '/layuiadmin/layui/css/layui.css')
    print('\n登录接口（每次都是真实的 pbkdf2 校验，故意打重一点）：')
    bench('登录 POST', op, token, '/Login/Login',
          dict(acc='1234567890', pwd='394607', code='', deviceInfo='bench', isRemember=0),
          total=max(20, TOTAL // 5), workers=max(4, WORKERS // 4))
