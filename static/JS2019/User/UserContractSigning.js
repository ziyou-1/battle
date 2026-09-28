layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'util', 'laydate', 'table', 'transfer'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        laydate = layui.laydate;
    var table = layui.table;
    var transfer = layui.transfer;
    var setter = layui.setter;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    laydate.render({
        elem: '#sDate'
        , type: 'date'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'date'
    });
    var indexLoad;
    var re = true;
    var page = 1;
    var settLayer;
    var tipsLayer;

    $.ajax({
        type: "get",
        url: "/api/SignContract/GetSystemContractTotal",
        data: {},
        dataType: 'json',
        cache: false,
        timeout: 60000,
        error: function () { layer.msg('系统繁忙！'); },
        success: function (data) {
            if (data.code > 0) {
                $('.btnSpan').text(data.data)
            }
        }
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

    console.log(searchData)
    var tableList = table.render({
        elem: '#tableList'
        , url: '/api/SignContract/GetSystemContarctList?' + objectToQueryString(searchData)
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 }
            , {
                field: 'name', title: '真实姓名', width: 150, align: 'center', unresize: false, sort: false
            }
            , {
                field: 'idCadrNo', title: '身份证号', width: 145, align: 'center', unresize: false, templet: function (res) {
                    let vo = '<span title="不予完整展示，完整证件号请进入系统用户/用户管理，编辑子账号资料里查看">' + res.idCadrNo + '</span>';
                    return vo;
                }
            }
            , {
                field: 'mobile', title: '手机号', width: 130, align: 'center', unresize: false
            }
            , {
                field: 'userName', title: '系统用户名称', width: 160, align: 'center',
            }
            //, {
            //    field: 'str8', title: '性别', width: 60, align: 'center', unresize: true
            //}
            , {
                field: 'age', title: '年龄', width: 60, align: 'center', unresize: false, templet: function (res) {
                    if (!res.age) {
                        res.age = ''
                    }
                    let vo = '<span class="">' + res.age + '</span>';
                    if (res.age < 18 || res.age > 45) {
                        vo = '<span style="color:#ff5722" lay-tips="年龄异常，请谨慎雇用">' + res.age + '</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'status', title: '签约状态', width: 100, align: 'center', unresize: false, sort: false, templet: function (res) {
                    let vo = '';
                    if (res.status == -30) {
                        vo = '<span class="lableb" style="background-color:#b0aeae;;">已过期</span>';
                    } else if (res.status == -20) {
                        vo = '<span class="lableb" style="background-color:#FF5722;">已撤销</span>';
                    } else if (res.status == -10) {
                        vo = '<span class="lableb" style="background-color:#FFB800;">已拒签</span>';
                    } else if (res.status == 0) {
                        vo = '<span class="lableb" style="background-color:#16BAAA;">已发起</span>';
                    } else if (res.status == 5) {
                        vo = '<span class="lableb" style="background-color:#1E9FFF;">待编辑</span>';
                    } else if (res.status == 10) {
                        vo = '<span class="lableb" style="background-color:#16BAAA;">待签署</span>';
                    } else if (res.status == 20) {
                        vo = '<span class="lableb" style="background-color:#16B777;">已完成</span>';
                    } else if (res.status == -99) {
                        vo = '<span class="lableb" style="background-color:#f9696c;">解约中</span>';
                    } else if (res.status == -100) {
                        vo = '<span class="lableb" style="background-color:#c73b44;">已解约</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'createTime', title: '邀请时间', width: 130, align: 'center', unresize: false, sort: false
            }
            , {
                field: 'sigingCompleteTime', title: '签约时间', width: 130, align: 'center', unresize: false
            }
            , {
                field: 'sigingCompleteTime', title: '操作', width: 240, align: 'left', templet: function (res) {
                    let vo = '';
                    if (res.userId <= 0 && res.status >= 0) {
                        vo += '<button class="layui-btn layui-btn-xs layui-bg-blue getUserBtn" lay-tips="为这条签约关联一个系统用户"  type="button" data-id="' + res.id + '"  data-name="' + res.name + '"  data-idCardNo="' + res.idCadrNo + '"  data-status="' + res.status + '">关联用户</button>';
                    }
                    if (res.status == -30 || res.status == -20 || res.status == -100) {
                        vo += '<button class="layui-btn layui-btn-xs  reputBtn" lay-tips="重新发起这条签约"  type="button" data-idCardNo="' + res.idCadrNo + '"  data-mobile="' + res.mobile + '"  data-name="' + res.name + '"  data-userId="' + res.userId + '">重新发起</button>';
                    }
                    if (res.status == 20) {
                        vo += `<button class="layui-btn layui-btn-xs getHtBtn"  type="button" lay-tips="查看获取到的合同链接"  data-id="${res.id}">查看合同</button>
                        <button class="layui-btn layui-btn-xs delHtBtn layui-btn-danger"  type="button" lay-tips="点击解除已签约的合同"  data-id="${res.id}">解除合同</button>
                        `;
                    } else if (res.status >= 0) {
                        vo += `<button class="layui-btn layui-btn-xs layui-bg-orange getUrlBtn" lay-tips="复制获取到的合同链接"  type="button" data-id="${res.id}">复制合同链接</button>
                               
                        `;
                    }
                    if (res.status == 0 || res.status == 5 || res.status == 10) {
                        vo += `<button class="layui-btn layui-btn-xs layui-btn-danger getDelBtn"  type="button" data-id="${res.id}">撤回签约</button>`
                    }
                    if (res.status == -30) {
                        vo += `<button class="layui-btn layui-btn-xs layui-btn-danger DelBtn"  type="button" data-id="${res.id}">删除合同</button>`
                    }
                    return vo;
                }
            }
            ,
        ]]
        , page: true
        , limit: 20
        , limits: [20, 50, 100]
        //, parseData: function (res) {
        //    return {
        //        "code": res.data.code,
        //        "count": res.data.count,
        //        "data": res.data.data
        //    };
        //}
        , done: function (res, curr, count) {
            page = curr;
        }
    });

    $(document).on('click', '.getUserBtn', function () {
        var id = $(this).attr('data-id')
        var name = $(this).attr('data-name')
        var idCardNo = $(this).attr('data-idCardNo')
        var status = $(this).attr('data-status')
        addUserLayerIndex = layer.open({
            title: "选择系统用户",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '465px' : '95%', isPc ? '300px' : '95%'],
            content: `
                    <div  style="color:#F5862D;margin-top:20px;margin-left:19px;font-size:12px;">提醒：可输入系统用户在本系统的关键词用来快速查找</div>
                    <label class="layui-form-label" style="margin-top:20px">系统用户</label>
                    <div class="layui-input-inline" style="margin-top:20px">
                         <input type="text" name="addTeammateName" id="addTeammateName" placeholder="输入系统用户" class="layui-input" autocomplete="off" >
                         <div id="addTeammateNameBox" ></div>
                    </div>
            `,
            success: function () {
                $("#addTeammateName").on("input", function (e) {
                    if ($('#addTeammateName').val()) {
                        $('#addTeammateNameBox').show()
                        $('#addTeammateNameBox').empty()
                        $('#addTeammateNameBox').html('<div class="addTeammateNameItem " ><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style="color:#16b777;"></i></div>')
                        if (timer) {
                            clearTimeout(timer)
                        }
                        timer = setTimeout(() => {
                            $.ajax({
                                url: '/UserAjax/GetSysUserSelect?key=' + $('#addTeammateName').val(),
                                method: 'GET',
                                success: function (data) {
                                    var res = data
                                    $('#addTeammateNameBox').empty()
                                    if (res.data.length == 0) {
                                        $('#addTeammateNameBox').html('<div class="addTeammateNameItem " style="color:#aaa">未搜索到系统用户名称</div>')
                                    } else {
                                        var str = ""
                                        res.data.forEach(item => {
                                            str += '<div class="addTeammateNameItem addTeammateNameInput" data-userId="' + item.value + '" data-id="' + id + '"  data-name="' + name + '"  data-idCardNo="' + idCardNo + '"  data-status="' + status + '">' + item.label + '</div>'
                                        })
                                        $('#addTeammateNameBox').html(str)
                                    }

                                },
                            });
                        }, 500)
                    } else {
                        $('#addTeammateNameBox').hide()
                        $('#addTeammateNameBox').empty()
                    }
                });
            }
        });





    })


    $(document).on('click', '.delHtBtn', function () {
        var id = $(this).attr('data-id')
        var layerindexLoad = layer.prompt({ title: '请输入解约原因', formType: 0, maxlength: 200 }, function (value, index, elem) {
            if (!value) {
                layer.msg('请输入解约原因', { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            var model = { id: id, reason: value, }
            $.ajax({
                type: "Post",
                url: "/api/SignContract/ContractRescission",
                data: JSON.stringify(model),
                dataType: 'json',
                contentType: "application/json",
                cache: false,
                timeout: 60000,
                error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            reloadOrderList();
                            layer.close(layerindexLoad);
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    })

    $(document).on('click', '.getHtBtn', function () {
        var id = $(this).attr('data-id')
        $.ajax({
            type: "get",
            url: "/api/SignContract/GetContractUrl",
            data: { id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    var url = data.data;
                    var textarea = document.createElement('textarea');
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = 0;
                    textarea.value = url;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    layer.msg('合同链接已复制到剪切板')

                } else {
                    layer.msg(data.msg);
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        })
    })
    $(document).on('click', '.getUrlBtn', function () {
        var id = $(this).attr('data-id')
        $.ajax({
            type: "get",
            url: "/api/SignContract/GetSignContractUrl",
            data: { id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    var url = $(this).attr('data-url')
                    var textarea = document.createElement('textarea');
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = 0;
                    textarea.value = data.data.signPcUrl;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    layer.msg('合同链接已复制到剪切板')
                } else {
                    layer.msg(data.msg)
                }


                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

    })

    $(document).on('click', '.DelBtn', function () {
        var id = $(this).attr('data-id')
        var layerIndex = layer.confirm('一旦删除，将彻底无法恢复！确认要删除吗？ ', function (indexs) {
            var model = [id]
            $.ajax({
                type: "post",
                url: "/api/SignContract/DeleteContract",
                data: JSON.stringify(model),
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg)
                    layer.close(layerIndex)
                    reloadOrderList();

                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    })

    $(document).on('click', '.getDelBtn', function () {
        var id = $(this).attr('data-id')
        $.ajax({
            type: "Post",
            url: "/api/SignContract/ContractRevoke",
            data: JSON.stringify({ id }),
            contentType: 'application/json',
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                    reloadOrderList();
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })

    var addUserLayerIndex
    var timer
    $(document).on('click', '.addTeammateName', function () {
        addUserLayerIndex = layer.open({
            title: "选择系统用户",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '465px' : '95%', isPc ? '300px' : '95%'],
            content: `
                    <div  style="color:#F5862D;margin-top:20px;margin-left:19px;font-size:12px;">提醒：可输入系统用户在本系统的关键词用来快速查找</div>
                    <label class="layui-form-label" style="margin-top:20px">系统用户</label>
                    <div class="layui-input-inline" style="margin-top:20px">
                         <input type="text" name="addTeammateName" id="addTeammateName" placeholder="输入系统用户" class="layui-input" autocomplete="off" >
                         <div id="addTeammateNameBox" ></div>
                    </div>
            `,
            success: function () {
                $("#addTeammateName").on("input", function (e) {
                    if ($('#addTeammateName').val()) {
                        $('#addTeammateNameBox').show()
                        $('#addTeammateNameBox').empty()
                        $('#addTeammateNameBox').html('<div class="addTeammateNameItem " ><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style="color:#16b777;"></i></div>')
                        if (timer) {
                            clearTimeout(timer)
                        }
                        timer = setTimeout(() => {
                            $.ajax({
                                url: '/UserAjax/GetSysUserSelect?key=' + $('#addTeammateName').val(),
                                method: 'GET',
                                success: function (data) {
                                    var res = data
                                    $('#addTeammateNameBox').empty()
                                    if (res.data.length == 0) {
                                        $('#addTeammateNameBox').html('<div class="addTeammateNameItem " style="color:#aaa">未搜索到系统用户名称</div>')
                                    } else {
                                        var str = ""
                                        res.data.forEach(item => {
                                            str += "<div class='addTeammateNameItem addTeammateNameValue' userId='" + item.value + "'>" + item.label + "</div>"
                                        })
                                        $('#addTeammateNameBox').html(str)
                                    }

                                },
                            });
                        }, 500)
                    } else {
                        $('#addTeammateNameBox').hide()
                        $('#addTeammateNameBox').empty()
                    }
                });
            }
        });
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'settingBtn':
                addUserLayerIndex = layer.open({
                    title: "发起签约",
                    shade: [0.3, '#333'],
                    shadeClose: false,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '800px' : '90%', '330px'],
                    content: `
                        <form class="layui-form" action="" id="popform" lay-filter="popform">
                            <div class="settingDiv" style="padding:10px 10px">
                                <div class="layui-inline layui-form-item" style="width:100%">
                                    <label class="layui-form-label"><span class="layui-font-red">*</span>真实姓名</label>
                                    <div class="layui-input-inline" style="width:calc(100% - 130px)">
                                        <input type="text" name="name" id="" lay-verify="required" placeholder="请输入真实姓名" autocomplete="off" class="layui-input layui-input-shadow" value="">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label"><span class="layui-font-red">*</span>身份证号</label>
                                    <div class="layui-input-inline">
                                        <input type="text" name="idCardNo" id="" lay-verify="required" placeholder="请输入身份证号" autocomplete="off" class="layui-input layui-input-shadow" value="">
                                    </div>
                                    <label class="layui-form-label"><span class="layui-font-red">*</span>手机号</label>
                                    <div class="layui-input-inline">
                                        <input type="text" name="mobile" id="" lay-verify="required" placeholder="请输入手机号" autocomplete="off" class="layui-input layui-input-shadow" value="">
                                    </div>
                                </div>
                                <div class="layui-form-item">
                                    <label class="layui-form-label">系统用户</label>
                                    <div class="layui-input-inline">
                                        <div class="addTeammateName" >点击搜索系统用户</div>
                                    </div>
                                    <label class="layui-form-label"><span class="layui-font-red">*</span>合同模版</label>
                                    <div class="layui-input-inline">
                                          <select id="contractTemplate" lay-verify="required" name="templateNo" >

                                          </select>
                                    </div>
                                </div>

                                <div style="text-align:center;align-items:center;margin-top:40px">
                                    <div  class="layui-btn  layui-btn-normal layui-btn-lg saveSettingBtn" lay-submit="saveSettingBtn">发起合同签约</div>
                                </div>
                                </div>
                        </form>
                        `,


                    success: function () {
                        $.ajax({
                            type: "get",
                            url: "/api/SignContract/GetContractTemplateList",
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () {
                                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                                });
                            },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                            success: function (dataList) {
                                var dataStr = ''
                                if (dataList.data.length > 1) {
                                    dataStr += `<option  value="" >选择合同模板</option>`
                                }
                                dataList.data.forEach(item => {
                                    dataStr += `<option  value="${item.templateNo}" >${item.templateTitle}</option>`
                                })
                                $('#contractTemplate').html(dataStr)
                                form.render()

                                re = true;
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        });
                        form.render()
                    }
                });

                break;
            case 'buyBtn':
                settLayer = layer.open({
                    title: "签约功能配置",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 3,
                    area: [isPc ? '620px' : '90%', '350px'],
                    content: $('.settingDiv')
                });
                break;
            case 'whitelistBtn':
                addUserLayerIndex = layer.open({
                    title: "签约白名单",
                    shade: [0.3, '#333'],
                    shadeClose: false,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '556px' : '90%', '542px'],
                    content: `
                        <div style="padding:20px;">
                            <div  class="layui-btn layui-btn-normal saveWhitelist" lay-submit="">保存设置</div>
                            <div  class="layui-btn layui-bg-red reshowBtn"  lay-submit="">刷新列表</div>
                            <div id="dispatcher_transfer" class="dispatcher_box" style="margin-top:20px"></div>
                        </div>
                        `,
                    success: function () {
                        getWhitelist()
                    }
                });
                break;
            case 'delBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var idList = []
                data.forEach(item => [
                    idList.push(item.id)
                ])
                layer.confirm('批量删除时，存在其他状态合同不影响，仅删除已过期合同。删除后无法恢复。是否确认删除？', function (index) {
                    if (!re)
                        return false;
                    re = false;
                    $.ajax({
                        type: "post",
                        url: "/api/SignContract/DeleteContract",
                        data: JSON.stringify(idList),
                        contentType: "application/json",
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function (xhr) {
                            re = true;
                            layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {

                            });
                        },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                        success: function (data) {
                            layer.msg(data.msg)
                            reloadOrderList();
                        },
                        complete: function (XMLHttpRequest) {
                            re = true;
                            layer.close(indexLoad);
                        }
                    });
                })
                break;
            case 'resetAsynBtn':
                window.open("//www.jidanpu.com/Pay/BuyContract?sid=" + $("#sid").val(), "_blank")
                break;
        };
    });

    //form.on('submit(saveSettingBtn)', function (data) {
    //    var strparameter = JSON.stringify(data.field);
    //    if (!re) {
    //        return false;
    //    }
    //    re = false;
    //    $.ajax({
    //        type: "Post",
    //        url: "/api/SignContract/SaveSignConfig",
    //        data: { param: strparameter },
    //        dataType: 'json',
    //        cache: false,
    //        timeout: 60000,
    //        error: function () {
    //            layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
    //            });
    //        },
    //        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
    //        success: function (data) {
    //            layer.msg(data.msg, { time: 1500 }, function () {
    //                layer.close(addUserLayerIndex);
    //                layer.close(settLayer);
    //                reloadOrderList();

    //            })
    //            re = true;
    //        },
    //        complete: function (XMLHttpRequest) {
    //            layer.close(indexLoad);
    //        }
    //    });
    //    return false;
    //});
    function getWhitelist() {
        $.ajax({
            type: "Get",
            url: "/UserAjax/GetAllUserByGroupName?groupType=10&isFilteDevUser=true",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {

                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {

                if (data.code >= 0) {
                    $.ajax({
                        type: "Get",
                        url: "/UserAjax/GetContractWhitelist",
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function (xhr) {
                            layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {

                            });
                        },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                        success: function (itemdata) {
                            if (itemdata.code > 0) {
                                var sform3data = form.val('sform3');
                                var customDispatcher = sform3data.customDispatcher
                                console.log(customDispatcher)
                                if (customDispatcher == 1) {
                                    $('#dispatcher_transfer').show()
                                }
                                data.data.forEach(i => {
                                    i.title = i.name
                                })
                                var idArray = itemdata.data.map(item => item.value);
                                console.log(idArray)
                                transfer.render({
                                    elem: '#dispatcher_transfer',
                                    title: ['系统用户', '白名单'],
                                    id: "dispatcher",
                                    data: data.data,
                                    value: idArray
                                });
                            }
                            else {
                                layer.msg(data.msg, { time: 2000 }, function () {
                                })
                            }
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    $(document).on('click', '.saveWhitelist', function (e) {
        //var data = form.val('sform3');
        var getData = transfer.getData('dispatcher');
        var idArray = getData.map(item => item.value);

        console.log(getData)
        //var model = {
        //    array: Number(data.customDispatcher), userIds: idArray
        //}
        $.ajax({
            type: "post",
            url: "/UserAjax/SaveContractWhitelist",
            data: JSON.stringify(idArray),
            dataType: 'json',
            contentType: "application/json",
            cache: false,
            timeout: 60000,
            error: function (xhr) {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {

                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 2000 }, function () {
                    if (data.code > 0) {
                        layer.close(addUserLayerIndex)
                    }
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })

    $(document).on('click', '.reshowBtn', function () {
        getWhitelist()

    })

    $(document).on('click', '.addTeammateNameValue', function () {
        layer.close(addUserLayerIndex)
        var str = $(this).text()
        var userId = $(this).attr('userId')
        $('.addTeammateName').text(str)
        $('.addTeammateName').attr("userId", userId)
        $('.addTeammateName').css('color', '#333')
    })
    $(document).on('click', '.addTeammateNameInput', function () {
        var str = $(this).text()
        var id = $(this).attr('data-id')
        var name = $(this).attr('data-name')
        var idCardNo = $(this).attr('data-idCardNo')
        var status = $(this).attr('data-status')
        var userId = $(this).attr('data-userId')
        layer.confirm('确定将这条签约关联' + str + '吗？', {
            btn: ['确定', '关闭'] //按钮
        }, function () {
            var strparameter = {
                id,
                idCardNo,
                status,
                name,
                userId
            }
            $.ajax({
                type: "Post",
                url: "/api/SignContract/ContractBindSysUser",
                data: JSON.stringify(strparameter),
                contentType: 'application/json',
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () {
                    layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                    });
                },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (res) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        layer.close(addUserLayerIndex);
                        layer.close(settLayer);
                        reloadOrderList();

                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });

        }, function () {
        });
    })


    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });

    function reloadOrderList() {
        var searchData2 = form.val('sform');
        $.ajax({
            type: "get",
            url: "/api/SignContract/GetSystemContractTotal",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            success: function (data) {
                if (data.code > 0) {
                    $('.btnSpan').text(data.data)
                }
            }
        });

        tableList.reload({
            url: '/api/SignContract/GetSystemContarctList?' + objectToQueryString(searchData2)
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }

    function resetAsynFun() {
        $.ajax({
            type: "Post",
            url: "/Api/UserApi/getUserRnameCertToSystem",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                layer.alert(data.msg, function (lx) {
                    layer.close(lx);
                });
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    $(document).on('click', '.viewCertImg', function () {
        var img = $(this).attr('data-img');
        var uname = $(this).attr('data-uname');
        tipsLayer = layer.confirm('郑重提示：根据相关法律法规，查看的认证图仅用于核实当事人真实性，切不可随意将图片转发、传播、滥用，甚至用于人身攻击、侮辱、诋毁以及非法使用，否则以此引发的所有后果由您负责！', {
            btn: ['我已知晓，保证不滥用', '关闭'] //按钮
        }, function () {
            layer.close(tipsLayer);
            layer.photos({
                photos: {
                    "title": uname + "的认证图",
                    "start": 0,
                    "data": [
                        {
                            "alt": uname + "的认证图片",
                            "pid": 0,
                            "src": img,
                        }
                    ]
                },
                footer: false //是否显示底部栏
            });
        }, function () {
        });

    });
    $(document).on('click', '.reputBtn', function () {
        var idCardNo = $(this).attr('data-idCardNo')
        var name = $(this).attr('data-name')
        var mobile = $(this).attr('data-mobile')
        var userId = $(this).attr('data-userId')
        layer.confirm('是否确认重新发起这条签约？', {
            btn: ['确定', '关闭'] //按钮
        }, function () {

            var strparameter = {
                idCardNo,
                name,
                userId,
                mobile,
            }
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/api/SignContract/CreateContract",
                data: JSON.stringify(strparameter),
                contentType: 'application/json',
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () {
                    layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                    });
                },
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
        }, function () {
        });
    })

    form.on('submit(saveSettingBtn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/api/SignContract/SaveSignConfig",
            contentType: "application/json",
            data: strparameter,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                });
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                    layer.close(addUserLayerIndex);
                    layer.close(settLayer);
                    reloadOrderList();

                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

    $(document).on('click', '.saveSettingBtn', function () {
        var isValid = form.validate('#popform');
        if (!isValid) {
            return false
        }

        layer.confirm('请确认信息是否正确再发起，若信息不对请撤销签约重新发起！', {
            btn: ['确定', '关闭'] //按钮
        }, function () {
            var strparameter = form.val('popform');
            if (!re) {
                return false;
            }
            re = false;
            strparameter.userId = $('.addTeammateName').attr('userid')
            $.ajax({
                type: "Post",
                url: "/api/SignContract/CreateContract",
                data: JSON.stringify(strparameter),
                contentType: 'application/json',
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () {
                    layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                    });
                },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 1500 }, function () {
                        if (data.code > 0) {
                            layer.close(settLayer);
                            layer.close(addUserLayerIndex);
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
        }, function () {
        });

    });
});