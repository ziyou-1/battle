layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util;
        pinyin = layui.pinyin;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var re = true;
    var indexLoad; 
    var charList = ['全部', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var carchart='全部';

    $(document).ready(function () {
        var str = "";
        charList.forEach(function (item, index) {
            str += "<span class='item'>" + item + "</span>";
        })

        $(".charViewboxs").append(str);
        $(".charViewboxs .item").eq(0).addClass('active');
        $(".charViewboxs .item").on('click', function (e) {            
            $(".charViewboxs .item").removeClass('active');
            $(this).addClass('active');
            carchart = $(this).text();
            initselgames()
        });

    })
    form.on('select(seachGame)', function (data) {
        var value = data.value; 
        $('.layui-inline .layui-form-radio div').removeClass('sel');
        $('.layui-inline .layui-form-radio div').removeClass('sel2');
        var arrs = $('.layui-inline input[name="games"]');
        var newarrs = Array.prototype.slice.call(arrs);
        newarrs.forEach(function (item, index) {
            if ($(item).data('name') == value) {
                $('.layui-inline .layui-form-radio div').eq(index).addClass('sel2'); 
                layer.msg('已找到，请注意下方红色字体');
            }
        })
    });
    function initselgames() {
        $('.layui-inline .layui-form-radio div').removeClass('sel');
        $('.layui-inline .layui-form-radio div').removeClass('sel2');
      /*  var arrs = $('.layui-inline .layui-form-radio div');*/
        var arrs = $('.layui-inline input[name="games"]');
        var newarrs = Array.prototype.slice.call(arrs);
        newarrs.forEach(function (item, index) {
            if ($(item).data('firstkey') == carchart) {
                $('.layui-inline .layui-form-radio div').eq(index).addClass('sel');
            }
        })
    }

    form.on('submit(savebtn)', function (data) {
        var gameName="";
        var isPw = "N";
        var isMoblie = 10;
        $('input[name="games"]:checked').each(function () {
            gameName = $(this).val();
            isPw = $(this).attr('data-isPw');
            isMoblie = $(this).attr('data-isMoblie'); 
        });
         
        if (gameName == null || gameName == undefined || gameName == '') {
            layer.msg('请选择要添加的游戏', { time: 1500 }, function () {
            });
            return false;
        } 

        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAjax/AddEditGame",
            data: { gameName: gameName, isMoblieGame: isMoblie==20?"Y":"N", isPw: isPw },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.alert(data.msg + '，请到系统用户/用户管理列表，点击列表头部的“更改游戏权限”按钮设定系统用户的游戏权限，否则将无法看到新添加的游戏', function () {
                        parent.tools.reloadOrderData();
                    });
                }
                else {
                    re = true;
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
});
