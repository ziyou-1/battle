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
    var typeid = $("#typeid").val();
    var shopTypeList = [];
    loadQATypes();
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {

        }
    });
    layedit.set({
        uploadImage: {
            url: '/CommonPermissionAjax/UploadSingleImg',
            accept: 'image',
            acceptMime: 'image/*',
            exts: 'jpg|png|gif|bmp|jpeg',
            size: 1024 * 1
        }
        , calldel: {
            url: '/CommonPermissionAjax/DelSingleImg',
            done: function (data) {

            }
        },
        backDelImg: false
        , devmode: false
        , autoSync: true
        , codeConfig: {
            hide: true,
            default: 'javascript',
            encode: true
            , class: 'layui-code'
        }
        , quote: {
            style: ['Content/css.css'],
            //js: ['/Content/Layui-KnifeZ/lay/modules/jquery.js']
        }
        , facePath: 'http://knifez.gitee.io/kz.layedit/Content/Layui-KnifeZ/'
        , devmode: true
        , videoAttr: ' preload="none" '
        , tool: [
            'html', 'undo', 'redo', 'code', 'strong', 'italic', 'underline', 'del', 'addhr', '|', 'removeformat', 'fontFomatt', 'fontfamily', 'fontSize', 'fontBackColor', 'colorpicker', 'face'
            , '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'image_alt', 'anchors'
            , '|'
            , 'table', 'customlink'
            , 'fullScreen', 'preview'
        ]
        , height: '500px'
    });
    var ieditor = layedit.build('layeditDemo');
    form.on('submit(postBtn)', function (data) {
        let content = layedit.getContent(ieditor); 
        if (content.length < 10) {
            layer.msg('内容不能为空或少于10个字符', { time: 1500 });
            return false;
        }
        var param = JSON.stringify(data.field);
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/SaveQAContent",
            data: { paramsStr: param, content: content },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
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
    $(document).on('click', '.additem', function () {
        layer.prompt({ title: '新增QA分类（最多10个字符）', formType: 0, value: '', maxlength:10 }, function (value, index, elem) {
            if (value == '默认' || value == '全部') {
                layer.alert('新建分类不能用这个名称，请换个名称');
                return false;
            }
            for (let i = 0; i < shopTypeList.length; i++) {
                if (shopTypeList[i].str1 == value) {
                    layer.alert('分类列表里已有该名称，请换个名称');
                    return false;
                }
            }
            $.ajax({
                type: "POST",
                url: "/EmpAjax/AddEditQATypeName",
                data: { id: 0, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求报错'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        typeid=(data.code);
                        loadQATypes();
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
    });
    $(document).on('click', '.edititem', function () {
        var id = $("#helperType").val();
        var name = $("#helperType").find("option:selected").text();
        layer.prompt({ title: '编辑分类名称（最多10个字符）', formType: 0, value: name, maxlength: 10 }, function (value, index, elem) {            
            $.ajax({
                type: "POST",
                url: "/EmpAjax/AddEditQATypeName",
                data: { id: id, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求报错'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        typeid=id;
                        loadQATypes();
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
    });
    $(document).on('click', '.delitem', function () {
        var id = $("#helperType").val();
        layer.confirm('请再次确认是否删除该大类？大类删除后，下面的小类将会全看不见的', function (index) {
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
    });
    
    function loadQATypes() {
        $.ajax({
            type: "POST",
            url: "/EmpAjax/GetQATypeList",
            data: { },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取分类'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $("#helperType").empty(); //清空
                //$("#helperType").prepend("<option value=''>默认</option>");
                shopTypeList = data.data;
                for (let i = 0; i < shopTypeList.length; i++) {
                    var option = '<option value="' + shopTypeList[i].id + '"' + (shopTypeList[i].id == typeid ? 'selected="selected"' : '') + '>' + shopTypeList[i].str1 + '</option>';
                    $("#helperType").append(option);
                }
                form.render('select');
                if (shopTypeList.length > 0) {
                    $(".editdiv").show();
                    $(".deldiv").show();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    } 
});