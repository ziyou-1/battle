
layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'element', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        element = layui.element,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var layerWindows;
    var layid = location.hash.replace(/^#to=/, '');
    element.tabChange('to', layid);
    element.on('tab(to)', function (elem) {
        location.hash = 'to=' + $(this).attr('lay-id');
    });
    form.on('submit(saveBtn1)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (strparameter == null || strparameter == "" || strparameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveTripartitlePlatForm",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    location.reload(true);
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

    var tableList = table.render({
        elem: '#tableList'
        , height: 'full'
        , url: '/SystemAjax/GetTransfromInterfaceList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'platformName', title: '平台名称', width: 105, align: 'center', unresize: false
            },
            {
                field: 'platformAcc', title: '平台账号/ID', width: 170, align: 'left', unresize: false
            },
            {
                field: 'appId', title: 'AppId', width: 150, align: 'left', unresize: false
            }, {
                field: 'isFillPlatmPayPwd', title: '支付密码', width:100, align: 'center', unresize: false, templet: function (res) {
                    if (res.isFillPlatmPayPwd) {
                        return '<span class="layui-icon layui-icon-ok-circle modityPlatmPayPwd" style="color:#16b777;font-size:24px" data-id="'+res.id+'" lay-tips="已设置平台支付密码，点击可以更改"></span>';
                    }
                    else {
                        return '<span class="layui-badge modityPlatmPayPwd" data-id="' + res.id +'" lay-tips="还没有设置平台支付密码，点击快速设置">点击设置</span>';
                    }
                }
            },
            {
                field: 'status', title: '是否启用', width: 100, align: 'center', unresize: false, templet: '#switchTpl1'
            }, {
                field: 'isDefault', title: '默认账号', width: 100, align: 'center', unresize: false, templet: '#switchTpl5'
            },
            {
                field: 'isAutoAccep', title: '同步验收', width: 100, align: 'center', unresize: false, templet: '#switchTpl2'
            },
            {
                field: 'isNotifyPushMan', title: '接单短信通知', width: 105, align: 'center', unresize: false, templet: '#switchTpl3'
            },
            {
                field: 'isAutoSelect', title: '发单包含', width: 100, align: 'center', unresize: false, templet: '#switchTpl4'
            },
            {
                field: 'concactQQ', title: '发单联系QQ', width: 120, align: 'left', unresize: false
            }
            ,
            {
                field: 'concactPhone', title: '发单联系电话', width: 120, align: 'left', unresize: false
            }
            ,
            {
                field: 'remark', title: '备注说明', width: 100, align: 'left', unresize: false
            }
            , { fixed: '', title: '操作', width: 170, align: 'center', toolbar: '#baroperating', unresize: false, }
        ]]
        , page: false
        , done: function (res, curr, count) {
            if (res.msg.indexOf('权限') > -1) {
                layer.msg(res.msg);
            }
        }
    });
    function reloadOrderList() {
        tableList.reload({
            url: '/SystemAjax/GetTransfromInterfaceList'
            , where: {
            }
            , page: false
        });
        return false;
    }
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addShop(0, 0, '', '', '', '', '', '');
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.id;
            delShop(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var platforms = obj.data.platformId;
            var remark = obj.data.remark;
            var plaftacc = obj.data.platformAcc;
            var appId = obj.data.appId;
            var concactQQ = obj.data.concactQQ;
            var concactPhone = obj.data.concactPhone;

            addShop(id, platforms, plaftacc, appId, '', remark, concactQQ, concactPhone);
            return false;
        }
    });
    function addShop(id, platforms, plaftacc, appId, appSecret, remark, concactQQ, concactPhone) {
        resetaddmodifyform();
        $('input[name=platforms]').prop('checked', false);
        form.render('radio');

        form.val("form", {
            "platforms": platforms,
            "plaftacc": plaftacc,
            "plaftpaypwd": '',
            "appId": appId,
            "appSecret": appSecret,
            "remark": remark,
            "ptid": id,
            "concactQQ": concactQQ,
            "concactPhone": concactPhone
        });
        if (id > 0) {
            $("#plaftpaypwd").attr("placeholder", '若没有改过，请不要动此处');
            openmodifydivview(platforms);
        } else {
            $("#plaftpaypwd").attr("placeholder", '请输入交易平台的支付密码');
        }
        layerWindows = layer.open({
            title: id > 0 ? "编辑对接" : "新增一个代练平台对接",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '676px' : '95%', isPc ? '620px' : '95%'],
            content: $('.modifyParamDiv')
        });
        return false;
    }
    function delShop(id) {
        layer.confirm('是否确认删除这个对接账号？提示：删除此对接账号不会影响之前用这个账号发过单的交易操作', {
            btn: ['确认删除', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelTransfromInterface",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
    form.on('radio(platforms)', function (data) {
        resetaddmodifyform();
        var pltid = data.value;
        openmodifydivview(pltid);
    });
    function openmodifydivview(pltid) {
        if (pltid == 8) {
            $(".platacclabel").html('平台账号');
            $(".platloginpwddiv").show();
            $(".platappiddiv").hide();
            $(".platappsecretlabel").html('对接秘钥');
            $(".platappsecretdiv").show();
            $(".platpaypwddiv").hide(); 
            $(".pt0").show();
        }
        else if (pltid == 10) {
            $(".platacclabel").html('代练通用户ID');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 30 || pltid == 80 || pltid == 90) {
            //$(".plataccdiv").hide();
            $(".platacclabel").html('平台用户ID');
            $(".platappidlabel").html('商户标识');
            $(".platappsecretlabel").html('商户密钥');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 40) {
            $(".platpaypwddiv").hide();
            $(".platacclabel").html('身份认证密钥');
            $(".platappidlabel").html('加密密码');
            $(".platappsecretlabel").html('加密偏移量');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 50) {
            $(".platacclabel").html('平台账号');
            $(".platloginpwddiv").show();
            $(".platappiddiv").hide();
            $(".platappsecretlabel").html('对接秘钥');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 92) {
            $(".platacclabel").html('平台账号');
            $(".platloginpwddiv").show();
            $(".platappiddiv").hide();
            $(".platappsecretdiv").hide();
            $(".pt0").hide();
        }
        else if (pltid == 60 || pltid == 100) {
            //$(".plataccdiv").hide();
            $(".platappidlabel").html('AppId');
            $(".platappsecretlabel").html('AppSecret');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 70) {
            $(".platacclabel").html('平台账号');
            $(".platappiddiv").hide();
            $(".platpaypwddiv").hide();
            $(".platappsecretlabel").html('附加码');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 80) {
            //$(".plataccdiv").hide();
            $(".platappidlabel").html('AppId');
            $(".platappsecretlabel").html('AppSecret');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 93) {
            //$(".plataccdiv").hide();
            $(".platacclabel").html('User_Code');
            $(".platappsecretlabel").html('对接密钥');
            $(".platappiddiv").show();
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
        else if (pltid == 94) {
            $(".plataccdiv").hide();
            $(".platappsecretlabel").html('AppSecret');
            $(".platappsecretdiv").show();
            $(".pt0").hide();
            //$(".platappsecretdiv1").show();
        }
        else {
            $(".platappsecretdiv").show();
            $(".pt0").hide();
        }
    }
    function resetaddmodifyform() {
        $(".plataccdiv").show();
        $(".platpaypwddiv").show();
        $(".platloginpwddiv").hide();
        $(".platappiddiv").show();
        $(".platacclabel").html('平台用户ID');
        $(".platappidlabel").html('AppId');
        $(".platappsecretlabel").html('AppSecret');
    }
    $('.saveInterfaceBtn').on('click', function () {
        var pid = $("#ptid").val();
        var platforms = $('input[type=radio][name=platforms]:checked').val();
        var plaftacc = $("#plaftacc").val();
        var plaftloginpwd = $("#plaftloginpwd").val();
        var plaftpaypwd = $("#plaftpaypwd").val();
        var appId = $("#appId").val();
        var appSecret = $("#appSecret").val();
        var remark = $("#remark").val();
        var concactQQ = $("#concactQQ").val();
        var concactPhone = $("#concactPhone").val();
        if (platforms == "" || platforms == undefined || platforms == null) {
            layer.msg('请选择一个平台');
            return false;
        }
        if (platforms != 92 && platforms != 50 && platforms != 93 && platforms != 8) {
            if (appId == '' || appId == 'undefined') {
                layer.msg('AppId不能为空');
                return false;
            }
        }

        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/SaveTransfromInterfaceAddModify",
            data: { id: pid, platformId: platforms, platformAcc: plaftacc, platformLoginPwd: plaftloginpwd, platformPayPwd: plaftpaypwd, appId: appId, appSecret: appSecret, remark: remark, concactQQ: concactQQ, concactPhone: concactPhone },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(layerWindows);
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
    })
    form.on('switch(staChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        modifyInterfaceHelper(id, 10);
    });
    form.on('switch(defaultChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        modifyInterfaceHelper(id, 50);
    });
    form.on('switch(isAutoAccepChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        modifyInterfaceHelper(id, 20);
    });
    form.on('switch(isNotifyPushManChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        modifyInterfaceHelper(id, 30);
    });
    form.on('switch(isAutoSelectChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        modifyInterfaceHelper(id, 40);
    });
     
    function modifyInterfaceHelper(id, modifyId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ModifyTransfromInterfaceHelperSwitch",
            data: { id: id, modifyType: modifyId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                re = true;
                reloadOrderList();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $(document).on('click', '.modityPlatmPayPwd', function () {
        var id = $(this).attr('data-id'); 
        layer.prompt({ title: '请填充平台的支付密码', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: '' }, function (value, index, elem) {
            if (!re)
                return false;
            re = false; 
            $.ajax({
                type: "Post",
                url: "/SystemAjax/ModifyPlatformPayPassWord",
                data: { id: id, pwd: value },
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
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            //不关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});