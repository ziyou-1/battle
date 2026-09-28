layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
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
        var gameName = $("#gameName").find("option:selected").text(); 
        form.on('select(selectGame)', function (data) {  
            $("#gameName option").each(function () {
                var item = $(this).val();
                if (item == data.value) {
                    gameName = $(this).text();
                }
            });
            reloadOrderList(); 
            return false;
        });
        var seachParam = 'gameId=' + $("#gameName").val();
        var tableList = table.render({
            elem: '#tableList' 
            , cellMinWidth: 100
            , url: '/GameAjax/GetGameItemList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width:30
                }
                , {
                    field: 'itemName', title: '物品名称',  unresize: false, templet: function (res) {
                        let img = '<img src="' + res.thumbnail + '" alt="图" style="width:28px;height:28px;margin-right:2px"/>';
                        let vo = '<a href="javascript:void(0);" class="itemTips" id="Item_' + res.itemId + '" data-id="' + res.itemId + '" style="color:#FF534D" title="' + res.itemName + '">' + res.itemName + '</a>';
                        return img + vo;
                    }
                }
                , {
                    field: 'postion', title: '部位',  unresize: false, templet: function (res) {
                        let spans = '<a href="javascript:void(0)" title="部位：' + res.postion + '">' + res.postion + '</a>';
                        return spans;
                    }
                }
                , {
                    field: 'gameGroup', title: '护甲类型', align: 'center', sort: false, unresize: false, templet: function (res) {
                        let spans = '<a href="javascript:void(0)" title="护甲类型：' + res.armorType + '">' + res.armorType + '</a>';
                        return spans;
                    }
                }
                , { field: 'gameBoss', title: '掉落BOSS',  unresize: false } 
               , {
                   field: 'gameName', title: '所属游戏', align: 'center',sort: false, unresize: false, templet: function (res) {
                       let spans = '<a href="javascript:void(0)" title="">' + gameName + '</a>';
                       return spans;
                   }
               }
            ]]
            , page: true
            , limit: 50
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) {
                page = curr;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addItemBtn':
                    addItem();
                    break;
                case 'delItemBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].itemId);
                    };
                    var ids = tempData.join(',');
                    delGameItem(ids);
                    break;
            };
        });       
        function reloadOrderList() {
            seachParam = 'gameId=' + $("#gameName").val() + '&postion=' + $("#postion").val() + '&key1=' + $("#key").val();
            tableList.reload({
                url: '/GameAjax/GetGameItemList?' + seachParam
                , where: { 
                }
                 , page: true
            });
            return false;
        }
        function delGameItem(id) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/GameAjax/DelGameItem",
                data: { itemId: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList();
                        layer.msg(data.msg, { time: 1000 }, function () {
                        })
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
        }
        var layerWindow;
        function addItem() {  
            layerWindow=layer.open({
                title: "新增物品",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['90%', '80%'],
                content: '/Game/AddEditItem?gameId=' + $("#gameName").val()
            });
        }    
        var timoutid;
        $(document).on('mouseover', '.itemTips', function () {
            var ids = $(this).attr('data-id');
            timoutid = setTimeout(function () {
                $.ajax({
                    type: "Get",
                    url: "/GameAjax/getGameItemInfoByItemID",
                    data: { itemId: ids },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('获取数据出现异常！'); },
                    beforeSend: function (XMLHttpRequest) { layer.tips('加载中...', "#Item_" + ids); },
                    success: function (data) {
                        var sdata = data.msg;
                        layer.tips(sdata, "#Item_" + ids, { tips: [1, '#080808'], time: 80000 });
                    }
                });
            }, 800);
        }).mouseout(function () {
            layer.closeAll('tips');
            clearTimeout(timoutid);
        });
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); //关闭现有所有弹层
                reloadOrderList();
            }
        };
        window.tools = _tools;
});