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
        var tableList = table.render({
            elem: '#tableList'
            , url: '/EmpAjax/GetOrderEmpLogs?orderId=' + $("#orderId").val()
            , defaultToolbar: []
            , cols: [[
                {
                    field: 'userName', title: '用户名', width: '12%', align: 'left', sort: false, templet: function (res) {
                        let vo = '<span class="" style="color:#006EE9">' + res.userName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'tempAmount', title: '预计绩效', width: '10%', align: 'center',edit:true, templet: function (res) {
                        let vo = '<span class="" data-id="' + res.empId + '" data-fee="' + res.tempAmount+'" style="color:#F3723A;cursor:pointer;" title="预计给该接手人的抛单金额">' + res.tempAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'bonusAmount', title: '生效绩效', width: '10%', align: 'center', unresize: true, edit: true,templet: function (res) {
                        return '<span class="" style="color:#F3723A" data-id="' + res.empId + '" data-fee="' + res.bonusAmount+'" title="该接手人实际收入的绩效金额">' + res.bonusAmount + '</span>';
                    }
                }
                , {
                    field: 'dlProject', title: '接手项目', width: '', align: 'left', unresize: false, templet: function (res) {
                        return '<span class="" style="color:#666" title="该接手人的项目：' + res.dlProject + '">' + res.dlProject + '</span>';
                    }
                }
                , {
                    field: 'createTime', title: '记录时间', width: '12%', align: 'center', unresize: true, templet: function (res) {
                        return '<span title="">' + res.createTime + '</span>';
                    }
                }, {
                    field: 'logUserName', title: '记录人', width: '12%', align: 'center', unresize: true, templet: function (res) {
                        return '<span title="">' + res.logUserName + '</span>';
                    }
                },
                { fixed: '', title: '操作', width:100, align: 'center', toolbar: '#baroperating', unresize: true }
            ]]
            , page: false
            , done: function (res, curr, count) {
                $('.edittemp').on('click', function () {
                    var id = $(this).attr('data-id');
                    var fee = $(this).attr('data-fee');
                    editEmpfun(id, fee)
                })
            }
        });
        function reloadOrderList() { 
            tableList.reload({
                url: '/EmpAjax/GetOrderEmpLogs?orderId=' + $("#orderId").val()
                , where: {
                }
                , page: false
            });
            return false;
    }
    table.on('edit(tableList)', function (obj) {
        console.log(obj)
        
        var id = obj.data.empId;
        var value = obj.value;

        if (!VerifyMoeny(value)) {
            layer.msg('请输入正确的金额，默认为' + fee, { time: 1000 }, function () {
                return;
            });
            return;
        }
        editEmpfun(id, value)
    })
    
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
            if (obj.event === 'delEmp') {
                var id = obj.data.empId;
                layer.confirm('确认将该笔绩效删除吗？删除后可能会影响订单当前接手人', function (index) {
                    if (!re)
                        return false;
                    re = false;
                    $.ajax({
                        type: "POST",
                        url: "/EmpAjax/DelEmp",
                        data: { empId: id },
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function () { layer.msg('出现错误'); re = true; },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                        success: function (data) {
                            re = true;
                            if (data.code > 0) {
                                layer.msg(data.msg, { time: 1500 }, function () { 
                                });
                                reloadOrderList();
                                parent.tools.reloadOrderDataNoCloseLayer();
                            }
                            else {
                                layer.msg(data.msg, { time: 3000 });
                            }
                        }
                        , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                    });
                });
            }
            else if (obj.event === 'editEmp') {
                var id = obj.data.empId;
                var fee = obj.data.tempAmount;
                layer.prompt({ title: '修改预计/生效绩效', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: fee }, function (value, index, elem) {
                    if (!VerifyMoeny(value)) {
                        layer.msg('请输入正确的金额，默认为' + fee, { time: 1000 }, function () {
                            return;
                        });
                        return;
                    }
                    if (value == fee) {
                        layer.msg('修改的金额与之前一样，无需修改', { time: 1000 }, function () {
                        });
                        return;
                    }
                    if (!re)
                        return false;
                    re = false;
                    editEmpfun(id, value, index)
                    //请求
                    
                });
            }
        });

    function editEmpfun(id, value,index) {
        $.ajax({
            type: "Post",
            url: "/EmpAjax/ChangeOrderRecPrice",
            data: { empId: id, fee: value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (index) {
                    layer.close(index);
                }
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                    });
                    reloadOrderList();
                    try {
                        parent.tools.reloadOrderData();
                    } catch(ex){ }
                    try {
                        window.parent.reloadOrderData();
                    } catch(ex){ }
                }
                else {
                    layer.msg(data.msg, { time: 3000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
          
});