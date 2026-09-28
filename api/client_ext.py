# -*- coding: utf-8 -*-
"""客户端第二批功能：常用角色、订单评价、售后申请、订单会话、新客券/邀请有礼、自助报价器、打手风采、协议/注销、搜索；
以及后台侧：客户评价列表/回复、售后处理、客户端设置"""
import json, random, string, datetime
from flask import jsonify, request, session
from werkzeug.security import check_password_hash
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uname, uid, log, now, S, is_super
from .order import find_order, add_log, notify_customer, serialize
from .client import current_customer, need_login, _own_order, _integral_log, _me


def cs():
    return db.setting('clientSetting', {}) or {}


def _mask(name):
    name = name or ''
    return name[0] + '*' * max(1, len(name) - 1) if name else ''


# ---------------- 注册 / 下单 钩子 ----------------
def _gen_code():
    for _ in range(50):
        code = ''.join(random.choice('ABCDEFGHJKLMNPQRSTUVWXYZ23456789') for _ in range(6))
        if not db.first('customers', lambda r: r.get('inviteCode') == code):
            return code
    return str(int(datetime.datetime.now().timestamp()))[-8:]


def on_register(cu, invite_code):
    conf = cs()
    patch = dict(inviteCode=_gen_code())
    if conf.get('newCouponOn') == 'Y' and float(conf.get('newCouponValue') or 0) > 0:
        db.insert('client_coupons', dict(customerId=cu['id'], name=conf.get('newCouponName') or '新客首单券', faceValue=float(conf.get('newCouponValue') or 0), availableAmount=float(conf.get('newCouponMin') or 0),
                                         status='未使用', source='新客礼'))
        db.insert('client_notices', dict(customerId=cu['id'], orderId=0, orderNo='', title='新客礼已到账', content='送你一张 %s 元「%s」，下单时可直接抵扣。' % (conf.get('newCouponValue'), conf.get('newCouponName') or '新客首单券'), isRead='N'))
    if invite_code and conf.get('inviteOn') == 'Y':
        inviter = db.first('customers', lambda r: r.get('inviteCode') == invite_code and r['id'] != cu['id'])
        if inviter:
            patch['invitedBy'] = inviter['id']
            gain = int(float(conf.get('inviteeReward') or 0))
            if gain > 0:
                patch['integral'] = int(cu.get('integral') or 0) + gain
                _integral_log(cu['id'], gain, '通过邀请码注册奖励')
            db.insert('client_notices', dict(customerId=inviter['id'], orderId=0, orderNo='', title='邀请成功', content='你邀请的好友 %s 已注册，TA 首次付款下单后你将获得 %s 积分。' % (_mask(cu.get('bossName')), conf.get('inviteReward') or 0), isRead='N'))
    db.update('customers', cu['id'], patch)


def on_order_created(cu, o, paid, save_role=False, role_id=0):
    conf = cs()
    if paid and cu.get('invitedBy') and not cu.get('inviteRewarded') and conf.get('inviteOn') == 'Y':
        inviter = db.get('customers', cu['invitedBy'])
        gain = int(float(conf.get('inviteReward') or 0))
        if inviter and gain > 0:
            db.update('customers', inviter['id'], dict(integral=int(inviter.get('integral') or 0) + gain))
            _integral_log(inviter['id'], gain, '好友 %s 首单奖励' % _mask(cu.get('bossName')))
            db.insert('client_notices', dict(customerId=inviter['id'], orderId=0, orderNo='', title='邀请奖励到账', content='好友 %s 已完成首单，%d 积分已到账。' % (_mask(cu.get('bossName')), gain), isRead='N'))
        db.update('customers', cu['id'], dict(inviteRewarded='Y'))
    if role_id:
        r = db.get('client_roles', role_id)
        if r and r.get('customerId') == cu['id']:
            db.update('client_roles', role_id, dict(lastUsed=now(), useCount=int(r.get('useCount') or 0) + 1))
    elif save_role and o.get('roleName'):
        dup = db.first('client_roles', lambda r: r.get('customerId') == cu['id'] and r.get('gameName') == o.get('gameName') and r.get('roleName') == o.get('roleName') and r.get('gameArea') == o.get('gameArea'))
        if not dup:
            db.insert('client_roles', dict(customerId=cu['id'], gameId=o.get('gameId') or 0, gameName=o.get('gameName'), gameArea=o.get('gameArea') or '', gameServer=o.get('gameServer') or '', gameJob=o.get('gameJob') or '',
                                           gameGroup=o.get('gameGroup') or '', roleName=o.get('roleName'), gameAcc=o.get('gameAcc') or '', gamePwd=o.get('gamePwd') or '', lastUsed=now(), useCount=1))


