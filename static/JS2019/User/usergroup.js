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
            , url: '/SystemAjax/GetUserGroupList?' + seachParam
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'groupName', title: '角色分组名称', width:100, align: 'left', unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="color:#1E9FFF" title="' + res.groupName + '">' + res.groupName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'containJobName', title: '包含具体角色职位',  align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="包含了：' + res.containJobName + '">' + res.containJobName + '</a>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width:130, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: false 
            , done: function (res, curr, count) { 
             }
        }); 
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'del') {
                var id = obj.data.groupId;
                
            } else if (obj.event === 'submitEdit') {
                var groupId = obj.data.groupId;
                changeGroup(groupId);
                return false;
            }
        }); 
        function reloadOrderList() {   
            tableList.reload({
                url: '/SystemAjax/GetUserGroupList?' + seachParam
                , where: {
                }
                 , page:false
            });
            return false;
        }
        function changeGroup(id) {
            layer.open({
                title: "修改分组包含角色",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['85%', '200px'],
                content: '/User/EditUserGroup?groupId=' + id
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