layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        upload = layui.upload; 
    var upindex;
    var accTypesRd = "A";
    var uploadInst1 = upload.render({
        elem: '#upmypic'
        , accept: 'file'
        , method: 'post'
        , acceptMime: 'file/xls,file/xlsx,file/txt'
        , exts: 'xls|xlsx|txt'
        , size: 1024 * 5
        , url: '/GameAccountsAjax/ImputGameAccByExecl'
        , data: {
            gameName: function () {
                return $("#gameName").find("option:selected").text();
            },
            formats: function () {
                return 1;
            },
            gtype: function () {
                return accTypesRd;
            }
        }
        , before: function (obj) {
            upindex = layer.load(1, { shade: false });
        }
        , done: function (res) {
            layer.close(upindex);
            if (res.code > 0) {
                layer.alert('导入完成，总计成功'+res.code+'笔，请到“管理内部账号”页面刷新列表查看');
            }
            else {
                layer.alert(res.msg);
            }
            return false;
        }
        , error: function () {
            //失败状态，并实现重传
            layer.msg('上传失败了', { time: 1500 }, function () {
            });
        }
    });
    form.on('select(selectGame)', function (data) {
        if (data.value == "英雄联盟" || data.value == "英雄联盟手游") {
            $(".loldiv").show();
        }
        else {
            $(".loldiv").hide();
        } 
    });
    form.on('radio(accTypeRd)', function (data) {
        if (data.value == 2) {
            $(".ge2").show();
            $(".ge1").hide();
            $(".ge3").hide();
            $(".ge4").hide();
        }
        else if (data.value == 3) {
            $(".ge3").show();
            $(".ge1").hide();
            $(".ge2").hide();
            $(".ge4").hide();
        }
        else if (data.value == 4) {
            $(".ge4").show();
            $(".ge1").hide();
            $(".ge2").hide();
            $(".ge3").hide();
        }
        else {
            $(".ge2").hide();
            $(".ge1").show();
            $(".ge3").hide();
            $(".ge4").hide();
        }
        let fileType = "file/xls,file/xlsx";
        if (data.value == 2) {
            fileType = "file/txt";
        }
        uploadInst1.reload({
            elem: '#upmypic'
            , acceptMime: fileType
            , exts: data.value == 2 || data.value == 4 ? 'txt' :'xls|xlsx'
            , data: {
                gameName: function () {
                    return $("#gameName").find("option:selected").text();
                },
                formats: function () {
                    return data.value;
                },
                gtype: function () {
                    return accTypesRd;
                }
            }
        });
    });
    form.on('radio(accTypesRd)', function (data) {
        accTypesRd = data.value;
    });
});