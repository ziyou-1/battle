layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    aliossUploader: '/lib/aliossUploader'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'aliossUploader', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var table = layui.table;
    var aliossUploader = layui.aliossUploader;
    var devices = layui.device();
    var isPc = true;
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    });
    var uploadInst=aliossUploader.render({
        elm: '#uploadOne',
        region: 'oss-cn-hangzhou',
        bucket: 'jidanpuusercentermuchly',
        layerTitle: '上传图片',
        accessidFiled: 'accessid',
        policyFiled: 'policy',
        signatureFiled: 'signature',
        codeFiled: 'code',
        codeStatus: 0,
        policyMethod: 'GET',
        policyData: {},
        policyHeader: {
            Authorization: layui.data('XCORS').Authorization
        },
        policyUrl: '/CommonPermissionAjax/GetAliOssPolicy?bk=10',
        prefixPath: 'other/',
        fileType: 'images',
        multiple: false,
        httpStr: 'https',
        allUploaded: function (res) {
            var fileList = res;
            imgUrl = fileList[0].ossUrl;

            $(".newspic").attr('href', imgUrl);
            $(".newspic").html('上传成功，点击查看');
            $("#newspic").val(imgUrl);

            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/SaveGroupLevelImg",
                data: { value: imgUrl},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    $("#levelImg").attr('src', imgUrl);
                    layer.msg(data.msg, { time: 2000 }, function () {
                        
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        },
        policyFailed: function (res) {
            layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
        },
        uploadRenderData: {
            size: 1024 * 5
            , accept: 'images'
            , acceptMime: 'image/*'
            , exts: 'jpg|png|bmp|jpeg'
            , number: 1
        }
    });
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true; 
        var gameId = $("#gameName").val();
        var gameName = $("#gameName").find("option:selected").text();
        var indexLoad;
        var re = true;
        var page = 1;
        var currentTaskId = 0;
        laydate.render({
            elem: '#sDate'
        , type: 'date'
        }); 
    getAllUserData();
    function getAllUserData() { 
            $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName + '&selectValue=' + $("#leaderIds").val(), function (result) {
                formSelects.data('leader', 'local', {
                    arr: result.data
                });
            });
        } 
        form.on('select(selectGame)', function (data) {
            gameId = data.value;  
            reloadOrderList();
            return false;
        }); 
        var seachParam = 'gameId=' + gameId + '&taskSta=' + $("#taskSta").val() + '&leaderId=' + $("#leaderIds").val() + '&taskSort=' + $("#taskSort").val() + '&key=' + $("#key").val();
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full-70'
            , url: '/PveTaskAjax/GetGroupList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 }
                , {
                    field: 'taskId', title: '排团编号', width:70, fixed: 'left', unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#FF534D" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'taskName', title: '排团名称', width:150, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewTask" style="color:#0B69E3" title="点击可以进入排团详情" data-id="' + res.taskId + '">' + res.taskName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'proJectName', title: '项目/副本名称', width: 150, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="editProject" style="color:#0B69E3" title="点击可以快速编辑项目名称" data-project="' + res.proJectName + '" data-id="' + res.taskId + '">' + res.proJectName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'gameArea', title: '游戏区服/阵营', width:150, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.gameArea + '/' + res.gameServer + '/' + res.gameGroup + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'leaderUserName', title: '团队指挥', width:90, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.leaderUserName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'startTime', title: '开团时间', width: 130, unresize: false, templet: function (res) {
                        let style = '';
                        if (res.startTime == null || res.startTime == '') {
                            style = 'color:#1E9FFF';
                        }
                        let vo = '<a href="#" class="changeSdate" style="' + style + '" data-id="' + res.taskId + '" data-value="' + res.startTime + '" title="开团时间，点击可以编辑该时间">' + (res.startTime != null && res.startTime != '' ? res.startTime : '点击可设定') + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'endTime', title: '完成时间', width:90, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.endTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'taskStatus', title: '进度', width:70, align: 'center', unresize: false, templet: function (res) {
                        let sta = '未开始';
                        let color = '#FFD700';
                        if (res.taskStatus == 'B') {
                            sta = '进行中';
                            color = '#FF82AB';
                        }
                        else if (res.taskStatus == 'C') {
                            sta = '已完成';
                            color = '#0094ff';
                        }
                        else if (res.taskStatus == 'D') {
                            sta = '已暂停';
                            color = '#FF534D';
                        }
                        let vo = '<a href="javascript:void(0)" data-id="' + res.taskId + '" title="" class="lableb setdlsta" style="background-color:' + color + '">'+sta+'</a>';
                        return vo;
                    }
                }
                , {
                    field: 'difficulty', title: '排团标识', width:80, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.difficulty + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameAccCount', title: '配号数', width:80,align:'center', unresize: false, templet: function (res) {
                        let vo = '<span title="已分配了' + res.gameAccCount + '个账号">' + res.gameAccCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'postionAmount', title: '每坑价格', width: 80, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="editpostionFee" data-id="' + res.taskId + '" data-fee="' + res.postionAmount + '" title="点击可以快速编辑坑位价格">' + res.postionAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'orderId', title: '排序(越大越前)', width: 100, align: 'center', unresize: false,edit:true, templet: function (res) {
                        let vo = '<span lay-tips="点击可以直接编辑排序值，数字越大越排前面">' + res.orderId + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注', unresize: true
                }
                , { fixed: '', title: '操作', width:110, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50,80,100,150,200]
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
                case 'delBtn': 
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].taskId);
                    };
                    var taskId = tempData.join(',');
                    layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) {
                        delTask(taskId);
                        layer.close(index);
                    });
                    break;
                case 'changeStaBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].taskId);
                    };
                    var taskId = tempData.join(',');
                    changeSetSta(taskId);
                    break;
                case 'upLevelBtn':
                    upGroupLevelImg();
                    break;
                case 'exportreccountBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要导出的排团');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].taskId);
                    };
                    var taskId = tempData.join(',');
                    exportGroupUserRecOrderCountToExecl(taskId);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'submitDel') {
                var id = obj.data.taskId;
                layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) {
                    delTask(id);
                    layer.close(index);
                });
            } else if (obj.event === 'submitEdit') {
                var taskId = obj.data.taskId;
                layer.open({
                    title: "编辑排团",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 2,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: ['70%', '70%'],
                    content: 'AddEditGroup?taskId=' + taskId
                });
                return false;
            }
        });
        table.on('edit(tableList)', function (obj) {
        if (obj.field == "orderId") {
            if (!VerifyInt(obj.value)) {
                layer.msg('输入格式不正确，请输入整数', { time: 2000 }, function () {
                });
                return false;
            }
            changeTaskOrderBy(obj.data.taskId, obj.value);
        }
    });
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        });
        function reloadOrderList() { 
            var taskSta = $("#taskSta").val();
            var leaderId=formSelects.value('leader', 'valStr');
            var taskSort = $("#taskSort").val();
            var key = $("#key").val();
            seachParam = 'gameId=' + gameId + '&taskSta=' + taskSta + '&leaderId=' + leaderId + '&taskSort=' + taskSort + '&key=' + key;
            
            tableList.reload({
                url: '/PveTaskAjax/GetGroupList?' + seachParam
                , where: { 
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
        function changeTaskOrderBy(id, value) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/ChangeTaskOrderBy",
            data: { taskId: id, value: value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1500 });
                    reloadOrderList();
                }
                else {
                    layer.alert(data.msg);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
        function delTask(id) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/DelPveTask",
                data: { taskId: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.alert(data.msg);
                        reloadOrderList();
                    }
                    else {
                        layer.alert(data.msg);
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        }
        $(document).on('click', '.setdlsta', function () {
            var ids = $(this).attr('data-id');
            changeSetSta(ids);
        });
        $(document).on('click', '.editProject', function () {
            var ids = $(this).attr('data-id');
            var project = $(this).attr('data-project');
            layer.prompt({ title: '编辑项目名称/副本名(不需要请写无)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: project }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false; 
                $.ajax({
                    type: "Post",
                    url: "/PveTaskAjax/EditPveTeamProject",
                    data: { taskId: ids, project: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('数据请求出现异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                layer.close(index);
                                reloadOrderList();
                            }
                        });
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
            });
        });
        $(document).on('click', '.editpostionFee', function () {
            var ids = $(this).attr('data-id');
            var fee = $(this).attr('data-fee');
            layer.prompt({ title: '编辑坑位单价(不需要请写0)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: fee }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/PveTaskAjax/EditPveTeamPostionAmount",
                    data: { taskId: ids, amount: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('数据请求出现异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                layer.close(index);
                                reloadOrderList();
                            }
                        });
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
            });
        });
        var selectTaskId = '';
        var settLayerIndex;
        function changeSetSta(taskId) {
            selectTaskId = taskId;
            form.render('radio');
            settLayerIndex = layer.open({
                title: "更改排团状态",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['40%', '25%'],
                content: $(".setStaDiv")
            }); 
        } 
        form.on('submit(saveSettbtn)', function (data) {
            var sta = data.field.sta;
            if (sta == null || sta == "" || sta == undefined) {
                layer.alert("请选择一种状态！", {
                    title: '提示'
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/UpPveTaskSta",
                data: { taskId: selectTaskId, sta: sta },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(settLayerIndex);
                            reloadOrderList();
                        });
                    }
                    else { 
                        layer.msg(data.msg, { time: 2000 });
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
        var changeDateWindows;
        $(document).on('click', '.changeSdate', function () {
            var taskId = $(this).attr('data-id');
            var yvalue = $(this).attr('data-value');
            currentTaskId = taskId;
            $("#sDate").val('');
            changeDateWindows = layer.open({
                title: "更改排团"+taskId+"的开始时间",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['40%', '45%'],
                content: $(".changeDate")
            });
        });
        $(document).on('click', '.saveChangeDate', function () {
            var sdate = $("#sDate").val();
            var shour = $("#sHour").val();
            var sMin = $("#sMin").val();
            var stime = "";
            if (shour != "") {
                if (!VerifyInt(shour)) {
                    layer.msg('小时请输入整数，不能是负数');
                    return false;
                }
            }
            if (sMin != "") {
                if (!VerifyInt(sMin)) {
                    layer.msg('分钟请输入整数，不能是负数');
                    return false;
                }
            }
            if (sdate != "") {
                if (shour != "") {
                    stime = sdate + " " + shour;
                } 
                if (sMin != "") {
                    stime = stime + ":" + sMin+":00";
                } else {
                    stime = stime + ":00:00";
                }
                if (shour == "" && sMin == "") {
                    stime = sdate + " 00:00:00";
                }
                if (shour == "" && sMin != "") {
                    stime = sdate + " 00:00:00";
                }
                if (shour != "" && sMin == "") {
                    stime = sdate + " " + shour + ":00:00";
                }
            } else {
                stime = ""; 
            }
             
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/PveTaskAjax/ChangeTaskStrartTime",
                data: { taskId: currentTaskId, stime: stime },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.close(changeDateWindows);
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
        $(document).on('click', '.saveConfigBtn', function () {
            var taskSta = $("#taskSta").val();
            var leaderId=formSelects.value('leader', 'valStr');
            var taskSort = $("#taskSort").val();
            var key = $("#key").val();  

            let config = {
                gameId: $("#gameName").val(),
                taskSta: taskSta,
                leaderId: leaderId,
                taskSort: taskSort,
                key: key
            } 
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/UserAjax/SaveTaskListSeachConfigConfig",
                data: { config:JSON.stringify( config) },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true; 
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
        function exportGroupUserRecOrderCountToExecl(val) {
            window.open("/Group/ExportGroupRecUserOrderCountToExeclByIDX?taskIdx=" + val, "_blank");
            return false;
        }
        function upGroupLevelImg() {
        settLayerIndex = layer.open({
            title: "上传统一装等要求图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '85%'],
            content: $(".groupleveldiv")
        }); 
        uploadInst.reload({
            accept: 'images'
            , acceptMime: 'image/*'
            , size: 1024 * 5 //限定大小
            , exts: 'jpg|png|bmp|jpeg'
            , number: 1
        }); 
    }
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); //关闭现有所有弹层
                reloadOrderList();
            }
        };
        window.tools = _tools;
         
});