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
        var gameName = $("#gameName").find("option:selected").text();
        var currentGameArearData = [];
        var currentGameServerData = []; 
        var currentGameGroupData = []; 
        getGameArea();  
        getGameGroup(); 
        var indexLoad; 
        var page = 1;  
        var orders=""; 
        formSelects.data('gameGroup', 'server', {
            url: '/GameAjax/getGameData?type=50&parentId=' + $("#gameName").find("option:selected").text(),
        }); 
        form.on('select(selectGame)', function (data) {
            $("#gameName option").each(function () {
                var item = $(this).val();
                if (item == data.value) {
                    gameName = $(this).text();
                }
            });  
            getGameArea();  
            getGameGroup(); 
            formSelects.data('gameServer', 'local', {
                arr: [
                ]
            }); 
            getAllRecUserData(); 
            reloadOrderList();
            return false;
        }); 
        formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) {
            getGameServer(val.value);
            return true;
        });
        function getGameArea() {
            $.get('/GameAjax/getGameData?type=20&parentId=' + gameName, function (result) {
                currentGameArearData = result.data;
                formSelects.data('gameArea', 'local', {
                    arr: currentGameArearData
                });
            });
        }
        function getGameServer(pid, serverName) { 
            $.get('/GameAjax/getGameData?type=30&parentId=' + pid, function (result) {
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
        function getGameGroup() {
            $.get('/GameAjax/getGameData?type=50&parentId=' + gameName, function (result) {
                currentGameGroupData = result.data;
                formSelects.data('gameGroup', 'local', {
                    arr: currentGameGroupData
                });
            });
        }
        var seachParam = 'gameName=' + gameName; 
        var tableList = table.render({
            elem: '#tableList'
            , url: '/GameAccountsAjax/GetMyGameAccList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width:30
                }
                 , {
                     field: 'accType', title: '账号类型', align: 'center', width: isPc ? '5%' : 70, unresize: false, templet: function (res) {
                         let acctype = '';
                         if (res.accType == 'B') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#9ACD32" title="订单账号">订单账号</a>';
                         }
                         else if (res.accType == 'C') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" title="借用账号">借用账号</a>';
                         }
                         else if (res.accType == 'D') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" title="临时账号">临时账号</a>';
                         }
                         else {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#ff6a00" title="内部账号">内部账号</a>';
                         }
                         return acctype;
                     }
                 }
                , {
                    field: 'gameRoleName', title: '角色名', width: isPc?'7%':120, unresize: false, templet: function (res) {
                        let tp = '';
                        let taskspan = '';
                        let vo = '';
                        if (res.taskId > 0) {
                            taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" title="该账号有参与排团，团号：' + res.taskId + '">团</a>';
                        }
                        vo = '<a href="javascript:void(0);" class="viewAccDetails" data-id="' + res.gameAccId + '" style="color:#0094ff" title="点击查看账号详情">' + (res.gameRoleName != null && res.gameRoleName != '' ? res.gameRoleName : "账号详情") + '</a>';
                        return tp + taskspan + vo;
                    }
                }
                , {
                    field: 'gameGroup', title: '阵营', align: 'center', width: isPc ? '4%' : 70, sort: false,
                    unresize: true, templet: function (res) {
                        let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                        if (res.gameGroup == "LM" || res.gameGroup == "lm" || res.gameGroup == "联盟") {
                            group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                        }
                        return group
                    }
                }
                , {
                    field: 'gameInfo', title: '角色信息', width: isPc ? '13%' : 160,  unresize: false, templet: function (res) {
                        var area = res.gameArea;
                        var server = res.gameServer;
                        var job = res.gameJob;
                        var itemlevel = res.gameTF;
                        var otherlevel = res.otherLevel;

                        return '<span title="' + area + '/' + server + '/' + job + '/' + itemlevel + '/' + otherlevel + '">' + area + '/' + server + '/' + job + '/' + itemlevel + '/' + otherlevel + '</span>';
                    }
                } 
                , {
                    field: 'gameAcc', title: '游戏账号', width: isPc ? '9%' : 120, align: 'center', unresize: false, templet: function (res) {
                        let div = '<span style="color:#5BB75B">' + res.gameAcc + '</span>';
                        return div;
                    }
                }
                , {
                    field: 'zgameAcc', title: '子账号', width: isPc ? '4%' : 60, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let div = '<span style="color:#5BB75B">' + res.zgameAcc + '</span>';
                        return div;
                    }
                }
                , {
                    field: 'accStatus', title: '账号状态', width: isPc ? '5%' : 70, align: 'center', unresize: false, templet: function (res) {
                        let title = '正在使用';
                        let colorStr = '#b0aeae;';
                        switch (res.accStatus) {
                            case 20:
                                colorStr = '#585858';
                                title = '库存账号';
                                break;
                            case 30:
                                colorStr = '#D15FE8';
                                title = '临时封号';
                                break;
                            case 40:
                                colorStr = '#ff6a00';
                                title = '永久封号';
                                break;
                            default:
                                colorStr = '#5FB878';
                                break;
                        }
                        let str = '<a href="javascript:void(0)" class="lableb setaccstatus" data-id="' + res.gameAccId + '" title="' + title + '中" style="background-color:' + colorStr + ';">' + title+ '</a>';

                        return str;
                    }
                }
                , {
                    field: 'tempDisableTime', title: '解封时间', width: isPc ? '5%' : 80, align: 'center', unresize: false, sort: true, templet: function (res) {
                        return '<span>' + res.tempDisableTime + '</span>';
                    }
                }
                , {
                    field: 'accUseType', title: '用途类型', width: isPc ? '7%' : 90, align: 'center', unresize: false, templet: function (res) {
                        let title = res.accUseType;
                        let str = '<a href="javascript:void(0)" class="setusetype" style="color:#37474F" data-id="' + res.gameAccId + '" data-value="' + res.accUseType+'" title="' + title + '">' + (title==null||title==''?'无':title) + '</a>';

                        return str;
                    }
                }
                , {
                    field: 'proStatus', title: '进度状态', width: isPc ? '4%' : 60, align: 'center', unresize: false, templet: function (res) {
                        let colorStr = '#b0aeae;';
                        let title = '未分配';
                        switch (res.proStatus) {
                            case 10:
                                colorStr = '#585858';
                                title = '未分配';
                                break;
                            case 20:
                                colorStr = '#219227';
                                title = '待上号';
                                break;
                            case 30:
                                colorStr = '#ff6a00';
                                title = '代练中';
                                break;
                            case 40:
                                colorStr = '#0094ff';
                                title = '待验收';
                                break;
                            case 50:
                                colorStr = '#FF5722';
                                title = '已完成';
                                break;
                            case 60:
                                colorStr = '#d9764a';
                                title = '已暂停';
                                break;
                            case 70:
                                colorStr = '#efaaaa';
                                title = '有问题';
                                break;
                        }
                        let str = '<a href="javascript:void(0)" class="lableb setprostatus" data-id="' + res.gameAccId + '" title="' + title + '，点击可以更改进度状态" style="background-color:' + colorStr + ';">' + title+ '</a>';

                        return str;
                    }
                }
                , {
                    field: 'orderSoure', title: '最后排团时间', width: isPc ? '6%' : 100, align: 'center', unresize: false, sort: true, templet: function (res) {
                        return '<span>' + res.cdDate + '</span>';
                    }
                }
                , {
                    field: 'recUserName', title: '接手人', align: 'center', width: isPc ? '5%' : 80, unresize: false, templet: function (res) {
                        var DLStaffClass = (res.recUserName == null || res.recUserName == "") ? "layui-btn layui-btn-xs layui-btn-normal jsr" : " jsr";
                        var DLStaffTxt = (res.recUserName == null || res.recUserName == "" || res.recUserName == '/') ? "指派接手" : res.recUserName
                        
                        return '<a class="' + DLStaffClass + '" href="javascript:void(0)" data-id="' + res.gameAccId + '" title="' + DLStaffTxt + '">' + DLStaffTxt + '</a>'
                    }
                }
                , {
                    field: 'createTime', title: '入库时间', width: isPc ? '5%' : 80, align: 'center', unresize: false, sort: true, templet: function (res) {
                        return '<span>' + res.createTime + '</span>';
                    }
                }
                , {
                    field: 'img', title: '账号截图', width: 80, align: 'center', unresize: false, sort: false, templet: function (res) {
                        if (res.accType == 'A') {
                            return '<div class="layui-btn-group" style="background: white;">' +
                                '<a class="layui-btn layui-btn-xs layui-btn-normal upImg" style="margin-right: 2px" lay-submit="" data-id="' + res.gameAccId + '" title="上传截图">上传</a>' +
                                '<a class="layui-btn layui-btn-xs layui-btn-normal mangeImg" style="margin-right: 2px" lay-submit="" data-id="' + res.gameAccId + '" title="查看截图">查看</a>'
                                + '</div>'
                        }
                        else {
                            return '';
                        }
                    }
                }
                , {
                    field: 'remark', title: '备注', width: isPc ? '7%' : 100, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + res.remark + '" style="color:#E03636" class="orderRemark"  data-id="' + res.gameAccId + '" data-remark="' + res.remark + '" data-role="' + res.gameRoleName + '">' + (res.remark != null&&res.remark!='' ? res.remark : "无") + '</a>';
                    }
                }
                , {
                    field: 'jiwei', title: '机位', width: isPc ? '7%' : 70, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + res.jiwei + '，点击可更改" style="color:#76838F" class="setjiwei"  data-id="' + res.gameAccId + '" data-jiwei="' + res.jiwei + '">' + (res.jiwei != null && res.jiwei != '' ? res.jiwei : "无") + '</a>';
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
                case 'setChangeProStatus':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].gameAccId);
                    };
                    var gameAccId = tempData.join(',');
                    changeAccProStatus(gameAccId);
                    break;
                case 'setChangeJiWei':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].gameAccId);
                    };
                    var gameAccId = tempData.join(',');
                    changeAccJiWei(gameAccId,'');
                    break;           
                    
            };
        }); 
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() {
            var gameArea = formSelects.value('gameArea', 'nameStr');
            var gameServer = formSelects.value('gameServer', 'nameStr');
            var groupName = formSelects.value('gameGroup', 'nameStr');   
            var accType = formSelects.value('accType', 'valStr'); 
            var skey1 = $("#key1").val(); 
            var gameAcc = $("#gameAcc").val(); 
            var accStatus = $("#accStatus").val();
            var useType = formSelects.value('useType', 'valStr'); 
            var proStatus = $("#proStatus").val();
            seachParam = 'gameName=' + gameName + '&accType=' + accType +
                '&gameArea=' + gameArea + '&gameServer=' + gameServer +
                '&groupName=' + groupName + '&key3=' + skey1 + '&key2=' + gameAcc + '&accStatus=' + accStatus + '&useType=' + useType + '&proStatus=' + proStatus;
            
            tableListReload();
            return false;
        } 
        function tableListReload(){
            tableList.reload({
                url: '/GameAccountsAjax/GetMyGameAccList?' + seachParam
                , where: { 
                }
                , page: {
                    curr: page
                }
            });
            return false;
        } 
        $(document).on('click', '.groupview', function () { 
            var taskid = $(this).attr('data-id');
            viewTaskDetails(taskid);
        })
        function viewTaskDetails(taskId) {
            layer.open({
                title: taskId + "排团详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: '/Group/GroupDetails?taskID=' + taskId
            });
        }
        $(document).on('click', '.viewAccDetails', function () {
            var ids = $(this).attr('data-id');
            viewGameAccDetails(ids);
        });
        function viewGameAccDetails(accId) {
            layer.open({
                title: "账号详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [isPc ? '60%' : '90%', isPc?'80%': '95%'],
                content: '/GameAccounts/GameAccDetails?gameAccId=' + accId
            });
        }
        $(document).on('click', '.orderRemark', function () {
            var accId = $(this).attr('data-id');
            var remark = $(this).attr('data-remark');
            layer.prompt({ title: '快速修改订单重要备注', formType: 0, value: remark, maxlength: 100 }, function (value, index, elem) { 
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/GameAccountsAjax/ChangeAccRemark",
                    data: { gameAccId: accId, remark: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.msg(data.msg, { time: 1000 }, function () {
                                layer.close(index);
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.msg(data.msg, { time: 3000 }, function () {
                            })
                        }
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            });
        }) 
        $(document).on('click', '.upImg', function () {
            var ids = $(this).attr('data-id');
            layer.open({
                title: "上传账号截图",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [isPc ? '70%' : '90%', isPc ? '85%' : '90%'],
                content: '/Order/UploadPic?gameAccId=' + ids
            });
            return false;
        });
        $(document).on('click', '.mangeImg', function () {
            var ids = $(this).attr('data-id');
            layer.open({
                title: "查看账号截图",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 1,
                area: ['80%', isPc ? '85%' : '500px'],
                content: '/Order/PicMange?gameAccId=' + ids
            });
            return false;
        });
        var selectIdx = "";
        var settLayerIndex;
        function changeAccProStatus(idx) {
            selectIdx = idx;
            settLayerIndex = layer.open({
                title: "更改账号进度状态",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['60%', '280px'],
                content: $(".setAccountProStatus")
            });
            return false;
    }
        function changeAccJiWei(idx,val) {
            layer.prompt({ title: '修改账号所在机位', formType: 0, value: val, maxlength: 25 }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/GameAccountsAjax/ChangeGameAccountJiWei",
                    data: { idx: idx, remark: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.msg(data.msg, { time: 1000 }, function () {
                                layer.close(index);
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.msg(data.msg, { time: 3000 }, function () {
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
    }
        form.on('radio(accProStatusRd)', function (data) {
            if (data.value == 60 || data.value == 70) {
                $("#yytext").val('');
                $("#yytext").focus();
                    $(".yy").show();
                } else {
                    $(".yy").hide();
                }
            });
        $(document).on('click', '.setprostatus', function () {
                var ids = $(this).attr('data-id');
                changeAccProStatus(ids);
                return false;
        });
        $(document).on('click', '.setjiwei', function () {
            var ids = $(this).attr('data-id');
            var jiwei = $(this).attr('data-jiwei');
            if (jiwei == null || jiwei=='null') {
                jiwei = "";
            }
            changeAccJiWei(ids, jiwei);
            return false;
        });
        form.on('submit(saveChangeProStatusbtn)', function (data) {
            var status = data.field.accProStatus;
            var remark = $("#yytext").val();
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/GameAccountsAjax/ChangeGameAccountProStatus",
                    data: { idx: selectIdx, status: status, remark: remark },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('数据请求出现异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        layer.msg(data.msg, { time: 1500 }, function () {
                            if (data.code > 0) {
                                layer.close(settLayerIndex);
                                reloadOrderList();
                            }
                        });
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
                return false;
            });
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll();
                reloadOrderList();
            },
            reloadOrderDataNoCloseLayer: function () {
                reloadOrderList();
            }
        };
        window.tools = _tools;
        getUseType();
        function getUseType() {
            $.get('/GameAccountsAjax/GetAllGameAccountUseTypeSelect', function (result) {
                formSelects.data('useType', 'local', {
                    arr: result.data
                });
                formSelects.data('useType2', 'local', {
                    arr: result.data
                });
            });
        }  


});