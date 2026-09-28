layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'util', 'ClipboardJS','element'], function () {
    var $ = layui.$,
        form = layui.form
       , element = layui.element,
        util = layui.util;
    var ClipboardJS = layui.ClipboardJS;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }
    var re = true;
    var indexLoad;
    var gameName = $("#gameName").val();
    var project = "段位";
    var alldata = null;
    var curselectstr1 =null;
    var curselectstr2 = null;
    var starmin = null;
    var starcur = null;
    var starmax = null;
    var endmin = null;
    var endmax = null;
    var endcur = null;
    var isfens = 0;
    var isfenstart = 0;
    var rulelist = [];
    var curshengl = '';
    var isjdpcore = window.navigator.userAgent.indexOf('jdpcore') > -1 ? true : false;
    var taocanlist = [];
    if (isjdpcore) {
        $(".tosetting").hide()
    }
    if (gameName == '永劫无间' || gameName == '哈利波特'){       
        $(".single").show();
    } else {
        $(".single").hide();
    }
    if (gameName == '王者荣耀' || gameName.indexOf('英雄联盟手游') > -1 || gameName == '和平精英' || gameName == '金铲铲之战' || gameName == '云顶之弈' || gameName == '幻塔' || gameName == 'QQ飞车' || gameName == '暗区突围') {
        $(".pingtaidiv").show()
    } else {
        $(".pingtaidiv").hide()
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
        $(".apex").hide()
        $(".noapex").hide()
        element.tab({
            headerElem: '.threes>li' //指定tab头元素项
        });
    } else if (gameName == '英雄联盟') {
        $(".heros").show()
        element.tab({
            headerElem: '.heros>li' //指定tab头元素项
        });
        if (gameName == '英雄联盟') getinitlist();

    }else if (gameName.indexOf('英雄联盟手游') > -1) {
        $(".herossy").show()
        element.tab({
            headerElem: '.herossy>li' //指定tab头元素项
        });
    } else if (gameName == '守望先锋') {
        $(".xianf").show()
        element.tab({
            headerElem: '.xianf>li' //指定tab头元素项
        });
        project = '分数区间-重装'
        $(".dfsdiv").show();
        $(".dwdiv").hide();
        $(".servicetypediv").hide();
        $("#dfs_rate1").focus();
    } else if (gameName == '穿越火线') {
        $(".cyhx").show()
        element.tab({
            headerElem: '.cyhx>li' //指定tab头元素项
        });
    } else if (gameName =='幻塔') {
        $(".huanta").show()
        element.tab({
            headerElem: '.huanta>li' //指定tab头元素项
        });
    } else if (gameName == '原神') {
        $(".yuanshen").show()
        element.tab({
            headerElem: '.yuanshen>li' //指定tab头元素项
        });
    } else if (gameName == '和平精英') {
        $(".hepinjy").show()
        element.tab({
            headerElem: '.hepinjy>li' //指定tab头元素项
        });
    } else if (gameName == '暗区突围') {
        $(".anqutw").show()
        element.tab({
            headerElem: '.anqutw>li' //指定tab头元素项
        });
    } else if (gameName == '暗黑不朽') {
        $(".anhbx").show()
        project ='段位-普通等级'
        element.tab({
            headerElem: '.anhbx>li' //指定tab头元素项
        });
    } else if (gameName == '金铲铲之战' || gameName == '云顶之弈') {
        $(".jincc").show()
        element.tab({
            headerElem: '.jincc>li' //指定tab头元素项
        });
    } else if (gameName == '跑跑卡丁车手游') {
        $(".ppkdc").show()
        element.tab({
            headerElem: '.ppkdc>li' //指定tab头元素项
        });
    } else if (gameName == '第五人格') {
        $(".dwreng").show()
        element.tab({
            headerElem: '.dwreng>li' //指定tab头元素项
        });
    }  else {
        $(".apex").hide()
        $(".noapex").show()
        $(".threes").hide()
        element.tab({
            headerElem: '.noapex>li' //指定tab头元素项
        });
    }

    if (gameName == '守望先锋') {

    } else {
        getalldw()
    }

    getPriceSettPackgeName()

    element.on('tab(project)', function (data) {
        curselectstr1 = null;
        curselectstr2 = null;
        let tempProject = data.elem.context.dataset.project;
        project = tempProject;
        if (tempProject.indexOf("段位") > -1) {
            getalldw()
            $(".dfsdiv").hide();
            $(".dwdiv").show();
            $(".servicetypediv").show();
            $("#currentWZ_DW1").focus();
            //$(".projectname").hide()
        }
        else {
            $(".dfsdiv").show();
            $(".dwdiv").hide();
            $(".servicetypediv").hide();
            $("#dfs_rate1").focus();
            //$(".projectname").show();
        }       
        $(".resultUL").val('');
        getPriceSettPackgeName();
        
        form.val("pro", {
            "dw_profit": 30
            , "wzservicetype": 10
            , "currentWZ_DW1": 0
            , "currentWZ_DW2": 0
            , "dfs_rate1": ''
            , "dfs_rate2": ''
            , "mingwenvalue":0
        });
        form.render();
        $(".refsh").trigger("click")
        //var dfs_rate1 = gameName == "王者荣耀" ? $("#dfs_rate1").val() : $("#dfs_rate11").val();
        //var dfs_rate2 = gameName == "王者荣耀" ? $("#dfs_rate2").val() : $("#dfs_rate22").val();
        //if ((tempProject.indexOf('段位') > -1 && curselectstr1 && curselectstr2) || (tempProject.indexOf('段位') == -1 && dfs_rate1 && dfs_rate2)) {
        //    $(".subbtn").trigger("click")
        //}        
        return false;
    });

    element.on('tab(selectTab)', function (data) {
        let tempGame = data.elem.context.dataset.game;
        location.href = "/Game/PriceCalculator?gameName=" + tempGame;
    });
    form.on('radio(wzproject)', function (data) {
        if (data.value == '巅峰赛' || data.value == "分数区间" || data.value=="等级") {
            $(".dfsdiv").show();
            $(".dwdiv").hide();
            $(".servicetypediv").hide(); 
            $("#dfs_rate1").focus();
        } else {
            $(".dfsdiv").hide();
            $(".dwdiv").show();
            $(".servicetypediv").show();
            $("#currentWZ_DW1").focus();
        }
        project = data.value;
        $(".resultUL").val('');

        form.val("pro", {
            "dw_profit": 30
            , "wzservicetype": 10
            , "currentWZ_DW1":0
            , "currentWZ_DW2": 0
            , "dfs_rate1": '' 
            , "dfs_rate2": ''
        });      
        form.render();
       
    });
    form.on('submit(refsh)', function (data) {
         
        $("input:radio[name=mingwenvalue]").attr("checked", false);

        if ($(".start0").html() == '等级') {
            starcur = 1;
            endcur = 1;    
            form.val("pro", {               
                "isbaohan": 1,
                "isbaohan2": 1,
                "wzservicetype": 10
                , "wzservicetype2": 10,
                "starcur01": 1,
                "endcur01": 1,
                "starcur02": 1,
                "endcur02": 1,
                "isproject1": 1,
                "isproject2": 1
                 , "dfs_rate1": ''
                , "dfs_rate2": ''
                , "dfs_rate11": ''
                , "dfs_rate22": '',
                'platfrom': 0,
                'platfrom2': 0,
                'isfirstorder1': 1,
                'isfirstorder2': 1
            });
            form.render();
            $(".resultUL").val('')
            return false;
        }
        curselectstr1 = null;
        curselectstr2 = null;
        starmin = null;
        starcur = null;
        starmax = null;
        endmin = null;
        endmax = null;
        endcur = null;    
        $(".start0").html('段位')
        $(".end0").html('段位')
        
        form.val("pro", {
            "dw_profit": 30
            , "wzservicetype": 10
            , "wzservicetype2": 10
            , "currentWZ_DW1": 0
            , "currentWZ_DW2": 0
            , "dfs_rate1": ''
            , "dfs_rate2": ''
             , "dfs_rate11": ''
             , "dfs_rate22": ''
            , "mingwenvalue": 0,
            "isbaohan": 1,
            "isbaohan2": 1,
            "isproject1": 1,
            "isproject2": 1,
            'platfrom': 0,
            'platfrom2': 0,
            'isfirstorder1': 1,
            'isfirstorder2':1
        });
        form.render();
        $(".dwdiv .num").removeClass('activenum');
        $(".startbtn").hide();
        $(".endbtn").hide();
        $(".resultUL").val('')
        return false;
    })
    form.on('submit(JSbtn_WZRY)', function (data) {
        var fst, fet;
        var priceType = data.elem.dataset.pricetype;
        var service = data.field.wzservicetype;
        var st = gameName == "王者荣耀" ? data.field.currentWZ_DW1 : data.field.currentWZ_DW11;
        var et = gameName == "王者荣耀" ? data.field.currentWZ_DW2 : data.field.currentWZ_DW22;
        var dfs_rate1 = gameName == "王者荣耀" ? data.field.dfs_rate1 : data.field.dfs_rate11;
        var dfs_rate2 = gameName == "王者荣耀" ? data.field.dfs_rate2 : data.field.dfs_rate22;
        var mw = data.field.mingwenvalue;
        var isbanhao = data.field.isbaohan;
        var isproject = data.field.isproject1;
        var ssd, esd;
        var platfrom = data.field.platfrom;
        var isfirstorder = data.field.isfirstorder1;
  
        if (gameName == "王者荣耀") {
            if (mw == null || mw == undefined) {
                if (st == 0) {
                    layer.msg('请选择铭文区间', { time: 1500 }, function () {
                    });
                    return false;
                }
            }
        } else {
            service = data.field.wzservicetype2;
            isbanhao = data.field.isbaohan2;
            isproject = data.field.isproject2;
            isfirstorder = data.field.isfirstorder2;
            platfrom = data.field.platfrom2;
        }
        var taocanvalue;
        if (gameName == '王者荣耀') {
            taocanvalue = []
            $('input[name=packages]:checked').each(function () {
                taocanvalue.push($(this).val());
            });

        } else {
            taocanvalue = []
            $('input[name=packages2]:checked').each(function () {
                taocanvalue.push($(this).val());
            });
        }
      
        if (project.indexOf('段位')>-1) {
            if (!curselectstr1) {
                layer.msg('请选择段位', { time: 1500 }, function () {
                });
                return false;
            } else if (!curselectstr2) {
                layer.msg('请选择结束段位', { time: 1500 }, function () {
                });
                return false;
            }            
            let startclass = $(".activenum")[0].className.split(' ')[1];
            let endclass = $(".activenum")[1].className.split(' ')[1];          
            if (startclass.split("_")[1] == endclass.split("_")[1] && startclass.split("_")[2] == endclass.split("_")[2] && starcur * 1 > endcur * 1) {
                layer.msg('起始星数(等级)应小于结束星数(等级)，请重新选择', { time: 1500 }, function () {
                });
                return false;
            }
            if (starcur && gameName != '英雄联盟' && gameName != '金铲铲之战' && gameName != '云顶之弈') {
                let stars = alldata[startclass.split('_')[1]].type[startclass.split('_')[2]].star;
                stars.forEach(function (item, index) {
                    if (starcur == item.LeveName2.substr(0, item.LeveName2.length - 1)) {
                        st = item.id
                    }
                })
                if (isfenstart == '1') {
                    st = alldata[startclass.split('_')[1]].type[startclass.split('_')[2]].star[0].id
                }
                
            } else {
                st = alldata[startclass.split('_')[1]].type[startclass.split('_')[2]].star[0].id
            }

            if (endcur && gameName != '英雄联盟' && gameName != '金铲铲之战' && gameName != '云顶之弈') {
                let stars = alldata[endclass.split('_')[1]].type[endclass.split('_')[2]].star;
                stars.forEach(function (item, index) {
                    if (endcur == item.LeveName2.substr(0, item.LeveName2.length - 1)) {
                        et = item.id
                    }
                })
                if (isfens=='1') {
                    et = alldata[endclass.split('_')[1]].type[endclass.split('_')[2]].star[0].id
                }
                

            } else {
                et = alldata[endclass.split('_')[1]].type[endclass.split('_')[2]].star[0].id
            }

            //段位+分数 英雄联盟 英雄联盟手游 
            let strstart = $(".start0").html();
            let strend = $(".end0").html();
            if (gameName == '英雄联盟' || gameName == '金铲铲之战' || gameName == '云顶之弈') {  // 英雄联盟 晋级赛
                ssd = starcur;
                esd = '';
                /* */
                if (strstart.indexOf('晋级')>-1) {
                    ssd = curshengl;
                } 
                if (new RegExp("[0-9]").test(strend)) {
                    esd = endcur;
                }
            }

            //if (gameName.indexOf('英雄联盟手游') > -1) { //英雄联盟手游 钻石胜点
            //    ssd = '', esd='', fst = 0, fet = 0;
            //    if (strstart.indexOf('钻石') > -1) {
            //        fst = starcur;
            //    }
            //    if (strend.indexOf('钻石') > -1) {
            //        fet = endcur;
            //    }
            //}

            //if (gameName.indexOf('金铲铲之战') > -1) { //金铲铲之战 胜点
            //    ssd = starcur;
            //    esd = endcur;                
            //}
            if (isfens==1) {//上分
                fet = endcur;
            }
            if (isfenstart == 1) {
                fst = starcur;
            }
            if (isfens != 1 && isfenstart != 1) {
                fst = 0, fet = 0;
            }


        }
        else {
            if (dfs_rate1 == '' || dfs_rate1 == undefined || dfs_rate1 == null) {
                layer.msg('请输入当前分', { time: 1500 }, function () {
                });
                return false;
            }
            if (dfs_rate2 == '' || dfs_rate2 == undefined || dfs_rate2 == null) {
                layer.msg('请输入目标分', { time: 1500 }, function () {
                });
                return false;
            }
            if (!VerifyInt(dfs_rate1)) {
                layer.msg('当前分格式不正确，请输入整数', { time: 1500 }, function () {
                });
                return false;
            }
            if (!VerifyInt(dfs_rate2)) {
                layer.msg('目标分格式不正确，请输入整数', { time: 1500 }, function () {
                });
                return false;
            }
            if (parseInt(dfs_rate2) <= parseInt(dfs_rate1)) {
                layer.msg('目标分不能低于当前分', { time: 1500 }, function () {
                });
                return false;
            }
            service = 10;
            st = parseInt(dfs_rate1);
            et = parseInt(dfs_rate2);
        }
        
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/GameAjax/GetCalculationPrice",
            data: { gameName: gameName, project: project, serviceType: service, st: st, et: et, fst: fst, fet: fet, mw: mw, priceType: priceType, ssd: ssd, esd: esd, platfrom: platfrom },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    var projectname = data.data[0].project;
                    //if (project.indexOf('段位')< 0) {
                    //    var index = data.data[0].project.search(/\d/);
                    //    projectname = data.data[0].project.substr(index)
                    //}
                    let fullContent = '';
                    if (priceType == 10) {
                        let html = '';
                        
                        if (data.data[0].packgeName) {
                            fullContent += data.data[0].packgeName + '\n';
                        }
                        
                        if (isproject) {
                            fullContent += (service == 20 ? '陪练' : '代练') + '项目：' + projectname + '\n';
                        }                       
                        fullContent += '价格：' + data.data[0].price + '元\n';
                        if (isbanhao) {
                            let hours = Math.round(data.data[0].hours);
                            let times='';
                            if (data.data[0].hours > 24) {
                                times += parseInt(hours / 24) + '天';
                                times += (hours * 10 - parseInt(hours / 24) * 10 * 24) / 10 + '小时';
                            } else {
                                times = data.data[0].hours + '小时';
                            }
                            fullContent += '完成时间：上号后大约' + times + '\n';
                        }
                        if (data.data[0].words) {
                            fullContent += data.data[0].words;
                        }
                        $(".resultUL").val(fullContent);
                        $(".copycontent").trigger('click');
                        return false
                    }

                   
                    if (!data.data[0].words || (data.data[0].words && getCharCount(data.data[0].words,'#') <2)) {
                        fullContent = '';
                        fullContent += '所有套餐任亲选择\n';
                        if (isproject) {
                            fullContent += '【' + (service == 20 ? '陪练' : '代练') + '项目】：' + projectname + '\n';
                        }
                        for (let i = 0; i < data.data.length; i++) {
                            let item = data.data[i];
                            if (taocanvalue.indexOf(item.packgeName) > -1) {
                                fullContent += '【' + item.packgeName + '价格】：' + item.price + '元 ';
                                if (item.firstOrderAppendModel == 0 && item.firstOrderMark && isfirstorder == 1) {
                                    fullContent += ' ' + item.firstOrderMark;
                                }
                                if (item.packgeMark) {
                                    fullContent += item.packgeMark;
                                }
                                fullContent += '\n';
                            }
                            
                        }
                        if (isbanhao) {
                            let hours = Math.round(data.data[0].hours);
                            let times = '';
                            if (data.data[0].hours > 24) {
                                times += parseInt(hours / 24) + '天';
                                times += (hours * 10 - parseInt(hours / 24) * 10 * 24) / 10 + '小时';
                            } else {
                                times = data.data[0].hours + '小时';
                            }
                            fullContent += '【完成时间】：上号后大约' + times + '\n';
                        }
                        fullContent += data.data[0].words;
                        if (data.data[0].firstOrderAppendModel == 1 && isfirstorder == 1) {
                            fullContent += '\n' + data.data[0].firstOrderMark;
                        }
                        $(".resultUL").val(fullContent);
                        $(".copycontent").trigger('click');
                        return false
                    }

                    fullContent = data.data[0].words;
                    var curprice = '', curtime = '', firtprice = "", firtpricem="";
                    if (!isproject) {
                        projectname ='';
                    } 
                    for (let i = 0; i < data.data.length; i++) {
                        let item = data.data[i];
                        if (taocanvalue.indexOf(item.packgeName) > -1) {
                            curprice += item.packgeName + '：' + item.price + '元 ';
                            if (item.packgeMark) {
                                curprice += item.packgeMark;
                            }
                            if (item.firstOrderAppendModel == 0 && item.firstOrderMark && isfirstorder == 1) {
                                curprice += item.firstOrderMark;
                            }
                            if (i != data.data.length - 1) {
                                curprice += '\n';
                            }
                        }
                        
                    }
                    if (isbanhao) {
                        let hours = Math.round(data.data[0].hours);
                        let times = '';
                        if (data.data[0].hours > 24) {
                            times += parseInt(hours / 24) + '天';
                            times += (hours * 10 - parseInt(hours / 24) * 10 * 24) / 10 ;
                        } else {
                            times = data.data[0].hours;
                        }
                        curtime += '上号后大约' + times ;
                    }
                    if (isfirstorder == 1 && data.data[0].firstOrderAppendModel == 1 && data.data[0].firstOrderMark) {
                        firtpricem = data.data[0].firstOrderMark;
                        firtprice = data.data[0].firstOrderPrice;
                    }
                    fullContent = fullContent.replace(/#代练内容#/g, projectname);
                    fullContent = fullContent.replace(/#套餐价格#/g, curprice);
                    fullContent = fullContent.replace(/#代练耗时#/g, curtime);
                    fullContent = fullContent.replace(/#首单内容#/g, firtpricem);
                    fullContent = fullContent.replace(/#首单价格#/g, firtprice);
                   
                    $(".resultUL").val(fullContent);
                    $(".copycontent").trigger('click');
                } else {
                    layer.msg(data.msg)
                } 
            }             
            , complete: function (XMLHttpRequest) {
                re = true;
                layer.close(indexLoad);
            }
        });
        return false;
    })

    function getPriceSettPackgeName() {

        $.ajax({
            type: "POST",
            url: "/GameAjax/GetPriceSettPackgeName",
            data: { gameName: gameName, project: project },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    taocanlist = data.data;
                    var str = '';
                    if (gameName == '王者荣耀') {
                        taocanlist.forEach(function (item, index) {
                            str += '<input type="checkbox" name="packages" value="'+item+'" lay-skin="primary" title="' + item + '" checked>'
                        })
                        $(".taocao").html(str)
                    } else {
                        taocanlist.forEach(function (item, index) {
                            str += '<input type="checkbox" name="packages2" value="' + item + '" lay-skin="primary" title="' + item + '" checked>'
                        })
                        $(".taocao2").html(str)
                    }
                    form.render();
                }

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        })

    }

    function getCharCount(str, char) {
        var regex = new RegExp(char, 'g'); // 使用g表示整个字符串都要匹配
        var result = str.match(regex);          //match方法可在字符串内检索指定的值，或找到一个或多个正则表达式的匹配。
        var count = !result ? 0 : result.length;
        return count;
    }
    var copyPriceClipboard = new ClipboardJS('.copycontent', {
        text: function () {
            if (gameName == "王者荣耀") {
                var text = $(".resultUL01").val();
                return text;
            } else {
                var text = $(".resultUL02").val();
                return text;
            }            
        }
    });
    copyPriceClipboard.on('success', function (e) {
        layer.msg('复制成功', { time: 1000 });
        e.clearSelection();
    });
    copyPriceClipboard.on('error', function (e) {
        layer.msg('复制失败了，请手动复制', { time: 1000 });
    });


    $(".mystaradd01").on('click', function () {
        if (starcur < starmax) {
            
            starcur++;
            form.val("pro", {
                "starcur01": starcur
            });
            form.render();
        }
    })
    $(".myendadd01").on('click', function () {
        if (endcur < endmax ) {
            endcur++;
            form.val("pro", {               
              "endcur01": endcur
            });
            form.render();
        }
    })
    $(".mystarreduce01").on('click', function () {
        if (starcur > starmin) {
            starcur--;
            form.val("pro", {
                "starcur01": starcur              
            });
            form.render();
        }

    })
    $(".myendreduce01").on('click', function () {
        if (endcur > endmin) {
            endcur--;
            form.val("pro", {
               "endcur01": endcur
            });
            form.render();
        }
    })


    $(".mystaradd02").on('click', function () {
        if (starcur < starmax || isfenstart) {
            starcur++;
            form.val("pro", {               
               "starcur02": starcur
            });
            form.render();
        }
    })    
    $(".myendadd02").on('click', function () {
        if (endcur < endmax*1 || isfens==1) {
            endcur++;
            form.val("pro", {              
               "endcur02": endcur
            });
            form.render();
        }
    })   
    $(".mystarreduce02").on('click', function () {
        if (starcur > starmin) {
            starcur--;
            form.val("pro", {
                "starcur02": starcur
            });
            form.render();
        }
    })   
   
    $(".myendreduce02").on('click', function () {
        if (endcur > endmin) {
            endcur--;
            form.val("pro", {
                "endcur02": endcur
            });
            form.render();
        }
    })
    $(".startbtn input").on('blur', function (e) {
        if (isfenstart == 1) {
            starcur = $(this).val();
            return false;
        }
        if ($(this).val()*1 > starmax*1) {
            $(this).val(starmax)
        }
        starcur = $(this).val();

    })
    $(".endbtn input").on('blur', function (e) {
        if (isfens==1) {
            endcur = $(this).val();
            return false;
        }

        if ($(this).val()*1 > endmax*1) {
            $(this).val(endmax)
        }
        if ($(this).val() * 1 < endmin * 1) {
            $(this).val(endmin)
        }
        endcur = $(this).val();

    })

    
    function getinitlist() {

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
                if (data.code > 0) {  
                    rulelist = data.data;
                    var str = "";
                    data.data.forEach(function (item, index) {
                        str += '<div class="item" data-id="' + item.PriceCalculatorId+'">' + item.LeveName1+'</div>'
                    })
                    $('.myjinlist').html(str)
                    $('.startsd .item').on('click', function (e) {
                        if ($(this).hasClass('active')) {
                            $('.startsd .item').removeClass('active');
                            curshengl = '';
                        } else {
                            $('.startsd .item').removeClass('active');
                            $(this).addClass('active');
                            curshengl = e.currentTarget.dataset.id;
                        }
                        
                    })
                }
               
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        })


    }

    function getalldw() {
        $(".dwdiv .layui-inline01").html('');
        $.ajax({
            type: "POST",
            url: "/GameAjax/GetPriceCalculatorSettingPriceDW",
            data: { gameName: gameName, project: project },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
              
                var islevels = '星';
                if (data.code > 0) {
                    if (data.data[0].LeveName1 == '等级') {
                        islevels='级'
                    }
                    if (data.data[0].LeveName2.indexOf('分')>-1) {
                        islevels = '分'
                    }
                    let str = "", names = [], newArr = []; maxnum = 0;
                    data.data.forEach(function (item, index) {
                        var n = names.indexOf(item.LeveName1);
                        if (n == -1) {
                            names.push(item.LeveName1);
                            newArr.push({ LeveName1: item.LeveName1, stars: [{ id: item.PriceCalculatorId, LeveName2: item.LeveName2 }] })
                        } else {
                            let obj = { id: item.PriceCalculatorId, LeveName2: item.LeveName2 }
                            newArr[n].stars.push(obj)
                        }
                    })
                    console.log(newArr)
                    let curnum = ""; levels = []; arrs = []; curobj = {};
                    newArr.forEach(function (item, index) {
                        var reg = /\d/;
                        let isnum = reg.test(item.LeveName1);
                        let lavelname = item.LeveName1.indexOf('上分') > -1 || item.LeveName1.indexOf('上星') > -1? item.LeveName1.split('上')[0] : isnum ? item.LeveName1.substr(0, item.LeveName1.length - 1) : item.LeveName1.substr(0, item.LeveName1.length);
                        let isfen = item.LeveName1.indexOf('上分') > -1 || item.LeveName1.indexOf('上星') > -1 ? 1 : 0;
                        if (isfen) {
                            islevels = item.LeveName1.split('上')[1]
                        }
                        let str = isnum ? item.LeveName1.substr(item.LeveName1.length - 1) : '';
                        if (curnum != "" && curnum != lavelname) {
                            curnum = lavelname;
                            levels.push(curnum);
                            curobj = { level: curnum, isfen: isfen, label: islevels,type: [{ level: str, star: item.stars }] }
                            arrs.push(curobj)
                        } else if (curnum == "") {                           
                            curnum = lavelname;
                            levels.push(curnum);
                            curobj = { level: curnum, isfen: isfen, label: islevels, type: [{ level: str, star: item.stars }] }
                            arrs.push(curobj)
                        } else {
                            n = levels.indexOf(lavelname);                            
                            curitem = { level: str, star: item.stars, label: islevels }
                            arrs[n].type.push(curitem)
                        }

                    })

                    alldata = arrs;
                    console.log(alldata)
                    arrs.forEach(function (item, index) {

                        let str = '<div class="item item_' + index + '"><div class="name">' + item.level + '</div><div class="level "></div></div > '
                        $(".dwdiv .layui-inline01").append(str);
                        if (item.type.length > 1) {
                            item.type.forEach(function (obj, idx) {
                                let len = obj.star.length;
                                let str1 = "<div data-level='" + item.level + "' data-label='" + item.label + "' data-type='" + obj.level + "' data-maxstar='" + obj.star[len - 1].id + "'  data-minstar='" + obj.star[0].id + "' class='num num_" + index + "_" + idx + "'>" + obj.level + "</div>"
                                $(".dwdiv .layui-inline01 .item_" + index + " .level").append(str1)
                            })
                        } else if (item.type.length == 1 && item.type[0].star.length > 1) {
                            let len = item.type[0].star.length;
                            let str2 = "<div data-level='" + item.level + "' data-label='" + item.label + "' data-maxstar='" + item.type[0].star[len - 1].id + "'  data-minstar='" + item.type[0].star[0].id + "' class='num num_" + index + "_0_a'>A</div><div data-level='" + item.level + "' data-label='" + item.label + "' data-maxstar='" + item.type[0].star[len - 1].id + "'  data-minstar='" + item.type[0].star[0].id + "' class='num num_" + index + "_0_b'>B</div>"
                            $(".dwdiv .layui-inline01 .item_" + index + " .level").append(str2)
                        } else if (item.type.length == 1 && (gameName.indexOf('英雄联盟手游') > -1 || gameName.indexOf('金铲铲之战') > -1 || gameName.indexOf('云顶之弈') > -1 || gameName.indexOf('跑跑卡丁车手游') > -1 || gameName.indexOf('第五人格') > -1 || gameName.indexOf('云顶之弈') > -1)) {
                            let len = item.type[0].star.length;
                            let str2 = "<div data-level='" + item.level + "' data-label='" + item.label + "'  data-minstar='" + item.type[0].star[0].id + "' data-isfen='" + item.isfen + "' class='num num_" + index + "_0_a'>A</div><div data-level='" + item.level + "' data-isfen='" + item.isfen + "' data-label='" + item.label + "'  data-minstar='" + item.type[0].star[0].id + "' class='num num_" + index + "_0_b'>B</div>"
                            $(".dwdiv .layui-inline01 .item_" + index + " .level").append(str2)
                        } else {
                            let str3 = "<div data-level='" + item.level + "' data-label='" + item.label + "' data-minstar='" + item.type[0].star[0].id + "' data-isfen='"+item.isfen+"' class='num num_" + index + "_0_a'>A</div>"
                            $(".dwdiv .layui-inline01 .item_" + index + " .level").append(str3)
                        }
                    })

                    $(".dwdiv .num").on('click', function (e) {
                        $(".dwdiv .num").removeClass('activenum');                       
                        let curclass = e.currentTarget.className.split(" ")[1];
                        let level = e.currentTarget.dataset.level;
                        let label = e.currentTarget.dataset.label;
                        let type = $(this).html() == "A" || $(this).html() == "B" ? '' : $(this).html() == "晋级" ? '晋级赛' : $(this).html();
                        let str = level + (type ? type : '');
                        let str10 = null; str20 = null;
                        if (!curselectstr1) {
                            curselectstr1 = curclass;
                            $(".start0").text(str)

                        } else if (!curselectstr2) {
                            curselectstr2 = curclass;
                        } else {
                            if (curclass != curselectstr1 && curclass != curselectstr2) {
                                curselectstr1 = curselectstr2;
                                curselectstr2 = curclass;
                            }
                        }
                        $("." + curselectstr1).addClass('activenum')
                        $("." + curselectstr2).addClass('activenum')
                     
                        if (curselectstr2) {

                            //判断级别
                            let str001 = curselectstr1.split("_")[1] * 10 + curselectstr1.split("_")[2] * 1;
                            let str002 = curselectstr2.split("_")[1] * 10 + curselectstr2.split("_")[2] * 1;
                            let typestr1 = $("." + curselectstr1).html() == "A" || $("." + curselectstr1).html() == "B" ? '' : $("." + curselectstr1).html() == "晋级" ?'晋级赛': $("." + curselectstr1).html();
                            let typestr2 = $("." + curselectstr2).html() == "A" || $("." + curselectstr2).html() == "B" ? '' : $("." + curselectstr2).html() == "晋级" ? '晋级赛' : $("." + curselectstr2).html();
                            if (str001 == str002) {
                                str001 = curselectstr1.split("_")[3] == 'a' ? (str001 + 1) : (str001 + 2)
                                str002 = curselectstr2.split("_")[3] == 'a' ? (str002 + 1) : (str002 + 2)
                            }

                            if (str001 * 1 < str002 * 1) {
                                $(".start0").html(alldata[curselectstr1.split("_")[1]].level + typestr1);
                                $(".end0").html(alldata[curselectstr2.split("_")[1]].level + typestr2);

                                let startlabel = $("." + curselectstr1)[1].dataset.label;
                                $('.startxts').text(startlabel);
                                let endlabel = $("." + curselectstr2)[1].dataset.label;
                                $('.startxtd').text(endlabel);
                            } else if (str001 * 1 > str002 * 1) {
                                $(".start0").html(alldata[curselectstr2.split("_")[1]].level + typestr2);
                                $(".end0").html(alldata[curselectstr1.split("_")[1]].level + typestr1);

                                let startlabel = $("." + curselectstr2)[1].dataset.label;
                                $('.startxts').text(startlabel);
                                let endlabel = $("." + curselectstr1)[1].dataset.label;
                                $('.startxtd').text(endlabel);
                            }
                            if ($(".activenum").length > 1) {
                                isfenstart = 0;
                                //开始星数      
                                let startclass = $(".activenum")[0].className.split(' ')[1];
                                if (alldata[startclass.split("_")[1]].type[startclass.split("_")[2]].star.length > 1) {
                                    $(".startbtn").show();
                                    let starst = alldata[startclass.split("_")[1]].type[startclass.split("_")[2]].star;
                                    let starstarstr = starst[0].LeveName2;
                                    let starstarstr2 = starst[starst.length - 1].LeveName2;
                                    starmin = starstarstr.substr(0, starstarstr.length - 1)
                                    starcur = 1;
                                    starmax = starstarstr2.substr(0, starstarstr2.length - 1)
                                } else if (alldata[startclass.split("_")[1]].type[startclass.split("_")[2]].star.length <= 1) {
                                    $(".startbtn").hide();
                                    starcur = null;
                                }

                                if ($("." + startclass)[0].dataset.isfen == 1) {
                                    isfenstart = 1
                                    starmax = '';                                    
                                    $(".startbtn").show();                                    
                                    starcur = 1;
                                    starmin = 1;
                                }

                                /*开始为分数*/


                                /*结束星数*/
                                let endclass = $(".activenum")[1].className.split(' ')[1];
                                if (alldata[endclass.split("_")[1]].type[endclass.split("_")[2]].star.length > 1){
                                    $(".endbtn").show();
                                    let endd = alldata[endclass.split("_")[1]].type[endclass.split("_")[2]].star;
                                    let endstr1 = endd[0].LeveName2;
                                    let endstr2 = endd[endd.length - 1].LeveName2
                                    endmin = endstr1.substr(0, endstr1.length - 1) == 0 ? 1 : endstr1.substr(0, endstr1.length - 1);
                                    endmax = endstr2.substr(0, endstr2.length - 1);
                                    endcur = 1;
                                } else if (alldata[endclass.split("_")[1]].type[endclass.split("_")[2]].star.length <= 1) {
                                    $(".endbtn").hide();
                                    endcur = null;
                                }

                                //结束为上分
                                let start001 = $(".start0").html();
                                let end002 = $(".end0").html();

                                isfens = $("." + endclass)[0].dataset.isfen;
                              
                                if (isfens=='1') {
                                    $(".endbtn").show();
                                    endcur = 1;
                                    endmin = 1;                                   
                                } 
                                //英雄联盟手游
                                if (gameName.indexOf('英雄联盟手游') > -1) {
                                    //if (start001.indexOf('钻石') > -1) {
                                    //    $('.startbtn').show()
                                    //    $('.startxts').text('胜点');
                                    //    starmin = 0
                                    //    starcur = 0;
                                    //    starmax = 99
                                    //}
                                    //if (end002.indexOf('钻石') > -1) {
                                    //    $('.endbtn').show();
                                    //    $('.startxtd').text('胜点');
                                    //    endmin = 1;
                                    //    endmax = 99;
                                    //    endcur = 1;
                                    //}

                                }


                                //英雄联盟 
                                if (gameName == '英雄联盟') {
                                    if (start001.indexOf('晋级') > -1 && rulelist.length>0) {
                                        $('.jintxt').html(start001 + '胜率：');
                                        $('.startsd').show();
                                    } else {
                                        $('.startsd').hide();
                                    }
                                    if (new RegExp("[0-9]").test(start001)) {
                                        $('.startbtn').show()
                                        $('.startxts').text('胜点');
                                        starmin = 0
                                        starcur = 0;
                                        starmax = 99
                                    }
                                    //else if (gameName == '英雄联盟' && new RegExp("[0-9]").test(start001)) {
                                    //    consoe.log('英雄联盟英雄联盟')
                                    //    $('.startbtn').hide()
                                    //}

                                    if (new RegExp("[0-9]").test(end002)){
                                        $('.endbtn').show()
                                        $('.startxtd').text('胜点')
                                        endmin = 1;
                                        endmax = 99;
                                        endcur = 1;
                                    } else {
                                        if (isfens!='1') $('.endbtn').hide()
                                    }

                                }

                                
                                //金铲铲之战
                                if (gameName == '金铲铲之战' || gameName == '云顶之弈') {
                                    if (new RegExp("[0-9]").test(start001)) {
                                        $('.startbtn').show()
                                        $('.startxts').text('胜点');
                                        starmin = 0
                                        starcur = 0;
                                        starmax = 99
                                    }

                                    if (new RegExp("[0-9]").test(end002)) {
                                        $('.endbtn').show()
                                        $('.startxtd').text('胜点')
                                        endmin = 1;
                                        endmax = 99;
                                        endcur = 1;
                                    } else {
                                        if (isfens != '1') $('.endbtn').hide()
                                    }

                                }

                                
                            }

                            form.val("pro", {
                                "starcur01": starcur
                                , "endcur01": endcur
                                , "starcur02": starcur
                                , "endcur02": endcur
                            });
                            form.render();

                        }
                    })

                    if (data.data[0].LeveName1 == '等级') {
                        $('.dwdiv .item .level .num').trigger('click')
                        $(".dwdiv .layui-inline01").hide();
                    } else {
                        $(".dwdiv .layui-inline01").show();
                    }

                } else {
                    layer.confirm('你还没有对该游戏进行报价参数初始化设置，点击确定后将跳转到报价参数设置', {
                        btn: ['确定'] //可以无限个按钮  
                        ,title: "提示"
                    }, function (index, layero) {
                            layer.close(index);
                            $(".goset").trigger('click')
                    });
                }
              

            },
            complete: function (XMLHttpRequest) {
                re = true;
                layer.close(indexLoad);
            }
        })

    }
});
