# -*- coding: utf-8 -*-
"""财务相关：打手与客服报酬、结算、经营报表、账本、学习资料、QA、结算排行等"""
import json, datetime, collections
from flask import jsonify, request
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now, S
from .game import resolve_game
from .order import find_order, add_log, dec


def _game_filter(rows, g, field='gameName'):
    if g and g not in ('全部游戏', '全部', '0'):
        gm = resolve_game(g)
        name = gm['gameName'] if gm else g
        if name != '全部游戏':
            rows = [r for r in rows if r.get(field) == name]
    return rows


def _time_filter(rows, st, et, field='createTime'):
    st, et = dec(st)[:19], dec(et)[:19]
    if st:
        rows = [r for r in rows if (r.get(field) or '') >= st]
    if et:
        rows = [r for r in rows if (r.get(field) or '') <= (et if len(et) > 10 else et + ' 23:59:59')]
    return rows


def _emp_rows(mine_only=False):
    rows = db.all_('emp_pay')
    if mine_only:
        rows = [r for r in rows if r.get('userId') == uid()]
    out = []
    for r in rows:
        o = db.get('orders', r.get('orderId'))
        d = dict(r, empPayId=r['id'], empId=r['id'])
        if o:
            d.update(orderSta=o.get('orderSta'), wangwang=o.get('WangWang'), orderIdView=o.get('orderIdView'), orderId=o.get('orderIdView') or r.get('orderIdView'),
                     sysOrderId=str(o.get('orderId')), gameRole=o.get('roleName'), dlProject=o.get('project'), gameName=o.get('gameName'), price=o.get('price'),
                     netReceipts=o.get('netReceipts'), refundFee=o.get('refundFee', 0), isSettStatus=o.get('isSettStatus'), imgCount=len(o.get('imgs') or []))
        out.append(d)
    return out


# ---------------- 打手与客服报酬 ----------------
@route('/EmpAjax/GetEmpList')
def emp_list():
    p = P()
    rows = _emp_rows()
    rows = _game_filter(rows, p.get('gameName'))
    tf = {'10': 'createTime', '20': 'completeTime', '25': 'createTime', '40': 'completeTime', '30': 'settingTime'}.get(p.get('dateType') or '20', 'completeTime')
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'), tf)
    ss = p.get('settingSta')
    if ss:
        rows = [r for r in rows if r.get('settingSta') == ss]
    fs = p.get('furlSta')
    if fs:
        rows = [r for r in rows if r.get('isSettStatus') == fs]
    osta = p.get('orderSta')
    if osta:
        rows = [r for r in rows if r.get('orderSta') == osta]
    ot = p.get('orderType')
    if ot in ('0', '1'):
        rows = [r for r in rows if r.get('bussType', 1) == (1 if ot == '0' else 2)]
    kw = dec(p.get('key') or p.get('key1') or p.get('userName'))
    if kw:
        rows = [r for r in rows if db.like(r, ['userName', 'orderId', 'orderIdView', 'gameRole', 'dlProject', 'wangwang', 'kefu'], kw)]
    kefu = dec(p.get('kefu') or p.get('inputOrderKefu'))
    if kefu:
        rows = [r for r in rows if r.get('kefu') == kefu]
    src = dec(p.get('orderSoure'))
    if src:
        rows = [r for r in rows if r.get('orderSoure') == src]
    rows.sort(key=lambda r: r.get('completeTime') or r.get('createTime') or '', reverse=True)
    tot = dict(totalTempAmount=round(sum(float(r.get('tempAmount') or 0) for r in rows), 2), totalBonusAmount=round(sum(float(r.get('bonusAmount') or 0) for r in rows), 2),
               totalDeductFee=round(sum(float(r.get('deductFee') or 0) for r in rows), 2), totalOrderPrice=round(sum(float(r.get('price') or 0) for r in rows), 2),
               TotalReFundAmount=round(sum(float(r.get('refundFee') or 0) for r in rows), 2), totalCount=len(rows),
               totalNoSetAmount=round(sum(float(r.get('tempAmount') or 0) - float(r.get('deductFee') or 0) for r in rows if r.get('settingSta') != 'Y'), 2))
    return paged(rows, total=tot)


