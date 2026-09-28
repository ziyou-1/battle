# -*- coding: utf-8 -*-
"""越权抽检：低权限岗位能不能拿到全站数据（内容级比对，不只看状态码）。

用法: python tools/role_leak_check.py
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

CHECKS = [
    ('/EmpAjax/GetEmpList?page=1&limit=30', '报酬明细', ('userName',)),
    ('/UserAjax/GetUserList?page=1&limit=30', '人员列表', ('userName', 'loginAcc')),
    ('/api/CustomerApi/GetCustomerList?page=1&limit=30', '会员列表', ('userName', 'moblie', 'customerName')),
    ('/SystemAjax/GetSysmteLogList?page=1&limit=30', '系统日志', ('userName', 'logUserName')),
    ('/OrderAjax/GetOrderList?page=1&limit=30', '订单列表', ('orderId',)),
    ('/SystemAjax/GetRoleList', '角色权限', ('roleName',)),
    ('/EmpAjax/GetBillSummaryList?page=1&limit=30', '结算记录', ('userName', 'billUserName')),
]
ROLES = [('系统管理员', '1234567890', '394607'), ('老板', 'boss', '123456'), ('财务', 'cw01', '123456'),
         ('团长', 'tz01', '123456'), ('客服', 'kf小晴', '123456'), ('打手', 'ds星尘', '123456')]


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='leak', isRemember=0), headers=H)
    code = r.get_json().get('code') if r.is_json else None
    return c, H, code


if __name__ == '__main__':
    db.init()
    for role, acc, pwd in ROLES:
        c, H, code = login(acc, pwd)
        print('=== %s (%s) 登录=%s ===' % (role, acc, code))
        if code != 1:
            continue
        for url, label, keys in CHECKS:
            r = c.get(url, headers=H)
            try:
                j = r.get_json()
            except Exception:
                j = None
            if not isinstance(j, dict):
                print('   %-8s HTTP %-4s 非 JSON：%s' % (label, r.status_code, r.get_data(as_text=False)[:50].decode('utf-8', 'ignore')))
                continue
            d = j.get('data')
            rows = d if isinstance(d, list) else []
            total = j.get('count') if isinstance(j.get('count'), int) else len(rows)
            sample = []
            for row in rows[:8]:
                if isinstance(row, dict):
                    for k in keys:
                        if row.get(k):
                            sample.append(str(row.get(k)))
                            break
            print('   %-8s HTTP %-4s 条数=%-5s 样例=%s' % (label, r.status_code, total, ', '.join(sample[:5]) or '—'))
        print()
