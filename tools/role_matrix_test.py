# -*- coding: utf-8 -*-
"""分角色体检：每个岗位登录后跑一遍全部页面与关键接口，把异常和越权候选列出来。

用法:
    python tools/role_matrix_test.py              # 每个岗位取一个代表账号
    python tools/role_matrix_test.py 打手 客服    # 只跑指定岗位

判定口径
    页面：200+HTML 才算正常；403 且是无权限页 = 权限拦截（正常）；
          500 / 404 / 返回 JSON / 被踢回登录页 = 问题
    接口：200+JSON 才算正常；500 / 非 JSON / 空响应 = 问题
    敏感接口：岗位不在白名单里却拿到了数据 = 越权候选（需要人判断原站设计）
"""
import collections
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402
from api.spec import TABLE_URLS, AJAX_METHODS  # noqa: E402
from api.system import user_permissions, all_menu_keys  # noqa: E402

NOTFOUND = '页面，我找不到你'
NOAUTH = '没有权限访问或操作'
PWD_ADMIN = '394607'
PWD_DEFAULT = '123456'

# 岗位 -> (代表账号, 密码)
REPS = [
    ('系统管理员', '1234567890', PWD_ADMIN),
    ('老板', 'boss', PWD_DEFAULT),
    ('财务', 'cw01', PWD_DEFAULT),
    ('团长', 'tz01', PWD_DEFAULT),
    ('客服', 'kf小晴', PWD_DEFAULT),
    ('打手', 'ds星尘', PWD_DEFAULT),
]

# 敏感接口：(路径, 说明, 允许的岗位)
SENSITIVE = [
    ('/UserAjax/GetUserList', '人员管理列表', ('系统管理员', '老板')),
    ('/EmpAjax/GetEmpList', '全部报酬明细', ('系统管理员', '老板', '财务')),
    ('/EmpAjax/GetBillSummaryList', '结算记录', ('系统管理员', '老板', '财务')),
    ('/SystemAjax/GetRoleList', '角色权限', ('系统管理员',)),
    ('/SystemAjax/GetSystemLogList', '系统操作日志', ('系统管理员',)),
    ('/CustomerAjax/GetCustomerList', '会员列表', ('系统管理员', '老板', '客服', '财务')),
    ('/OrderAjax/GetOrderList', '全部订单', ('系统管理员', '老板', '客服', '财务', '团长')),
    ('/GameAccountsAjax/GetGameAccList', '游戏号库', ('系统管理员', '老板', '客服', '财务', '团长', '打手')),
    ('/EmpAjax/GetSalesmanStatistics', '客服提成统计', ('系统管理员', '老板', '财务')),
    ('/GameAjax/GetGameServerMangeList', '游戏维护', ('系统管理员', '老板')),
]


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='matrix', isRemember=0), headers=H)
    code = None
    try:
        code = r.get_json().get('code')
    except Exception:
        pass
    return c, H, code


def data_count(resp):
    """表格/列表接口里大致有多少条数据（用于判断越权后是否真拿到了别人的数据）"""
    try:
        j = resp.get_json()
    except Exception:
        return -1
    if not isinstance(j, dict):
        return -1
    d = j.get('data')
    if isinstance(d, list):
        return len(d)
    if isinstance(d, str):
        return len(d)
    return j.get('count') if isinstance(j.get('count'), int) else -1


