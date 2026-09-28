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
        var sDate = $("#sDate").val();
        var eDate = $("#eDate").val(); 
        var seachParam = 'stime=' + sDate + '&etime=' + eDate;
        var indexLoad; 
        var page = 1;  
        laydate.render({
            elem: '#sDate'
            , type: 'datetime'
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'datetime'
        }); 
        getAllRecUserData(); 
        function getAllRecUserData() {
            var soureData = [];
            $.get('/UserAjax/GetAllUserByGameName', function (result) {
                soureData = result.data;
                formSelects.data('recUser', 'local', {
                    arr: soureData
                });
            });
        }
        var tableList =table.render({
            elem: '#tableList'
            , url: '/EmpAjax/GetPrivatePhoneCallLogList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 } 
                , {
                    field: 'moblie', title: '被叫号码', width:90, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + res.moblie + '">' + res.moblie + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'phoneX', title: '虚拟号码', width:90, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.phoneX + '">' + res.phoneX + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'phoneXExtension', title: '分机号', width:60, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.phoneXExtension + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'callPhone', title: '主叫号码', width:90, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.callPhone + '">' + res.callPhone + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'userName', title: '使用人', align: 'center', width:120, sort: false,
                    unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.userName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createTime', title: '提取号码时间', align: 'center', width: 130, unresize: false, templet: function (res) {
                        let vo = '<span style="">' + res.createTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'callTime', title: '打电话时间', align: 'center', width:130, unresize: false, templet: function (res) {
                        return '<span title="">' + res.callTime + '</span>';
                    }
                }
                , {
                    field: 'callStartTime', title: '接听时间', align: 'center', width:130, unresize: false, templet: function (res) {
                        return '<span title="">' + res.callStartTime + '</span>';
                    }
                } 
                , {
                    field: 'releaseTime', title: '挂断电话时间', align: 'center', width:130, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.releaseTime + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'callTimeLength', title: '通话时长', align: 'center', width: 65, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.callTimeLength + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'releaseDir', title: '挂断方式', align: 'center', width:70, unresize: false, templet: function (res) {
                        let vo = '<span>自动挂断</span>';
                        if (res.releaseDir == 1) {
                            vo = '<span>主叫挂断</span>';
                        } else if (res.releaseDir == 2) {
                            vo = '<span>被叫挂断</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'releaseCauseStr', title: '挂断说明', align: 'center', width:110, unresize: false
                }
                , {
                    field: 'consumeFee', title: '话费', align: 'center', width:60, unresize: false, templet: function (res) {
                        let vo = '<span style="color:#E03636">' + res.consumeFee + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'decMode', title: '扣费方式', align: 'center', width: 80, unresize: false, templet: function (res) {
                        let color = 'color:#263238';
                        let txt = '平台余额';
                        if (res.decMode == 10) {
                            txt = '套餐余量';
                        }
                        let vo = '<span style="' + color+'">' + txt + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'isRecording', title: '录音文件', align: 'center', width:70, unresize: false, templet: function (res) {
                        let vo = '<a href="#" style="color:#5FB878" lay-tips="如果有录音文件，请在14天内下载，超过14天录音将失效" class="' + (res.isRecording == 0 || res.callTimeLength == 0 ? "" : "downRec") + '" data-id="' + res.pId + '">' + (res.isRecording == 0 || res.callTimeLength==0 ? '' : '下载录音') + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'viewOrderId', title: '本系统单号', align: 'center',minWidth:100, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="orderdetails" data-orderid="' + res.orderId + '" style="color:#0094ff" title="点击查看订单详情">' + res.viewOrderId + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注', align: 'left', width:85, unresize: false, templet: function (res) {
                        let vo = '<a href="#" style="color:#C71585" class="remark" data-id="' + res.pId + '" data-remark="'+res.remark+'" title="'+res.remark+'">' + (res.remark==""?"点击编辑":res.remark) + '</a>';
                        return vo;
                    }
                }
            ]]
            , page: true 
            , limit: 30
            , limits: [10, 20, 30, 40, 50]
            , done: function (res, curr, count) { 
                page = curr;
                var total = '本次搜索统计共' + res.total.totalCount + '条记录，通话总时长：' + res.total.totalCallTimeLength + '秒，总计消耗话费：' + res.total.totalConsumeFee + '元';
                $("#total").html(total);
             }
        }); 
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break; 
                case 'remarkBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请选中要操作的记录');
                        return false;
                    }
                    var pId = '';
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].pId);
                        };
                        pId = tempData.join(',');
                    }
                    changeRemark(pId, '');
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
            var recUser = formSelects.value('recUser', 'valStr'); 
            var moblie = $("#key1").val();
            var orderid = $("#key2").val();
            seachParam = 'stime=' + sDate + '&etime=' + eDate + '&addUserId=' + recUser + '&moblie=' + moblie + '&orderid=' + orderid;
            
            tableList.reload({
                url: '/EmpAjax/GetPrivatePhoneCallLogList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }
        $(document).on('click', '.remark', function () {
            var pid = $(this).attr('data-id');
            var remark = $(this).attr('data-remark');
            changeRemark(pid, remark);
            return false;
        })
        function changeRemark(id,val) {
            layer.prompt({ title: '编辑记录备注，若没有请写无', formType: 0, value: val, maxlength: 50 }, function (value, index, elem) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/EmpAjax/ChangePrivatePhoneCallLogRemark",
                    data: { ids: id, remark: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.msg(data.msg, { time: 1500 }, function () {
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
            return false;
        }
        
        $(document).on('click', '.downRec', function () {
            var pid = $(this).attr('data-id'); 
            window.open("/Emp/DownRecordingFile?id=" + pid, "_blank");
            var index = layer.getFrameIndex(window.name);
            layer.close(index);
            return false; 
        })

    $(document).on('click', '.orderdetails', function () {
        var orderid = $(this).attr('data-orderid');
        layer.open({
            title: orderid + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['70%', '92%'],
            content: '/Order/OrderView?orderId=' + orderid
        });
    }); 
      
});