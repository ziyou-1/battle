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
    var table = layui.table;
    var xmSelect = layui.xmSelect;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    } 
    var re = true;
    var gameName = $("#gameName").find("option:selected").text();
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
    var seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate;
        var indexLoad; 
        var page = 1;  
        var detailsUid=0;
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
            let Userlimit = 2000
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
            $.get(`/UserAjax/GetAllUserByGameName?gameName=${gameName}&page=1&limit=${Userlimit}&isViewGroup=Y&screen=1`, function (result) {
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
                            $.get(`/UserAjax/GetAllUserByGameName?gameName=${gameName}&page=${pageIndex}&limit=${Userlimit}&isViewGroup=Y&screen=1&accurate=1&seachKey=${val}`, function (res) {
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
        form.on('select(selectGame)', function (data) {
            gameName = $("#gameName").find("option:selected").text();
            getAllRecUserData();
            reloadOrderList();
            return false;
        });     
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/EmpAjax/GetBillSummaryList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , title: '结算记录汇总表'
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'userName', title: '结算对象人员', fixed: 'left', align: 'center', unresize: false, totalRowText: '合计',templet: function (res) {
                        return '<span style="color:#5FB878">' + res.userName + '</span>';
                    }
                }
                , {
                    field: 'amount', title: '结算金额', width: isPc ? '25%' : 140, align: 'center', sort: true, totalRow: true, unresize: false,templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.amount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'none', title: '操作', width: isPc ? '30%' : 150, align: 'center', unresize: false, templet: function (res) {
                        return '<a href="javascript:void(0)" class="viewbilldetail" style="color:#1E9FFF" data-id="' + res.uid + '" data-name="' + res.userName + '" title="点击可查看该人员的结算明细">点击查看结算明细</a>';
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) { 
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total1").html(sDate + '至' + eDate + '的结算记录汇总');
             }
        });
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'exportBtn':
                    exportEmp();
                    break;
            };
        });
        function reloadOrderList() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();
            var recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
                ? RecUserSelect.getValue('valueStr')
                : '';
            var skey = $("#key1").val();
            seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&userId=' + recUser + '&key=' + skey;

            tableList.reload({
                url: '/EmpAjax/GetBillSummaryList?' + seachParam
                , where: {
                }
                , page: false
            });
            return false;
        }
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
    
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
                area: [isPc?'1125px':'80%', '90%'],
                content: '/Order/OrderView?orderId=' + orderid
            });
        }
        function exportEmp() {
            sDate = $("#sDate").val();
            eDate = $("#eDate").val();  
            seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&recUser=' + detailsUid+'&dateType=30&settingSta=Y';
            window.open("/Emp/ExportEmp?" + seachParam, "_blank");
            var index = layer.getFrameIndex(window.name);
            layer.close(index);
            return false;
    }

    var tableList2;
    var seachParam2 = '';
    $(document).on('click', '.viewbilldetail', function () {
        var uid = $(this).attr('data-id');
        detailsUid=uid;
        var username = $(this).attr('data-name');
        var skey = $("#key1").val();
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
        seachParam2 = 'userId=' + uid + '&stime=' + sDate + '&etime=' + eDate + '&key=' + skey+'&gameName=' + gameName ;
        tableList2 = table.render({
            elem: '#tableList2'
            , url: '/EmpAjax/GetBillSummaryDetailsList?' + seachParam2
            , defaultToolbar: []
            , toolbar: '#toolbarDemo2'
            , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'userName', title: '结算对象人员', fixed: 'left', width: isPc ? '12%' : 120, align: 'center', unresize: false, totalRowText: '合计', templet: function (res) {
                        return '<span style="color:#5FB878">' + res.userName + '</span>';
                    }
                }
                , {
                    field: 'tempBonus', title: '预计结算金额', width: isPc ? '10%' :100, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.tempBonus + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'realAmount', title: '实际结算金额', width: isPc ? '10%' :100, align: 'center', sort: true, totalRow: true, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.realAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'orderId', title: '关联订单', width: isPc ? '15%' : 150, align: 'center',unresize: false, templet: function (res) {
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
                    field: 'billTime', title: '结算时间', width: isPc ? '12%' : 120, align: 'center', unresize: false, sort: true, templet: function (res) {
                        let vo = '<span>' + res.billTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'billUserName', title: '结算人', width:100, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.billUserName + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: true
            , limit: 20
            , limits: [20, 30, 40, 50, 100]
            , done: function (res, curr, count) {
                page = curr;
                if (res.msg != '' && res.msg != null) {
                    layui.msg(res.msg);
                }
                $(".total2").html(username + '的结算明细');
            }
        });
        table.on('toolbar(tableList2)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'exportBtn':
                    exportEmp();
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