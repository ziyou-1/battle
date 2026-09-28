# -*- coding: utf-8 -*-
"""静态资源引用的大小写核对。

Windows 开发不区分大小写，Linux 部署区分 —— 模板里写 /JS2019/Common.js、
磁盘上却是 common.js，本地一切正常，一上服务器就 404。这个脚本做逐段的精确
字符串比对（在 Windows 上同样有效），把这类引用找出来。

用法: python tools/case_check.py
"""
import glob
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.join(BASE, 'static')
REF = re.compile(r'''["'(](/[A-Za-z][^"'<>)\s]*?\.(?:js|css|png|jpe?g|gif|svg|ico|woff2?|ttf|eot|json|html|mp3|mp4|webp))(?:\?[^"']*)?["')]''')
SOURCES = ['templates/**/*.html', 'static/JS2019/**/*.js', 'static/app/*.js', 'static/CSS/*.css',
           'static/layuiadmin/modules/*.js']


def resolve(url):
    """返回 (真实路径, 是否大小写完全一致, 建议的正确写法)"""
    parts = url.lstrip('/').split('/')
    cur = STATIC
    fixed = []
    for part in parts:
        if not os.path.isdir(cur):
            return None, False, None
        entries = os.listdir(cur)
        if part in entries:
            cur = os.path.join(cur, part)
            fixed.append(part)
            continue
        hit = next((e for e in entries if e.lower() == part.lower()), None)
        if hit:
            fixed.append(hit)
            return os.path.join(cur, hit), False, '/' + '/'.join(fixed)
        return None, False, None
    return cur, True, url


if __name__ == '__main__':
    files = []
    for pat in SOURCES:
        files += glob.glob(os.path.join(BASE, pat), recursive=True)
    refs = {}
    for fp in files:
        try:
            text = open(fp, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        for url in REF.findall(text):
            refs.setdefault(url, set()).add(os.path.relpath(fp, BASE).replace('\\', '/'))

    case_bad, missing, ok = [], [], 0
    for url, where in refs.items():
        if url.startswith(('/api/', '/upload/', '/PlatformRedirect')) or url.endswith('.html'):
            continue
        path, exact, fixed = resolve(url)
        if path is None:
            missing.append((url, sorted(where)))
        elif not exact:
            case_bad.append((url, fixed, sorted(where)))
        else:
            ok += 1

    print('检查引用 %d 个：大小写一致 %d，大小写不一致 %d，找不到文件 %d\n' % (len(refs), ok, len(case_bad), len(missing)))
    if case_bad:
        print('=== 大小写不一致（Linux 上会 404）===')
        for url, fixed, where in sorted(case_bad):
            print('  %-40s 实际是 %-40s ← %s' % (url, fixed, ', '.join(where[:3])))
    if missing:
        print('\n=== 找不到文件 ===')
        for url, where in sorted(missing)[:30]:
            print('  %-52s ← %s' % (url, ', '.join(where[:2])))
