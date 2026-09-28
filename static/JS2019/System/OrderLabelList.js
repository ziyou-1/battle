layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table', 'colorpicker'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var table = layui.table;
    var colorpicker = layui.colorpicker;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var seachParam = 'getCa=Y';
    var indexLoad;

    // 渲染
    colorpicker.render({
        elem: '#ID-colorpicker-demo-form',
        color: '#1c97f5',
        done: function (color) {
            $('#labelColor').val(color);
        }
    });

    var tableList = table.render({
        elem: '#tableList'
        , id: 'tb1'
        , height: 'full'
        , cellMinWidth: 100
        , url: '/SystemAjax/GetOrderLabelList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'labelName', title: '标签名称', fixed: 'left', width: 250, align: 'left', unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" class="layui-font-blue" title="' + res.labelName + '">' + res.labelName + '</a>';
                    return vo;
                }
            }, {
                field: 'gameName', title: '指定游戏', align: 'center', width: 150, sort: false, unresize: false
            }
            , {
                field: 'remark', title: '标签备注', align: 'left', width: 120, sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" title="' + res.remark + '">' + res.remark + '</a>';
                    return vo;
                }
            }, {
                field: 'keywords', title: '匹配关键词', align: 'center', width: 200, sort: false, unresize: false
            }, {
                field: 'colorValue', title: '标签颜色', align: 'center', width: 100, sort: false, unresize: false, templet: function (res) {
                    let vo = res.colorValue != null && res.colorValue != '' ? '<div style="height:25px;margin-top:8px;background-color:' + res.colorValue + '!important;color:#fff!important">&nbsp;</div>' : '';
                    return vo;
                }
            }, {
                field: 'labelStatus', title: '是否启用', width: 80, align: 'center', unresize: false, templet: '#switchTpl1'
            }
            , {
                field: 'orderBy', title: '排序', width: 70, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width: 145, align: 'center', toolbar: '#baroperating', unresize: false, }
        ]]
        , page: false
        , done: function (res, curr, count) {
        }
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addModityLabel(0, '', '', '', 0, '', '');
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.id;
            delOrderLabel(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var gameName = obj.data.gameName;
            var sname = obj.data.labelName;
            var remark = obj.data.remark;
            var orderby = obj.data.orderBy;
            var colorValue = obj.data.colorValue;
            addModityLabel(id, gameName, sname, remark, orderby, colorValue, obj.data.keywords);
            return false;
        }
    });
    form.on('switch(doNotSendSms)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ModityOrderLabelStatus",
            data: { id: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    function reloadOrderList() {
        seachParam = 'getCa=Y&gameName=' + $("#gameName").val();
        tableList.reload({
            url: '/SystemAjax/GetOrderLabelList?' + seachParam
            , where: {
            }
            , page: false
        });
        return false;
    }
    var layerWindows;
    function addModityLabel(id, labelGame, name, remark, orderby, labelColor, keywords) {
        form.val("form", {
            "labelGame": labelGame
            , "labelName": name
            , "labelRemark": remark
            , "labelOrderBy": orderby
            , "labelId": id
            , "labelColor": labelColor
            , keywords
        });
        layerWindows = layer.open({
            title: id > 0 ? "编辑订单标签" : "新增一个订单标签",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '820px' : '80%', '450px'],
            content: $('.change')
        });
        if (id > 0) {
            colorpicker.render({
                elem: '#ID-colorpicker-demo-form',
                color: labelColor,
                done: function (color) {
                    $('#labelColor').val(color);
                }
            });
        }
        return false;
    }
    function delOrderLabel(id) {
        layer.confirm('确定要删除此订单标签吗?', {
            btn: ['确定', '取消']
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelOrderLabel",
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
    form.on('select(selectGame)', function (data) {
        $("#gameName option").each(function () {
            var item = $(this).val();
            //if (item == data.value) {
            //    gameName = $(this).text();
            //}
        });
        reloadOrderList();
        return false;
    });
    form.on('submit(savebtn)', function (data) {
        var labelGame = data.field.labelGame;
        var labelName = data.field.labelName;
        var labelRemark = data.field.labelRemark;
        var labelOrderBy = data.field.labelOrderBy;
        var labelColor = data.field.labelColor;
        var labelId = data.field.labelId;
        var keywords = data.field.keywords;

        if (labelName == "" || labelName == undefined || labelName == null) {
            layer.msg('标签名称是必填的');
            return false;
        }
        if (labelOrderBy == "" || labelOrderBy == undefined || labelOrderBy == null) {
            layer.msg('请输入排序数值，数字越大越排前面，可以写0');
            return false;
        }
        if (!VerifyInt(labelOrderBy)) {
            labelOrderBy = 0;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/AddModityOrderLabel",
            data: { id: labelId, gameName: labelGame, labelName: labelName, remark: labelRemark, orderBy: labelOrderBy, colorValue: labelColor, keywords },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.close(layerWindows);
                    reloadOrderList();
                }
                layer.msg(data.msg, { time: 2000 }, function () {
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