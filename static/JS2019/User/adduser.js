var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            topNav: {
                switchLanguage: 'Switch Language',
            },
            code: {
                copy: 'Copy Code',
                copied: 'Copied',
                copyError: 'Copy Failed',
                maximize: 'Maximize',
                restore: 'Restore',
                preview: 'Open Preview in New Window'
            },
            colorpicker: {
                clear: 'Clear',
                confirm: 'OK'
            },
            dropdown: {
                noData: 'No Data'
            },
            flow: {
                loadMore: 'Load More',
                noMore: 'No More Data'
            },
            form: {
                select: {
                    noData: 'No Data',
                    noMatch: 'No Matching Data',
                    placeholder: 'Please Select'
                },
                validateMessages: {
                    required: 'This field is required',
                    phone: 'Invalid phone number format',
                    email: 'Invalid email format',
                    url: 'Invalid URL format',
                    number: 'Numbers only',
                    date: 'Invalid date format',
                    identity: 'Invalid ID number format'
                },
                verifyErrorPromptTitle: 'Notice'
            },
            laydate: {
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weeks: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                time: ['Hour', 'Minute', 'Second'],
                literal: {
                    year: ''
                },
                selectDate: 'Select Date',
                selectTime: 'Select Time',
                startTime: 'Start Time',
                endTime: 'End Time',
                tools: {
                    confirm: 'Confirm',
                    clear: 'Clear',
                    now: 'Now',
                    reset: 'Reset'
                },
                rangeOrderPrompt: 'End time cannot be less than start Time\nPlease re-select',
                invalidDatePrompt: 'Invalid date\n',
                formatErrorPrompt: 'Date format is invalid\nMust follow the format:\n{format}\n',
                autoResetPrompt: 'It has been reset',
                preview: 'The selected result'
            },
            layer: {
                confirm: 'OK',
                cancel: 'Cancel',
                defaultTitle: 'Info',
                prompt: {
                    inputLengthPrompt: 'Maximum {length} characters'
                },
                photos: {
                    noData: 'No Image',
                    tools: {
                        rotate: 'Rotate',
                        scaleX: 'Flip Horizontally',
                        zoomIn: 'Zoom In',
                        zoomOut: 'Zoom Out',
                        reset: 'Reset',
                        close: 'Close'
                    },
                    viewPicture: 'View Picture',
                    urlError: {
                        prompt: 'Image URL is invalid, \nContinue to next one?',
                        confirm: 'Next',
                        cancel: 'Cancel'
                    }
                }
            },
            laypage: {
                prev: 'Prev',
                next: 'Next',
                first: 'First',
                last: 'Last',
                total: 'Total {total} items',
                pagesize: '/page',
                goto: 'Go to',
                page: 'page',
                confirm: 'Confirm'
            },
            table: {
                sort: {
                    asc: 'Ascending',
                    desc: 'Descending'
                },
                noData: 'No Data',
                tools: {
                    filter: {
                        title: 'Filter Columns'
                    },
                    export: {
                        title: 'Export',
                        noDataPrompt: 'No data in the table',
                        compatPrompt: 'Export is not supported in IE. Please use Chrome or another modern browser.',
                        csvText: 'Export CSV File'
                    },
                    print: {
                        title: 'Print',
                        noDataPrompt: 'No data in the table'
                    }
                },
                dataFormatError: 'Returned data is invalid. The correct success status code should be: "{statusName}": {statusCode}',
                xhrError: 'Request Error: {msg}'
            },
            transfer: {
                noData: 'No Data',
                noMatch: 'No Match',
                title: ['List 1', 'List 2'],
                searchPlaceholder: 'Search by Keyword'
            },
            tree: {
                defaultNodeName: 'Unnamed',
                noData: 'No Data',
                deleteNodePrompt: 'Are you sure you want to delete the node "{name}"?'
            },
            upload: {
                fileType: {
                    file: 'File',
                    image: 'Image',
                    video: 'Video',
                    audio: 'Audio'
                },
                validateMessages: {
                    fileExtensionError: 'Unsupported format in selected {fileType}',
                    filesOverLengthLimit: 'Maximum {length} files allowed at once',
                    currentFilesLength: 'You have selected {length} files',
                    fileOverSizeLimit: 'File size must not exceed {size}'
                },
                chooseText: '{length} files'
            },
            util: {
                timeAgo: {
                    days: '{days} days ago',
                    hours: '{hours} hours ago',
                    minutes: '{minutes} minutes ago',
                    future: 'In the future',
                    justNow: 'Just now'
                },
                toDateString: {
                    meridiem: function (hours, minutes) {
                        return hours < 12 ? 'AM' : 'PM';
                    }
                }
            }
        },
        'zh-CN': {
            page: {
                loginAcc: '自定义登录账号',
                loginAcctips: '你帮TA定义一个登录系统的账号，建议用手机号，TA后面可以自己更改',
                loginAccplaceholder: '可以用手机号/QQ号/姓名做为登录账号，必填',
                userName: '账号名称',
                userNametips: '这个人的真实姓名或昵称，不要带特殊符号或空格，允许用下划线',
                userNameplaceholder: '用户的姓名或昵称都可以，不允许有任何特殊符号、空格，必填',
                IsRnameCertification: '真实姓名',
                IsRnameCertificationtitle: '这个子账号已通过了人脸识别实名认证，身份证号已锁定无法修改',
                resetRnameCertBtn: '重新实名',
                sid: '身份证号',
                sidtips: '这个人已通过了人脸识别实名认证，身份证号已锁定无法修改',
                sidtitle: '有就填没有可不填',
                sidplaceholder: '有则填，没有可以不填',
                bussTypelabel: '业务类型',
                bussTypetitle: '默认',
                bussTypetips1: '如果这个人做代练+陪玩业务的就选这个',
                bussTypetips2: '如果这个人只做代练业务就选这个',
                bussTypetips3: '如果这个人只做陪玩陪练的就选这个',
                bussType1: '代练+陪玩',
                bussType2: '专做代练',
                bussType3: '专做陪玩',
                userTypelabel: '成员类型',
                userTypetips1: '用来区分这人是外部还是内部的人，内部的员工或线下人员可选这个，该选项并无实际作用',
                userTypetips2: '外部或线上的可选这个，该选项并无实际作用',
                userType1: '内部成员',
                userType2: '合作用户',
                basicSalary: '基本底薪',
                basicSalarytips: '记录该人员的基本底薪',
                basicSalaryplaceholder: '该用户的每月基本底薪金额，可不填',
                autoBrokerageType: '销售/代练提成模式',
                autoBrokerageTypetips1: '用来给打手或销售客服记录提成的模式，选这个后两种情况下会起作用：<br>1、这个子账号是销售客服时：订单变成已完成后将按照在下面设定的金额为该子账户记录提成金额；<br>2、把单子指派给这个子账户时：读取在下面你设置的金额作为默认发单价给这个子账号记录提成金额',
                autoBrokerageTypetips2: '用来给打手或销售客服记录提成的模式，选这个后两种情况下会起作用：<br>1、这个子账号是销售客服时：将按照订单接单价*设定的百分比数值=这个子账号的客服提成金额；<br>2、把单子指派给这个子账户时：订单接单价格*在下面设定的百分比数值作为发单价给这个子账号记录提成金额',
                autoBrokerageTypetips3: '这个选项只适合给录单的销售客服用，代练打手不要选这个。<br>订单变成已完成时，将按照：(接单价-总的发单价)*在下面设定的百分比数值作为这个子账号的提成（系统开启了自动记录接单提成情况下才有效）。如果没有把订单指派出去，是无法算出利润的',
                autoBrokerageType1: '固定金额',
                autoBrokerageType2: '订单价百分比',
                autoBrokerageType3: '利润的百分比',
                brokerageAmount: '提成金额/百分比',
                brokerageAmountplaceholder: '固定金额或百分比的数字，例如：5或者20',
                setAlipayAcc: '结算支付宝账号',
                setAlipayAcctips: '用来给这个人结算用的，也可以让TA自己补充',
                setAlipayAccplaceholder: '用来收款支付宝账号，没有请留空',
                setAlipayAccName: '结算支付宝姓名',
                setAlipayAccNametips: '用来给这个人结算用的，也可以让TA自己补充',
                setAlipayAccNameplaceholder: '用来收款支付宝姓名，没有请留空',
                setBankName: '结算银行名称',
                setBankNametips: '用来给这个人结算用的，或者帮他代报个税时需要，也可以让TA自己补充',
                setBankNameplaceholder: '没有请留空',
                setBankCardNo: '结算银行卡号',
                setBankCardNotips: '用来给这个人结算用的，或者帮他代报个税时需要，也可以让TA自己补充',
                setBankCardNoplaceholder: '没有请留空',
                recOrderMaxCount: '内部抢代练单上限',
                recOrderMaxCounttips: '限制TA在系统内部抢单页面接代练类型的单子数量，这里填0代表不限制。比如你想让TA同时只能接2笔代练类型的单子，这里就填2',
                recOrderMaxCountplaceholder: '限制通过内部接单同时接单数量',
                recOrderMaxCount2: '内部抢陪玩单上限',
                recOrderMaxCount2tips: '限制TA在系统内部抢单页面接陪玩类型的单子数量，这里填0代表不限制。比如你想让TA同时只能接2笔陪玩类型的单子，这里就填2',
                recOrderMaxCount2placeholder: '限制通过内部接单同时接单数量',
                recPriceMin: '内部抢单价范围',
                recPriceMintips: '可设置在内部大厅抢单时需满足多少接单价才能接',
                recPriceMaxtips: '可设置在内部大厅抢单时需满足多少接单价才能接',
                livestreaming: '打手直播地址',
                livestreamingplaceholder: '打手直播的URL地址，没有请留空',
                qq: 'QQ/微信',
                qqplaceholder: '能联系到该用户的QQ或微信，可留空',
                moblie: '联系电话',
                moblietips: '尽量填好每一个真实的代练打手或员工的手机号',
                moblieplaceholder: '能联系到该用户的手机号，可留空',
                inputDate: '入职日期',
                tips: '标记',
                tipsplaceholder: '给用户写个标记，没有请留空',
                remark: '备注说明',
                remarkplaceholder: '备注说明，没有请留空',
                insureAmount: '已交保证金',
                insureAmounttips: '如果这个人已向你们缴纳了押金，请在这里填上具体的金额，方便后期你们查阅或退押金用',
                insureAmountplaceholder: '该用户已交纳保证金',
                addOrderNotSendSmslabel: '录的单不发短信',
                addOrderNotSendSmstips1: '如果这个人是录单的客服，他录的单子能不能发出短信？如果能，就选这个(前提是系统已开通短信服务并且短信量足够，默认情况下没开通短信)，一般情况下不建议动这里，保持默认即可。如果是打手，不用管这里',
                addOrderNotSendSmstips2: '如果这个人是录单的客服，并且不让他录的单子发短信，就选这个。一般情况下不建议动这里，保持默认即可.如果是打手，不用管这里',
                addOrderNotSendSms1: '允许发送',
                addOrderNotSendSms2: '不发短信',
                UserGroupGame_ID: '勾选游戏权限',
                userRoleList: '他的角色职位',
                savebtn: '保存资料',
            },
            js: {
                loginAcc1: '登录账号不能为空',
                loginAcc2: '登录账号长度最小是2位，请补齐',
                loginAcc3: '登录账号不能有特殊字符',
                userName1: '姓名/名称不能为空',
                userName2: '姓名/名称不能有特殊字符',
                userName3: '姓名/名称首尾不能出现下划线',
                userName4: '姓名/名称不能有空格',
                userName5: '姓名/名称长度最小是2位，请补齐',
                moblie1: '输入的联系电话格式不正确，要么请留空',
                moblie2: '电话不能只有空格',
                roleFilter1: '是系统内最高权限，拥有所有操作权限，正常情况下建议设置此职位的子账户数量不超过3个',
                roleFilter2: '的权限仅次于系统管理员，拥有系统内绝大部分操作权限，默认情况下没有该职位设定数量不要超过2个',
                roleFilter3: '一般用于接单录单销售的人用，拥有录单、查单、管理订单等通用权限，默认情况下没有删除订单权限',
                roleFilter4: '为最低权限位，适合给代练员、打手、团员或下家使用。这个职位的人只能看到指派给TA的单子，看不到别人的，也看不到接单价',
                roleFilter5: '开发人员专用权限，仅用于开发人员协助本系统解决问题时使用，若担心安全，可以删除',
                roleFilter6: '默认情况下，除了拥有客服的权限外，还拥有删除订单、更改接单价、新开系统子账号、管理子账号、管理打手与客服提成账单等高级功能，一般建议只给部门主管级人员使用',
                roleFilter7: '默认情况下，该职位权限仅次于客服权限，可以新建排团、管理排团、排单子到团里、指派订单、查看订单资料、接单或发单价、截图、分配机位等，但不能录单、编辑、删除订单',
                roleFilter8: '适合给合作的销售用，可以录单、编辑,只能看到自己录的单子，看不到别人录单的，也没有派单、删除权限',
                autoBrokerageTypeFilter1: '固定提成金额',
                autoBrokerageTypeFilter2: '百分比数值',
                brokerageAmount1: '请输入固定的金额，例如：5、10，默认为0',
                brokerageAmount2: '请输入百分比纯数字（不要有百分号），例如：5，代表5%',
                brokerageAmount3: '请输入百分比纯数字（不要有百分号），例如：5，代表5%',
                savebtn1: '登录账号不能为空',
                savebtn2: '姓名/名称不能为空',
                savebtn3: '手机号码格式不正确',
                savebtn4: '请选择业务类型',
                savebtn5: '内部抢单价格范围格式不正确，只能填数字0到99999',
                savebtn6: '请为该用户至少选择一款游戏权限',
                savebtn7: '请为该用户选择一个职位权限',
                savebtn8: '请为该用户选择一个职位权限',
                CheckAddUserIsContainsBlack: '，确认继续给他开子账号？',
                CheckAddUserIsContainsBlackBtn1: '确认继续',
                CheckAddUserIsContainsBlackBtn2: '取消',
                AddEditUsererror: '请求出错，请检查每一位是否有格式上的错误！',
                copyurlClipboard1: '已成功复制到剪贴板',
                copyurlClipboard2: '复制失败了',
                resetRnameCertBtn: '此操作会清除此用户已登记的身份证号和姓名，确认要重置吗？重置后可以让用户重新实名',
                error: '系统繁忙！',
            },
            code: {
                copy: '复制代码',
                copied: '已复制',
                copyError: '复制失败',
                maximize: '最大化显示',
                restore: '还原显示',
                preview: '在新窗口预览'
            },
            colorpicker: {
                clear: '清除',
                confirm: '确定'
            },
            dropdown: {
                noData: '暂无数据'
            },
            flow: {
                loadMore: '加载更多',
                noMore: '没有更多了'
            },
            form: {
                select: {
                    noData: '暂无数据',
                    noMatch: '无匹配数据',
                    placeholder: '请选择'
                },
                validateMessages: {
                    required: '必填项不能为空',
                    phone: '手机号格式不正确',
                    email: '邮箱格式不正确',
                    url: '链接格式不正确',
                    number: '只能填写数字',
                    date: '日期格式不正确',
                    identity: '身份证号格式不正确'
                },
                verifyErrorPromptTitle: '提示'
            },
            laydate: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                weeks: ['日', '一', '二', '三', '四', '五', '六'],
                time: ['时', '分', '秒'],
                literal: {
                    year: '年'
                },
                selectDate: '选择日期',
                selectTime: '选择时间',
                startTime: '开始时间',
                endTime: '结束时间',
                tools: {
                    confirm: '确定',
                    clear: '清空',
                    now: '现在',
                    reset: '重置'
                },
                rangeOrderPrompt: '结束时间不能早于开始时间\n请重新选择',
                invalidDatePrompt: '不在有效日期或时间范围内\n',
                formatErrorPrompt: '日期格式不合法\n必须遵循：\n{format}\n',
                autoResetPrompt: '已自动重置',
                preview: '当前选中的结果'
            },
            layer: {
                confirm: '确定',
                cancel: '取消',
                defaultTitle: '信息',
                prompt: {
                    inputLengthPrompt: '最多输入 {length} 个字符'
                },
                photos: {
                    noData: '没有图片',
                    tools: {
                        rotate: '旋转',
                        scaleX: '水平变换',
                        zoomIn: '放大',
                        zoomOut: '缩小',
                        reset: '还原',
                        close: '关闭'
                    },
                    viewPicture: '查看原图',
                    urlError: {
                        prompt: '当前图片地址异常，\n是否继续查看下一张？',
                        confirm: '下一张',
                        cancel: '不看了'
                    }
                }
            },
            laypage: {
                prev: '上一页',
                next: '下一页',
                first: '首页',
                last: '尾页',
                total: '共 {total} 条',
                pagesize: '条/页',
                goto: '到第',
                page: '页',
                confirm: '确定'
            },
            table: {
                sort: {
                    asc: '升序',
                    desc: '降序'
                },
                noData: '暂无数据',
                tools: {
                    filter: {
                        title: '筛选列'
                    },
                    export: {
                        title: '导出',
                        noDataPrompt: '当前表格无数据',
                        compatPrompt: '导出功能不支持 IE，请用 Chrome 等高级浏览器导出',
                        csvText: '导出 CSV 文件'
                    },
                    print: {
                        title: '打印',
                        noDataPrompt: '当前表格无数据'
                    }
                },
                dataFormatError: '返回的数据不符合规范，正确的成功状态码应为："{statusName}": {statusCode}',
                xhrError: '请求异常，错误提示：{msg}'
            },
            transfer: {
                noData: '暂无数据',
                noMatch: '无匹配数据',
                title: ['列表一', '列表二'],
                searchPlaceholder: '关键词搜索'
            },
            tree: {
                defaultNodeName: '未命名',
                noData: '暂无数据',
                deleteNodePrompt: '确认删除"{name}"节点吗？'
            },
            upload: {
                fileType: {
                    file: '文件',
                    image: '图片',
                    video: '视频',
                    audio: '音频'
                },
                validateMessages: {
                    fileExtensionError: '选择的{fileType}中包含不支持的格式',
                    filesOverLengthLimit: '同时最多只能上传: {length} 个文件',
                    currentFilesLength: '当前已经选择了: {length} 个文件',
                    fileOverSizeLimit: '文件大小不能超过 {size}'
                },
                chooseText: '{length} 个文件'
            },
            util: {
                timeAgo: {
                    days: '{days} 天前',
                    hours: '{hours} 小时前',
                    minutes: '{minutes} 分钟前',
                    future: '未来',
                    justNow: '刚刚'
                },
                toDateString: {
                    // https://www.unicode.org/cldr/charts/47/supplemental/day_periods.html
                    meridiem: function (hours, minutes) {
                        var hm = hours * 100 + minutes;
                        if (hm < 500) {
                            return '凌晨';
                        } else if (hm < 800) {
                            return '早上';
                        } else if (hm < 1200) {
                            return '上午';
                        } else if (hm < 1300) {
                            return '中午';
                        } else if (hm < 1900) {
                            return '下午';
                        }
                        return '晚上';
                    }
                }
            }
        },
    }
}


