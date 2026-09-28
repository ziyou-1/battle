layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'util', 'element', 'table', 'formSelects'], function () {
    var $ = layui.$,
        form = layui.form,
        element = layui.element,
        util = layui.util,
    formSelects = layui.formSelects;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var layerWindows;
    var layid = location.hash.replace(/^#to=/, ''); 
    element.tabChange('to', layid);
    element.on('tab(to)', function (elem) {
        location.hash = 'to=' + $(this).attr('lay-id');
    });  
    $('body',document).on('keyup', function (e) {
        if (e.which === 27) { 
            layer.closeAll();
        }
    });
    form.on('select(selectGame)', function (data) { 
        getProjectType(data.value,'');
        return false;
    });
    function getProjectType(game,def) {
        var orderTypeData = [];
        $.get('/GameAjax/GetAllOrderTypeList?gameName=' + game + '&returnSelect=Y&defOrderType='+def, function (result) {
            orderTypeData = result.data;
            formSelects.data('projectType', 'local', {
                arr: orderTypeData
            });
        });
        return false;
    }
    var tableList = table.render({
        elem: '#tableList' 
        , url: '/SystemAjax/GetAutomaticAdJustPriceSetList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'str1', title: '游戏名称', width: 180, align: 'center', unresize: false
            },
            {
                field: 'str2', title: '项目分类', width: 150, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + (res.str2 != '' && res.str2 != null ? res.str2 : '全部') + '</span>';
                }
            },
            {
                field: 'id3', title: '加价模式', width: 80, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + (res.id3 == 1 ?"<span style='color:#16baaa'>百分比":"固定价") + '</span>';
                }
            },
            {
                field: 'd3', title: '每次加价(元)', width: 120, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + (res.id3 == 1 ? res.d3 + "%" : res.d3+'元') + '</span>';
                }
            },
            {
                field: 'd2', title: '最多加价(元)', width: 120, align: 'center', unresize: false
            },
            {
                field: 'id4', title: '加价频率(分)', width: 120, align: 'center', unresize: false
            },
            {
                field: 'd4', title: '亏损上限(元)', width: 120, align: 'center', unresize: false
            },
            {
                field: 'str10', title: '执行时间', width: 120, align: 'center', unresize: false, templet: function (res) {
                    return '<span>' + res.str10 + '</span>';
                }
            },
            {
                field: 'id5', title: '循环调价', width: 100, align: 'center', unresize: false, templet: '#switchTpl2'
            },    
            {
                field: 'str3', title: '是否启用', width: 100, align: 'center', unresize: false, templet: '#switchTpl1'
            },         
            { fixed: '', title: '操作', width: 150, align: 'center', toolbar: '#baroperating', unresize: false, }
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
            url: '/SystemAjax/GetAutomaticAdJustPriceSetList'
            , where: {
            }
            , page: false
        });
        return false;
    }
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addShop(0,'','',1,0,10,0,0,0,0);
                break;
        };
    });
    form.on('radio(addPriceMode)', function (data) { 
        var elem = data.elem;
        var value = elem.value;
        if (value == 1) {
            $(".bp").html("%"); 
        } else {
            $(".bp").html("元");
        }
        $("#addPrice").val(1);
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.id2;
            delShop(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id2;
            var game = obj.data.str1;
            var projectType = obj.data.str2;
            var addPrice = obj.data.d3;
            var maxPushPrice = obj.data.d2;
            var actionInterval = obj.data.id4;
            var lossCap = obj.data.d4; 
            var addPriceMode = obj.data.id3;
            var actionStartTime = obj.data.id7;
            var actionEndTime = obj.data.id8; 
            var loopAction = obj.data.str3; 
            addShop(id, game, projectType, addPrice, maxPushPrice, actionInterval, lossCap, addPriceMode, actionStartTime, actionEndTime,loopAction);
            return false;
        }
    });
    function addShop(id, game, projectType, addPrice, maxPushPrice, actionInterval, lossCap, addPriceMode, actionStartTime, actionEndTime,loopAction) { 
        form.val("form", {
            "gameName": game,
            "addPrice": addPrice,
            "maxPushPrice": maxPushPrice,
            "actionInterval": actionInterval,
            "lossCap": lossCap,
            "ptid": id,
            "addPriceMode": addPriceMode,
            "actionStartTime": actionStartTime,
            "actionEndTime": actionEndTime,
            "loopAction":loopAction=="Y"?1:0
        });
        getProjectType(game, projectType);
        if (addPriceMode == 1) {
            $(".bp").html("%");
        } else {
            $(".bp").html("元");
        }
        
        layerWindows = layer.open({
            title: id > 0 ? "编辑参数" : "新增一个自动调价机制",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '680px' : '95%', isPc?'640px':'95%'],
            content: $('.modifyParamDiv')
        });
        return false;
    }
    function delShop(id) {
        layer.confirm('是否确认删除这个机制？', {
            btn: ['确认删除', '点错了'] //按钮
        }, function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelAutomaticAdJustPriceSet",
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
                        layer.msg(data.msg, { time: 3000 }, function () {
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
    
    $('.saveInterfaceBtn').on('click', function () {
        var pid = $("#ptid").val();
        var game = $('#gameName').val();
        var projectTypeName = formSelects.value('projectType', 'nameStr');
        var addPrice = $("#addPrice").val();
        var actionInterval = $("#actionInterval").val();
        var maxPushPrice = $("#maxPushPrice").val();
        var lossCap = $("#lossCap").val(); 
        var addPriceMode = $('input[type=radio][name=addPriceMode]:checked').val();
        var actionStartTime = $("#actionStartTime").val();
        var actionEndTime = $("#actionEndTime").val();
        var loopAction = $("#loopAction").prop('checked')==true?'Y':'N';
       
        if (game == "" || game == undefined || game == null) {
            layer.msg('请选择一款游戏');
            return false;
        } 
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/SystemAJax/SaveAddModiftyAutomaticAdJustPriceSet",
            data: { id: pid, gameName: game, loopAction:loopAction,projectType: projectTypeName, addPrice: addPrice, actionInterval: actionInterval, maxPushPrice: maxPushPrice, lossCap: lossCap, addPriceMode: addPriceMode, actionShour: actionStartTime, actionEhour: actionEndTime },
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
                    layer.msg(data.msg, { time: 5000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
    form.on('switch(staChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/UpdateAutomaticAdJustPriceSetStatus",
            data: { id: id},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                re = true;
                reloadOrderList();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(loopChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/UpdateAutomaticAdJustPriceSetStatus",
            data: { id: id,type:1},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
                re = true;
                reloadOrderList();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
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
});