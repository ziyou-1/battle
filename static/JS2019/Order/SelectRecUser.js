 
layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util','table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
    });
    var userType = 0;
    var re = true;
    var indexLoad;
    var userRoleId = $("#defaultJobId").val();
    var taskId = $("#taskId").val();
    var gameName = $("#gameName").val();
    var userOrderBy = $("input[name='userOrderBy']:checked").val();
    var repeatedlyAss = $("#repeatedlyAss").val();
    var price = $("#price").val();
    var isAutoSwitch = $("#isAutoSwitch").val();
    var taskNeedJobId = $("#taskNeedJobId").val();
    
    var bussType = $("input[name='bussType']:checked").val();
    var originalRecUserDataCount = 0;
    var recUserId = -1
    var allUserList = [];
    var selectUserData = [];  
    getCurrentRecUserData();
    if (repeatedlyAss != "Y") { 
    }
    var isTips = false;
    var isOpenMoreOrderPerc = false;
    getAllUser();
    function getUrlParam(name) {
        const search = window.location.search.substring(1);
        const params = search.split('&');

        for (let i = 0; i < params.length; i++) {
            const pair = params[i].split('=');
            const paramName = decodeURIComponent(pair[0]);
            const paramValue = decodeURIComponent(pair[1] || '');
            if (paramName === name) {
                return paramValue;
            }
        }
        return '';
    }
    function getAllUser() {
        if (!re)
            return false;
        re = false;
        var uid = Number(getUrlParam('uid'))
        var game = getUrlParam('game')
        console.log(uid)
        $.ajax({
            type: "GET",
            url: '/UserAjax/GetAllUserTableByGameName',
            data: { gameName: game, taskId: taskId, userRoleId: userRoleId, key: $("#key1").val(), userOrderBy: userOrderBy,bussType:bussType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法读取用户数据，请稍候再试'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var userData = data.data;
                allUserList = userData;
                $(".user").html("");
                let html = "";
                $.each(userData, function (index, item) {
                    let ck = "";
                    let checkStr = item.id === uid ? 'checked' : ''
                    if (checkStr) {
                        selectUserData = [{ userId: item.id, userName: item.userName, fee: "0" }]
                    }
                    if (repeatedlyAss != "Y") {
                        for (let i = 0; i < selectUserData.length; i++) {
                            if (item.userName == selectUserData[i].userName) {
                                ck = 'checked="checked"';
                            }
                        }  
                    }  
                    html += '<div class="layui-input-inline" style="width:185px;" ><a href="#" lay-tips="' + item.userName + (item.taskIsHaveMe == "Y" ? '(此团已分配过该用户)' : '') + '（职位：' + item.roleName + '，标记：' + item.tips + '，备注：' + item.remark + '）"><input type="checkbox"  name="userList"' + checkStr +' lay-skin="primary" title="' + item.userName + '" value="' + item.id + '" userName="' + item.userName + '" lay-filter="userList" ' + ck + '/>' + (item.taskIsHaveMe == "Y" ? '<span class="layui-badge-dot layui-bg-blue"></span>' : '') +  (item.tips != '' && item.tips != null ? '<span class="layui-badge" title="' + item.tips + '">' + item.tips.substring(0, 1) + '</span>' : '')  + '</a></div>';
                });
                $(".user").append(html); 
                form.render('checkbox');
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    form.on('submit(addpbtn)', function (data) {
        if (data.field.remark == "") {
            larryms.msg('备注内容不能为空！', { time: 1000 }, function () {
            });
            return false;
        }
        var orderId = data.field.orderId;
        var remark = data.field.remark;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SaveOrderPublieMark",
            data: { orderId: orderId, remark: remark },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) {
                    layer.msg(sdata, { time: 800 }, function () {
                        var myDate = new Date();
                        var mon = parseInt(myDate.getMonth()) + 1;
                        var appHtml = '<p class="linespan" style="line-height:28px;margin-left:5px;">【' + mon + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes()
                        + '】' + remark + '</span>';
                        $('.logdiv').prepend(appHtml);
                        $("#remark").val('');
                    });
                }
                else {
                    layer.msg(sdata, { time: 1000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
        };
    }); 
    function reloadOrderList() { 
        getAllUser();
        return false;
    }
    form.on('radio(userRole)', function (data) {
        userRoleId = data.value;
        $(".saveConfigBtn").removeClass('layui-disabled');
        $(".saveConfigBtn").removeAttr('disabled');
        reloadOrderList();
    });
    form.on('radio(recUser)', function (data) {
        var id = data.value;
        recUserId = id
        if (id == 0 || id== 999999) {
            $('input[type="checkbox"][lay-filter="userList"]').prop('checked', false);
            layui.form.render('checkbox');
            $('.user').hide()
            selectUserData = []
            reloadTable2()
            $('#saveBtnPop').click()
        } else {
            $('.user').show()
        }
    });
    form.on('checkbox(userList)', function (data) {
        var id = data.value;
        var userName = data.elem.title;
        var reg = /<div class="layui-inline" lay-tips="此团已分配过该用户">/g;
        userName = userName.replace(reg, '');
        reg = /<\/div>/g;
        userName = userName.replace(reg, ''); 
        var orderHours = $("#orderHours").val();
        var orderProject = $("#orderProject").val();
        if (selectUserData.length >= 10 && data.elem.checked) {
            data.elem.checked = false
            layer.msg('最多同时可以勾选10名打手')
            return false
        }
        if (data.elem.checked)
        {
            for (let i = 0; i < selectUserData.length; i++) {
                if (selectUserData[i].userId == id) {
                    layer.msg(selectUserData[i].userName + '已指派过了，看当前订单分配接手人列表里');
                    return false;
                }
            }
            let model = {
                userId: id,
                userName: userName,
                fee: 0.0,
                hours: orderHours,
                project: orderProject
            };
            if (price > 0) {
                for (let u = 0; u < allUserList.length; u++) {
                    if (parseInt(id) === allUserList[u].id) {
                        if (allUserList[u].tichen > 0) {
                            if (allUserList[u].brokerageType === 20) {
                                model.fee = ((allUserList[u].tichen / 100) * price).toFixed(2);
                            }
                            else if (allUserList[u].brokerageType === 10) {
                                model.fee = allUserList[u].tichen;
                                }
                        }
                    }
                }
            }
            selectUserData.push(model);
            
            form.render('checkbox');
            reloadTable2();
            if (!isTips) {
                isTips = true;
                setTimeout(function () {
                    layer.tips('发单价是可以编辑的哦，单击试试吧', ".t0", {
                        tips: [3, '#2F4056'],
                        time: 4000,
                        tipsMore: false
                    });
                }, 1000);
            }
        } else {
            // 取消选中 
            for (let i = 0; i < selectUserData.length; i++) {
                if (selectUserData[i].userId == id) {
                    selectUserData.splice(i, 1);
                    break;
                }
            }
            let isCheck = $("input[name='autoAss']").is(':checked');
            if (parseInt(selectUserData.length) < 2) {
                $("[name='autoAss']").removeAttr("checked");
                if (isCheck) {
                    layer.tips('自动分配已关闭', ".autoSW", {
                        tips: [4, '#2F4056'],
                        time: 1500,
                        tipsMore: false
                    });
                }
            }
            reloadTable2();
            form.render('checkbox');
        }

        if (selectUserData.length > 0) {
            $('#clearBtnPop').show()
        } else {
            $('#clearBtnPop').hide()
        }
       
    });
    form.on('submit(seachBtn)', function (data) { 
        reloadOrderList();
        return false;
    });
    function getCurrentRecUserData() { 
        $.ajax({
            type: "GET",
            url: "/OrderAjax/GetOrderAssLogs?orderId=" + $("#orderId").val(),
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取当前接手人出错！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (repeatedlyAss != "Y") {
                    selectUserData = data.data;
                }
                //getAllUser();
                //得到原始接手人数量
                originalRecUserDataCount = selectUserData.length;
                loadDataTable2();
                let isCheck = $("input[name='autoAss']").is(':checked');
                if (parseInt(selectUserData.length) < 2) {
                    $("[name='autoAss']").removeAttr("checked");
                    if (isCheck) {
                        layer.tips('自动分配已关闭', ".autoSW", {
                            tips: [4, '#2F4056'],
                            time: 1500,
                            tipsMore: false
                        });
                    }
                }

                $(".user").html("");
                let html = "";
                var uid = Number(getUrlParam('uid'))
                $.each(allUserList, function (index, item) {
                    let ck = "";
                    if (repeatedlyAss != "Y") {
                        for (let i = 0; i < selectUserData.length; i++) {
                            if (item.userName == selectUserData[i].userName) {
                                ck = 'checked="checked"';
                            }
                        }
                    }
                    let checkStr = item.id === uid ? 'checked' : ''
                    if (checkStr) {
                        selectUserData = [{ userId: item.id, userName: item.userName, fee: "0" }]
                    }
                    html += '<div class="layui-input-inline" style="width:185px;" ><a href="#" lay-tips="' + item.userName + (item.taskIsHaveMe == "Y" ? '此团已分配过该用户' : '') + '（职位：' + item.roleName + '，标记：' + item.tips + '，备注：' + item.remark + '）" style="font-size:14px;color:red"><input type="checkbox"' + checkStr +' name="userList" lay-skin="primary" title="' + item.userName +'" value="' + item.id + '" userName="' + item.userName + '" lay-filter="userList" ' + ck + '/>' +  (item.tips != '' && item.tips != null ? '<span class="layui-badge" title="' + item.tips + '">' + item.tips.substring(0, 1) + '</span>' : '') + '</a></div>';
               });
                $(".user").append(html);
                form.render('checkbox'); 
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    var tableList2;
    function loadDataTable2() {
        tableList2 = table.render({
        elem: '#tableList2'
        , height: '150'
        , data: selectUserData
        , defaultToolbar: []
        , cols: [[
            {
                field: 'userName', title: '当前接手人', width: '40%', align: 'left', sort: false, templet: function (res) {
                    let vo = '<span class="" style="color:#FF5722">' + res.userName + '</span>';
                    return vo;
                }
            }
            , {
                field: 'fee', title: '<label id="ptitle">发单价(点击编辑)</label>', width: '40%',align:'center', edit: true, templet: function (res) {
                    let vo = '<a class="t0" style="color:#F3723A" title="预计给'+res.userName+'的发单价，点击可以编辑" href="javascript:void(0)">' + res.fee + '</a>';
                    return vo;
                }
            }
            , { fixed: '', title: '操作', width: '20%', align: 'center', toolbar: '#baroperating2', unresize: true, }
        ]]
        , page: false
        , done: function (res, curr, count) {
            }
        });
    } 
    function reloadTable2() {
        if (selectUserData.length > 1) {
            $(".assdiv").show();
        } else {
            $(".assdiv").hide();
        }
        tableList2.reload({
            data: selectUserData
              , where: {
              }
            , page: false
            , done: function (res, curr, count) {

            }
        });
    }
    table.on('tool(tableList2)', function (obj) {
        var data = obj.data; 
        if (obj.event === 'delAss') {
            var id = obj.data.userId;
            var userName=obj.data.userName;
            for (let i = 0; i < selectUserData.length; i++) {
                if (selectUserData[i].userId == id) {
                    selectUserData.splice(i, 1);
                    break;
                }
            }
            let isCheck = $("input[name='autoAss']").is(':checked');
            if (parseInt(selectUserData.length) < 2) {
                $("[name='autoAss']").removeAttr("checked");
                if (isCheck) {
                    layer.tips('自动分配已关闭', ".autoSW", {
                        tips: [4, '#2F4056'],
                        time: 1500,
                        tipsMore: false
                    });
                }
            } 
            reloadTable2();
            $("#saveBtn").removeClass('layui-disabled');
            $("#saveBtn").removeAttr('disabled'); 
            // 删除选中check
            $("input[name='userList']").each(function (index, elem) { 
                if (elem.title == userName) { 
                    this.checked = false;
                } 
            });
            form.render('checkbox');
        }
    });
    table.on('edit(tableList2)', function (obj) { 
        var stype=10;
        for (var i = 0; i < selectUserData.length; i++) {
            var item = selectUserData[i];
            if (item.userId === obj.data.userId) {
                if (stype === 10) { 
                    if (obj.value.length > 1) {
                        if (obj.value.substr(0, 1) === "0" && obj.value.substr(1, 1) != ".") {
                            obj.value = obj.value.substr(1);
                        }
                    }
                    item.fee = obj.value;
                }
            }
        }
            var totalPerc = parseFloat(0);
            for (var i = 0; i < selectUserData.length; i++) {
                var item = selectUserData[i];
                totalPerc = totalPerc + parseFloat(item.fee);
        }
        reloadTable2()

    });



    var autotipsmouseover;
    $(document).on('mouseover', '.autoTips', function () {
        autotipsmouseoverTips();
    });
    $(document).on('mouseleave', '.autoTips', function () {
        layer.close(autotipsmouseover);
    });
    function autotipsmouseoverTips() {
        autotipsmouseover = layer.tips('开启后，订单会采用和流水线作业一样的形式智能分配接手人。首先会将订单分配给第1个接手人，当第1个接手人提交完成后，系统会自动将订单指派给第2个接手人，当第2个接手人提交完成后，系统会自动将订单指派给第3个接手人，依此类推，直到最后一位接手人提交完成，订单才会进入待验收状态。', '.autoTips', {
            tips: [4, '#2F4056'],
            time: 30000,
            tipsMore: false
        });
    }
    form.on('submit(saveBtn)', function (data) {
        var orderID = data.field.orderId;
        var sphone = data.field.sphone;
        var isOpenThrowOrderPricePerce = isOpenMoreOrderPerc ? "Y" : "N";
        var totalPerc = parseFloat(0);
        for (var i = 0; i < selectUserData.length; i++) {
            var item = selectUserData[i];
            if (isOpenMoreOrderPerc) {
                if (!VerifyInt(item.fee)) {
                    layer.msg(item.userName + '的抛单百分比格式不正确，必须是整数，请重新编辑', { time: 2000 }, function () {
                    });
                    return false;
                }
                totalPerc = totalPerc + parseFloat(item.fee);
            } else {
                if (!VerifyMoeny(item.fee)) {
                    layer.msg(item.userName + '的抛单金额格式不对，请重新编辑', { time: 2000 }, function () {
                        return false;
                    });
                    return false;
                } 
            }
        }

        if (isOpenMoreOrderPerc) { 
           
            if (parseFloat(totalPerc).toFixed(2) > 100) {
                layer.msg('抛单总计百分比不能超过100%，请重新分配百分比', { time: 2500 }, function () {
                });
                return false;
            }
        } 

        var strParameter = JSON.stringify(selectUserData);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        var isAutoAss = data.field.autoAss == undefined ? "N" : "Y"; 
        if (selectUserData.length < 1 && originalRecUserDataCount > 0) {
            layer.confirm('请注意：发现并没有指派任何人，提交后这些订单的当前接手人将被清空，是否继续？', function (index) {
                postSave(orderID, strParameter, isAutoAss, sphone);
            });
        } else {
            postSave(orderID, strParameter, isAutoAss, sphone, isOpenThrowOrderPricePerce);
        } 
        return false;
    });
    form.on('submit(delBtn)', function (data) {
        var orderID = data.field.orderId;
        layer.confirm('提示：这个操作会清除该订单当前所有的接手人，是否继续？', function (index) {
            layer.confirm('是否需要同步删除代练接手人的绩效记录？', {
                btn: ['需要删除接手人绩效', '不需要删除接手人绩效']
            }, function () {
                cleanOrderRec(orderID, "Y", index);
            }, function () {
                cleanOrderRec(orderID, "N", index);
            }); 
        });
        return false;
    });
    function postSave(orderID, strParameter, isAutoAss, sphone, isOpenThrowOrderPricePerce) { 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/SetOrderZhiPaiByIDX",
            data: { orderId: orderID, strParameter: strParameter, isAutoAss: isAutoAss, sphone: sphone, isOpenThrowOrderPricePerce: isOpenThrowOrderPricePerce, taskNeedJobId: taskNeedJobId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        try {
                           parent.tools.reloadOrderData();
                        }catch (err) {}
                        try {
                            window.parent.reloadOrderData();
                        } catch (err) { } 
                        try {
                           execJs.closeWindow()
                        } catch (err) { } 
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
    }

    $("body").delegate("#saveBtnPop", "click", function () {
        if (selectUserData.length == 0 && recUserId == -1) {
            layer.msg('当选择指派打手时，选中的打手不能为空')
            return false
        }
        parent.receiveArrayFromIframe(selectUserData, recUserId);
    })
    $("body").delegate("#clearBtnPop", "click", function () {
        $('input[type="checkbox"][lay-filter="userList"]').prop('checked', false);
        layui.form.render('checkbox');
        selectUserData = []
        $('#clearBtnPop').hide()
        reloadTable2()
    })
    function cleanOrderRec(orderId, isDel, index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/CleanOrderZhiPaiByIDX",
            data: { orderId: orderId, isDelEmp: isDel },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                console.log('别看了，看也看不出个名堂');
                layer.close(index);
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (parent.tools) {
                            parent.tools.reloadOrderData();
                        } else {
                            window.parent.reloadOrderData()
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
    }
    form.on('submit(saveConfigBtn)', function (data) {
        var roleId = data.field.userRole; 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForAssSeachJobId",
            data: { roleId: roleId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    $(".saveConfigBtn").addClass('layui-disabled');
                    $(".saveConfigBtn").attr('disabled','');
                }
                layer.msg(data.msg, { time: 1000 }, function () {
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false; 
    });

    form.on('radio(bussTypechange)', function (data) {
        bussType = data.value;
        getAllUser();
    }); 
    form.on('radio(userOrderBy)', function (data) {
        userOrderBy = data.value; 
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForAssOrderByUserId",
            data: { orderBy: userOrderBy },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {  },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        getAllUser(); 
    }); 

    form.on('switch(orderPricePerc)', function (data) {
        isOpenMoreOrderPerc = data.elem.checked;
        if (isOpenMoreOrderPerc) {
            $("#ptitle").html('发单百分比(纯数字)');
            layer.tips('请在这里输入百分比数字，不需要带%号，例如：80，就代表按订单价格的80%设为发单价给打手', ".t0", {
                tips: [1, '#2F4056'],
                time: 8000,
                tipsMore: false
            });
        } else {
            $("#ptitle").html('发单价(点击编辑)');
            layer.tips('请在这里直接输入要给打手的价格（发单价）', ".t0", {
                tips: [1, '#2F4056'],
                time: 5000,
                tipsMore: false
            });
        }
    }); 
    
});
