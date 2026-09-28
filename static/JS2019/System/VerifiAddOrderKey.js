layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var re = true;
    var seachParam = '';
    var indexLoad;
    var gameName = $("#selectGame").val();
    form.on('select(selectGame)', function (data) { 
        gameName = data.value;
        reloadOrderList();
        return false;
    }); 
    var tableList =table.render({
            elem: '#tableList'
            , height: 'full'
            , cellMinWidth: 100
        , url: '/SystemAjax/GetVerifiAddOrderKeyStrByGameList?gameName=' + gameName
        , toolbar: '#toolbarDemo'
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'veriType', title: '修正项名称', fixed: 'left', width: 120, align: 'center', unresize: true, templet: function (res) {
                        let typeName ='代练/陪玩项目';
                        if (res.veriType ==1) {
                            typeName = "职业";
                        }
                        let vo = '<a href="javascript:void(0);" class="editrow" data-id="' + res.id + '" data-veriType="' + typeName + '" data-key="' + res.key + '" data-resultStr="' + res.resultStr +'"  style="color:#1E9FFF" title="' + typeName + '">' + typeName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'key', title: '此项包含的关键词', align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '';
                        let sp = res.key.split('*');
                        $.each(sp, function (index, value) {
                            vo += '<span class="layui-badge layui-bg-gray">' + value + '</span>';
                        });
                        return vo;
                    }
                }
                , {
                    field: 'resultStr', title: '统一修正为', align: 'left', width: 200, sort: false, unresize: true, templet: function (res) {
                        let vo = '<span class="layui-badge layui-bg-green">' + res.resultStr + '</span>';
                        if (res.resultStr == '') {
                            return '';
                        } else {
                            return vo;
                        }
                    }
                }
                , { fixed: '', title: '操作', width:120, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: false 
            , done: function (res, curr, count) { 
                $('.editrow').on('click', function () { 
                    var disId = $(this).attr('data-id');
                        var disName = $(this).attr('data-veriType');
                    var disKey = $(this).attr('data-key');
                    var resultStr = $(this).attr('data-resultStr');
                    $("#disID").val(disId);
                    changeData(disId, disName, disKey, resultStr);
                    return false;
                })
             }
        });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'resetBtn':
                resetData();
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'del') {
                var id = obj.data.disId;
                
            } else if (obj.event === 'submitEdit') {
                var disId = obj.data.id;
                var disName = '代练/陪玩项目'; 
                if (obj.data.veriType== 1) {
                    disName = "职业";
                }
                var disKey = obj.data.key;
                var resultStr = obj.data.resultStr;
                $("#disID").val(disId);
                changeData(disId, disName, disKey, resultStr); 
                return false;
            }
        });     
    function reloadOrderList() {   
            tableList.reload({
                url: '/SystemAjax/GetVerifiAddOrderKeyStrByGameList?gameName=' + gameName
                , where: {
                }
                 , page:false
            });
            return false;
    }
    function resetData() {
        layer.confirm('确定重置下面列表里的数据吗？'
            , {
                btn: ['确定', '我再想想']
            }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/ResetVerifiAddOrderKeyStr",
                    data: {},
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.alert(data.msg, function (lx) {
                                layer.close(lx);
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.alert(data.msg);
                        }
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            }
        ) 
        return false;
    }

    var layerWindows;
    function changeData(id, disName, key, resultStr) {
            form.val("dis", {
                "key": key
                , "disID": id,
                "resultStr": resultStr
            });
            form.render();
            layerWindows=layer.open({
                title: "更改" + disName+"的修正关键词",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['420px','240px'],
                content: $('.change')
            });
            return false;
        } 
    form.on('submit(savebtn)', function (data) {
            var keys = data.field.key;
            var disID = data.field.disID;
            var resultStr = data.field.resultStr;
            if (disID == "" || disID == undefined || disID == null) {
                layer.msg('请刷新页面再试下');
                return false;
            }
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/SaveVerifiAddOrderKeyStr",
                data: { id: disID, key: keys, resultStr: resultStr },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(layerWindows);
                    re = true;
                    reloadOrderList();
                    layer.msg(data.msg, { time:2000 }, function() { 
                        return false;
                    })
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });
});