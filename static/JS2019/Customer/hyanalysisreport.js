layui.use(['form', 'laydate', 'element'], function () {
    var form = layui.form
        , layer = layui.layer
        , laydate = layui.laydate
        , $ = layui.$


    // 基于准备好的dom，初始化echarts实例
    var SourceType = echarts.init(document.getElementById('SourceType'));
    var ConsumType = echarts.init(document.getElementById('ConsumType'));
    var HyRaise = echarts.init(document.getElementById("HyRaise"));




    (function () {
        $.ajax({
            type: "POST",
            url: "/CustomerAjax/GetSourTypeReport",
            cache: false,
            timeout: 60000,
            error: function () { layer.msg("请求接口发生错误"); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                SetSourceTypeReport(reportArray(data && data.data));
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })();


    (function () {
        $.ajax({
            type: "POST",
            url: "/CustomerAjax/GetConseReport",
            cache: false,
            timeout: 60000,
            error: function () { layer.msg("请求接口发生错误"); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                SetConsumTypeReport(reportArray(data && data.data));
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })();


    (function () {
        $.ajax({
            type: "POST",
            url: "/CustomerAjax/GetHyRaiseReporyYears",
            cache: false,
            timeout: 60000,
            error: function () { layer.msg("请求接口发生错误"); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                SetHyRaiseReport(reportRaise(data && data.data));
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    })();


    function reportArray(value) {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            try { var parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch (e) { return []; }
        }
        return [];
    }

    function reportRaise(value) {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            try { value = JSON.parse(value); } catch (e) { return []; }
        }
        if (!value || !Array.isArray(value.months)) return [];
        var counts = Array.isArray(value.counts) ? value.counts : [];
        return value.months.map(function (month, index) {
            var current = Number(counts[index] || 0);
            var previous = Number(counts[index - 1] || 0);
            return { name: month, value: current, raise: previous ? (current - previous) / previous : 0 };
        });
    }

    //设置会员来源分类
    function SetSourceTypeReport(data) {
        var ret = genData(data);
        var option = {
            title: {
                text: '会员来源分类',
                subtext: '所有会员来源分类',
                left: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            //legend: {
            //    type: 'scroll',
            //    orient: 'vertical',
            //    right: 10,
            //    top: 20,
            //    bottom: 20,
            //    data: ret.legendData
            //},
            series: [
                {
                    name: '会员来源分类',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center',
                    },
                    emphasis: {
                        label: {
                            show: false,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: ret.seriesData
                }
            ]
        };

        SourceType.setOption(option);
    }


    //设置会员消费内容
    function SetConsumTypeReport(data) {
        var ret = genData(data);
        var option = {
            title: {
                text: '会员消费内容',
                subtext: '全部会员消费内容数据',
                left: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            //legend: {
            //    type: 'scroll',
            //    orient: 'vertical',
            //    right: 10,
            //    top: 20,
            //    bottom: 20,
            //    data: ret.legendData,

            //    selected: ret.selected
            //},
            series: [
                {
                    name: '消费内容',
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: ret.seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        ConsumType.setOption(option);
    }


    //设置会员增长率分析
    function SetHyRaiseReport(data) {
        var ret = getLineData(data);
        option = {
            title: {
                text: '会员每月增长率',
                subtext: '今年每个月的会员增长率',
                left: 'left'
            },

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: '{b}<br>{a}:{c0}<br>环比:{c1}%'
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['会员数量', '环比增长']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ret.xAxisData,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '会员数量',
                    //min: 0,
                    //max: 100,
                    //interval: 20,
                    axisLabel: {
                        formatter: '{value} 位'
                    }
                },
                {
                    type: 'value',
                    name: '环比增长',
                    //min: -500,
                    //max: 500,
                    //interval: 100,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }
            ],
            series: [
                {
                    name: '会员数量',
                    type: 'bar',
                    data: ret.yAxisData
                },
                {
                    name: '环比增长',
                    type: 'line',
                    yAxisIndex: 1,
                    data: ret.yLineData
                }
            ]
        };

        option && HyRaise.setOption(option);
    }

    function getLineData(data) {
        var xAxisData = [];
        var yAxisData = [];
        var yLineData = [];
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            xAxisData.push(obj.name + "月");
            yAxisData.push(obj.value);
            yLineData.push(obj.raise * 100);
        }
        return {
            xAxisData: xAxisData,
            yAxisData: yAxisData,
            yLineData: yLineData
        };
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


    window.onresize = function () {
        ConsumType.resize();
        SourceType.resize();

    };

});
