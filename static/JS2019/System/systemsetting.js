layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'element', 'layedit', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        element = layui.element,
        util = layui.util;
    var table = layui.table;
    var layedit = layui.layedit;
    var editIndex;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var layid = location.hash.replace(/^#tags=/, '');
    element.tabChange('tags', layid);
    element.on('tab(tags)', function (elem) {
        location.hash = 'tags=' + $(this).attr('lay-id');
    });
    $(document).on('click', '.regacc', function () {
        var company = $("#company").val();
        layer.open({
            title: "注册平台账号",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: ['90%', '500px'],
            content: '/PlatformRedirect/reg?wk=' + company
        });
        return false;
    })
    console.log($('#jid').val() )
    if ($('#jid').val() > 0) {
        $('.binddiv').hide()
        $('.bindsuccessdiv').show()
    } else {
        $('.binddiv').show()
        $('.bindsuccessdiv').hide()
    }
    form.on('submit(save1btn)', function (data) {
        var acc = data.field.jdpAcc;
        var pwd = data.field.pwd;
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/VeryJdpAcc",
            data: { acc: acc, pwd: pwd },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.alert("<span style='color:#5FB878'>绑定成功，请按下F5键刷新！</span><br/>您已成功将本系统绑定了平台个人账号" + acc, function (lx) {
                        layer.close(lx);
                        window.parent.location.reload()
                    });
                } else {
                    layer.alert("<span style='color:red'>个人账号验证失败！</span><br/><span style='color:#FF5722'>请注意：这里绑定的是您的平台个人账号，不是系统子账号。</span><br/>如果您曾经使用过平台APP/小程序/个人用户中心，就是登录那里的账号和密码<br/>若您注册过但密码不对，可以点击密码输入框下面的链接找回密", function (lx) {
                        layer.close(lx);
                    });
                }
               
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(save2btn)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (strparameter == null || strparameter == "" || strparameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        }
        saveSetting(strparameter);
        return false;
    });
    $(document).on('click', '.findpwd', function () {
        var company = $("#company").val();
        layer.open({
            title: "找回平台密码",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '65%' : '90%', '500px'],
            content: '/PlatformRedirect/login/findLoginPwd'
        });
        return false;
    })
    function saveSetting(strparameter) {
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SystemOrderSetting",
            data: { param: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    location.reload(true);
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('submit(clearBindbtn)', function (data) {
        layer.confirm('确认清除与平台账号的绑定吗？提示：清除后，本系统的短信、淘宝服务、在线结算等均无法使用', function (index) {
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/ClearSystemJdpBind",
                data: {},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    layer.msg(data.msg, { time: 1000 }, function () {
                        window.parent.location.reload()
                    })
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
        return false;
    });
    var tableList = table.render({
        elem: '#tableList'
        , height: 'full'
        , url: '/SystemAjax/GetPublicSeachOrderQuestionMList'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'SeachQuestion_Title', title: '标题', width: isPc ? '30%' : 300, align: 'left', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" class="brower" data-id="' + res.SeachQuestion_Id + '" data-name="' + res.SeachQuestion_Title + '" style="color:#1E9FFF" title="点击浏览内容">' + res.SeachQuestion_Title + '</a>';
                    return vo;
                }
            }
            , {
                field: 'Hot', title: '热度(越大排越前)', width: isPc ? '20%' : 240, align: 'center', edit: true, sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0);" style="" class="edithot" data-id="' + res.SeachQuestion_Id + '" title="' + res.Hot + '">' + res.Hot + '</a>';
                    return vo;
                }
            }
            , {
                field: 'Status', title: '是否需要显示出来', width: isPc ? '12%' : 150, align: 'center', unresize: false, templet: '#switchTp'
            }
            , {
                field: 'createTimeStr', title: '发布时间', width: isPc ? '12%' : 150, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width: isPc ? '12%' : 150, toolbar: '#baroperating', unresize: true, }
        ]]
        , page: false
        , limit: 10
        , limits: [10]
        , done: function (res, curr, count) {
            page = curr;
            if (res.msg != '') {
                layer.msg(res.msg);
            }
        }
    });
    function reloadOrderList() {
        tableList.reload({
            url: '/SystemAjax/GetPublicSeachOrderQuestionMList'
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    table.on('edit(tableList)', function (obj) {
        if (obj.field == "Hot") {
            if (!VerifyInt(obj.value)) {
                layer.msg('热度数字格式不正确，请重新编辑，此次编辑无效', { time: 1500 }, function () {
                });
                return false;
            }
            changeHot(obj.data.SeachQuestion_Id, obj.value);
        }
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addBtn':
                addQuestion(0);
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitDel') {
            var id = obj.data.SeachQuestion_Id;
            delquestion(id);
        } else if (obj.event === 'editDel') {
            var id = obj.data.SeachQuestion_Id;
            addQuestion(id);
            return false;
        }
    });
    form.on('switch(isNeedViewChecked)', function (obj) {
        var sta = obj.elem.checked;
        var id = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ChangePublicSeachOrderQuestionSta",
            data: { qid: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                reloadOrderList();
                layer.msg(data.msg, { time: 1500 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    var layerWindows;
    var qid = 0;
    function addQuestion(id) {
        qid = id;
        layerWindows = layer.open(
            {
                title: id > 0 ? "编辑常见问题" : "新增常见问题",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '95%'],
                content: $('.changequestion'),
                success: function (layero, index) {
                    layedit.set({
                        uploadImage: {
                            url: '/CommonPermissionAjax/UploadSingleImg?ed=0',
                            accept: 'image',
                            acceptMime: 'image/*',
                            exts: 'jpg|png|gif|bmp|jpeg',
                            size: 1024 * 1,
                            success: function (res) {
                                // console.log(res);
                            }
                        }
                        , calldel: {
                            url: '/CommonPermissionAjax/DelSingleImg',
                            done: function (data) {
                            }
                        },
                        backDelImg: false
                        , devmode: false
                        , autoSync: true
                        , codeConfig: {
                            hide: true,
                            default: 'javascript',
                            encode: true
                            , class: 'layui-code'
                        }
                        , facePath: 'http://knifez.gitee.io/kz.layedit/Content/Layui-KnifeZ/'
                        , devmode: true
                        , videoAttr: ' preload="none" '
                        , tool: [
                            'html', 'undo', 'redo', 'code', 'strong', 'italic', 'underline', 'del', 'addhr', '|', 'removeformat', 'fontFomatt', 'fontfamily', 'fontSize', 'fontBackColor', 'colorpicker', 'face'
                            , '|', 'left', 'center', 'right', '|', 'link', 'unlink', 'image_alt', 'anchors'
                            , '|'
                            , 'table', 'customlink'
                            , 'fullScreen', 'preview'
                        ]
                        , height: '500px'
                    });
                    editIndex = layedit.build('LAY_demo_editor');
                }
            });
        if (id > 0) {
            $.ajax({
                type: "GET",
                url: "/SystemAjax/GetPublicSeachOrderQuestionMList",
                data: { qid: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.count > 0) {
                        form.val("sform", {
                            "qtitle": data.data[0].SeachQuestion_Title
                        });
                        layedit.setContent(editIndex, data.data[0].SeachQuestion_Content);
                    }
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        } else {
            form.val("sform", {
                "qtitle": ''
            });
            layedit.setContent(editIndex, '');
        }
        return false;
    }
    form.on('submit(savequestionbtn)', function (data) {
        var title = data.field.qtitle;
        if (title == "" || title == undefined || title == null) {
            layer.msg('请输入标题');
            return false;
        }
        var contentTxt = layedit.getContent(editIndex);
        if (contentTxt == "" || contentTxt == undefined || contentTxt == null) {
            layer.msg('内容不能为空');
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SavePublicSeachOrderQuestion",
            data: { qid: qid, title: title, content: contentTxt },
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
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        form.val("form", {
                            "qtitle": ''
                            , "qid": 0
                        });
                        layedit.setContent(editIndex, '');
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
    function delquestion(id) {
        layer.confirm('确认删除吗？', {
            btn: ['确认', '点错了']
        }, function () {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelPublicSeachOrderQuestion",
                data: { qid: id },
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
            return false;
        }, function () {

        });
        return false;
    }
    function changeHot(id, value) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ChangePublicSeachOrderQuestionHot",
            data: { qid: id, value: value },
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
        return false;
    }
    $(document).on('click', '.changeexp', function () {
        layer.open({
            title: "设置或修改导出订单的密码",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['480px', '380px'],
            content: $(".changeexpwddiv")
        });
        return false;
    })
    $(document).on('click', '.clearPassword', function () {
        $.ajax({
            type: "get",
            url: "/api/UserApi/GetUserInfo",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    if (data.data.Email) {
                        showClearPasswordModal(data.data.Email)
                    } else {
                        showClearPasswordModal()
                    }
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })

    function showClearPasswordModal(userEmail) {
        // 判断邮箱是否存在
        var hasEmail = !!(userEmail && $.trim(userEmail) !== '');

        // 1. 根据变量拼装不同的 HTML 内容
        var contentHtml = '';
        if (!hasEmail) {
            // 未绑定邮箱（上半部分界面）
            contentHtml = `
            <div style="padding: 25px 30px;">
                <h3 style="font-size: 18px; color: #666; font-weight: bold; margin-bottom: 15px;">清空导出密码</h3>
                <hr style="margin-bottom: 20px; border: 0; border-top: 1px solid #eee;">
                
                <p style="color: #ff9900; font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
                    清空导出密码需要绑定并验证邮箱，注意完成此操作将完成邮箱绑定与清除导出密码，请谨慎操作。
                </p>

                <form class="layui-form">
                    <!-- 绑定邮箱输入行 -->
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; flex-shrink: 0;">
                            绑定邮箱
                        </div>
                        <input type="text" id="clear_email_prefix" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                        <div style="width: 110px; margin-left: 10px;">
                            <select id="clear_email_suffix" lay-filter="clearEmailSuffix">
                                <option value="@qq.com">@qq.com</option>
                                <option value="@163.com">@163.com</option>
                            </select>
                        </div>
                    </div>

                    <!-- 验证码输入行 -->
                    <div style="display: flex; align-items: center; margin-bottom: 25px;">
                        <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; flex-shrink: 0;">
                            验证码
                        </div>
                        <input type="text" id="clear_email_code" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                        <button type="button" class="layui-btn layui-btn-normal" id="send-code-btn" style="margin-left: 10px; width: 110px; background-color: #1E9FFF; border-radius: 4px;">
                            获取验证码
                        </button>
                    </div>

                    <!-- 按钮栏 -->
                    <div style="display: flex; justify-content: space-around; gap: 15px; margin-top: 30px;">
                        <button type="button" class="layui-btn layui-btn-normal" id="submit-clear-btn" style="width: 130px; background-color: #1E9FFF; border-radius: 4px;">
                            绑定并清空
                        </button>
                        <button type="button" class="layui-btn layui-btn-primary" id="cancel-clear-btn" style="width: 100px; border-color: #ccc; color: #666; border-radius: 4px;">
                            取消
                        </button>
                    </div>
                </form>
            </div>
        `;
        } else {
            // 已绑定邮箱（下半部分界面）
            contentHtml = `
            <div style="padding: 25px 30px;">
                <h3 style="font-size: 18px; color: #666; font-weight: bold; margin-bottom: 15px;">清空导出密码</h3>
                <hr style="margin-bottom: 25px; border: 0; border-top: 1px solid #eee;">
                
                <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                    为确保账户安全，请先验证身份。
                </p>
                <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
                    绑定邮箱：${userEmail}
                </p>

                <form class="layui-form">
                    <!-- 验证码输入行 -->
                    <div style="display: flex; align-items: center; margin-bottom: 30px;">
                        <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; flex-shrink: 0;">
                            验证码
                        </div>
                        <input type="text" id="clear_email_code" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                        <button type="button" class="layui-btn layui-btn-normal" id="send-code-btn" style="margin-left: 15px; width: 110px; background-color: #1E9FFF; border-radius: 4px;">
                            获取验证码
                        </button>
                    </div>

                    <!-- 按钮栏 -->
                    <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px;">
                        <button type="button" class="layui-btn layui-btn-primary" id="cancel-clear-btn" style="width: 100px; border-color: #ccc; color: #666; border-radius: 4px;">
                            取消
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal" id="submit-clear-btn" style="width: 100px; background-color: #1E9FFF; border-radius: 4px;">
                            确认清空
                        </button>
                    </div>
                </form>
            </div>
        `;
        }

        // 2. 弹出层渲染及事件绑定
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            area: [isPc ? '520px' : '90%', 'auto'],
            shadeClose: false,
            content: contentHtml,
            success: function (layero, index) {
                if (!hasEmail) {
                    layui.form.render('select'); // 渲染下拉框
                }

                var timer = null;
                var countdown = 60;
                $('#send-code-btn').on('click', function () {
                    var emailToSend = userEmail;
                    var SendCodeUrl = ''
                    var SendCodeModel = {}
                    // 若未绑定邮箱，取输入的邮箱前缀与后缀拼接
                    if (!hasEmail) {
                        var prefix = $.trim($('#clear_email_prefix').val());
                        var suffix = $('#clear_email_suffix').val();
                        if (!prefix) {
                            layer.msg('请输入邮箱前缀', { icon: 5 });
                            return;
                        }
                        emailToSend = prefix + suffix;
                        SendCodeUrl = '/api/UserApi/SendEmailCode'
                        SendCodeModel = { Email: emailToSend }
                    } else {
                        SendCodeUrl = '/SystemAjax/SendCode'

                    }

                    var $btn = $(this);
                    $btn.attr('disabled', true).addClass('layui-btn-disabled');

                    $.ajax({
                        type: "POST",
                        url: SendCodeUrl,
                        data: SendCodeModel,
                        dataType: 'json',
                        beforeSend: function () {
                            indexLoad = layer.load(1, { shade: false });
                        },
                        complete: function () {
                            layer.close(indexLoad);
                        },
                        success: function (res) {
                            if (res.code>0) {
                                layer.msg('验证码已发送');
                                var curTime = countdown;
                                $btn.text(curTime + 's后重发');
                                timer = setInterval(function () {
                                    curTime--;
                                    if (curTime <= 0) {
                                        clearInterval(timer);
                                        $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                                    } else {
                                        $btn.text(curTime + 's后重发');
                                    }
                                }, 1000);
                            } else {
                                layer.msg(res.msg || '发送失败');
                                $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                            }
                        },
                        error: function () {
                            layer.msg('网络请求异常');
                            $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                        }
                    });
                });

                // 清空密码提交 (POST /SystemAjax/ClearPassword)
                $('#submit-clear-btn').on('click', function () {
                    var code = $.trim($('#clear_email_code').val());
                    var SendCodeUrl = ''
                    if (!code) {
                        layer.msg('请输入验证码', { icon: 5 });
                        return;
                    }

                    var reqData = { code: code };

                    // 如果是新绑定邮箱，把完整邮箱带上提交
                    if (!hasEmail) {
                        var prefix = $.trim($('#clear_email_prefix').val());
                        var suffix = $('#clear_email_suffix').val();
                        if (!prefix) {
                            layer.msg('请输入绑定邮箱', { icon: 5 });
                            return;
                        }
                        reqData.email = prefix + suffix;
                        SendCodeUrl = '/SystemAjax/BindEmailAndClearPwd'
                    } else {
                        SendCodeUrl = '/SystemAjax/ClearPassword'
                    }

                    $.ajax({
                        type: "POST",
                        url: SendCodeUrl,
                        data: reqData,
                        dataType: 'json',
                        beforeSend: function () {
                            indexLoad = layer.load(1, { shade: false });
                        },
                        complete: function () {
                            layer.close(indexLoad);
                        },
                        success: function (res) {
                            if (res.code > 0 || res.success) {
                                layer.msg('导出密码已清空！', { icon: 1, time: 1500 }, function () {
                                    layer.close(index);
                                    location.reload(); 
                                });
                            } else {
                                layer.msg(res.msg || '操作失败');
                            }
                        },
                        error: function () {
                            layer.msg('网络请求异常');
                        }
                    });
                });

                // 取消按钮
                $('#cancel-clear-btn').on('click', function () {
                    layer.close(index);
                });
            }
        });
    }

    $(document).on('click', '.extsavebtn', function () {
        var extorigpwd = $("#extorigpwd").val();
        var extnewpwd = $("#extnewpwd").val();
        var extnewpwd2 = $("#extnewpwd2").val();

        if (extnewpwd == "" || extnewpwd == null) {
            layer.msg('新密码不能为空');
            return false;
        }
        if (extnewpwd2 != extnewpwd) {
            layer.msg('2次新密码不一致');
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveOrderExportPwd",
            data: { orginpwd: extorigpwd, newpwd: extnewpwd2 },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0){
                    data.msg = '修改成功'
                }
                layer.msg(data.msg, { time: 3000 }, function () {
                    if (data.code > 0) {
                        location.reload();
                    }
                })

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    })
});