# ---------------- 我的游戏角色 ----------------
def _role_row(r, with_pwd=False):
    d = dict(id=r['id'], gameId=r.get('gameId') or 0, gameName=r.get('gameName'), gameArea=r.get('gameArea') or '', gameServer=r.get('gameServer') or '', gameJob=r.get('gameJob') or '', gameGroup=r.get('gameGroup') or '',
             roleName=r.get('roleName'), gameAcc=r.get('gameAcc') or '', hasPwd=bool(r.get('gamePwd')), lastUsed=(r.get('lastUsed') or '')[:10], useCount=r.get('useCount') or 0)
    if with_pwd:
        d['gamePwd'] = r.get('gamePwd') or ''
    return d


@route('/api/client/roles', public=True)
def roles_list():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('client_roles', lambda r: r.get('customerId') == cu['id'], 'lastUsed')
    game = P().get('gameName')
    if game:
        rows = [r for r in rows if r.get('gameName') == game]
    return json_ok('', data=[_role_row(r, with_pwd=bool(game)) for r in rows])


@route('/api/client/roles/save', public=True)
def roles_save():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    gm = db.get('games', p.get('gameId')) or db.first('games', lambda x: x.get('gameName') == p.get('gameName'))
    if not gm:
        return json_err('请选择游戏')
    if not (p.get('roleName') or '').strip():
        return json_err('请填写角色名')
    d = dict(customerId=cu['id'], gameId=gm['id'], gameName=gm['gameName'], gameArea=(p.get('gameArea') or '').strip(), gameServer=(p.get('gameServer') or '').strip(), gameJob=(p.get('gameJob') or '').strip(),
             gameGroup=(p.get('gameGroup') or '').strip(), roleName=p.get('roleName').strip()[:30], gameAcc=(p.get('gameAcc') or '').strip()[:50])
    rid = p.int('id')
    old = db.get('client_roles', rid) if rid else None
    if old and old.get('customerId') != cu['id']:
        return json_err('角色不存在')
    if p.get('gamePwd'):
        d['gamePwd'] = p.get('gamePwd').strip()[:50]
    if old:
        db.update('client_roles', rid, d)
        return json_ok('已保存')
    if db.count('client_roles', lambda r: r.get('customerId') == cu['id']) >= 20:
        return json_err('最多保存 20 个角色')
    d.update(lastUsed=now(), useCount=0)
    db.insert('client_roles', d)
    return json_ok('已保存')


@route('/api/client/roles/del', public=True)
def roles_del():
    cu = current_customer()
    if not cu:
        return need_login()
    r = db.get('client_roles', P().int('id'))
    if not r or r.get('customerId') != cu['id']:
        return json_err('角色不存在')
    db.delete('client_roles', r['id'])
    return json_ok('已删除')


# ---------------- 订单评价 ----------------
@route('/api/client/order/review', public=True)
def order_review():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    if o.get('orderSta') != '已完成':
        return json_err('订单完成后才能评价')
    if db.first('order_reviews', lambda r: r.get('orderId') == o['id']):
        return json_err('该订单已评价过')
    p = P()
    stars = p.int('stars')
    if not 1 <= stars <= 5:
        return json_err('请选择 1-5 星')
    content = (p.get('content') or '').strip()[:300]
    db.insert('order_reviews', dict(orderId=o['id'], orderNo=o.get('orderIdView'), customerId=cu['id'], customerName=cu.get('bossName'), gameName=o.get('gameName'), project=o.get('project'),
                                    recMan=o.get('recMan') or 0, recManName=o.get('recManName') or '', stars=stars, content=content, reply='', replyTime=''))
    add_log(o, '客户评价：%d 星%s' % (stars, ('，' + content) if content else ''), '评价', user=cu.get('bossName'))
    bonus = 5
    db.update('customers', cu['id'], dict(integral=int(cu.get('integral') or 0) + bonus))
    _integral_log(cu['id'], bonus, '评价订单 %s 奖励' % o.get('orderIdView'))
    for u in [x for x in db.all_('users') if x['id'] == o.get('recMan') or x.get('userName') == o.get('kefu')]:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='客户评价（订单 %s）' % o.get('orderIdView'), content='%s 给了 %d 星%s' % (cu.get('bossName'), stars, ('：' + content) if content else ''), sendUserName='客户端', isRead='N', orderId=o.get('orderIdView')))
    return json_ok('感谢评价，已奖励 %d 积分' % bonus)


