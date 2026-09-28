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
    var device = isPc;
    var sd=laydate.render({
        elem: '#sDate'
        , type: 'datetime'
        , min: $("#minD").val()+' 00:00:00'
        , max: $("#maxD").val() + ' 23:59:59'
        , ready: function () {
            sd.hint('日期可选值设定在 <br> ' + $("#minD").val() + ' 到 ' + $("#maxD").val()+'之间');
        }
    });
    var ed=laydate.render({
        elem: '#eDate'
        , type: 'datetime'
        , min: $("#minD").val() + ' 00:00:00'
        , max: $("#maxD").val() + ' 23:59:59'
        , ready: function () {
            ed.hint('日期可选值设定在 <br> ' + $("#minD").val() + ' 到 ' + $("#maxD").val() + '之间');
        }
    });
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        var gameName = $("#gameName").val();
        gameName = encodeURI(gameName);
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate;
        var indexLoad;  
    var page = 1;  
    getAllOrderSoure();
        var tableList = table.render({
            elem: '#tableList'
            , url: '/OrderAjax/GetOrderRecycleList?' + seachParam
            , defaultToolbar: [] 
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: device?'2%':30 }
                , {
                    field: 'orderIdView', title: '订单号', width:device?'11%': 220, unresize: false, templet: function (res) {
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
                            tp = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" title="标记：' + res.customizeTag + '">' + res.customizeTag.substring(0, 1) + '</a>';
                        }
                        if (res.isSplitOrder == 'Y') {
                            isSplit = '<a href="javascript:void(0);" class="lableb" style="background-color:#FF6347" title="该订单已被拆分成多笔订单">拆</a>';
                        }
                        if (res.taskId>0){
                            taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" title="该笔订单有参与排团，团号：' + res.taskId + '，排团名称：' + res.taskName + '">团</a>';
                        }
                        vo = '<a href="javascript:void(0);" class="orderdetails" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情，也可以鼠标右键试试看">' + res.orderIdView + '</a>';
                        let copyOrderIdspan='<span id="orderid_span_' + res.orderId + '" style="display:none" class="orderIDcopy"  data-clipboard-text="'+ res.orderIdView + '"></span>';
                        
                        return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.orderIdView
                            + '" title="鼠标右键看看~">' + copyOrderIdspan + isNew + ji + tp + isSplit + taskspan + vo + '</div>';
                    }
                }
                , { field: 'roleName', title: '角色名', width:130, unresize: false }
             
                , {
                    field: 'gameGroup', title: '阵营/平台', align: 'center', width: device?'4%':70, sort: false,
                    nresize: false, templet: function (res) {
                        let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>'; 
                        return group;
                }
                }
                , {
                    field: 'project', title: '代练/陪玩项目', width: device ?'12%':150, unresize: false, templet: function (res) {
                        let vo = '<span title="' + res.project + '">' + res.project + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameInfo', title: '角色信息', width: device?'13%':180, unresize: false, templet: function (res) {
                        var area = res.gameArea + "/";
                        var server = res.gameServer;
                        var job = res.gameJob;
                        var level = res.levelMark;
                        var itemlevel = res.itemRemark;

                        return '<span title="' + area + server + '/' + job + '/' + level + "/" + itemlevel + '">' + area + server + '/' + job + '/' + itemlevel + '</span>';
                    }}
                , {
                    field: 'orderSta', title: '订单状态', align: 'center', width: device?'4%':80, templet: function (res) {
                        let colorStr = '#b0aeae;';
                        switch (res.orderSta) {
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
                                colorStr = '#d9764a';
                                break;
                            case '已退单':
                                colorStr = '#efaaaa';
                                break;
                        }
                        let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="点击可以更改订单状态" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';
                         
                        return str;
                    }
                }
                , {
                    field: 'orderSoure', title: '旺旺/来源', width: device ? '5%' : 90, align: 'center', unresize: false, templet: function (res) {
                        let concat = '';
                        let tbww = '<a href="http://amos.alicdn.com/getcid.aw?v=2&uid=' + res.WangWang + '&site=cntaobao&s=2&groupid=0&charset=utf-8" target="_blank" title="点击可以启动旺旺与该买家对话">' + res.WangWang + '</a>';

                        if (res.WangWang != undefined && res.WangWang != null && res.WangWang != '') {
                            concat = tbww;
                        }
                        else if ((res.qq != undefined && res.qq != '' && res.qq != null) && (res.orderSoure.indexOf('微信') > -1 || res.orderSoure.indexOf('QQ') > -1)) {
                            concat = res.qq;
                        }
                        else {
                            concat = res.orderSoure;
                        }

                        return '<span title="该订单来源：' + res.orderSoure + '">' + (concat == null ? '' : concat) + '</span>';
                    }
                }
                , {
                    field: 'orderRemark', title: '重要备注', width: device ?'5%': 90,  unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + (res.orderRemark != null ? res.orderRemark : "点击可以编辑订单重要备注") + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.orderRemark != null ? res.orderRemark : "") + '">' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : "无") + '</a>';
                    }
                }
                , { field: 'delTime', title: '删除时间', width:140, unresize: false } 
                , { field: 'delUserName', title: '删除人', width:90, unresize: false }

                , { fixed: '', title: '操作', width:120, toolbar: '#baroperating' }
            ]]
            , page: true 
            , limit: 20
            , limits: [10, 20, 30]
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
                page = curr;
                var total = '【统计】共' + res.total+ '笔被删除的订单';
                $("#total").html(total);
             }
        }); 
        formSelects = layui.formSelects;
        form.on('select(selectGame)', function (data) { 
            reloadOrderList();
            return false;
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break; 
                case 'refOrder':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请选中要操作的记录');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    var orderID = tempData.join(',');
                    refOrder(orderID);
                    break;       
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'refOrder') {
                refOrder(obj.data.orderId);
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        });
        function reloadOrderList() { 
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var orderSta = $("#orderSta").val();
            var skey1 = $("#key1").val();
            var skey2 = $("#gameAcc").val(); 
            gameName = $("#gameName").val(); 
            gameName = encodeURI(gameName); 
            var orderSoure = formSelects.value('orderSoures', 'valStr');
            seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&orderSta=' + orderSta + '&key1=' + skey1 + '&key2=' + skey2 + '&orderSoure=' + orderSoure;
             
            tableList.reload({
                url: '/OrderAjax/GetOrderRecycleList?' + seachParam
                , where: { 
                }
                , page: {
                    curr: page
                }
            });
            return false;
    }
        function refOrder(orderID) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/RefOrderRecycle",
                data: { orderId: orderID},
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
        function getAllOrderSoure() {
            var soureData = [];
            $.get('/SystemAjax/GetOrderSoureList', function (result) {
                soureData = result.data;
                formSelects.data('orderSoures', 'local', {
                    arr: soureData
                });
            });
        }
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll();
                reloadOrderList();
            }
        };
        window.tools = _tools;   
});