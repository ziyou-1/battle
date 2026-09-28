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
    var games = [];
    form.on('checkbox(selectGame)', function (data) {
        $("#saveBtn").removeClass('layui-disabled');
        $("#saveBtn").removeAttr('disabled'); 
    }); 
    form.on('submit(saveBtn)', function (data) {
        var uid = data.field.uid;
        var setMode = data.field.setMode;
        games = [];
        $('input[name="games"]:checked').each(function () {   
            games.push($(this).val());
        });
        if (games.length < 1) {
            layer.msg('至少选择一款游戏')
            return false;
        }
        if (setMode == null || setMode == undefined || setMode=='') {
            layer.msg('请选择设置方式')
            return false;
        }
        var sgames = games.join(',');  
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/SetUserGames",
            data: { uid: uid, games: sgames, setMode: setMode },
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
