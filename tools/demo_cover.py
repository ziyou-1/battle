# -*- coding: utf-8 -*-
"""给演示文章补一张本地封面图（幂等，可重复跑）。

背景：文章列表的「查看封面图」是个 <a href="{coverImg}">，封面为空时点了会跳回当前页
（地址栏变成 /System/wechatappmange#tabsCk=10）。前端已经兜底显示「暂无封面」，
这个脚本负责把演示数据的封面补上，方便直接看到效果。

用法: python tools/demo_cover.py
"""
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import db

OUT_DIR = os.path.join(BASE, 'data', 'uploads', 'public')
URL = '/upload/public/demo-cover.png'


def make_image():
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, 'demo-cover.png')
    if os.path.isfile(path):
        return path
    from PIL import Image, ImageDraw
    w, h = 800, 450
    im = Image.new('RGB', (w, h), (79, 70, 229))
    d = ImageDraw.Draw(im)
    for y in range(h):
        d.line([(0, y), (w, y)], fill=(79 + y // 6, 70 + y // 8, 229 - y // 4))
    d.rectangle([0, h - 90, w, h], fill=(17, 24, 39))
    d.text((40, h - 60), 'DEMO COVER  /  local demo image', fill=(226, 232, 240))
    im.save(path)
    return path


if __name__ == '__main__':
    db.init()
    p = make_image()
    print('封面图：', os.path.relpath(p, BASE))
    n = 0
    for row in db.all_('mp_news'):
        if not row.get('coverImg'):
            db.update('mp_news', row['id'], dict(coverImg=URL))
            n += 1
    db.conn().commit()   # 脚本没有请求上下文，app 的 teardown 提交不会触发，得自己提交
    print('已补封面的文章：%d 条' % n)
    left = [r for r in db.all_('mp_news') if not r.get('coverImg')]
    print('仍缺封面：%d 条' % len(left))
