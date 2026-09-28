# -*- coding: utf-8 -*-
"""把原站残留的品牌字样与「跳回原站」的链接换成本地版的说法（幂等，可重复跑）。

作用范围：api/*.py 与 static/JS2019/**/*.js —— 模板里的品牌替换由
tools/patch_templates.py 的 21j 步骤负责（模板会被重建，规则必须写在那里）。

跳转链接策略：www / user / chat 三个域名的链接会被改成本机的 /PlatformRedirect，
点开是本机提示页，而不是跳到原站；资源域名（oss*.jidanpu.com）不动，否则现成的
图片会变成破图。

用法: python tools/patch_brand_text.py
"""
import glob
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TEXT_MAP = [
    ('鸡蛋铺余额充值', '平台余额充值'),
    ('鸡蛋铺官方账户', '平台官方账户'),
    ('鸡蛋铺官方', '平台官方'),
    ('鸡蛋铺账户', '平台账户'),
    ('鸡蛋铺商铺订单', '平台商铺订单'),
    ('鸡蛋铺商铺', '平台商铺'),
    ('鸡蛋铺交易平台', '第三方交易平台'),
    ('鸡蛋铺管理系统', '工作室管理系统'),
    ('鸡蛋铺群邀请', '平台群邀请'),
    ('鸡蛋铺账号', '平台账号'),
    ('鸡蛋铺导出的', '平台导出的'),
    ('鸡蛋铺', '平台'),
    ('素晴一号', '云序工作室'),
    ('素晴网游', '云序工作室'),
    ('素晴网络', '云序工作室'),
    ('素晴', '云序工作室'),
]
HOST_RE = re.compile(r'https?://(?:www|user|chat)\.jidanpu\.com')


def convert(text):
    for old, new in TEXT_MAP:
        text = text.replace(old, new)
    return HOST_RE.sub('/PlatformRedirect', text)


if __name__ == '__main__':
    files = []
    for pat in ('api/*.py', 'static/JS2019/**/*.js'):
        files += glob.glob(os.path.join(BASE, pat), recursive=True)
    changed_files = changed_hits = 0
    for fp in files:
        try:
            src = open(fp, encoding='utf-8').read()
        except (OSError, UnicodeDecodeError):
            continue
        out = convert(src)
        if out != src:
            open(fp, 'w', encoding='utf-8', newline='').write(out)
            changed_files += 1
            changed_hits += sum(src.count(a) for a in
                                [old for old, _ in TEXT_MAP] + ['jidanpu.com'])
    print('改动文件 %d 个，命中 %d 处' % (changed_files, changed_hits))
    left = []
    for fp in files:
        try:
            src = open(fp, encoding='utf-8').read()
        except (OSError, UnicodeDecodeError):
            continue
        if '鸡蛋铺' in src or '素晴' in src:
            left.append(os.path.relpath(fp, BASE))
    print('仍有品牌字样残留的文件：%d %s' % (len(left), left[:8]))
