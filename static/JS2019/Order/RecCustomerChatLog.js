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
        if (devices.android === true || devices.ios === true) {
            isPc = false;
        }
    var re = true;
    var keyLayer;
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var seachParam = 'sdate=' + sDate + '&edate=' + eDate;
        var indexLoad;
        var page = 1;
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        laydate.render({
            elem: '#sDate'
            , type: 'date'
        });
        laydate.render({
            elem: '#eDate'
            , type: 'date'
        });     
        var tableList = table.render({
            elem: '#tableList'
            , url: '/OrderAjax/GetRecPlayerChatMsgList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , title: '近期打手与玩家对聊预览'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 }
                ,
                {
                    field: 'sendUserNickName', title: '发送者', fixed: 'left', align: 'center', width:180, unresize: false, templet: function (res) {
                        let roleVo = '<span style="color:#5FB878">【' + res.sendUserRole + '】</span>';
                        if (res.sendUserRole == '玩家') {
                            roleVo = '<span style="color:#31BDEC">【' + res.sendUserRole + '】</span>';
                        }
                        else if (res.sendUserRole == '客服') {
                            roleVo = '<span style="color:#393D49">【' + res.sendUserRole + '】</span>';
                        }

                        return '<span style="">' + roleVo  + res.sendUserNickName + '</span>';
                    }
                }
                , {
                    field: 'orderId', title: '系统订单号', width: 170, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span data-id="' + res.orderId +'" class="orderdetails" style="color:#5FB878">' + res.orderId+ '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'lastContent', title: '最后一次对话内容', align: 'left', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span>【' + (res.type == 'image' ? '图片' : res.type == 'record' ? '语音' : res.type == 'file' ? '文件' : '文字') + '】' + res.lastContent + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'sendTime', title: '时间', width:120, align: 'center', sort: true, unresize: false
                }
                , {
                    field: 'none', title: '操作', width:60, align: 'center', unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" class="viewbilldetail" style="color:#1E9FFF" data-id="' + res.orderId + '" data-key="' + res.groupId + '" data-chatType="' + res.chatType +'" title="点击可查看结算聊天记录">查看</a>';
                    }
                }
            ]]
            , page: true
            , limit: 50
            , limits: [50, 100]
            , done: function (res, curr, count) {
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    //layui.msg(res.msg);
                }
                $(".total1").html(sDate + '至' + eDate + '共有' + res.count + '个对话记录');
            }
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'modityChatKey':
                    modityChatKeyBtn();
                    break;
                case 'dismissGroup':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请选中要操作的记录');
                        return false;
                    }
                    var empids = '';
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].groupId);
                        };
                        empids = tempData.join(',');
                    }
                    dismissGroupBtn(empids);
                    break;
            };
        });
        function reloadOrderList() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var skey = "";
            var recUser = formSelects.value('recUser', 'valStr');
            seachParam = 'sdate=' + sDate + '&edate=' + eDate + '&recUserId=' + recUser + '&key=' + skey;

            tableList.reload({
                url: '/OrderAjax/GetRecPlayerChatMsgList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        });

        $(document).on('click', '.orderdetails', function () {
            var ids = $(this).attr('data-id');
            viewOrderDetails(ids);
        });
        function viewOrderDetails(orderid) {
            layer.open({
                title: orderid + "订单详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '90%'],
                content: '/Order/OrderView?orderId=' + orderid
            });
        }

        var tableList2;
        var seachParam2 = '';
        $(document).on('click', '.viewbilldetail', function () {
            var orderId = $(this).attr('data-id');
            var key = $(this).attr('data-key');
            var chatType = $(this).attr('data-chatType');

            seachParam2 = 'key=' + key;
            tableList2 = table.render({
                elem: '#tableList2'
                , url: '/OrderAjax/GetRecPlayerChatMsgDetailsList?' + seachParam2
                , defaultToolbar: []
                , toolbar: '#toolbarDemo2'
                , defaultToolbar: ['filter']
                , cols: [[
                    {
                        field: 'sendUserNickName', title: '发送者', fixed: 'left', align: 'center', width: 180, unresize: false, templet: function (res) {
                            let roleVo = '<span style="color:#5FB878">【' + res.sendUserRole + '】</span>';
                            if (res.sendUserRole == '玩家') {
                                roleVo = '<span style="color:#31BDEC">【' + res.sendUserRole + '】</span>';
                            }
                            else if (res.sendUserRole == '客服') {
                                roleVo = '<span style="color:#393D49">【' + res.sendUserRole + '】</span>';
                            }

                            return '<span style="">' + roleVo + res.sendUserNickName + '</span>';
                        }
                    } 
                    , {
                        field: 'lastContent', title: '最后一次对话内容', align: 'left', sort: false, unresize: false, templet: function (res) {
                            let vo = '<span>' + res.lastContent + '</span>';
                            if (res.type == 'image') {
                                vo = '<a class="viewimg" data-type="' + res.type +'" data-url="' + res.lastContent +'" href="javascript:void(0)" style="color:#0094ff" title="点击查看">点击查看图片</a>';
                            }
                            else if (res.type == 'record') {
                                vo = '<a class="viewimg" data-type="' + res.type + '" data-url="' + res.lastContent +'" href="javascript:void(0)" style="color:#0094ff" title="点击听语音">点击听语音</a>';
                            }
                            else if (res.type == 'file') {
                                vo = '<a class="viewimg" data-type="' + res.type + '" data-url="' + res.lastContent +'" href="javascript:void(0)" style="color:#0094ff" title="点击下载文件">点击下载文件</a>';
                            }
                            else if (res.type == 'order') {
                                vo = '<span>展示订单</span>';
                            }
                            return vo;
                        }
                    }
                    , {
                        field: 'sendTime', title: '时间', width: 120, align: 'center', sort: true, unresize: false
                    }
                ]]
                , page: true
                , limit: 50
                , limits: []
                , done: function (res, curr, count) {
                    page = curr;
                    if (res.msg != '' && res.msg != null) {
                        //layui.msg(res.msg);
                    }
                    $(".total2").html('订单号：' + orderId + '的聊天记录，共' + res.count + '条');
                }
            }); 
        }); 
        $(document).on('click', '.viewimg', function () {
        var url = $(this).attr('data-url');
        var type = $(this).attr('data-type');
        if (url == '' || url == null || url == '无') {
            layer.msg('没有');
            return false;
        }
        layer.open({
            type: type =='image'?1:2,
            title: false,
            closeBtn: 0,
            area: [1000,'95%'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: type == 'image' ? '<img layer-pid="" layer-src="' + url + '" src="' + url + '" alt="图片" width="980">' : url
        });
        });
    function modityChatKeyBtn() {
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetRecPlayerChatMsgFilterKey",
            data: { },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                let keyStr = data.msg;
                if (data.code < 1) {
                    keyStr = '';
                }
                form.val("form", {
                    "customize": data.msg
                });
                keyLayer = layer.open({
                    title: "设置对聊内容关键词",
                    shade: [0.3, '#333'],
                    shadeClose: false,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 8,
                    area: ['800px', '280px'],
                    content: $('.modifyParamDiv')
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });   
       
        return false;
    }

    $(document).on('click', '.saveKeyBtn', function () {
        var filtkeys = $("#customize").val(); 
        if (!re)
            return false;
        re = false; 
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SaveRecPlayerChatMsgFilterKey",
            data: { key: filtkeys },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('数据请求出现异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.close(keyLayer);
                layer.msg(data.msg, { time: 1000 }, function () {
                     
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    });
    function dismissGroupBtn(groupids) {
        layer.confirm('强制解散群聊并不会删除聊天记录，仅仅只是将群内人员断开联系，请确认是否继续?', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/DisMissRecPlayerChat",
                data: { ids: groupids },
                dataType: 'json',
                cache: false,
                timeout: 300000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.alert(data.msg);
                        layer.close(index);
                    }
                    else {
                        layer.alert(data.msg);
                    }
                },
                complete: function (XMLHttpRequest) {
                    re = true;
                    layer.close(indexLoad);
                }
            });
        });
        return false;
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