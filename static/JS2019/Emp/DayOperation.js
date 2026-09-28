layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'laydate'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var statictype = 10;
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    laydate.render({
        elem: '#sDate'
        , type: 'date'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'date'
    });

    var gameName = "";
    getCustomerService();
    function getCustomerService() {
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
        });
    }
    form.on('select(selectGame)', function (data) {
        gameName = $("#gameName").find("option:selected").text();
        getCustomerService();
        return false;
    });
    getSoureOperationData();
    getTotalPriceTrendData();

    function getSoureOperationData() {
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        gameName = $("#gameName").find("option:selected").text();
        if (gameName == '全部') {
            gameName = '';
        }
        var stime = $("#sDate").val();
        var eDate = $("#eDate").val();
        var kefu = formSelects.value('inputOrderKefu', 'nameStr');
        $.ajax({
            type: "GET",
            url: "/EmpAjax/GetOperationData",
            data: { gameName: gameName, stime: stime, etime: eDate, kefu: kefu },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                var sdata = data.msg;
                if (data.code > 0) {
                    let myChart = echarts.init(document.getElementById('soureOpertion'));
                    option = {
                        title: {
                            text: '订单来源分布图',
                            subtext: '订单主要各个来源分析，已排除已退单的部分，[总计：' + sdata.total + '元]',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: sdata.legend.data
                        },
                        series: [{
                            name: '订单来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: sdata.series.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                }

                re = true;
            },
            complete: function (XMLHttpRequest) {
                getOrderConseType();
                layer.close(indexLoad);
            }
        });
    }

    function getKefuSoureOperationData() {
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        gameName = $("#gameName").find("option:selected").text();
        if (gameName == '全部') {
            gameName = '';
        }
        var stime = $("#sDate").val();
        var eDate = $("#eDate").val();
        var kefu = formSelects.value('inputOrderKefu', 'nameStr');
        $.ajax({
            type: "GET",
            url: "/EmpAjax/GetKeFuOperationData",
            data: { gameName: gameName, stime: stime, etime: eDate, kefu: kefu },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                var sdata = data.msg;
                if (data.code > 0) {
                    let myChart = echarts.init(document.getElementById('KeFuOperation'));
                    option = {
                        color: colors,

                        tooltip: {
                            trigger: 'axis',
                            axisPointer: { type: 'cross' }
                        },
                        grid: {
                            right: '20%'
                        },
                        title: {
                            text: '客服接单统计',
                            subtext: '统计筛选条件范围内有记录的客服接单数量、总金额、退单量，其中订单金额和数据已排除已退单的，[总计：' + sdata.total + '元]',
                            x: 'center'
                        },
                        toolbox: {
                            feature: {
                                dataView: { show: false, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                data: sdata.days
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '单数',
                                min: 0,
                                max: sdata.maxnumber,
                                position: 'right',
                                axisLine: {
                                    lineStyle: {
                                        color: colors[0]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            },
                            {
                                type: 'value',
                                name: '总金额',
                                min: 0,
                                max: sdata.maxprice,
                                position: 'right',
                                offset: 80,
                                axisLine: {
                                    lineStyle: {
                                        color: colors[1]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value}元'
                                }
                            },
                            {
                                type: 'value',
                                name: '退单量',
                                min: 0,
                                max: sdata.maxrnumber,
                                position: 'left',
                                axisLine: {
                                    lineStyle: {
                                        color: colors[2]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value}'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '订单数',
                                type: 'bar',
                                data: sdata.series.ordernumber
                            },
                            {
                                name: '总金额',
                                type: 'bar',
                                yAxisIndex: 1,
                                data: sdata.series.data
                            },
                            {
                                name: '退单量',
                                type: 'line',
                                yAxisIndex: 2,
                                data: sdata.series.returnnumber
                            }
                        ]
                    };
                    myChart.setOption(option);
                }

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function getTotalPriceTrendData() {
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        gameName = $("#gameName").find("option:selected").text();
        var kefu = formSelects.value('inputOrderKefu', 'nameStr');
        $.ajax({
            type: "POST",
            url: "/EmpAjax/GetTotalPriceTrendReport",
            data: { gameName: gameName, name: kefu },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    var obj = getLineData(data.data);
                    let myChart = echarts.init(document.getElementById('totalPriceTrend'));

                    option = {

                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross'
                            },
                            formatter: '{b}<br>{a0}:{c0},环比:{c2}%<br>{a1}:{c1},环比：{c3}%'
                        },
                        grid: {
                            right: '20%'
                        },
                        toolbox: {
                            feature: {
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        legend: {
                            data: ['订单总数量', '订单总数量环比增长率', '订单总金额', '订单总金额环比增长率']
                        },
                        xAxis: [
                            {
                                type: 'category',
                                axisTick: {
                                    alignWithLabel: true
                                },
                                data: obj.xAxisData
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '总数量',
                                position: 'right',
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: colors[0]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value} 元'
                                }
                            },
                            {
                                type: 'value',
                                name: '总金额',
                                position: 'right',
                                offset: 80,
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: colors[1]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value} 元'
                                }
                            },
                            {
                                type: 'value',
                                name: '环比增长',
                                position: 'left',
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: colors[2]
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value} %'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '订单总数量',
                                type: 'bar',
                                data: obj.yAxisData
                            },
                            {
                                name: '订单总金额',
                                type: 'bar',
                                yAxisIndex: 1,
                                data: obj.yAxisData2
                            },
                            {
                                name: '订单总数量环比增长率',
                                type: 'line',
                                yAxisIndex: 2,
                                data: obj.yLineData
                            },
                            {
                                name: '订单总金额环比增长率',
                                type: 'line',
                                yAxisIndex: 2,
                                data: obj.yLineData2
                            }
                        ]
                    }
                    myChart.setOption(option);
                }

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function getOrderConseType() {
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        gameName = $("#gameName").find("option:selected").text();
        var stime = $("#sDate").val();
        var eDate = $("#eDate").val();
        var kefu = formSelects.value('inputOrderKefu', 'nameStr');
        $.ajax({
            type: "POST",
            url: "/EmpAjax/GetOrderConseTypeByCondition",
            data: { gameName: gameName, sDate: stime, eDate: eDate, name: kefu },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    var obj = genData(JSON.parse(data.data));
                    let myChart = echarts.init(document.getElementById('financialWageRep'));
                    option = {
                        title: {
                            text: '利润来源图',
                            subtext: '已排除已退单的订单，其它所有状态均包含在内',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            left: 'left',
                            data: obj.legendData
                        },
                        series: [{
                            name: '订单来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: obj.seriesData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                }

                re = true;
            },
            complete: function (XMLHttpRequest) {
                getKefuSoureOperationData()
                layer.close(indexLoad);
            }
        });
    }

    function getLineData(data) {
        var xAxisData = [];
        var yAxisData = [];
        var yAxisData2 = [];
        var yLineData = [];
        var yLineData2 = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            xAxisData.push(obj.name + "月");
            yAxisData.push(obj.count);
            yAxisData2.push(obj.sum);
            yLineData.push(obj.countRaise);
            yLineData2.push(obj.sumRaise);
        }
        return {
            xAxisData: xAxisData,
            yAxisData: yAxisData,
            yAxisData2: yAxisData2,
            yLineData: yLineData,
            yLineData2: yLineData2
        };
    }

    function getdate(type, model) {
        gameName = $("#gameName").find("option:selected").text();
        gameName = gameName == "全部" ? "" : gameName;
        var now = new Date();
        var year = now.getFullYear();
        var mon = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var start1 = "", end1 = "";
        var querydata = ""
        //上月
        var lastyear = mon == 1 ? year - 1 : year;
        var lastmon = mon == 1 ? 12 : mon - 1;
        //var lastallday = new Date(lastday, lastmon, 0).getDate();
        //var nowallday = new Date(year, mon, 0).getDate();
        //var recentday = day > lastallday ? lastallday : day;
        //var nowday = "";

        //    start1 = lastyear + "-" + lastmon + "-" + recentday+ " 00:00:00";
        //    end1 = year + "-" + mon + "-1 00:00:00";

        if (type == 2) {
            lastmon = lastmon > 9 ? lastmon : "0" + lastmon;
            mon = mon > 9 ? mon : "0" + mon;
            start1 = lastyear + "-" + lastmon + "-01 00:00:00";
            end1 = year + "-" + mon + "-01 00:00:00";

        } else {
            var between = type == 1 ? 30 : type == 3 ? 90 : 365;
            var betweeentime = between * 24 * 60 * 60 * 1000;
            var lastTime = now.getTime() - betweeentime;
            var last = new Date(lastTime);
            var staryear = last.getFullYear();
            var starmon = last.getMonth() + 1 > 9 ? last.getMonth() + 1 : "0" + (last.getMonth() + 1);
            var starday = last.getDate() > 9 ? last.getDate() : "0" + last.getDate();
            var nowallday = new Date(year, mon, 0).getDate();
            if (day + 1 > nowallday) {
                if (mon + 1 > 12) {
                    end1 = (year + 1) + "-01-01 00:00:00";
                } else {
                    end1 = (mon + 1) > 9 ? year + "-" + (mon + 1) + "-01 00:00:00" : year + "-0" + (mon + 1) + "-01 00:00:00";
                }
            } else {
                mon = mon > 9 ? mon : "0" + mon;
                var curday = day + 1 > 9 ? day + 1 : "0" + (day + 1);
                end1 = year + "-" + mon + "-" + curday + " 00:00:00";
            }
            start1 = staryear + "-" + starmon + "-" + starday + " 00:00:00";
        }
        console.log(start1, end1)
        querydata = {
            gameName: gameName,
            stime: start1,
            etime: end1,
            model: model
        }
        if (type == 5) {
            var stime = $("#sDate").val();
            var eDate = $("#eDate").val();
            var kefu = formSelects.value('inputOrderKefu', 'nameStr');
            querydata = {
                gameName: gameName,
                stime: stime + ' 00:00:00',
                etime: eDate + ' 23:59:59',
                model: model,
                kefu: kefu
            }
        }

        //querydata = {
        //    gameName: "",
        //    stime: "2020-07-15 00:00:00",
        //    etime: "2021-07-16 00:00:00",
        //    model: model
        //}

        $.ajax({
            type: "get",
            url: "/EmpAjax/GetSystemBuessionOperationData",
            data: querydata,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0 && data.data) {
                    var amount = data.data.totalProfit;
                    number_plus(0, amount, type);
                    if (type == 5) {
                        number_plus(0, data.data.totalReFundAmount, 6);
                    }
                }
                else {
                    number_plus(0, 0, type);
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

    }

    function genData(data) {
        var legendData = [];
        var seriesData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            legendData.push(obj.name);
            seriesData.push({
                name: obj.name,
                value: obj.value
            });
        }
        return {
            legendData: legendData,
            seriesData: seriesData
        };
    }


    $(document).ready(function () {
        getdate(1, statictype)
        getdate(2, statictype);
        getdate(3, statictype);
        getdate(4, statictype);
        getdate(5, statictype)
        //number_plus(0, 1000, 1);
        //number_plus(0, 2000, 2);
    })

    function number_plus(startNum, endNum, id) {
        var str = endNum * 1 < 0 ? "-" : "";
        endNum = endNum > 0 ? endNum : endNum * (-1);
        /*        if ($('#num' + id).html() != endNum && $('#num' + id).html() != 0) return false;*/
        var addNum = endNum / 500 > 1 ? Math.ceil(endNum / 500) : 1;


        $("#num" + id).html(0);
        setTimeout(function () {
            var intr = setInterval(function () {
                $("#num" + id).html(str + startNum);
                if (startNum < endNum) {
                    startNum += addNum;
                } else {
                    $("#num" + id).html(str + endNum);
                    clearInterval(intr);
                    return false;
                }
            }, 1);
        }, 100)

    }

    form.on('submit(seachBtn)', function (data) {
        getdate(1, statictype)
        getdate(2, statictype);
        getdate(3, statictype);
        getdate(4, statictype)
        getdate(5, statictype)
        getSoureOperationData();
        return false;
    });
    form.on('radio(statictype)', function (data) {
        statictype = data.value;
        getdate(1, statictype)
        getdate(2, statictype);
        getdate(3, statictype);
        getdate(4, statictype)
        getdate(5, statictype)
        return false;
    });

});