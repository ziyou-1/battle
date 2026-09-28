layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard',
    formSelects: '/lib/formSelects-v4',
}).use(['index', 'form', 'formSelects', 'util', 'table', 'ClipboardJS'], function () {
    var $ = layui.$,
        form = layui.form,
        formSelects = layui.formSelects,
        upload = layui.upload,
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
    var files, fileurl;

    form.on('submit(savebtn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/PddShipSetting",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
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
        , url: '/SystemAjax/GetPushOrderGroupMsgSetList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'replyOcc', title: '发送时机', width: 200, align: 'center', unresize: false, templet: function (res) {
                    let colorStr = '#219227;';
                    let occStr = "新订单录入时";
                    switch (res.replyOcc) {
                        case 10:
                            colorStr = '#ff6a00';
                            occStr = "新订单录入时（旧配置）";
                            break;
                        case 20:
                            colorStr = '#FF5722';
                            occStr = "原交易平台触发（本地未接入）";
                            break;
                        case 30:
                            occStr = "订单状态变更时";
                            break;
                    }
                    let str = '<span href="javascript:void(0)" title="发送时机" style="color:' + colorStr + ';">' + occStr + '</span>';
                    return str;
                }
            }, {
                field: 'gameName', title: '限定游戏', minWidth: 150, align: 'left', unresize: false
            }, {
                field: 'msgType', title: '消息类型', width: 80, align: 'center', unresize: false, templet: function (res) {
                    let str = res.msgType == 1 ? "文本" : "MarkDown";
                    return str;
                }
            }, {
                field: 'callAll', title: '呼叫全员', width: 80, align: 'center', unresize: false, templet: function (res) {
                    let str = '<span>' + (res.callAll == 10 ? '否' : '是') + '</span>';
                    return str;
                }
            }, {
                field: 'remark', title: '追加说明', width: 120, align: 'left', unresize: false
            }, {
                field: 'deliveryStatus', title: 'Webhook', width: 90, align: 'center', unresize: false
            },
            {
                field: 'switchStatus', title: '<span lay-tips="绿色代表启用时">启用状态</span>', width: 105, align: 'center', unresize: false, templet: '#switchTpl1'
            },
            { fixed: '', title: '操作', width: 255, align: 'center', toolbar: '#baroperating', unresize: false, }
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
            url: '/SystemAjax/GetPushOrderGroupMsgSetList'
            , where: {
            }
            , page: false
        });
        return false;
    }

    form.on('switch(staChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ModityPushOrderGroupMsgStatus",
            data: { id: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 2000 }, function () {
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
        return false;
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addShop(0, '', 0, '', 0, 0, '', 0, '');
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.id;
            delShop(id);
        } else if (obj.event === 'history') {
            var historyTableId = 'groupDeliveryHistory' + obj.data.id;
            layer.open({
                title: '企业微信群发送记录', type: 1, area: [isPc ? '850px' : '95%', '480px'],
                content: '<table id="' + historyTableId + '"></table>',
                success: function () {
                    table.render({
                        elem: '#' + historyTableId, url: '/SystemAjax/GetPushOrderGroupDeliveryList',
                        where: { ruleId: obj.data.id }, page: true, limit: 10,
                        cols: [[
                            { field: 'createTime', title: '时间', width: 165 },
                            { field: 'orderNo', title: '订单号', width: 155, templet: function (r) { return $('<div>').text(r.orderNo || '').html(); } },
                            { field: 'event', title: '事件', width: 85 },
                            { field: 'status', title: '结果', width: 90 },
                            { field: 'attempts', title: '次数', width: 65 },
                            { field: 'error', title: '失败原因', minWidth: 200, templet: function (r) { return $('<div>').text(r.error || '').html(); } }
                        ]]
                    });
                }
            });
        } else if (obj.event === 'retry') {
            $.post('/SystemAjax/RetryPushOrderGroupMsg', { id: obj.data.lastDeliveryId }, function (res) {
                layer.msg(res.msg);
                reloadOrderList();
            }, 'json').fail(function () { layer.msg('重试失败，请稍后再试'); });
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var gameName = obj.data.gameName;
            var replyOcc = obj.data.replyOcc;
            var webhookUrl = obj.data.webhookUrl;
            var kurl = obj.data.kurl;
            var callAll = obj.data.callAll;
            var remark = obj.data.remark;
            var msgType = obj.data.msgType;
            var groupId = obj.data.groupId;
            addShop(id, gameName, replyOcc, webhookUrl, kurl, callAll, remark, msgType, groupId,data);
            return false;
        }
    });
    function addShop(id, gameName, replyOcc, webhookUrl, kurl, callAll, remark, msgType, groupId,data) {
        if (id == 0) {
            $('input[name=replyOcc]').prop('checked', false);
            form.render('radio');
        }
        form.val("form", {
            "replyOcc": replyOcc,
            "webhookUrl": webhookUrl,
            "ptid": id,
            "kurl": kurl,
            "callAll": callAll,
            "remark": remark,
            "msgType": msgType,
            "groupId": groupId
        });
        if (gameName != '') {
            let platformIdarr = gameName.split(',');
            for (var i = 0; i < platformIdarr.length; i++) {
                let platformId = platformIdarr[i];
                $('input[name="gameName"][value=' + platformId + ']').prop("checked", true); //这里不要用attr，要用prop，否则清除勾选后再重新勾选渲染无效
            }
            form.render('checkbox');
        } else {
            $("input[name='gameName']").prop("checked", false);
            form.render('checkbox');
        }

        $("input[name='gameName']").prop("checked", false);

        if (id === 0) {
            $('input[name=replyOcc]').prop('checked', false);
            form.render('radio');
        } else {
            console.log(data)
            form.val("form", {
                "replyOcc": data.replyOcc,
                "webhookUrl": data.webhookUrl,
                "ptid": id,
                "kurl": data.kurl,
                "callAll": data.callAll,
                "remark": data.remark,
                "msgType": data.msgType,
            });

            var gameName = data.gameName || '';
            if (gameName !== '') {
                let platformIdarr = gameName.split(',');
                for (var i = 0; i < platformIdarr.length; i++) {
                    let platformId = platformIdarr[i];
                    $('input[name="gameName"][value="' + platformId + '"]').prop("checked", true);
                }
            }
        }

        form.render();

        layerWindows = layer.open({
            title: id > 0 ? "编辑参数" : "新增一个设置",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '960px' : '90%', isPc ? '580px' : '95%'],
            content: $('.modifyParamDiv')
        });

        return false;
    }
    function delShop(id) {
        layer.confirm('是否确认删除这个设置？', {
            btn: ['确认删除', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelPushOrderGroupMsg",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 2000 }, function () {
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
    form.on('radio(PddAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".autoCreateOrderDiv").show();
        } else {
            $(".autoCreateOrderDiv").hide();
        }
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
    $('.saveBtn').on('click', function () {
        var pid = $("#ptid").val();
        var platformIds = new Array();
        $("input:checkbox[name='gameName']:checked").each(function (i) {
            platformIds[i] = $(this).val();
        });
        var gameName = platformIds.join(",");
        var replyOcc = $('input[type=radio][name=replyOcc]:checked').val();
        var webhookUrl = $("#webhookUrl").val();
        var groupId = $("#groupId").val();
        var remark = $("#remark").val();
        var kurl = $('input[type=radio][name=kurl]:checked').val();
        var callAll = $('input[type=radio][name=callAll]:checked').val();
        var msgType = $('input[type=radio][name=msgType]:checked').val();
        if (gameName == '' || gameName == null || gameName == undefined) {
            layer.msg('至少要选择一个游戏');
            return false;
        }
        if (replyOcc == '' || replyOcc == null) {
            layer.msg('请选择发送时机');
            return false;
        }
        if (!webhookUrl && !pid) {
            layer.msg('请填写企业微信群机器人的 Webhook 地址');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/SavePushOrderGroupMsgSetModify",
            data: { id: pid, gameName: gameName, replyOcc: replyOcc, webhookUrl: webhookUrl, kurl: kurl, callAll: callAll, msgType: msgType, remark: remark, groupId },
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
});
