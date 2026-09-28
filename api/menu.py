# 自动生成：左侧菜单树（权限以菜单 id / key 计）
MENU = [
 {
  "id": 100,
  "name": "后台首页",
  "key": "index/console",
  "icon": "layui-icon-home",
  "dataName": "home",
  "children": []
 },
 {
  "id": 200,
  "name": "指派给我的订单",
  "key": "order/myorderlist",
  "icon": "layui-icon-list",
  "dataName": "myorder",
  "children": []
 },
 {
  "id": 300,
  "name": "我参与的排团",
  "key": "group/mygroup",
  "icon": "layui-icon-templeate-1",
  "dataName": "mytask",
  "children": []
 },
 {
  "id": 400,
  "name": "内部抢单大厅",
  "key": "order/insiderecorderlist",
  "icon": "layui-icon-template",
  "dataName": "recorder",
  "children": []
 },
 {
  "id": 500,
  "name": "我的相关",
  "key": "",
  "icon": "layui-icon-menu-fill",
  "dataName": "aboutme",
  "children": [
   {
    "id": 501,
    "name": "我的订单收入",
    "key": "emp/myemp",
    "icon": "layui-icon-rmb"
   },
   {
    "id": 502,
    "name": "在线结算记录",
    "key": "emp/mybillsummary",
    "icon": "layui-icon-dollar"
   },
   {
    "id": 503,
    "name": "我的资料",
    "key": "user/myinfo",
    "icon": "layui-icon-form"
   },
   {
    "id": 504,
    "name": "我的消息",
    "key": "user/mymessage",
    "icon": "layui-icon-speaker"
   },
   {
    "id": 505,
    "name": "异常消失订单",
    "key": "order/exceptionorderlog",
    "icon": "layui-icon-tips-fill"
   }
  ]
 },
 {
  "id": 600,
  "name": "订单管理",
  "key": "",
  "icon": "layui-icon-form",
  "dataName": "ordermange",
  "children": [
   {
    "id": 601,
    "name": "录入订单",
    "key": "order/addorder",
    "icon": "layui-icon-add-1"
   },
   {
    "id": 602,
    "name": "管理订单",
    "key": "order/orderlist",
    "icon": "layui-icon-form"
   },
   {
    "id": 603,
    "name": "交易平台订单处理",
    "key": "order/coreordercenter",
    "icon": "layui-icon-spread-left"
   },
   {
    "id": 604,
    "name": "平台商铺订单",
    "key": "order/jdpshoporderlist",
    "icon": "layui-icon-website"
   },
   {
    "id": 605,
    "name": "客户填单生成",
    "key": "order/clientordergenerate",
    "icon": "layui-icon-spread-left"
   },
{
    "id": 611,
    "name": "客户评价",
    "key": "order/clientreviews",
    "icon": "layui-icon-rate",
    "dataName": ""
   },
{
    "id": 612,
    "name": "售后处理",
    "key": "order/aftersales",
    "icon": "layui-icon-survey",
    "dataName": ""
   },
   {
    "id": 606,
    "name": "找回删除的订单",
    "key": "order/orderrecycle",
    "icon": "layui-icon-delete"
   },
   {
    "id": 607,
    "name": "交易订单操作记录",
    "key": "order/tradingorderactionloglist",
    "icon": "layui-icon-template"
   },
   {
    "id": 608,
    "name": "淘宝发货记录",
    "key": "order/tbsendrecordlist",
    "icon": "layui-icon-date"
   },
   {
    "id": 609,
    "name": "上家订单改价记录",
    "key": "order/soureorderchangepricelog",
    "icon": "layui-icon-transfer"
   },
   {
    "id": 610,
    "name": "打手玩家对聊管理",
    "key": "order/reccustomerchatlog",
    "icon": "layui-icon-reply-fill"
   }
  ]
 },
 {
  "id": 700,
  "name": "游戏排团",
  "key": "",
  "icon": "layui-icon-template",
  "dataName": "taskmange",
  "children": [
   {
    "id": 701,
    "name": "新建排团",
    "key": "group/addeditgroup",
    "icon": "layui-icon-add-1"
   },
   {
    "id": 702,
    "name": "旧版排团",
    "key": "group/grouplist",
    "icon": "layui-icon-date"
   },
   {
    "id": 703,
    "name": "2021版排团",
    "key": "group/grouplist2020",
    "icon": "layui-icon-app"
   },
   {
    "id": 704,
    "name": "2025版排团",
    "key": "group/grouplist2025",
    "icon": "layui-icon-app"
   },
   {
    "id": 705,
    "name": "看公开的排团坑位",
    "key": "group/jdppublictask",
    "icon": "layui-icon-template"
   }
  ]
 },
 {
  "id": 800,
  "name": "游戏号库",
  "key": "",
  "icon": "layui-icon-layer",
  "dataName": "gameaccmange",
  "children": [
   {
    "id": 801,
    "name": "新增游戏号",
    "key": "gameaccounts/addeditaccount",
    "icon": "layui-icon-layer"
   },
   {
    "id": 802,
    "name": "导入内部游戏号",
    "key": "gameaccounts/importacc",
    "icon": "layui-icon-upload"
   },
   {
    "id": 803,
    "name": "管理内部账号",
    "key": "gameaccounts/accountlist",
    "icon": "layui-icon-form"
   },
   {
    "id": 804,
    "name": "售卖账号预览板",
    "key": "gameaccounts/sellaccpreview",
    "icon": "layui-icon-form"
   },
   {
    "id": 805,
    "name": "指定给我的账号",
    "key": "gameaccounts/myaccountlist",
    "icon": "layui-icon-form"
   }
  ]
 },
 {
  "id": 900,
  "name": "系统人员",
  "key": "",
  "icon": "layui-icon-group",
  "dataName": "usermange",
  "children": [
   {
    "id": 901,
    "name": "新开系统账号",
    "key": "user/adduser",
    "icon": "layui-icon-username"
   },
   {
    "id": 902,
    "name": "人员管理",
    "key": "user/userlist",
    "icon": "layui-icon-group"
   },
   {
    "id": 903,
    "name": "邀请大神注册管理",
    "key": "user/applyonboardingmange",
    "icon": "layui-icon-group"
   },
   {
    "id": 904,
    "name": "打卡记录",
    "key": "user/checkinlog",
    "icon": "layui-icon-date"
   },
   {
    "id": 905,
    "name": "打卡分析",
    "key": "user/checkinstatic",
    "icon": "layui-icon-chart-screen"
   },
   {
    "id": 906,
    "name": "登录限制设置",
    "key": "user/userloginrestrict",
    "icon": "layui-icon-group"
   },
   {
    "id": 907,
    "name": "人员黑名单",
    "key": "user/backuserlist",
    "icon": "layui-icon-friends"
   },
   {
    "id": 908,
    "name": "人员实名记录与配置",
    "key": "user/rnamecertlogandsetting",
    "icon": "layui-icon-auz"
   },
   {
    "id": 909,
    "name": "员工电子合同管理",
    "key": "user/usercontractsigning",
    "icon": "layui-icon-auz"
   }
  ]
 },
 {
  "id": 1000,
  "name": "财务相关",
  "key": "",
  "icon": "layui-icon-rmb",
  "dataName": "emp",
  "children": [
   {
    "id": 1001,
    "name": "打手与客服报酬",
    "key": "emp/emplist",
    "icon": "layui-icon-rmb"
   },
   {
    "id": 1002,
    "name": "结算记录",
    "key": "emp/billsummary",
    "icon": "layui-icon-dollar"
   },
   {
    "id": 1003,
    "name": "在线结算明细",
    "key": "emp/onlinepaytorecdetail",
    "icon": "layui-icon-rmb"
   },
   {
    "id": 1004,
    "name": "客服接发单统计",
    "key": "emp/salesmanstatistics",
    "icon": "layui-icon-chart-screen"
   },
   {
    "id": 1005,
    "name": "经营报表",
    "key": "emp/dayoperation",
    "icon": "layui-icon-chart-screen"
   },
   {
    "id": 1006,
    "name": "日常账本",
    "key": "emp/booklist",
    "icon": "layui-icon-read"
   },
   {
    "id": 1007,
    "name": "内部学习资料",
    "key": "emp/learminformationlist",
    "icon": "layui-icon-template-1"
   },
   {
    "id": 1008,
    "name": "虚拟号码通话记录",
    "key": "emp/privatephonecalllog",
    "icon": "layui-icon-align-center"
   },
   {
    "id": 1009,
    "name": "内部QA问答",
    "key": "emp/qacenter",
    "icon": "layui-icon-face-surprised"
   },
   {
    "id": 1010,
    "name": "平台资金明细与提现",
    "key": "emp/funddetailslist",
    "icon": "layui-icon-rmb"
   }
  ]
 },
 {
  "id": 1100,
  "name": "客户维护",
  "key": "",
  "icon": "layui-icon-group",
  "dataName": "customer",
  "children": [
   {
    "id": 1101,
    "name": "会员管理",
    "key": "customer/customerlist",
    "icon": "layui-icon-group"
   },
   {
    "id": 1102,
    "name": "会员余额明细",
    "key": "customer/hyfundetailslist",
    "icon": "layui-icon-friends"
   },
   {
    "id": 1103,
    "name": "会员等级设置",
    "key": "customer/hylevelsetting",
    "icon": "layui-icon-friends"
   },
   {
    "id": 1104,
    "name": "会员分析报表",
    "key": "customer/hyanalysisreport",
    "icon": "layui-icon-chart-screen"
   },
   {
    "id": 1105,
    "name": "黑名单管理",
    "key": "customer/backlist",
    "icon": "layui-icon-friends"
   }
  ]
 },
 {
  "id": 1200,
  "name": "游戏维护",
  "key": "",
  "icon": "layui-icon-engine",
  "dataName": "gamemange",
  "children": [
   {
    "id": 1201,
    "name": "游戏管理",
    "key": "game/gameserver",
    "icon": "layui-icon-engine"
   },
   {
    "id": 1202,
    "name": "订单项目分类管理",
    "key": "game/ordertypssetting",
    "icon": "layui-icon-align-right"
   },
   {
    "id": 1203,
    "name": "常用代练项目管理",
    "key": "game/projectsetting",
    "icon": "layui-icon-templeate-1"
   },
   {
    "id": 1204,
    "name": "游戏物品管理",
    "key": "game/gameitemlist",
    "icon": "layui-icon-align-left"
   },
   {
    "id": 1205,
    "name": "游戏报价计算器",
    "key": "game/pricecalculator",
    "icon": "layui-icon-app"
   }
  ]
 },
 {
  "id": 1300,
  "name": "短信业务",
  "key": "",
  "icon": "layui-icon-cellphone",
  "dataName": "sms",
  "children": [
   {
    "id": 1301,
    "name": "短信发送记录",
    "key": "sms/smslogslist",
    "icon": "layui-icon-form"
   },
   {
    "id": 1302,
    "name": "群发短信模板",
    "key": "sms/smstemplatelist",
    "icon": "layui-icon-templeate-1"
   },
   {
    "id": 1303,
    "name": "我要群发短信",
    "key": "sms/smsbulkhair",
    "icon": "layui-icon-release"
   },
   {
    "id": 1304,
    "name": "短信业务设置",
    "key": "system/smssetting",
    "icon": "layui-icon-set-fill"
   }
  ]
 },
 {
  "id": 1400,
  "name": "平台商铺",
  "key": "",
  "icon": "layui-icon-service",
  "dataName": "taskmange",
  "children": [
   {
    "id": 1401,
    "name": "店铺管理",
    "key": "jdpshop/shopindex",
    "icon": "layui-icon-gift"
   },
   {
    "id": 1402,
    "name": "商品分类",
    "key": "jdpshop/shoptype",
    "icon": "layui-icon-templeate-1"
   },
   {
    "id": 1403,
    "name": "新增商品",
    "key": "jdpshop/addshopitem",
    "icon": "layui-icon-add-1"
   },
   {
    "id": 1404,
    "name": "商品管理",
    "key": "jdpshop/shopmange",
    "icon": "layui-icon-form"
   }
  ]
 },
 {
  "id": 1500,
  "name": "发平台设置",
  "key": "",
  "icon": "layui-icon-cols",
  "dataName": "platSetting",
  "children": [
   {
    "id": 1501,
    "name": "交易平台对接设置",
    "key": "system/tripartiteplatformsetting",
    "icon": "layui-icon-component"
   },
   {
    "id": 1502,
    "name": "平台快速发单设置",
    "key": "system/platformpushorderconfig",
    "icon": "layui-icon-spread-left"
   },
   {
    "id": 1503,
    "name": "交易平台自动回复",
    "key": "system/platformautoreply",
    "icon": "layui-icon-reply-fill"
   },
   {
    "id": 1504,
    "name": "交易单自动调价配置",
    "key": "system/automaticadjustpriceset",
    "icon": "layui-icon-slider"
   },
   {
    "id": 1505,
    "name": "自动发消息到微信群设置",
    "key": "system/orderpushgroupmsgset",
    "icon": "layui-icon-release"
   }
  ]
 },
 {
  "id": 1600,
  "name": "系统维护",
  "key": "",
  "icon": "layui-icon-set-fill",
  "dataName": "setting",
  "children": [
   {
    "id": 1601,
    "name": "角色职位权限",
    "key": "system/roleauthority",
    "icon": "layui-icon-set-sm"
   },
   {
    "id": 1602,
    "name": "角色职位分组",
    "key": "user/usergroup",
    "icon": "layui-icon-group"
   },
   {
    "id": 1603,
    "name": "录单识别设置",
    "key": "system/autodiscernset",
    "icon": "layui-icon-util"
   },
   {
    "id": 1604,
    "name": "录单修正设置",
    "key": "system/verifiaddorderkey",
    "icon": "layui-icon-transfer"
   },
   {
    "id": 1605,
    "name": "订单标签维护",
    "key": "system/orderlabellist",
    "icon": "layui-icon-note"
   },
   {
    "id": 1606,
    "name": "订单来源管理",
    "key": "system/sourelist",
    "icon": "layui-icon-set-fill"
   },
   {
    "id": 1607,
    "name": "绑定上家系统设置",
    "key": "system/homesystemsetting",
    "icon": "layui-icon-service"
   },
   {
    "id": 1608,
    "name": "在线结算支付宝授权",
    "key": "emp/bindalipaysettauth",
    "icon": "layui-icon-auz"
   },
   {
    "id": 1609,
    "name": "微信公众号设置",
    "key": "system/wechartsetting",
    "icon": "layui-icon-login-wechat"
   },
   {
    "id": 1610,
    "name": "淘宝店对接设置",
    "key": "system/taobaoshipsetting",
    "icon": "layui-icon-spread-left"
   },
   {
    "id": 1611,
    "name": "其它平台店铺对接",
    "key": "system/pddshipsetting",
    "icon": "layui-icon-heart"
   },
   {
    "id": 1612,
    "name": "系统内部公告管理",
    "key": "system/systemnotice",
    "icon": "layui-icon-speaker"
   },
   {
    "id": 1613,
    "name": "订单虚拟号码设置",
    "key": "system/customerphoneprivatesetting",
    "icon": "layui-icon-headset"
   },
   {
    "id": 1614,
    "name": "客户端内容管理",
    "key": "system/wechatappmange",
    "icon": "layui-icon-app"
   },
{
    "id": 1619,
    "name": "客户端设置",
    "key": "system/clientsetting",
    "icon": "layui-icon-cellphone",
    "dataName": ""
   },
   {
    "id": 1615,
    "name": "系统操作日志管理",
    "key": "system/systemlog",
    "icon": "layui-icon-list"
   },
   {
    "id": 1616,
    "name": "自动发消息到微信群设置",
    "key": "system/orderpushgroupmsgset",
    "icon": "layui-icon-release"
   },
   {
    "id": 1617,
    "name": "内部沟通通讯设置",
    "key": "system/onlineconsultationset",
    "icon": "layui-icon-reply-fill"
   },
   {
    "id": 1618,
    "name": "系统各项设置管理",
    "key": "system/systemsetting",
    "icon": "layui-icon-util"
   }
  ]
 }
]
