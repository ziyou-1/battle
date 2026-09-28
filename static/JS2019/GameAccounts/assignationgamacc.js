layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    var userRoleId = 0;
    var re = true;
    var indexLoad; 
    var currentRecUserName = $("#currentRecUserName").val();
    var accId = $("#accId").val(); 
    var tableList = table.render({
        elem: '#tableList'
        , height: 'full-180'
        , url: '/UserAjax/GetAllUserTableByGameName?gameName=' + $("#gameName").val()
        , defaultToolbar: []
        , cols: [[
             {
                 field: 'userName', title: '可选用户名', width: '20%', align: 'left', sort: true, templet: function (res) {
                     let colors = '#006EE9';
                     let tips = '';
                     if (currentRecUserName.indexOf(res.userName) > -1) {
                         colors = '#E03636';
                         tips = '【当前】';
                     }
                     let vo = '<span class="" style="color:' + colors + '">' + res.userName + tips + '</span>';
                    return vo;
                }
            }
            , {
                field: 'tips', title: '标记', width: '20%', templet: function (res) {
                    let vo = '<span class="" style="color:#F3723A">' + res.tips + '</span>';
                    return vo;
                }
            }
            , {
                field: 'remark', title: '备注', align: 'left', width: '44%', unresize: true, templet: function (res) {
                    return '<span title="">' + res.remark + '</span>';
                }
            }
            , { fixed: '', title: '操作', width: '13%', align: 'center', toolbar: '#baroperating', unresize: true, }
        ]]
        , page: false 
        , done: function (res, curr, count) { 
        }
    }); 
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
        };
    }); 
    function reloadOrderList() { 
        tableList.reload({
            url: '/UserAjax/GetAllUserTableByGameName?gameName=' + $("#gameName").val() + '&userRoleId=' + userRoleId + '&key=' + $("#key1").val()
            , where: {
            } 
        });
        return false;
    }
    table.on('tool(tableList)', function (obj) {
        var data = obj.data; 
        if (obj.event === 'addAss') {
            var id = obj.data.id;
            var userName = obj.data.userName;
            if (currentRecUserName == userName) {
                layer.msg(userName + '已经是该账号的接手人了，无需重复指派');
                return false;
            } 
            postSave(id);
        } 
    });
    form.on('radio(userRole)', function (data) {
        userRoleId = data.value;
        reloadOrderList();
    }); 
    form.on('submit(seachBtn)', function (data) { 
        reloadOrderList();
        return false;
    });  
    function postSave(userID) { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/ZhiPaiGameAccount",
            data: { gameAccId: accId, userId: userID },
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
    }

    $(document).on('click', '.cleanRec', function () { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/CleanRecGameAccount",
            data: { gameAccId: accId },
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
    });
    
});
