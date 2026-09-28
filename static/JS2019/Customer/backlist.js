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
        var re = true; 
    var page = 1;
    $(document).keyup(function (event) {
        getKey();
    });
    function getKey() {
        if (event.keyCode == 13) {
            $(".sechbtn").trigger("click");
        }
    }
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/CustomerAjax/GetCustomerBackList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 }
                , {
                    field: 'moblie', title: '手机号', width:150, fixed: 'left', align: 'left', unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="" title="">' + res.moblie + '</a>';
                        return vo;
                    }
                }, {
                    field: 'ww', title: '旺旺或YY', width: 150, align: 'center', unresize: false, sort: false
                }, {
                    field: 'qq', title: 'QQ或微信', width: 150, align: 'center', unresize: false, sort: false
                }
                , {
                    field: 'backCount', title: '原因备注', align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="" title="">' + res.remark + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'lastTime', title: '加入时间', width:150, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.createTime + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: true
            , limit: 50
            , limits: [10, 20, 30, 40, 50,80,100]
            , done: function (res, curr, count) {  
                page = curr;
             }
        }); 
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addBackListBtn':
                    setBackList();
                    break;
                case 'delBackBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].id);
                    };
                    var ids= tempData.join(',');
                    delBackList(ids);
                    break;
            };
        });
        
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        });  
        function reloadOrderList() { 
            var key = $("#key").val();  
            seachParam = 'key=' + key;
            tableList.reload({
                url: '/CustomerAjax/GetCustomerBackList?' + seachParam
                , where: { 
                }
                 , page: {
                     curr: page
                 }
            });
            return false;
        }
        function setBackList() {
            layer.open({
                title: "新增黑名单",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['80%', '420px'],
                content: '/Customer/AddBack'
            });
        }
        function delBackList(ids) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/CustomerAjax/DelBack",
                data: { ids: ids },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () { 
                            reloadOrderList();
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
        }

        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); 
                reloadOrderList();
            }
        };
        window.tools = _tools;
});