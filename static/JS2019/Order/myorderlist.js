var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                gameName: 'Game/Svr',
                allGame: 'All Games',
                gameArea: 'Select Zone/Plat',
                gameServer: 'Select Server',
                gameJob: 'Class',
                gameGroup: 'Faction',
                orderSta: 'Ord Status',
                orderStaus1: 'All',
                orderStaus2: 'P Login',
                orderStaus3: 'Boosting',
                orderStaus4: 'P Review',
                orderStaus5: 'Comp',
                orderStaus6: 'Issue',
                orderStaus7: 'Refd',
                orderStaus8: 'Paused',
                sDate: 'Ord Date',
                bussType: 'Order Type',
                bussTypeStaus1: 'All',
                bussTypeStaus2: 'PL Order',
                bussTypeStaus3: 'CP Order',
                key1: 'Srch 1',
                key1placeholder: 'Ord/Role/Ph',
                key2: 'Srch 2',
                key2placeholder: 'PL Item',
                key4: 'Srch 3',
                key4placeholder: 'Seat',
                gameAcc: 'Game Acc',
                gameAccplaceholder: 'Srch by Acc',
                viewIsNewOrder: 'V New Only',
                isJiajiCheck: 'Urgent',
                isJiajiCheckTips: 'Filter Urgent Orders',
                seachBtn: 'Srch',
                refreshTit: 'Re Data',
                refresh: 'Re List',
                setRecManTit: 'Assign orders to receiver in bulk/single',
                setRecMan: 'Assign Order',
                changeStaBtnTit: 'Modify order status in bulk/single',
                changeStaBtn: 'Chg Sts',
                setJiWeiTit: 'Set machine seat for order in bulk/single',
                setJiWei: 'Set Seat',
                exportBtnTit: 'Export orders in bulk/single',
                exportBtn: 'Exp Ord',
                sendToMySystemTit: 'If you have EggShop Sys, send selected orders to your own',
                sendToMySystem: 'Send to My Sys',
                checkOrderByLocalTit: 'Query failed sync orders in latest 30 days',
                checkOrderByLocal: 'Chk Failed Ords',
                submtEnd: 'Submitted',
            },
            js: {
                orderIdView: 'Ord No',
                levelMarkTit: 'This is Cp Order', 
                levelMark: 'Cp',
                isReadTit: 'New Ord, View Now',
                isRead: 'New',
                isJiaJiTit: 'Urgent Ord, Priority',
                isJiaJi: 'urg',
                customizeTag: 'Tag',
                isSplitOrderTit: 'Ord Split into Multiple',
                isSplitOrder: 'Splist',
                taskIdTlt1: 'Joined Queue, Q No: ',
                taskIdTlt2: ', Queue Name:',
                taskId: 'Q',
                orderIdViewTit: 'Click to View Ord Dtl, Try Right-Click',
                orderLine: 'Right-Click',
                orderId: 'Sys Ord No',
                roleName: 'RLName',
                orderRemark: 'Key Remark',
                gameGroup: 'Fac/Plat',
                gameName: 'GameNm',
                project: 'PL/CP',
                gameInfo: 'Role Info',
                orderSta: 'Ord Status',
                orderStaus1: 'All',
                orderStaus2: 'P Login',
                orderStaus3: 'Boosting',
                orderStaus4: 'P Review',
                orderStaus5: 'Comp',
                orderStaus6: 'Issue',
                orderStaus7: 'Refd',
                orderStaus8: 'Paused',
                orderHoursDescStr: 'Time',
                orderSoure: 'Wang/Src',
                orderSoureTit: 'Click to Chat with Buyer (Qianniu Required). Follow Prompts to Open',
                OpenWangwang: 'Ord Src',
                recMan: 'Mgr',
                recManName: 'No Access',
                isAutoAssignmentTit: 'Smart assignment enabled. Assignment priority:',
                isAutoAssignment: 'Auto',
                DLStaffTil1: 'Unassigned, Click to Assign',
                DLStaffTil2: 'Cur Sel：',
                DLStaffTil3: 'Go Assign',
                DLStaffTxt: 'Assign',
                DLStaff: 'Smart assignment enabled, assignees list:',
                recFee: 'Rec Fee',
                yuan: '¥',
                recFeeTit: 'Your Fee:',
                Img: 'Ord Pic',
                upImg: 'Up Pic',
                mangeImg: 'View Pic',
                recOrderTime: 'Rec Tm',
                recOrderTimeTil: 'Ord Rec Tm',
                jiwei: 'Seat',
                jiweiTil1: 'No Seat, Click Sel',
                jiweiTil12: 'Cur Seat：',
                wu: 'None',
                orderRemark: 'Key Remark',
                orderRemarkTit: 'Click to Edit Remark',
                dynamicRemark: 'Log',
                dynamicRemarkTit: 'Click to Add Log',
                baroperating: 'Op',
                login: 'Please Login',
                loginMsg: 'Login Expired, Re-Login',
                loginindexOf: 'Time Range',
                dataTotal1: '[Stat] Total',
                dataTotal2: 'Ordes，Total Sum',
                dataTotal3: '¥，Pending Login',
                dataTotal4: 'Ordes，Logging In',
                dataTotal5: 'Ordes',
                dataTotal6: 'Pending Review',
                dataTotal7: 'Ordes，Issue',
                dataTotal8: 'Ordes，Refunded',
                dataTotal9: '[Note] Not a Platform, No Guarantee; Orders/Settlements by',
                dataTotal10: 'All Business/Settlements Unrelated to Dev EggShop',
                isAll: 'Sel All',
                notisAll: 'Not All ',
                setRecMan: 'Select Records First',
                smsBtn: 'Send SMS',
                del: 'Delete? Warn: Irreversible',
                submtEnd: 'Confirm Done? Double-Check',
                error: 'Req Error, Retry Later！',
                viewIsJiaJi: 'Filter Urgent Orders',
                orderLineerror: 'Preview Data Error！',
                loading: 'Loading...',
                viewOrderDetails: 'View Ord Dtl',
                changeOrderSta: 'Chg Ord Sts',
                setJiWei: 'Set Seat (None if N)',
                changeOrderJiajiError: 'Sys Busy！',
                upImgPop: 'Upload pic',
                mangeImgPop: 'View Pic',
                remark: 'Order Log',
                groupview: 'Q Dtl',
                exportOrder: 'Exp Ord',
                zpOrder: 'Re-Assign',
                copyOrderIdClipboard1: 'Ord No Copied：',
                copyOrderIdClipboard2: 'to Clipboard',
                copyOrderIdClipboard3: 'Copy Failed, Manual Copy',
                copyOrderIdClipboard4: 'Ord Info Copied',
                copyOrderIdClipboard5: 'Copy Failed, Manual Copy',
                viewDetails: 'View Dtl',
                copyOrderID: 'Copy Ord ID',
                viewPic: 'View Pic',
            },
            code: {
                copy: 'Copy Code',
                copied: 'Copied',
                copyError: 'Copy Failed',
                maximize: 'Maximize',
                restore: 'Restore',
                preview: 'Open Preview in New Window'
            },
            colorpicker: {
                clear: 'Clear',
                confirm: 'OK'
            },
            dropdown: {
                noData: 'No Data'
            },
            flow: {
                loadMore: 'Load More',
                noMore: 'No More Data'
            },
            form: {
                select: {
                    noData: 'No Data',
                    noMatch: 'No Matching Data',
                    placeholder: 'Please Select'
                },
                validateMessages: {
                    required: 'This field is required',
                    phone: 'Invalid phone number format',
                    email: 'Invalid email format',
                    url: 'Invalid URL format',
                    number: 'Numbers only',
                    date: 'Invalid date format',
                    identity: 'Invalid ID number format'
                },
                verifyErrorPromptTitle: 'Notice'
            },
            laydate: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                time: ['Hour', 'Minute', 'Second'],
                literal: {
                    year: ''
                },
                selectDate: 'Select Date',
                selectTime: 'Select Time',
                startTime: 'Start Time',
                endTime: 'End Time',
                tools: {
                    confirm: 'Confirm',
                    clear: 'Clear',
                    now: 'Now',
                    reset: 'Reset'
                },
                rangeOrderPrompt: 'End time cannot be less than start Time\nPlease re-select',
                invalidDatePrompt: 'Invalid date\n',
                formatErrorPrompt: 'Date format is invalid\nMust follow the format:\n{format}\n',
                autoResetPrompt: 'It has been reset',
                preview: 'The selected result'
            },
            layer: {
                confirm: 'OK',
                cancel: 'Cancel',
                defaultTitle: 'Info',
                prompt: {
                    inputLengthPrompt: 'Maximum {length} characters'
                },
                photos: {
                    noData: 'No Image',
                    tools: {
                        rotate: 'Rotate',
                        scaleX: 'Flip Horizontally',
                        zoomIn: 'Zoom In',
                        zoomOut: 'Zoom Out',
                        reset: 'Reset',
                        close: 'Close'
                    },
                    viewPicture: 'View Picture',
                    urlError: {
                        prompt: 'Image URL is invalid, \nContinue to next one?',
                        confirm: 'Next',
                        cancel: 'Cancel'
                    }
                }
            },
            laypage: {
                prev: 'Prev',
                next: 'Next',
                first: 'First',
                last: 'Last',
                total: 'Total {total} items',
                pagesize: '/page',
                goto: 'Go to',
                page: 'page',
                confirm: 'Confirm'
            },
            table: {
                sort: {
                    asc: 'Ascending',
                    desc: 'Descending'
                },
                noData: 'No Data',
                tools: {
                    filter: {
                        title: 'Filter Columns'
                    },
                    export: {
                        title: 'Export',
                        noDataPrompt: 'No data in the table',
                        compatPrompt: 'Export is not supported in IE. Please use Chrome or another modern browser.',
                        csvText: 'Export CSV File'
                    },
                    print: {
                        title: 'Print',
                        noDataPrompt: 'No data in the table'
                    }
                },
                dataFormatError: 'Returned data is invalid. The correct success status code should be: "{statusName}": {statusCode}',
                xhrError: 'Request Error: {msg}'
            },
            transfer: {
                noData: 'No Data',
                noMatch: 'No Match',
                title: ['List 1', 'List 2'],
                searchPlaceholder: 'Search by Keyword'
            },
            tree: {
                defaultNodeName: 'Unnamed',
                noData: 'No Data',
                deleteNodePrompt: 'Are you sure you want to delete the node "{name}"?'
            },
            upload: {
                fileType: {
                    file: 'File',
                    image: 'Image',
                    video: 'Video',
                    audio: 'Audio'
                },
                validateMessages: {
                    fileExtensionError: 'Unsupported format in selected {fileType}',
                    filesOverLengthLimit: 'Maximum {length} files allowed at once',
                    currentFilesLength: 'You have selected {length} files',
                    fileOverSizeLimit: 'File size must not exceed {size}'
                },
                chooseText: '{length} files'
            },
            util: {
                timeAgo: {
                    days: '{days} days ago',
                    hours: '{hours} hours ago',
                    minutes: '{minutes} minutes ago',
                    future: 'In the future',
                    justNow: 'Just now'
                },
                toDateString: {
                    meridiem: function (hours, minutes) {
                        return hours < 12 ? 'AM' : 'PM';
                    }
                }
            }
        },
        'zh-CN': {
            page: {
                gameName: '游戏区服',
                allGame: '全部游戏',
                gameArea: '选择或输入大区/平台',
                gameServer: '选择或输入服务器',
                gameJob: '职业',
                gameGroup: '阵营门派',
                orderSta: '订单状态',
                orderStaus1: '全部',
                orderStaus2: '待上号',
                orderStaus3: '代练中',
                orderStaus4: '待验收',
                orderStaus5: '已完成',
                orderStaus6: '问题单',
                orderStaus7: '已退单',
                orderStaus8: '已暂停',
                sDate: '接单日期',
                bussType: '订单类型',
                bussTypeStaus1: '全部',
                bussTypeStaus2: '代练订单',
                bussTypeStaus3: '陪玩订单',
                key1: '搜索1',
                key1placeholder: '订单号/角色名/手机号',
                key2: '搜索2',
                key2placeholder: '代练项目',
                key4: '搜索3',
                key4placeholder: '机位',
                gameAcc: '游戏账号',
                gameAccplaceholder: '可输入游戏账号搜索',
                viewIsNewOrder: '只看新订单',
                isJiajiCheck: '加急单',
                isJiajiCheckTips: '勾选后将筛选出加急的订单',
                seachBtn: '搜索',
                refreshTit: '刷新当前数据',
                refresh: '刷新列表',
                setRecManTit: '批量或单笔将订单指派给接手人',
                setRecMan: '指派订单给打手',
                changeStaBtnTit: '批量或单笔更改订单状态',
                changeStaBtn: '更改状态',
                setJiWeiTit: '批量或单笔设定订单的所在机位或机器',
                setJiWei: '设定机位',
                exportBtnTit: '批量或单笔导出订单',
                exportBtn: '导出订单',
                sendToMySystemTit: '如果你也有工作室管理系统，可以将勾选的订单发送到你自己的管理系统里',
                sendToMySystem: '发到我的管理系统',
                checkOrderByLocalTit: '找出最近30天发送到我自己系统失败的订单',
                checkOrderByLocal: '检查发送失败订单',
                submtEnd: '提交完成',
            },
            js: {
                orderIdView: '订单号',
                levelMarkTit: '这是一笔陪玩订单',
                levelMark: '陪',
                isReadTit: '新订单，请急时查阅',
                isRead: '新',
                isJiaJiTit: '加急订单，优先安排',
                isJiaJi: '急',
                customizeTag: '标记',
                isSplitOrderTit: '该订单已被拆分成多笔订单',
                isSplitOrder: '拆',
                taskIdTlt1: '该笔订单有参与排团，团号：',
                taskIdTlt2: '，排团名称：',
                taskId: '团',
                orderIdViewTit: '点击查看订单详情，也可以鼠标右键试试看',
                orderLine: '鼠标右键看看~',
                orderId: '系统内置单号',
                roleName: '角色名',
                orderRemark: '重要备注',
                gameGroup: '阵营/平台',
                gameName: '游戏名称',
                project: '代练/陪玩内容',
                gameInfo: '角色信息',
                orderSta: '订单状态',
                orderStaus1: '全部',
                orderStaus2: '待上号',
                orderStaus3: '代练中',
                orderStaus4: '待验收',
                orderStaus5: '已完成',
                orderStaus6: '问题单',
                orderStaus7: '已退单',
                orderStaus8: '已暂停',
                orderHoursDescStr: '时间',
                orderSoure: '旺旺/来源',
                orderSoureTit: '点击可以与买家对聊，需要安装千牛，注意窗口提示，点击打开或确定才可以',
                OpenWangwang: '该订单来源：',
                recMan: '接手人',
                recManName: '无权查看',
                isAutoAssignmentTit: '该订单开启了智能分配，人员分配顺序为：',
                isAutoAssignment: '智',
                DLStaffTil1: '还未设置，点此指派接手人',
                DLStaffTil2: '当前接手人：',
                DLStaffTil3: '点击可进入指派',
                DLStaffTxt: '指派接手',
                DLStaff: '该订单已启用了智能分配，智能分配接手人分别为：',
                recFee: '接手价',
                yuan: '元',
                recFeeTit: '你接手此单的金额：',
                Img: '订单截图',
                upImg: '上传截图',
                mangeImg: '查看截图',
                recOrderTime: '接手时间',
                recOrderTimeTil: '订单接手时间',
                jiwei: '机位',
                jiweiTil1: '当前没有分配机位，点击可分配',
                jiweiTil12: '当前机位：',
                wu: '无',
                orderRemark: '重要备注',
                orderRemarkTit: '点击可以编辑订单重要备注',
                dynamicRemark: '日志',
                dynamicRemarkTit: '点击可以快速添加订单日志',
                baroperating: '操作',
                login: '请先登录',
                loginMsg: '登录过期了，请重新登录系统',
                loginindexOf: '时间跨度',
                dataTotal1: '【统计】共',
                dataTotal2: '笔订单，接手总金额',
                dataTotal3: '元，其中待上号',
                dataTotal4: '笔，代练中',
                dataTotal5: '笔',
                dataTotal6: '待验收',
                dataTotal7: '笔，问题单',
                dataTotal8: '笔，已退单',
                dataTotal9: '【声明】该系统并非交易平台，无担保服务，系统内所有订单业务及结算均由',
                dataTotal10: '负责运营，本系统一切业务和结算与软件开发商平台无关',
                isAll: '全选',
                notisAll: '未全选',
                setRecMan: '请选中要操作的记录',
                smsBtn: '发送短信',
                del: '真的删除吗？警告：一旦删除，将无法找回',
                submtEnd: '确定打完了吗？提交前请再三确认哦',
                error: '请求出错，请稍候再试！',
                viewIsJiaJi: '勾选后将筛选出加急的订单',
                orderLineerror: '获取预览数据出现异常！',
                loading: '加载中...',
                viewOrderDetails: '订单详情',
                changeOrderSta: '更改订单状态',
                setJiWei: '设置机位(不需要机位请写无)',
                changeOrderJiajiError: '系统繁忙！',
                upImgPop: '上传订单截图',
                mangeImgPop: '查看订单截图',
                remark: '的订单日志',
                groupview: '排团详情',
                exportOrder: '导出订单',
                zpOrder: '二次指派接手人',
                copyOrderIdClipboard1: '已成功复制订单号：',
                copyOrderIdClipboard2: '到剪贴板',
                copyOrderIdClipboard3: '复制订单号失败了，请手动复制',
                copyOrderIdClipboard4: '已成功复制订单内容到剪贴板',
                copyOrderIdClipboard5: '复制订单内容失败了，请手动复制',
                viewDetails: '查看详情',
                copyOrderID: '复制订单编号',
                viewPic: '查看订单截图',
            },
            code: {
                copy: '复制代码',
                copied: '已复制',
                copyError: '复制失败',
                maximize: '最大化显示',
                restore: '还原显示',
                preview: '在新窗口预览'
            },
            colorpicker: {
                clear: '清除',
                confirm: '确定'
            },
            dropdown: {
                noData: '暂无数据'
            },
            flow: {
                loadMore: '加载更多',
                noMore: '没有更多了'
            },
            form: {
                select: {
                    noData: '暂无数据',
                    noMatch: '无匹配数据',
                    placeholder: '请选择'
                },
                validateMessages: {
                    required: '必填项不能为空',
                    phone: '手机号格式不正确',
                    email: '邮箱格式不正确',
                    url: '链接格式不正确',
                    number: '只能填写数字',
                    date: '日期格式不正确',
                    identity: '身份证号格式不正确'
                },
                verifyErrorPromptTitle: '提示'
            },
            laydate: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                weeks: ['日', '一', '二', '三', '四', '五', '六'],
                time: ['时', '分', '秒'],
                literal: {
                    year: '年'
                },
                selectDate: '选择日期',
                selectTime: '选择时间',
                startTime: '开始时间',
                endTime: '结束时间',
                tools: {
                    confirm: '确定',
                    clear: '清空',
                    now: '现在',
                    reset: '重置'
                },
                rangeOrderPrompt: '结束时间不能早于开始时间\n请重新选择',
                invalidDatePrompt: '不在有效日期或时间范围内\n',
                formatErrorPrompt: '日期格式不合法\n必须遵循：\n{format}\n',
                autoResetPrompt: '已自动重置',
                preview: '当前选中的结果'
            },
            layer: {
                confirm: '确定',
                cancel: '取消',
                defaultTitle: '信息',
                prompt: {
                    inputLengthPrompt: '最多输入 {length} 个字符'
                },
                photos: {
                    noData: '没有图片',
                    tools: {
                        rotate: '旋转',
                        scaleX: '水平变换',
                        zoomIn: '放大',
                        zoomOut: '缩小',
                        reset: '还原',
                        close: '关闭'
                    },
                    viewPicture: '查看原图',
                    urlError: {
                        prompt: '当前图片地址异常，\n是否继续查看下一张？',
                        confirm: '下一张',
                        cancel: '不看了'
                    }
                }
            },
            laypage: {
                prev: '上一页',
                next: '下一页',
                first: '首页',
                last: '尾页',
                total: '共 {total} 条',
                pagesize: '条/页',
                goto: '到第',
                page: '页',
                confirm: '确定'
            },
            table: {
                sort: {
                    asc: '升序',
                    desc: '降序'
                },
                noData: '暂无数据',
                tools: {
                    filter: {
                        title: '筛选列'
                    },
                    export: {
                        title: '导出',
                        noDataPrompt: '当前表格无数据',
                        compatPrompt: '导出功能不支持 IE，请用 Chrome 等高级浏览器导出',
                        csvText: '导出 CSV 文件'
                    },
                    print: {
                        title: '打印',
                        noDataPrompt: '当前表格无数据'
                    }
                },
                dataFormatError: '返回的数据不符合规范，正确的成功状态码应为："{statusName}": {statusCode}',
                xhrError: '请求异常，错误提示：{msg}'
            },
            transfer: {
                noData: '暂无数据',
                noMatch: '无匹配数据',
                title: ['列表一', '列表二'],
                searchPlaceholder: '关键词搜索'
            },
            tree: {
                defaultNodeName: '未命名',
                noData: '暂无数据',
                deleteNodePrompt: '确认删除"{name}"节点吗？'
            },
            upload: {
                fileType: {
                    file: '文件',
                    image: '图片',
                    video: '视频',
                    audio: '音频'
                },
                validateMessages: {
                    fileExtensionError: '选择的{fileType}中包含不支持的格式',
                    filesOverLengthLimit: '同时最多只能上传: {length} 个文件',
                    currentFilesLength: '当前已经选择了: {length} 个文件',
                    fileOverSizeLimit: '文件大小不能超过 {size}'
                },
                chooseText: '{length} 个文件'
            },
            util: {
                timeAgo: {
                    days: '{days} 天前',
                    hours: '{hours} 小时前',
                    minutes: '{minutes} 分钟前',
                    future: '未来',
                    justNow: '刚刚'
                },
                toDateString: {
                    // https://www.unicode.org/cldr/charts/47/supplemental/day_periods.html
                    meridiem: function (hours, minutes) {
                        var hm = hours * 100 + minutes;
                        if (hm < 500) {
                            return '凌晨';
                        } else if (hm < 800) {
                            return '早上';
                        } else if (hm < 1200) {
                            return '上午';
                        } else if (hm < 1300) {
                            return '中午';
                        } else if (hm < 1900) {
                            return '下午';
                        }
                        return '晚上';
                    }
                }
            }
        },
    }
}

