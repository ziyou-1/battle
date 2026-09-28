layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util','table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad; 
    var gameId = $("#gameId").val(); 
    getGameBoss();
    function getGameBoss() {
        $.get('/GameAjax/GetBossSelectList?gameId=' + gameId, function (result) {
            formSelects.data('boss', 'local', {
                arr: result.data
            });
        });
    }
    form.on('submit(savebtn)', function (data) {
        var itemName = data.field.itemName;
        var postion = data.field.postion;
        var arrType = data.field.arrType;
        let boss = formSelects.value('boss', 'nameStr');
        var UBB = data.field.UBB;

        if (itemName == null || itemName == undefined || itemName == '') {
            layer.msg('请输入物品名称', { time: 1500 }, function () {
            });
            return false;
        }
        if (postion == null || postion == undefined || postion == '') {
            layer.msg('请选择部位', { time: 1500 }, function () {
            });
            return false;
        }
        var strParameter = JSON.stringify(data.field);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAjax/AddEditGameItem",
            data: { strParameter: strParameter, bossName: boss },
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
