layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'layedit'], function () {
    var $ = layui.$,
        form = layui.form,
        layedit = layui.layedit,
        util = layui.util; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true; 
        var indexLoad; 
        var editIndex = layedit.build('LAY_demo_editor', {
            tool: [
                'strong' //加粗
                , 'italic' //斜体
                , 'underline' //下划线
                , 'del' //删除线
                , '|' //分割线
                , 'left' //左对齐
                , 'center' //居中对齐
                , 'right' //右对齐
                , 'link' //超链接
                , 'unlink' //清除链接
                , 'face' //表情
            ]
        });

        form.on('submit(savebtn)', function (data) {
            if (data.field.title == "" || data.field.title == undefined) {
                layer.msg('资料/套餐标题不能为空');
                return false;
            }
            var cont = layedit.getContent(editIndex);
            if (cont == null || cont == "" || cont == undefined || cont.length < 10) {
                layer.alert("资料/套餐内容不能少于10个字符！", {
                    title: '提示'
                });
                return false;
            }
            var id = data.field.id;
            var strparameter = JSON.stringify(data.field);
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/AddEditLearmInformation",
                data: { param: strparameter, id: id, content: cont },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        if (data.code > 0) {
                            parent.tools.reloadOrderData();
                        }
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