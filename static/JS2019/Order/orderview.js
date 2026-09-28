layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'util', 'table', 'ClipboardJS', 'element', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        upload = layui.upload,
        element = layui.element;
    var ClipboardJS = layui.ClipboardJS;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var orderId = $("#orderId").val();
    var re = true;
    var tableList_ActionLog;
    var certLayer;
    getOrderLogs();
    getActionOrderLog();
    getPlatfromOrderIds();
    loadOrderImgTabDiv();



    function getUrlParams(url) {
        if (url.indexOf('?') == -1) {
            return false
        }
        let urlStr = url.split('?')[1]
        let obj = {};
        let paramsArr = urlStr.split('&')
        for (let i = 0, len = paramsArr.length; i < len; i++) {
            let arr = paramsArr[i].split('=')
            obj[arr[0]] = arr[1];
        }
        return obj
    }
    function loadOrderImgTabDiv() {
        element.tabAdd('logFilter', {
            title: '订单进度图'
            , content: '<iframe src="PicMange?orderId=' + orderId + '" frameborder="0" style="width: 100%; height:490px"></iframe>'
            , id: 102
        });
        element.render('tab');
    }
    var logTime;
    logTime = setInterval(function () {
        getOrderLogs();
    }, 1000 * 60 * 2);
    var copy = new ClipboardJS('.copybtn');
    copy.on('success', function (e) {
        let orderId = e.trigger.dataset.id;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/CopyOrderLog",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
            },
            complete: function (XMLHttpRequest) {
            }
        });
        layer.msg('已成功复制订单内容到剪贴板');
        e.clearSelection();
    });
    copy.on('error', function (e) {
        layer.msg('复制订单内容失败了，请手动复制', 'error');
    });
    var copyacc = new ClipboardJS('.copyacc');
    copyacc.on('success', function (e) {
        layer.msg('复制成功');
        e.clearSelection();
    });
    copyacc.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', 'error');
    });
    var copypwd = new ClipboardJS('.copypwd');
    copypwd.on('success', function (e) {
        layer.msg('复制成功');
        e.clearSelection();
    });
    copypwd.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', 'error');
    });
    $(document).on('click', '.revealpwd', function (e) {
        e.preventDefault();
        var button = $(this);
        $.ajax({
            type: 'Post',
            url: '/OrderAjax/RevealOrderPassword',
            data: { orderId: button.data('orderid') },
            dataType: 'json',
            success: function (result) {
                if (result.code > 0) {
                    var password = (result.data || {}).gamePwd || '';
                    $('.pwd').text(password);
                    $('.copypwd').attr('data-clipboard-text', password).show();
                    button.hide();
                } else {
                    layer.msg(result.msg || '无法查看密码');
                }
            },
            error: function () { layer.msg('无法查看密码，请稍后重试'); }
        });
        return false;
    });
    $(document).on('click', '.copybtn', function () {
        $("#copybtn").trigger("click");
        return false;
    })
    $(document).on('click', '.copysmurl', function (e) {
        let orderId = e.target.dataset.orderid;
        getScanqrCode(orderId)
        return false;
    })
    function getScanqrCode(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: "/OrderAjax/GetBuiderGameScanQrCode?orderId=" + orderId,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    let copyurlClipboard = new ClipboardJS('.copyurl', {
                        text: function (trigger) {
                            return data.data;
                        }
                    });
                    copyurlClipboard.on('success', function (e) {
                        layer.msg('已成功复制链接：' + e.text + '到剪贴板，有效时间' + data.hour + '小时', { time: 4000 });
                        e.clearSelection();
                    });
                    copyurlClipboard.on('error', function (e) {
                        layer.msg('复制失败了', { time: 1000 });
                    });
                    $('.copyurl').trigger('click')

                } else {
                    layer.alert(data.msg, function (index) {
                        layer.close(index);
                    });
                }

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    form.on('submit(addpbtn)', function (data) {
        if (data.field.remark == "") {
            layer.msg('备注内容不能为空！', { time: 1000 }, function () {
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
                    var myDate = new Date();
                    var mon = parseInt(myDate.getMonth()) + 1;
                    var appHtml = '<p class="linespan" style="line-height:28px;margin-left:5px;">【' + mon + '-' + myDate.getDate() + ' ' + myDate.getHours() + ':' + myDate.getMinutes()
                        + '】' + remark + '</span>';
                    $('.logdiv').prepend(appHtml);
                    $("#remark").val('');
                    layer.msg(sdata, { time: 1000 }, function () {
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
    //var tableList = table.render({
    //    elem: '#tableList'
    //    , url: '/OrderAjax/GetOrderItemNeedLIst?orderId=' + $("#orderId").val()
    //    , defaultToolbar: []
    //    , toolbar: '#toolbarDemo'
    //    , defaultToolbar: ['filter']
    //    , cols: [[
    //        { type: 'checkbox', fixed: 'left', width: 30 }
    //        , {
    //            field: 'addSoureType', title: '来源', width:50,align:'center', unresize: true, templet: function (res) {
    //                let vo = '<span class="lableb" style="background-color:#' + (res.addSoureType == 20 ? '9ACD32' : 'FF6347')
    //                    +'" title="'+ (res.addSoureType == 20 ? '该物品需求来自于订单添加' : '该物品需求来自于排团添加') + '">'
    //                    + (res.addSoureType == 20 ? '单' : '团') + '</span>';
    //                return vo;
    //            }
    //        }
    //        , {
    //            field: 'itemName', title: '物品名称', minwidth:130, unresize: true, templet: function (res) {
    //                let img = '<img src="' + res.thumbnailPic + '" style="width:24px;height:24px" alt=""/>';
    //                let div = '<a id="Item_' + res.gameItemId + '" data-id="' + res.gameItemId + '" style="margin-left:3px" class="Ginfo" href="javascript:void(0)">' + res.itemName + '</a>';
    //                return img + div;
    //            }
    //        }
    //        , {
    //            field: 'needCount', title: '需求数', align: 'center', width:70, sort: false, unresize: true, edit: 'text', templet: function (res) {
    //                return '<span title="单击可编辑数量">' + res.needCount + '</span>';
    //            }
    //        }
    //        , {
    //            field: 'completeCount', title: '已拾取数', width:70, unresize: true, align: 'center', edit: 'text', templet: function (res) {
    //                return '<span title="单击可编辑数量">' + res.completeCount + '</span>';
    //            }
    //        }
    //       , {
    //           field: 'remark', title: '备注', unresize: false, templet: function (res) {
    //               let vo = '<a href="javascript:void(0)" class="setRemark" data-id="' + res.itemNeedListId + '" data-remark="' + res.remark + '" title="' + res.remark + ' 点击可以修改备注">' + (res.remark == null || res.remark == '' ? "无" : res.remark) + '</a>';
    //               return vo;
    //           }
    //       }
    //    ]]
    //    , page: false 
    //    , done: function (res, curr, count) { 
    //    }
    //}); 
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addNewItemBtn':
                addNewItemToOrder();
                break;
            case 'isAll':
                layer.msg(checkStatus.isAll ? '全选' : '未全选');
                break;
            case 'delItem':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].itemNeedListId);
                };
                var itemNeedListId = tempData.join(',');
                delItem(itemNeedListId);
                break;
        };
    });
    table.on('edit(tableList)', function (obj) {
        var value = obj.value
            , data = obj.data
            , field = obj.field;
        if (!VerifyInt(value)) {
            layer.msg('请输入正确的数字，例如1、2、3等');
            reloadOrderList();
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpdateItemNeedListCount",
            data: { nid: data.itemNeedListId, type: obj.field == 'completeCount' ? 20 : 10, count: value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) {
                    reloadOrderList();
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
    function reloadOrderList() {
        tableList.reload({
            url: '/OrderAjax/GetOrderItemNeedLIst?orderId=' + $("#orderId").val()
            , where: {
            }
        });
        return false;
    }
    var timoutid;
    $(document).on('mouseover', '.Ginfo', function () {
        var ids = $(this).attr('data-id');
        timoutid = setTimeout(function () {
            $.ajax({
                type: "Get",
                url: "/GameAjax/getGameItemInfoByItemID",
                data: { itemId: ids },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('获取数据出现异常！'); },
                beforeSend: function (XMLHttpRequest) { layer.tips('加载中...', "#Item_" + ids); },
                success: function (data) {
                    var sdata = data.msg;
                    layer.tips(sdata, "#Item_" + ids, { tips: [3, '#080808'], time: 80000 });
                }
            });
        }, 800);
    }).mouseout(function () {
        layer.closeAll('tips');
        clearTimeout(timoutid);
    });
    $(document).on('click', '.sendCustomerLoginVerCode', function () {
        var ids = $("#orderId").val();
        layer.confirm('老板玩家的游戏号在登录时需要如何验证？请点击下方的其中一种<br/><a lay-href="/System/SmsSetting" lay-tips="去设置这里的上号验证通知内容" lay-text="短信业务设置"><cite style="color:#1E9FFF;font-size:10px">需要设置发送短信通知的内容？点击这里</cite></a>', {
            btn: ['安全令确认', '扫码上号通知', '邮箱验证码', '短信验证码']
            , yes: function (index, layero) {
                sendNotice(ids, 0);
                return false;
            },
            btn2: function (index, layero) {
                sendNotice(ids, 3);
                return false;
            },
            btn3: function (index, layero) {
                sendNotice(ids, 1);
                return false;
            },
            btn4: function (index, layero) {
                sendNotice(ids, 2);
                return false;
            }
        });
        return false;
    });
    function sendNotice(orderId, keyType) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/NoticeGamePalyerSmsCode",
            data: { orderId: orderId, keyType: keyType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 3500 }, function () {
                });
                re = true;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function addNewItemToOrder() {
        layer.open({
            title: "新增物品需求",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '95%'],
            content: '/Group/AddItemToGroup?taskId=0&orderId=' + orderId
        });
    }
    function delItem(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/PveTaskAjax/DelGroupItemByTaskIDAccId",
            data: { itemId: id, orderId: $("#orderId").val(), taskid: 0 },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                if (data.code > 0) {
                    layer.msg(sdata, { time: 1000 }, function () {
                    });
                    reloadOrderList();
                }
                else {
                    layer.msg(sdata, { time: 1000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    $(document).on('click', '.setRemark', function () {
        var ids = $(this).attr('data-id');
        var remark = $(this).attr('data-remark');
        setItemRemark(ids, remark);
    });
    function setItemRemark(ids, remark) {
        layer.prompt({ title: '编辑需求备注，不需要请填写：无', formType: 0, value: remark, maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/PveTaskAjax/SetNeedItemRemark",
                data: { ids: ids, remark: value, orderId: orderId },
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
    function showToast(text, duration = 2000) {
        const toast = document.createElement("div");
        toast.innerText = text;
        // 内联样式，保障高优先级和居中显示
        toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.75);
        color: #fff;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 99999999; /* 保证在所有 layer 弹窗最上方 */
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: opacity 0.3s ease;
        opacity: 1;
    `;

        document.body.appendChild(toast);

        // 指定时间后渐隐并移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    //群聊
    $(document).on('click', '#groupChat', function (e) {
        var $btn = $(this);

        if ($btn.data('loading')) {
            return;
        }

        var orderId = $btn.attr('data-id');
        var ids = $("#orderId").val();

        $btn.data('loading', true).css({ 'pointer-events': 'none', 'opacity': '0.6' });
        var globalLoad = layer.load(1, { shade: [0.3, '#000'] }); 

        function clearLoading() {
            layer.close(globalLoad);
            $btn.data('loading', false).css({ 'pointer-events': 'auto', 'opacity': '1' });
        }

        $.post('/orderajax/CreateTempGroup', { orderId: orderId })
            .done(function (resdata) {
                if (resdata.code > 0 || resdata.code == -10021 || resdata.code == -10025) {
                    $.get('/orderajax/GetGroupWxQrCode', { orderId: orderId })
                        .done(function (res) {
                            if (res.code > 0 || res.code == -10021 || res.code == -10025) {
                                $.ajax({
                                    type: "Get",
                                    url: "/orderajax/GetCustomerGroupCode",
                                    data: { orderId: ids },
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    success: function (data) {
                                        if (data.code > 0) {
                                            layer.open({
                                                offset: 'auto',
                                                area: ['auto', '589px'],
                                                content: '<img src="data:image/png;base64,' + res.data + '"><br><div style="width:100%;text-align: center;margin-top: 5px; "> 在线沟通沟通码：<span style="color:red;font-weight: bold;">' + data.data + '</span></div>',
                                                btn: ['复制群链接', '复制沟通码', '进入群聊'],
                                                btn1: function (index, layero, that) {
                                                    let str = '/PlatformRedirect/conversations?g=' + resdata.ext
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        navigator.clipboard.writeText(str);
                                                    } else {
                                                        const dom = document.createElement("textarea");
                                                        dom.value = str;
                                                        dom.style.position = "fixed";
                                                        dom.style.opacity = "0";
                                                        document.body.appendChild(dom);
                                                        dom.select();
                                                        document.execCommand("copy");
                                                        document.body.removeChild(dom);
                                                    }

                                                    showToast('复制成功');
                                                    return false;
                                                },
                                                btn2: function (index, layero, that) {
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        navigator.clipboard.writeText(data.data);
                                                    } else {
                                                        const dom = document.createElement("textarea");
                                                        dom.value = data.data;
                                                        dom.style.position = "fixed";
                                                        dom.style.opacity = "0";
                                                        document.body.appendChild(dom);
                                                        dom.select();
                                                        document.execCommand("copy");
                                                        document.body.removeChild(dom);
                                                    }

                                                    showToast('复制成功');
                                                    return false;
                                                },
                                                btn3: function (index, layero, that) {
                                                    const iframe = window.top.document.getElementsByClassName('chatLayer');
                                                    iframe.contentWindow.postMessage(
                                                        {
                                                            type: 'goToChat', value: {
                                                                sourceID: resdata.ext,	
                                                                conversationType: 3,	
                                                            }
                                                        },
                                                        '*'
                                                    )
                                                    window.top.gameGroupFun()
                                                }
                                            });
                                        } else {
                                            layer.msg(data.msg || '获取沟通码失败');
                                        }
                                    },
                                    error: function () {
                                        layer.msg('数据请求出现异常！');
                                    },
                                    complete: function () {
                                        clearLoading();
                                    }
                                });

                            } else {
                                layer.msg(res.msg || '获取二维码失败');
                                clearLoading(); 
                            }
                        })
                        .fail(function () {
                            layer.msg('获取二维码网络请求失败！');
                            clearLoading(); 
                        });

                } else {
                    layer.msg(resdata.msg || '创建群聊失败');
                    clearLoading(); 
                }
            })
            .fail(function () {
                layer.msg('创建群聊网络请求失败！');
                clearLoading();
            });
    });
    $(document).on('click', '.getphone', function () {
        var ids = $("#orderId").val();
        var desc = $("#desc").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetPrivatePhone",
            data: { orderId: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('数据请求出现异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                var sdata = data.msg;
                $(".getphone").html(sdata);
                desc = desc + '上号电话：' + sdata + '\n' + '（请拿自己的手机拨打以上虚拟号后根据语音提示按分机号联系老板，若使终无法联系上，请及时反馈）';
                $("#desc").html(desc);
                $("#copybtn").attr('data-clipboard-text', desc);
                layer.alert('获取成功，请拨打：' + sdata);
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    $(document).on('click', '#groupCode', function () {
        var ids = $("#orderId").val();
        $.post('/orderajax/CreateTempGroup', { orderId }, function (resdata) {
            if (resdata.code > 0 || resdata.code == -10021 || resdata.code == -10025) {
                $.ajax({
                    type: "Get",
                    url: "/orderajax/GetGroupCode",
                    data: { orderId: ids },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { re = true; layer.msg('数据请求出现异常！'); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;

                        if (data.code > 0) {
                            layer.open({
                                content: '在线沟通沟通码：<span style="color:red;font-weight: bold;">' + data.data + '</span>',//（使用后失效）
                                btn: ['点击复制', '取消'],
                                btn1: function (index, layero, that) {
                                    const dom = document.createElement("input");
                                    dom.value = data.data;
                                    document.body.appendChild(dom);
                                    dom.select();
                                    document.execCommand("copy");
                                    document.body.removeChild(dom);
                                    layer.msg('复制成功')
                                }
                            })
                        } else {
                            layer.msg(data.msg, { time: 2000 }, function () {
                            })
                        }
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
            } else {
                layer.msg(resdata.msg, { time: 2000 }, function () {
                })
            }
        })


    })

    $(document).on('click', '#groupwjCode', function () {
        var ids = $("#orderId").val();
        $.post('/orderajax/CreateTempGroup', { orderId }, function (resdata) {
            if (resdata.code > 0 || resdata.code == -10021 || resdata.code == -10025) {
                $.ajax({
                    type: "Get",
                    url: "/orderajax/GetCustomerGroupCode",
                    data: { orderId: ids },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { re = true; layer.msg('数据请求出现异常！'); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;

                        if (data.code > 0) {
                            layer.open({
                                content: '在线沟通沟通码：<span style="color:red;font-weight: bold;">' + data.data + '</span>',//（使用后失效）
                                btn: ['点击复制', '取消'],
                                btn1: function (index, layero, that) {
                                    const dom = document.createElement("input");
                                    dom.value = data.data;
                                    document.body.appendChild(dom);
                                    dom.select();
                                    document.execCommand("copy");
                                    document.body.removeChild(dom);
                                    layer.msg('复制成功')
                                }
                            })
                        } else {
                            layer.msg(data.msg, { time: 2000 }, function () {
                            })
                        }
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
            } else {
                layer.msg(resdata.msg, { time: 2000 }, function () {
                })
            }
        })


    })


    function getOrderLogs() {
        var ids = $("#orderId").val();
        var viewType = $("#viewType").val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetOrderLogs",
            data: { orderId: ids, viewType: viewType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('获取订单日志失败'); },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
                re = true;
                let html = '';
                if (data.code > 0) {
                    let d = data.data;
                    for (let i = 0; i < d.length; i++) {
                        if (d[i].Note.indexOf('的系统里一键发送到了本系统中') > -1) {
                            continue;
                        }
                        let reBtn = '';
                        let color1 = 'color:#999';
                        if (d[i].Note.indexOf('客户回复消息') > -1 || d[i].Note.indexOf('登录上号验证码') > -1 || d[i].Note.indexOf('玩家回传登录') > -1 || d[i].Note.indexOf('第三方平台') > -1 || d[i].Note.indexOf('问题原因') > -1 || d[i].Note.indexOf('回复上号验证') > -1 || d[i].Note.indexOf('交易订单新留言') > -1) {
                            color1 = 'color:#E03636';
                        }
                        else if (d[i].Note.indexOf('获取客户电话') > -1) {
                            color1 = 'color:#F3723A';
                        }
                        if (d[i].Note.indexOf('客户回复消息') > -1 || d[i].Note.indexOf('登录上号验证码') > -1 || d[i].Note.indexOf('玩家回传登录') > -1 || d[i].Note.indexOf('回复上号验证') > -1) {
                            reBtn = '<a href="javascript:void(0)" class="layui-btn layui-btn-xs layui-btn-normal recMsg" data-id="' + d[i].ID + '" style="height:18px;margin-left:10px">回复</a>';
                        }
                        html += '<p class="linespan" style="line-height:28px;margin-left:5px; ' + color1 + '">【' + d[i].createTime + '】' + d[i].Note.replace("添加了订单备注", "") + reBtn + '</p>';
                    }
                }
                $(".logdiv").html(html);
            }
            , complete: function (XMLHttpRequest) { }
        });
    }
    $(document).on('click', '.recMsg', function () {
        var id = $(this).attr('data-id');
        layer.prompt({ title: '请输入回复内容，勿写营销、加Q加微信加群网址等字符', formType: 2 }, function (text, index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ReplyOrderCustomerMsg",
                data: { id: id, content: text },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); layer.close(index); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    var sdata = data.msg;
                    layer.msg(sdata, { time: data.code < 1 ? 3000 : 1000 });
                    if (data.code > 0) {
                        layer.close(index);
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
        return false;
    });
    $(document).on('click', '.sendCustomerSH', function () {
        sendSxhNotityToPalyer(10);
        return false;
    });
    $(document).on('click', '.sendCustomerXH', function () {
        sendSxhNotityToPalyer(20);
        return false;
    });
    $(document).on('click', '.setSphone', function () {
        layer.prompt({ title: '请输入指定上号电话，若不需要请输入任意1个字符', formType: 0, value: '', maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderShphone",
                data: { idx: orderId, sphone: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1500 }, function () {
                            location.reload();
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
    });
    $(document).on('click', '.unbindPrphone', function () {
        layer.confirm('确定将该订单的虚拟号码释放吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/OrderUnVirtualPhone",
                data: { orderId: orderId },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            location.reload();
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
    });
    $(document).on('click', '.jsr', function () {
        var ids = $("#orderId").val();
        try {
            let domain = window.location.host;
            execJs.showNewWindow(domain + '/order/Assignation?orderId=' + ids)
        } catch (ex) {
            layer.open({
                title: "将订单指派给接手人/代练员",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['85%', '95%'],
                content: 'Assignation?orderId=' + ids
            });
        }


    });
    $(document).on('click', '.setdlsta', function () {
        var ids = $("#orderId").val();
        layer.open({
            title: "更改订单状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '230px'],
            content: 'SetOrderSta?orderId=' + ids + '&type=1'
        });
    });
    $(document).on('click', '.spliteorder', function () {
        layer.prompt({ title: '多个新项目请用斜杠符号/来分隔', formType: 0, maxlength: 220 }, function (value, index, elem) {
            if (value === '') {
                return elem.focus();
            } else {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/SplitOrderByLine",
                    data: { orderId: orderId, project: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('请求异常！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.close(index);
                            layer.alert(data.msg, function (lx) {
                                layer.close(lx);
                                parent.tools.reloadOrderData();
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
            }
        });
        return false;
    });
    function sendSxhNotityToPalyer(stype) {
        layer.prompt({ title: '可以输入附加内容，若不需要可写无', formType: 0, value: '无' }, function (text, index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/SendShNotityToPalyer",
                data: { orderId: orderId, stype: stype, appContent: text },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); layer.close(index); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    var sdata = data.msg;
                    layer.msg(sdata, { time: data.code < 1 ? 3000 : 1000 });
                    if (data.code > 0) {
                        layer.close(index);
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    }
    $(document).on('click', '.setpwd', function () {
        layer.prompt({ title: '请输入新的密码', formType: 0, value: '', maxlength: 32 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderPwd",
                data: { orderId: orderId, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        $(".pwd").text('******');
                        $(".copypwd").attr('data-clipboard-text', '').hide();
                        $(".revealpwd").show();
                    }
                    layer.msg(data.msg, { time: 1500 }, function () {
                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });
    });
    var indexLoad;
    var isTips = false;
    function getPlatfromOrderIds() {
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetPlatfromOrderIdList",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
                if (data.code > 0) {
                    $(".itemlist").hide();

                    for (let i = 0; i < data.data.length; i++) {
                        let item = data.data[i];
                        let postions = item.transfType;
                        // 添加TAB，使用初始的空内容占位
                        element.tabAdd('tab1', {
                            title: '<span class="t' + i + '" data-tid="' + item.tid + '" data-pid="' + item.platfromId + '">' + item.platfromName + (postions==20?"[接]":"")+ (item.currentType == 1 ? '(历史)' : '') + '</span>'
                            , content: '<div id="contentPlaceholder_' + item.tid + '" style="width: 100%; height: 100%;"></div>'
                            , id: item.tid
                        });
                    }
                }
                element.render('tab');
                if (getUrlParams(location.href) && getUrlParams(location.href).tid) {
                    tid = getUrlParams(location.href).tid
                    $('[lay-id="' + tid + '"]').click()

                }
                var tips;
                if (data.code > 0) {
                    setTimeout(function () {
                        $("#mytips").show();
                        $("#mytips").removeClass('myscale');
                    }, 1000);
                    setTimeout(function () {
                        $("#mytips").hide();
                    }, 10000);
                    $(".t0").on({
                        mouseenter: function () {
                            $("#mytips").show();
                            $("#mytips").removeClass('myscale');
                            //var that = this;
                            //tips = layer.tips('这里可以查看或操作交易平台的订单', that, {
                            //    tips: [3, '#5FB878'],
                            //    time: 0
                            //});
                        },
                        mouseleave: function () {
                            $("#mytips").addClass('myscale');
                            $("#mytips").hide();
                            //layer.close(tips)
                        }
                    })
                    getTransactionOrderListSimpl();
                }
            }
            , complete: function (XMLHttpRequest) { }
        });
    }
    // 监听交易单切换事件
    element.on('tab(tab1)', function (data) {
        let tabId = data.index;
        let titleElement = $(data.elem).find('.layui-tab-title .layui-this span');
        let itemTid = titleElement.data('tid');
        let itemPid = titleElement.data('pid');
        const iframeContainer = $('#contentPlaceholder_' + itemTid);
        if (iframeContainer.children().length === 0) {
            iframeContainer.html('<iframe src="platfromorderview?orderId=' + orderId + '&tid=' + itemTid + '&platfromId=' + itemPid + '" frameborder="0" id="platfromid_' + itemTid + '" style="width: 100%; height:100%;"></iframe>');
        }
    });
    function getTransactionOrderListSimpl() {
        //$(".trasnview").show();
        table.render({
            elem: '#tableList3'
            , url: '/OrderAjax/GetTransactionOrderListSimpl?orderId=' + $("#orderId").val()
            , defaultToolbar: []
            , height: 185
            , cols: [[
                {
                    field: 'platformName', title: '平台名称', width: 100, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span style="color:#5fb878">' + res.platformName + '</span>';
                        switch (res.platformName) {
                            case '代练通':
                                vo = '<span style="color:#16b777">' + res.platformName + '</span>';
                                break;
                            case '代练妈妈':
                                vo = '<span style="color:#ff5722">' + res.platformName + '</span>';
                                break;
                            case '趣代练':
                                vo = '<span style="color:#ff5722">' + res.platformName + '</span>';
                                break;
                            case '咕噜代练':
                                vo = '<span style="color:#1e9fff">' + res.platformName + '</span>';
                                break;
                            case '易代练':
                                vo = '<span style="color:#a233c6">' + res.platformName + '</span>';
                                break;
                            case '代练宝':
                                vo = '<span style="color:#23292e">' + res.platformName + '</span>';
                                break;
                            case '代练丸子':
                                vo = '<span style="color:#31bdec">' + res.platformName + '</span>';
                                break;
                            case '代练多':
                                vo = '<span style="color:#a233c6">' + res.platformName + '</span>';
                                break;
                        }
                        return vo;
                    }
                }
                , {
                    field: 'pushPrice', title: '发单价', align: 'center', width: 70, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#ff8080">' + res.pushPrice + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'shuang', title: '双金', align: 'center', width: 70, sort: false, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#393D49">' + (res.safeAmount + res.diffAmount) + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realPayAmount', title: '结算金额', align: 'center', width: 70, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#fd5b27">' + res.realPayAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'pcAmount', title: '获赔金额', align: 'center', width: 70, unresize: false
                }
                , {
                    field: 'platmStatus', title: '交易状态', width: 80, unresize: false, align: 'center'
                }
                , {
                    field: 'actionss', title: '操作', width: 90, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="layui-btn layui-btn-sm viewtotab" data-tid="' + res.tid + '" title="点击查看交易详情">查看详情</a>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) {
            }
        });

        table.render({
            elem: '#tableList4'
            , url: '/OrderAjax/GetPushPlatfromOrderActionLogList?orderId=' + $("#orderId").val()
            , defaultToolbar: []
            , height: 185
            , cols: [[
                {
                    field: 'actionUserName', title: '用户', width: 110, align: 'center', unresize: false
                }
                , {
                    field: 'actionName', title: '操作', align: 'center', width: 80, unresize: false
                }
                , {
                    field: 'actionTime', title: '操作时间', align: 'center', width: 100, sort: true, unresize: false
                }
                , {
                    field: 'tid', title: '交易单号', width: 180, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="viewtotab" data-tid="' + res.tid + '" title="点击查看交易详情">' + res.tid + '</a>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) {
            }
        });
    }
    $(document).on('click', '.viewtotab', function () {
        var stid = $(this).attr('data-tid');
        element.tabChange('tab1', stid);
        return false;
    });
    function getActionOrderLog() {
        tableList_ActionLog = table.render({
            elem: '#tableList_actionlog'
            , height: 320
            , url: '/OrderAjax/GetSysmteLogByOrderList?orderId=' + orderId
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'createTime', title: '时间', width: 90, align: 'center', unresize: false, sort: true
                }
                , {
                    field: 'remark', title: '操作说明', minwidth: 100, unresize: false
                }
                , {
                    field: 'userName', title: '操作人', align: 'center', width: 70, sort: false
                }
            ]]
            , page: false
            , done: function (res, curr, count) {
            }
        });
    }
    element.on('tab(logFilter)', function (data) {
        var tapId = data.index;
        if (tapId == 2) {
            $('.interfaceDiv').hide();
        } else {
            $('.interfaceDiv').show();
        }
    });
    $(document).on('click', '.toPlayerChat', function () {
        certLayer = layer.open({
            type: 2,
            title: '请用微信扫码(3分钟之内有效)',
            shadeClose: true,
            maxmin: false, //开启最大化最小化按钮
            area: ['375px', '440px'],
            content: '../Order/PlayerChat?orderId=' + orderId
        });
        return false;
    });

    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
            location.reload();
        },
        reloadOrderDataNoCloseLayer: function () {
            //不关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});
