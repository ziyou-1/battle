layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    aliossUploader: '/lib/aliossUploader'
}).use(['index', 'form','util', 'table', 'aliossUploader'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    } 
    var aliossUploader = layui.aliossUploader; 
    var re = true;
    var indexLoad;
    var count = 20;
    var fileList = []; 
    aliossUploader.render({
        elm: '#selectImg',
        region: 'oss-cn-hangzhou',
        bucket: 'worsystem',
        layerTitle: '上传图片',
        accessidFiled: 'accessid',
        policyFiled: 'policy',
        signatureFiled: 'signature',
        codeFiled: 'code',
        codeStatus:0,
        policyMethod: 'GET',
        policyData: {},
        policyHeader: {
            Authorization: layui.data('XCORS').Authorization
        },
        policyUrl: '/CommonPermissionAjax/GetAliOssPolicy',
        httpStr: 'https',
        layerArea: ['90%', '90%'],
        prefixPath: '',
        fileType: 'images',
        multiple: true,
        allUploaded: function (res) {
            fileList = res;
            reloadOrderList();
            layer.closeAll();
            layer.msg('已成功上传了' + res.length + '张图片，请记得点击第2步的保存按钮', { time: 2000 });
        },
        policyFailed: function (res) {
            layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
        },
        uploadRenderData: {
            size: 1024*8
             , accept: 'images'
    , acceptMime: 'image/*'
    , exts: 'jpg|png|bmp|jpeg'
            , number: count
        }
    });
    var tableList = table.render({
        elem: '#tableList' 
            , data: fileList
             , height:isPc?'full-240':160
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'name', title: '文件名称', align: 'left', unresize: true, templet: function (res) {
                        return '<span>' + res.name + '</span>';
                    }
                }
                , {
                    field: 'remark', title: '上传状态', align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<span style="color:#5FB878">上传成功(等待保存)</span>';
                        return vo;
                    }
                } 
                , { fixed: '', title: '操作', width: 150, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: false
            , done: function (res, curr, count) {
            }
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'viewPic') {
            var url = obj.data.ossUrl;
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: ['590px','430px'],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: '<a href="' + url + '?x-oss-process=style/geshi" target="_blank" title="点击可以新开窗口浏览大图"><img src="' + url + '?x-oss-process=style/geshi" width="580px" height="420px"></a>'
            });
        }
    });
    function reloadOrderList() { 
        tableList.reload({
            data: fileList
            , where: {
            }
            , page:false
        });
        return false;
    }
    form.on('submit(savebtn)', function (data) {
        if (fileList.length<1) {
            layer.msg('请点击第1步选择图片');
            return false;
        }
        let imgList=[];
        for (let i = 0; i < fileList.length; i++) {
            imgList.push(fileList[i].ossUrl);
        }
        var imgListStr = imgList.join(',');
        var orderId = data.field.orderId;
        var remark = data.field.remark;
        var gameAccId = data.field.gameAccId;
         
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UploadOrderPic",
            data: { orderId: orderId, remark: remark, imgListStr: imgListStr, gameAccId: gameAccId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 700 }, function () {
                    if (data.code > 0) {
                        location.reload();
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
