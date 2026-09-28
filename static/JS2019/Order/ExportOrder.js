layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var ok = true;
    var selectCol = [];

    if ($("#importCol").val()) {
        selectCol = $("#importCol").val().split(',')
    }

    form.on('checkbox(importcol)', function (data) { 
        if (data.elem.checked) {
            for (let i = 0; i < selectCol.length; i++) {
                if (selectCol[i].userId == data.value) {
                    return false;
                }
            }
            selectCol.push(data.value);
        } else {
            for (let i = 0; i < selectCol.length; i++) {
                if (selectCol[i] == data.value) {
                    selectCol.splice(i, 1);
                    break;
                }
            }
        } 
    });
    form.on('radio(importConten)', function (data) {
        if (data.value == 10 || data.value == 50 || data.value == 60) {
            $(".selectColDiv").show();
            if (!ok)
                return false;
            ok = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/GetMyExportOrderColCache",
                data: { exportType: data.value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { ok = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        var dlist = data.data;
                        $('input[name=importcol]').prop('checked', false);
                        form.render('checkbox');
                        selectCol = [];
                        for (var i = 0; i < dlist.length; i++) {
                            $("input[name='importcol']").each(function (index, elem) {
                                if (elem.value == dlist[i]) {
                                    this.checked = true;
                                    selectCol.push(dlist[i]);
                                }
                            });
                        }
                        form.render('checkbox');
                    }
                    else {
                        $('input[name=importcol]').prop('checked', true);
                        form.render('checkbox');
                    }
                    ok = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        }
        else {
            $(".selectColDiv").hide();
        }
    });
    form.on('submit(exportBtn)', function (data) {
        if (data.field.datatype == "" || data.field.datatype == undefined || data.field.datatype == null) {
            layer.msg('请选择一种导出数据');
            return false;
        }
        if (data.field.importConten == "" || data.field.importConten == undefined || data.field.importConten == null) {
            layer.msg('请选择一种导出内容');
            return false;
        }
        //console.log(selectCol);
        let selectColStr = selectCol.join(',');
        if (data.field.importConten == 10 && (selectColStr == '' || selectColStr == null)) {
            layer.msg('请至少选择一个导出列');
            return false;
        }
        if (data.field.pwd == null || data.field.pwd == '') {
            layer.msg('请输入当前账号登录或导出密码');
            return false;
        }

        var orderID = data.field.orderID;
        var seachText = data.field.seachText;
        var exportType = data.field.importConten;
        var dataType = data.field.datatype;  
        var pd = data.field.pwd;
        var param = 'orderId=' + orderID + '&pd=' + pd + '&exportType=' + exportType + '&dataType=' + dataType + '&importcol=' + selectColStr;
        param = param + '&' + seachText;
        window.open("/Order/ExportByOrderByIDX?" + param, "_blank");
        return false;
    });
});
