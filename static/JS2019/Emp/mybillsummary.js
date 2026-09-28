var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                sDate: 'Settl Tm',
                key1: 'Ord No Search',
                key1placeholder: 'Ord ID',
                seachBtn: 'Search',
                total1: 'Online Settl Summary (Excl. Offline)',
                refreshTit: 'Refresh Data',
                refresh: 'Refresh',
            },
            js: {
                tableList: 'Settl Summary Table',
                userName: 'Operator',
                totalRowText: 'Total',
                payAmount: 'Payout Amt',
                realAmount: 'Actual Amt',
                serviceAmount: 'Svc Fee',
                recAlipayAcc: 'Recipient Acct',
                payTranOrderNo: 'Alipay Transfer ID',
                createTime: 'Payout Tm',
                payUserName: 'Settler',
                none: 'Action',
                noneTit: 'Click for Dtl',
                noneBtn: 'Del',
                total1: 'To',
                total2: 'Online Settlement Summary (Offline settlements excluded).Total payouts:',
                total3: 'Total payout amount:¥',
                total4: 'Actual received total: ¥',
                total5: '.',
                viewOrderDetails: 'Ord Dtl',
                tempBonus: 'Est Settl',
                realAmount: 'Actual Settl',
                orderId: 'Ref Ord',
                orderIdTit: 'View Ord Dtl',
                project: 'Proj',
                gameRole: 'Role',
                Tabletotal1: 'Trans No:',
                Tabletotal2: 'Related Dtl',
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
                sDate: '结算时间',
                key1: '订单号搜索',
                key1placeholder: '单号',
                seachBtn: '搜索',
                total1: '在线结算记录汇总(不包含线下结算)',
                refreshTit: '刷新当前数据',
                refresh: '刷新数据',
            },
            js: {
                tableList: '结算记录汇总表',
                userName: '系统人员名称',
                totalRowText: '合计',
                payAmount: '打款金额',
                realAmount: '实到账金额',
                serviceAmount: '转账手续费',
                recAlipayAcc: '收款账号',
                payTranOrderNo: '支付宝打款流水号',
                createTime: '打款时间',
                payUserName: '结算人',
                none: '操作',
                noneTit: '点击可查看结算明细',
                noneBtn: '明细',
                total1: '至',
                total2: '的在线结算记录汇总(不包含线下结算)，共计',
                total3: '次打款，共计打款金额',
                total4: '元，实际到账总额',
                total5: '元',
                viewOrderDetails: '订单详情',
                tempBonus: '预计结算金额',
                realAmount: '实际结算金额',
                orderId: '关联订单',
                orderIdTit: '点击查看订单详情',
                project: '项目',
                gameRole: '角色名',
                Tabletotal1: '支付流水号：',
                Tabletotal2: '的相关明细',
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
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    var re = true;
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
    var seachParam = 'stime=' + sDate + '&etime=' + eDate;
        var indexLoad; 
        var page = 1;  
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        laydate.render({
            elem: '#sDate'
            , type: 'datetime'
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        });    
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/EmpAjax/GetMyOnLineBillSummaryList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , title: i18nDataList.tableList
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'userName', title: i18nDataList.userName, fixed: 'left', align: 'center', unresize: false, totalRowText: i18nDataList.totalRowText ,templet: function (res) {
                        return '<span style="color:#5FB878">' + res.userName + '</span>';
                    }
                }
                , {
                    field: 'payAmount', title: i18nDataList.payAmount, width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.payAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realAmount', title: i18nDataList.realAmount, width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.realAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'serviceAmount', title: i18nDataList.serviceAmount , width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false,templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.serviceAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'recAlipayAcc', title: i18nDataList.recAlipayAcc, width: isPc ? '13%' : 170, align: 'left', sort: false, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.recAlipayAcc + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'payTranOrderNo', title: i18nDataList.payTranOrderNo, width: isPc ? '15%' : 200, align: 'left', sort: false, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.payTranOrderNo + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: i18nDataList.createTime, width: isPc ? '10%' : 140, align: 'left', sort: true, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.createTime + '</span>';
                        return vo;
                    }
                }, {
                    field: 'payUserName', title: i18nDataList.payUserName, width: isPc ? '10%' : 140, align: 'center', unresize: false,templet: function (res) {
                        return '<span style="">' + res.payUserName + '</span>';
                    }
                }
                , {
                    field: 'none', title: i18nDataList.none, width: isPc ? '5%' : 60, align: 'center', unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" class="viewbilldetail" style="color:#1E9FFF" data-id="' + res.sid + '" data-name="' + res.payTranOrderNo + '" title="' + i18nDataList.noneTit + '">' + i18nDataList.noneBtn +'</a>';
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) { 
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total1").html(sDate + i18nDataList.total1 + eDate + i18nDataList.total2 + res.total.totalCount + i18nDataList.total3 + res.total.totalPayAmount + i18nDataList.total4 + res.total.totalRealAmount + i18nDataList.total5);
             }
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
            };
        });
        function reloadOrderList() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var skey = $("#key1").val();
            seachParam = 'stime=' + sDate + '&etime=' + eDate  + '&key=' + skey;

            tableList.reload({
                url: '/EmpAjax/GetMyOnLineBillSummaryList?' + seachParam
                , where: {
                }
                , page: false
            });
        return false;
    }
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
    
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
                area: ['80%', '90%'],
                content: '/Order/OrderView?orderId=' + orderid
            });
        }

    var tableList2;
    var seachParam2 = '';
    $(document).on('click', '.viewbilldetail', function () {
        var uid = $(this).attr('data-id');
        var payTranOrderNo = $(this).attr('data-name');
        seachParam2 = 'sid='+uid;
        tableList2 = table.render({
            elem: '#tableList2'
            , url: '/EmpAjax/GetMyOnlineBillSummaryDetailsList?' + seachParam2
            , defaultToolbar: []
            , toolbar: '#toolbarDemo2'
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'tempBonus', title: i18nDataList.tempBonus, width: isPc ? '15%' :180, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.tempBonus + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realAmount', title: i18nDataList.realAmount, width: isPc ? '15%' :180, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.realAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'orderId', title: i18nDataList.orderId, width: isPc ? '22%' : 250, align: 'left',unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="orderdetails" data-id="' + res.orderId + '" style="color:#0094ff" title="' + i18nDataList.orderIdTit +'">' + res.jionOrder + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'project', title: i18nDataList.project, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.project + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameRole', title: i18nDataList.gameRole, width: isPc ? '16%' : 180, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span>' + res.gameRole + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , limit: 30
            , limits: []
            , done: function (res, curr, count) {
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total2").html(i18nDataList.Tabletotal1 + payTranOrderNo + i18nDataList.Tabletotal2);
            }
        });
        table.on('toolbar(tableList2)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'exportBtn':
                   
                    break;
            };
        });
    });
          
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); //关闭现有所有弹层
                reloadOrderList();
            },
            reloadOrderDataNoCloseLayer: function () {
                //不关闭现有所有弹层
                reloadOrderList();
            } 
        };
        window.tools = _tools;
});