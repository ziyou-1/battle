# -*- coding: utf-8 -*-
"""分岗位端到端流程：让客服 / 打手 / 财务 / 团长 用**自己的账号**把本职业务跑一遍。

目的：验证新加的接口权限守卫只拦越权，没有误伤本职——低权限岗位是不是真的还能干完活。
数据全部用「岗位联调」前缀，跑完清干净。

用法: python tools/role_flow_test.py
"""
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

GAME = '岗位联调游戏'
ROLE = '岗位联调角色'
CUSTOMER = '岗位联调客户'
DS_ACC = 'rft_ds01'
DS_NAME = '岗位联调打手'
TASK = '岗位联调排团'
RESULTS = []


def purge():
    for coll, key, val in [('games', 'gameName', GAME), ('users', 'loginAcc', DS_ACC),
                           ('customers', 'bossName', CUSTOMER), ('pve_tasks', 'taskName', TASK)]:
        for r in db.find(coll, lambda x: x.get(key) == val):
            db.delete(coll, r['id'])
    for coll in ('projects', 'game_data', 'order_types', 'price_calc'):
        for r in db.find(coll, lambda x: x.get('gameName') == GAME):
            db.delete(coll, r['id'])
    for o in db.find('orders', lambda x: x.get('gameName') == GAME or x.get('roleName') == ROLE):
        for x in db.find('emp_pay', lambda y: y.get('orderId') == o['id']):
            db.delete('emp_pay', x['id'])
        for x in db.find('order_logs', lambda y: y.get('orderId') == o['id']):
            db.delete('order_logs', x['id'])
        db.delete('orders', o['id'])
    for b in db.find('bills', lambda x: x.get('userName') == DS_NAME):
        for x in db.find('bill_details', lambda y: y.get('billId') == b['id']):
            db.delete('bill_details', x['id'])
        db.delete('bills', b['id'])
    db.conn().commit()


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='rft', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else 0)


def step(who, label, resp):
    try:
        j = resp.get_json() or {}
    except Exception:
        j = {}
    code = j.get('code')
    ok = (isinstance(code, int) and code > 0) or ('count' in j)
    print('  %s %-10s %-30s %s' % ('OK  ' if ok else 'FAIL', who, label,
                                   (j.get('msg') or json.dumps(j, ensure_ascii=False))[:44]))
    RESULTS.append((who, label, ok, j))
    return j


