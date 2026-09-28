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
    var currentId = 0;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var seachParam = ''; 
        var indexLoad;
        var re = true;
        var page = 1;
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        getAllUserData();
        function getAllUserData() {
            $.get('/UserAjax/GetAllUserByGameName?isFilteJdp=Y', function (result) {
                formSelects.data('userList', 'local', {
                    arr: result.data
                });
            });
        }  
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/UserAjax/GetUserLoginRestrictList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 } 
                , {
                    field: 'UserId', title: '系统用户', width: 200, align: 'center', unresize: false
                }
                , {
                    field: 'weekDay', title: '限制周期段', width: 200, align: 'center',unresize: false, templet: function (res) {
                        let span = '';
                        if (res.WeekDay.indexOf('1') > -1) {
                            span += ' 周一 ';
                        }
                        if (res.WeekDay.indexOf('2') > -1) {
                            span += ' 周二 ';
                        }
                        if (res.WeekDay.indexOf('3') > -1) {
                            span += ' 周三 ';
                        }
                        if (res.WeekDay.indexOf('4') > -1) {
                            span += ' 周四 ';
                        }
                        if (res.WeekDay.indexOf('5') > -1) {
                            span += ' 周五 ';
                        }
                        if (res.WeekDay.indexOf('6') > -1) {
                            span += ' 周六 ';
                        }
                        if (res.WeekDay.indexOf('0') > -1) {
                            span += ' 周日 ';
                        }
                        return span;
                    }
                }
                , {
                    field: 'RestrictTimeS', title: '限制时间段', width:200,align:'center', unresize: false, templet: function (res) {
                        let span = res.RestrictTimeS + '时 至 ' + res.RestrictTimeE + '时';
                        return span;
                    }
                }
                , {
                    field: 'RestrictType', title: '限制方式', width: 200, align: 'center', unresize: false, templet: function (res) {
                        let vo = '';
                        if (res.RestrictType == 0) {
                            vo = "IP白名单限制";
                        } else if (res.RestrictType == 1) {
                            vo = "允许登录";
                        } else if (res.RestrictType == 2) {
                            vo = "禁止登录";
                        } else if (res.RestrictType == 3) {
                            vo = "按IP/IP段";
                        }
                        return vo;
                    }
                }
                , {
                    field: 'IPWhitelist', title: 'IP范围', minwidth: 120, unresize: false, align: 'center'
                }
                , {
                    field: 'Status', title: '<span lay-tips="绿色代表这个规则状态开启, 符合规则条件的用户才能登录。">规则状态</span>', width: 75, align: 'center', unresize: false, templet: '#switchTpl1'
                }
                , {
                    field: 'CreateTime', title: '创建时间', width: 100, align: 'center', unresize: false
                }
                , {
                    field: 'UpdateTime', title: '更新时间', width:100, align: 'center', unresize: false
                }
                , {
                    field: 'LastModifyUserName', title: '修改人名称', width: 75, align: 'center', unresize: false
                }
                , { fixed: '', title: '操作', width:85, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true
            , limit: 50
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) {  
                console.log(res, curr, count);
             }
        }); 
        form.on('switch(statusChecked)', function (obj) {
            var status = obj.elem.checked;
            var userLoginRestrictId = this.value;
            
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/UpUserLoginRestrictStatus",
                data: {
                    userLoginRestrictId: userLoginRestrictId,
                    status: status
                },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.tips(status == false ? '该规则已禁用' : '该规则已启用', obj.othis);
                    }
                    else {
                        layer.msg(data.msg, { time: 2000 }, function () {
                        })
                    }
                    re = true;
                    reloadOrderList();
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false; 
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addUserLoginRestrictBtn':
                    addEditUserLoginRestrict(0);
                    break;
                case 'addUserLoginRestrictIPBtn':
                    addEditUserLoginRestrictIp(0,"");
                    break;
                case 'batchEditUserLoginRestrictBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].UserLoginRestrictId);
                    };
                    var userLoginRestrictId = tempData.join(',');
                    addEditUserLoginRestrict(userLoginRestrictId);
                    break;
                case 'batchDelUserLoginRestrictBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请勾选要操作的数据行');
                        return false;
                    }
                    var data = checkStatus.data;
                    var tempData = [];
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].UserLoginRestrictId);
                    };
                    var userLoginRestrictId = tempData.join(',');
                    delUserLoginRestrict(userLoginRestrictId);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'submitEdit') {
                var userLoginRestrictId = obj.data.UserLoginRestrictId;
                var restrictType = obj.data.RestrictType;
                var ipWhitelist = obj.data.IPWhitelist;
                if (restrictType == 3) {
                    addEditUserLoginRestrictIp(userLoginRestrictId,ipWhitelist);
                } else {
                    addEditUserLoginRestrict(userLoginRestrictId);
                }
                return false;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        });
        function reloadOrderList() {
            var userList = formSelects.value('userList', 'valStr');
            seachParam = 'userList=' + userList + '&ip=' + $("#IPWhitelist").val();
            tableList.reload({
                url: '/UserAjax/GetUserLoginRestrictList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }

        function addEditUserLoginRestrict(id) {
            addUserLayerIndex = layer.open({
                title: (id.toString().indexOf(',') > -1 ? "批量编辑" : id > 0 ? "编辑" : "新增") +"用户登录限制设置",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['60%', '60%'],
                content: '/User/AddUserLoginRestrict?id=' + id
            });
    }
    function addEditUserLoginRestrictIp(id,ip) {
        form.val("form", {
            "blackIP": ip
        });
        currentId = id;
        addUserLayerIndex = layer.open({
            title: (ip!="" ? "编辑" : "新增") + "按IP禁止登录规则",
            shade: [0.3, '#333'],
            shadeClose: true,
            type:1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['480px', '320px'],
            content: $(".addDislabelIPDiv")
        });
    }

    function delUserLoginRestrict(ids) {
        layer.confirm('确认要删除吗？', function (index) {
            confirmDelUserLoginRestrict(ids, index);
        });
        return false;
    }
    function confirmDelUserLoginRestrict(ids, index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/DelUserLoginRestrict",
            data: { idx: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
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
    $(document).on('click', '.saveBlackIPBtn', function () {
        var blackIP = $("#blackIP").val();
        if (blackIP == "" || blackIP == null) {
            layer.msg('请填充要禁止登录系统的IP或IP段');
            return false;
        }
        if (blackIP.length < 7) {
            layer.msg('请填充正确的IP或IP段');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/AddUserLoginRestrictByIP",
            data: { id: currentId, ip: blackIP},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(addUserLayerIndex);
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
    });
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll(); //关闭现有所有弹层
                reloadOrderList();
            }
        };
        window.tools = _tools;
});