@route('/EmpAjax/GetMyEmp')
def my_emp():
    p = P()
    rows = _emp_rows(True)
    rows = _game_filter(rows, p.get('gameName'))
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'), 'completeTime')
    ss = p.get('settingSta')
    if ss:
        rows = [r for r in rows if r.get('settingSta') == ss]
    rows.sort(key=lambda r: r.get('completeTime') or '', reverse=True)
    nos = [r for r in rows if r.get('settingSta') != 'Y']; yes = [r for r in rows if r.get('settingSta') == 'Y']
    tot = dict(totalTempAmount=round(sum(float(r.get('tempAmount') or 0) for r in rows), 2), totalBonusAmount=round(sum(float(r.get('bonusAmount') or 0) for r in rows), 2), totalCount=len(rows),
               totalNoSetAmount=round(sum(float(r.get('tempAmount') or 0) for r in nos), 2), totalNoSetCount=len(nos),
               totalSetAmount=round(sum(float(r.get('tempAmount') or 0) for r in yes), 2), totalSetCount=len(yes))
    return paged(rows, total=tot)


@route('/EmpAjax/ChangeOrderRecPrice')
def emp_change_price():
    p = P()
    r = db.get('emp_pay', p.int('empId'))
    if not r:
        return json_err('记录不存在')
    if r.get('settingSta') == 'Y' and S('SK23', 'N') != 'Y':
        return json_err('系统设置：已结算的账单不允许编辑')
    fee = p.float('fee')
    t = p.get('type')
    if t in ('bonus', '2', '20'):
        db.update('emp_pay', r['id'], dict(bonusAmount=fee))
    elif t in ('deduct', '3', '30'):
        db.update('emp_pay', r['id'], dict(deductFee=fee))
    else:
        db.update('emp_pay', r['id'], dict(tempAmount=fee))
        o = db.get('orders', r.get('orderId'))
        if o:
            db.update('orders', o['id'], dict(recFee=fee))
    log('结算', '修改【%s】报酬为 %s' % (r.get('userName'), fee), orderId=str(r.get('orderIdView')))
    return json_ok('修改成功')


@route('/EmpAjax/ChangeEmpRemark')
def emp_remark():
    p = P()
    r = db.get('emp_pay', p.int('idx'))
    if not r:
        return json_err('记录不存在')
    db.update('emp_pay', r['id'], dict(empRemark=p.get('remark')))
    return json_ok('修改成功')


@route('/EmpAjax/DelEmp')
def del_emp():
    p = P()
    for x in p.ids('empId') or [p.int('empId')]:
        if x:
            db.delete('emp_pay', x)
    return json_ok('删除成功')


@route('/EmpAjax/BatchDeductFee')
def batch_deduct():
    p = P()
    try:
        f = json.loads(request.get_data(as_text=True) or '{}')
    except ValueError:
        f = p.all()
    fee = float(f.get('fee') or f.get('deductFee') or 0)
    ids = f.get('ids') or f.get('empIds') or ''
    ids = ids if isinstance(ids, list) else [x for x in str(ids).split(',') if x]
    for x in ids:
        r = db.get('emp_pay', x)
        if r:
            db.update('emp_pay', r['id'], dict(deductFee=round(float(r.get('deductFee') or 0) + fee, 2), empRemark=(r.get('empRemark') or '') + ' 扣款:' + str(f.get('remark') or '')))
    return json_ok('批量扣款完成')


@route('/EmpAjax/ApplicationEmp')
def application_emp():
    p = P()
    r = db.get('emp_pay', p.int('empId'))
    if not r or r.get('userId') != uid():
        return json_err('记录不存在')
    db.update('emp_pay', r['id'], dict(applicationSett='Y'))
    return json_ok('已申请结算，请等待财务处理')


@route('/EmpAjax/SynchEmpOrderToMySystem')
def synch_emp():
    return json_err('本地版未绑定下家系统')


@route(['/EmpAjax/GetLingyuefangzhouSystemSettleBalance', '/EmpAjax/GetJdpBalance', '/EmpAjax/GetBalanceAndFreeAmount'])
def settle_balance():
    s = db.system_info()
    return jsonify(dict(code=1, msg=s.get('balance', '0.00'), data=dict(balance=float(s.get('balance') or 0), freeAmount=0.0, frozen=0.0)))


