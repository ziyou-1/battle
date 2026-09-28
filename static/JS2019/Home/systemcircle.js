layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form','carousel'], function () {
    var $ = layui.$;
    var form = layui.form;
    var carousel = layui.carousel;
    var index = layui.index;
    var devices = layui.device();
    var ie = devices.ie;
    var ok = true;
    var layerIndex;
    var indexLoad;
    var gameName = '全部游戏';// $("#defineGame").val();
    var viewType = "";
    getData(true); 
    $(document).on('click', '.sgame', function () {
        var g = $(this).attr('data-game');
        gameName = g;
        $(".activeGame").html(g); 
        $(".t1").addClass('layui-this');
        $(".t2").removeClass('layui-this');
        getData(true); 
    });
    $(document).on('click', '.viewType', function () {
        var g = $(this).attr('data-type');
        viewType = g;
        $(".activeViewType").html(g == "20" ? "只看接的" : g == "10" ? "只看发的" : "查看全部");
        $(".t2").addClass('layui-this');
        $(".t1").removeClass('layui-this');
        getData(true); 
    }); 
    $(document).on('click', '.releBtn', function () {
        layerIndex = layer.open({
            title: "发布圈子业务消息",
            shade: [0.3, '#333'],
            shadeClose: false,
            maxmin: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['80%', '600px'],
            content: $(".sendLyaer")
        });
    });
    form.on('submit(subBtn)', function (data) {
        if (data.field.inputContent == "" || data.field.inputContent == undefined) {
            layer.msg('要发布的内容不能为空');
            return false;
        }
        if (data.field.inputContent.length > 250) {
            layer.msg('要发布的内容长度不能超过250个字符');
            return false;
        }
        if (data.field.concantwechat == "" || data.field.concantwechat == undefined) {
            layer.msg('请务必填写一个你们家的联系微信号，若被举报是空号或虚假不存在，将可能导致你家系统不能再使用该功能', { time: 5500 });
            return false;
        }
        if (data.field.concantqq == "" || data.field.concantqq == undefined) {
            layer.msg('请务必填写一个你们家的联系QQ号，若被举报是空号或虚假不存在，将可能导致你家系统不能再使用该功能', { time: 5500 });
            return false;
        }
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/Home/SystemCircleRelease",
            data: { gameName: gameName, content: data.field.inputContent, wechat: data.field.concantwechat, qq: data.field.concantqq, beg: data.field.beg, topHour: data.field.tops },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                layer.alert(data.msg, function (reindex) {
                    layer.close(reindex);
                    if (data.code > 0) {
                        $('#tops').val('0');
                        form.render('select');
                        layer.close(layerIndex);
                    }
                    // location.reload();
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function getData(ref) {
        $.ajax({
            type: "Post",
            url: "/Home/SystemCircleGetList",
            data: { gameName: gameName, viewType: viewType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取圈子列表错误！'); },
            beforeSend: function (XMLHttpRequest) {
                if (ref) {
                    indexLoad = layer.load(1, { shade: false });
                }
            },
            success: function (data) {
                let html = '';
                if (data.code > 0) {
                    let d = JSON.parse(data.data);
                    //console.log(d);
                    let topList = d.topList;
                    let normalList = d.normalList;
                    $("#topMsg").show();
                    if (topList.length > 0) {
                        var groupedArray = group(topList, 3);
                        for (let i = 0; i < groupedArray.length; i++) {
                            let glistData = groupedArray[i];
                            let divhtml = '';
                            for (let j = 0; j < glistData.length; j++) {
                                let item = glistData[j];
                                let toufont = item.releaseSystemName.substring(0, 1);
                                let tops = '<span class="layui-badge layui-bg-red">顶</span> ';
                                let rec = '<span class="layui-badge layui-bg-blue">接</span>';
                                let throws = '<span class="layui-badge layui-bg-orange">发</span>';
                                let sm = '<span class="" style="color:#16b777">' + item.gameName + '</span>';                               

                                divhtml += '<div class="con"><div class="con_head"><div class="lt"><div class="tou">' + toufont + '</div><div class="head">'
                                    + '<div class="company"><a href="javascript::" class="showconcat" title="点击可查看联系方式" data-beg="' + item.begissuance + '" data-content="' + item.content + '" data-company="' + item.releaseSystemName + '" data-wechat="' + item.wechat + '" data-qq="' + item.qq + '">' + item.releaseSystemName + '</a></div><div class="tipslayer">' + sm + '</div></div></div>'
                                    + '<span class="releaseTime">' + item.createTime + '</span></div>'
                                    + '<div class="con_cont">' + tops + (item.begissuance == 1 ? throws : rec) + ' ' + item.content + '</div></div>';

                            }
                            html += '<div>' + divhtml + '</div>';
                        }
                        $(".topsList").html(html);
                        carousel.render({
                            elem: '#topMsg'
                            , width: '99%'
                            , height: topList.length < 2 ? '130px' : topList.length < 3 ? '230px' : '330px'
                            , anim: 'updown'
                            , arrow: 'none'
                            , indicator: 'none'
                            , interval: 3000
                        });
                    }
                    else {
                        carousel.render({
                            elem: '#topMsg'
                            , width: '99%'
                            , height: '1px'
                            , anim: 'updown'
                            , arrow: 'none'
                            , indicator: 'none'
                            , interval: 3000
                        });
                        $(".topsList").html('');
                    }

                    if (normalList.length > 0) {
                        html = '';
                        for (let i = 0; i < normalList.length; i++) {
                            let item = normalList[i];
                            let toufont = item.releaseSystemName.substring(0, 1);
                            let rec = '<span class="layui-badge layui-bg-blue">接</span>';
                            let throws = '<span class="layui-badge layui-bg-orange">发</span>';
                            let sm = '<span class="" style="color:#16b777">' + item.gameName + '</span>';               

                            html += '<div class="con"><div class="con_head"><div class="lt"><div class="tou">' + toufont + '</div><div class="head">'
                                + '<div class="company"><a href="javascript::" class="showconcat" title="点击可查看联系方式" data-beg="' + item.begissuance + '" data-content="' + item.content + '" data-company="' + item.releaseSystemName + '" data-wechat="' + item.wechat + '" data-qq="' + item.qq + '">' + item.releaseSystemName + '</a></div><div class="tipslayer">' + sm + '</div></div></div>'
                                + '<span class="releaseTime">' + item.createTime + '</span></div>'
                                + '<div class="con_cont">' + (item.begissuance == 1 ? throws : rec) + ' ' + item.content + '</div></div>';
                        }
                        $(".normalList").html(html);
                    }
                    else {
                        $(".normalList").html('');
                    }
                }
                else {
                    carousel.render({
                        elem: '#topMsg'
                        , width: '99%'
                        , height: '1px'
                        , anim: 'updown'
                        , arrow: 'none'
                        , indicator: 'none'
                        , interval: 3000
                    });
                    $(".topsList").html('');
                    $(".normalList").html(''); 
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    } 
    $(document).on('click', '.showconcat', function () {
        var company = $(this).attr('data-company');
        var wechat = $(this).attr('data-wechat');
        var qq = $(this).attr('data-qq');
        var content = $(this).attr('data-content');
        var beg = $(this).attr('data-beg');
        layer.open({
            title: company
            , content: '<p style="color: #2F4056;font-weight: 600;font-size: 14px;">' + (beg == 1 ? "发：" : "接：") + content + '</p><p style="color:#5FB878;margin-top: 20px;line-height: 40px;">微信：' + wechat + '</p><p style="color:#5FB878;line-height: 40px;">' + 'QQ号：' + (VerifyInt(qq) ? '<a target="_blank" href="https://wpa.qq.com/msgrd?v=3&uin=' + qq + '&site=qq&menu=yes" class="qq-btn">' + qq + '<img border="0" src="https://pub.idqqimg.com/qconn/wpa/button/button_111.gif" alt="点击这里给我发消息" title="点击这里给我发消息" /></a>' : qq)+ '</p>'
        }); 
    });
    $(document).on('click', '.mylist', function () {
        getMyData();
    });
    $(document).on('click', '.ref', function () {
        var cid = $(this).attr('data-cid'); 
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/Home/SystemCircleRePushItem",
            data: { cid: cid},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                layer.alert(data.msg, function (reindex) {
                    layer.close(reindex);
                    if (data.code > 0) {
                        getMyData();
                    } 
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    $(document).on('click', '.del', function () {
        var cid = $(this).attr('data-cid');
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/Home/SystemCircleDelItem",
            data: { cid: cid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                layer.alert(data.msg, function (reindex) {
                    layer.close(reindex);
                    if (data.code > 0) {
                        getMyData();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function getMyData() {
        $.ajax({
            type: "Post",
            url: "/Home/SystemCircleGetMyReleseaList",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取我发布的圈子列表错误！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                let html = '';
                $(".topsList").html('');
                $(".normalList").html('');
                if (data.code > 0) {
                    let d = JSON.parse(data.data); 
                    $("#topMsg").hide();
                    if (d.length > 0) {
                        for (let i = 0; i < d.length; i++) {
                            let item = d[i];
                            let toufont = item.releaseSystemName.substring(0, 1);
                            let rec = '<span class="layui-badge layui-bg-blue">接</span>';
                            let throws = '<span class="layui-badge layui-bg-orange">抛</span>';
                            let sm = '';
                            if (item.isVerified == 'Y') {
                                sm = '<span class="layui-icon layui-icon-auz icon_verified">已实名</span>';
                            }

                            html += '<div class="con"><div class="con_head"><div class="lt"><div class="tou">' + toufont + '</div><div class="head">'
                                + '<div class="company"><a href="javascript::" class="showconcat" title="点击可查看联系方式" data-beg="' + item.begissuance + '" data-content="' + item.content + '" data-company="' + item.releaseSystemName + '" data-wechat="' + item.wechat + '" data-qq="' + item.qq + '">' + item.releaseSystemName + '</a></div><div class="tipslayer">' + sm + '</div></div></div>'
                                + '<span class="releaseTime">' + item.createTime + '</span></div>'
                                + '<div class="con_cont_my">' + (item.begissuance == 1 ? throws : rec) + '&nbsp;' + item.content + '</div>'
                                + '<div class="con_cont_btn_layer"><a href="javascript::" class="layui-btn layui-btn-xs layui-btn-normal ref" data-cid="' + item.cid + '" title="将该条消息重发一次">重发</a><a href="javascript::" class="layui-btn layui-btn-xs layui-btn-danger del" data-cid="' + item.cid + '" title="将该条消息删除">删除</a></div></div > ';
                        }
                        $(".normalList").html(html);
                    }
                    else {
                        $(".normalList").html('');
                    }
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    var ref;
    ref = setInterval(function () {
        getData(false);
    }, 1000 * 60 * 1);
    
});