if __name__ == '__main__':
    db.init()
    purge()
    print('== 管理员准备基础数据 ==')
    admin, AH, code = login('1234567890', '394607')
    print('  管理员登录:', 'OK' if code == 1 else 'FAIL')
    g = step('管理员', '建游戏', admin.post('/GameAjax/AddEditGame', data=dict(gameName=GAME, isMoblieGame='N', isPw='N'), headers=AH))
    gid = g.get('data')
    step('管理员', '建分类', admin.post('/GameAjax/AddModityOrderType', data=dict(gameId=gid, pid=0, projectName='段位代练', orderBy=1), headers=AH))
    step('管理员', '建项目', admin.post('/GameAjax/AddEditProject', data=dict(gameId=gid, pid=0, projectName='上分到王者', orderBy=1, price=200), headers=AH))
    roles = (admin.get('/SystemAjax/GetAllRoleJobList?page=1&limit=50', headers=AH).get_json() or {}).get('data') or []
    dashou = next((r for r in roles if r['roleName'] == '打手'), None)
    u = step('管理员', '新建打手账号', admin.post('/UserAjax/AddEditUser', data=dict(
        strparameter=json.dumps(dict(uid=0, loginAcc=DS_ACC, userName=DS_NAME, userRole=dashou['roleId'], qq='1',
                                     moblie='13800000001', bussType=1, recOrderMaxCount=5)), games=GAME), headers=AH))
    ds_id = u.get('data')
    cu = step('管理员', '新建会员', admin.post('/api/CustomerApi/CreateModifyCustomer', data=dict(
        hid=0, bossName=CUSTOMER, phone='13900000001', platName='淘宝店', initAmount=500, giftAmount=50), headers=AH))
    cid = cu.get('data')

    print('== 客服：录单 → 指派 → 改状态 ==')
    kf, KH, code = login('kf小晴', '123456')
    print('  客服登录:', 'OK' if code == 1 else 'FAIL')
    form = dict(orderID='', gameName=gid, gameRole=ROLE, souresOrderID='RFT' + str(__import__('time').time_ns())[-8:],
                project='上分到王者', orderType='段位代练', price=300, priceReceipts=300, desServiceFee=0, day=2, hours=0,
                ww=CUSTOMER, qq='', moblie='13900000001', remark='岗位联调', tag='', dlcontent='联调内容',
                orderSoures2='淘宝店-云序工作室', gameAcc='acc_rft', gamePwd='pwd_rft', recUser='0', customerId=cid)
    j = step('客服', '录入订单', kf.post('/OrderAjax/AddOrderAjax', data=dict(
        strParameter=json.dumps(form, ensure_ascii=False), gameName=GAME, gameArea='电信区', gameServer='',
        gameJob='', gameGroup='', emps='[]'), headers=KH))
    lst = step('客服', '查订单列表', kf.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=5, gameName=GAME, timeType=10), headers=KH))
    rows = lst.get('data') or []
    order_id = rows[0]['orderId'] if rows else ''
    step('客服', '指派打手', kf.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(
        orderId=order_id, strParameter=json.dumps([dict(userId=ds_id, userName=DS_NAME, fee=180, hours=48, project='上分到王者')]),
        isAutoAss='N', sphone='', isOpenThrowOrderPricePerHandle='N', taskNeedJobId=0), headers=KH))
    step('客服', '改代练中', kf.post('/OrderAjax/SetOrderSta', data=dict(orderId=order_id, sta='代练中'), headers=KH))

    print('== 打手：看自己的单 → 改状态 → 看收入 ==')
    ds, DH, code = login(DS_ACC, '123456')
    print('  打手登录:', 'OK' if code == 1 else 'FAIL')
    mine = step('打手', '我的订单列表', ds.post('/OrderAjax/GetOrderList', data=dict(page=1, limit=10), headers=DH))
    has = any(r.get('orderId') == order_id for r in (mine.get('data') or []))
    print('  %s %-10s %-30s %s' % ('OK  ' if has else 'FAIL', '打手', '能看到自己这一单', order_id))
    RESULTS.append(('打手', '能看到自己这一单', has, {}))
    step('打手', '改待验收', ds.post('/OrderAjax/SetOrderSta', data=dict(orderId=order_id, sta='待验收'), headers=DH))
    step('打手', '我的收入', ds.get('/EmpAjax/GetMyEmp?page=1&limit=10', headers=DH))

    print('== 财务：结算 → 查记录 → 导出 ==')
    cw, CH, code = login('cw01', '123456')
    print('  财务登录:', 'OK' if code == 1 else 'FAIL')
    step('财务', '改已完成', cw.post('/OrderAjax/SetOrderSta', data=dict(orderId=order_id, sta='已完成'), headers=CH))
    emp = step('财务', '查报酬明细', cw.get('/EmpAjax/GetEmpList?page=1&limit=50&gameName=' + GAME, headers=CH))
    target = next((r for r in (emp.get('data') or []) if r.get('userName') == DS_NAME), None)
    if target:
        step('财务', '结算该笔', cw.post('/EmpAjax/UpEmpSta', data=dict(empId=target['empPayId'], sta='Y', syncexp='N'), headers=CH))
    else:
        print('  FAIL 财务       找不到待结算记录')
        RESULTS.append(('财务', '找到待结算记录', False, {}))
    step('财务', '查结算记录', cw.get('/EmpAjax/GetBillSummaryList?page=1&limit=5', headers=CH))
    r = cw.get('/Emp/ExportEmp?page=1&limit=5', headers=CH)
    ct = (r.headers.get('Content-Type') or '').split(';')[0]
    ok = r.status_code == 200 and ('spreadsheet' in ct or 'csv' in ct)
    print('  %s %-10s %-30s %s' % ('OK  ' if ok else 'FAIL', '财务', '导出结算记录', ct))
    RESULTS.append(('财务', '导出结算记录', ok, {}))

    print('== 团长：建排团 → 查排团 ==')
    tz, TH, code = login('tz01', '123456')
    print('  团长登录:', 'OK' if code == 1 else 'FAIL')
    step('团长', '新建排团', tz.post('/PveTaskAjax/AddEditPveTask', data=dict(
        param=json.dumps(dict(taskId=0, taskName=TASK, gameName=GAME, project='上分到王者', leaderID=ds_id,
                              startDate='2026-09-26 20:00:00'), ensure_ascii=False),
        jobConfig=json.dumps([dict(jobName='主C', price=50)]), isConfigJob='Y'), headers=TH))
    step('团长', '查排团列表', tz.post('/PveTaskAjax/GetNewsGroupList', data=dict(gameId=gid, page=1, limit=10), headers=TH))
    step('团长', '看公开坑位', tz.post('/PveTaskAjax/GetGroupList', data=dict(page=1, limit=10), headers=TH))

    purge()
    print('\n== 汇总 ==')
    bad = [x for x in RESULTS if not x[2]]
    print('通过 %d / %d' % (len(RESULTS) - len(bad), len(RESULTS)))
    for who, label, ok, _ in bad:
        print('  失败：%s - %s' % (who, label))
