# -*- coding: utf-8 -*-
"""全账号审计：把 19 个账号逐个登一遍，核对登录是否可用、权限是否与同岗位一致、
敏感接口是否真的拦住；顺带列出被单独设过用户级开关的账号。

用法: python tools/role_account_audit.py
"""
import collections
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402
from api.system import user_permissions  # noqa: E402

SENSITIVE = [('/UserAjax/GetUserList', '人员列表'), ('/EmpAjax/GetEmpList', '报酬明细'),
             ('/SystemAjax/GetSysmteLogList', '系统日志')]
MINE = [('/EmpAjax/GetMyEmp', '我的收入'), ('/OrderAjax/GetOrderList', '我的订单')]
# 用户级开关：这些字段非默认值会让人和其他同岗位同事行为不同
FLAGS = ['isSuper', 'forbidViewOrderContent', 'isProhibitPublicRecOrder', 'prohibitedViewOrderPwd',
         'isExcuseLoginVer', 'isProhibitSettStatus', 'isAutoSett', 'isNeedPrivatePhone', 'sta']


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='audit', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else None)


def hits(resp):
    if resp.status_code != 200:
        return 'HTTP %s' % resp.status_code
    try:
        j = resp.get_json() or {}
    except Exception:
        return '非JSON'
    d = j.get('data')
    n = len(d) if isinstance(d, list) else (j.get('count') if isinstance(j.get('count'), int) else '-')
    return '200/%s' % n


if __name__ == '__main__':
    db.init()
    users = sorted(db.all_('users'), key=lambda u: (u.get('jobName') or '', u.get('loginAcc') or ''))
    print('%-13s %-6s %-5s %-6s %-9s %s' % ('账号', '岗位', '登录', '权限', '与同岗一致', '   '.join(l for _, l in SENSITIVE + MINE)))
    print('-' * 112)
    perms_by_job = collections.defaultdict(set)
    rows = []
    for u in users:
        role = u.get('jobName') or '?'
        pwd = '394607' if u.get('isSuper') else '123456'
        c, H, code = login(u['loginAcc'], pwd)
        if code != 1:
            print('%-13s %-6s %-5s %s' % (u['loginAcc'], role, '失败', '（密码不是演示密码）'))
            rows.append((u, None))
            continue
        perms = user_permissions(u)
        perms_by_job[role] |= perms
        cells = []
        for url, _ in SENSITIVE + MINE:
            cells.append(hits(c.get(url, headers=H)))
        print('%-13s %-6s %-5s %-6s %-9s %s' % (u['loginAcc'], role, 'OK', len(perms), '', '   '.join(cells)))
        rows.append((u, perms))

    print('\n=== 同岗位权限是否一致 ===')
    for role, uniq in perms_by_job.items():
        print('  %-6s 该岗位账号权限并集 %d 项' % (role, len(uniq)))
    for u, perms in rows:
        if perms is None:
            continue
        others = [p for u2, p in rows if p is not None and u2.get('jobName') == u.get('jobName') and u2['id'] != u['id']]
        if others and any(p != perms for p in others):
            print('  [差异] %s(%s) 的权限与同岗位其他账号不同' % (u.get('loginAcc'), u.get('jobName')))

    print('\n=== 被单独设过用户级开关的账号 ===')
    found = False
    for u, _ in rows:
        odd = []
        for f in FLAGS:
            v = u.get(f)
            if f == 'isSuper' and v:
                odd.append('isSuper=True')
            elif f == 'sta' and v == 'N':
                odd.append('已停用')
            elif f not in ('isSuper', 'sta') and v not in (None, '', 'N', False, 0):
                odd.append('%s=%s' % (f, v))
        if odd:
            found = True
            print('  %-13s %-6s %s' % (u.get('loginAcc'), u.get('jobName'), '，'.join(odd)))
    if not found:
        print('  （无）')
