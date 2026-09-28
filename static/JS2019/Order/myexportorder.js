layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form','util'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var devices = layui.device();
    var isPc = true; 
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var ok = true; 
    form.on('submit(exportBtn)', function (data) {
       
        if (data.field.importConten == "" || data.field.importConten == undefined || data.field.importConten == null) {
            layer.msg('请选择一种导出内容');
            return false;
        }

        var orderID = data.field.orderID;
        var seachText = data.field.seachText;
        var exportType = data.field.importConten;
        var dataType = data.field.datatype;
        var param = 'orderId=' + orderID + '&exportType=' + exportType + '&dataType=' + dataType;
        param = param + '&' + seachText; 
        window.open("/Order/MyExportByOrderByIDX?" + param, "_blank");
        return false;
    }); 
});
