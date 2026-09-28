layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    aliossUploader: '/lib/aliossUploader',
    tinymce: '/lib/tinymce/tinymce'
}).use(['index', 'form', 'table', 'aliossUploader','element', 'tinymce'], function () {
    var $ = layui.$,
        form = layui.form,
        element = layui.element;
    /**
     * 编辑器实例
     * */
    var ty1 = layui.tinymce;
    var fallbackEditors = {};
    var tinymceUnavailable = false;

    // The cloned site does not include tinymce.min.js. Keep the edit dialogs
    // usable if the rich text bundle is unavailable instead of throwing from
    // layer.open's success callback (which also prevents its close button binding).
    function renderEditor(options, callback) {
        if (!tinymceUnavailable) {
            try {
                var editor = ty1.render(options, callback);
                delete fallbackEditors[options.elem];
                return editor;
            } catch (error) {
                if (typeof window.tinymce !== 'undefined') throw error;
                tinymceUnavailable = true;
            }
        }

        var textarea = document.querySelector(options.elem);
        if (!textarea) throw new Error('Editor field not found: ' + options.elem);
        textarea.style.width = '100%';
        textarea.style.minHeight = '320px';
        textarea.style.boxSizing = 'border-box';
        textarea.style.resize = 'vertical';
        textarea.setAttribute('aria-label', options.elem === '#edit1' ? '文章内容（HTML 源码）' : '商品详情（HTML 源码）');
        var fallback = {
            setContent: function (html) { textarea.value = html || ''; },
            getContent: function (formatOptions) {
                var html = textarea.value;
                if (formatOptions && formatOptions.format === 'text') {
                    return new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
                }
                return html;
            }
        };
        fallbackEditors[options.elem] = fallback;
        callback(options, fallback);
        return fallback;
    }

    function getEditor(selector) {
        return fallbackEditors[selector] || ty1.get(selector);
    }
    /**
     * 编辑器变量
     * */
    var edit1;

    var layid = location.hash.replace(/^#tabsCk=/, '');
    element.tabChange('tabsCk', layid);
    element.on('tab(tabsCk)', function (elem) {
        location.hash = 'tabsCk=' + $(this).attr('lay-id');
        let tabid = $(this).attr('lay-id');
        if (tabid = 50) {
            reloadOrderList5();
            reloadOrderList6();
        }
        if (tabid = 60) {
            reloadOrderList7();
        }
    }); 
    var table = layui.table;
    var aliossUploader = layui.aliossUploader;
    var aliossUploader2 = layui.aliossUploader;
    var aliossUploader3 = layui.aliossUploader;
    var aliossUploader4 = layui.aliossUploader;
    var devices = layui.device();
    var isPc = true;
    if (devices.android===true|| devices.ios===true) {
        isPc = false;
    }  
    var re = true; 
    var seachParam = '';
    var seachParam2 = ''; 
    var seachParam6 = '';
        var indexLoad;
    var imgUrl = '';
    var shopImgUrl = "";
    var shopImgUrl3 = "";
    var shopImgUrlChouJiang = "";
    var page = 1;
    var page2 = 1;
    var layerWindows;
    var sysid = $("#sysid").val();
    var curfulldiscount = null;
    var curmemdiscount = null;
    var allshoplist = [];
    var fulldiscountList = [];
    var memdiscountList = [];
    /**
     * 商品详情临时上传的图片列表
     * */
    var shopdetailImgList = [];
    /**
     * 商品详情临时上传的图片本次是否已保存，默认否，如果为true，则不要执行删除临时上传的图片，否则需要执行
     * */
    var shopdetailImgListIsSave = false;


    loadShopItems();

    reloadOrderList7();

    aliossUploader.render({
            elm: '#uploadOne',
            region: 'oss-cn-hangzhou',
            bucket: 'jidanpuusercentermuchly',
            layerTitle: '上传图片',
            accessidFiled: 'accessid',
            policyFiled: 'policy',
            signatureFiled: 'signature',
            codeFiled: 'code',
            codeStatus: 0,
            policyMethod: 'GET',
            policyData: {},
            policyHeader: {
                Authorization: layui.data('XCORS').Authorization
            },
            policyUrl: '/CommonPermissionAjax/GetAliOssPolicy?bk=10',
            prefixPath: 'news/',
            fileType: 'images',
            multiple: false,
            httpStr: 'https',
            allUploaded: function (res) {
                var fileList = res;
                imgUrl = fileList[0].ossUrl; 

                $(".newspichref").attr('href', imgUrl);
                $(".newspichref").html('上传成功');
                $("#newspic").val(imgUrl);
                layer.msg('上传成功');
            },
            policyFailed: function (res) {
                layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
            },
            uploadRenderData: {
                size: 1024 * 8
                ,accept: 'images'
               ,acceptMime: 'image/*'
               ,exts: 'jpg|png|bmp|jpeg'
                , number: 1
            }
        });
    aliossUploader2.render({
        elm: '#uploadShopItem',
        region: 'oss-cn-hangzhou',
        bucket: 'jidanpuusercentermuchly',
        layerTitle: '上传商品图片',
        accessidFiled: 'accessid',
        policyFiled: 'policy',
        signatureFiled: 'signature',
        codeFiled: 'code',
        codeStatus: 0,
        policyMethod: 'GET',
        policyData: {},
        policyHeader: {
            Authorization: layui.data('XCORS').Authorization
        },
        policyUrl: '/CommonPermissionAjax/GetAliOssPolicy?bk=10',
        prefixPath: 'shopitem/',
        fileType: 'images',
        multiple: false,
        httpStr: 'https',
        allUploaded: function (res) {
            var fileList = res;
            shopImgUrl = fileList[0].ossUrl;
            $(".itempic").attr('href', shopImgUrl);
            $(".itempic").html('上传成功');
            $("#itemPic").val(shopImgUrl);
            layer.msg('上传成功');
        },
        policyFailed: function (res) {
            layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
        },
        uploadRenderData: {
            size: 1024 * 1
            , accept: 'images'
            , acceptMime: 'image/*'
            , exts: 'jpg|png|bmp|jpeg'
            , number: 1
        }
    });
    aliossUploader3.render({
        elm: '#uploadIntegralItem',
        region: 'oss-cn-hangzhou',
        bucket: 'jidanpuusercentermuchly',
        layerTitle: '上传积分商品图片',
        accessidFiled: 'accessid',
        policyFiled: 'policy',
        signatureFiled: 'signature',
        codeFiled: 'code',
        codeStatus: 0,
        policyMethod: 'GET',
        policyData: {},
        policyHeader: {
            Authorization: layui.data('XCORS').Authorization
        },
        policyUrl: '/CommonPermissionAjax/GetAliOssPolicy?bk=10',
        prefixPath: 'shopitem/',
        fileType: 'images',
        multiple: false,
        httpStr: 'https',
        allUploaded: function (res) {
            var fileList = res;
            shopImgUrl3 = fileList[0].ossUrl;
            $(".itempic3").attr('href', shopImgUrl3);
            $(".itempic3").html('上传成功');
            $("#itemPic3").val(shopImgUrl3);
            layer.msg('上传成功');
        },
        policyFailed: function (res) {
            layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
        },
        uploadRenderData: {
            size: 1024 * 1
            , accept: 'images'
            , acceptMime: 'image/*'
            , exts: 'jpg|png|bmp|jpeg'
            , number: 1
        }
    });
    aliossUploader4.render({
        elm: '#uploadIntegralItem2',
        region: 'oss-cn-hangzhou',
        bucket: 'jidanpuusercentermuchly',
        layerTitle: '上传奖品图片',
        accessidFiled: 'accessid',
        policyFiled: 'policy',
        signatureFiled: 'signature',
        codeFiled: 'code',
        codeStatus: 0,
        policyMethod: 'GET',
        policyData: {},
        policyHeader: {
            Authorization: layui.data('XCORS').Authorization
        },
        policyUrl: '/CommonPermissionAjax/GetAliOssPolicy?bk=10',
        prefixPath: 'customerwechatapp/prize',
        fileType: 'images',
        multiple: false,
        httpStr: 'https',
        allUploaded: function (res) {
            var fileList = res;
            shopImgUrlChouJiang = fileList[0].ossUrl;
            $(".itempicchoujiang").attr('href', shopImgUrlChouJiang);
            $(".itempicchoujiang").html('上传成功');
            $("#itemPicChouJiang").val(shopImgUrlChouJiang);
            layer.msg('上传成功');
        },
        policyFailed: function (res) {
            layer.msg('请求上传授权失败，暂时无法上传，请联系技术人员处理，或者重试几次');
        },
        uploadRenderData: {
            size: 40
            , accept: 'images'
            , acceptMime: 'image/*'
            , exts: 'jpg|png'
            , number: 1
        }
    });
    getVirtualShopList();
    var tableList =table.render({
            elem: '#tableList'
            , height: 'full'
            , url: '/SystemAjax/GetPublicNewsList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                {
                    field: 'id', title: '编号', width: 60, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="" title="' + res.id + '">' + res.id + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'newsType', title: '类型', width: 70, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let color = "1E9FFF";
                        if (res.newsType == 20) {
                            color = "FF5722";
                        }
                        let vo=res.newsType==20?"Bannar":"文章";
                        return '<span style="color:#' + color + '">' + vo + '</span>';
                    }
                }
                , {
                    field: 'title', title: '标题', minWidth: 190, align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="editnews" data-id="' + res.id + '" data-name="' + res.title + '" style="color:#1E9FFF" title="点击编辑">' + res.title + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'summary', title: '摘要', minWidth: 300, align: 'left', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="" title="' + res.summary + '">' + res.summary + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'url', title: '查看页面', width: 100, align: 'center', sort: false, unresize: false, templet: function (res) {
                        let vo = '<a href="' + res.url + '" target="_blank" style="color:#1E9FFF" title="查看实际页面">查看页面</a>';
                        return vo;
                    }
                }
                , {
                    field: 'coverImg', title: '封面图', width: 100, align: 'center', sort: false, unresize: false, templet: function (res) {
                        // 没有封面图时别输出空 href —— 点了会跳到当前页面（地址栏变成 System/wechatappmange#tabsCk=10）
                        if (!res.coverImg) return '<span style="color:#bbb">暂无封面</span>';
                        let vo = '<a href="' + res.coverImg + '" target="_blank" style="" title="查看封面图">查看封面图</a>';
                        return vo;
                    }
                }
                , {
                    field: 'CreateTime', title: '发布时间', width: 100, align: 'center', sort: false, unresize: false
                }
                , { fixed: '', title: '操作', width:150, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true
            , limit: 30
            , limits: [10, 20, 30, 40, 50, 100]
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
            case 'addBtn':
                addSoure(0);
                break;  
        };
    });
    table.on('tool(tableList)', function (obj) {
        var data = obj.data; 
        if (obj.event === 'submitDel') {
            var id = obj.data.id;
            delSoure(id);
        } else if (obj.event === 'submitEdit') {
            var id = obj.data.id;
            var sname = obj.data.soureName;
            var remark = obj.data.remark;
            var orderby = obj.data.orderBy;
            addSoure(id, sname, remark, orderby);
            return false;
        }
    }); 
    form.on('submit(seachBtn)', function (data) {
        page = 1; 
        reloadOrderList();
        return false;
    }); 
    function reloadOrderList() {  
        tableList.reload({
            url: '/SystemAjax/GetPublicNewsList?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
} 
    var tableList2 = table.render({
        elem: '#tableList2'
        , height: 'full'
        , url: '/SystemAjax/GetShopItemList?' + seachParam2
        , defaultToolbar: []
        , toolbar: '#toolbarDemo2'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'ShopItem_Id', title: '商品编号', width:60, align: 'center', unresize: false
            }
            , {
                field: 'Shop_Title', title: '商品名称', width: 400, align: 'left', sort: false, unresize: false, templet: function (res) {
                    return '<a href="javascript:void(0)" class="editshop" data-id="' + res.ShopItem_Id + '" data-name="' + res.Shop_Title + '" style="color:#1E9FFF" title="点击编辑">' + res.Shop_Title + '</span>';
                }
            }
            , {
                field: 'ShopType', title: '分类', width:70, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'IsNeedGroup', title: '下单时是否选排团<i class="layui-icon layui-bangzhu" style="color:#FF5722" title="如果该商品在购买时需要选择排团坑位，请将其激活成绿色，否则置为灰色" />', width:125, align: 'center', unresize: false, templet: '#switchTpl1'
            }
            , {
                field: 'Price', title: '当前售价', width: 90, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'Yprice', title: '原售价', width: 90, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'Shop_Img', title: '商品图片', width:70, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="' + res.Shop_Img + '" target="_blank" style="color:#1E9FFF" title="点击查看">点击查看</a>';
                    return vo;
                }
            }
            , {
                field: 'Sell_Count', title: '已出售', width:80, align: 'center',edit:true, sort: true, unresize: false
            }
            , {
                field: 'Status', title: '状态', width:80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let txt = res.Status == 20 ? '已上架' : '已下架';
                    let color = res.Status == 20 ? '#5FB878' : '#E2E2E2';
                    let vo = '<a href="javascript:void(0)" class="changeShopItemStatus" style="color:' + color + '" title="' + txt+'">' + txt+'</a>';
                    return vo;
                }
            }
            , {
                field: 'createTimeStr', title: '发布时间', width: 120, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width: 180, toolbar: '#baroperating2', unresize: true, }
        ]]
        , page: true
        , limit: 50
        , limits: [50]
        , done: function (res, curr, count) {
            page = curr;
            allshoplist = res.data;
        }
    });
    table.on('toolbar(tableList2)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList2();
                break;
            case 'addBtn':
                addShop(0);
                break;
        };
    });
    table.on('tool(tableList2)', function (obj) {
        var data = obj.data;
        if (obj.event === 'editDel') {
            var id = obj.data.ShopItem_Id;
            addShop(id);
        }
        else if (obj.event === 'submitDel') {
            var id = obj.data.ShopItem_Id;
            delShopItem(id);
        } else if (obj.event === 'upShopItem') {
            var id = obj.data.ShopItem_Id;
            var sname = obj.data.Shop_Title;
            upDownShopItem(id,20);
            return false;
        } else if (obj.event === 'downShopItem') {
            var id = obj.data.ShopItem_Id;
            var sname = obj.data.Shop_Title;
            upDownShopItem(id, 10);
            return false;
        }
    });
    table.on('edit(tableList2)', function (obj) { 
        if (obj.field == "Sell_Count") { 
            if (!VerifyInt(obj.value)) {
                layer.msg('已售格式不正确，必须是整数，请重新编辑', { time: 2000 }, function () {
                });
                return false;
            }
            modityShopSellCount(obj.data.ShopItem_Id, obj.value);
            return false;
        }
    });
    form.on('switch(isNeedGroupChecked)', function (obj) {
        var sta = obj.elem.checked;
        var shopid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/ChangeWehcatAppShopItemIsNeedGroup",
            data: { shopId: shopid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    function reloadOrderList2() {
        var game = $("#selectGameName").find("option:selected").text();
        tableList2.reload({
            url: '/SystemAjax/GetShopItemList?gameName=' + (game == '全部' ? '' : game)
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    var tableList3 = table.render({
        elem: '#tableList3'
        , height: 'full'
        , url: '/SystemAjax/GetIntegralCommodityList?'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo3'
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'cid', title: '商品编号', width:60, align: 'center', unresize: false
            }
            , {
                field: 'cname', title: '商品名称', width:320, align: 'left', sort: false, unresize: false, templet: function (res) {
                    return '<a href="javascript:void(0)" class="editintegralshop" data-id="' + res.cid + '" data-name="' + res.cname + '" style="color:#1E9FFF" title="点击编辑">' + res.cname + '</span>';
                }
            }
            , {
                field: 'ctype', title: '类型', width:70, align: 'center', sort: true, unresize: false, templet: function (res) {
                    let vo = '实体商品';
                    if (res.ctype == 20) {
                        vo = '抵扣商品';
                    }
                    else if (res.ctype == 30) {
                            vo = '虚拟商品';
                        }
                    return vo;
                }
            }
            , {
                field: 'depositoryNumber', title: '库存数量', width:70, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'needIntegral', title: '所需积分', width:70, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'faceValue', title: '面值/抵扣额', width:90, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'availableAmount', title: '满多少可用', width:90, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'coverImage', title: '封面图片', width: 70, align: 'center', sort: false, unresize: false, templet: function (res) {
                    if (!res.coverImage) return '<span style="color:#bbb">暂无图片</span>';
                    let vo = '<a href="' + res.coverImage + '" target="_blank" style="color:#1E9FFF" title="点击查看">点击查看</a>';
                    return vo;
                }
            }
            , {
                field: 'exchangeCount', title: '兑换数', width: 60, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'Status', title: '状态', width: 80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let txt = res.Status == 20 ? '已上架' : '已下架';
                    let color = res.Status == 20 ? '#5FB878' : '#E2E2E2';
                    let vo = '<a href="javascript:void(0)" class="changeShopItemStatus" style="color:' + color + '" title="' + txt + '">' + txt + '</a>';
                    return vo;
                }
            }
            , {
                field: 'createTimeStr', title: '创建时间', width:120, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width:180, toolbar: '#baroperating3', unresize: true, }
        ]]
        , page: true
        , limit: 50
        , limits: [50]
        , done: function (res, curr, count) {
            page = curr;
        }
    });
    table.on('toolbar(tableList3)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList3();
                break;
            case 'addBtn':
                addIntegralItem(0);
                break;
        };
    });
    table.on('tool(tableList3)', function (obj) {
        var data = obj.data;
        if (obj.event === 'editDel') {
            var id = obj.data.cid;
            addIntegralItem(id);
        }
        else if (obj.event === 'submitDel') {
            var id = obj.data.cid;
            delIntegralItem(id);
        } else if (obj.event === 'upShopItem') {
            var id = obj.data.cid;
            upDownIntegralItem(id, 20);
            return false;
        } else if (obj.event === 'downShopItem') {
            var id = obj.data.cid;
            upDownIntegralItem(id, 10);
            return false;
        }
    });
    function reloadOrderList3() {
        tableList3.reload({
            url: '/SystemAjax/GetIntegralCommodityList'
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    var tableList4 = table.render({
        elem: '#tableList4'
        , height: 'full'
        , url: '/SystemAjax/GetIntegralCommodityExchangeList?'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo4'
        , totalRow: true
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'eid', title: '兑换编号', width: isPc ? '4.5%' : 80, align: 'center', totalRowText: '合计', unresize: false
            }
            , {
                field: 'cname', title: '商品名称', width: isPc ? '14%' : 180, align: 'left', sort: false, unresize: false, templet: function (res) {
                    return '<a href="javascript:void(0)" class="" data-id="' + res.eid + '" data-name="' + res.cname + '" style="color:#1E9FFF" title="">' + res.cname + '</span>';
                }
            }
            , {
                field: 'ctype', title: '类型', width: isPc ? '4%' : 60, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '实体商品';
                    if (res.ctype == 20) {
                        vo = '抵扣商品';
                    }
                    else if (res.ctype == 30) {
                        vo = '虚拟商品';
                    }
                    return vo;
                }
            }
            , {
                field: 'needIntegral', title: '减扣积分', width: isPc ? '5%' : 90, align: 'center', sort: true, totalRow: true, unresize: false
            }
            , {
                field: 'faceValue', title: '面值/抵扣额', width: isPc ? '6%' : 100, align: 'center', sort: true, totalRow: true,unresize: false
            }
            , {
                field: 'address', title: '收货地址/微信号', width: isPc ? '18%' : 220, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'recName', title: '收货人', width: isPc ? '5.5%' : 80, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'phone', title: '电话号码', width: isPc ? '5.5%' : 90, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'createTime', title: '兑换时间', width: isPc ? '4.5%' : 90, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'shipNo2', title: '快递单号/卡号', width: isPc ? '9%' : 150, align: 'left', sort: false, unresize: false
            }
            , {
                field: 'shipNo', title: '快递/兑换编号', width: isPc ? '6%' : 90, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'shipStatus', title: '发货状态', width: isPc ? '4%' : 60, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '待发货';
                    if (res.shipStatus == 20) {
                        vo = '<span style="color:#1E9FFF">已发货';
                    }
                    return vo;
                }
            }
            , {
                field: 'shipTime', title: '发货时间', width: isPc ? '4.5%' : 90, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'remark', title: '备注说明', width: isPc ? '5%' : 80, align: 'left', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width: isPc ? '5%' : 90, toolbar: '#baroperating4', unresize: true, }
        ]]
        , page: true
        , limit: 30
        , limits: [30]
        , done: function (res, curr, count) {
            page = curr;
        }
    });
    table.on('toolbar(tableList4)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList4();
                break;
        };
    });
    table.on('tool(tableList4)', function (obj) {
        var data = obj.data;
        if (obj.event === 'shipbtn') {
            var id = obj.data.eid;
            var ctype = obj.data.ctype;
            ship(id, ctype);
        }
    });
    function reloadOrderList4() {
        var status = $("#selectShipStatus").val();
        var key = $("#integralkey").val();
        tableList4.reload({
            url: '/SystemAjax/GetIntegralCommodityExchangeList?status=' + status + '&key=' + key
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    var tableList5 = table.render({
        elem: '#tableList5'
        , height: 'full'
        , url: '/SystemAjax/GetAllLotteryAwardList?'
        , defaultToolbar: []
        , toolbar: '#toolbarDemo5'
        , totalRow: true
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'LotteryAwardId', title: '奖品编号', width: 100, align: 'center', unresize: false
            }
            , {
                field: 'AwardTitle', title: '奖品名称', sort: false, unresize: false
            }
            , {
                field: 'AwardType', title: '奖品类型', width:120, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '自定义中奖奖品';
                    if (res.AwardType == 10) {
                        vo = '优惠券类奖品';
                    }
                    else if (res.AwardType ==20) {
                        vo = '未中奖';
                    }
                    else if (res.AwardType == 15) {
                        vo = '充积分奖品';
                    }
                    else if (res.AwardType == 18) {
                        vo = '充余额奖品';
                    }
                    return vo;
                }
            }
            , {
                field: 'RangeValue', title: '中奖概率', width: 100, align: 'center', sort: false, totalRow: '{{= d.TOTAL_NUMS }}%', unresize: false, templet: function (res) {
                    return '<span>' + res.RangeValue +'%</span>'
                }
            }
            , {
                field: 'StockCount', title: '库存数量', width: 80, align: 'center', sort: false, totalRow: '{{= d.TOTAL_NUMS }}', unresize: false
            }
            , {
                field: 'PrizeImg', title: '奖品图片', width: 100, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<a href="javascript:void(0)" style="color:#31bdec" title="" class="viewCertImg" data-img="' + res.PrizeImg + '" data-uname="' + res.AwardTitle + '">点击查看</a>';
                    return vo;
                }
            }
            , { fixed: '', title: '操作', width: 100, align: 'center', toolbar: '#baroperating5', unresize: true, }
        ]]
        , page: true
        , limit: 8
        , limits: [8]
        , done: function (res, curr, count) {
            page = curr;
        }
    });
    var editawardModel;
    table.on('toolbar(tableList5)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList5();
                break;
            case 'addAwardBtn': 
                addAward(0);
                break;
        };
    });
    table.on('tool(tableList5)', function (obj) {
        var data = obj.data;
        if (obj.event === 'editaward') {
            var id = obj.data.LotteryAwardId;
            editawardModel = obj.data;
            addAward(id);
        }
        else if (obj.event === 'delaward') {
                var id = obj.data.LotteryAwardId;
                delAward(id);
            }
    });
    function reloadOrderList5() { 
        tableList5.reload({
            url: '/SystemAjax/GetAllLotteryAwardList'
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    var tableList6 = table.render({
        elem: '#tableList6'
        , height: 'full'
        , url: '/SystemAjax/GetLotteryAwardGrantList?' + seachParam6
        , defaultToolbar: []
        , toolbar: '#toolbarDemo6'
        , totalRow: false
        , defaultToolbar: ['filter','exports']
        , cols: [[
            { type: 'checkbox', fixed: 'left', width: 30 },
            {
                field: 'LotteryAwardGrantId', title: '编号', width:70, align: 'center', unresize: false
            },
            {
                field: 'LotteryAwardId', title: '奖品编号', width: 80, align: 'center', unresize: false
            }
            , {
                field: 'AwardTitle', title: '奖品名称', width: 200, sort: false, unresize: false, templet: function (res) {
                    let vo = res.AwardTitle;
                    if (res.AwardType == 15) {
                        vo = res.AwardTitle + '-' + res.PrizeValue;
                    }
                    return vo;
                }
            }
            , {
                field: 'AwardType', title: '奖品类型', width:120, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '自定义中奖奖品';
                    if (res.AwardType == 10) {
                        vo = '优惠券类奖品';
                    }
                    else if (res.AwardType == 20) {
                        vo = '未中奖';
                    }
                    else if (res.AwardType == 15) {
                        vo = '充积分奖品';
                    }
                    else if (res.AwardType == 18) {
                        vo = '充余额奖品';
                    }
                    return vo;
                }
            }
            , {
                field: 'CreateTimeStr', title: '中奖时间', width: 140, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'UseIntegral', title: '消耗数', width: 100, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'SurplusIntegral', title: '剩余积分', width: 100, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'Moblie', title: '手机号', width:100, align: 'center',sort: false, unresize: false
            }
            , {
                field: 'GrantStatus', title: '发放状态', width:80, align: 'center', sort: false, unresize: false, templet: function (res) {
                    let vo = '<span style="color:#526069">未发放</span>';
                    if (res.GrantStatus == 10) {
                        vo = '<span style="color:#5FB878">已发放</span>';
                    }
                    return vo;
                }
            }
            , {
                field: 'GrantTimeStr', title: '发放时间', width: 140, align: 'center', sort: true, unresize: false
            }
            , {
                field: 'Remark', title: '兑奖编码/备注', width:150, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width:100, toolbar: '#baroperating6', unresize: true, }
        ]]
        , page: true
        , limit:20
        , limits: [20,50,100,200]
        , done: function (res, curr, count) {
            page = curr;
            $('#totalGrant').html('总计' + res.total.totalCount + '条记录，共消耗' + res.total.totalUseValue + '余额/积分，有' + res.total.waitGranCount + '条奖品等待发放');
        }
    });
    table.on('toolbar(tableList6)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList6();
                break;
            case 'mutAward':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请选中要操作的记录');
                    return false;
                }
                var idx = '';
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    var data = checkStatus.data;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].GrantStatus == 0) {
                            tempData.push(data[i].LotteryAwardGrantId);
                        }
                    };
                    idx = tempData.join(',');
                }
                deliveraward(idx);
                break;
        };
    });
    table.on('tool(tableList6)', function (obj) {
        var data = obj.data;
        if (obj.event === 'deliveraward') {
            var id = obj.data.LotteryAwardGrantId; 
            if (obj.data.GrantStatus == 10) {
                layer.alert('该奖已发放过', function (lx) {
                    layer.close(lx);
                    return false;
                })
                return false;
            }
            deliveraward(id);
        }
    });
    function reloadOrderList6() {
        var grantStatus = $("#grantStatus").val();
        var key = $("#key6").val(); 
        seachParam6 = 'grantStatus=' + grantStatus + '&key=' + key;
        tableList6.reload({
            url: '/SystemAjax/GetLotteryAwardGrantList?' + seachParam6
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }

    function getgames(id) {
        let str = '';
        allshoplist.forEach(item => {
            if (item.ShopItem_Id == id) {
                str += '<option value="' + item.ShopItem_Id + '" selected="selected">' + item.ShopItem_Id + '-' + item.Shop_Title+'</option>';
            } else {
                str += '<option value="' + item.ShopItem_Id + '">' + item.ShopItem_Id + '-' + item.Shop_Title +'</option>';
            }
        })
        $("#selectShopitem").html(str);
        form.render();
    }
    function gethylevels(name) {
        $.ajax({
            type: "GET",
            url: "/CustomerAjax/GetIntervalLevel",
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
               let tableData = data.data;
                let str = '';
                tableData.forEach(item => {
                    if (item.IntervalName == name) {
                        str += '<option value="' + item.IntervalName + '" selected="selected">' + item.IntervalName + '</option>';
                    } else {
                        str += '<option value="' + item.IntervalName + '">' + item.IntervalName + '</option>';
                    }
                })
                $("#hyName").html(str);
                form.render();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }

    table.on('toolbar(tableList7)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList7();
                break;
            case 'addBtn':
                curfulldiscount = null;
                if (fulldiscountList.length < 40) {
                    layerWindows = layer.open({
                        title: "新增商品满减优惠活动",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        area: [isPc ? '450px' : '90%', isPc ? '50%' : '80%'],
                        content: $('.fulldiscountSet'),
                        success: function (layero, index) {
                            getgames(0);
                            form.val("form", {
                                "fullValue": ''
                                , "decValue": ''
                            });
                            form.render();
                        }
                    });
                } else {
                    layer.msg('最多只能添加40条！')
                }
                break;
        };
    });

    table.on('tool(tableList7)', function (obj) {
        var data = obj.data;
        if (obj.event === 'editmax') {
            //var id = obj.data.LotteryAwardGrantId;
            //deliveraward(id);
            curfulldiscount = obj.data;           
            layerWindows = layer.open({
                title: "编辑商品满减优惠活动",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [isPc ? '450px' : '90%', isPc ? '50%' : '80%'],
                content: $('.fulldiscountSet'),
                success: function (layero, index) {
                    getgames(curfulldiscount.id2)
                    form.val("form", {
                        //"selectShopitem": curfulldiscount.id2,
                        "fullValue": curfulldiscount.id3
                        , "decValue": curfulldiscount.id4
                    });
                    form.render();
                }
            });
        } else if (obj.event === 'delmax') {
            //var id = obj.data.LotteryAwardGrantId;
            layer.confirm('确定删除这条满减优惠活动吗？', {
                btn: ['确定', '取消'] //可以无限个按钮               
            }, function (index, layero) {
                layer.close(index)
                delShopFulDec(obj.data.id);
            }, function (index) {
                //按钮【按钮二】的回调
            });
            
        }
    });

    table.on('toolbar(tableList8)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList7();
                break;
            case 'addBtn':
                curmemdiscount = null;
                if (memdiscountList.length <20) {
                    layerWindows = layer.open({
                        title: "新增会员折扣活动",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        area: ['450px', '400px'],
                        content: $('.memberdiscountset'),
                        success: function (layero, index) {
                            gethylevels('');
                            form.val("form", {
                                //"hyName": '',
                                 "hydecValue": ''
                            });
                            form.render();
                        }
                    });
                } else {
                    layer.msg('最多只能添加20条！')
                }
                break;
        };
    });
    table.on('tool(tableList8)', function (obj) {
        if (obj.event === 'editmax') {
            curmemdiscount = obj.data;
            layerWindows = layer.open({
                title: "编辑会员优惠活动",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 8,
                area: [isPc ? '40%' : '90%', isPc ? '50%' : '80%'],
                content: $('.memberdiscountset'),
                success: function (layero, index) {
                    gethylevels(curmemdiscount.str1);
                    form.val("form", {
                        //"hyName": curmemdiscount.str1,
                         "hydecValue": curmemdiscount.d1
                    });
                    form.render();
                }
            });
        } else if (obj.event === 'delmax') {
            layer.confirm('确定删除这条会员折扣吗？', {
                btn: ['确定', '取消'] //可以无限个按钮               
            }, function (index, layero) {
                layer.close(index)
                delhyitem(obj.data.id)
            }, function (index) {
                //按钮【按钮二】的回调
            });
            //var id = obj.data.LotteryAwardGrantId;
            //deliveraward(id);
        }
    });

    var tableList7 = table.render({
        elem: '#tableList7'
        , height: 'full'
        ,data:[]
        , defaultToolbar: []
        , toolbar: '#toolbarDemo7'
        , totalRow: false
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'id', title: '编号', width: isPc ? '15%' :50, align: 'center', unresize: false
            },
            {
                field: 'id2', title: '商品ID', width: isPc ? '15%' :80, align: 'center', unresize: false
            }
            , {
                field: 'id3', title: '满减优惠活动', width: isPc ? '50%' : 150, sort: false, align: 'center', unresize: false, templet: function (res) {
                    let str = "满" + res.id3 + "元减" + res.id4+'元';
                    return str;
                }
            }
            , { fixed: '', title: '操作', width: isPc ? '20%' : 120, align: 'center', toolbar: '#baroperating7', unresize: true, }
        ]]
        , page: false
        , limit: 10
        , limits: [10]
        , done: function (res, curr, count) {
            page = curr;
        }
    });

    var tableList8 = table.render({
        elem: '#tableList8'
        , height: 'full'
        ,data:[]
        , defaultToolbar: []
        , toolbar: '#toolbarDemo8'
        , totalRow: false
        , defaultToolbar: ['filter']
        , cols: [[
            {
                field: 'id', title: '编号', width: isPc ? '15%' : 50, align: 'center', unresize: false
            }
            , {
                field: 'str1', title: '会员等级名称', width: isPc ? '45%' : 200, align: 'center', sort: false, unresize: false
            }
            , {
                field: 'd1', title: '折扣', width: isPc ? '20%' : 100, align: 'center', sort: false, unresize: false
            }
            , { fixed: '', title: '操作', width: isPc ? '20%' : 120, align: 'center', toolbar: '#baroperating8', unresize: true, }
        ]]
        , page: false
        , limit: 6
        , limits: [6]
        , done: function (res, curr, count) {
            page = curr;
        }
    });

    function delShopFulDec(id) {
        $.ajax({
            type: "POST",
            url: "/SystemAjax/DelWechatAppShopFulDec",
            data: { id},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList7();
                }               
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function delhyitem(id) {
       
        $.ajax({
            type: "POST",
            url: "/SystemAjax/DelWechatAppHyDisc",
            data: { id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    reloadOrderList7();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }

    function reloadOrderList7() {
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetWechatAppShopFulDecList",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                fulldiscountList = data.fullDecData;
                memdiscountList = data.hyDisCData;
                tableList7.reload({
                    data: fulldiscountList
                    , where: {
                    }
                });

                tableList8.reload({
                    data: memdiscountList
                    , where: {
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        
        return false;
    }
     
    form.on('radio(newsTypeFilter)', function (data) { 
        var value = data.value; // 获得 radio 值 
        if (value == 10) {
            $(".upnewdiv").hide();
        } else {
            $(".upnewdiv").show();
        } 
    });

    form.on('submit(saveFulDecBtn)', function (data) {
        var fullValue = data.field.fullValue*1;
        var decValue = data.field.decValue*1;
        var shopID = data.field.selectShopitem*1;
        if (fullValue == "" || fullValue == undefined || fullValue == null) {
            layer.msg('请输入满多少金额');
            return false;
        }
        if (decValue == "" || decValue == undefined || decValue == null) {
            layer.msg('请输入减多少金额');
            return false;
        }
        let params = { id: curfulldiscount ? curfulldiscount.id : 0, shopItemId: shopID, fullValue, decValue };
        console.log(params)
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveWechatAppShopFulDec",
            data: params,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(layerWindows);
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        reloadOrderList7();
                    }
                })

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

    form.on('submit(saveHyDiscbtn)', function (data) {
        var hyName = data.field.hyName;
        var decValue = data.field.hydecValue * 1;
        if (hyName == "" || hyName == undefined || hyName == null) {
            layer.msg('请输入会员等级完整名称');
            return false;
        }
        if (decValue == "" || decValue == undefined || decValue == null) {
            layer.msg('请输入折扣值');
            return false;
        }
        let params = { id: curmemdiscount ? curmemdiscount.id : 0, hyName, decValue };
        
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveWechatAppHyDisc",
            data: params,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(layerWindows);
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        reloadOrderList7();
                    }
                })

                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

    /**
     * 上传图片并回调。需要
     * */
    function uploadImgFunc(formData = {}) {
        return new Promise((resolve, reject) => { 
            $.ajax({
                url: "/CommonPermissionAjax/UploadSingleImg?ed=0",
                type: "post",
                data: formData,
                processData: false, // 告诉jQuery不要去处理发送的数据
                contentType: false, // 告诉jQuery不要去设置Content-Type请求头
                dataType: 'text',
                success: function (res) {
                    resolve(res); 
                },
                error: function (err) {
                    reject(err)
                }
            });
        })
    }

    /**
     * 新增或编辑Bannar广告或公告方法
     * */
    function addSoure(id) {
        layerWindows = layer.open({
            title: id > 0 ? "编辑文章" : "新增文章",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '95%'],
            content: $('.change'),
            success: function (layero, index) {
                renderEditor({
                    elem: "#edit1",
                    height: 580,
                    automatic_uploads: true,
                    resize: true,
                    plugins: ['advlist anchor autolink autosave code codesample directionality emoticons fullscreen hr image imagetools media insertdatetime link lists nonbreaking noneditable pagebreak preview print save searchreplace spellchecker tabfocus table textpattern visualblocks visualchars quickbars charmap'],
                    paste_data_images: true, // 默认是false的，记得要改为true才能粘贴 
                    images_reuse_filename: true,
                    images_upload_handler: function (blobInfo, success, failure) {
                        // 这个函数主要处理word中的图片，并自动完成上传；
                        // ajaxUpload是自己定义的一个函数；在回调中，记得调用success函数，传入上传好的图片地址；
                        // blobInfo.blob() 得到图片的file对象；
                        //console.log(blobInfo.blob());
                        var formData = new FormData();
                        formData.append("file", blobInfo.blob(), blobInfo.filename());
                        let uploadAjax = uploadImgFunc(formData);
                        uploadAjax.then(res => {
                            //成功
                            var params = JSON.parse(res);
                            if (params.code == 0) {
                                shopdetailImgList.push(params.data.src);
                                success(params.data.src);
                            }
                        }).then(err => {
                            //失败
                            if (err != undefined && err != '' && err != 'undefined' && err != null) {
                                layer.msg('图片上传失败，请删除图文里的图片重新放入图片试试：' + err);
                            }
                        }).catch(err => {
                            layer.msg('图片上传异常：'+err);
                        }); 
                    },
                    menu: {
                        file: { title: '文件', items: '' },
                        edit: { title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall' },
                        insert: { title: '插入', items: 'link image | template hr' },
                        view: { title: '查看', items: '' },
                        format: { title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
                        table: { title: '表格', items: 'inserttable tableprops deletetable | cell row column' },
                        tools: { title: '工具', items: '' }
                    }
                    // 支持tinymce所有配置      
                }, (opt, e) => {
                    // 加载完成后回调 opt 是传入的所有参数
                    // e是当前编辑器实例，等同于t.get返回值 
                    if (id > 0) {
                        //获取内容
                        $.ajax({
                            type: "GET",
                            url: "/SystemAjax/GetPublicNews",
                            data: { id: id },
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { layer.msg('请求出错！'); re = true; },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                            success: function (data) {
                                if (data.code > 0) {
                                    form.val("form", {
                                        "title": data.data.Title
                                        , "newsType": data.data.NewsType
                                        , "id": data.data.PublicNews_ID
                                        , 'newspic': data.data.CoverImg
                                    });
                                    e.setContent(data.data.NewsContent);
                                    $(".newspichref").attr('href', data.data.CoverImg);
                                    $(".newspichref").html('已上传，点击查看');
                                    imgUrl = data.data.CoverImg;
                                }
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        }); 
                    } else {
                        form.val("form", {
                            "title": ''
                            , "newsType": 10
                            , "id": 0
                            , 'newspic': ''
                        });
                        e.setContent('');
                        $(".newspichref").attr('href', '');
                        $(".newspichref").html(''); 
                    }
                });  
            }
            , end: function (e) {
                //关闭时
                if (shopdetailImgList.length > 0 && !shopdetailImgListIsSave) {
                    for (var i = 0; i < shopdetailImgList.length; i++) {
                        $.ajax({
                            type: "Post",
                            url: "/CommonPermissionAjax/DelSingleImg",
                            data: { imgpath: shopdetailImgList[i] },
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { },
                            beforeSend: function (XMLHttpRequest) { },
                            success: function (data) { },
                            complete: function (XMLHttpRequest) {
                            }
                        });
                    }
                }
            }
        }); 
        return false;
    } 
    function delSoure(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/DelPublicNewsByIds",
            data: { ids: id },
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
        return false;
} 
    form.on('select(selectGame)', function (data) { 
        reloadOrderList2();
    })
    form.on('select(shopGameName)', function (data) {
        loadShopItems();
    })
    
    /**
     * 新增或编辑商品
     * */
    function addShop(id) {
        shopdetailImgListIsSave = false;
        shopdetailImgList = [];
        loadShopItems();
        layerWindows = layer.open({
            title: id > 0 ? "编辑商品" : "新增商品",
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '95%'],
            content: $('.changeShopItem'),
            success: function (layero, index) {
                let selectGameName = $("#selectGameName").val();
                $("select[name=gameName]").val(selectGameName);
                form.render('select');
                renderEditor({
                    elem: "#edit2",
                    height: 580,
                    automatic_uploads: true,
                    resize: true, 
                    plugins: ['advlist anchor autolink autosave code codesample directionality emoticons fullscreen hr image imagetools media insertdatetime link lists nonbreaking noneditable pagebreak preview print save searchreplace spellchecker tabfocus table textpattern visualblocks visualchars quickbars charmap'],
                    paste_data_images: true, // 默认是false的，记得要改为true才能粘贴 
                    images_reuse_filename: true,
                    images_upload_handler: function (blobInfo, success, failure) {
                        // 这个函数主要处理word中的图片，并自动完成上传；
                        // ajaxUpload是自己定义的一个函数；在回调中，记得调用success函数，传入上传好的图片地址；
                        // blobInfo.blob() 得到图片的file对象；
                        //console.log(blobInfo.blob());
                        var formData = new FormData();
                        formData.append("file", blobInfo.blob(), blobInfo.filename());
                        var formData = new FormData();
                        formData.append("file", blobInfo.blob(), blobInfo.filename());
                        let uploadAjax = uploadImgFunc(formData);
                        uploadAjax.then(res => {
                            //成功
                            var params = JSON.parse(res);
                            if (params.code == 0) {
                                shopdetailImgList.push(params.data.src);
                                success(params.data.src);
                            }
                        }).then(err => {
                            //失败
                            if (err != undefined && err != '' && err != 'undefined' && err != null) {
                                layer.msg('图片上传失败，请删除图文里的图片重新放入图片试试：' + err);
                            }
                        }).catch(err => {
                            layer.msg('图片上传异常：' + err);
                        });
                    },
                    menu: {
                        file: { title: '文件', items: '' },
                        edit: { title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall' },
                        insert: { title: '插入', items: 'link image | template hr' },
                        view: { title: '查看', items: '' },
                        format: { title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
                        table: { title: '表格', items: 'inserttable tableprops deletetable | cell row column' },
                        tools: { title: '工具', items: '' }
                    }
                    // 支持tinymce所有配置      
                }, (opt, e) => {
                    // 加载完成后回调 opt 是传入的所有参数
                    // e是当前编辑器实例，等同于t.get返回值

                    if (id > 0) {
                        //获取内容
                        $.ajax({
                            type: "POST",
                            url: "/SystemAjax/GetShopItemInfoById",
                            data: { id: id },
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { layer.msg('请求出错！'); re = true; },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                            success: function (data) {
                                if (data.code > 0) {
                                    form.val("form", {
                                        "shopTitle": data.msg.Shop_Title
                                        , "gameName": data.msg.GameName
                                        , "shopYPrice": data.msg.Yprice
                                        , "shopPrice": data.msg.Price
                                        , "itemPic": data.msg.Shop_Img
                                        , "shopItemId": id
                                    });

                                    e.setContent(data.msg.Shop_Deatils);
                                    //layedit2.setContent(editIndex2, data.msg.Shop_Deatils);
                                    $(".itempic").attr('href', data.msg.Shop_Img);
                                    $(".itempic").html('已上传，点击查看');
                                }
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        });
                    } else {
                        form.val("form", {
                            "shopTitle": ''
                            , "shopYPrice": ''
                            , "shopPrice": ''
                            , "itemPic": ''
                            , "shopItemId": 0
                        });

                        e.setContent('');
                        //layedit2.setContent(editIndex2, '');
                        $(".itempic").attr('href', '');
                        $(".itempic").html('');
                    }

                });
            }
            , end: function (e) {
                //关闭时
                if (shopdetailImgList.length > 0 && !shopdetailImgListIsSave) {
                    for (var i = 0; i < shopdetailImgList.length; i++) {
                        $.ajax({
                            type: "Post",
                            url: "/CommonPermissionAjax/DelSingleImg",
                            data: { imgpath: shopdetailImgList[i]},
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { },
                            beforeSend: function (XMLHttpRequest) { },
                            success: function (data) {},
                            complete: function (XMLHttpRequest) {
                            }
                        });
                    }
                }
            }
        });
        
       
        return false;
    } 
    function upDownShopItem(id, type) {
        $.ajax({
            type: "POST",
            url: "/SystemAjax/UpDownShopItem",
            data: { id: id, type: type },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        reloadOrderList2();
                    }
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function delShopItem(id) {
        layer.confirm('确认删除该商品吗？删除后无法恢复', {
            btn: ['确定', '点错了']
        }, function () {
                $.ajax({
                    type: "POST",
                    url: "/SystemAjax/DelShopItem",
                    data: { id: id },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('请求出错！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (data.code > 0) {
                                reloadOrderList2();
                            }
                        })
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
        }); 
        
    }
    function modityShopSellCount(id, value) {
        $.ajax({
            type: "POST",
            url: "/SystemAjax/ModityShopItemSellCount",
            data: { id: id, value: value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        reloadOrderList2();
                    }
                })
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
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
    /**
     * 保存Banar或公告
     * */
    form.on('submit(savebtn)', function (data) {
        var title = data.field.title; 
        if (title == "" || title == undefined || title == null) {
            layer.msg('请输入标题');
            return false;
        }
        if (imgUrl == '' && data.field.newsPic != '') {
            imgUrl = data.field.newsPic;
        }
        if (imgUrl == "" && data.field.newsType==20) {
            layer.msg('请上传封面图');
            return false;
        }
        edit1 = getEditor('#edit1'); 
        var zhaiyao = edit1.getContent({ format: 'text' }); 
        var contentTxt = edit1.getContent();
        if (contentTxt == "" || contentTxt == undefined || contentTxt == null) {
            layer.msg('文章内容不能为空');
            return false;
        }
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SavePublicNew",
            data: { title: title, imgUrl: imgUrl, conetnt: contentTxt,contentTxt:zhaiyao,id:data.field.id, newsType: data.field.newsType },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                shopdetailImgListIsSave = true;
                layer.close(layerWindows);
                layer.msg(data.msg, { time: 2000 }, function () {
                    if (data.code > 0) {
                        reloadOrderList();
                        //location.reload();
                    }
                })
               
                re = true;
            },
            complete: function (XMLHttpRequest) {
                shopdetailImgList = [];
                layer.close(indexLoad);
            }
        });
        return false;
    });
    /**
     * 保存商品
     * */
    form.on('submit(savebtn2)', function (data) {
        var title = data.field.shopTitle;
        if (title == "" || title == undefined || title == null) {
            layer.msg('请输入商品名称');
            return false;
        }
        var yprice = data.field.shopYPrice;
        if (yprice == "" || yprice == undefined || yprice == null) {
            layer.msg('请输入商品原价');
            return false;
        }
        var shopPrice = data.field.shopPrice;
        if (shopPrice == "" || shopPrice == undefined || shopPrice == null) {
            layer.msg('请输入商品现价');
            return false;
        }
        var itemPic = $("#itemPic").val();
        if (itemPic == "") {
            layer.msg('请上传商品图');
            return false;
        }
        edit1 = getEditor('#edit2');
        var contentTxt = edit1.getContent(); //layedit2.getContent(editIndex2);
        if (contentTxt == "" || contentTxt == undefined || contentTxt == null) {
            layer.msg('商品详情内容不能为空');
            return false;
        }
        var strParameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveShopItem",
            data: { param: strParameter, contentTxt: contentTxt},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                shopdetailImgListIsSave = true;
                layer.close(layerWindows);
                if (data.code > 0) {
                    $(".itempic").html('');
                    $("#itemPic").val('');
                    reloadOrderList2();
                }
                layer.msg(data.msg, { time: 2000 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
                shopdetailImgList = []; //清空临时上传的商品图片
            }
        });
        return false;
    });
    $(document).on('click', '.editnews', function () {
        var ids = $(this).attr('data-id');
        addSoure(ids);
    })
    $(document).on('click', '.editshop', function () {
        var ids = $(this).attr('data-id');
        addShop(ids);
    })
    var shopTypeList = [];
    function loadShopItems() {
        var gname = $("#gameName").find("option:selected").text();
        $.ajax({
            type: "POST",
            url: "/SystemAjax/GetWechatAppShopItemTypeList",
            data: { gameName: gname },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('无法获取分类'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $("#itemType").empty(); //清空
                $("#itemType").prepend("<option value=''>默认</option>");
                shopTypeList = data.data;
                for (let i = 0; i < shopTypeList.length; i++) {
                    var option = '<option value="' + shopTypeList[i] + '">' + shopTypeList[i] + '</option>';
                    $("#itemType").append(option);
                }
                form.render('select');
                if (shopTypeList.length > 3) {
                    $(".adddiv").hide();
                } else {
                    $(".adddiv").show();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    } 
    var newTemplateLayer;
    $(document).on('click', '.additem', function () {
        layer.prompt({ title: '新增商品分类（最多4个字符）', formType: 0, value: '', maxlength: 4 }, function (value, index, elem) {
            if (shopTypeList.length > 3) {
                layer.alert('商品分类最多只能有4个');
                return false;
            }
            if (value == '默认' || value == '全部') {
                layer.alert('新建商品分类已包含这个了，请换个名称');
                return false;
            }
            for (let i = 0; i < shopTypeList.length; i++) {
                if (shopTypeList[i] == value) {
                    layer.alert('商品分类名称已有该名称，请换个名称');
                    return false;
                }
            }
            shopTypeList.push(value);
            $("#itemType").empty(); //清空
            $("#itemType").prepend("<option value=''>默认</option>");
            for (let i = 0; i < shopTypeList.length; i++) {
                var option = '<option value="' + shopTypeList[i] + '"' + (shopTypeList[i] == value ?'selected="selected"':'') + '>' + shopTypeList[i] + '</option>';
                $("#itemType").append(option);
            }
            form.render('select');
            layer.close(index);
            $(".editdiv").show();
            $(".deldiv").show();
            if (shopTypeList.length > 3) {
                $(".adddiv").hide();
            } else {
                $(".adddiv").show();
            }
        });
    });
    $(document).on('click', '.edititem', function () {
        var val = $("#itemType").val();
        layer.prompt({ title: '编辑商品分类（最多4个字符）', formType: 0, value: val, maxlength: 4 }, function (value, index, elem) {
            layer.close(index);
            for (let i = 0; i < shopTypeList.length; i++) {
                if (shopTypeList[i] == val) {
                    shopTypeList[i] = value;
                }
            }
            $.ajax({
                type: "POST",
                url: "/SystemAjax/EditWechatAppShopItemTypeName",
                data: { yname: val, newname: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求报错'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    $("#itemType").empty(); //清空
                    $("#itemType").prepend("<option value=''>默认</option>");
                    for (let i = 0; i < shopTypeList.length; i++) {
                        var option = '<option value="' + shopTypeList[i] + '"' + (shopTypeList[i] == value ? 'selected="selected"' : '') + '>' + shopTypeList[i] + '</option>';
                        $("#itemType").append(option);
                    }
                    form.render('select');
                    layer.close(index);
                    reloadOrderList2();
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });

        });
    });
    $(document).on('click', '.delitem', function () {
        var val = $("#itemType").val(); 
        $.ajax({
            type: "POST",
            url: "/SystemAjax/DelWechatAppShopItemTypeName",
            data: { typeName: val},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求报错'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code < 1) {
                    layer.alert(data.msg);
                    return false;
                }
                else
                {
                    loadShopItems();
                    reloadOrderList2();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    function addEditShopItemType(val) {
        layer.prompt({ title: val != '' ? '新增商品分类' : '编辑商品分类', formType: 0, value: val, maxlength: 4 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/upOrderTips",
                data: { orderId: orderID, content: value },
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
    form.on('select(itemType)', function (data) {
        var val = data.value;
        if (val=='') {
            $(".editdiv").hide();
            $(".deldiv").hide();
            return false;
        }
        $(".editdiv").show();
        $(".deldiv").show();
        return false;
    });

    /**
     * 新增或编辑积分商品方法
     * */
    function addIntegralItem(id) {
        layerWindows = layer.open({
            title: id > 0 ? "编辑积分商品" : "新增积分商品",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '95%'],
            content: $('.changeIntegralItem'),
            success: function (layero, index) {
                renderEditor({
                    elem: "#edit3",
                    height: 580,
                    automatic_uploads: true,
                    resize: true,
                    plugins: ['advlist anchor autolink autosave code codesample directionality emoticons fullscreen hr image imagetools media insertdatetime link lists nonbreaking noneditable pagebreak preview print save searchreplace spellchecker tabfocus table textpattern visualblocks visualchars quickbars charmap'],
                    paste_data_images: true, // 默认是false的，记得要改为true才能粘贴 
                    images_reuse_filename: true,
                    images_upload_handler: function (blobInfo, success, failure) {
                        // 这个函数主要处理word中的图片，并自动完成上传；
                        // ajaxUpload是自己定义的一个函数；在回调中，记得调用success函数，传入上传好的图片地址；
                        // blobInfo.blob() 得到图片的file对象；
                        //console.log(blobInfo.blob());
                        var formData = new FormData();
                        formData.append("file", blobInfo.blob(), blobInfo.filename());
                        var formData = new FormData();
                        formData.append("file", blobInfo.blob(), blobInfo.filename());
                        let uploadAjax = uploadImgFunc(formData);
                        uploadAjax.then(res => {
                            //成功
                            var params = JSON.parse(res);
                            if (params.code == 0) {
                                shopdetailImgList.push(params.data.src);
                                success(params.data.src);
                            }
                        }).then(err => {
                            //失败
                            if (err != undefined && err != '' && err != 'undefined' && err != null) {
                                layer.msg('图片上传失败，请删除图文里的图片重新放入图片试试：' + err);
                            }
                        }).catch(err => {
                            layer.msg('图片上传异常：' + err);
                        });
                    },
                    menu: {
                        file: { title: '文件', items: '' },
                        edit: { title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall' },
                        insert: { title: '插入', items: 'link image | template hr' },
                        view: { title: '查看', items: '' },
                        format: { title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
                        table: { title: '表格', items: 'inserttable tableprops deletetable | cell row column' },
                        tools: { title: '工具', items: '' }
                    }
                    // 支持tinymce所有配置      
                }, (opt, e) => {
                    // 加载完成后回调 opt 是传入的所有参数
                    // e是当前编辑器实例，等同于t.get返回值

                    if (id > 0) {
                        //获取内容
                        $.ajax({
                            type: "POST",
                            url: "/SystemAjax/GetIntegarlItemInfoById",
                            data: { id: id },
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { layer.msg('请求出错！'); re = true; },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                            success: function (data) {
                                if (data.code > 0) {
                                    form.val("form", {
                                        "intral_shopTitle": data.msg.cname
                                        , "ctype": data.msg.ctype
                                        , "needIntegral": data.msg.needIntegral
                                        , "depositoryNumber": data.msg.depositoryNumber
                                        , "faceValue": data.msg.faceValue
                                        , "itemPic3": data.msg.coverImage
                                        , "integralCommodityId": id
                                        , "available": data.msg.availableAmount
                                    });
                                    e.setContent(data.msg.commodityMask);
                                    $(".itempic3").attr('href', data.msg.coverImage);
                                    $(".itempic3").html('已上传，点击查看');
                                    if (data.msg.ctype == 20) {
                                        $('.availableDiv').show();
                                    } else {
                                        $('.availableDiv').hide();
                                    }
                                }
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        });
                    } else {
                        form.val("form", {
                            "shopTitle": ''
                            , "shopYPrice": ''
                            , "shopPrice": ''
                            , "itemPic": ''
                            , "shopItemId": 0
                        });
                        e.setContent('');
                        $(".itempic3").html('');
                        $("#itemPic3").val('');
                    }
                });
                
            }
            ,end: function (e) {
                //关闭时
                if (shopdetailImgList.length > 0 && !shopdetailImgListIsSave) {
                    for (var i = 0; i < shopdetailImgList.length; i++) {
                        $.ajax({
                            type: "Post",
                            url: "/CommonPermissionAjax/DelSingleImg",
                            data: { imgpath: shopdetailImgList[i] },
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { },
                            beforeSend: function (XMLHttpRequest) { },
                            success: function (data) { },
                            complete: function (XMLHttpRequest) {
                            }
                        });
                    }
                }
            }
        }); 
        return false;
    }
    form.on('submit(savebtn3)', function (data) {
        var itemPic = data.field.itemPic3;
        if (itemPic == "") {
            layer.msg('请上传商品图');
            return false;
        }
        var title = data.field.intral_shopTitle;
        if (title == "" || title == undefined || title == null) {
            layer.msg('请输入商品名称');
            return false;
        }
        var needIntegral = data.field.needIntegral;
        if (needIntegral == "" || needIntegral == undefined || needIntegral == null) {
            layer.msg('请输入商品兑换所需积分');
            return false;
        }
        var depositoryNumber = data.field.depositoryNumber;
        if (depositoryNumber == "" || depositoryNumber == undefined || depositoryNumber == null) {
            layer.msg('请输入商品当前库存量');
            return false;
        }
        var faceValue = data.field.faceValue;
        if (faceValue == "" || faceValue == undefined || faceValue == null) {
            layer.msg('请输入商品面值/抵扣额');
            return false;
        }
        if (data.field.ctype == 20) {
            if (data.field.available == undefined || data.field.available == null || data.field.available == '') {
                layer.msg('满多少金额可用不能为空');
                return false;
            }
        }
        edit1 = getEditor('#edit3');
        var contentTxt = edit1.getContent();
        if (contentTxt == "" || contentTxt == undefined || contentTxt == null) {
            layer.msg('商品详情内容不能为空');
            return false;
        }
        var strParameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveIntegralCommodity",
            data: { param: strParameter, contentTxt: contentTxt },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                shopdetailImgListIsSave = true;
                layer.close(layerWindows);
                if (data.code > 0) {
                    $(".itempic3").html('');
                    $("#itemPic3").val('');
                    reloadOrderList3();
                }
                layer.msg(data.msg, { time: 2000 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                shopdetailImgList = [];
                layer.close(indexLoad);
            }
        });
        return false;
    });
    $(document).on('click', '.editintegralshop', function () {
        var ids = $(this).attr('data-id');
        addIntegralItem(ids);
    })
    function upDownIntegralItem(id, type) {
        $.ajax({
            type: "POST",
            url: "/SystemAjax/UpDownIntegralItem",
            data: { id: id, type: type },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1000 }, function () {
                    if (data.code > 0) {
                        reloadOrderList3();
                    }
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function delIntegralItem(id) {
        layer.confirm('确认删除该积分商品吗？删除后无法恢复', {
            btn: ['确定', '点错了']
        }, function () {
            $.ajax({
                type: "POST",
                url: "/SystemAjax/DeldelIntegralItem",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (data.code > 0) {
                            reloadOrderList3();
                        }
                    })
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });

    }
    var eid = 0;
    function ship(id, ctype) {
        eid = id;
        if (ctype == 20) {
            layer.msg('该商品为抵扣类商品，已自动发放，无需手动操作');
            return false;
        }
        layerWindows = layer.open({
            title: "发货",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['50%', '45%'],
            content: $('.shipDiv'),
            success: function (layero, index) {
            }
        });
        if (ctype == 30) {
            $(".expreeDiv").hide();
            $(".expressNoLabel").html('卡密号码');
        } else if (ctype == 10) {
            $(".expreeDiv").show();
            $(".expressNoLabel").html('快递单号');
        }
        if (id > 0) {
            $.ajax({
                type: "POST",
                url: "/SystemAjax/GetIntegarlExchangeItemInfoById",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求出错！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        form.val("form", {
                            "expree": data.msg.ShipNo
                            , "expressNo": data.msg.ShipNo2
                            , "shipStatus": data.msg.NeedIntegral
                            , "depositoryNumber": data.msg.ShipStatus
                            , "shipRemark": data.msg.Remark
                        });
                    }
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        } else {
            form.val("form", {
                "expree": ''
                , "expressNo":''
                , "shipStatus":20
                , "depositoryNumber": ''
                ,"shipRemark":''
            });
        }

        return false;
    }

    var awardid = 0;
    function addAward(id) {
        awardid = id;

        layerWindows = layer.open({
            title: id > 0 ? "编辑奖品" : "新增奖品",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '570px' : '80%', isPc?'480px':'90%'],
            content: $('.awardDiv'),
            success: function (layero, index) { 
                $(".scoupe").hide();
                $("#awardTitle").val('');
            }
        });
        form.val("form", {
            "awardTitle": ''
            , "awardType": 0
            , "range": '0'
            ,"prizeValue":'0'
            , "itemPicChouJiang": ''
            ,"stockNumber":'1'
        });
        $(".itempicchoujiang").attr('href', '');
        $(".itempicchoujiang").html('');
        
        if (id > 0) { 
            if (editawardModel.AwardType == 10) {
                $(".scoupe").show();
                $(".prizeValue").hide();
            }
            else if (editawardModel.AwardType == 15 || editawardModel.AwardType == 18) {
                $(".prizeValue").show();
                $(".scoupe").hide();
                if (editawardModel.AwardType == 15) {
                    $(".prizeValueTitle").html('奖励多少积分');
                    $(".prizeValueTips").html('抽中此奖品时给用户充多少积分');
                    $(".prizeValueTips").html('抽中此奖品时给用户充多少余额');
                } else if (editawardModel.AwardType == 18) {
                    $(".prizeValueTitle").html('奖励多少余额');
                } 
            }
            else {
                $(".scoupe").hide();
                $(".prizeValue").hide();
            }
            form.val("form", {
                "awardTitle": editawardModel.AwardTitle
                , "awardType": editawardModel.AwardType
                , "couponList": editawardModel.IntegralCommodityId
                , "range": editawardModel.RangeValue
                , "itemPicChouJiang": editawardModel.PrizeImg
                , "prizeValue": editawardModel.PrizeValue
                , "stockNumber": editawardModel.StockCount
            });
            if (editawardModel.PrizeImg != '' && editawardModel.PrizeImg != null) {
                $(".itempicchoujiang").attr('href', editawardModel.PrizeImg);
                $(".itempicchoujiang").html('已上传');
            }
        }
        return false;
    }  
    function getVirtualShopList() {
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetIntegralCommodityByTypeList",
            data: { typeId: 20 },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.count > 0) { 
                    $("#couponList").empty();
                    var option = '<option value="0">请选择</option>';
                    $("#couponList").append(option);
                    let shopTypeList = data.data;
                    for (let i = 0; i < shopTypeList.length; i++) {
                        var option = '<option value="' + shopTypeList[i].cid + '">' + shopTypeList[i].cname + '</option>';
                        $("#couponList").append(option);
                    }
                    form.render('select');
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function delAward(id) {
        layer.confirm('确定要删除吗？', {
            btn: ['确定', '点错了']
        }, function (lx) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DelAwardByIds",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.close(lx);
                        reloadOrderList5();
                        layer.msg(data.msg, { time: 1000 });
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
    function deliveraward(id) {
        layer.confirm('确认该奖品已发放给用户了吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/SystemAjax/DeliverAward",
                data: { id: id },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        reloadOrderList6();
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
    form.on('radio(awardType)', function (data) { 
        if (data.value == 10) {
            $(".scoupe").show();
            $(".prizeValue").hide();
        }
        else if (data.value == 15 || data.value == 18) {
            if (data.value == 15) {
                $(".prizeValueTitle").html('奖励多少积分');
                $(".prizeValueTips").html('抽中此奖品时给用户充多少积分');
            } else if (data.value == 18) {
                $(".prizeValueTitle").html('奖励多少余额');
                $(".prizeValueTips").html('抽中此奖品时给用户充多少余额');
            } 
            $(".prizeValue").show();
            $(".scoupe").hide();
        }
        else {
            $(".scoupe").hide();
            $(".prizeValue").hide();
        }
    });
    form.on('submit(savebtn4)', function (data) {
        if (eid == 0) {
            layer.msg('无法获取到发货编号，请刷新列表重新发货');
            return false;
        }
        var strParameter = JSON.stringify(data.field);
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveIntegralExChangeItem",
            data: { param: strParameter, eid: eid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(layerWindows);
                if (data.code > 0) {
                    reloadOrderList4();
                }
                layer.msg(data.msg, { time: 2000 }, function () {
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(seachBtn4)', function (data) {
        page = 1;
        reloadOrderList4();
        return false;
    });
    form.on('submit(savebtn5)', function (data) {
        if (data.field.awardTitle == '' || data.field.awardTitle == undefined || data.field.awardTitle == null) {
            layer.msg('奖品名称不能为空');
            return false;
        }
        if (data.field.range == '' || data.field.range == undefined || data.field.range == null) {
            layer.msg('请输入中奖概率，0-100之间整数');
            return false;
        }
        if (data.field.awardType == 15) {
            if (data.field.integralValue == '' || data.field.integralValue == undefined || data.field.integralValue == null) {
                layer.msg('请输入奖励积分数，且大于0');
                return false;
            }
        }
        if (data.field.stockNumber == '' || data.field.stockNumber == undefined || data.field.stockNumber == null) {
            layer.msg('请输入库存数，最小0');
            return false;
        }
       
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveAward",
            data: { id: awardid, title: data.field.awardTitle, atype: data.field.awardType, cid: data.field.couponList, range: data.field.range, prizeimg: data.field.itemPicChouJiang, prizeValue: data.field.integralValue, awardunit: data.field.awardunit, stockNumber: data.field.stockNumber },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) { 
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        layer.close(layerWindows); 
                        reloadOrderList5();
                    }
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(saveawardsetting)', function (data) {
        var awardStatus = data.field.awardStatus;
        var awardamount = data.field.awardamount;
        var awardcount = data.field.awardcount;
        var awardWay = data.field.awardWay;
        var awardunit = data.field.awardunit;
        if (awardamount < 0) {
            layer.msg('满足金额值不能小于0');
            return false;
        }
        if (awardcount < 0) {
            layer.msg('满足条件每次不能少于0次抽奖');
            return false;
        } 
        if (awardunit == '' || awardunit == undefined || awardunit == null) {
            layer.msg('奖品单位不能为空');
            return false;
        } 
        if (!re) {
            return false;
        }
        re = false;
        $.ajax({
            type: "Post",
            url: "/SystemAjax/SaveAwardSetting",
            data: { awardStatus: awardStatus, awardamount: awardamount, awardcount: awardcount, awardWay: awardWay, awardunit: awardunit },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {                    
                })
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(seach6Btn)', function (data) {
        page = 1;
        reloadOrderList6();
        return false;
    });
    $(document).on('click', '.viewCertImg', function () {
        var img = $(this).attr('data-img');
        var uname = $(this).attr('data-uname');
        layer.photos({
            photos: {
                "title": uname,
                "start": 0,
                "data": [
                    {
                        "alt": uname,
                        "pid": 0,
                        "src": img,
                    }
                ]
            },
            footer: false //是否显示底部栏
        });
    });
    form.on('radio(ctype)', function (data) { 
        var value = data.elem.value;
        if (value == 20) {
            $('.availableDiv').show();
        } else {
            $('.availableDiv').hide();
        }
         
    });
});
