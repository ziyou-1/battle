layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'ClipboardJS', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
        var ClipboardJS = layui.ClipboardJS;
        var table = layui.table;
        var devices = layui.device();
        var isPc = true;
        if (devices.android===true|| devices.ios===true) {
            isPc = false;
        } 
    var re = true;
    var isAllowAddModitySellAcc = $("#isAllowAddModitySellAcc").val();
        laydate.render({
            elem: '#disableTime'
            , type: 'datetime'
        });
    laydate.render({
        elem: '#stime'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#etime'
        , type: 'datetime'
    });
        var gameName = $("#gameName").find("option:selected").text();
        var currentGameArearData = [];
        var currentGameServerData = []; 
        var currentGameGroupData = []; 
        getGameArea();  
        getGameGroup(); 
    getAllRecUserData(); 
    getAccTipsList(); 
    getCustomerService();
        var indexLoad; 
        var page = 1;  
        var orders = ""; 
    var currentGid = 0;
    $(document).keyup(function (event) {
        getKey();
    });

    function getCustomerService() {
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
        });
    }


    function getKey() {
        if (event.keyCode == 13) {
            $(".seachBtn").trigger("click");
        }
    } 
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
            getAccTipsList();
            formSelects.data('gameServer', 'local', {
                arr: [
                ]
            }); 
            getAllRecUserData();
            getCustomerService();
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
    function getAccTipsList() {
        $("#tipsSelect").html('');
            $.ajax({
                type: "Post",
                url: "/GameAccountsAjax/GetAccTipsList",
                data: { gameName: gameName },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！');},
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {                   
                        var str = '<option value="">全部</option><option value = "none"> 没有标签</option><option value="have">有标签的</option>';
                        if (data.code > 0) {
                            data.data.forEach(function (item,index) {
                                str +='<option value="'+item+'">'+item+'</option>'
                            })
                        }
                    $("#tipsSelect").append(str);
                    form.render();                   
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            })
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
        function getAllRecUserData() {
            var soureData = [];
            $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName, function (result) {
                soureData = result.data;
                formSelects.data('recUser', 'local', {
                    arr: soureData
                });
            });
        } 
        
        var stime = $("#stime").val();
        var etime = $("#etime").val();
        var timeType = $("#timeType").val();
        var seachParam = 'gameName=' + gameName + '&stime=' + stime + '&etime=' + etime + '&timeType=' + timeType; 
        
        var tableList = table.render({
            elem: '#tableList'
            , url: '/GameAccountsAjax/GetGameAccList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width:30
                }
                 , {
                     field: 'gameAccId', title: '编号', align: 'center', width:70, align: 'left', unresize: false, templet: function (res) {
                         let acctype = '';
                         if (res.accType == 'B') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#9ACD32" lay-tips="订单账号">单</a>';
                         }
                         else if (res.accType == 'C') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" lay-tips="借用账号">借</a>';
                         }
                         else if (res.accType == 'D') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#1E9FFF" lay-tips="临时账号">临</a>';
                         }
                         else if (res.accType == 'E') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#5FB878" lay-tips="售卖账号">售</a>';
                         }
                         else if (res.accType == 'Z') {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#9463F7" lay-tips="出租账号">租</a>';
                         }
                         else {
                             acctype = '<a href="javascript:void(0);" class="lableb" style="background-color:#ff6a00" lay-tips="内部账号">内</a>';
                         }
                         return acctype + res.gameAccId;
                     }
                }
                , {
                    field: 'sellTradeNo', title:'卖出/出租单号', align: 'center', width:130, align: 'left', unresize: false
                }
                , {
                    field: 'gameRoleName', title: '角色名', width:95, unresize: false, templet: function (res) {
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
                    field: 'gameGroup', title: '阵营', align: 'center', width: 35,sort: false,unresize: true, templet: function (res) {
                        let group = '<span title="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
                        if (res.gameGroup == "LM" || res.gameGroup == "lm" || res.gameGroup == "联盟") {
                            group = '<span title="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
                        }
                        return group
                    }
                }
                , {
                    field: 'gameInfo', title: '区服信息', width: 118,  unresize: false, templet: function (res) {
                        var area = res.gameArea;
                        var server = res.gameServer;
                        var job = res.gameJob;

                        return '<span lay-tips="区服：' + area + '/' + server + '/' + job + '">' + area + '/' + server + '/' + job + '</span>';
                    }
                }
                , {
                    field: 'gameTF', title: '当前信息1', minWidth:115, unresize: false, templet: function (res) {    
                        return '<span lay-tips="当前信息1：' + res.gameTF + '">' + res.gameTF + '</span>';
                    }
                }
                , {
                    field: 'otherLevel', title: '当前信息2', minWidth:110, unresize: false, templet: function (res) {
                        return '<span lay-tips="当前信息2：' + res.otherLevel + '">' + res.otherLevel + '</span>';
                    }
                }
                , {
                    field: 'otherMark', title: '当前信息3', minWidth: 110, align: 'left', unresize: false, sort: false, templet: function (res) {
                        return '<span lay-tips="当前信息3：' + (res.otherMark == null ? "" : res.otherMark) + '">' + (res.otherMark == null ? "" : res.otherMark) + '</span>';
                    }
                }
                , {
                    field: 'Tips', title: '标签', width:80, unresize: false, templet: function (res) {
                        return '<span style="color:#FF5722" lay-tips="' + res.Tips + '">' + res.Tips + '</span>';
                    }
                }
                , {
                    field: 'gameAcc', title: '游戏账号', width:80, unresize: false, templet: function (res) {
                        let div = '<span style="color:#5BB75B">' + res.gameAcc + '</span>';
                        return div;
                    }
                }
                , {
                    field: 'costPrice', title: '成本价', width: 60, align: 'center', unresize: false, hide: true
                }
                , {
                    field: 'sellPrice', title: '售价', width:60, align: 'center', unresize: false, event:'changeprice',templet: function (res) {
                        let div = '<span style="color:#FF534D" lay-tips="' + res.sellPrice+'">' + res.sellPrice + '</span>';
                        return div;
                    }
                }
                , {
                    field: 'profit', title: '利润', width: 60, align: 'center', unresize: false, hide: true, templet: function (res) {
                        let div = '<span style="color:#FF534D" lay-tips="利润=售价-成本价">' + (res.sellPrice - res.costPrice) + '</span>';
                        return div;
                    }
                }
                , {
                    field: 'accStatus', title: '账号状态', width:65, align: 'center', unresize: false, templet: function (res) {
                        let title = '正常';
                        let colorStr = '#b0aeae;';
                        switch (res.accStatus) {
                            case 20:
                                colorStr = '#585858';
                                title = '库存中';
                                break;
                            case 21:
                                colorStr = '#FF5722';
                                title = '已卖出';
                                break;
                            case 50:
                                colorStr = '#9463F7';
                                title = '出租中';
                                break;
                            case 55:
                                colorStr = '#006EE9';
                                title = '密码错误';
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
                        let str = '<a href="javascript:void(0)" class="lableb setaccstatus" data-id="' + res.gameAccId + '" title="' + title + '中，点击可以更改订单状态" style="background-color:' + colorStr + ';">' + title+ '</a>';

                        return str;
                    }
                }
                , {
                    field: 'accUseType', title: '用途类型', width:65, align: 'center', unresize: false, templet: function (res) {
                        let title = res.accUseType;
                        let str = '<a href="javascript:void(0)" class="setusetype" style="color:#37474F" data-id="' + res.gameAccId + '" data-value="' + res.accUseType+'" title="' + title + '，点击可以更改">' + (title==null||title==''?'无':title) + '</a>';

                        return str;
                    }
                }
                , {
                    field: 'recUserName', title: '接手人', align: 'center', width:70, unresize: false, templet: function (res) {
                        var DLStaffClass = (res.recUserName == null || res.recUserName == "") ? "layui-btn layui-btn-xs layui-btn-normal jsr" : " jsr";
                        var DLStaffTxt = (res.recUserName == null || res.recUserName == "" || res.recUserName == '/') ? "指派接手" : res.recUserName
                        
                        return '<a style="margin-right:0;" class="' + DLStaffClass + '" href="javascript:void(0)" data-id="' + res.gameAccId + '" title="' + DLStaffTxt + '">' + DLStaffTxt + '</a>'
                    }
                }
                , {
                    field: 'createTime', title: '入库时间', width: 85, align: 'center', unresize: false, sort: true, templet: function (res) {
                        return '<span>' + res.createTime + '</span>';
                    }
                }
                , {
                    field: 'tempDisableTime', title: '解/卖/租时', width:85, align: 'center', unresize: false, sort: true, templet: function (res) {
                        let vo = '<span lay-tips="解封时间：' + (res.tempDisableTime || '') + '">' + (res.tempDisableTime || '') + '</span>';
                        if (res.accStatus == 21) {
                            vo = '<span lay-tips="卖/租时间：' + (res.sellTime || '') + '">' + (res.sellTime || '') + '</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'img', title: '账号截图', width: 90, align: 'center', unresize: false, sort: false, templet: function (res) {
                        if (isAllowAddModitySellAcc == "N") {
                            if (res.accType == "E" || res.accType=="Z") {
                                return '';
                            }
                        }
                        return '<div class="layui-btn-group" style="background: white;">' +
                            '<a class="layui-btn layui-btn-xs layui-btn-normal upImg" style="margin-right: 2px" lay-submit="" data-id="' + res.gameAccId + '" title="上传截图">上传</a>' +
                            '<a class="layui-btn layui-btn-xs layui-btn-normal mangeImg" style="margin-right: 2px" lay-submit="" data-id="' + res.gameAccId + '" title="查看截图">查看</a>'
                            + '</div>'
                    }
                }
                , {
                    field: 'remark', title: '备注', width:70, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + res.remark + '" style="color:#E03636" class="orderRemark"  data-id="' + res.gameAccId + '" data-remark="' + res.remark + '" data-role="' + res.gameRoleName + '">' + (res.remark != null&&res.remark!='' ? res.remark : "无") + '</a>';
                    }
                }
                , {
                    field: 'jiwei', title: '机位', width:40, unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" title="' + res.jiwei + '，点击可更改" style="color:#76838F" class="setjiwei"  data-id="' + res.gameAccId + '" data-jiwei="' + res.jiwei + '">' + (res.jiwei != null && res.jiwei != '' ? res.jiwei : "无") + '</a>';
                    }
                }
                , {
                    fixed: 'right', title: '操作', width:92, align: 'left', unresize: true, templet: function (res) {
                        let btn1 = ' <a class="layui-btn layui-btn-xs layui-btn-warm editAcc" lay-tips="点击我可以编辑这个账号资料" data-id="' + res.gameAccId + '" data-roleName="' + res.gameRoleName+'" style="margin-right:1px;" title="编辑">编辑</a>';
                        let btn2 = ' <a class="layui-btn layui-btn-xs layui-btn-danger sellAcc" lay-tips="点击我可以操作"' + (res.accType == "Z" ? "出租" : "卖出") + ' data-id="' + res.gameAccId + '" data-roleName="' + res.gameRoleName + '" data-acctype="' + res.accType + '" style="margin-right:1px;margin-left: 0px;" title="编辑">' + (res.accType == "Z" ? "出租" : "卖出")+'</a>';
                        return btn1+btn2;
                    }
                }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50,100]
            , done: function (res, curr, count) {
                page = curr;
                var str = '本次搜索条件下共计' + res.count + '条记录';
                //if ($("#accStatus").val() == 21) {
                //    str += ',其中已卖出共计' + res.totalSellPrice+'元';
                //}
                str += ',总成本价' + res.totalCostPrice + '元，其中已卖出共计' + res.totalSellPrice + '元，共预计利润' + (res.totalSellPrice - res.totalCostPrice)+'元';
                $("#total").html(str);
                if (gameName !='魔兽世界') {//此处test为你的条件值
                    $("[data-field='gameGroup']").css('display', 'none'); //关键代码
                }
            }
        }); 
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break; 
                case 'setRecMan': 
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
                    setRecGameAcc(gameAccId);
                    break; 
                case 'exportBtn': 
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    if (parseInt(checkStatus.data.length) > 50) {
                        layer.msg('最多一次只能勾选50条记录');
                        return false;
                    }
                    exportByType();
                    break; 
                case 'delOrderBtn':
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
                    delOrder(gameAccId);
                    break;
                case 'setChangeUseStatus':
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
                    changeUseStatus(gameAccId);
                    break;
                case 'setChangeUseType':
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
                    changeUseType(gameAccId);
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
                case 'setChangeprice':
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
                    Changeprice(gameAccId, 10,'');
                    break;
                case 'setChangecost':
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
                    Changeprice(gameAccId, 20,'');
                    break;
                case 'getAccUseInfo':
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
                    getGameAccUseInfo(gameAccId);
                    break;
                case 'getAccPrivateInfo':
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
                    getGameAccPrivateInfo(gameAccId);
                    break;
                case 'sendMsgBtn':
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
                    sendSms(gameAccId);
                    break;
                case 'exportTXTBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].gameAccId);
                        };
                        gameAccId = tempData.join(',');
                    }
                    exportAcc(gameAccId,20);
                    break; 
                    
            };
        }); 
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
            if (obj.event === 'submitEdit') {
                var gameAccId = obj.data.gameAccId;
                var gameRoleName = obj.data.gameRoleName;
                editAcc(gameAccId, gameRoleName);
                return false;
            }
            if (obj.event == 'changeprice') {
                var gameAccId = obj.data.gameAccId;
                Changeprice(gameAccId,10,'')
            }
        }); 
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        });        
        function sendSms(gid) {
            layer.open({
                title: "对指定账号发送短信",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '380px'],
                content: '/Order/SendSms?orderId=' + gid+'&type=1'
            });
        }
        function reloadOrderList() {
            var gameArea = formSelects.value('gameArea', 'nameStr');
            var gameServer = formSelects.value('gameServer', 'nameStr');
            var groupName = formSelects.value('gameGroup', 'nameStr');   
            var accType = formSelects.value('accType', 'valStr'); 
            var recUser = formSelects.value('recUser', 'valStr'); 
            var skey1 = $("#key1").val();
            var info2key = $("#info2key").val();
            var gameAcc = $("#gameAcc").val(); 
            var accStatus = $("#accStatus").val();
            var useType = formSelects.value('useType', 'valStr'); 
            var proStatus = $("#proStatus").val();
            var tipsSelect = $("#tipsSelect").val() == null ? '' : $("#tipsSelect").val();
            var tipstxt = $("#tipstxt").val();
            var stime = $("#stime").val();
            var etime = $("#etime").val();
            var timeType = $("#timeType").val();
            var sellUid = formSelects.value('inputOrderKefu', 'valStr');
            var remarktext = $("#remarktext").val();
            //console.log()
            if (tipstxt != '' && tipstxt != null && tipstxt != undefined) {
                tipsSelect = tipstxt;
            }
            var sellNo = $("#sellNo").val();
            seachParam = 'gameName=' + gameName + '&accType=' + accType + '&sellNo=' + sellNo + '&gameArea=' + gameArea + '&gameServer=' + gameServer + '&recUserId=' + recUser + '&groupName=' + groupName + '&key3=' + skey1 + '&key2=' + gameAcc + '&info2key=' + info2key + '&accStatus=' + accStatus + '&useType=' + useType + '&proStatus=' + proStatus + '&tipsSelect=' + tipsSelect + '&stime=' + stime + '&etime=' + etime + '&timeType=' + timeType + '&sellUid=' + sellUid + '&remark=' + remarktext;

            tableListReload();

            return false;
        } 
        function tableListReload(){
            tableList.reload({
                url: '/GameAccountsAjax/GetGameAccList?' + seachParam
                , where: { 
                }
                , page: {
                    curr: page
                }
                , done: function (res, curr, count) {
                    var str = '本次搜索条件下共计' + res.count + '条记录';
                    str += ',总成本价' + res.totalCostPrice + '元，其中已卖出共计' + res.totalSellPrice + '元，共预计利润' + (res.totalSellPrice - res.totalCostPrice) + '元';
                    $("#total").html(str);
                    if (gameName != '魔兽世界') {//此处test为你的条件值
                        $("[data-field='gameGroup']").css('display', 'none'); //关键代码
                    }
                }
            });
            return false;
    }
    function Changeprice(gameAccId,status,val) {
        currentGid = gameAccId;
        console.log(status)
        var title = status == 10 ? '修改账号售价' : '修改成本价';
        layer.prompt({ title: title, formType: 0, value:val, maxlength: 25 }, function (value, index, elem) {
            var reg = /^[1-9]\d*$|^0$/;
            //reg = /^\d+$/;
            if (!reg.test(value)) {
                layer.msg('价格只能填写整数')
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAccountsAjax/ChangeGameAccountPrice",
                data: { idx: gameAccId, changeType: status, fee: value},
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

        function editAcc(gameAccId, gameRoleName) {
        currentGid = gameAccId;
            layer.open({
                title: "编辑账号：" + gameRoleName,
                shade: [0.3, '#333'],
                shadeClose: true,
                maxmin: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '95%'],
                content: 'AddEditAccount?gameAccId=' + gameAccId
            });
        }
        $(document).on('click', '.jsr', function () {
            var ids = $(this).attr('data-id');
            setRecGameAcc(ids);
        });
        function setRecGameAcc(accId) {
            if (accId == null || accId == '') {
                return false;
            }
            layer.open({
                title: "账号指派接手人",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['60%', '90%'],
                content: '/GameAccounts/AssignationGamAcc?gameAccId=' + accId
            });
        }
        $(document).on('click', '.changeRoleName', function () {
            var ids = $(this).attr('data-id');
            var rolename = $(this).attr('data-rolename');
            setOrderGameRoleName(ids, rolename);
        });
        function setOrderGameRoleName(orderID, rolename) {
            layer.prompt({ title: '编辑订单角色名，若没有请写无', formType: 0, value: rolename, maxlength: 25 }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/ChangeOrderGameRoleNameByOrderId",
                    data: { orderId: orderID, newRoleName: value },
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
        function delOrder(accId) {
            layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理', function (index) { 
                delAccPost(accId, index);
            }); 
            return false;
        }
        function delAccPost(accId, index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAccountsAjax/DelGameAccountByIDX",
                data: { gameAccId: accId },
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
                        layer.msg(data.msg, { time: 2000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) { 
                    layer.close(indexLoad);
                }
            });
    }



    function exportAcc(acc, type) {
        window.open("/GameAccounts/ExportGameAccountByIDX?accId=" + acc + "&type=" + type, "_blank");
            return false;
    }

    //导出账号信息
    function exportByType()
    {
        layer.open({
            title: "选择导出格式",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['500px', '300px'],
            content: $('#hidDiv')
        });
    }


    $("#exportBtn").on('click', function () {
        var tempData = [];
        var checkStatus = table.checkStatus("tableList"); 
        if (parseInt(checkStatus.data.length) > 0) {
            var data = checkStatus.data;
            for (let i = 0; i < data.length; i++) {
                tempData.push(data[i].gameAccId);
            };
            gameAccId = tempData.join(',');
            var redioType = $("input[name='importConten']:checked").val();
            var type = redioType > 1 ? 30 : 10;
            var importDataType = $("input[name='importDataType']:checked").val();
            if (importDataType == 2) {
                window.open("/GameAccounts/ExportGameAccountBySeach?" + seachParam + "&type=" + type, "_blank");
            } else {
                window.open("/GameAccounts/ExportGameAccountByIDX?accId=" + gameAccId + "&type=" + type, "_blank");
            }
            return false;
        }
    });


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
        function changeUseStatus(idx) {
            selectIdx = idx;
            $("#disableTime").val('');
            settLayerIndex = layer.open({
                title: "更改账号使用状态",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['795px', '280px'],
                content: $(".setAccountUseStatus")
            });
            return false;
    }
        function changeUseType(idx) {
            selectIdx = idx;
            getUseType();
            settLayerIndex = layer.open({
                title: "更改账号用途类型",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['40%', '280px'],
                content: $(".setAccountUseType")
            });
            return false;
    }
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
        function getGameAccUseInfo(idx) {
            window.open("/GameAccounts/ExportGameAccountUseInfo?accId=" + idx, "_blank");
            return false;
         }
        function getGameAccPrivateInfo(idx) {
            window.open("/GameAccounts/ExportGameAccountPrivateInfo?accId=" + idx, "_blank");
            return false;
        }
        form.on('radio(accStatusRd)', function (data) {
            if (data.value == 30) {
                $(".ftime").show();
            } else {
                $(".ftime").hide();
            }
        });
        form.on('radio(accProStatusRd)', function (data) {
            if (data.value == 60 || data.value == 70) {
                $("#yytext").val('');
                $("#yytext").focus();
                    $(".yy").show();
                } else {
                    $(".yy").hide();
                }
            });
        form.on('submit(saveChangeUseStatusbtn)', function (data) {
        if (data.field.accStatus == 30 && (data.field.disableTime == "" || data.field.disableTime == null || data.field.disableTime == undefined)) {
            layer.alert("请选择封号到期时间！", {
                    title: '提示'
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAccountsAjax/ChangeGameAccountUseStatus",
                data: { idx: selectIdx, status: data.field.accStatus, ftime: data.field.disableTime },
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
        $(document).on('click', '.setaccstatus', function () {
            var ids = $(this).attr('data-id');
            changeUseStatus(ids);
            return false;
        });
        $(document).on('click', '.setusetype', function () {
            var ids = $(this).attr('data-id');
            changeUseType(ids);
            return false;
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
        $(document).on('click', '.editAcc', function () { 
            var gameAccId = $(this).attr('data-id');
            var gameRoleName = $(this).attr('data-roleName');
            editAcc(gameAccId, gameRoleName);              
        });
        $(document).on('click', '.sellAcc', function () {
            var gameAccId = $(this).attr('data-id');
            var gameRoleName = $(this).attr('data-roleName');
            var acctype = $(this).attr('data-acctype');
            sellAcc(gameAccId, gameRoleName, acctype);
        });
    function sellAcc(gameAccId, gameRoleName, acctype) {
            currentGid = gameAccId;
            settLayerIndex=layer.open({
                title: (acctype=="Z"?"出租":"卖出")+"账号：" + gameRoleName,
                shade: [0.3, '#333'],
                shadeClose: false,
                maxmin: false,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['480px','680px'],
                content: $(".sellAccDiv")
            });
        }
        form.on('radio(sellChoee)', function (data) {
        if (data.value == '') {
            $(".otherSell").show();
            $("#otherSellChoee").focus();
        } else {
            $(".otherSell").hide();
        }
    });     
        form.on('submit(saveChangeUseTypebtn)', function (data) {
        let useType = formSelects.value('useType2', 'nameStr');
        if (useType == "" || useType == null || useType == undefined) {
            layer.alert("请选择用途或者自定义一个", {
                title: '提示'
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAccountsAjax/ChangeGameAccountUseType",
            data: { idx: selectIdx, useType: useType },
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
        form.on('submit(confimSellbtn)', function (data) {
            if (currentGid < 1) {
                layer.alert('无法获取要卖出的ID，请刷新页面再试');
                return false;
            }
            var sellPrice = data.field.sellPriceInput;
            if (!VerifyMoeny(sellPrice)) {
                layer.alert('输入的价格格式不对');
                return false;
            }
            var sellChoee = data.field.sellChoee;
            var otherSellChoee = data.field.otherSellChoee;
            var tradeNo = data.field.sellTradeNoInput;
            var changeBindPhone = data.field.changeBindPhone;
            if (sellChoee == '') {
                if (otherSellChoee == '') {
                    layer.alert('请输入卖出渠道');
                    $("#otherSellChoee").focus();
                    return false;
                } else {
                    sellChoee = otherSellChoee
                }
            } 
            $("#sellPriceInput").val('');
            $("#otherSellChoee").val('');
            $("#sellTradeNoInput").val('');
            $("#changeBindPhone").val('');
            $(".getAccInfo").html('');

            layer.confirm('确认这个账号卖出/出租吗?', { icon: 3, title: '提示' }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/GameAccountsAjax/SellAccAction",
                    data: { gid: currentGid, sellPrice: sellPrice, sellChoee: sellChoee, tradeNo: tradeNo, changeBindPhone: changeBindPhone },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('数据请求出现异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        if (data.code > 0) {
                            reloadOrderList();
                            layer.close(settLayerIndex);
                            getSellAccInfo(currentGid);
                        }
                        else {
                            layer.msg(data.msg, { time: 1500 }, function () {
                                return false;
                            });
                        }
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
                layer.close(index);
            });
            return false;
        });
        function getSellAccInfo(gid) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAccountsAjax/SellAccGetInfo",
                data: { gid: gid},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        let html = '';
                        $(".getAccInfo").html('<span style="color:red;font-size:14px">'+data.msg+'</span>');
                        html += '<div  style="margin-top:15px" type="submit" class="layui-btn layui-btn-primary copycontent" data-content="' + data.msg + '" data-clipboard-text="' + data.msg + '">一键复制</div>';
                        $(".copyCon").html(html);
                        settLayerIndex = layer.open({
                            title: "请复制账号信息",
                            shade: [0.3, '#333'],
                            shadeClose: false,
                            maxmin: false,
                            type: 1,
                            skin: 'layui-layer-lan',
                            anim: 8,
                            area: ['580px', '380px'],
                            content: $(".sellAccInfoDiv")
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 1500 }, function () {
                             layer.close(settLayerIndex);
                             reloadOrderList();
                        });
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        }
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
        var copyPriceClipboard = new ClipboardJS('.copycontent');
        copyPriceClipboard.on('success', function (e) {
            layer.msg('复制成功', { time: 1000 });
            e.clearSelection();
        });
        copyPriceClipboard.on('error', function (e) {
            layer.msg('复制失败了，请手动复制', { time: 1000 });
        });
    var copyPriceClipboard2 = new ClipboardJS('.copyurl');
    copyPriceClipboard2.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
    });
    copyPriceClipboard2.on('error', function (e) {
        layer.msg('复制失败了', { time: 1000 });
    });
});