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
        form.on('submit(savebtn)', function (data) {
            var mobile = data.field.moblie;
            var ww = data.field.ww;
            var qq = data.field.qq;
            var remark = data.field.remark;
            if (mobile != '' && mobile != null) {
                if (!VerifyMoblie(mobile)) {
                    layer.msg('手机号码格式不正确');
                    return false;
                }
            }
          
            if (!ok)
            {
                return false;
            }
            ok = false;
            $.ajax({
                type: "Post",
                url: "/CustomerAjax/AddBackOfList",
                data: { moblie: mobile,ww:ww,qq:qq,remark: remark },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); ok = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time:1500 }, function () {
                        if (data.code > 0) {
                            parent.tools.reloadOrderData();
                        }
                    })
                    ok = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });
        
});