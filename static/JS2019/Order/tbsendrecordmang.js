layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table', 'rate','upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        rate = layui.rate,
        laydate = layui.laydate;
    var table = layui.table;
    var upload = layui.upload;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var device = isPc;


    laydate.render({
        elem: '#sDate'
        , type: 'date'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'date'
    });


    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
    });

    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();

    var tableList = table.render({
        elem: '#tableList'
        , url: "/OrderAjax/GetTbSendRecordList?sDate=" + sDate + "&eDate=" + eDate +"&result=-1&key="
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                type: 'checkbox', fixed: 'left', width: 30
            }
            ,
            {
                field: 'TaobaoOrderSendLogID', title: '记录ID', align: 'center', width: device ? '3%' : 40,unresize: false, sort: false, edit: false
            }
            ,
            {
                field: 'Order_Id', title: '系统订单号', align: 'center', width: device ? '10%' : 120, unresize: false, sort: false, edit: false
            },
            {
                field: 'TbOrderNo', title: '淘宝订单号', align: 'center', width: device ? '10%' : 120, unresize: false, sort: false, edit: false
            },
            {
                field: 'SendResult_s', title: '发货原参数', align: 'center', width: device ? '25%' : 320, unresize: false, edit: false
            },
            {
                field: 'TbStoreName', title: '发货店铺', align: 'center', width: device ? '5%' : 100, unresize: false,
            },
            {
                field: 'SendResult', title: '发货结果', align: 'center', width: device ? '3%' : 40, unresize: false, templet: function (res)
                {
                    let div = '<span style="color:#5BB75B">成功</span>';
                    if (res.SendResult != 1) {
                        div = '<span style="color:#ff0000">失败</span>';
                    }
                    return div;
                }
            },
            {
                field: 'SendDateEx', title: '发货时间', align: 'center', width: device ? '7%' : 120, unresize: false,
            },
            {
                field: 'UserID', title: '发货人', align: 'center', width: device ? '3%' : 40, unresize: false,
            },
            {
                field: 'Remark', title: '备注说明', align: 'center', width: device ? '7%' : 120, unresize: false,
            }
        ]]
        , page: true
        , limit: 50
        , limits: [50]
        , done: function (res, curr, count) {
            page = curr;
        }
    });



    table.on('toolbar(tableList)', function (obj) {
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'send':
                sendFunction(obj);
                break;
            case 'import':
                importFunction(obj);
                break;
        };
    });

    //重新发货
    function sendFunction(obj)
    {
        var checkStatus = table.checkStatus(obj.config.id);
        if (parseInt(checkStatus.data.length) < 1) {
            layer.msg('请勾选要操作的数据行');
            return false;
        }
        var data = checkStatus.data;
        var idArray = "";
        var sourceArray = "";
        $.each(data, function (k, v) {
            idArray += v.TbOrderNo+",";
            sourceArray+=v.TbStoreName+",";
        });

        $.ajax({
            type: "Post",
            url: "/OrderAjax/SendAgin",
            data: { "sourId": idArray, "orderSource": sourceArray},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请稍候再试！'); },
            success: function (data) {
                if (data.code < 1) {
                    layer.msg(data.msg);
                }
                else
                {
                    layer.alert("成功" + data.success + "条，失败" + data.fail + "条", function () {
                        reloadOrderList();
                        layer.close(layer.index); 
                    });
                }
            }
        });
    }





    //导入文件发货
    function importFunction()
    {
        layer.open({
            title: "上传淘宝订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['500px', '500px'],
            content: $('#hidDiv')
        });
        $("#hidDiv").attr('display: block');
        $(".hide-c").show();
    }



    $("#btnCheck").on('click', function () {

        var source = $("#source").val();
        if (!source)
        {
            layer.msg("请先选择订单来源");
            return;
        }
        $("#btnImport").trigger("click");
    });

    var indexshade;
    //上传文件
    upload.render({
        elem: '#btnImport'
        , url: '/OrderAjax/SendAginByTxt'
        , accept: 'file'
        , acceptMime: 'file/txt'
        , exts: 'txt'
        , multiple: false
        , data: {
            source: function () {
                return $('#source').val();
            } }
        , size: 150
        , number: 1,
        before: function () { indexshade=layer.load(1, { shade: false }); }
        , done: function (res) {
            if (res.code < 1) {
                layer.msg(res.msg);
            } else {
                var bill = res.fail > 0 ? "失败单号：" + res.bill : "";
                layer.alert("成功" + res.success + "条，失败" + res.fail + "条<br/>" + bill, function () {
                    reloadOrderList();
                    layer.close(layer.index);
                });
            }
            layer.close(indexshade); 
        }
        , error: function () {
            layer.msg("文件上传失败,请重试");
            layer.close(indexshade); 
        }
    });


    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });

    function reloadOrderList() {
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var result = $("#result").val();
        var key = $("#key").val();
        var search = "sDate=" + sDate + "&eDate=" + eDate + "&result=" + result + "&key=" + key;
        tableList.reload({
            url: "/OrderAjax/GetTbSendRecordList?" + search
            , where: {
            }
            , page: false
        });
        return false;
    }
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