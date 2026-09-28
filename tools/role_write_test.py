# -*- coding: utf-8 -*-
"""按角色的写操作体检：低权限岗位去调「不该它管的」写接口，看拦不拦得住。

安全设计：所有写操作都带**不存在的业务 ID**（订单9999999999 / 会员0 / 结算记录 999999 等），
所以即使权限没拦住，业务层也只会回「不存在 / 请选择记录」，不会真的改动演示数据。

判定：
    [BLOCKED]  403 或返回里有「无权 / 没有权限」        → 权限拦住了
    [PASSED]   进了业务逻辑（哪怕回的是"记录不存在"）    → 权限放行
    [404]      接口不存在（测试清单里的路径写错了）

用法: python tools/role_write_test.py
"""
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

# (说明, 路径, 参数, 业务上允许的岗位)
CASES = [
    ('订单-改状态', '/OrderAjax/SetOrderSta', dict(orderId='9999999999', orderSta='代练中', type='1'),
     {'系统管理员', '老板', '客服', '团长', '打手'}),
    ('订单-删除', '/OrderAjax/DelOrderByidx', dict(idx='9999999999'),
     {'系统管理员', '老板', '客服', '团长', '财务'}),
    ('订单-发短信', '/OrderAjax/SendSmsByOrderIDX',
     dict(orderId='9999999999', smsContent='probe', type='1'), {'系统管理员', '老板', '客服'}),
    ('订单-传图', '/OrderAjax/UploadOrderPic', dict(orderId='9999999999'),
     {'系统管理员', '老板', '客服', '打手'}),
    ('财务-结算', '/EmpAjax/SettlementEmp', dict(ids='999999'),
     {'系统管理员', '老板', '财务'}),
    ('财务-改代练价', '/EmpAjax/ChangeOrderRecPrice', dict(empPayId='999999', recPrice='1'),
     {'系统管理员', '老板', '财务'}),
    ('财务-批量扣点', '/EmpAjax/BatchDeductFee', dict(ids='999999', fee='1'),
     {'系统管理员', '老板', '财务'}),
    ('会员-充值', '/api/CustomerApi/Recharge', dict(customerId='0', amount='1', remark='probe'),
     {'系统管理员', '老板', '客服', '财务'}),
    ('会员-建改档', '/api/CustomerApi/CreateModifyCustomer', dict(customerId='0', userName='probe'),
     {'系统管理员', '老板', '客服', '财务'}),
    ('人员-新增/修改', '/UserAjax/AddEditUser', dict(strparameter='{}'),
     {'系统管理员', '老板'}),
    ('人员-删除', '/UserAjax/DelUser', dict(ids='999999'),
     {'系统管理员', '老板'}),
    ('系统-保存设置', '/SystemAjax/SaveSystemSetting', dict(key='probe', value='1'),
     {'系统管理员', '老板'}),
    ('系统-角色权限', '/SystemAjax/AddEditRole', dict(roleId='999999', roleName='probe'),
     {'系统管理员', '老板'}),
    ('系统-角色删除', '/SystemAjax/DelRole', dict(roleId='999999'),
     {'系统管理员', '老板'}),
    ('游戏-维护', '/GameAjax/AddEditGame', dict(gameId='999999', gameName='probe'),
     {'系统管理员', '老板'}),
    ('游戏号-新增', '/GameAccountsAjax/AddEditGameAccount',
     dict(param='{}', gameName='probe', gameArea='', gameServer='', gameJob='', gameGroup='', useType='A'),
     {'系统管理员', '老板', '团长'}),
    ('排团-新建/修改', '/PveTaskAjax/AddEditPveTask', dict(taskId='999999'),
     {'系统管理员', '老板', '团长'}),
    ('排团-指派订单', '/PveTaskAjax/NewOrderToTaskAss', dict(order='9999999999', taskId='999999', recUserId='999999', fee='1'),
     {'系统管理员', '老板', '团长'}),
    ('排团-删除', '/PveTaskAjax/DelPveTask', dict(taskId='999999'),
     {'系统管理员', '老板', '团长'}),
    ('排团-坑位操作', '/PveTaskAjax/SetTaskPostionOrder', dict(taskId='999999', taskNeedJobId='1'),
     {'系统管理员', '老板', '团长'}),
    ('短信-模板', '/SmsAjax/AddSmsTemplate', dict(content='probe', tempType='1'),
     {'系统管理员', '老板'}),
]
ROLES = [('系统管理员', '1234567890', '394607'), ('老板', 'boss', '123456'), ('财务', 'cw01', '123456'),
         ('团长', 'tz01', '123456'), ('客服', 'kf小晴', '123456'), ('打手', 'ds星尘', '123456')]


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='wtest', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else None)


def verdict(resp):
    if resp.status_code == 404:
        return '404'
    if resp.status_code == 403:
        return 'BLOCKED'
    try:
        j = resp.get_json() or {}
    except Exception:
        return 'PASSED'
    msg = str(j.get('msg') or '')
    if any(w in msg for w in ('无权', '没有权限', '权限')):
        return 'BLOCKED'
    return 'PASSED'


if __name__ == '__main__':
    db.init()
    print('%-16s %-12s %s' % ('写操作', '接口', '  '.join('%s' % r[0] for r in ROLES)))
    print('-' * 118)
    problems = []
    for label, url, data, allowed in CASES:
        cells = []
        for role, acc, pwd in ROLES:
            c, H, code = login(acc, pwd)
            if code != 1:
                cells.append('登录失败')
                continue
            try:
                r = c.post(url, data=data, headers=H)
            except Exception as exc:
                cells.append('异常')
                continue
            v = verdict(r)
            want = 'PASSED' if role in allowed else 'BLOCKED'
            mark = ' ' if (v == want or v == '404') else '!'
            if v != want and v != '404':
                problems.append((label, url, role, v, want))
            cells.append('%s%s' % (v[:7], mark))
        print('%-16s %-32s %s' % (label, url, '  '.join(cells)))
    print('\n=== 与业务口径不一致的地方 ===')
    if not problems:
        print('（无）')
    for label, url, role, got, want in problems:
        print('  [问题] %s（%s）：%s 实际 %s，期望 %s' % (label, url, role, got, want))
