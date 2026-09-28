layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    ClipboardJS: '/lib/clipboard'
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
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
    });
    var indexLoad;
    var page = 1;
    var orders = "";
    var gameName = $("#gameName").val();
    var splitId = $("#splitId").val();
    var seachParam = 'splitId=' + splitId;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/OrderAjax/GetSplitOrderList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                type: 'checkbox', fixed: 'left', width: 30
            }
            , {
                field: 'orderIdView', title: '订单号', width: 170, unresize: false, templet: function (res) {
                    let vo = '';
                    let isNew = '';
                    let tp = '';
                    let isSplit = '';
                    let ji = '';
                    let taskspan = '';
                    if (res.isRead == 'N') {
                        isNew = '<span class="lableb" style="background-color:#9ACD32" title="新订单，请急时查阅">新</span>';
                    }
                    if (res.isJiaJi == "Y") {
                        ji = '<span class="lableb" style="background-color:#FFBBFF" title="加急订单，优先安排">急</span>';
                    }
                    if (res.customizeTag != null && res.customizeTag != '') {
                        tp = '<a href="javascript:void(0);" class="lableb changeTag" style="background-color:#1E9FFF" data-id="' + res.orderId + '" data-tag="' + res.customizeTag + '" title="标记：' + res.customizeTag + '，点击可以编辑">' + res.customizeTag.substring(0, 2) + '</a>';
                    }
                    if (res.isSplitOrder == 'Y') {
                        isSplit = '<a href="javascript:void(0);" class="lableb" data-splitId="' + res.splitId + '" style="background-color:#FF6347" title="该订单已被拆分成多笔订单">拆</a>';
                    }
                    if (res.taskId > 0) {
                        taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" title="该笔订单有参与排团，团号：' + res.taskId + '，排团名称：' + res.taskName + '">团</a>';
                    }
                    let isNewOpen = 'OrderView?orderId=' + res.orderId + '&viewType=20';
                    let isNewPage = $("#isNewPage").val();
                    let tk = '';
                    if (isNewPage != 'Y') {
                        isNewOpen = 'javascript:void(0);';
                    } else {
                        tk = ' target="_blank" ';
                    }
                    vo = '<a href="' + isNewOpen + '" ' + tk + ' class="' + (isNewPage != "Y" ? "orderdetails" : "") + '" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情，也可以鼠标右键试试看">' + res.orderIdView + '</a>';
                    let copyOrderIdspan = '<span id="orderid_span_' + res.orderId + '" style="display:none" class="orderIDcopy"  data-clipboard-text="' + res.orderIdView + '"></span>';
                    let copyOrderInfospan = '<span id="orderinfo_span_' + res.orderId + '" style="display:none" class="orderInfocopy"  data-clipboard-text="' + res.orderContent + '"></span>';

                    return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.orderIdView
                        + '" title="鼠标右键看看~">' + copyOrderIdspan + copyOrderInfospan + isNew + ji + tp + isSplit + taskspan + vo + '</div>';
                }
            }
            , {
                field: 'roleName', title: '角色名', width: 80, unresize: false, templet: function (res) {
                    let backList = res.backListId > 0 ? '<i class="layui-icon layui-heimingdan2" style="color:#FA4462;margin-right:3px" title="该客户在黑名单中，请留意"/>' : '';
                    let spans = '<a href="javascript:void(0)" title="角色名：' + res.roleName + '，点击可以快速编辑" class="changeRoleName" data-id="' + res.orderId + '" data-rolename="' + res.roleName + '">' + res.roleName + '</a>';
                    return backList + spans;
                }
            }
            , {
                field: 'gameGroup', title: '阵/平', align: 'center', width: 60, sort: false,
                unresize: true, templet: function (res) {
                    let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                    if (res.gameGroup == "LM" || res.gameGroup == "lm" || res.gameGroup == "联盟") {
                        group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                    }
                    return group
                }
            }
            , { field: 'project', title: '代练/陪玩项目', width: 170, unresize: false }
            , {
                field: 'gameInfo', title: '角色信息', unresize: false, templet: function (res) {
                    var area = res.gameArea;
                    var server = res.gameServer;
                    var job = res.gameJob;
                    var level = res.levelMark;
                    var itemlevel = res.itemRemark;
                    var otherlevel = res.otherRemark;

                    return '<span title="' + area + '/' + server + '/' + job + '/' + itemlevel + '/' + otherlevel + '">' + area + '/' + server + '/' + job + '/' + itemlevel + '/' + otherlevel + '</span>';
                }
            }
            , {
                field: 'orderSta', title: '订单状态', align: 'center', width: 60, unresize: false, templet: function (res) {
                    let colorStr = '#b0aeae;';
                    if (res.isThrowOrder == "Y") {
                        res.orderSta = '待抢单';
                    }
                    switch (res.orderSta) {
                        case '待完善':
                            colorStr = '#E03636';
                            break;
                        case '待付款':
                            colorStr = '#E03636';
                            break;
                        case '待抢单':
                            colorStr = '#D15FE8';
                            break;
                        case '待上号':
                            colorStr = '#585858';
                            break;
                        case '代练中':
                            colorStr = '#219227';
                            break;
                        case '待验收':
                            colorStr = '#ff6a00';
                            break;
                        case '已完成':
                            colorStr = '#0094ff';
                            break;
                        case '已暂停':
                            colorStr = '#FF5722';
                            break;
                        case '问题单':
                            colorStr = '#ff0000';
                            break;
                        case '已退单':
                            colorStr = '#efaaaa';
                            break;
                        case '撤销中':
                            colorStr = '#ff5722';
                            break;
                        case '仲裁中':
                            colorStr = '#31bdec';
                            break;
                        case '已仲裁':
                            colorStr = '#c2c2c2';
                            break;
                        case '已撤销':
                            colorStr = '#c2c2c2';
                            break;
                        case '异常中':
                            colorStr = '#ffb800';
                            break;
                    }

                    let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="' + res.orderSta + '中，点击可以更改订单状态' + (res.orderSta == "待抢单" ? "，该订单正在内部接单大厅等待接单" : "") + '" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';

                    return str;
                }
            }
            , {
                field: 'orderHoursDescStr', title: '订单计时', width: 80, align: 'center', unresize: false, templet: function (res) {
                    let div = '<span style="color:#5BB75B">' + res.orderHoursDescStr + '</span>';
                    if (res.orderHoursDescStr.indexOf('-') > -1) {
                        div = '<span style="color:#ff0000">' + res.orderHoursDescStr + '</span>';
                    }
                    return div;
                }
            }
            , {
                field: 'wangwang', title: '旺旺/微信', width: 70, align: 'center', unresize: false, sort: false, templet: function (res) {
                    let concat = '';
                    let tbww = '<a href="http://amos.alicdn.com/getcid.aw?v=2&uid=' + res.WangWang + '&site=cntaobao&s=2&groupid=0&charset=utf-8" target="_blank" title="点击可以启动旺旺与该买家对话">' + res.WangWang + '</a>';
                    if (res.orderSoure.indexOf('淘宝') > -1 || res.orderSoure.indexOf('天猫') > -1) {
                        concat = tbww;
                    }
                    else {
                        concat = res.qq;
                    }

                    return '<span>' + concat + '</span>';
                }
            }
            , {
                field: 'recMan', title: '接手人', align: 'center', width: 70, unresize: false, templet: function (res) {
                    if (res.recManName == "无权查看") {
                        return '<span>无权查看</span>';
                    }
                    var recMan = res.recManName;
                    var autoStr = res.isAutoAssignment == "Y" ? '<span class="lableb" style="background-color:#9ACD32;margin-left:3px" title="该订单开启了智能分配，人员分配顺序为：' + res.autoAssignmentManName + '">智</span>' : '';
                    var DLStaffTil = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? "还未设置，点此指派接手人" : "当前接手人：" + res.recManName + ' 点击可进入指派'
                        , DLStaffClass = (res.recManName == null || res.recManName == "") ? "layui-btn layui-btn-xs layui-btn-normal jsr" : " jsr"
                        , DLStaffTxt = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? "指派接手" : res.recManName
                        , DLStaff = (res.isAutoAssignment == "Y" && res.recManName != null && res.recManName != "") ? "<a class='lableb' href='javascript:void(0)' style='background-color:#9ACD32;margin-left:3px' title='该订单已启用了智能分配，智能分配接手人分别为：" + (res.autoAssignmentManName != null ? res.autoAssignmentManName.replace("/", "->") : "") + "'>智</a>" : '';

                    return '<a class="' + DLStaffClass + '" href="javascript:void(0)" data-id="' + res.orderId + '" title="' + DLStaffTil + '">' + DLStaffTxt + '</a>' + DLStaff

                }
            }
            , {
                field: 'recFee', title: '抛单价', align: 'center', width: 60, unresize: false, sort: false, templet: function (res) {
                    return '<a href="javascript:void(0)" class="changeThrowFee" style="color:#ff6a00;" data-id="' + res.orderId + '" data-fee="' + res.recFee + '" data-isThrow="' + res.isThrowOrder + '" title="预计该笔订单总抛单金额：' + res.recFee + '元，点击可以修改抛单价">' + res.recFee + '</a>';
                }
            }
            , {
                field: 'price', title: '接单价', align: 'center', width: 60, unresize: false, sort: false, templet: function (res) {
                    let color = '#E6E6FA';
                    let title = '该订单在实际中还未结算（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
                    let span = '未';
                    if (res.isSettStatus == "结算中") {
                        color = '#B0E0E6';
                        span = '中';
                        title = '该订单在实际中处于正在结算中（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
                    }
                    else if (res.isSettStatus == "已结算") {
                        color = '#98FB98';
                        span = '结';
                        title = '该订单实际中已成功结算（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
                    }
                    let label = '<a href="javascript:void(0)" class="lableb jsSta" data-id="' + res.orderId + '" style="background-color:' + color + '" title="' + title + '">' + span + '</a>';
                    return label + '<a href="javascript:void(0)" class="' + (res.isAllowChangeOrderFee == "N" ? "" : "editOrderPrice") + '" data-id="' + res.orderId + '" data-fee="' + res.price + '" style="color:#E03636;"  title="该笔订单的接单金额：' + res.price + '元">' + res.price + '</a>';
                }
            }
            , {
                field: 'recFee', title: '退款', align: 'center', width: 60, unresize: false, sort: false, templet: function (res) {
                    let title = '没有退款';
                    if (res.refundFee > 0) {
                        title = '退款金额：' + res.refundFee + '元，退款方式：' + res.refundModel + '，退款时间：' + res.refundTimeStr + '，操作人：' + res.refundUserName;
                    }
                    let label = '<a href="javascript:void(0)" class="" data-id="' + res.orderId + '" data-fee="' + res.refundFee + '" data-refundmodel="' + res.refundModel + '" style="' + (res.refundFee > 0 ? "color:red" : "color:#999") + '" lay-tips=' + title + '>' + res.refundFee + '</a>';
                    return label;
                }
            }
            , {
                field: '', title: '订单截图', align: 'center', width: 70, unresize: false, templet: function (res) {
                    return '<div class="layui-btn-group" style="background: white;">' +
                        '<button class="layui-btn layui-btn-xs layui-btn-normal upImg" style="margin-right: 2px" lay-submit="" data-id="' + res.orderId + '" title="上传截图">传图</button>' +
                        '<button class="layui-btn layui-btn-xs layui-btn-normal mangeImg" style="margin-right: 2px" lay-submit="" data-id="' + res.orderId + '" title="查看截图">看</i></button>'
                        + '</div>'
                }
            }
            , {
                field: 'jiwei', title: '机位', width: 60, align: 'center', unresize: false, sort: false, templet: function (res) {
                    return '<a href="javascript:void(0)" title="' + (res.jiwei.length < 1 ? '当前没有分配机位，点击可分配' : '当前机位：' + res.jiwei) + '" style="" class="setjiwei" data-id="' + res.orderId + '" data-jiwei="' + res.jiwei + '">' + (res.jiwei.length < 1 ? "无" : res.jiwei) + '</a>';
                }
            }
            , {
                field: 'createTime', title: '录单时间', width: 80, align: 'center', unresize: false, sort: true, templet: function (res) {
                    return '<span>' + res.createTime + '</span>';
                }
            }
            , {
                field: 'orderRemark', title: '重要备注', width: 70, unresize: false, templet: function (res) {
                    return '<a href="javascript:void(0)" title="' + (res.orderRemark != null ? res.orderRemark : "点击可以编辑订单重要备注") + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.orderRemark != null ? res.orderRemark : "") + '">' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : "无") + '</a>';
                }
            }
            , {
                field: 'dynamicRemark', title: '订单日志', width: 70, unresize: false, templet: function (res) {
                    return '<a href="javascript:void(0)" title="' + (res.dynamicRemark != null ? res.dynamicRemark : "点击可以快速添加订单日志") + '" style="" class="orderLogs"  data-id="' + res.orderId + '" data-vieworderid="' + res.orderIdView + '">' + (res.dynamicRemark != null && res.dynamicRemark != '' ? res.dynamicRemark : "无") + '</a>';
                }
            }
        ]]
        , page: true
        , limit: 30
        , limits: [10, 20, 30, 40, 50]
        , done: function (res, curr, count) {
            page = curr;
            var total = '本次搜索统计共' + res.total.TotalCount + '笔订单，预计总抛单金额' + res.total.TotalRecFee + '元(不含接单提成)，总接单金额' + res.total.TotalPrice
                + '元，总记录退款金额' + res.total.TotalReFundAmount + '元，预计利润' + (res.total.TotalPrice - res.total.TotalRecFee - res.total.TotalReFundAmount).toFixed(2) + '元。其中：未分配' + res.total.WFP + '笔，待上号' + res.total.DSH + '笔，代练中' + res.total.DLZ + '笔' + '，待验收' + res.total.DYS
                + '笔，已完成' + res.total.YWC + '笔，已暂停' + res.total.YZT + '笔，问题单' + res.total.WTD + '笔，已退单' + res.total.YTD + '笔';
            $("#total").html(total);
        }
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'setRecMan':
                //设置接手人
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
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
            case 'setOrderThrowHomeBtn':
                //内部抛单
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                throwOrderToInternal(orderID, 0);
                break;
            case 'cleanOrderThrowHomeBtn':
                //撤销内部抛单
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                CancelInternalThorwOrder(orderID);
                break;
            case 'setJiWei':
                //设置机位
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                setJiWei(orderID, '');
                break;
            case 'setOrderTipsBtn':
                //设置标记
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                setOrderTag(orderID, '');
                break;
            case 'cleanOrderTipsBtn':
                //清除标记
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                cleanOrderTag(orderID);
                break;
            case 'changeStaBtn':
                //更改状态
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
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
            case 'setOrderJiajiBtn':
                //更改加急
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
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
            case 'sendSmsBtn':
                //发送短信
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                sendSms(orderID);
                break;
            case 'delOrderBtn':
                //删除订单
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
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
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;

        if (obj.event === 'del') {
            var id = obj.data.orderID;
            layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) {
                delOrder(id);
                layer.close(index);
            });
        } else if (obj.event === 'submitEdit') {
            var orderId = obj.data.orderId;
            var viewOrderId = obj.data.orderIdView;
            editOrder(orderId, viewOrderId);
            return false;
        }
    });
    function reloadOrderList() {
        tableListReload();
    }
    function tableListReload() {
        tableList.reload({
            url: '/OrderAjax/GetSplitOrderList?' + seachParam
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
        var viewID = $(this).attr('data-viewId');
        viewOrderDetails(ids, viewID);
    });
    function viewOrderDetails(orderid, viewID) {
        layer.open({
            title: viewID + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['85%', '92%'],
            content: 'OrderView?orderId=' + orderid + '&viewType=20'
        });
    }

    $(document).on('click', '.seachSplitOrder', function () {
        var ids = $(this).attr('data-splitId');
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        seachParam = 'gameName=' + gameName + '&stime=' + encodeURIComponent(sDate) + '&etime=' + encodeURIComponent(eDate) + '&splitId=' + ids;
        tableListReload();
        return false;
    });
    $(document).on('click', '.setdlsta', function () {
        var ids = $(this).attr('data-id');
        changeOrderSta(ids);
    });
    function changeOrderSta(orderId) {
        layer.open({
            title: "更改订单状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '230px'],
            content: 'SetOrderSta?orderId=' + orderId + '&type=1'
        });
    }
    function throwOrderToInternal(orderID, yfee) {
        var pfee = 0;
        layer.prompt({ title: '请设定抛单价', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: yfee }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为0', { time: 1000 }, function () {
                    return;
                });
                return;
            }
            pfee = value;
            if (isInvoFee == "Y") {
                layer.close(index);
                layer.prompt({ title: '用户交纳了多少保证金或以上才能接？写0为不限制', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: 0 }, function (value, index, elem) {
                    postThrowOrderToInternal(orderID, pfee, value, index);
                });
            } else {
                postThrowOrderToInternal(orderID, pfee, 0, index);
            }
        });
    }
    function postThrowOrderToInternal(orderId, pfee, value, index) {
        if (!VerifyMoeny(value)) {
            layer.msg('请输入正确的金额，填0代表不限制', { time: 1500 }, function () {
                return;
            });
            return;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpdateDLOrderRevPriceByOrderID",
            data: { orderId: orderId, fee: pfee, action: 10, insureFee: value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
                        reloadOrderList();
                    });
                } else {
                    layer.msg(data.msg, { time: 3000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function CancelInternalThorwOrder(orderID) {
        layer.confirm('确定从内部接单大厅撤销该订单吗？撤销后，内部接单大厅将看不到该订单', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/RelesOrderToHomeByOrderID",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    }
    $(document).on('click', '.setjiwei', function () {
        var ids = $(this).attr('data-id');
        var jiwei = $(this).attr('data-jiwei');
        setJiWei(ids, jiwei);
    });
    function setJiWei(orderID, jiwei) {
        layer.prompt({ title: '设置机位(不需要机位请写无)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: jiwei }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;

            $.ajax({
                type: "Post",
                url: "/OrderAjax/SetOrderJiWei",
                data: { orderId: orderID, jiwei: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
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
    $(document).on('click', '.jsr', function () {
        var ids = $(this).attr('data-id');
        zpOrder(ids);
    });
    function zpOrder(orderID) {
        layer.open({
            title: "指派接手人",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['85%', '95%'],
            content: 'Assignation?orderId=' + orderID
        });
    }
    $(document).on('click', '.upImg', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: "上传订单截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['80%', '530px'],
            content: 'UploadPic?orderId=' + ids
        });
        return false;
    });
    $(document).on('click', '.mangeImg', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: "查看订单截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: ['80%', '530px'],
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
    $(document).on('click', '.orderLogs', function () {
        var ids = $(this).attr('data-id');
        var vieworderid = $(this).attr('data-vieworderid');
        layer.open({
            title: vieworderid + "的订单日志",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '530px'],
            content: 'OrderRemark?orderId=' + ids
        });
        return false;
    });
    $(document).on('click', '.throwJsSta', function () {
        var ids = $(this).attr('data-id');
        changeThrowOrderSetSta(ids);
    });
    function changeThrowOrderSetSta(orderID) {
        layer.open({
            title: "更改与接手方的结算状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: ['80%', '200px'],
            content: 'setThrowOrderSta?orderID=' + orderID
        });
    }
    var settLayerIndex;
    $(document).on('click', '.jsSta', function () {
        var ids = $(this).attr('data-id');
        changeSettOrderStatus(ids);
    });
    function changeSettOrderStatus(orderID) {
        orders = orderID;
        settLayerIndex = layer.open({
            title: "更改与发单方的结算状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['70%', '260px'],
            content: $(".setDiv")
        });
    }
    form.on('submit(saveSettbtn)', function (data) {
        if (data.field.jsst == "" || data.field.jsst == undefined) {
            layer.alert("请选择一种结算状态！", {
                title: '提示'
            });
            return false;
        }
        if (!re)
            return false;
        re = false;

        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpSettlementOrderByIDX",
            data: { orderId: orders, sta: data.field.jsst },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('数据请求出现异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        layer.close(settLayerIndex);
                        reloadOrderList();
                    }
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    function addOrderToTask(orderID) {
        layer.open({
            title: "将订单加入到排团",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['85%', '90%'],
            content: '/Group/OrderGroup?orderId=' + orderID + '&gameName=' + gameName
        });
    }
    function cleanOrderByTask(orderID) {
        layer.confirm('确定将该订单与该排团解除关系吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/RelesOrderAndTaskByOrderID",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    }
    $(document).on('click', '.changeRoleName', function () {
        var ids = $(this).attr('data-id');
        var rolename = $(this).attr('data-rolename');
        setOrderGameRoleName(ids, rolename);
    });
    function setOrderGameRoleName(orderID, rolename) {
        layer.prompt({ title: '编辑订单角色名，若没有请写无', formType: 0, value: rolename, maxlength: 25 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderGameRoleNameByOrderId",
                data: { orderId: orderID, newRoleName: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
        });
        return false;
    }
    $(document).on('click', '.changeTag', function () {
        var ids = $(this).attr('data-id');
        var tag = $(this).attr('data-tag');
        setOrderTag(ids, tag);
    });
    function setOrderTag(orderID, tag) {
        layer.prompt({ title: '编辑订单标记', formType: 0, value: tag, maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/upOrderTips",
                data: { orderId: orderID, content: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
        });
        return false;
    }
    function cleanOrderTag(orderID) {
        layer.confirm('确定将这些订单的自定义标记清除吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/upOrderTips",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    }
    function changeOrderJiaji(orderID) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UrgentOrderByIDX",
            data: { orderId: orderID },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
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
    $(document).on('click', '.groupview', function () {
        var taskid = $(this).attr('data-id');
        viewTaskDetails(taskid);
    })
    function viewTaskDetails(taskId) {
        layer.open({
            title: taskId + "排团详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '90%'],
            content: '/Group/GroupDetails?taskID=' + taskId
        });
    }
    function delOrder(orderID) {
        layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理', function (index) {
            layer.confirm('删除订单会自动删除接单客服的接单提成记录，是否需要同步删除代练接手人的绩效记录？', {
                btn: ['需要删除接手人绩效', '不需要删除接手人绩效'] //按钮
            }, function () {
                delOrderPost(orderID, "Y", index);
            }, function () {
                delOrderPost(orderID, "N", index);
            });
        });
        return false;
    }
    function delOrderPost(orderID, isDelEmp, index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/DelOrderByIDX",
            data: { orderID: orderID, isDelEmp: isDelEmp },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
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
    }
    function exportOrder(orderID) {
        var base64 = new Base64();
        var seach = base64.encode(seachParam);
        layer.open({
            title: "导出订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['75%', '270px'],
            content: 'ExportOrder?orderId=' + orderID + '&seachText=' + seach
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
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                larryms.message(data.msg, 'success', data.code > 0 ? 'layui-toast' : 'layui-cuowu2', 5);
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function sendSms(orderID) {
        layer.open({
            title: "对指定订单客户发送短信",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['80%', '380px'],
            content: '/Order/SendSms?orderId=' + orderID
        });
    }
    $(document).on('click', '.changeThrowFee', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        var isThrow = $(this).attr('data-isThrow');

        if (isThrow == "Y") {
            changeThrowPrice(orderId, fee);
        }
        else {
            layer.open({
                title: "查看或编辑订单接手绩效",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['60%', '45%'],
                content: '/Emp/ChangeRecPriceByOrder?orderId=' + orderId
            });
        }
    })
    function changeThrowPrice(orderID, fee) {
        layer.prompt({ title: '更改抛单价，可为0，但不能为空', formType: 0, value: fee, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为0', { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/sendDLOrderRevPriceByOrderID",
                data: { orderId: orderID, fee: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
        });
    }
    $(document).on('click', '.editOrderPrice', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        layer.prompt({ title: '更改接单价，可为0，但不能为空', formType: 0, value: fee, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为' + fee, { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderPrice",
                data: { orderId: orderId, fee: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    })
    $(document).on('click', '.orderRemark', function () {
        var orderId = $(this).attr('data-id');
        var remark = $(this).attr('data-remark');
        layer.prompt({ title: '快速修改订单重要备注', formType: 0, value: remark, maxlength: 100 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderRemark",
                data: { orderId: orderId, remark: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    })
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll();
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {

            reloadOrderList();
        }
    };
    window.tools = _tools;
    var copyOrderIdClipboard = new ClipboardJS('.orderIDcopy');
    copyOrderIdClipboard.on('success', function (e) {
        layer.msg('已成功复制订单号：' + e.text + '到剪贴板', { time: 1000 });
        e.clearSelection();
    });
    copyOrderIdClipboard.on('error', function (e) {
        layer.msg('复制订单号失败了，请手动复制', { time: 1000 });
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
        layer.msg('已成功复制订单内容到剪贴板', { time: 1000 });
        e.clearSelection();
    });
    copyOrderInfoClipboard.on('error', function (e) {
        layer.msg('复制订单内容失败了，请手动复制', { time: 1000 });
    });

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
            "viewDetails": { name: "查看详情", icon: "paste" },
            "sep1": "---------",
            'copyOrderID': { name: "复制订单编号", icon: "edit" },
            "sep2": "---------",
            'viewPic': { name: "查看订单截图", icon: "images" },
            'recUserQQ': { name: "与接手人QQ对话", icon: "phone" }
        }
    });
});