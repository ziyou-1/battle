layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true;
        var gameID = $("#gameID").val();
        var orderId = $("#orderId").val();
        var indexLoad; 
        var seachParam = 'gameId=' + gameID;
        var page = 1;
        var tableList =table.render({
            elem: '#tableList'
            , url: '/PveTaskAjax/GetAllTaskListData?' + seachParam
            , defaultToolbar: [] 
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'taskId', title: '排团编号', width:60, align: 'center', fixed: 'left', unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#FF534D" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'taskName', title: '排团名称', width:100, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#0B69E3" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'gameArea', title: '游戏区服/阵营', width:100, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.gameArea + '/' + res.gameServer + '/' + res.gameGroup + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'leaderUserName', title: '团队指挥', width:70, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.leaderUserName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'startTime', title: '开始时间', width:80, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.startTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'endTime', title: '完成时间', width: 80,align:'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.endTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'taskStatus', title: '进度', width:60, align: 'center', unresize: false, templet: function (res) {
                        let sta = '未开始';
                        let color = '#FFD700';
                        if (res.taskStatus == 'B') {
                            sta = '进行中';
                            color = '#FF82AB';
                        }
                        else if (res.taskStatus == 'C') {
                            sta = '已完成';
                            color = '#FF82AB';
                        }
                        else if (res.taskStatus == 'D') {
                            sta = '已暂停';
                            color = '#FF534D';
                        }
                        let label = '<a href="javascript:void(0)" data-id="' + res.taskId + '" class="lableb" title="该团当前状态：' + sta + '" style="background-color:' + color + '">' + sta + '</a>';
                        let vo = '<span style="color:'+color+'">' + sta + '</span>';
                        return label;
                    }
                }
                , {
                    field: 'difficulty', title: '排团标识', width:70, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.difficulty + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameAccCount', title: '配号数', width:60,align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span title="已分配了' + res.gameAccCount + '个账号">' + res.gameAccCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注', unresize: false
                }
                , { fixed: '', title: '操作', width:90, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) {
                page = curr;
             }
        });  
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'addTask') {
                var id = obj.data.taskId;  
                 
                $.ajax({
                    type: "Post",
                    url: "/PveTaskAjax/CheckOrderInsideTask",
                    data: { orderId: orderId },
                    dataType: 'json',
                    cache: false,
                    timeout: 1000*30,
                    error: function () { layer.msg('检测前置条件请求出现异常！'); return false; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.confirm('您勾选的单子有部分在排团里：<br/>' + data.msg + '<br/>确定继续加入？', function (index) {
                                orderToJoinTask(orderId, id);
                            });
                        }
                        else {
                            orderToJoinTask(orderId, id);
                        }
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                }); 
                return false;
            }
        });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            var taskSta = formSelects.value('taskSta', 'valStr');
            var key = $("#key").val();  
            seachParam = 'gameId=' + gameID + '&taskSta=' + taskSta + '&key=' + key;
            tableList.reload({
                url: '/PveTaskAjax/GetAllTaskListData?' + seachParam
               , where: { //设定异步数据接口的额外参数，任意设 
               }
               , page: {
                   curr: page
               }
            });
            return false; 
        }
        $(document).on('click', '.viewTask', function () {
            var ids = $(this).attr('data-id');
            viewTaskDetails(ids);
        }); 
        function viewTaskDetails(taskid) {
            parent.layer.open({
                title: taskid + "排团详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '85%'],
                content: '/Group/GroupDetails?taskID=' + taskid
            });
        } 

    function orderToJoinTask(orderId, taskId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/JoinOrderByGroupID",
            data: { orderId: orderId, taskId: taskId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        parent.tools.reloadOrderData();
                    }
                });
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
});