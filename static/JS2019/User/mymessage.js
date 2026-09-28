var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                tab1: 'Msg List',
                tab2: 'Msg Settings',
                news20: 'Urgent',
                news10: 'Important',
                news0: 'General',
                threetab1: 'Unread',
                threetab2: 'Read',
                refreshTit: 'Re Data',
                refresh: 'Refresh',
                readBtnTit: 'Mark selected as read',
                readBtn: 'Mark Read',
                readAllTit: 'Mark all as read',
                readAll: 'Mark All Read',
                msgsound: 'New Msg Alert',
                msgsoundradio1: 'On',
                msgsoundradio2: 'Off',
                selectsound: 'Alert Tone',
                selectsoundradio1: 'Tone 1',
                selectsoundradio2: 'Tone 2',
                resetPushWechatMsgOrderLable: 'Internal Order Snatch WeChat Notification',
                resetPushWechatMsgOrderTit: 'If you have customized new order alert settings for internal order snatching, click here to reset with one tap.',
                resetPushWechatMsgOrder: 'Reset Notification Settings',
            },
            js: {
                title: 'Msg Title',
                msgType: 'Type',
                msgType1: 'General',
                msgType2: 'Important',
                msgType3: 'Urgent',
                content: 'Content',
                sendUserName: 'Sender',
                from: 'From:',
                isRead: 'Status',
                Read: 'Read',
                notRead: 'Unread',
                createTime: 'Received At',
                readBtn: 'Select rows first',
                error: 'Sys Busy！',
                resetPushWechatMsgOrder: 'Confirm reset internal order push settings？',
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
                tab1: '消息列表',
                tab2: '消息设置',
                news20: '急需处理',
                news10: '重要消息',
                news0: '一般消息',
                threetab1: '未读消息',
                threetab2: '已读消息',
                refreshTit: '刷新当前数据',
                refresh: '刷新数据',
                readBtnTit: '将勾选的消息标记为已读',
                readBtn: '标记为已读',
                readAllTit: '将所有的消息标记为已读',
                readAll: '全部标记为已读',
                msgsound: '系统新消息提醒',
                msgsoundradio1: '开启',
                msgsoundradio2: '关闭',
                selectsound: '新消息提示音',
                selectsoundradio1: '提示音1',
                selectsoundradio2: '提示音2',
                resetPushWechatMsgOrderLable: '内部抢单微信消息',
                resetPushWechatMsgOrderTit: '如果您在内部抢单新单消息做了消息定制，可以点击此处一键重置',
                resetPushWechatMsgOrder: '一键重置消息设置',
            },
            js: {
                title: '消息标题',
                msgType: '消息分类',
                msgType1: '一般消息',
                msgType2: '重要消息',
                msgType3: '急需处理',
                content: '消息内容',
                sendUserName: '发送人',
                from: '来自：',
                isRead: '是否已读',
                Read: '已读',
                notRead: '未读',
                createTime: '接收时间',
                readBtn: '请勾选要操作的数据行',
                error: '系统繁忙！',
                resetPushWechatMsgOrder: '确认重置内部抢单新订单微信消息推送的定制参数吗？',
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
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table', 'element'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        element = layui.element,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var layid = location.hash.replace(/^#tab=/, '');
    element.tabChange('tab', layid);
    element.on('tab(tab)', function (elem) {
        location.hash = 'tab=' + $(this).attr('lay-id');
    });

    var re = true;
    var msgType = 20;
    var isRead = "N";
    var seachParam = 'isRead=N&msgType=' + msgType;
    var indexLoad;
    var page = 1;
    

    element.on('tab(newstab)', function (data) {
        msgType = $(this).attr("lay-id");
        if (isRead == 'N') {
            reloadOrderList(unReadTableList, "N");
        } else {
            reloadOrderList(readTableList, "Y");
        }
    });
    element.on('tab(threetab)', function (data) {
        isRead = $(this).attr("lay-id");
        if (isRead == 'N') {
            reloadOrderList(unReadTableList, "N");
        } else {
            reloadOrderList(readTableList, "Y");
        }
        //let tempGame = data.elem.context.dataset.game;
        //location.href = "/Game/PriceCalculator?gameName=" + tempGame;
    });

    var unReadTableList = table.render({
        elem: '#unReadTableList'
        , height: 'full'
        , cellMinWidth: 150
        , url: '/UserAjax/GetMyMessageList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#unReadtoolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 }
            ,
            {
                field: 'title', title: i18nDataList.title, width: 250, align: 'left', unresize: false, templet: function (res) {
                    let color = "#666";
                    if (res.isRead == "Y") {
                        color = "#bfbfbf";
                    }
                    let vo = '<a href="javascript:void(0);" class="viewMsg" title="' + res.title + '" style="color:' + color + '" data-id="' + res.msgId + '" data-content="' + res.content + '" data-title="' + res.title + '">' + res.title + '</a>';
                    return vo;
                }
            },
            {
                field: 'title', title: i18nDataList.msgType, width: 80, align: 'left', unresize: false, templet: function (res) {
                    let color = "#DB9019";
                    if (res.msgType == 20) {
                        color = "#E03636";
                    } else if (res.msgType == 10) {
                        color = "#C71585";
                    }
                    let vo = res.msgType == 0 ? i18nDataList.msgType1 : res.msgType == 10 ? i18nDataList.msgType2 : i18nDataList.msgType3;
                    return '<span style="color:' + color + '">' + vo +'</span>';
                }
            }
            , {
                field: 'content', title: i18nDataList.content, align: 'left', sort: false, unresize: false, templet: function (res) {
                    let color = "#666";
                    if (res.isRead == "Y") {
                        color = "#bfbfbf";
                    }
                    let vo = '<a href="javascript:void(0);"  style="color:' + color + '" title="' + res.content + '" class="viewMsg" data-id="' + res.msgId + '" data-content="' + res.content + '" data-title="' + res.title + '">' + res.content + '</a>';
                    return vo;
                }
            }
            , {
                field: 'sendUserName', title: i18nDataList.sendUserName, width: 170, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="color:#5FB878" title="' + i18nDataList.from  + res.sendUserName + '">' + res.sendUserName + '</a>';
                    return vo;
                }
            }
            , {
                field: 'isRead', title: i18nDataList.isRead, width: 80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.isRead == "Y") {
                        vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + i18nDataList.Read + '">' + i18nDataList.Read +'</a>';
                    } else {
                        vo = '<a href="javascript:void(0);" style="color:#5FB878" title="' + i18nDataList.notRead + '">' + i18nDataList.notRead +'</a>';
                    }
                    return vo;
                }
            }
            , {
                field: 'createTime', title: i18nDataList.createTime, width: 160, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" title="发自：' + res.createTime + '">' + res.createTime + '</a>';
                    return vo;
                }
            }
        ]]
        , page: true
        , limit: 20
        , limits: [10, 20, 30, 40, 50]
        , done: function (res, curr, count) {
            page = curr;
            if (res.total.totalUnread0 > 0) {
                $('.news0').show()
                $('.news0').html(res.total.totalUnread0)
            } else {
                $('.news0').hide()
            }
            if (res.total.totalUnread10) {
                $('.news10').show()
                $('.news10').html(res.total.totalUnread10)
            } else { $('.news10').hide() }
            if (res.total.totalUnread20) {
                $('.news20').show()
                $('.news20').html(res.total.totalUnread20)
            } else { $('.news20').hide() }
            
            
        }
    });


    seachParam = 'isRead=Y&msgType='+ msgType;
    var readTableList = table.render({
        elem: '#readTableList'
        , height: 'full'
        , cellMinWidth: 150
        ,data:[]
        //, url: '/UserAjax/GetMyMessageList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#readToolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'title', title: i18nDataList.title, width: 250, align: 'left', unresize: false, templet: function (res) {
                    let color = "#666";
                    if (res.isRead == "Y") {
                        color = "#bfbfbf";
                    }
                    let vo = '<a href="javascript:void(0);" class="viewMsg" title="' + res.title + '" style="color:' + color + '" data-id="' + res.msgId + '" data-content="' + res.content + '" data-title="' + res.title + '">' + res.title + '</a>';
                    return vo;
                }
            },
            {
                field: 'title', title: i18nDataList.msgType , width: 80, align: 'left', unresize: false, templet: function (res) {
                    let color = "#DB9019";
                    if (res.msgType == 20) {
                        color = "#E03636";
                    } else if (res.msgType == 10) {
                        color = "#C71585";
                    }
                    let vo = res.msgType == 0 ? i18nDataList.msgType1 : res.msgType == 10 ? i18nDataList.msgType2 : i18nDataList.msgType3;
                    return '<span style="color:' + color + '">' + vo + '</span>';
                }
            }
            , {
                field: 'content', title: i18nDataList.content, align: 'left', sort: false, unresize: false, templet: function (res) {
                    let color = "#666";
                    if (res.isRead == "Y") {
                        color = "#bfbfbf";
                    }
                    let vo = '<a href="javascript:void(0);"  style="color:' + color + '" title="' + res.content + '" class="viewMsg" data-id="' + res.msgId + '" data-content="' + res.content + '" data-title="' + res.title + '">' + res.content + '</a>';
                    return vo;
                }
            }
            , {
                field: 'sendUserName', title: i18nDataList.sendUserName, width: 170, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="color:#5FB878" title="' + i18nDataList.from + + res.sendUserName + '">' + res.sendUserName + '</a>';
                    return vo;
                }
            }
            , {
                field: 'isRead', title: i18nDataList.isRead, width: 80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.isRead == "Y") {
                        vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + i18nDataList.Read + '">' + i18nDataList.Read +'</a>';
                    } else {
                        vo = '<a href="javascript:void(0);" style="color:#5FB878" title="' + i18nDataList.notRead + '">' + i18nDataList.notRead +'</a>';
                    }
                    return vo;
                }
            }
            , {
                field: 'createTime', title: i18nDataList.createTime, width: 160, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" title="发自：' + res.createTime + '">' + res.createTime + '</a>';
                    return vo;
                }
            }
        ]]
        , page: true
        , limit: 20
        , limits: [10, 20, 30, 40, 50]
        , done: function (res, curr, count) {
            page = curr;
            //$('.news0').html(res.total.totalUnread0)
            //$('.news10').html(res.total.totalUnread10)
            //$('.news20').html(res.total.totalUnread20)
        }
    });

    table.on('toolbar(unReadTableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList(unReadTableList, 'N');
                break;
            case 'readBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg(i18nDataList.readBtn);
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].msgId);
                };
                var msgId = tempData.join(',');
                setRead(msgId);
                break;
            case 'readAll':
                setRead("");
                break;
        };
    });

    table.on('toolbar(readTableList)', function (obj) {
        switch (obj.event) {
            case 'refresh':
                reloadOrderList(readTableList, 'Y');
                break;
        };
    });

    function reloadOrderList(control, read) {
        control.reload({
            url: '/UserAjax/GetMyMessageList?isRead=' + read + '&msgType=' + msgType
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }

    function setRead(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SetMyMessageRead",
            data: { msgId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                reloadOrderList(unReadTableList, "N");
                reloadOrderList(readTableList, "Y");
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $(document).on('click', '.viewMsg', function () {
        var ids = $(this).attr('data-id');
        var title = $(this).attr('data-title');
        var contents = $(this).attr('data-content');
        layer.open({
            title: title,
            type: 1,
            skin: 'layui-layer-lan',
            closeBtn: 1,
            anim: 2,
            shadeClose: true,
            area: ['80%', '400px'],
            content: '<div style="margin:10px 10px 10px 10px;font-size:16px">' + contents + '</div>'
        });
        setRead(ids);
    });
    form.on('radio(msgsound)', function (data) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SaveUserConfigForMsgSoundSwichtByUserId",
            data: { status: data.value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    form.on('radio(selectsound)', function (data) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SaveUserConfigForMsgSoundSoureByUserId",
            data: { value: data.value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    $(document).on('click', '.resetPushWechatMsgOrder', function () {
        layer.confirm(i18nDataList.resetPushWechatMsgOrder, function (index) {           
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/ResetInterNalNewOrderPushWechatMsgSetting",
                data: {},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.error); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, {}, function (ex) {
                        layer.close(index);
                        layer.close(ex);
                    });
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
       
    });

});