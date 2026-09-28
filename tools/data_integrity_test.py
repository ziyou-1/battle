# -*- coding: utf-8 -*-
"""数据勾稽：订单金额 / 打手报酬 / 结算单 / 订单状态 之间是不是对得上。

查四件事：
  1. 同一笔报酬重复结算，会不会出两张账单
  2. 订单退款后，订单上的退款额、实收、以及打手报酬是否被同步
  3. 已结算的订单再改状态，账是否会被带偏
  4. 删除订单后，关联的报酬记录与账单会不会变成孤儿数据

数据一律用「勾稽联调」前缀，跑完清干净。
用法: python tools/data_integrity_test.py
"""
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402
import db  # noqa: E402

GAME = '勾稽联调游戏'
ROLE = '勾稽联调角色'
CUSTOMER = '勾稽联调客户'
DS_ACC = 'chk_ds01'
DS_NAME = '勾稽联调打手'
NOTES = []


def purge():
    for coll, key, val in (('games', 'gameName', GAME), ('users', 'loginAcc', DS_ACC),
                           ('customers', 'bossName', CUSTOMER)):
        for r in db.find(coll, lambda x, k=key, v=val: x.get(k) == v):
            db.delete(coll, r['id'])
    for coll in ('projects', 'game_data', 'order_types', 'price_calc'):
        for r in db.find(coll, lambda x: x.get('gameName') == GAME):
            db.delete(coll, r['id'])
    for o in db.find('orders', lambda x: x.get('gameName') == GAME):
        for x in db.find('emp_pay', lambda y, i=o['id']: y.get('orderId') == i):
            db.delete('emp_pay', x['id'])
        for x in db.find('order_logs', lambda y, i=o['id']: y.get('orderId') == i):
            db.delete('order_logs', x['id'])
        db.delete('orders', o['id'])
    for b in db.find('bills', lambda x: x.get('userName') == DS_NAME):
        for x in db.find('bill_details', lambda y, i=b['id']: y.get('billId') == i):
            db.delete('bill_details', x['id'])
        db.delete('bills', b['id'])
    db.conn().commit()


def login(acc, pwd):
    c = appmod.app.test_client()
    r0 = c.get('/Login/index.html')
    m = re.search(r'name="csrf-token" content="([^"]+)"', r0.get_data(as_text=True))
    H = {'X-CSRF-Token': m.group(1)} if m else {}
    r = c.post('/Login/Login', data=dict(acc=acc, pwd=pwd, code='', deviceInfo='chk', isRemember=0), headers=H)
    return c, H, (r.get_json().get('code') if r.is_json else 0)


def find_order(gid):
    return next((o for o in db.all_('orders') if o.get('gameId') == gid), None)


def fee_of(order_id):
    r = next((x for x in db.all_('emp_pay') if x.get('orderId') == order_id), None)
    return r


def bill_count():
    return len([b for b in db.all_('bills') if b.get('userName') == DS_NAME])


