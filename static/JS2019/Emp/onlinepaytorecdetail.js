layui.config({
    base: '../layuiadmin/'
}).extend({
    xmSelect: 'lib/xm-select',
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table','xmSelect'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
        var xmSelect = layui.xmSelect;
        var table = layui.table;
        var devices = layui.device();
        var isPc = true;
        if (devices.android===true|| devices.ios===true) {
            isPc = false;
        } 
        var re = true;
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
        var seachParam = 'stime=' + sDate + '&etime=' + eDate;
        var indexLoad; 
        var page = 1;  
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        laydate.render({
            elem: '#sDate'
            , type: 'datetime'
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        });    
    getAllRecUserData();
    var RecUserSelect
    function getAllRecUserData() {
        let Userlimit = 3000
        var soureData = [];
        function processDataWithCustomClick(dataList) {
            if (!Array.isArray(dataList)) return [];

            return dataList.map(item => {
                if (item.optgroup) {
                    return {
                        ...item,
                        click: function (groupItem) {
                            const searchVal = $('#popgameName .xm-input.xm-search-input').val().trim().toLowerCase();
                            const children = groupItem.children || [];


                            const matchedValues = children
                                .filter(child => {
                                    const isMatch = !searchVal || (child.name && child.name.toLowerCase().includes(searchVal));
                                    const isDisabled = !!child.disabled;
                                    return isMatch && !isDisabled;
                                })
                                .map(child => child.value);
                            if (matchedValues.length === 0) return;
                            const currentSelectedValues = RecUserSelect.getValue('value');
                            const isAllSelected = matchedValues.every(val => currentSelectedValues.includes(val));
                            let newValues = [];
                            if (isAllSelected) {
                                newValues = currentSelectedValues.filter(val => !matchedValues.includes(val));
                            } else {
                                newValues = Array.from(new Set([...currentSelectedValues, ...matchedValues]));
                            }
                            RecUserSelect.setValue(newValues);
                        }
                    };
                }
                return item;
            });
        }
        $.get(`/UserAjax/GetAllUserByGameName?page=1&limit=${Userlimit}&isViewGroup=Y&screen=1`, function (result) {
            soureData = processDataWithCustomClick(result.data);

            if (result.count > Userlimit) {
                RecUserSelect = xmSelect.render({
                    el: '#popgameName',
                    language: 'zn',
                    height: '400px',
                    filterable: true,
                    remoteSearch: true,
                    paging: true,
                    radio: true,
                    pageSize: Userlimit,
                    clickClose: true,
                    pageRemote: true,
                    pageEmptyShow: false,
                                            toolbar: {
                            show: true,
                            list: [ 'CLEAR' ]
                        },
                    remoteMethod: function (val, cb, show, pageIndex) {
                        $.get(`/UserAjax/GetAllUserByGameName?isViewGroup=Y&screen=1&page=${pageIndex}&limit=${Userlimit}&accurate=1&seachKey=${val}`, function (res) {
                            const processedData = processDataWithCustomClick(res.data);
                            cb(processedData, Math.ceil(res.count / Userlimit));
                        })
                    },
                    data: soureData,
                })
            } else {
                RecUserSelect = xmSelect.render({
                    el: '#popgameName',
                    language: 'zn',
                    height: '400px',
                    radio: true,
                    clickClose: true,
                    filterable: true,
                    data: soureData,
                    toolbar: {
                            show: true,
                            list: [ 'CLEAR' ]
                        },
                })
            }
        });
    }
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/EmpAjax/GetOnLineBillSummaryList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , title: '结算记录汇总表'
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'userName', title: '系统人员名称', fixed: 'left', align: 'center', unresize: false, totalRowText: '合计',templet: function (res) {
                        return '<span style="color:#5FB878">' + res.userName + '</span>';
                    }
                }
                , {
                    field: 'payAmount', title: '打款金额', width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.payAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realAmount', title: '实到账金额', width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.realAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'serviceAmount', title: '转账手续费', width: isPc ? '10%' : 140, align: 'center', sort: true, totalRow: true, unresize: false,templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.serviceAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'recAlipayAcc', title: '收款账号', width: isPc ? '13%' : 170, align: 'left', sort: false, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.recAlipayAcc + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'payTranOrderNo', title: '支付宝打款流水号', width: isPc ? '15%' : 200, align: 'left', sort: false, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.payTranOrderNo + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: '打款时间', width: isPc ? '10%' : 140, align: 'left', sort: true, totalRow: false, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.createTime + '</span>';
                        return vo;
                    }
                }, {
                    field: 'payUserName', title: '结算人', width: isPc ? '10%' : 140, align: 'center', unresize: false,templet: function (res) {
                        return '<span style="">' + res.payUserName + '</span>';
                    }
                }
                , {
                    field: 'none', title: '操作', width: isPc ? '5%' : 60, align: 'center', unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" class="viewbilldetail" style="color:#1E9FFF" data-id="' + res.sid + '" data-name="' + res.payTranOrderNo + '" data-uid="' + res.uid + '" title="点击可查看结算明细">明细</a>';
                    }
                }
            ]]
            , page: true
            , limit: 20
            , limits: [10, 20, 30, 40, 50, 100]
            , done: function (res, curr, count) { 
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total1").html(sDate + '至' + eDate + '的在线结算记录汇总(不包含线下结算)，共计' + res.total.totalCount+'次打款，共计打款金额' + res.total.totalPayAmount + '元，实际到账总额' + res.total.totalRealAmount+'元');
             }
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'exportBtn':                   
                    exportOrder();
                    break;
            };
        });
        function reloadOrderList() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var skey ="";
            var recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
                ? RecUserSelect.getValue('valueStr')
                : '';
            seachParam = 'stime=' + sDate + '&etime=' + eDate + '&recUserId=' + recUser + '&key=' + skey;

            tableList.reload({
                url: '/EmpAjax/GetOnLineBillSummaryList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
        return false;
    }
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
    function exportOrder() {
        window.open("/Emp/ExportOnlinePayDetail?" + seachParam, "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }
    $(document).on('click', '.orderdetails', function () {
                var ids = $(this).attr('data-id');
                viewOrderDetails(ids);
            });
        function viewOrderDetails(orderid) {
            layer.open({
                title: orderid + "订单详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '90%'],
                content: '/Order/OrderView?orderId=' + orderid
            });
        }

    var tableList2;
    var seachParam2 = '';
    $(document).on('click', '.viewbilldetail', function () {
        var uid = $(this).attr('data-id');
        var recUserId = $(this).attr('data-uid');
        var payTranOrderNo = $(this).attr('data-name');
        seachParam2 = 'sid=' + uid + '&recUserId=' + recUserId;
        tableList2 = table.render({
            elem: '#tableList2'
            , url: '/EmpAjax/GetMyOnlineBillSummaryDetailsList?' + seachParam2
            , defaultToolbar: []
            , toolbar: '#toolbarDemo2'
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'tempBonus', title: '预计结算金额', width: isPc ? '15%' :180, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.tempBonus + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realAmount', title: '实际结算金额', width: isPc ? '15%' :180, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.realAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'orderId', title: '关联订单', width: isPc ? '22%' : 250, align: 'left',unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="orderdetails" data-id="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情">' + res.jionOrder + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'project', title: '项目', align: 'left', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.project + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'gameRole', title: '角色名', width: isPc ? '16%' : 180, align: 'center', unresize: false, sort: false, templet: function (res) {
                        let vo = '<span>' + res.gameRole + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , limit: 30
            , limits: []
            , done: function (res, curr, count) {
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total2").html('支付流水号：' + payTranOrderNo + '的相关明细');
            }
        });
        table.on('toolbar(tableList2)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'exportBtn':
                   
                    break;
            };
        });
    });
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            //不关闭现有所有弹层
            reloadOrderList();
        } 
    };
    window.tools = _tools;
});