@route(['/EmpAjax/AcceptSettAgreenMent'])
def accept_sett_agreement():
    db.update('users', uid(), dict(settAgree='Y'))
    return json_ok('已同意')


@route(['/EmpAjax/CheckOnlinePaySetRecName', '/EmpAjax/OnlinePaySetRec', '/EmpAjax/OnlinePaySetRecGetFailResult', '/EmpAjax/RefshPlatformOrderStatusByTaoBao'])
def online_pay_stub():
    return json_err('客户商户支付宝应用及商家转账权限尚未配置，无法在线打款；请先使用线下结算')


# ---------------- 结算（线下）----------------
@route(['/EmpAjax/SettlementEmp', '/EmpAjax/SettlementEmpByIds', '/EmpAjax/SaveSettlement'])
def settlement():
    p = P()
    ids = p.ids('ids') or p.ids('empIds') or p.ids('empId')
    if not ids:
        return json_err('请选择要结算的记录')
    groups = collections.defaultdict(list)
    for x in ids:
        r = db.get('emp_pay', x)
        if r and r.get('settingSta') != 'Y':
            groups[r['userId']].append(r)
    if not groups:
        return json_err('所选记录已全部结算')
    for uid_, lst in groups.items():
        amt = round(sum(float(r.get('tempAmount') or 0) + float(r.get('bonusAmount') or 0) - float(r.get('deductFee') or 0) for r in lst), 2)
        b = db.insert('bills', dict(userId=uid_, userName=lst[0]['userName'], amount=amt, billTime=now(), billUserName=uname(), payMode='线下', remark=p.get('remark') or '', none=''))
        for r in lst:
            db.update('emp_pay', r['id'], dict(settingSta='Y', settingTime=now(), billId=b['id'], logUserName=uname()))
            db.insert('bill_details', dict(billId=b['id'], userName=r['userName'], tempBonus=r.get('tempAmount'), realAmount=round(float(r.get('tempAmount') or 0) + float(r.get('bonusAmount') or 0) - float(r.get('deductFee') or 0), 2),
                                           orderId=r.get('orderIdView'), project=r.get('dlProject'), billTime=b['billTime'], billUserName=uname(), gameRole=r.get('gameRole')))
            o = db.get('orders', r.get('orderId'))
            if o:
                db.update('orders', o['id'], dict(isSettStatus='已结算'))
        db.insert('messages', dict(userId=uid_, msgType=20, title='结算通知', content='财务已为你结算 %s 笔订单，合计 %s 元' % (len(lst), amt), sendUserName=uname(), isRead='N', orderId=''))
        log('结算', '给【%s】结算 %s 笔共 %s 元' % (lst[0]['userName'], len(lst), amt))
    return json_ok('结算完成')


@route('/Emp/ExportEmp')
def export_emp_file():
    """结算记录导出（页面「导出记录」按钮 → window.open('/Emp/ExportEmp?...')）。
    原站导出 xls；本地版用 openpyxl 生成 xlsx，没装该库时回退 CSV（都带 BOM，Excel 不乱码）。"""
    from flask import Response
    p = P()
    rows = db.all_('bills')
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'), 'billTime')
    kw = dec(p.get('key') or p.get('userName'))
    if kw:
        rows = [r for r in rows if db.like(r, ['userName', 'billUserName'], kw)]
    rows.sort(key=lambda r: r.get('billTime') or '', reverse=True)
    head = ['结算时间', '人员', '结算人', '金额', '支付方式', '备注']
    body = [[r.get('billTime', ''), r.get('userName', ''), r.get('billUserName', ''),
             float(r.get('amount') or 0), r.get('payMode', ''), r.get('remark', '')] for r in rows]
    try:
        import io as _io
        from openpyxl import Workbook
        wb = Workbook()
        ws = wb.active
        ws.title = '结算记录'
        ws.append(head)
        for row in body:
            ws.append(row)
        buf = _io.BytesIO()
        wb.save(buf)
        return Response(buf.getvalue(),
                        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        headers={'Content-Disposition': 'attachment; filename=billsummary.xlsx'})
    except ImportError:
        import csv, io as _io
        sio = _io.StringIO()
        w = csv.writer(sio)
        w.writerow(head)
        w.writerows(body)
        return Response('\ufeff' + sio.getvalue(), mimetype='text/csv; charset=utf-8',
                        headers={'Content-Disposition': 'attachment; filename=billsummary.csv'})


