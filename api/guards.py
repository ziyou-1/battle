# -*- coding: utf-8 -*-
"""接口层权限守卫：把「菜单权限」延伸到接口上。

背景：页面菜单由 app.page 按角色权限拦截，但接口层原来只在订单、游戏号库、
短信三处做了校验，其余接口（人员、报酬、结算、系统日志、角色权限…）任何登录用户
都能直接请求并拿到全站数据。

这里只覆盖「读全量敏感数据」和「高危写操作」，页面渲染用的公共下拉接口一律不动，
避免误伤。判定口径是菜单 key —— 与页面权限同一套数据，不会出现两套规则打架。
"""
import re

# (路径正则, 命中任一菜单 key 即放行, 拒绝提示)
RULES = [
    # 人员 / 角色分组
    (r'^/userajax/(getuserlist|addedituser|deluser|editusermark|setuserblacklist|applyonboardingmange|'
     r'getusergrouplist|addeditusergroup|delusergroup|changerole|userloginrestrict|rnamecert|usercontract)',
     {'user/userlist', 'user/usergroup'}, '无权管理人员信息'),
    # 打手与客服报酬（「我的订单收入」等 getmy* 与打手自用的学习资料/QA 不在此列）
    (r'^/empajax/(getemplist|changeorderrecprice|changeempremark|delemp|batchdeductfee|applicationemp|'
     r'synchempordertomysystem)',
     {'emp/emplist'}, '无权查看或修改打手与客服报酬'),
    (r'^/empajax/getfunddetailslistdata', {'emp/funddetailslist'}, '无权查看平台资金明细'),
    (r'^/empajax/getprivatephonecallloglist', {'emp/privatephonecalllog'}, '无权查看虚拟号码通话记录'),
    (r'^/empajax/getlearminformationlist', {'emp/learminformationlist'}, '无权查看内部学习资料'),
    (r'^/empajax/getqalist', {'emp/qacenter'}, '无权查看内部问答'),
    # 结算（「我的在线结算」getmy* 不在此列）
    (r'^/empajax/(getbillsummarylist|getbillsummarydetailslist|getonlinebillsummarylist|settlementemp|'
     r'settlementempbyids|savesettlement|getbindalipaysettauthlist|addbindalipaysettauthdata|'
     r'deletebindalipaysettauth|settlebalance|onlinesett)',
     {'emp/billsummary', 'emp/bindalipaysettauth', 'emp/onlinepaytorecdetail'}, '无权查看或操作结算'),
    (r'^/emp/exportemp', {'emp/billsummary'}, '无权导出结算记录'),
    # 系统操作日志
    (r'^/systemajax/(getsysmteloglist|delsystemlog|clearsystemlog)', {'system/systemlog'},
     '无权查看或清理系统操作日志'),
    # 角色职位权限（含新增/删除角色本身）
    (r'^/systemajax/(getrolelist|getuserrole|addeditrole|delrole|addeditroleauthority|delroleauthority|'
     r'saveroleauthority|changerole)',
     {'system/roleauthority'}, '无权查看或修改角色权限'),
    # 统计报表
    (r'^/empajax/getsalesmanstatistics', {'emp/salesmanstatistics'}, '无权查看客服接发单统计'),
    (r'^/empajax/getdayoperation', {'emp/dayoperation'}, '无权查看经营报表'),
    # 客户端评价 / 售后 / 运营设置。页面权限之外还会在下方按职位做硬限制。
    (r'^/orderajax/(getclientreviewlist|replyclientreview)', {'order/clientreviews'}, '无权查看或回复客户评价'),
    (r'^/orderajax/(getaftersalelist|handleaftersale)', {'order/aftersales'}, '无权查看或处理售后'),
    (r'^/systemajax/(getclientsetting|saveclientsetting)', {'system/clientsetting'}, '无权查看或修改客户端设置'),
    # 游戏维护（写操作按动词前缀识别；页面用的游戏下拉 Get* 不动）
    (r'^/gameajax/(addedit|add|del|save|update|change|set|reshref)',
     {'game/gameserver', 'game/ordertypssetting', 'game/projectsetting', 'game/gameitemlist',
      'game/pricecalculator'}, '无权维护游戏数据'),
    (r'^/gameajax/(getgameservermangelist|getallordertypelist|getorderofjavascript)', {'game/gameserver'},
     '无权维护游戏数据'),
    # 会员档案与资金：写操作要会员模块权限（打手另有整组禁令）
    (r'^/api/customerapi/(recharge|deducbalance|createmodifycustomer|delcustomer|setarrearsnote|'
     r'bindbuilder|unbindbuilder|changecustomerpwd|resetcustomerpwd|setcustomerlevel)',
     {'customer/customerlist', 'customer/hyfundetailslist'}, '无权修改会员档案或余额'),
    (r'^/customerajax/(recharge|deduct|addbackoflist|delback)', {'customer/customerlist', 'customer/backlist'},
     '无权修改会员数据'),
    # 系统各项设置
    (r'^/systemajax/savesystemsetting', {'system/systemsetting'}, '无权修改系统各项设置'),
]

# 打手（代练员）额外禁止：会员档案与客户维护
DASHOU_DENY = [
    (r'^(/api/customerapi/|/customerajax/)', '无权查看会员数据'),
]


def guard_module_request(key):
    """返回 None 表示放行；否则返回 (响应, 状态码)"""
    from . import current_user, json_err, is_dashou
    from .system import user_permissions
    u = current_user()
    if not u:
        return None

    # 这三组接口涉及客户隐私、退款和前台运营内容。系统管理员/老板始终可用；
    # 财务、团长没有这些职责；打手只能走评价接口（函数层还会限制为本人评价）。
    review_path = re.match(r'^/orderajax/(getclientreviewlist|replyclientreview)', key)
    aftersale_path = re.match(r'^/orderajax/(getaftersalelist|handleaftersale)', key)
    setting_path = re.match(r'^/systemajax/(getclientsetting|saveclientsetting)', key)
    if review_path or aftersale_path or setting_path:
        job = (u.get('jobName') or '').strip()
        privileged = bool(u.get('isSuper')) or job in ('系统管理员', '老板')
        if privileged:
            return None
        if job in ('财务', '团长') or (job in ('打手', '代练员') and not review_path):
            return json_err('当前角色无权使用该功能'), 403
        if job in ('打手', '代练员') and review_path:
            return None
    if is_dashou():
        for pat, msg in DASHOU_DENY:
            if re.match(pat, key):
                return json_err(msg), 403
    perms = user_permissions(u)
    for pat, allowed, msg in RULES:
        if re.match(pat, key):
            if not (perms & allowed):
                return json_err(msg), 403
            return None
    return None
