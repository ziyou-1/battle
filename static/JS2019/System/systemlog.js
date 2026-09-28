layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var orderId = $("#id").val();
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }  
        var re = true; 
        var indexLoad;
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var page = 1;
        laydate.render({
            elem: '#sDate'
            , type: 'datetime'
        });
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        });
        getAllRecUserData();
        function getAllRecUserData() {
            var soureData = [];
            $.get('/UserAjax/GetAllUserByGameName', function (result) {
                soureData = result.data;
                formSelects.data('recUser', 'local', {
                    arr: soureData
                });
            });
        }
        var seachParam = 'stime=' + sDate + '&etime=' + eDate + '&key2=' + $("#key2").val();
        var tableList =table.render({
            elem: '#tableList'
            , height: 'full-80'
            , cellMinWidth: 150
            , url: '/SystemAjax/GetSysmteLogList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'joinOrderId', title: '相关ID', width: 150, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.joinOrderId + '">' + res.joinOrderId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'logType', title: '日志分类', width: 70, align: 'center', unresize: false, templet: function (res) {
                        let vo = '全部';
                        /****
                         *  <option value="10">订单相关</option>
                        <option value="20">绩效相关</option>
                        <option value="30">用户相关</option>
                        <option value="40">系统相关</option>
                        <option value="50">会员相关</option>
                        <option value="60">排团相关</option>
                        <option value="5">号库相关</option>
                        <option value="70">其它</option>
                        */
                        switch (res.logType) {
                            case 5:
                                vo = '号库相关';
                                break;
                            case 10:
                                vo = '订单相关';
                                break;
                            case 20:
                                vo = '绩效相关';
                                break;
                            case 30:
                                vo = '用户相关';
                                break;
                            case 40:
                                vo = '系统相关';
                                break;
                            case 50:
                                vo = '会员相关';
                                break;
                            case 60:
                                vo = '排团相关';
                                break;
                            case 70:
                                vo = '其它';
                                break;
                        }
                        return vo;
                    }
                }
                , {
                    field: 'soureOrderId', title: '来源订单号', width: 200, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.soureOrderId + '">' + res.soureOrderId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'gameRoleName', title: '订单角色名', width: 150, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.gameRoleName + '">' + res.gameRoleName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'gameName', title: '所属游戏', width: 100, align: 'center', unresize: false
                }
                , {
                    field: 'remark', title: '操作说明', align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.remark + '">' + res.remark + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'userName', title: '操作用户', width: 120, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.userName + '">' + res.userName + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'createTime', title: '操作时间', width: 130, align: 'center', sort: true, unresize: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.createTime + '">' + res.createTime + '</a>';
                        return vo;
                    }
                }
            ]]
            , page: true
            , limit: 30
            , limits: [10, 20, 30, 40, 50, 100]
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
                case 'clearAll':
                    layui.layer.confirm('确定要清空所有系统操作日志吗？清空后不可恢复。', { icon: 3, title: '清理日志' }, function (idx) {
                        layui.layer.close(idx);
                        $.post('/SystemAjax/ClearSystemLog', {}, function (res) {
                            if (res && res.code > 0) {
                                layui.layer.msg('已清理全部日志', { time: 1200 });
                                page = 1;
                                reloadOrderList();
                            } else {
                                layui.layer.msg((res && res.msg) || '清理失败');
                            }
                        }, 'json');
                    });
                    break;
            };
        }); 
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var recUser = formSelects.value('recUser', 'nameStr');
            var skey = $("#key1").val();
            var skey2 = $("#key2").val();
            var logType = $("#logType").val();
            var gameName = $("#gameName").val();
            seachParam = 'stime=' + sDate + '&etime=' + eDate + '&user=' + recUser + '&key=' + skey + '&key2=' + skey2 + '&logType=' + logType + '&gameName=' + gameName;
            tableList.reload({
                url: '/SystemAjax/GetSysmteLogList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
});