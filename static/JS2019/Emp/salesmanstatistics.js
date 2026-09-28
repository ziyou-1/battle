layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate; 
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
        var re = true;
        var gameName = $("#gameName").find("option:selected").text();
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
        var seachParam = 'stime=' + sDate + '&etime=' + eDate; 
        var indexLoad; 
        var page = 1; 
    var dateType = $("#dateType").val();
    /**
     * 是否在拉取客服
     * */
    var isLoadkefu = false;
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
        getCustomerService();
        getGameProject($("#gameName").val());
        function getCustomerService() {
            var soureData = [];
            if (isLoadkefu) {
                return false;
            }
            isLoadkefu = true;
            $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N' + (gameName == '全部游戏' ? '' : '&gameName=' + gameName), function (result) {
                soureData = result.data;
                formSelects.data('inputOrderKefu', 'local', {
                    arr: soureData
                });
                isLoadkefu = false;
            });
        }
        function getGameProject(gameId) { 
            $.get('/GameAjax/getProject?gameId=' + gameId, function (result) {
                currentProjectData = result.data;
                formSelects.data('projectSelect', 'local', {
                    arr: currentProjectData
                });
            });
    }
    form.on('select(dateType)', function (data) { 
        dateType = data.value;
        if (data.value == 30) {
            form.val('form', {
                "customerType": 10
            });
            form.render('select');
            getCustomerTypeAssUser();
        }
        else {
            form.val('form', {
                "customerType": 0
            });
            form.render('select'); 
            getCustomerService();
        }
        return false;
    });
    form.on('select(customerType)', function (data) { 
        if (data.value == 10) {
            form.val('form', {
                "dateType": 30
            });
            form.render('select');
            getCustomerTypeAssUser();
        }
        else {
            form.val('form', {
                "dateType": dateType == 30 ? 10 : dateType
            });
            form.render('select');
            getCustomerService();
        }
        return false;
    });
        function getCustomerTypeAssUser() {
            var soureData = [];
            if (isLoadkefu) {
                return false;
            }
            isLoadkefu = true;
            $.get('/UserAjax/GetZpRootUsers' + (gameName == '全部游戏' ? '' : '?gameName=' + gameName), function (result) {
                soureData = result.data;
                formSelects.data('inputOrderKefu', 'local', {
                    arr: soureData
                });
                isLoadkefu = false;
            });
        }
        form.on('select(selectGame)', function (data) {
            gameName = $("#gameName").find("option:selected").text(); 
            getCustomerService();
            getGameProject($("#gameName").val());
            reloadOrderList();
            return false;
        });     
        var tableList =table.render({
            elem: '#tableList' 
            , url: '/EmpAjax/GetSalesmanStatistics?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
             , totalRow: true
            , defaultToolbar: ['filter']
            , cols: [[ 
                {
                    field: 'Kefu', title: '操作人员', fixed: 'left', width: 100, align: 'left', unresize: false, totalRowText: '合计', templet: function (res) {
                        let dg = '';
                        if (res.recommendCount > 0) {
                            dg = '<a href="#" class="layui-badge" title="推荐了' + (res.recommendCount) + '个二级业务人员，点击可查看二级人员业务数据" data-id="' + res.userId + '" data-name="' + res.Kefu + '">' + res.recommendCount + '</a>';
                        }
                        return '<span style="color:#1E9FFF">' + dg+res.Kefu + '</span>';
                    }
                }
                , {
                    field: 'TotalCount', title: '总订单数', width:75, align: 'center', sort: true, unresize: false,totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的接单总数量">' + res.TotalCount + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'TotalPrice', title: '总金额', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的接单总金额">' + res.TotalPrice + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'effectivePerformance', title: '生效绩效', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的订单已完成后生效的业绩提成总金额">' + res.effectivePerformance + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'DSH', title: '待上号数', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span style="">' + res.DSH + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DSHAmount', title: '待上号金额', width: 85, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        return '<span title="">' + res.DSHAmount + '</span>';
                    }
                }
                , {
                    field: 'DLZ', title: '代练中数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DLZ + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DLZAmount', title: '代练中金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DLZAmount + '</span>';
                        return vo;
                   }
                }
                , {
                    field: 'DYS', title: '待验收数', width: 75, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DYS + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DYSAmount', title: '待验收金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DYSAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YWC', title: '已完成数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YWC + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YWCAmount', title: '已完成金额', align: 'center', width: 85, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YWCAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YZT', title: '已暂停数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YZT + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YZTAmount', title: '已暂停金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YZTAmount + '</span>';
                        return vo;
                    }
                }
                 , {
                     field: 'WTD', title: '问题单数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                         let vo = '<span>' + res.WTD + '</span>';
                         return vo;
                     }
                 }
                , {
                    field: 'WTDAmount', title: '问题单金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.WTDAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YTD', title: '已退单数', width: 75, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YTD + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YTDAmount', title: '已退单金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YTDAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'customerCount', title: '客户数', width: 70, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.customerCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'customerPrice', title: '客单价', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.customerPrice + '</span>';
                        return vo;
                    }
                }
            ]]
            , page: false  
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
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            sDate = $("#sDate").val();
            eDate = $("#eDate").val(); 
            var project = formSelects.value('projectSelect', 'nameStr');
            var kefu = formSelects.value('inputOrderKefu', 'nameStr');
            dateType = $("#dateType").val();
            var customerType = $("#customerType").val();
            seachParam = (gameName == "全部游戏" ? "" : "gameName=" + gameName + "&") + 'stime=' + sDate + '&etime=' + eDate + '&kefu=' + kefu + '&project=' + project + '&dateType=' + dateType + '&customerType=' + customerType;
            tableList.reload({
                url: '/EmpAjax/GetSalesmanStatistics?' + seachParam
                , where: {
                }
                , page:false
            });
            return false;
        }
        $(document).on('click', '.layui-badge', function () {
            var ids = $(this).attr('data-id'); 
            var username = $(this).attr('data-name');
            $('.v2').html(username+'推荐的人员同一搜索条件下的接单数据统计');
            recode = ids;
            loadLevelData(ids);
        });
        var recode = 0;
        var tableList2;
        function loadLevelData(recode) {
            tableList2 = table.render({
                elem: '#tableList2'
             , height: 400
              , url: '/EmpAjax/GetSalesmanStatistics?' + 'stime=' + sDate + '&etime=' + eDate + '&gameName=' + (gameName == "全部游戏" ? "" : "gameName=" + gameName) + '&project=' + formSelects.value('projectSelect', 'nameStr') + '&recode=' + recode
              , defaultToolbar: []
              , toolbar: '#toolbarDemo2'
               , totalRow: true
              , defaultToolbar: ['filter']
               , cols: [[
                {
                    field: 'Kefu', title: '客服', fixed: 'left', minWidth: 75, align: 'left', unresize: false, totalRowText: '合计', templet: function (res) {
                        let dg = '';
                        if (res.recommendCount > 0) {
                            dg = '<a href="#" class="layui-badge" title="推荐了' + (res.recommendCount) + '个二级业务人员，点击可查看二级人员业务数据" data-id="' + res.userId + '" data-name="' + res.Kefu + '">' + res.recommendCount + '</a>';
                        }
                        return '<span style="color:#1E9FFF">' + dg + res.Kefu + '</span>';
                    }
                }
                , {
                    field: 'TotalCount', title: '总订单数', width: 75, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的接单总数量">' +  res.TotalCount + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'TotalPrice', title: '总金额', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的接单总金额">' + res.TotalPrice + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'effectivePerformance', title: '生效绩效', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="在此搜索条件范围内统计的订单已完成后生效的业绩提成总金额">' + res.effectivePerformance + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'DSH', title: '待上号数', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span style="">' + res.DSH + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DSHAmount', title: '待上号金额', width: 85, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        return '<span title="">' + res.DSHAmount + '</span>';
                    }
                }
                , {
                    field: 'DLZ', title: '代练中数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DLZ + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DLZAmount', title: '代练中金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DLZAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DYS', title: '待验收数', width: 75, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DYS + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'DYSAmount', title: '待验收金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.DYSAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YWC', title: '已完成数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YWC + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YWCAmount', title: '已完成金额', align: 'center', width: 85, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YWCAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YZT', title: '已暂停数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YZT + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YZTAmount', title: '已暂停金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YZTAmount + '</span>';
                        return vo;
                    }
                }
                 , {
                     field: 'WTD', title: '问题单数', align: 'center', width: 75, sort: true, unresize: false, totalRow: true, templet: function (res) {
                         let vo = '<span>' + res.WTD + '</span>';
                         return vo;
                     }
                 }
                , {
                    field: 'WTDAmount', title: '问题单金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.WTDAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YTD', title: '已退单数', width: 75, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YTD + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'YTDAmount', title: '已退单金额', width: 85, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.YTDAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'customerCount', title: '客户数', width: 70, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.customerCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'customerPrice', title: '客单价', width: 80, align: 'center', sort: true, unresize: false, totalRow: true, templet: function (res) {
                        let vo = '<span>' + res.customerPrice.toFixed(2) + '</span>';
                        return vo;
                    }
                }
               ]]
              , page: false
              , done: function (res, curr, count) {
                  page = curr;
              }
            });
        } 
        table.on('toolbar(tableList2)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList2();
                    break;
            };
        });
        function reloadOrderList2() { 
            tableList2.reload({
                url: '/EmpAjax/GetSalesmanStatistics?' + 'stime=' + sDate + '&etime=' + eDate + '&gameName=' + (gameName == "全部游戏" ? "" : "gameName=" + gameName) + '&project=' + formSelects.value('projectSelect', 'nameStr') + '&recode=' + recode
                , where: {
                }
                , page: false
            });
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
                area: ['90%', '92%'],
                content: '/Order/OrderView?orderId=' + orderid
            });
        }
        function exportEmp() {
            window.open("/Emp/ExportEmp?" + seachParam, "_blank");
            var index = layer.getFrameIndex(window.name);
            layer.close(index);
            return false;
        }
        function refrshTaobaoSta(ids) {
            layer.confirm('该过程将在后台请求同步前10000笔淘宝的订单状态，每次更新间隔需在1小时24分钟左右！', {
                btn: ['确定', '取消']
            }, function (index) {
                re = false;
                //请求
                $.ajax({
                    type: "Post",
                    url: "/EmpAjax/RefshPlatformOrderStatusByTaoBao",
                    data: { orderId: ids },
                    dataType: 'json',
                    cache: false,
                    timeout: 600000,
                    error: function () { layer.msg('数据请求出现异常！'); re = true; layer.close(indexLoad); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        layer.close(indexLoad); 
                        layer.close(index);
                        reloadOrderList();
                        layer.msg(data.msg, { time: 5000 }, function () { 
                        });
                        re = true;
                    }
                    , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
                });
                return false;
            });
            return false;
        }
        function settSta(ids) {
            layer.open({
                title: "清算绩效",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '50%'],
                content: '/Emp/SettlementEmp?ids=' + ids
            });
        }  
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