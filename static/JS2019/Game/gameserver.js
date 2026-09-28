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
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/GameAjax/GetGameServerMangeList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'gameId', title: '游戏Id', width: '', fixed: 'left', unresize: false, sort: false, hide:true
            }
            ,
            {
                field: 'gameName', title: '游戏名称', width: '', fixed: 'left', unresize: false, sort: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" class="" style="color:#1E9FFF;margin-left: 10px;" title="" data-id="' + res.gameId + '">' + res.gameName + '</a>';
                    return vo;
                }
            }
            , {
                field: 'orderNum', title: '游戏排序(数据越大排序越靠前)',width:200, align: 'center', unresize: false, edit: true
            }
            , {
                field: 'isDefulat', title: '是否默认<i class="layui-icon layui-bangzhu" style="color:#FF5722" title="当此选项为绿色时，代表选择游戏时默认就是该游戏" />', width: 80, align: 'center', unresize: false, templet: '#switchTpl1'
            }
            , {
                field: 'isMoblieGame', title: '是否为手机游戏', width: 100, align: 'center', unresize: false, templet: '#switchTpl2'
            }
            , {
                field: 'isPw', title: '是否为陪玩游戏<i class="layui-icon layui-bangzhu" style="color:#FF5722" title="开启该项后，在录单页面将不需要录入游戏账号密码" />', width: 130, align: 'center', unresize: false, templet: '#switchTpl3'
            }
            , {
                field: 'isDisbleSendSms', title: '是否禁发短信<i class="layui-icon layui-bangzhu" style="color:#FF5722" title="开启该项后，该游戏的订单不会自动发送任何通知短信，手动发送除外" />', width: 130, align: 'center', unresize: false, templet: '#switchTpl4'
            }
            , { fixed: '', title: '操作', width: 100, toolbar: '#baroperating', unresize: true, }
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
            case 'addGameBtn':
                addGame();
                break;
            case 'resrefhCacheBtn':
                resrefhCache();
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            layer.confirm('确定将游戏删除吗？', function (index) {
                var id = obj.data.gameId;
                delGame(id);
                layer.close(index);
            });
            return false;
        }
    });

    //直接编辑行数据
    table.on('edit(tableList)', function (obj) {
        var row = obj.data;
        var data =
        {
            "id": row.gameId,
            "num": row.orderNum
        };
        $.ajax({
            type: "Post",
            url: "/GameAjax/UpdateGameOrderNum",
            data: data,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请稍候再试！'); },
            success: function (data) {
                if (data.code < 1) {
                    layer.msg(data.msg, { time: 6000 }, function () {
                    })
                }
            }
        });
        return false;
    });


    form.on('switch(swicth1Checked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/TopGameByGameID",
            data: { gameId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(swicth2Checked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/SetGameIsMoblieGame",
            data: { gameId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(swicth3Checked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/PWGameByGameID",
            data: { gameId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(swicth4Checked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/ChangeGameSendSmsSwitch",
            data: { gameId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function reloadOrderList() {
        tableList.reload({
            url: '/GameAjax/GetGameServerMangeList'
            , where: {
            }
            , page: false
        });
        return false;
    }
    function editGameName(id, name) {
        layer.prompt({ title: '更改游戏名称，请保持官方名称，这会影响现有名称的订单', formType: 0, value: name, maxlength: 20 }, function (value, index, elem) {
            if (name == value) {
                layer.msg('编辑的内容与原先一样，无需提交');
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAjax/AddEditGame",
                data: { gameId: id, gameName: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 2000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    }
    function delGame(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/DelGame",
            data: { gameId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function addGame() {
        layer.open({
            title: "新增游戏",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['85%', '63%'],
            content: '/Game/AddEditGame'
        });
    }
    function resrefhCache() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/ReshrefGameServerCache",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
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
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});