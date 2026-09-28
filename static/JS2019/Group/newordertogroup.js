layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
        var re = true;
        var gameID = $("#gameID").val();
        var orderId = $("#orderId").val();
        var gameName = $("#gameName").val();
        var indexLoad;
        var selectDate = [];
        var dateStr = '';
        getTaskList();
        getAllUserData();
        function getAllUserData() {
            var selectTaskUserId = $("#selectTaskUserId").val();
            var us = selectTaskUserId > 0 ? "&selectValue=" + selectTaskUserId : "";
            $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName + us, function (result) {
                formSelects.data('leader', 'local', {
                    arr: result.data
                });
            });
        }
        form.on('checkbox(taskDatefilter)', function (data) {
            if (data.elem.checked) {
                selectDate.push(data.value);
            } else {
                for (let i = 0; i < selectDate.length; i++) {
                    if (selectDate[i] == data.value) {
                        selectDate.splice(i, 1);
                    }
                }
            }
            var dStr = selectDate.join(',');
            dateStr = dStr;
            getTaskList();
        });
        function getTaskList() {
            var leader = formSelects.value('leader', 'valStr');
            var leaderId = leader == null || leader == '' || leader == undefined ? 0 : leader;
            var key = $("#title").val();
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: '/PveTaskAjax/GetNewOrderToGroupDataList',
                data: { date: dateStr, gameId: gameID, leaderId: leaderId,key:key },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('无法读取排团数据，请稍候再试'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    var taskData = data.data;
                    $(".layui-row").html("");
                    let html = "";

                    $.each(taskData, function (index, item) {
                        html += '<div class=" layui-col-lg3 layui-col-md3 layui-col-sm6 layui-col-xs12" style="background-color:#F2F2F2">';
                        html += '<div class="layui-card">';
                        html += '<div class="layui-card-header"><span style="color:#5FB878;font-weight:600">【' + item[0].startTime + '】</span>' + '<span style="color:#1E9FFF;font-weight:600">' + item[0].taskGameGroup + '</span> ' + item[0].taskName + ' ==== <span style="color:#FF5722;">' + item[0].proJect + '</span></div>';
                        html += '<div class="layui-card-body">';
                        html += '<table class="layui-table datatable" id="datatable" style="table-layout:fixed; ">';
                        html += '<colgroup>';
                        html += '<col width="25%">';
                        html += '<col width="18%">';
                        html += '<col width="">';
                        html += '<col width="12%">';
                        html += '<col width="15%">';
                        html += '</colgroup>';
                        html += '<thead>';
                        html += '<tr style="color:#333">';
                        html += '<th>打手</th>';
                        html += '<th>职业</th>';
                        html += '<th>角色名</th>';
                        html += '<th>价格</th>';
                        html += '<th>操作</th>';
                        html += '</tr>';
                        html += '</thead>';
                        html += '<tbody id="orderListBody">';
                        for (let i = 0; i < item.length; i++) {
                            html += '<tr style="color:#666;font-size:12px">';
                            html += '<td>' + item[i].recUser + '</td>';
                            html += '<td>' + item[i].gameJob + '</td>';
                            html += '<td>' + item[i].gameRoleName + '</td>';
                            html += '<td>' + item[i].orderPrice + '</td>';
                            if (item[i].userId > 0) {
                                if (item[i].taskAccLogId > 0) {
                                    html += '<td><a class="layui-btn layui-btn-xs layui-btn-warm replacePostion" data-accid="' + item[i].taskAccLogId + '" data-taskId="' + item[i].taskId + '" title="将选定的订单替换掉这个坑位">替换</a></td>';
                                } else {
                                    html += '<td><a class="layui-btn layui-btn-xs layui-btn-normal setPostion" title="将选定的订单指定给该坑位" data-taskId="' + item[i].taskId + '" data-pid="' + item[i].pid + '">指定</a></td>';
                                } 
                            } else {
                                html += '<td>无打手</td>';
                            }
                            html += '</tr>';
                        }
                        html += '</tbody>';
                        html += '</table>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                    });
                    $(".layui-row").append(html);
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        }
        form.on('radio(groupfilter)', function (data) { 
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: '/PveTaskAjax/GetTaskOnlyAssUserList',
                data: { taskId: data.value},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('无法读取排团数据，请稍候再试'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    var userData = data.data;
                    $(".userList").html("");
                    let html = "";
                    $.each(userData, function (index, item) {
                        html += '<input type="radio" name="userRadio" value="' + item.userId + '" title="' + item.userName + '" lay-filter="userList">';
                    });
                    $(".userList").append(html);
                    form.render('radio');
                    $(".saveDiv").show();
                    $(".saveBtn").html('确定将勾选的订单加入到该排团');
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
        form.on('radio(userList)', function (data) {
            var uid = data.value;
            $(".feeDiv").show(); 
            $("#fee").focus(); 
            $(".saveBtn").html('确定将勾选的订单(第1笔)指派给该接手人并加入到该排团');
            $(".saveBtn").removeClass('layui-btn-normal').addClass('layui-btn-danger');
        });
        $("#title").bind('input propertychange', function () {
            $(".saveConfigBtn").removeClass('layui-disabled');
            $(".saveConfigBtn").removeAttr('disabled');
        });
        var autotipsmouseover;
        $(document).on('mouseover', '.fee', function () {
            autotipsmouseoverTips();
        });
        $(document).on('mouseleave', '.fee', function () {
            layer.close(autotipsmouseover);
        });
        function autotipsmouseoverTips() {
            setTimeout(function () {
                autotipsmouseover=  layer.tips('可以在这里给TA设定一个提成（抛单价），若不需要设定，可以保持0', ".fee", {
                    tips: [3, '#2F4056'],
                    time: 3500,
                    tipsMore: false
                });
            }, 200);
        }
        form.on('submit(saveBtn)', function (data) {
            var taskId = data.field.group;
            var recUserId = data.field.userRadio;
            var fee = data.field.fee;  
            if (!VerifyMoeny(fee)) {
                layer.alert('请输入正确的抛单价金额，要么请填写0');
                return false;
            } 
            if (!re)
                return false;
            re = false;
            //请求
            $.ajax({
                type: "Post",
                url: "/PveTaskAjax/NewOrderToTaskAss",
                data: { order: orderId, taskId: taskId, recUserId: recUserId, fee: fee },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 2000 }, function () { 
                        parent.tools.reloadOrderDataNoCloseLayer();
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        }); 
        $(document).on('click', '.replacePostion', function () {
            var accid = $(this).attr('data-accid');
            var taskId = $(this).attr('data-taskId'); 
            layer.confirm('确定将选定的订单替换掉该现有的订单吗？说明：替换后，原订单将从该排团移除，刚选定的订单将加入到该排团', { icon: 3, title: '提示' }, function (index) {
                if (!re)
                    return false;
                re = false;
                //请求
                $.ajax({
                    type: "Post",
                    url: "/PveTaskAjax/NewOrderToTaskReplaceOldOrder",
                    data: { taskAccLogId: accid, taskId: taskId, orderId: orderId},
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('请求异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.close(index);
                        layer.msg(data.msg, { time: 1500 }, function () {  
                            parent.tools.reloadOrderData();
                        });
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
               
            });
            return false;
        });
        formSelects.on('leader', function (id, vals, val, isAdd, isDisabled) { 
            getTaskList();
        }, true);
        $(document).on('click', '.setPostion', function () {
            var pid = $(this).attr('data-pid');
            var taskId = $(this).attr('data-taskId');
            layer.prompt({ title: '请设置抛单价，若不设定请填0', formType: 0, value:'0', maxlength: 5 }, function (value, index, elem) {
                if (!VerifyMoeny(value)) {
                    layer.alert('请输入正确的金额格式');
                    return false;
                }
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/PveTaskAjax/SetTaskPostionOrder",
                    data: { taskId: taskId, pid: pid, orderId: orderId, throwFee: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.msg(data.msg, { time: 1000 }, function () {
                                layer.close(index);
                                parent.tools.reloadOrderData();
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
        });
        $(document).on('click', '.seachBtn', function () {
            getTaskList();
        });
        $(document).on('click', '.saveConfigBtn', function () {
            if ($(".saveConfigBtn").hasClass("layui-disabled")) {
                return false;
            }
            var leader = formSelects.value('leader', 'valStr');
            var leaderId = leader == null || leader == '' || leader == undefined ? 0 : leader;
            var key = $("#title").val();
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/UserAjax/SaveOrderToTaskPostionSeachConfig",
                data: { selectUserId: leaderId,key:key },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        $(".saveConfigBtn").addClass('layui-disabled');
                        $(".saveConfigBtn").attr('disabled', '');
                    }
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        }); 
        formSelects.on('leader', function (id, vals, val, isAdd, isDisabled) {
            $(".saveConfigBtn").removeClass('layui-disabled');
            $(".saveConfigBtn").removeAttr('disabled');
        });
});