# ---------------- 售后 / 投诉 ----------------
AFTERSALE_TYPES = ('退款', '投诉', '补打')


@route('/api/client/order/aftersale', public=True)
def order_aftersale():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    if o.get('orderSta') in ('未分配', '待上号'):
        return json_err('订单还没开打，可以直接撤销订单')
    if o.get('orderSta') in ('已退单', '已撤销'):
        return json_err('订单已结束')
    if db.first('aftersales', lambda a: a.get('orderId') == o['id'] and a.get('status') in ('待处理', '处理中')):
        return json_err('该订单已有正在处理的售后申请')
    p = P()
    t = p.get('type') if p.get('type') in AFTERSALE_TYPES else '投诉'
    reason = (p.get('reason') or '').strip()
    if len(reason) < 5:
        return json_err('请描述问题（至少 5 个字）')
    amount = min(p.float('amount'), float(o.get('price') or 0)) if t == '退款' else 0
    a = db.insert('aftersales', dict(orderId=o['id'], orderNo=o.get('orderIdView'), customerId=cu['id'], customerName=cu.get('bossName'), phone=cu.get('phone'), gameName=o.get('gameName'), project=o.get('project'),
                                     type=t, reason=reason[:500], amount=amount, status='待处理', result='', refundAmount=0, handler='', handleTime=''))
    add_log(o, '客户提交售后申请（%s）：%s' % (t, reason[:100]), '售后', user=cu.get('bossName'))
    for u in [x for x in db.all_('users') if x.get('userName') == o.get('kefu')] or [x for x in db.all_('users') if x.get('jobName') in ('客服', '系统管理员') and x.get('sta') != 'N']:
        db.insert('messages', dict(userId=u['id'], msgType=10, title='售后申请（订单 %s）' % o.get('orderIdView'), content='客户【%s】申请%s：%s' % (cu.get('bossName'), t, reason[:100]), sendUserName='客户端', isRead='N', orderId=o.get('orderIdView')))
    return json_ok('已提交，客服会尽快处理', data=dict(id=a['id']))


@route('/api/client/aftersales', public=True)
def aftersales_mine():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('aftersales', lambda a: a.get('customerId') == cu['id'], 'createTime')
    return json_ok('', data=[dict(id=a['id'], oid=a.get('orderId'), orderNo=a.get('orderNo'), project=a.get('project'), type=a.get('type'), reason=a.get('reason'), amount=a.get('amount'), status=a.get('status'),
                                  result=a.get('result') or '', refundAmount=a.get('refundAmount') or 0, time=(a.get('createTime') or '')[:16], handleTime=(a.get('handleTime') or '')[:16]) for a in rows])


# ---------------- 订单会话（客户留言 + 客服回复） ----------------
@route('/api/client/order/chat', public=True)
def order_chat():
    cu = current_customer()
    if not cu:
        return need_login()
    o = _own_order(cu)
    if not o:
        return json_err('订单不存在')
    msgs = []
    for l in sorted(db.find('order_logs', lambda l: l.get('orderId') == o['id']), key=lambda l: l.get('createTime') or ''):
        t = l.get('logType')
        if t == '客户':
            msgs.append(dict(mine=True, content=(l.get('content') or '').replace('客户留言：', '', 1), time=(l.get('createTime') or '')[:16]))
        elif t == '回复':
            msgs.append(dict(mine=False, content=(l.get('content') or '').replace('客服回复：', '', 1).replace('回复客户消息：', '', 1), time=(l.get('createTime') or '')[:16], who=l.get('userName') or '客服'))
        elif t == '状态':
            msgs.append(dict(system=True, content=(l.get('content') or ''), time=(l.get('createTime') or '')[:16]))
    for n in db.find('client_notices', lambda n: n.get('customerId') == cu['id'] and n.get('orderId') == o['id'] and n.get('isRead') != 'Y'):
        db.update('client_notices', n['id'], dict(isRead='Y'))
    return json_ok('', data=dict(orderNo=o.get('orderIdView'), project=o.get('project'), orderSta=o.get('orderSta'), kefu=o.get('kefu') or '客服', msgs=msgs, canMessage=o.get('orderSta') not in ('已退单', '已撤销')))


