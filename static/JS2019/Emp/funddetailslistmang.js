layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table', 'rate'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        rate = layui.rate,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var device = isPc;
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
    });

    laydate.render({
        elem: '#sDate'
        , type: 'date'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'date'
    });
    getJdpBalance();

    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();

    var seachParam = 'sDate=' + sDate + '&eDate=' + eDate + '&keyStr=&fundType=0';

    var page = 1;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/EmpAjax/GetFundDetailsListData?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter','exports']
        , cols: [[
            {
                field: 'PayOrder_ID', title: '支付流水号', align: 'center', width:  200, unresize: false
            }, {
                field: 'OrderID', title: '相关订单号', align: 'center', width: 200, unresize: false, templet: function (res) {
                    return '<span>' + (res.OrderID == null || res.OrderID=='' ? '' :'\''+ res.OrderID) + '</span>';
                }
            },
            {
                field: 'FundsType', title: '资金方向', align: 'center', width: 60, unresize: false, templet: function (res) {
                    if (res.FundsType == 10) return '出账';
                    else return '入账';
                }
            },
            {
                field: 'Amount', title: '金额', align: 'center', width:  80, unresize: false
            },
            {
                field: 'Banlance', title: '可用余额', align: 'center', width:  80, unresize: false
            },
            {
                field: 'CreateTime', title: '时间', align: 'center', width:  140, unresize: false
            },
            {
                field: 'Remark', title: '备注说明', align: 'center',  unresize: false
            }
        ]]
        , page: true
        , limit: 20
        , limits: [20,50,100,200,300,500]
        , done: function (res, curr, count) {
            if (res.code < 0) {
                layer.msg(res.msg, { time: 3000 }, function () {
                })
                return false;
            }
            page = curr;
            var total = '【统计】共' + res.count + '条记录，共入账' + res.Insum + '元，共出账' + res.Outsum + '元';
            $("#total").html(total);
        }
    });
    table.on('toolbar(tableList)', function (obj) {
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
    var currentAcc = '';
    function getJdpBalance() {
        $.ajax({
            type: "Post",
            url: "/EmpAjax/GetBalanceAndFreeAmount",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                currentAcc = data.data.acc;
                $("#amtMsg").html('当前系统绑定的平台官方账户为' + data.data.acc + '，该账户当前可用余额' + data.data.b + '元，当前冻结余额' + data.data.f + '元');
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    } 
    function reloadOrderList() { 
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var keyStr = $("#key").val();
        var fundType = $("#fundType").val();
        var seachParam = 'sDate=' + sDate + '&eDate=' + eDate + '&key=' + keyStr + '&fundType=' + fundType;

        tableList.reload({
            url: '/EmpAjax/GetFundDetailsListData?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    $(document).on('click', '.pay', function () {
        var jdp = $("#jdpDesc").val();
        layer.open({
            title: "平台余额充值",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '1080px' : '90%', isPc ? '1000px' : '90%'],
            content: '/PlatformRedirect/pay/SystemInPay?jdp=' + jdp
        });
        return false;
    });
    $(document).on('click', '.excash', function () {
        let tp= layer.alert('系统里暂时还不支持直接提现，你可以点击“确定”按钮，将引导您跳转到平台用户中心<br>请使用账号<span style="font-weight:600;color:red">' + currentAcc + '</span>登录，即可在登录后的首页看到提现入口', {}, function () {
            window.open("/PlatformRedirect", "_blank");
            layer.close(tp);
        });
       
        return false;
    });
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll();
            reloadOrderList();
        },
        reloadOrderDataNoClose: function () {
            reloadOrderList();
        }
    };
    window.tools = _tools;
});