layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    aliossUploader: '/lib/aliossUploader',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'aliossUploader', 'table', 'colorpicker', 'element', 'ClipboardJS','laypage'], function () {
    var j$ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        colorpicker = layui.colorpicker, 
        element = layui.element,
        ClipboardJS = layui.ClipboardJS,
        laypage = layui.laypage,
        laydate = layui.laydate;
    var table = layui.table;
    var aliossUploader = layui.aliossUploader;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var page = 1;
    var orderPage = 1; 
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            getTaskList();
            return false;
        }
    });
    $("#taskName").keypress(function(even) {
        if (even.which == 13) {
            page = 1;
            getTaskList();
            return false;
        }
    });  
    var re = true;
    var selectDate = [0,1];
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var dateStr = '0,1';
    var curtaskId = '';
    laydate.render({
        elem: '#sDate'
        ,type:'datetime'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'datetime'
    }); 
    var tableList = null; 
    var publicTableList;
    var gameName = '魔兽世界';
    getAllUserData();
    getTaskList();
    getGameJob();
    getAllTaskData();
    loadSetPostionOrderList(0);
    function getAllUserData() {
        $.ajax({
            type: "GET",
            url: "/UserAjax/GetAllUserByGameName",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取团长列表'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $("#leader").empty(); //清空
                $(".actrec").empty();
                var option = '<option value="">请选择</option>';
                $("#leader").append(option);
                let tempData = data.data;
                for (let i = 0; i < tempData.length; i++) {
                    var option = '<option value="' + tempData[i].value + '">' + tempData[i].name + '</option>';
                    var option2 = '<option value="' + tempData[i].name + '">' + tempData[i].name + '</option>';
                    $("#leader").append(option);
                    $(".actrec").append(option2);
                }
                form.render('select');
                formSelects.data('taskMangeUid', 'local', {
                    arr: data.data
                });

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('select(selectGame)', function (data) {
        var gameId = data.value; 
        var e = data.elem;
        var gname = e[e.selectedIndex].text;
        gameName = gname;
        return false;
    }); 
   
    function getGameJob() {
        formSelects.data('gameJob', 'server', {
            url: '/GameAjax/getGameData?type=40&parentId=魔兽世界',
        });
    }
    function getAllTaskData() {
        var listData = [];
        //console.log(status);
        $.get('/PveTaskAjax/GetAllTaskSelectListData?gameId=' + $("#gameId").val() + '&status=0', function (result) {
            listData = result.data;
            formSelects.data('taskSelect', 'local', {
                arr: listData
            });
        });
    }
    function getCurrentWeekDayGrapJobData() {
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/GetCurrentWeekDayTaskGrapNeedJob",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {},
            beforeSend: function (XMLHttpRequest) {},
            success: function (data) {
                $(".qjob").empty();
                let html = '<p>本次搜索的缺口：</p>';
                if (data.msg != '' && data.msg != null) {
                    let tempStr = data.msg.split('~');
                    for (let i = 0; i < tempStr.length; i++) {
                        html += '<p>' + tempStr[i] + '</p>';
                    }
                }
                $(".qjob").html(html);
            },
            complete: function (XMLHttpRequest) {               
            }
        });
        return false;
    }
    var seachParam = 'stime=' + sDate + '&etime=' + eDate;    
    table.on('toolbar(orderList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
        };
    });
    function reloadOrderList() {
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();  
        var gameServer = $("#gameServer").val();
        var gameJob = formSelects.value('gameJob', 'nameStr');
        var groupName = $("#gameGroup_order").val();
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var orderSta = $("#orderSta").val();
        var skey1 = $("#key1").val();
        var skey2 = $("#project").val();
        var info1 = $("#gameZhuang").val();
        var info2 = $("#gameTF").val();
        var taskId = formSelects.value('taskSelect', 'valStr');
        seachParam = 'gameName=' + gameName +'&stime=' + sDate + '&etime=' + eDate + '&gameServer=' + gameServer + '&gameJob=' + gameJob + '&groupName=' + groupName + '&orderSta=' + orderSta + '&key1=' + skey1
            + '&key2=' + skey2 + '&info1=' + info1 + '&info2=' + info2 + '&taskId=' + taskId + '&orderSoure=' + orderSoure; 
        tableList.reload({ 
            url: '/PveTaskAjax/GetNewsGroupOrderList?' + seachParam
            , where: {
            }
            , page: true
        });
        return false;
    }
    function reloadPublicList() {       
        publicTableList.reload({
            data: publicList
            , where: {
            }
            , page:false
        });
        return false;
    }
    form.on('submit(orderSeachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    form.on('submit(taskSeachBtn)', function (data) {
        page = 1;
        getTaskList();
        return false;
    });
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
        if (selectDate.length < 1) {
            $('#thisWeek').prop("checked", true);
            form.render('checkbox');
            selectDate.push(0);
        }
        var dStr = selectDate.join(',');       
        dateStr = dStr;
        getTaskList();
    });
    form.on('submit(selectDicbtn)', function (data) {
        var content = data.field.selectContent;
        var selectaction = data.field.selectaction;
        if (content == '' || content == null || content == undefined || content.length < 10) {
            layer.alert('请粘贴从EXCEL表中复制的排团数据到上面的大框框里');
            return false;
        }
        if (selectaction == undefined || selectaction == null) {
            layer.alert('请选择要识别的动作');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/DisSelectFileToGroup",
            data: { taskId: curtaskId, content: content, action: selectaction },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.alert(data.msg, function (ld) {
                        reloadOrderList();
                        layer.close(ld);
                        layer.close(userLayer);
                    });
                }
                else {
                    layer.alert(data.msg);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    var gameTeamListPos = [];
    var publicList = [];
    var limit = 8;

    function loadPage(count) {
        laypage.render({
            elem: 'pagediv'
            , count: count
            , limit: limit
            , limits: [2,4,6,8,10]
            , theme: '#FF5722'
            , jump: function (obj, first) {
                page = obj.curr;
                limit = obj.limit;
                //首次不执行
                if (!first) {
                    getTaskList();
                }
            }
        });
    }
    function getTaskList() {
        var leader = $("#leader").val();
        var leaderId = leader == null || leader == '' || leader == undefined ? 0 : leader;
        var key = $("#taskName").val();
        var groupName = $("#gameGroup_group").val();
        var groupSta = formSelects.value('groupSta', 'valStr');
        var taskSort = $("#taskSort").val();
        var gameId = $("#gameName").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: '/PveTaskAjax/GetNewsGroupList',
            data: { gameId: gameId, leaderId: leaderId, key: key, groupName: groupName, taskStatus: groupSta, orderBy: taskSort, date: dateStr, page: page, limit: limit},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取排团数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (page == 1) {
                    loadPage(data.count);
                }
                gameTeamListPos = [];
                re = true;
                var taskData = data.data;
                $(".taskList").html("");
                $(".taskTotal").html("【搜索统计】本次搜索条件下共计" + data.count + '个排团');
                let html = "";
                $.each(taskData, function (index, item) {
                    html += '<div class="layui-card task_item">';
                    let bg = "display:flex;flex-direction:row;justify-content:space-between;background-color:#fff";
                    if (item[0].taskColorValue != '' && item[0].taskColorValue != null) {
                        bg = "display:flex;flex-direction:row;justify-content:space-between;background-color:" + item[0].taskColorValue;
                    }
                    html += '<div class="layui-card-header taskHeader_' + item[0].taskId + '" style="' + bg + '">';
                    html += '<div class="edittask" lay-tips="点击我就能修改" data-taskdate="' + item[0].startTime + '" data-taskid="' + item[0].taskId + '" data-taskname="' + item[0].taskName + '" data-taskremark="' + item[0].taskRemark + '" data-taskgroup="' + item[0].taskGameGroup + '" data-project="' + item[0].proJect + '" data-taskMangeUid="' + item[0].leaderID + '" data-gameServer="' + item[0].gameServer + '" style="cursor:pointer">';
                    html += '<span style="color:#2F4056;font-weight:600;">【';
                    html += '<a href="javascript:void(0)" lay-tips="开团日期" style="color:#2F4056">' + item[0].startTimeStr + ' ' + item[0].startTimeWeek+ '</a>';
                    html += '】</span>';
                    html += '<span style="color:#2F4056;font-weight:600;margin-right:5px">' + item[0].taskId+'号团</span>';
                    html += '<a href="javascript:void(0)" lay-filter="taskselectgroup_' + item[0].taskId + '" style="color:' + (item[0].taskGameGroup == '联盟' || item[0].taskGameGroup.toLowerCase() == 'lm' ? "#1E9FFF" : "#FF5722") + ';font-weight:600">' + item[0].taskGameGroup + '</a>';
                    html += ' <span style="color:#2F4056;font-weight:600;">' + item[0].gameServer+' '+item[0].taskName + '--' + item[0].proJect + '--' + item[0].taskRemark + '</span>';
                    html += '</div>';
                    html += '<div class="rightDiv">';                    
                    let ts_vo = '<span class="layui-badge layui-bg-gray setStatusBtn" data-taskid="' + item[0].taskId + '" style="margin-right:10px;cursor:pointer;" lay-tips="点击可以更改该排团里所有订单的状态">未开始</span>';
                    if (item[0].taskStatus == 'B') {
                        ts_vo = '<span class="layui-badge setStatusBtn" data-taskid="' + item[0].taskId + '" style="margin-right:10px;cursor:pointer;" lay-tips="点击可以更改该排团里所有订单的状态">打团中</span>';
                    }
                    else if (item[0].taskStatus == 'C') {
                        ts_vo = '<span class="layui-badge layui-bg-blue setStatusBtn" data-taskid="' + item[0].taskId + '" style="margin-right:10px;cursor:pointer;" lay-tips="点击可以更改该排团里所有订单的状态">已打完</span>';
                    }
                    else if (item[0].taskStatus == 'D') {
                        ts_vo = '<span class="layui-badge layui-bg-orange setStatusBtn" data-taskid="' + item[0].taskId + '" style="margin-right:10px;cursor:pointer;" lay-tips="点击可以更改该排团里所有订单的状态">已暂停</span>';
                    }
                    html += ts_vo;
                    html += '<span id="taskColor_' + item[0].taskId +'" style="margin-right:10px;"></span>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="layui-card-body gameTeamList">';
                    html += '<table class="layui-table datatable" id="datatable" style="table-layout:fixed;" lay-filter="taskTable_' + item[0].taskId + '" data-taskId="' + item[0].taskId +'">';
                     
                    html += '<thead>';
                    html += '<tr style="color:#333">';
                    html += '<th lay-data="{field:\'customizeOrderBy\',width:40,align: \'center\'}">排序</th>';
                    html += '<th lay-data="{field:\'recUser\',align: \'center\',width:75}">打手</th>';
                    html += '<th lay-data="{field:\'gameRoleName\',minWidth:85}">角色名</th>';
                    html += '<th lay-data="{field:\'gameJob\',align: \'center\',width:60}">职业</th>';
                    html += '<th lay-data="{field:\'taskGameGroup\',align: \'center\',width:43}">阵营</th>';
                    html += '<th lay-data="{field:\'itemRemark\',align: \'center\',width:65}">装等要求</th>';
                    html += '<th lay-data="{field:\'otherRemark\',align: \'center\',width:65}">天赋盟约</th>';
                    html += '<th lay-data="{field:\'dlProject\',minWidth:100}">项目要求</th>';
                    html += '<th lay-data="{field:\'remark\',minWidth:70}">订单备注</th>';
                    html += '<th lay-data="{field:\'orderTips\',width:50,edit:false}">坑备注</th>';
                    html += '<th lay-data="{field:\'cc\',align: \'center\',width:90}">操作</th>';
                    html += '<th lay-data="{field:\'tt\',align: \'center\',width:40}">拖曳</th>';
                    html += '<th lay-data="{field:\'gameAccId\',width:1,hide:true}"></th>';
                    html += '<th lay-data="{field:\'pid\',width:1,hide:true}"></th>';
                    html += '</tr>';
                    html += '</thead>';

                    html += '<tbody id="orderListBody">';  
                    let postionCount = 0;
                    let postionCountWait = 0;
                    let postionCountHave = 0;
                    let gapList = [];
                    let thisTaskPublicJobCount = 0;
                    for (let i = 0; i < item.length; i++) {
                        let res = item[i];
                        if (res.pid == 0 && res.taskAccLogId == 0) {
                            continue;
                        }
                        if (res.isPublic == 'Y') {
                            thisTaskPublicJobCount++;
                        }
                        if (res.pid > 0) {
                            gapList.push(res.gameJob);
                        }
                        html += '<tr style="color:#666;font-size:12px">';
                        let recSpan = '';
                        let roleSpan = '';
                        if (res.pid > 0) {
                            recSpan = '<a href="javascript:void(0)" class="lableb postionAssUser" style="background-color:' + (res.recUser == null || res.recUser == '' ? '#ccc' : '#1E9FFF;') + '" data-id="' + res.pid + '" data-user="' + res.recUser + '" lay-tips="' + (res.recUser == '' || res.recUser == null ? '该坑位还未指定打手，点击可指定打手' : '该坑位打手：' + res.recUser) + '">' + (res.recUser == '' || res.recUser == null ? '暂无打手' : res.recUser) + '</a>';
                        } else {
                            if (res.orderId != '') {
                                recSpan = '<a href="javascript:void(0)" class="lableb zhipai" style="background-color:' + (res.recUser != '' ? '#1E9FFF' : '#CCD5DB') + ';" data-id="' + res.orderId + '" data-taskId="' + item[i].taskId + '" data-accType="' + res.accType + '" lay-tips="' + (res.recUser == '' ? '当前暂无接手人，点击可快速指派接手人' : '当前接手人：' + res.recUser) + '">' + (res.recUser == '' ? '暂无接手' : res.recUser) + '</a>';
                            }
                            else {
                                recSpan = '<a href="javascript:void(0)" class="lableb zhipai" style="background-color:' + (res.recUser != '' ? '#1E9FFF' : '#CCD5DB') + ';" data-id="' + res.gameAccId + '" data-accType="' + res.accType + '" lay-tips="' + (res.recUser == '' ? '当前暂无接手人，点击可快速指派接手人' : '当前接手人：' + res.recUser) + '">' + (res.recUser == '' ? '暂无接手' : res.recUser) + '</a>';
                            }
                        } 
                        
                        let roleSpanDeta = '';
                        if (res.accType == 'B') {
                            roleSpanDeta = '<a href="javascript:void(0);" class="orderdetails" style="color:#1E9FFF" lay-tips="点击可以进入订单详情" data-id="' + res.orderId + '">' + (res.gameRoleName == null || res.gameRoleName == '' ? '无' : res.gameRoleName) + '</a>';
                        }
                        else {
                            if (res.gameAccId > 0) {
                                roleSpanDeta = '<a href="javascript:void(0);" class="viewAccDetails" style="color:#1E9FFF" lay-tips="点击可以进入账号详情" data-id="' + res.gameAccId + '">' + (res.gameRoleName == null || res.gameRoleName == '' ? '无' : res.gameRoleName) + '</a>';
                            }
                         } 
                        
                        roleSpan = roleSpanDeta;

                        let accType = 0; 
                        if (res.pid > 0 && res.gameAccId == 0) {
                            accType = 1;
                        }

                        html += '<td><a href="javascript:void(0);" lay-tips="点击可以更改此坑位顺序" class="changeGroupPistionOrderBy" data-accType="' + accType + '" data-ids="' + (res.pid > 0 && res.gameAccId == 0 ? res.pid : res.taskAccLogId) + '" data-by="' + item[i].customizeOrderBy + '">' + item[i].customizeOrderBy + '</a></td>';
                        html += '<td>' + recSpan + '</td>';
                        html += '<td>' + roleSpan + '</td>';
                        html += '<td>' + item[i].gameJob + '</td>';
                        let groupSpan = '';
                        let _gameGroup = res.gameGroup;
                        if (res.pid>0) {
                            _gameGroup = res.taskGameGroup;
                        }
                        if (_gameGroup == '联盟' || _gameGroup.toLowerCase() == 'lm') {
                            groupSpan = '<span style="color:#1E9FFF">联盟</span>';
                        }
                        else if (_gameGroup == '部落' || _gameGroup.toLowerCase() == 'bl') {
                            groupSpan = '<span style="color:#FF5722">部落</span>';
                        } else {
                            groupSpan = '<span style="color:#333">' + _gameGroup+'</span>';
                        }                        
                        html += '<td>' + groupSpan + '</td>';
                        html += '<td><a href="javascript:void(0);" lay-tips="' + (res.itemRemark == '' ? '0' : res.itemRemark) + (res.pid > 0 ? '，点击可以编辑装等要求' : '') + '" data-pid="' + res.pid + '" class="changeItemlevel" data-action="10">' + (res.itemRemark == '' ? '0' : res.itemRemark) + '</a></td>';
                        html += '<td><a href="javascript:void(0);" lay-tips="' + (res.otherRemark == '' ? '无要求' : res.otherRemark) + (res.pid > 0 ? '，点击可以编辑天赋/其它要求' : '') + '" data-pid="' + res.pid + '" class="changeItemlevel" data-action="20">' + (res.otherRemark == '' ? '无要求' : res.otherRemark) + '</a></td>';
                        html += '<td><span lay-tips="' + item[i].dlProject + '">' + item[i].dlProject+'</span></td>';
                        html += '<td><span lay-tips="' + item[i].remark + '">' + item[i].remark + '</span></td>';
                        html += '<td><a href="javascript:void(0);" class="editOrderTips" style="color:#FF534D" lay-tips="' + item[i].orderTips + '，单击可以直接编辑" data-taskId="' + item[i].taskId+'" data-id="' + res.gameAccId + '" data-group="' + res.orderTips + '" data-pid="' + res.pid + '">' + (res.orderTips == null || res.orderTips == '' ? '无' : res.orderTips) + '</a></td>';

                        let btn1Span = '';
                        let btn2Span = '';
                        if (item[i].taskAccLogId > 0) {
                            btn1Span = '<a class="layui-btn layui-btn-xs layui-btn-warm replacePostion" data-accLogId="' + item[i].taskAccLogId + '" data-taskId="' + item[i].taskId + '" data-gameJob="' + item[i].gameJob + '" data-accId="' + item[i].gameAccId + '" data-rec="' + (res.recUser == '' || res.recUser == null ? "" : res.recUser) + '" lay-tips="重新选一笔订单换到这个坑位">重配</a>';
                        } else {
                            btn1Span = '<a class="layui-btn layui-btn-xs layui-btn-normal setPostion" lay-tips="点击后可以选一笔订单配给这个坑位" data-taskId="' + item[i].taskId + '" data-pid="' + item[i].pid + '" data-gameJob="' + item[i].gameJob + '" data-rec="' + (res.recUser == '' || res.recUser == null ? "" : res.recUser) + '">配号</a>';
                        }

                        let ids = res.gameAccId;
                        if (res.pid > 0 && res.gameAccId == 0) { 
                            ids = res.pid;
                        }
                        btn2Span = '<a href="#" class="layui-btn layui-btn-danger layui-btn-xs delPostion" data-type="' + accType + '" data-taskId="' + item[i].taskId + '" data-id="' + ids + '" lay-tips="' + (res.pid>0?"把这个坑位删除掉":"把这笔订单从该团里移出，并且删除坑位") + '">移除</a>';
                        html += '<td>' + btn1Span + btn2Span + '</td>';
                        html += '<td><div class="layui-btn layui-btn-xs tragBtn"  data-alldata="' + encodeURI(JSON.stringify(item[i]))+'" lay-tips="按住鼠标不放可以拖动这个坑位与其它坑位互换拉置">拖</div></td>';
                        html += '<td>' + res.gameAccId + '</td>';
                       html += '<td>' + res.pid + '</td>';
                        html += '</tr>';
                        postionCount++;
                        if (res.taskAccLogId > 0) {
                            postionCountHave++;
                        }
                        if (res.pid > 0) {
                            postionCountWait++;
                        }
                    }
                    html += '</tbody>';
                    html += '</table>';
                    html += '<script type="text/html" id="toolbarDemo_taskList_' + item[0].taskId+'">';
                    html += '<div class="layui-btn-container">';
                    html += '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="changePostinBtn" type="button" lay-tips="添加、编辑、删除这个排团的坑位">配置此团坑位</button>';
                    html += '<button class="layui-btn layui-btn-xs" lay-event="addOrderToPostinBtn" type="button" lay-tips="从订单池里找一笔订单加到这个团里">加号进来</button>';
                    html += '<button class="layui-btn layui-btn-xs" lay-event="setStatusBtn" type="button" lay-tips="更改这个排团里所有订单的状态">更改状态</button>';
                    html += '<button class="layui-btn layui-btn-xs" lay-event="copyTaskToNewBtn" type="button" lay-tips="复制该团的结构（坑位、打手、坑位顺序）为新的排团">复制为新团</button>';
                    html += '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="autoMatchOrderBtb" type="button" lay-tips="交由系统根据设定的参数自动帮你从当前系统订单池里匹配合适的号">自动排团</button>';
                    html +='<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="selectByFile" type="button" lay-tips="可以识别你从EXCEL表里选定区域复制出来的排团数据，用来快速指派打手或关联订单"><i class="layui-icon layui-shanchu"></i>导入从表格选定的排团数据</button>'
                    let fullContent = item[0].taskName + ' ' + item[0].gameServer + ' ' + (item[0].taskGameGroup == '' || item[0].taskGameGroup == '全部' ? '' : item[0].taskGameGroup) + ' 缺口：' + item[0].thisTaskGapStr;
                    html += '<div class="layui-btn layui-btn-xs copygrap" lay-tips="点击后由系统帮你生成本团的缺口文案方便拿去发广告" data-clipboard-text="' + fullContent + '">复制团缺口</div>';
                    html += '<div class="layui-btn layui-btn-xs" lay-event="changeTaskOrderBy"  lay-tips="更改本该的排团值，可以影响该排序的展示位置">更改排序</div>';
                    html += '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="publicNeedJob" type="button" lay-tips="在平台魔兽生态圈里公开本团的缺口位置或者修改公开坑位，其他系统用户都能看到公开的缺口坑位' + (thisTaskPublicJobCount > 0 ? '，目前该团已公开了' + thisTaskPublicJobCount + '个坑位' : '') + '">公开缺口' + (thisTaskPublicJobCount > 0 ? '(' + thisTaskPublicJobCount + ')' : '') + '</button>';
                    html += '<button class="layui-btn layui-btn-xs" lay-event="exportTask" type="button" lay-tips="导出这个排团里已分配的号">导出</button>';
                    html += '<button class="layui-btn layui-btn-xs" lay-event="delTask" type="button" lay-tips="删除这个排团">删除</button>';
                    html += '</div>';
                    html += '<div style="color:#ff6a00" id="task_total_' + item[0].taskId + '">本团共计' + postionCount + '个坑位，其中有' + postionCountHave + '个坑位已配号，还剩下' + postionCountWait + '个坑位等待配号，本团缺口：' + item[0].thisTaskGapStr + '</div>';
                    html += '</script>';
                    html += '</div>';
                    html += '</div>';
                });
                $(".taskList").append(html); 
                $.each(taskData, function (index, item) {
                    table.init('taskTable_' + item[0].taskId, { 
                        limit: 50
                        , id: item[0].taskId
                        , page: false
                        , escape: false
                        , toolbar: '#toolbarDemo_taskList_' + item[0].taskId
                        , defaultToolbar: []
                        , text: {
                            none: '此团暂无配号'
                        }
                        , done: function () {
                            var list = $('.gameTeamList').eq(index);
                            var _top = list.offset().top ;
                            var _left = list.offset().left
                            gameTeamListPos.push({
                                start: _top,
                                end: _top + list.height(),
                                left: _left,
                                right: list.width() + _left
                            });
                        }
                    });
                    table.on('toolbar(taskTable_' + item[0].taskId + ')', function (obj) {
                        var checkStatus = table.checkStatus(obj.config.id);
                        let taskId = item[0].taskId;
                        curtaskId = item[0].taskId;
                        switch (obj.event) {
                            case 'refresh':
                                //reloadOrderList();
                                break;
                            case 'addOrderToPostinBtn':
                                currentTaskId = taskId;
                                formSelects.value('taskSelect', [10]);

                                formSelects.value('gameJob', []);
                                form.val("fm1", {
                                    "gameServer": ''
                                    , "key1": ''
                                    , "gameZhuang": ''
                                    , "gameTF": ''
                                    , "project": ''
                                });
                                $("#orderSta").val('');
                                $("#gameGroup_order").val('');

                                currentSetReplaceTag = 30;
                                reloadOrderList();
                                getAllOrderSoure(); 

                                userLayer = layer.open({
                                    title: "找一笔订单加到" + taskId + "团里",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 5,
                                    area: ['1080px', '95%'],
                                    content: $(".orderDiv"),
                                    end: function (res) {
                                        $('.orderDiv').hide();
                                    }
                                });
                                break; 
                            case 'changePostinBtn': 
                               let edLayer= layer.open({
                                    title: "编辑" + taskId + "团的现有坑位及人员配置",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    maxmin: false,
                                    type: 2,
                                    skin: 'layui-layer-lan',
                                    anim: 8,
                                    area: ['890px', '95%'],
                                   content: 'AddEditGroup?taskId=' + taskId + '&isConfigJob=Y',
                                   end: function (res) {
                                       layer.close(edLayer);
                                   }
                                });
                                break;
                            case 'selectByFile':
                                form.val('fm1', {
                                    'selectContent': ''
                                })
                                form.render();

                              userLayer = layer.open({
                                    title: "请按要求识别",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 5,
                                    area: ['980px', '95%'],
                                  content: $(".selectFileDiv"),
                                  end: function (res) {
                                      $('.selectFileDiv').hide();
                                  }
                                });
                                break;
                            case 'setStatusBtn':
                                currentTaskId = taskId;
                                $("input[type='radio'][name*='taskStaSet']").prop("checked", false);
                                form.render('radio');
                                currentLayer = layer.open({
                                    title: '更改'+taskId+'团状态',
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 5,
                                    area: ['780px', '280px'],
                                    content: $(".setStaDiv"),
                                    end: function (res) {
                                        $('.setStaDiv').hide();
                                    }
                                }); 
                                break;
                            case 'copyTaskToNewBtn':
                                currentTaskId = taskId;
                                form.val("fm1", {
                                    "edit_taskName":''
                                    , "edit_group": ''
                                    , "edit_taskRemark": ''
                                    , "edit_taskdate": ''
                                    , "edit_taskProject": ''
                                    , "edit_gameServer": ''
                                });
                                laydate.render({
                                    elem: '#edit_taskdate'
                                    , format: 'yyyy-MM-dd'
                                    , done: function (value, date, endDate) {
                                    }
                                });
                                $("#edit_save").hide();
                                $("#edit_save2").show();
                                currentLayer = layer.open({
                                    title: "复制成新团，请给新团设置名称等参数",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 8,
                                    area: ['680px', '480px'],
                                    content: $('.edittaskmain'),
                                    end: function (res) {
                                        $('.edittaskmain').hide();
                                    }
                                });
                                break;
                            case 'autoMatchOrderBtb':
                                currentTaskId = taskId;
                                element.progress('pr', '0%');
                                form.val("fm1", {
                                    "match_server": item[0].gameServer == '' || item[0].gameServer == null ? '' : item[0].gameServer
                                    , "match_project": ''
                                    , "match_AddOrderDate": ''
                                    ,'match_sameonetips':''
                                });
                                $("#match_gameGroup").val(item[0].taskGameGroup == '' || item[0].taskGameGroup == null ? '全部' : item[0].taskGameGroup);
                                form.render('select');
                                laydate.render({
                                    elem: '#match_AddOrderDate'
                                    , format: 'yyyy-MM-dd'
                                    , range: '至'
                                    , min: -180
                                    , max: 1
                                    , trigger: 'click'
                                });                              
                                currentLayer = layer.open({
                                    title: "请设定自动匹配参数",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 8,
                                    area: ['980px', '580px'],
                                    content: $('.automatchlayer'),
                                    end: function (res) {
                                        $('.automatchlayer').hide();
                                    }
                                });
                                break;
                            case 'changeTaskOrderBy':
                                currentTaskId = taskId;
                                changeTaskOrderBy(taskId)
                                break;
                            case 'exportTask':
                                exportTaskAcc(taskId);
                                break;
                            case 'delTask':
                                layer.confirm('确认要删除这个排团吗？删除排团后，与该排团相关的订单将全部解除关联', {
                                    btn: ['确定删除', '点错了']
                                }, function (yindex) {
                                        delTask(taskId);
                                        layer.close(yindex);
                                });
                                break;
                            case 'publicNeedJob':
                                currentTaskId = taskId;
                                publicList = [];
                                for (let i = 0; i < item.length; i++) {
                                    let line = item[i];
                                    if (line.pid > 0) {
                                        publicList.push(line);
                                    }                                    
                                }
                                publicTableList=table.render({
                                    elem: '#tableList_public'
                                    , height: 'full'
                                    , data: publicList
                                    , defaultToolbar: []          
                                    , cols: [[                          
                                        {
                                            field: 'gameJob', title: '职业', width: 80, align: 'left', sort: false
                                        }
                                        , {
                                            field: 'itemRemark', title: '装等要求', width: 80, align: 'center'
                                        }
                                        , {
                                            field: 'otherRemark', title: '天赋/盟约', width: 90, align: 'center'
                                        }
                                        , {
                                            field: 'orderTips', title: '坑位备注', width: 140, align: 'left', edit: true, templet: function (res) {
                                                let vo = '<a class="t1" style="color:#F3723A" lay-tips="坑位备注点击可以直接编辑" href="javascript:void(0)">' + res.orderTips + '</a>';
                                                return vo;
                                            }
                                        }
                                        , {
                                            field: 'isPublic', title: '是否已公开', width: 80, align: 'center', templet: function (res) {
                                                let vo = res.isPublic == 'Y' ? '<span class="layui-badge layui-bg-blue">是</span>' : '<span class="layui-badge layui-bg-gray">否</span>';
                                                return vo;
                                            }
                                        }
                                        , { fixed: '', title: '操作', width: 60, toolbar: '#baroperating_public', unresize: true, }
                                    ]]
                                    , page: false,
                                    limit: publicList.length
                                });
                                form.val("fm1", {
                                    "public_title": item[0].taskName
                                    , "public_taskdate": item[0].startTime == '时间待定' ? '' : item[0].startTime
                                });
                                laydate.render({
                                    elem: '#public_taskdate'
                                    , format: 'yyyy-MM-dd'
                                    , done: function (value, date, endDate) {
                                    }
                                });
                                //form.render('select');                               
                                currentLayer = layer.open({
                                    title: "请安排好要公开的坑位",
                                    shade: [0.3, '#333'],
                                    shadeClose: true,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 8,
                                    area: ['560px', '90%'],
                                    content: $('.publicPostionLayer'),
                                    end: function (res) {
                                        $('.publicPostionLayer').hide();
                                    }
                                });
                                break; 
                                
                        };
                    });
                    colorpicker.render({
                        elem: '#taskColor_' + item[0].taskId
                        , color: '#2ec770'
                        , done: function (color) {  
                            color || this.change(color);
                            setTaskColorValue(item[0].taskId, color);
                        }
                        , change: function (color) {
                            $('.taskHeader_' + item[0].taskId).css('background-color', color);
                        }
                    });
                });
                getCurrentWeekDayGrapJobData();  
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    } 
    var currentTaskId = 0; 
    var currentLayer;
    var currentSetPotionPid = 0;
    var currentSetPotionAccLogId = 0;
    var currentSetPotionJob = '';
    var currentSetReplaceTag = 0;
    var currentPotionJobRec = '';
    table.on('edit(tableList_public)', function (obj) {
        if (obj.field == "orderTips") {           
            for (let i = 0; i < publicList.length; i++) {
                if (publicList[i].pid === obj.data.pid) {
                    publicList[i].orderTips = obj.value;
                    return false;
                }
            }
        }
    });
    table.on('tool(tableList_public)', function (obj) {
        var data = obj.data;
        var pid = data.pid;
        let removeUserInde = -1;
        if (obj.event === 'removePublicPostion') {            
            for (let y = 0; y < publicList.length; y++) {
                if (publicList[y].pid == pid) {
                    publicList.splice(y, 1);
                }
            }
            reloadPublicList();
            return false;
        }
    });
    $(document).on('click', '.edittask', function () {
        var taskid = $(this).attr('data-taskid');
        var taskname = $(this).attr('data-taskname');
        var taskremark = $(this).attr('data-taskremark');
        var taskgroup = $(this).attr('data-taskgroup');
        var taskdate = $(this).attr('data-taskdate'); 
        var taskleaderID = $(this).attr('data-taskMangeUid'); 
        if (taskdate == '时间待定') {
            taskdate = '';
        }
        var proJect = $(this).attr('data-proJect');
        var gameServer = $(this).attr('data-gameServer'); 
        currentTaskId = taskid;       
        form.val("fm1", {
            "edit_taskName": taskname
            , "edit_group": taskgroup
            , "edit_taskRemark": taskremark
            , "edit_taskdate": taskdate
            , "edit_taskProject": proJect
            , "edit_gameServer": gameServer
            , 'taskMangeUid': taskleaderID

        });       
        formSelects.value('taskMangeUid', [taskleaderID]);        
        laydate.render({
            elem: '#edit_taskdate'
            , format: 'yyyy-MM-dd'
            , done: function (value, date, endDate) {
              
            }
        });
        $("#edit_save2").hide();
        $("#edit_save").show();
      currentLayer=layer.open({
            title: "编辑排团：" + taskname+"，编号："+ taskid,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['680px', '550px'],
          content: $('.edittaskmain'),
          end: function (res) {
              $('.edittaskmain').hide();
          }
        });
    });  
    $(document).on('click', '.delPostion', function () {
        var ids = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        let taskId = $(this).attr('data-taskId');
        if (type == 0) {
            delAccByTask(taskId,ids);
        }
        else {
            delGroupNeedJobByPid(ids);
        }
    });
    function changeTaskOrderBy(taskId) {
        layer.prompt({ title: '设置本团排序(数据越大越排在前面，默认请填0)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: 0, maxlength: 4 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/ChangeTaskOrderBy",
                data: { taskId: taskId, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1500 });
                        layer.close(index);
                        getTaskList();
                    }
                    else {
                        layer.alert(data.msg);
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
    }
    function delAccByTask(taskId,accId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/DelGroupAccByTaskIDAccId",
            data: { taskId: taskId, accId: accId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        getTaskList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    function delGroupNeedJobByPid(pid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/DelGroupNeedJobByPid",
            data: { pid: pid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        getTaskList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    var userRoleId = $("#defaultJobId").val();
    var userLayer;
    var selectChangeRecPid = 0;
    $(document).on('click', '.postionAssUser', function () {
        var pid = $(this).attr('data-id');
        selectChangeRecPid = pid;
        getAllUser();
        userLayer = layer.open({
            title: "请选择这个坑位的打手",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['85%', '85%'],
            content: $(".selectUser"),
            end: function (res) {
                $('.selectUser').hide();
            }
        });
        return false;
    });
    $(document).on('click', '.zhipai', function () {
        var orderID = $(this).attr('data-id');
        var tid = $(this).attr('data-taskId');   
        var taskNeedJobId=$(this).attr('data-pid');
        setRecOrder(orderID, tid, taskNeedJobId);
    });
    function setRecOrder(orderID, tid, taskNeedJobId) {
        if (orderID == null || orderID == '') {
            return false;
        }
       let tempLayer= layer.open({
            title: "订单指派给打手",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '95%'],
           content: '/Order/Assignation?orderId=' + orderID + '&taskId=' + tid + '&taskNeedJobId=' + taskNeedJobId,
           end: function (res) {
               layer.close(tempLayer);
            }
        });
    } 
    form.on('radio(userRole)', function (data) {
        userRoleId = data.value;
        getAllUser();
    });
    function getAllUser() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: '/UserAjax/GetAllUserTableByGameName',
            data: { gameName: '魔兽世界', userRoleId: userRoleId, key: $("#seachUser_key1").val() },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取用户数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var userData = data.data;
                $(".seachUser_user").html("");
                html = "";
                $.each(userData, function (index, item) {
                    html += '<div class="layui-input-inline" style="width:185px;" ><a href="#" title="' + item.userName + '（职位：' + item.roleName + '，标记：' + item.tips + '，备注：' + item.remark + '）" style="font-size:14px;"><input type="radio"  name="userList" lay-skin="primary" title="' + item.userName + '" value="' + item.id + '" userName="' + item.userName + '" lay-filter="userListFilter"/>' + (item.tips != '' && item.tips != null ? '<span class="layui-badge" title="' + item.tips + '">' + item.tips.substring(0, 1) + '</span>' : '') + '</a></div>';
                });
                $(".seachUser_user").append(html);
                form.render('radio');
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    form.on('radio(userListFilter)', function (data) {
        let  userId = data.value;
        layer.close(userLayer);
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/ChangeTaskNeedJobRecUser",
            data: { pid: selectChangeRecPid, userId: userId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {                
                layer.msg(data.msg, { time: 500 }, function () {
                    if (data.code > 0) {
                        getTaskList();
                    }
                });
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    $(document).on('click', '.seachUserBtn', function () {
        getAllUser();
        return false;
    });
    $(document).on('click', '.orderdetails', function () {
        var ids = $(this).attr('data-id');
        viewOrderDetails(ids);
    });
    function viewOrderDetails(orderid) {
        let tempLayer=layer.open({
            title: "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['1020px', '92%'],
            content: '/Order/OrderView?orderId=' + orderid + '&viewType=20',
            end: function (res) {
                layer.close(tempLayer);
            }
        });
    }
    $(document).on('click', '.viewAccDetails', function () {
        var ids = $(this).attr('data-id');
        viewGameAccDetails(ids);
    });
    function viewGameAccDetails(accId) {
        let tempLayer= layer.open({
            title: "账号详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['1020px', '75%'],
            content: '/GameAccounts/GameAccDetails?gameAccId=' + accId,
            end: function (res) {
                layer.close(tempLayer);
            }
        });
    }
    $(document).on('click', '.editOrderTips', function () {
        var taskId = $(this).attr('data-taskId');
        var accid = $(this).attr('data-id');
        var orderTips = $(this).attr('data-group');
        var pid = $(this).attr('data-pid');
        setOrderTips(taskId,accid, orderTips, pid);
    });
    function setOrderTips(taskId,accId, val, pid) {
        layer.prompt({ title: '设置坑位备注(不需要请写：无)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: val, maxlength:20 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            //请求
            $.ajax({
                type: "Post",
                url: "/PveTaskAjax/SetPveAccGroup",
                data: { taskId: taskId, accId: accId, groupName: value, pid: pid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 300 }, function () {
                        if (data.code > 0) {
                            layer.close(index);
                            getTaskList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    }
    $(document).on('click', '.changeItemlevel', function () {
        let id = $(this).attr('data-pid');
        let action = $(this).attr('data-action');
        if (id > 0) {
            setJobItemLevel(id, action);
        } 
    });
    function setJobItemLevel(id, action) {
        layer.prompt({ title: '设置' + (action == 20 ? '天赋或其它要求(不需要请写：无)' : '装等数值(不需要请写：0)'), shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: '', maxlength: action==20?50:4 }, function (value, index, elem) {
            if (action == 10) {
                if (!VerifyInt(value)) {
                    layer.msg('请输入整数');
                    return false;
                }
            }            
            if (!re)
                return false;
            re = false;
            //请求
            $.ajax({
                type: "Post",
                url: "/PveTaskAjax/SetJobNeedItemLevel",
                data: { pid: id, value: value, action: action},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 300 }, function () {
                        if (data.code > 0) {
                            layer.close(index);
                            getTaskList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    } 
    $(document).on('click', '.changeGroupPistionOrderBy', function () { 
        var accType = $(this).attr('data-accType');
        var ids = $(this).attr('data-ids');
        changeGroupPistionOrderBy(accType, ids);
    }); 
    function changeGroupPistionOrderBy(accType, ids) {
        layer.prompt({ title: '设置坑位顺序(数字越大越在前面，默认写0)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: '', maxlength:2 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/ChangeGroupPostionOrderBy",
                data: { ctype: accType, id: ids, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 300 }, function () {
                        if (data.code > 0) {
                            layer.close(index);
                            getTaskList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    } 
    function setTaskColorValue(taskId, color) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/SetTaskColorValue",
            data: { taskId: taskId, color: color},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
                re = true;
                if (data.code < 1) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    form.on('submit(edit_save)', function (data) {      
        if (data.field.edit_taskName == '') {
            layer.msg('排团名称是必填的');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/ChangeTaskMainInfo",
            data: { taskId: currentTaskId, taskName: data.field.edit_taskName, groupName: data.field.edit_group, startDate: data.field.edit_taskdate, remark: data.field.edit_taskRemark, project: data.field.edit_taskProject, gameServer: data.field.edit_gameServer, taskMangeUid: data.field.taskMangeUid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.close(currentLayer);
                $(".edittaskmain").hide();
                layer.msg(data.msg, { time: 300 }, function () {
                    if (data.code > 0) {                       
                        getTaskList();
                    }
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    form.on('submit(edit_save2)', function (data) {
        if (data.field.edit_taskName == '') {
            layer.msg('排团名称是必填的');
            return false;
        }
        if (currentTaskId<1) {
            layer.msg('复制对象已丢失，请刷新页面再试');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/CopyToNewGroup",
            data: { taskId: currentTaskId, taskName: data.field.edit_taskName, groupName: data.field.edit_group, startDate: data.field.edit_taskdate, remark: data.field.edit_taskRemark, project: data.field.edit_taskProject, gameServer: data.field.edit_gameServer },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.close(currentLayer);
                $(".edittaskmain").hide();
                layer.msg(data.msg, { time: 300 }, function () {
                    if (data.code > 0) {
                        getTaskList();
                    }
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    form.on('submit(publice_save)', function (data) {
        if (data.field.public_title == '') {
            layer.msg('公开标题名称是必填的');
            return false;
        }
        if (data.field.public_taskdate == '') {
            layer.msg('请选择下预计开团日期哈');
            return false;
        }
        if (data.field.public_concantwechat == '') {
            layer.msg('联络微信是必填的');
            return false;
        }
        if (data.field.public_concantqq == '') {
            layer.msg('联络QQ是必填的');
            return false;
        }
        if (publicList.length < 1) {
            layer.msg('没有可公开的坑位呢');
            return false;
        }
        if (currentTaskId < 1) {
            layer.msg('公开排团对象已丢失，请刷新页面再试');
            return false;
        }
        let strParameter = JSON.stringify(publicList);  
        layer.confirm('确认公开以上有所有坑位吗？', {
            btn: ['确定了', '我再检查下']
        }, function (yindex) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "POST",
                    url: "/PveTaskAjax/PublicNeedJobPostion",
                    data: { taskId: currentTaskId, title: data.field.public_title, startDate: data.field.public_taskdate, paramStr: strParameter, concantwechat: data.field.public_concantwechat, concantqq: data.field.public_concantqq},
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('出现错误'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.close(yindex); 
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                layer.close(currentLayer);
                                getTaskList();
                            } 
                        });
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
        });
        return false;
    });
    form.on('submit(publice_CancelSave)', function (data) { 
        layer.confirm('确认将本团已公开的坑位全部撤消吗？', {
            btn: ['确定了', '我再想想']
        }, function (yindex) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "POST",
                url: "/PveTaskAjax/PublicNeedJobPostionCancel",
                data: { taskId: currentTaskId},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('出现错误'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.close(yindex);
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (data.code > 0) {
                            layer.close(currentLayer);
                            getTaskList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
        return false;
    });
    $(document).on('click', '.setPostion', function () {
        let pid = $(this).attr('data-pid');
        let taskid = $(this).attr('data-taskId');
        let gameJob = $(this).attr('data-gameJob');
        let recName = $(this).attr('data-rec');  
        currentTaskId = taskid;
        currentSetPotionPid = pid;
        currentSetPotionJob = gameJob;
        currentSetPotionAccLogId = 0;
        currentPotionJobRec = recName;
        formSelects.value('taskSelect', [10]);
        formSelects.value('gameJob', []);
        form.val("fm1", {
            "gameServer":''
            , "key1": ''
            , "gameZhuang": ''
            , "gameTF": ''
            , "project": ''
        });
        $("#orderSta").val('');
        $("#gameGroup_order").val('');
        
        currentSetReplaceTag = 10;
        reloadOrderList();
        userLayer = layer.open({
            title: "请选择一笔订单用来配这个坑位",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['1080px', '95%'],
            content: $(".orderDiv"),
            end: function (res) {
                $(".orderDiv").hide();
            }
        });
        return false;
    });
    function loadSetPostionOrderList(gtype) {
        currentSetReplaceTag = gtype;   
        tableList = table.render({
            elem: '#orderList'
            , url: '/PveTaskAjax/GetNewsGroupOrderList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo_orderList'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width: 30,hide:true
                }
                , {
                    field: 'action', title: '操作', align: 'center', width: 75, sort: false, nresize: true, templet: function (res) {
                        let btn = '<a class="layui-btn layui-btn-xs layui-btn-normal thisacc" lay-tips="将这个号配给' + currentSetPotionJob + '" data-id="' + res.orderId + '" data-oid="' + res.oid + '" data-taskId="' + res.taskId + '" data-rec="' + (res.recManName == null || res.recManName == "" || res.recManName == '/' ? "" : res.recManName)+'">配这号</a>';
                        if (currentSetReplaceTag == 20) {
                            btn = '<a class="layui-btn layui-btn-xs layui-btn-normal thisacc" lay-tips="将这个号换到' + currentSetPotionJob + '的坑位上" data-id="' + res.orderId + '" data-oid="' + res.oid + '" data-taskId="' + res.taskId + '"  data-rec="' + (res.recManName == null || res.recManName == "" || res.recManName == '/' ? "" : res.recManName) +'">换这号</a>';
                        }
                        else if (currentSetReplaceTag == 30) {
                            btn = '<a class="layui-btn layui-btn-xs layui-btn-warm thisacc" lay-tips="将这个号加到' + currentTaskId + '团里去" data-id="' + res.orderId + '" data-oid="' + res.oid + '" data-taskId="' + res.taskId + '"  data-rec="' + (res.recManName == null || res.recManName == "" || res.recManName == '/' ? "" : res.recManName) + '">加这号</a>';
                        }
                        return btn;
                    }
                }
                ,
                {
                    field: 'orderIdView', title: '角色名', width: 120, unresize: false, templet: function (res) {
                        let vo = '';
                        let tp = '';
                        let isSplit = '';
                        let ji = '';
                        let taskspan = '';
                        if (res.isJiaJi == "Y") {
                            ji = '<span class="lableb" style="background-color:#FFBBFF" lay-tips="加急订单，优先安排">急</span>';
                        }
                        if (res.customizeTag != null && res.customizeTag != '') {
                            tp = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" lay-tips="标记：' + res.customizeTag + '">' + res.customizeTag.substring(0, 1) + '</a>';
                        }
                        if (res.isSplitOrder == 'Y') {
                            isSplit = '<a href="javascript:void(0);" class="lableb" style="background-color:#FF6347" lay-tips="该订单已被拆分成多笔订单">拆</a>';
                        }
                        if (res.taskId > 0) {
                            taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" lay-tips="该笔订单有参与排团，团号：' + res.taskId + '，排团名称：' + res.taskName + '">团</a>';
                        }
                        vo = '<a href="javascript:void(0);" class="orderdetails" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:#0094ff" lay-tips="点击查看订单详情">' + res.roleName + '</a>';

                        return '<div class="orderLine" id="order_' + res.orderId + '" data-id="' + res.orderId + '" data-orderIdView="' + res.orderIdView
                            + '" title="' + res.roleName + '">' + ji + tp + isSplit + taskspan + vo + '</div>';
                    }
                }
                , {
                    field: 'gameGroup', title: '阵营', align: 'center', width:45, sort: false, nresize: true, templet: function (res) {
                        let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                        if (res.gameGroup.toUpperCase().indexOf('LM') > -1 || res.gameGroup.toUpperCase().indexOf('联盟') > -1) {
                            group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                        }
                        return group;
                    }
                }
                , {
                    field: 'project', title: '代练项目', width:170, unresize: false, templet: function (res) {
                        let vo = '<span title="' + res.project + '">' + res.project + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameInfo', title: '角色信息', unresize: false, width:180, templet: function (res) {
                        var server = res.gameServer;
                        var job = res.gameJob;
                        var level = res.levelMark;
                        var itemlevel = res.itemRemark;

                        return '<span title="' + server + '/' + job + '/' + level + "/" + itemlevel + '">' + server + '/' + job + '/' + itemlevel + '</span>';
                    }
                }
                , {
                    field: 'orderSta', title: '订单状态', align: 'center', width:60, templet: function (res) {
                        let colorStr = '#b0aeae;';
                        switch (res.orderSta) {
                            case '待上号':
                                colorStr = '#585858';
                                break;
                            case '代练中':
                                colorStr = '#219227';
                                break;
                            case '待验收':
                                colorStr = '#ff6a00';
                                break;
                            case '已完成':
                                colorStr = '#0094ff';
                                break;
                            case '已暂停':
                                colorStr = '#FF5722';
                                break;
                            case '问题单':
                                colorStr = '#d9764a';
                                break;
                            case '已退单':
                                colorStr = '#efaaaa';
                                break;
                        }
                        let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="' + res.orderSta + '" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';

                        return str;
                    }
                }
                , {
                    field: 'orderSoure', title: '订单来源', align: 'center', width: 70
                }
                , {
                    field: 'price', title: '接单价', align: 'center', width:55, templet: function (res) {
                        return res.price.toFixed(1);
                    }
                }
                , {
                    field: 'recMan', title: '打手', align: 'center', width:75, unresize: false, templet: function (res) {
                        return (res.recManName == null || res.recManName == "" || res.recManName == '/') ? "无" : res.recManName;
                    }
                }
                , {
                    field: 'orderRemark', title: '重要备注', width: 75, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" lay-tips="' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : "没有备注") + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.orderRemark != null ? res.orderRemark : "") + '">' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : "无") + '</a>';
                    }
                }
                , {
                    field: 'createTime', title: '录单时间', align: 'center', width: 75, unresize: false
                }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
                orderPage = curr;
                var total = '【统计】共' + res.total.TotalCount + '笔订单，其中待上号' + res.total.DSH + '笔,代练中' + res.total.DLZ + '笔'
                    + ',待验收' + res.total.DYS + '笔,问题单' + res.total.WTD + '笔,已退单' + res.total.YTD + '笔';
                $("#total").html(total);
            }
        }); 
    }
    $(document).on('click', '.thisacc', function (){
        let orderId = $(this).attr('data-id');
        let oid = $(this).attr('data-oid');
        let taskId = $(this).attr('data-taskId');
        let recName = $(this).attr('data-rec');
        if (taskId > 0){
            if(currentSetReplaceTag == 10){
                let confirmMsg = '这笔订单已经配给了同团其它坑位，是否把这个号换到' + currentSetPotionJob + '的坑位上？<br>提示：如果继续，此号将更换坑位';
                if (taskId != currentTaskId){
                    confirmMsg = '这笔订单已经配给了其它团（' + taskId + '），是否把这个号拉到此团来配' + currentSetPotionJob + '？<br>提示：如果继续，此号将从原来的团移到这个团';                    
                }
                layer.confirm(confirmMsg, { icon: 3, title: '提示', btn: ['继续', '点错了'] }, function (index) {
                    SetOrderToTaskNeedJob(currentTaskId, currentSetPotionPid, orderId, oid, recName);
                    layer.close(index);
                });
            }
            else if (currentSetReplaceTag == 20){
                let confirmMsg = '这笔订单已经配给了同团其它坑位，是否把这个号换到' + currentSetPotionJob + '的坑位上？<br>提示：如果继续，此号将更换坑位';
                if (taskId != currentTaskId) {
                    confirmMsg = '这笔订单已经配给了其它团（' + taskId + '），是否把这个号换到' + currentSetPotionJob + '坑位上？<br>提示：如果继续，此号将从原来的团转移到这个团';
                }                
                layer.confirm(confirmMsg, { icon: 3, title: '提示', btn: ['继续', '点错了'] }, function (index) {                    
                    SetTaskReplacePostionOrder(taskId,oid, currentSetPotionAccLogId);
                    layer.close(index);
                });
            }
            else if (currentSetReplaceTag == 30) {
                let confirmMsg = '确定将这个号拉到' + currentTaskId+'团里来吗？';
                if (taskId == currentTaskId) {
                    layer.alert('这笔订单已经在这个团里了，不需要再加进来');
                    return false;
                }    
                layer.confirm(confirmMsg, { icon: 3, title: '提示', btn: ['继续', '点错了'] }, function (index) {
                    SetTaskAddPostionOrder(currentTaskId, oid);
                    layer.close(index);
                });
            }
        }
        else
        {
            if (currentSetReplaceTag == 10) {
                SetOrderToTaskNeedJob(currentTaskId, currentSetPotionPid, orderId, oid, recName);
            }
            else if (currentSetReplaceTag == 20) {
                SetTaskReplacePostionOrder(taskId,oid, currentSetPotionAccLogId);
            }
            else if (currentSetReplaceTag == 30) {
                let confirmMsg = '确定将这个号拉到' + currentTaskId + '团里来吗？';               
                layer.confirm(confirmMsg, { icon: 3, title: '提示', btn: ['继续', '点错了'] }, function (index) {
                    SetTaskAddPostionOrder(currentTaskId, oid);
                    layer.close(index);
                });
            }
        }
    });
    function SetOrderToTaskNeedJob(taskId, pid, orderId, oid, recName) {
        if (recName != '') {
            SetOrderToTaskNeedJobPost(taskId, pid, orderId, oid, '0', 0)
        }
        else {
            if (currentPotionJobRec != '') {
                layer.prompt({ title: '请设置给打手' + currentPotionJobRec+'的发单价，若不设定请填0', formType: 0, value: '0', maxlength: 5 }, function (value, index, elem) {
                    if (!VerifyMoeny(value)) {
                        layer.alert('请输入正确的金额格式');
                        return false;
                    }
                    SetOrderToTaskNeedJobPost(taskId, pid, orderId, oid, value, index);
                });
            }
            else {
                SetOrderToTaskNeedJobPost(taskId, pid, orderId, oid, '0', 0);
            } 
        }
        return false;
    }
    function SetOrderToTaskNeedJobPost(taskId, pid, orderId, oid, value, index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/SetTaskPostionOrder",
            data: { taskId: taskId, pid: pid, orderId: orderId, throwFee: value, oid: oid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        layer.close(index);
                        layer.close(userLayer);
                        getTaskList();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    $(document).on('click', '.replacePostion', function () {
        let accLogId = $(this).attr('data-accLogId');
        let accId = $(this).attr('data-accId');
        let gameJob = $(this).attr('data-gameJob');
        let taskid = $(this).attr('data-taskId');
        let recName = $(this).attr('data-rec');  
        currentTaskId = taskid;
        currentSetPotionJob = gameJob;
        currentSetPotionAccLogId = accLogId;
        currentPotionJobRec = recName;
        formSelects.value('taskSelect', []);

        formSelects.value('gameJob', []);
        form.val("fm1", {
            "gameServer": ''
            , "key1": ''
            , "gameZhuang": ''
            , "gameTF": ''
            , "project": ''
        });
        $("#orderSta").val('');
        $("#gameGroup_order").val('');

        currentSetReplaceTag = 20;
        reloadOrderList();
        getAllOrderSoure(); 
        userLayer = layer.open({
            title: "请选择一笔订单用来换掉这个"+gameJob+"坑位",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['1080px', '95%'],
            content: $(".orderDiv"),
            end: function (res) {
                $(".orderDiv").hide();
            }
        });
        return false;
    });
    function SetTaskReplacePostionOrder(taskId,oid,accLogId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/SetTaskReplacePostionOrder",
            data: { oid: oid, accLogId: accLogId, oldTaskId: taskId},
            dataType: 'json',
            cache: false,
            timeout: 6000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        layer.close(userLayer);
                        getTaskList();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function SetTaskAddPostionOrder(currentTaskId, oid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/SetTaskAddPostionOrder",
            data: { currentTaskId: currentTaskId,oid: oid },
            dataType: 'json',
            cache: false,
            timeout: 6000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        layer.close(userLayer);
                        getTaskList();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $(document).on('click', '.addNewTask', function () {
        currentTaskId = 0;
        $("input[name=edit_group]").prop('checked',false)
        form.val("fm1", {
            "edit_taskName": ''
            , "edit_group": ''
            , "edit_taskRemark": ''
            , "edit_taskdate": ''
            , "edit_taskProject": ''
            , "edit_gameServer": ''
            , 'taskMangeUid': ''
        });
        formSelects.value('taskMangeUid', []);    
        laydate.render({
            elem: '#edit_taskdate'
            , format: 'yyyy-MM-dd'
            , done: function (value, date, endDate) {
            }
        });
        $("#edit_save2").hide();
        $("#edit_save").show();
        currentLayer = layer.open({
            title: "创建新团，请给新团设置名称等参数",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['680px', '550px'],
            content: $('.edittaskmain'),
            end: function (res) {
                $(".edittaskmain").hide();
            }
        });
        return false;
    });
    $(document).on('click', '.setStatusBtn', function () {
        let taskid = $(this).attr('data-taskid');
        currentTaskId = taskid;
        $("input[type='radio'][name*='taskStaSet']").prop("checked", false);
        form.render('radio');
        currentLayer = layer.open({
            title: '更改' + taskid + '团状态',
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['780px', '280px'],
            content: $(".setStaDiv"),
            end: function (res) {
                $(".setStaDiv").hide();
            }
        }); 
    });    
    var prtime;
    form.on('submit(match_OkBtn)', function (data) {        
        if (currentTaskId < 1) {
            layer.msg('配号对象已丢失，请刷新页面再试');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/StartAutoMatchGroup",
            data: { taskId: currentTaskId, gameServer: data.field.match_server, project: data.field.match_project, gameGroup: data.field.match_gameGroup, date: data.field.match_AddOrderDate, matchTfMode: data.field.match_gameTfMode, matchSameTips: data.field.match_sameonetips, matchOrderStatus: data.field.match_orderStatus, matchAss: data.field.match_isHaveAss, tid: data.field.tid, zacc: data.field.match_zacc },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) {
                var n = 0;
                prtime = setInterval(function () {
                    n =10;
                    if (n > 98) {
                        n = 98; 
                    }
                    element.progress('pr', n + '%');
                },50);

                indexLoad = layer.load(1, { shade: false });
            },
            success: function (data) {
                element.progress('pr', '100%');
                re = true;
                layer.alert(data.msg, function (ee) {
                    layer.close(currentLayer);
                    getTaskList();
                    layer.close(ee);
                });
            }
            , complete: function (XMLHttpRequest) {
                element.progress('pr','100%');
                clearInterval(prtime);
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function exportTaskAcc(tid) {
        window.open("/Group/ExportByOrderByIDX?taskId=" + tid, "_blank");
        return false;
    }
    function delTask(tid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/DelPveTask",
            data: { taskId: tid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.alert(data.msg);
                    getTaskList();
                }
                else {
                    layer.alert(data.msg);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    form.on('submit(saveSettbtn)', function (data) {
        var sta = data.field.taskStaSet;
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
            data: { taskId: currentTaskId, sta: sta },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 500 }, function () {
                        layer.close(currentLayer);
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
    function getAllOrderSoure() {
        var soureData = [];
        $.get('/SystemAjax/GetOrderSoureList', function (result) {
            soureData = result.data;
            formSelects.data('orderSoures', 'local', {
                arr: soureData
            });
        });
    }
    var _tools = {
        reloadOrderData: function () {
            getTaskList();
            layer.closeAll(); //关闭现有所有弹层
            //reloadOrderList();
        }
    };
    window.tools = _tools; 
    var $moveOrderTable = $('.moveOrderTable');
    var _moveFlag = false;
    var _mousePos = {
        posX: 0,
        posY: 0,
        pageX: 0,
        pageY: 0
    };
    var startMoveX = 0;
    var gameTeamChecked;
    var moveData = {};
    var tragTableCols = [
        [{
            field: 'recUser',
            title: '打手',
        }, {
            field: 'gameRoleName',
            title: '角色名'
        }, {
           field: 'gameJob',
            title: '职业'
        }, {
                field: 'gameGroup',
            title: '阵营'
        }, {
                field: 'itemRemark',
            title: '装等'
        }, {
                field: 'dlProject',
            title: '需求'
        }]
    ];
    $('body').on({
        mousedown: function (evt) {
            _moveFlag = true;
            //console.log(evt);
            _mousePos.posX = evt.offsetX;
            _mousePos.posY = evt.offsetY;
            _mousePos.pageX = evt.pageX;
            _mousePos.pageY = evt.pageY;
            startMoveX = (_mousePos.pageX - _mousePos.posX);
            $moveOrderTable.css({
                left: (_mousePos.pageX - _mousePos.posX-230) + 'px',
                top: (_mousePos.pageY - _mousePos.posY - $(window)['scrollTop']()) + 'px'
            })
            moveData =JSON.parse(decodeURI($(this).attr('data-alldata')));
            // console.log(moveData);
            table.render({
                elem: '#moveOrderTable',
                width: 400,
                data: [moveData],
                toolbar: false,
                defaultToolbar: false,
                title: '拖拽表格',
                cols: tragTableCols,
                page: false
            });
        }

    }, '.tragBtn');
    $('body').on({
        mousemove: function (evt) {
            if (_moveFlag) {
                //移动开始了
                _mousePos.pageX = evt.pageX;
                _mousePos.pageY = evt.pageY;
                $moveOrderTable.css({
                    zIndex: 999,
                    display: 'block',
                    left: (_mousePos.pageX - _mousePos.posX-230) + 'px',
                    top: (_mousePos.pageY - _mousePos.posY-$(window)['scrollTop']()) + 'px'
                });
                for (var i = 0; i < gameTeamListPos.length; i++) {
                    if (_mousePos.pageY > gameTeamListPos[i].start && _mousePos.pageY < gameTeamListPos[i].end && _mousePos.pageX > gameTeamListPos[i].left && _mousePos.pageX < gameTeamListPos[i].right) {
                        // console.log(i);
                        gameTeamChecked = $('.gameTeamList').eq(i);
                        $('.gameTeamList').removeClass('mouseMoveActive').eq(i).addClass('mouseMoveActive');
                    }
                }
            }

        },
        mouseup: function (evt) {
            if (_moveFlag) {
                _mousePos.pageX = evt.pageX;
                _mousePos.pageY = evt.pageY;
                let inTab;//所在表格
                let inTr;//所在行
                for (var i = 0; i < gameTeamListPos.length; i++) {
                    if (_mousePos.pageY > gameTeamListPos[i].start && _mousePos.pageY < gameTeamListPos[i].end && _mousePos.pageX > gameTeamListPos[i].left && _mousePos.pageX < gameTeamListPos[i].right) {
                        inTab = $('.gameTeamList').eq(i).find('table').eq(2)
                    }
                }
                //console.log('所在表格', inTab);
                if (inTab == undefined) {
                    $moveOrderTable.css({
                        zIndex: -999,
                        display: 'none'
                    });
                    $('.gameTeamList').removeClass('mouseMoveActive');
                    _moveFlag = false;
                    return false;
                }
                else {
                    
                }
                if (inTab && inTab.length > 0) {
                    inTab.find('tr').each((i, v) => {
                        var trStart = $(v).offset().top
                        var trEnd = $(v).offset().top + $(v).height()
                        if (_mousePos.pageY > trStart && _mousePos.pageY < trEnd) {
                            inTr = $(v);
                        }
                    })
                    if (inTr && inTr.length > 0) {
                        let toData = JSON.parse(decodeURI(inTr.find('.tragBtn').attr('data-alldata'))) 
                        $moveOrderTable.css({
                            zIndex: -999,
                            display: 'none'
                        });
                        $('.gameTeamList').removeClass('mouseMoveActive');
                        _moveFlag = false; 
                        //console.log('目标表：', toData);
                        let action = 0;
                        if (toData.taskId == moveData.taskId) {
                            if (toData.pid == moveData.pid && toData.taskAccLogId == moveData.taskAccLogId) {
                                return false;
                            }
                            if ((toData.pid > 0 && moveData.pid > 0) || (toData.taskAccLogId > 0 && moveData.pid > 0) || (toData.taskAccLogId > 0 && moveData.taskAccLogId > 0)) {
                                action = 1010;
                                postionMove(toData, moveData, action);
                                return false;
                            }
                            if (moveData.taskAccLogId > 0 && toData.pid > 0) {
                                layer.confirm('需要互换排序位置还是换坑位？', { icon: 3, title: '请选择', btn: ['互换排序', '换坑位', '点错了'] }, function (index) {
                                    action = 1020;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                }, function (index) {
                                    action = 1030;
                                    postionMove(toData, moveData, action);
                                    return false;
                                    layer.close(index);
                                });
                            }
                        }
                        else {
                            if (moveData.pid > 0 && toData.pid > 0) {
                                let msg = '【请选】需要怎么做：<br/>';
                                msg += '1、把' + moveData.taskId + '团的' + moveData.gameJob + '坑位移到' + toData.taskId + '团里<br/>';
                                msg += '2、把' + moveData.taskId + '团的' + moveData.gameJob + '坑位与' + toData.taskId + '团里的' + toData.gameJob + '坑位交换位置<br/>';
                                layer.confirm(msg, { icon: 3, title: '请选择', btn: ['1、把坑位移过来', '2、交换位置', '点错了'] }, function (index) {
                                    action = 2011;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                }, function (index) {
                                    action = 2010;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                });
                            }
                            if (moveData.pid > 0 && toData.taskAccLogId > 0) {
                                let msg = '【请选】需要怎么做：<br/>';
                                msg += '1、把' + moveData.taskId + '团的' + moveData.gameJob + '坑位移到' + toData.taskId + '团里<br/>';
                                msg += '2、把' + moveData.taskId + '团的' + moveData.gameJob + '坑位与' + toData.taskId + '团里的' + toData.gameJob + '坑位交换位置<br/>';
                                layer.confirm(msg, { icon: 3, title: '请选择', btn: ['1、把坑位移过来', '2、交换位置', '点错了'] }, function (index) {
                                    action = 2020;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                }, function (index) {
                                    action = 2030;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                });
                            }
                            if (moveData.taskAccLogId > 0 && toData.pid > 0) {
                                let msg = '【请选】需要怎么做：<br/>';
                                msg += '1、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号移到' + toData.taskId + '团里<br/>';
                                msg += '2、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号覆盖到' + toData.taskId + '团里的' + toData.gameJob + '坑位上<br/>';
                                msg += '3、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号与' + toData.taskId + '团里的' + toData.gameJob + '坑位交换位置<br/>';
                                layer.confirm(msg, {
                                    icon: 3, title: '请选择', btn: ['1、把号移过来', '2、覆盖坑位', '3、交换位置', '点错了'], btn3: function (index, layero) {
                                        action = 2033;
                                        layer.close(index);
                                        postionMove(toData, moveData, action);
                                        return false;
                                    }
                                }, function (index) {
                                    action = 2031;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                }, function (index) {
                                    action = 2032;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                });
                            }
                            if (toData.taskAccLogId > 0 && moveData.taskAccLogId > 0) {
                                let msg = '【请选】需要怎么做：<br/>';
                                msg += '1、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号移到' + toData.taskId + '团里<br/>';
                                msg += '2、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号替换掉' + toData.taskId + '团里' + toData.gameJob + '号<br/>';
                                msg += '3、把' + moveData.taskId + '团的' + moveData.gameJob + '这个号与' + toData.taskId + '团里' + toData.gameJob + '这个号交换位置<br/>';
                                layer.confirm(msg, {
                                    icon: 3, title: '请选择', btn: ['1、把号移过来', '2、替换号', '3、交换位置', '点错了'], btn3: function (index, layero) {
                                        action = 2050;
                                        layer.close(index);
                                        postionMove(toData, moveData, action);
                                        return false;
                                    }
                                }, function (index) {
                                    action = 2041;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                }, function (index) {
                                    action = 2040;
                                    layer.close(index);
                                    postionMove(toData, moveData, action);
                                    return false;
                                });
                            }
                        }
                        return false;
                    }
                    else {
                        $moveOrderTable.css({
                            zIndex: -999,
                            display: 'none'
                        });
                        $('.gameTeamList').removeClass('mouseMoveActive');
                        _moveFlag = false; 

                        let toTabId = inTab.prevObject[0].getAttribute('data-taskid');
                        if (toTabId != undefined && toTabId != null && toTabId != '') {
                            $moveOrderTable.css({
                                zIndex: -999,
                                display: 'none'
                            });
                            $('.gameTeamList').removeClass('mouseMoveActive');
                            _moveFlag = false;

                            let toDataTemp = {
                                pid: 0,
                                taskAccLogId: 0,
                                taskId: toTabId
                            }
                            if (moveData.pid > 0) {
                                action = 2060;
                            }
                            else if (moveData.taskAccLogId > 0) {
                                action = 2070;
                            }
                            postionMove(toDataTemp, moveData, action);
                            return false;
                        }
                    }
                } 
            }
        }
    });
    function postionMove(toData, moveData, action) { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/SetTaskPostionMutual",
            data: { cTaskId: moveData.taskId, cpid: moveData.pid, cAccLogId: moveData.taskAccLogId, toTaskId: toData.taskId, toPid: toData.pid, toAccLogId: toData.taskAccLogId, action: action },
            dataType: 'json',
            cache: false,
            timeout: 6000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.close(userLayer);
                if (data.code > 0) {
                    getTaskList();
                } else {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                } 
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    form.on('submit(checkGroupFull)', function (data) {
        var content = data.field.selectContent;
        if (content == '' || content == null || content == undefined || content.length < 10) {
            layer.alert('请粘贴从EXCEL表中复制的排团数据到上面的大框框里');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/CheckGroupFullInfo",
            data: { taskId: taskId, content: content },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.alert(data.msg, { icon: data.msg.indexOf('正常') > -1 ? 1 : 5 }, function (ld) {
                        layer.close(ld);
                    });
                }
                else {
                    layer.alert(data.msg);
                }
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }); 
    var copyGrapClipboard = new ClipboardJS('.copygrap');
    copyGrapClipboard.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
    });
    copyGrapClipboard.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', { time: 1000 });
    });
});