# ---------------- 邀请有礼 ----------------
@route('/api/client/invite', public=True)
def invite():
    cu = current_customer()
    if not cu:
        return need_login()
    conf = cs()
    if not cu.get('inviteCode'):
        db.update('customers', cu['id'], dict(inviteCode=_gen_code()))
        cu = db.get('customers', cu['id'])
    friends = db.find('customers', lambda r: r.get('invitedBy') == cu['id'], 'createTime')
    return json_ok('', data=dict(on=conf.get('inviteOn') == 'Y', code=cu.get('inviteCode'), link=request.host_url.rstrip('/') + '/app/#/register?invite=' + cu.get('inviteCode'),
                                 reward=int(float(conf.get('inviteReward') or 0)), inviteeReward=int(float(conf.get('inviteeReward') or 0)),
                                 friends=[dict(name=_mask(f.get('bossName')), time=(f.get('createTime') or '')[:10], rewarded=f.get('inviteRewarded') == 'Y') for f in friends]))


# ---------------- 自助报价器（复用后台报价器数据） ----------------
def _calc_games():
    rows = db.all_('price_calc')
    priced = {}
    for r in rows:
        if float(r.get('DAmount') or 0) > 0 or float(r.get('PAmount') or 0) > 0:
            priced.setdefault(r.get('gameName'), set()).add(r.get('project'))
    return priced


@route('/api/client/calc/games', public=True)
def calc_games():
    priced = _calc_games()
    return json_ok('', data=[dict(name=g, projects=sorted(ps, key=lambda x: (0 if '段位' in x else 1, x))) for g, ps in sorted(priced.items())])


@route('/api/client/calc/ladder', public=True)
def calc_ladder():
    from .pricecalc import _rows, _base, _packages, _is_dw
    p = P()
    game, project = p.get('gameName'), p.get('project')
    if not game or not project:
        return json_err('参数错误')
    rows = _rows(game, project)
    m = _base(game, project)
    pk = [x[0] for x in _packages(m)] or [m.get('packgeName') or '标准套餐']
    if _is_dw(project):
        data = [dict(id=r['id'], l1=r.get('LeveName1'), l2=r.get('LeveName2')) for r in rows]
    else:
        data = [dict(id=r['id'], start=r.get('StartPoint'), end=r.get('EndPoint')) for r in rows]
    return json_ok('', data=dict(isDw=_is_dw(project), rows=data, packages=pk, hasStay=bool(m.get('stay_rate')), ios=bool(m.get('iosPercent'))))


@route('/api/client/calc/quote', public=True)
def calc_quote():
    from .pricecalc import compute_quote
    items, err = compute_quote(P().all())
    if err:
        return json_err(err)
    return json_ok('', data=items)


# ---------------- 打手风采 ----------------
@route('/api/client/boosters', public=True)
def boosters():
    users = [u for u in db.all_('users') if u.get('jobName') == '打手' and u.get('sta') != 'N']
    orders = [o for o in db.all_('orders') if o.get('isDel') != 'Y' and o.get('orderSta') == '已完成']
    reviews = db.all_('order_reviews')
    out = []
    for u in users:
        done = len([o for o in orders if str(o.get('recMan') or '') == str(u['id'])])
        rv = [r for r in reviews if str(r.get('recMan') or '') == str(u['id'])]
        avg = round(sum(float(r.get('stars') or 0) for r in rv) / len(rv), 1) if rv else 0
        out.append(dict(id=u['id'], name=u.get('userName'), games=[x for x in str(u.get('games') or '').split(',') if x and x != '全部游戏'][:6], done=done, rating=avg, reviews=len(rv),
                        photo=u.get('photo') or '', tags=[t for t in str(u.get('mark') or '').split(',') if t][:3], recent=[dict(stars=r.get('stars'), content=r.get('content'), name=_mask(r.get('customerName'))) for r in rv[-3:]]))
    out.sort(key=lambda x: (-x['rating'], -x['done']))
    return json_ok('', data=out)


# ---------------- 协议 / 隐私 / 注销 / 搜索 ----------------
@route('/api/client/legal', public=True)
def legal():
    conf = cs()
    return json_ok('', data=dict(agreement=conf.get('agreement') or '', privacy=conf.get('privacy') or '', company=db.system_info().get('company', '')))