if __name__ == '__main__':
    db.init()
    purge()
    adm, AH, _ = login('1234567890', '394607')
    gid = (adm.post('/GameAjax/AddEditGame', data=dict(gameName=GAME, isMoblieGame='N', isPw='N'), headers=AH).get_json() or {}).get('data')
    adm.post('/GameAjax/AddModityOrderType', data=dict(gameId=gid, pid=0, projectName='段位代练', orderBy=1), headers=AH)
    adm.post('/GameAjax/AddEditProject', data=dict(gameId=gid, pid=0, projectName='上分到王者', orderBy=1, price=200), headers=AH)
    roles = (adm.get('/SystemAjax/GetAllRoleJobList?page=1&limit=50', headers=AH).get_json() or {}).get('data') or []
    drole = next(r for r in roles if r['roleName'] == '打手')
    ds_id = (adm.post('/UserAjax/AddEditUser', data=dict(strparameter=json.dumps(dict(
        uid=0, loginAcc=DS_ACC, userName=DS_NAME, userRole=drole['roleId'], qq='1', moblie='13800000002',
        bussType=1, recOrderMaxCount=5)), games=GAME), headers=AH).get_json() or {}).get('data')
    cid = (adm.post('/api/CustomerApi/CreateModifyCustomer', data=dict(
        hid=0, bossName=CUSTOMER, phone='13900000002', platName='淘宝店', initAmount=500, giftAmount=50), headers=AH).get_json() or {}).get('data')
    kf, KH, _ = login('kf小晴', '123456')
    form = dict(orderID='', gameName=gid, gameRole=ROLE, souresOrderID='CHK' + str(__import__('time').time_ns())[-8:],
                project='上分到王者', orderType='段位代练', price=300, priceReceipts=300, desServiceFee=0, day=2, hours=0,
                ww=CUSTOMER, qq='', moblie='13900000002', remark='勾稽', tag='', dlcontent='勾稽内容',
                orderSoures2='淘宝店-云序工作室', gameAcc='a', gamePwd='p', recUser='0', customerId=cid)
    kf.post('/OrderAjax/AddOrderAjax', data=dict(strParameter=json.dumps(form, ensure_ascii=False), gameName=GAME,
                                                 gameArea='电信区', gameServer='', gameJob='', gameGroup='', emps='[]'), headers=KH)
    o = find_order(gid)
    kf.post('/OrderAjax/SetOrderZhiPaiByIDX', data=dict(
        orderId=o['orderId'], strParameter=json.dumps([dict(userId=ds_id, userName=DS_NAME, fee=180, hours=48, project='上分到王者')]),
        isAutoAss='N', sphone='', isOpenThrowOrderPricePerHandle='N', taskNeedJobId=0), headers=KH)
    for sta in ('代练中', '已完成'):
        kf.post('/OrderAjax/SetOrderSta', data=dict(orderId=o['orderId'], sta=sta), headers=KH)
    o = find_order(gid)
    print('订单初始：', {k: o.get(k) for k in ('price', 'netReceipts', 'refundFee', 'orderSta', 'isSettStatus')})
    f = fee_of(o['id'])
    print('打手报酬：', {k: f.get(k) for k in ('tempAmount', 'bonusAmount', 'deductFee', 'settingSta')} if f else '无')
    print('结算单数量：', bill_count())

    cw, CH, _ = login('cw01', '123456')
    print('\n[1] 重复结算')
    r1 = cw.post('/EmpAjax/UpEmpSta', data=dict(empId=f['id'], sta='Y', syncexp='N'), headers=CH).get_json() or {}
    n1 = bill_count()
    r2 = cw.post('/EmpAjax/UpEmpSta', data=dict(empId=f['id'], sta='Y', syncexp='N'), headers=CH).get_json() or {}
    n2 = bill_count()
    print('  第一次:', r1.get('msg'), '账单数', n1)
    print('  第二次:', r2.get('msg'), '账单数', n2, '->', '幂等 OK' if n1 == n2 == 1 else '!! 出了重复账单')

    print('\n[2] 订单退款 100')
    before = {k: o.get(k) for k in ('price', 'netReceipts', 'refundFee')}
    rr = cw.post('/OrderAjax/AddOrderRefundLogs', data=dict(orderIdx=o['orderId'], refundModel='支付宝', fee=100,
                                                            sdate='2026-09-26', tranNo='', remark='勾稽退款'), headers=CH).get_json() or {}
    o = find_order(gid)
    after = {k: o.get(k) for k in ('price', 'netReceipts', 'refundFee')}
    f2 = fee_of(o['id'])
    print('  接口返回:', rr.get('msg'), '| 账单数', bill_count())
    print('  订单前:', before, '\n  订单后:', after)
    print('  报酬前:', {k: f.get(k) for k in ('tempAmount', 'bonusAmount', 'deductFee')},
          '-> 报酬后:', {k: f2.get(k) for k in ('tempAmount', 'bonusAmount', 'deductFee')} if f2 else '无')
    if before == after:
        NOTES.append('退款接口调用后订单的金额字段没有变化（%s）' % before)
    if f and f2 and (f.get('tempAmount') != f2.get('tempAmount')):
        NOTES.append('退款后打手报酬被改写：%s -> %s（已结算的账单未同步）' % (f.get('tempAmount'), f2.get('tempAmount')))

    print('\n[3] 已结算订单再改状态')
    r3 = kf.post('/OrderAjax/SetOrderSta', data=dict(orderId=o['orderId'], sta='异常中'), headers=KH).get_json() or {}
    o = find_order(gid)
    f3 = fee_of(o['id'])
    print('  改状态:', r3.get('msg'), '| 订单状态', o.get('orderSta'), '| 结账状态', (f3 or {}).get('settingSta'),
          '| 订单 isSettStatus', o.get('isSettStatus'), '| 账单数', bill_count())

    print('\n[4] 删除订单')
    rd = kf.post('/OrderAjax/DelOrderByidx', data=dict(idx=o['orderId']), headers=KH).get_json() or {}
    o = find_order(gid)
    f4 = fee_of(o['id'])
    print('  删除返回:', rd.get('msg'))
    print('  订单 isDel =', (o or {}).get('isDel'), '| 报酬记录', '还在' if f4 else '已删', '| 账单数', bill_count())
    if f4 and o.get('isDel') == 'Y':
        NOTES.append('订单已删除但 emp_pay 报酬记录仍在（isDelEmp 未传时后端保留），报酬页会出现已删订单的行')

    purge()
    print('\n== 值得注意 ==')
    if not NOTES:
        print('（没有发现勾稽问题）')
    for n in NOTES:
        print('  ·', n)
