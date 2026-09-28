# -*- coding: utf-8 -*-
"""前后端 URL 差分：找出「前端脚本/页面会去请求、但后端没有」的地址。

页面 200、静态资源 200，不代表交互正常：按钮按下后请求的那个 URL 若不存在，
前端拿到的就是 404 —— 用户看到「找不到页面 / 请求视图文件异常，状态：404」。

合法目标有三类，缺一不可：
  1) 后端接口注册表 api.REG
  2) 服务端页面模板 app.TEMPLATES（走 app.page 路由，不进 REG）
  3) layui 模块（/lib/xxx、/modules/xxx，映射到 static 下的 js 文件）
除此之外的前端引用都是「点了就 404」的嫌疑点。

用法: python tools/diag_links.py           # 只做静态差分
      python tools/diag_links.py --hit     # 再对每个可疑 URL 发一次 GET
"""
import collections
import glob
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
from api import REG  # noqa: E402
import app as appmod  # noqa: E402
import db  # noqa: E402

db.init()

PATH_RE = re.compile(r'''["'](/[A-Za-z][A-Za-z0-9_]*(?:/[A-Za-z0-9_\-]+)+)["']''')
SKIP_EXT = ('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2',
            '.ttf', '.eot', '.json', '.html', '.mp3', '.mp4', '.webp', '.bmp', '.scss', '.map')

srcs = []
for pat in ('static/JS2019/**/*.js', 'templates/**/*.html', 'static/app/*.js',
            'static/CSS/**/*.css', 'static/layuiadmin/modules/*.js'):
    srcs += glob.glob(os.path.join(BASE, pat), recursive=True)
srcs = [p for p in srcs if '\\ref\\' not in p and '/ref/' not in p]

hits = collections.defaultdict(set)
for fp in srcs:
    try:
        text = open(fp, encoding='utf-8', errors='ignore').read()
    except OSError:
        continue
    for u in PATH_RE.findall(text):
        if u.lower().endswith(SKIP_EXT):
            continue
        hits[u].add(os.path.relpath(fp, BASE).replace('\\', '/'))

reg = {k.lower() for k in REG}
pages = {k.lower().strip('/') for k in appmod.TEMPLATES}
# app.py 里硬编码的固定路由（既不在 REG，也不是模板页面）
FIXED = {'/login/loginout', '/api/csrf', '/notfound.html', '/media', '/upload', '/app'}

miss, lib_miss, spa = [], [], []
for u, where in hits.items():
    ul = u.lower().rstrip('/')
    where = sorted(where)
    if ul.startswith('/lib/') or ul.startswith('/modules/'):
        mod = ul.rsplit('/', 1)[-1]
        cands = [os.path.join(BASE, 'static', 'layuiadmin', mod + '.js'),
                 os.path.join(BASE, 'static', 'layuiadmin', ul.lstrip('/') + '.js'),
                 os.path.join(BASE, 'static', 'layuiadmin', 'lib', mod + '.js'),
                 os.path.join(BASE, 'static', 'layuiadmin', 'modules', mod + '.js'),
                 os.path.join(BASE, 'static', 'layuiadmin', ul.replace('/lib/', '/lib/').lstrip('/') + '.js'),
                 os.path.join(BASE, 'static', mod + '.js')]
        if not any(os.path.isfile(c) for c in cands):
            lib_miss.append((u, where, cands))
        continue
    if all(w.startswith('static/app/') for w in where):
        spa.append(u)           # 客户端单页的内部路由，不是后端地址
        continue
    bare = ul.strip('/')
    ok = ul in reg or (ul + '/') in reg or ul in FIXED or bare in pages or \
        ul.startswith('/platformredirect') or \
        (bare[:-5] in pages if bare.endswith('.html') else False)
    if not ok:
        miss.append((u, where))

miss.sort(key=lambda x: (-len(x[1]), x[0]))
lib_miss.sort(key=lambda x: (-len(x[1]), x[0]))
print('扫描 %d 个文件 / 前端引用后端路径 %d 个：接口+页面命中 %d，未注册 %d，layui 模块缺失 %d，SPA 内部路由 %d\n' %
      (len(srcs), len(hits), len(hits) - len(miss) - len(lib_miss) - len(spa), len(miss), len(lib_miss), len(spa)))

print('=== 后端未注册（点了就 404）===')
for u, where in miss:
    print('  [MISS] %-46s ← %s' % (u, ', '.join(where[:3]) + (' 等%d处' % len(where) if len(where) > 3 else '')))
print('\n=== layui 模块文件缺失（layui.use 会哑掉）===')
for u, where, cands in lib_miss:
    print('  [LIB ] %-46s ← %s' % (u, ', '.join(where[:3])))

if '--hit' in sys.argv:
    c = appmod.app.test_client()
    _r = c.get('/Login/index.html')
    _m = re.search(r'name="csrf-token" content="([^"]+)"', _r.get_data(as_text=True))
    H = {'X-CSRF-Token': _m.group(1)} if _m else {}
    c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='',
                                     deviceInfo='probe', isRemember=0), headers=H)
    print('\n=== 实际 GET 结果（含页面式目标）===')
    for u, where in miss:
        r = c.get(u, headers=H)
        ct = (r.headers.get('Content-Type') or '').split(';')[0]
        tag = '[RED]  ' if (r.status_code != 200 or ct == 'application/json') else '[ok]   '
        print('%s %-46s HTTP %-4s %s' % (tag, u, r.status_code, ct))
