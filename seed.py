# -*- coding: utf-8 -*-
"""首次启动写入的示例数据（可删除 data/app.db 重新生成）"""
import os, json, random, datetime
import db
from werkzeug.security import generate_password_hash

BASE = os.path.dirname(os.path.abspath(__file__))
R = random.Random(20260919)
NOW = datetime.datetime.now()


def ts(days_ago=0, hours=None, minute=None):
    d = NOW - datetime.timedelta(days=days_ago)
    d = d.replace(hour=hours if hours is not None else R.randint(8, 23), minute=minute if minute is not None else R.randint(0, 59), second=R.randint(0, 59))
    return d.strftime('%Y-%m-%d %H:%M:%S')


GAMES = [  # (gameId, gameName, isDefulat, isMoblieGame, isPw, orderNum)
    (21714, '全部游戏', 'N', 'N', 'N', 200), (21708, '崩坏：星穹铁道', 'Y', 'N', 'N', 101), (21701, '原神', 'N', 'Y', 'N', 100),
    (21703, '三角洲行动', 'N', 'Y', 'N', 99), (21704, '鸣潮', 'N', 'N', 'N', 98), (21706, '绝区零', 'N', 'N', 'N', 97),
    (21707, '无限暖暖', 'N', 'N', 'N', 96), (21722, '遗忘之海', 'N', 'N', 'N', 95), (21721, '异环', 'N', 'N', 'N', 94),
    (21720, '王者荣耀世界', 'N', 'Y', 'N', 93), (21719, '洛克王国：世界', 'N', 'N', 'N', 92), (21718, '逆战：未来', 'N', 'N', 'N', 91),
    (21717, '明日方舟：终末地', 'N', 'N', 'N', 90), (21716, '燕云十六声', 'N', 'N', 'N', 89),
]
GAME_DATA = {  # gameName -> {type: [names]}   20=大区/平台 30=服务器 40=职业 50=阵营
    '崩坏：星穹铁道': {20: ['官服', 'B服', '国际服'], 30: ['星穹列车', '无名客', '开拓者'], 40: ['毁灭', '巡猎', '智识', '同谐', '虚无', '存护', '丰饶', '记忆'], 50: []},
    '原神': {20: ['官服', 'B服', '国际服', 'PS服'], 30: ['天空岛', '世界树'], 40: ['火', '水', '风', '雷', '草', '冰', '岩'], 50: []},
    '三角洲行动': {20: ['官方', 'Steam', '手游'], 30: ['电信区', '网通区'], 40: ['突击', '支援', '工程', '侦察'], 50: []},
    '鸣潮': {20: ['官服', 'B服', '国际服'], 30: ['索拉里斯', '今州'], 40: ['冷凝', '热熔', '导电', '气动', '衍射', '湮灭'], 50: []},
    '绝区零': {20: ['官服', 'B服', '国际服'], 30: ['新艾利都'], 40: ['强攻', '击破', '异常', '支援', '防护'], 50: []},
    '燕云十六声': {20: ['官服', '手游'], 30: ['清河', '开封', '汴京'], 40: ['刀', '剑', '枪', '扇'], 50: ['大宋', '辽国']},
    '王者荣耀世界': {20: ['官服'], 30: ['长安', '稷下'], 40: ['战士', '法师', '射手', '刺客', '辅助'], 50: []},
}
ORDER_TYPES = ['等级代练', '深渊代练', '材料代刷', '成就代做', '剧情代做', '陪玩', '账号代肝', '首通', '周本', '活动代做']
PROJECTS = {
    '崩坏：星穹铁道': [('模拟宇宙全通', 120), ('忘却之庭12层满星', 200), ('虚构叙事满星', 150), ('日常委托一周', 60), ('开拓等级70', 300), ('末日幻影满星', 180)],
    '原神': [('深渊12层满星', 180), ('世界任务全清', 260), ('每日委托一周', 50), ('活动全清', 90), ('探索度100%（一图）', 220), ('幻想真境剧诗满星', 150)],
    '三角洲行动': [('烽火地带带打', 80), ('全面战场上分', 60), ('赛季手册满级', 200), ('金色战备代打', 120)],
    '鸣潮': [('深塔满星', 150), ('联觉等级60', 300), ('全图探索', 240), ('日常一周', 50)],
    '绝区零': [('式舆防卫战满星', 150), ('绳网等级50', 260), ('危局强袭战', 120), ('日常一周', 50)],
    '燕云十六声': [('主线全通', 300), ('副本带打', 100), ('等级代练', 200)],
    '王者荣耀世界': [('等级代练', 150), ('主线通关', 200)],
}
SOURCES = ['淘宝店-云序工作室', '淘宝店-小铺子', '拼多多店', '闲鱼', '微信客户', 'QQ客户', '代练通', '游戏交易平台', '老客户介绍', '抖音']
STATUSES = ['未分配', '待上号', '代练中', '待验收', '已完成', '已暂停', '问题单', '已退单', '已完成', '已完成', '代练中', '代练中', '未分配']
ROLE_NAMES = ['星河', '月见', '苍穹', '流光', '夜雨', '晴空', '青鸾', '白露', '风铃', '墨染', '云归', '沐阳', '初雪', '疏影', '暮色', '烟岚', '溪桥', '砚台', '芷若', '阑珊']
SURNAMES = '王李张刘陈杨黄赵周吴徐孙马朱胡郭林何高罗'
GIVEN = ['伟', '芳', '娜', '敏', '静', '磊', '强', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞', '平', '刚', '桂英', '文']
ROLES = [  # roleName, remark, isSuper
    ('系统管理员', '拥有全部权限', True), ('老板', '查看经营数据、结算', False), ('客服', '录单、跟单、回复客户', False),
    ('打手', '接单、上号、提交验收', False), ('财务', '结算、账本、报表', False), ('团长', '排团、指派、验收', False),
]


def person():
    return R.choice(SURNAMES) + R.choice(GIVEN)


def phone():
    return '1' + R.choice('3456789') + ''.join(R.choice('0123456789') for _ in range(9))


def seed_all():
    from api.system import all_menu_keys
    MENU_KEYS = all_menu_keys()
    db.set_system_info(dict(id=5819, company='云序工作室', jdpId=66253, jdpKey='LOCAL-DEMO-KEY', ownerAccount='138****0000', balance='0.00', smsLeft=0,
                            phoneMinutes=0, taobaoAppId='0000000000000000000', expireTime=(NOW + datetime.timedelta(days=365)).strftime('%Y/%m/%d %H:%M:%S'),
                            version='20260501'))
    # ---- 角色（职位）与权限
    role_ids = {}
    for name, remark, sup in ROLES:
        perms = MENU_KEYS if sup or name == '老板' else {
            '客服': [k for k in MENU_KEYS if k.split('/')[0] in ('index', 'order', 'customer', 'user', 'emp') and not k.startswith('system')],
            '打手': ['index/console', 'order/myorderlist', 'order/insiderecorderlist', 'emp/myemp', 'emp/mybillsummary', 'user/myinfo', 'user/mymessage',
                   'order/exceptionorderlog', 'group/mygroup', 'gameaccounts/myaccountlist', 'emp/qacenter', 'emp/learminformationlist'],
            '财务': [k for k in MENU_KEYS if k.split('/')[0] in ('index', 'emp', 'customer', 'order', 'user')],
            '团长': [k for k in MENU_KEYS if k.split('/')[0] in ('index', 'order', 'group', 'gameaccounts', 'emp', 'user')],
        }.get(name, ['index/console'])
        r = db.insert('roles', dict(roleName=name, remark=remark, isSuper=sup, permissions=perms, createTime=ts(400)))
        role_ids[name] = r['id']

    # ---- 人员
    def add_user(acc, pwd, name, role, **kw):
        d = dict(loginAcc=acc, pwdHash=generate_password_hash(pwd), userName=name, rname=kw.pop('rname', ''), jobId=role_ids[role], jobName=role,
                 isSuper=(role == '系统管理员'), qq=kw.pop('qq', ''), moblie=kw.pop('moblie', ''), email=kw.pop('email', ''), remark=kw.pop('remark', ''),
                 sta='Y', bussType=kw.pop('bussType', 1), signStatus='N', insureAmount=0, recOrderMaxCount=kw.pop('recOrderMaxCount', 5),
                 complateRate=kw.pop('complateRate', 100), recPriceMinValue=0, isExcuseLoginVer='N', isAutoSett='N', isProhibitSettStatus='N',
                 isNeedPrivatePhone='N', prohibitedViewOrderPwd='N', isProhibitPublicRecOrder='N', forbidViewOrderContent='N', mark='',
                 games=kw.pop('games', '全部游戏'), orderBy=kw.pop('orderBy', 0), createUserName='系统', userType=kw.pop('userType', 0),
                 alipayAcc=kw.pop('alipayAcc', ''), alipayName='', photo='/images/user.jpg', lastLoginTime=ts(R.randint(0, 5)),
                 createTime=kw.pop('createTime', ts(R.randint(30, 400))), isCert='N', lastRecOrderDate='')
        d.update(kw)
        return db.insert('users', d)

    admin = add_user('1234567890', '394607', '测试用', '系统管理员', remark='初始管理员账号', createTime=ts(14))
    add_user('boss', '123456', '老板', '老板')
    for n in ['小晴', '小雨', '阿岚']:
        add_user('kf' + n, '123456', n, '客服', games='全部游戏', qq=str(R.randint(100000000, 999999999)))
    for n in ['星尘', '暮光', '晨曦', '夜枭', '追风', '凌霄', '疾影', '苍狼', '雷鸣', '霜华', '飞羽', '沧海']:
        add_user('ds' + n, '123456', n, '打手', games=R.choice(['全部游戏', '崩坏：星穹铁道,原神', '三角洲行动', '原神,鸣潮,绝区零']),
                 complateRate=R.randint(80, 100), recOrderMaxCount=R.randint(3, 8), alipayAcc=f'{n}@example.com')
    add_user('cw01', '123456', '财务小张', '财务')
    add_user('tz01', '123456', '团长老周', '团长', games='燕云十六声,王者荣耀世界')
    users = db.all_('users')
    kefus = [u for u in users if u['jobName'] == '客服']
    dashou = [u for u in users if u['jobName'] == '打手']
    db.insert('user_groups', dict(groupName='管理层', containJobName='系统管理员,老板,财务'))
    db.insert('user_groups', dict(groupName='执行层', containJobName='客服,打手,团长'))

    # ---- 游戏 / 区服职业 / 分类 / 项目
    for gid, name, dflt, mob, pw, order in GAMES:
        db.insert_with_id('games', gid, dict(gameId=gid, gameName=name, isDefulat=dflt, isMoblieGame=mob, isPw=pw, isNotAccPwd='N', isDisbleSendSms=0, orderNum=order))
    gid_of = {name: gid for gid, name, *_ in GAMES}
    for gname, types in GAME_DATA.items():
        area_ids = []
        for t in (20, 40, 50, 30):
            for i, n in enumerate(types.get(t, [])):
                if t == 30:  # 服务器挂在每个大区下
                    for aid in area_ids:
                        db.insert('game_data', dict(gameId=gid_of[gname], gameName=gname, type=t, name=n, orderBy=len(types[t]) - i, parentId=aid))
                else:
                    r = db.insert('game_data', dict(gameId=gid_of[gname], gameName=gname, type=t, name=n, orderBy=len(types[t]) - i, parentId=0))
                    if t == 20:
                        area_ids.append(r['id'])
    for gname in PROJECTS:
        for i, t in enumerate(ORDER_TYPES[:R.randint(4, 8)]):
            db.insert('order_types', dict(gameId=gid_of[gname], gameName=gname, TypeName=t, OrderBy=100 - i, assPlatName='', AppendTitleByFront='', AppendTitleByEnd=''))
        for i, (pn, price) in enumerate(PROJECTS[gname]):
            db.insert('projects', dict(gameId=gid_of[gname], gameName=gname, projectName=pn, orderBy=100 - i, price=price, hours=R.choice([12, 24, 48, 72, 120]), remark=''))

    # ---- 来源 / 标签 / 会员等级 / 客户
    for i, s in enumerate(SOURCES):
        db.insert('sources', dict(soureName=s, remark='', shopType=('淘宝' if '淘宝' in s else '拼多多' if '拼多多' in s else '其它'), smsSign='', doNotSendSms='N', orderBy=100 - i, status='Y'))
    for name, color, kw in [('加急', '#FF5722', '加急,急'), ('VIP客户', '#FFB800', 'vip'), ('复购', '#5FB878', ''), ('售后', '#1E9FFF', '售后,补'), ('大单', '#a233c6', '')]:
        db.insert('labels', dict(labelName=name, gameName='全部游戏', remark='', keywords=kw, colorValue=color, labelStatus='Y', orderBy=10))
    levels = [('普通会员', 0, 999, 0), ('银卡会员', 1000, 4999, 0.97), ('金卡会员', 5000, 19999, 0.95), ('钻石会员', 20000, 999999, 0.9)]
    for i, (n, a, b, disc) in enumerate(levels):
        db.insert('customer_levels', dict(Index=i + 1, BusinessTypeId=1, StartValue=a, EndValue=b, IntervalName=n, LevelDiscount=disc, LevelNote='累计消费达标自动升级', ExtensionStr=''))
    customers = []
    for i in range(18):
        total = R.choice([0, 300, 800, 1500, 2600, 5200, 9800, 15000, 26000])
        lvl = next(l for l in reversed(levels) if total >= l[1])
        customers.append(db.insert('customers', dict(customerNo='C%05d' % (1001 + i), bossName=R.choice(ROLE_NAMES) + '老板', levelName=lvl[0], phone=phone(),
                                                     loginAcc='', wxNo='wx_' + str(R.randint(1000, 9999)), buyDiscount=lvl[3], platName=R.choice(SOURCES), arrearsNote='',
                                                     balance=R.choice([0, 0, 50, 120, 300, 800]), totalConsAmount=total, historRecharge=R.choice([0, 500, 1000, 3000]),
                                                     levelGap='', servicePerson=R.choice(kefus)['userName'], createUser=R.choice(kefus)['userName'], tips='', remark='',
                                                     brithDay='', createTime=ts(R.randint(5, 300)), createPersonUserNicke='', qq='', integral=R.randint(0, 800), discountLevelInfluence='Y')))

    # ---- 订单
    orders = []
    pending_logs = []
    for i in range(160):
        gname = R.choice(list(PROJECTS.keys()))
        pn, price = R.choice(PROJECTS[gname])
        days_ago = R.randint(0, 60) if i > 20 else R.randint(0, 2)
        sta = R.choice(STATUSES) if days_ago > 0 else R.choice(['未分配', '待上号', '代练中', '未分配'])
        rec = R.choice(dashou) if sta != '未分配' else None
        kefu = R.choice(kefus)
        throw = round(price * R.uniform(1.15, 1.6))
        recfee = round(price * R.uniform(0.55, 0.8))
        gd = GAME_DATA.get(gname, {})
        cust = R.choice(customers)
        seq = 26090001 + i
        o = dict(orderId=NOW.strftime('%Y%m%d') + '%012d' % seq, orderIdView='%s%03d' % (NOW.strftime('%y%m%d'), i + 1) if days_ago == 0 else 'TB' + str(R.randint(10 ** 12, 10 ** 13 - 1)),
                 roleName=R.choice(ROLE_NAMES) + R.choice(['', '', '·' + R.choice('一二三四五')]), gameId=gid_of[gname], gameName=gname,
                 gameArea=R.choice(gd.get(20) or ['']), gameServer=R.choice(gd.get(30) or ['']), gameJob=R.choice(gd.get(40) or ['']), gameGroup=R.choice(gd.get(40) or ['']),
                 project=pn, projectTypeName=R.choice(ORDER_TYPES[:5]), orderContent=pn + '，要求' + R.choice(['尽快完成', '安全第一', '不要使用外挂', '完成后截图', '每天汇报进度']),
                 gameInfo='等级%d' % R.randint(20, 70), orderSta=sta, price=throw, recFee=recfee, netReceipts=throw, refundFee=(throw if sta == '已退单' else 0), originPrice=throw,
                 serviceAmount=0, discount=100, payMethod=R.choice([0, 0, 0, 10, 20]), orderSoure=cust['platName'], WangWang=cust['bossName'], qq=cust['wxNo'],
                 customerId=cust['id'], phone=cust['phone'], recMan=rec['id'] if rec else 0, recManName=rec['userName'] if rec else '', kefu=kefu['userName'], kefuId=kefu['id'],
                 assUserName=kefu['userName'], inputOrderManName=kefu['userName'], addOrderUserId=kefu['id'], orderRemark=R.choice(['', '', '客户要求晚上打', '号有二次验证', '老客户，优先']),
                 dynamicRemark='', itemRemark='', otherRemark='', jiwei=R.choice(['', '', 'A1', 'B2', 'C3']), levelMark='', customizeTag='', orderLabel='', orderLabelColor='',
                 gameAcc='acc' + str(R.randint(10000, 99999)), gamePwd='pwd' + str(R.randint(1000, 9999)), isLock='N', isDel='N', isJiaJi=R.choice(['N', 'N', 'N', 'Y']),
                 isThrowOrder='N', isSplitOrder='N', isAutoAssignment='N', isPushJdp='N', pushJdpOrderState='', tid='', fromId='', isRead='Y',
                 isSettStatus=('已结算' if sta == '已完成' and R.random() < 0.7 else '未结算'),
                 recSettCount=0, throwCount=0, backListId=0, groupMangeUid=0, taskId=0, taskName='', splitId=0, openItem='', openValue='', tip='', hide='N',
                 isAllowChangeOrderFee='Y', refundModel='', refundTimeStr='', refundUserName='', autoAssignmentManName='', bussType=(2 if '陪玩' in pn else 1),
                 days=R.choice([1, 2, 3, 5, 7]), hours=R.choice([0, 0, 12]), orderHoursDescStr='', createTime=ts(days_ago), recOrderTime=(ts(days_ago) if rec else ''),
                 startTime=(ts(days_ago) if sta in ('代练中', '待验收', '已完成') else ''), completeTime=(ts(max(0, days_ago - R.randint(0, 3))) if sta == '已完成' else ''),
                 delTime='', delUserName='', labels=[], imgs=[])
        o = db.insert('orders', o)
        orders.append(o)
        order_id = o['id']
        db.insert('order_logs', dict(orderId=order_id, content='录入订单', userName=kefu['userName'], logType='录单', createTime=o['createTime']))
        if rec:
            db.insert('order_logs', dict(orderId=order_id, content='指派给打手【%s】接单价%s元' % (rec['userName'], recfee), userName=kefu['userName'], logType='指派', createTime=o['recOrderTime']))
        if sta == '已完成':
            db.insert('order_logs', dict(orderId=order_id, content='订单已完成，验收通过', userName=kefu['userName'], logType='完成', createTime=o['completeTime']))
            db.insert('emp_pay', dict(empPayId=order_id, userId=rec['id'], userName=rec['userName'], orderId=order_id, orderIdView=o['orderIdView'], gameName=gname, gameRole=o['roleName'],
                                      dlProject=pn, tempAmount=recfee, bonusAmount=0, deductFee=0, price=throw, netReceipts=throw, refundFee=0, empType='打手', taskId=0, imgCount=0,
                                      kefu=kefu['userName'], orderSta=sta, wangwang=o['WangWang'], taobaoPrice=throw, taobaoSta='', createTime=o['createTime'], completeTime=o['completeTime'],
                                      exceedHours=0, logUserName=kefu['userName'], settingSta=('Y' if o['isSettStatus'] == '已结算' else 'N'),
                                      settingTime=(o['completeTime'] if o['isSettStatus'] == '已结算' else ''), applicationSett='N', empRemark='', payMode=1, orderSoure=o['orderSoure']))
    for o in orders[-6:]:  # 回收站
        db.update('orders', o['id'], dict(isDel='Y', delTime=ts(1), delUserName=admin['userName']))

    # ---- 结算 / 账本 / 公告 / 资料 / QA / 短信 / 消息 / 日志
    for d in dashou[:8]:
        amt = round(R.uniform(300, 3000), 2)
        b = db.insert('bills', dict(userId=d['id'], userName=d['userName'], amount=amt, billTime=ts(R.randint(1, 30)), billUserName='财务小张', payMode='支付宝', remark='', none=''))
        for k in range(R.randint(2, 5)):
            db.insert('bill_details', dict(billId=b['id'], userName=d['userName'], tempBonus=round(amt / 3, 2), realAmount=round(amt / 3, 2), orderId=R.choice(orders)['orderIdView'],
                                           project=R.choice(PROJECTS['原神'])[0], billTime=b['billTime'], billUserName='财务小张'))
    for t, bt, pr in [('购买游戏号', '支出', 320), ('淘宝店推广费', '支出', 500), ('客户充值', '收入', 1000), ('服务器续费', '支出', 99), ('会员卡收入', '收入', 660), ('设备采购', '支出', 2399)]:
        db.insert('books', dict(title=t, remark='', price=pr, bookType=bt, imgUrl='', userName='财务小张', createTime=ts(R.randint(1, 40))))
    db.insert('learn_info', dict(title='新人打手上号规范', keys='上号,规范', tips='必看', content='<p>1. 上号前确认区服；2. 不得修改客户密码；3. 完成后截图上传。</p>', createTime=ts(30), userName='测试用'))
    db.insert('learn_info', dict(title='客服话术模板', keys='客服,话术', tips='', content='<p>您好，这里是云序工作室，请问需要代练哪款游戏？</p>', createTime=ts(25), userName='测试用'))
    db.insert('qa', dict(question='订单验收不通过怎么办？', answer='联系客服说明情况，补打后重新提交验收。', userName='测试用', createTime=ts(12), hot=5))
    db.insert('qa', dict(question='结算周期是多久？', answer='每周一结算上周已完成并验收通过的订单。', userName='测试用', createTime=ts(12), hot=3))
    for c, t in [('【云序工作室】您的订单{单号}已开始代练，如有疑问请联系客服。', '通知'), ('【云序工作室】您的订单{单号}已完成，请及时验收，感谢支持！', '通知'), ('【云序工作室】本店新活动上线，老客户下单享 9 折优惠。', '营销')]:
        db.insert('sms_templates', dict(tempID='T%d' % R.randint(1000, 9999), content=c, tempType=t, reviewSta='已通过', reviewRemark=''))
    for u in users:
        db.insert('messages', dict(userId=u['id'], msgType=0, title='欢迎您使用云序工作室管理系统',
                                   content='云序工作室为您开通了系统账户：%s，登录账号：%s，职位：%s，您可以正常登录且操作系统内有权限的内容了。' % (u['userName'], u['loginAcc'], u['jobName']),
                                   sendUserName='系统', createTime=u['createTime'], isRead='N', isViewNotification=None, isAutoPaySound=None, orderId=''))
    for i in range(30):
        u = R.choice(users)
        db.insert('checkin_logs', dict(userId=u['id'], loginAcc=u['loginAcc'], userName=u['userName'], roleName=u['jobName'], ip='192.168.3.%d' % R.randint(2, 200), computer='PC/Chrome',
                                       createTime=ts(R.randint(0, 20)), checkType='登录', remark=''))
    for o in orders[:40]:
        db.insert('system_logs', dict(joinOrderId=o['orderIdView'], logType='录单', soureOrderId='', gameRoleName=o['roleName'], gameName=o['gameName'], remark='录入订单 %s' % o['project'],
                                      userName=o['kefu'], createTime=o['createTime']))

    # ---- 游戏号库 / 排团 / 黑名单
    for i in range(14):
        gname = R.choice(list(GAME_DATA.keys())); gd = GAME_DATA[gname]
        db.insert('game_accounts', dict(gameAccId=1000 + i, sellTradeNo='', gameName=gname, gameId=gid_of[gname], gameRoleName=R.choice(ROLE_NAMES), gameGroup=R.choice(gd.get(50) or ['']),
                                        gameArea=R.choice(gd.get(20) or ['']), gameServer=R.choice(gd.get(30) or ['']), gameJob=R.choice(gd.get(40) or ['']), gameInfo='等级%d' % R.randint(30, 70), gameTF='',
                                        otherLevel='', otherMark='', Tips='', gameAcc='acc%05d' % R.randint(0, 99999), gamePwd='pwd' + str(R.randint(1000, 9999)), costPrice=R.choice([0, 200, 500, 800]),
                                        sellPrice=R.choice([0, 600, 1200, 2000]), profit=0, accStatus=R.choice([10, 10, 20, 50, 21]), accUseType=R.choice(['A', 'A', 'E', 'Z', 'C']),
                                        recUserName=R.choice(dashou)['userName'], createTime=ts(R.randint(1, 90)), tempDisableTime='', img='', remark='', jiwei=R.choice(['', 'A1', 'B2']),
                                        proStatus=R.choice([10, 20, 30, 50])))
    for i, (tn, gname) in enumerate([('燕云周常副本一团', '燕云十六声'), ('星铁忘却之庭速刷团', '崩坏：星穹铁道'), ('原神深渊满星团', '原神'), ('王者世界主线团', '王者荣耀世界')]):
        gd = GAME_DATA[gname]
        jobs = [dict(index=k + 1, jobName=j, needItemLevel='', gameTf='', postionPrice=R.choice([50, 80, 100]), remark='',
                     userName=(R.choice(dashou)['userName'] if R.random() < 0.6 else ''), orderId=0) for k, j in enumerate((gd.get(40) or ['成员'])[:5])]
        db.insert('pve_tasks', dict(taskId=100 + i, taskName=tn, proJectName=R.choice(PROJECTS[gname])[0], gameName=gname, gameId=gid_of[gname], gameArea=R.choice(gd.get(20) or ['']),
                                    leaderId=R.choice(dashou)['id'], leaderUserName=R.choice(dashou)['userName'], startTime=(_st := ts(R.randint(0, 3), 20, 0)), endTime=_st[:11] + '23:00' + _st[16:],
                                    taskStatus=R.choice(['A', 'B', 'B', 'C']), difficulty=R.choice(['普通', '困难', '史诗']), gameAccCount=len([j for j in jobs if j['userName']]), totalCount=len(jobs),
                                    postionAmount=sum(j['postionPrice'] for j in jobs), lackJobName=','.join(j['jobName'] for j in jobs if not j['userName']), orderId='', remark='', jobs=jobs,
                                    isPublic='N', orderBy=10 - i))
    db.insert('customer_backlist', dict(moblie=phone(), ww='恶意退款买家', qq='', backCount=2, lastTime=ts(15), remark='收货后恶意申请退款', addUserName='小晴'))
    db.insert('user_backlist', dict(moblie=phone(), ww='', qq='', rname='某某', cid='', yy='', alipayacc='', remark='接单后失联', lastTime=ts(40), addUserName='测试用'))

    # ---- 系统设置 / 录单识别 / 修正
    # 系统各项设置：以原站该租户的当前配置为默认值（data/system_setting_defs.json 由抓取页面提取）
    defs_path = os.path.join(BASE, 'data', 'system_setting_defs.json')
    sett = dict(ExpOdMax='2000', DefulatDLHours='1.0', SK152='0', recOrderInterval='0', PublicSeachOrderBulletin='')
    if os.path.exists(defs_path):
        for name, desc, cur, opts in json.load(open(defs_path, encoding='utf-8')):
            sett[name] = cur
    db.set_setting('system', sett)
    for t, k in [('角色名', '角色:|角色名:|ID:'), ('游戏账号', '账号:|帐号:'), ('游戏密码', '密码:'), ('大区', '区服:|大区:'), ('要求', '要求:|需求:')]:
        db.insert('auto_discern', dict(typeName=t, disKey=k, gameName='全部游戏'))
    for v, k, r in [('大区', '国服', '官服'), ('大区', '哔哩哔哩', 'B服'), ('职业', '同协', '同谐')]:
        db.insert('verify_keys', dict(veriType=v, key=k, resultStr=r, gameName='全部游戏'))
    seed_client_demo()
    seed_calc_demo()


def seed_client_demo():
    """客户端（/app）用的演示内容：公告/Banner、套餐商品、积分商品、抽奖奖品与设置、公开查单公告。后台“客户端内容管理”里可改"""
    if db.count('mp_news'):
        return
    db.insert('mp_news', dict(title='新客首单立减 10 元', newsType=20, coverImg='/upload/public/demo-cover.png', content='<p>新注册客户首单立减 10 元，余额支付再享会员折扣。</p><p>活动长期有效，最终解释权归本店。</p>', summary='新注册客户首单立减 10 元，余额支付再享会员折扣'))
    db.insert('mp_news', dict(title='下单须知：账号安全说明', newsType=10, coverImg='/upload/public/demo-cover.png', content='<p>1. 代练期间请勿登录游戏，以免顶号导致进度丢失。</p><p>2. 打手只会登录您提供的账号，完单后系统会自动清除密码。</p><p>3. 如遇问题请在订单详情里留言，客服会第一时间处理。</p>', summary='代练期间请勿登录游戏；完单后系统自动清除密码'))
    db.insert('mp_news', dict(title='国庆期间正常接单', newsType=10, coverImg='/upload/public/demo-cover.png', content='<p>国庆假期打手全员在线，上号时间可能略有延迟，感谢理解。</p>', summary='国庆假期打手全员在线，上号时间可能略有延迟'))
    projects = db.all_('projects')
    for i, pr in enumerate(projects[:12]):
        base = float(pr.get('price') or 0) or 50
        db.insert('mp_shop_items', dict(title='%s · %s 套餐' % (pr['gameName'], pr['projectName']), gameName=pr['gameName'], itemType=('上分' if i % 3 == 0 else '日常' if i % 3 == 1 else '陪玩'), price=round(base * 0.95, 0),
                                        yprice=base, img='', img3='', details='<p>项目：%s</p><p>预计 %s 小时完成，全程手动，可指定英雄/角色。</p><p>购买后请在订单里填写账号信息，客服会尽快安排。</p>' % (pr['projectName'], pr.get('hours') or 24),
                                        sellCount=R.randint(3, 60), status=20, isNeedGroup='N'))
    for name, ctype, stock, need, face, avail in [('5 元抵扣券', 20, 100, 500, 5, 30), ('20 元抵扣券', 20, 50, 1800, 20, 100), ('周边鼠标垫', 10, 20, 3000, 25, 0), ('视频会员月卡', 30, 30, 2500, 20, 0)]:
        db.insert('mp_integral', dict(cname=name, ctype=ctype, depositoryNumber=stock, needIntegral=need, faceValue=face, availableAmount=avail, coverImage='', commodityMask='<p>%s，兑换后请留意“我的兑换”里的发货状态。</p>' % name, exchangeCount=0, status=20))
    for title, atype, rng, val, stock in [('50 积分', 15, 30, 50, 999), ('2 元余额', 18, 10, 2, 200), ('谢谢参与', 20, 55, 0, 0), ('定制周边', 0, 5, 0, 10)]:
        db.insert('mp_awards', dict(title=title, atype=atype, cid=0, range=rng, prizeimg='', prizeValue=val, awardunit='积分', stockNumber=stock))
    db.set_setting('award', dict(awardStatus='10', awardamount='20', awardcount='3', awardWay='0', awardunit='积分'))
    db.insert('mp_fulldec', dict(shopItemId=0, fullValue=200, decValue=10))
    db.insert('mp_hydisc', dict(hyName='金卡会员', decValue=9.5))
    if not db.first('sources', lambda r: r.get('soureName') == '客户端下单'):
        db.insert('sources', dict(soureName='客户端下单', remark='客户在 /app 自助下单', shopType='其它', smsSign='', doNotSendSms='N', orderBy=50, status='Y'))
    db.insert('search_questions', dict(SeachQuestion_Title='下单后多久开始？', SeachQuestion_Content='<p>客服确认后通常 10-30 分钟内安排打手上号，高峰期以订单里的预计时间为准。</p>', Hot=10, Status='Y'))
    db.insert('search_questions', dict(SeachQuestion_Title='代练期间我能登录游戏吗？', SeachQuestion_Content='<p>不建议。顶号会导致打手掉线、进度丢失，如需登录请先在订单里留言。</p>', Hot=8, Status='Y'))
    db.insert('search_questions', dict(SeachQuestion_Title='怎么充值余额？', SeachQuestion_Content='<p>在“在线客服”留言或联系专属客服转账，客服确认后余额即时到账，余额下单可享会员折扣。</p>', Hot=6, Status='Y'))


# 新增菜单时的权限补齐：老库里的角色权限是明细列表，这里按“已有同组的某个键”自动补上新键（每次启动跑，幂等）
NEW_MENU_KEYS = {'order/clientreviews': 'order/clientordergenerate', 'order/aftersales': 'order/clientordergenerate', 'system/clientsetting': 'system/wechatappmange'}
CLIENT_SETTING_DEFAULT = dict(newCouponOn='Y', newCouponName='新客首单券', newCouponValue='10', newCouponMin='50', inviteOn='Y', inviteReward='100', inviteeReward='50',
                              activityOn='N', activityTitle='', activityDesc='', activityEnd='', activityLink='',
                              agreement='一、本平台提供游戏代练/陪玩服务，下单即表示您同意由本店打手登录您提供的账号完成代练。\n二、代练期间请勿登录游戏，因顶号造成的进度丢失由客户自行承担。\n三、订单开打前可在客户端自助撤单，开打后请通过售后申请处理。\n四、请勿提供他人账号或来源不明的账号下单。',
                              privacy='一、我们只收集完成订单所必需的信息：手机号、游戏账号与角色信息。\n二、游戏密码仅打手上号时可见，订单完成后系统自动清除。\n三、您可以在“个人中心”随时注销账号，注销后账号信息将被停用。\n四、我们不会向任何第三方出售您的个人信息。')


def migrate():
    for r in db.all_('roles'):
        perms = list(r.get('permissions') or [])
        add = [k for k, sib in NEW_MENU_KEYS.items() if k not in perms and sib in perms]
        if add:
            db.update('roles', r['id'], dict(permissions=perms + add))
    cur = db.setting('clientSetting', None)
    if cur is None:
        db.set_setting('clientSetting', dict(CLIENT_SETTING_DEFAULT))
    else:
        missing = {k: v for k, v in CLIENT_SETTING_DEFAULT.items() if k not in cur}
        if missing:
            cur.update(missing); db.set_setting('clientSetting', cur)


def seed_calc_demo():
    """王者荣耀报价表演示价：整段价（元）与整段时间（小时），客户端“自助报价”用；后台“游戏报价器设置”里可改"""
    from api.pricecalc import _rows
    # 报价器演示价挂在「王者荣耀」上，保证它在游戏表里存在，否则客户端按报价下单时拿不到 gameId
    gm = db.first('games', lambda g: g.get('gameName') == '王者荣耀')
    if not gm:
        gid = 21702
        gm = db.insert_with_id('games', gid, dict(gameId=gid, gameName='王者荣耀', isDefulat='N', isMoblieGame='Y', isPw='N',
                                                  isNotAccPwd='N', isDisbleSendSms=0, orderNum=102))
        area_ids = []
        for i, n in enumerate(['安卓QQ区', '安卓微信区', '苹果QQ区', '苹果微信区']):
            area_ids.append(db.insert('game_data', dict(gameId=gid, gameName='王者荣耀', type=20, name=n, orderBy=10 - i, parentId=0))['id'])
        for i, n in enumerate(['打野', '中单', '上单', '射手', '辅助']):
            db.insert('game_data', dict(gameId=gid, gameName='王者荣耀', type=40, name=n, orderBy=10 - i, parentId=0))
        for i, (n, pr, hh) in enumerate([('段位上分（按段位报价）', 0, 0), ('巅峰赛上分', 200, 24), ('战令满级', 150, 48), ('英雄熟练度', 80, 12)]):
            db.insert('projects', dict(gameId=gid, gameName='王者荣耀', projectName=n, orderBy=100 - i, price=pr, hours=hh, remark=''))
    rows = _rows('王者荣耀', '段位')
    price = {'青铜': (15, 2), '白银': (20, 2), '黄金': (30, 3), '铂金': (45, 4), '钻石': (60, 5), '星耀': (90, 6)}
    for r in rows:
        if float(r.get('DAmount') or 0) > 0:   # 逐行判断：只补价格为 0 的行，避免只清掉一半时整体跳过
            continue
        l1 = r.get('LeveName1') or ''
        if l1 == '王者':
            db.update('price_calc', r['id'], dict(DAmount=20, PAmount=30, Hours=1))
            continue
        for k, (p, h) in price.items():
            if l1.startswith(k):
                db.update('price_calc', r['id'], dict(DAmount=p, PAmount=round(p * 1.5), Hours=h))
    if db.setting('pricebase:王者荣耀:段位') or {}:   # 基础参数（套餐/利润率）与阶梯价分开判断
        return
    db.set_setting('pricebase:王者荣耀:段位', dict(profit_rate=0, iosPercent=10, packgeName='标准代练', packgeName1='普通代练', packge_rate1=0, packgeMark1='不指定英雄', packge_ServiceType1=10,
                                               packgeName2='指定英雄', packge_rate2=30, packgeMark2='可指定英雄/位置', packge_ServiceType2=10, packgeName3='陪练上分', packge_rate3=0, packgeMark3='本人在线一起打', packge_ServiceType3=20,
                                               words='', stay_packName='挽留价', stay_rate=9, stay_word='', firstOrderValue=0, firstOrderModel=0, firstOrderAppendModel=1, firstOrderMark='', mingwen=[]))
