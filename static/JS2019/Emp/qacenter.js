layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'layedit'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        laydate = layui.laydate;
    var layedit = layui.layedit;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var device = isPc;
    var id = $("#id").val();
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {

        }
    });
    var addLayerIndex;
    $(document).on('click', '.add', function () {
        addedit(0);
        return false;
    })
    $(document).on('click', '.editqa', function () {
        let id = $(this).attr('data-id');
        addedit(id);
        return false;
    })
    function addedit(id) {
        addLayerIndex = layer.open({
            title: (id > 0 ? "编辑" : "新增") + "QA文档",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '95%'],
            content: 'AddEditQA?id=' + id
        });
    }
    form.on('submit(seachBtn)', function (data) {
        let key = $("#seachKey").val();
        location.href = 'QACenter?key=' + key;
        return false;
    }); 
    $(document).on('click', '.delqa', function () {
        let id = $(this).attr('data-id'); 
        layer.confirm('请再次确认是否删除？', function (index) { 
            $.ajax({
                type: "POST",
                url: "/EmpAjax/AddEditQATypeName",
                data: { id: id, value: 'ss', type: 20 },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求报错'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        location.reload();
                    } else {
                        layer.msg(data.msg);
                    }
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    })
    
});