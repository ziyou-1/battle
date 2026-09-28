layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
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
    var layerWindows;

    var tableList =table.render({
        elem: '#tableList'
        , height: 'full'
        , cellMinWidth: 150
        , url: '/SystemAjax/GetSystemNoticeList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'title', title: '公告标题', width: 200, align: 'left', unresize: true, templet: function (res) {
                    let vo = '<a href="####" class="viewNotice" data-id="' + res.id + '" data-content="' + res.content + '" data-title="' + res.title + '" title="' + res.title.substring(0, 50) + '">' + res.title.substring(0, 50) + '...</a>';
                    return vo;
                }
            }
            , {
                field: 'content', title: '公告内容', align: 'left', sort: false, unresize: true, templet: function (res) {
                    let vo = '<a href="javascript:;" class="viewNotice" data-id="' + res.id + '" data-content="' + res.content + '" data-title="' + res.title + '" title="' + res.content + '">' + res.content.substring(0, 200) + '...</a>';
                    return vo;
                }
            }
            , {
                field: 'createTime', title: '发布时间', width: 160, align: 'center', sort: false, unresize: true, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" title="' + res.createTime + '">' + res.createTime + '</a>';
                    return vo;
                }
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
                add(0,'');
                break;  
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data; 
        if (obj.event === 'submitDel') {
            var id = obj.data.id;
            del(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var content = obj.data.content;
            add(id, content);
            return false;
        }
    }); 
    form.on('submit(seachBtn)', function (data) {
        page = 1; 
        reloadOrderList();
        return false;
    }); 
    function reloadOrderList() {  
        tableList.reload({
            url: '/SystemAjax/GetSystemNoticeList?' + seachParam
            , where: {
            }
            , page: false
        });
        return false;
    }   
    
    function add(id, content) {
        form.val("form", { 
            "id": id,
            "content": content
        });
        layerWindows=layer.open({
            title: id > 0 ? "编辑公告" : "新增一个内部公告",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['60%', '75%'],
            content: $('.change')
        });
        return false;
    } 
    function del(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/DelSystemNotice",
            data: { id: id },
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
        return false;
    } 
    $(document).on('click', '.viewNotice', function () {
        var ids = $(this).attr('data-id');
        var title = $(this).attr('data-title');
        var content = $(this).attr('data-content'); 
        layer.open({
            title: '内部公告：' + title.substring(0, 30) + '...',
            type: 1,
            shadeClose: true,
            skin: 'layui-layer-rim',
            area: [isPc ? '980px' : '90%', isPc?'680px':'85%'],
            content: '<div style="padding: 16px;font-size:14px;color:#000;line-height: 30px;">' + content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ') + '</div>'
        });
    });
    form.on('submit(savebtn)', function (data) { 
        var content = data.field.content; 
        var id = data.field.id;
        if (id == "" || id == undefined || id == null) {
            layer.msg('请刷新页面再试下');
            return false;
        }
        if (content == "" || content == undefined || content == null) {
            layer.msg('请输入公告内容');
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveSystemNotice",
            data: { id: id, content: content},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                tempUploadImgListIsSave = true;
                layer.close(layerWindows);
                if (data.code > 0) {
                    reloadOrderList();
                }
                layer.msg(data.msg, { time: 2000 }, function () { 
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                tempUploadImgList = [];
                layer.close(indexLoad);
            }
        });
        return false;
    });
});