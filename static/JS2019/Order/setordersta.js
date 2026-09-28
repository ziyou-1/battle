layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var ok = true;
    var indexLoad; 
    $(document).keyup(function (event) {
        getKey();
    });
    function getKey() {
        if (event.keyCode == 13) {
            $(".savebtn").trigger("click");
        }
    } 

    form.on('radio(status)', function (data) { 
        if (data.value == '问题单' || data.value == '已暂停' || data.value == '已退单'||data.value=='异常中') {
            $(".remark").show();
            $("#remark").focus();
            $(".asnyTb").hide();
        }
        else  if (data.value == '已完成') { 
            $(".asnyTb").show();
            $(".remark").hide();
        }
        else {
            $(".asnyTb").hide();
            $(".remark").hide();
        }
    }); 
    form.on('submit(savebtn)', function (data) {
        if (data.field.status == "" || data.field.status == undefined || data.field.status == null) {
            layer.msg('请选择要改变的状态');
            return false;
        }  
        var orderId = data.field.orderId;
        var sta = data.field.status;
        var changeSoureType = data.field.changeSoureType;
        if (changeSoureType == 1) {
            changeSoureType = 20;
        }
        else{
            changeSoureType = 10;
        }
        var remarkMust = data.field.mustRemark;
        var remark = data.field.remark;
        if (remarkMust == "Y") {
            if (sta == "问题单" && (remark == null || remark == '' || remark==undefined)) {
                layer.msg('系统要求问题单必须填写原因');
                return false;
            }
        }
        var isAsnyTb = data.field.asnyTb; 
        if (!ok)
            return false;
        ok = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SetOrderSta",
            data: { orderId: orderId, sta: sta, changeSoureType: changeSoureType, remark: remark, isSyncTaoBao: isAsnyTb},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请稍候再试！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) { 
                    layer.msg(data.msg, { time: 1500 }, function () {
                        try {
                            parent.tools.reloadOrderData();
                        } catch (err) { }
                        try {
                            window.parent.reloadOrderData();
                        } catch (err) { } 
                    }); 
                }
                else {
                    layer.msg(data.msg, { time: 6000 }, function () {
                    })
                }
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
});
