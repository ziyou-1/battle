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
    var tableList2;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    var re = true;    
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
    var seachParam = 'sdate=' + sDate + '&edate=' + eDate +'&actionValue=-1';
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
            , type: 'date'
            ,min:-90
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'date'
        }); 
        getAllRecUserData(); 
        function getAllRecUserData() {
            var soureData = []; 
            $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N', function (result) {
                soureData = result.data;
                formSelects.data('recUser', 'local', {
                    arr: soureData
                });
            });
        }
        
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/OrderAjax/GetPushPlatfromOrderActionLogMangeList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo' 
            , totalRow: false
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'viewOrderId', title: '系统单号', width:150, align: 'left', unresize: false,templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="orderdetails" data-viewId="' + res.viewOrderId + '" data-id="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情">' + res.viewOrderId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'tid', title: '交易单号', width: 190, align: 'left', sort: false, unresize: false, templet: function (res) {
                        let spans = '<a href="javascript:void(0)" class="viewPlatmTid" style="color:#1e9fff" title="平台交易单号：' + res.tid + '，点击就能打开交易详情界面" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">' + res.tid + '</a>';
                        return spans;
                    }
                }
                , {
                    field: 'gameName', title: '游戏名称', width:100, align: 'center', unresize: false
                }
                , {
                    field: 'title', title: '订单标题', width: 200, align: 'center', unresize: false
                }
                , {
                    field: 'actionName', title: '操作说明', width:100, align: 'center', unresize: false
                }
                , {
                    field: 'actionUserName', title: '操作人员', width: 100, align: 'center', sort: false, unresize: false
                }
                , {
                    field: 'actionTime', title: '操作时间', width: 130, align: 'center', sort:true, unresize: false
                }
            ]]
            , page: true
            , limit: 20
            , limits: [20, 30, 50]
            , done: function (res, curr, count) {
                page = curr;
                let totalData = res.total;
                loadTotalData(totalData);
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
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
            var recUser = formSelects.value('recUser', 'valStr');
            var skey = $("#key1").val();
            var action = $("#actionSelect").val();
            seachParam = 'sdate=' + sDate + '&edate=' + eDate + '&actionValue=' + action + '&actionUserId=' + recUser + '&key=' + skey;

            tableList.reload({
                url: '/OrderAjax/GetPushPlatfromOrderActionLogMangeList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
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
        var viewId = $(this).attr('data-viewId');
        viewOrderDetails(ids, viewId);
            });
    function viewOrderDetails(orderid, viewId) {
        layer.open({
            title: viewId + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['85%', '92%'],
            content: '/Order/OrderView?orderId=' + orderid
        });
    } 
    $(document).on('click', '.viewPlatmTid', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid'); 
        var viewId = $(this).attr('data-viewId'); 
        viewPlatOrderDetails(tid, orderId, viewId);
    });
    function viewPlatOrderDetails(tid, orderId, viewId) {
        layer.open({
            title: viewId+"的交易详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1440px' : '90%', '940px'],
            content: 'platfromorderview?orderId=' + orderId + '&tid=' + tid +'&platfromId=0'
        });
    }
 
    function loadTotalData(totalData) {
        tableList2 = table.render({
            elem: '#tableList2',
            cols: [[ //标题栏
                { field: 'actionName', title: '操作', width: 100, align: 'center', sort: false },
                { field: 'actionUserName', title: '操作人', align: 'center', width: 130 },
                { field: 'totalCount', title: '操作次数', width: 100, align: 'center', sort: true }
            ]],
            data: totalData,
            //skin: 'line', // 表格风格
            //even: true,
            page: false // 是否显示分页 
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