@route('/api/client/close', public=True)
def close_account():
    cu = current_customer()
    if not cu:
        return need_login()
    if not check_password_hash(cu.get('pwdHash') or '', P().get('pwd') or ''):
        return json_err('密码不正确')
    if [o for o in db.all_('orders') if o.get('customerId') == cu['id'] and o.get('isDel') != 'Y' and o.get('orderSta') not in ('已完成', '已退单', '已撤销')]:
        return json_err('还有进行中的订单，完成后才能注销')
    db.update('customers', cu['id'], dict(isDisabled='Y', closedTime=now(), loginAcc='', pwdHash='', bossName=(cu.get('bossName') or '') + '（已注销）', remark=((cu.get('remark') or '') + ' 客户端注销').strip()))
    session.pop('cid', None)
    log('会员', '客户【%s】在客户端注销账号' % cu.get('bossName'))
    return json_ok('账号已注销')


@route('/api/client/search', public=True)
def search():
    kw = (P().get('key') or '').strip()
    if not kw:
        return json_ok('', data=dict(games=[], projects=[], items=[]))
    games = [dict(id=g['id'], name=g['gameName']) for g in db.all_('games') if g.get('gameName') != '全部游戏' and kw in g['gameName']][:6]
    projects = [dict(id=r['id'], gameId=r.get('gameId'), gameName=r.get('gameName'), name=r.get('projectName'), price=r.get('price') or 0) for r in db.all_('projects') if kw in (r.get('projectName') or '') or kw in (r.get('gameName') or '')][:10]
    items = [dict(id=r['id'], title=r.get('title'), gameName=r.get('gameName'), price=r.get('price')) for r in db.all_('mp_shop_items') if r.get('status', 20) == 20 and (kw in (r.get('title') or '') or kw in (r.get('gameName') or ''))][:10]
    return json_ok('', data=dict(games=games, projects=projects, items=items))


# ================= 后台侧 =================
def _client_admin_guard(path):
    """后台客户端管理接口的函数层权限检查。

    app.dispatch() 已经会调用同一套守卫；这里再检查一次，避免测试、内部调用或
    后续路由改动绕过权限。返回 None 表示放行，否则返回可直接交给 Flask 的响应。
    """
    if not current_user():
        return json_err('请先登录'), 401
    from .guards import guard_module_request
    return guard_module_request(path)


@route('/OrderAjax/GetClientReviewList')
def admin_review_list():
    denied = _client_admin_guard('/orderajax/getclientreviewlist')
    if denied is not None:
        return denied
    p = P()
    rows = db.find('order_reviews', lambda r: db.like(r, ['orderNo', 'customerName', 'recManName', 'content', 'gameName'], p.get('key')), 'createTime')
    st = p.int('stars')
    if st:
        rows = [r for r in rows if int(r.get('stars') or 0) == st]
    u = current_user()
    if u and u.get('jobName') in ('打手', '代练员') and not is_super():
        rows = [r for r in rows if str(r.get('recMan') or '') == str(u['id'])]
    avg = round(sum(float(r.get('stars') or 0) for r in rows) / len(rows), 2) if rows else 0
    return paged([dict(r, id=r['id'], createTime=(r.get('createTime') or '')[:16]) for r in rows], total=dict(count=len(rows), avg=avg, good=len([r for r in rows if int(r.get('stars') or 0) >= 4])))


@route('/OrderAjax/ReplyClientReview')
def admin_review_reply():
    denied = _client_admin_guard('/orderajax/replyclientreview')
    if denied is not None:
        return denied
    p = P()
    r = db.get('order_reviews', p.int('id'))
    if not r:
        return json_err('记录不存在')
    u = current_user()
    if u and u.get('jobName') in ('打手', '代练员') and not is_super() and str(r.get('recMan') or '') != str(u['id']):
        return json_err('只能回复本人负责订单的评价'), 403
    txt = (p.get('reply') or '').strip()
    if not txt:
        return json_err('请输入回复内容')
    db.update('order_reviews', r['id'], dict(reply=txt[:300], replyTime=now(), replyUser=uname()))
    db.insert('client_notices', dict(customerId=r.get('customerId'), orderId=r.get('orderId'), orderNo=r.get('orderNo'), title='商家回复了你的评价', content=txt[:200], isRead='N'))
    return json_ok('已回复')


