layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table', 'rate','colorpicker'], function () {
        var $ = layui.$,
            form = layui.form,
            util = layui.util,
            rate = layui.rate,
            colorpicker = layui.colorpicker,
            laydate = layui.laydate;
        element = layui.element
        var table = layui.table;
        var devices = layui.device();
        var isPc = true;
        if (devices.android === true || devices.ios === true) {
            isPc = false;
        }
        var re = true;
        var device = isPc;
        var tableData = [];
        var curindex;
        var layindex;
        var chooseColor = ''
        var levelType = 0
        var dataId = ''
        var PopId = ''

        getData();
        $(document).keydown(function (event) {
            if (event.keyCode == 13) {
                page = 1;
                reloadOrderList();
            }
        });
        function getData() {
            $.ajax({
                type: "Get",
                url: "/api/CustomerApi/GetLevelList",
                data: { levelType: levelType },
                dataType: 'json',
                error: function () { layer.msg('系统繁忙！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    tableData = data.data;
                    $.each(tableData, function (k, v) {
                        v.Id = k;
                    });
                    loadTable();
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }
        var page = 1;
        var tableList;
        function loadTable() {
            tableList = table.render({
                elem: '#tableList'
                , data: tableData
                , defaultToolbar: []
                , toolbar: '#toolbarDemo'
                , defaultToolbar: ['filter']
                , cols: [[
                    {
                        field: 'Index', type: "numbers", title: "序号"
                    }
                    ,
                    {
                        field: 'BusinessTypeId ', title: '行唯一表示', unresize: false, sort: false, hide: true
                    }
                    ,
                    {
                        field: 'StartValue', title: '累积金额区间开始', width: 130, align: 'center', unresize: false, sort: false,
                    },
                    {
                        field: 'EndValue', title: '累积金额区间结束', width: 130, align: 'center', unresize: false, sort: false,
                    },
                    {
                        field: 'IntervalName', title: '等级名称', width: 100, align: 'center', unresize: false,
                    }, {
                        field: 'LevelDiscount', title: '折扣', width: 100, align: 'center', unresize: false, templet: function (res) {
                            var str = ''
                            if (!res.LevelDiscount) {
                                str = '无折扣'
                            } else {
                                str = (res.LevelDiscount * 10).toFixed(2) + '折'
                            }
                            return '<span  >' + str + '</span>';
                        }
                    }, {
                        field: 'LevelNote', title: '等级权益说明', minWidth: 150, align: 'center', unresize: false,
                    },
                    {
                        field: 'ExtensionStr', title: '等级颜色设置', width: 130, align: 'center', unresize: false, templet: function (res) {
                            let color = res.ExtensionStr ? res.ExtensionStr : '';
                            let vo = '<a href="javascript:void(0);" title="点击设置" class="colorStr" style="background:' + color + ';" data-index="' + (res.LAY_NUM - 1) + '"></a>';
                            return vo;
                        }
                    },
                    {
                        fixed: '', title: '操作', width: 130, align: 'center', toolbar: '#baroperating', unresize: true,
                    }
                ]]
                , done: function (res, curr, count) {
                    $.each(res.data, function (k, v) {
                        v.CallStartTime = parseDateTime(v.parseDateTime);
                    });
                    if (res.msg == "请先登录") {
                        layer.msg("登录过期了，请重新登录系统");
                        return;
                    }
                    if (res.code < 0) {
                        layer.msg(res.msg, { time: 3000 }, function () {
                        })
                        return false;
                    }




                }
                , limit: 100
            });
        }
        table.on('toolbar(tableList)', function (obj) {
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addLineBtn':
                    addFunction();
                    break;
                case 'updateMemberLevelBtn':
                    layer.confirm('确定要刷新所有会员的等级吗？此操作有1小时的间隔，执行前请确认你的会员等级已全部设定好', function (index) {
                        updateMemberLevel();
                    });
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            switch (obj.event) {
                case 'cellEdit':
                    addFunction(obj.data)
                    break;
                case 'del':
                    delRow(obj.data);
                    break;
            }
        })
        table.on('edit(tableList)', function (obj) {
            var id = getRowId(obj.data);
            var rows = tableData.filter(function (e) {
                var oid = getRowId(e);
                return oid == id;
            });
            if (rows && rows.length > 0) {
                rows[0].StartValue = obj.data.StartValue;
                rows[0].EndValue = obj.data.EndValue;
                rows[0].IntervalName = obj.data.IntervalName;
            }
        });
        //删除行
    function delRow(row) {
            $.ajax({
                type: "POST",
                url: "/api/CustomerApi/DelLevel",
                data: { id: row.IntervalLevelID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0)
                        layer.msg("操作成功");
                    else
                        layer.msg(data.msg);
                },
                complete: function (XMLHttpRequest) {
                    reloadOrderList();
                    layer.close(indexLoad);
                }
            });
        }
        function colorfun() {

            layindex = layer.open({
                title: "设置颜色",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: [isPc ? '500px' : '98%', isPc ? '500px' : '98%'],
                content: $(".opencolor")
            });
        }
        element.on('tab(test-hash)', function (data) {
            levelType = data.index
            reloadOrderList();
        });
        //保存页面上的编辑信息
        $('#SaveBtn').on('click', function (data) {
            //校验数据连续性，判断重复性
            var copyData = tableData.sort(function (a, b) {
                return a.StartValue - b.StartValue;
            });
            var nameArray = [];
            var reg = /^[0-9]{1,16}$/;  //判断只能有整数值组成
            //第0行手动判断一下
            if (!copyData[0].IntervalName || copyData[0].IntervalName.length == 0) {
                layer.msg("第1行等级名称不能为空");
                return false;
            }
            if (!reg.test(copyData[0].StartValue) || !reg.test(copyData[0].EndValue)) {
                layer.msg("第1行消费金额开始值和结束值只能由整数组成");
                return false;
            }
            nameArray.push(copyData[0].IntervalName);

            if (parseInt(copyData[0].StartValue) >= parseInt(copyData[0].EndValue)) {
                layer.msg("第1行数据消费金额开始值必须小于消费金额区间结束值");
                return false;
            }
            //从第一行开始依次循环判断
            for (var i = 1; i < copyData.length; i++) {

                if (!reg.test(copyData[i].StartValue) || !reg.test(copyData[i].EndValue)) {
                    layer.msg("第" + (i + 1) + "行消费金额开始值和结束值只能由整数组成");
                    return false;
                }
                //判断名称空
                if (!copyData[i].IntervalName || copyData[i].IntervalName.length == 0) {
                    layer.msg("第" + (i + 1) + "行等级名称不能为空");
                    return false;
                }
                //判断起始区间必须大于截止区间
                if (parseInt(copyData[i].StartValue) >= parseInt(copyData[i].EndValue)) {
                    layer.msg("第" + (i + 1) + "行数据消费金额开始值必须小于消费金额区间结束值");
                    return false;
                }

                //判断重复性
                if (nameArray.indexOf(copyData[i].IntervalName) > -1) {
                    layer.msg("名称【" + copyData[i].IntervalName + "】不能重复");
                    return false;
                }
                //判断连续性
                console.log(copyData[i])
                if (parseInt(copyData[i].StartValue) != parseInt(copyData[i - 1].EndValue)) {
                    layer.msg("消费金额区间值必须连续");
                    return false;
                }
            }

            $.ajax({
                type: "POST",
                url: "/CustomerAjax/SaveIntervalLevel",
                data: { "models": copyData },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0)
                        layer.msg("操作成功");
                    else
                        layer.msg(data.msg);
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        });
        //获取行id,免得后面取错了
        function getRowId(row) {
            return parseInt(row.Id || row.IntervalLevelID);
        }
        function addFunction(data) {
            var str = '修改等级信息'
            if (!data) {
                var str = '新增等级'
                data = {}
            }
            if (data.IntervalLevelID) {
                dataId = data.IntervalLevelID
            } else {
                dataId = '0'
            }
            PopId = data.Id
            console.log(PopId,data,data.id)
            chooseColor = data.ExtensionStr
            var val = ''
            for (var i = 0.99; i >= 0.50; i -= 0.01) {
                var a = i.toFixed(2)
                val += `<option value="${a}" > ${(a * 10).toFixed(2)}折</option >`
            }

            addUserLayerIndex = layer.open({
                type: 1,
                area: [isPc ? '530px' : '100%', isPc ? '580px' : '90%'],
                title: str,
                content: `<form class="layui-form" action="" lay-filter="fm1" style="padding:10px 10px;">
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">等级名称</label>
                <div class="layui-input-block">
                    <input type="text" name="IntervalName" id="IntervalName" lay-verify="required" autocomplete="off"  placeholder="请输入" class="layui-input layui-input-shadow" maxlength="20" value="${data.IntervalName !== undefined && data.IntervalName !== null ? data.IntervalName : ''}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">累积金额区间开始</label>
                <div class="layui-input-block">
                    <input type="number" name="StartValue" id="StartValue" lay-verify="required" autocomplete="off"  placeholder="请输入" class="layui-input layui-input-shadow" maxlength="20" value="${data.StartValue !== undefined && data.StartValue !== null ? data.StartValue : ""}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">累积金额区间结束</label>
                <div class="layui-input-block">
                    <input type="number" name="EndValue" id="EndValue" lay-verify="required" autocomplete="off"  placeholder="请输入" class="layui-input layui-input-shadow" maxlength="20" value="${data.EndValue !== undefined && data.EndValue !== null ? data.EndValue : ""}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">等级颜色</label>
                <div class="layui-input-block">
                       <div class="test1"></div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">等级权益说明</label>
                <div class="layui-input-block">
                    <input type="text" name="LevelNote" id="LevelNote" autocomplete="off"  placeholder="请输入" class="layui-input layui-input-shadow" maxlength="498" value="${data.LevelNote !== undefined && data.LevelNote !== null ? data.LevelNote  : ""}">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="padding:9px 9px">专属折扣</label>
                <div class="layui-input-block">
                                     <select name="LevelDiscount" @(Model.isLockLevelDiscount == 1 ? "disabled" : "") lay-verify="" lay-filter="setLevelDiscount" id="setLevelDiscount" lay-search="{caseSensitive:false, fuzzy: false}">
                                        <option value="0">无折扣</option>
                                 ${val}
                                    </select>
                </div>
            </div>
               <div style="text-align:center;align-items:center">
        <button type="button" class="layui-btn layui-icon layui-toast layui-btn-normal w-lg" lay-submit="" lay-filter="saveBtn" id="saveBtn">${str}</button>
    </div> 

                </form>`,
                success: function () {
                    $('.colorStr').on('click', function (data) {
                        curindex = data.currentTarget.dataset.index;
                        colorfun()
                    })
                    colorpicker.render({
                        elem: '.test1'  //绑定元素
                        , predefine: true
                        , color: chooseColor ? chooseColor : '#eee'
                        , colors: ['#718090', '#45AB90', '#A3A380', '#FFC09F', '#db7193', '#ff0101']
                        , done: function (color) {
                            chooseColor = color;
                            tableList.reload({ data: tableData });
                            layer.close(layindex)
                            //譬如你可以在回调中把得到的 color 赋值给表单
                        }
                    });
                    form.render()
                    form.val('fm1', { LevelDiscount: data.LevelDiscount })

                },
                end: function () {
                    chooseColor = ''
                    dataId = ''
                    PopId = ''
                }
            });


            return false;
        }
        form.on('submit(saveBtn)', function (data) {
            var params = data.field
            if (Math.floor(params.StartValue) != params.StartValue || Math.floor(params.EndValue) != params.EndValue) {
                layer.msg("消费金额开始值和结束值只能由整数组成");
                return false;
            }
            if (Math.floor(params.StartValue) >= Math.floor(params.EndValue)) {
                layer.msg("消费金额开始值不能大于等于结束值");
                return false;
            }

            //console.log(Math.floor(tableData[PopId - 1].EndValue), Math.floor(params.StartValue) )
            if (PopId > 0 && Math.floor(tableData[PopId - 1].EndValue) - Math.floor(params.StartValue) != 0) {
                layer.msg("消费金额区间值必须连续");
                return false;
            }
            //console.log(Math.floor(tableData[PopId + 1].StartValue), Math.floor(params.EndValue))
            // if (tableData[PopId + 1] && Math.floor(tableData[PopId + 1].StartValue) - Math.floor(params.EndValue) != 0) {
            //     layer.msg("消费金额区间值必须连续");
            //     return false;
            // }
            //console.log(Math.floor(params.StartValue), Math.floor(tableData[tableData.length - 1].EndValue))
            if (tableData.length > 0) {
                if (!PopId && PopId != 0 && Math.floor(params.StartValue) - Math.floor(tableData[tableData.length - 1].EndValue) != 0) {
                    layer.msg("消费金额区间值必须连续");
                    return false;
                }
            }
            params.ExtensionStr = chooseColor
            params.BusinessTypeId = levelType
            params.IntervalLevelID = dataId
            console.log(params)
            $.ajax({
                type: "POST",
                url: "/api/CustomerApi/SaveLevel",
                data: params,
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
                    if (data.code > 0)
                        layer.msg("操作成功");
                    else
                        layer.msg(data.msg);
                },
                complete: function (XMLHttpRequest) {
                    reloadOrderList();

                    layer.close(addUserLayerIndex);
                    layer.close(indexLoad);
                }
            });
        })
        function updateMemberLevel() {
            if (!re) {
                return false;
            }
            re = false;
            $.ajax({
                type: "Post",
                url: "/Api/CustomerApi/UpdateCustomerLevel",
                data: {},
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
                    re = true;
                    layer.msg(data.msg);
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }
        function reloadOrderList() {
            $.ajax({
                type: "Get",
                url: "/api/CustomerApi/GetLevelList",
                data: { levelType: levelType },
                dataType: 'json',
                error: function () { layer.msg('系统繁忙！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    tableData = data.data;
                    $.each(tableData, function (k, v) {
                        v.Id = k;
                    });
                    loadTable();
                    tableList.reload({
                        data: tableData
                        , where: {
                        }
                        , page: false
                    });
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
            return false;
        }
        var _tools = {
            reloadOrderData: function () {
                layer.closeAll();
                reloadOrderList();
            },
            reloadOrderDataNoClose: function () {
                reloadOrderList();
            }
        };
        window.tools = _tools;
    });