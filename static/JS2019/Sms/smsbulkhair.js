layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'upload','element'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
    var element = layui.element;
    // 本地版不加载原平台 OSS 手机背景，避免跨域资源被浏览器拦截。
    $('.phone_mode').css({
        backgroundImage: 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 18%, #ffffff 100%)',
        border: '8px solid #20242b',
        borderRadius: '34px',
        boxShadow: '0 8px 24px rgba(0,0,0,.18)',
        boxSizing: 'border-box'
    });
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var upload = layui.upload;
        var re = true; 
    var indexLoad;  
    var seachData = 0;
        laydate.render({
            elem: '#sDate'
            , type: 'datetime'
        });
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        });

        upload.render({
            elem: '#uptxt'
          , url: '/SmsAjax/UploadMoblieTxt'
          , accept: 'file'
          ,acceptMime: 'file/txt'
          , size: 5120
          , exts: 'txt'
          , done: function (res) {
              if (res.code < 1) {
                  layer.msg(res.msg);
              }
              else {
                  importMoblieCount = res.code;
                  $('.importMoblie').html('已成功导入了' + res.code + '个手机号');
                  $("#moblieCount").val(res.code);
              }
          }
        });

        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val();
        var gameName = $("#gameName").val();
        form.on('select(selectGame)', function (data) { 
            gameName = $("#gameName").val(); 
            getCustomerService();
            getData();
            return false;
        });

        getAllOrderSoure()
        getCustomerService();

    //getData();
    $('.phone_time').text(getCurrentTime())
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const currentTime = getCurrentTime(); 
    element.on('tab(changeSoure)', function (data) {
        if (data.id == 20) {
            seachData = 0;
            $(".remark").html('请点击搜索按钮');
        }
    });
        function getCustomerService() {
               var soureData = [];
            $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
                soureData = result.data;

                formSelects.data('inputOrderKefu', 'local', {
                    arr: soureData
                });
            });
        }
        function getAllOrderSoure() {
            var soureData = [];
            $.get('/SystemAjax/GetOrderSoureList', function (result) {
                soureData = result.data;
                formSelects.data('orderSoures', 'local', {
                    arr: soureData
                });
            });
        }
      
        $("#sendSms0").bind('input propertychange', function () { 
            var moblieCount = $("#moblieCount").val();
            var strLength = $("#sendSms0").val().length;
            var smsCount = Math.ceil(strLength / 64);
            $(".phone_text").html("【前缀签名】" + $("#sendSms0").val());
            $('.zishu0').html('共计'+strLength + '个字符，每个手机号码按' + smsCount + '条计数，共计需要发送' + (moblieCount * smsCount) + "条短信");
        }); 
        form.on('submit(seachBtn)', function (data) {
            getData();
            return false;
        });
        function getData() {
            gameName = $("#gameName").val();
            var orderSta = formSelects.value('orderSta', 'valStr');
            var customerServiceUserName = formSelects.value('inputOrderKefu', 'nameStr');
            var orderSoure = formSelects.value('orderSoures', 'valStr');
            var stime = $("#sDate").val(); 
            var etime = $("#eDate").val();
            var key1 =  $("#key1").val();
            var key2 = $("#key2").val();
            var key3 = $("#key3").val();
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SmsAjax/GetSmsBulkHairMoblieCount",
                data: { gameName: gameName, orderSta: orderSta, customerServiceUserName: customerServiceUserName, orderSoure: orderSoure, stime: stime, etime: etime, key1: key1, key2: key2, key3: key3 },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求数据出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    $("#moblieCount").val(data.code);
                    $(".remark").html('已从系统订单中搜索到' + data.code + '个有效手机号');
                    re = true;
                    seachData = data.code;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }

        form.on('submit(sendBtn)', function (data) {
            var sendSmsContent = data.field.sendSms0;
            if ($('.phone_tab .layui-this').index() == 0) {
                soure = 10
            } else if ($('.phone_tab .layui-this').index() == 1) {
                soure = 20
            }
            if (soure == 10 && seachData == 0) {
                layer.msg('请点击搜索按钮，搜索出要发送的手机');
                return false;
            }
            //console.log(soure);
            if (soure == undefined || soure == null || soure == '') {
                layer.msg('请选择要发送的手机号来源');
                return false;
            }
            if (!sendSmsContent) {
                layer.msg('请输入要群发的短信内容');
                return false;
            }
            gameName = $("#gameName").val();
            var orderSta = formSelects.value('orderSta', 'valStr');
            var customerServiceUserName = formSelects.value('inputOrderKefu', 'nameStr');
            var orderSoure = formSelects.value('orderSoures', 'valStr');
            var stime = $("#sDate").val();
            var etime = $("#eDate").val();
            var key1 = $("#key1").val();
            var key2 = $("#key2").val();
            var key3 = $("#key3").val();
            var soureStr = soure == 20 ? '从TXT文件导入' : '从系统订单搜索';
            layer.confirm('注意：您选的是从【' + soureStr +'】里群发短信。请求提交后，可能会有几秒到几十秒的延迟等待，若出现系统繁忙的提示属正常，请在5-20分钟后查看短信发送记录', function (index) { 
                if (!re) {
                    return false;
                }
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/SystemAjax/QSendSms",
                    data: { gameName: gameName, orderSta: orderSta, customerServiceUserName: customerServiceUserName, orderSoure: orderSoure, stime: stime, etime: etime, key1: key1, key2: key2, key3: key3, smsContent: sendSmsContent, soure: soure },
                    dataType: 'json',
                    cache: false,
                    timeout: 600000,
                    error: function () { layer.msg('请求数据出错！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        layer.msg(data.msg);
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            });
            return false;
        });

});