@route('/OrderAjax/GetAfterSaleList')
def admin_aftersale_list():
    denied = _client_admin_guard('/orderajax/getaftersalelist')
    if denied is not None:
        return denied
    p = P()
    rows = db.find('aftersales', lambda a: db.like(a, ['orderNo', 'customerName', 'phone', 'reason', 'project'], p.get('key')), 'createTime')
    st = p.get('status')
    if st and st != '全部':
        rows = [a for a in rows if a.get('status') == st]
    return paged([dict(a, id=a['id'], createTime=(a.get('createTime') or '')[:16], handleTime=(a.get('handleTime') or '')[:16]) for a in rows],
                 total=dict(count=len(rows), pending=len([a for a in rows if a.get('status') == '待处理'])))


@route('/OrderAjax/HandleAfterSale')
def admin_aftersale_handle():
    denied = _client_admin_guard('/orderajax/handleaftersale')
    if denied is not None:
        return denied
    p = P()
    a = db.get('aftersales', p.int('id'))
    if not a:
        return json_err('记录不存在')
    status = p.get('status')
    if status not in ('处理中', '已完成', '已驳回'):
        return json_err('状态不正确')
    result = (p.get('result') or '').strip()
    refund = p.float('refundAmount')
    o = db.get('orders', a.get('orderId'))
    if refund < 0:
        return json_err('退款金额不能为负数')
    patch = dict(status=status, result=result[:300], handler=uname(), handleTime=now())
    if status == '已完成' and refund > 0:
        requested = float(a.get('amount') or 0)
        if refund > requested:
            return json_err('退款金额不能超过客户申请金额')
        if a.get('refundAmount'):
            return json_err('该申请已退过款')
        cu = db.get('customers', a.get('customerId'))
        if not cu:
            return json_err('会员不存在')
        if o and refund > float(o.get('price') or 0):
            return json_err('退款金额不能超过订单实付金额')
        bal = round(float(cu.get('balance') or 0) + refund, 2)
        db.update('customers', cu['id'], dict(balance=bal))
        db.insert('customer_fees', dict(customerId=cu['id'], customerNo=cu.get('customerNo'), bossName=cu.get('bossName'), usageType='退款', amount=refund, giftAmount=0, balance=bal,
                                        orderNo=a.get('orderNo'), payMode='余额', remark='售后退款：' + result[:50], actionUserName=uname()))
        patch['refundAmount'] = refund
        if o:
            db.update('orders', o['id'], dict(refundFee=round(float(o.get('refundFee') or 0) + refund, 2), payStatus='已退款' if refund >= float(o.get('price') or 0) else o.get('payStatus')))
            add_log(o, '售后退款 %.2f 元回会员余额（%s）' % (refund, result[:50]), '退款')
    db.update('aftersales', a['id'], patch)
    if o:
        add_log(o, '售后申请%s：%s' % (status, result[:100]), '售后')
        notify_customer(o, '售后申请%s（订单 %s）' % (status, a.get('orderNo')), (result or '客服已处理') + (('，已退款 %.2f 元到余额' % refund) if patch.get('refundAmount') else ''))
    return json_ok('已处理')


@route('/SystemAjax/GetClientSetting')
def admin_client_setting_get():
    denied = _client_admin_guard('/systemajax/getclientsetting')
    if denied is not None:
        return denied
    return json_ok('', data=cs())


@route('/SystemAjax/SaveClientSetting')
def admin_client_setting_save():
    denied = _client_admin_guard('/systemajax/saveclientsetting')
    if denied is not None:
        return denied
    p = P()
    conf = cs()
    for k in ('newCouponOn', 'newCouponName', 'newCouponValue', 'newCouponMin', 'inviteOn', 'inviteReward', 'inviteeReward', 'activityOn', 'activityTitle', 'activityDesc', 'activityEnd', 'activityLink', 'agreement', 'privacy'):
        if k in p:
            conf[k] = (p.get(k) or '').strip() if isinstance(p.get(k), str) else p.get(k)
    for k in ('newCouponValue', 'newCouponMin', 'inviteReward', 'inviteeReward'):
        try:
            float(conf.get(k) or 0)
        except ValueError:
            return json_err('%s 请填写数字' % k)
    db.set_setting('clientSetting', conf)
    name = (p.get('companyName') or '').strip()
    if name:
        info = db.system_info()
        if info.get('company') != name:
            info['company'] = name
            db.set_system_info(info)
    log('设置', '修改客户端设置')
    return json_ok('保存成功（店铺名称改动刷新页面后生效）')


