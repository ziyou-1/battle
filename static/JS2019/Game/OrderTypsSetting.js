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
            , url: '/GameAjax/GetAllOrderTypeList?gameId=' + $("#gameName").val()
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width:30
                }
                , {
                    field: 'TypeName', title: '项目分类名称', fixed: 'left', width: 180, unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="editProject" style="color:#1E9FFF;margin-left: 5px;" title="' + res.TypeName + '，点击可以编辑" data-id="' + res.id + '" data-proname="' + res.TypeName + '" data-orderby="' + res.OrderBy + '"data-before="' + (res.AppendTitleByFront ? res.AppendTitleByFront : '') + '"data-after="' + (res.AppendTitleByEnd?res.AppendTitleByEnd:'') + '">' + res.TypeName + '</a>';
                        return vo;
                    }
                },
                {
                    field: 'gameName', title: '所属游戏', width:120, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span>' + gameName + '</span>';
                        return vo;
                    }
                },
                {
                    field: 'OrderBy', title: '排序', width:60, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span lay-tips="数字越大越靠前">' + res.OrderBy + '</span>';
                        return vo;
                    }
                },
                {
                    field: 'assPlatName', title: '指定发平台', width:270, align: 'left', unresize: false, sort: false
                },
                {
                    field: 'AppendTitleByFront', title: '追加到标题前', minWidth: 200, align: 'left', unresize: false, sort: false
                },
                {
                    field: 'AppendTitleByEnd', title: '追加到标题后', minWidth: 200, align: 'left', unresize: false, sort: false
                }
                , { fixed: '', title: '操作', width:80, toolbar: '#baroperating', unresize: true, }
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
                    addModityProject(0,'',0,null,'','');
                    break;
                case 'delProject':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].SkillType_ID);
                    };
                    var ids = tempData.join(',');
                    delProject(ids);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
            if (obj.event === 'submitEdit') {
                var id = obj.data.SkillType_ID;
                var name = obj.data.TypeName;
                var ordy = obj.data.OrderBy; 
                var assPlatName = obj.data.ExStr1;
                var before = obj.data.AppendTitleByFront;
                var after = obj.data.AppendTitleByEnd;
                addModityProject(id, name, ordy, assPlatName, before, after);
                return false;
            }
        }); 
        function reloadOrderList() { 
            tableList.reload({
                url: '/GameAjax/GetAllOrderTypeList?gameId=' + $("#gameName").val()
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
                url: "/GameAjax/DelOrderType",
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
    function addModityProject(id, name, orderBy, platformIds, before, after) {
        form.val('pro', {
            "project": name,
            "pid":id,
            "before": before,
            "after": after,
            "orderby": orderBy
        });
        let platformIdarr = platformIds != '' && platformIds != null ? platformIds.split(',') : [];
        var arrs = $('input[name="platformIds"]'); 
        for (item of arrs) {
            let val = $(item).val();
            if (platformIdarr.indexOf(val) > -1) {
                $(item).prop("checked", true)
            } else {
                $(item).prop("checked", false)
            }
        }
        form.render(); 
        layerWindow = layer.open({
            title: (id>0?"编辑":"新增")+"项目分类",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '620px' : '85%', isPc?'442px':'90%'],
            content: $('.addeditDiv')
        });
    } 
        $(document).on('click', '.editProject', function () {
            var ids = $(this).attr('data-id');
            var sname = $(this).attr('data-proname');
            var sorderby = $(this).attr('data-orderby');
            var before = $(this).attr('data-before');
            var after = $(this).attr('data-after');
            addModityProject(ids, sname, sorderby,null, before, after);
        });
    form.on('submit(savebtn)', function (data) {
        let pid = $("#pid").val();
        var platformIds = new Array();
        $("input:checkbox[name='platformIds']:checked").each(function (i) {
            platformIds[i] = $(this).val();
        });
        var platformIdsValue = platformIds.join(",");
            if (data.field.project == "" || data.field.project == undefined) {
                layer.msg('分类名称不能为空');
                return false;
            }
            if (data.field.orderby == "" || data.field.orderby == undefined) {
                layer.msg('排序值不能为空，哪怕写个数字0');
                return false;
            } 
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAjax/AddModityOrderType",
                data: { gameId: $("#gameName").val(), pid: pid, projectName: data.field.project, orderBy: data.field.orderby, before: data.field.before, after: data.field.after, platidx: platformIdsValue },
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
                                    "project": '',
                                    "pid": 0,
                                    "orderby": '0',
                                    "before": '',
                                    "after": '',
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