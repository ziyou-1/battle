layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form','util', 'table'], function () {
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
        var page = 1; 
        var tableList =table.render({
            elem: '#tableList'
            , url: '/SmsAjax/GetSmsTemplateList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                 {
                     field: 'tempID', title: '模板ID', width: 50, align: 'center', unresize: true, templet: function (res) {
                         return '<span>' + res.tempID + '</span>';
                    }
                }
                , {
                    field: 'content', title: '短信模板内容(不带签名)',  align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" class="viewContent" data-content="'+res.content+'" title="' + res.content + '">' + res.content + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'tempType', title: '短信类型', width:70, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '';
                        if (res.tempType == 20) {
                            vo = '<span style="color:#E03636">营销短信</span>';
                        } else {
                            vo = '<span style="color:#5FB878">常规通知</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: '申请时间', align: 'center', width:120, sort: false,
                    unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.createTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'reviewSta', title: '审核状态', width:80, align: 'center', unresize: false, templet: function (res) {
                        let vo = '';
                        if (res.reviewSta == '审核通过') {
                            vo = '<span style="color:#5FB878">' + res.reviewSta + '</span>';
                        } else {
                            vo = '<span style="color:#E03636">' + res.reviewSta + '</span>';
                        }
                        return vo; 
                    }
                }
                , {
                    field: 'reviewRemark', title: '审核结果说明', width:150, align: 'left', unresize: false, templet: function (res) {
                        return '<span title="' + res.reviewRemark + '">' + res.reviewRemark + '</span>';
                    }
                }
            ]]
            , page: true 
            , limit: 30
            , limits: [30]
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
                case 'addBtn':
                    addTemplete();
                    break;
            };
        }); 
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() {  
            seachParam = '';
            tableList.reload({
                url: '/SmsAjax/GetSmsTemplateList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
        function addTemplete() {
            layer.open({
                title:'申请一个新的群发短信模板',
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '60%'],
                content: $('.addDiv')
            });
            return false;
        }
        
        $(document).on('click', '.viewContent', function () {
            var content = $(this).attr('data-content');
            layer.open({
                title: '短信模板内容',
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '200px'],
                content: content
            });
            return false;
        });
        form.on('submit(savebtn)', function (data) {
            if (data.field.smsType == "" || data.field.smsType == undefined) {
                layer.msg('请选择短信类型');
                return false;
            }
            if (data.field.content == "" || data.field.content == undefined) {
                layer.msg('模板内容不能为空');
                return false;
            }
            if (data.field.content.length<20) {
                layer.msg('模板内容长度不能少于20个字符');
                return false;
            }
            if (data.field.content.indexOf('退订') > -1 || data.field.content.indexOf('拒收') > -1) {
                layer.msg("短信模板内容不需要附带“退订”、“拒收”字符，若是营销短信，发送时会自动附加！", {
                    time: 3000
                });
                return false;
            }
            var smsType = data.field.smsType;
            var smsContent = data.field.content;
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SmsAjax/AddSmsTemplate",
                data: { smsType: smsType, content: smsContent },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 3000 }, function () { 
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