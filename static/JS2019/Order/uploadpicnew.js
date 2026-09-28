layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    aliossUploader: ''
}).use(['index', 'form', 'util', 'table', 'layer', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        layer = layui.layer,
        upload = layui.upload,
        element = layui.element,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var filedata = [];
    var fileList = [];
    var uploadIndex;
    var uploadGetDataIndex;
    var orderId = $("#orderId").val();
    var gameAccId = $("#gameAccId").val();
    var taskId = $("#taskId").val();
    var isPc = true;
    var re = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var curdata = 0;
    const maxSize = 18 * 1024 * 1024; //默认上传大小上限
    const compressMaxSize = 5 * 1024 * 1024; //压缩完大小上限
    //选择文件 并上传
    element.init();
    var uploadListIns = upload.render($.extend({
        elem: '#drop_area',
        url: 'https://systemordertemp1day.oss-cn-hangzhou.aliyuncs.com',
        accept: 'images',
        acceptMime: 'image/jpeg,image/png',
        exts: 'jpg|jpeg|png',
        multiple: true,
        drag: true,
        auto: false,
        choose: function (obj) {
            element.progress('progressBar', '0%');
            $("#progressBar").css('display', 'block');
            clearFile();
            filedata = obj.pushFile();
            let totalFiles = Object.keys(obj.pushFile()).length;
            let previewCount = 0;
            let isUploaded = false; // 标志位，防止重复上传
            let failCount = 0;
            // **显示正在处理提示**
            var loadingIndex = layer.msg('正在处理文件，请稍候...', {
                icon: 16, // 加载图标
                shade: 0.3, // 半透明背景
                time: 0 // 不自动关闭
            });
            obj.preview(function (index, file, result) {
                previewCount++;
                if (file.size > maxSize) {
                    delete filedata[index]; // 删除超限文件
                }
                let quality = 0.15;
                if (file.size >= 5242880 && file.size < 8388608) {
                    quality = 0.25;
                }
                if (file.size >= 2097152 && file.size < 5242880) {
                    quality = 0.4;
                }
                if (file.size < 2097152) {
                    quality = 0.6;
                }
                photoCompress(file, {
                    quality: quality
                }, function (base64Codes, name) {
                    var tempFile = base64ToFile(base64Codes, name);
                    // 检查压缩后的文件大小是否符合要求
                    if (tempFile.size > compressMaxSize) {
                        failCount += 1;
                        delete filedata[index]; // 从上传列表中移除
                    } else {
                        filedata[index] = tempFile; // 保存压缩后的文件
                    }
                    // 检查所有预览是否完成
                    if (previewCount === totalFiles && !isUploaded) {
                        isUploaded = true; // 防止多次触发
                        layer.close(loadingIndex); // **关闭提示** 
                        if (Object.keys(filedata).length > 0) {
                            if (failCount > 0) {
                                layer.msg('已自动过滤' + failCount + '张5MB以上的图片，正在准备，请稍候...', { time: 1000 });
                            }
                            uploadGetDataIndex = layer.msg('准备上传中...', {
                                icon: 16, // 加载图标
                                shade: 0.3, // 半透明背景
                                time: 0 // 不自动关闭
                            });
                            poclixy(filedata);// 手动上传
                            uploadListIns.config.elem.next()[0].value = '';
                        }
                        else {
                            layer.msg('图片都太大了，请把图片大小控制在单张10MB以内');
                        }
                    }
                });
            });
        }
    }), {})

    $(document).on('click', '#uploadInput', function () {
        console.log(2555)
        var editableElement = document.getElementById('uploadInput');

        console.log(editableElement)
        editableElement.focus();
    })
    $('#uploadInput').on('input', function () {
        $(this).html('');
    });
    $('#uploadInput').on('paste', function (e) {
        const clipboardData = e.originalEvent.clipboardData || window.clipboardData;
        if (!clipboardData) return;
        if (clipboardData.items[0].kind == "string") return;
        uploadItemPic(clipboardData)
    });
    function uploadItemPic(clipboardData) {
        var loadingIndex = layer.msg('正在处理文件，请稍候...', {
            icon: 16, // 加载图标
            shade: 0.3, // 半透明背景
            time: 0 // 不自动关闭
        });
        let filedata = []
        let filedataIndex = 0
        let clipboarIndex = 0
        for (let i = 0; i < clipboardData.items.length; i++) {
            clipboarIndex = clipboardData.items.length

            $('#uploadInput').html('')
            const item = clipboardData.items[i];
            if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
                const file = item.getAsFile();
                console.log(file, i)
                const reader = new FileReader();
                reader.onload = function (event) {
                };
                reader.readAsDataURL(file);
                //uploadItemPic(file);


                let previewCount = 0;
                let isUploaded = false; // 标志位，防止重复上传
                let failCount = 0;
                // **显示正在处理提示**

                let quality = 0.15;
                if (file.size >= 5242880 && file.size < 8388608) {
                    quality = 0.25;
                }
                if (file.size >= 2097152 && file.size < 5242880) {
                    quality = 0.4;
                }
                if (file.size < 2097152) {
                    quality = 0.6;
                }
                photoCompress(file, {
                    quality: quality
                }, function (base64Codes, name) {
                    var tempFile = base64ToFile(base64Codes, name);
                    // 检查压缩后的文件大小是否符合要求
                    if (tempFile.size > compressMaxSize) {
                        failCount += 1;
                    } else {
                        filedata[filedataIndex] = tempFile; // 保存压缩后的文件
                        filedataIndex++
                    }
                    // 检查所有预览是否完成
                    if (i == (clipboarIndex - 1) && !isUploaded) {
                        isUploaded = true; // 防止多次触发
                        layer.close(loadingIndex); // **关闭提示** 
                        if (Object.keys(filedata).length > 0) {
                            if (failCount > 0) {
                                layer.msg('已自动过滤' + failCount + '张5MB以上的图片，正在准备，请稍候...', { time: 1000 });
                            }
                            uploadGetDataIndex = layer.msg('准备上传中...', {
                                icon: 16, // 加载图标
                                shade: 0.3, // 半透明背景
                                time: 0 // 不自动关闭
                            });
                            poclixy(filedata);// 手动上传
                            //uploadListIns.config.elem.next()[0].value = '';
                        }
                        else {
                            layer.msg('图片都太大了，请把图片大小控制在单张10MB以内');
                        }
                    }
                });

            }
        }
    }



    function uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        // AJAX上传
        $.ajax({
            url: '/your-upload-api',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log('上传成功：', res);
                alert('图片上传成功！');
                // 可将上传后的图片URL插入到输入框
                $('#uploadInput').append(`<img src="${res.url}" style="max-width: 200px;">`);
            },
            error: function (err) {
                console.error('上传失败：', err);
                alert('图片上传失败，请重试！');
            }
        });
    }
    function clearFile() {
        for (let x in filedata) {
            delete filedata[x];
        }
    }
    function poclixy(files) {
        $.ajax({
            url: '/CommonPermissionAjax/GetAliOssPolicy?bk=1&exsec=240',
            type: 'GET',
            data: {},
            headers: { Authorization: layui.data('XCORS').Authorization },
            success: function (res) {
                layer.close(uploadGetDataIndex);
                uploadossfun(files, res.data);
            },
            error: function (res) {
                layer.close(uploadGetDataIndex);
                policyFailed(res);
            }
        });
    }

    function policyFailed() {
        layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
    }
    // 上传oss

    function uploadossfun(filess, data) {
        // 显示上传中提示
        uploadIndex = layer.msg('正在上传文件，请稍候...', {
            icon: 16,
            shade: 0.3,
            time: 0 // 不自动关闭
        });
        var filelist = [];
        for (var i in filess) {
            filelist.push(filess[i])
        }
        filelist.forEach(function (item, index) {
            uploadItem(filelist, data, index)
        })

    }


    function uploadItem(filess, data, index) {
        var filedata = new FormData();
        var reg = /,/g;
        data.file = filess[index];
        var fkeyTag = $("#sid").val() + '-' + (!orderId ? taskId ? gameAccId : taskId : orderId);

        var fileName = data.file.name.replace(reg, '');
        var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);

        var randomPart = (Math.random() + "").substring(2, 7);
        var timestamp = new Date().getTime();
        var filekey = `${fkeyTag}-${randomPart}-${timestamp}.${fileExtension}`;

        filedata.append('key', filekey);
        filedata.append('policy', data.policy);
        filedata.append('OSSAccessKeyId', data.accessid);
        filedata.append('signature', data.signature);

        filedata.append('success_action_status', 200);
        filedata.append('file', filess[index]);

        $.ajax({
            url: 'https://systemordertemp1day.oss-cn-hangzhou.aliyuncs.com',
            processData: false,
            cache: false,
            contentType: false,
            type: 'POST',
            data: filedata,
            success: function (res) {
                var result = {
                    name: filess[index].name,
                    type: filess[index].type,
                    size: filess[index].size,
                    filekey: filekey,
                    ossUrl: 'https://systemordertemp1day.oss-cn-hangzhou.aliyuncs.com/' + filekey
                }
                curdata++;
                fileList.push(result)
                var percent = parseInt(curdata * 100 / filess.length);
                element.progress('progressBar', percent + '%');
                reloadOrderList()
                if (percent == 100) {
                    curdata = 0;
                    // 隐藏提示
                    layer.close(uploadIndex);
                    setTimeout(function () {
                        $("#progressBar").css('display', 'none');
                        element.progress('progressBar', '0%');
                    }, 800)
                }
            },
            error: function (i) {
                var msg = i;
                if (typeof i === Object) {
                    msg = JSON.stringify(i)
                }
                // 隐藏提示
                layer.close(uploadIndex);
                layer.msg(data.file.name + '文件上传失败，请联系技术人员处理，或者重试几次' + msg);
            }
        })
    }
    //上传成功后绑定到table
    var tableList = table.render({
        elem: '#tableList'
        , data: fileList
        , height: isPc ? 'full' : 160
        , defaultToolbar: []
        , cols: [[
            {
                field: 'name', title: '文件名称', align: 'left', unresize: true, templet: function (res) {
                    return '<span>' + res.name + '</span>';
                }
            }
            , {
                field: 'size', title: '大小', align: 'center', sort: false, unresize: true, templet: function (res) {
                    let vo = '<span>' + (res.size / 1024 / 1024).toFixed(2) + 'MB</span>';
                    return vo;
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
        , limit: 100
        , done: function (res, curr, count) {
        }
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'viewPic') {
            var url = obj.data.ossUrl;
            $.ajax({
                type: "Post",
                url: "/CommonPermissionAjax/GetAliOssFileView",
                data: { bk: 1, fileKey: obj.data.filekey },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); },
                success: function (data) {
                    if (data.code == 1) {
                        layer.open({
                            type: 1,
                            title: false,
                            closeBtn: 0,
                            area: ['85%'],
                            skin: 'layui-layer-nobg', //没有背景色
                            shadeClose: true,
                            content: '<a href="' + data.data + '" target="_blank" title="点击可以新开窗口浏览大图"><img src="' + data.data + '" width="580px" height="420px"></a>'
                        });
                    } else {
                        layer.msg('无法预览')
                    }
                }
            });

        } else if (obj.event === 'delitem') {
            $.ajax({
                type: "Post",
                url: "/CommonPermissionAjax/DelSingleImg",
                data: { imgpath: obj.data.ossUrl },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); },
                success: function (data) {
                    if (data.code == 1) {
                        layer.msg('删除成功！')
                        obj.del();
                        fileList = fileList.filter(item => {
                            if (item.name !== obj.data.name) return item
                        })

                    } else {
                        layer.msg('文件上传失败，请联系技术人员处理！')
                    }

                }
            });

        }
    });
    function reloadOrderList() {
        tableList.reload({
            data: fileList
            , where: {
            }
            , page: false
        });
        return false;
    }

    //保存提交
    form.on('submit(savebtn)', function (data) {
        if (fileList.length < 1) {
            layer.msg('请先上传图片再进行保存');
            return false;
        }
        let imgList = [];
        for (let i = 0; i < fileList.length; i++) {
            imgList.push(fileList[i].ossUrl);
        }
        var imgListStr = imgList.join(',');
        var imgType = data.field.imgType == undefined ? 0 : data.field.imgType;
        if (imgType == 1 && fileList.length > 1) {
            layer.msg('群聊二维码仅限一张，再次上传会覆盖原二维码！');
            return false;
        }
        var orderId = data.field.orderId;
        var remark = data.field.remark;
        var gameAccId = data.field.gameAccId;
        var taskId = data.field.taskId;

        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UploadOrderPic",
            data: { orderId: orderId, remark: remark, imgListStr: imgListStr, gameAccId: gameAccId, taskId: taskId, imgType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (lx) {
                    layer.close(lx);
                    if (data.code > 0) {
                        location.reload();
                        layer.close(indexLoad);
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });



});
