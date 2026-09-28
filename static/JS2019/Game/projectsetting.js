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
        var indexLoad;
        var pid = 0;
        var pname = "";
        var porderby = 0;
        var gameName = $("#gameName").find("option:selected").text(); 
        form.on('select(selectGame)', function (data) {  
            $("#gameName option").each(function () {
                var item = $(this).val();
                if (item == data.value) {
                    gameName = $(this).text();
                }
            });
            reloadOrderList(); 
            return false;
        }); 
        var tableList = table.render({
            elem: '#tableList' 
            , url: '/GameAjax/GetProjectList?gameId=' + $("#gameName").val()
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width:30
                }
                , {
                    field: 'projectName', title: '项目名称', fixed: 'left', unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="editProject" style="color:#1E9FFF;margin-left: 5px;" title="' + res.projectName + '，点击可以编辑" data-id="' + res.id + '" data-proname="' + res.projectName + '" data-orderby="' + res.orderBy + '">' + res.projectName + '</a>';
                        return vo;
                    }
                },
                {
                    field: 'gameName', title: '所属游戏', width:100, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span>' + gameName + '</span>';
                        return vo;
                    }
                },
                {
                    field: 'orderBy', title: '排序', width:60, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span>' + res.orderBy + '</span>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width:50, toolbar: '#baroperating', unresize: true, }
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
                case 'addProjectBtn':
                    addProject();
                    break;
                case 'delProject':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].id);
                    };
                    var ids = tempData.join(',');
                    delProject(ids);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
            if (obj.event === 'submitEdit') {
                var id = obj.data.id;
                var name = obj.data.projectName;
                var ordy = obj.data.orderBy;
                pid = id;
                editProject(id, name, ordy);
                return false;
            }
        }); 
        function reloadOrderList() { 
            tableList.reload({
                url: '/GameAjax/GetProjectList?gameId=' + $("#gameName").val()
                , where: { 
                }
                 , page: false
            });
            return false;
        }  
        function delProject(id) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAjax/DelProject",
                data: { pid: id },
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
        var layerWindow;
    function addProject() {
            pid = 0;
            form.val('pro', {
                "project": ''
               , "orderby": ''
            });
            form.render();
            layerWindow=layer.open({
                title: "新增常用代练项目",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['80%', '240px'],
                content: $('.addeditDiv')
            });
        }
        function editProject(id,name,ordy) {
            pid = id;
            pname = name;
            porderby = ordy;
            form.val('pro', {
                "project": pname
                ,"orderby": porderby 
            });

            form.render();
            layerWindow = layer.open({
                title: "编辑项目："+pname,
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['40%', '30%'],
                content: $('.addeditDiv')
            });
        }
        $(document).on('click', '.editProject', function () {
            var ids = $(this).attr('data-id');
            var sname = $(this).attr('data-proname');
            var sorderby = $(this).attr('data-orderby');
            editProject(ids, sname, sorderby);
        });
        form.on('submit(savebtn)', function (data) {
            if (data.field.project == "" || data.field.project == undefined) {
                layer.msg('项目名称不能为空');
                return false;
            }
            if (data.field.orderby == "" || data.field.orderby == undefined) {
                layer.msg('排序值不能为空，哪怕写个数字0');
                return false;
            }
            if (data.field.project == pname && data.field.orderby == porderby) {
                layer.msg('没有任何更改');
                layer.close(layerWindow);
                return false;
            }
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAjax/AddEditProject",
                data: { gameId: $("#gameName").val(), pid: pid, projectName: data.field.project, orderBy: data.field.orderby },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        if (data.code > 0) { 
                            if (pid > 0) {
                                layer.close(layerWindow);
                            } else {
                                form.val('pro', {
                                    "project": ''
                                    , "orderby": '0'
                                });
                                form.render();
                            }
                            reloadOrderList();
                        }
                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }); 
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); //关闭现有所有弹层
                reloadOrderList();
            }
        };
        window.tools = _tools;
});