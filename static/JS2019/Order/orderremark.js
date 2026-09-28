layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    form.verify({
        remark: function (value) {
            if (value.length < 1) {
                return '备注内容不能为空';
            }
        }
    });
    form.on('submit(addpbtn)', function (data) {
        if (data.field.remark == "") {
            layer.msg('备注内容不能为空！', { time: 1000 }, function () {
                return false;
            });
        }
        var orderId = data.field.orderId;
        var remark = data.field.remark;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SaveOrderPublieMark",
            data: { orderId: orderId, remark: remark },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) {
                    layer.msg(sdata, { time: 800 }, function () {
                        $('.pudiv').prepend('<span class="layui-form-label lispan">【我】添加了订单备注：' + remark + '</span>');
                        $("#remark").val("");
                    });
                }
                else {
                    layer.msg(sdata, { time: 1000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
});
