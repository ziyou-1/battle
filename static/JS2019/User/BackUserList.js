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
    var layerWindows;
    var page = 1;
    var bid = 0;
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
            , url: '/UserAjax/GetSystemUserBackList?' + seachParam
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
                    field: 'ww', title: '微信号', width: 130, align: 'center', unresize: false, sort: false
                }, {
                    field: 'qq', title: 'QQ', width: 130, align: 'center', unresize: false, sort: false
                }, {
                    field: 'rname', title: '名称', width: 120, align: 'center', unresize: false, sort: false
                }, {
                    field: 'cid', title: '身份证号', width: 150, align: 'center', unresize: false, sort: false
                },
                {
                    field: 'yy', title: 'YY号', width: 120, align: 'center', unresize: false, sort: false
                }, {
                    field: 'alipayacc', title: '收款账号', width: 150, align: 'center', unresize: false, sort: false
                }
                , {
                    field: 'remark', title: '原因或备注', align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" style="" title="' + res.remark+'">' + res.remark + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'lastTime', title: '加入时间', width:150, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.createTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'addUserName', title: '添加人', width:90, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.addUserName + '</span>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width: 80, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true
            , limit: 20
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
                    addUserBlack(0,'','','','','','','');
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
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            var edid = obj.data.id;
            addUserBlack(edid, obj.data.moblie, obj.data.ww, obj.data.qq, obj.data.remark, obj.data.rname, obj.data.yy, obj.data.alipayacc,obj.data.cid);
            return false;
        }
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
                url: '/UserAjax/GetSystemUserBackList?' + seachParam
                , where: { 
                }
                 , page: {
                     curr: page
                 }
            });
            return false;
    }

    function addUserBlack(id, moblie, wechat, qq, remark,rname,yy,alipayacc,cid) {
        bid = id;
        form.val("form", {
            "moblie": moblie,
            "wechat": wechat,
            "qq": qq,
            "remark": remark,
            "rname": rname,
            "yy": yy,
            "alipayacc": alipayacc,
            "cid": cid
        });  
        layerWindows = layer.open({
            title: id > 0 ? "编辑黑名单" : "新增一个黑名单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '580px' : '90%', isPc?'650px':'95%'],
            content: $('.addmodiftyDiv')
        });
        return false;
    }
      
        function delBackList(ids) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/DelSystemUserBackListByID",
                data: { ids: ids },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(layerWindows);
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

    $('.saveAddModifyBtn').on('click', function () { 
        var mobile = $("#moblie").val();
        var wechat = $("#wechat").val();
        var qq = $("#qq").val();
        var remark = $("#remark").val();
        var rname = $("#rname").val();
        var yy = $("#yy").val();
        var cid = $("#cid").val();
        var alipayacc = $("#alipayacc").val();
        if (mobile != '' && mobile != null) {
            if (!VerifyMoblie(mobile)) {
                layer.msg('手机号码格式不正确');
                return false;
            }
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/AddModiftySystemUserBackList",
            data: { bid: bid, moblie: mobile, wechat: wechat, qq: qq, remark: remark, rname: rname, yy: yy, alipayacc: alipayacc, cid: cid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        reloadOrderList();
                    }
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    })

        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); 
                reloadOrderList();
            }
        };
        window.tools = _tools;
});