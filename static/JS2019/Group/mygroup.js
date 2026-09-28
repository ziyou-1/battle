layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects; 
        laydate = layui.laydate; 
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
        form.on('select(selectGame)', function (data) {
            gameId = data.value;  
            reloadOrderList();
            return false;
        });
        var tableList =table.render({
            elem: '#tableList'
            , url: '/PveTaskAjax/GetMyGroup?' + seachParam 
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 }
                , {
                    field: 'taskId', title: '排团编号', width:80, unresize: true, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#FF534D" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'taskName', title: '排团名称', width:200, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#0B69E3" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'gameArea', title: '游戏区服/阵营', width: 300, unresize: true, templet: function (res) {
                        let vo = '<span>' + res.gameArea + '/' + res.gameServer + '/' + res.gameGroup + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'leaderUserName', title: '团队指挥', width:100, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.leaderUserName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'startTime', title: '开始时间', width:100,align:'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.startTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'endTime', title: '完成时间', width: 100, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.endTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'taskStatus', title: '进度', width:80, align: 'center', unresize: false, templet: function (res) {
                        let sta = '未开始';
                        let color = '#76838F';
                        if (res.taskStatus == 'B') {
                            sta = '进行中';
                            color = '#21AA76';
                        }
                        else if (res.taskStatus == 'C') {
                            sta = '已完成';
                            color = '#247CF0';
                        }
                        else if (res.taskStatus == 'D') {
                            sta = '已暂停';
                            color = '#FF534D';
                        }
                        let vo = '<span style="color:'+color+'">' + sta + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'difficulty', title: '排团标识', width: 100, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.difficulty + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameAccCount', title: '配号数', width:100, unresize: false, templet: function (res) {
                        let vo = '<span title="已分配了' + res.gameAccCount + '个账号">' + res.gameAccCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注', unresize: true
                }
            ]] 
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
        form.on('submit(seachBtn)', function (data) { 
            reloadOrderList();
            return false;
        });
        function reloadOrderList() { 
            var taskSta = formSelects.value('taskSta', 'valStr');
            var key = $("#key").val();  
            seachParam = 'gameId=' + gameId + '&taskSta=' + taskSta + '&key=' + key;
            
            tableList.reload({
                url: '/PveTaskAjax/GetMyGroup?' + seachParam
                , where: { 
                } 
            });
            return false;
        }
        $(document).on('click', '.viewTask', function () {
            var ids = $(this).attr('data-id');
            viewTaskDetails(ids);
        });
        function viewTaskDetails(taskid) {
            layer.open({
                title: taskid + "排团详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: 'GroupDetails?taskID=' + taskid
            });
        }  
});