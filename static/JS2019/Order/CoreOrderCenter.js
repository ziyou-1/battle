  layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    ClipboardJS: '/lib/clipboard',
    tableMerge: '/lib/extend/tableMerge'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'ClipboardJS', 'laypage', 'element', 'dropdown','tableMerge'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        layPage = layui.laypage,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var screenWidth = window.screen.width;
    var soulTable = layui.soulTable;
    var element = layui.element;
    var dropdown = layui.dropdown;
    var dropdownMut = layui.dropdown;
    var tableMerge = layui.tableMerge;

    var ClipboardJS = layui.ClipboardJS;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var settypeLayer = null;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var ins1 = laydate.render({
        elem: '#datetime',
        range: true,
        min: -180,
        done: function (value, date, endDate) {
            $('#eDate').val('')
            $('#sdate').val('')
            var d = value.split(' - ');
            var s = new Date(d[0]);
            var e = new Date(d[1]);
            var d = (e - s) / (1000 * 60 * 60 * 24);

            if (d > 90) { //选择时间超过一个月时，清空文本框时间数据
                $('.laydate-btns-clear').click()
                layer.msg('日期最多选择90天')
            } else {
                var sdate = date.year + '-' + date.month + '-' + date.date
                var edate = endDate.year + '-' + endDate.month + '-' + endDate.date
                console.log(edate, sdate)

                if (!date.year || !date.month || !date.date || !endDate.year || !endDate.month || !endDate.date) {
                    return false
                }
                console.log(edate, sdate)
                $('#eDate').val(edate)
                $('#sDate').val(sdate)
                //chooseData(0, sdate, edate);
                //chooseDate(0, sdate, edate);
            }
        },
        change: function (value, date, endDate) {
            var d = value.split(' - ');
            var s = new Date(d[0]);
            var e = new Date(d[1]);
            //计算两个时间间隔天数
            var d = (e - s) / (1000 * 60 * 60 * 24);
            if (d > 90) {
                ins1.hint('最多选择90天'); //提示弹框
            }
        },
    });
    //laydate.render({
    //    elem: '#sDate'
    //    , type: 'datetime'
    //    , min: -365

    //});
    //laydate.render({
    //    elem: '#eDate'
    //    , type: 'datetime'
    //});
    laydate.render({
        elem: '#refundDate'
        , type: 'date'
    });
    var re = true;
    $(document).keyup(function (event) {
        getKey();
    });
    function getKey() {
        if (event.keyCode == 13) {
            $(".sechbtn").trigger("click");
        }
    }
    var gameName = $("#gameName").find("option:selected").text();
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var minPrice = $("#minPrice").val();
    var maxPirce = $("#maxPirce").val();  
    var rightMenuCopyOrder = $("#rightMenuCopyOrder").val();  
    var iswzrymodel = 'N';
    var isViewSoure = 'Y';
    var platStatus = 0; 
    var IDX = [];   
    getCustomerService();
    getAllOrderSoure();  

    var indexLoad; 
    var currPage = 1;
    var limit = 30;
    var params;
    var OrderIDX = '';
    var orders = "";
    var table2;
    var pushOrdertotalLayer;
    var selectMonth = 0;
    /**
     * 动态菜单是否已加载
     * */
    var inst; 
    var seachParam = 'gameName=' + gameName + '&stime=' + encodeURIComponent(sDate) + '&etime=' + encodeURIComponent(eDate) + '&minPrice=' + minPrice + '&maxPrice=' + maxPirce + '&page=1&limit=' + limit;
    var device = isPc;
    var tabelist;
    getOrderTypeList($("#gameName").val(), '');

    element.on('tab(staTab)', function (data) {
        let tabIndex = data.index;
        var thisId = $(this).attr("lay-id");
        platStatus = thisId;
        $(".sechbtn").trigger("click");
        return false;
    });
    form.on('select(selectGame)', function (data) {
        var tempIsMoblieGame = false;
        var tempIsPw = false;
        $("#gameName option").each(function () {
            var item = $(this).val();
            if (item == data.value) {
                gameName = $(this).text(); 
            }
        });
        mobliegame = tempIsMoblieGame;
        ispw = tempIsPw; 
        getCustomerService();  
        getOrderLabelByGame();
        getOrderTypeList(data.value, '');

        $(".sechbtn").trigger("click"); 
        return false;
    }); 

    function getAllOrderSoure() {
        var soureData = [];
        $.get('/SystemAjax/GetOrderSoureList', function (result) {
            soureData = result.data;
            formSelects.data('orderSoures', 'local', {
                arr: soureData
            });
        });
    }
    function getAllRecUserData() {
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('recUser', 'local', {
                arr: soureData
            });
        });
    } 
    function getCustomerService() {
        var soureData = [];
        return;
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
        });
    }
    function getOperatorService() {
        $.get('/UserAjax/GetZpRootUsers', function (result) {
            formSelects.data('operator', 'local', {
                arr: result.data
            });
        });
    }
    function getOrderLabelByGame() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetOrderLabelList?gameName=" + gameName,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('读取标签数据请求异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                $("#orderLabel").empty();//清空select
                form.render('select');
                //重新动态加载select
                $("#orderLabel").append(new Option("全部", ""));
                $.each(data.data, function (index, item) {
                    $("#orderLabel").append(new Option(item.labelName, item.labelName));
                })
                form.render('select');
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    form.on('select(recType)', function (data) {
        var recType = data.value;
        if (recType == 10) {
            //派单人
            getOperatorService();
        } else {
            getAllRecUserData();
        }
        return false;
    });
      
    params = {
        gameName: gameName
        , stime: encodeURIComponent(sDate)
        , etime: encodeURIComponent(eDate)
        , minPrice: minPrice
        , maxPrice: maxPirce
        , limit: limit
    };
    function reloadOrderList() {        
        layer.closeAll();
        ajaxData(params);
    }
    function reloadOrderListNoCloseLayer() { 
        ajaxData(params);
    }
    var _Functions = {
        func1: function () {
            reloadOrderList();
        }
    }
    window.functions = _Functions;

    function orderIdRow(res) {
        let vo = '';
        let tp = '';
        let isSplit = '';
        let ji = '';
        var typestr = '';
        if (res.levelMark == 1) {
            typestr = '<span class="lableb layui-bg-orange" title="这是一笔陪玩订单">陪</span>';
        }      
        if (res.isJiaJi == "Y") {
            ji = '<span class="lableb" style="background-color:#FFBBFF" title="加急订单，优先安排">急</span>';
        }
        if (res.customizeTag != null && res.customizeTag != '') {
            tp = '<a href="javascript:void(0);" class="lableb changeTag" style="background-color:#1E9FFF" data-id="' + res.orderId + '" data-tag="' + res.customizeTag + '" title="标记：' + res.customizeTag + '，点击可以编辑">' + res.customizeTag.substring(0, 2) + '</a>';
        }
        if (res.isSplitOrder == 'Y') {
            isSplit = '<a href="javascript:void(0);" class="lableb seachSplitOrder" data-splitId="' + res.splitId + '" data-viewId="' + res.orderIdView + '" data-game="' + res.gameName + '" style="background-color:#FF6347" title="该订单已被拆分成多笔订单，点击可以查看关联订单">拆</a>';
        }    
        let tk = '';          
        vo = '<a href="javascript:void(0);" ' + tk + ' class="orderdetails" data-viewId="' + res.viewOrderId + '" data-id="' + res.orderId + '" title="点击查看系统订单详情，也可以鼠标右键试试看">' + res.viewOrderId + '</a>';
        let copyOrderIdspan = '<span id="orderid_span_' + res.orderId + '" style="display:none" class="orderIDcopy"  data-clipboard-text="' + res.viewOrderId + '"></span>';
        let copyOrderInfospan = '<span id="orderinfo_span_' + res.orderId + '" style="display:none" class="orderInfocopy"  data-clipboard-text="' + res.orderContent + '"></span>';

        return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.viewOrderId + ' title="鼠标右键看看~">' + vo + '<br/>' + copyOrderIdspan + copyOrderInfospan + typestr + ji + tp + isSplit + '</div>';
    }
    function tidRow(res) {
        let newMsg = '';
        if (res.newMsgCount > 0) {
            newMsg = '<span class="layui-badge" lay-tips="有' + res.newMsgCount +'条交易平台的未读消息，点击交易单号查看">' + res.newMsgCount +'</span>';
        }
        let spans = '<a href="javascript:void(0)" class="viewPlatmTid" style="color:#1e9fff" title="平台交易单号：' + res.tid + '，点击就能打开交易详情界面" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-pid="' + res.platformId + '">' + res.tid + '</a>';

        let obtn = '<span id="lineLabel_' + res.orderId + '" class="selectOrderLabelBtn layui-btn layui-btn-primary layui-btn-xs" data-label="" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-game="' + res.gameName + '" title="点击设置订单标签">设标签</span>';
        let orderLabelSpan = res.orderLabel != '' && res.orderLabel != null ? '<div class="selectOrderLabelBtn" data-label="' + res.orderLabel +'" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-game="' + res.gameName + '" style="background-color:' + res.orderLabelColor + '!important;color:#fff!important" title="订单标签：' + res.orderLabel +'，点击可选择移除标签">' + res.orderLabel + '</div>' : '';
        return newMsg + spans + '<br/>' + (res.orderLabel != '' && res.orderLabel != null?'':obtn)+ orderLabelSpan;
    }
    function roleNameRow(res) {
        let spans = '<a href="javascript:void(0)" title="角色名：' + res.gameRoleName + '" data-rolename="' + res.gameRoleName + '">' + res.gameRoleName + '</a>';

        return spans;
    } 
    function orderTitleRow(res) {
        let tspan = '<span style="color:#2f363c" title="发到平台的标题：' + (res.orderTitle) + '" data-id="' + res.orderId + '">' + res.orderTitle + '</span>';
        return tspan;
    }
    function pushPltmRow(res) {
        let vo = '<span style="color:#23292e">' + res.platformName +'</span>';
        switch (res.platformName) {
            case '全能代':
                vo = '<span style="color:#1e9fff">' + res.platformName + '</span>';
                break;
            case '代练通':
                vo = '<span style="color:#16b777">' + res.platformName + '</span>';
                break;
            case '代练妈妈':
                vo = '<span style="color:#ff5722">' + res.platformName +'</span>';
                break;
            case '趣代练':
                vo = '<span style="color:#ff5722">' + res.platformName + '</span>';
                break;
            case '咕噜代练':
                vo = '<span style="color:#1e9fff">' + res.platformName +'</span>';
                break;
            case '易代练':
                vo = '<span style="color:#a233c6">' + res.platformName +'</span>';
                break;
            case '代练宝':
                vo = '<span style="color:#23292e">' + res.platformName +'</span>';
                break;
            case '代练丸子':
                vo = '<span style="color:#31bdec">' + res.platformName +'</span>';
                break;
            case '代练多':
                vo = '<span style="color:#a233c6">' + res.platformName +'</span>';
                break;
        }
        return vo;
    }
    function gameServerRow(res) {  
        return '<span title="' + res.gameName + '/' + res.gameArea + '/' + res.gameServer + '">' + res.gameName + '<br/><span>' + res.gameArea + '/' + res.gameServer + '</span>';
    }
    function projectTypeNameRow(res) {
        return '<span title="项目分类：' + res.projectTypeName + '">' + res.projectTypeName + '</span>';
    }
    function orderStaRow(res) {
        let colorStr = '#b0aeae;';        
        switch (res.orderStatus) {
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
        }
        let title = '';
        let str = '<a href="javascript:void(0)" class="setdlsta" data-id="' + res.orderId + '" title="' + res.orderStatus + '中，点击可以更改系统订单状态，不是交易状态哦' + title + '" style="color:' + colorStr + ';">' + res.orderStatus + '</a>';

        return str;
    }
    function pushOrderTimeRow(res) {
        let div = '<span style="">' + res.pushTime + '</span>';
        return div;
    }
    function recOrderTimeRow(res) {
        let div = '<span title="平台打手接单时间：' + res.recOrderTimeStr +'">' + res.recOrderTimeStr + '</span>';
        return div;
    }
    function completeOrderTimeRow(res) {
        let div = '<span style="" title="完单时间：' + res.completTimeStr +'">' + res.completTimeStr + '</span>';
        return div;
    }
    function wangwangRow(res) {
        let concat = '';
        let tity = 0;
        let tbww = '<a href="/order/OpenWangwang?orderId=' + res.orderId + '" class="" data-orderId="' + res.orderId + '" target="_blank" title="旺旺：' + res.ww + '">' + res.ww + '</a>';

        if (res.ww != undefined && res.ww != null && res.ww != '') {
            concat = tbww;
            tity = 10;
        }
        else if ((res.qq != undefined && res.qq != '' && res.qq != null) && (res.orderSoure.indexOf('微信') > -1 || res.orderSoure.indexOf('QQ') > -1)) {
            concat = res.qq;
        }
        else if (res.qq != '' && res.qq != undefined && res.ww == '') {
            concat = res.qq;
            if (VerifyInt(concat)) {
                concat = '<a target="_blank" href="https://wpa.qq.com/msgrd?v=3&amp;uin=' + concat + '&amp;site=qq&amp;menu=yes" class="qq-btn">' + concat + '</a>';
                tity = 20;
            }
        }       
        let color = '';

        return '<span lay-tips="' + res.orderSoure + (tity == 10 ? '，点击可以直接和买家旺旺对话(需要安装千牛，并且注意窗口提示，点击打开或确定才可以)' : tity == 20 ? '，点击可以直接和老板QQ对话' : '') + '" style="' + (color) + '">' + (concat == null ? '' : concat) + '</span>';
    }
    function pushOrderManRow(res) {
        let p1 = '<span title="发单人：' + res.pushUserName + '">' + res.pushUserName + '</span>';
        let p2 = '<span title="销售客服：' + res.kefu + '">' + res.kefu + '</span>';
        return p1 + '<br/>' + p2;
    }
    function throwPriceRow(res) {
        let p1 = '<span class="priceTab" style="color:#5fb878;" data-id="' + res.orderId + '" data-fee="' + res.pushPrice + '" title="发到平台的价格：'
            + res.pushPrice + '元，安全保证金：' + res.safeAmount + '元，效率保证金：' + res.effAmount + '元">' + res.pushPrice + '</span>';
        return p1;
    }
    function priceRow(res) {
        let p1 = '<a href="javascript:void(0)" class="editOrderPrice priceTab" data-id="' + res.orderId + '" data-fee="' + res.price + '" style="color:#2f363c;"  title="该笔订单的接单(销售)金额：' + res.price + '元">' + res.price + '</a>';
        return p1;
    }
    function profitRow(res) { 
        let p1 = '<a href="javascript:void(0)" class=""  style="color:' + (res.profit < 0 ? '#ff5722' : '#2f363c') + '"  title="利润：' + res.profit + '元(整笔订单，非单个平台订单)">' + res.profit + '</a>';
        return p1;
    }
    function orderShHourRow(res) {
        return '<span data-id="' + res.orderId + '" title="该笔订单发单时间要求（小时）/接手后开始倒计时">' + res.diffTimeHour + '小时</a>';
    }
    function pltmOrderStaRow(res) {
        let vo = 'layui-badge layui-bg-gray';
        switch (res.platmOrderStaValue) {
            case 20:
                vo = 'layui-badge layui-bg-green';
                break;
            case 25:
                vo = 'layui-badge';
                break;
            case 30:
                vo = 'layui-badge';
                break;
            case 40:
                vo = 'layui-badge layui-bg-blue';
                break;
            case 50:
                vo = 'layui-badge layui-bg-orange';
                break;
            case 55:
                vo = 'layui-badge layui-bg-orange';
                break;
            case 56:
                vo = 'layui-badge layui-bg-cyan';
                break;
            case 60:
                vo = 'layui-badge layui-bg-black';
                break;
            case 70:
                vo = 'layui-badge layui-bg-gray';
                break;
            default:
                vo = 'layui-badge layui-bg-gray';
                break;
        }
        return '<span class="' + vo +'" style="" data-id="' + res.orderId + '" title="该笔订单在平台的交易状态">' + res.platformStatus + '</a>';
    }
    function orderRefundRow(res) {
        let title = '没有退款，点击可以快速记录退款';
        if (res.refundFee > 0) {
            title = '退款金额：' + res.refundFee + '元，退款方式：' + res.refundModel + '，退款时间：' + res.refundTimeStr + '，操作人：' + res.refundUserName +'，点击可以快速编辑退款';
        }
        let label = '<a href="javascript:void(0)" class="refundFee" data-id="' + res.orderId + '" data-fee="' + res.refundFee + '" data-refundmodel="' + res.refundModel+'" style="' + (res.refundFee>0?"color:red":"color:#999")+'" lay-tips=' + title+'>' + res.refundFee + '</a>';
        return label;
    }
    function csoure(res) {
        return '<span lay-tips="订单来自：' + res.orderSoure + '">' + res.orderSoure + '</span>';
    } 
    function createTimeRow(res) {
        return '<span>' + res.createOrderTime + '</span>';
    }
    function cancelTimeRow(res) {
        return '<span>' + res.lastAbnormalTime + '</span>';
    }
    function exAccpetTimeRow(res) {
        return '<span style="color:#ffb800" title="待验收时，平台自动验收剩余小时数(因各平台自动验收规则不定，此值为预估值，有6-12小时误差，仅供参考)">' + (res.expAccpeteHour < 0 ? '' : res.expAccpeteHour+'小时') + '</span>';
    }
    function remarkRow(res) {
        return '<a href="javascript:void(0)" title="' + (res.remark != null ? res.remark : "点击可以编辑订单重要备注") + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.remark != null ? res.remark : "") + '">' + (res.remark != null && res.remark != '' ? res.remark : "无") + '</a>';
    }
    function btnfun(res) {
        let isRecing = true;
        if (res.platmOrderStaValue==10) {
            isRecing = false;
        }
        let editBtn = '<a class="layui-btn layui-btn-xs layui-btn-danger submitEdit ' + (isRecing ? 'layui-hide' : '') + '" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="编辑交易订单" data-pid="' + res.platformId + '" data-eff="' + res.effAmount + '" data-safe="' + res.safeAmount + '" data-pushprice="' + res.pushPrice + '" data-title="' + res.orderTitle + '" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">编辑</a>';
        let thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm cancelPlatorder" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="从平台撤回" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">撤回</a>';
        let changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs changePlatorderPrice ' + (isRecing ? 'layui-hide' : '') + '" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="在订单还没接手前可以改发单价" data-pid="' + res.platformId + '" data-pushprice="' + res.pushPrice + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">改价</a>';

        let appenddPlatorderPriceBtn = '<a class="layui-btn layui-btn-xs appenddPlatorderPrice ' + (isRecing ? '' : 'layui-hide') + '" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="订单被平台接手后可以加款" data-pid="' + res.platformId + '" data-pushprice="' + res.pushPrice + '" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">加款</a>';
        let pushJdpBtn = '<a class="layui-btn layui-btn-xs layui-btn-normal pushJdpEdit" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="把这笔交易单再次发到交易平台" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">重发</a>';
        let sendsmsOrderBtn = '<a class="layui-btn layui-btn-xs sendsmsorderbtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="给这笔订单老板发短信" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">短信</a>';

        let picBtn = '<a class="layui-btn layui-btn-xs layui-btn-primary layui-border-blue picBtn ' + (isRecing ? '' : 'layui-hide') + '" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="查看交易平台截图" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '" data-pid="' + res.platformId + '">截图</a>';

        let btn = editBtn + thnb + changePlatorderPriceBtn + picBtn+'<br/>' + appenddPlatorderPriceBtn + pushJdpBtn + sendsmsOrderBtn;
        return btn
    }
    function tablerender(resList, iswzrymodel, isViewSoure, resData) { 
        var colsdata = [
            {
                unresize: false, field: 't_orderId0', type: 'checkbox', width: 35
            },
            {
                unresize: false, title: '平台交易单号', field: 't_tid',align:'center', width: 180, templet: tidRow
            },
            {
                unresize: false, title: '系统单号', field: 't_orderid', align: 'left', width: 140, merge: 'orderId',templet: orderIdRow
            },
            { unresize: false, field: 't_remark', title: '订单备注', width: 80, merge: 'orderId', templet: remarkRow },
            { unresize: false, title: '游戏区服', field: 't_gameServer', align: 'center', width: 120, merge: 'orderId', templet: gameServerRow },
            { unresize: false, title: '项目分类', field: 't_projectTypeName', width: 60, merge: 'orderId', templet: projectTypeNameRow },
            { unresize: false, title: '发单标题', field: 't_orderTitle', minWidth: 150, templet: orderTitleRow },
            { unresize: false, title: '发单平台', field: 't_pushPltm', align: 'center', width: 70, templet: pushPltmRow },
            { unresize: false, title: '发单价', align: 'center', field: 't_throw', width: 70, sort: true, templet: throwPriceRow },
            { unresize: false, title: '接单价', align: 'center', field: 't_safeeff', width: 70, sort: true, merge: 'orderId', templet: priceRow },
            { unresize: false, title: '利润', align: 'center', field: 'profit', width: 80, sort: true, merge: 'orderId',totalRowText:'本页合计',totalRow:true,templet: profitRow },
            { unresize: false, title: '剩余时间', align: 'center', field: 't_shours', width: 80, sort: true, templet: orderShHourRow },
            { unresize: false, title: '交易状态', align: 'center', field: 't_pltSta', width: 70, templet: pltmOrderStaRow },
            { unresize: false, title: '系统状态', align: 'center', field: 't_sta', width: 70, merge: 'orderId', templet: orderStaRow },
            { unresize: false, title: '验收倒计', align: 'center', field: 't_create', width: 80, sort: true, templet: exAccpetTimeRow },
            { unresize: false, title: '角色名', field: 't_role', align: 'center', width: 80, templet: roleNameRow },
            { unresize: false, title: '旺旺/WX', align: 'center', field: 't_ww', width: 80, merge: 'orderId', templet: wangwangRow },
            { unresize: false, title: '订单来源', align: 'center', field: 't_soure', width: 80, hide: isViewSoure == 'Y' ? false : true, merge: 'orderId', templet: csoure },
            { unresize: false, title: '发单时间', align: 'center', field: 't_hour', width: 80, sort: true, templet: pushOrderTimeRow },
            { unresize: false, title: '接手时间', align: 'center', field: 't_recTime', width: 80, sort: true, templet: recOrderTimeRow },
            { unresize: false, title: '完单时间', align: 'center', field: 't_complte', width: 80, sort: true, templet: completeOrderTimeRow },
            { unresize: false, title: '录单时间', align: 'center', field: 't_create', width: 80,hide:true, sort: true, templet: createTimeRow },
            { unresize: false, title: '撤销时间', align: 'center', field: 't_endTime', width: 80, sort: true, templet: cancelTimeRow },
            { unresize: false, title: '发单人', align: 'center', field: 't_pushMan', width:80, templet: pushOrderManRow },
            { unresize: false, field: 't_change', title: '操作', width: 125, templet: btnfun,fixed:'right' }
        ]

        //从缓存中取隐藏列
        var localTest = layui.data('platmorderlistlocal');
        if (localTest && localTest.ishide&&localTest.ishide.split(',').length != colsdata.length) {
            layui.data('platmorderlistlocal', null);
            
        }
        if (localTest && localTest.cols && JSON.parse(localTest.cols).length != colsdata.length) {
            layui.data('platmorderlistlocal', null);
        }
        if (localTest.ishide){
            var localarrs = localTest.ishide.split(',');
                localarrs.forEach(function (item,index) {
                    colsdata[index].hide = item=='true'?true:false;                 
                })
        }
        if (localTest.cols){
            var newcols = JSON.parse(localTest.cols);
            for (var i = 0; i < newcols.length; i++) {
                colsdata[i].width = newcols[i].width||'';
            }
        }

        tabelist=table.render({
            elem: '#datatable'
            ,data: resData.data 
            ,totalRow:true
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter',{
                title: '重置表格排版' //标题
                , layEvent: 'RESET_TABLE' //事件名，用于 toolbar 事件中使用
                , icon: 'layui-icon-fonts-clear' //图标类名
            }] 
            , cols: [colsdata]
            , page: false
            , limit: limit
            , limits: [20, 40]
            , done: function (res, curr, count) { 
                var isdrag;
                tableMerge.render(this);
                $('tr th').on('mousedown', function (e) {
                    if (e.currentTarget.clientWidth - e.offsetX <= 10) {                        
                        isdrag=true
                    }
                })
                $('tr th').on('mouseup', function (e) {
                    if (isdrag) {
                        var arrs = tabelist.config.cols[0];
                        arrs[e.currentTarget.cellIndex].width = e.currentTarget.clientWidth;
                        layui.data('platmorderlistlocal', {
                            key: 'cols'
                            , value: JSON.stringify(arrs)
                        });
                        isdrag = false;
                    }                    
                })
            }
        });

        table.on('toolbar(datatable)', function (obj) {            
            switch (obj.event) {
                case 'LAYTABLE_COLS':
                    $('ul.layui-table-tool-panel li').on('click', function () {     
                        var arrs = tabelist.config.cols;
                        var strs = [];    
                        arrs[0].forEach(function (item, index) {
                            strs.push(item.hide)                       
                        })                       
                        layui.data('platmorderlistlocal', {
                            key: 'ishide'
                            , value: strs.join(',')
                        });                       
                    })
                    break;
                case 'RESET_TABLE':
                    layer.confirm('是否重置表格排版', function (index) {
                        layui.data('platmorderlistlocal', null);
                        reloadOrderList();
                        layer.close(index)
                    });
                    break;
            };
        });
        table.on('row(datatable)', function (obj) {
            // 标注当前点击行的选中状态
            obj.setRowChecked({
                type: 'radio'
            });
        });
    }

    function ajaxData(params) {
        if (!params || typeof params !== 'object') return;
        $.ajax({
            url: '/OrderAjax/GetPlatformOrderList'
            , type: 'POST'
            , data: params
            , dataType: 'json',
            error: function () { layer.msg('数据读取错误，请刷新重试！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        }).done(function (resData) {
            layer.close(indexLoad);
            if (resData.msg == "请先登录") {
                layer.msg("登录过期了，请重新登录系统");
                return;
            }
            if (resData.msg.indexOf("跨度") > -1) {
                layer.msg(resData.msg);
                return;
            }
            if (!resData.data) return; 
            var resList = resData.data; 
            var Html = ''; 
            tablerender(resList, iswzrymodel, isViewSoure, resData); 
            var total = '本次搜索共' + resData.count + '笔平台单';
            $(".total").html(total);
            batchOrderId = ""; //每次查询完将批量单号置空
            pageFlag = false;
            countPage = resData.count;
            $('.statustab').on('click', function () {
                let val = $(this).attr('data-tit');
                formSelects.value('orderSta', []);
                formSelects.value('orderSta', [val]);
                form.render(); 
                $('.sechbtn').click();
            })
            if (!clickLock) {
                pagation();
            }
            clickLock = false;

            //重载翻页事件
            $('.layui-laypage-default a[data-page],.layui-laypage-btn').unbind('click').bind('click', function () {
                if ($(this).hasClass('layui-disabled')) {
                    return;
                }
                //refreshCheckBox();
            });
            $('.layui-laypage-limits select').unbind('change').bind('change', function () {
                refreshCheckBox();
            });
            setTimeout(function () {
                $('.layui-table-cell').attr('title', function () {
                    return this.innerText;
                })
            });
            $(".staTab0").html('全部(' + resData.total.totalCount + ')');
            $(".staTab10").html('待接单(' + resData.total.djd + ')');
            $(".staTab20").html('代练中(' + resData.total.dlz + ')');
            $(".staTab25").html('已锁定(' + resData.total.ysd + ')');
            $(".staTab30").html('异常中(' + resData.total.ycz + ')');
            $(".staTab40").html('待验收(' + resData.total.dys + ')');
            $(".staTab50").html('撤销中(' + resData.total.cxz + ')');
            $(".staTab55").html('仲裁中(' + resData.total.zcz + ')');
            $(".staTab56").html('已仲裁(' + resData.total.yzc + ')');
            $(".staTab60").html('已结算(' + resData.total.yjs + ')');
            $(".staTab70").html('已撤销(' + resData.total.ycx + ')');
            $(".staTab75").html('已下架(' + resData.total.yxj + ')');
            $(".staTab80").html('已删除(' + resData.total.ysc + ')');
            $(".staTab100").html('新交易消息' + (resData.total.newMsgCount > 0 ? '<span class="layui-badge">' + resData.total.newMsgCount + '</span>' : '(0)'));
            form.render();
        })
    }
    var pageFlag = false, countPage = 0, clickLock = false;
    function pagation() {
        if (countPage <= limit) {
            $('#page').hide();
        } else {
            $('#page').show();
        }
        layPage.render({
            elem: 'page'
            , limit: limit
            , limits: [10, 20, 30, 40, 50,100]
            , curr: currPage
            , count: countPage //数据总数
            , layout: ['count', 'prev', 'page', 'next', 'limit']
            , jump: function (obj) {
                currPage = obj.curr;
                limit = obj.limit;
                pageFlag = true;
                setTimeout(function () {
                    if (clickLock) {
                        getOrderData();
                        //$(".sechbtn").trigger("click");
                    }
                }, 500)
            }
        });
    }
    $('#page').click('a', function () {
        clickLock = true;
    })
    setTimeout(function () {
        $(".sechbtn").trigger("click");
    }, 500);
     
    /**
     * 点击搜索按钮
     * */
    form.on('submit(seachBtnOk)', function (data) {       
        getOrderData();
    });
    function getOrderData(s) {       
        if (!pageFlag) {
            currPage = 1;
        } 
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        var dateType = $("#dateType").val();
        var pushPlatm = $("#pushPlatm").val();
        var orderSta = $("#orderSta").val();
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var operator = formSelects.value('operator', 'nameStr');
        var projectTypeName = formSelects.value('projectType', 'nameStr');
        var seachType = $("#seachType").val();
        var skey1 = $("#key1").val();
        var orderBy = $("#orderBy").val();
        if (seachType == 0 && skey1 != '' && skey1 != undefined && skey1 != null) {
            layer.msg('请选择要搜索的类型', { time: 3000 }, function (r) {
                return false;
            })
            return false;
        }
        var orderLabel = $("#orderLabel").val();

        seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&operatorId=' + operator + '&platStatus=' + platStatus +
            '&dateType=' + dateType + '&orderSoure=' + orderSoure + '&pushPlatm=' + pushPlatm + '&orderSta=' + orderSta + '&seachType=' + seachType + '&key1=' + skey1 +
            '&orderLabel=' + orderLabel + '&orderBy=' + orderBy + '&projectTypeName=' + projectTypeName +'&limit=' + limit;
        params = {
            page: currPage
            , gameName: gameName
            , stime: sDate
            , etime: eDate
            , operatorId: operator
            , platStatus: platStatus
            , dateType: dateType
            , orderSoure: orderSoure
            , pushPlatm: pushPlatm
            , orderSta: orderSta
            , seachType: seachType
            , key1: skey1
            , orderLabel: orderLabel
            , orderBy: orderBy
            ,projectTypeName: projectTypeName
            , limit: limit
        };
        ajaxData(params);
        return false;
    }

    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    form.on('submit(refresh)', function (data) {
        reloadOrderList();
        return false;
    }); 
    form.on('submit(changeStaBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];       
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        changeOrderSta(IDX.join(','));
        return false;
    }); 
    form.on('submit(cancelOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.tid);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        cancelOrderToPlatm(IDX.join(','));
        return false;
    });    
    form.on('submit(accpetOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.tid);
        });

        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        accpetOrderToPlatm(IDX.join(','));
        return false;
    });
    form.on('submit(arbitOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.tid);
        });

        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        arbitOrderToPlatm(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderTipsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        let ids = IDX.join(',');
        setOrderTag(ids, '');
        return false;
    });
    form.on('submit(setOrderLabelBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        var haveDel = '';
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
            if (item.orderLabel != null && item.orderLabel != '') {
                haveDel = '1';
            }
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            OrderIDX = '';
            layer.msg('请选择要操作的记录！', { time: 800 }, function () { 
                return false;
            });
            return false;
        }
        OrderIDX = IDX.join(',');        
        bindSelectOrderLabel(".setMuitOrderLabelBtn", '', haveDel);
        return false;
    });
    form.on('submit(cleanOrderTipsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        cleanOrderTag(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderJiajiBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeOrderJiaji(IDX);
        return false;
    });
    form.on('submit(sendSmsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        sendSms(IDX);
        return false;
    });   
    form.on('submit(changeOrderPriceBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeOrderPrice(0, IDX);
        return false;
    });   
    form.on('submit(setOrderRemarkBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setOrderRemark(IDX.join(','));
        return false;
    });    
    form.on('submit(refundOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        refundOrderLogs(IDX.join(','),'','支付宝');
        return false;
    });
    form.on('submit(asyncOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.tid);
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SynchTransctionOrderStatus",
            data: { tid: IDX.join(',')},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (index2) {
                    reloadOrderList();
                    return false;
                });
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(exportBtn)', function (data) { 
        dropdown.render({
            elem: '#exportdropdown', // 触发事件的 DOM 对象
            show: true, // 外部事件触发即显示 
            data: [{
                title: '导出勾选的订单',
                id: 10
            }, {
                title: '导出查询结果(最多5000条)',
                id: 20
            }],
            click: function (menudata) {
                if (menudata.id == 10) {
                    var seltable = table.checkStatus('datatable').data;
                    var IDX = []; 
                    seltable.forEach(function (item, index) {
                        IDX.push(item.keyId);
                    });
                    //console.log(IDX);
                    if (IDX == undefined || IDX == null || IDX.join(',') == "") {
                        layer.msg('请选择要操作的记录！', { time: 800 });
                        return false;
                    }
                    IDX = IDX.join(',');
                    window.open("/Order/ExportByPlatmOrder?pidx=" + IDX, "_blank");
                    return false;
                }
                else {  
                    window.open("/Order/ExportByPlatmOrder?" + seachParam, "_blank");
                    return false;
                }
            }
        }); 
        return false;
    });
    form.on('submit(viewPlatformReportBtn)', function (data) {
        if (table2 != null) {
            reloadOrderList2();
            return false;
        }
        table2 = table.render({
            elem: '#tableList2'
            //, height: tableHeight
            , url: '/OrderAjax/GetPlatmPushOperateReport?selectMonth=' + selectMonth
            , defaultToolbar: []
            , totalRow:true
            , defaultToolbar: []
            , cols: [[
                 {
                    field: 'platformName', title: '平台名称', width:100, align: 'center', unresize: false, templet: function (res) {
                         return '<span>' + res.platformName + '</span>';
                    }
                }
                , {
                    field: 'pushOrderCount', title: '发单量<i class="layui-icon layui-bangzhu" lay-tips="代表预计会获得的订单收入"></i>', width: 100, align: 'center', sort: true, unresize: false, totalRow: '{{= d.TOTAL_NUMS }} 笔'
                }
                , {
                    field: 'recOrderCount', title: '接单数量', width: 100, align: 'center', sort: true, unresize: false, totalRow: '{{= d.TOTAL_NUMS }} 笔'
                }
                , {
                    field: 'cancelOrderCount', title: '撤销数量', align: 'center', width: 100, sort: true, unresize: false,totalRow: '{{= d.TOTAL_NUMS }} 笔'
                }
                , {
                    field: 'finshOrderCount', title: '完单数量', align: 'center', width: 100, unresize: false, sort: true, totalRow: '{{= d.TOTAL_NUMS }} 笔'
                }
                , {
                    field: 'digestionRate', title: '消单率', align: 'center', width:100, sort: true, unresize: false, templet: function (res) {
                        return '<span title="">' + res.digestionRate.toFixed(1) + '%</span>';
                    }
                }
                , {
                    field: 'finshRate', title: '完单率', align: 'center', width: 100, unresize: false, sort: true, templet: function (res) {
                        return '<span title="">' + res.finshRate.toFixed(1) + '%</span>';
                    }
                }
                , {
                    field: 'cancelRate', title: '撤销率', align: 'center', width: 100, unresize: false, sort: true, templet: function (res) {
                        return '<span title="">' + res.cancelRate.toFixed(1) + '%</span>';
                    }
                }
                , {
                    field: 'gdpRate', title: '发单占比', align: 'center', width: 100, unresize: false, sort: true, templet: function (res) {
                        return '<span title="">' + res.gdpRate.toFixed(1) + '%</span>';
                    }
                }
            ]]
            , page: false
            , limit:100
            , limits: [100]
            , done: function (res, curr, count) { 
                openPushOrderTotalLayer();
            }           
        });
        return false;
    });    
    function reloadOrderList2() { 
        table2.reload({
            url: '/OrderAjax/GetPlatmPushOperateReport?selectMonth=' + selectMonth
            , where: {
            }
            , page: false
            , done: function (res, curr, count) { 
                openPushOrderTotalLayer();
            }
        });
        return false;
    } 
    function openPushOrderTotalLayer() {
        pushOrdertotalLayer = layer.open({
            id: 'pushOrdertotalLayer',
            title: "查看各平台消单统计",
            shade: [0.3, '#333'],
            shadeClose: true,
            hideOnClose: false,
            type: 1,
            skin: 'layui-layer-win10',
            anim: 2,
            area: [isPc ? '980px' : '90%', isPc ? '580px' : '95%'],
            content: $('.pushorderreportdiv'),
            end: function () {
                $('.pushorderreportdiv').hide();
            }
        });
    }

    function bindSelectOrderLabel(elm, thisGame, haveLabel,rowbtn) { 
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetOrderLabelList?gameName=" + thisGame,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {layer.msg('读取标签数据请求异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.count > 0) { 
                    var labelSelectData = []; 
                    if (haveLabel != '') {
                        let itemModel = {
                            title: '删除标签',
                            id:0
                        };
                        labelSelectData.push(itemModel);
                    }
                    $.each(data.data, function (index, item) {
                        let itemModel = {
                            title: item.labelName,
                            id: item.id
                        };
                        labelSelectData.push(itemModel);
                    }); 
                    if (labelSelectData.length > 0) {
                        if (rowbtn == 'row') {
                            //行
                            dropdown.render({
                                elem: elm, // 触发事件的 DOM 对象
                                show: true, // 外部事件触发即显示
                                data: labelSelectData,
                                click: function (menudata) {
                                    UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                }
                            });
                        } else {
                            //多选
                            if (inst == null) {
                                inst = dropdownMut.render({
                                    elem: '#setMuitOrderLabelBtn', // 触发事件的 DOM 对象
                                    show: true, // 外部事件触发即显示
                                    data: labelSelectData,
                                    click: function (menudata) {
                                        UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                    }
                                });
                            } else {
                                dropdownMut.reloadData('setMuitOrderLabelBtn',{
                                    show: true, // 外部事件触发即显示
                                    data: labelSelectData,
                                    click: function (menudata) {
                                        UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    layer.msg('该游戏没有配置订单标签，请到系统维护->订单标签维护 中设置', { time: 2000 });
                }              
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function UpdateOrderLabelQue(selectLabel) { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpdateOrderLabel",
            data: { ids: OrderIDX, label: selectLabel },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                reloadOrderList();
                layer.msg(data.msg, { time: 1500 }, function (index2) {
                    layer.close(index2);
                    return false;
                });
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    $(document).on('click', '.selectOrderLabelBtn', function () {
        var elm = $(this); 
        var idsx = $(this).attr('data-id');
        let thisGame = elm.attr('data-game');
        let label = elm.attr('data-label');
        OrderIDX = idsx;
        bindSelectOrderLabel(elm, thisGame, label,'row');
    });

    $(document).on('click', '.appenddPlatorderPrice', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pushPrice = $(this).attr('data-pushprice');
        var pid = $(this).attr('data-pid');
        layer.prompt({ title: '请输入要追加的金额(必须是整数)--原发单价：' + pushPrice+'元', formType: 0, value:0, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为1', { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (parseInt(value) < 1) {
                layer.msg('要追加的价格必须大于0元', { time: 1500 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/AppendTransctionOrderPrice",
                data: { tid: tid, fee: value, platfromId: pid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index2) {
                        reloadOrderList();
                        layer.close(index2);
                        layer.close(index);
                        return false;
                    });
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    });

    $(document).on('click', '.changePlatorderPrice', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pushPrice = $(this).attr('data-pushprice');
        var pid = $(this).attr('data-pid');
        changePlatorderPriceAll(0, orderId, tid, pid, pushPrice);
    });
    function changePlatorderPriceAll(types, orderId, tid, platfromId, pushPrice) {
        layer.prompt({ title: types == 20 ? '您正在修改这笔单的全平台发单价，请输入新价格' : '请输入新的发单价金额', formType: 0, value: pushPrice, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为1', { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (parseInt(value) < 1) {
                layer.msg('价格必须大于0元', { time: 1500 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/EditTransctionOrderPrice",
                data: { orderId: orderId, tid: types == 20 ? "" : tid, fee: value, platfromId: platfromId },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index2) {
                        reloadOrderList();
                        return false;
                     });
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    }

    $(document).on('click', '.cancelPlatorder', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        layer.confirm('确认从平台撤回这一笔交易单吗？注意：该操作仅针对这一笔有效', {
            btn: ['确认', '点错了']
        }, function () {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/DeTransctionPlatformOrder",
                data: { tid: tid, platfromId: pid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index) {
                        if (data.code > 0) {
                            reloadOrderList();
                            return false;
                        }
                        layer.close(index);
                    });
                    return false;
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
    });

    $(document).on('click', '.viewPlatmTid', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        viewPlatOrderDetails(tid, orderId, pid);
    });
    function viewPlatOrderDetails(tid, orderId,pid) {
        layer.open({
            title: "交易详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc?'1440px':'90%','940px'],
            content: 'platfromorderview?orderId=' + orderId + '&tid=' + tid + '&platfromId=' + pid
        });
    }

    $(document).on('click', '.submitEdit', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var viewID = $(this).attr('data-viewId');
        var platfromId = $(this).attr('data-pid');
        var btitle = $(this).attr('data-title');
        var pushPrice = $(this).attr('data-pushprice');
        var safePrice = $(this).attr('data-safe');
        var effPrice = $(this).attr('data-eff'); 
        let url = '/order/pushjdp?orderId=' + orderId + '&tid=' + tid
        layer.open({
            title: "编辑交易平台订单：" + tid,
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1492px' : '95%', isPc ? '1070px' : '95%'],
            content: url
        });      
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
                error: function () { layer.msg('获取预览数据出现异常！'); },
                beforeSend: function (XMLHttpRequest) { layer.tips('加载中...', "#order_" + orderId); },
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
        layer.open({
            title: viewID + "系统订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1480px' : '85%','1050px'],
            content: 'OrderView?orderId=' + orderid + '&viewType=20'
        });
    } 
    $(document).on('click', '.seachSplitOrder', function () {
        var ids = $(this).attr('data-splitId');
        var viewId = $(this).attr('data-viewId');
        layer.open({
            title: "查看" + viewId + "关联订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '450px'],
            content: 'ViewSplitOrder?splitId=' + ids + '&gameName=' + gameName
        });
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
    function refundOrderLogs(orderId, yfee,refundmodel) {
        OrderIDX = orderId;
        form.val("form", {
            "refundFee": yfee,
            "refundModel": refundmodel,
            "paytranno": '',
            "refundRemark": ''
        });
        settLayerIndex = layer.open({
            title: "记录订单退款",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['720px', '600px'],
            content: $(".setrefundOrderLog"),
            end: function () {
                $(".setrefundOrderLog").hide();
            }
        });
        return false
    }
     
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
            area: [device ? '485px' : '90%', device ? '70%' : '90%'],
            content: 'orderremark?orderId=' + ids
        });
        return false;
    });    
    var settLayerIndex;
    function cancelOrderToPlatm(orderID) {
        layer.confirm('确定将这些订单从交易平台撤回吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/DeTransctionPlatformOrder",
                data: { tid: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (inlayer) {
                        layer.close(inlayer);
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
    }
    function accpetOrderToPlatm(tid) {
        layer.confirm('确认完单吗？<br/>提示：确认后本系统订单状态不会改变，请手动改变本系统订单状态', {
            btn: ['确认', '点错了']
        }, function () {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ConfigmTransctionOrder",
                data: { tid: tid},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index2) {
                        layer.close(index2);
                        reloadOrderList();
                    });
                    return false;
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
    }
    function arbitOrderToPlatm(tid) {
        settLayerIndex = layer.prompt({ title: '请输入申请仲裁理由', formType: 2, value: '', maxlength: 100 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeTransctionOrderArbitration",
                data: { tid: tid, value: 10, msgContent: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index2) {
                        if (data.code > 0) {
                            layer.close(settLayerIndex);
                        }
                        layer.close(index2);
                        reloadOrderList();
                    });
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });   
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
    $(document).on('click', '.sendsmsorderbtn', function () {
        var orderId = $(this).attr('data-id');
        sendSms(orderId);
    })
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
 
    $(document).on('click', '.editOrderPrice', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        changeOrderPrice(fee, orderId);
        return false;
    })
    function changeOrderPrice(fee, orderId) {
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
    }
    $(document).on('click', '.orderRemark', function () {
        var orderId = $(this).attr('data-id');
        var remark = $(this).attr('data-remark');
        setOrderRemark(orderId, remark);
    })
    function setOrderRemark(idx, remark) {
        layer.prompt({ title: '修改订单重要备注', formType: 0, value: remark, maxlength: 100 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderRemark",
                data: { orderId: idx, remark: value },
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
    }
    $(document).on('click', '.pushJdpEdit', function () {
        var orderId = $(this).attr('data-id');
        var viewId = $(this).attr('data-viewId');
        var tid = $(this).attr('data-tid');       
        throwToJdpTransction(orderId, viewId, tid);
    })
    function throwToJdpTransction(orderId, viewId, tid) {
        layer.open({
            title: "将订单"+viewId + "发到第三方交易平台：请确认发单内容",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1492px' : '95%', isPc ? '1070px' : '95%'],
            content: 'PushJdp?orderId=' + orderId + '&tid=' + tid +'&repush=1'
        });
    }
    $(document).on('click', '.picBtn', function () {
        var orderId = $(this).attr('data-id');
        var viewId = $(this).attr('data-viewId');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        layer.open({
            title: "查看交易单" + viewId + "的截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1492px' : '95%', isPc ? '1070px' : '95%'],
            content: 'platfromorderview?orderId=' + orderId + '&tid=' + tid + '&platfromId=' + pid +'&isViewPic=Y'
        });
    })
    form.on('select(seachType)', function (data) {
        var value = data.value;
        if (value>0) {
            $("#key1").attr("placeholder", "请输入搜索关键词");
            $("#key1").get(0).focus();
        }
        else {
            $("#key1").attr("placeholder", "请先选择搜索类型");
        }
        return false;
    });
    function getOrderTypeList(gameId, defName) {
        var orderTypeData = [];
        $.get('/GameAjax/GetAllOrderTypeList?gameId=' + gameId + '&defOrderType=' + defName + '&returnSelect=Y', function (result) {
            orderTypeData = result.data;
            formSelects.data('projectType', 'local', {
                arr: orderTypeData
            });
        });
    }
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll();
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            reloadOrderListNoCloseLayer();
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
                if (
                    rightMenuCopyOrder == "Y") {
                    $("#orderinfo_span_" + orderID).trigger("click");
                }
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
            'copyOrderID': { name: "复制系统订单编号", icon: "edit" },
            "sep2": "---------",
            "copyOrder": { name: rightMenuCopyOrder == "Y" ? "复制原始订单内容" : "", icon: rightMenuCopyOrder == "Y" ? "copy" : "" },              
            "sep5": "---------",
            'viewPic': { name: "查看订单截图", icon: "images" },
        }
    });  
       
    $(document).on('click', '.refundFee', function () {
        var ids = $(this).attr('data-id');
        var refundmodel = $(this).attr('data-refundmodel');
        var fee = $(this).attr('data-fee');
        refundOrderLogs(ids, fee, refundmodel);
    });
    $(document).on('click', '.saveReFundOrderBtn', function () {
        var orderId = OrderIDX;
        var refundModel = $('input[name="refundModel"]:checked').val();
        var refundFee = $("#refundFee").val();
        var paytranno = $("#paytranno").val();
        var sdate = $("#refundDate").val();
        var refundRemark = $("#refundRemark").val();
        var refundChangeToYTD = $('input[name="refundChangeToYTD"]:checked').val();
        if (!VerifyMoeny(refundFee)) {
            layer.msg('请输入正确的金额', { time: 800 }, function () {
                return false;
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/AddOrderRefundLogs",
            data: { orderIdx: orderId, refundModel: refundModel, fee: refundFee, sdate: sdate,tranNo: paytranno, remark: refundRemark, changeOrderStatus: refundChangeToYTD},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 800 }, function () {
                        layer.close(settLayerIndex);
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
        return false;
    }) 
    $(document).on('click', '.viewTotalMonth0', function () {
        selectMonth = 0;
        $(this).removeClass('layui-border-blue').addClass('layui-border-blue');
        $('.viewTotalMonth1').removeClass('layui-border-blue');
        $('.viewTotalMonth2').removeClass('layui-border-blue');
        $('.viewTotalMonth3').removeClass('layui-border-blue');
        reloadOrderList2();
    });
    $(document).on('click', '.viewTotalMonth1', function () {
        selectMonth = 1;
        $(this).removeClass('layui-border-blue').addClass('layui-border-blue');
        $('.viewTotalMonth0').removeClass('layui-border-blue');
        $('.viewTotalMonth2').removeClass('layui-border-blue');
        $('.viewTotalMonth3').removeClass('layui-border-blue');
        reloadOrderList2();
    });
    $(document).on('click', '.viewTotalMonth2', function () {
        selectMonth = 2;
        $(this).removeClass('layui-border-blue').addClass('layui-border-blue');
        $('.viewTotalMonth0').removeClass('layui-border-blue');
        $('.viewTotalMonth1').removeClass('layui-border-blue');
        $('.viewTotalMonth3').removeClass('layui-border-blue');
        reloadOrderList2();
    });
    $(document).on('click', '.viewTotalMonth3', function () {
        selectMonth = 3;
        $(this).removeClass('layui-border-blue').addClass('layui-border-blue');
        $('.viewTotalMonth0').removeClass('layui-border-blue');
        $('.viewTotalMonth1').removeClass('layui-border-blue');
        $('.viewTotalMonth2').removeClass('layui-border-blue');
        reloadOrderList2();
    });

});