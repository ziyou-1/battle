layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
}).use(['index', 'form', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        laydate = layui.laydate;
    var table = layui.table;
    var element = layui.element;
    var devices = layui.device();
    var dropdown = layui.dropdown;

    var isPc = true;
    var seachDebt = false
    var tabValue = 0
    var popValue = true

    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var device = isPc;
    var currentCid = 0;
    var currentBalance = 0;
    var gameData = [];
    var addUserLayerIndex;
    $(document).keydown(function (event) {
        if (event.keyCode == 13 && popValue) {
            page = 1;
            reloadOrderList();
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    });

    var page = 1;
    laydate.render({
        elem: '#sDate'
    });
    laydate.render({
        elem: '#eDate'
    });

    function objectToQueryString(obj) {
        var arr = obj.orderMethod.split('|')
        obj.orderMethod = arr[0]
        obj.orderType = arr[1]
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params.append(key, obj[key]);
            }
        }
        console.log(obj, params.toString())
        return params.toString();

    }
    getActionUserList();
    getMemberLevelList();
    function getActionUserList() {
        $.ajax({
            type: "GET",
            url: "/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=Y&isOnlySelectSelf=N&editUserName=&dy=1",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            //error: function (xhr) { layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                var select = $('#createUserId');
                var gameData1 = data.data
                var str = ''

                gameData1.forEach(function (item) {
                    str += ` <option value="${item.value}">${item.name}</option> `
                });
                select.append(str);

                layui.form.render("select");
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    var searchData = form.val('fm');
    searchData.level = ''
    var tableList = table.render({
        elem: '#tableList'
        , url: '/api/CustomerApi/GetCustomerList?' + objectToQueryString(searchData)
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 50 },
            { field: 'customerNo', title: '会员号', minWidth: 90,  unresize: false, align: 'center' }
            , {
                field: 'bossName', title: '会员名称', minWidth: 90,  unresize: false, align: 'center'
            }
            , {
                field: 'levelName', title: '会员等级', minWidth: 80,  unresize: false, align: 'center', templet: function (res) {
                    if (res.levelColor) {
                        let color = res.levelColor == "#fff" || res.levelColor == "#ffffff" || res.levelColor == "#FFF" || res.levelColor == "#FFFFFF" ? "#aaa;" : res.levelColor;
                        let str = '<span class="layui-badge" style="background:' + color + '" title="' + res.levelName + '，可以到客户维护/会员等级设置中配置">' + res.levelName + '</span>';
                        return str;
                    } else {
                        if (!res.levelName) {
                            let str = '<span class="layui-badge" style="background:#C2C2C2" title="普通会员">普通会员</span>';
                            return str;
                        }
                        return res.levelName;
                    }
                }
            }
            , {
                field: 'phone', title: '电话', minWidth: 86,  unresize: false, align: 'center'
            }
            //, {
            //    field: 'loginAcc', title: '登录账号', minWidth: 80,  unresize: false,
            //}
            , {
                field: 'wxNo', title: '微信号', minWidth: 70, unresize: false, align: 'center'
            }
            , {
                field: 'buyDiscount', title: '折扣', width: 60, unresize: false, align: 'center', templet: function (d) {
                    let vo = '无折扣';
                    if (d.buyDiscount > 0 && d.buyDiscount < 1) {
                        vo = (d.buyDiscount * 10).toFixed(2) + '折';
                    }
                    return '<span>' + vo + '</span>';
                }
            }, {
                field: '', title: '折扣模式', minWidth: 67,  unresize: false, align: 'center', templet: function (d) {
                    let vo = '无折扣';
                    return `<input type="checkbox" name="sta" value="${d.id}" lay-skin="switch"  lay-filter="staChecked" ${d.discountLevelInfluence == 1 ? 'checked' : ''}>
                                   <div lay-checkbox>
                <span lay-tips="如果此处变成绿色代表固定折扣，不会受会员等级影响而变动">固定</span>|<span lay-tips="灰色代表会受会员等级影响而变动">自动</span>
            </div>
                    `
                }
            }
            , {
                field: 'platName', title: '平台', width: 60, unresize: false, align: 'center'
            }, {
                field: 'arrearsNote', title: '欠款备注', minWidth: 80,  unresize: false, templet: function (d) {
                    var str = 'style="color:red"'
                    if (!d.arrearsNote) {
                        d.arrearsNote = '无'
                        str = ''
                    }
                    return `<div class='debtremarks' ${str}  lay-tips='${d.arrearsNote}(单击可以修改内容)' data-id='${d.id}'>${d.arrearsNote}</div>`
                }

            }, {
                field: 'balance', title: '当前余额', minWidth: 60,  sort: true, unresize: false, align: 'center'


            }, {
                field: 'totalConsAmount', title: '总计消费', minWidth: 60, sort: true, unresize: false, align: 'center'
            }, {
                field: 'historRecharge', title: '总计实充', minWidth: 60, sort: true,  unresize: false, align: 'center'
            }
            , {
                field: 'levelGap', title: '距下次升级', width: 70, unresize: false, align: 'center', templet: function (d) {
                    return `<span lay-tips="距离下一次等级（${d.nextLevel == null ? '无' : d.nextLevel}）升级还差${d.levelGap}元" >${d.levelGap}</span>`
                }
            }
            , {
                field: 'servicePerson', title: '服务人员', width: 60, unresize: false, align: 'center'
            }, {
                field: 'createUser', title: '创建人员', minWidth: 60, unresize: false, align: 'center'
            }, {
                field: 'tips', title: '附加信息1', minWidth: 60, unresize: false,
            }, {
                field: 'remark', title: '备注', minWidth: 60, unresize: false, templet: function (d) {
                    var vo = d.remark
                    if (!d.remark) {
                        vo = ''
                    }
                        return '<span lay-tips="' + vo + '">' + vo +'</span>'
                }
            }, {
                field: 'brithDay', title: '会员生日', width: 60, unresize: false, align: 'center', templet: function (d) {
                    let day = ''
                    if (d.brithDay && d.brithDay.length > 0) {
                        let arr = d.brithDay.split("-")
                        if (arr.length > 0) {
                            day = arr[1] + '-' + arr[2]
                        }
                    }
                    return day;
                }
            }, {
                field: 'createTime', title: '创建时间', width: 76, unresize: false, align: 'center', templet: function (d) {
                    if (d.createTime) {
                        const year = d.createTime.slice(0, 4);
                        const month = d.createTime.slice(5, 7);
                        const day = d.createTime.slice(8, 10);
                        const hour = d.createTime.slice(11, 13);
                        const minute = d.createTime.slice(14, 16);
                        return `${month}-${day} ${hour}:${minute}`;
                    } else {
                        return ''
                    }

                }
            }, {
                field: 'createPersonUserNicke', title: '操作', width: 154, unresize: false, templet: '#table_tool'

            },
        ]]
        , page: true
        , limit: 20
        , limits: [50, 100, 150, 200]
        , done: function (res, curr, count) {
            if (res.msg == "请先登录") {
                layer.msg("登录过期了，请重新登录系统");
                return;
            }

            page = curr;
            var total = `本次搜索共计${res.count}个会员，累计可用余额${res.ext && res.ext.totalBalance ? res.ext.totalBalance : 0}元，累计消费${res.ext && res.ext.totalConsumeFee ? res.ext.totalConsumeFee : 0}元`;
            $("#total").html(total);
            $(document).off('click', '.debtremarks');

            $(document).on('click', '.debtremarks', function () {
                var ids = $(this).attr('data-id');
                var test = $(this).text() == '无' ? '' : $(this).text()
                layer.prompt({ title: '修改欠款备注', value: test }, function (value, index, elem) {
                    if (value.length > 250) {
                        layer.msg('最多输入250个字符')
                        return false
                    }
                    $.ajax({
                        type: "Post",
                        url: "/api/CustomerApi/SetArrearsNote",
                        data: { Id: ids, Note: value },
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
                            layer.msg(data.code > 0 ? "修改成功" : data.msg)
                            if (data.code > 0) {
                                reloadOrderList();
                            }
                            re = true;
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(index);
                            layer.close(indexLoad);
                        }
                    });
                });
            })
        }
    });
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        reloadOrderList();
        return false;
    });
    form.on('switch(staChecked)', function (obj) {
        //console.log(re, obj.elem.value)
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/api/CustomerApi/ModiftyDiscountInfluenceMode",
            data: { id: obj.elem.value },
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
                if (data.code <= 0) {
                    reloadOrderList();
                }
                re = true;
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
            case 'reprocess':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].orderId);
                };
                var orderID = tempData.join(',');
                //zpOrder(orderID);
                break;
            case 'delUserBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var cids = tempData.join(',');
                delCustomer(tempData, 0);
                break;
            case 'exportBtn':
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var orderIds = tempData.join(',');
                exportOrder(orderIds);
                break;
            case 'addNewBtn':
                var url = 'CustomerEdit?hid=0';
                addUserLayerIndex = layer.open({
                    title: "新开会员",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 2,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '1200px' : '95%', isPc ? '774px' : '95%'],
                    content: url
                });
                break;
            case 'resetHistoryRecharge':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var orderIds = tempData.join(',');
                var stra = '本操作会重新统计每一个会员在本系统内的充值流水(冲正的除外)，然后记录到会员的累计实充数据里，这将会覆盖之前的累计实充。是否确认继续操作？<span style="color:red">(只对勾选的会员生效)</span>'

                layer.confirm(stra, {
                    btn: ['是', '否'],
                    area: '400px',
                    title: '提示'
                }, function () {
                    $.ajax({
                        type: "Post",
                        data: { Keys: tempData },
                        url: "/api/customerapi/CalculateRecharge",
                        dataType: 'json',
                        timeout: 60000,
                        success: function (data) {
                            if (data.code > 0) {
                                layer.alert('操作成功');
                                reloadOrderList();
                            } else {
                                layer.msg(data.msg)
                            }

                        },
                    });
                });
                break;
            case 'resetConsumer':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var orderIds = tempData.join(',');
                var stra = '本操作会重新统计每一个会员在本系统内的消费(撤销的除外)记录，其中包括成为会员之前的散客订单部分(先是散客后成为会员的)，然后记录到会员的累计消费数据里，这将会覆盖之前的累计消费。是否确认继续操作？<span style="color:red">(只对勾选的会员生效)</span>'
                layer.confirm(stra, {
                    btn: ['是', '否'],
                    area: '400px',
                    title: '提示'
                }, function () {
                    $.ajax({
                        type: "Post",
                        data: { Keys: tempData },
                        url: "/api/customerapi/CalculateConsumer",
                        dataType: 'json',
                        timeout: 60000,
                        success: function (data) {
                            if (data.code > 0) {
                                layer.alert('操作成功');
                                reloadOrderList();
                            } else {
                                layer.msg(data.msg)
                            }
                        },
                    });
                });;
                break;
            case 'chartsBtn':
                layer.open({
                    title: '会员统计排行榜（统计数据缓存一小时）',
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '800px' : '95%', isPc ? '745px' : '95%'],
                    content: `
                    <div style="padding:20px;">
                        <div class="layui-tab" lay-filter="test-hash">
                          <ul class="layui-tab-title">
                            <li class="layui-this" lay-id="11">会员消费排行榜</li>
                            <li lay-id="22">会员实充排行榜</li>
                          </ul>
                        </div>
                          <table class="" id="tableChart" lay-filter="tableChart" style='width: 100%'></table>
                          <script type="text/html" id="toolbartableChart">
                            <div class="layui-btn-container layui-hide">
                                <button class="layui-btn layui-btn-xs" lay-event="chartsBtn" type="button" >表格导出</button>
                            </div>
                            <div style="color:#ff6a00" id="total"></div>
                        </script>
                    </div>
                    `,
                    success: function () {
                        recharge(0)
                    }
                });

        };
    });
    element.on('tab(test-hash)', function (data) {
        if (data.id == 11) {
            tabValue = 0
            recharge(0)
        } else if (data.id == 22) {
            tabValue = 1
            recharge(1)
        }
    });
    function recharge(val) {
        var titleValue = ''
        if (tabValue == 0) {
            titleValue = '累计消费额'
        } else {
            titleValue = '累计实充额'
        }
        var tableChart = table.render({
            elem: '#tableChart'
            , url: '/api/CustomerApi/rechargeRank?type=' + val
            , defaultToolbar: []
            , className: 'tableChartDom'
            , toolbar: '#toolbartableChart'
            , defaultToolbar: ['filter']
            , width: '100%'
            , cols: [[
                {
                    field: 'rankNo', title: '排名', width: 100, unresize: false, align: 'center', templet: function (d) {
                        var vo = '<span>' + d.rankNo + '</span>'
                        if (d.rankNo < 11) {
                            vo = '<span style="color:red">' + d.rankNo + '</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'customerNo', title: '会员号', width: 214, unresize: false, align: 'center', templet: function (d) {
                        var vo = '<span>' + d.customerNo ? d.customerNo : '' + '</span>'
                        if (d.rankNo < 11) {
                            vo = '<span style="color:red">' + d.customerNo ? d.customerNo : '' + '</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'customerName', title: '会员名', width: 214, unresize: false, align: 'center', templet: function (d) {
                        var vo = '<span>' + d.customerName ? d.customerName : '' + '</span>'
                        if (d.rankNo < 11) {
                            vo = '<span style="color:red">' + d.customerName ? d.customerName : '' + '</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'total', title: titleValue, width: 212, unresize: false, align: 'center', templet: function (d) {
                        var vo = '<span>' + d.total + '</span>'
                        if (d.rankNo < 11) {
                            vo = '<span style="color:red">' + d.total + '</span>';
                        }
                        return vo;
                    }
                }
            ]]
            , page: true
            , limit: 2000
            , limits: [2000, 3000, 4000, 5000]
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
            }
        });
    }
    table.on('toolbar(tableChart)', function (obj) {
        switch (obj.event) {
            case 'chartsBtn':
                exportpopOrder();
                break;
        };
    });

    function exportpopOrder() {
        window.open('/Customer/ExportRank?export=1&type=' + tabValue, "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }

    table.on('tool(tableList)', function (obj) {
        var that = this;
        switch (obj.event) {
            case 'edit':
                var id = obj.data.customerNo
                var url = 'CustomerEdit?hid=' + obj.data.id + '&id=' + id;
                addUserLayerIndex = layer.open({
                    title: (obj.data.id > 0 ? "编辑" : "新开") + "会员",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 2,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '1200px' : '95%', isPc ? '774px' : '95%'],
                    content: url
                });
                break;
            case 'recharge':
                var id = obj.data.id
                currentCid = id;
                var balance = obj.data.balance
                currentBalance = balance;
                $(".currentBalanceSpan").html(balance);
                $('input[name=payMethed]').prop('checked', false);
                form.val('fm', {
                    actionBalance: '',
                    giftAmount: '0',
                    corresOrderId: '',
                    baRemark: '',
                    payMethed: null
                });
                //console.log(11)
                addUserLayerIndex = layer.open({
                    title: "会员充值",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '769px' : '90%', isPc ? '600px' : '90%'],
                    content: $(".modifyBalanceDiv"),
                    success: function () {
                        //console.log(11)
                        form.render()
                        popValue = false
                    },
                    beforeEnd: function () {
                        popValue = true
                    },

                });
                break;
            case 'submitRestPwd':
                layer.confirm('确定为该会员生成新的临时登录密码吗？重置后请将密码安全告知客户。', function (index) {
                    var cid = obj.data.id;
                    resetPwd(cid, obj.data);
                    layer.close(index);
                });
                break
            case 'deduce':
                var id = obj.data.id
                var name = obj.data.bossName
                deducCustomerBalance(id, name)
                break
            case 'more':
                var id = obj.data.id
                dropdown.render({
                    elem: that,
                    show: true,
                    //trigger: 'hover',
                    content: `
                    <ul class="layui-menu layui-dropdown-menu"><li class='deduce' lay-tips="对此会员的可用余额进行手工减扣，通常用于当实际余额大于系统记录的可用余额时用。一般情况下不建议使用该功能。"  ><div class="layui-menu-body-title" >扣余额</div></li></ul>`,

                    ready: function () {

                        $('.deduce').click(() => {
                            $('.layui-layer-tips').hide()
                            var name = obj.data.bossName
                            deducCustomerBalance(id, name)
                        })
                        $('.moresubmitRestPwd').click(() => {
                            $('.layui-layer-tips').hide()
                            var cid = id

                            layer.confirm('确定为该会员生成新的临时登录密码吗？重置后请将密码安全告知客户。', function (index) {
                                resetPwd(cid, obj.data);
                                layer.close(index);
                            });
                        })


                    },
                    align: 'right', // 右对齐弹出
                    style: 'box-shadow: 1px 1px 10px rgb(0 0 0 / 12%);' //设置额外样式
                })
        };
    });

    function deducCustomerBalance(cid, name) {
        addUserLayerIndex = layer.open({
            type: 1,
            area: ['350px', '253px'],
            title: '对' + name + '余额进行手工减扣',
            content: `<form class="layui-form" action="" lay-filter="fm1" style="padding:10px 10px;">
 <div class="layui-form-pane" style="margin-top:10px;margin-bottom:10px;margin-left:10px">
     <div class="layui-form-item">
         <label class="layui-form-label">扣除金额</label>
         <div class="layui-input-inline">
            <input type="number" name="DecAmount" id="decAmount" lay-verify="required" min=0 placeholder="要减扣的金额" autocomplete="off" class="layui-input" value="">
        </div>
     </div>
     <div class="layui-form-item">
         <label class="layui-form-label">减扣原因</label>
         <div class="layui-input-inline">
            <input type="text" name="Remark" id="remark" lay-verify="required" placeholder="请输入减扣原因" autocomplete="off" class="layui-input" value="">
        </div>
     </div>
                     <div class="layui-form-item layui-layout-admin" style="margin-top:20px">
                    <div class="layui-input-block" style="margin-top:10px">
                        <button class="layui-btn  layui-btn-normal" lay-submit="" lay-filter="saveBtnPop">确定扣除</button>
                    </div>
                </div>
 </div>
</form>`,
            success: function () {
                form.render()
                form.on('submit(saveBtnPop)', function (data) {
                    var dataValue = form.val('fm1')
                    dataValue.Id = cid
                    $.ajax({
                        type: "Post",
                        url: "/api/CustomerApi/DeducBalance",
                        data: dataValue,
                        dataType: 'json',
                        success: function (data) {
                            if (data.code > 0) {
                                layer.close(addUserLayerIndex);
                                reloadOrderList();
                                layer.msg('扣除成功')
                            } else {
                                layer.msg(data.msg)

                            }

                        },

                    });

                    return false;
                });


            }
        });
    }
    function makeTemporaryPassword() {
        var alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
        var result = '';
        var values = window.crypto && window.crypto.getRandomValues ? new Uint32Array(12) : null;
        if (values) window.crypto.getRandomValues(values);
        for (var i = 0; i < 12; i++) {
            var n = values ? values[i] : Math.floor(Math.random() * alphabet.length);
            result += alphabet.charAt(n % alphabet.length);
        }
        return result;
    }

    function resetPwd(cid, row) {
        row = row || {};
        var temporaryPassword = makeTemporaryPassword();
        // 兼容正在运行的旧后台进程：会员编辑接口已经支持写入 clientPwd，
        // 这样点击重置后无需等待服务重启即可真正生效。
        var data = {
            hid: cid,
            customerNo: row.customerNo || '',
            bossName: row.bossName || '',
            phone: row.phone || '',
            wxNo: row.wxNo || '',
            platName: row.platName || '',
            buyDiscount: row.buyDiscount || row.discount || 0,
            brithDay: row.brithDay || row.birthday || '',
            remark: row.remark || '',
            tips: row.tips || '',
            description: row.description || '',
            keywords: row.keywords || '',
            servicePerson: row.servicePerson || '',
            servicePersonUserId: row.servicePersonUserId || 0,
            discountLevelInfluence: row.discountLevelInfluence ? 'Y' : 'N',
            clientPwd: temporaryPassword
        };
        $.ajax({
            url: '/api/CustomerApi/CreateModifyCustomer',
            method: 'POST',
            data: data,
            success: function (res) {
                if (res.code > 0) {
                    layer.alert('临时登录密码：' + temporaryPassword + '<br>请安全告知客户，并提醒客户登录后修改密码。', { title: '密码已重置' });
                } else {
                    layer.msg(res.msg);
                }
            },
        });
    }

    $('.saveModifyBalanceBtn').on('click', function () {
        var actionBalance = $("#actionBalance").val();
        if (!VerifyMoeny(actionBalance)) {
            layer.alert('请输入正确格式的充值金额');
            return false;
        }
        var giftAmount = $("#giftAmount").val();
        if (!VerifyMoeny(giftAmount)) {
            layer.alert('请输入正确格式的赠送金额');
            return false;
        }
        var payMethed = $('input[type=radio][name=payMethed]:checked').val();
        var corresOrderId = $("#corresOrderId").val();
        var baRemark = $("#baRemark").val();
        layer.confirm('请确认以下信息：<br/><br/> 充值金额：<span class="layui-font-red layui-font-24">' + actionBalance + '</span>元<br/><br/>另外赠送金额：<span class="layui-font-red layui-font-24">' + giftAmount + '</span>元<br/><br/>总计入账：<span class="layui-font-red layui-font-32">' + (parseFloat(actionBalance) + parseFloat(giftAmount)).toFixed(2) + '</span>元<br/><br/>注意，充值成功后无法撤销！', function (index) {
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/api/CustomerApi/Recharge",
                data: { Id: currentCid, Amount: actionBalance, GiftAmount: giftAmount, PayMode: payMethed, OrderNo: corresOrderId, Remark: baRemark },
                dataType: 'json',
                timeout: 1000 * 30,
                error: function (xhr) {
                    re = true;
                    layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {

                    });
                },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.alert('充值成功', function (lx) {
                            layer.close(lx);
                            if (data.code > 0) {
                                layer.close(addUserLayerIndex);
                                reloadOrderList();
                            }
                        });
                    } else {
                        layer.msg(data.msg);
                    }

                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });

    function delCustomer(ids, refresh) {
        layer.confirm('确认要删除吗？ <br/> <br/> 警告：一旦删除，将无法恢复，请三思再操作！ <br/>', function (indexs) {
            layer.close(indexs);
            layer.confirm('第二次确认:  <br/> <br/> 是不是真的要删除？删除就无法恢复了 <br/>', function (index) {
                confirmDelCustomer(ids, index, refresh);
            });
        });
        return false;
    }

    function exportOrder(idx) {
        var newSearchData = form.val('fm');
        if (!newSearchData.min) {
            form.val('fm', { min: 0 })
            newSearchData.min = 0
        }
        if (!newSearchData.max) {
            form.val('fm', { max: 0 })
            newSearchData.max = 0
        }
        newSearchData.export = 1;
        if (idx) {
            newSearchData.exPortSelectIdx = encodeURIComponent(idx);
        } else {
            newSearchData.exPortSelectIdx = "";
        }
        window.open("/Customer/Export?" + objectToQueryString(newSearchData), "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }
    function confirmDelCustomer(ids, index, refresh) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/api/CustomerApi/delCustomer",
            data: { keys: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.alert('删除成功', function (lx) {
                        layer.close(lx);
                        reloadOrderList();
                    })
                } else {
                    layer.alert(data.msg, function (lx) {
                        layer.close(lx);
                        reloadOrderList();
                    })
                }

                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function reloadOrderList(idx) {
        var newSearchData = form.val('fm');
        //console.log(newSearchData)
        //if (!newSearchData.min) {
        //    form.val('fm', { min: 0 })
        //    newSearchData.min = 0
        //}
        //if (!newSearchData.max) {
        //    form.val('fm', { max: 0 })
        //    newSearchData.max = 0
        //}
        newSearchData.isDebt = seachDebt
        if (newSearchData.level == 0) {
            newSearchData.level = ''
        }

        tableList.reload({
            url: '/api/CustomerApi/GetCustomerList?' + objectToQueryString(newSearchData)
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    form.on('checkbox(checkbox-filter)', function (data) {
        if (data.elem.checked) {
            seachDebt = true
        } else {
            seachDebt = false
        }
        reloadOrderList();
    });
    function getMemberLevelList() {
        var selectLevelList = $('#memberLevel');
        $.ajax({
            url: '/api/CustomerApi/GetLevelSelectList',
            method: 'GET',
            success: function (res) {
                //console.log(res)
                var getData = res.data;
                selectLevelList.empty()
                selectLevelList.append('<option value="0">全部</option>')
                getData.forEach(function (item) {
                    selectLevelList.append('<option value="' + item.value + '">' + item.label + '</option>');
                });
                layui.form.render("select");
            },
        });
    }
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll();
            reloadOrderList();
        }
    };
    window.tools = _tools;
});
