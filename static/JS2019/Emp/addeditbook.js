layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form','util', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var upload = layui.upload;
        var re = true; 
        var indexLoad;
        var uploadInst = upload.render({
            elem: '#upbtn'
            , accept: 'images'
            , acceptMime: 'image/jpg, image/png,image/bmp,image/jpge'
            , exts: 'jpge|jpg|png|bmp'
            , url: '/CommonPermissionAjax/UploadSingleImg'
            , size:1024*1
            , done: function (res) {
                if (res.code > 0) {
                    layer.msg('图片上传成功', { time: 1000 }, function () {
                        $("#uploadUrl").val(res.msg);
                        $("#upbtn").text('图片已上传成功');
                        $(".success").show();
                    });
                } else {
                    layer.msg(res.msg, { time: 1000 }, function () {
                        $("#uploadUrl").val('');
                        $("#upbtn").text('上传失败，请重新上传');
                        $(".success").hide();
                    });
                }
                
            }
            , error: function () {
                layer.msg('图片上传出现错误，可待修复后再上传', { time: 2000 }, function () {
                });
            }
        });
        form.on('submit(savebtn)', function (data) {
            if (data.field.title == "" || data.field.title == undefined) {
                layer.msg('标题不能为空');
                return false;
            }
            if (data.field.fee == "" || data.field.fee == undefined) {
                layer.msg('金额不能为空，哪怕写个数字0');
                return false;
            }
            var bookId=data.field.bookId;
            var strparameter = JSON.stringify(data.field);
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/AddEditBook",
                data: { param: strparameter, bookId: bookId },
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