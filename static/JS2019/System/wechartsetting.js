layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        upload = layui.upload;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }   
        var table = layui.table;
        var re = true; 
        var indexLoad;
        var seachParam = '';
        var page = 1;
        var tableList = table.render({
            elem: '#tableList'
               , height: 'full-280'
               , cellMinWidth: 150
               , url: '/SystemAjax/GetWeChatCustomerList?' + seachParam
               , defaultToolbar: []
               , toolbar: '#toolbarDemo'
               , defaultToolbar: ['filter']
               , cols: [[
                   {
                       field: 'moblie', title: '绑定手机号',  align: 'left', unresize: true, templet: function (res) {
                           let vo = '<a href="javascript:void(0);" class="" title="' + res.moblie + '">' + res.moblie + '</a>';
                           return vo;
                       }
                   }
                   , {
                       field: 'bindTime', title: '绑定时间', width: 200, align: 'left', sort: false, unresize: true, templet: function (res) {
                           let vo = '<a href="javascript:void(0);" style="" title="' + res.bindTime + '">' + res.bindTime + '</a>';
                           return vo;
                       }
                   } 
                   , { fixed: '', title: '操作', width: 230, toolbar: '#baroperating', unresize: true, }
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
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data;
            if (obj.event === 'submitDel') {
                var id = obj.data.wechatId;
                delWeChat(id);
            } else if (obj.event === 'submitEdit') {
                var id = obj.data.wechatId;
                var moblie = obj.data.moblie;
                changeBind(id, moblie);
                return false;
            }
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
                url: '/SystemAjax/GetWeChatCustomerList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
        var layerWindows;
        function changeBind(id, moblie) {
            form.val("form", {
                "nowMoblie": moblie
                , "wechatId": id
            });
            layerWindows = layer.open({
                title: '换绑手机号',
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', 180],
                content: $('.change')
            });
            return false;
        }
        function delWeChat(id) {
            layer.confirm('真的删除吗？删除后该用户在微信里查看进度需要重新绑定', function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/WeChatUnBind",
                    data: { wechatId: id },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            reloadOrderList();
                            layer.msg(data.msg, { time: 1000 }, function () {
                                layer.close(index);
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
            });
            return false;
        }
        form.on('submit(saveSetbtn)', function (data) {
            var wechatId = data.field.wechatId;
            var moblie = data.field.newMoblie;
            if (wechatId == "" || wechatId == undefined || wechatId == null) {
                layer.msg('请刷新页面再试下');
                return false;
            }
            if (moblie == "" || moblie == undefined || moblie == null) {
                layer.msg('请输入新的手机号');
                return false;
            }
            if (!VerifyMoblie(moblie)) {
                layer.msg('换绑的手机号格式不正确');
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/WeChatChangeBind",
                data: { wechatId: wechatId, moblie: moblie },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(layerWindows);
                    if (data.code > 0) {
                        reloadOrderList();
                    }
                    layer.msg(data.msg, { time: 1500 }, function () {
                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });
        var uploadInst = upload.render({
            elem: '#upbtn'
            , accept: 'file'
            , exts: 'txt'
          , url: '/CommonPermissionAjax/UploadSingleTxtToRoot'
          , before: function (obj) {
              indexLoad = layer.load(1, { shade: false });
          }
          , done: function (res) {
              layer.close(indexLoad);
              if (res.code > 0) {
                  layer.msg('上传成功', { time: 1000 }, function () {
                      $("#uploadUrl").val(res.msg);
                      $("#upbtn").text('上传成功');
                  });
              } else {
                  layer.msg(res.msg, { time: 1000 }, function () {
                      $("#uploadUrl").val('');
                      $("#upbtn").text('上传失败，请重新上传'); 
                  });
              }
          }
          , error: function () {
              layer.close(indexLoad);
              $("#uploadUrl").val('');
              $("#upbtn").text('上传失败，请重新上传');
          }
        }); 
        form.on('submit(savebtn)', function (data) {
            var strparameter = JSON.stringify(data.field);
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/WeChatSetting",
                data: { param: strparameter },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) { 
                    layer.msg(data.msg, { time: 2000 }, function () { 
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