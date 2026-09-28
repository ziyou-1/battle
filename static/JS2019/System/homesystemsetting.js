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
    var re = true;
    var seachParam = '';
    var indexLoad;       
    var tableList =table.render({
        elem: '#tableList'
        , height: 'full'
        , url: '/SystemAjax/GetMyBindHomeSystemList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'HomeCompany', title: '上家系统名称', width: 150, align: 'left', unresize: false
            }
            , {
                field: 'HomeHost', title: '上家系统域名', align: 'left', width:200, sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="' + res.HomeHost +'" target="_blank" style="" title="点击可以访问这个系统">' + res.HomeHost + '</a>';
                    return vo;
                }
            }, {
                field: 'HomeAcc', title: '上家系统子账号', width: 200, align: 'left', unresize: false
            }, {
                field: 'UserName', title: '绑定操作人', width: 150, align: 'left', unresize: false
            }
            , {
                field: 'BindTimeStr', title: '绑定时间', width: 200, align: 'center', sort: true, unresize: false
            }
            , { fixed: '', title: '操作', width:160, toolbar: '#baroperating', unresize: true, }
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
            case 'addBtn':
                addBind();
                break;  
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data; 
        if (obj.event === 'submitDel') {
            var id = obj.data.BindHomeSystemLogId;
            delBind(id);
        }
    });  
    form.on('submit(seachBtn)', function (data) {
        page = 1; 
        reloadOrderList();
        return false;
    }); 
    function reloadOrderList() {  
        tableList.reload({
            url: '/SystemAjax/GetMyBindHomeSystemList?' + seachParam
            , where: {
            }
            , page: false
        });
        return false;
    }   
    var layerWindows;
    function addBind() {
        form.val("form", {
            "homeCompany":''
            , "homeUrl":'http://'
            , "homeAcc": ''
        });
        layerWindows=layer.open({
            title: "绑定一个新的上家系统",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['680px','480px'],
            content: $('.change')
        });
        return false;
    } 
    function delBind(id) {
        layer.confirm('确定要解除与这个上家的绑定吗？注意：解绑后，上家指派过来的新订单无法同步，但在本系统解绑之前同步过来的订单不受影响', { icon: 3, title: '提示' }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/UnBindHomeSystem",
                data: { sid: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
            layer.close(index);
        });       
        return false;
    } 
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            //不关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
    form.on('submit(savebtn)', function (data) {
        var homeCompany = data.field.homeCompany;
        var homeUrl = data.field.homeUrl;
        var homeAcc = data.field.homeAcc;
        var homePwd = data.field.homePwd;
        if (homeCompany == "" || homeCompany == null) {
            layer.msg('请输入这个上家名称（可自定义名称）');
            return false;
        }
        if (homeUrl == "" || homeUrl == null) {
            layer.msg('请输入这个上家的访问网址，例如http://d.jidanpu.com');
            return false;
        }
        if (homeAcc == "" || homeAcc == null) {
            layer.msg('请输入上家给你开的子账号');
            return false;
        }
        if (homePwd == "" || homePwd == null) {
            layer.msg('请输入上家给你开的子账号登录密码，不然没法验证');
            return false;
        } 
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveBindHomeSystemVer",
            data: { company: homeCompany, homeHost: homeUrl, homeAcc: homeAcc, homePwd: homePwd },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (index) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.close(layerWindows);
                    }
                    layer.close(index);
                });   
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
});