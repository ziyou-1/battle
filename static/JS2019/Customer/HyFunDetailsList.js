
layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var device = isPc;
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    });
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var seachParam = 'sDate=' + sDate + '&eDate=' + eDate;
    var indexLoad;
    var page = 1;
    var listCount = 0;
    var addUserLayerIndex;
    laydate.render({
        elem: '#sDate'
    });
    laydate.render({
        elem: '#eDate'
    });
    getActionUserList();
    function getActionUserList() {
        $.ajax({
            type: "GET",
            url: '/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=Y&isOnlySelectSelf=N&editUserName=&dy=1',
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code >= 0) {
                    var select = $('#actionId');
                    var gameData1 = data.data
                    var str = ''

                    gameData1.forEach(function (item) {
                        str += ` <option value="${item.value}">${item.name}</option> `
                    });
                    select.append(str);

                    layui.form.render("select");
                } else {
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }


    var searchData = form.val('fm');
    function objectToQueryString(obj) {
        const params = new URLSearchParams();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                params.append(key, obj[key]);
            }
        }
        return params.toString();
    }
    var tableList = table.render({
        elem: '#tableList'
        , url: '/api/CustomerApi/GetCustomerFeeDetailsList?' + objectToQueryString(searchData)
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 50 }
            , {
                field: 'customerNo ', title: '会员号', width: 150, unresize: false, templet: function (res) {
                    return `<span style="color:#31bdec">${res.customerNo ? res.customerNo:'' }</span`;
                }
            }
            , {
                field: 'bossName ', title: '会员名称', width: 100, unresize: false, templet: function (res) {
                    let tipb = '<span class="lableb" style="background-color:#FF534D" title="该会员已被删除了">删</span>';
                    if (res.isDel != "Y") {
                        tipb = '';
                    }
                    return tipb + `<span style="">${res.bossName ? res.bossName:'' }</span`;
                }
            }
            , {
                field: 'usageType ', title: '用途', width: 85, align: 'center', unresize: false, templet: function (d) {
                    if (d.usageType == 0) {
                        return '<span >充值</span>';
                    } else if (d.usageType == 1) {
                        return '<span >消费</span>';
                    } else if (d.usageType == 2) {
                        return '<span >购买增值服务</span>';
                    } else if (d.usageType == 3) {
                        return '<span >撤销充值</span>';
                    } else if (d.usageType == 4) {
                        return '<span >消费退回</span>';
                    } else if (d.usageType == 5) {
                        return '<span >余额调整</span>';
                    }  {
                        return '<span >其它</span>';
                    }
                }

            },
            {
                field: 'amount ', title: '发生金额', align: 'center', width: 80, unresize: false, templet: function (d) {
                    if (d.type == 0) {
                        return `<div style="color:red;font-weight:bold"> +${d.amount }</div>`;
                    } else if (d.type == 1) {
                        return `<div style="color:red;font-weight:bold"> -${d.amount }</div>`;
                    }
                }
            },
            {
                field: 'giftAmount ', title: '充值赠送', align: 'center', width: 80, unresize: false, templet: function (d) {
                    if (d.usageType == 0 || d.usageType == 3) {
                        return '<div style="color:red">' + d.giftAmount + '</div>';
                    } else {
                        return '';
                    }
                }
            },

            {
                field: 'balance ', title: '剩余余额', width: 100, align: 'center', unresize: false, templet: function (res) {
                    return `<div style="">${res.balance }</div>`;
                }
            },
            {
                field: 'createTime ', title: '发生时间', align: 'center', sort: true, width: 100, templet: function (d) {
                    const year = d.createTime.slice(0, 4);
                    const month = d.createTime.slice(5, 7);
                    const day = d.createTime.slice(8, 10);
                    const hour = d.createTime.slice(11, 13);
                    const minute = d.createTime.slice(14, 16);
                    return `${month}-${day} ${hour}:${minute}`;
                }
            }, {
                field: 'orderNo ', title: '关联单号', width: 160, unresize: false, templet: function (d) {
                    if ((d.usageType === 1 || d.usageType === 4) && d.orderNo) {
                        if (d.isDel == 'N') {
                            return `<div lay-tips="点击进入订单详情"  class="orderNoTip" data-id="${d.orderNo}" style="color:#31bdec;cursor:pointer">${d.orderNo ? d.orderNo : ''}</div>`;

                        } else {
                            return `<div  style="color:#31bdec;cursor:pointer"><a href="javascript:void(0);" class="lableb " style="background-color:#FF6347" lay-tips="该订单已删除">删</a>${d.orderNo ? d.orderNo : ''}</div>`;
                        }
                    } else {
                        return d.orderNo ? d.orderNo : '';
                    }
                }

            }, {
                field: 'payMode', title: '渠道', width: 80, align: 'center', unresize: false, templet: function (d) {
                    if (d.payMode == 0) {
                        return '<span >微信</span>';
                    } else if (d.payMode == 1) {
                        return '<span >支付宝</span>';
                    } else if (d.payMode == 2) {
                        return '<span >银行转账</span>';
                    } else if (d.payMode == 3) {
                        return '<span >平台</span>';
                    } else if (d.payMode == 4) {
                        return '<span >内部</span>';
                    }
                    else {
                        return '<span >其它</span>';
                    }
                }

            }, {
                field: 'remark', title: '备注', minWidth: 100,  unresize: false

            }, {
                field: 'actionUserName', title: '操作人', width: 110, align: 'center', unresize: false

            }, {
                field: '', title: '操作', width: 80, unresize: false, templet: function (res) {
                    let btn1 = '';
                    if (res.usageType == 0) {
                        btn1 = '<a class="layui-btn layui-btn-xs layui-btn-danger cancelBtn" lay-tips="撤销本次充值" style="margin-left: 3px;padding: 0px 3px;" data-id="' + res.id + '">撤销</a>';
                    }
                    let btn = btn1;
                    return btn;
                }
            }
        ]]
        , page: true
        , limit: 20
        , limits: [20, 30, 40, 50]
        , done: function (res, curr, count) {
            if (res.msg == "请先登录") {
                layer.msg("登录过期了，请重新登录系统");
                return;
            }

            listCount = res.count;
            var total = `本次搜索共计${listCount}条记录，累计充值${res.ext && res.ext.TotalRecharge ? res.ext.TotalRecharge : 0}元，累计消费金额${res.ext && res.ext.TotalConsumer ? res.ext.TotalConsumer : 0}元，累计赠送金额${res.ext && res.ext.TotalGiftAmount ? res.ext.TotalGiftAmount : 0}元`;
            $("#total").html(total);
            page = curr;
        }
    });
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        reloadOrderList();
        return false;
    });
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'exportBtn':
                exportLog();
                return false;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;

        if (obj.event === 'del') {
            var id = obj.data.orderID;
            layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) {
                delOrder(id);
                layer.close(index);
            });
        } else if (obj.event === 'submtEnd') {
            var orderId = obj.data.orderId;
            layer.confirm('确定打完了吗？提交前请再三确认哦', function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/SetOrderSta",
                    data: { orderId: orderId, sta: '待验收' },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        re = true;
                        if (data.code > 0) {
                            layer.msg(data.msg, { time: 1500 }, function () {
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.msg(data.msg, { time: 6000 }, function () {
                            })
                        }
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            });
            return false;
        }
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    $(document).on('click', '.orderNoTip', function () {
        var ids = $(this).attr('data-id');
        addUserLayerIndex = layer.open({
            title: ids + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '1280px' : '95%', isPc ? '840px' : '95%'],
            content: '/Order/OrderView?orderId=' + ids + '&viewType=20'
        });
    });
    $(document).on('click', '.cancelBtn', function () {
        var fid = $(this).attr('data-id');
        layer.confirm('确定要撤销冲正本次充值吗？提交前请再三确认', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/api/CustomerApi/RevocationMemberRecharge",
                data: { id: fid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.msg('撤销成功')
                            reloadOrderList();
                    } else {
                        layer.alert(data.msg, function (lx) {
                            layer.close(lx);
                        })
                    }
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    })
    function exportLog() {
        if (listCount > 30000) {
            layer.alert('本次搜索结果大于3万条数据，将会导致下载慢、消耗高，请通过缩小时间范围来减少查询结果数量，再重新导出！', function (lx) {
                layer.close(lx);
                return false;
            });
            return false;
        }
        var newSearchData = form.val('fm');
        window.open("/Customer/ExportFeeDetails?" + objectToQueryString(newSearchData), "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }
    function reloadOrderList(idx) {
        var newSearchData = form.val('fm');

        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        tableList.reload({
            url: '/api/CustomerApi/GetCustomerFeeDetailsList?' + objectToQueryString(newSearchData)
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