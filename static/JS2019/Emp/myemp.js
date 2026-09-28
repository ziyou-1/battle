var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                gameName: 'Select Game',
                allGame: 'All Games',
                dateType1: 'Rec Tm',
                dateType2: 'Cmplt Tm',
                dateType3: 'Entry Tm',
                dateType4: 'settl Tm',
                settingSta: 'settl Sts',
                settingStaSelect1: 'select',
                settingStaSelect2: 'Unsettled',
                settingStaSelect3: 'settled',
                orderSta: 'Ords Sts',
                orderStaus1: 'All',
                orderStaus2: 'P Login',
                orderStaus3: 'Boosting',
                orderStaus4: 'P Review',
                orderStaus5: 'Comp',
                orderStaus6: 'Issue',
                orderStaus7: 'Refd',
                orderStaus8: 'Paused',
                key1: 'Srch 1',
                key1placeholder: 'Ord/Role',
                key2: 'Srch 2',
                key2placeholder: 'PL Item',
                seachBtn: 'Srch',
                refresh: 'Re',
                refreshTit: 'Re Data',
                applicationBtnTit1: 'To',
                applicationBtnTit2: 'Request settl for selected ordrds.',
                applicationBtn: 'Apply Settl',
                exportBtn: 'Export Rec',
                exportBtnTit: 'Export Results',
                snycSettStatusBtn: 'Sync Sts to My Sys',
                snycSettStatusBtnTil: 'Check bills to sync to my system for easy reconciliation',
            },
            js: {
                userName: 'User',
                tempAmount: 'EST. REV',
                tempAmountTit: 'Estimated Order Revenue',
                tempAmountTips: 'Preliminary amount - Note: Invalid if order not completed by yourself',
                bonusAmount: 'ACT. REV',
                bonusAmountTit: 'Final settled amount (valid only after self-completion)',
                bonusAmountTips: 'Post-completion revenue; Main settlement standard for merchants',
                deductFee: "Tax",
                deductFeeTips: "This tax is set by the merchant. Please contact the merchant's customer service for details; this has nothing to do with Jidanpu.",
                empType: 'Income Type',
                empType1: 'Order Wage',
                empType2: 'Sales Comm',
                orderId: 'Assoc Ord No',
                orderIdlablebTips: 'Order Deleted',
                orderIdlableb: 'Del',
                orderIdlablebtipb: 'Click to View Dtl',
                orderId: 'Sys Ord No',
                gameRole: 'Role',
                gameName: 'Game',
                dlProject: 'PL Proj',
                orderSta: 'Ord Sts',
                orderStaValue1: 'All',
                orderStaValue2: 'P Login',
                orderStaValue3: 'Boosting',
                orderStaValue4: 'P Review',
                orderStaValue5: 'Comp',
                orderStaValue6: 'Issue',
                orderStaValue7: 'Refd',
                orderStaValue8: 'Paused',
                setdlsta: 'Current Sts：',
                createTime: 'Record Tm',
                completeTime: 'Submit Tm',
                logUserName: 'Operator',
                settingSta: 'Settl Sts',
                settingSta1: 'Already Settled',
                settingSta2: 'Pending Settlement',
                settingSta3: 'Settled',
                settingSta4: 'Unsettled',
                settingTime: 'Clearance Tm',
                empPayId: 'Pay Method',
                empPayIdlableb: 'Online Pay',
                applicationSett: 'Applied Settlement?',
                applicationSettTit: 'You can proactvely apply for settement of whichorders Dperation steps 1.Check the orders that need to be setled 2 Cick the application settement burtonathe top of the list:.',
                applicationSettTitcont1: 'Applied',
                applicationSettTitcont2: 'Not Applied',
                dataTotal1: 'All orders you have accepted will generate bills here. There are',
                dataTotal2: 'bills under current filter conditions.，Total (excluding refunded orders):Estimated revenue:¥',
                dataTotal3: 'Actual revenue:¥',
                dataTotal4: 'Settled',
                dataTotal5: '（¥',
                dataTotal6: '）,Unsettled',
                dataTotal7: '（estimated ¥',
                dataTotal8: '）,By default, data from the last 6 months is shown. To expand the time range, manually select the start date.',
                toolbar: 'Please select records to operate on.',
                viewOrderDetails: 'Ord Dtl',
                error: 'Sys Busy！',
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
                gameName: '选择游戏',
                allGame: '全部游戏',
                dateType1: '接手时间',
                dateType2: '交单时间',
                dateType3: '录单时间',
                dateType4: '结算时间',
                settingSta: '结算状态',
                settingStaSelect1: '请选择',
                settingStaSelect2: '未结算',
                settingStaSelect3: '已结算',
                orderSta: '订单状态',
                orderStaValue1: '全部',
                orderStaValue2: '待上号',
                orderStaValue3: '代练中',
                orderStaValue4: '待验收',
                orderStaValue5: '已完成',
                orderStaValue6: '问题单',
                orderStaValue7: '已退单',
                orderStaValue8: '已暂停',
                key1: '搜索1',
                key1placeholder: '订单号/角色名',
                key2: '搜索2',
                key2placeholder: '代练项目',
                seachBtn: '搜索',
                refresh: '刷新列表',
                refreshTit: '刷新当前数据',
                applicationBtnTit1: '向',
                applicationBtnTit2: '申请结算指定的订单',
                applicationBtn: '申请结算',
                exportBtn: '导出记录',
                exportBtnTit: '导出查询结果',
                snycSettStatusBtn: '同步结算状态到我的系统',
                snycSettStatusBtnTil: '勾选要同步的账单同步到我的系统，方便在自家系统里对账哪些结算过',
            },
            js: {
                userName: '用户名称',
                tempAmount: '预计收入',
                tempAmountTit: '代表预计会获得的订单收入',
                tempAmountTips: '预计收入金额，注意，如果你没亲自提交完单，此金额可能无效',
                bonusAmount: '实际收入',
                bonusAmountTit: '表示最终您获得的订单收入，只有当您亲自提交了完单成后该金额才会生效',
                bonusAmountTips: '交单后才作数的收入金额，提示：商家大部分都是以此金额作为结算标准',
                deductFee: "扣点",
                deductFeeTips: "此扣点由商家设置，具体请联系商家客服了解详情。注意：本扣点与平台官方无关，并非平台官方收取。",
                empType: '收入类型',
                empType1: '打单工资',
                empType2: '销售提成',
                orderId: '关联订单号',
                orderIdlablebTips: '该订单已被删除了',
                orderIdlableb: '删',
                orderIdlablebtipb: '点击查看订单详情',
                orderId: '系统内置单号',
                gameRole: '角色名',
                gameName: '游戏名称',
                dlProject: '代练项目',
                orderSta: '订单状态',
                orderStaValue1: '全部',
                orderStaValue2: '待上号',
                orderStaValue3: '代练中',
                orderStaValue4: '待验收',
                orderStaValue5: '已完成',
                orderStaValue6: '问题单',
                orderStaValue7: '已退单',
                orderStaValue8: '已暂停',
                setdlsta: '当前订单状态：',
                createTime: '记录时间',
                completeTime: '提交时间',
                logUserName: '记录人',
                settingSta: '结算状态',
                settingSta1: '该笔订单已结算过',
                settingSta2: '该笔订单还未进行结算',
                settingSta3: '已结算',
                settingSta4: '未结算',
                settingTime: '清算时间',
                empPayId: '结账方式',
                empPayIdlableb: '在线结算',
                applicationSett: '是否已申请结算',
                applicationSettTit: '你可以主动申请结算哪些订单。操作步骤：1、勾选要清算的订单；2、点击列表头部的申请结算按钮',
                applicationSettTitcont1: '已申请',
                applicationSettTitcont2: '未申请',
                dataTotal1: '您接手过的订单，都会在此产生账单，本次筛选条件下共计',
                dataTotal2: '条账单，总计(不含已退单)：预计收入',
                dataTotal3: '元，实际收入',
                dataTotal4: '元，已结账',
                dataTotal5: '笔（',
                dataTotal6: '元）,还未结账',
                dataTotal7: '笔（预计有',
                dataTotal8: '元），默认显示最近6个月数据，若需扩大时间范围，可手动选择起始日期',
                toolbar: '请选中要操作的记录',
                viewOrderDetails: '订单详情',
                error: '系统繁忙！',
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


i18n.set(i18nData);
var i18nDataList = i18nData.messages[localStorage.getItem('layui-i18n-local-test') || 'zh-CN'].js

const template = $('#template').html();
const templatehtml = laytpl(template, { tagStyle: 'modern' }).render();
$('#root').html(templatehtml);


layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects;
    laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
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
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate;
    var indexLoad;
    var page = 1;
    laydate.render({
        elem: '#sDate'
        , type: 'datetime'
        , min: -730
    });
    laydate.render({
        elem: '#eDate'
        , type: 'datetime'
    });
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        reloadOrderList();
        return false;
    });
    const showDeductFee = deductFeeType == 1 ? true : false;
    var tableList = table.render({
        elem: '#tableList'
        //, height: tableHeight
        , url: '/EmpAjax/GetMyEmp?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 }
            , {
                field: 'userName', title: i18nDataList.userName, width: 90, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + res.userName + '</span>';
                }
            }
            , {
                field: 'tempAmount', title: i18nDataList.tempAmount + '<i class="layui-icon layui-bangzhu" lay-tips="' + i18nDataList.tempAmountTit + '"></i>', width: 80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<span style="color:#FF5722" lay-tips="' + i18nDataList.tempAmountTips + '">' + res.tempAmount + '</span>';
                    return vo;
                }
            }
            , {
                field: 'bonusAmount', title: i18nDataList.bonusAmount + '<i class="layui-icon layui-bangzhu" lay-tips="' + i18nDataList.bonusAmountTit + '"></i>', width: 80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<span style="color:#FF5722" lay-tips="' + i18nDataList.bonusAmountTips + '">' + res.bonusAmount + '</span>';
                    return vo;
                }
            }, {
                field: 'deductFee', title: i18nDataList.deductFee, width: 80, align: 'center', hide: !showDeductFee, sort: false, unresize: false, templet: function (res) {
                    let vo = '<span style="color:#FF5722" lay-tips="' + i18nDataList.deductFeeTips + '">' + res.deductFee + '</span>';
                    return vo;
                }
            }
            , {
                field: 'empType', title: i18nDataList.empType, align: 'center', width: 70, sort: false,
                unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.empType == '效绩提成') {
                        vo = '<span style="color:#E03636">' + i18nDataList.empType1 + '</span>';
                    } else if (res.empType == '接单提成') {
                        vo = '<span style="color:#5FB878">' + i18nDataList.empType2 + '</span>';
                    } else {
                        vo = '<span style="color:#5FB878">' + res.empType + '</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'orderId', title: i18nDataList.orderId, width: 145, unresize: false, templet: function (res) {
                    let tipb = '<span class="lableb" style="background-color:#FF534D" title="' + i18nDataList.orderIdlablebTips + '">' + i18nDataList.orderIdlableb + '</span>';
                    if (res.orderIsDel != "Y") {
                        tipb = '';
                    }
                    let vo = tipb + '<a href="javascript:void(0);" class="orderdetails" data-id="' + res.orderId + '" style="color:#0094ff" title="' + i18nDataList.orderIdlablebtipb + '">' + res.jionOrder + '</a>';
                    return vo;
                }
            }
            , {
                field: 'orderId', title: i18nDataList.orderId, width: 150, hide: true, unresize: false
            }
            , {
                field: 'gameRole', title: i18nDataList.gameRole, width: 120, unresize: false, templet: function (res) {
                    return '<span title="">' + res.gameRole + '</span>';
                }
            }
            , {
                field: 'gameName', title: i18nDataList.gameName, width: 80, align: 'center', unresize: false
            }
            , {
                field: 'dlProject', title: i18nDataList.dlProject, align: 'left', unresize: false, templet: function (res) {
                    let vo = '<span>' + res.dlProject + '</span>';
                    return vo;
                }
            }
            , {
                field: 'orderSta', title: i18nDataList.orderSta, width: 70, align: 'center', unresize: false, templet: function (res) {
                    let colorStr = '#b0aeae;';
                    switch (res.orderSta) {
                        case i18nDataList.orderStaValue2:
                            colorStr = '#585858';
                            break;
                        case i18nDataList.orderStaValue3:
                            colorStr = '#219227';
                            break;
                        case i18nDataList.orderStaValue4:
                            colorStr = '#ff6a00';
                            break;
                        case i18nDataList.orderStaValue5:
                            colorStr = '#0094ff';
                            break;
                        case i18nDataList.orderStaValue8:
                            colorStr = '#FF5722';
                            break;
                        case i18nDataList.orderStaValue6:
                            colorStr = '#ff0000';
                            break;
                        case i18nDataList.orderStaValue7:
                            colorStr = '#efaaaa';
                            break;
                    }
                    let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="' + i18nDataList.setdlsta + res.orderSta + '" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';

                    return str;
                }
            }
            , {
                field: 'createTime', title: i18nDataList.createTime, align: 'center', width: 80, unresize: false, templet: function (res) {
                    let vo = '<span>' + res.createTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'completeTime', title: i18nDataList.completeTime, align: 'center', width: 80, unresize: false, templet: function (res) {
                    let vo = '<span>' + res.completeTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'logUserName', title: i18nDataList.logUserName, align: 'center', width: 90, unresize: false, templet: function (res) {
                    let vo = '<span>' + res.logUserName + '</span>';
                    return vo;
                }
            }
            , {
                field: 'settingSta', title: i18nDataList.settingSta, width: 70, align: 'center', unresize: false, sort: false, templet: function (res) {
                    let str = '<a href="javascript:void(0)" class="lableb setsta" data-id="' + res.empId + '" title="' + (res.settingSta == 'Y' ? i18nDataList.settingSta1 : i18nDataList.settingSta2) + '" style="background-color:' + (res.settingSta == 'Y' ? '#9ACD32' : '#CDC8B1') + ';">' + (res.settingSta == 'Y' ? i18nDataList.settingSta3 : i18nDataList.settingSta4) + '</a>';
                    return str;
                }
            }
            , {
                field: 'settingTime', title: i18nDataList.settingTime, width: 70, align: 'center', unresize: false, templet: function (res) {
                    let vo = '<span>' + res.settingTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'empPayId', title: i18nDataList.empPayId, width: 70, align: 'center', unresize: false, templet: function (res) {
                    let vo = '<span class="lableb" style="background-color:#0094ff">' + (res.empPayId > 0 ? i18nDataList.empPayIdlableb : "") + '</span>';
                    return vo;
                }
            }
            , {
                field: 'applicationSett', title: i18nDataList.applicationSett + '<i class="layui-icon layui-bangzhu" title="' + i18nDataList.applicationSettTit + '"></i>', width: 110, align: 'center', unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.applicationSett == 'Y') {
                        vo = '<span style="color:#E03636">' + i18nDataList.applicationSettTitcont1 + '</span>';
                    } else {
                        vo = '<span style="color:#5FB878">' + i18nDataList.applicationSettTitcont2 + '</span>';
                    }
                    return vo;
                }
            }
        ]]
        , page: true
        , limit: 20
        , limits: [10, 20, 30, 40, 50, 100]
        , done: function (res, curr, count) {
            page = curr;
            var total = i18nDataList.dataTotal1 + res.total.totalCount + i18nDataList.dataTotal2 + res.total.totalTempAmount + i18nDataList.dataTotal3 + res.total.totalBonusAmount + i18nDataList.dataTotal4 + res.total.totalSetCount + i18nDataList.dataTotal5 + res.total.totalSetAmount + i18nDataList.dataTotal6 + res.total.totalNoSetCount + i18nDataList.dataTotal7 + res.total.totalNoSetAmount + i18nDataList.dataTotal8;
            $("#total").html(total);
        }
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'applicationBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg(i18nDataList.toolbar);
                    return false;
                }
                var empId = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empId = tempData.join(',');
                }
                applicationEmp(empId);
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
            case 'snycSettStatusBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg(i18nDataList.toolbar);
                    return false;
                }
                var empId = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empId = tempData.join(',');
                }
                synchEmpOrderToSystem(empId);
                break;
        };
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    function reloadOrderList() {
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        var dateType = $("#dateType").val();
        var dateType = $("#dateType").val();
        var settingSta = $("#settingSta").val();
        var orderSta = formSelects.value('orderSta', 'nameStr');
        var skey = $("#key1").val();
        var skey2 = $("#key2").val();

        seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&dateType=' + dateType + '&settingSta=' + settingSta
            + '&orderSta=' + orderSta + '&key=' + skey + '&key2=' + skey2;

        tableList.reload({
            url: '/EmpAjax/GetMyEmp?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    $(document).on('click', '.orderdetails', function () {
        var ids = $(this).attr('data-id');
        viewOrderDetails(ids);
    });
    function viewOrderDetails(orderid) {
        layer.open({
            title: orderid + i18nDataList.viewOrderDetails,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['60%', '92%'],
            content: '/Order/OrderView?orderId=' + orderid
        });
    }
    function exportOrder(orderID) {
        window.open("/Emp/ExportMyEmp?" + seachParam, "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }
    function applicationEmp(ids) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/ApplicationEmp",
            data: { empId: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
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
    function synchEmpOrderToSystem(ids) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/SynchEmpOrderToMySystem",
            data: { empIdx: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 2000 }, function () {
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
});