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
        var seachParam = 'sdate=' + sDate + '&edate=' + eDate;
        var indexLoad; 
        var page = 1;  
        laydate.render({
            elem: '#sDate'
            , type: 'date'
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'date'
        });  
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full-110'
            , url: '/OrderAjax/GetSoureOrderChangePriceLogList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 } 
                , {
                    field: 'orderId', title: '订单号', width: 180, unresize: false, templet: function (res) {
                        let tipb = '<span class="lableb" style="background-color:#FF534D" title="该订单已被删除了">删</span>';
                        if (res.str6 != "Y") {
                            tipb = '';
                        }
                        let vo = tipb + '<a href="javascript:void(0);" class="orderdetails" data-id="' + res.str1 + '" style="color:#0094ff" title="点击查看订单详情">' + res.orderId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'str2', title: '游戏名称', width: 120, align: 'center', sort: false, unresize: false
                }
                , {
                    field: 'str3', title: '角色名', width: 150, align: 'left', sort: false, unresize: false
                }
                , {
                    field: 'd1', title: '金额变动', width: 120, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#2f363c" title="从' + res.d1 + '元变成' + res.d2 + '元">' + res.d1 + '>>' + res.d2 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'd2', title: '本次金额', width:100, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.d2 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'd1', title: '变动金额', width: 100, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let dec = res.d2 > res.d1 ? "+" : res.d2 < res.d1 ? "-" : "";
                        let decValue = res.d2 > res.d1 ? res.d2 - res.d1 : res.d2 < res.d1 ? res.d1 - res.d2 : 0;
                        let vo = '<span style="color:#FF5722">' + dec + decValue + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str5', title: '说明', align: 'center', width: 150, unresize: false
                }
                , {
                    field: 'str4', title: '变动时间', align: 'center', width: 150, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.str4 + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: true 
            , limit: 20
            , limits: [20, 30, 40, 50,100]
            , done: function (res, curr, count) { 
                page = curr;
                var total = '本次搜索统计共' + count + '条记录';
                $("#total").html(total);
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
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            sDate = $("#sDate").val();
            eDate = $("#eDate").val(); 
            var skey = $("#key1").val();            
            seachParam = 'sdate=' + sDate + '&edate=' + eDate + '&key=' + skey;            
            tableList.reload({
                url: '/OrderAjax/GetSoureOrderChangePriceLogList?' + seachParam
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
            title: orderid + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['60%', '92%'],
            content: '/Order/OrderView?orderId=' + orderid
        });
    } 
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