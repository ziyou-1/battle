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
        var gameId = $("#gameName").val();
        var seachParam = 'gameId=' + gameId;
        var indexLoad; 
        var page = 1;   
        var tableList =table.render({
            elem: '#tableList'
            , cellMinWidth: 80
            , url: '/EmpAjax/GetLearmInformationList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 } 
                , {
                    field: 'keys', title: '所属游戏', width: 150, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + res.gameName + '">' + res.gameName + '</a>';
                        return vo;
                    }
                }, {
                    field: 'title', title: '资料/套餐标题', minWidth:300, align: 'left', unresize: true, templet: function (res) {
                        let vo = '<a href="/Emp/viewlearminformation?id=' + res.id + '" target="_blank" class="" style="color:#1E9FFF" title="' + res.title + '">' + res.title + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'keys', title: '标签/约接单价', width: 300, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + res.keys + '">' + res.keys + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'tips', title: '标记/约发单价', width: 250, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.tips + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: '最后编辑时间', width: 150, align: 'center', sort: false,
                    unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.createTime + '</span>';
                        return vo;
                    }
                } 
                , { fixed: '', title: '操作', width:80, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true 
            , limit: 30
            , limits: [10, 20, 30, 40, 50,100]
            , done: function (res, curr, count) { 
                page = curr;
             }
        }); 
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addBtn':
                    addInfo(0);
                    break; 
                case 'delBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请选中要操作的记录');
                        return false;
                    }
                    var ids = '';
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].id);
                        };
                        ids = tempData.join(',');
                    }
                    delInfo(ids);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'del') {
                var id = obj.data.bookId;
                layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) { 
                    layer.close(index);
                });
            } else if (obj.event === 'submitEdit') {
                var id = obj.data.id; 
                addInfo(id);
                return false;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() {  
            var skey = $("#key1").val(); 
            seachParam = 'gameId=' + $("#gameName").val() + '&key=' + skey;
            
            tableList.reload({
                url: '/EmpAjax/GetLearmInformationList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
        form.on('select(selectGame)', function (data) {
            reloadOrderList();
            return false;
        });
        function addInfo(id) {
            layer.open({
                title: id > 0 ? "编辑资料" : "新增资料",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: '/Emp/AddEditLearmInformation?id=' + id
            });
            return false;
        } 
        function delInfo(ids) {
            layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理', function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/EmpAjax/DelLearmInformation",
                    data: { ids: ids },
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
});