layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard',
    formSelects: '/lib/formSelects-v4',
}).use(['index', 'form', 'formSelects', 'util', 'table', 'ClipboardJS'], function () {
    var $ = layui.$,
        form = layui.form,
        formSelects = layui.formSelects,
        upload = layui.upload,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }

    var re = true;
    var indexLoad;
    var layerWindows;
    var files, fileurl;
    var ClipboardJS = layui.ClipboardJS;
    var defAppid = "2019071918003165108";

    form.on('submit(savebtn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/PddShipSetting",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    var tableList = table.render({
        elem: '#tableList'
        , height: 'full'
        , url: '/SystemAjax/GetPlatformAutoReplySetList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 50 },
            {
                field: 'GameName', title: '限定游戏', width: 130, align: 'center', unresize: false
            }, {
                field: 'ReplyOccasion', title: '回复时机', width: 125, align: 'center', unresize: false, templet: function (res) {
                    let colorStr = '#219227;';
                    let occStr = "接单后";
                    switch (res.ReplyOccasion) {
                        case 10:
                            colorStr = '#ff6a00';
                            occStr = "申请验收后";
                            break;
                        case 15:
                            colorStr = '#0094ff';
                            occStr = "提交异常后";
                            break;
                        case 20:
                            colorStr = '#FF5722';
                            occStr = "申请撤销后";
                            break;
                    }
                    let str = '<span href="javascript:void(0)" title="回复的时机" style="color:' + colorStr + ';">' + occStr + '</span>';
                    return str;
                }
            },
            {
                field: 'AssUserType', title: '专用人员类型', width: 110, align: 'center', unresize: false, templet: function (res) {
                    let color = '#E6E6FA';
                    let title = '此设置没指定专用人员';
                    let spanText = '无';
                    let vo = '<span class="lableb" style="background-color:' + color + '" title="' + title + '">' + spanText + '</span>';
                    if (res.AssUserType == 0) {
                        color = '#B0E0E6';
                        title = '接单销售客服专用，接单销售者符合此条件时触发';
                        spanText = '接单销售';
                    }
                    else if (res.AssUserType == 1) {
                        color = '#98FB98';
                        title = '发单人员专用，当发单到平台的人符合此条件时触发';
                        spanText = '发单人员';
                    }
                    vo = '<span class="lableb" style="background-color:' + color + '" title="' + title + '">' + spanText + '</span>';
                    return vo;
                }
            },
            {
                field: 'UserName', title: '专用人员名称', width: 110, align: 'center', unresize: false
            },
            {
                field: 'ReplyMsg', title: '回复内容', align: 'left', unresize: false, templet: function (res) {
                    return '<span lay-tips="' + res.ReplyMsg + '">' + res.ReplyMsg + '</span>';
                }
            }, {
                field: 'AppleImageUrl', title: '图片', width: 80, align: 'left', unresize: false, templet: function (res) {
                    return res.AppleImageUrl ? '<a href="' + res.AppleImageUrl + '?x-oss-process=style/geshi" target="_blank" title="点击查看" style="cursor:pointer;color:#1a73e8;">查看图片</a>' : '无图片';
                }
            }, {
                field: 'PlatformName', title: '启用平台', width: 400, align: 'left', unresize: false
            },
            {
                field: 'ReplyStatus', title: '<span lay-tips="绿色代表启用时">启用状态</span>', width: 105, align: 'center', unresize: false, templet: '#switchTpl1'
            },
            { fixed: '', title: '操作', width: 160, align: 'center', toolbar: '#baroperating', unresize: false, }
        ]]
        , page: false
        , done: function (res, curr, count) {
            if (res.msg.indexOf('权限') > -1) {
                layer.msg(res.msg);
            }
        }
    });
    function reloadOrderList() {
        tableList.reload({
            url: '/SystemAjax/GetPlatformAutoReplySetList'
            , where: {
            }
            , page: false
        });
        return false;
    }
    function getCustomerService(value) {
        var soureData = [];
        var gameName = $('#gameName').val();
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
            if (value) {
                let obj = soureData.find(item => {
                    return item.name == value
                })
                formSelects.value('inputOrderKefu', [obj.value]);
            }

        });
    }
    form.on('select(selectGame)', function (data) {
        getCustomerService()
        return false
    })

    form.on('switch(staChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ModifyPlatformAutoReplySetStatus",
            data: { id: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    //reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                        //layer.close(index);
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
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addShop(0, $("#defGame").val(), -1, "-1", "", "");
                //$("#inputOrderKefu").val('')
                //form.render()
                //getCustomerService();
                break;
            case 'batchEdit':
                const ids = checkStatus.data.map(item => item.PlatformAutoReplySetId);
                batchEdit(ids);
                break;
        };
    });

    function batchEdit(ids) {
        if (ids.length == 0) {
            layer.msg('请至少选择一条数据进行批量修改');
            return false;
        }
        $('#batchContent').val('');
        const layerIndex = layer.open({
            title: "批量修改自动回复内容",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '676px' : '90%', isPc ? '320px' : '95%'],
            content: $('#batchRelyContent'),
            btn: ['保存', '取消'],
            btn1: function () {
                const msg = $('#batchContent').val();
                if (msg.length == 0) {
                    layer.msg('回复内容不能为空');
                    return false;
                }
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/BatchEditReplyContent",
                    data: { ids: ids.join(','), content: msg },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            reloadOrderList();
                            layer.close(layerIndex);
                        }
                        layer.msg(data.msg)
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
                return false;
            }
        })
    }

    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.PlatformAutoReplySetId;
            delShop(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.PlatformAutoReplySetId;
            var gameName = obj.data.GameName;
            var replyOcc = obj.data.ReplyOccasion;
            var replycontent = obj.data.ReplyMsg;
            var platformIds = obj.data.UsePlatformId;
            var assUserType = obj.data.AssUserType;
            fileurl = obj.data.AppleImageUrl;
            //console.log(platformIds);
            addShop(id, gameName, assUserType, replyOcc, replycontent, platformIds);
            getCustomerService(obj.data.UserName)
            /* getCustomerService(value);*/
            return false;
        }
    });
    function addShop(id, gameName, replyUserType, replyOcc, replycontent, platformIds) {
        let str = fileurl ? '图片已上传' : '';
        if (id == 0) {
            $('input[name=replyOcc]').prop('checked', false);
            form.render('radio');
            fileurl = '';
            str = '';
        }
        $(".pic").html(str);
        form.val("form", {
            "gameName": gameName,
            "replyOcc": replyOcc,
            "replyUserType": replyUserType,
            "replycontent": replycontent,
            "ptid": id
        });
        if (replyUserType == 0 || replyUserType == 1) {
            $(".inputOrderKefuDiv").show();
        } else {
            $(".inputOrderKefuDiv").hide();
        }
        if (platformIds != '') {
            let platformIdarr = platformIds.split(',');
            for (var i = 0; i < platformIdarr.length; i++) {
                let platformId = platformIdarr[i];
                $('input[name="platformIds"][value=' + platformId + ']').attr("checked", true);
            }
        }
        form.render();
        layerWindows = layer.open({
            title: id > 0 ? "编辑参数" : "新增一个自动回复设置",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '676px' : '90%', isPc ? '650px' : '95%'],
            content: $('.modifyParamDiv')
        });
        return false;
    }
    function delShop(id) {
        layer.confirm('是否确认删除这个设置？', {
            btn: ['确认删除', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelPlatformAutoReplySet",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
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
        });
        return false;
    }
    form.on('radio(PddAutoCreateOrderSwith)', function (data) {
        if (data.value == "Y") {
            $(".autoCreateOrderDiv").show();
        } else {
            $(".autoCreateOrderDiv").hide();
        }
    });
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            //不关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
    $('.saveBtn').on('click', function () {
        var pid = $("#ptid").val();
        var gameName = $("#gameName").val();
        var replyOcc = $('input[type=radio][name=replyOcc]:checked').val();
        var replyUserType = $('input[type=radio][name=replyUserType]:checked').val();
        var replycontent = $("#replycontent").val();
        var platformIds = new Array();
        var replycontent = $("#replycontent").val();
        $("input:checkbox[name='platformIds']:checked").each(function (i) {
            platformIds[i] = $(this).val();
        });
        var platformIdsValue = platformIds.join(",");
        var userName = formSelects.value('inputOrderKefu', 'nameStr');
        if (replyOcc == '' || replyOcc == null) {
            layer.msg('请选择回复时机');
            return false;
        }
        if (replycontent == '' || replycontent == null || replycontent == undefined) {
            layer.msg('请设置自动回复内容，内容长度必须在1-200个字符之间');
            return false;
        }
        if (platformIdsValue == '' || platformIdsValue == null || platformIdsValue == undefined) {
            layer.msg('至少要选择一个平台');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/SavePlatformAutoReplySetModify",
            data: { id: pid, gameName: gameName, replyOcc: replyOcc, replyUserType: replyUserType, replycontent: replycontent, platformIds: platformIdsValue, pic: fileurl, userName: userName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(layerWindows);
                        reloadOrderList();
                    });

                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })

    var uploadListIns = upload.render({
        elem: '#upbtn',
        url: '',
        accept: 'images',
        multiple: false,
        auto: false,
        size: '500',
        choose: function (obj) {

            //预读本地文件，如果是多文件，则会遍历。(不支持ie8/9)
            obj.preview(function (index, file, result) {
                files = file;

            });
            getproxy()
        }

    })
    function getproxy() {
        $.ajax({
            url: '/CommonPermissionAjax/GetAliOssPolicy',
            type: 'GET',
            data: { bk: 0 },
            headers: { Authorization: layui.data('XCORS').Authorization },
            success: function (res) {
                uploadossfun(res.data);
            },
            error: function (res) {

            }
        });

    }
    function uploadossfun(data) {
        var filedata = new FormData();
        var reg = /,/g;
        var filekey = new Date().getTime() + '-' + (Math.random() + "").substring(2, 7) + '-' + files.name.replace(reg, '');
        filedata.append('key', filekey);
        filedata.append('policy', data.policy);
        filedata.append('OSSAccessKeyId', data.accessid);
        filedata.append('signature', data.signature);
        filedata.append('success_action_status', 200);
        filedata.append('file', files);

        $.ajax({
            url: data.host,
            processData: false,
            cache: false,
            contentType: false,
            type: 'POST',
            data: filedata,
            success: function (res) {
                var result = {
                    name: files.name,
                    type: files.type,
                    ossUrl: data.host + '/' + filekey
                }
                fileList = result;
                fileurl = result.ossUrl;
                $('.pic').html(result.name + '(有效期90天)')
                layer.msg('文件已上传，图片有效期90天。点击下方保存按钮，保存后才能生效');
            },
            error: function (i) {
                layer.msg(data.file.name + '文件上传失败，请联系技术人员处理，或者重试几次');
            }
        })

    }
    $(".pic").on('click', function () {
        var url = fileurl;
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['590px', '430px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: '<div style="width:100%;height:100%;display: flex;justify-content: center;align-items: center;background: #fff;padding: 10px 20px;box-sizing: border-box;"><a href="' + url + '?x-oss-process=style/geshi" target="_blank" title="点击可以新开窗口浏览大图"><img src="' + url + '?x-oss-process=style/geshi" width="100%" height="auto"></a></div>'
        });

    })
    form.on('radio(replyUserType)', function (data) {
        var elem = data.elem;
        var value = elem.value;
        if (value == 1 || value == 0) {
            getCustomerService();
            $(".inputOrderKefuDiv").show();
        } else {
            $(".inputOrderKefuDiv").hide();
        }
    });

});