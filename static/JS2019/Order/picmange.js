layui.use(['form'], function () {
    var form = layui.form
    , layer = layui.layer
    , $ = layui.jquery; 
    var re = true;
    var ckids = [];
    var indexLoad;
    layer.photos({
        photos: '.imgList'
        , anim: 5
    });
    $(document).on('click', '.orderdetails', function () {
        var ids = $(this).attr('data-id');
        var viewID = $(this).attr('data-viewId');
        viewOrderDetails(ids, viewID);
    });
    form.on('submit(viewPicBtn)', function (data) {
        viewOrderPic($("#orderId").val(), $("#taskId").val());
        return false;
    }); 
    $(".viewPic").click(function () {
        viewOrderPic($("#orderId").val(), $("#taskId").val());
        return false;
    }); 
    $(".del").click(function () { 
        var ids = $(this).attr('data-id');
        layer.confirm('确定要删除吗？提示：一旦删除，将不可恢复！', {
            btn: ['确定', '取消']
        }, function () {
            if (!re)
                return false;
            re = false;
            //请求
            $.ajax({
                type: "Post",
                url: "/OrderAjax/DelPic",
                data: { picID: ids },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            location.reload();
                        });
                    } else {
                        layer.msg(data.msg, { time: 1500 }, function () {
                        });
                    } 
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        }); 
        return false;
    }); 
    form.on('submit(importBtn)', function (data) {  
        window.open("ImportPicRar?orderId=" + data.field.orderId + "&taskId=" + data.field.taskId, "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    });
    form.on('checkbox(allChoose)', function (data) {
        var child = $(".imgList input[type='checkbox']");
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    form.on('submit(delbtns)', function (data) {
        var ids = data.field.ck;
        ckids = [];
        $("input[type='checkbox'][name='ck']").each(function () {
            if ($(this).is(":checked")) {
                ckids.push($(this).val());
            }
        });
        if (ckids.length < 1) {
            layer.msg('请勾选图片再批量删除', { time: 1500 }, function (res) {
                return false;
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/DelPicMultiple",
            data: { ids: ckids.join(',') },
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
        return false;
    });

    
   
});