# -*- coding: utf-8 -*-
"""输入健壮性与安全边界：上传畸形文件、路径穿越、注入、XSS 渲染。

用法: python tools/input_guard_test.py
"""
import base64
import io
import os
import re
import sys
import urllib.parse

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')
RESULTS = []


def note(label, ok, detail=''):
    print('  %s %-38s %s' % ('OK  ' if ok else '!!  ', label, detail[:70]))
    RESULTS.append((label, ok, detail))


def login():
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='', deviceInfo='guard', isRemember=0), headers=H)
    return c, H


def upload(c, H, raw, name, url='/CommonPermissionAjax/UploadSingleImg'):
    return c.post(url, data={'file': (io.BytesIO(raw), name)}, headers=H, content_type='multipart/form-data')


if __name__ == '__main__':
    db.init()
    c, H = login()
    print('== 上传 =="')
    r = upload(c, H, b'\x89PNG\r\n\x1a\n' + b'0' * (11 * 1024 * 1024), 'big.png')
    j = r.get_json() or {}
    note('超过 10MB 拒绝', j.get('code') == 0, j.get('msg'))

    r = upload(c, H, b'this is not an image at all', 'fake.png')
    j = r.get_json() or {}
    note('文本冒充 png 拒绝', j.get('code') == 0, j.get('msg'))

    r = upload(c, H, b'', 'empty.png')
    j = r.get_json() or {}
    note('空文件拒绝', j.get('code') == 0, j.get('msg'))

    r = upload(c, H, PNG, '../../evil.png')
    j = r.get_json() or {}
    url = (j.get('data') or {}).get('src') or ''
    note('文件名穿越被规范化', j.get('code') == 1 and '..' not in url, url)
    if url.startswith('/upload/'):
        c.post('/CommonPermissionAjax/DelSingleImg', data=dict(url=url), headers=H)

    r = upload(c, H, PNG, 'x.php')
    j = r.get_json() or {}
    note('不支持的扩展名拒绝', j.get('code') == 0, j.get('msg'))

    print('\n== 路径穿越 ==')
    for u in ('/upload/../../app.py', '/upload/..%2F..%2Fapp.py', '/layuiadmin/../../app.py',
              '/static/../app.py', '/upload/%2e%2e/%2e%2e/app.py'):
        r = c.get(u)
        body = r.get_data(as_text=True)
        leaked = ('import os' in body and 'Flask' in body) or 'SUPREME DIRECTIVE' in body
        note('读 %s' % u, not leaked and r.status_code >= 400, 'HTTP %s' % r.status_code)

    print('\n== 注入 ==')
    for kw in ("' OR '1'='1", "1'; DROP TABLE docs;--", "1 UNION SELECT 1,2,3", '../../etc/passwd'):
        r = c.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=5, key=kw), headers=H)
        ok = r.status_code == 200 and r.is_json and isinstance((r.get_json() or {}).get('data'), list)
        note('订单列表 key=%s' % kw[:22], ok, 'HTTP %s' % r.status_code)
    note('数据未被注入破坏（docs 表在）', db.count('orders') > 0, '订单数 %d' % db.count('orders'))

    print('\n== XSS 渲染 ==')
    title = '<script>alert(1)</script>'
    r = c.post('/SystemAjax/SavePublicNew', data=dict(id=0, title=title, newsType=10,
                                                      conetnt='<p>正文<img src=x onerror=alert(2)></p>', contentTxt='xss'), headers=H)
    j = r.get_json() or {}
    nid = None
    if j.get('code', 0) > 0:
        row = db.first('mp_news', lambda x: x.get('title') == title)
        nid = row['id'] if row else None
    if nid:
        page = c.get('/Public/News?id=%s' % nid).get_data(as_text=True)
        note('文章页标题被转义', '<script>alert(1)</script>' not in page, '原文出现则未转义')
        j2 = (c.get('/api/client/news/detail?id=%s' % nid).get_json() or {})
        note('客户端接口原样返回（前端需转义）', '<script>' in ((j2.get('data') or {}).get('title') or ''), 'JSON 里返回原文属正常，前端渲染需注意')
        db.delete('mp_news', nid)

    print('\n== 未登录访问私有资源 ==')
    r = c.post('/OrderAjax/UploadOrderPic', data={'file': (io.BytesIO(PNG), 'p.png'), 'orderId': ''}, headers=H)
    pub = c.get('/upload/public/' + os.path.basename(url or 'none'))
    print('  （私有目录需要登录态，跳过具体文件）')

    print('\n== 汇总 ==')
    bad = [x for x in RESULTS if not x[1]]
    print('检查 %d 项，需要处理 %d 项' % (len(RESULTS), len(bad)))
    for label, _, detail in bad:
        print('  · %s  %s' % (label, detail))
