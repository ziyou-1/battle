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
    var layerindex;
    var curid;

        var tableList =table.render({
            elem: '#tableList'
            , height: 'full'
            , url: '/SystemAjax/GetAllRoleJobList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'roleName', title: '角色职位名称', width: 150, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewRole" data-id="' + res.roleId + '" data-name="' + res.roleName + '+" style="color:#1E9FFF" title="' + res.roleName + '，点击可以查看权限清单">' + res.roleName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '角色说明', align: 'left', sort: false, unresize: true,  templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.remark + '">' + res.remark + '</a>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width: 300, toolbar: '#baroperating', unresize: true, }
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
                    addRole(0);
                    break;  
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'submitDel') {
                var id = obj.data.roleId;
                delRole(id);
            } else if (obj.event === 'submitEdit') {
                var roleId = obj.data.roleId;
                addRole(roleId);
                return false;
            } else if (obj.event === 'submitcopy') {
                var roleId = obj.data.roleId;
                copyRole(roleId, obj.data.roleName);
                return false;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
    form.on('submit(copysubbtn)', function (data) {

        if (!data.field.jobName) {
            layer.msg('请填写新职位名称！');
            return false
        }

        if (data.field.jobName.length > 6 || data.field.jobName.length<1) {
            layer.msg('职位名称为2-6个字符！');
            return false
        }
       var params = {
                currentJobId: data.field.currentJobId,
                jobName: data.field.jobName,
                remark: data.field.remark
            }

            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/CopyRoelNewJob",
                data: params,
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(layerindex);
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
        }); 
        function reloadOrderList() {  
            tableList.reload({
                url: '/SystemAjax/GetAllRoleJobList?' + seachParam
                , where: {
                }
                , page: false
            });
            return false;
        }   
        $(document).on('click', '.viewRole', function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');
            layer.open({
                title: name+"的权限清单",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '85%'],
                content: '/System/RoleAuthorityView?roleId=' + id
            });
            return false;
        })
        function addRole(id) {
            layer.open({
                title: id > 0 ? "编辑权限" : "新增一个角色职位",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: '/System/AddEditRoleAuthority?roleId=' + id
            });
            return false;
    } 

    function copyRole(id,name) {
        $(".currentJobId").val(id);
        $('#currole').val(name)
        $('#jobName').val('')
        $('#remark').val('')
        layerindex=layer.open({
            title: "复制成新职位",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['650px', '400px'],
            content: $(".copyRole"),
            cancel: function (index) {
                $(".currentJobId").val('');
                $('#currole').val('')
                $('#jobName').val('')
                $('#remark').val('')
                layer.close(index);
            }
        });
        return false;


    }
        function delRole(id) {
            layer.confirm('真的删除吗？警告：一旦删除，所有设定为该角色的系统用户将会无法访问系统，正确做法是先将该职位的所有用户职位改成其它的职位', function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/DelRole",
                    data: { roleId: id },
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