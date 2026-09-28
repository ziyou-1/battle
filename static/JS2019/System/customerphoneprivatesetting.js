layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'element'], function () {
    var $ = layui.$,
        form = layui.form,
        element = layui.element,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true; 
        var indexLoad;
        var layid = location.hash.replace(/^#private=/, '');
        element.tabChange('private', layid);
        element.on('tab(private)', function (elem) {
            location.hash = 'private=' + $(this).attr('lay-id');
        }); 
        form.on('submit(payczBtn)', function (data) {
            var jdp = data.field.jdp;
            if (jdp == 0) {
                layer.msg('本系统还未绑定平台账户，无法直接充值，请先到系统维护->系统各项设置管理,绑定你的平台账户并保存');
                return false;
            }
            layer.open({
                title: "给平台余额充值",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: [isPc ? '40%' : '95%', isPc ? '60%' : '95%'],
                content: '/PlatformRedirect/pay/SystemInPay?userID=' + jdp
            });
            return false;
        });
    form.on('submit(payczBtn2)', function (data) {
        var jdp = data.field.jdp;
        if (jdp == 0) {
            layer.msg('本系统还未绑定平台账户，无法直接购买，请先到系统维护->系统各项设置管理,绑定你的平台账户并保存');
            return false;
        }
        layer.open({
            title: "购买虚拟电话套餐包",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [ '95%', '95%'],
            content: '/PlatformRedirect/buy/buyservice?u='+jdp+'&tab=2'
        });
        return false;
    });
        form.on('radio(PrivacyPhoneServiceSwicth)', function (data) {
            var privacyPhoneServiceSwicth = data.value;
            saveSetting()
            return false;
        });
    function saveSetting(swicth, config1) {
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SavePrivacyPhoneServiceSetting",
            data: { privacyPhoneServiceSwicth: swicth },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {

                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('submit(save1btn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (strparameter == null || strparameter == "" || strparameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SavePrivacyPhoneServiceSetting",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    location.reload(true);
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
});