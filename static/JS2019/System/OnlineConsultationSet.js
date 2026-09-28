layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form;
    var table = layui.table;
    var formSelects = layui.formSelects;
    var devices = layui.device();
    var isPc = true;
    var ok = true;
    var indexLoad;
    var openWindowsLayer;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var dataList = [];
    var seachParam = '';

    var tableList = table.render({
        elem: '#tableList'
        , height: 'full'
        , url: '/SystemAjax/GetOnlineConsultationSetList?' + seachParam
        , defaultToolbar: []
        , cols: [[
            {
                field: 'ScenesType', title: '接待场景', width: 280, align: 'left', unresize: true, templet: function (res) {
                    if (res.ScenesType == 10) {
                        return '人力(来自平台打手资源寻接单)';
                    } else if (res.ScenesType == 20) {
                        return '合作(来自找上下家业务广告咨询)';
                    } else if (res.ScenesType == 30) {
                        return '售后(来自查订单进度客户咨询)';
                    } else if (res.ScenesType == 40) {
                        return '商铺接待(来自查平台商铺用户的咨询)';
                    }
                }
            }
            , {
                field: 'SystemUserNames', title: '接待人员', align: 'left', sort: false, unresize: true, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" title="包含了：' + res.SystemUserNames + '">' + res.SystemUserNames + '</a>';
                    return vo;
                }
            }
            , { field: 'ShowNickName', title: ' 对外展示昵称', align: 'left', width: 180, unresize: true, }
            , { fixed: '', title: '操作', width: 100, toolbar: '#baroperating', unresize: true, }
        ]]
        , page: false
        , done: function (res, curr, count) {
            if (res.code == -1) {
                $(".layui-btn").hide();
            }
        }
    });
    var tableList2 = table.render({
        elem: '#tableList2'
        , toolbar: '#toolbarDemo'

        , url: '/SystemAjax/GetSystemGroupList?groupType=-1'
        , cols: [[{
            field: 'GroupId', title: '群组ID', align: 'center', sort: false, width: 180, unresize: true
        }
            , { field: 'GroupName', title: ' 群组名称', align: 'left', unresize: true, }
            , {
            field: 'GroupType', title: ' 群组类型', align: 'left', unresize: true, templet: function (res) {
                return res.GroupType == 0 ? '普通群' : '临时群'
            }
        }
            , { field: 'CreateTime', title: ' 创建时间', align: 'left', unresize: true, }
            , { fixed: '', title: '操作', width: 150, align: 'center', toolbar: '#baroperating2', unresize: true, }
        ]]
        , page: true
        , limit: 50
        , limits: [10, 20, 30, 40, 50]
        , done: function (res, curr, count) {
            if (res.code == -1) {
                $(".layui-btn").hide();
            }
        }
    });
    table.on('toolbar(tableList2)', function (obj) {
        switch (obj.event) {
            case 'update':
                modify();
                break;
            case 'creatGroup':
                creatGroup();
                break;
            case 'refresh':
                reloadOrderList();
                break;

        };
    });
    table.on('tool(tableList2)', function (obj) {
        switch (obj.event) {
            case 'destroyGroup':
                layer.confirm('确定解散群聊吗？ <br/> <br/> 警告：一旦解散，将无法恢复，请三思再操作！ <br/>', function (indexs) {
                    layer.close(indexs);
                    layer.confirm('第二次确认:  <br/> <br/> 确定解散群聊吗？解散后就无法恢复了 <br/>', function (index) {
                        var groupId = obj.data.GroupId;
                        $.post('/api/IMApi/DestroyGroup', { groupId }, function (res) {
                            if (res.code == 0) {
                                layer.msg(res.msg);
                            } else {
                                reloadOrderList();
                            }
                            layer.close(index);
                        });
                    });
                });
                break
        }
    })
    form.on('submit(seachBtn)', function (data) {
        reloadOrderList();
        return false;
    });
    $(document).on('click', '.submitEdit', function () {
        modify();
    });
    function reloadOrderList() {
        // tableList.reload({
        //     url: '/SystemAjax/GetOnlineConsultationSetList?' + seachParam
        //     , where: {
        //     }
        //     , page: false
        // });
        tableList2.reload({
            url: '/SystemAjax/GetSystemGroupList?' + `groupId=${$('#groupId').val()}&groupName=${$('#groupName').val()}&groupType=${$('#groupType').val()}`
            , where: {
            }
            , page: {
                curr: 1
            }
        });
        return false;
    }
    function creatGroup() {
        getUserListData();
        openWindowsLayer = layer.open({
            title: "创建群组",
            shade: [0.3, '#ccc'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '580px' : '95%', '380px'],
            content: $(".createyDiv")
        });
        return false;
    }
    function modify() {
        getUserListData();
        openWindowsLayer = layer.open({
            title: "编辑接待人员",
            shade: [0.3, '#ccc'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '580px' : '95%', '780px'],
            content: $(".modifyDiv")
        });
        return false;
    }
    function getUserListData() {
        $.get('/SystemAjax/GetUserListByOnlineConsultationSet', function (result) {
            formSelects.data('userList1', 'local', {
                arr: result.data1
            });
            $("#title1").val(result.title1);
            $("#userJob1").val(result.userJob1);
            formSelects.data('userList2', 'local', {
                arr: result.data2
            });
            $("#title2").val(result.title2);
            $("#userJob2").val(result.userJob2);
            formSelects.data('userList3', 'local', {
                arr: result.data3
            });
            $("#title3").val(result.title3);
            $("#userJob3").val(result.userJob3);
            formSelects.data('userList4', 'local', {
                arr: result.data4
            });
            $("#title4").val(result.title4);
            $("#userJob4").val(result.userJob4);

            formSelects.data('userList5', 'local', {
                arr: result.data2
            });
        });
    }
    form.on('submit(savebtn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ModifyOnlineConsultationSet",
            data: { strparameter: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请检查每一位是否有格式上的错误！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.alert(data.msg, function (oklayer) {
                        layer.close(openWindowsLayer);
                        layer.close(oklayer);
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 3000 });
                }
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(savebtn1)', function (data) {

        var strparameter = data.field;
        console.log(strparameter)
        if (!strparameter.userList5) {
            layer.msg('请选择群主')
            return false
        }
        if (!strparameter.GroupName) {
            layer.msg('请填写群名')
            return false
        }
        var data = { id: strparameter.userList5, name: strparameter.GroupName }
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/api/IMApi/CreateGroup",
            data: data,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请检查每一位是否有格式上的错误！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.alert(data.msg, function (oklayer) {
                        layer.close(openWindowsLayer);
                        layer.close(oklayer);
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 3000 });
                }
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
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
});