@route('/EmpAjax/GetBillSummaryList')
def bill_summary():
    p = P()
    rows = db.all_('bills')
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'), 'billTime')
    kw = dec(p.get('key') or p.get('userName'))
    if kw:
        rows = [r for r in rows if db.like(r, ['userName', 'billUserName'], kw)]
    rows.sort(key=lambda r: r.get('billTime') or '', reverse=True)
    return paged([dict(r, billId=r['id']) for r in rows], total=dict(amount=round(sum(float(r.get('amount') or 0) for r in rows), 2)))


@route('/EmpAjax/GetBillSummaryDetailsList')
def bill_details():
    p = P()
    bid = p.int('billId') or p.int('id')
    rows = db.find('bill_details', lambda r: (not bid or r.get('billId') == bid) and db.like(r, ['userName', 'orderId', 'project'], dec(p.get('key'))), 'billTime')
    return paged(rows)


@route(['/EmpAjax/GetMyOnLineBillSummaryList', '/EmpAjax/GetOnLineBillSummaryList'])
def online_bill_list():
    p = P()
    rows = [r for r in db.all_('bills') if r.get('payMode') == '支付宝在线' and r.get('payTranOrderNo')]
    if 'MyOnLine' in request.path:
        rows = [r for r in rows if r.get('userId') == uid()]
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'), 'billTime')
    rows.sort(key=lambda r: r.get('billTime') or '', reverse=True)
    out = [dict(r, payAmount=r.get('amount'), realAmount=r.get('amount'), serviceAmount=0, recAlipayAcc=(db.get('users', r.get('userId')) or {}).get('alipayAcc', ''),
                payTranOrderNo=r.get('payTranOrderNo'), payUserName=r.get('billUserName'), none='') for r in rows]
    amt = round(sum(float(r.get('amount') or 0) for r in rows), 2)
    return paged(out, total=dict(totalCount=len(rows), totalPayAmount=amt, totalRealAmount=amt))


@route('/EmpAjax/GetMyOnlineBillSummaryDetailsList')
def online_bill_details():
    p = P()
    bid = p.int('billId') or p.int('id')
    bill = db.get('bills', bid)
    if not bill or bill.get('payMode') != '支付宝在线' or not bill.get('payTranOrderNo'):
        return paged([])
    rows = db.find('bill_details', lambda r: r.get('billId') == bid)
    return paged(rows)


@route('/EmpAjax/GetBindAlipaySettAuthList')
def alipay_auth_list():
    """列表字段沿用原站命名：str1 账号 str8 名称 id8 通道 str2 服务签约状态 str13 功能授权状态 str3 申请时间 str4 授权时间 str6 备注 str10/str11 解除授权 str7 操作人"""
    p = P()
    src = p.get('getSoure')
    rows = db.all_('alipay_auth')
    if src not in ('', '-1', None):
        rows = [r for r in rows if str(r.get('id8')) == str(src)]
    return paged([dict(r, bid=r['id'], str5=r.get('bizId', '')) for r in rows])


@route('/EmpAjax/AddBindAlipaySettAuthData')
def add_alipay_auth():
    p = P()
    acc = (p.get('alipayAcc') or '').strip()
    if not acc:
        return json_err('请输入付款支付宝账号')
    if db.first('alipay_auth', lambda r: r.get('str1') == acc):
        return json_err('该支付宝账号已添加过')
    db.insert('alipay_auth', dict(str1=acc, str8=p.get('alipayAccName'), id8=p.int('channel'), str2='待商户配置', str13='未授权', str3=now(), str4='', str6=p.get('remark'), str10='', str11='',
                                  str7=uname(), none='', bizId=''))
    return json_ok('账号已登记；须配置客户商户应用及商家转账权限后才可在线结算')


@route(['/EmpAjax/DeleteBindAlipaySettAuth'])
def del_alipay_auth():
    p = P()
    for x in p.ids('bid'):
        db.delete('alipay_auth', x)
    return json_ok('删除成功')


