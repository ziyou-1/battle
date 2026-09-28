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
        var seachParam = 'roleId='+$("#roleId").val();
        var indexLoad; 
      
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full-20'
            , url: '/SystemAjax/GetRoleAuthorityViewList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
               {
                   field: 'menuName', title: '拥有权限名称',fixed:'left', width:150, align: 'left', unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="color:#1E9FFF" title="' + res.menuName + '">' + res.menuName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'menuLevel', title: '级别', width: 70, align: 'left', sort: false, unresize: true, templet: function (res) {  
                        let vo = '<a href="javascript:void(0);" style="" title="' + (res.menuLevel == 0 ? "一级" : "二级") + '">' + (res.menuLevel == 0 ? "一级" : "二级") + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'fatherMenuName', title: '所属栏目', width:150, align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.fatherMenuName + '">' + res.fatherMenuName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '权限说明',  align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.remark + '">' + res.remark + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'orderBy', title: '排序', width:80, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.orderBy + '">' + res.orderBy + '</a>';
                        return vo;
                    }
                } 
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
                url: '/SystemAjax/GetRoleAuthorityViewList?' + seachParam
                , where: {
                }
                , page: false
            });
            return false;
        }    
});