layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'ClipboardJS', 'table','element'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;  
        var ClipboardJS = layui.ClipboardJS;
        var table = layui.table;
        var devices = layui.device();
        var isPc = true;
        if (devices.android===true|| devices.ios===true) {
            isPc = false;
        } 
    var re = true;
    var currentGameArearData = [];
    var currentGameServerData = [];
        laydate.render({
            elem: '#disableTime'
            , type: 'datetime'
        }); 
        var gameName = $("#gameName").find("option:selected").text();
       
        var indexLoad; 

    getGameArea();
    //getalltips()
    gettabledata()

    form.on('select(selectGame)', function (data) {
        $("#gameName option").each(function (){
            var item = $(this).val();
            if (item == data.value) {
                gameName = $(this).text();
            }
        });
        formSelects.data('gameArea', 'local', {
            arr: [
            ]
        }); 
        formSelects.data('gameServer', 'local', {
            arr: [
            ]
        }); 
        getGameArea();  
        gettabledata();
        return false;
    });
    formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) {
        getGameServer(val.value);
        return true;
    });

    form.on('submit(seachBtn)', function (data) {
        page = 1;
        gettabledata();
        return false;
    }); 
    form.on('select(otypechange)', function (data) {
        gettabledata();
        return false;
    });

    function getGameArea(){
        $.get('/GameAjax/getGameData?type=20&parentId=' + gameName, function (result) {
            currentGameArearData = result.data;
            formSelects.data('gameArea', 'local', {
                arr: currentGameArearData
            });
        });
        formSelects.data('gameServer', 'local', {
            arr: [
            ]
        }); 
        getGameServer();
    }

    function getGameServer(pid, serverName){
        $.get('/GameAjax/getGameData?type=30&parentId=' + pid, function (result) {
            currentGameServerData = result.data;
            formSelects.data('gameServer', 'local', {
                arr: currentGameServerData
            });
            //若需要追加选中服务器
            if (serverName != undefined && serverName != null && serverName != '') {
                let serverId = 0;
                currentGameServerData.forEach(function (val, index) {
                    let item = val;
                    if (item.name.indexOf(serverName) > -1) {
                        serverId = item.value;
                        return false;
                    }
                });
                if (serverId > 0) {
                    formSelects.value('gameServer', [serverId], true);
                } else {
                    //动态添加
                    formSelects.data('gameServer', 'local', {
                        arr: [
                            { "name": serverName, "value": serverName, "selected": "selected" }
                        ]
                    });
                }
            }
        });
    }

    function getalltips() {
        $('.selitems').html('')
        $.ajax({
            type: "Post",
            url: "/GameAccountsAjax/GetSellAccTipsList",
            data: { gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                var str ='<div class="selitem active">全部</div>'
                if (data.code > 0) {
                    data.data.forEach(function (item) {
                        str += '<div class="selitem">' + item+'</div>'
                    })
                }

                $('.selitems').append(str);

                $('.selitem').on('click', function (e) {
                    $('.selitem').removeClass('active');
                    $(this).addClass('active');
                })
                
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function gettabledata() {
        $('.tables').html('');
        var gameArea = formSelects.value('gameArea', 'nameStr');
        var gameServer = formSelects.value('gameServer', 'nameStr');
        var server = gameArea ? gameServer ? gameServer : gameArea : '';
        var orderType = $("#ordertype").val();
        $.ajax({
            type: "Post",
            url: "/GameAccountsAjax/GetSellAccListByPreview",
            data: { gameName: gameName, server: server, orderType:orderType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {                    
                    data.data.forEach(function (item, index) {
                        if (item.list.length > 0) {
                            $('.tables').append('<div class="tableitem layui-col-md4 layui-col-xs12 tableitem' + index + '"></div>');
                            var str = '<div  class="layui-hide" id="total' + index + '"><div style="color:#ff6a00;font-weight:bold;">' + item.tips + '</div></div> <table class="layui-hide" id="tableList' + index + '"></table>';
                            $('.tableitem' + index).append(str);
                            var tabledata = item.list;                           
                            table.render({
                                elem: '#tableList' + index,
                                data: tabledata,
                                height: 482,
                                toolbar: '#total' + index,
                                defaultToolbar: ['filter'],
                                cols: [[
                                    { field: 'accId', title: '编号', width:55, align: 'center', unresize: false },
                                    { field: 'price', title: '价格', width: 55, align: 'center', unresize: false },
                                    { field: 'gameArea', title: '大区', width: 55, align: 'center', unresize: false },
                                    { field: 'gameServer', title: '服务器', width: 65, align: 'center', unresize: false },
                                    { field: 'roleName', title: '角色', width:85, unresize: false },
                                    { field: 'info1', title: '当前信息1', width: 80,unresize: false },
                                    { field: 'info2', title: '当前信息2', width: 80,unresize: false },
                                    { field: 'tips', title: '标签',unresize: false }
                                ]]
                            })
                            
                        }

                    })
                   
                } else {
                    $('.tables').append('<div class="nodata">暂无数据</div>');
                }

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

        return false;
    }


});