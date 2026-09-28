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
    var indexLoad;
    var gameName = $("#gameName").find("option:selected").text();
    var currentProjectData = []; 
    var selectJobData = [];
    var isConfigJob = $("#isConfigJob").val();
    var wechatApp = $("#wechatApp").val(); 
    var defGame = $("#defGame").val(); 
    laydate.render({
        elem: '#sDate'
        , type: 'datetime'
    }); 
    if (defGame.indexOf('魔兽')<0) {
        $('.jobDiv').hide();
    }
    getAllUserData();
    function getAllUserData() { 
        $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName + '&selectValue=' + $("#leaderID").val(), function (result) {
            formSelects.data('leader', 'local', {
                arr: result.data
            });
        });
    }
    getGameProject($("#gameName").val());
    function getGameProject(gameId) {
        var currentProject = $("#selectProject").val();
        $.get('/GameAjax/getProject?gameId=' + gameId + '&proJect=' + currentProject, function (result) {
            currentProjectData = result.data;
            formSelects.data('projectSelect', 'local', {
                arr: currentProjectData
            });
            formSelects.value('projectSelect', [currentProject], true);
        });
    }
    form.on('select(selectGame)', function (data) {  
        getGameProject(data.value);
        getAllJob();
        var e = data.elem;
        var gname = e[e.selectedIndex].text; 
        if (gname == "诛仙世界") {
            $(".jobDiv").hide();
        } else {
            $(".jobDiv").show();
        }
        return false;
    }); 
    var JobData = [];
    var gameJobData = ['FS', 'SS', 'DZ', 'LR', 'MS', 'JLM', 'AM', 'NS', 'SM', 'ZQ', 'DH', 'FZ', 'ZS', 'DK', '熊D', 'YD', 'ND', 'WS', 'NQ', 'CJQ','FQ'];
    var currentJobs = [];
    getAllJob();
    function getAllJob() { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: '/GameAjax/getGameData?type=40&parentId=' + $("#gameName").find("option:selected").text(),
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取职业数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true; 
                var jobData = data.data;  
                $(".jobs").html("");
                $(".selectJobRadio").html("");
                html = "";
                $.each(jobData, function (index, item) {
                    let ck = "";
                    for (let i = 0; i < selectJobData.length; i++) {
                        if (item.name == selectJobData[i].name) {
                            ck = 'checked="checked"';
                        }
                    }
                    let tl = item.name; 
                    html += '<input type="checkbox" name="jobList" lay-skin="primary" title="' + tl + '" value="' + item.name + '" jobName="' + item.name + '" lay-filter="jobList" ' + ck + '/>';
                });
                $(".jobs").append(html); 
                html = "";
                $.each(jobData, function (index, item) {
                    let ck = "";
                    for (let i = 0; i < selectJobData.length; i++) {
                        if (item.name == selectJobData[i].name) {
                            ck = 'checked="checked"';
                        }
                    }
                    let tl = item.name;
                    html += '<input type="radio" name="changeJobRadio" title="' + tl + '" value="' + item.name + '" jobName="' + item.name + '" lay-filter="changeJob" ' + ck + '/>';
                });
                $(".selectJobRadio").append(html);
                form.render('checkbox');
                form.render('radio');
                getjobNeed(jobData);
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    loadJobTemplate(0,"可以选择坑位模板");
    form.on('checkbox(jobList)', function (data) {
        var currentJobName = data.value;
        if (data.elem.checked) {
            // 选中 
            // 是否有相同，有则不加
            for (let i = 0; i < selectJobData.length; i++) {
                if (selectJobData[i].jobName == currentJobName) {
                    return false;
                }
            }
            let model = { 
                index: selectJobData.length+1,
                jobName: currentJobName,
                userName: '',
                userId:0,
                postionPrice: 0,
                pid:0,
                remark: '',
                needItemLevel: '',
                gameTf: ''
            };
            selectJobData.push(model); 
            form.render('checkbox');
            reloadTable();
        } else {
            // 取消选中 
            for (let i = 0; i < selectJobData.length; i++) {
                for (let y = 0; y < selectUserData.length; y++) {
                    if (selectUserData[y].userName == selectJobData[i].userName) {
                        selectUserData.splice(y, 1);
                    }
                }
                if (selectJobData[i].jobName == currentJobName) {
                    selectJobData.splice(i, 1);
                }
            } 
            form.render('checkbox'); 
            reloadTable(); 
        }
        if (selectJobData.length > 0) { 
            $(".savetemp").show();
        }
        else {
            $(".savetemp").hide();
        }

    });
    var tableList = table.render({
        elem: '#tableList'
        , height:'full'
        , data: selectJobData
        , defaultToolbar: []
        , cols: [[
            {
                field: 'index', title: '序号', width: 45, align: 'center', sort: false
            }
            ,
            {
                field: 'jobName', title: '坑位职业', width:80, align: 'left', sort: false, templet: function (res) {
                    let vo = '<a href="#" class="selectJobA" style="color:#1E9FFF" data-id="' + res.index + '" lay-tips="点击可以更换职业">' + res.jobName + '</a>';
                    return vo;
                }
            }
            , {
                field: 'needItemLevel', title: '最低装等要求数', width:110, align: 'center', edit: true, templet: function (res) {
                    let vo = '<a class="t2" style="" lay-tips="点击可以编辑数字" href="javascript:void(0)">' + res.needItemLevel + '</a>';
                    return vo;
                }
            }
            , {
                field: 'gameTf', title: '天赋/盟约', width: 90, align: 'center', edit: true, templet: function (res) {
                    let vo = '<a class="t2" style="" lay-tips="点击可以编辑" href="javascript:void(0)">' + (res.gameTf == null || res.gameTf == '' || res.gameTf == undefined ? '' : res.gameTf) + '</a>';
                    return vo;
                }
            }
            , {
                field: 'postionPrice', title: '在小程序上卖价', width:100, align: 'center', edit: true, hide: wechatApp=='Y'?false:true, templet: function (res) {
                    let vo = '<a class="t0" style="color:#F3723A" lay-tips="点击可以直接编辑金额" href="javascript:void(0)">' + res.postionPrice + '</a>';
                    return vo;
                }
            }
            , {
                field: 'remark', title: '职业备注', width:120, align: 'left', edit: true, templet: function (res) {
                    let vo = '<a class="t1" style="color:#F3723A" lay-tips="点击可以直接编辑" href="javascript:void(0)">' + res.remark + '</a>';
                    return vo;
                }
            }
            , {
                field: 'userName', title: '坑位打手', width:100, align: 'center', edit: false, templet: function (res) { 
                    let vo = '<a class="selectUserOpen" style="' + (res.userName == null || res.userName == '' ? 'color:#1E9FFF' : 'color:#5FB878') + '" lay-tips="点击选个打手或换个打手吧" href="javascript:void(0)" data-id="' + res.pid + '" data-index="' + res.index + '" pid="'+res.pid+'" data-username="' + res.userName + '">' + (res.userName == null || res.userName == '' ? '点我选择打手' : res.userName) + '</a>';
                    return vo;
                }
            }
            , { fixed: '', title: '操作', width: 200, toolbar: '#baroperating', unresize: true, }
        ]]
        , page: false,
        limit:selectJobData.length
    });
    function reloadTable() { 
        tableList.reload({
            data: selectJobData
            ,where: {}
          , page: false
            , limit: selectJobData.length
        });
    }
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        var index = data.index;
        var userName = data.userName;
        if (obj.event === 'submitDel') { 
            var removeUserIndex = -1;
            for (let y = 0; y < selectUserData.length; y++) {
                if (selectUserData[y].userName == userName) {
                    removeUserIndex = y;
                }
            }
            for (let i = 0; i < selectJobData.length; i++) {
                if (selectJobData[i].index == index) {
                    selectJobData.splice(i, 1);
                    reloadTable();
                    if (removeUserIndex > -1) {
                        selectUserData.splice(removeUserIndex, 1);
                    }
                }
            }
            for (let i = 0; i < selectJobData.length; i++) {
                selectJobData[i].index = i + 1;
            }
            reloadTable();
            return false;
        } else if (obj.event === 'addpostion') {
            var data = obj.data;
            let model = {
                index: selectJobData.length+1,
                jobName: data.jobName,
                userName: '',
                userId: 0,
                postionPrice: data.postionPrice,
                pid: 0,
                remark: '',
                needItemLevel: data.needItemLevel,
                gameTf: data.gameTf
            };
            selectJobData.push(model); 
            reloadTable();
            return false;
        }
    });
    table.on('edit(tableList)', function (obj) {
        if (obj.field == "postionPrice") {
            if (!VerifyMoeny(obj.value)) {
                layer.msg('金额格式不正确，请重新编辑', { time: 1500 }, function () {
                });
                return false;
            }
            for (let i = 0; i < selectJobData.length; i++)
            { 
                if (selectJobData[i].index === obj.data.index) {
                    selectJobData[i].postionPrice = obj.value;
                    return false;
                }
            }
        }
        else if (obj.field == "needItemLevel") {
            if (!VerifyInt(obj.value)) {
                layer.msg('装备等级数值格式不正确，请输入整数', { time: 1500 }, function () {
                });
                return false;
            }
            for (let i = 0; i < selectJobData.length; i++) {
                if (selectJobData[i].index === obj.data.index) {
                    selectJobData[i].needItemLevel = obj.value == null || obj.value == '' ? 0 : obj.value;
                    return false;
                }
            } 
        }
        else if (obj.field == "gameTf") {
            for (let i = 0; i < selectJobData.length; i++) {
                if (selectJobData[i].index === obj.data.index) {
                    selectJobData[i].gameTf = obj.value;
                    return false;
                }
            }
        }
        else if (obj.field == "remark") {
            for (let i = 0; i < selectJobData.length; i++) {
                if (selectJobData[i].index === obj.data.index) {
                    selectJobData[i].remark = obj.value;
                    return false;
                }
            }
        }
    });
    function getjobNeed(jobData) {
        var taskId = $("#taskId").val();
        if (taskId > 0) {
            $.get('/PveTaskAjax/GetGroupJobNeedList?taskId=' + taskId, function (result) {
                currentJobs = result.msg;
                $.each(currentJobs, function (index, item) {
                    let cb = item;
                    let model = {
                        index:item.index,
                        jobName: item.jobName,
                        userName: item.userName,
                        userId:item.userId,
                        postionPrice: item.postionPrice,
                        pid: item.pid,
                        remark: item.remark,
                        needItemLevel: item.needItemLevel == '0' ? '' : item.needItemLevel,
                        gameTf: item.gameTf
                    };
                    selectJobData.push(model);
                    if (item.userId>0&&item.userName != '' && item.userName != null) {
                        let model = {
                            userId: item.userId,
                            userName: item.userName
                        };
                        selectUserData.push(model);
                    }
                });
                reloadTable();
                if (jobData.length > 0) {
                    $(".jobs").html("");
                    html = "";
                    $.each(jobData, function (index, item) {
                        let ck = "";
                        for (let i = 0; i < currentJobs.length; i++) {
                            if (item.name == currentJobs[i].jobName) {
                                ck = 'checked="checked"';
                            }
                        }
                        let tl = item.name;
                        html += '<input type="checkbox" name="jobList" lay-skin="primary" title="' + tl + '" value="' + item.name + '" jobName="' + item.name + '" lay-filter="jobList" ' + ck + '/>';
                    });
                    $(".jobs").append(html);
                    form.render('checkbox');
                }
            });
        } 
    } 
    form.on('submit(savebtn)', function (data) {         
        var jobConfig = JSON.stringify(selectJobData);
        var project = formSelects.value('projectSelect', 'nameStr');
        var fid = data.field;
        fid.projectSelect = project;
        var strParameter = JSON.stringify(fid);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }  
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/AddEditPveTask",
            data: { param: strParameter, jobConfig: jobConfig, isConfigJob: isConfigJob },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    let taskId = $("#taskId").val();
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (taskId > 0) {                           
                            parent.tools.reloadOrderData();
                        } else {
                            location.reload();
                        } 
                    });
                }
                else {
                    re = true;
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    var userRoleId = $("#defaultJobId").val();
    var selectUserData = [];
    function getAllUser() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: '/UserAjax/GetAllUserTableByGameName',
            data: { gameName: gameName,userRoleId: userRoleId, key: $("#key1").val() },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取用户数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var userData = data.data;
                $(".user").html("");
                html = "";
                $.each(userData, function (index, item) {
                    let ck = "N";
                    for (let i = 0; i < selectUserData.length; i++) {
                        if (item.userName == selectUserData[i].userName) {
                            ck ="Y";
                        }
                    }
                    html += '<div class="layui-input-inline" style="width:185px;" ><a href="#" title="' + item.userName + '（职位：' + item.roleName + '，标记：' + item.tips + '，备注：' + item.remark + '）" style="font-size:14px;' + (ck =="Y"?'color:red':'') + '"><input type="radio"  name="userList" lay-skin="primary" title="' + item.userName + '" value="' + item.id + '" userName="' + item.userName + '" lay-filter="userListFilter"/>' + (item.tips != '' && item.tips != null ? '<span class="layui-badge" title="' + item.tips + '">' + item.tips.substring(0, 1) + '</span>' : '') + '</a></div>';
                });
                $(".user").append(html);
                form.render('radio');
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    } 
    var currentSelectLinePid = 0;
    var currentSelectLineIndex= 0;
    var userLayer;
    $(document).on('click', '.selectUserOpen', function () { 
        currentSelectLinePid = $(this).attr('data-id');
        currentSelectLineIndex = $(this).attr('data-index'); 
        userLayer=layer.open({
            title: "请选择占坑位的打手",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['75%', '85%'],
            content: $(".selectUser")
        }); 
        getAllUser();
        return false;
    });
    form.on('radio(userRole)', function (data) {
        userRoleId = data.value; 
        getAllUser();
    }); 
    form.on('radio(userListFilter)', function (data) {
        var userId = data.value;
        var userName = data.elem.title;
        var ischecked = data.elem.checked;  
        let model = {
            userId: userId,
            userName: userName
        };
        selectUserData.push(model); 
        for (let i = 0; i < selectJobData.length; i++) { 
            if (selectJobData[i].index == currentSelectLineIndex) {
                selectJobData[i].userId = userId;
                selectJobData[i].userName = userName;
                console.log(selectJobData);
                layer.close(userLayer);
                reloadTable();
                return false;
            }
        }
        reloadTable();
       
    });
    $(document).on('click', '.seachBtn', function () {
        getAllUser();
        return false;
    });
    var changeJobPid = 0;
    $(document).on('click', '.selectJobA', function () {
        let id = $(this).attr('data-id');
        changeJobPid = id;
        userLayer = layer.open({
            title: "请选择要更换的职业",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['60%', '30%'],
            content: $(".selectJobDiv")
        }); 
        return false;
    });
    var editTid = 0;
    var editTempTitle = '';
    $(document).on('click', '.savetemp', function () { 
        layer.prompt({ title: '请设置模板名称', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: editTempTitle }, function (value, index, elem) {
            var param = JSON.stringify(selectJobData);
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/SaveTaskNeedJobTemplate",
                data: { title: value, param: param, tid:editTid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () { 
                        });
                        loadJobTemplate(data.code, value);
                    }
                    else {
                        re = true;
                        layer.msg(data.msg, { time: 2000 });
                    }
                    layer.close(index);
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
       
        return false;
    });
    $(document).on('click', '.saveOtherTemp', function () {
        layer.prompt({ title: '请设置新的模板名称', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: '' }, function (value, index, elem) {
            var param = JSON.stringify(selectJobData);
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/SaveTaskNeedJobTemplate",
                data: { title: value, param: param, tid: 0 },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                        });
                        loadJobTemplate(data.code, value);
                    }
                    else {
                        re = true;
                        layer.msg(data.msg, { time: 2000 });
                    }
                    layer.close(index);
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });

        return false;
    });
    function loadJobTemplate(index,nameStr) {
        let tempData = []; 
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/GetTaskNeedJobTemplate",
            data: { },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取已保存的坑位模板'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (index > 0) {
                    editTid = index;
                    editTempTitle = nameStr;
                }
                $("#tempList").empty(); //清空
                var option = '<option value="0">可以选择坑位模板</option>';
                $("#tempList").append(option);
                tempData = data.msg;
                for (let i = 0; i < tempData.length; i++) {
                    let ck = '';
                    if (index > 0) {
                        ck = 'selected=""';
                    }
                    var option = '<option value="' + tempData[i].tid + '"'+ck+'>' + tempData[i].template_Title + '</option>';
                    $("#tempList").append(option);
                }
                form.render('select');
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('select(selectTemp)', function (data) { 
        if (parseInt(data.value) > 0) { 
            editTid = data.value;
            editTempTitle = $("#tempList").find("option:selected").text();
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/GetTaskNeedJobTemplateByTid",
                data: { tid: data.value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        let tempData = data.msg;
                        selectJobData = [];
                        for (let i = 0; i < tempData.length; i++) {
                            let model = {
                                index: tempData[i].index,
                                jobName: tempData[i].jobName,
                                userName: tempData[i].userName,
                                userId: tempData[i].userId,
                                postionPrice: tempData[i].postionPrice,
                                pid:0,
                                remark: tempData[i].remark,
                                needItemLevel: tempData[i].needItemLevel == '0' ? '' : tempData[i].needItemLevel,
                                gameTf: tempData[i].gameTf
                            };
                            selectJobData.push(model);
                        }
                        form.render('checkbox');
                        reloadTable();
                        $(".savetemp").show();
                        $(".saveOtherTemp").show();
                        $(".deltemp").show(); 
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        } else {
            if (selectJobData.length < 1) {
                $(".savetemp").hide();
                $(".saveOtherTemp").hide();
            } 
            $(".deltemp").hide();
        }
       
        return false;
    });
    $(document).on('click', '.deltemp', function () {
        if (editTid < 1) {
            layer.msg('请选择一个模板再删除');
            return false;
        }
        layer.confirm('确认删除该坑位模板吗？警告：一旦删除，将无法找回，请谨慎处理', function () {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/DelTaskNeedJobTemplateByTid",
                data: { tid: editTid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                        });
                        loadJobTemplate();
                    }
                    else {
                        re = true;
                        layer.msg(data.msg, { time: 2000 });
                    } 
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            }, function () {
                
            });
        return false;
    });
    form.on('radio(changeJob)', function (data) {
        var selectJob = data.value;
        for (var i = 0; i < selectJobData.length; i++)
        { 
            if (selectJobData[i].index == changeJobPid) {
                selectJobData[i].jobName = selectJob;
            }
        } 
        reloadTable();
        layer.close(userLayer);
        return false;
    }); 
    $(document).on('click', '.addjobtotable', function () {
        let job = $(this).attr('data-job');
        let tf = $(this).attr('data-tf');
        let model = {
            index: selectJobData.length + 1,
            jobName: job,
            userName: '',
            userId: 0,
            postionPrice: 0,
            pid: 0,
            remark: '',
            needItemLevel: '',
            gameTf: tf
        };
        selectJobData.push(model);
        form.render('checkbox');
        reloadTable();
        if (selectJobData.length > 0) {
            $(".savetemp").show();
        }
        else {
            $(".savetemp").hide();
        }

        return false;
    });     
});