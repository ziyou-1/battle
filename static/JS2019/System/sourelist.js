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
    var indexId = 0;
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
            , url: '/SystemAjax/GetOrderSoureMangeList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'soureName', title: '来源名称', fixed: 'left', width: 130, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.soureName + '">' + res.soureName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '来源说明', align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.remark + '">' + res.remark + '</a>';
                        return vo;
                    }
                }, {
                    field: 'shopType', title: '哪种店铺', align: 'center', width: 115, sort: false, unresize: false, templet: function (res) {
                        let vo = '非店铺/淘宝/天猫';
                        switch (res.shopType) {
                            case 10:
                                vo = '拼多多';
                                break;
                            case 15:
                                vo = '京东';
                                break;
                            case 20:
                                vo = '闲鱼';
                                break;
                            case 30:
                                vo = '抖音';
                                break;
                            case 40:
                                vo = '快手';
                                break;
                            case 50:
                                vo = '唯品会';
                                break;
                            case 60:
                                vo = '小红书';
                                break;
                            case 70:
                                vo = '其它平台';
                                break;
                        }
                        return vo;
                    }
                }, {
                    field: 'smsSign', title: '短信签名', align: 'left', width: 200, sort: false, unresize: false, templet: function (res) {
                        let vo = '<a class="modifySmsSign" data-id="' + res.id + '" data-orginsmssign="' + res.smsSign + '" href="javascript:void(0);" style="" lay-tips="如果系统有发短信，则该来源的订单短信发出去的签名是【' + res.smsSign + '】，单击可以修改(前提条件是本系统已开通自定义短信签名服务)">' + res.smsSign + '</a>';
                        return vo;
                    }
                }, {
                    field: 'doNotSendSms', title: '订单是否可发送短信<i class="layui-icon layui-bangzhu" style="color:#FF5722" title="正常(绿色)：代表该来源的订单会根据系统设置的短信业务来发送短信通知；禁用(灰色)：表示该来源的订单，将禁止发送任何短信通知" />', width: 180, align: 'center', unresize: false, templet: '#switchTpl1'
                }
                , {
                    field: 'orderBy', title: '排序(数值越大越排前)', width: 160, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.orderBy + '">' + res.orderBy + '</a>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width: 160, toolbar: '#baroperating', unresize: false, }
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
                    indexId = 0;
                    addSoure(0,'','',0,0);
                    break;  
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'submitDel') {
                var id = obj.data.id;
                delSoure(id);
            } else if (obj.event === 'submitEdit') {
                var id = obj.data.id;
                var sname = obj.data.soureName;
                var remark = obj.data.remark;
                var orderby = obj.data.orderBy;
                var shopType = obj.data.shopType;
                indexId = id;
                addSoure(id, sname, remark, orderby, shopType);
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
            url: "/SystemAjax/ChangeSoureDoNotSendSms",
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
            tableList.reload({
                url: '/SystemAjax/GetOrderSoureMangeList?' + seachParam
                , where: {
                }
                , page: false
            });
            return false;
        }   
        var layerWindows;
    function addSoure(id, sname, remark, orderby, shopType) {
            form.val("form", {
                "soureName": sname
               , "soureRemark": remark
                , "soureOrderBy": orderby
                , "soureId": id
                , "shopType": shopType
            });
            layerWindows=layer.open({
                title: id > 0 ? "编辑来源" : "新增一个来源",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [isPc ? '820px' : '80%', isPc?'420px':'95%'],
                content: $('.change')
            });
            return false;
        } 
        function delSoure(id) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelSoure",
                data: { soureId: id },
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

        form.on('submit(savebtn)', function (data) {
            var soureName = data.field.soureName;
            var soureRemark = data.field.soureRemark;
            var soureOrderBy = data.field.soureOrderBy;
            var soureId = indexId;
            var shopType = data.field.shopType; 
            if (soureName == "" || soureName == undefined || soureName == null) {
                layer.msg('请输入来源名称');
                return false;
            }
            if (soureOrderBy == "" || soureOrderBy == undefined || soureOrderBy == null) {
                layer.msg('请输入排序数值，可以写0');
                return false;
            }
            if (shopType == "" || shopType == undefined || shopType == null) {
                shopType = 0;
            }
            if (!VerifyInt(soureOrderBy)) {
                soureOrderBy = 0;
            }
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/AddEdiSoure",
                data: { soureId: soureId, soureName: soureName, remark: soureRemark, orderBy: soureOrderBy, shopType: shopType },
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
    $(document).on('click', '.modifySmsSign', function () {
        var ids = $(this).attr('data-id');
        var orginsmssign = $(this).attr('data-orginsmssign');
        layer.prompt({ title: '设置短信签名(不需要或默认请填：平台)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: orginsmssign,maxlength:7 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false; 
            $.ajax({
                type: "Post",
                url: "/SystemAjax/ModifySoureSmsSign",
                data: { id: ids, smsSign: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (data.code > 0) {
                            layer.close(index);
                            reloadOrderList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    });
});