
layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table'], function () {
    var $ = layui.$;
    var form = layui.form;
    var layer = layui.layer;
    var laydate = layui.laydate;
    var util = layui.util;
    var re = true;
    var cid = 0
    var devices = layui.device();
    var isPc = true;
    var hid =0
    if (devices.android === true || devices.ios === true) {

        $('.AddCustomerForm').removeClass('AddCustomerForm')
    }
    laydate.render({
        elem: '#birthday',
        format: 'MM-dd',
        min: new Date().getFullYear() + '-01-01',
        max: new Date().getFullYear() + '-12-31',
    });

    function clearNoNum(value) {
        value = value.replace(/[^\d.]/g, "");
        value = value.replace(/\.{2,}/g, ".");
        value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        if (value.indexOf(".") < 0 && value != "") {
            value = parseFloat(value);
        }
        return value

    }
    function totalPrice() {
        var data = form.val('component-form-group');
        form.val('component-form-group', { initAmount: clearNoNum(data.initAmount) });
        form.val('component-form-group', { giftAmount: clearNoNum(data.giftAmount) });
        if (data.initAmount && data.initAmount > 0) {
            $('.initPayVisbleDiv').show()
        } else {
            $('.initPayVisbleDiv').hide()
        }
        var data = form.val('component-form-group');
        $('.totalPrice').text(Number(data.initAmount) + Number(data.giftAmount))
    }
    $("#initSaveFee").on("input", function (e) {
        totalPrice()
    });
    $("#giftAmount").on("input", function (e) {
        totalPrice()
    });
    $("#totalConsumeFee").on("input", function (e) {
        var data = form.val('component-form-group');
        form.val('component-form-group', { totalConsAmount: clearNoNum(data.totalConsAmount) });
    });
    $("#totalHistorRecharge").on("input", function (e) {
        var data = form.val('component-form-group');
        form.val('component-form-group', { historRecharge: clearNoNum(data.historRecharge) });
    });
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month.toString().padStart(2, '0');
        day = day.toString().padStart(2, '0');
        return `${month}-${day}`;
    }
    if (getUrlParams(location.href) && getUrlParams(location.href).id && getUrlParams(location.href).id !=0) {
        cid = getUrlParams(location.href).id
        hid = getUrlParams(location.href).hid
        $.ajax({
            type: "Get",
            url: "/api/CustomerApi/CustomerDetail/" + hid,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(indexLoad);
                const listData = data.data
                    if (listData.discount) {
                        listData.setDiscount = listData.discount
                    }
                if (listData.discountLevelInfluence === 1) {
                    listData.discountLevelInfluence = 'on'
                }
                if (listData.setDiscount == '0.00') {
                    listData.setDiscount = 0
                }
                if (listData.birthday) {
                    listData.birthday = formatDate(listData.birthday);
                }
                form.val('component-form-group', listData)
                $('.initSaveFeeItem').hide()
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

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

    form.verify({
        customerNo: function (value, elem) {
            if (value.length < 1) {
                return '会员号长度不能小于1';
            }
        },
        initSaveFee: function (value, elem) {
            if (value < 0) {
                return '初始预存额不能小于0';
            }
        },
        giftAmount: function (value, elem) {
            if (value < 0) {
                return '预存赠送额不能小于0';
            }
        },
        historyTotalConsume: function (value, elem) {
            if (value < 0) {
                return '历史消费总额不能小于0，可以只填0';
            }
        },
        historTotalPay: function (value, elem) {
            if (value < 0) {
                return '历史充值总额不能小于0，可以只填0';
            }
        },
        phone: function (value, elem) {
            if (!value) return;
            if (!(/^1[3456789]\d{9}$/.test(value))) {
                return '请输入正确的手机号';
            }
        },
    });

    $.ajax({
        url: '/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=Y&isOnlySelectSelf=N&editUserName=&dy=1',
        method: 'GET',
        success: function (data) {
            if (data.code >= 0) {
                var select = $('#servicePersonUserId');
                var gameData1 = data.data
                var str = ''

                gameData1.forEach(function (item) {
                    str += ` <option value="${item.value}">${item.name}</option> `
                });
                select.append(str);

                layui.form.render("select");
            } else {
            }
        },
    });

    $(document).on('click', '.randBuilderNo', function () {
        if (!re) { return false; }
        re = false;
        $.ajax({
            type: "Post",
            url: "/api/CustomerApi/randBuilderNo",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    form.val('component-form-group', { customerNo: Number(data.data) });
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
    })


    form.on('submit(saveBtn)', function (data) {
        if (data.field.discountLevelInfluence == 'on') {
            data.field.discountLevelInfluence = '1'
        } else {
            data.field.discountLevelInfluence = '0'
        }
        var strparameter = data.field;
        strparameter.id = hid
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
            url: "/api/CustomerApi/CreateModifyCustomer",
            data: strparameter,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0 && hid == 0) {
                    layer.alert('保存成功', { icon: 1 }, function (er) {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.tools.reloadOrderData();
                    });
                    //var index = layer.confirm(data.remark, {
                    //    area: ['700px', 'auto'],
                    //    btn: ['点击复制', '确定']
                    //}, function () {
                    //    var textarea = document.createElement('textarea');
                    //    document.body.appendChild(textarea);
                    //    textarea.style.position = 'absolute';
                    //    textarea.style.clip = 'rect(0 0 0 0)';
                    //    textarea.value = data.remark;
                    //    textarea.select();
                    //    document.execCommand('copy', true);
                    //    layer.close(index);
                    //    layer.msg('复制成功')
                    //    $('.games').attr("checked", false);
                    //    gamesList = []
                    //    $(".layui-form")[0].reset();
                    //    layui.form.render();

                    //    window.location.reload();
                    //}, function () {
                    //    var textarea = document.createElement('textarea');
                    //    document.body.appendChild(textarea);
                    //    textarea.style.position = 'absolute';
                    //    textarea.style.clip = 'rect(0 0 0 0)';
                    //    textarea.value = data.remark;
                    //    textarea.select();
                    //    document.execCommand('copy', true);
                    //    layer.close(index);
                    //    layer.msg('复制成功')
                    //    $('.games').attr("checked", false);
                    //    gamesList = []
                    //    $(".layui-form")[0].reset();
                    //    layui.form.render();
                    //    window.location.reload();
                    //});
                } else if (hid != 0 && data.code > 0) {
                    layer.alert('修改成功', { icon: 1 }, function (er) {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);
                        parent.tools.reloadOrderData();
                    });
                } else {
                    layer.msg(data.msg)
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });


});