var i18nDataList = i18nData.messages[localStorage.getItem('layui-i18n-local-test') || 'zh-CN'].js

i18n.set(i18nData);

const template = $('#template').html();
const templatehtml = laytpl(template, { tagStyle: 'modern' }).render();
$('#root').html(templatehtml);


layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    ClipboardJS:'/lib/clipboard'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'ClipboardJS'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
        var ClipboardJS = layui.ClipboardJS;
        var table = layui.table;
        var devices = layui.device();
        var isPc = true;
        if (devices.android===true|| devices.ios===true) {
            isPc = false;
        }
        var re = true;
        var device = isPc;
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
            if (event.keyCode === 27) {
                layer.closeAll();
            }
        });
        var gameName = $("#gameName").find("option:selected").text();
        gameName = encodeURI(gameName);
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
    var remarkLocation = $("#remarkLocation").val();
    var isAllowAssRec = $("#isAllowAssRec").val();
        var isPw = false;
        var isMoblieGame = false;
        var mark1 = '', mark2 = '';
        var seachParam = 'gameName=' + gameName + '&sDate=' + sDate + '&eDate=' + eDate;
        var indexLoad;
        var mobliegame = false;
        var ispw = false;
        var page = 1;
    var isViewWW = $("#isViewWW").val();
    var failOrderIdx = '';
        laydate.render({
            elem: '#sDate'
            , min: -730
        }); 
        laydate.render({
            elem: '#eDate'
        });
        defaultGame();
        function defaultGame() {
            var tempIsMoblieGame = false;
            var tempIsPw = false;
            $("#gameName option").each(function () {
                var item = $(this).text();
                if (item == $("#gameName").find("option:selected").text()) {
                    var temp = $(this).data('mobliegame');
                    tempIsMoblieGame = temp == "Y" ? true : false;
                    tempIsPw = $(this).data('pw') == "Y" ? true : false;
                    tempIsAccPwd = $(this).data('accpwd') == "Y" ? true : false;
                }
            });
            mobliegame = tempIsMoblieGame;
            ispw = tempIsPw;
        }
        var tableList = table.render({
            elem: '#tableList'
            , url: '/OrderAjax/GetMyOrderList?' + seachParam
            , defaultToolbar: [] 
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 },
                {
                    field: 'orderIdView', title: i18nDataList.orderIdView, width:180, unresize: false, templet: function (res) {
                        let vo = '';
                        let isNew = '';
                        let tp = '';
                        let isSplit = '';
                        let ji = '';
                        let taskspan = '';
                        var typestr = '';
                        if (res.levelMark == 1) {
                            typestr = '<span class="lableb layui-bg-orange" title="' + i18nDataList.levelMarkTit + '">' + i18nDataList.levelMark +'</span>';
                        }
                        if (res.isRead == 'N') {
                            isNew = '<span class="lableb" style="background-color:#9ACD32" title="' + i18nDataList.isReadTit + '">' + i18nDataList.isRead +'</span>';
                        }
                        if (res.isJiaJi == "Y") {
                            ji = '<span class="lableb" style="background-color:#FFBBFF" title="' + i18nDataList.isJiaJiTit + '">' + i18nDataList.isJiaJi +'</span>';
                        }
                        if (res.customizeTag != null && res.customizeTag != '') {
                            tp = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" title="' + i18nDataList.customizeTag +'：' + res.customizeTag + '">' + res.customizeTag.substring(0, 2) + '</a>';
                        }
                        if (res.isSplitOrder == 'Y') {
                            isSplit = '<a href="javascript:void(0);" class="lableb" style="background-color:#FF6347" title="' + i18nDataList.isSplitOrderTit + '">' + i18nDataList.isSplitOrder +'</a>';
                        }
                        if (res.taskId>0){
                            taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" title="' + i18nDataList.taskIdTlt1 + '' + res.taskId + '' + i18nDataList.taskIdTlt2 + '' + res.taskName + '">' + i18nDataList.taskId +'</a>';
                        }
                        vo = '<a href="javascript:void(0);" class="orderdetails" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:#0094ff" title="' + i18nDataList.orderIdViewTit +'">' + res.orderIdView + '</a>';
                        let copyOrderIdspan='<span id="orderid_span_' + res.orderId + '" style="display:none" class="orderIDcopy"  data-clipboard-text="'+ res.orderIdView + '"></span>';
                        
                        return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.orderIdView
                            + '" title="' + i18nDataList.orderLine +'">' + copyOrderIdspan + typestr+ isNew + ji + tp + isSplit + taskspan + vo + '</div>';
                    }
                }
                , {
                    field: 'orderId', title: i18nDataList.orderId, width: 150, hide: true, unresize: false
                }
                , { field: 'roleName', title: i18nDataList.roleName, width: 120, unresize: false }
                 , {
                     field: 'orderRemark', title: i18nDataList.orderRemark, minwidth: 90, hide: remarkLocation == 'Y' ? false : true, unresize: false, sort: false, templet: function (res) {
                         return '<a href="javascript:void(0)" title="' + (res.orderRemark != null && res.orderRemark != 'null' && res.orderRemark != '' ? res.orderRemark : '') + '" style="color:#C71585" class="">' + (res.orderRemark != null && res.orderRemark != 'null' && res.orderRemark != '' ? res.orderRemark : '') + '</a>';
                     }
                 }
                , {
                    field: 'gameGroup', title: i18nDataList.gameGroup , align: 'center', width: 55, sort: false, nresize: false,templet: function (res) {
                        let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                        if (res.gameGroup) {
                            if (res.gameGroup.toUpperCase().indexOf('LM') > -1 || res.gameGroup.indexOf('联盟') > -1) {
                                group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                            }
                        } 
                        if (mobliegame) {
                            if (res.gameArea.toUpperCase().indexOf('IOS') > -1 || res.gameArea.indexOf('苹果') > -1) {
                                group = '<span title="' + res.gameArea + '" style="color:#0094ff">' + res.gameArea + '</span>';
                            }
                        }
                        return group;
                    }
                }
                , {
                    field: 'gameName', title: i18nDataList.gameName, align: 'center', width: 75, unresize: false,hide:false
                }
                , {
                    field: 'project', title: i18nDataList.project, minWidth:260, unresize: false, templet: function (res) {
                        let vo = '<span title="' + res.project + '">' + res.project + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameInfo', title: i18nDataList.gameInfo , unresize: false, templet: function (res) {
                        var area = res.gameArea;
                        var server = res.gameServer;
                        var job = res.gameJob;
                        var itemlevel = res.itemRemark?res.itemRemark+'/':'';

                        return '<span title="' + area + server + '/' + job + '">' + area + '/' + server + '/' + itemlevel + job  + '</span>';
                    }}
                , {
                    field: 'orderSta', title: i18nDataList.orderSta, align: 'center', width:65, templet: function (res) {
                        let colorStr = '#b0aeae;';
                        switch (res.orderSta) {
                            case i18nDataList.orderStaus2 :
                                colorStr = '#585858';
                                break;
                            case i18nDataList.orderStaus3 :
                                colorStr = '#219227';
                                break;
                            case i18nDataList.orderStaus4 :
                                colorStr = '#ff6a00';
                                break;
                            case i18nDataList.orderStaus5 :
                                colorStr = '#0094ff';
                                break;
                            case i18nDataList.orderStaus6 :
                                colorStr = '#FF5722';
                                break;
                            case i18nDataList.orderStaus7 :
                                colorStr = '#ff0000';
                                break;
                            case i18nDataList.orderStaus8:
                                colorStr = '#efaaaa';
                                break;
                        }
                        let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="' + res.orderIdView + '点击可以更改订单状态" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';
                         
                        return str;
                    }
                }
                , {
                    field: 'orderHoursDescStr', title: i18nDataList.orderHoursDescStr, width:80, align: 'center', unresize: false, templet: function (res) {
                        let timestr = res.orderHoursDescStr;
                        if (res.levelMark == 2 && res.orderHoursDescStr) {
                            timestr = res.orderHoursDescStr.split('天-')[1];
                        }
                        let div = '<span style="color:#5BB75B">' + timestr + '</span>';
                        if (res.orderHoursDescStr.indexOf('-') > -1) {
                            div = '<span style="color:#ff0000">' + timestr + '</span>';
                        }
                        return div;
                    }
                }
                , {
                    field: 'orderSoure', title: i18nDataList.orderSoure , width:90, hide: isViewWW == 'Y' ? false : true, align: 'center', unresize: false, templet: function (res) {
                        let concat = '';
                        let tbww = '<a href="/order/OpenWangwang?orderId=' + res.orderId + '" class="" data-orderId="' + res.orderId + '" target="_blank" title="' + i18nDataList.orderSoureTit +'">' + res.WangWang + '</a>';

                        if (res.WangWang != undefined && res.WangWang != null && res.WangWang != '') {
                            concat = tbww;
                        }
                        else if ((res.qq != undefined && res.qq != '' && res.qq != null) && (res.orderSoure.indexOf('微信') > -1 || res.orderSoure.indexOf('QQ') > -1)) {
                            concat = res.qq;
                        }
                        else {
                            concat = res.orderSoure;
                        }

                        return '<span title="' + i18nDataList.OpenWangwang  + res.orderSoure + '">' + (concat == null ? '' : concat) + '</span>';
                    }
                }
                , {
                    field: 'recMan', title: i18nDataList.recMan , align: 'center', width:70, unresize: false, templet: function (res) {
                        var recMan = res.recManName;
                        if (isAllowAssRec === "Y") {
                            if (res.recManName == "无权查看") {
                                return '<span>' + i18nDataList.recManName +'</span>';
                            }  
                        }                       
                        var autoStr = res.isAutoAssignment == "Y" ? '<span class="lableb" style="background-color:#9ACD32;margin-left:3px" title="' + i18nDataList.isAutoAssignmentTit + '' + res.autoAssignmentManName + '">' + i18nDataList.isAutoAssignment +'</span>' : '';
                        var DLStaffTil = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? i18nDataList.DLStaffTil1 : i18nDataList.DLStaffTil2 + res.recManName + (isAllowAssRec === "Y" ? i18nDataList.DLStaffTil3:"")
                            , DLStaffClass = (res.recManName == null || res.recManName == "") ? "layui-btn layui-btn-xs layui-btn-normal jsr" : " jsr"
                            , DLStaffTxt = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? i18nDataList.DLStaffTxt : res.recManName
                            , DLStaff = (res.isAutoAssignment == "Y" && res.recManName != null && res.recManName != "") ? "<a class='lableb' href='javascript:void(0)' style='background-color:#9ACD32;margin-left:3px' title='" + res.autoAssignmentManName + i18nDataList.DLStaff + (res.autoAssignmentManName != null ? res.autoAssignmentManName.replace("/", "->") : "") + "'>" + i18nDataList.isAutoAssignment +"</a>" : '';

                        return '<a class="' + DLStaffClass + '" href="javascript:void(0)" data-id="' + res.orderId + '" title="' + DLStaffTil + '">' + DLStaffTxt + '</a>' + DLStaff;
                    }
                }
                , {
                    field: 'recFee', title: i18nDataList.recFee, align: 'center', width:70, unresize: false, sort: false, templet: function (res) {
                        return '<a href="javascript:void(0)" style="color:#ff6a00;font-weight:600"  title="' + i18nDataList.recFeeTit + '' + res.recFee + '' + i18nDataList.yuan + '">' + res.recFee + '</a>';
                    }
                }
                 , {
                     field: '', title: i18nDataList.Img, align: 'center', width:70, unresize: false, templet: function (res) {
                         return '<div class="layui-btn-group" style="background: #fff;">' +
                             '<button class="layui-btn layui-btn-xs layui-btn-normal upImg" lay-submit="" data-id="' + res.orderId + '" title="' + i18nDataList.upImg + '"><i class="layui-icon">&#xe681;</i></button>' +
                             '<button class="layui-btn layui-btn-xs layui-btn-normal mangeImg" lay-submit="" data-id="' + res.orderId + '" title="' + i18nDataList.mangeImg + '"><i class="layui-icon">&#xe64a;</i></button>' +
                             '</div>'
                     }
                 }
                , {
                    field: 'recOrderTime', title: i18nDataList.recOrderTime, width:80, align: 'center', unresize: false, sort: true, templet: function (res) {
                        return '<span title="' + i18nDataList.recOrderTimeTil + '" style="">' + (res.recOrderTime==null?"":res.recOrderTime)+ '</span>';
                    }
                }
                , {
                    field: 'jiwei', title: i18nDataList.jiwei, width:80, align: 'center', unresize: false, sort: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + (res.jiwei.length < 1 ? i18nDataList.jiweiTil1 : i18nDataList.jiweiTil12 + res.jiwei) + '" style="" class="setjiwei" data-id="' + res.orderId + '" data-jiwei="' + res.jiwei + '">' + (res.jiwei.length < 1 ? i18nDataList.wu: res.jiwei) + '</a>';
                    }
                }
                , {
                    field: 'orderRemark', title: i18nDataList.property, width:80, hide: remarkLocation == 'Y' ? true : false, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + (res.orderRemark != null ? res.orderRemark : i18nDataList.orderRemarkTit) + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.orderRemark != null ? res.orderRemark : "") + '">' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : i18nDataList.wu) + '</a>';
                    }
                }
                , {
                    field: 'dynamicRemark', title: i18nDataList.dynamicRemark, width: 70, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + (res.dynamicRemark != null ? res.dynamicRemark : i18nDataList.dynamicRemarkTit) + '" class="remark"  data-id="' + res.orderId + '" data-vieworderid="' + res.orderIdView + '">' + (res.dynamicRemark != null && res.dynamicRemark != '' ? res.dynamicRemark : i18nDataList.wu) + '</a>';
                    }
                }
                , { fixed: '', title: i18nDataList.baroperating, width:80, toolbar: '#baroperating' }
            ]]
            , page: true 
            , limit: 20
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg(i18nDataList.loginMsg);
                    return;
                }
                if (res.msg.indexOf("时间跨度") > -1) {
                    layer.msg(res.msg);
                    return;
                }
                page = curr;
                var total = i18nDataList.dataTotal1 + res.total.TotalCount + i18nDataList.dataTotal2 + res.total.TotalRecFee + i18nDataList.dataTotal3 + res.total.DSH + i18nDataList.dataTotal4 + res.total.DLZ + i18nDataList.dataTotal5
                    + i18nDataList.dataTotal6 + res.total.DYS + i18nDataList.dataTotal7 + res.total.WTD + i18nDataList.dataTotal8 + res.total.YTD + i18nDataList.dataTotal5+','
                    + '<span style="color:#E03636;font-size:14px">' + i18nDataList.dataTotal9 + $("#company").val() + i18nDataList.dataTotal10+'</span>';
                $("#total").html(total);
             }
        }); 
        formSelects = layui.formSelects;
        var currentGameArearData = [];
        var currentGameServerData = [];
        getGameArea();
        getGameGroup();
        getGameJob();
        function getGameArea() {
            $.get('/GameAjax/getGameData?type=20&parentId=' + $("#gameName").find("option:selected").text(), function (result) {
                currentGameArearData = result.data;
                formSelects.data('gameArea', 'local', {
                    arr: currentGameArearData
                });
            });
        }
        function getGameServer(pid, serverName) {
            $.get('/GameAjax/getGameData?type=30&parentId=' + pid, function (result) {
                currentGameServerData = result.data;
                formSelects.data('gameServer', 'local', {
                    arr: currentGameServerData
                });

                if (serverName != undefined && serverName != null && serverName != '') {
                    let serverId = 0;
                    currentGameServerData.forEach(function (val, index) {
                        let item = val;
                        if (item.name.indexOf(serverName) > -1) {
                            serverId = item.value;
                            return false;
                        }
                    });
                    if (serverId > 0) {
                        formSelects.value('gameServer', [serverId], true);
                    } else {

                        formSelects.data('gameServer', 'local', {
                            arr: [
                                { "name": serverName, "value": serverName, "selected": "selected" }
                            ]
                        });
                    }
                }
            });
        }
        function getGameGroup() {
            formSelects.data('gameGroup', 'server', {
                url: '/GameAjax/getGameData?type=50&parentId=' + $("#gameName").find("option:selected").text(),
            });
        }
        function getGameJob() {
            formSelects.data('gameJob', 'server', {
                url: '/GameAjax/getGameData?type=40&parentId=' + $("#gameName").find("option:selected").text(),
            });
        } 
        form.on('select(selectGame)', function (data) {
            gameName = $("#gameName").find("option:selected").text(); 
            //获取所选游戏的平台值
            let pw;
            let mgame;
            $("#gameName option").each(function () {
                var item = $(this).val(); 
                if (item == data.value) {  
                    mgame = $(this).data('mobliegame') == "Y" ? true : false; 
                    pw = $(this).data('pw') == "Y" ? true : false;
                    ispw = pw;
                    mobliegame = mgame;
                    // 找到就跳出循环
                    return false;
                } 
            }); 
            formSelects.data('gameArea', 'local', {
                arr: []
            });
            getGameArea();
            formSelects.data('gameServer', 'local', {
                arr: [
                ]
            });
            getGameGroup();
            getGameJob();
        reloadOrderList();
        return false;
        });
        formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) {
            getGameServer(val.value);
            return true;
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'getCheckData':
                    var data = checkStatus.data;
                    layer.alert(JSON.stringify(data));
                    break; 
                case 'isAll':
                    layer.msg(checkStatus.isAll ? i18nDataList.isAll : i18nDataList.notisAll);
                    break;
                case 'setRecMan':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    zpOrder(orderID);
                    break;
                case 'setJiWei':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    setJiWei(orderID,'');
                    break;
                case 'changeStaBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    changeOrderSta(orderID);
                    break;
                case 'jiajiBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    changeOrderJiaji(orderID);
                    break;
                case 'setOrderSetStaBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    changeOrderSetSta(orderID);
                    break;
                case 'setThrowSetStaBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    changeThrowOrderSetSta(orderID);
                    break;
                case 'delBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    delOrder(orderID);
                    break;
                case 'exportBtn':
                    var orderID = '';
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].orderId);
                        };
                        orderID = tempData.join(',');
                    } 
                    exportOrder(orderID);
                    break;
                case 'smsBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataListsetRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    layer.open({
                        title: i18nDataList.smsBtn,
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 2,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        area: ['70%', '50%'],
                        content: 'sendSms?orderID=' + orderID
                    });
                    break;
                case 'sendToMySystem':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg(i18nDataList.setRecMan);
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    sendOrderToMySystem(orderID);
                    break;
                case 'checkOrderByLocal':
                    checkAsynFailOrder();
                    break;                    
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
           
            if (obj.event === 'del') {
                var id = obj.data.orderID;
                layer.confirm(i18nDataList.del, function (index) {
                    delOrder(id); 
                    layer.close(index);
                });
            } else if (obj.event === 'submtEnd') {
                var orderId = obj.data.orderId;
                layer.confirm(i18nDataList.submtEnd, function (index) {
                    if (!re)
                        return false;
                    re = false;
                    $.ajax({
                        type: "Post",
                        url: "/OrderAjax/SetOrderSta",
                        data: { orderId: orderId, sta: i18nDataList.orderStaus4 },
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function () { layer.msg(i18nDataList.error); re = true; },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                        success: function (data) {
                            re = true;
                            if (data.code > 0) {
                                layer.msg(data.msg, { time: 1500 }, function () {
                                    reloadOrderList();
                                });
                            }
                            else {
                                layer.msg(data.msg, { time: 6000 }, function () {
                                })
                            } 
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    }); 
                });
                return false;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        });
        defaultGame();
        function defaultGame() {
            var tempIsMoblieGame = false;
            var tempIsPw = false;
            $("#gameName option").each(function () {
                var item = $(this).text();
                if (item == $("#gameName").find("option:selected").text()) {
                    var temp = $(this).data('mobliegame');
                    tempIsMoblieGame = temp == "Y" ? true : false;
                    tempIsPw = $(this).data('pw') == "Y" ? true : false;
                    tempIsAccPwd = $(this).data('accpwd') == "Y" ? true : false;
                }
            });
            mobliegame = tempIsMoblieGame;
            ispw = tempIsPw;
        }
        function reloadOrderList(idx) { 
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var gameArea = formSelects.value('gameArea', 'nameStr');
            var gameServer = formSelects.value('gameServer', 'nameStr');
            var gameJob = formSelects.value('gameJob', 'nameStr');
            var groupName = formSelects.value('gameGroup', 'nameStr');   
            var orderSta = formSelects.value('orderSta', 'nameStr'); 
            var skey1 = $("#key1").val();
            var skey2 = $("#key2").val(); 
            var gameAcc = $("#gameAcc").val();
            var skey4 = $("#key4").val();
            gameName = $("#gameName").find("option:selected").text();
            gameName = encodeURI(gameName);
            var bussType = $("#bussType option:selected").val()
            var viewIsNewOrder = $("input[name='viewIsNewOrder']").prop('checked') === true ? "N" : "";
            var isJiaji = $("input[name='isJiajiCheck']").prop('checked') === true ? "Y" : "";
            seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&gameArea=' + gameArea + '&gameServer=' + gameServer + '&gameJob=' + gameJob + '&groupName=' + groupName
                + '&orderSta=' + orderSta + '&key1=' + skey1 + '&key2=' + skey2 + '&key3=' + gameAcc + '&key4=' + skey4 + '&viewIsNewOrder=' + viewIsNewOrder + '&isJiaji=' + isJiaji + '&bussType=' + bussType;
            if (idx != null && idx != undefined && idx != "") {
                seachParam = seachParam + '&idx=' + idx;
            }
            
            tableList.reload({
                url: '/OrderAjax/GetMyOrderList?' + seachParam
                , where: { 
                }
                , page: {
                    curr: page
                }
            });
            return false;
    }
        form.on('checkbox(viewIsNewOrder)', function (data) {
            reloadOrderList();
        });
        form.on('checkbox(viewIsJiaJi)', function (data) {
            layer.tips(i18nDataList.viewIsJiaJi, '#isJiajiCheck', { tips: 1, time: 2000 })
            reloadOrderList();
        });
        var timoutid;
        $(document).on("mouseover", '.orderLine', function () {
            var orderId = $(this).attr('data-id');
            timoutid = setTimeout(function () {
                $.ajax({
                    type: "Get",
                    url: "/OrderAjax/GetOrderContentById",
                    data: { orderId: orderId },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg(i18nDataList.orderLineerror); },
                    beforeSend: function (XMLHttpRequest) { layer.tips(i18nDataList.loading, "#order_" + orderId); },
                    success: function (data) {
                        if (data.code > 0) {
                            var sdata = data.msg;
                            layer.tips(sdata, "#order_" + orderId, { time: 80000 });
                        }
                    }
                });
            }, 500);
        }).mouseout(function () {
            layer.closeAll('tips');
            clearTimeout(timoutid);
        });
        $(document).on('click', '.orderdetails', function () {
            var ids = $(this).attr('data-id');
            var viewID = $(this).attr('data-viewId');
            viewOrderDetails(ids, viewID);
        });
        function viewOrderDetails(orderid, viewID) {
            if (isPc) {
                layer.open({
                    title: viewID + i18nDataList.viewOrderDetails,
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    maxmin: false,
                    type: 2,
                    skin: 'layui-layer-lan',
                    anim: 8,
                    area: ['85%', '92%'],
                    content: 'OrderView?orderId=' + orderid
                });
            } else {
                var fulllayer = layer.open({
                    title: viewID + i18nDataList.viewOrderDetails,
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    maxmin: true,
                    type: 2,
                    skin: 'layui-layer-lan',
                    anim: 8,
                    area: ['95%', '95%'],
                    content: 'OrderView?orderId=' + orderid
                });
                layer.full(fulllayer);
            } 
        }
        $(document).on('click', '.setdlsta', function () {
            var ids = $(this).attr('data-id'); 
            changeOrderSta(ids);
        });
        function changeOrderSta(orderId) {
            layer.open({
                title: i18nDataList.changeOrderSta,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['80%', '240px'],
                content: 'SetOrderSta?orderId=' + orderId
            });
        }
        $(document).on('click', '.setjiwei', function () {
            var ids = $(this).attr('data-id');
            var jiwei = $(this).attr('data-jiwei');
            setJiWei(ids, jiwei);
        });
        function setJiWei(orderID, jiwei) {
            layer.prompt({ title: i18nDataList.setJiWei, shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: jiwei }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false;
              
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/SetOrderJiWei",
                    data: { orderId: orderID, jiwei:value},
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg(i18nDataList.error); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                layer.close(index);
                                reloadOrderList();
                            }
                        });  
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
            });
        }
        function changeOrderJiaji(orderID) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/changeOrderJiaji",
                data: { orderID: orderID},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.error); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 2000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }
        $(document).on('click', '.upImg', function () {
            var ids = $(this).attr('data-id');
            layer.open({
                title: i18nDataList.upImgPop,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [device ? '70%' : '90%', device ? '85%' : '90%'],
                content: 'UploadPic?orderId=' + ids
            });
            return false;
        });
        $(document).on('click', '.mangeImg', function () {
            var ids = $(this).attr('data-id');
            layer.open({
                title: i18nDataList.mangeImgPop ,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 1,
                area: ['80%', device ? '85%' : '500px'],
                content: 'PicMange?orderId=' + ids
            });
            return false;
        });
        function viewOrderPic(orderID) { 
            $.getJSON('/OrderAjax/ViewPic?orderId=' + orderID, function (data) {
                layer.photos({
                    photos: data.msg
                    , anim: 5
                    , shade: [0.3, '#333'],
                    shadeClose: true
                });
            });
        }
        $(document).on('click', '.remark', function () {
            var ids = $(this).attr('data-id');
            var vieworderid = $(this).attr('data-vieworderid');
            layer.open({
                title: vieworderid + i18nDataList.remark,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: [isPc ? '40%' : '90%', isPc?'80%':'95%'],
                content: 'OrderRemark?orderId=' + ids
            }); 
            return false;
        });
        $(document).on('click', '.groupview', function () { 
            var taskid = $(this).attr('data-id');
            layer.open({
                title: taskid + i18nDataList.groupview,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: '/Group/GroupDetails?taskID=' + taskid
            });
        })
        function exportOrder(orderID) {
            var base64 = new Base64();
            var seach = base64.encode(seachParam); 
            layer.open({
                title: i18nDataList.exportOrder,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['80%', '280px'],
                content: 'MyExportOrder?orderId=' + orderID + '&seachText=' + seach
            });
        }
        function sendOrderToMySystem(orderID) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/SendOrderToMySystem",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.error); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 5000 });
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
    }
        $(document).on('click', '.jsr', function () {
            if (isAllowAssRec === "Y") {
                var ids = $(this).attr('data-id');
                zpOrder(ids);
            } 
            });
        function zpOrder(orderID) {
            layer.open({
                title: i18nDataList.zpOrder,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['85%', '95%'],
                content: 'Assignation?orderId=' + orderID+'&type=20'
            });
        } 
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll();
                reloadOrderList();
            }
        };
        window.tools = _tools;  
        var copyOrderIdClipboard = new ClipboardJS('.orderIDcopy');
        copyOrderIdClipboard.on('success', function (e) { 
            layer.msg(i18nDataList.copyOrderIdClipboard1 + e.text + i18nDataList.copyOrderIdClipboard2, { time: 1000 });
            e.clearSelection();
        });
        copyOrderIdClipboard.on('error', function (e) {
            layer.msg(i18nDataList.copyOrderIdClipboard3, { time: 1000 });
        });
        var copyOrderInfoClipboard = new ClipboardJS('.orderInfocopy');
        copyOrderInfoClipboard.on('success', function (e) {
            let triggerid = e.trigger.id;
            let orderId = triggerid.replace('orderinfo_span_', '');
            $.ajax({
                type: "Post",
                url: "/OrderAjax/CopyOrderLog",
                data: { orderId: orderId },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { },
                beforeSend: function (XMLHttpRequest) { },
                success: function (data) {
                },
                complete: function (XMLHttpRequest) {
                }
            });
            layer.msg(i18nDataList.copyOrderIdClipboard4, { time: 1000 });
            e.clearSelection();
        });
        copyOrderInfoClipboard.on('error', function (e) {
            layer.msg(i18nDataList.copyOrderIdClipboard5, {time:1000});
        });
        function checkAsynFailOrder() {
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChcekAsynFailOrder",
                data: {},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.error); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code == 2) {
                        reloadOrderList(data.remark);
                    } else {
                        reloadOrderList();
                    }
                    layer.alert(data.msg);
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            }); 
            return false;
    } 
        $.contextMenu({
            selector: '.orderLine',
            callback: function (key, options) {
                var orderID = options.$trigger.attr("data-id");
                var orderIdView = options.$trigger.attr("data-orderIdView"); 
                
                if (key == 'copyOrderID') {
                   
                    $("#orderid_span_" + orderID).trigger("click");
                }
                else if (key == 'copyOrder') { 
                    $("#orderinfo_span_" + orderID).trigger("click");
                }
                else if (key == 'viewDetails') {
                    viewOrderDetails(orderID, orderIdView);
                }
                else if (key == 'viewPic') {
                    viewOrderPic(orderID);
                }
            },
            items: {
                "viewDetails": { name: i18nDataList.viewDetails, icon: "paste" },
                "sep1": "---------",
                'copyOrderID': { name: i18nDataList.copyOrderID, icon: "edit" }, 
                "sep2": "---------",
                'viewPic': { name: i18nDataList.viewPic, icon: "images" }
            }
        }); 
});