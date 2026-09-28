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
    if (devices.android===true|| devices.ios===true) {
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
        var seachParam = 'sdate=' + $("#sDate").val() + '&edate=' + $("#eDate").val();
        var indexLoad;
        var re = true; 
    var page = 1; 
    var settLayer;
    var tipsLayer;
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/UserAjax/GetUserRnameCertLogList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 }
                , {
                    field: 'str1', title: '系统用户名称', width: 150, align: 'center', unresize: false, sort: false
                }
                , {
                    field: 'str2', title: '真实姓名', width: 120, align: 'center', unresize: false
                }
                , {
                    field: 'str3', title: '身份证号', width: 130, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span title="不予完整展示，完整证件号请进入系统用户/用户管理，编辑子账号资料里查看">'+res.str3+'</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str8', title: '性别', width: 60, align: 'center', unresize: true
                }
                , {
                    field: 'id3', title: '年龄', width: 60, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span class="">' + res.id3 + '</span>';
                        if (res.id3 < 18 || res.id3>45) {
                            vo = '<span style="color:#ff5722" lay-tips="年龄异常，请谨慎录用">' + res.id3 + '</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'id5', title: '认证方式', width: 75, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span class="layui-badge layui-bg-orange">人脸加强</span>';
                        if (res.id5 == 1) {
                            vo = '<span class="layui-badge layui-bg-green">基础认证</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'id2', title: '认证结果', width: 100, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span class="layui-badge">未通过认证</span>';
                        if (res.id2 == 2) {
                            vo = '<span class="layui-badge layui-bg-green">通过认证</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'str4', title: '申请时间', width: 130, align: 'center', unresize: false, sort: false, templet: function (res) { 
                        let vo = '<span>' + res.str4 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str5', title: '认证时间', width: 130, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.str5 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str6', title: '认证图片', width: 90, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" style="color:#31bdec" title="认证图片只保存1年" class="viewCertImg" data-img="' + res.str6 + '" data-uname="'+res.str1+'">点击查看</a>';
                        return vo;
                    }
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
                case 'settingBtn':
                    settLayer=layer.open({
                        title: "实名认证相关设置",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 3,
                        area: [isPc?'620px':'90%', '480px'],
                        content: $('.settingDiv')
                    });
                    break;
                case 'buyBtn':
                    let jdpbuykey = $('#jdpbuykey').val();
                    if (jdpbuykey<1) {
                        layer.alert('此系统还没有绑定平台个人账号，无法购买。请进入“系统维护-->系统各项设置管理”菜单中，绑定一个平台个人账号再刷新此页面购买', function (lx) {
                            layer.close(lx);
                            return false;
                        });
                        return false;
                    }
                    util.openWin({
                        url: '/PlatformRedirect/buy/BuyRnameCertPackge?u=' + jdpbuykey
                        })
                    break; 
            };
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1;
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            var uid = formSelects.value('userList', 'valStr');
            var userRole = formSelects.value('jobRole', 'valStr');
            var key1 = $("#key1").val();
            var status = $("#certStatus").val();
            var key2 = $("#key2").val();
            var key3 = $("#key3").val();
            seachParam = 'sdate=' + $("#sDate").val() + '&edate=' + $("#eDate").val() + '&status=' + status + '&key1=' + key1 + '&key2=' + key2 + '&key3=' + key3;
            tableList.reload({
                url: '/UserAjax/GetUserRnameCertLogList?' + seachParam
                , where: { 
                }
                 , page: {
                     curr: page
                 }
            });
            return false;
    } 
    $(document).on('click', '.viewCertImg', function () {  
        var img = $(this).attr('data-img');
        var uname = $(this).attr('data-uname');
        tipsLayer=layer.confirm('郑重提示：根据相关法律法规，查看的认证图仅用于核实当事人真实性，切不可随意将图片转发、传播、滥用，甚至用于人身攻击、侮辱、诋毁以及非法使用，否则以此引发的所有后果由您负责！', {
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
        form.on('submit(saveSettingBtn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SaveCertSetting",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                    layer.close(settLayer);
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