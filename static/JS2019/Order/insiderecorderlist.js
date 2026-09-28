var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                gameName: 'Select Game',
                gameArea: 'Reg/Plat',
                option: 'Select or Enter',
                gameServer: 'Server',
                dlProject: 'PL Project',
                bussType: 'Ord Type',
                bussTypeItem1: 'All',
                bussTypeItem2: 'PL Ord',
                bussTypeItem3: 'CP Ord',
                key1: 'Search',
                key1placeholder: 'ID / Name',
                project: 'Project',
                projectplaceholder: 'PL/CP',
                refresh: 'Refresh',
                refreshTit: 'Refresh Data',
                laytips: 'When there are new orders here, if you need to receive new order alerts immediately and quickly grab orders, you can click here to check',
                laytipstext: 'Learn how to activate new order alerts and quick order grabbing, click here',
                blockquote1: 'System is',
                blockquote2: 'an internal order management system, not a trading platform, and does not provide any guarantee services. Settle all payment disputes directly with',
                blockquote3: '。Total:',
                blockquote4: 'Pending orders，totaling',
                blockquote5: '¥',
            },
            js: {
                actioncol: 'Action',
                actioncolText: 'Take Ord',
                orderIdView: 'Order ID',
                isJiaJiTit: 'Urgent (Prioritize)',
                isJiaJi: 'URG',
                customizeTag: 'Tag：',
                orderdetails: '，Details visible after order taken',
                levelMark: 'Type',
                levelMark1: 'PL',
                levelMark2: 'CP',
                roleName: 'Char Name',
                gameGroup: 'Platform',
                project: 'PL/CP',
                gameInfo: 'Character Info',
                orderSta: 'Order Status',
                orderStaTit: 'Pengding',
                orderHoursDescStr: 'Dead Line',
                recFee: ' Price',
                recFeeTit: 'Rec Fee：',
                recThisOrder: 'Rec',
                recOrderInsureAmount: 'DEP.',
                recOrderInsureAmounttitle: 'No Req',
                recOrderInsureAmountfee: 'No Req',
                recOrderInsureAmount0: 'A deposit of ',
                recOrderInsureAmount1: 'yuan or more is required to accept this order.',
                recOrderInsureAmount2: 'Deposit:',
                img: 'Ref.img',
                imgTit: 'View reference image',
                orderRemark: 'Remarks',
                recOrderTime: 'Post Time',
                dataTotal1: 'System is',
                dataTotal2: 'an internal order management system, not a trading platform, and does not provide any guarantee services. Settle all payment disputes directly with',
                dataTotal3: '。Total:',
                dataTotal4: 'Pending orders，totaling',
                dataTotal5: '¥',
                webdriver: 'Prohibit bot usage! Violations result in account/IP bans!',
                recThisOrder: 'Confirm to take this order? [Reminder] This system is not a trading platform and does not provide guarantees. Order settlement requires direct contact with the merchant.',
                recThisOrdererror: 'Req Err, Retry Later!',
                recThisOrdermsg: 'Grabbing...',
                mangeImg: 'View Ref Pic',
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
                gameArea: '服务区/平台',
                option: '请选择或输入',
                gameServer: '服务器',
                dlProject: '代练项目',
                bussType: '订单类型',
                bussTypeItem1: '全部',
                bussTypeItem2: '代练订单',
                bussTypeItem3: '陪玩订单',
                key1: '搜索',
                key1placeholder: '订单号/角色名',
                project: '项目',
                projectplaceholder: '代练/陪玩项目',
                refresh: '刷新列表',
                refreshTit: '刷新当前数据',
                laytips: '当这里有新订单时，若您需要第一时间接收新单提醒，并且快速抢单，可以点击这里查看',
                laytipstext: '了解如何开通有新单提醒和快速抢单点我',
                blockquote1: '本系统为',
                blockquote2: '内部订单管理系统，并非交易平台，不提供任何担保服务，所有订单请自行与',
                blockquote3: '处理结算问题。当前共有',
                blockquote4: '笔订单等待接单，总金额',
                blockquote5: '元',
            },
            js: {
                actioncol: '操作',
                actioncolText: '接手此单',
                orderIdView: '订单号',
                isJiaJiTit: '加急订单，优先安排',
                isJiaJi: '急',
                customizeTag: '标记：',
                orderdetails: '，只有接下此单才能看详情',
                levelMark: '类型',
                levelMark1: '代练',
                levelMark2: '陪玩',
                roleName: '角色名',
                gameGroup: '阵营/平台',
                project: '代练/陪玩项目',
                gameInfo: '角色信息',
                orderSta: '订单状态',
                orderStaTit: '等待接单',
                orderHoursDescStr: '时限要求',
                recFee: '接手价',
                recFeeTit: '你接手此单的金额：',
                recThisOrder: '接手此单',
                recOrderInsureAmount: '保证金要求',
                recOrderInsureAmounttitle: '没有要求',
                recOrderInsureAmountfee: '没要求',
                recOrderInsureAmount0: '要求交纳了',
                recOrderInsureAmount1: '元或以上保证金才能接下此单',
                recOrderInsureAmount2: '元或以上',
                img: '参考图',
                imgTit: '查看参考图',
                orderRemark: '备注要求',
                recOrderTime: '发布时间',
                dataTotal1: '本系统为',
                dataTotal2: '内部订单管理系统，并非交易平台，不提供任何担保服务，所有订单请自行与',
                dataTotal3: '处理结算问题。当前共有',
                dataTotal4: '笔订单等待接单，总金额',
                dataTotal5: '元',
                webdriver: '禁止使用外挂抢单! 违规操作将会被封禁账号和IP!',
                recThisOrder: '确定接下此单吗？【提醒】本系统不属于交易平台，不提供担保，订单结算需要自行和本商户联系',
                recThisOrdererror: '接单请求出错，请稍候再试！',
                recThisOrdermsg: '抢单中..',
                mangeImg: '查看参考图',
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
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'laypage'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects;
    laydate = layui.laydate;
    var laypage = layui.laypage;
    var laypage = layui.laypage;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var currentPage = $("#currentPage").val();
    var cgameArea = $("#cgameArea").val();
    var cgameServer = $("#cgameServer").val();
    var cproJect = $("#cproJect").val();
    var errmsg = $("#errmsg").val();
    var loadIndex;
    $(document).keyup(function (event) {
        getKey();
    });
    function getKey() {
        if (event.keyCode == 13) {
            $(".sechbtn").trigger("click");
        }
    }
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var searchData = form.val('fm');
    function objectToQueryString(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params.append(key, obj[key]);
            }
        }
        return params.toString();
    }
    var gameName = $("#gameName").find("option:selected").text();
    var gameArea = $("#gameArea").find("option:selected").text();
    var gameServer = $("#gameServer").find("option:selected").text();
    var company = $("#company").val();
    var key = $("#key1").val();
    var isPw = false;
    var isMoblieGame = false;
    var mark1 = '', mark2 = '';
    var seachParam = 'gameName=' + gameName;
    var indexLoad;
    var mobliegame = false;
    var ispw = false;
    var page = 1;
    var recOrderId;
    var recFailMsg = '';
    var url = '/OrderAjax/GetInternalOrderGrabbingList?' + seachParam;
    var tableList = table.render({
        elem: '#tableList'
        , url: url
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'actioncol', title: i18nDataList.actioncol, width: 75, unresize: false, sort: false, templet: function (res) {
                    let vo = ` <a class='layui-btn layui-btn-danger layui-btn-xs recThisOrder' data-id='${res.orderId}'>${i18nDataList.actioncolText}</a>`;
                    return vo;
                }
            }, {
                field: 'orderIdView', title: i18nDataList.orderIdView, width: 170, unresize: false, templet: function (res) {
                    let vo = '';
                    let isNew = '';
                    let tp = '';
                    let isSplit = '';
                    let ji = '';
                    let taskspan = '';
                    if (res.isJiaJi == "Y") {
                        ji = '<span class="lableb" style="background-color:#FFBBFF" title="' + i18nDataList.isJiaJiTit + '">' + i18nDataList.isJiaJi +'</span>';
                    }
                    if (res.customizeTag != null && res.customizeTag != '') {
                        tp = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" title="' + i18nDataList.customizeTag +'' + res.customizeTag + '">' + res.customizeTag.substring(0, 1) + '</a>';
                    }
                    vo = '<a href="javascript:void(0);" class="orderdetails" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:#0094ff" title="' + res.project + '' + i18nDataList.orderdetails +'">' + res.orderIdView + '</a>';

                    return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.orderIdView
                        + '" title="~">' + isNew + ji + tp + isSplit + taskspan + vo + '</div>';
                }
            },
            {
                unresize: false, title: i18nDataList.levelMark, field: 'levelMark', align: 'center', width: 55, templet: function (res) {
                    var str = '<span class="layui-badge layui-bg-green">' + i18nDataList.levelMark1 +'</span>';
                    if (res.levelMark == 1) {
                        str = '<span class="layui-badge layui-bg-orange">' + i18nDataList.levelMark2 +'</span>';
                    }
                    return str;
                }
            }
            , { field: 'roleName', title: i18nDataList.roleName, width: 150, unresize: false }
            , {
                field: 'gameGroup', title: i18nDataList.gameGroup, align: 'center', width: 70, sort: false,
                nresize: false, templet: function (res) {
                    let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                    if (res.gameGroup == "LM" || res.gameGroup == "lm" || res.gameGroup == "联盟") {
                        group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                    }
                    if (mobliegame) {
                        if (res.gameArea.indexOf('IOS') > -1 || res.gameArea.indexOf('苹果') > -1) {
                            group = '<span title="' + res.gameArea + '" style="color:#0094ff">' + res.gameArea + '</span>';
                        }
                    }
                    return group
                }
            }
            , { field: 'project', title: i18nDataList.project, minWidth: 290, unresize: false }
            , {
                field: 'gameInfo', title: i18nDataList.gameInfo, minWidth: 180, unresize: false, templet: function (res) {
                    var area = res.gameArea;
                    var server = res.gameServer;
                    var job = res.gameJob;
                    var level = res.levelMark;
                    var itemlevel = res.itemRemark;
                    var otherlevel = res.otherRemark;

                    return '<span title="">' + area + '/' + server + '/' + job + '/' + itemlevel + '/' + otherlevel + '</span>';
                }
            }
            , {
                field: 'orderSta', title: i18nDataList.orderSta, align: 'center', width: 60, templet: function (res) {
                    let colorStr = '#219227;';
                    let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="' + i18nDataList.orderStaTit +'" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';

                    return str;
                }
            }
            , {
                field: 'orderHoursDescStr', title: i18nDataList.actionorderHoursDescStrcol, width: 70, align: 'center', unresize: false, templet: function (res) {
                    let div = '<span style="color:#5BB75B">' + res.orderHoursDescStr + '</span>';
                    return div;
                }
            }
            , {
                field: 'recFee', title: i18nDataList.recFee, align: 'center', width: 70, unresize: false, sort: true, templet: function (res) {
                    return '<a href="javascript:void(0)" style="color:#ff6a00;font-weight:600"  title="' + i18nDataList.recFeeTit + res.recFee + i18nDataList.actioncol + i18nDataList.dataTotal5 +'">' + res.recFee + '</a>';
                }
            }
            , {
                field: 'recOrderInsureAmount', title: i18nDataList.recOrderInsureAmount, align: 'center', width: 90, unresize: false, sort: false, templet: function (res) {
                    let title = i18nDataList.recOrderInsureAmounttitle;
                    let fee = i18nDataList.recOrderInsureAmountfee;
                    if (res.recOrderInsureAmount > 0) {
                        title = i18nDataList.recOrderInsureAmount0 + res.recOrderInsureAmount.toFixed(1) + i18nDataList.recOrderInsureAmount1;
                        fee = res.recOrderInsureAmount.toFixed(1) + i18nDataList.recOrderInsureAmount2;
                    }
                    return '<a href="javascript:void(0)" style="color:#E03636"  title="' + title + '">' + fee + '</a>';
                }
            }
            , {
                field: 'img', title: i18nDataList.img, width: 70, align: 'center', unresize: false, sort: false, templet: function (res) {
                    return '<button class="layui-btn layui-btn-xs layui-btn-normal mangeImg" style="margin-right: 2px" lay-submit="" data-id="' + res.orderId + '" title="' + i18nDataList.imgTit + '">' + i18nDataList.img +'</button>';
                }
            }
            , {
                field: 'orderRemark', title: i18nDataList.orderRemark, width: 120, align: 'left', unresize: false, sort: false, templet: function (res) {
                    return '<span title="' + res.orderRemark + '" style="">' + (res.orderRemark == null ? "" : res.orderRemark) + '</span>';
                }
            }
            , {
                field: 'recOrderTime', title: i18nDataList.recOrderTime, width: 90, unresize: false, sort: true, templet: function (res) {
                    return '<span title="' + i18nDataList.recOrderTime +'" style="">' + (res.recOrderTime == null ? "" : res.recOrderTime) + '</span>';
                }
            }
            , {
                field: 'actioncol2', title: i18nDataList.actioncol, width: 75, unresize: false, templet: function (item) {
                    let vo = '<a class="layui-btn layui-btn-danger layui-btn-xs recThisOrder" data-id="' + item.orderId + '" style="">' + i18nDataList.recThisOrder +'</a>';
                    return vo;
                }
            }
        ]]
        , page: true
        , limit: 20
        , limits: [10, 20]
        , done: function (res, curr, count) {
            page = curr;
            var total = i18nDataList.dataTotal1 + company + i18nDataList.dataTotal2 + company + i18nDataList.dataTotal3 + res.total.TotalCount + i18nDataList.dataTotal4 + res.total.TotalRecFee + i18nDataList.dataTotal5;
            $("#total").html(total);
            if (res.msg != '') {
                layer.msg(res.msg);
            }
        }
    });

    formSelects.data('gameArea', 'server', {
        url: '/GameAjax/getGameData?type=20&parentId=' + $("#gameName").find("option:selected").text() + '&selectValue=' + cgameArea,
    });
    //formSelects.data('dlProject', 'server', {
    //    url: '/GameAjax/getProject?gameId=' + $("#gameName").find("option:selected").val()+ '&proJect=' + cproJect,
    //}); 
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        let pw;
        let mgame;
        $("#gameName option").each(function () {
            var item = $(this).val();
            if (item == data.value) {
                mgame = $(this).data('mobliegame') == "Y" ? true : false;
                pw = $(this).data('pw') == "Y" ? true : false;
                ispw = pw;
                mobliegame = mgame;
                return false;
            }
        });
        formSelects.data('gameArea', 'server', {
            url: '/GameAjax/getGameData?type=20&parentId=' + gameName,
        });
        formSelects.data('gameServer', 'local', {
            arr: [
            ]
        });
        //formSelects.data('dlProject', 'server', {
        //    url: '/GameAjax/getProject?gameId=' + data.value,
        //});
        reloadOrderList();
        return false;
    });
    formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) {
        formSelects.data('gameServer', 'server', {
            url: '/GameAjax/getGameData?type=30&parentId=' + val.value + '&selectValue=' + cgameServer,
        });
    }, true);
    if (window.navigator.webdriver) {
        layer.msg(i18nDataList.webdriver, { time: 1000 * 5 }, function () {
        });
        url = '';
    }


    laypage.render({
        elem: 'demo-laypage-theme-1',
        count: $("#tableCount").val(),
        limit: 20,
        theme: '#1E9FFF',
        curr: currentPage,
        jump: function (obj, first) {
            currentPage = obj.curr;
            // 首次不执行
            if (!first) {
                reloadOrderList();
            }
        }
    });

    if (errmsg != '') {
        layer.msg(errmsg);
    }
    $(document).on('click', '.refresh', function () {
        reloadOrderList();
        return false;
    });
    $(document).on('click', '.recnoty', function () {
        reloadOrderList();
        return false;
    });
    $(document).on('click', '.recThisOrder', function () {
        var orderId = $(this).attr('data-id');
        layer.confirm(i18nDataList.recThisOrder, function (index) {
            layer.close(index);
            $.ajax({
                type: "Post",
                url: '/OrderAjax/RecOrderByInternal',
                data: { orderId: orderId, __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val(), },
                dataType: 'json',
                cache: false,
                async: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.recThisOrdererror); re = true; layer.close(loadIndex); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.msg(i18nDataList.recThisOrdermsg, { icon: 16, shade: 0.01 }); },
                success: function (data) {
                    layer.alert(data.msg, function (ay) {
                        layer.close(ay);
                        reloadOrderList();
                    });
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    function reloadOrderList() {
        if (window.navigator.webdriver) {
            layer.msg(i18nDataList.webdriver, { time: 2000 }, function () {
            });
            return;
        }
        var gameArea = formSelects.value('gameArea', 'nameStr');
        var gameServer = formSelects.value('gameServer', 'nameStr');
        var dlProject = formSelects.value('dlProject', 'nameStr');
        var key = $("#key1").val();
        var project = $("#project").val();
        var bussType = $("#bussType option:selected").val();
        seachParam = 'gameName=' + gameName + '&gameArea=' + gameArea + '&gameServer=' + gameServer + '&dlProject=' + dlProject
            + '&key=' + key + '&bussType=' + bussType + '&project=' + project;

        tableList.reload({
            url: '/OrderAjax/GetInternalOrderGrabbingList?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        },
        newOrderNotity: function () {
            reloadOrderList();
        }
    };
    window.tools = _tools;
    window.newOrderNotity = _tools.newOrderNotity;
    $(document).on('click', '.mangeImg', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: i18nDataList.mangeImg,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', isPc ? '85%' : '500px'],
            content: 'PicMange?refer=Y&viewType=5&orderId=' + ids
        });
        return false;
    });
   
});