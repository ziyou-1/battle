layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true; 
        laydate.render({
            elem: '#sDate'
           , type: 'datetime'
        });
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        }); 
        var seachParam = 'stime=' + $("#sDate").val() + '&etime=' + $("#eDate").val();
        var indexLoad;
        var re = true; 
        var page = 1; 
        getAllUserData();
        getAllRoleData();
        function getAllUserData() {
            $.get('/UserAjax/GetAllUserByGameName', function (result) {
                formSelects.data('userList', 'local', {
                    arr: result.data
                });
            });
        } 
        function getAllRoleData() {
            $.get('/SystemAjax/GetAllRoleList', function (result) {
                formSelects.data('jobRole', 'local', {
                    arr: result.data
                });
            });
        } 
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full-70'
            , url: '/UserAjax/GetUserCheckInList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 }
                , {
                    field: 'loginAcc', title: '登录账号', width: 150, unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="" title="">' + res.loginAcc + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'userName', title: '姓名/名称', width: 150, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="color:#FF534D" title="">' + res.userName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'roleName', title: '职位', width:100, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="color:#0B69E3" title="">' + res.roleName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'ip', title: '打卡IP', width:150, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.ip + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'computer', title: '计算机名称', width:200, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.computer + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: '打卡时间', width:150, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.createTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'checkType', title: '打卡类型', width: 70,align:'center', unresize: false, templet: function (res) {
                        let type = "上班";
                        if (res.checkType == 20) {
                            type = "下班";
                        }
                        let vo = '<span>' + type + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注说明', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.remark + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50]
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
            };
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            var uid = formSelects.value('userList', 'valStr');
            var userRole = formSelects.value('jobRole', 'valStr');
            var key = $("#key").val();  
            seachParam = 'uid=' + uid + '&userRole=' + userRole + '&stime=' + $("#sDate").val() + '&etime=' + $("#eDate").val() + '&key=' + key;
            tableList.reload({
                url: '/UserAjax/GetUserCheckInList?' + seachParam
                , where: { 
                }
                 , page: {
                     curr: page
                 }
            });
            return false;
        } 
        
});