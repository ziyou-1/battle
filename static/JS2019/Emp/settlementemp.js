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
    var re = true;
    var indexLoad; 
    var qrCodeList = []
    form.on('radio(sta)', function (data) { 
        if (data.value == "Y") {
            $(".expdiv").show();
        } else {
            $(".expdiv").hide();
        }
    });
    $.ajax({
        type: "GET",
        url: "/EmpAjax/GetEmpQrCode?ids=" + $("#empIds").val(),
        dataType: 'json',
        cache: false,
        timeout: 60000,
        error: function () { layer.msg('出现错误') },
        success: function (data) {
            if (data.code > 0 && data.data.length > 0) {
                var str = ''
                data.data.forEach((item, index) => {
                    item.alt = item.userName
                    item.pid = index
                    item.src = item.qrCode
                     str += `
                        <div class="qrCodeItem">
                            <img data-index="${index}" class="qrCodeImg" height="72"  src="${item.qrCode}" >
                            <div class="qrCodeUserName">${item.userName}</div>
                            <div class="qrCodeName">${item.name ? item.name : ''}</div>
                        </div>
                    `
                })
                qrCodeList = data.data
                $('.qrCodeBox').html(str)
            }
        }
        , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
    });
    $(document).on('click', '.qrCodeImg', function () {
        layer.photos({
            photos: {
                "title": "微信付款码",
                "start": $(this).attr('data-index'),
                "data": qrCodeList
            }
        });
    });
    form.on('submit(savebtn)', function (data) {
        var sta = data.field.sta;
        var empIds = $("#empIds").val();
        var syncexp = data.field.syncexp;
        if (sta == null || sta == undefined || sta == '') {
            layer.msg('请选择要修改的清算状态', { time: 1500 }, function () {
            });
            return false;
        } 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/EmpAjax/UpEmpSta",
            data: { empId: empIds, sta: sta, syncexp: syncexp },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        parent.tools.reloadOrderData();
                    });
                }
                else {
                    re = true;
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
});
