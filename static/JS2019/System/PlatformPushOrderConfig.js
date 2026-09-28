layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
            element = layui.element;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var id = '';
    var layerWindows;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/SystemAjax/GetPlatformPushOrderConfigList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 }
            ,
            {
                field: 'gameName', title: '游戏名称', width:120, fixed: 'left', unresize: false, sort: false
            }
            , {
                field: 'pushPlatformNames', title: '默认发单平台', width:230, align: 'left', unresize: false
            }
            , {
                field: 'pushPlatfromPriceScale', title: '发单价百分比', width: 100, align: 'center', unresize: false, templet: function (res) {
                    return '<span lay-tips="' + (res.pushPlatfromPriceScale > 0 ? '在发单时，系统将自动按照接单价的' + res.pushPlatfromPriceScale+'%作为平台发单价':'无')+'">' + res.pushPlatfromPriceScale + '%</span>';
                }
            }
            , {
                field: 'pushPlatformSafeAmount', title: '发单安全保证金',width:100, align: 'center', unresize: false
            }
            , {
                field: 'pushPlatformEffAmount', title: '发单效率保证金', width: 100, align: 'center', unresize: false
            }
            , {
                field: 'pushPlatformPhone', title: '发单联系电话', width: 120, align: 'center', unresize: false
            }
            , {
                field: 'pushPlatformQQ', title: '发单联系QQ', width: 120, align: 'center', unresize: false
            }
            , {
                field: 'isAutoWritePhone', title: '保留玩家电话', width:120, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + (res.isAutoWritePhone == 1 ? "留空" : "保持和订单一致") + '</span>';
                }
            }
            , {
                field: 'pushPlatfromBuilderPrivePhone', title: '自动生成虚拟号', width: 120, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + (res.pushPlatfromBuilderPrivePhone==1?"生成":"不生成")+'</span>';
                }
            }
            , {
                field: 'pushPlatformRequire', title: '发单要求', align: 'left', unresize: false, templet: function (res) {
                    if (res.pushPlatformRequire == null) {
                        return '';
                    }
                    return '<span lay-tips="' + res.pushPlatformRequire+'">' + res.pushPlatformRequire + '</span>';
                }
            }
            , { fixed: '', title: '操作', width: 160, toolbar: '#baroperating', unresize: true, }
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
            case 'settconfig':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                id = tempData.join(',');
                let pushorderphone ='';
                let pushorderqq = '';
                let pushordersafeamount = 0;
                let pushordereffamount =0;
                let autobuilderprivtephone = 0;
                let pushorderquire = '';
                let pushPlatformIds = '';
                let pushPlatfromPriceScale = 0;
                if (data.length == 1) {
                    pushorderphone = data[0].pushPlatformPhone;
                    pushorderqq = data[0].pushPlatformQQ;
                    pushordersafeamount = data[0].pushPlatformSafeAmount;
                    pushordereffamount = data[0].pushPlatformEffAmount;
                    autobuilderprivtephone = data[0].pushPlatfromBuilderPrivePhone;
                    pushorderquire = data[0].pushPlatformRequire;
                    pushPlatformIds = data[0].pushPlatformIds;
                    pushPlatfromPriceScale = data[0].pushPlatfromPriceScale;
                }
                modifyConfig(id, pushorderphone, pushorderqq, pushordersafeamount, pushordereffamount, autobuilderprivtephone, pushorderquire, pushPlatformIds, pushPlatfromPriceScale);
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            id = obj.data.id;
            let pushorderphone = obj.data.pushPlatformPhone;
            let pushorderqq = obj.data.pushPlatformQQ;
            let pushordersafeamount = obj.data.pushPlatformSafeAmount;
            let pushordereffamount = obj.data.pushPlatformEffAmount;
            let autobuilderprivtephone = obj.data.pushPlatfromBuilderPrivePhone;
            let pushorderquire = obj.data.pushPlatformRequire;
            let pushPlatformIds = obj.data.pushPlatformIds;
            let pushPlatfromPriceScale = obj.data.pushPlatfromPriceScale;
           
            modifyConfig(id, pushorderphone, pushorderqq, pushordersafeamount, pushordereffamount, autobuilderprivtephone, pushorderquire, pushPlatformIds, pushPlatfromPriceScale);
            return false;
        }
        else if (obj.event === 'submitDel') {
                clealParam(obj.data.id);
                return false;
            }
    });
    function modifyConfig(id, pushorderphone, pushorderqq, pushordersafeamount, pushordereffamount, autobuilderprivtephone, pushorderquire, platformIds, pushPlatfromPriceScale) {
        $('input[name=autobuilderprivtephone]').prop('checked', false);
        form.render('radio');
        form.val("form", {
            "pushorderphone": pushorderphone,
            "pushorderqq": pushorderqq,
            "pushordersafeamount": pushordersafeamount,
            "pushordereffamount": pushordereffamount,
            "pushorderquire": pushorderquire,
            "autobuilderprivtephone": autobuilderprivtephone,
            "pushorderpricescale": pushPlatfromPriceScale
        });
       
        let platformIdarr = platformIds != '' && platformIds != null ? platformIds.split(',') : [];
        var arrs = $('input[name="platformIds"]');

        for (item of arrs) {
            let val = $(item).val();
            if (platformIdarr.indexOf(val) > -1) {
                $(item).prop("checked", true)
            } else {
                $(item).prop("checked", false)
            }
        }
        form.render(); 
       
        layerWindows = layer.open({
            title: "编辑交易平台发单配置",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '680px' : '90%', isPc? '880px':'95%'],
            content: $('.modifyParamDiv'),
            end: function () {
               
            }
        });
        return false;
    }
    function reloadOrderList() {
        tableList.reload({
            url: '/SystemAjax/GetPlatformPushOrderConfigList'
            , where: {
            }
            , page: false
        });
        return false;
    }
    function clealParam(id) {
        layer.confirm('是否确认清空默认发单配置？', {
            btn: ['确认', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/ClearPlatformPushOrderConfig",
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
    $('.saveInterfaceBtn').on('click', function () {
        var autowritephone = $('input[type=radio][name=autowritephone]:checked').val();
        var autobuilderprivtephone = $('input[type=radio][name=autobuilderprivtephone]:checked').val();
        var pushorderphone = $("#pushorderphone").val();
        var pushorderqq = $("#pushorderqq").val();
        var pushordersafeamount = $("#pushordersafeamount").val();
        var pushordereffamount = $("#pushordereffamount").val();
        var pushorderquire = $("#pushorderquire").val();
        var pushPlatfromPriceScale = $("#pushorderpricescale").val();
        var platformIds = new Array();
        $("input:checkbox[name='platformIds']:checked").each(function (i) {
            platformIds[i] = $(this).val();
        });
        var platformIdsValue = platformIds.join(",");
        if (platformIdsValue == '' || platformIdsValue == null || platformIdsValue == undefined) {
            layer.msg('至少要选择一个平台');
            return false;
        }
        if (pushorderqq == "" && pushorderphone == "") {
            layer.msg('发单联系电话与发单联系QQ务必填一个');
            return false;
        }
        if (!VerifyInt(pushPlatfromPriceScale)) {
            layer.msg('发单价比例输入值格式不正确，必须是正整数，0-100之间');
            return false;
        }
        if (!VerifyInt(pushordersafeamount)) {
            layer.msg('默认的安全保证金格式不正确，必须是整数');
            return false;
        }
        if (!VerifyInt(pushordereffamount)) {
            layer.msg('默认的效率保证金格式不正确，必须是整数');
            return false;
        }        
        if (pushorderquire == '' || pushorderquire == 'undefined') {
            layer.msg('要求说明不能为空');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/SavePlatformPushOrderConfig",
            data: { id: id, pushorderquire: pushorderquire, pushorderphone: pushorderphone, pushorderqq: pushorderqq, pushordersafeamount: pushordersafeamount, pushordereffamount: pushordereffamount, autobuilderprivtephone: autobuilderprivtephone, platformIds: platformIdsValue, pushPlatfromPriceScale: pushPlatfromPriceScale, autowritephone: autowritephone },
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
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});