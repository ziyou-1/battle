layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'util', 'table', 'ClipboardJS'], function () {
    var $ = layui.$,
        form = layui.form,
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
    var ClipboardJS = layui.ClipboardJS;
    var defAppid = "";
    var platIds = '10,15,20,30,40,60';
     
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
        , url: '/SystemAjax/GetTaoBaoInterfaceList?platform=' + platIds
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'platformType', title: '平台', width: 100, align: 'center', unresize: false, templet: function (res) {
                    let platName = '拼多多';
                    switch (res.platformType) {
                        case 15:
                            platName = '京东';
                            break;
                        case 20:
                            platName = '闲鱼';
                            break;
                        case 30:
                            platName = '抖音';
                            break;
                        case 40:
                            platName = '快手';
                            break;
                        case 50:
                            platName = '唯品会';
                            break;
                        case 60:
                            platName = '小红书';
                            break;
                        default:
                            platName = '拼多多';
                            break;
                    }
                    return '<span>' + platName+'</span>';
                }
            },
            {
                field: 'shopName', title: '店铺ID或昵称', width: 200, align: 'center', unresize: false
            },
            {
                field: 'soureName', title: '订单来源匹配', width: 200, align: 'center', unresize: false
            }, {
                field: 'appId', title: 'AppId', width: 170, align: 'left', unresize: false
            }, {
                field: 'hasAppSecret', title: 'AppSecret', width: 120, align: 'left', unresize: false, templet: function (res) { return res.hasAppSecret ? '已设置' : '未设置'; }
            }, {
                field: 'hasAccessToken', title: 'AccessToken', width: 120, align: 'left', unresize: false, templet: function (res) { return res.hasAccessToken ? '已设置' : '未设置'; }
            },
            {
                field: 'remark', title: '备注说明', align: 'left', unresize: false
            }, {
                field: 'integrationStatus', title: '接入状态', width: 150, align: 'center', unresize: false
            }
            , { fixed: '', title: '操作', width: 160, align: 'center', toolbar: '#baroperating', unresize: false, }
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
            url: '/SystemAjax/GetTaoBaoInterfaceList?platform=' + platIds
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
                addShop(0, 0,defAppid, '', '', '', '','');
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
            var appId = obj.data.appId;
            var appSecret = obj.data.appSecret;
            var accessToken = obj.data.accessToken;
            var remark = obj.data.remark;
            var soureName = obj.data.soureName;
            var shopSellerNick = obj.data.shopName;
            var platforms = obj.data.platformType;

            addShop(id, platforms,appId, appSecret, accessToken, soureName, remark, shopSellerNick);
            return false;
        }
    });
    function addShop(id, platforms, appId, appSecret, accessToken, tbsoure, remark, shopSellerNick) {
        $('input[name=platforms]').prop('checked', false);
        form.render('radio');
        form.val("form", {
            "platforms": platforms,
            "appId": appId,
            "appSecret": appSecret,
            "accessToken": accessToken,
            "tbsoure": tbsoure,
            "remark": remark,
            "ptid": id,
            "shopSellerNick": shopSellerNick
        });
        $(".appSecretDiv").show();
        layerWindows = layer.open({
            title: id > 0 ? "编辑对接" : "新增一个店铺对接",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc?'870px':'676px', '680px'],
            content: $('.modifyParamDiv')
        });
        return false;
    }
    function delShop(id) {
        layer.confirm('是否确认删除这个店铺对接？', {
            btn: ['确认删除', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelTaobaoInterface",
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
    form.on('radio(PddAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".PddAutoCreateOrderDiv").show();
        } else {
            $(".PddAutoCreateOrderDiv").hide();
        }
    });
    form.on('radio(DyinAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".DyinAutoCreateOrderDiv").show();
        } else {
            $(".DyinAutoCreateOrderDiv").hide();
        }
    });
    form.on('radio(KshouAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".KshouAutoCreateOrderDiv").show();
        } else {
            $(".KshouAutoCreateOrderDiv").hide();
        }
    });
    form.on('radio(XhsAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".XhsAutoCreateOrderDiv").show();
        } else {
            $(".XhsAutoCreateOrderDiv").hide();
        }
    });

    $(document).on('click', '.ressou', function () {
        
        revokeContentIndex = layer.open({
            title: "申请撤销",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '300px'],
            content: `    <div class="applyPlatorderRevokeContent" style="padding:10px 10px">
        <div class="layui-form-item">
            <label class="layui-form-label">支付代练费</label>
            <div class="layui-input-block">
                <input type="text" name="paytorec" id="paytorec" lay-verify="" autocomplete="off" placeholder="支付给接单方的金额" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">赔保证金</label>
            <div class="layui-input-block">
                <input type="text" name="pcamount" id="pcamount" lay-verify="" autocomplete="off" placeholder="接单方赔偿给发单的" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">撤销理由</label>
            <div class="layui-input-block">
                <input type="text" name="revokeremark" id="revokeremark" lay-verify="" autocomplete="off" placeholder="请输入理由" maxlength="256" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <a class="layui-btn layui-btn-normal revokeOKBtn">立即提交</a>
            </div>
        </div>
    </div>`

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
    var copyOrderIdClipboard = new ClipboardJS('.copyappid');
    copyOrderIdClipboard.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
    });
    copyOrderIdClipboard.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', { time: 1000 });
    });
    $('.saveInterfaceBtn').on('click', function () {
        var pid = $("#ptid").val();
        var platforms = $('input[type=radio][name=platforms]:checked').val();
        var appId = $("#appId").val();
        var appSecret = $("#appSecret").val();
        var accessToken = $("#accessToken").val();
        var remark = $("#remark").val();
        var tbsoure = $("#tbsoure").val();
        var shopSellerNick = $("#shopSellerNick").val();
        if (platforms == "" || platforms == undefined || platforms == null) {
            layer.msg('请选择一个店铺所在的平台');
            return false;
        }
        if (appId == '' || appId == 'undefined') {
            layer.msg('AppId不能为空');
            return false;
        }
        if ((!appSecret || appSecret == 'undefined') && !pid) {
            layer.msg('请填写客户应用的 AppSecret');
            return false;
        }
        if ((!accessToken || accessToken == 'undefined') && !pid) {
            layer.msg('请填写店铺授权 AccessToken');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/AddModtifyTaobaoInterface",
            data: { platformType: platforms, id: pid, appId: appId, appSecret: appSecret, accessToken: accessToken, remark: remark, soureName: tbsoure, shopSellerNick: shopSellerNick },
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
    $(".appId").change(function () {
        var appId = $("#appId").val();
        $(".appSecretDiv").show();
        return false;
    })
    $(document).on('click', '.getAuth', function () {
        util.openWin({ url: 'https://www.agiso.com/detail/1806' });
        return false;
    });
});
