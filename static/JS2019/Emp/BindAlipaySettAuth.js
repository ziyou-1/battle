layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var table = layui.table;
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        
    var re = true; 
    var layerWindows;
    var indexLoad; 
    var tableList = table.render({
        elem: '#tableList'
        , url: '/EmpAjax/GetBindAlipaySettAuthList?getSoure=-1'
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'str1', title: '付款支付宝账号', width: 260, align: 'center', unresize: false
            }, {
                field: 'str8', title: '支付宝名称', width: 120, align: 'center', unresize: false
            }
            , {
                field: 'id8', title: '通道', width: 80, align: 'center', unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.id8 == 1) {
                        vo = '<span style="color:#16b777">通道2</span> ';
                    }
                    else {
                        vo = '<span style="color:#23292e">通道1</span> ';
                    }
                    return vo;
                }
            }
            , {
                field: 'str2', title: '服务签约状态', align: 'center', width: 120, sort: false, unresize: true, templet: function (res) {
                    let vo = '<span class="layui-badge layui-bg-cyan" title="' + res.str2 + '">待签约</span>';
                    if (res.str2 == "已授权") {
                        vo = '<span class="layui-badge layui-bg-blue" title="' + res.str2 + '">已签约</span>';
                    }
                    else if (res.str2 == "授权中") {
                        vo = '<span class="layui-badge layui-bg-green" title="' + res.str2 + '">签约中</span>';
                    }
                    else if (res.str2 == "授权未通过") {
                        vo = '<span class="layui-badge" title="' + res.str2 + '">签约未通过</span>';
                    }
                    if (res.id8 == 1) {
                        return '无需签约';
                    }
                    return '无需签约';
                    return vo;
                }
            }
            , {
                field: 'str13', title: '功能授权状态', align: 'center', width: 120, sort: false, unresize: true, templet: function (res) {
                    let vo = '';
                    if (res.str13 == "已授权") {
                        vo = '<span class="layui-badge layui-bg-blue" title="' + res.str13 + '">已授权</span>';
                    }
                    else
                    {
                        vo = '<span class="layui-btn layui-btn-xs layui-bg-red  uniapplyauth" data-bizid="' + res.str5 + '" data-channel="' + res.id8 +'" lay-tips="还未完成授权，点击可进行授权">未授权,点这里</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'str3', title: '申请时间', width: 150, align: 'center', sort: false, unresize: true
            }
            , {
                field: 'str4', title: '授权时间', align: 'center', width: 150, sort: false,unresize: false
            }
            , {
                field: 'str6', title: '备注说明', width: 150, unresize: false, edit: true
            }
            , {
                field: 'str10', title: '解除授权时间', align: 'center', width: 150, sort: false, unresize: false
            }
            , {
                field: 'str11', title: '解除授权说明', align: 'left', width: 150, sort: false, unresize: false
            }
            , {
                field: 'none', title: '系统提示', width: 220, unresize: false, templet: function (res) {
                    let vo = ''; 
                    //if (res.str2 == "未授权"&&res.id8<1) {
                    //    vo = '<span class="layui-badge">服务还没签约</span> ';
                    //}  
                    if (res.str13 == "未授权") {
                        vo += '<span class="layui-badge">还未授权</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'str7', title: '操作人', align: 'center', width: 130, unresize: false
            }
            , { fixed: '', title: '操作', width:210, toolbar: '#baroperating', unresize: false, }
        ]]
        , page: false
        , limit: 50
        , limits: [10, 20, 30, 40, 50, 100]
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
            case 'addBookBtn':
                addAuth();
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') { 
            layer.confirm('确认删除吗？', {
                btn: ['确定', '关闭']
            }, function (index) {
                layer.close(index);
                delAuth(obj.data.id, obj.data.id8);
            })
        } else if (obj.event === 'submitReAuth') { 
            if (obj.data.id8 == 0||obj.data.id8 == 1) {
                alipayAuth(obj.data.str5, obj.data.id8);
            } else {
                reAuth(obj.data.id, obj.data.id8);
            }
            return false;
        }
    });
    function addAuth() {
        layerWindows=layer.open({
            title: "新增一个用于结算的付款支付宝",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['560px','460px'],
            content: $(".newBindDiv")
        });
        return false;
    }
    function reloadOrderList() { 
        tableList.reload({
            url: '/EmpAjax/GetBindAlipaySettAuthList?getSoure=-1'
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }  
    function delAuth(ids, channel) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/DeleteBindAlipaySettAuth",
            data: { bid: ids, channel: channel },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) { 
                re = true; 
                layer.msg(data.msg, { time: 1200 }, function () {
                    if (data.code > 0) {
                        reloadOrderList();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function reAuth(ids,channel) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/ModityBindAlipaySettAuthRemarkResetAuth",
            data: { bid: ids, modityType: 2, channel: channel },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    reloadOrderList();

                    layer.open({
                        type: 1,
                        area: '300px;',
                        title: '请完成支付宝签约',
                        shade: 0.8,
                        id: 'LAY_layuipro', //设定一个id，防止重复弹出
                        btn: ['签约完成'],
                        btnAlign: 'c',
                        shadeClose: false,
                        maxmin: false,
                        anim: 0,
                        content: '<div style="padding:20px; line-height: 23px; background-color: #393D49; color: #fff; ">请在新弹出的页面里完成支付宝签约。如果签约失败，可以点击重新签约。如果没看到有新窗口，请注意是否被浏览器拦截了</div>',
                        btn1: function (index, layero, that) {
                            layer.close(index);
                            reloadOrderList();
                        },
                        success: function (layero, index, that) { 
                            let toHost = channel == 1 ? 'https://trust.lingyuefangzhou.com' : '/PlatformRedirect';
                            util.openWin({
                                url: toHost+ '/pay/AlipyAuth?bizId=' + data.data
                            });
                        }
                    });
                } else {
                    layer.msg(data.msg, { time: 1500 });
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    } 
    form.on('submit(savebtn)', function (data) {
        if (data.field.newPayAlipayAcc == "" || data.field.newPayAlipayAcc == null) {
            layer.msg('请输入用于支付的支付宝账号');
            return false;
        }
        if (data.field.newPayAlipayAcc != data.field.reNewPayAlipayAcc) {
            layer.msg('2次支付宝账号不一致');
            return false;
        }
        if (data.field.newPayAlipayName == "" || data.field.newPayAlipayName == null) {
            layer.msg('请输入此支付的支付宝姓名或执照名称');
            return false;
        } 
        if (data.field.channel == "" || data.field.channel == null) {
            layer.msg('请选择通道');
            return false;
        }
        var alipayAcc = data.field.reNewPayAlipayAcc;
        var alipayAccName = data.field.newPayAlipayName;
        var remark = data.field.remark;
        var channel = data.field.channel;
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/AddBindAlipaySettAuthData",
                data: { alipayAcc: alipayAcc, alipayAccName: alipayAccName, remark: remark, channel: channel },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    var biz = data.data;
                    if (data.code > 0) {
                        if (data.isauth == "Y") {
                            layer.alert("保存成功，因此支付宝已签约，无需再次签约可直接使用", function (lxx) {
                                layer.close(lxx);
                                layer.close(layerWindows);
                                reloadOrderList();
                                return false;
                            });
                            return false;
                        }
                        else {
                            if (biz != '') {
                                if (channel == 1 || channel == 0) {
                                    alipayAuth(biz, channel);
                                } else {
                                    layer.open({
                                        type: 1,
                                        area: '300px;',
                                        title: '请完成支付宝服务签约',
                                        shade: 0.8,
                                        id: 'LAY_layuipro', //设定一个id，防止重复弹出
                                        btn: ['签约完成', '重新签约'],
                                        btnAlign: 'c',
                                        shadeClose: false,
                                        maxmin: false,
                                        anim: 0,
                                        content: '<div style="padding:20px; line-height: 23px; background-color: #393D49; color: #fff; ">请在新弹出的页面里完成支付宝签约。如果签约失败，可以点击重新签约</div>',
                                        btn1: function (index, layero, that) {
                                            layer.close(index);
                                            layer.close(layerWindows);
                                            reloadOrderList();
                                        },
                                        btn2: function (index, layero, that) {
                                            delAuth(data.code,0);
                                            layer.close(index);
                                            layer.close(layerWindows);
                                        },
                                        success: function (layero, index, that) {
                                            let toHost = channel == 1 ? 'https://trust.lingyuefangzhou.com' : '/PlatformRedirect';
                                            util.openWin({
                                                url: toHost + '/pay/AlipyAuth?bizId=' + biz
                                            });
                                        }
                                    });
                                }                               
                            }
                        }
                    }
                    else {
                        layer.msg(data.msg, { time: 1500 }, function (index) {
                            reloadOrderList();
                        });
                    }
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
    }); 
    $(document).on('click', '.uniapplyauth', function () {
        var bizid = $(this).attr('data-bizid'); 
        let channel = $(this).attr('data-channel');
        alipayAuth(bizid, channel); 
    })
    function alipayAuth(bizid,channel) {
        var toHost = channel == 1 ? 'https://trust.lingyuefangzhou.com' : '/PlatformRedirect';
        layerWindows = layer.open({
            type: 2,
            area: ['400px', '440px'],
            title: '请完成支付宝功能授权',
            shade: 0.8,
            id: 'LAY_layuipro', //设定一个id，防止重复弹出
            btn: ['授权完成'],
            btnAlign: 'c',
            shadeClose: false,
            maxmin: false,
            anim: 0,
            content: toHost + '/pay/AlipayUniApplyAuth?bizId=' + bizid,
            btn1: function (index, layero, that) {
                layer.close(index);
                layer.close(layerWindows);
                reloadOrderList();
            }
        });
    }
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