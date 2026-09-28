var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环境
    messages: {
        'en': {
            page: {
                userInfo: "Profile",
                funcSet: "Settings",
                pwdSet: "Change Pwd",
                upimgBtn: "Update Avatar",
                loginAcc: "Login Acc",
                CertName: "Name",
                SID: "ID Card",
                IsRnameCertification: "Verified?",
                IsRnametext: "Face Verification Passed",
                tipsfill: "Unverified",
                CertSwicth: "Verify Now",
                basicSalary: "Base Salary",
                setAlipayAcc: "SettlAcc",
                setAlipayAccplaceholder: "Alipay account for settlement receiving. If one Alipay ID has multiple sub-accounts, fill in the exact receiving account. Leave blank if none.",
                setAlipayAccName: "Alipay Name",
                setAlipayAccNameplaceholder: "Enter your verified real name bound to Alipay for settlement. This affects your payment receipt. Leave blank if not applicable.",
                setBankName: "Bank Name",
                setBankNametips: "Used for payment settlement or tax filing on behalf of the recipient. The recipient can also add this info themselves.",
                setBankNameplaceholder: "Leave blank if none",
                setBankCardNo: "Card ID",
                setBankCardNotips: "Used for payment settlement or tax filing on behalf of the recipient. The recipient can also add this info themselves.",
                setBankCardNoplaceholder: "Leave blank if none",
                tcLabel: "WeChat QR",
                lookWxImg: "Uploaded",
                uploadWx: "Upload QR",
                qq: "QQ/WeChat",
                moblie: "Phone",
                livestreaming: "Stream URL",
                gamelist: "Game Access",
                savebtn: "Save",
                blockquote: "If you have your own studio management system, configure it here to synchronize orders assigned to you from this system to your own system.",
                systemUrl: "My System URL",
                systemUrlplaceholder: "Enter your studio management system URL, e.g.: http://d.jidanpu.com",
                systemUrltitle: "Enter your system login account with order entry permissions for your management system",
                systemAcc: "My System Account",
                systemAccplaceholder: "Please enter the password for your system login account",
                systemAccPwd: "System Password",
                StrIsNullOrEmpty: "Enable order duplicate detection (disabled by default)",
                StrIsNullOrEmptynot: "Login password already set. Leave it blank if no changes are needed",
                IsOpenOrderReCheck: "Enable order duplicate detection (disabled by default):",
                switch: "On | Off",
                IsAutoAsnyToMySystem: "Auto-sync newly assigned orders to your studio management system (disabled by default):",
                savebtn2: "Save",
                elemquote: "Here you can bind your Jdp account. When new orders are assigned to you, or when orders are canceled or paused, WeChat notifications will be sent in time. After setting up the jdp account, please follow the jdp official account: jidanpu, and complete user authentication on the account。",
                jdpAcc: "Jdp Account",
                jdpAccplaceholder: "Enter your Jdp personal account login ID",
                regacctitle: "If you don't have a Jdp account, click here to register",
                regacc: "Don't have a Jdp account? Click here to register",
                jdpAccPwd: "Login Password",
                BindJDPAccPwd: "Enter the password for your Jdp personal account",
                BindJDPAccPwdNot: "Already set;don't changes",
                savebtn3: "Save",
                layuielemquote: "Note: If your login password is the initial default, the system will require you to change it immediately to prevent unauthorized access",
                ypwd: "Current Password",
                ypwdplaceholder: "Enter your current login password",
                newPwd: "New Password",
                newPwdplaceholder: "Enter your new login password",
                renewPwd: "Confirm Password",
                renewPwdplaceholder: "Re-enter your new password",
                savePwdBtn: "Confirm",
                blockquote2: "Please provide authentic personal information. Inaccurate details may prevent merchants from settling payments with you. Only mainland China IDs are supported",
                certName: "Name",
                certSid: "ID Number",
                startCertBtn: "Start",
            },
            js: {
                uploadWx: "Re-upload",
                resetUpTxt: "Failed",
                demoreload: "Retry",
                loginAcc: "Login account cannot be empty",
                moblie: "Invalid mobile number format",
                error: "Sys is busy！",
                toRealName: "add a new report",
                toRealNameNot: "Virtual phone usage report",
                hasStatus1: "Not reported",
                hasStatus2: "Pending",
                hasStatus3: "failed",
                hasStatus4: "passed",
                savebtn2: "My system URL cannot be empty",
                ypwd: "Enter your current login password",
                newPwd: "Enter your new login password",
                newPwdNum: "password must be at least 6 characters long",
                newPwdSM: "The new login password is too simple and prone to theft. Please use a more complex one",
                renewPwd: "Password mismatch",
                extmoon: "changed successfully. Please log in again",
                funcSet: "Send Order Settings",
                pwdSet: "Change Login Password",
                lookWxImg: "WeChat Payment QR Code",
                company: "Register a Jdp account",
                certLayer: "Employee authentication",
                certName: "Enter your real name",
                certSid: "Enter your ID number",
                certSidNot: "Invalid ID number format",
                certAgreemantLayer: "Please carefully read the following terms of the agreement. If you do not agree, please close this window",
                successCertBtn: "Have you completed the authentication?",
                scQrLayer: "Open WeChat and scan to verify",
                BuiderQRcode: "Scan with WeChat to Authenticate",
                number: "Enter a valid mobile number",
                toRealNametoRealName: "Phone Number Records",
                number1: "mobile number 1",
                number1placeholder: "Enter your primary mobile number 1",
                number2: "mobile number 2",
                number2placeholder: "Enter your primary mobile number 2",
                number3: "mobile number 3",
                number3placeholder: "Enter your primary mobile number 3",
                nameTips: "Important notice: The carrier will verify whether the identity information you submitted matches your mobile number. Be sure to submit identity information and a upper-body photo corresponding to the mobile number", 
                name: "Name",
                nameplaceholder: "Enter your name",
                idCardNo: "ID Number",
                idCardNoplaceholder: "Enter your ID number",
                upIDCardBoxLable: "Upper body photo",
                upIDCardBoxtext: "An upper-body selfie, not the ID card. It must be clear and unobstructed",
                saveBtnPop: "Start",
                popImg: "upload a front-facing portrait photo",
                tels: "Please upload at least one primary mobile number",
                GetUserPhoneReport: "Your report has been submitted. Please wait for review by the telecom carrier. You can check the review status on the My Profile page after a few hours",
                userPhoneReport: "details",
                filessize: "Uploaded file size must not exceed 3M",
                filestype: "Files can only be uploaded in PNG or JPG format",
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
                userInfo: "基本资料",
                funcSet: "功能设置",
                pwdSet: "修改密码",
                upimgBtn: "更换头像",
                loginAcc: "登录账号",
                CertName: "真实姓名",
                SID: "身份证号",
                IsRnameCertification: "是否实名",
                IsRnametext: "已通过实名认证",
                tipsfill: "未实名",
                CertSwicth: "点击进行实名认证",
                basicSalary: "基本底薪",
                setAlipayAcc: "结算支付宝账号",
                setAlipayAccplaceholder: "用来给你结算收款支付宝账号，如果一个支付宝名下有多个账号，请填写具体的收款账号，没有请留空",
                setAlipayAccName: "结算支付宝姓名",
                setAlipayAccNameplaceholder: "您的结算收款支付宝认证过的真实姓名，请认真填写，这将关系到您能否正常收到结算款，没有请留空",
                setBankName: "结算银行名称",
                setBankNametips: "用来给这个人结算用的，或者帮他代报个税时需要，也可以让TA自己补充",
                setBankNameplaceholder: "没有请留空",
                setBankCardNo: "结算银行卡号",
                setBankCardNotips: "用来给这个人结算用的，或者帮他代报个税时需要，也可以让TA自己补充",
                setBankCardNoplaceholder: "没有请留空",
                tcLabel: "微信收款码",
                lookWxImg: "已上传",
                uploadWx: "上传收款码",
                qq: "QQ/微信",
                moblie: "联系电话",
                livestreaming: "我的直播地址",
                gamelist: "游戏权限",
                savebtn: "保存更改",
                blockquote: "如果你有自己的工作室版管理系统，在这里配置下，即可实现将本系统指派给我的订单同步到我自己的系统里",
                systemUrl: "我的系统网址",
                systemUrlplaceholder: "请输入您的工作室版管理系统网址，例如：http://d.jidanpu.com",
                systemUrltitle: "你自己的工作室版管理系统网址，例如：http://d.jidanpu.com",
                systemAcc: "我的系统账号",
                systemAccplaceholder: "请输入你自己管理系统有录单权限的系统登录账户",
                systemAccPwd: "系统账号密码",
                StrIsNullOrEmpty: "请输入可以登录你自己系统账号的密码",
                StrIsNullOrEmptynot: "已设置登录密码，若不更改请勿变动此处",
                IsOpenOrderReCheck: "是否开启订单重复性检测(默认不检测重复发送)：",
                switch: "开|关",
                IsAutoAsnyToMySystem: "是否开启有新的订单指派给我时自动同步到我的工作室版管理系统(默认不自动同步)：",
                savebtn2: "保存更改",
                elemquote: "在这里可以绑定你的平台个人账号，当本系统有新订单指派给你或订单被取消、暂停时，会及时给你推送微信消息。设置平台账户后，请关注平台公众号：jidanpu，在公众号上认证用户即可。",
                jdpAcc: "平台账号",
                jdpAccplaceholder: "请输入您登录平台个人版的账号",
                regacctitle: "如果没有平台账号，可以点击此处注册",
                regacc: "还没有平台账号？点此注册",
                jdpAccPwd: "登录密码",
                BindJDPAccPwd: "请输入登录平台个人账号的密码",
                BindJDPAccPwdNot: "已设置，若不更改请不要变动此处",
                savebtn3: "保存更改",
                layuielemquote: "提示：如果你的登录密码为初始密码，则系统会要求你强制更改密码以防被盗",
                ypwd: "原登录密码",
                ypwdplaceholder: "请输入当前登录密码",
                newPwd: "新登录密码",
                newPwdplaceholder: "请输入新的登录密码",
                renewPwd: "确认新密码",
                renewPwdplaceholder: "请重复输入一遍新密码",
                savePwdBtn: "确认更改",
                blockquote2: "请填写本人真实信息，虚假信息将可能导致商家无法给你结算，只支持中国大陆身份",
                certName: "真实姓名",
                certSid: "身份证号",
                startCertBtn: "开始认证",
            },
            js: {
                uploadWx: "重新上传",
                resetUpTxt: "上传失败",
                demoreload: "重试",
                loginAcc: "登录账号不能为空",
                moblie: "手机号码格式不正确",
                error: "系统繁忙！",
                toRealName: "点击新增报备",
                toRealNameNot: "虚拟电话使用报备",
                hasStatus1: "未报备",
                hasStatus2: "审核中",
                hasStatus3: "审核失败",
                hasStatus4: "审核通过",
                savebtn2: "我的系统网址不能为空",
                ypwd: "请输入原登录密码",
                newPwd: "请输入新登录密码",
                newPwdNum: "新登录密码长度不能小于6位",
                newPwdSM: "新登录密码过于简单容易被盗，请更换个稍复杂点的",
                renewPwd: "两次新登录密码不一致",
                extmoon: "登录密码已更改成功，请重新登录一次",
                funcSet: "点击这里可以进行发送订单设置",
                pwdSet: "点击这里可以更改登录密码",
                lookWxImg: "微信收款码",
                company: "注册平台账号",
                certLayer: "员工实名认证",
                certName: "请输入您的真实姓名",
                certSid: "请输入您的身份证号",
                certSidNot: "身份证号格式不正确",
                certAgreemantLayer: "请仔细阅读以下协议条款，若不同意请关闭此窗口",
                successCertBtn: "确认完成了认证吗？",
                scQrLayer: "请打开你的微信扫一扫进行认证",
                BuiderQRcode: "请用你的微信扫二维码认证",
                number: "请输入正确的手机号",
                toRealNametoRealName: "虚拟电话使用报备",
                number1: "你的常用手机号1",
                number1placeholder: "请输入你的常用手机号1",
                number2: "你的常用手机号2",
                number2placeholder: "请输入你的常用手机号2",
                number3: "你的常用手机号3",
                number3placeholder: "请输入你的常用手机号3",
                nameTips: "重要提示：运营商会核对您提交的身份信息是否和你的手机号对应，务必提交与手机号对应的身份信息与人身像",
                name: "姓名",
                nameplaceholder: "请输入姓名",
                idCardNo: "身份证号",
                idCardNoplaceholder: "请输入身份证号",
                upIDCardBoxLable: "上半身人像照",
                upIDCardBoxtext: "上半身自拍照，不是身份证。要清淅、不遮挡",
                saveBtnPop: "开始认证",
                popImg: "请上传正面人像照",
                tels: "请至少上传一个常用手机号",
                GetUserPhoneReport: "您的报备已提交，请等待电信运营商审核，几小时后你可以在我的资料页面查看审核状态",
                userPhoneReport: "审核详情",
                filessize: "上传文件不能大于3M",
                filestype: "文件只能上传png或者jpg格式",
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
var i18nDataList = i18nData.messages[localStorage.getItem('layui-i18n-local-test') || 'zh-CN'].js

const template = $('#template').html();
const templatehtml = laytpl(template, { tagStyle: 'modern' }).render();
$('#root').html(templatehtml);


layui.config({
    base: '../layuiadmin/'
}).extend({
    index: 'lib/index'
}).use(['index', 'form', 'util', 'laydate', 'table', 'element', 'upload'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        upload = layui.upload,
        element = layui.element,
        laydate = layui.laydate;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var certLayer;
    var certAgreemantLayer;
    var scQrLayer;
    var verType = $("#verType").val();
    var popImg = ''
    var popPhoneList=[]
    if ($('#qrCode1').val()) {
        $('.lookWxImg').show()
        $('.uploadWx').text(i18nDataList.uploadWx)
    }
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var layid = location.hash.replace(/^#userInfo=/, '');
    element.tabChange('userInfo', layid);
    element.on('tab(userInfo)', function (elem) {
        location.hash = 'userInfo=' + $(this).attr('lay-id');
    });
    var myEmail = ''
    var uuid = ''
    GetUserInfo()
    function GetUserInfo() {
        $.ajax({
            type: "get",
            url: "/api/UserApi/GetUserInfo",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    if (!data.data.Email) {
                        //showBindEmailModal()
                        $('.unbindEmile').show()
                        $('.bindEmile').hide()
                    } else {
                        myEmail = data.data.Email
                        $('.myBindEmile').text(data.data.Email)
                        $('.bindEmile').show()
                        $('.unbindEmile').hide()

                    }
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }


    $(document).on('click', '.changeEmileBtn', function () {
        showChangeEmailModal()
    })
    $(document).on('click', '.bindEmileBtn', function () {
        showBindEmailModal()
    })

    // 弹出更换邮箱验证弹窗
    function showChangeEmailModal() {
        layer.open({
            type: 1,
            title: false, // 禁用默认标题
            closeBtn: 1,
            area: [isPc ? '520px' : '90%', 'auto'],
            shadeClose: false,
            content: `
            <div style="padding: 25px 30px;">
                <h3 style="font-size: 18px; color: #666; font-weight: bold; margin-bottom: 15px;">更换邮箱</h3>
                <hr style="margin-bottom: 25px; border: 0; border-top: 1px solid #eee;">
                
                <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
                    为确保账户安全，请先验证身份。
                </p>

                <form class="layui-form" id="change-email-verify-form">
                    <!-- 验证码输入行 -->
                    <div style="display: flex; align-items: center; margin-bottom: 30px;">
                        <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; flex-shrink: 0;">
                            验证码
                        </div>
                        <input type="text" id="old_email_code" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                        <button type="button" class="layui-btn layui-btn-normal" id="send-old-code-btn" style="margin-left: 15px; width: 110px; background-color: #1E9FFF; border-radius: 4px;">
                            获取验证码
                        </button>
                    </div>

                    <!-- 底部按钮操作栏 -->
                    <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px;">
                        <button type="button" class="layui-btn layui-btn-primary" id="cancel-change-btn" style="width: 100px; border-color: #ccc; color: #666; border-radius: 4px;">
                            取消
                        </button>
                        <button type="button" class="layui-btn layui-btn-normal" id="next-step-btn" style="width: 100px; background-color: #1E9FFF; border-radius: 4px;">
                            下一步
                        </button>
                    </div>
                </form>
            </div>
        `,
            success: function (layero, index) {
                var timer = null;
                var countdown = 60;

                // 1. 发送原邮箱验证码
                $('#send-old-code-btn').on('click', function () {
                    var $btn = $(this);
                    $btn.attr('disabled', true).addClass('layui-btn-disabled');

                    // 调用发送验证码 API
                    $.ajax({
                        type: "POST",
                        url: "/api/UserApi/SendEmailCode",
                        contentType: "application/json",
                        data: JSON.stringify({ "Email": myEmail }), 
                        dataType: 'json',
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },

                        success: function (res) {
                            if (res.code > 0 ) {
                                layer.msg('验证码已发送，请前往原邮箱查收');

                                var curTime = countdown;
                                $btn.text(curTime + 's后重发');
                                timer = setInterval(function () {
                                    curTime--;
                                    if (curTime <= 0) {
                                        clearInterval(timer);
                                        $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                                    } else {
                                        $btn.text(curTime + 's后重发');
                                    }
                                }, 1000);
                            } else {
                                layer.msg(res.msg || '发送失败，请稍后重试');
                                $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                            }
                        },
                        error: function () {
                            layer.msg('网络请求异常');
                            $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    });
                });

                // 2. 下一步：校验原邮箱验证码并跳转绑定新邮箱
                $('#next-step-btn').on('click', function () {
                    var code = $.trim($('#old_email_code').val());
                    if (!code) {
                        layer.msg('请输入验证码', { icon: 5 });
                        return;
                    }

                    $.ajax({
                        type: "POST",
                        url: "/api/UserApi/VerifyEmailCode/" + encodeURIComponent(code),
                        dataType: 'json',
                        success: function (res) {
                            if (res.code>0) {
                                layer.close(index);
                                showBindEmailModal(res.data);
                            } else {
                                layer.msg(res.msg || '验证码不正确或已过期');
                            }
                        },
                        error: function () {
                            layer.msg('网络请求异常');
                        }
                    });
                });

                // 3. 取消按钮
                $('#cancel-change-btn').on('click', function () {
                    layer.close(index);
                });
            }
        });
    }
    function showBindEmailModal(uuid) {
        layer.open({
            type: 1,
            title: false, // 禁用默认标题，自定义头部样式
            closeBtn: 1,
            area: ['520px', 'auto'],
            shadeClose: false,
            content: `
                    <div style="padding: 25px 30px;">
                        <h3 style="font-size: 18px; color: #666; font-weight: bold; margin-bottom: 15px;">绑定邮箱</h3>
                        <hr style="margin-bottom: 20px; border-top: 1px solid #eee;">

                        <p style="color: #888; font-size: 13px; margin-bottom: 20px;">
                            绑定邮箱后，可通过邮箱找回密码，保障账号安全，建议立即绑定
                        </p>

                        <form class="layui-form" id="bind-email-form">
                            <!-- 绑定邮箱输入行 -->
                            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; shrink: 0;">
                                    绑定邮箱
                                </div>
                                <input type="text" id="bind_email_prefix" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                                <div style="width: 110px; margin-left: 10px;">
                                    <select id="bind_email_suffix" lay-filter="emailSuffix">
                                        <option value="@qq.com">@qq.com</option>
                                        <option value="@163.com">@163.com</option>
                                    </select>
                                </div>
                            </div>

                            <!-- 验证码输入行 -->
                            <div style="display: flex; align-items: center; margin-bottom: 25px;">
                                <div style="width: 90px; height: 38px; line-height: 38px; background: #f2f2f2; border: 1px solid #e6e6e6; border-right: none; text-align: center; color: #555; font-size: 13px; shrink: 0;">
                                    验证码
                                </div>
                                <input type="text" id="bind_email_code" placeholder="" autocomplete="off" class="layui-input" style="border-radius: 0; flex: 1;">
                                <button type="button" class="layui-btn layui-btn-normal" id="send-bind-code-btn" style="margin-left: 10px; width: 110px; background-color: #1E9FFF;">
                                    获取验证码
                                </button>
                            </div>

                            <!-- 底部按钮操作栏 -->
                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px;">
                                <button type="button" class="layui-btn layui-btn-primary" id="cancel-bind-btn" style="width: 100px; border-color: #ccc; color: #666;">
                                    暂不绑定
                                </button>
                                <button type="button" class="layui-btn layui-btn-normal" id="submit-bind-btn" style="width: 100px; background-color: #1E9FFF;">
                                    完成绑定
                                </button>
                            </div>
                        </form>
                    </div>
                `,
            success: function (layero, index) {
                // 重新渲染 select 下拉框
                layui.form.render('select');

                var timer = null;
                var countdown = 60;



                $('#send-bind-code-btn').on('click', function () {
                    var prefix = $.trim($('#bind_email_prefix').val());
                    var suffix = $('#bind_email_suffix').val();
                    var fullEmail = prefix + suffix;

                    if (!prefix) {
                        layer.msg('请输入邮箱前缀', { icon: 5 });
                        return;
                    }

                    var $btn = $(this);
                    $btn.attr('disabled', true).addClass('layui-btn-disabled');

                    $.ajax({
                        type: "POST",
                        url: "/api/UserApi/SendEmailCode",
                        contentType: "application/json",
                        data: JSON.stringify({ "Email": fullEmail }),
                        dataType: 'json',
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                        success: function (res) {
                            if (res.code > 0) {
                                layer.msg('验证码已发送至邮箱，请查收');

                                var curTime = countdown;
                                $btn.text(curTime + 's后重发');
                                timer = setInterval(function () {
                                    curTime--;
                                    if (curTime <= 0) {
                                        clearInterval(timer);
                                        $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                                    } else {
                                        $btn.text(curTime + 's后重发');
                                    }
                                }, 1000);
                            } else {
                                layer.msg(res.msg || '发送失败，请重试');
                                $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                            }
                        },
                        error: function () {
                            layer.msg('网络请求异常');
                            $btn.removeAttr('disabled').removeClass('layui-btn-disabled').text('获取验证码');
                            layer.close(indexLoad);
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    });
                });

                $('#submit-bind-btn').on('click', function () {
                    var prefix = $.trim($('#bind_email_prefix').val());
                    var suffix = $('#bind_email_suffix').val();
                    var fullEmail = prefix + suffix;
                    var code = $.trim($('#bind_email_code').val());
                    if (!code) {
                        layer.msg('请输入验证码', { icon: 5 });
                        return;
                    }
                    let model = {
                        Email: fullEmail,
                        Code: code,
                        Uuid: uuid
                    }
                    $.ajax({
                        type: "Post",
                        url: "/api/UserApi/BindEmail",
                        data: JSON.stringify(model),
                        contentType: "application/json",
                        dataType: 'json',
                        cache: false,
                        timeout: 60000,
                        error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                        success: function (data) {
                            re = true;
                            if (data.code > 0) {
                                layer.msg('邮箱绑定成功！', { icon: 1, time: 1500 }, function () {
                                    GetUserInfo()
                                    layer.close(index);
                                });
                            } else {
                                layer.msg(res.msg || '验证码错误');
                            }
                        },
                        complete: function (XMLHttpRequest) {
                            layer.close(indexLoad);
                        }
                    });

                });

                $('#cancel-bind-btn').on('click', function () {
                    layer.close(index);
                });
            }
        });
    }

    var uploadInst = upload.render({
        elem: '.uploadWx'
        , url: '/UserAjax/UploadQrCode'
        , accept: 'images'
        , acceptMime: 'image/*'
        , exts: 'jpg|png|bmp|jpeg'
        , multiple: false
        , size: 2*1000*1024
        , number: 1
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
   
        }
        , done: function (res) {
            if (res.code > 0) {
                layer.msg(res.msg);
                console.log(res.data)
                $('#qrCode1').val(res.data)
                $('.lookWxImg').show()
                $('.uploadWx').text(i18nDataList.uploadWx)
            } else {
                return layer.msg(res.msg);
            }
        }
        , error: function () {
            //演示失败状态，并实现重传

        }
    });
    var ok = true;
    var indexLoad;
    var uploadInst = upload.render({
        elem: '#upimgBtn'
        , url: '/UserAjax/UploadMyPic'
        , accept: 'images'
        , acceptMime: 'image/*'
        , exts: 'jpg|png|bmp|jpeg'
        , multiple: false
        , size: 500
        , number: 1
        , before: function (obj) {
            //预读本地文件示例，不支持ie8
            obj.preview(function (index, file, result) {
                $('#avatar').attr('src', result); //图片链接（base64）
            });
        }
        , done: function (res) {
            if (res.code > 0) {
                layer.msg(res.msg);
            } else {
                return layer.msg(res.msg);
            }
        }
        , error: function () {
            //演示失败状态，并实现重传
            var demoText = $('#resetUpTxt');
            demoText.html('<span style="color: #FF5722;">' + i18nDataList.resetUpTxt + '</span> <a class="layui-btn layui-btn-xs demo-reload">' + i18nDataList.demoreload +'</a>');
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
    form.on('submit(savebtn)', function (data) {
        if (data.field.loginAcc == "" || data.field.loginAcc == undefined) {
            layer.msg(i18nDataList.loginAcc);
            return false;
        }
        if (data.field.moblie != "" && data.field.moblie != undefined) {
            if (!VerifyMoblie(data.field.moblie)) {
                layer.msg(i18nDataList.moblie);
                return false;
            }
        }
        var strparameter = JSON.stringify(data.field);
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/saveMyInfo",
            data: { paramStr: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                })
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    GetUserPhoneReport()
    function GetUserPhoneReport () {
        $.ajax({
            type: "Get",
            url: "/UserAjax/GetUserPhoneReport",
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(indexLoad);
                popPhoneList = data.data
                if (popPhoneList&&popPhoneList.length > 0) {
                    $('.toRealName').html(i18nDataList.toRealName)
                } else {
                    $('.toRealName').html(i18nDataList.toRealNameNot)
                }
                $('.userPhoneReport').html(popIcon())
            },

        });
    }

    function popIcon() {
        if (popPhoneList.length == 0) {
            return `<i class="layui-icon layui-icon-tips-fill" style="margin-left:10px;color:#ff5722"></i><span style="font-weight:600;font-size:14px; color: #ff5722">${i18nDataList.hasStatus1}</span>`
        }
        let hasStatus1 = popPhoneList.some(item => item.status === 0);
        if (hasStatus1) {
            return `<i class="layui-icon layui-icon-tips-fill" style="margin-left:10px;color:#ffb800"></i><span style="font-weight:600;font-size:14px; color: #ffb800">${i18nDataList.hasStatus2}</span>`
        }
        const hasStatus2 = popPhoneList.some(item => item.status === 1);
        if (hasStatus2) {
            return `<i class="layui-icon layui-icon-error" style="margin-left:10px;color:#ff5722"></i><span style="font-weight:600;font-size:14px; color: #ff5722">${i18nDataList.hasStatus3}</span>`
        }
        return `<i class="layui-icon layui-icon-success" style="margin-left:10px;color:#16b777"></i><span style="font-weight:600;font-size:14px; color: #16b777">${i18nDataList.hasStatus4}</span>`
    }
    function popItemIcon(i) {
        if (!popPhoneList[i]) {
            return ''
        }
        if (popPhoneList[i].status == 0) {
            return `<i class="layui-icon layui-icon-tips-fill" style="margin-left:10px;color:#ffb800"></i><span style="font-weight:600;font-size:14px; color: #ffb800">${i18nDataList.hasStatus2}</span>`
        } else if (popPhoneList[i].status == 1) {
            return `<i class="layui-icon layui-icon-error" style="margin-left:10px;color:#ff5722"></i><span style="font-weight:600;font-size:14px; color: #ff5722">${i18nDataList.hasStatus3}</span>`
        } else if (popPhoneList[i].status == 2) {
            return `<i class="layui-icon layui-icon-success" style="margin-left:10px;color:#16b777"></i><span style="font-weight:600;font-size:14px; color: #16b777">${i18nDataList.hasStatus4}</span>`
        } else {
            return ''
        }
    }

    form.on('submit(savebtn2)', function (data) {
        if (data.field.systemUrl == "" || data.field.systemUrl == undefined) {
            if (data.field.systemAccPwd != '' && data.field.systemAccPwd != undefined) {
                layer.msg(i18nDataList.savebtn2);
                return false;
            }
        }

        var strparameter = JSON.stringify(data.field);
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/saveMyFeaturesMySystemSet",
            data: { paramStr: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                })
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(savebtn3)', function (data) {
        var strparameter = JSON.stringify(data.field);
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/saveMyFeaturesMyJdpSet",
            data: { paramStr: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.msg(data.msg, { time: 1500 }, function () {
                })
                ok = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('submit(savePwdBtn)', function (data) {
        if (data.field.ypwd == '' || data.field.ypwd == undefined) {
            layer.msg(i18nDataList.ypwd);
            return false;
        }
        if (data.field.newPwd == '' || data.field.newPwd == undefined) {
            layer.msg(i18nDataList.newPwd);
            return false;
        }
        if (data.field.newPwd.length < 6) {
            layer.msg(i18nDataList.newPwdNum);
            return false;
        }
        if (data.field.newPwd == '123456' || data.field.newPwd == '123456789' || data.field.newPwd == '123' || data.field.newPwd == '000') {
            layer.msg(i18nDataList.newPwdSM);
            return false;
        }
        if (data.field.renewPwd != data.field.newPwd) {
            layer.msg(i18nDataList.renewPwd);
            return false;
        }
        var strparameter = JSON.stringify(data.field);
        if (!ok) {
            return false;
        }
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/saveMyLoginPwd",
            data: { paramStr: strparameter },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                if (data.code > 0) {
                    layer.alert(i18nDataList.extmoon, {
                        icon: 1,
                        skin: 'layer-ext-moon',
                        btn: ['确定'],
                        yes: function (index) {
                            layer.close(index);
                            window.location.href = '../Login/LoginOut';
                            parent.location.href = '../Login/LoginOut';
                        }
                    })
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    });
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });

    setTimeout(function () {

        if ($('#funcSet').length > 0) {
            layer.tips(i18nDataList.funcSet, '#funcSet', {
                tips: [3, '#37474F'],
                time: 4000
            });
        }
    }, 2000);
    setTimeout(function () {
        if ($('#pwdSet').length > 0) {
            layer.tips(i18nDataList.pwdSet, '#pwdSet', {
                tips: [3, '#37474F'],
                time: 4000
            });
        }
    }, 7000);
    
    $(document).on('click', '.lookWxImg', function () {
        layer.open({
            title: i18nDataList.lookWxImg,
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [ '500px', '500px'],
            content: ` <img id="WxImg"  src="${$('#qrCode1').val()}"` 
        });
        return false;
    })
    $(document).on('click', '.regacc', function () {
        var company = $("#company").val();
        layer.open({
            title: i18nDataList.company,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [isPc ? '40%' : '90%', '500px'],
            content: '/PlatformRedirect/reg?wk=' + company
        });
        return false;
    })
    $(document).on('click', '.toCer', function () {
        var company = $("#company").val();
        certLayer = layer.open({
            title: company + i18nDataList.certLayer,
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [isPc ? '500px' : '80%', isPc ? '400px' : '90%'],
            content: $('.rnameCertDiv'),
            cancel: function (index, layero) {
                $('.rnameCertDiv').hide();
            },
            end: function (index, layero) {
                $('.rnameCertDiv').hide();
            }
        });
        return false;
    })
    $(document).on('click', '.startCertBtn', function () {
        var certName = $("#certName").val();
        var certSid = $("#certSid").val();
        if (certName == '') {
            layer.alert(i18nDataList.certName, function (lx) {
                layer.close(lx);
                $("#certName").focus();
                return false;
            });
            return false;
        }
        if (certSid == '') {
            layer.alert(i18nDataList.certSid, function (lx) {
                layer.close(lx);
                $("#certSid").focus();
                return false;
            });
            return false;
        }

        var reg = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        var re = new RegExp(reg);
        if (!re.test(certSid)) {
            layer.alert(i18nDataList.certSidNot, function (lx) {
                layer.close(lx);
                $("#certSid").focus();
                return false;
            });
            return false;
        }
        certAgreemantLayer = layer.open({
            title: i18nDataList.certAgreemantLayer,
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 3,
            area: [isPc ? '980px' : '90%', isPc ? '900px' : '95%'],
            content: $('.privateServerXY'),
            cancel: function (index, layero) {
                $('.privateServerXY').hide();
            },
            end: function (index, layero) {
                $('.privateServerXY').hide();
            }
        });
        return false;
    })
    $(document).on('click', '.exitCertBtn', function () {
        layer.close(certAgreemantLayer);
        return false;
    })
    $(document).on('click', '.successCertBtn', function () {
        layer.confirm(i18nDataList.successCertBtn+'<br/>', function (indexs) {
            $.ajax({
                type: "Post",
                url: "/UserAjax/QueryRnameCertResult",
                data: {},
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg(i18nDataList.error); ok = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    ok = true;
                    if (data.code < 1) {
                        layer.alert(data.msg, function (lx) {
                            layer.close(lx);
                            return false;
                        });
                        return false;
                    }
                    else {
                        location.reload();
                    }
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    })
    $(document).on('click', '.nextCertBtn', function () {
        var certName = $("#certName").val();
        var certSid = $("#certSid").val();
        layer.close(certAgreemantLayer);
        ok = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/RnameCertInit",
            data: { rname: certName, sid: certSid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg(i18nDataList.error); ok = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                ok = true;
                if (data.code < 1) {
                    layer.alert(data.msg, function (lx) {
                        layer.close(lx);
                        return false;
                    });
                    return false;
                }
                if (data.checkModel == 1) {
                    layer.alert(data.msg, function (lx) {
                        layer.close(lx);
                        location.reload();
                    });
                    return false;
                }
                else {
                    if (isPc) {
                        if (data.certQRCode != '' && data.certQRCode != null) {
                            $(".certQRcodeDiv").html('<img src="' + data.certQRCode + '" width="320"/>');
                            scQrLayer = layer.open({
                                title: i18nDataList.scQrLayer,
                                shade: [0.3, '#333'],
                                shadeClose: false,
                                type: 1,
                                skin: 'layui-layer-lan',
                                anim: 3,
                                area: ['400px', '540px'],
                                content: $('.certNextDiv'),
                                cancel: function (index, layero) {
                                    $('.certNextDiv').hide();
                                },
                                end: function (index, layero) {
                                    $('.certNextDiv').hide();
                                }
                            });
                            return false;
                        }
                        else {
                            scQrLayer = layer.open({
                                title: i18nDataList.BuiderQRcode,
                                shade: [0.3, '#333'],
                                shadeClose: false,
                                type: 2,
                                skin: 'layui-layer-lan',
                                anim: 1,
                                area: ['340px', '340px'],
                                content: '../Public/BuiderQRcode?content='
                            });
                        }
                    }
                    else {
                        util.openWin({
                            url: data.certUrl
                        });
                    }
                } 
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    })
    form.verify({
        // 必填项
        number: function (value, elem) {
            // 自定义规则
            if (value) {
                const regex = /^1[3-9]\d{9}$/;
                if (!regex.test(value)) {
                    return i18nDataList.number;
                }
            }

        },
    });
    $(document).on('click', '.toRealName', function () {
        certLayer = layer.open({
            title: i18nDataList.toRealNametoRealName,
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [isPc ? '625px' : '95%', isPc ? '600px' : '95%'],
            content: `
            <form class="layui-form" action="" lay-filter="fm1" style="padding:10px 10px;">
                 <div class="layui-form-pane" style="margin-top:10px;margin-bottom:10px;margin-left:10px">
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number1}</label>
                         <div class="layui-input-inline">
                            <input type="text" name="number1"  lay-verify="number"  placeholder="${i18nDataList.number1placeholder}" autocomplete="off" ${popPhoneList[0]&&popPhoneList[0].status==0?'disabled':''} class="layui-input" value="${popPhoneList[0]?Number(popPhoneList[0].phone):''}">
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number2}</label>
                         <div class="layui-input-inline">
                            <input type="text" name="number2"  lay-verify="number"   placeholder="${i18nDataList.number2placeholder}" autocomplete="off" ${popPhoneList[1] &&popPhoneList[1].status == 0 ? 'disabled' : ''} class="layui-input" value="${popPhoneList[1] ? Number(popPhoneList[1].phone) : ''}">
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number3}</label>
                         <div class="layui-input-inline">
                            <input type="text" name="number3"  lay-verify="number"   placeholder="${i18nDataList.number3placeholder}" autocomplete="off" ${popPhoneList[2] &&popPhoneList[2].status == 0 ? 'disabled' : ''} class="layui-input" value="${popPhoneList[2] ? Number( popPhoneList[2].phone ): ''}">
                        </div>
                     </div>
                     <div style="color:red;margin-bottom:10px;margin-top:-10px;">${i18nDataList.nameTips} </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'><span style="color:red">*</span>${i18nDataList.name}</label>
                         <div class="layui-input-inline">
                            <input type="text" name="name"  lay-verify="required"  placeholder="${i18nDataList.nameplaceholder}" autocomplete="off" class="layui-input" value="">
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'><span style="color:red">*</span>${i18nDataList.idCardNo}</label>
                         <div class="layui-input-inline">
                            <input type="text" name="idCardNo"  lay-verify="required" placeholder="${i18nDataList.idCardNoplaceholder}" autocomplete="off" class="layui-input" value="">
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'><span style="color:red">*</span>${i18nDataList.upIDCardBoxLable}</label>
                         <div class="layui-input-inline">
                          <div class="upIDCardBox">
                                <div class="plus-sign"></div>
                                <div class="upIDCardBoxtext" lay-tips="${i18nDataList.upIDCardBoxtext}">${i18nDataList.upIDCardBoxLable}</div>
                             <img   src="" id="upIDCardImg" alt="">
                             <input type="file" class="layui-btn layui-icon layui-shangchuan layui-btn-success" id="upIDCardBtn" />
                           </div>
                        </div>
                     </div>
                  <div class="layui-form-item layui-layout-admin" style="margin-top:20px">
                      <div class="layui-input-block" style="margin-top:10px">
                          <button class="layui-btn  layui-btn-normal" lay-submit="" lay-filter="saveBtnPop" style="margin-left: 147px;">${i18nDataList.saveBtnPop}</button>
                      </div>
                      </div>
                 </div>
            </form>
            `
        });
        return false;
    })
    form.on('submit(saveBtnPop)', function (data) {
        var field = data.field; // 获取表单全部字段值
        field.tels = ''
        if (field.number1) {
            field.tels += field.number1
        }
        if (field.number2) {
            if (field.tels) {
                field.tels += ','
            }
            field.tels += field.number2
        }
        if (field.number3) {
            if (field.tels) {
                field.tels += ','
            }
            field.tels += field.number3
        }

        if (!popImg) {
            layer.msg(i18nDataList.popImg)
            return false
        }
        if (!field.tels) {
            layer.msg(i18nDataList.tels)
            return false
        }
        field.img = popImg
        $.ajax({
            type: "Post",
            url: "/UserAjax/CreatePhoneNoAReport",
            data: field,
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.close(indexLoad);
                layer.close(certLayer);
                GetUserPhoneReport()
                if (data.code == 200) {
                    layer.msg(i18nDataList.GetUserPhoneReport);
                } else {
                    layer.msg(data.msg);
                }

            }
        });
        return false

    });
    function base64ToFile(base64, filename) {

        const arr = base64.split(',')
        const type = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: type })

    }
    $(document).on('click', '.userPhoneReport', function (e) {
        certLayer = layer.open({
            title: i18nDataList.userPhoneReport,
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            closeBtn:1,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [isPc ? '400px' : '95%', isPc ? '340px' : '95%'],
            content: `
            <form class="layui-form userPhonePop" action="" lay-filter="fm1" style="padding:10px 10px;">
                 <div class="layui-form-pane" style="margin-top:10px;margin-bottom:10px;margin-left:10px">
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number1}</label>
                         <div class="layui-input-inline">
                            ${popPhoneList[0] ? Number(popPhoneList[0].phone) : ''}  ${popItemIcon(0)}

                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number2}</label>
                         <div class="layui-input-inline">
                            ${popPhoneList[1] ? Number(popPhoneList[1].phone) : ''} ${popItemIcon(1)}
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>${i18nDataList.number3}</label>
                         <div class="layui-input-inline">
                            ${popPhoneList[2] ? Number(popPhoneList[2].phone) : ''} ${popItemIcon(2)}
                        </div>
                     </div>
                     </div>

            </form>
            `
        });
        return false;

    })
    $(document).on('change', '#upIDCardBtn', function (e) {
        popImg = ''
        var canvasDataURL
        var files = e.target.files;
        if ((files[0].size / 1024 / 1000) > 3) {
            layer.msg(i18nDataList.filessize)
            return false
        }
        if (files[0].type != "image/jpeg" && files[0].type != "image/png") {
            layer.msg(i18nDataList.filestype)
            return false
        }
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
            canvasDataURL = reader.result;
            $.ajax({
                url: '/UserAjax/GetDyplsOSSInfoForUploadFile',
                method: 'GET',
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(4, { shade: false }); },
                error: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                },
                success: function (res) {
                    layer.close(indexLoad);
                    var nameslat = res.data.StartPath + '/' + new Date().getTime() + '_' + (Math.random() + "").substring(2, 6) + '.jpg'
                    var keyData = res.data
                    var file = base64ToFile(canvasDataURL, nameslat);
                    var filedata = new FormData();
                    filedata.append('key', nameslat);
                    filedata.append('policy', keyData.Policy);
                    filedata.append('OSSAccessKeyId', keyData.AccessKeyId);
                    filedata.append('signature', keyData.Signature);
                    filedata.append('success_action_status', 200);
                    filedata.append('file', file);
                    $.ajax({
                        url: keyData.Host,
                        processData: false,
                        cache: false,
                        contentType: false,
                        type: 'POST',
                        data: filedata,
                        error: function (XMLHttpRequest) {
                        },
                        success: function (ress) {
                            popImg = nameslat
                            $('#upIDCardImg').show().attr('src', canvasDataURL)
                        },
                    });

                },
            });
        }
    })
});