@route('/EmpAjax/ModityBindAlipaySettAuthRemarkResetAuth')
def modify_alipay_auth():
    p = P()
    r = db.get('alipay_auth', p.int('bid'))
    if not r:
        return json_err('记录不存在')
    t = p.get('modityType')
    if t == '2':
        db.update('alipay_auth', r['id'], dict(str2='待商户配置', str13='未授权', str3=now(), str10='', str11=''))
        return json_ok('已标记待配置；尚未向支付宝发起授权')
    if t == '3':
        db.update('alipay_auth', r['id'], dict(str2='已解除', str13='已解除', str10=now(), str11=p.get('remark') or '手动解除'))
        return json_ok('已解除授权')
    db.update('alipay_auth', r['id'], dict(str6=p.get('remark')))
    return json_ok('备注已修改')


@route('/EmpAjax/GetFundDetailsListData')
def fund_details():
    rows = db.find('fund_details', None, 'CreateTime')
    return paged(rows, Insum=round(sum(float(r.get('Amount') or 0) for r in rows if float(r.get('Amount') or 0) > 0), 2),
                 Outsum=round(-sum(float(r.get('Amount') or 0) for r in rows if float(r.get('Amount') or 0) < 0), 2))


# ---------------- 客服接发单统计 / 经营报表 ----------------
def _orders_between(g, st, et, field='createTime'):
    rows = [o for o in db.all_('orders') if o.get('isDel') != 'Y']
    rows = _game_filter(rows, g)
    return _time_filter(rows, st, et, field)


