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
      
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full'
            , cellMinWidth: 100
            , url: '/SystemAjax/GetAutoDiscernSetList?' + seachParam
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'typeName', title: '识别项名称', fixed: 'left', width: 100, align: 'left', unresize: true, templet: function (res) {
                        let typeName = res.typeName;
                        if (typeName == "装备等级") {
                            typeName = "当前信息1";
                        }
                        if (typeName == "神器等级") {
                            typeName = "当前信息2";
                        }
                        let vo = '<a href="javascript:void(0);" class="editrow" data-disid="' + res.disId + '" data-typename="' + res.typeName + '" data-diskey="' + res.disKey +'"  style="color:#1E9FFF" title="' + typeName + '">' + typeName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'disKey', title: '订单内容中每一行可以识别的关键词', align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.disKey + '">' + res.disKey + '</a>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width:120, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: false 
            , done: function (res, curr, count) { 
                $('.editrow').on('click', function () {
        console.log($(this))
        var disId = $(this).attr('data-disid');
        var disName = $(this).attr('data-typename');
        var disKey = $(this).attr('data-diskey');
        changeData(disId, disName, disKey);
        return false;
    })
             }
        }); 
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'del') {
                var id = obj.data.disId;
                
            } else if (obj.event === 'submitEdit') {
                var disId = obj.data.disId;
                var disName = obj.data.typeName;
                var disKey = obj.data.disKey;
                changeData(disId, disName, disKey);
                return false;
            }
        }); 
    
        function reloadOrderList() {   
            tableList.reload({
                url: '/SystemAjax/GetAutoDiscernSetList?' + seachParam
                , where: {
                }
                 , page:false
            });
            return false;
        }
        var layerWindows;
        function changeData(id, disName,key) {
            form.val("dis", {
                "key": key
                , "disID": id
            });
            form.render();
            layerWindows=layer.open({
                title: "修改" + disName+"的识别关键词",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%','180px'],
                content: $('.change')
            });
            return false;
        } 
        form.on('submit(savebtn)', function (data) {
            var keys = data.field.key;
            var disID = data.field.disID;
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
                url: "/SystemAjax/EditAutoDiscernSet",
                data: { disId: disID, key: keys },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(layerWindows);
                    if (data.code > 0) {
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