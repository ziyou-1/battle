
layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        laydate = layui.laydate;
    var table = layui.table;
    var setter = layui.setter;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    laydate.render({
        elem: '#start'
        , type: 'date'
    });
    laydate.render({
        elem: '#end'
        , type: 'date'
    });
    function objectToQueryString(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params.append(key, obj[key]);
            }
        }
        return params.toString();
    } 
    var searchData = form.val('sform');
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    });
    var seachParam = 'sdate=' + $("#sDate").val() + '&edate=' + $("#eDate").val();
    var indexLoad;
    var re = true;
    var page = 1;
    var settLayer;
    var tipsLayer;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/UserAjax/GetOnboardingList?' + objectToQueryString(searchData)
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
             {
                field: 'nickName', title: '昵称', width: 86, align: 'center',  sort: false
            }
            , {
                field: 'phone', title: '手机号', width: 100, align: 'center', 
            }
            , {
                field: 'idCard', title: '身份证号', width: 150, align: 'center',
                }
            , {
                field: 'name', title: '姓名', width: 60, align: 'center',
            }
            , {
                field: 'birthday', title: '生日', width: 90, align: 'center', templet: function (res) {
                    var vo = ''
                    if (res.birthday) {
                        vo = res.birthday.split(' ')[0];
                    }
                    return vo;
                }
            }
            , {
                field: 'wechat', title: '微信', width: 100, align: 'center',  sort: false
            }
            , {
                field: 'qq', title: 'QQ号', width: 100, align: 'center',  sort: false
            }
            , {
                field: 'str5', title: '来源', width: 80, align: 'center', templet: function (res) {
                    if (res.soure == 0) {
                        return '<span>内部邀请</span>';
                    } else if(res.soure == 1) {
                        return '<span>外部邀请</span>';
                    }
                }
            }, {
                field: 'introduction', title: '个人介绍', align: 'left', 
            }, {
                field: 'createTime', title: '申请时间', width: 90, align: 'center',  templet: function (res) {
                    var vo = ''
                    if (res.createTime) {
                        vo = res.createTime.split(' ')[0];
                    }
                    return vo;
                }
            }, {
                field: 'status', title: '审核状态', width: 90, align: 'center', unresize: false, templet: function (res) {
                    if (res.status == 0) {
                        return   '<span class="lableb" style="background-color: #ffb800">审核中</span>';
                    } else if (res.status == 1) {
                        return '<span class="lableb" style="background-color: #16b777;">审核通过</span>';
                    } else if (res.status == 2) {
                        return '<span class="lableb" style="background-color: red;">审核不通过</span>';
                    } 
                }
            }, {
                field: 'status', title: '驳回理由', width: 90, align: 'left', unresize: false, templet: function (res) {
                    if (res.reason) {
                        return `<span lay-tips="${res.reason}">${res.reason}</span>`;
                    } else {
                        return ''
                    }
                }
            }
            , {
                field: 'createPersonUserNicke', title: '操作', width: 210, unresize: false, templet: '#table_tool'

            }
        ]]
        , page: true
        , limit: 20
        , limits: [20]
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
            case 'copy':
                var str = window.location.origin +'/html/settle.html'
                copyToClipboard(str)
        };
    });

    function closePop() {
        layer.close(indexPop)
        reloadOrderList()
    }
    var indexPop
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            var indexPop = layer.open({
                type: 2,
                title: "通过申请",
                shade: [0.3, '#333'],
                skin: 'layui-layer-lan',
                area: [isPc ? '1420px' : '90%', isPc ? '830px' : '90%' ],
                anim: 3,
                shadeClose: true,
                content: '/User/AddUser?aid=' + data.id
            });
        }
        else if (obj.event === 'submitRestPwd') {
            layer.prompt({ title: '请输入驳回理由' }, function (text, promptindex) {
                layer.confirm('确认是否驳回申请', {
                    btn: ['确定', '关闭'] 
                }, function () {
                    var model = {
                        id: data.id,
                        reason: text
                    }
                    $.ajax({
                        type: "post",
                        url: "/UserAjax/AuditOnboarding",
                        data: JSON.stringify(model),
                        contentType: "application/json",
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                        success: function (data) {
                            re = true;
                            reloadOrderList()
                            layer.msg(data.msg)
                            layer.close(promptindex)
                            layer.close(indexLoad)
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(promptindex)
                            layer.close(indexLoad)
                        }
                    });
                }, function () {
                    layer.closeAll()
                });
            });
            return false;
        } else if (obj.event === 'delete') {
            layer.confirm('确认是否删除申请', {
                btn: ['确定', '关闭']
            }, function () {
                $.ajax({
                    type: "post",
                    url: "/UserAjax/DeleteOnboarding/" + data.id,
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                    success: function (data) {
                        re = true;
                        layer.msg(data.msg)
                        reloadOrderList()
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad)
                    }
                });
            }, function () {
                layer.closeAll()
            });
            return false;
        }
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            layer.msg('复制成功')
        } catch (err) {
            const input = document.createElement("input");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            layer.msg('复制成功')
        }
    }
    function reloadOrderList() {
        var newSearchData = form.val('sform');
        tableList.reload({
            url: '/UserAjax/GetOnboardingList?' + objectToQueryString(newSearchData)
            , where: {
            }
            , page: {
                curr: page
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