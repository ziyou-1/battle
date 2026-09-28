layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form','util'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var indexLoad;
    var ok = true;
    var type = $("#type").val();
    var gameName = $("#gameName").val();
    form.on('radio(SmsType)', function (data) {
        if (data.value == 100013) {
            $(".zdy").show();
            $("#customize").focus();
        }
        else { 
            $(".zdy").hide();
        }
    });
    form.on('submit(savebtn)', function (data) { 
        var orderID = data.field.orderID;
        var muban = data.field.SmsType;
        var zdyContent = data.field.customize;
        if (muban == undefined || muban == "" || muban == null) {
            layer.alert("请至少选择一种短信模板再发送！", {
                title: '提示'
            });
            return false;
        }
        if (muban == 100013) {
            if (zdyContent == null || zdyContent == "" || zdyContent == undefined) {
                layer.msg("要发送的内容为空，请输入要发送的短信内容", { time: 2000 }, function () {
                });
                return false;
            }
        }
        if (!ok)
            return false;
        ok = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SendSmsByOrderIDX",
            data: { orderId: orderID, smsTemplteType: muban, smsContent: zdyContent, type: type, gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错啦！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭
                    }); 
                }
                else {
                    layer.msg(data.msg, { time: 3000 }, function () {
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