def run_role(role, acc, pwd, report, order_id):
    r = {'role': role, 'acc': acc, 'login': None, 'pages': collections.Counter(),
         'page_problems': [], 'api_problems': [], 'sensitive': []}
    c, H, code = login(acc, pwd)
    r['login'] = code
    if code != 1:
        report.append(r)
        return r

    perms = None
    u = db.first('users', lambda x: x.get('loginAcc') == acc)
    if u:
        perms = user_permissions(u)
    r['perm_count'] = len(perms) if perms else 0
    menu_keys = set(all_menu_keys())
    r['perm_missing'] = []       # 菜单里有权限、页面却打不开
    r['perm_leak'] = []          # 菜单页不在该岗位权限里、却能打开

    pages = sorted(k for k in appmod.TEMPLATES if k != 'noauth')
    for k in pages:
        if k.startswith('login/') or k in ('notfound', 'index', 'public/buiderqrcode', 'public/platformredirect'):
            continue
        url = '/' + k
        if k in ('order/orderview', 'order/assignation', 'emp/changerecpricebyorder', 'order/sendsms',
                 'order/uploadpic', 'order/setordersta', 'order/orderremark', 'group/ordergroup'):
            url += '?orderId=' + str(order_id)
        if k == 'order/addorder':
            url += '?orderID=' + str(order_id)
        try:
            resp = c.get(url, headers=H)
        except Exception as exc:
            r['page_problems'].append((url, 'exception', str(exc)[:80]))
            continue
        body = resp.get_data(as_text=False).decode('utf-8', 'ignore')
        ctype = (resp.headers.get('Content-Type') or '').split(';')[0]
        if resp.status_code == 200 and ctype == 'text/html' and NOTFOUND not in body:
            r['pages']['ok'] += 1
            if k in menu_keys and perms is not None and k not in perms:
                r['perm_leak'].append((url, '菜单页不在该岗位权限内，却能打开'))
        elif resp.status_code == 403 and NOAUTH in body:
            r['pages']['noauth'] += 1
            if k in menu_keys and perms is not None and k in perms:
                r['perm_missing'].append((url, '该岗位菜单里有权限，页面却被拒绝'))
        elif resp.status_code in (301, 302) or 'Login/index.html' in body[:2000]:
            r['pages']['redirect_login'] += 1
            r['page_problems'].append((url, '登录态丢失', 'HTTP %s' % resp.status_code))
        else:
            r['pages']['bad'] += 1
            why = 'HTTP %s %s' % (resp.status_code, ctype)
            if NOTFOUND in body:
                why += ' 渲染404页'
            elif ctype == 'application/json':
                why += ' 返回JSON而非页面'
            r['page_problems'].append((url, why, body[:80].replace('\n', ' ')))

    for u_ in sorted(TABLE_URLS):
        try:
            resp = c.get(u_ + '?page=1&limit=5', headers=H)
        except Exception as exc:
            r['api_problems'].append((u_, 'exception', str(exc)[:60]))
            continue
        if resp.status_code != 200:
            r['api_problems'].append((u_, 'HTTP %s' % resp.status_code, ''))
        elif not resp.is_json:
            r['api_problems'].append((u_, '非 JSON', resp.get_data(as_text=False)[:60].decode('utf-8', 'ignore')))

    for u_, methods in sorted(AJAX_METHODS.items()):
        name = u_.rsplit('/', 1)[-1]
        if not name.startswith('get'):
            continue
        try:
            resp = c.post(u_, data={}, headers=H) if 'POST' in methods else c.get(u_, headers=H)
        except Exception as exc:
            r['api_problems'].append((u_, 'exception', str(exc)[:60]))
            continue
        if resp.status_code >= 500:
            r['api_problems'].append((u_, 'HTTP %s' % resp.status_code, resp.get_data(as_text=False)[:80].decode('utf-8', 'ignore')))
        elif resp.status_code == 200 and not resp.is_json and not (resp.mimetype or '').startswith('image') and 'svg' not in (resp.mimetype or ''):
            r['api_problems'].append((u_, '非 JSON', (resp.mimetype or '')))

    for u_, label, allowed in SENSITIVE:
        try:
            resp = c.get(u_, headers=H)
        except Exception as exc:
            r['sensitive'].append((label, u_, 'exception', str(exc)[:50]))
            continue
        n = data_count(resp)
        state = 'HTTP %s' % resp.status_code
        if resp.status_code == 200 and n != 0:
            state += ' / 返回 %s 条' % n
        r['sensitive'].append((label, u_, state, '应允许' if role in allowed else '本岗位未授权'))
    report.append(r)
    return r


if __name__ == '__main__':
    db.init()
    want = [a for a in sys.argv[1:] if not a.isdigit()]
    order = (db.all_('orders') or [{}])[0]
    oid = order.get('orderId')
    print('订单样本 orderId=%s；岗位：%s\n' % (oid, ', '.join(REPS and [x[0] for x in REPS if not want or x[0] in want])))
    report = []
    for role, acc, pwd in REPS:
        if want and role not in want:
            continue
        print('=========== %s (%s) ===========' % (role, acc))
        r = run_role(role, acc, pwd, report, oid)
        if r['login'] != 1:
            print('  登录失败 code=%s' % r['login'])
            continue
        print('  菜单权限 %d 项' % r.get('perm_count', 0))
        print('  页面：正常 %(ok)d / 无权限 %(noauth)d / 登录态丢失 %(redirect_login)d / 异常 %(bad)d' % r['pages'])
        for url, why, snip in r['page_problems']:
            print('   [页面] %-40s %s  %s' % (url, why, snip[:60]))
        for url, why in r.get('perm_missing', []):
            print('   [权限] %-40s %s' % (url, why))
        for url, why in r.get('perm_leak', []):
            print('   [越权] %-40s %s' % (url, why))
        if r['api_problems']:
            seen = collections.Counter(x[0] for x in r['api_problems'])
            print('  接口异常 %d 个：' % len(r['api_problems']))
            for u_, why, snip in r['api_problems'][:12]:
                print('   [接口] %-52s %s  %s' % (u_, why, snip[:50]))
        print('  敏感接口：')
        for label, u_, state, expect in r['sensitive']:
            flag = '  ' if expect == '应允许' else '!!'
            print('   %s %-16s %-46s %s（%s）' % (flag, label, u_, state, expect))
        print()
    print('== 各岗位页面统计汇总 ==')
    for r in report:
        print('%-8s 登录=%s 权限=%s 页面=%s' % (r['role'], r['login'], r.get('perm_count'), dict(r['pages'])))