@route('/EmpAjax/GetSalesmanStatistics')
def salesman_statistics():
    p = P()
    rows = _orders_between(p.get('gameName'), p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'))
    by = collections.defaultdict(list)
    for o in rows:
        by[o.get('kefu') or '未知'].append(o)
    out = []
    keys = {'DSH': '待上号', 'DLZ': '代练中', 'DYS': '待验收', 'YWC': '已完成', 'YZT': '已暂停', 'WTD': '问题单', 'YTD': '已退单'}
    for k, lst in by.items():
        d = dict(Kefu=k, TotalCount=len(lst), TotalPrice=round(sum(float(o.get('price') or 0) for o in lst), 2),
                 effectivePerformance=round(sum(float(o.get('price') or 0) for o in lst if o.get('orderSta') not in ('已退单',)), 2),
                 customerCount=len(set(o.get('customerId') for o in lst if o.get('customerId'))), customerPrice=0)
        for code, sta in keys.items():
            sub = [o for o in lst if o.get('orderSta') == sta]
            d[code] = len(sub); d[code + 'Amount'] = round(sum(float(o.get('price') or 0) for o in sub), 2)
        out.append(d)
    out.sort(key=lambda r: -r['TotalPrice'])
    return paged(out)


@route('/EmpAjax/GetOperationData')
def operation_data():
    """按来源饼图"""
    p = P()
    rows = [o for o in _orders_between(p.get('gameName'), p.get('stime'), p.get('etime')) if o.get('orderSta') != '已退单']
    by = collections.defaultdict(float)
    for o in rows:
        by[o.get('orderSoure') or '未知来源'] += float(o.get('price') or 0)
    legend = sorted(by, key=lambda k: -by[k])
    return jsonify(dict(code=1, msg=dict(total=round(sum(by.values()), 2), legend=dict(data=legend), series=dict(data=[dict(name=k, value=round(by[k], 2)) for k in legend]))))


@route('/EmpAjax/GetKeFuOperationData')
def kefu_operation_data():
    p = P()
    rows = _orders_between(p.get('gameName'), p.get('stime'), p.get('etime'))
    kefu = dec(p.get('kefu'))
    if kefu:
        rows = [o for o in rows if o.get('kefu') in kefu.split(',')]
    by = collections.defaultdict(lambda: [0, 0.0, 0])
    for o in rows:
        k = o.get('kefu') or '未知'
        by[k][0] += 1
        if o.get('orderSta') == '已退单':
            by[k][2] += 1
        else:
            by[k][1] += float(o.get('price') or 0)
    days = sorted(by, key=lambda k: -by[k][1])
    return jsonify(dict(code=1, msg=dict(days=days, maxnumber=max([v[0] for v in by.values()] + [10]), maxprice=max([v[1] for v in by.values()] + [100]), maxrnumber=max([v[2] for v in by.values()] + [5]),
                                         series=dict(ordernumber=[by[k][0] for k in days], data=[round(by[k][1], 2) for k in days], returnnumber=[by[k][2] for k in days]))))


@route('/EmpAjax/GetTotalPriceTrendReport')
def trend_report():
    p = P()
    rows = _game_filter([o for o in db.all_('orders') if o.get('isDel') != 'Y'], p.get('gameName'))
    name = dec(p.get('name'))
    if name:
        rows = [o for o in rows if o.get('kefu') in name.split(',')]
    by = collections.defaultdict(lambda: [0, 0.0])
    for o in rows:
        m = (o.get('createTime') or '')[:7]
        if m:
            by[m][0] += 1; by[m][1] += float(o.get('price') or 0)
    months = sorted(by)[-12:]
    out, prev = [], None
    for m in months:
        c, s = by[m]
        out.append(dict(name=m[5:].lstrip('0') or '0', count=c, sum=round(s, 2), countRaise=(round((c - prev[0]) * 100.0 / prev[0], 1) if prev and prev[0] else 0), sumRaise=(round((s - prev[1]) * 100.0 / prev[1], 1) if prev and prev[1] else 0)))
        prev = (c, s)
    return json_ok('', data=out)


@route('/EmpAjax/GetOrderConseTypeByCondition')
def order_type_pie():
    p = P()
    rows = [o for o in _orders_between(p.get('gameName'), p.get('sDate'), p.get('eDate')) if o.get('orderSta') != '已退单']
    name = dec(p.get('name'))
    if name:
        rows = [o for o in rows if o.get('kefu') in name.split(',')]
    by = collections.defaultdict(float)
    for o in rows:
        by[o.get('projectTypeName') or '未分类'] += float(o.get('price') or 0)
    return json_ok('', data=json.dumps([dict(name=k, value=round(v, 2)) for k, v in sorted(by.items(), key=lambda x: -x[1])], ensure_ascii=False))


@route('/EmpAjax/GetSystemBuessionOperationData')
def business_summary():
    p = P()
    rows = _orders_between(p.get('gameName'), p.get('stime'), p.get('etime'))
    kefu = dec(p.get('kefu'))
    if kefu:
        rows = [o for o in rows if o.get('kefu') in kefu.split(',')]
    price = sum(float(o.get('price') or 0) for o in rows)
    fee = sum(float(o.get('recFee') or 0) for o in rows)
    refund = sum(float(o.get('refundFee') or 0) for o in rows)
    return json_ok('', data=dict(totalProfit=round(price - fee - refund, 2), totalPrice=round(price, 2), totalRecFee=round(fee, 2), totalReFundAmount=round(refund, 2), count=len(rows)))


@route('/EmpAjax/GetRecOrderRankList')
def rec_order_rank():
    p = P()
    rows = _orders_between(p.get('gameName'), p.get('stime'), p.get('etime'))
    by = collections.defaultdict(lambda: [0, 0.0])
    for o in rows:
        if o.get('recManName'):
            by[o['recManName']][0] += 1; by[o['recManName']][1] += float(o.get('recFee') or 0)
    t = p.get('type')
    lst = sorted(by.items(), key=lambda x: -(x[1][1] if t == '2' else x[1][0]))
    return json_ok('', data=[dict(rank=i + 1, userName=k, count=v[0], amount=round(v[1], 2)) for i, (k, v) in enumerate(lst)])


# ---------------- 日常账本 ----------------
@route('/EmpAjax/GetBookList')
def book_list():
    p = P()
    rows = db.all_('books')
    rows = _time_filter(rows, p.get('stime') or p.get('sDate'), p.get('etime') or p.get('eDate'))
    bt = p.get('bookType')
    if bt:
        rows = [r for r in rows if r.get('bookType') == bt]
    kw = dec(p.get('key') or p.get('title'))
    if kw:
        rows = [r for r in rows if db.like(r, ['title', 'remark', 'userName'], kw)]
    un = dec(p.get('userName') or p.get('userList'))
    if un:
        rows = [r for r in rows if r.get('userName') in un.split(',') or str(r.get('userId')) in un.split(',')]
    rows.sort(key=lambda r: r.get('createTime') or '', reverse=True)
    inc = round(sum(float(r.get('price') or 0) for r in rows if r.get('bookType') == '收入'), 2)
    exp = round(sum(float(r.get('price') or 0) for r in rows if r.get('bookType') == '支出'), 2)
    return paged([dict(r, bookId=r['id']) for r in rows], total=dict(totalIncomeFee=inc, totalExpenditureFee=exp, profit=round(inc - exp, 2)))


@route('/EmpAjax/AddEditBook')
def add_edit_book():
    p = P()
    d = dict(title=p.get('title').strip(), remark=p.get('remark'), price=p.float('price'), bookType=p.get('bookType') or '支出', imgUrl=p.get('imgUrl'), userName=uname(), userId=uid())
    if not d['title']:
        return json_err('标题不能为空')
    bid = p.int('bookId')
    if bid and db.get('books', bid):
        db.update('books', bid, d)
        return json_ok('修改成功')
    if p.get('createTime'):
        d['createTime'] = p.get('createTime')
    db.insert('books', d)
    return json_ok('记账成功')


@route('/EmpAjax/DelBook')
def del_book():
    db.delete('books', P().int('bookId'))
    return json_ok('删除成功')


# ---------------- 学习资料 / QA ----------------
@route('/EmpAjax/GetLearmInformationList')
def learn_list():
    p = P()
    rows = db.find('learn_info', lambda r: db.like(r, ['title', 'keys', 'tips', 'content'], dec(p.get('key'))), 'createTime')
    return paged(rows)


@route('/EmpAjax/AddEditLearmInformation')
def add_edit_learn():
    p = P()
    d = dict(title=p.get('title').strip(), keys=p.get('keys'), tips=p.get('tips'), content=p.get('content'), userName=uname())
    if not d['title']:
        return json_err('标题不能为空')
    lid = p.int('id')
    if lid and db.get('learn_info', lid):
        db.update('learn_info', lid, d)
        return json_ok('修改成功')
    db.insert('learn_info', d)
    return json_ok('新增成功')


@route('/EmpAjax/DelLearmInformation')
def del_learn():
    for x in P().ids('ids'):
        db.delete('learn_info', x)
    return json_ok('删除成功')


@route(['/EmpAjax/GetQAList', '/EmpAjax/GetQACenterList'])
def qa_list():
    p = P()
    kw = dec(p.get('seachKey') or p.get('key'))
    rows = db.find('qa', lambda r: db.like(r, ['question', 'answer', 'typeName'], kw), 'createTime')
    return paged(rows)


@route('/EmpAjax/AddEditQATypeName')
def add_edit_qa_type():
    p = P()
    t = p.get('type')
    if t in ('del', 'delete', '3'):
        db.delete('qa_types', p.int('id'))
        return json_ok('删除成功')
    qid = p.int('id')
    if qid and db.get('qa_types', qid):
        db.update('qa_types', qid, dict(name=p.get('value')))
        return json_ok('修改成功')
    db.insert('qa_types', dict(name=p.get('value')))
    return json_ok('新增成功')


@route(['/EmpAjax/AddEditQA', '/EmpAjax/SaveQA'])
def add_edit_qa():
    p = P()
    d = dict(question=p.get('question') or p.get('title'), answer=p.get('answer') or p.get('content'), typeName=p.get('typeName'), userName=uname())
    qid = p.int('id')
    if qid and db.get('qa', qid):
        db.update('qa', qid, d)
        return json_ok('修改成功')
    db.insert('qa', dict(d, hot=0))
    return json_ok('新增成功')


@route(['/EmpAjax/DelQA'])
def del_qa():
    db.delete('qa', P().int('id'))
    return json_ok('删除成功')


@route('/EmpAjax/GetPrivatePhoneCallLogList')
def phone_call_logs():
    rows = db.find('phone_call_logs', None, 'createTime')
    return paged(rows, total=dict(totalCount=len(rows), totalFee=round(sum(float(r.get('consumeFee') or 0) for r in rows), 2), totalTime=sum(int(r.get('callTimeLength') or 0) for r in rows)))


@route('/EmpAjax/ChangePrivatePhoneCallLogRemark')
def phone_call_remark():
    p = P()
    for x in p.ids('ids'):
        db.update('phone_call_logs', x, dict(remark=p.get('remark')))
    return json_ok('修改成功')


@route('/EmpAjax/GetOrderEmpLogs')
def order_emp_logs():
    o = find_order(P().get('orderId'))
    rows = db.find('emp_pay', lambda r: o and r.get('orderId') == o['id']) if o else []
    return paged([dict(r, empId=r['id']) for r in rows])