# ---------------- 系统圈子（后台主框架右上角有入口，客户端补上公开查询与发布）----------------
CIRCLE_MAX = 200


def _circle_row(r, cu):
    mine = bool(cu) and r.get('customerId') == cu['id']
    return dict(id=r['id'], gameName=r.get('gameName') or '全部游戏', content=r.get('content') or '',
                type='发单' if str(r.get('begissuance')) == '1' else '接单',
                wechat=r.get('wechat') or '', qq=r.get('qq') or '',
                system=r.get('releaseSystemName') or '', time=(r.get('createTime') or '')[:16],
                top=bool(r.get('top')), mine=mine)


def _circle_find(id_):
    cu = current_customer()
    if not cu:
        return None, need_login()
    try:
        rid = int(id_ or 0)
    except (TypeError, ValueError):
        return None, json_err('记录不存在')
    r = db.get('circle', rid)
    if not r or r.get('customerId') != cu['id']:
        return None, json_err('只能操作你自己发布的记录')
    return r, None


@route('/api/client/circle/list', public=True)
def circle_list():
    p = P()
    g = (p.get('gameName') or '').strip()
    cu = current_customer()
    rows = db.find('circle', lambda r: not g or g in ('全部游戏', '') or r.get('gameName') == g, 'createTime')
    items = [_circle_row(r, cu) for r in rows]
    return json_ok('', data=dict(topList=[x for x in items if x['top']][:6],
                                 normalList=[x for x in items if not x['top']],
                                 count=len(items), loggedIn=bool(cu), maxLen=CIRCLE_MAX))


@route('/api/client/circle/publish', public=True)
def circle_publish():
    cu = current_customer()
    if not cu:
        return need_login()
    p = P()
    content = (p.get('content') or '').strip()
    if not content:
        return json_err('请填写发布内容')
    if len(content) > CIRCLE_MAX:
        return json_err('内容不要超过 %d 个字符' % CIRCLE_MAX)
    if not ((p.get('wechat') or '').strip() or (p.get('qq') or '').strip()):
        return json_err('请至少留一个联系方式（微信或 QQ）')
    row = db.insert('circle', dict(gameName=(p.get('gameName') or '全部游戏').strip() or '全部游戏',
                                   content=content, wechat=(p.get('wechat') or '').strip(), qq=(p.get('qq') or '').strip(),
                                   begissuance='1' if str(p.get('type')) == '1' else '0',
                                   releaseSystemName=db.system_info()['company'], userId=0,
                                   customerId=cu['id'], customerName=cu.get('bossName') or '', top=False))
    return json_ok('发布成功', data=dict(id=row['id']))


@route('/api/client/circle/mine', public=True)
def circle_mine():
    cu = current_customer()
    if not cu:
        return need_login()
    rows = db.find('circle', lambda r: r.get('customerId') == cu['id'], 'createTime')
    return json_ok('', data=[_circle_row(r, cu) for r in rows])


@route('/api/client/circle/del', public=True)
def circle_del():
    r, err = _circle_find(P().get('id'))
    if err:
        return err
    db.delete('circle', r['id'])
    return json_ok('已删除')


@route('/api/client/circle/refresh', public=True)
def circle_refresh():
    """把自己那条顶上来（原站叫 RePush）"""
    r, err = _circle_find(P().get('id'))
    if err:
        return err
    db.update('circle', r['id'], dict(createTime=db.now_str()))
    return json_ok('已刷新')


# ---------------- 避坑板（只读查询：只给被举报对象与原因，不暴露举报人和证据图）----------------
@route('/api/client/blacklist/search', public=True)
def blacklist_search():
    kw = (P().get('key') or '').strip()
    if not kw:
        return json_err('请输入要查询的手机号 / 微信号 / QQ 或昵称')
    rows = [r for r in db.all_('blacklist_board')
            if db.like(r, ['phone', 'qq', 'wx', 'content', 'jdpName', 'bussineName'], kw)]
    out = [dict(id=r['id'], name=r.get('bussineName') or r.get('jdpName') or '', roleType=r.get('roleType') or '',
                content=r.get('content') or '', fee=r.get('fee') or 0, time=(r.get('createTime') or '')[:10])
           for r in rows[:50]]
    return json_ok('', data=dict(list=out, count=len(out)))
