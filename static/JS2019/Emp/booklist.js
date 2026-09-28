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
            , type: 'date'
        }); 
        laydate.render({
            elem: '#eDate'
            , type: 'date'
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
            , height: 'full-110'
            , url: '/EmpAjax/GetBookList?' + seachParam
            , defaultToolbar: []
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width:30 } 
                , {
                    field: 'title', title: '账本事项', width: 300, align: 'left', unresize: true, templet: function (res) {
                        return '<span>' + res.title + '</span>';
                    }
                }
                , {
                    field: 'remark', title: '概要说明', align: 'center', sort: false, unresize: true,  templet: function (res) {
                        let vo = '<a href="javascript:void(0);" style="color:#FF5722" title="' + res.remark + '">' + res.remark + '</a>';
                        return vo;
                    }
                } 
                , {
                    field: 'price', title: '涉及金额', width:100, align: 'center', sort: false, unresize: true, templet: function (res) {
                        let vo = '<span style="color:#FF5722">' + res.fee + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'bookType', title: '记账类型', align: 'center', width:100, sort: false,
                    unresize: false, templet: function (res) {
                        let vo = '';
                        if (res.bookType ==10) {
                            vo = '<span style="color:#5FB878">入账</span>';
                        } else {
                            vo = '<span style="color:#E03636">支出</span>';
                        }
                        return vo;
                    }
                }
                , {
                    field: 'imgUrl', title: '相关图片', width:100, unresize: false, templet: function (res) {
                        let vo='';
                        if(res.imgUrl.length>0){
                            vo = '<a href="' + res.imgUrl + '" target="_blank" class="" title="相关图片">点击查看</a>';
                        } 
                        return vo;
                    }
                }
                , {
                    field: 'userName', title: '记账人', width:100, unresize: false, templet: function (res) {
                        return '<span title="">' + res.userName + '</span>';
                    }
                } 
                , {
                    field: 'createTime', title: '记账时间', align: 'center', width: 130, unresize: false, templet: function (res) {
                        let vo = '<span>' + res.createTime + '</span>';
                        return vo;
                    }
                }
                , { fixed: '', title: '操作', width:80, toolbar: '#baroperating', unresize: true, }
            ]]
            , page: true 
            , limit: 30
            , limits: [10, 20, 30, 40, 50,100]
            , done: function (res, curr, count) { 
                page = curr;
                var total = '本次搜索统计共' + count + '条记录，共计收入' + res.total.totalIncomeFee + '元，共计支出' + res.total.totalExpenditureFee + '元';
                $("#total").html(total);
             }
        }); 
        table.on('toolbar(tableList)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id); 
            switch (obj.event) {
                case 'refresh':
                    reloadOrderList();
                    break;
                case 'addBookBtn':
                    addBook(0);
                    break; 
                case 'exportBtn':
                    exportBook();
                    break;
                case 'delBookBtn':
                    if (parseInt(checkStatus.data.length) < 1) {
                        layer.msg('请选中要操作的记录');
                        return false;
                    }
                    var bookId = '';
                    var tempData = [];
                    if (parseInt(checkStatus.data.length) > 0) {
                        var data = checkStatus.data;
                        for (let i = 0; i < data.length; i++) {
                            tempData.push(data[i].bookId);
                        };
                        bookId = tempData.join(',');
                    }
                    delBook(bookId);
                    break;
            };
        });
        table.on('tool(tableList)', function (obj) {
            var data = obj.data; 
            if (obj.event === 'del') {
                var id = obj.data.bookId;
                layer.confirm('真的删除吗？警告：一旦删除，将无法找回', function (index) { 
                    layer.close(index);
                });
            } else if (obj.event === 'submitEdit') {
                var bookId = obj.data.bookId; 
                addBook(bookId);
                return false;
            }
        });
        form.on('submit(seachBtn)', function (data) {
            page = 1; 
            reloadOrderList();
            return false;
        }); 
        function reloadOrderList() { 
            sDate = $("#sDate").val();
            eDate = $("#eDate").val(); 
            var bookType = formSelects.value('bookType', 'valStr'); 
            var recUser = formSelects.value('recUser', 'valStr'); 
            var skey = $("#key1").val();
            
            seachParam = 'stime=' + sDate + '&etime=' + eDate + '&addUserId=' + recUser + '&bookType=' + bookType + '&key=' + skey;
            
            tableList.reload({
                url: '/EmpAjax/GetBookList?' + seachParam
                , where: {
                }
                , page: {
                    curr: page
                }
            });
            return false;
        }   
        function exportBook() {
            window.open("/Emp/ExportBook?" + seachParam, "_blank");
            var index = layer.getFrameIndex(window.name);
            layer.close(index);
            return false;
        } 
        function addBook(id) {
            layer.open({
                title: id > 0 ? "编辑记账" : "新增记账",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '50%'],
                content: '/Emp/AddEditBook?bookId=' + id
            });
            return false;
        } 
        function delBook(ids) {
            layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理', function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/EmpAjax/DelBook",
                    data: { bookId: ids },
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