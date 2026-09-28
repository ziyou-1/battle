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
        var indexLoad;
       
        form.on('submit(savebtn)', function (data) {
            if (data.field.title == "" || data.field.title == undefined) {
                layer.msg('标题不能为空');
                return false;
            }  
            var roleIds = [];
            $('.chengeRole .roleName.selected').each(function (m, n) {
                roleIds.push($(n).attr('roleid'));
            })
            if (roleIds.length < 1) {
                layer.msg('请至少选择一个权限');
                return false;
            }
            var roleId = data.field.roleId;
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/AddEditRole",
                data: { roleId: roleId, roleName: data.field.title, remark: data.field.remark, selectId: roleIds.join(',') },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) { 
                    layer.msg(data.msg, { time: 2000 }, function () {
                        if (data.code > 0) {
                            parent.tools.reloadOrderData();
                        }
                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });

    //权限选择
        $('.chengeRole').on({
            click: function () {
                var $this = $(this);
                if ($this.parents('.columnName').length > 0) {
                    if ($this.hasClass('selected')) {
                        $this.parents('.columnName').next('.sonNav').find('.roleName').removeClass('selected');
                        $this.parents('.columnName').next('.sonNav').slideUp();
                    } else {
                        $this.parents('.columnName').next('.sonNav').slideDown();
                    }
                }
                $this.toggleClass('selected');
            }
        }, '.roleName');
        var menuid = $("#menuId").val();
        GetMenuTree();
        var html = "";
        var IsChecked = "";
        function GetMenuTree() {
            $.ajax({
                type: "Get",
                url: "/SystemAjax/GetUserRole",
                data: { menuId: menuid },
                dataType: 'json',
                cache: false,
                timeout: 600000,
                error: function () { layer.msg('系统繁忙！'); ok = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        (data[i].IsChecked == 1) ? IsChecked = "selected" : IsChecked = "";
                        html += " <li>";
                        html += "  <p class='columnName'><i class='icon-paste'></i><span class='roleName " + IsChecked + "' roleid='" + data[i].Menu_ID + "'>" + data[i].Name + "</span></p>";
                        if (data[i].MenuChildrenList != null) {
                            if (data[i].MenuChildrenList.length > 0) {
                                html += "                                <ul class='sonNav'>";
                                for (var j = 0; j < data[i].MenuChildrenList.length; j++) {
                                    (data[i].MenuChildrenList[j].IsChecked == 1) ? IsChecked = "selected" : IsChecked = "";
                                    html += "                           <li><i class='icon-file'></i><span class='roleName " + IsChecked + "' roleid='" + data[i].MenuChildrenList[j].Menu_ID + "' title='" + data[i].MenuChildrenList[j].Note + "'>" + data[i].MenuChildrenList[j].Name + "<label style='color:#FF5722'>(" + data[i].MenuChildrenList[j].Note + ")</label></span></li>";
                                }
                                html += "                            </ul>";
                            }
                            html += "                        </li>";
                        }
                    }
                    $(".setNav").append(html);
                }
               , complete: function (XMLHttpRequest) {
                   layer.close(indexLoad);
               }
            });
        }
});