i18n.set(i18nData);

const template = $('#template').html();
const templatehtml = laytpl(template, { tagStyle: 'modern' }).render();
$('#root').html(templatehtml);


layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index',
    formSelects: '/lib/formSelects-v4',
    ClipboardJS: '/lib/clipboard'
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'ClipboardJS'], function () {

    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var ClipboardJS = layui.ClipboardJS;
    var isPc = true;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var ok = true;
    var indexLoad;
    var uid = $("#uid").val();
    var recommend = $("#recommend").val();
    getAllUserData();
    laydate.render({
        elem: '#inputDate'
        , type: 'date'
    });
    form.verify({
        loginAcc: function (value, item) {
            if (value == null || value == undefined || value == '') {
                return '登录账号不能为空';
            }
            if (value.length < 2) {
                return '登录账号长度最小是2位，请补齐';
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '登录账号不能有特殊字符';
            }
        },
        userName: function (value, item) {
            if (value == null || value == undefined || value == '') {
                return '姓名/名称不能为空';
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '姓名/名称不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '姓名/名称首尾不能出现下划线';
            }
            if (value.indexOf(' ') > -1) {
                return '姓名/名称不能有空格';
            }
            if (value.length < 2) {
                return '姓名/名称长度最小是2位，请补齐';
            }
        },
        moblie: function (value, item) {
            if (value.length > 0) {
                if (!VerifyMoblie(value)) {
                    return '输入的联系电话格式不正确，要么请留空';
                }
            }
            if (value.indexOf(' ') > -1) {
                return '电话不能只有空格';
            }
        }
    });
    function getAllUserData() {
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGameName' + (recommend != "0" ? "?selectValue=" + recommend : ""), function (result) {
            soureData = result.data;
            formSelects.data('recommendList', 'local', {
                arr: soureData
            });
        });
    }
    form.on('radio(roleFilter)', function (data) {
        var name = data.elem.title;
        if (name == '系统管理员' || name == '超级管理员') {
            layer.tips(name + '是系统内最高权限，拥有所有操作权限，正常情况下建议设置此职位的子账户数量不超过3个', data.othis);
        }
        else if (name == '总经理') {
            layer.tips(name + '的权限仅次于系统管理员，拥有系统内绝大部分操作权限，默认情况下没有该职位设定数量不要超过2个', data.othis);
        }
        else if (name == '客服') {
            layer.tips(name + '一般用于接单录单销售的人用，拥有录单、查单、管理订单等通用权限，默认情况下没有删除订单权限', data.othis);
        }
        else if (name.indexOf('代练员') > -1 || name.indexOf('团员') > -1) {
            layer.tips(name + '为最低权限位，适合给代练员、打手、团员或下家使用。这个职位的人只能看到指派给TA的单子，看不到别人的，也看不到接单价', data.othis);
        }
        else if (name.indexOf('开发') > -1) {
            layer.tips(name + '开发人员专用权限，仅用于开发人员协助本系统解决问题时使用，若担心安全，可以删除', data.othis);
        }
        else if (name.indexOf('客服主管') > -1) {
            layer.tips(name + '默认情况下，除了拥有客服的权限外，还拥有删除订单、更改接单价、新开系统子账号、管理子账号、管理打手与客服提成账单等高级功能，一般建议只给部门主管级人员使用', data.othis);
        }
        else if (name.indexOf('团长') > -1) {
            layer.tips(name + '默认情况下，该职位权限仅次于客服权限，可以新建排团、管理排团、排单子到团里、指派订单、查看订单资料、接单或发单价、截图、分配机位等，但不能录单、编辑、删除订单', data.othis);
        }
        else if (name.indexOf('外部录单') > -1) {
            layer.tips(name + '适合给合作的销售用，可以录单、编辑,只能看到自己录的单子，看不到别人录单的，也没有派单、删除权限', data.othis);
        }
    });

    form.on('radio(autoBrokerageTypeFilter)', function (data) {
        if (data.value == 10) {
            $(".tcLabel").html('固定提成金额');
        }
        else if (data.value == 20) {
            $(".tcLabel").html('百分比数值');
        }
        else if (data.value == 30) {
            $(".tcLabel").html('百分比数值');
        }
    });
    $("input.layui-input[name='brokerageAmount']").focus(function () {
        var type = $("input[name='autoBrokerageType']:checked").val();
        if (type == 10) {
            layer.tips('请输入固定的金额，例如：5、10，默认为0', '#brokerageAmount', { tips: [3, '#FF6E97'], time: 3000, tipsMore: false });
        }
        else if (type == 20) {
            layer.tips('请输入百分比纯数字（不要有百分号），例如：5，代表5%', '#brokerageAmount', { tips: [3, '#FF6E97'], time: 4000, tipsMore: false });
        }
        else if (type == 30) {
            layer.tips('请输入百分比纯数字（不要有百分号），例如：5，代表5%', '#brokerageAmount', { tips: [3, '#FF6E97'], time: 4000, tipsMore: false });
        }
    });
    formSelects.on('recommendList', function (id, vals, val, isAdd, isDisabled) {
        if (isAdd) {
            $("#recommend").val(val.value);
        } else {
            $("#recommend").val("0");
        }
    });
    form.on('submit(savebtn)', function (data) {
        if (data.field.loginAcc == "" || data.field.loginAcc == undefined) {
            layer.msg('登录账号不能为空');
            return false;
        }
        if (data.field.userName == "" || data.field.userName == undefined) {
            layer.msg('姓名/名称不能为空');
            return false;
        }
        if (data.field.moblie != "" && data.field.moblie != undefined) {
            if (!VerifyMoblie(data.field.moblie)) {
                layer.msg('手机号码格式不正确');
                return false;
            }
        }
        if (data.field.bussType == "" || data.field.bussType == undefined) {
            layer.msg('请选择业务类型');
            return false;
        }
        if (!VerifyMoeny(data.field.recPriceMin) || !VerifyMoeny(data.field.recPriceMax)) {
            layer.msg('内部抢单价格范围格式不正确，只能填数字0到99999');
            return false;
        }
        games = [];
        $('input[name="games"]:checked').each(function () {
            games.push($(this).val());
        });
        if (games.length < 1) {
            layer.msg('请为该用户至少选择一款游戏权限')
            return false;
        }
        var selectGames = games.join(',');
        var role = $("input[name='userRole']:checked").val();
        if (data.field.userRole == null || data.field.userRole == undefined) {
            layer.msg('请为该用户选择一个职位权限');
            return false;
        }
        if (role == undefined || role < 1) {
            layer.msg('请为该用户选择一个职位权限');
            return false;
        }
        var strparameter = JSON.stringify(data.field);
        if (data.field.uid < 1) {
            let checkAcc = data.field.loginAcc;
            let checkphone = data.field.moblie;
            let checkqq = data.field.qq;
            let checkwx = data.field.qq;
            let checkname = data.field.userName;
            $.ajax({
                type: "Post",
                url: "/UserAjax/CheckAddUserIsContainsBlack",
                data: { acc: checkAcc, phone: checkphone, qq: checkqq, wx: checkwx, rname: checkname },
                dataType: 'json',
                cache: false,
                timeout: 1000 * 10,
                error: function () { ok = true; comfigAddUser(strparameter, selectGames); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    ok = true;
                    if (data.code > 0) {
                        layer.confirm(data.msg + "，确认继续给他开子账号？", {
                            icon: 2,
                            btn: ['确认继续', '取消'] //按钮
                        }, function () {
                            comfigAddUser(strparameter, selectGames);
                        });
                    }
                    else {
                        comfigAddUser(strparameter, selectGames);
                    }
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        }
        else
        {
            comfigAddUser(strparameter, selectGames);
        }
        return false;
    });
    function comfigAddUser(strparameter, selectGames) {
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/AddEditUser",
            data: { strparameter: strparameter, games: selectGames },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错，请检查每一位是否有格式上的错误！'); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.alert(data.msg, { icon: 1 }, function () { 
                        if (data.copyStr) {
                            let copyurlClipboard = new ClipboardJS('.copyurl', {
                                text: function (trigger) {
                                    return data.copyStr;
                                }
                            });
                            copyurlClipboard.on('success', function (e) {
                                layer.msg('已成功复制到剪贴板', { time: 4000 });
                                e.clearSelection();
                            });
                            copyurlClipboard.on('error', function (e) {
                                layer.msg('复制失败了', { time: 1000 });
                            });
                            $('.copyurl').trigger('click')
                        }

                        setTimeout(function () {
                            try {
                                location.reload();
                                parent.tools.reloadOrderData();
                            } catch (err) {

                            }

                        }, data.copyStr ? 1200 : 0)   

                    });
                }
                else {
                    layer.alert(data.msg, { icon: 2 }, function (er) {
                        layer.close(er);
                    });
                }
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $('.resetRnameCertBtn').on('click', function () {
        layer.confirm('此操作会清除此用户已登记的身份证号和姓名，确认要重置吗？重置后可以让用户重新实名', function (index) {
            if (!ok)
                return false;
            ok = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/ResetRnameCert",
                data: { uid: uid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); ok = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    layer.alert(data.msg, function (zindex) {
                        layer.close(zindex);
                        location.reload();
                    });
                    ok = true;
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });

        return false;
    })
});