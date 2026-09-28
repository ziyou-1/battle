layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    tag: '/lib/tag'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table','tag'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var table = layui.table;
    var tag = layui.tag;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var re = true;
    var indexLoad; 
    laydate.render({
        elem: '#cd'
        , type: 'date'
    });
    laydate.render({
        elem: '#disableTime'
        , type: 'datetime'
    }); 
    var gameAccId = $("#gameAccId").val(); 
    var gameName = $("#gameName").find("option:selected").text();         
    var currentGameArearData = [];
    var currentGameServerData = [];
    var currentGameJobData = [];
    var currentGameGroupData = [];
    getGameArea();
    getGameJob();
    getGameGroup();
    if (gameAccId>0) {
        formSelects.data('gameServer', 'local', {
            arr: [
                { "name": $("#tGameServer").val(), "value": $("#tGameServer").val(), "selected": "selected" }
            ]
        });
    }
    form.on('select(selectGame)', function (data) {
            var mark1 = "游戏信息1";
        var mark2 = "游戏信息2"; 
            $("#gameName option").each(function () {
                var item = $(this).val(); 
                if (item == data.value) {
                    gameName = $(this).text(); 
                    var isMoblie = $(this).data('mobliegame'); 
                    if (gameName.indexOf('魔兽') > -1) {
                        //mark1 = '装等';
                        //mark2 = '天赋&专精';
                        $(".gameCdDiv").show();
                        $(".groupdiv").show();
                    }
                    else if (gameName.indexOf('王者荣耀') > -1 || gameName.indexOf('英雄联盟') > -1) {
                        //mark1 = '符文/段位/英雄';
                        //mark2 = '铭文';
                        $(".gameCdDiv").hide();
                        $(".groupdiv").hide();
                    }
                    else {
                        $(".gameCdDiv").hide();
                        $(".groupdiv").hide();
                    }

                    if (isMoblie == "Y") {
                        $(".jobDiv").hide();
                    } else {
                        $(".jobDiv").show();
                    }
                }
            });  
            $("#mark1").html(mark1);
            $("#mark2").html(mark2);   
            getGameArea();
            getGameJob();
            getGameGroup();
            formSelects.data('gameServer', 'local', {
                arr: [
                ]
            });
        getGameTags();
       
            return false;
        });
    formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) { 
        getGameServer(val.value);
        return true;
    });
    function getGameArea() { 
            $.get('/GameAjax/getGameData?type=20&parentId=' + gameName + '&selectValue=' + $("#tGameArea").val(), function (result) {
            currentGameArearData = result.data;
            formSelects.data('gameArea', 'local', {
                arr: currentGameArearData
            });
        });
    }
    function getGameServer(pid,serverName) { 
        $.get('/GameAjax/getGameData?type=30&parentId=' + pid + '&selectValue=' + $("#tGameServer").val(), function (result) {
            currentGameServerData = result.data;
            formSelects.data('gameServer', 'local', {
                arr: currentGameServerData
            });
            //若需要追加选中服务器
            if (serverName != undefined && serverName != null && serverName != '') {
                let serverId = 0;
                currentGameServerData.forEach(function (val, index) {
                    let item = val;
                    if (item.name.indexOf(serverName) > -1) {
                        serverId = item.value;
                        return false;
                    }
                });
                if (serverId > 0) {
                    formSelects.value('gameServer', [serverId], true);
                } else {
                    //动态添加
                    formSelects.data('gameServer', 'local', {
                        arr: [
                            { "name": serverName, "value": serverName, "selected": "selected" }
                        ]
                    });
                }
            }
        }); 
    }
    function getGameJob() { 
        $.get('/GameAjax/getGameData?type=40&parentId=' + gameName + '&selectValue=' + $("#tGameJob").val(), function (result) {
            currentGameJobData = result.data;
            formSelects.data('gameJob', 'local', {
                arr: currentGameJobData
            });
        });
    }
    function getGameGroup() {
        $.get('/GameAjax/getGameData?type=50&parentId=' + gameName + '&selectValue=' + $("#tGameGroup").val(), function (result) {
            currentGameGroupData = result.data;
            formSelects.data('gameGroup', 'local', {
                arr: currentGameGroupData
            });
        });
    }
    function getUseType(val) {
        $.get('/GameAccountsAjax/GetAllGameAccountUseTypeSelect?selectValue=' + val, function (result) {
            formSelects.data('useType', 'local', {
                arr: result.data
            });
        });
    }  
    form.verify({
        moblie: function (value) {
           if (value.length > 0) {
               if (!VerifyMoblie(value)) {
                   return '手机号格式不正确！';
               }
           }
       }
    });
    form.on('submit(savebtn)', function (data) {
        var gameAccId = data.field.gameAccId; 
        if (data.field.gameAcc == "" || data.field.gameAcc == undefined || data.field.gameAcc == null) {
            layer.msg('游戏账号不可为空');
            return false;
        }
        if (data.field.gamePwd == "" || data.field.gamePwd == undefined || data.field.gamePwd == null) {
            layer.msg('游戏密码不可为空');
            return false;
        }
        var strParameter = JSON.stringify(data.field);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        let gameArea = formSelects.value('gameArea', 'nameStr');
        let gameServer = formSelects.value('gameServer', 'nameStr');
        if (gameAccId>0) {
            if (gameServer == "" || gameServer == null || gameServer == undefined) {
                gameServer = $("#tGameServer").val();
            }
        }
        let gameJob = formSelects.value('gameJob', 'nameStr');
        let gameGroup = formSelects.value('gameGroup', 'nameStr');
        if ((gameArea == "" || gameArea == null || gameArea == undefined) && (gameServer == "" || gameServer == null || gameServer == undefined)) {
            layer.alert("大区(平台)或服务器至少选一样！", {
                title: '提示'
            });
            return false;
        }
        let useType = formSelects.value('useType', 'nameStr');
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/AddEditGameAccount",
            data: { param: strParameter, gameName: gameName, gameArea: gameArea, gameServer: gameServer, gameJob: gameJob, gameGroup: gameGroup, useType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        if (gameAccId>0) {
                            parent.tools.reloadOrderData();
                        }
                        else {
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
    form.on('radio(accStatusRd)', function (data) {
        if (data.value == 30) {
            $(".ftime").show();
           // $("#disableTime").focus();
        } else {
            $(".ftime").hide();
        }
    });
    $(".autokeys").change(function () {
        var value = $(this).val();
        if (value == "" ||value == null) {
            return false;
        }
        disContent(value);
        return false;
    })
    function disContent(val) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/DisAddGameAccountContent",
            data: { value: val, gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    var res = data.msg;
                    if (res.gameArea != "" && res.gameArea != null) {
                        var gameAreaId = 0;
                        currentGameArearData.forEach(function (val, index) {
                            let item = val;
                            if (item.name.indexOf(res.gameArea) > -1) {
                                gameAreaId = item.value;
                                return false;
                            }
                        });
                        if (gameAreaId > 0) {
                            formSelects.value('gameArea', [gameAreaId], true);
                            getGameServer(gameAreaId, res.gameServer);
                        }
                        else {
                            formSelects.data('gameArea', 'local', {
                                arr: [
                                    { "name": res.gameArea, "value": res.gameArea, "selected": "selected" }
                                ]
                            });
                            if (res.gameServer != "" && res.gameServer != null) {
                                formSelects.data('gameServer', 'local', {
                                    arr: [
                                        { "name": res.gameServer, "value": res.gameServer, "selected": "selected" }
                                    ]
                                });
                            }
                        }
                    }
                    if (res.gameAcc != "" && res.gameAcc != null) {
                        $("#gameAcc").val(res.gameAcc);
                    }
                    if (res.gamePwd != "" && res.gamePwd != null) {
                        $("#gamePwd").val(res.gamePwd);
                    }
                    if (res.gameRoleName != "" && res.gameRoleName != null) {
                        $("#gameRole").val(res.gameRoleName);
                    }
                    if (res.moblie != "" && res.moblie != null) {
                        $("#moblie").val(res.moblie);
                    }
                    form.render();
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    getUseType($("#accUseTypeTxt").val());
    tag.on('click(tipsBtn)', function (data) {
        let value = $(this).data('value');
        let yvalue = $("#tips").val();
        if (yvalue.indexOf(value) > -1) {
            return false;
        }
        yvalue = yvalue + " " + value;
        $("#tips").val(yvalue);
    });
    function getGameTags() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAccountsAjax/GetAccTipsList",
            data: {gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    var res = data.data;
                    var html = '';
                    res.forEach(function (val, index) {
                        html += '<a lay-id="' + index + '" class="layui-badge tag-item" href="javascript:void(0)" data-value="' + val + '" style="margin-right:10px" >' + val + '</a>';
                    })
                    $(".tag").html(html);
                    form.render('layui-btn-container');
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
});