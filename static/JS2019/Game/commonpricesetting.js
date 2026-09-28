////const { v } = require("..//lib/formSelects-v4");

layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'table', 'element'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        element = layui.element;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var gameName = $("#gameName").val();
    var project = "段位";
    var twoLevel = 0;
    var tableList;
    var tableList2;
    var tableListsd;
    var dwData = [];
    var dfsData = [];
    var origindata = [];
    var sdData = [];
    var sdindex;
    var curid;
    var inittext = "#代练内容# \n ----------- \n#套餐价格# \n ----------- \n代练耗时：#代练耗时#小时 \n ----------- \n首单特惠 ：\n#首单内容#\n开打和完单都有短信通知您 \n ----------- \n全网低价·品质保证·专业团队 \n★百星打手-战绩可查★ \n★打坏包赔-超高胜率★ \n★新店冲量-低价保量★"


    if (gameName.indexOf('英雄联盟手游') > -1 || gameName == '和平精英' || gameName == '金铲铲之战' || gameName == '云顶之弈'|| gameName == '幻塔' || gameName == 'QQ飞车' || gameName == '暗区突围') {
        $(".applearea").show()
    } else {
        $(".applearea").hide()
    }
    
    
    if ((gameName == '永劫无间' || gameName == '哈利波特') && gameName != 'APEX英雄') {
        $(".single").show()
    } else {
        $(".single").hide()
    }
    if (gameName == 'APEX英雄') {
        $(".apex").show()
        $(".noapex").hide()
        $(".threes").hide()
        project = "大逃杀段位";
        element.tab({
            headerElem: '.apex>li'
        });

    } else if (gameName == '新世界') {
        $(".threes").show()
        $(".noapex").hide()
        $(".apex").hide()
        element.tab({
            headerElem: '.three>li' //指定tab头元素项
        });
    } else if (gameName == '英雄联盟') {
        $(".yingxiong").show();
        tableListsdroload();
        $(".heros").show()
        element.tab({
            headerElem: '.heros>li' //指定tab头元素项
        });
    } else if (gameName.indexOf('英雄联盟手游') > -1) {
        $(".herossy").show()
        element.tab({
            headerElem: '.herossy>li' //指定tab头元素项
        });
    }
    else if (gameName == '守望先锋') {
        $(".xianf").show();
        element.tab({
            headerElem: '.xianf>li' //指定tab头元素项
        });
        project = '分数区间-重装'
        $(".duanw").hide();
        $('.fenshu').show();
    } else if (gameName == '穿越火线') {
        $(".cyhx").show();
        element.tab({
            headerElem: '.cyhx>li' //指定tab头元素项
        });
    } else if (gameName == '幻塔') {
        $(".huanta").show();
        element.tab({
            headerElem: '.huanta>li' //指定tab头元素项
        });
    } else if (gameName == '原神') {
        $(".yuanshen").show();
        element.tab({
            headerElem: '.yuanshen>li' //指定tab头元素项
        });
    } else if (gameName == '和平精英') {
        $(".hepinjy").show();
        element.tab({
            headerElem: '.hepinjy>li' //指定tab头元素项
        });
    } else if (gameName == '暗区突围') {
        $(".anqutw").show();
        element.tab({
            headerElem: '.anqutw>li' //指定tab头元素项
        });
    } else if (gameName == '暗黑不朽') {
        $(".anhbx").show();
        project = "段位-普通等级";
        element.tab({
            headerElem: '.anhbx>li' //指定tab头元素项
        });
    } else if (gameName == '金铲铲之战' || gameName == '云顶之弈') {
        $(".jincc").show();
        element.tab({
            headerElem: '.jincc>li' //指定tab头元素项
        });
    } else if (gameName == '跑跑卡丁车手游') {
        $(".ppkdc").show();
        element.tab({
            headerElem: '.ppkdc>li' //指定tab头元素项
        });
    } else if (gameName == '第五人格') {
        $(".dwreng").show();
        element.tab({
            headerElem: '.dwreng>li' //指定tab头元素项
        });
    } else {
        $(".noapex").show()
        $(".threes").hide()
        $(".apex").hide()
        element.tab({
            headerElem: '.noapex>li' //指定tab头元素项
        }); 
    }
    if (gameName == '守望先锋') {
        getWZDFS();
    } else {
        getWZDW();
    }    
    getBaseSetting();

    var titstr = "";
    if (gameName.indexOf('英雄联盟手游') > -1 || gameName == '幻塔') {
        let str1 = '翡翠1'
        if (gameName == '幻塔') str1 = '将星1';
        $('.alldw').show();
        $('.alldw').html('整段价格/单颗星价举例：如果打完' + str1 + '这段需要10元，由于' + str1 +'有5颗星，那么“整段价格”应该设为10元，该段“单颗星价”就是10元除以5，为2元。');
        titstr = "整段"
    } else {
        $('.alldw').hide()
        titstr = ""
    }
    if (gameName == '穿越火线') titstr = "整段";
    var layid = location.hash.replace(/^#gtab=/, '');
    var curunits = gameName == '永劫无间' ? '每100分' : gameName == '和平精英' || gameName == 'QQ飞车' || gameName == '金铲铲之战' || gameName == '云顶之弈' || gameName == '哈利波特' || gameName == 'APEX英雄' || gameName == '英雄联盟' ? '整段' : gameName == '原神' || gameName == '新世界' || gameName == '暗黑不朽' ? '每级' : gameName.indexOf('英雄联盟手游') > -1 || gameName == '穿越火线' || gameName == '幻塔' || gameName == '暗区突围' || gameName == '跑跑卡丁车手游' || gameName == '第五人格' ? '整段' : '每星'
    var tablelabel = '星';
    element.tabChange('gtab', layid);
    element.on('tab(gtab)', function (elem) {
        location.hash = 'gtab=' + $(this).attr('lay-id');
        gameName = $(this).data('game');
    });

    form.on('radio(firstOrderchange)', function (data) {
        if (data.value == 0) {
            $(".firstamount .layui-word-aux").html('%')
        } else {
            $(".firstamount .layui-word-aux").html('元')
        }
    })    
    
    element.on('tab(wztab)', function (data) {
        project = $(this).data('project');
        if (project.indexOf('上') > -1) {           
            tablelabel = project.split('上')[1];
            if (tablelabel == '星') {
                $('.fslabel').html('提示：您可以自行添加星数区间值，每个区间请保持星数从小到大且连贯，可以灵活运用该设置用来计算积分、等级等，例如：1-100、101-200、201-300依此类推，不要有跳跃的情况，也不能从大到小设置')
            } else {
                $('.fslabel').html('提示：您可以自行添加分数区间值，每个区间请保持分数从小到大且连贯，可以灵活运用该设置用来计算积分、等级等，例如：1-100、101-200、201-300依此类推，不要有跳跃的情况，也不能从大到小设置')
            }
        }
        
        twoLevel = data.index;
        if (project.indexOf('段位') > -1) {
            $('.duanw').show();
            $('.fenshu').hide();
            getWZDW();
        } else {
            table2reload();
            $('.duanw').hide();
            $('.fenshu').show()
            getWZDFS();
        }
        if (gameName == '暗区突围' && project.indexOf('等级') > -1) {
            curunits = '每级';
            tableList.reload()
        }

        getBaseSetting();
    });

    tableList = table.render({
        elem: '#tableList'
        , data: dwData
        , defaultToolbar: []
        , maxheight: 1450
        , toolbar: '#toolbarDemo'
        , defaultToolbar: []
        , cols: [[
            {
                type: 'checkbox', fixed: 'left', width: 30, hide: true
            }
            , {
                field: 'LeveName1', title: '段位', minWidth:130, align: 'center', unresize: false, sort: false
            },
            {
                field: 'LeveName2', title: '描述', width: 130, align: 'center', unresize: false, sort: false, templet: function (res) {
                    var val = '';
                    val = res.LeveName2
                    //if (res.LeveName1.indexOf('王者') > -1) {
                    //    val = res.LeveName2;
                    //}
                    return val;
                }
            },
            {
                field: 'PAmount', title: '陪练价(' + curunits + ')-单击编辑', minWidth: 180, align: 'center', unresize: false, edit: true,event: 'pviewReport',templet: function (res) {
                    var val = '';
                    if (res.PAmount > 0) {
                        val = res.PAmount;
                    }
                    return val;
                }
            },
            {
                field: 'DAmount', title: '代练价(' + curunits + ')-单击编辑', minWidth: 180, align: 'center', unresize: false, edit: true, event: 'pviewReport',templet: function (res) {
                    var val = '';
                    if (res.DAmount > 0) {
                        val = res.DAmount;
                    }
                    return val;
                }
            },
            {
                field: 'Hours', title: titstr + '时间(小时)-单击编辑', minWidth: 180, align: 'center', unresize: false, edit: true, event:'timeReport'
            }
        ]]
        , page: false
        , limit: 1000
        , done: function (res, curr, count) {
        }
    });

    function table2reload() {
        tableList2 = table.render({
            elem: '#tableList2'
            , data: dfsData
            , defaultToolbar: []
            , height: 800
            , toolbar: '#toolbarDemo2'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    type: 'checkbox', fixed: 'left', width: 30
                }
                , {
                    field: 'StartPoint', title: '开始' + tablelabel + '-单击编辑', minWidth: 130, align: 'center', unresize: false, sort: false, edit: true
                },
                {
                    field: 'EndPoint', title: '结束' + tablelabel + '-单击编辑', minWidth: 130, align: 'center', unresize: false, sort: false, edit: true
                },
                {
                    field: 'DAmount', title: '单价(每' + tablelabel + '多少钱)-单击编辑', minWidth: 180, align: 'center', unresize: false, edit: true
                },
                {
                    field: 'Hours', title: '时间(每' + tablelabel + '多少小时)-单击编辑', minWidth: 180, align: 'center', unresize: false, edit: true
                }
                , { fixed: '', title: '操作', width: 80, align: 'center', toolbar: '#baroperating2', unresize: true, }
            ]]
            , page: false
            , limit: 100
            , done: function (res, curr, count) {
            }
        });
    }

    

    tableListsd = table.render({
        elem: '#tableListsd'
        , data: sdData
        , defaultToolbar: []
        , toolbar: '#toolbarDemosd'
        , defaultToolbar: ['filter']
        , cols: [[            
            {
                field: 'LeveName1', title: '胜负场次', minWidth: 150, align: 'center', unresize: false
            },          
            {
                field: 'DAmount', title: '代练价格系数', minWidth: 200, align: 'center', unresize: false, edit: true, event: 'sdeditfun', templet: function (res) {
                    var val = res.DAmount;
                    if ((res.DAmount && isNaN(res.DAmount) && !/^-$/.test(res.DAmount)) || res.DAmount == 0) {
                        val = '';
                    }
                    return val;
                }
            },
            {
                field: 'PAmount', title: '陪练价格系数', minWidth: 200, align: 'center', unresize: false, edit: true, event: 'sdeditfun', templet: function (res) {
                    var val = res.PAmount;
                    if ((res.PAmount && isNaN(res.PAmount) && !/^-$/.test(res.PAmount)) || res.PAmount==0) {
                        val = ''; 
                    }
                    return val;
                }
            }
            //,{ field: 'PriceCalculatorId', title: '操作', width: 150, align: 'center', toolbar: '#baroperatingsd', unresize: true }
        ]]
        , page: false
        , limit: 100
        , done: function (res, curr, count) {

        }
    })
    table.on('toolbar(tableListsd)', function (obj) {  
       
        if (obj.event === 'initdatasd') {
            initsdfun()
        }
        if (obj.event === 'refreshsd') {
            tableListsdroload();
        }
        return false;
    });
    table.on('edit(tableListsd)', function (obj) { 
        var oldtr = obj.tr;
        var oldtext = $(oldtr).find("td[data-field='" + obj.field + "'] div").text();
        if (obj.value && isNaN(obj.value) && !/^-$/.test(obj.value)) {
                layer.alert('请填写数字', {
                    icon: 0,
                    title: "提示"
                });
                for (var y = 0; y < sdData.length; y++) {
                    var item = sdData[y];
                    if (item.PriceCalculatorId == obj.data.PriceCalculatorId) {
                        item[obj.field] = oldtext;
                    }
                }
                tableListsd.reload({
                    data: sdData
                    , where: {
                    }
                    , page: false
                    , limit: 1000
                });
                //$(oldtr).find("td[data-field='" + obj.field + "'] input").val(oldtext);

                return false
            }
       
        editValuesd(obj.data);
        
        return false;
    });
    function initsdfun() {
        $.ajax({
            type: "Post",
            url: "/GameAjax/InitLOL_JinjiData",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); },
            beforeSend: function (XMLHttpRequest) {
                indexLoad = layer.load(1, { shade: false });
            },
            success: function (data) {
                layer.msg(data.msg, { time: 600 }, function () {
                    if (data.code > 0) {
                        tableListsdroload();
                    }
                })
            },
            complete: function (XMLHttpRequest) {
                re = true;
                layer.close(indexLoad);
            }
        });
    }
    function editValuesd(obj) {
        if (!re) {
            layer.msg('系统繁忙！')
            return false;
        } 
        re = false;
        var qdata = {
            pid: obj.PriceCalculatorId,
            names: obj.LeveName1,
            dfee: obj.DAmount,
            pfee: obj.PAmount
        }
        $.ajax({
            type: "Post",
            url: "/GameAjax/AddChangeGamePriceLOLJinji",
            data: qdata,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) {
                indexLoad = layer.load(1, { shade: false });
            },
            success: function (data) {
                if (data.code > 0) {
                    //tableListsdroload();
                } else {
                    layer.alert(data.msg, {
                        icon: 0,
                        title: "提示"
                    });
                    tableListsdroload();                    
                }
                
            },
            complete: function (XMLHttpRequest) {
                re = true;
                layer.close(indexLoad);
            }
        });
        return false;
    }

    table.on('tool(tableListsd)', function (obj) {
        if (obj.event === 'sdeditfun') {
            layer.msg('请输入系数，如果需要多加的钱，请输入正数。如果需要减去的钱，请输入负数，支持小数', { time:3000 });            
            return false;
        }
        if (obj.event === 'removeLinesd') {
            curid = obj.data.PriceCalculatorId;
            layer.confirm('是否删除这条规则', function (index) {
                delsdfun();
                layer.close(index)
            });
            return false;
        }
        
    });

    function tableListsdroload() {
        sdData = [];
        $.ajax({
            type: "POST",
            url: "/GameAjax/GetLolJinjiDataList",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                sdData = data.data;
                tableListsd.reload({
                    data: sdData
                    , where: {
                    }
                    , page: false
                    , limit: 1000
                });
                if (sdData.length > 0) {
                    $('.initdatasd').text('重新初始化数据')
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        })
        return false;
    }
    
    $('.pselect .item').click('on', function () {
        var str = "#" + $(this).text() + "#";
        if (project.indexOf('段位') > -1) {
            var oldval = $('.dw_words').val();
            var start = $('.dw_words')[0].selectionStart;
            var end = $('.dw_words')[0].selectionEnd;
            var newStr = oldval.slice(0, start) + str + oldval.slice(end);
            form.val("pro", {
                "dw_words": newStr
            })
            form.render();
            replacefun('dw_words');
        } else {
            var oldval = $('.dfs_words').val();
            var start = $('.dfs_words')[0].selectionStart;
            var end = $('.dfs_words')[0].selectionEnd;
            var newStr = oldval.slice(0, start) + str + oldval.slice(end);
            form.val("pro", {
                "dfs_words": newStr
            })
            form.render();
            replacefun('dfs_words');
        }
    })
    $('.dw_words').on('input', function () {
        replacefun('dw_words');
    })
    $('.dfs_words').on('input', function () {
        replacefun('dfs_words');
    })

    function initpricesetting(){
        if (project.indexOf('段位') > -1){
            $(".dw_words").val(inittext)
            replacefun('dw_words')
        } else {
            $(".dfs_words").val(inittext)
            replacefun('dfs_words')
        }
    }
    function replacefun(id) {
        var str = $('.' + id).val();
        var replacetxt = str.replace(/#代练内容#/g, '星耀5-王者1星');
        replacetxt = replacetxt.replace(/#套餐价格#/g, '高级代练：80元 \n 指定英雄：90元 \n 防沉迷：100元');
        replacetxt = replacetxt.replace(/#代练耗时#/g, '正常0-4小时随时上号 \n 加急0- 1 小时左右上号 \n 上号后30小时左右完成 \n 此单预计8小时完成');
        replacetxt = replacetxt.replace(/#首单内容#/g, '星耀5-星耀4：20元');
        //replacetxt = replacetxt.replace(/#首单价格#/g, '20元');
        $('.' + id +'model').val('生成的报价示例: \n \n'+ replacetxt);

    }
    function delsdfun() {
        $.ajax({
            type: "POST",
            url: "/GameAjax/DelGamePriceLOLJinji",
            data: { pid: curid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 800 }, function () {
                    if (data.code > 0) {
                        tableListsdroload();
                    } 

                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        })
        return false;

    }


    function getWZDW() {
        $.ajax({
            type: "GET",
            url: "/GameAjax/GetSystemPriceCalculatorByGame?game=" + gameName + "&project=" + project,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                //dwData = data.data;
                origindata = data.data;
                var newarrs = [], stars = [], ids = [], damount = 0, pamount = 0, hours = 0, curname = '';
                data.data.forEach(function (item, index) {
                    if ((item.LeveName1 == "王者" && gameName == "王者荣耀") || item.LeveName1 == "等级") {
                        newarrs.push(item)
                    } else { 
                        let endKey = item.LeveName2.substr(item.LeveName2.length - 1, 1);
                        if (item.LeveName1 == curname) {
                            if (stars.indexOf(item.LeveName2) < 0) {
                                stars.push(item.LeveName2);
                            }
                            ids.push(item.PriceCalculatorId);
                            damount = item.DAmount;
                            pamount = item.PAmount;
                            hours = item.Hours;
                            if (index == data.data.length - 1) {
                                var obj = {
                                    LeveName1: curname,
                                    PriceCalculatorId: ids.join(','),
                                    PriceCalculatorSetId: item.PriceCalculatorSetId,
                                    LeveName2: stars.length > 1 ? "1星-" + stars.length + "星" : "",
                                    PAmount: pamount,
                                    DAmount: damount,
                                    Hours: hours,
                                    EndPoint: item.EndPoint,
                                    StartPoint: item.EndPoint,
                                    size: ids.length
                                }
                                newarrs.push(obj);                                
                            }

                        } else {
                            
                            if (curname != "") {
                                var obj = {
                                    LeveName1: curname,
                                    PriceCalculatorId: ids.join(','),
                                    PriceCalculatorSetId: data.data[index - 1].PriceCalculatorSetId,
                                    LeveName2: stars.length > 1 ? "1" + endKey + "-" + stars.length + endKey : "",
                                    PAmount: pamount,
                                    DAmount: damount,
                                    Hours: hours,
                                    EndPoint: data.data[index - 1].EndPoint,
                                    StartPoint: data.data[index - 1].EndPoint,
                                    size: ids.length
                                }
                                newarrs.push(obj);                              
                                stars = [], ids = [], damount = 0, pamount = 0, hours = 0;
                            }
                            
                            curname = item.LeveName1;
                            stars.push(item.LeveName2);
                            ids.push(item.PriceCalculatorId);
                            damount = item.DAmount;
                            pamount = item.PAmount;
                            hours = item.Hours;
                            if (index == data.data.length - 1) {
                                var obj = {
                                    LeveName1: curname,
                                    PriceCalculatorId: ids.join(','),
                                    PriceCalculatorSetId: item.PriceCalculatorSetId,
                                    LeveName2: stars.length > 1 ? "1" + endKey + "-" + stars.length + endKey : "",
                                    PAmount: pamount,
                                    DAmount: damount,
                                    Hours: hours,
                                    EndPoint: item.EndPoint,
                                    StartPoint: item.EndPoint,
                                    size: ids.length
                                }                                
                                newarrs.push(obj);                               
                            }

                        }
                    }

                })

                dwData = newarrs;
                loadDwTable();
                if (data.count > 0) {
                    $(".initdata").hide()
                    $(".delinit").show()
                }
                else {
                    $(".delinit").hide()
                    layer.alert('该游戏还没有初始化数据，请点击列表头部的“初始化数据”按钮');
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function getWZDFS() {        
        $.ajax({
            type: "GET",
            url: "/GameAjax/GetSystemPriceCalculatorByGame?game=" + gameName + "&project=" + project,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                dfsData = data.data;
                if (tableList2 == null) {
                    table2reload();
                } else {
                    loadDFSTable();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
   
    var table2Current = {
        index: 0,
        id: 0
    };
    function loadDwTable() {
        tableList.reload({
            data: dwData
        })
        return false;
    }
    function loadDFSTable() {
        try {
            tableList2.reload({
                data: dfsData
            })
        }
        catch {
            table2reload();
        }
       
        return false;
    }
    table.on('toolbar(tableList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'initdata':
                initdatafun();
                break;
            case 'delinit':
                delinitfun();
                break;
            case 'editpamount':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].PriceCalculatorId);
                };
                var ids = tempData.join(',');
                layer.prompt({ title: '请输入单价，可为0，但不能为空', formType: 0, value: 0, maxlength: 5 }, function (value, index, elem) {
                    if (!VerifyMoeny(value)) {
                        layer.msg('请输入正确格式的金额，默认为0', { time: 800 }, function () {
                            return false;
                        });
                        return false;
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (var y = 0; y < dwData.length; y++) {
                            var item = dwData[y];
                            if (item.PriceCalculatorId == data[i].PriceCalculatorId) {
                                dwData[y].PAmount = value;
                            }
                        }
                    };
                    editValue(ids, value, 10, true);
                    layer.close(index);
                });
                break;
            case 'editdamount':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].PriceCalculatorId);
                };
                var ids = tempData.join(',');
                layer.prompt({ title: '请输入单价，可为0，但不能为空', formType: 0, value: 0, maxlength: 5 }, function (value, index, elem) {
                    if (!VerifyMoeny(value)) {
                        layer.msg('请输入正确格式的金额，默认为0', { time: 800 }, function () {
                            return false;
                        });
                        return false;
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (var y = 0; y < dwData.length; y++) {
                            var item = dwData[y];
                            if (item.PriceCalculatorId == data[i].PriceCalculatorId) {
                                dwData[y].DAmount = value;
                            }
                        }
                    };
                    editValue(ids, value, 20, true);
                    layer.close(index);
                });
                break;
            case 'editdhour':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].PriceCalculatorId);
                };
                var ids = tempData.join(',');
                layer.prompt({ title: '请输入小时数，可为0，但不能为空', formType: 0, value: 0, maxlength: 5 }, function (value, index, elem) {
                    if (!VerifyMoeny(value)) {
                        layer.msg('请输入正确小时数，默认为0', { time: 800 }, function () {
                            return false;
                        });
                        return false;
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (var y = 0; y < dwData.length; y++) {
                            var item = dwData[y];
                            if (item.PriceCalculatorId == data[i].PriceCalculatorId) {
                                dwData[y].Hours = value;
                            }
                        }
                    };
                    editValue(ids, value, 30, true);
                    layer.close(index);
                });
                break;
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var name = obj.data.projectName;
            var ordy = obj.data.orderBy;
            editProject(id, name, ordy);
            
        }
        if (obj.event === 'pviewReport') {
            //if (obj.data.LeveName2.indexOf('星') > -1 && gameName == '英雄联盟手游') {
            //    layer.msg('此处填写每颗星的单价', {time:1000})
            //}
            if (gameName.indexOf('英雄联盟手游') > -1 || gameName == '穿越火线' || gameName == '幻塔' || gameName == '跑跑卡丁车手游' || gameName == '第五人格') {
                if (obj.data.LeveName1 == '大师上分') { obj.data.LeveName1 ='大师上星'}
                if (obj.data.LeveName1.indexOf('上分') > -1 || obj.data.LeveName1.indexOf('上星') > -1) {
                    //let labels = obj.data.LeveName1.split('上');
                    let str = '分数区间-' + obj.data.LeveName1;
                    layer.msg('此处不用填，请到' + str+'里设置', { time: 1300 })
                } else {
                    layer.msg('此处填写整段价格', { time: 1000 })
                }
            }
            if (gameName.indexOf('金铲铲之战') > -1 || gameName == '云顶之弈' ) {              
                if (obj.data.LeveName1.indexOf('上') > -1) {
                    //let labels = obj.data.LeveName1.split('上');
                    let str = '分数区间-' + obj.data.LeveName1;
                    layer.msg('此处不用填，请到' + str + '里设置', { time: 1300 })
                } else {
                    layer.msg('此处填写整段价格', { time: 1000 })
                }
            }
        }
        if (obj.event === 'timeReport') {
            if ( gameName == '穿越火线') {
                if (obj.data.LeveName1.indexOf('上分') > -1) {
                    layer.msg('此处不用填，请到分数区间 - 荣耀枪王上分里设置', { time: 1300 })
                } else {
                    layer.msg('此处填写整段时间', { time: 1000 })
                }
            }
        }
        return false;
    });

    table.on('edit(tableList)', function (obj) {      
        let ctype = 10;
        if (obj.field == "DAmount") {
            ctype = 20;
        }
        else if (obj.field == "Hours") {
            ctype = 30;
        }
        for (var y = 0; y < dwData.length; y++) {
            var item = dwData[y];
            if (item.PriceCalculatorId == obj.data.PriceCalculatorId) {
                dwData[y].DAmount = obj.value;
            }
        }
        var value = obj.value;
        //if (obj.data.LaveNameType != "王者") {
        //    value = Math.ceil(obj.value * 100 / obj.data.size )/100
        //}
        editValue(obj.data.PriceCalculatorId, value, ctype, false);
    });
    table.on('toolbar(tableList2)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList2();
                break;
            case 'addLineBtn':
                dfsData.push({
                    "PriceCalculatorId": 0
                    , "PriceCalculatorSetId": 2
                    , "LeveName1": ""
                    , "LeveName2": ""
                    , "StartPoint": ""
                    , "EndPoint": ""
                    , "PAmount": 0
                    , "DAmount": ""
                    , "Hours": 0
                });
                tableList2.reload({
                    data: dfsData
                });
                break;
        };
    });
    table.on('edit(tableList2)', function (obj) {
        let ctype = 10;
        if (obj.field == "EndPoint") {
            ctype = 20;
        }
        else if (obj.field == "DAmount") {
            ctype = 30;
        }
        else if (obj.field == "Hours") {
            ctype = 40;
        }
        var index = 0;
        for (var y = 0; y < dfsData.length; y++) {
            var item = dfsData[y];
            if (item.PriceCalculatorId == obj.data.PriceCalculatorId) {
                index = y;
                if (ctype == 10) {
                    dfsData[y].StartPoint = obj.value;
                    break;
                }
                else if (ctype == 20) {
                    dfsData[y].EndPoint = obj.value;
                    break;
                }
                else if (ctype == 30) {
                    dfsData[y].DAmount = obj.value;
                    break;
                }
                else if (ctype == 40) {
                    dfsData[y].Hours = obj.value;
                    break;
                }
            }
        }

        $.ajax({
            type: "Post",
            url: "/GameAjax/ChangePriceCalculatorSettingPriceParamByDFS",
            data: { sid: obj.data.PriceCalculatorId, ctype: ctype, value: obj.value, gameName: gameName, project: project },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) {
                indexLoad = layer.load(1, { shade: false });
            },
            success: function (data) {
                if (data.code > 0) {
                    obj.update({
                        PriceCalculatorId: data.code,
                    });
                    for (var i = 0; i < dfsData.length; i++) {
                        if (i == index) {
                            dfsData[i].PriceCalculatorId = data.code;
                            break;
                        }
                    }
                }
                else {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    table.on('tool(tableList2)', function (obj) {
        var data = obj.data;
        if (obj.event === 'removeLine') {
            var id = obj.data.PriceCalculatorId;
            if (dfsData.length == 1) {
                layer.alert('列表里至少保留1行');
                return false;
            }
            for (var y = 0; y < dfsData.length; y++) {
                if (dfsData[y].PriceCalculatorId == id) {
                    dfsData.splice(y, 1);
                    break;
                }
            }
            obj.del();
            delDFSValue(id);
            return false;
        }
    });
    function initdatafun() {       
        if (!re) return false;
        re = false;
        
        $.ajax({
            type: "Post",
            url: "/GameAjax/InitializationGamePriceSettingParas",
            data: { gameName: gameName, project:project },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) {
                indexLoad = layer.load(1, { shade: false });
            },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        if (gameName == '') {
                            getBaseSetting();
                        } else {
                            reloadOrderList();
                        }
                        
                        re = true
                    }
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

    }
    function delinitfun() {
        layer.confirm('是否确认将以下列表中的段位参数全部清空，清空后可以重新初始化。注意，该方法并不会删除右边的套餐设置', {
            btn: ['确定'] //可以无限个按钮  
            , title: "提示"
        }, function (index, layero) {
                layer.close(index);
                var stid = origindata[0].PriceCalculatorId;
                var etid = origindata[origindata.length-1].PriceCalculatorId;

                if (!re) return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/GameAjax/DelGamePriceDwSetting",
                    data: { sid: stid, eid: etid },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); },
                    beforeSend: function (XMLHttpRequest) {
                        indexLoad = layer.load(1, { shade: false });
                    },
                    success: function (data) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                reloadOrderList();
                                re = true
                            }
                        })
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
        });

    }
    function reloadOrderList() {
        dwData = [];
        tableList.reload({
            data: dwData
        });
        getWZDW()
        //tableList.reload({
        //    url: "/GameAjax/GetSystemPriceCalculatorByGame?game=" + gameName + "&project=" + project
        //    , where: {
        //    }
        //    , page: false
        //    , limit: 1000
        //});
        //return false;
    }
    function reloadOrderList2() {
        dfsData = [];
        tableList2.reload({
            data: dfsData
            , where: {
            }
            , page: false
            , limit: 1000
        });
        getWZDFS()
        return false;
    }

    function delProject(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/DelProject",
            data: { pid: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
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
        return false;
    }
    var layerWindow;
    $(document).on('click', '.editProject', function () {
        var ids = $(this).attr('data-id');
        var sname = $(this).attr('data-proname');
        var sorderby = $(this).attr('data-orderby');
        editProject(ids, sname, sorderby);
    });
    function editValue(idx, newval, ctype, isload) {
        $.ajax({
            type: "Post",
            url: "/GameAjax/ChangePriceCalculatorSettingPriceParam",
            data: { idx: idx, ctype: ctype, value: newval },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) {
                if (isload) {
                    indexLoad = layer.load(1, { shade: false });
                }
            },
            success: function (data) {
                if (isload) {
                    reloadOrderList();
                    layer.msg(data.msg, { time: 600 }, function () {
                    })
                } else {
                    if (data.code < 1) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                        })
                    }
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function delDFSValue(sid) {
        $.ajax({
            type: "Post",
            url: "/GameAjax/DelPriceCalculatorSettingPriceParamByDFS",
            data: { sid: sid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) {
            },
            success: function (data) {
                if (data.code > 0) {
                    //reloadOrderList2();
                }
                else {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    })
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('submit(DW_SaveBtn)', function (data) {
        if (data.field.dw_stayPar == '') data.field.dw_stayPar = 0;
        if (data.field.dfs_stayPar == '') data.field.dfs_stayPar = 0;
        if (data.field.dw_profit == '') data.field.dw_profit = 0;
        if (data.field.dw_iosPercent == '') data.field.dw_iosPercent = 0;
        if (data.field.dw_packgePar1 == '') data.field.dw_packgePar1 = 0;
        if (data.field.dw_packgePar2 == '') data.field.dw_packgePar2 = 0;
        if (data.field.dw_packgePar3 == '') data.field.dw_packgePar3 = 0;
        if (data.field.dw_packgePar4 == '') data.field.dw_packgePar4 = 0;
        if (data.field.dw_packgePar5 == '') data.field.dw_packgePar5 = 0;
        if (data.field.dw_packgePar6 == '') data.field.dw_packgePar6 = 0;
        if (data.field.dw_packgePar7 == '') data.field.dw_packgePar7 = 0;

        if (data.field.dfs_profit == '') data.field.dfs_profit = 0;
        if (data.field.dfs_iosPercent == '') data.field.dfs_iosPercent = 0;
        if (data.field.dfs_packgePar1 == '') data.field.dfs_packgePar1 = 0;
        if (data.field.dfs_packgePar2 == '') data.field.dfs_packgePar2 = 0;
        if (data.field.dfs_packgePar3 == '') data.field.dfs_packgePar3 = 0;
        if (data.field.dfs_packgePar4 == '') data.field.dfs_packgePar4 = 0;
        if (data.field.dfs_packgePar5 == '') data.field.dfs_packgePar5 = 0;
        if (data.field.dfs_packgePar6 == '') data.field.dfs_packgePar6 = 0;
        if (data.field.dfs_packgePar7 == '') data.field.dfs_packgePar7 = 0;
        var strParameter = JSON.stringify(data.field);

        var isre = /^\d+(?=\.{0,1}\d+$|$)/;


        if ((twoLevel == 0 && data.field.dw_stayPar != 0 && !isre.test(data.field.dw_stayPar)) || (twoLevel != 0 && data.field.dfs_stayPar != 0 && !isre.test(data.field.dfs_stayPar))) {
            layer.msg('扣留折扣填写错误')
            return false;
        }
        if ((data.field.dw_stayPar != 0 && !data.field.dw_stayPackgeName && twoLevel == 0) || (!data.field.dw_stayPar && data.field.dw_stayPackgeName && twoLevel == 0) || (data.field.dfs_stayPar != 0 && !data.field.dfs_stayPackgeName && twoLevel != 0) || (!data.field.dfs_stayPar && data.field.dfs_stayPackgeName && twoLevel != 0)) {
            layer.msg('折扣名称及折扣值请填写完整')
            return false;
        }

        if ((data.field.dw_stayPar != 0 && data.field.dw_stayPar >= 10 && twoLevel == 0) || (data.field.dfs_stayPar != 0 && data.field.dfs_stayPar >= 10 && twoLevel != 0)) {
            layer.msg('折扣值应小于10，请重新填写')
            return false;
        }

        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/GameAjax/SavePriceCalculatorSettingPriceParamByDwBase",
            data: { gameName: gameName, project: project, param: strParameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function getBaseSetting() {
        $.ajax({
            type: "Post",
            url: "/GameAjax/GetPriceCalculatorSettingPriceParamByBase",
            data: { gameName: gameName, project: project },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('读取基础参数错误！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    if (data.data.BaseSetting != '') {
                        let model = JSON.parse(data.data.BaseSetting);
                        if (gameName == '王者荣耀') {
                            if (model.mingwen != null) {
                                if (project.indexOf('段位')>-1) {
                                    for (let i = 0; i < model.mingwen.length; i++) {
                                        let item = model.mingwen[i];
                                        if (item.ptitle == "青铜") {
                                            form.val("pro", {
                                                "qt1": item.p1
                                                , "qt2": item.p2
                                                , "qt3": item.p3
                                                , "qt4": item.p4
                                                , "qt5": item.p5
                                            });
                                        }
                                        else if (item.ptitle == "白银") {
                                            form.val("pro", {
                                                "by1": item.p1
                                                , "by2": item.p2
                                                , "by3": item.p3
                                                , "by4": item.p4
                                                , "by5": item.p5
                                            });
                                        }
                                        else if (item.ptitle == "黄金") {
                                            form.val("pro", {
                                                "hj1": item.p1
                                                , "hj2": item.p2
                                                , "hj3": item.p3
                                                , "hj4": item.p4
                                                , "hj5": item.p5
                                            });
                                        }
                                        else if (item.ptitle == "铂金") {
                                            form.val("pro", {
                                                "bj1": item.p1
                                                , "bj2": item.p2
                                                , "bj3": item.p3
                                                , "bj4": item.p4
                                                , "bj5": item.p5
                                            });
                                        }
                                        else if (item.ptitle == "钻石") {
                                            form.val("pro", {
                                                "zs1": item.p1
                                                , "zs2": item.p2
                                                , "zs3": item.p3
                                                , "zs4": item.p4
                                                , "zs5": item.p5
                                            });
                                        }
                                        else if (item.ptitle == "星耀") {
                                            form.val("pro", {
                                                "xy1": item.p1
                                                , "xy2": item.p2
                                                , "xy3": item.p3
                                                , "xy4": item.p4
                                                , "xy5": item.p5
                                            });
                                        }
                                        else {
                                            form.val("pro", {
                                                "wz1": item.p1
                                                , "wz2": item.p2
                                                , "wz3": item.p3
                                                , "wz4": item.p4
                                                , "wz5": item.p5
                                            });
                                        }
                                    }
                                }
                                else {
                                    for (let i = 0; i < model.mingwen.length; i++) {
                                        let item = model.mingwen[i];
                                        form.val("pro", {
                                            "p1": item.p1
                                            , "p2": item.p2
                                            , "p3": item.p3
                                            , "p4": item.p4
                                            , "p5": item.p5
                                        });
                                    }
                                }
                            }
                            
                        }
                        else {////其他游戏                           
                            
                        }                        
                        if (project.indexOf('段位') > -1) {
                            form.val("pro", {
                                "dw_profit": model.profit_rate
                                , "dw_packgeName": model.packgeName
                                , "dw_packgeName1": model.packgeName1
                                , "dw_packgePar1": model.packge_rate1
                                , "dw_packgeName2": model.packgeName2
                                , "dw_packgePar2": model.packge_rate2
                                , "dw_packgeName3": model.packgeName3
                                , "dw_packgePar3": model.packge_rate3
                                , "dw_packgeName4": model.packgeName4
                                , "dw_packgePar4": model.packge_rate4
                                , "dw_packgeName5": model.packgeName5
                                , "dw_packgePar5": model.packge_rate5
                                , "dw_packgeName6": model.packgeName6
                                , "dw_packgePar6": model.packge_rate6
                                , "dw_packgeName7": model.packgeName7
                                , "dw_packgePar7": model.packge_rate7
                                //, "dw_words": model.words,
                                ,"dw_stayPackgeName": model.stay_packName,
                                "dw_stayPar": model.stay_rate,
                                "dw_stayWords": model.stay_word,
                                "dw_pkmark1": model.packgeMark1,
                                "dw_pkmark2": model.packgeMark2,
                                "dw_pkmark3": model.packgeMark3,
                                "dw_pkmark4": model.packgeMark4,
                                "dw_pkmark5": model.packgeMark5,
                                "dw_pkmark6": model.packgeMark6,
                                "dw_pkmark7": model.packgeMark7,
                                "dw_ServiceType1": model.packge_ServiceType1 ? model.packge_ServiceType1:10,
                                "dw_ServiceType2": model.packge_ServiceType2 ? model.packge_ServiceType2:10,
                                "dw_ServiceType3": model.packge_ServiceType3 ? model.packge_ServiceType3:10,
                                "dw_ServiceType4": model.packge_ServiceType4 ? model.packge_ServiceType4:10,
                                "dw_ServiceType5": model.packge_ServiceType5 ? model.packge_ServiceType5:10,
                                "dw_ServiceType6": model.packge_ServiceType6 ? model.packge_ServiceType6:10,
                                "dw_ServiceType7": model.packge_ServiceType7 ? model.packge_ServiceType7:10,
                                "dw_firstOrderValue": model.firstOrderValue||0,
                                "dw_firstOrderModel": model.firstOrderModel,
                                "dw_firstOrderAppendModel": model.firstOrderAppendModel,
                                "dw_firstOrderMark": model.firstOrderMark
                            });
                            if (gameName.indexOf('英雄联盟手游') > -1 || gameName == '和平精英' || gameName == '金铲铲之战' || gameName == '云顶之弈' || gameName == '幻塔' || gameName == 'QQ飞车' || gameName == '暗区突围') {
                                form.val("pro", {
                                    "dw_iosPercent": model.iosPercent
                                });
                            }
                           
                        }
                        else {
                            
                            form.val("pro", {
                                "dfs_profit": model.profit_rate
                                , "dfs_packgeName": model.packgeName
                                , "dfs_packgeName1": model.packgeName1
                                , "dfs_packgePar1": model.packge_rate1
                                , "dfs_packgeName2": model.packgeName2
                                , "dfs_packgePar2": model.packge_rate2
                                , "dfs_packgeName3": model.packgeName3
                                , "dfs_packgePar3": model.packge_rate3
                                , "dfs_packgeName4": model.packgeName4
                                , "dfs_packgePar4": model.packge_rate4
                                , "dfs_packgeName5": model.packgeName5
                                , "dfs_packgePar5": model.packge_rate5
                                , "dfs_packgeName6": model.packgeName6
                                , "dfs_packgePar6": model.packge_rate6
                                , "dfs_packgeName7": model.packgeName7
                                , "dfs_packgePar7": model.packge_rate7
                                //, "dfs_words": model.words,
                                ,"dfs_stayPackgeName": model.stay_packName,
                                "dfs_stayPar": model.stay_rate,
                                "dfs_stayWords": model.stay_word,
                                "dfs_pkmark1": model.packgeMark1,
                                "dfs_pkmark2": model.packgeMark2,
                                "dfs_pkmark3": model.packgeMark3,
                                "dfs_pkmark4": model.packgeMark4,
                                "dfs_pkmark5": model.packgeMark5,
                                "dfs_pkmark6": model.packgeMark6,
                                "dfs_pkmark7": model.packgeMark7,
                                //"dfs_ServiceType1": model.packge_ServiceType1 ? model.packge_ServiceType1:10,
                                //"dfs_ServiceType2": model.packge_ServiceType2 ? model.packge_ServiceType2 : 10,
                                //"dfs_ServiceType3": model.packge_ServiceType3 ? model.packge_ServiceType3 : 10,
                                //"dfs_ServiceType4": model.packge_ServiceType4 ? model.packge_ServiceType4 : 10,
                                //"dfs_ServiceType5": model.packge_ServiceType5 ? model.packge_ServiceType5 : 10,
                                //"dfs_ServiceType6": model.packge_ServiceType6 ? model.packge_ServiceType6 : 10,
                                //"dfs_ServiceType7": model.packge_ServiceType7 ? model.packge_ServiceType7 : 10,
                                "dfs_firstOrderValue": model.firstOrderValue||0,
                                "dfs_firstOrderModel": model.firstOrderModel,
                                "dfs_firstOrderAppendModel": model.firstOrderAppendModel,
                                "dfs_firstOrderMark": model.firstOrderMark
                            });
                            if (gameName.indexOf('英雄联盟手游') > -1 || gameName == '和平精英' || gameName == '金铲铲之战' || gameName == '云顶之弈' || gameName == 'QQ飞车' || gameName == '暗区突围') {
                                form.val("pro", {
                                    "dfs_iosPercent": model.iosPercent
                                });
                            }
                        }
                        if (model.firstOrderModel == 0) {
                            $(".firstamount .layui-word-aux").html('%')
                        } else {
                            $(".firstamount .layui-word-aux").html('元')
                        }
                        if (model.words) {
                            inittext = model.words
                        }
                        initpricesetting();

                        form.render();
                    } else {
                        clearBaseSetting(); 
                        if (gameName == '守望先锋') {
                            initdatafun();
                        }
                    }
                } else {
                    clearBaseSetting();
                    if (gameName == '守望先锋') {
                        initdatafun();
                    }
                    
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    function initbasesetting() {




    }
    function clearBaseSetting() {
        form.val("pro", {
            "dw_profit": 0
            , "dw_packgeName": '大神代练套餐'
            , "dw_packgeName1": ''
            , "dw_packgePar1": 0
            , "dw_packgeName2": ''
            , "dw_packgePar2": 0
            , "dw_packgeName3": ''
            , "dw_packgePar3": 0
            , "dw_packgeName4": ''
            , "dw_packgePar4": 0
            , "dw_packgeName5": ''
            , "dw_packgePar5": 0
            , "dw_words": '欢迎您的光临'
            , "dfs_profit": 0
            , "dfs_packgeName": '大神陪练套餐'
            , "dfs_packgeName1": ''
            , "dfs_packgePar1": 0
            , "dfs_packgeName2": ''
            , "dfs_packgePar2": 0
            , "dfs_packgeName3": ''
            , "dfs_packgePar3": 0
            , "dfs_packgeName4": ''
            , "dfs_packgePar4": 0
            , "dfs_packgeName5": ''
            , "dfs_packgePar5": 0
            , "dfs_words": '欢迎您的光临',
            "dfs_stayPackgeName": '',
            "dfs_stayPar": 0,
            "dfs_stayWords": '',
            "dfs_stayPackgeName": '',
            "dfs_stayPar": 0,
            "dfs_stayWords": ''
        });
        form.render();
    }
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});