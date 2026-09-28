# -*- coding: utf-8 -*-
"""跨端消息链路：客户端发的东西，后台对应的人能不能收到。

现成的 client_test / client2_test 只验证了各自接口成功，没有验证「消息真的进了
客服的收件箱」。这里补这一段：客户留言 → 后台 messages → 客服的「我的消息」。

用法: python tools/notify_chain_test.py
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

TAG = '跨端联调留言'


def client_login_as(cid):
    """模拟会员登录：cookie 与 CSRF 令牌要在同一次 session_transaction 里写好"""
    c = appmod.app.test_client()
    tok = 'notify-token'
    with c.session_transaction() as s:
        s['_csrf_token'] = tok
        s['cid'] = cid
    return c, {'X-CSRF-Token': tok}


def admin_login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='notify', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else 0)


if __name__ == '__main__':
    db.init()
    cu = (db.all_('customers') or [{}])[0]
    cid = cu.get('id')
    print('用会员 %s(id=%s) 的身份模拟客户端操作' % (cu.get('bossName') or cu.get('phone'), cid))

    cc, CH = client_login_as(cid)
    before = db.count('messages')
    r = cc.post('/api/client/contact', data=dict(content=TAG + '：联调内容', msg=TAG, text=TAG), headers=CH)
    j = r.get_json() or {}
    after = db.count('messages')
    print('客户留言接口返回 :', j.get('code'), j.get('msg'))
    print('messages 条数    : %d -> %d' % (before, after))

    fresh = [m for m in db.all_('messages') if TAG in str(m.get('content')) or TAG in str(m.get('title'))]
    print('命中本次留言     :', len(fresh), '条')
    for m in fresh:
        print('   收件人 userId=%s 标题=%s 内容=%s' % (m.get('userId'), m.get('title'), str(m.get('content'))[:36]))

    if not fresh:
        print('!! 客户留言没有落到 messages —— 客服收不到')
    else:
        # 收件人里有管理员也有客服，这里挑一个客服账号去收件箱核对
        kf = None
        for m in fresh:
            u = db.get('users', m.get('userId')) or {}
            if u.get('jobName') == '客服':
                kf = u
                break
        print('本留言的收件人   :', '、'.join(
            '%s(%s)' % ((db.get('users', m.get('userId')) or {}).get('userName'), (db.get('users', m.get('userId')) or {}).get('jobName'))
            for m in fresh))
        if not kf:
            print('!! 收件人里没有客服账号')
        else:
            kc, KH, code = admin_login(kf['loginAcc'], '123456')
            print('客服 %s 登录      : %s' % (kf['loginAcc'], 'OK' if code == 1 else 'FAIL'))
            lst = kc.get('/UserAjax/GetMyMessageList?page=1&limit=20', headers=KH).get_json() or {}
            rows = lst.get('data') or []
            hit = any(TAG in str(r.get('content')) for r in rows)
            print('客服「我的消息」 :', '%d 条，命中留言：%s' % (len(rows), '是' if hit else '否'))
            if not hit:
                print('!! 留言在库里但客服的消息列表读不到（%s）' % str(lst)[:80])

    for m in fresh:
        db.delete('messages', m['id'])
    db.conn().commit()
    print('已清理本次测试消息，messages 现有 %d 条' % db.count('messages'))
