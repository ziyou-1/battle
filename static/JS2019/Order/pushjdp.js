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
    var indexLoad; 
    var device = isPc;
    var tempteId = 0;
    var tempData = [];
    var gameName = $("#tGameName").val();
    var gtype = $("#gtype").val();
    var ugtxlogs = null;
    getGame();
    var isReadTP = 0;
    function loadMark(gameName)
    {     
    }   
    form.on('select(pushChannel)', function (data) {
        if (data.value == "USER" || data.value == "GROUP") {
            $(".ugdiv").show();
            $("#ugtext").focus();
        }
        else {
            $(".ugdiv").hide();
            $("#ugtext").val('');
        }
    });
    getugtextlog();
    $("input[name=ugtext]").on('focus',function (e) {       
        if (ugtxlogs) {
            $(".seleurtext").show();
        }
        return false;
    })
    function getugtextlog() {
        $('.seleurtext').html('');
        $.ajax({
            type: "POST",
            url: "/OrderAjax/GetPushPlatfromAssisUserLog",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    ugtxlogs = data.data;
                    var str = "";
                    data.data.forEach(function (item,index) {
                        str += '<div class="item" data-id="' + item + '"><span>' + item + '</span><span class="del" title="删除记录" style="color:' + (device ?'#fff;':'#666;')+'" data-id="' + item+'">X</span></div>';
                    })
                    $('.seleurtext').append(str);

                    $('.seleurtext').on('click', '.item', function (e) {
                        let id = e.currentTarget.dataset.id;
                        $('input[name=ugtext]').val(id)                      
                        form.render();
                        $(".seleurtext").hide()
                    })

                    $('.seleurtext .del').on('click', function (e) {
                        e.stopPropagation();
                        let id = e.currentTarget.dataset.id;
                        ugtextdelfun(id)
                    })
                   
                    $(document).bind("click", function (e) {
                        var target = $(e.target);
                        if (target.closest(".ugtextarea").length == 0) {//点击id为sibader之外的地方触发
                            $(".seleurtext").hide()
                        }
                    })
                }
                else {  
                    ugtxlogs = null;
                    $(".seleurtext").hide();
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    function ugtextdelfun(id) {
        $.ajax({
            type: "POST",
            url: "/OrderAjax/DelPushPlatfromAssisUserLog",
            data: {value:id},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    getugtextlog();
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    function getGame() { 
        loadMark(gameName);
    }
    var newTemplateLayer;
    $(document).on('click', '.newtemp', function () {
        tempteId = 0;
        $("#template_title").val('');
        $("#template_content").val('');
        newTemplateLayer=layer.open({
            title: '新建要求模板',
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [device?'60%':'90%',device?'40%':'85%'],
            content: $(".newTempDiv")
        });
        $(".tmp_tips").html('提示：您新建的模板将会自动同到步代练通');
        return false;
    }); 
    $(document).on('click', '.saveTempBtn', function () {
        let title = $("#template_title").val();
        let content = $("#template_content").val();
        let gname = $("#tGameName").val();
        if (title == "" || title == undefined || title == null) {
            layer.msg('模板标题不能为空');
            return false;
        }
        if (content == "" || content == undefined || content == null) {
            layer.msg('模板内容不能为空');
            return false;
        }
        let platformType = 0;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].tid == tempteId) {
                platformType = tempData[i].platformType;
            }
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAjax/AddUpdatePushJdpRequestTemplate",
            data: { tid: tempteId, gameName: gname, title: title, content: content, platformType: platformType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    $("#template_title").val('');
                    $("#template_content").val('');  
                    $(".tmp_tips").html('');
                    loadtemplate();
                    layer.msg('保存成功', { time: 1000 }, function () {
                        layer.close(newTemplateLayer);
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
    function loadtemplate() {
        var gname = $("#tGameName").val();// $("#gameName").find("option:selected").text();        
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetPushJdp_TemplateList",
            data: { gameName: gname},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取常用要求模板'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $("#tempList").empty();
                $("#tempList").prepend("<option value='0'>不需要</option>");
                tempData = data.data;

                var defInputValue = '';
                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i].isdef == "Y") {
                        defInputValue = tempData[i].content;
                    }
                    var option = '<option value="' + tempData[i].tid + '" data-platform="' + tempData[i].platformType + '">' + (tempData[i].isdef=="Y"?"[默认]":"")+tempData[i].title + '</option>';
                    $("#tempList").append(option);
                }
                form.render('select');

                if (defInputValue != '') {
                    let yval = $("#requestContent").val();
                    if (yval == null || yval == "" || yval == undefined) {
                        $("#requestContent").val(defInputValue);
                    }
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    } 
    form.on('select(tempList)', function (data) { 
        var val = data.value;
        tempteId = val;
        let platformType=0;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].tid == val) {
                platformType = tempData[i].platformType;
            }
        }
        if (val < 1) {
            $(".defdiv").hide();
            $(".editdiv").hide();
            $(".deldiv").hide();
            return false;
        }
        $(".defdiv").show();
        $(".editdiv").show();
        $(".deldiv").show();
       
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetPushJdp_TemplateList",
            data: { tid: val, platformType: platformType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取指定要求模板'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    let yval = $("#requestContent").val();
                    if (yval == null || yval == "" || yval == undefined) {
                        yval = data.data[0].content;
                    } else {
                        yval = yval + '\n' + data.data[0].content;
                    } 
                    $("#requestContent").val(data.data[0].content);
                } else {
                    layer.msg('指定的模板没有获取到内容');
                } 
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false; 
    });
    $(document).on('click', '.edittemp', function () {        
        let title = '';
        let content = '';
        let platformType = 0;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].tid == tempteId) {
                content = tempData[i].content;
                title = tempData[i].title.replace('【代练通】', '');
                title = title.replace('【系统】', '');
                title = title.replace('【代练妈妈】', '');
                platformType = tempData[i].platformType;
                $("#template_title").val(title);
                $("#template_content").val(content);
                if (platformType == 10) {
                    $(".tmp_tips").html('提示：您正在编辑代练通的订单要求模板，保存后将同步至代练通');
                }
                else {
                    $(".tmp_tips").html('');
                }
            }
        }
        newTemplateLayer = layer.open({
            title: '编辑模板：'+title,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [device ? '60%' : '90%', device ? '40%' : '85%'],
            content: $(".newTempDiv")
        });
        return false;
    });
    $(document).on('click', '.deltemp', function () { 
        let platformType = 0;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].tid == tempteId) {
                platformType = tempData[i].platformType;
            }
        }
        $.ajax({
            type: "POST",
            url: "/SystemAjax/DelPushJdpRequestTemplateById",
            data: { tid: tempteId,platformType:platformType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法删除模板数据'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 });
                if (data.code > 0) {
                    $(".editdiv").hide();
                    $(".deldiv").hide();
                    loadtemplate();
                } 
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        }); 
        return false;
    });
    $(document).on('click', '.defualttemp', function () {
        let platformType = 0;
        for (let i = 0; i < tempData.length; i++) {
            if (tempData[i].tid == tempteId) {
                platformType = tempData[i].platformType;
            }
        }
        $.ajax({
            type: "POST",
            url: "/SystemAjax/SetPushJdpRequestTemplateDefaultById",
            data: { tid: tempteId, platformType: platformType, gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法设置默认模板'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 });
                if (data.code > 0) {                  
                    loadtemplate();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        }); 
        return false;
    });
    form.on('submit(savebtn)', function (data) {
        if (data.field.platform == null || data.field.platform == undefined || data.field.platform.length < 1) {
            layer.msg('请在上面勾选要发单的平台', { time: 1500 }, function () {
                return false;
            })
            return false;
        }
        var moblie = data.field.moblie;
        var qq = data.field.qq;
        var orderTitle = data.field.orderTitle; 
        if (moblie == null || moblie == '' || moblie == undefined) {
            if (qq == null || qq == '' || qq == undefined) { 
                layer.msg("上号联系电话或QQ/微信至少留一样，方便打手上号验证", {
                    time: 1000
                });
                return false;
            }
        }
        var requestContent = data.field.requestContent;
        if (requestContent == null || requestContent == "" || requestContent == undefined) {
            layer.msg("请输入订单要求", {
                time:1000
            });
            return false;
        }
        if (orderTitle == null || orderTitle == "" || orderTitle == undefined) {
            layer.msg("请输入发单标题", {
                time: 1000
            });
            return false;
        }
        var outTimeHours = data.field.outTimeHours;
        var outTimeAction = data.field.outTimeAction;
        var addPrice = data.field.addPrice;
        if (outTimeHours > 0) {
            if (outTimeAction == 10) {
                if (addPrice == null || addPrice == '' || addPrice == undefined) {
                    $("#addPrice").focus();
                    layer.msg('选择了超时未接单的动作为加价抛单后，加价金额值不能为空', { time: 3000 }, function () {
                    });
                    return false;
                }
            }
        }
        var arr_box = [];
        $('input[name="platform"]:checked').each(function () {
            arr_box.push($(this).val());
        });
        data.field.platform = arr_box.join(',');
        var strParameter = JSON.stringify(data.field);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        strParameter = encodeURIComponent(strParameter);  
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/PushTransctionToPlatform",
            data: {strParameter: strParameter},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    if (data.code == 999999999) {
                        layer.alert(data.msg, function (index) {
                            layer.close(index)
                            if (gtype == "Y") {
                                location.href = "AddOrder";
                            } else {
                                try {
                                    parent.tools.reloadOrderData();
                                    parent.layer.closeAll()
                                } catch (err) { }
                                try {
                                    window.parent.reloadOrderData();
                                    parent.layer.closeAll()
                                } catch (err) { } 
                                try {
                                    execJs.closeWindow()
                                } catch (err) { }
                                
                            }
                        });
                    }
                    else {
                        layer.alert(data.msg, function (index) {
                            layer.close(index)
                            if (gtype == "Y") {
                                location.href = "AddOrder";
                            } else {
                                try {
                                    parent.tools.reloadOrderData();
                                    parent.layer.closeAll()
                                } catch (err) { }
                                try {
                                    window.parent.reloadOrderData();
                                    parent.layer.closeAll()
                                } catch (err) { } 
                                try {
                                    execJs.closeWindow()
                                } catch (err) { }
                            }
                        }); 
                    } 
                }
                else {
                    re = true;
                    layer.alert(data.msg);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }); 
    $(document).on('click', '.refbanlance', function () {
        reffunc();
        return false;
    });
    form.on('checkbox(dltSelect)', function (data) {
        if (data.elem.checked) {
            reffunc();
            if (data.elem.value == 5) {
                $(".rxy").show();
                $(".jdpbanlancelayer").show();
            }           
        } else {
            if (data.elem.value == 5) {
                $(".rxy").hide();
                $(".jdpbanlancelayer").hide();
            }         
        } 
    });
    reffunc(); 
    function reffunc() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetTradingPlatformBalance",
            data: {id:0,pid:10},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                $(".dltspan").remove();
                $(".refbanlance").remove();
                let html = $(".banlance").html(); 
                if (data.code > 0) {
                    html += '<span class="dltspan" style="margin-left:10px">【代练通可用资金：' + data.data.ActiveBal + '，冻结资金：' + data.data.FreezeBal + '】</span>';
                } else {
                    html += ''; 
                } 
                let btn = '<span style="" class="layui-btn layui-btn-xs layui-btn-primary refbanlance" title="刷新余额">刷新余额</span>';
                $(".banlance").html(html + btn);
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }  
    $(document).on('click', '.returnBtn', function () {
        layer.confirm('确定不继续抛单要返回到录单页面吗？', function (index) {
            layer.close(index);
            location.href = "AddOrder"; 
        });
        return false;
    });       
      
    $(document).on('click', '.refUi', function () {
        location.reload();
    });  
    $(document).on('click', '.setDefault', function () {
        let outTimeHours = $("#outTimeHours").val();
        let outTimeAction = $("#outTimeAction").val();
        let addPriceType = $("#addPriceType").val();
        let addPrice = $("#addPrice").val();
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForPushOrderToPlatformOrderNoRecAction",
            data: { outTimeHours: outTimeHours, outTimeAction: outTimeAction, addPriceType: addPriceType, addPrice: addPrice },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    });
    $(document).on('click', '.saveContactBtn', function () {
        var phone = $("#moblie2").val();
        var qq = $("#qq").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForThreePlatformThrowOrderCantac",
            data: { phone: phone, qq: qq },
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
    $(document).on('click', '.getPrivtePhone', function () {
        var ids = $("#orderID").val(); 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetPrivatePhone",
            data: { orderId: ids, forceGet:'Y' },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) { 
                    $("#moblie").val(sdata);
                    layer.msg('获取成功，请查看订单玩家电话输入框');
                }
                else {
                    layer.msg(data.msg);
                }
                
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    $(document).on('click', '.getRecommendPriceBtn', function () {
        let orderTitle = $("#orderTitle").val();
        let gameName = $("#tGameName").val();
        let gameArea = $("#tGameArea").val();
        let gameServer = $("#tGameServer").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/DLT_GetRecommendPrice",
            data: { title: orderTitle, gameName: gameName, orderGameArae: gameArea, orderGameServer: gameServer},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    $(".getOninePlatmPriceDiv").show();
                    $(".getOninePlatmPriceSpan").html('代练通推荐发单价：' + data.basePrice + '，安保金：' + data.ensure1 + '，效保金：' + data.ensure2 + '，时限：' + data.timeLimitHourStr);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    $(document).on('click', '.saveAcceptSettingBtn', function () {
        var limitAccept = $("#limitAccept").val();
        var dlmmlimitAccept = $("#dlmmlimitAccept").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForThreePlatformThrowOrderAccept",
            data: { limitAccept: limitAccept, dlmmlimitAccept: dlmmlimitAccept },
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
    if (isReadTP == 0) {
        loadtemplate();
    }
    $("#throwFee").change(function () {
        delayDivShow();
        return false;
    })
    $("#throwFeeHome").change(function () {
        delayDivShow();
        return false;
    })
    function delayDivShow() {
        let pushPlatmPrice = $("#throwFee").val();
        let throwInterPrice = $("#throwFeeHome").val();
        if (parseFloat(pushPlatmPrice) > 0 && parseFloat(throwInterPrice)) {
            $(".delayDiv").show();
        }
        else {
            $(".delayDiv").hide();
        }
        return false;
    }
});