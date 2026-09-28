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
        var page = 1; 
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/SmsAjax/GetSmsSendLogList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                 {
                     field: 'moblie', title: '手机号码', width:120, align: 'center', unresize: true, templet: function (res) {
                         return '<span>' + res.moblie + '</span>';
                    }
                }
                , {
                    field: 'smsContent', title: '短信内容(不带签名)', align: 'left', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + res.smsContent + '">' + res.smsContent + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'isSucess', title: '是否发送出去', width:100, align: 'center', sort: false, unresize: true, templet: function (res) { 
                        let vo = '';
                        if (res.isSucess =="Y") {
                            vo = '<span style="color:#5FB878">已发送</span>';
                        } else {
                            vo = '<span style="color:#E03636">未发送</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'sendCount', title: '计费条数', align: 'center', width:80, sort: false,
                    unresize: false, templet: function (res) {
                        let vo = '<span style="color:#E03636">' + res.sendCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'fee', title: '消费金额', width:80,align:'center', unresize: false, templet: function (res) {
                        let vo = '<span style="color:#E03636">' + res.fee + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'Msg', title: '状态说明', width:80, align: 'center', unresize: false, templet: function (res) {
                        return '<span title="">' + res.Msg + '</span>';
                    }
                } 
                , {
                    field: 'sendTime', title: '发送时间', align: 'center', width:120, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.sendTime + '</span>';
                        return vo;
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
            };
        }); 
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() {  
            var skey = $("#key1").val(); 
            seachParam = 'key=' + skey; 
            tableList.reload({
                url: '/SmsAjax/GetSmsSendLogList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }  
});