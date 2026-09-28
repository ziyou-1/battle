layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var pid = 0;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
        var re = true; 
    var indexLoad;
    var layerWindow;
    var gameName = $("#gameName").find("option:selected").text();
    form.on('select(selectGame)', function (data) {
        $("#gameName option").each(function () {
            var item = $(this).val();
            if (item == data.value) {
                gameName = $(this).text();
            }
        });
        reloadOrderList();
        return false;
    }); 
    var tableList = table.render({
        elem: '#tableList'
        , url: '/SmsAjax/GetSmsSettingMangeList?gameName=' + $("#gameName").val()
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[            
            {
                field: 'SmsType', title: '使用环境', fixed: 'left', width: 100, align: 'center', unresize: false, sort: false, templet: function (res) {
                    let typeStr = '订单状态变更';//短信类型：0订单状态类短信 1自定义短信 2通知玩家需要上号验证码短信设置 3内部号库短信
                    if (res.SmsType == 2) {
                        typeStr = '通知玩家上号';
                    }
                    else if (res.SmsType == 1) {
                        typeStr = '自定义';
                    }
                    else if (res.SmsType == 3) {
                        typeStr = '内部号库';
                    }
                    return typeStr;
                }
            },
            {
                field: 'SmsTitle', title: '发送时机', width: 135, align: 'center', unresize: false, sort: false
            },
            {
                field: 'SmsContent', title: '短信内容(不带签名)', minWidth: 200, align: 'left', unresize: false, sort: false, templet: function (res) {
                    let vo = '<span class="ct" lay-tips="' + res.SmsContent + '" data-id="' + res.SmsSetting_Id + '" data-title="' + res.SmsTitle + '" data-content="' + res.SmsContent + '" data-smstype="' + res.SmsType + '" data-tbswicth="' + res.SelectTbSwicth + '" data-sendopport="' + res.SendOpport + '">' + (res.SmsContent == null || res.SmsContent == "" ? "无" : res.SmsContent) + '</span>';
                    return vo;
                }
            }
            , {
                field: 'SmsSwicth', title: '<span lay-tips="绿色代表启用自动发送，灰色代表禁止发送">自动发送</span>', width:80, align: 'center', unresize: false, templet: '#switchTpl1'
            }
            , { fixed: '', title: '操作', width: 160, align: 'left', toolbar: '#baroperating', unresize: false, }
        ]]
        , page: false
        , done: function (res, curr, count) {
        }
    });

    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            var id = obj.data.SmsSetting_Id;
            var name = obj.data.SmsTitle;
            var content = obj.data.SmsContent;
            var smsType = obj.data.SmsType;
            var smsTbSwcith = obj.data.SelectTbSwicth;
            var sendOpport = obj.data.SendOpport;
            editSms(id, name, content, smsType, smsTbSwcith, sendOpport);
            return false;
        }
        else if (obj.event === 'submitApplyAll') {
            var id = obj.data.SmsSetting_Id; 
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SmsAjax/SaveModitySmsApplyAllGame",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                    re = true;
                    reloadOrderList();
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }
    });
    $(document).on('click', '.ct', function () {
        var id = $(this).attr('data-id'); 
        var name = $(this).attr('data-title');
        var content = $(this).attr('data-content');
        var smsType = $(this).attr('data-smstype');
        var smsTbSwcith = $(this).attr('data-tbswicth');
        var sendOpport = $(this).attr('data-sendopport');
        editSms(id, name, content, smsType, smsTbSwcith, sendOpport);
        return false;
    })
    form.on('switch(smsSwitch)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SmsAjax/SaveModitySmsSwictht",
            data: { id: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                })
                re = true;
                reloadOrderList();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function reloadOrderList() {
        tableList.reload({
            url: '/SmsAjax/GetSmsSettingMangeList?gameName=' + $("#gameName").val()
            , where: {
            }
            , page: false
        });
        return false;
    }  
    $("#smsContent").bind('input propertychange', function () {       
        var strLength = $("#smsContent").val().length;
        var smsCount = Math.ceil(strLength / 64);
        $('.zs').html('共计' + strLength + '个字符，算' + smsCount + "条");
    }); 
    function editSms(id, name, content, smsType, smsTbSwcith, sendOpport) {
        pid = id;         
        form.val('pro', {
            "smsContent": content
            , "selectTbSend": smsTbSwcith
        }); 
        if (smsType == 2) {
            $(".notPlayerLoginDiv").show();
            $(".orderStaChangeSmsDiv").show();
            $(".gameAccKuDiv").hide();
        }
        else if (smsType == 3) {
            $(".notPlayerLoginDiv").hide();
            $(".orderStaChangeSmsDiv").hide();
            $(".gameAccKuDiv").show();
        } else {
            $(".notPlayerLoginDiv").hide();
            $(".orderStaChangeSmsDiv").show();
            $(".gameAccKuDiv").hide();
        }
        if (sendOpport == 30) {
            $(".orderEndTbDiv").show();
        } else {
            $(".orderEndTbDiv").hide();
        }
        if (content != '' && content != null) {
            var smsCount = Math.ceil(content.length / 64);
            $('.zs').html('共计' + content.length + '个字符，算' + smsCount + "条");
        }
        form.render();
        layerWindow = layer.open({
            title: "编辑" + name+"的短信内容",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [!isPc?'95%':'720px', !isPc ? '95%' : '680px'],
            content: $('.change')
        });
    }

    form.on('submit(saveSmsBtn)', function (data) {
        var smsContent = data.field.smsContent;
        var selectTbSend = data.field.selectTbSend;

        if (smsContent == undefined || smsContent == null || smsContent == '') {
            layer.msg('短信内容不能为空，总得说点什么吧');
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SmsAjax/SaveModitySmsContent",
            data: { id: pid, content: smsContent, asnyTbSms: selectTbSend},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求数据出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(layerWindow);
                        reloadOrderList();
                    })
                } else {
                    layer.msg(data.msg, { time: 2000 });
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

        form.on('submit(payBtn)', function (data) {
            var jdp = data.field.jdp;
            if (jdp == 0) {
                layer.msg('本系统还未绑定平台账户，无法直接购买短信，请先到系统维护->系统各项设置管理,绑定你的平台账户并保存');
                return false;
            }
            layer.open({
                title: "购买短信资源包",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: [isPc ? '85%' : '95%', isPc ? '85%' : '95%'],
                content: '/PlatformRedirect/buy/buyservice?u=' + jdp
            });
            return false;
        });
        form.on('submit(payczBtn)', function (data) {
            var jdp = data.field.jdp;
            if (jdp == 0) {
                layer.msg('本系统还未绑定平台账户，无法直接充值，请先到系统维护->系统各项设置管理,绑定你的平台账户并保存');
                return false;
            }
            layer.open({
                title: "给平台余额充值",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: [isPc ? '40%' : '95%', isPc ? '60%' : '95%'],
                content: '/PlatformRedirect/pay/SystemInPay?userID=' + jdp
            });
            return false;
        });
        form.on('submit(signatureBtn)', function (data) {
            var company = data.field.CompanyName;
            layer.prompt({ title: '申请开通短信前缀，请在下面填写自定义前缀', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 4, value: company }, function (value, index, elem) {
                if (value.length < 2 || value.length > 5) {
                    layer.msg('短信前缀签名应该控制在2-5个字，且不得有任何特殊符号', { time: 1000 }, function () {
                        return;
                    });
                    return;
                }
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '短信前缀签不能有特殊字符';
                }
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/OpenSmsSig",
                    data: { signature: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        var sdata = data.msg;
                        layer.msg(sdata, { time: 3000 }, function () { 
                        })
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            });
            return false;
        });
     
        form.on('submit(savebtn)', function (data) {
            var strparameter = JSON.stringify(data.field); 
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/SmsSetting",
                data: { param: strparameter},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求数据出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg);
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });

});