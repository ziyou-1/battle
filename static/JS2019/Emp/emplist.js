layui.config({
    base: '../layuiadmin/'
}).extend({
    xmSelect: 'lib/xm-select',
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'element', 'xmSelect'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate
        , element = layui.element;
    var table = layui.table;
    var xmSelect = layui.xmSelect;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var gameName = $("#gameName").find("option:selected").text();
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var indexLoad;
    var page = 1;
    var rankLayer;
    var certAgreemantLayer;
    /**
     * 结算模式：1=模式2-1、3=模式2-2
     */
    var payMode = parseInt($("#defPayMode").val());
    var layerWindows;
    var recUserName = ''
    var key1 = ''
    var sechbtnValue = true
    $(document).keyup(function (event) {
        getKey();
    });
    $.ajax({
        type: "GET",
        url: "/EmpAjax/GetLingyuefangzhouSystemSettleBalance",
        data: {},
        dataType: 'json',
        cache: false,
        timeout: 60000,
        error: function () { layer.msg('系统繁忙！'); re = true; },
        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
        success: function (data) {
            $("#lyfzBalance").html('结算专款余额【' + data.code + '】');
        },
        complete: function (XMLHttpRequest) {
            layer.close(indexLoad);
        }
    });

    function getKey() {
        if (event.keyCode == 13 && sechbtnValue) {
            allIds = [];
            $(".sechbtn").trigger("click");
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    }
    laydate.render({
        elem: '#sDate'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'datetime'
    });
    var payIds = '';
    var oids = '';
    var setWindows;
    var payamount = 0;
    var jdpyue = 0;
    var layid = location.hash.replace(/^#tab=/, '');
    var empType = layid == undefined || layid == null || layid == 0 ? 10 : layid;
    var seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&empType=' + empType;
    var selectLineRowTotalPrice = new Array();
    var taobaoSeachParam = {
        gameName: gameName,
        stime: sDate,
        etime: eDate,
        empType: empType
    };
    element.tabChange('empTab', layid);
    element.on('tab(empTab)', function (elem) {
        location.hash = 'tab=' + $(this).attr('lay-id');
        empType = $(this).attr('lay-id');
        reloadOrderList();
    });
    getAllRecUserData();
    getCustomerService();
    getAllOrderSoure();
    getAllTaskData();
    getJdpBalance();

    var RecUserSelect

    function getAllRecUserData() {
        let Userlimit = 2000;
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
                    height: '400px',
                    language: 'zn',
                    filterable: true,
                    remoteSearch: true,
                    paging: true,
                    pageSize: Userlimit,
                    pageRemote: true,
                    pageEmptyShow: false,
                    toolbar: {
                        show: true,
                        list: ['CLEAR']
                    },
                    remoteMethod: function (val, cb, show, pageIndex) {
                        $.get(`/UserAjax/GetAllUserByGameName?gameName=${gameName}&page=${pageIndex}&limit=${Userlimit}&isViewGroup=Y&screen=1&accurate=1&seachKey=${val}`, function (res) {
                            const processedData = processDataWithCustomClick(res.data);
                            cb(processedData, Math.ceil(res.count / Userlimit));
                        });
                    },
                    data: soureData,
                });
            } else {
                RecUserSelect = xmSelect.render({
                    el: '#popgameName',
                    height: '400px',
                    language: 'zn',
                    filterable: true,
                    data: soureData,
                    toolbar: {
                        show: true,
                        list: ['CLEAR']
                    },
                });
            }
        });
    }
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
    function getAllTaskData() {
        var listData = [];
        $.get('/PveTaskAjax/GetAllTaskSelectListData?gameId=' + $("#gameName").val() + '&status=0&isAppendFront=N', function (result) {
            listData = result.data;
            formSelects.data('taskSelect', 'local', {
                arr: listData
            });
        });
    }
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        if (gameName.indexOf('魔兽') > -1) {
            $(".task").show();
            $(".orderTypeDiv").hide();
        } else {
            $(".task").hide();
            $(".orderTypeDiv").show();
        }
        getAllRecUserData();
        getCustomerService();
        reloadOrderList();
        return false;
    });

    const showDeductFee = deductFeeType == 1 ? true : false;
    var tableList = table.render({
        elem: '#tableList'
        , url: '/EmpAjax/GetEmpList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 }
            , {
                field: 'userName', title: '系统用户', fixed: 'left', width: 90, align: 'center', unresize: false, templet: function (res) {
                    let tipb = '<span class="lableb" style="background-color:#FF534D" title="该订单已被删除了">删</span>';
                    if (res.orderIsDel != "Y") {
                        tipb = '';
                    }
                    return '<span>' + tipb + res.userName + '</span>';
                }
            }
            , {
                field: 'tempAmount', title: '预计绩效', width: 80, align: 'center', sort: false, unresize: false, edit: true, templet: function (res) {
                    let tempStyle = (res.price - res.tempAmount - res.refundFee) <= 0 ? ';font-weight:bold;font-size:14px' : '';
                    let empRemark = res.logUserName != null && res.logUserName.includes('固定') ? '按固定金额提成' : res.logUserName != null && res.logUserName.includes('接单价') ? '按接单价百分比提成' : '按利润百分比提成(退款部分已计算在内)';
                    let tipsStr = empType == 20 ? '销售客服的提成账单，' + empRemark : '发给' + res.userName + '时的预计发单价，结算时请以生效绩效为准，点击可以修改' + (tempStyle != '' ? '，这单貌似是亏损的' : '');
                    let vo = '<a href="javascript:void(0);" style="color:#FF5722' + tempStyle + '" lay-tips="' + tipsStr + '">' + res.tempAmount + '</a>';
                    return vo;
                }
            }
            , {
                field: 'bonusAmount', title: '生效绩效', width: 80, align: 'center', sort: false, unresize: false, edit: true, templet: function (res) {
                    let tempStyle = (res.price - res.tempAmount - res.refundFee) <= 0 ? ';font-weight:bold;font-size:14px' : '';
                    let empRemark = res.logUserName != null && res.logUserName.includes('固定') ? '按固定金额提成' : res.logUserName != null && res.logUserName.includes('接单价') ? '按接单价百分比提成' : '按利润百分比提成(退款部分已计算在内)';
                    let tipsStr = empType == 20 ? '销售客服的提成账单，' + empRemark : '最终需要给' + res.userName + '结算的金额，如果' + res.userName + '没亲自交单，这里就是0，点击可以修改' + (tempStyle != '' ? '，这单貌似是亏损的' : '');
                    let vo = '<a href="javascript:void(0);" style="color:#FF5722' + tempStyle + '" lay-tips="' + tipsStr + '">' + res.bonusAmount + '</a>';
                    return vo;
                }
            }, {
                field: 'deductFee', title: '扣点', width: 65, align: 'center', hide: !showDeductFee, sort: false, unresize: false, templet: function (res) {
                    return `<span style="color:#ff5722">${res.deductFee}</span>`;
                }
            }
            , {
                field: 'price', title: '订单金额', width: 65, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let pvo = '<span style="color:#FF5722">' + res.price + '</span>';
                    let color = '#E6E6FA';
                    let title = '还没有与老板或上家结算（注意：不是给打手的钱，如果需要更改此状态，请到管理订单列表里更改）';
                    let spanText = '未';
                    let vo = '<span class="lableb" style="background-color:#E6E6FA" title="' + title + '">' + spanText + '</span>';
                    if (res.furlStatus == "结算中") {
                        color = '#B0E0E6';
                        title = '上家或老板正在与我们结算中（注意：不是给打手的钱，如果需要更改此状态，请到管理订单列表里更改）';
                        spanText = '中';
                    }
                    else if (res.furlStatus == "已结算") {
                        color = '#98FB98';
                        title = '已收到上家或老板的订单钱（注意：不是给打手的钱，如果需要更改此状态，请到管理订单列表里更改）';
                        spanText = '收';
                    }
                    vo = '<span class="lableb" style="background-color:' + color + '" title="' + title + '">' + spanText + '</span>';
                    return vo + pvo;
                }
            }
            , {
                field: 'netReceipts', title: '实际收款', width: 65, align: 'center', hide: true, sort: false, unresize: false
            }
            , {
                field: 'refundFee', title: '退款', width: 55, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let title = '没有退款';
                    if (res.refundFee > 0) {
                        title = '退款金额：' + res.refundFee + '元，退款方式：' + res.refundModel + '，退款时间：' + res.refundTimeStr + '，操作人：' + res.refundUserName + '，若要更改，请到管理订单列表里操作';
                    }
                    let label = '<a href="javascript:void(0)" class="refundFee" data-id="' + res.orderId + '" data-fee="' + res.refundFee + '" data-refundmodel="' + res.refundModel + '" style="' + (res.refundFee > 0 ? "color:red" : "color:#999") + '" lay-tips=' + title + '>' + res.refundFee + '</a>';
                    return label;
                }
            }
            , {
                field: 'empType', title: '账单属性', align: 'center', width: 65, sort: false,
                unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.empType == '效绩提成') {
                        vo = '<span style="color:#5FB878">打手的</span>';
                    }
                    else if (res.empType == '接单提成') {
                        vo = '<span style="color:#5FB878">客服的</span>';
                    }
                    else {
                        vo = '<span style="color:#2F4056">' + res.empType + '</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'orderId', title: '关联订单', width: 110, unresize: false, templet: function (res) {
                    let tipb = '<span class="lableb" style="background-color:#FF534D" title="该订单已被删除了">删</span>';
                    if (res.orderIsDel != "Y") {
                        tipb = '';
                    }
                    let vo = tipb + '<a href="javascript:void(0);" class="orderdetails" data-id="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情">' + res.jionOrder + '</a>';
                    return vo;
                }
            }
            , {
                field: 'taskId', title: '排团号', width: 50, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0)" class="taskGroup" data-id="' + res.taskId + '" title="点击可以看排团详情">' + res.taskId + '</span>';
                    return vo;
                }
            }
            , {
                field: 'imgCount', title: '传图数', width: 50, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0)" class="orderimage" data-id="' + res.orderId + '" title="点击可以看截图">' + res.imgCount + '</span>';
                    return vo;
                }
            }
            , {
                field: 'gameRole', title: '角色名', width: 100, unresize: false, templet: function (res) {
                    return '<span title="">' + res.gameRole + '</span>';
                }
            }
            , {
                field: 'dlProject', title: '订单项目', align: 'left', unresize: false, templet: function (res) {
                    let vo = '<span>' + res.dlProject + '</span>';
                    return vo;
                }
            }
            , {
                field: 'kefu', title: '销售客服', align: 'center', width: 60, unresize: false
            }
            , {
                field: 'orderSta', title: '订单状态', width: 65, align: 'center', unresize: false, templet: function (res) {
                    let colorStr = '#b0aeae;';
                    switch (res.orderSta) {
                        case '待上号':
                            colorStr = '#585858';
                            break;
                        case '代练中':
                            colorStr = '#219227';
                            break;
                        case '待验收':
                            colorStr = '#ff6a00';
                            break;
                        case '已完成':
                            colorStr = '#0094ff';
                            break;
                        case '已暂停':
                            colorStr = '#FF5722';
                            break;
                        case '问题单':
                            colorStr = '#ff0000';
                            break;
                        case '已退单':
                            colorStr = '#efaaaa';
                            break;
                    }
                    let str = '<a href="javascript:void(0)" class="lableb setdlsta" data-id="' + res.orderId + '" title="当前订单状态：' + res.orderSta + '" style="background-color:' + colorStr + ';">' + res.orderSta + '</a>';

                    return str;
                }
            }
            , {
                field: 'wangwang', title: '旺旺/YY', width: 60, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let tbww = '';
                    if (res.wangwang != undefined && res.wangwang != null && res.wangwang != '') {
                        tbww = '<a href="http://amos.alicdn.com/getcid.aw?v=2&uid=' + res.wangwang + '&site=cntaobao&s=2&groupid=0&charset=utf-8" target="_blank" title="点击可以与买家对话">' + res.wangwang + '</a>';
                    }
                    return tbww;
                }
            }
            , {
                field: 'taobaoPrice', title: '淘宝价', width: 60, align: 'center', sort: false, hide: true, unresize: false, templet: function (res) {
                    let vo = '<span style="color:#FF5722" title="' + (res.taobaoPrice < 1 ? '点我右边的淘宝状态刷新这里的价格' : res.taobaoPrice) + '">' + (res.taobaoPrice < 1 ? '待刷新' : res.taobaoPrice) + '</span>';
                    return vo;
                }
            }
            , {
                field: 'taobaoSta', title: '淘宝状态', width: 60, align: 'center', unresize: false, templet: function (res) {
                    let colorStr = '#0088CC;';
                    if (res.taobaoSta == '') {
                        res.taobaoSta = "待刷新";
                        colorStr = '#DDD';
                    }
                    switch (res.taobaoSta) {
                        case '待确认':
                            colorStr = '#FAA732';
                            break;
                        case '交易成功':
                            colorStr = '#5BB75B';
                            break;
                        case '交易关闭':
                            colorStr = '#DA4F49';
                            break;
                    }
                    let str = '<a href="javascript:void(0)" class="lableb refshTB" data-id="' + res.orderId + '" title="当前淘宝对应订单状态：' + res.taobaoSta + '，单击可以刷新" style="background-color:' + colorStr + ';">' + res.taobaoSta + '</a>';

                    return str;
                }
            }
            , {
                field: 'createTime', title: '记录时间', align: 'center', width: 80, unresize: false, templet: function (res) {
                    let vo = '<span>' + res.createTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'completeTime', title: '完成时间', align: 'center', width: 80, unresize: false, templet: function (res) {
                    let vo = '<span>' + res.completeTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'exceedHours', title: '是否超时', width: 70, align: 'center', unresize: false, templet: function (res) {
                    let remark = '未超时';
                    let color = "#5FB878";
                    if (res.exceedHours < 0) {
                        color = "#E03636";
                        remark = '超' + res.exceedHours.toString().replace('-', '') + '小时';
                    }
                    let vo = '<a href="javascript:void(0)" style="color:' + color + '" title="预期完成时间：' + res.expectEndTime + '，要求时效：' + res.timeLimitHours + '小时内完成，实际提交订单完成时间：' + res.completeTime + '，' + (res.exceedHours >= 0 ? '提前' + res.exceedHours + '小时完成' : '超过预定时限' + res.exceedHours.toString().replace('-', '') + '小时') + '">' + remark + '</a>';
                    return vo;
                }
            }
            , {
                field: 'logUserName', title: '记录者', align: 'center', width: 70, unresize: false, templet: function (res) {
                    let vo = '<span lay-tips="由' + res.logUserName + '记录此条账单(也是发单人)">' + res.logUserName + '</span>';
                    return vo;
                }
            }
            , {
                field: 'settingSta', title: '结账状态', width: 60, align: 'center', unresize: false, sort: false, templet: function (res) {
                    let str = '<a href="javascript:void(0)" class="lableb setSett" data-id="' + res.empId + '" title="' + (res.settingSta == 'Y' ? '该笔订单已结账过' : '该笔订单还未进行结账') + '" style="background-color:' + (res.settingSta == 'Y' ? '#9ACD32' : '#CDC8B1') + ';">' + (res.settingSta == 'Y' ? '已结账' : '未结账') + '</a>';
                    return str;
                }
            }
            , {
                field: 'settingTime', title: '结账时间', width: 75, align: 'center', unresize: false, templet: function (res) {
                    let vo = '<span>' + res.settingTime + '</span>';
                    return vo;
                }
            }
            , {
                field: 'empPayId', title: '结账方式', width: 60, hide: true, align: 'center', unresize: false, templet: function (res) {
                    let vo = '<span class="lableb" style="background-color:#0094ff">' + (res.empPayId > 0 ? "在线结算" : "") + '</span>';
                    return vo;
                }
            }
            , {
                field: 'applicationSett', title: '申请清算', width: 60, align: 'center', unresize: false, templet: function (res) {
                    let vo = '';
                    if (res.applicationSett == 'Y') {
                        vo = '<span style="color:#E03636" title="' + res.userName + '主动申请了该笔绩效结算">主动申请</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'empRemark', title: '备注说明', width: 80, unresize: false, templet: function (res) {
                    let remark = res.empRemark == null || res.empRemark == '' ? '无' : res.empRemark;
                    let vo = '<a href="javascript::" style="color:#E03636" class="empRemark" lay-tips="' + res.empRemark + '" data-remark="' + remark + '" data-id="' + res.orderId + '" data-eid="' + res.empId + '">' + remark + '</a>';
                    return vo;
                }
            }
        ]]
        , page: true
        , limit: 50
        , limits: [10, 20, 30, 40, 50, 100, 200, 300]
        , done: function (res, curr, count) {
            page = curr;
            if (res.msg == "请先登录") {
                layer.msg("登录过期了，请重新登录系统");
                return;
            }
            if (res.msg.indexOf('时间范围') > -1) {
                layer.msg(res.msg);
                return;
            }
            let profit1 = res.total.totalOrderPrice - res.total.TotalReFundAmount - res.total.totalTempAmount;
            let profit2 = res.total.totalOrderPrice - res.total.TotalReFundAmount - res.total.totalBonusAmount;
            var total = '本次筛选条件下共计' + res.total.totalCount + '条记录，总计【预计绩效' + res.total.totalTempAmount + '元，生效绩效' + res.total.totalBonusAmount + '元，' + (showDeductFee ? '扣点金额' + res.total.totalDeductFee + '元，' : '') + '订单金额' + res.total.totalOrderPrice + '元，记录退款金额' + res.total.TotalReFundAmount + '，预计差额利润' + profit1.toFixed(2) + '元，已生效差额利润' + profit1.toFixed(2) + '】，默认显示最近3个月数据，若需扩大时间范围，可手动选择起始日期';
            $("#total").html(total);
            selectLineRowTotalPrice = []
            $('.selectTotal').html('')

        }

    });
    table.on('edit(tableList)', function (obj) {
        if (obj.field == "tempAmount") {
            if (!VerifyMoeny(obj.value)) {
                layer.msg('预计绩效金额格式不正确，请重新编辑，此次编辑无效', { time: 1500 }, function () {
                });
                return false;
            }
            changeFee(obj.data.empId, obj.value, 10);
        }
        else if (obj.field == "bonusAmount") {
            if (!VerifyMoeny(obj.value)) {
                layer.msg('生效绩效金额格式不正确，请重新编辑，此次编辑无效', { time: 1500 }, function () {
                });
                return false;
            }
            changeFee(obj.data.empId, obj.value, 20);
        }
    });
    form.on('select(selectSeach1)', function (data) {
        recUserName = ''
        var value = data.value;
        if (value == 10) {
            sechbtnValue = false
            form.render();
            layer.prompt({
                formType: 2,
                value: '',
                btn: ['搜索', '关闭'],
                title: '按系统用户昵称批量查询，每行一条。注意：该搜索会排除其它搜索条件',
                area: ['520px', '300px'] // 自定义文本域宽高 
                , end: function () {
                    sechbtnValue = true
                    //关闭
                    endBatchOrderKeyLayer();
                }
            }, function (value, index, elem) {
                echbtnValue = true
                if (value == null || value == undefined || value == '') {
                    layer.msg('搜索项不能为空');
                    layer.close(index); // 关闭层
                    endBatchOrderKeyLayer();
                    return false;
                }
                recUserName = value.replace(/\r?\n/g, ',');
                layer.close(index); // 关闭层
                page = 1;
                reloadOrderList();
            })
        } else {
            recUserName = ''
        }

        return false;
    });

    form.on('select(selectSeach2)', function (data) {
        var value = data.value;
        sechbtnValue = false
        if (value == 10) {
            layer.prompt({
                formType: 2,
                value: '',
                btn: ['搜索', '关闭'],
                title: '按单号批量查询，每行一笔单号。注意：该搜索会排除其它搜索条件',
                area: ['520px', '300px'] // 自定义文本域宽高 
                , end: function () {
                    sechbtnValue = true
                    //关闭
                    endBatchOrderKeyLayer2();
                }
            }, function (value, index, elem) {
                sechbtnValue = true
                if (value == null || value == undefined || value == '' || value.length < 5) {
                    layer.msg('单号格式不符合要求');
                    layer.close(index); // 关闭层
                    endBatchOrderKeyLayer2();
                    return false;
                }
                key1 = value.replace(/\r?\n/g, ',');
                allIds = []; //清除勾选的记录
                layer.close(index); // 关闭层
                page = 1;
                reloadOrderList();
            })
        } else {
            key1 = ''
        }
        return false;
    });
    function endBatchOrderKeyLayer() {
        form.render($('#selectSeach1'));
    }
    function endBatchOrderKeyLayer2() {
        form.render($('#selectSeach2'));
    }
    table.on('toolbar(tableList)', function (obj) {
        console.log(obj)
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'refrshTaobaoBtn':
                var empids = '';
                var orderids = '';
                var tempData = [];
                var tempDataOrderId = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                        tempDataOrderId.push(data[i].orderId);
                    };
                    empids = tempData.join(',');
                    orderids = tempDataOrderId.join(',');
                }
                refrshTaobaoSta(empids, orderids);
                break;
            case 'settBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var empids = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empids = tempData.join(',');
                }
                settSta(empids);
                break;
            case 'batchDeductFee':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var empids = '';
                var tempData = [];
                var empidsList = []
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].bonusAmount > 0 && data[i].settingSta != 'Y') {
                            tempData.push(data[i].empId);
                            empidsList.push(data[i])
                        }
                    };
                }
                if (empidsList.length == 0) {
                    layer.msg('您所勾选的账单明细，全都不符合扣点条件：【生效绩效大于0】并且【未被禁止结算】')
                    return false
                }
                settFee(empidsList, tempData);
                break;
            case 'changeRemarkBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var empids = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empids = tempData.join(',');
                }
                setEmpRemark(empids, '');
                break;
            case 'checkIdenticalAlipayAccBtn':
                rankLayer = layer.open({
                    title: "重复收款支付宝子账号检测",
                    shade: [0.3, '#333'],
                    shadeClose: isPc ? true : false,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 8,
                    closeBtn: isPc ? 0 : 1,
                    maxmin: isPc ? false : true,
                    area: [isPc ? '38%' : '95%', isPc ? '90%' : '95%'],
                    content: $(".checkAliPayAccDiv"),
                    cancel: function (index, layero) {
                        $('.checkAliPayAccDiv').hide();
                    },
                    end: function (index, layero) {
                        $('.checkAliPayAccDiv').hide();
                    }
                });
                if (!isPc) {
                    layer.full(rankLayer);
                }
                getCheckIdenticalAliPayAcc();
                break;
            case 'payToBalanceBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                //var empids = '';
                //var tempData = [];
                //if (parseInt(checkStatus.data.length) > 0) {
                //    var data = checkStatus.data;
                //    for (let i = 0; i < data.length; i++) {
                //        tempData.push(data[i].empId);
                //    };
                //    empids = tempData.join(',');
                //}
                //payIds = empids;
                //payToRec(true, 1);
                break;
            case 'payBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var empids = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    //console.log('勾选的：' + JSON.stringify(data));
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empids = tempData.join(',');
                }
                payIds = empids;
                payToRec(true, payMode);
                break;
            case 'payBalanceBtn':
                payjdp();
                break;
            case 'lyfzBalance':
                getLingyuefangzhouPop();
                break;
            case 'changeStaBtn':
                oids = '';
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var ods = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].orderId);
                    };
                    ods = tempData.join(',');
                }
                oids = ods;
                changeOrderSta();
                break;
            case 'exportBtn':
                exportEmp();
                break;
            case 'delEmpBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var empids = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].empId);
                    };
                    empids = tempData.join(',');
                }
                delEmp(empids);
                break;
            case 'sendSmsBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var IDX = [];
                var data = checkStatus.data;
                for (let i = 0; i < data.length; i++) {
                    IDX.push(data[i].orderId);
                };
                var IDX = IDX.join(',');
                sendSms(IDX);
                break;
        };
    });

    table.on('checkbox(tableList)', function (obj) {
        if (obj.checked == true) {
            //勾选
            if (obj.type == 'one') {
                //单选
                let selectModel = {
                    empId: obj.data.empId,
                    orderId: obj.data.orderId,
                    price: obj.data.price,
                    tempAmount: obj.data.tempAmount,
                    bonusAmount: obj.data.bonusAmount
                };
                if ($.inArray(selectModel, selectLineRowTotalPrice) == -1) {
                    $.each(selectLineRowTotalPrice, function (idx, item) {
                        if (item.orderId == selectModel.orderId) {
                            selectModel.price = 0;
                        }
                    })
                    selectLineRowTotalPrice.push(selectModel);
                }
            } else {
                //全选
                selectLineRowTotalPrice = [];
                var selectedData = table.checkStatus('tableList').data;
                $.each(selectedData, function (idx, item) {
                    let selectModel = {
                        empId: item.empId,
                        orderId: item.orderId,
                        price: item.price,
                        tempAmount: item.tempAmount,
                        bonusAmount: item.bonusAmount
                    };
                    selectLineRowTotalPrice.push(selectModel);
                });
            }
        } else {
            //反选
            if (obj.type == 'one') {
                let s = selectLineRowTotalPrice.length;
                for (var i = 0; i < selectLineRowTotalPrice.length; i++) {
                    if (selectLineRowTotalPrice[i].empId == obj.data.empId) {
                        selectLineRowTotalPrice.splice(i, 1);
                    }
                }
            } else {
                selectLineRowTotalPrice = [];
            }
        }
        let totalArry = new Array();
        let totalSelectTotal1 = 0;
        let totalSelectTotal2 = 0;
        let totalSelectTotal3 = 0;
        $.each(selectLineRowTotalPrice, function (idx, item) {
            let thisOrderPrice = item.price;
            $.each(totalArry, function (idx2, item2) {
                if (item.orderId == item2.orderId) {
                    thisOrderPrice = 0;
                    return;
                }
            });
            let totalModel = {
                empId: item.empId,
                orderId: item.orderId,
                price: thisOrderPrice,
                tempAmount: item.tempAmount,
                bonusAmount: item.bonusAmount
            };
            totalArry.push(totalModel);
        });
        console.log(selectLineRowTotalPrice)

        $.each(totalArry, function (idx, item) {
            totalSelectTotal1 += item.price;
            totalSelectTotal2 += item.tempAmount;
            totalSelectTotal3 += item.bonusAmount;
        });

        if (totalSelectTotal1 == 0 && totalSelectTotal2 == 0 && totalSelectTotal3 == 0) {
            $('.selectTotal').html('');
        }
        else {
            $('.selectTotal').html('(勾选接单价总计：' + totalSelectTotal1 + '，预计要结算总计：' + totalSelectTotal2 + '，实际要结算总计：' + totalSelectTotal3 + ')');
        }
    });
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    form.on('select(customerType)', function (data) {
        if (data.value == 10) {
            getCustomerTypeAssUser();
        }
        else {
            getCustomerService();
        }
        return false;
    });
    function getCustomerTypeAssUser() {
        var soureData = [];
        $.get('/UserAjax/GetZpRootUsers?gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
        });
    }
    function reloadOrderList() {
        $('.selectTotal').html('');
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        var dateType = $("#dateType").val();
        var settingSta = formSelects.value('settingSta', 'valStr');
        var taskId = formSelects.value('taskSelect', 'valStr');
        var orderSta = formSelects.value('orderSta', 'nameStr');
        var taobaoSta = formSelects.value('taobaoSta', 'nameStr');
        var recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
            ? RecUserSelect.getValue('valueStr')
            : '';
        var kefu = formSelects.value('inputOrderKefu', 'nameStr');
        var applicationSetSta = $("input[name='applicationSetSta']").prop('checked') === true ? 10 : 0;
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var skey = $("#key1").val();
        var skey2 = $("#key2").val();
        var skey3 = $("#key3").val();
        var orderType = $("#orderType").val();
        var customerType = $("#customerType").val();
        var isCert = $("#isCert").val();
        var furlSta = $("#furlSta").val();
        var keyvalue = key1 ? key1 : skey

        taobaoSeachParam = {
            gameName: gameName,
            stime: sDate,
            etime: eDate,
            dateType: dateType,
            empType: empType,
            settingSta: settingSta,
            orderSta: orderSta,
            taobaoSta: taobaoSta,
            recUser: recUser,
            kefu: kefu,
            applicationSetSta: applicationSetSta,
            key: keyvalue,
            key2: skey2,
            key3: skey3,
            orderSoure: orderSoure,
            orderType: orderType,
            customerType: customerType,
            furlSta: furlSta,
            recUserName: recUserName,
        };

        seachParam = 'gameName=' + gameName + '&stime=' + sDate + '&etime=' + eDate + '&dateType=' + dateType + '&empType=' + empType + '&settingSta=' + settingSta
            + '&orderSta=' + orderSta + '&taobaoSta=' + taobaoSta + '&recUser=' + recUser + '&kefu=' + kefu
            + '&applicationSetSta=' + applicationSetSta + '&key=' + keyvalue + '&key2=' + skey2 + '&orderSoure=' + orderSoure + '&taskId=' + taskId + '&key3=' + skey3 + "&orderType=" + orderType
            + '&customerType=' + customerType + '&isCert=' + isCert + '&furlSta=' + furlSta + '&recUserName=' + recUserName;

        tableList.reloadData({
            url: '/EmpAjax/GetEmpList?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        getJdpBalance();
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
            content: '/Order/OrderView?viewType=20&orderId=' + orderid
        });
    }
    function sendSms(orderID) {
        layer.open({
            title: "对指定订单客户发送短信",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['80%', '380px'],
            content: '/Order/SendSms?orderId=' + orderID
        });
    }
    function exportEmp() {
        window.open("/Emp/ExportEmp?" + seachParam, "_blank");
        var index = layer.getFrameIndex(window.name);
        layer.close(index);
        return false;
    }
    function refrshTaobaoSta(ids, orderids) {
        layer.confirm('需要什么样的刷新方式？', {
            area: [isPc ? '618px' : '95%', isPc ? '160px' : '80%'],
            btn: ['只对当前筛选结果进行刷新', '对所勾选的结果进行刷新', '刷新系统内前1万笔来淘宝订单']
            , btn3: function (index) {
                refTbAllData(index);
                return false;
            }
        }, function (index) {
            refTbSeachData(index);
            return false;
        }, function (index) {
            refTbSelectData(orderids, index);
            return false;
        });
        return false;


    }
    function refTbSeachData(index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/RefshPlatformOrderStatusByTaoBao",
            data: { seachParam: JSON.stringify(taobaoSeachParam) },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(indexLoad);
                layer.close(index);
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 4000 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 3000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function refTbAllData(index) {
        layer.confirm('该过程将在后台请求同步前10000笔淘宝的订单状态，每次更新间隔需在1小时24分钟左右！', {
            btn: ['确定', '取消']
        }, function (index) {
            if (!re)
                return false;
            re = false;
            //请求
            $.ajax({
                type: "Post",
                url: "/EmpAjax/RefshPlatformOrderStatusByTaoBao",
                data: { orderId: "" },
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
        });
        return false;
    }
    function refTbSelectData(idx, index) {
        if (idx == null || idx == undefined || idx == '') {
            layer.msg('请勾选要刷新订单记录');
            return false;
        }
        if (!re)
            return false;
        re = false;
        //请求
        $.ajax({
            type: "Post",
            url: "/EmpAjax/RefshPlatformOrderStatusByTaoBao",
            data: { orderId: idx },
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
    }
    var popIndex
    function settFee(data, ids) {
        console.log(data, ids)
        var tempAmountNum = 0
        data.forEach(item => {
            tempAmountNum += item.tempAmount
        })
        popIndex = layer.open({
            type: 1,
            area: [isPc ? '544px' : '90%', isPc ? '458px' : '70%'],
            shadeClose: false,
            title: '扣点',
            content: `
                <blockquote class="layui-elem-quote">
                  您正在进行给代练打手或销售人员进行账单扣点，请注意扣税方式与订单是否有误！注意：已结算账单无法完成扣点修改，请先对账单完成扣点后再修改账单结算状态。
                </blockquote>
                <form class="layui-form" action="" style="margin: 20px 20px;">
                    <div class="layui-form-item" style="margin-top:10px">
                        <label class="layui-form-label" style="width:90px;padding: 9px 9px;"><span class="layui-font-red">*</span>所选订单笔数</label>
                        <div class="layui-input-block" style="line-height: 36px;">
                            ${data.length}笔
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label" style="width:90px;padding: 9px 9px;"><span class="layui-font-red">*</span>预计绩效总计</label>
                        <div class="layui-input-block"  style="line-height: 36px;">
                            ${tempAmountNum}元
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label" style="width:90px;padding: 9px 9px;">扣点方式</label>
                        <div class="layui-input-block">
                            <input type="radio" lay-filter="DeductMode" name="DeductMode" value="0" title="按比例扣除" checked>
                            <input type="radio" lay-filter="DeductMode" name="DeductMode" value="1" title="扣除固定金额" > 
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label" style="width:90px;padding: 9px 9px;">扣点比例/金额</label>
                        <div class="layui-input-block" style="display: flex;align-items: center;">
                            <input type="text" style="" name="DeductValue" id="DeductValue lay-verify="number"  autocomplete="off" class="layui-input" ><span class="DeductValueTips" style="margin-left:10px">%</span>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <button style="margin-top:30px" class="layui-btn layui-btn-lg layui-btn-normal" lay-submit="" lay-filter="saveMangeBtn">确定扣除或修改</button>
                        </div>
                    </div>
                </form>
            `,
            success: function () {
                form.render();
                form.on('radio(DeductMode)', function (data) {
                    var elem = data.elem; // 获得 radio 原始 DOM 对象
                    var value = elem.value; // 获得 radio 值

                    if (value == 0) {
                        $('.DeductValueTips').text('%')
                    } else {
                        $('.DeductValueTips').text('元')
                    }

                    layer.msg(['value: ' + value, 'checked: ' + checked].join('<br>'));
                });
                form.on('submit(saveMangeBtn)', function (data) {
                    var field = data.field;
                    field.Bills = ids
                    if (field.DeductMode == 0 && Number(field.DeductValue) > 100) {
                        layer.msg('扣点比例不能超过100%')
                        return false
                    }
                    if (field.DeductMode == 1 && Number(field.DeductValue) > tempAmountNum) {
                        layer.msg('扣点金额不能超过预计绩效总计')
                        return false
                    }
                    $.ajax({
                        type: "Post",
                        url: "/EmpAjax/BatchDeductFee",
                        data: JSON.stringify(field),
                        contentType: "application/json",
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                        success: function (data) {
                            re = true;
                            layer.close(popIndex);
                            layer.msg(data.msg)
                            reloadOrderList();
                            return false;
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    });
                    return false; // 阻止默认 form 跳转
                });
            }
        })
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
    function delEmp(ids) {
        layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理，请勿随意删除绩效', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/DelEmp",
                data: { empId: ids },
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
    function changeFee(id, fee, type) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/ChangeOrderRecPrice",
            data: { empId: id, fee: fee, type: type },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                reloadOrderList();
                layer.msg(data.msg, { time: 2000 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $(document).on('click', '.refshTB', function () {
        var orderId = $(this).attr('data-id');
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/RefshPlatformOrderStatusByTaoBao",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 3000 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 4000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    })
    $(document).on('click', '.setSett', function () {
        var empId = $(this).attr('data-id');
        settSta(empId);
        return false;
    })
    function getJdpBalance() {
        $.ajax({
            type: "Post",
            url: "/EmpAjax/GetJdpBalance",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $(".jdpBalance2").html('平台余额充值【当前余额' + data.code + '】');
                $(".jdpBalance").html(data.code);
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getLingyuefangzhouPop() {
        var index = layer.open({
            title: '代结算款充值',
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '800px' : '95%', isPc ? '745px' : '95%'],
            content: '//www.lingyuefangzhou.com/Pay/SystemReCharge?sid=' + $('#sid').val(),
        })
    }

    function getLingyuefangzhouBalance() {
        $.ajax({
            type: "GET",
            url: "/EmpAjax/GetLingyuefangzhouSystemSettleBalance",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                //$(".jdpBalance2").html('平台余额充值【当前余额' + data.code + '】');
                $(".lingyuefangzhouBalance").html(data.code);
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function payToRec(isOpenWin, ptype) {
        if (payIds == '' || payIds == null || payIds == undefined) {
            layer.msg('请重新勾选');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/EmpAjax/CheckOnlinePaySetRecName",
            data: { ids: payIds, ptype: ptype },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    var acceptAgreeMent = data.acceptAgreeMent;
                    var acceptAgreeMentInfo = data.acceptAgreeMentInfo;
                    if (acceptAgreeMent != "Y") {
                        certAgreemantLayer = layer.open({
                            title: "请仔细阅读以下协议条款",
                            shade: [0.3, '#333'],
                            shadeClose: false,
                            type: 2,
                            skin: 'class-layer-demo-custom',
                            anim: 3,
                            closeBtn: 0,
                            area: [isPc ? '900px' : '85%', isPc ? '780px' : '90%'],
                            content: '../html/EmployeeSettAgreement.html',
                            btn: ['我同意', '不同意'],
                            btn1: function (index, layero, that) {
                                layer.close(certAgreemantLayer);
                                agreenFunc();
                                GoSettWindows(payMode, data, ptype, isOpenWin, acceptAgreeMent, acceptAgreeMentInfo);
                            },
                            btn2: function (index, layero, that) {
                                layer.close(certAgreemantLayer);
                                return false;
                            }
                        });
                    }
                    else {
                        GoSettWindows(payMode, data, ptype, isOpenWin, acceptAgreeMent, acceptAgreeMentInfo);
                    }
                }
                else {
                    layer.alert(data.msg);
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

    }
    function GoSettWindows(payMode, data, ptype, isOpenWin, acceptAgreeMent, acceptAgreeMentInfo) {
        let service = payMode == 0 || payMode == 2 ? 0.8 : 0.6;
        let serviceObject = $("#serviceObject").val();
        let samount = service / 100;
        let model = data.data;
        let serviceAmount = parseFloat((model.amount * samount).toFixed(2));
        if (serviceAmount < 0.1) {
            serviceAmount = 0.1;
        }
        let recRealAmount = serviceObject != 1 ? parseFloat((model.amount - serviceAmount).toFixed(2)) : model.amount;

        $('.count').html(data.code);
        $('.recCount').html(model.recCount);
        $('.setAmount').html(model.amount);
        if (acceptAgreeMent == 'Y') {
            $('.acceptAgreeMent').html(`<a style='color:#999;margin-left: 146px;'  href="/html/EmployeeSettAgreement.html" target="_blank"  lay-tips='${acceptAgreeMentInfo}'>您已签署《系统雇员业务费用结算服务协议》点击查看协议内容</a>`);
        }
        if (ptype != 2) {
            $('.serviceAmount').html(serviceAmount);
            $('.payAmount').html(serviceObject != 1 ? model.amount : parseFloat((model.amount + serviceAmount).toFixed(2)));
            $('.recRealAmount').html(recRealAmount);
            $('.alipayUserName').html(model.alipayAccName);
            $('.alipayAcc').html(model.alipayAcc);
        }
        $('.recManName').html(model.recManName);
        $('.jdpBalance').html(model.jdpBalance);
        jdpyue = model.jdpBalance;
        payamount = serviceObject != 1 ? model.amount : parseFloat((model.amount + serviceAmount).toFixed(2));

        if (payMode == 2) {
            getLingyuefangzhouBalance();
        }
        if (data.reAlipayErrorMsg != '' && data.reAlipayErrorMsg != null) {
            layer.alert('系统中存在多个重复收款支付宝的子账号：<br/>' + data.reAlipayErrorMsg, {
                icon: 5,
                shadeClose: true,
                title: '重要提醒',
                zIndex: 99999999
            }, function (lxx) {
                layer.close(lxx);
            });
        }

        if (ptype != 2) {
            if (payamount <= 0) {
                layer.msg("需结算金额为0，无需在线打款");
                return false;
            }
        }
        if (isOpenWin) {
            openSetPayWindow(model.recManName, ptype);
        }
    }

    function openSetPayWindow(recMan, ptype) {
        setWindows = layer.open({
            title: ptype == 0 || ptype == 2 ? "结算账单并给打手划款：" + recMan : "在线清算打款给接手人：" + recMan,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '50%' : '90%', isPc ? '88%' : '95%'],
            content: $(".pay"),
            cancel: function () {
                $(".pay").hide();
            },
            end: function () {
                $(".pay").hide();
            }
        });
    }
    form.on('submit(payBtn)', function (data) {
        payjdp();
        return false;
    });
    function payjdp() {
        var jdp = $("#jdp").val();
        layer.open({
            title: "平台余额充值",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '1080px' : '90%', isPc ? '560px' : '90%'],
            content: '/PlatformRedirect/pay/SystemInPay?jdp=' + jdp
        });
        return false;
    }
    form.on('submit(payBtn2)', function (data) {
        var sid = $("#sid").val();
        layer.open({
            title: "代结算款充值",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '1080px' : '90%', '90%'],
            content: 'https://trust.lingyuefangzhou.com/pay/SystemRecharge?sid=' + sid
        });
        return false;
    });
    form.on('submit(refBtn)', function (data) {
        payToRec(false, payMode);
        return false;
    });
    //form.on('submit(ref2Btn)', function (data) {
    //    payToRec(false, 1);
    //    return false;
    //});
    /**
     * payMode 0=模式1，1=模式2-1，3=模式2-2，2=模式3
     */
    form.on('submit(payOkBtn)', function (data) {
        let minFee = 1;
        if (payMode == 1 || payMode == 3) {
            minFee = 30;
        }
        if (payIds == '' || payIds == null || payIds == undefined) {
            layer.msg('请重新勾选');
            return false;
        }
        if (payamount <= 0) {
            layer.msg("需结算金额为0，无需在线打款");
            return false;
        }
        if (payamount < minFee) {
            layer.msg("需结算金额不能小于" + minFee + "元，小于" + minFee + "元的请直接线下打款系统里改结账状态就行");
            return false;
        }
        if (payMode == 0) {
            if (payamount > jdpyue) {
                layer.msg("当前系统绑定的平台账户余额不足以支付打款金额，请在当前界面余额右边充值后，再刷新本界面进行操作");
                return false;
            }
        }
        let authId = payMode == 3 ? data.field.selectPayAlipay2 : data.field.selectPayAlipay;
        layer.confirm('请再次确认是否核对正确，确认后将发起结算请求', function (index2) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/OnlinePaySetRec",
                data: { ids: payIds, payMode: payMode, authId: authId },
                dataType: 'json',
                cache: false,
                timeout: 300000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (payMode == 1 || payMode == 3) {
                        if (data.code > 0 && data.msg != '') {
                            let bizId = data.msg;
                            layerWindows = layer.open({
                                type: 1,
                                area: '300px;',
                                title: '请完成支付宝转账',
                                shade: 0.8,
                                id: 'LAY_layuipro2',
                                btn: ['已处理完成', '查看失败的'],
                                btnAlign: 'c',
                                shadeClose: false,
                                maxmin: false,
                                anim: 0,
                                content: '<div style="padding:20px; line-height: 23px; background-color: #393D49; color: #fff; ">请在新弹出的页面里完成支付宝支付流程。完成后请等待1分钟左右刷新列表，系统会自动更新已转账的结算状态</div>',
                                btn1: function (index, layero, that) {
                                    layer.close(index2);
                                    layer.close(layerWindows);
                                    layer.close(index);
                                    layer.closeAll();
                                    reloadOrderList();
                                },
                                btn2: function (index, layero, that) {
                                    if (!re) { return false; }
                                    $.ajax({
                                        type: "Post",
                                        url: "/EmpAjax/OnlinePaySetRecGetFailResult",
                                        data: { bizId: bizId, payMode: payMode },
                                        dataType: 'json',
                                        cache: false,
                                        timeout: 60000,
                                        error: function () {
                                            layer.msg('系统繁忙！'); re = true;
                                            layer.close(indexLoad);
                                        },
                                        beforeSend: function (XMLHttpRequest) {
                                            indexLoad = layer.load(1, { shade: false });
                                        },
                                        success: function (data) {
                                            re = true;
                                            layer.alert(data.msg, function (lxs) {
                                                layer.close(index2);
                                                layer.close(lxs);
                                                layer.close(layerWindows);
                                                layer.closeAll();
                                                reloadOrderList();
                                            });
                                            return false;
                                        },
                                        complete: function (XMLHttpRequest) {
                                            layer.close(indexLoad);
                                        }
                                    });
                                },
                                success: function (layero, index, that) {
                                    let toHost = payMode == 3 ? 'https://trust.lingyuefangzhou.com' : '/PlatformRedirect';
                                    util.openWin({
                                        url: toHost + '/pay/BySystemIsvPaySubmit?bizid=' + bizId
                                    });
                                }
                            });
                        } else {
                            layer.alert(data.msg);
                        }
                    }
                    else {
                        if (data.code > 0) {
                            layer.alert(data.msg);
                            layer.close(setWindows);
                            reloadOrderList();
                        }
                        else {
                            layer.alert(data.msg);
                        }
                    }
                },
                complete: function (XMLHttpRequest) {
                    re = true;
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    });
    $(document).on('click', '.orderimage', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: "查看订单截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', isPc ? '85%' : '500px'],
            content: '/order/PicMange?orderId=' + ids
        });
        return false;
    });
    $(document).on('click', '.taskGroup', function () {
        var taskid = $(this).attr('data-id');
        if (taskid > 0) {
            layer.open({
                title: taskid + "排团详情",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '90%'],
                content: '/Group/GroupDetails?taskID=' + taskid
            });
        }
    })
    function changeOrderSta() {
        form.val("eps", {
            "sremark": "",
            "asnyTb": "N"
        });
        $('input[name=chstatus]').prop('checked', false);
        form.render('radio');
        setWindows = layer.open({
            title: "更改订单状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '230px'],
            content: $('.stadiv'),
            end: function () {
                $('.stadiv').hide();
            }
        });
    }
    form.on('radio(chstatus)', function (data) {
        if (data.value == '问题单' || data.value == '已暂停' || data.value == '已退单') {
            $(".remark").show();
            $("#remark").focus();
            $(".asnyTb").hide();
        }
        else if (data.value == '已完成') {
            $(".asnyTb").show();
            $(".remark").hide();
        }
        else {
            $(".asnyTb").hide();
        }
    });
    form.on('submit(ssavebtn)', function (data) {
        if (data.field.chstatus == "" || data.field.chstatus == undefined || data.field.chstatus == null) {
            layer.msg('请选择要改变的状态');
            return false;
        }
        var orderId = oids;
        var sta = data.field.chstatus;
        var remarkMust = data.field.mustRemark;
        var remark = data.field.sremark;
        if (remarkMust == "Y") {
            if (sta == "问题单" && (remark == null || remark == '' || remark == undefined)) {
                layer.msg('系统要求问题单必须填写原因');
                return false;
            }
        }
        var isAsnyTb = data.field.asnyTb;
        if (!re)
            return false;
        ok = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SetOrderSta",
            data: { orderId: orderId, sta: sta, changeSoureType: 20, remark: remark, isSyncTaoBao: isAsnyTb },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请稍候再试！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    oids = '';
                    layer.close(setWindows);
                    layer.msg(data.msg, { time: 1500 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 6000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    $(document).on('click', '.empRemark', function () {
        var remark = $(this).attr('data-remark');
        var eid = $(this).attr('data-eid');
        setEmpRemark(eid, remark);
    })
    function setEmpRemark(idx, remark) {
        layer.prompt({ title: '修改账单备注', formType: 0, value: remark, maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/ChangeEmpRemark",
                data: { idx: idx, remark: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            layer.close(index);
                            reloadOrderList();
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 3000 }, function () {
                        })
                    }
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    }
    element.on('tab(payTab)', function (data) {
        payMode = parseInt(data.id);
        let setAmount = parseFloat($(".setAmount").html());
        let service = payMode == 0 || payMode == 2 ? 0.008 : 0.006;
        let serviceObject = parseInt($("#serviceObject").val());
        let serviceAmount = parseFloat((setAmount * service).toFixed(2));
        if (serviceAmount < 0.1) {
            serviceAmount = 0.1;
        }
        let recRealAmount = serviceObject != 1 ? parseFloat((setAmount - serviceAmount).toFixed(2)) : setAmount;

        if (serviceObject == 1) {
            let payAmount = setAmount + serviceAmount;
            $('.payAmount').html(payAmount);
        }
        else {
            $('.recRealAmount').html(recRealAmount);
        }
    });
    form.on('submit(payOk2Btn)', function (data) {
        if (payIds == '' || payIds == null || payIds == undefined) {
            layer.msg('请重新勾选');
            return false;
        }
        if (payamount <= 0) {
            layer.msg("需结算金额为0，无需划款");
            return false;
        }
        if (payamount > jdpyue) {
            layer.msg("当前系统绑定的平台账户余额不足以支付划款金额，请在当前界面余额右边充值后，再点击刷新本界面按钮进行操作");
            return false;
        }
        layer.confirm('请再次确认是否核对正确，确认后将发起划款请求', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/EmpAjax/OnlinePaySetRec",
                data: { ids: payIds, ptype: 1 },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    if (data.code > 0) {
                        layer.alert(data.msg);
                        layer.close(setWindows);
                        reloadOrderList();
                    }
                    else {
                        layer.alert(data.msg);
                    }
                },
                complete: function (XMLHttpRequest) {
                    re = true;
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    });
    function getCheckIdenticalAliPayAcc() {
        tableList3 = table.render({
            elem: '#tableList3'
            , url: '/UserAjax/GetCheckIdenticalAliPayAcc'
            , defaultToolbar: []
            , toolbar: '#toolbarDemo3'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 }
                , {
                    field: 'str1', title: '子账号名称', width: 110, unresize: false
                }
                , {
                    field: 'str2', title: '支付宝账号', width: 170, align: 'left', unresize: false
                }
                , {
                    field: 'str3', title: '职位', width: 85, align: 'center', unresize: false
                }
                , {
                    field: 'id2', title: '重复数量', width: 85, align: 'center', sort: true, unresize: false, templet: function (res) {
                        let vo = '<span lay-tips="此收款支付宝账号存在' + res.id2 + '个，该子账号是其中一个">' + res.id2 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str4', title: '当前状态', width: 85, align: 'center', sort: true, unresize: false, templet: function (res) {
                        let vo = res.str4 == 'true' ? '<span class="layui-badge layui-bg-blue">正常</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
            }
        });
        return false;
    }
    function reloadOrderList3() {
        tableList3.reload({
            url: '/UserAjax/GetCheckIdenticalAliPayAcc'
            , where: {
            }
            , page: false
        });
        return false;
    }
    table.on('toolbar(tableList3)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh2':
                reloadOrderList3();
                break;
        };
    });
    function agreenFunc() {
        $.ajax({
            type: "POST",
            url: "/EmpAjax/AcceptSettAgreenMent",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 1000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
                if (data.code > 0) {
                    layer.close(certAgreemantLayer);
                } else {
                    layer.msg(data.msg, { time: 1500 });
                }
                return false;
            },
            complete: function (XMLHttpRequest) {
            }
        });
        return false;
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