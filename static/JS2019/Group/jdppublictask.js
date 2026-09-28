layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    tag: '/lib/tag'
}).use(['index', 'form', 'util', 'table', 'laypage', 'tag'], function () {
    var $ = layui.$,
        form = layui.form,
        laypage = layui.laypage,
        tag = layui.tag,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var page = 1;
    var weekDay = 0;
    var gameJob = "";
    var gameTf = "";
    var gameGroup = "";  
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            getTaskList();
        }
    });
    tag.render("tfTag", {
        skin: 'layui-btn layui-btn-danger layui-btn-xs layui-btn-radius deltab'
    });
    var re = true;
    var indexLoad;
    var userLayer;
    getTaskList();
    function getTaskList() { 
        var gameServer = $("#gameServer").val();
        var itemLevel = $("#itemLevel").val();
        var key = $("#key").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: '/PveTaskAjax/GetJdpPublicTaskData',
            data: { weekDay: weekDay, gameGroup: gameGroup, gameServer: gameServer, gameJob: gameJob, itemLevel: itemLevel, gameTf: gameTf, key: key, page: page },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var taskData = data.data; 
                $(".taskList").html("");
                $(".taskTotal").html("【统计】本次搜索条件下共有" + data.count + '个团供您参考');
                let html = "";
                $.each(taskData, function (index, item) {
                    html += '<div class="layui-card task_item">';                   
                    html += '<div class="layui-card-header taskHeader_' + item.wid + '" style="display:flex;flex-direction:row;justify-content:space-between;">';
                    html += '<div class="viewconcat" lay-tips="点击可查看这家工作室的联络方式" data-wid="' + item.wid + '" data-title="' + item.title + '" style="cursor:pointer">';
                    html += '<span style="color:#2F4056;font-weight:600;">【';
                    html += '<a href="javascript:void(0)" lay-tips="开团日期" style="color:#2F4056">' + item.startDateShort + ' ' + item.startTimeWeek + '</a>';
                    html += '】</span>';
                    html += '<a href="javascript:void(0)" style="color:' + (item.gameGroup == '联盟' || item.gameGroup.toLowerCase() == 'lm' ? "#1E9FFF" : "#FF5722") + ';font-weight:600">' + item.gameGroup + '</a>';
                    html += ' <span style="color:#2F4056;font-weight:600;">' + item.gameServer + ' ' + item.title+ '</span>';
                    html += '</div>';
                    html += '<div>';
                    html += '<div id="taskColor_' + item.wid + '"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '<div class="layui-card-body">';
                    html += '<table class="layui-table datatable" id="datatable" style="table-layout:fixed;" lay-filter="taskTable_' + item.wid + '" data-wid="' + item.wid + '">';

                    html += '<thead>';
                    html += '<tr style="color:#333">';
                    html += '<th lay-data="{field:\'xuhao\',width:40,align: \'center\'}">序号</th>';
                    html += '<th lay-data="{field:\'jobName\',width:60}">职业</th>';
                    html += '<th lay-data="{field:\'itemLevel\',width:70}">装等要求</th>';
                    html += '<th lay-data="{field:\'gameTf\',width:60}">天赋</th>';
                    html += '<th lay-data="{field:\'postionRemark\',width:70}">备注</th>';
                    html += '<th lay-data="{field:\'cc\',width:60}">操作</th>';
                    html += '</tr>';
                    html += '</thead>';

                    html += '<tbody id="orderListBody">';
                    let postionCount = 0;
                    for (let i = 0; i < item.jobList.length; i++) {
                        let res = item.jobList[i];
                        html += '<tr style="color:#666;font-size:12px">';
                        html += '<td>' + (i+1) + '</td>';
                        html += '<td>' + res.jobName + '</td>';
                        html += '<td><span style="' + (res.itemLevel == 0 ? 'color:#A3AFB7' :'color:#C71585')+'" lay-tips="' + (res.itemLevel == 0 ? "该坑位没有装等要求" : "要求装等数值在" + res.itemLevel + '或以上') + '">' + (res.itemLevel == 0 ? '没要求' : res.itemLevel + '或以上') + '</span></td>';
                        html += '<td><span lay-tips="' + (res.gameTf == '' ? '无要求' : '此坑位天赋要求有'+res.gameTf) + '">' + (res.gameTf == '' ? '无要求' : res.gameTf) + '</span></td>';
                        html += '<td><span style="color:#FF534D" lay-tips="' + res.postionRemark + '">' + res.postionRemark + '</a></td>';
                        html += '<td><a class="layui-btn layui-btn-xs layui-btn-normal viewconcat" data-wid="' + item.wid + '" data-title="' + item.title + '" lay-tips="点击可查看这家工作室的联络方式">联系TA</a></td>';
                        html += '</tr>';
                        postionCount++;                       
                    }
                    html += '</tbody>';
                    html += '</table>';                    
                    html += '</div>';
                    html += '</div>';
                });
                $(".taskList").append(html); 
                $.each(taskData, function (index, item) {
                    table.init('taskTable_' + item.wid, {
                        limit: 100
                        , toolbar: ''
                        , defaultToolbar: []
                        , done: function () { 
                        }
                    });
                });
                laypage.render({
                    elem: 'pages'
                    , count: data.count
                    , limit:10
                    , curr: page
                    , jump: function (obj, first) {
                        page = obj.curr;
                        if (!first) {
                            getTaskList();
                        }
                    }
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    } 
    form.on('radio(taskDatefilter)', function (data) {
        if (data.elem.checked) {
            weekDay = data.value;
        }
        page = 1;
        getTaskList();
    });
    form.on('radio(gameGroup)', function (data) {
        if (data.elem.checked) {
            gameGroup = data.value;
        }
        page = 1;
        getTaskList();
    });    
    form.on('submit(taskSeachBtn)', function (data) {
        page = 1;
        getTaskList();
        return false;
    });
    $(document).on('click', '.selectJobGameTf', function () {
        var job = $(this).attr('data-job');
        var tf = $(this).attr('data-tf');
        gameJob = job;
        gameTf = tf;
        page = 1;       
        tag.delete('tfTag','111');
        tag.add('tfTag', {
            text: job + tf
            , id: '111'
        });
        getTaskList();
    });
    $(document).on('click', '.deltab', function () {
        gameJob = '';
        gameTf = '';
        getTaskList();
    });
    $(document).on('click', '.viewconcat', function () {
        var wid = $(this).attr('data-wid');
        var title = $(this).attr('data-title');  
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/GetJdpPublicTaskContactData",
            data: { wid: wid },
            dataType: 'json',
            cache: false,
            timeout: 6000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    userLayer = layer.open({
                        title: "查看" + title + "的联络方式",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 5,
                        area: ['580px', '450px'],
                        content: $(".publicPostionConcatLayer")
                    });
                    $(".head_title").html(title);
                    $(".c_company").html('商家：' +data.data.companyName);
                    $(".c_wechat").html('联络微信：' +data.data.contactWechat);
                    $(".c_qq").html('联络QQ：' +(VerifyInt(data.data.contactQQ) ? '<a target="_blank" href="https://wpa.qq.com/msgrd?v=3&uin=' + data.data.contactQQ + '&site=qq&menu=yes" class="qq-btn">' + data.data.contactQQ + '<img border="0" src="https://pub.idqqimg.com/qconn/wpa/button/button_111.gif" alt="点击这里给我发消息" title="点击这里给我发消息" /></a>' : data.data.contactQQ));
                } else {
                    layer.msg(data.msg);
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    
    var _tools = {
        reloadOrderData: function () {
            getTaskList();
            layer.closeAll(); //关闭现有所有弹层
            //reloadOrderList();
        }
    };
    window.tools = _tools; 
});