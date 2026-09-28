layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'util', 'ClipboardJS', 'formSelects', 'table','upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        upload = layui.upload,
        formSelects = layui.formSelects;
    var ClipboardJS = layui.ClipboardJS;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    var ok = true;
    var indexLoad,layeyindex;
    var templist = [];
    var re = true;
    var copycontent = "";
    var fileList = "";
    getAllOrderSoure();
    gettemplatesList()
    function getAllOrderSoure() {
        var soureData = [];
        $.get('/SystemAjax/GetOrderSoureList?selectValue=', function (result) {
            soureData = result.data;
            formSelects.data('orderSoure', 'local', {
                arr: soureData
            });
            if (soureData.length > 0) {
                firsetId = soureData[0].value;
                formSelects.value('orderSoure', [firsetId], true);
            }
        });
    }
    function gettemplatesList() {
        templist = [];
        $.get('/systemAjax/getOrderGuideTemplateList', function (result) {
            if (result.data && result.data.length > 0) {
                templist = result.data;
                var str = "<option value=''>请选择</option>";
                templist.forEach(function (item, index) {
                    if (index == 0) {
                        str += "<option value='" + item.id + "' selected>" + item.title + "</option>"
                    } else {
                        str += "<option value='" + item.id + "'>" + item.title + "</option>"
                    }
                })
                $("#templatesList").html(str);
                $('#desc').html(templist[0].content)
                form.render('select')                
                $('.editbtn').show();
                $('.delbtn').show();
            } else {
                $("#templatesList").html('');               
                $('.editbtn').hide();
                $('.delbtn').hide();
                form.render('select')
            }            
        });
    }
    var tableList = table.render({
        elem: '#tableList'
        , url: '/OrderAjax/GetGeneRateCustomerOrderLogList'
        , defaultToolbar: []
        , defaultToolbar: ['filter']
        , cols: [[
            //{ type: 'checkbox', fixed: 'left', width: isPc ? '2%' : 30 },
            {
                field: 'str1', title: '订单id', width: 200, unresize: false
            }
            , {
                field: 'str2', title: '游戏名称', width: 140, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'str3', title: '代练/陪玩项目', minwidth: 250, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'str4', title: '来源单号', width: 200, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'str5', title: '订单价格', width: 120, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'str6', title: '生成人', width: 95, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'str7', title: '创建时间', width: 150, align: 'left', sort: false, unresize: false, templet: function (res) {
                    let color = '#FF5722';
                    if (res.trade_type == 1) {
                        color = '#5FB878';
                    }
                    let vo = '<span style="color:' + color + '">' + (res.trade_type == 1 ? '定金订单' : '普通订单') + '</span>';
                    return res.str7;
                }
            }
            , { field: 'str8', title: '操作', width:150, toolbar: '#baroperating' }
        ]]
        , page: false       
        , parseData: function (res) {
            return {
                "code": 0,
                "msg": res.msg,
                "count": res.data.length,
                "data": res.data
            }
        },
        done: function (res, curr, count) {
           
        }
    });
    table.on('tool(tableList)', function (obj) {
        console.log(obj)
        switch (obj.event) {
            case 'copylink':
                var textarea = document.createElement('textarea');
                document.body.appendChild(textarea);
                textarea.style.position = 'absolute';
                textarea.style.clip = 'rect(0 0 0 0)';
                textarea.value = obj.data.str8;
                textarea.select();
                document.execCommand('copy', true);
                layer.msg('复制成功')
                break;
        };
    });  
    form.on('select(seletdesc)', function (data) {
        console.log(data.value)
        if (!data.value) {
            $('.editbtn').hide();
            $('.delbtn').hide();
            $('#desc').html('')
            $(".content").hide()
        } else {
            $('.editbtn').show();
            $('.delbtn').show();
            $(".content").show()
            templist.forEach(function (item) {
                if (item.id == data.value) {
                    $("#desc").html(item.content)
                }
            })
        }

    })
    form.on('submit(savebtn)', function (data) {
        var html = $("#desc").html();

        if (data.field.gameName == "" || data.field.gameName == undefined || data.field.gameName == null) {
            layer.msg('游戏名称不可为空');
            return false;
        }
        if (data.field.orderSoure == "" || data.field.orderSoure == undefined || data.field.orderSoure == null) {
            layer.msg('订单来源不可为空');
            return false;
        }        
        if (data.field.price == "" || data.field.price == undefined || data.field.price == null) {
            layer.msg('价格不可为空');
            return false;
        }       
        var queryarrs = {
            gameName: data.field.gameName,
            project:data.field.project,
            orderSoure:data.field.orderSoure,
            soureOrderId: data.field.soureOrderId,
            price:data.field.price,
            day:data.field.day,
            hours: data.field.hours,
            ww:data.field.ww
        }
        
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/GeneRateCustomerOrderAjax",
            data: queryarrs,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                re = true;
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg)
                    var str = '点击以下链接补充订单信息 \n';
                    str+=data.data + " \n \n";
                    str += html;
                    $(".hidedivbox").show();
                    $(".hidediv").html(str);
                    clearfuns()
                    page = 1;
                    reloadOrderList();
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
    $(".pic").on('click', function () {
        var url = $('#upimg').attr('src');
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            area: ['590px', '430px'],
            skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: '<a href="' + url + '?x-oss-process=style/geshi" target="_blank" title="点击可以新开窗口浏览大图"><img src="' + url + '?x-oss-process=style/geshi" width="580px" height="420px"></a>'
        });

    })
    $('#soureOrderId').on('input', function (e) {
        var value = $(this).val();
        if (value.length >= 15) {
            getresourceinfo(value)
        }
        

    })
    function getresourceinfo(id) {
        let orderSoure = formSelects.value('orderSoure')[0].value;
        var querydata = {
            tid: id,
            orderSoure: orderSoure
        }
        $.ajax({
            url: '/OrderAjax/ReadTaoBaoOrderData?orderSoure=' + orderSoure +'&tid='+id,
            processData: false,
            cache: false,
            contentType: false,
            type: 'GET',
            success: function (res) {
                if (res.code > 0) {
                    form.val("pro", {
                        price: res.msg,
                        ww: res.data
                    });
                    form.render();
                    return false;
                }
                
            },
            error: function (i) {
                layer.msg('请求失败');
            }
        })
    }
    function getproxy() {
        $.ajax({
            url: '/CommonPermissionAjax/GetAliOssPolicy',
            type: 'GET',
            data: { bk: 10 },
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
                $('.pic').html(result.name)
                $('#upimg').attr('src', result.ossUrl)
                $("#upbtn").html('文件已上传')
                layer.msg('文件已上传，点击下方保存按钮，保存后才能生效');
            },
            error: function (i) {
                layer.msg(data.file.name + '文件上传失败，请联系技术人员处理，或者重试几次');
            }
        })

    }
    function reloadOrderList(){
        tableList.reload({
            url: '/OrderAjax/GetGeneRateCustomerOrderLogList'
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false

    };
    function clearfuns() {
        form.val("pro", {
            /*gameName:'',*/
            project: '',
            //orderSoure: data.field.orderSoure,
            soureOrderId: '',
            price: 0,
            day: 1,
            hours: 0,
            ww: ''
        });
        form.render();
        return false;
    }
    var copyPriceClipboard = new ClipboardJS('.copyfun', {
        text: function () {
            var text = $(".hidediv").val();
            return text;
        }
    });
    copyPriceClipboard.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
        return false;
    });
    copyPriceClipboard.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', { time: 1000 });
        return false;
    });
    var copyPriceClipboard2 = new ClipboardJS('.copytable', {
        text: function () {

            return copycontent;
        }
    });
    copyPriceClipboard2.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
        return false;
    });
    copyPriceClipboard2.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', { time: 1000 });
        return false;
    });
    form.on('submit(copyfun)', function () {
       
        return false;
    })
    form.on('submit(addbtn)', function (data) {
        clearfun();
        $("#id").val(0)
        layeyindex=layer.open({
            title: "添加话术",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['500px', '400px'],
            content: $("#describe")
        });
        return false;
    })
    form.on('submit(editbtn)', function (data) {
        clearfun();
        $("#id").val(data.field.templatesList);
        templist.forEach(function (item) {
            if (item.id == data.field.templatesList) {
                $("#content").val(item.content);
                $("#title").val(item.title);
            }
        })
       
        var select = $("#templatesList option:selected");
        var text = select.text();
        layeyindex=layer.open({
            title: "修改" + text +"话术",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['500px', '400px'],
            content: $("#describe")
        });
        return false;
    })
    form.on('submit(delbtn)', function (data) {
        var select = $("#templatesList option:selected");
        var text = select.text();
        layer.confirm('确认删除' + text + '模板信息吗？', function (index) {           
            $.ajax({
                type: "POST",
                url: "/systemAjax/delOrderGuideTemplate",
                data: { id: data.field.templatesList},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () {
                    re = true;
                },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    
                    re = true;                    
                    if (data.code > 0) {
                        layer.msg('已删除');
                        gettemplatesList();
                    }
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            layer.close(index);
        });
        return false;
    })
    form.on('submit(savedesc)', function (data){
        var id = $("#id").val();
        var content = $("#content").val();
        var title = $("#title").val();
        content = content.replace(/<div>/g,"")
        content = content.replace(/<\/div>/g, "\n")
       
        $.ajax({
            type: "POST",
            url: "/systemAjax/AddEditLearmInformation",
            data: { id: id, conent: content, title: title },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                re = true;
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {                    
                    layer.msg(data.msg);
                    gettemplatesList();
                    layer.close(layeyindex)
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
    form.on('submit(submitbtn)', function (data) {
        var url = fileList && fileList.ossUrl ? fileList.ossUrl : $('#upimg').attr('src');
        var switchval = $('input[name=swtich]:checked').val();
        if (!data.field.mark) {
            layer.msg('请填写成功后提示语', { time: 2000 }, function () {
            })
            return false;
        }
      
        var dataobj = {
            mark: data.field.mark,
            pic: url||'',
            swtich:switchval
        }
        if (!re) {
            return false
        }

        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveClientWriteOrderSetting",
            data: dataobj,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                } else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
                re = true;
            }
        });
        return false
    })
    function clearfun() {
        $("#id").val(0);
        $("#content").val('');
        $("#title").val('');
        return false;
    }
});
