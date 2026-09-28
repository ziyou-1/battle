layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'util', 'table', 'ClipboardJS'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    var indexLoad;
    var re = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    } 
    var ids = $("#accId").val();
    getAccLogs();
    $(document).on('click', '.upImg', function () {
        var ids = $(this).attr('data-id'); 
        parent.layer.open({
            title: "上传账号截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '70%' : '90%', isPc ? '85%' : '90%'],
            content: '/Order/UploadPic?gameAccId=' + ids
        });
        return false;
    });
    $(document).on('click', '.mangeImg', function () {
        var ids = $(this).attr('data-id');
        parent.layer.open({
            title: "查看账号截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', isPc ? '85%' : '500px'],
            content: '/Order/PicMange?gameAccId=' + ids
        });
        return false;
    });
    $(document).on('click', '.getGameAccountUseInfo', function () {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/GetGameAccountUseInfoByDetail",
            data: { idx: ids },
            dataType: 'json',
            cache: false,
            timeout: 10000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    $(".uinfo").html(data.msg);
                }
                else {
                    layer.msg('提取失败，可能你没有权限', { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    $(document).on('click', '.getGameAccountPrivateInfo', function () {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/GetGameAccountPrivateInfoByDetail",
            data: { idx: ids },
            dataType: 'json',
            cache: false,
            timeout: 10000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    $(".pinfo").html(data.msg);
                }
                else {
                    layer.msg('提取失败，可能你没有权限', { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    function getAccLogs() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAccountsAjax/GetGameAccountLog",
            data: { accId: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('获取账号日志失败'); },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
                re = true;
                let html = '';
                if (data.code > 0) {
                    let d = data.data;
                    for (let i = 0; i < d.length; i++) {
                        let reBtn = '';
                        let color1 = 'color:#999';
                        if (d[i].content.indexOf('(说)') > -1) {
                            color1 = 'color:#FF5722';
                        }
                        if (d[i].content.indexOf('机密资料') > -1 || d[i].content.indexOf('使用资料') > -1) {
                            color1 = 'color:#E03636';
                        }
                        html += '<p class="linespan" style="line-height:28px;margin-left:5px; ' + color1 + '">【' + d[i].createTime + '】' + d[i].userName + '：' + d[i].content + '</p>';
                    }
                }
                $(".logdiv").html(html);
            }
            , complete: function (XMLHttpRequest) { }
        });
    } 
    form.on('submit(addpbtn)', function (data) {
        var remark = $("#remark").val();
        if (remark == "" || remark == undefined) {
            layer.msg('备注内容不能为空！', { time: 1000 }, function () {
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAccountsAjax/AddGameAccountLogRemark",
            data: { accId: ids, remark: remark },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) {
                    $("#remark").val('');
                    getAccLogs();
                    layer.msg(sdata, { time: 1000 }, function () {
                    });
                }
                else {
                    layer.msg(sdata, { time: 1500 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }); 
});
