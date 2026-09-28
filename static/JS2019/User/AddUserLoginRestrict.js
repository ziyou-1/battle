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
    var ok = true;
    var indexLoad;
    var weekDayList = [];
    if ($("#weekDayStr").val() != "")
        for (var i = 0; i < $("#weekDayStr").val().split(',').length; i++) {
            weekDayList.push($("#weekDayStr").val().split(',')[i]);
        }

    var userLoginRestrictIds = $("#userLoginRestrictIds").val();
    getUserListData();
    function getUserListData() {
        $.get('/UserAjax/GetUserListByLoginRestrict?userLoginRestrictId=' + userLoginRestrictIds, function (result) {
            formSelects.data('userList', 'local', {
                arr: result.data
            });
        });
    }
    form.verify({
        ip: function (value, item) {
            // 验证单个IP地址
            function isValidIP(ip) {
                var reg = /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)$/;
                return reg.test(ip);
            }

            // 验证单个网段（CIDR格式）
            function isValidCIDR(cidr) {
                var reg = /^((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)\/([0-9]|[1-2][0-9]|3[0-2])$/;
                return reg.test(cidr);
            }

            // 验证IP或网段
            function isValidIPOrCIDR(str) {
                return isValidIP(str) || isValidCIDR(str);
            }

            // 按行分割，去除空行和首尾空格
            if (value && value.trim().length > 0) {
                var lines = value.split(/\r?\n/);
                var invalidItems = [];

                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i].trim();
                    // 跳过空行
                    if (line === '') {
                        continue;
                    }
                    // 验证每一行
                    if (!isValidIPOrCIDR(line)) {
                        invalidItems.push(line);
                    }
                }

                // 如果有无效的条目
                if (invalidItems.length > 0) {
                    if (invalidItems.length === 1) {
                        return '请输入正确的IP地址或网段格式：' + invalidItems[0];
                    } else {
                        return '第' + (lines.indexOf(invalidItems[0]) + 1) + '行的格式不正确（共' + invalidItems.length + '处错误）\n正确格式示例：\n171.83.117.110\n170.84.120.0/24';
                    }
                }
            }
        }
    });
    form.on('checkbox(weekDay)', function (data) {
        if (data.elem.checked) {
            weekDayList.push(data.value);
        } else {
            weekDayList.remove(data.value);
        }
        $("#weekDayStr").val(weekDayList.sort((a, b) => a - b));
    });
    form.on('select(restrictType)', function (data) {
        if (data.value == "0") {
            $("#ipWhitelist").show();
        } else {
            $("#ipWhitelist").hide();
            $("#ipWhitelist").val("");
        }
    });
    form.on('submit(savebtn)', function (data) {
        if (data.field.userList == "" || data.field.userList == undefined) {
            layer.msg('限制用户不能为空');
            return false;
        }
        var strparameter = JSON.stringify(data.field);

        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/AddEditUserLoginRestrict",
            data: { strparameter: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请检查每一位是否有格式上的错误！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.alert(data.msg, function () {
                        location.reload();
                        parent.tools.reloadOrderData();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 3000 });
                }
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
});

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};