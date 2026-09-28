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
                StrIsNullOrEmpty1: '手工录入订单',
                StrIsNullOrEmpty2: '导入文件订单',
                cont: '订单内容',
                contlabel: '[会自动识别订单各项内容]',
                dlcontent: '可以把已经格式化好的订单文本内容直接粘贴到这里，然后用鼠标点一下框框外面任何地方，即可自动识别出订单各个内容',
                autodiscernsetText: '订单识别关键词设置',
                autodiscernsetTips: '订单内容里有识别不了的内容，可以进入这里进行关键词设置',
                autodiscernset: '识别不出来或有误？点击这里进行录单识别设置',
                autodiscernsetSpan: '编辑订单时不会自动识别，请手动填写右边项或',
                autodiscernsetTit: '点击可以识别上面的订单内容到右侧',
                autodiscernsetdisbtn: '点我识别订单',
                typebox: '订单类型',
                orderType1: '代练单',
                orderType2: '陪玩单',
                gameName: '游戏/区/平台/服',
                gameArea: '请选择或输入',
                gameAcc: '游戏账号',
                gameAccplaceholder: '请输入登录账号，可空',
                gamePwd: '登录密码',
                gamePwdplaceholder1: '无权查看，若要修改请重新输入',
                gamePwdplaceholder2: '请输入登录密码，可空',
                gameZAcc: '子账号',
                gameZAccplaceholder: '若无请留空',
                loginKey: '暗号/口令',
                gameRole: '角色名',
                gameRoleplaceholder: '请输入角色名，没有请留空',
                gaemTf: '若无请留空',
                orderTypeAreaTip: '可进入游戏维护-->订单项目分类管理中维护这里的',
                orderTypeArea: '项目分类',
                projectsetting1: '常用代练/陪玩项目',
                projectsetting2: '没有常用的?',
                projectsettingText: '常用项目设置',
                projectsettingTips: '进入常用代练项目设置',
                projectsettingCite: '点击常用项目设置',
                projectstr: '代练/陪玩项目',
                project: '可选择上面的项目，也可以直接在此输入项目，若有多个项目，请用/号分隔，最终代练/陪玩项目以这里填写的为准...',
                chaifen: '是否拆分订单',
                splitCheck: '按代练项目拆分订单(项目之间用/号分隔)',
                chaifentips: '如果你需要拆分订单，请勾选这里，并且在上面的代练陪玩项目输入框里用斜杠符号/来分隔，比如：等级1-60级/第2个任务啥啥啥/第3个任务啥啥啥，这样提交后，就会出现3笔订单资料一样但代练项目不一样的订单',
                yes: '是',
                timetag: '时间要求',
                day: '天',
                hours: '小时',
                mimidiv: '密保类型',
                safeKeyType1: '无',
                safeKeyType2: '安全令牌',
                orderSoureDiv: '订单来源',
                souresOrderID: '来源单号',
                souresOrderIDplaceholder: '若有多个请用逗号分隔，可空',
                isEditPrice: '订单总价',
                pricetips: '销售价格，相当于接进来的价格',
                priceplaceholder: '请输入接单价',
                pricetit: '接下此单的价格',
                SK143: '接单实收款',
                priceReceiptsplaceholder: '实际收款额',
                priceReceiptstitle: '实际收钱金额',
                pushplatdiv: '发平台价格',
                throwPricetips: '如果您需要同时将订单发到交易平台上，请在这里输入发到平台的价格。如果不需要在录单的同时直接发到交易平台，请在这里输入0',
                throwPriceplaceholder: '发平台的价格',
                throwInterPrice: '发内部抢单大厅价',
                throwInterPricetips: '如果您需要同时将订单发到内部抢单大厅，请在此输入给内部人员的抢单价。内部和交易平台的价格可以不一样。若这里为0，将不会发内部抢单。注意，这不是指派的价格',
                throwInterPriceplaceholder: '发平台的价格',
                safeAmount: '安全保证金',
                safeAmountplaceholder: '安全保证金',
                effAmount: '效率保证金',
                pushplatformtemplte: '快速发单配置的要求',
                delayDiv: '延迟发平台',
                isDelay1: '否',
                isDelay2: '是',
                delaySec: '延迟',
                delaySectips: '设置这个后，系统会先发到内部抢单，在指定时间后再自动发到交易平台。最小延迟1分钟，0为不启用。为防止重复发单，在延迟期间(还没到时间)无法手动发平台。可以手动直接填写分钟数',
                delaySecDiv: '分钟后再发到交易平台',
                payMethed: '支付方式',
                payMethed1: '默认',
                payMethed2: '花呗',
                payMethed3: '信用卡',
                desServiceFee: '产生的手续费',
                desServiceFeeplaceholder: '请输入产生的手续费',
                moblie: '联系电话',
                moblietitle: '该客户在黑名单中',
                moblieplaceholder: '可留空',
                qq: 'QQ/微信',
                ww: '旺旺/YY',
                customerName: '会员号/会员名',
                customerNameplaceholder: '会员号或老板名',
                customerNametitle: '如果需要从会员余额扣款，请在这里输入会员名称或会员号',
                vipDedCheckBox: '需要从余额扣款',
                vipDedCheckBoxtips: '勾选此项后将从会员余额扣钱，同时累计消费并产生消费明细',
                remark: '重要备注',
                remarkplaceholder: '可写重要的备注内容',
                tag: '自定义标记',
                tagplaceholder: '可自定义标识，可空',
                jiaji: '是否加急',
                kdti: '内部派单：',
                kdtititle: '复将订单快速指派给指定接手人或抛单至内部接单大厅里让大家抢单制代码',
                KSPD: '暂不指派',
                throwFeestr: '发给打手价格',
                throwFee: '抛单价',
                defAssTips: '勾选后，将此人设为默认接手人(打手)，下次录单默认指派给这个人。当你取消打勾后提交，将自动清除该设置',
                defAss: '默认指派此人',
                isAllowChangeCustomerService: '接单销售客服',
                savebtn: '提交保存',
                blockquote: '如果你的订单文件是从其它渠道来的，可以在下面选择文件来源，然后上传文件，点击确定导入',
                gm: '要导入的游戏',
                imfomart: '导入格式',
                fileSoure1: '格式化好的订单内容1(Execl)',
                fileSoure2: '格式化好的订单内容2(Execl)',
                fileSoure3: '账号----密码----服务器----项目/目标代币数----订单号----旺旺----手机号----角色名的LOL脚本订单(txt)',
                fileSoure4: '空格换行的TXT文本格式订单',
                fileSoure5: '从平台导出的表格格式',
                fileSoure6: '导入到代练通的表格格式',
                fileSoure7: '来自魔游客的订单(Execl)',
                orderSoures2: '选择订单来源',
                throwactionlabel: '发单动作',
                throwaction1: '无动作',
                throwaction2: '发单价大于0时就抛内部接单大厅',
                filterRepeatlabel: '是否过滤重复',
                filterRepeattips1: '会以单号、账号、代练项目等为依据检测是否重复的订单',
                filterRepeat1: '过滤',
                filterRepeattips2: '不做重复性检测，忽略重复项',
                filterRepeat2: '忽略',
                ctips: '操作提示',
                ctipstitle: '点击下载参考格式',
                ctipscont: '请点击这里下载参考导入格式，鼠标右键选择：将链接另存为',
                progress: '导入结果',
                upmypic10: '要导入的文件',
                upload: '选择订单文件',
                kszpDiv: '排序方式',
                userOrderBy1: '默认排序',
                userOrderBy2: '按用户排序值大到小',
                seacher: '搜索',
                seachUserKey1: '用户名/名称/标记',
                resetSeachBtn: '重置',
                kszp: '可指派接手人',
                recUser: '暂不指派',
            },
            js: {
                layc: '导入完成：',
                laycfail: '导入失败：',
                uploadInst1r: '上传失败了',
                customerText: '会员',
                vipDedCheckBox: '如果需要从会员余额扣钱，请记得勾选此处，否则不会扣余额哦！',
                discount1: '会员余额',
                discount2: '元，此会员有',
                discount3: '折优惠，提交录单后将自动换算折扣',
                customerText: '非会员',
                projectstr: '陪玩内容/标题',
                throwFeestr: '发陪玩价格',
                timetag: '陪玩时长',
                throwFeestr2: '给打手发单价',
                projectstr2: '代练项目/标题',
                timetag: '时间要求',
                bossNameLabel: '角色名',
                gameRole: '请输入角色名，没有请留空',
                mark1: '当前信息1',
                mark2: '当前信息2',
                mark3: '天赋&装等',
                mark4: '装等',
                mark5: '符文等级/英雄数',
                error: '系统繁忙！',
                recUser: '暂不指派',
                recUser2: '内部抢单',
                KSPD: '暂不指派',
                orderSoures1: '未能匹配到订单来源：',
                orderSoures2: '，你可以直接在此填写并选择',
                loginKey: '自动识别完成，若有差异，请手动修正',
                orderSouresIndex: '如果下拉列表没有可选的订单来源，可以直接在此输入新来源然后选择输入的那一项',
                dlcontentmouseover: '可以把格式后的订单内容粘贴在此处，鼠标点击输入框外面任意地方，就可自动识别订单各项内容',
                dlprojectmouseover: '可以勾选上面常用的代练/陪练项目，也可以在这里输入代练/陪练项目。如果你需要拆分订单，让每个项目一笔订单，只需要用符号/分隔项目内容即可',
                soureidmouseover: '如果有多笔订单号，请用逗号分隔，不要用其它符号',
                kszpLayer: '快速指派接手人',
                selectUserDataList: '可以在此输入给该打手或发内部抢单的发单价，不输入则默认为0。<br>如果你需要按接单价的百分比作为发单价，可以直接写百分数，例如写 85% 或 90% 等',
                selectUserDataList2: '这里是多人指派的发单总价，若需要修改请点击左边按钮，在弹窗里针对每一位接手人的发单价进行修改',
                priceLayerTips1: '该价格是从天猫/淘宝读取的',
                priceLayerTips2: '笔订单总价',
                priceLayerTips3: '，禁止修改',
                project: '代练项目不能为空',
                customerInputOrder: '代练/陪玩项目不可为空',
                strParameter: '无可提交数据！',
                strParameterTit: '提示',
                gameArea: '全区',
                gameServer: '全服',
                AddOrderAjax: '出现错误，请检查每一项录单格式上是否存在超长、不正确的情况',
                ctips: '因从魔游客导出的EXECL会出现乱码，所以需要先把魔游客订单里的内容复制出来，新建一个EXECL文档，把复制的内容原样粘贴到新建的EXECL文档里，保存好，最后再把新建的这个EXECL文件导入进来',
                throwactiontitle: '点击下载参考格式',
                throwaction: '请点击这里下载参考导入模板',
                ctipscont: '请点击这里下载参考导入模板',
                ctipscont2: '请点击这里下载参考导入模板，鼠标右键选择：将链接另存为',
                ctipscont3: '请点击这里下载参考导入格式，鼠标右键选择：将链接另存为',
                ctipscont4: '从本系统里导出默认的EXECL格式，可以直接导入进来',
                ctipscont5: '点击这里下载模板格式',
                savebtnclass1: '保存订单并发到平台',
                savebtnclass2: '提交保存',
                pushplatformtemplte: '快速发单配置的要求',
                isVipDedAmount: '老板余额小于1元，不能从预存扣款',
                memberBalance: '注意，该老板预存余额不足，录单后会产生欠费，请注意追款',
                isVipDedAmountY: '注意，该老板预存余额不足，录单后会产生欠费，请注意追款',
                viplabel: '从会员余额扣款(可用余额',
                yuan: '元)',
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
    formSelects: '/lib/formSelects-v4'
}).use(['index', 'form', 'formSelects', 'util', 'admin', 'element', 'upload','laypage'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        element = layui.element,
        formSelects = layui.formSelects;
    var upload = layui.upload;
    var laypage = layui.laypage;
    var devices = layui.device();
    var isPc = true; 
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var admin = layui.admin; 
    var re = true;
    var indexLoad; 
    var readPriceIsAllowEdit = $("#readPriceIsAllowEdit").val();
    var isChangeService = $("#isChangeService").val();
    var editCustomerService = $("#editCustomerService").val();
    var editOrderSoure = $("#editOrderSoure").val();
    var tproject = $("#tproject").val();
    var gameNumber = $("#gameNumber").val();
    var gameName = $("#gameName").find("option:selected").text();
    var isDis = $("#isDis").val();
    var orderSoure2 = $("#orderSoures2").val();
    var mobliegame = false;
    var ispw = $("#gameIsPw").val();
    var isorderType = $('input[name=orderType]:checked').val();
    var isgameaccpwd = true;
    var userOrderBy = $("input[name='userOrderBy']:checked").val();
    var selectDefAssRecUserName = '';
    var isSplitOrderProject = "N"; 
    var isVipDedAmount = "N";
    var memberBalance = 0;
    var allUserList = [];
    var currentGameArearData = [];
    var currentGameServerData = [];
    var currentGameJobData = [];
    var currentGameGroupData = [];
    var currentSelectRecUserId = 0;
    var upLoadFileTag = 0;
    var customerId = 0
    var selectUserDataList = []
    var selectUserId = 0
    var indexPop = 0
    var limit = 1000;
    var page = 1
    var assMode = $('.assMode').val()
    if ($('.customerId').val()) {
        customerId = $('.customerId').val()
    }
    var uploadInst1;
    $('#dlcontent').val($('#orderInfo').val())
    getGameArea();
    getGameJob();
    getGameGroup();
    getGameProject($("#gameName").val());
    getAllOrderSoure();
    getAllRecUserData(); 
    getCustomerService();
    getOrderTypeList($("#gameName").val(), $("#defOrderType").val());
    uploadInst1=upload.render({
            elem: '#upmypic10'
            , accept: 'file'
            , method: 'post'
            , acceptMime: 'file/xls,file/xlsx,file/txt'
            , exts: 'xls|xlsx|txt'
            , size: 1024 * 5
            , auto: true
            , drag: true
            , url: '/OrderAjax/ImputAddOrderByFile'
            , data: {
                gameName: function () {
                    return upGameName;
                },
                fileSoure: function () {
                    return $('input[name="fileSoure"]:checked').val();
                },
                throwAction: function () {
                    return throwAction;
                },
                filterRepeat: function () {
                    return $('input[name="filterRepeat"]:checked').val();
                }
            } 
            , before: function (obj) {
                upindex = layer.load(1, { shade: false });
            }
            , progress: function (n, elem, res, index) {
                element.progress('filter-demo', n + '%');
            }
            , done: function (res, index, upload) {
                var item = this.item;
                upLoadFileTag = 1;
                layer.close(upindex); 
                $(".successTips").html(res.success);
                $(".errorTips").html(res.fail);
                if (res.code > 0) {
                    layer.alert('导入完成：' + res.success, function (layc) {
                        layer.close(layc);
                        location.reload();
                    });
                }
                else {
                    layer.alert('导入失败：' + (res.msg == undefined || res.msg == null ? res.fail : res.msg), function (layc) {
                        layer.close(layc);
                        location.reload();
                    });
                }
            }
            , error: function (index, upload) {
                $('#upmypic10').on('click', function () {
                    uploadInst1.upload();
                })
                layer.msg('上传失败了', { time: 1500 }, function () {
                });
            }
        });
    var firsetId;
    var layid = location.hash.replace(/^#od=/, '');
    element.tabChange('od', layid);
    element.on('tab(od)', function (elem) {
        location.hash = 'od=' + $(this).attr('lay-id');
    });
    if ($("#orderID").val() != null && $("#orderID").val() != '') {
        formSelects.data('gameServer', 'local', {
            arr: [
                { "name": $("#tGameServer").val(), "value": $("#tGameServer").val(), "selected": "selected" }
            ]
        });
    }        
    showpw();
    if (gameName == '魔兽世界') {
        $('.gamegroupsdiv').show()
    }
    else {
        $('.gamegroupsdiv').hide()
    }
    if ($("#ispushplattag").val() == "Y") {
        loadtemplate();
    }    
    $(".layui-input").keypress(function (e) {
        if (e.keyCode == 13) {
            $(this).hasClass('searchinput')
            if ($(this).hasClass('searchinput')) {
                $('.kszpDiv .seachBtn').click();
            } else {
                $('.savebtnclass').click();
            }
        }
    })
    var timer
    $("#customerName").on("input", function (e) {
        changeCustomerName()

    });
    function changeCustomerName(val) {
        $('.customerTip i').hide()
        $('.customerTip .layui-icon-loading').show()
        $('.customerTip .customerText').text('')
        form.val('form1', { customerNo: '' });
        customerId = 0
        var data = form.val('form1');
        var value = data.customerName
        if (timer) {
            clearTimeout(timer)
        }
        if (!value) {
            $('.customerTip .layui-icon-loading').hide()
            form.val('form1', { interactMsg: '' });
            $('.interactMsg').hide()
            return false
        }
        value = encodeURIComponent(value);
        timer = setTimeout(() => {
            $.ajax({
                url: '/api/customerApi/GetCustomerSelect?keyword=' + value,
                method: 'GET',
                success: function (res) {
                    $('.customerTip .layui-icon-loading').hide();
                    if (res.data) {
                        $('.customerTip .layui-icon-ok').show();
                        $('.customerTip .customerText').text('会员');
                        form.val('form1', { customerNo: res.data.label });
                        layer.tips('如果需要从会员余额扣钱，请记得勾选此处，否则不会扣余额哦！', $('.vipDedCheckBox'), {
                            tips:2,
                            tipsMore: true,
                            time:7000
                        });
                        customerId = res.data.value;
                        $('.interactMsg').show()
                        $.ajax({
                            type: "GET",
                            url: "/CustomerAjax/GetMemberBalance?bossName=" + value,
                            data: {},
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function () { },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                            success: function (data) {
                                memberBalance = data.data 
                                var isDefDec = data.defDec;
                                layer.tips('会员余额' + data.data + '元，此会员有' + ((res.data.discount) * 10).toFixed(1) +'折优惠，提交录单后将自动换算折扣', $('#customerName'), {
                                    tips: 1,
                                    time: 4000,
                                    tipsMore: true
                                });
                                if (isDefDec == 1 && memberBalance >0) { 
                                    $('input[lay-filter="vipDedCheck"]').prop('checked', true);
                                    form.render('checkbox');
                                }
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        });
                    } else {
                        $('.customerTip .layui-icon-close').show();
                        $('.customerTip .customerText').text('非会员');
                        form.val('form1', { customerNo: '' });
                        customerId = 0
                        $('.interactMsg').hide()
                    }
                },
            });
        }, 500)
    }
    function showpw() {
        if (isorderType == 1) {
            $('#gameAccDiv').hide();
            $('#gamepwdiv').hide();
            $('#zgameAccDiv').hide();
            $("#mark1Div").hide();
            $("#mark2Div").hide();
            $("#keyDiv").hide();
            //$('.mimidiv').hide()
            $('.projectstr').text('陪玩内容/标题')
            $('.throwFeestr').html('发陪玩价格');
            $('.timetag').html('陪玩时长');
            //$('.bossNameLabel').html('老板名称');
            //$("#gameRole").attr("placeholder", "请输入老板名称，没有请留空");
            //form.val('form1', {
            //    'day': '0',
            //    'gameAcc': '',
            //    'gamePwd': '',
            //    'gameZAcc': '',
            //    'gaemTf': '',
            //    'gameSQ': ''
            //})
            //form.render();

        } else {
            $('.throwFeestr').html('给打手发单价');
            $('#gameAccDiv').show();
            $('#gamepwdiv').show();
            $('#zgameAccDiv').show();
            $("#mark1Div").show();
            $("#mark2Div").show();
            $("#keyDiv").show();
            //$('.mimidiv').show()
            $('.projectstr').text('代练项目/标题')
            $('.averagediv').hide();
            $('.timetag').html('时间要求');
            $('.bossNameLabel').html('角色名');
            $("#gameRole").attr("placeholder", "请输入角色名，没有请留空");
        }
        isshowaverage()
    }
    form.on('select(hoursselect)', function (data) {
        isshowaverage()
    })
    form.on('radio(selectorderType)', function (data) {
        isorderType = data.value;
        showpw();
    })
    $('#price').on('input', function (data) {
        isshowaverage()
    })
    $('#project').on('blur', function (data) {
        var val = $('#project').val();
        if ((val.indexOf('陪玩') > -1 || val.indexOf('陪练') > -1 )&& isorderType==0) {
            isorderType = 1;
            form.val('form1', {
                'orderType': '1'
            })
            form.render();
            showpw()
        }
    })
    function isshowaverage() {
        return false;
        var val = $('#price').val();
        var time = $('select[name=day]').val()*24+$('select[name=hours]').val();
        if (val != '' && val > 0 && (isorderType == 1 || ispw)) {
            $('.averagediv').show();
            var value = time==0?val:(val / time).toFixed(2);
            $('#averageprice').val(value)
        } else {
            $('.averagediv').hide();
        }
    }
    form.on('select(selectGame)', function (data) {
        var mark1 = "当前信息1";
        var mark2 = "当前信息2";
        var tempIsMoblieGame = false;
        var tempIsPw = false;
        var tempIsAccPwd = true;
        page = 1
        $("#gameName option").each(function () {
            var item = $(this).val(); 
            if (item == data.value) {
                gameName = $(this).text();
                var temp = $(this).data('mobliegame');
                tempIsMoblieGame = temp == "Y" ? true : false;
                tempIsPw = $(this).data('pw') == "Y" ? true : false;
                tempIsAccPwd = $(this).data('accpwd') == "Y" ? true : false;
                if (gameName.indexOf('魔兽世界') > -1) {
                    mark1 = '天赋&装等';
                    mark2 = '装等';
                    $('.gamegroupsdiv').show();
                } else {
                    $('.gamegroupsdiv').hide();
                    if (gameName.indexOf('王者荣耀') > -1 || gameName.indexOf('英雄联盟') > -1) {
                        mark1 = '符文等级/英雄数';
                    }
                }
            }
        });  
        $("#mark1").html(mark1);
        $("#mark2").html(mark2); 
        mobliegame = tempIsMoblieGame; 
        ispw = tempIsPw;
        isgameaccpwd = tempIsAccPwd;
        if (!mobliegame && isorderType == 0) {
            $("#zgameAccDiv").show();
        } else {
            $("#zgameAccDiv").hide();
        }
       
        if (ispw & !$("#orderID").val()) {
            isorderType = 1;
            form.val('form1', {
                'orderType': '1'
            })
        }
        form.render();
        showpw();       
        getGameArea();
        getGameJob();
        getGameGroup();
        getGameProject(data.value);
        formSelects.data('gameServer', 'local', {
            arr: [
            ]
        });
        getAllRecUserData();
        getCustomerService();
        getGameTitleAttr();
        getGamePushPlatfromData();
        loadtemplate();
        getOrderTypeList(data.value, $("#defOrderType").val());
        return false;
    }); 
    formSelects.on('gameArea', function (id, vals, val, isAdd, isDisabled) { 
        getGameServer(val.value);
        return true;
        });
    function getGameArea() { 
        $.get('/GameAjax/getGameData?type=20&parentId=' + gameName + '&selectValue=' + $("#tGameArea").val(), function (result) {
        currentGameArearData = result.data;
        formSelects.data('gameArea', 'local', {
            arr: currentGameArearData
        });
    });
}
    function getGameServer(pid,serverName) { 
        $.get('/GameAjax/getGameData?type=30&parentId=' + pid + '&selectValue=' + $("#tGameServer").val(), function (result) {
            currentGameServerData = result.data;
            formSelects.data('gameServer', 'local', {
                arr: currentGameServerData
            });
            if (serverName != undefined && serverName != null && serverName != '') {
                let serverId = 0;

                const target = currentGameServerData.find(item => item.name.includes(serverName));
                if (target) {
                    serverId = target.value;
                }

                if (serverId > 0) {
                    formSelects.value('gameServer', [serverId], true);
                } else {
                    formSelects.data('gameServer', 'local', {
                        arr: [
                            { "name": serverName, "value": serverName, "selected": "selected" }
                        ]
                    });
                }
            }
        }); 
    }
    function getGameJob() { 
        $.get('/GameAjax/getGameData?type=40&parentId=' + gameName + '&selectValue=' + $("#tGameJob").val(), function (result) {
            currentGameJobData = result.data;
            formSelects.data('gameJob', 'local', {
                arr: currentGameJobData
            });
        });
    }
    function getGameGroup() {
        $.get('/GameAjax/getGameData?type=50&parentId=' + gameName + '&selectValue=' + $("#tGameGroup").val(), function (result) {
            currentGameGroupData = result.data;
            formSelects.data('gameGroup', 'local', {
                arr: currentGameGroupData
            });
        });
    }
    function getGameProject(gameId) {
        $.ajax({
            type: "GET",
            url: "/GameAjax/getProject",
            data: { gameId: gameId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $(".dllistdiv").html("");
                html = ""; 
                $.each(data.data, function (index, item) {
                    let ck = "";
                    if (tproject.indexOf(item.name) > -1) {
                        ck = 'checked="checked"';
                    }
                    html += '<input type="checkbox" name="dltype" lay-skin="primary" title="' + item.name + '" value="' + item.name + '" lay-filter="dltype" ' + ck + '/>';
                });
                $(".dllistdiv").append(html);
                form.render('checkbox');
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getAllOrderSoure() {
        var soureData = [];
        $.get('/SystemAjax/GetOrderSoureList?selectValue=' + editOrderSoure, function (result) {
            soureData = result.data;
            formSelects.data('orderSoures', 'local', {
                arr: soureData
            });
            if (soureData.length > 0 && editOrderSoure=="") {
                firsetId = soureData[0].value;
                formSelects.value('orderSoures', [firsetId], true);
            } 
        }); 
    }

    function loadPage(count) {
        console.log(count)
        laypage.render({
            elem: 'laypagenormal'
            , count: count
            , curr:page
            , limit: limit
            , jump: function (obj, first) {
                page = obj.curr;
                limit = obj.limit;
                //首次不执行
                if (!first) {
                    getAllRecUserData();
                }
            }
        });
    }

    function getAllRecUserData() {
        let orderID = $("#orderID").val();
        let seachKey = $("#seachUserKey1").val();        
        let selectDefAssRecUser = $("#selectRecUser").val();
        //if (orderID != undefined && orderID != null && orderID != '') {
        //    return;
        //}
        var soureData = [];

        $.get('/UserAjax/GetAllUserByGameName?gameName=' + gameName + '&isFilteJdp=Y&userOrderBy=' + userOrderBy + '&accurate=1&seachKey=' + seachKey + '&isEnlabeDefAssRec=Y&limit=' + limit+'&page='+page, function (result) {
            soureData = result.data;
            allUserList = soureData;
            let defAssRecManUid = result.defAssRecManUid;
            $(".kszp").html("");
            let html = "";
            html += '<div class="layui-inline" style="width:195px"><input type="radio" name="recUser" lay-skin="primary" title="暂不指派" value="0" lay-filter="userlist"' + (parseInt(selectDefAssRecUser) > 0 ? 'checked="checked"' : 'checked="checked"') + '></div><div class="layui-inline" style="width:195px"><input type="radio" name="recUser" lay-skin="primary" title="内部抢单" value="999999" lay-filter="userlist" ' + (defAssRecManUid == "999999" ? 'checked="checked"' : '') +'></div>';
            $.each(soureData, function (index, item) {
                let ck = "";
                if (item.name != '内部成员' && item.name != '合作用户') {
                    html += '<div class="layui-inline" style="width:195px"><input type="radio" name="recUser" lay-skin="primary" title="' + item.name + '" value="' + item.value + '" lay-filter="userlist" ' + (item.selected == 'selected' ?'checked="checked"':'')+'></div>';
                }
            });
            $(".kszp").append(html); 
            if (result.count > limit) {
                loadPage(result.count);
            }
            if (result.defAssRecManUid > 0) {
                $("input[name='defAss']").prop("checked", true);
            }
            else {
                $("input[name='defAss']").prop("checked", false);
            }
            userListCheckValue(result.defAssRecManUid, result.defAssRecMan,false);
        });
    }
    function getGameTitleAttr() {
        $.get('/GameAjax/GetGameAttrInfoTitle?game=' + gameName, function (result) {
           let titleResult = result.data;
            $("#mark1").html(titleResult.str1);
            $("#mark2").html(titleResult.str2);
        });
    }
    function getGamePushPlatfromData() {
        $.get('/SystemAjax/GetPlatformPushOrderConfig?gameName=' + gameName, function (result) {
            if (result.code > 0) {
                let safeAmount = $("#safeAmount").val();
                let effAmount = $("#effAmount").val();
                $("#safeAmount").val(result.data.pushPlatformSafeAmount);
                $("#effAmount").val(result.data.pushPlatformEffAmount);
                $('.pushplatdiv').show();
                loadtemplate();
            } else { 
                $('.pushplatdiv').hide();
            }
        });
    }   
    var kszpLayer;
    form.on('radio(userlist)', function (data) {
        layer.close(kszpLayer);
        userListCheckValue(data.value, data.elem.title,true);
    });
    function userListCheckValue(uid, username, isfoucs) {
        currentSelectRecUserId = uid;
        if (uid != "0") {
            let tempValue = parseFloat($("#throwFee").val());
            if (tempValue > 0) {
                $("#throwFee").val('0');
            }
            $('.throwFeelayer').show();
            let fee = 0;
            let sprice = $("#price").val();
            for (let u = 0; u < allUserList.length; u++) {
                if (parseInt(uid) === parseInt(allUserList[u].value)) {
                    if (allUserList[u].tichen > 0) {
                        if (allUserList[u].brokerageType === 20) {
                            fee = ((allUserList[u].tichen / 100) * sprice).toFixed(2);
                        }
                        else if (allUserList[u].brokerageType === 10) {
                            fee = allUserList[u].tichen;
                        }
                    }
                }
            }
            $("#throwFee").val(fee == 0 ? "" : fee);
            if (isfoucs) {
                $("#throwFee").focus();
            }
            throwFeeTipsLayermouseoverTips();
            $('.KSPD').html(username);
            $('.KSPD').addClass('KSPDC');
            $('.pushplatdiv').hide();
            $("#throwPrice").val('0');
            $("#throwInterPrice").val('0');
            var orderID = $("#orderID").val();
            if (orderID) {
                $(".saveassbtn").hide();
            } else {
                $(".saveassbtn").show();
            }
            selectUserDataList = [{ userId: uid, userName: username, fee:0 }]
        }
        else {
            $('.throwFeelayer').hide();
            $("#throwFee").val(0);
            layer.close(throwFeeTipsLayer);
            $('.KSPD').html('暂不指派');
            $('.KSPD').removeClass('KSPDC');
            if ($("#ispushplattag").val() == "Y") {
                $('.pushplatdiv').show();
            }
            $(".saveassbtn").hide();
            $("input[name='defAss']").prop("checked", false);
        }
        form.render();
    }
    function getCustomerService() {
        var orderID = $("#orderID").val();
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=Y&gameName=' + gameName + '&isOnlySelectSelf=' + (orderID == "" && isChangeService!="Y" ? "N" : isChangeService) + '&editUserName=' + editCustomerService+'&dy=1', function (result) {
            soureData = result.data;
            $(".cf").html("");
            var html = "";
            $.each(soureData, function (index, item) {
                let ck = item.selected == "selected" ? 'checked=""' : ''; 
                html += '<input type="radio" name="inputOrderKefu" title="' + item.name + '" value="' + item.value + '" ' + ck + '/>';
            });
            $(".cf").append(html);
            form.render('radio');
        });
    }
    $(".autokeys").change(function () {
        var orderID = $("#orderID").val();
        if (orderID != "" && orderID != null) {
            if (parseInt(isDis)==0) {
                return false;
            }
        }
        var val = $(this).val();
        if (val == "") {
            return false;
        }
        if (parseInt(gameNumber) > 1) {
            disGame(val);
        } else {
            disContent(val);
        } 
        return false;
    })
    function disGame(val) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/DisGameNameByContent",
            data: { content: val },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () {
                re = true;
                disContent(val);
            },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                //console.log(data);
                if (data.code > 0) {
                    gameName = data.data; 
                    $('select[name="gameName"]').next().find('.layui-anim').children('dd[lay-value="' + data.code+'"]').click(); 
                    //form.val("form1", {
                    //    "gameName": data.code
                    //});
                }
                disContent(val);
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function disContent(val) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/OrderAjax/AddOrderAutoDisKeys",
            data: { content: val, gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    var res = data.data;
                    if (res.GameServer1 != "" && res.GameServer1 != null) {
                        var gameAreaId = 0;
                        currentGameArearData.forEach(function (val, index) {
                            let item = val;
                            if (res.QQWX != "" && res.QQWX != null) {
                                if (item.name.indexOf(res.GameServer1) > -1 && item.name.indexOf(res.QQWX) > -1) {
                                    gameAreaId = item.value;
                                    return false;
                                }
                            } else {
                                if (item.name.indexOf(res.GameServer1) > -1) {
                                    gameAreaId = item.value;
                                    return false;
                                }
                            }
                        });
                        console.log(gameAreaId)
                        if (gameAreaId > 0) {
                            formSelects.value('gameArea', [gameAreaId], true);
                            getGameServer(gameAreaId, res.GameServer2);
                        }
                        else {
                            formSelects.data('gameArea', 'local', {
                                arr: [
                                    { "name": res.GameServer1, "value": res.GameServer1, "selected": "selected" }
                                ]
                            });
                            if (res.GameServer2 != "" && res.GameServer2 != null) {
                                formSelects.data('gameServer', 'local', {
                                    arr: [
                                        { "name": res.GameServer2, "value": res.GameServer2, "selected": "selected" }
                                    ]
                                });
                            }
                        }
                    }
                    if (res.GameJob != "" && res.GameJob != null) {
                        var gameJobId = 0;
                        currentGameJobData.forEach(function (val, index) {
                            let item = val;
                            if (item.name.indexOf(res.GameJob) > -1) {
                                gameJobId = item.value;
                                return false;
                            }
                        });
                        if (gameJobId > 0) {
                            formSelects.value('gameJob', [gameJobId], true);
                        } else {
                            formSelects.data('gameJob', 'local', {
                                arr: [
                                    { "name": res.GameJob, "value": res.GameJob, "selected": "selected" }
                                ]
                            });
                        }
                    }
                    if (res.GameGroup != "" && res.GameGroup != null) {
                        var gameGroupId = 0;
                        currentGameGroupData.forEach(function (val, index) {
                            let item = val;
                            if (item.name.indexOf(res.GameGroup) > -1) {
                                gameGroupId = item.value;
                                return false;
                            }
                        });
                        if (gameGroupId > 0) {
                            formSelects.value('gameGroup', [gameGroupId], true);
                        }
                        else {
                            formSelects.data('gameGroup', 'local', {
                                arr: [
                                    { "name": res.GameGroup, "value": res.GameGroup, "selected": "selected" }
                                ]
                            });
                        }
                    }
                    if (res.GameAcc != "" && res.GameAcc != null) {
                        $("#gameAcc").val(res.GameAcc);
                    }
                    if (res.AccPwd != "" && res.AccPwd != null) {
                        $("#gamePwd").val(res.AccPwd);
                    }
                    if (res.ZGameAcc != "" && res.ZGameAcc != null) {
                        $("#gameZAcc").val(res.ZGameAcc);
                    }
                    if (res.GameRoleName != "" && res.GameRoleName != null) {
                        $("#gameRole").val(res.GameRoleName);
                    }
                    if (res.ItemLevel != "" && res.ItemLevel != null) {
                        $("#gaemTf").val(res.ItemLevel);
                    }
                    if (res.OtherLevel != "" && res.OtherLevel != null) {
                        $("#gameSQ").val(res.OtherLevel);
                    }
                    if (res.DLContent != "" && res.DLContent != null) {
                        $("#project").val(res.DLContent);
                    } 
                    if (res.Price != "" && res.Price != null) {
                        $("#price").val(res.Price);
                    }
                    if (res.ReceiptAmount != "" && res.ReceiptAmount != null) {
                        $("#priceReceipts").val(res.ReceiptAmount);
                    }
                    if (res.WW != "" && res.WW != null) {
                        $("#ww").val(res.WW);
                    }
                    if (res.Moblie != "" && res.Moblie != null) {
                        $("#moblie").val(res.Moblie);
                        getCustomerOrderLog();
                    }
                    if (res.QQ != "" && res.QQ != null) {
                        $("#qq").val(res.QQ);
                    }
                    if (res.Remark != "" && res.Remark != null) {
                        $("#remark").val(res.Remark);
                    }
                    if (res.TipsRemark != "" && res.TipsRemark != null) {
                        $("#tag").val(res.TipsRemark);
                    }
                    if (res.OrderSoure != "" && res.OrderSoure != null) {                        
                        if (res.OrderSoure == "default") {
                            formSelects.value('orderSoures', [firsetId],true);
                        } else {
                            formSelects.value('orderSoures', [res.OrderSoure], true);
                        }
                        var sor = formSelects.value('orderSoures', 'nameStr');
                        if (sor == "" || sor == null || sor == undefined) {
                            layer.tips('未能匹配到订单来源：' + res.OrderSoure + '，你可以直接在此填写并选择', '#orderSoureTips', {
                                tips: [4, '#3595CC'],
                                time: 5000
                            });
                        }
                    }
                    if (res.SourID != "" && res.SourID != null) {
                        $("#souresOrderID").val(res.SourID);
                        getTaobaoOrderInfo();
                    }
                    if (res.day > 0 || res.hours > 0) {
                        $("#day").val(res.day);
                        $("#hours").val(res.hours);
                    }
                    if (res.loginKey) {
                        $("#loginKey").val(res.loginKey);
                    }
                    layer.msg('自动识别完成，若有差异，请手动修正', { time: 1500 });
                    //larryms.message('自动识别完成，若有差异，请手动修正', 'success', data.code > 0 ? 'layui-toast' : 'layui-cuowu2', 2); 
                    form.render();
                    GetMemberBalance();
                }
                else {
                    layer.msg(data.msg);
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    form.on('checkbox(dltype)', function (data) { 
        var ydlcontent = $("#project").val();
        if (data.elem.checked) {
            ydlcontent = ydlcontent + (ydlcontent.length>0?"/":"") + data.value;
        }
        else {
            ydlcontent = ydlcontent.replace("/" + data.value, "");
            ydlcontent = ydlcontent.replace(data.value, "");
            if (ydlcontent.indexOf("/") == 0) {
                ydlcontent = ydlcontent.substring(1);
            }
        }
        $("#project").val(ydlcontent);
    });
    var orderSouresIndex; 
    formSelects.opened('orderSoures', function (id) { 
        orderSouresIndex= layer.tips('如果下拉列表没有可选的订单来源，可以直接在此输入新来源然后选择输入的那一项', '#orderSoureTips', {
                tips: [4, '#3595CC'],
                time: 6000,
                tipsMore: false
            });
    });
    $(document).on('mouseleave', '.orderSoureDiv', function () {
        layer.close(orderSouresIndex);
    }); 
    var dlcontentmouseover;
    $(document).on('mouseover', '#dlcontent', function () {
        dlcontentmouseoverTips();
    });
    $(document).on('mouseleave', '#dlcontent', function () {
        layer.close(dlcontentmouseover);
    });
    function dlcontentmouseoverTips() {
        dlcontentmouseover = layer.tips('可以把格式后的订单内容粘贴在此处，鼠标点击输入框外面任意地方，就可自动识别订单各项内容', '#dlcontent', {
            tips: [3, '#2F4056'],
            time: 10000,
            tipsMore: false
        });
    } 
    var dlprojectmouseover; 
    $(document).on('mouseover', '#project', function () {
        dlprojectmouseoverTips();
    });
    $(document).on('mouseleave', '#project', function () {
        layer.close(dlprojectmouseover);
    });
    function dlprojectmouseoverTips() {
        dlprojectmouseover = layer.tips('可以勾选上面常用的代练/陪练项目，也可以在这里输入代练/陪练项目。如果你需要拆分订单，让每个项目一笔订单，只需要用符号/分隔项目内容即可', '#project', {
            tips: [3, '#2F4056'],
            time: 60000,
            tipsMore: false
        });
    }
    var soureidmouseover;
    $(document).on('mouseover', '#souresOrderID', function () {             
        soureidmouseoverTips();
    });
    $(document).on('mouseleave', '#souresOrderID', function () {
        layer.close(soureidmouseover);
    });
    window.receiveArrayFromIframe = function (arr, id) {
        selectUserDataList = arr
        selectUserId = id
        let sprice = $("#price").val();
        $('#layui-layer' + indexPop).hide()
        $('#layui-layer-shade' + indexPop).hide()
        var username = arr.map(item => item.userName).join('、')
        var totalFee = arr.reduce((sum, item) => {
            return sum +Number( item.fee);
        }, 0); 
        $("#throwFee").val(totalFee);
        if (arr.length > 1) {
            //$("input[name='defAss']").prop("checked", false);
            $(".saveassbtn").hide();
            $('#throwFee').attr('disabled', 'disabled')
        } else if (arr.length == 1) {
            //只针对单人自动计算发单价
            let uid = arr[0].userId;
            currentSelectRecUserId = uid;
            for (let u = 0; u < allUserList.length; u++) {
                if (parseInt(uid) === parseInt(allUserList[u].value)) {
                    if (allUserList[u].tichen > 0) {
                        if (allUserList[u].brokerageType === 20) {
                            totalFee = ((allUserList[u].tichen / 100) * sprice).toFixed(2);
                            break;
                        }
                        else if (allUserList[u].brokerageType === 10) {
                            totalFee = allUserList[u].tichen;
                            break;
                        }
                    }
                }
            }

            $("#throwFee").val(totalFee);
            $(".saveassbtn").show();
            $('#throwFee').removeAttr('disabled')
        }
        if (id != 0) {
            $('.throwFeelayer').show()
            if (id == 999999) {
                $('.KSPD').html('内部抢单');
                $(".saveassbtn").show();

            } else {
                $('.KSPD').html(username);
            }
            throwFeeTipsLayermouseoverTips();
            $('.KSPD').addClass('KSPDC');
            $('.pushplatdiv').hide();
            $("#throwPrice").val('0');
            $("#throwInterPrice").val('0');
        } else {
            $('.throwFeelayer').hide()
            $('.KSPD').html('暂不指派');
            $('.KSPD').removeClass('KSPDC');
            if ($("#ispushplattag").val() == "Y") {
                $('.pushplatdiv').show();
            }
            $("#throwFee").val(0);
            $("input[name='defAss']").prop("checked", false);
        }
        
    };
    function soureidmouseoverTips() {
        soureidmouseover = layer.tips('如果有多笔订单号，请用逗号分隔，不要用其它符号', '#souresOrderID', {
            tips: [1, '#2F4056'],
            time: 10000,
            tipsMore: false
        });
    }   
    form.on('radio(userOrderBy)', function (data) { 
        userOrderBy = data.value; 
        $.ajax({
            type: "POST",
            url: "/UserAjax/SaveUserConfigForAssOrderByUserId",
            data: { orderBy: userOrderBy },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        getAllRecUserData(); 
    }); 
    var throwFeeTipsLayer;
    var layerGame
    $('.KSPD').on('click', function () {
        if (indexPop && layerGame == $('#gameName option:selected').text()) {
            $('#layui-layer' + indexPop).show()
            $('#layui-layer-shade' + indexPop).show()
            return false
        }
        if ($("#seachUserKey1").val() != "" && $("#seachUserKey1").val() != null) {
            $("#seachUserKey1").val('');
            getAllRecUserData();
        }
        layerGame = $('#gameName option:selected').text()
        if (assMode == 1) {
            kszpLayer = layer.open({
                type: 2,
                shade: [0.3, '#333'],
                shadeClose: true,
                area: ['85%', isPc ? '80%' : '95%'],
                title: "快速指派接手人",
                content: 'SelectRecUser?game=' + $('#gameName option:selected').text() + '&uid=' + currentSelectRecUserId,
                success: function (layero, index) {
                    indexPop = index
                },

                beforeEnd: function (layero, index, that) {
                    $('#layui-layer' + indexPop).hide()
                    $('#layui-layer-shade' + indexPop).hide()
                    return false
                }
            });
        } else {
            kszpLayer = layer.open({
                type: 1,
                shade: [0.3, '#333'],
                shadeClose: true,
                area: ['85%', isPc ? '60%' : '95%'],
                title: "快速指派接手人",
                content: $('.kszpDiv'),
                cancel: function (index, layero) {
                    $('.kszpDiv').hide();
                },
                end: function (index, layero) {
                    $('.kszpDiv').hide();
                }
            });
        }

        return false;
    })
    $(document).on('mouseover', '#throwFee', function () {
        throwFeeTipsLayermouseoverTips();
    });
    $(document).on('mouseleave', '#throwFee', function () {
        layer.close(throwFeeTipsLayer);
    });
    function throwFeeTipsLayermouseoverTips() {
        var str = ''
        if (selectUserDataList.length == 1) {
            str = '可以在此输入给该打手或发内部抢单的发单价，不输入则默认为0。<br>如果你需要按接单价的百分比作为发单价，可以直接写百分数，例如写 85% 或 90% 等'
        } else if (selectUserDataList.length > 1) {
            str = '这里是多人指派的发单总价，若需要修改请点击左边按钮，在弹窗里针对每一位接手人的发单价进行修改'
        } else {
            return false
        }
        throwFeeTipsLayer = layer.tips(  str, '#throwFee', {
            tips: [3, '#2F4056'],
            time: 9000,
            tipsMore: false
        });
    }
    var customerOrderInfoTipsLayer;
    function getCustomerOrderLog() {
        let moblie = $("#moblie").val();
        let bossName = $("#gameRole").val();
        let ww = $("#ww").val();
        if (!VerifyMoblie(moblie) && bossName == '' && ww == '') {
            return false;
        }
        $.get('/CustomerAjax/GetMemberAddOrderSimpInfo?moblie=' + moblie + '&bossName=' + bossName+'&ww='+ww, function (result) {
            if (result.code > 0) {
                customerOrderInfoTipsLayer = layer.tips(result.msg, result.getType == 2 ? '#gameRole' : result.getType == 3 ? '#ww' : '#moblie', {
                    tips: [4, result.data.blackCount > 0 ? '#E03636' : '#0DCEEF'],
                    time: 10000,
                    tipsMore: true
                });
                if (result.data.blackCount > 0) {
                    //在黑名单中
                    $(".blackListIcon").show();
                } else {
                    $(".blackListIcon").hide();
                }
            } else {
                $(".blackListIcon").hide();
            }
        });
    }
    $(document).on('change', '#moblie', function () {
        //getCustomerOrderLog();
    });
    $(document).on('mouseover', '#moblie', function () {
        //getCustomerOrderLog();
    });
    $(document).on('mouseleave', '#moblie', function () {
        layer.close(customerOrderInfoTipsLayer);
    });
    $(document).on('change', '#souresOrderID', function () {
        getTaobaoOrderInfo();
    });
    if ($("#orderID").val()) {
        $('.vipDedCheckBox').hide()
    }
    var readTaoBaoOrderCount = 0;
    var readTaoBaoPrice = 0; 
    function getTaobaoOrderInfo(svalue) {
        let orderid = $("#souresOrderID").val();
        let ww = $("#ww").val();
        let soure = formSelects.value('orderSoures', 'nameStr');
        let soureStr = soure.split('-');
        if (soureStr.length > 1) {
            soure = soureStr[1];
        }
        let soureValue = formSelects.value('orderSoures', 'valStr');
        if (svalue != "" && svalue != null) {
            soureValue = svalue;
            soure = svalue;
        }
        if (orderid.length >= 15) {
            $.get('/OrderAjax/ReadTaoBaoOrderData?tid=' + orderid + '&orderSoure=' + soureValue, function (result) {
                readTaoBaoOrderCount = result.code;
                if (result.code > 0) {
                    readTaoBaoPrice = parseFloat(result.msg);
                    $("#price").val(result.msg);
                    $("#tbPayTime").val(result.payTime);
                    if (ww == '' || ww == null || ww == undefined) {
                        $("#ww").val(result.data);
                    }
                    //$("#ww").attr("readOnly", true);
                    if (readPriceIsAllowEdit == "N") {
                        $("#price").attr("readOnly", true);
                    }
                    if (result.pdd_phone != '') {
                        $("#moblie").val(result.pdd_phone);
                    }
                    if (result.orderSoure != "" && result.orderSoure != null && result.orderSoure != soureValue) {
                        formSelects.value('orderSoures', [result.orderSoure], true);
                    }
                    if ($("#dlcontent").val()== '' || $("#dlcontent").val().length<2) {
                        if (result.remark != '' && result.remark != null) {
                            $("#dlcontent").val(result.remark);
                            disContent($("#dlcontent").val());
                        }
                    }
                } else {
                    readTaoBaoOrderCount = 0;
                    readTaoBaoPrice = 0;
                    //$("#ww").attr("readOnly", false);
                    $("#price").attr("readOnly", false);
                }
            });
        }

    }
    let priceLayerTips;
    $(document).on('mouseover', '#price', function () {
        orderPricelayerTips();
    });
    $(document).on('mouseleave', '#price', function () {
        layer.close(priceLayerTips);
    });
    function orderPricelayerTips() {
        if (readTaoBaoPrice > 0) {
            priceLayerTips = layer.tips('该价格是从天猫/淘宝读取的' + readTaoBaoOrderCount+'笔订单总价' + (readPriceIsAllowEdit != "Y" ? "，禁止修改" : ""), '#price', {
                tips: [4, '#0DCEEF'],
                time: 6000,
                tipsMore: false
            });
        } 
    } 
    form.on('checkbox(splitCheck)', function (data) {
        if (data.elem.checked) {
            isSplitOrderProject = "Y";
        }
        else {
            isSplitOrderProject = "N";
        }
        //检测代练项目栏是否有用/号分隔
        let project = $("#project").val();
        if (isSplitOrderProject == "N") { 
            formSelects.undisabled('recUser');
            return;
        }
        else {
            //有拆单则不能快速指派
            formSelects.value('recUser', []);
            formSelects.disabled('recUser');
            $('.throwFeelayer').hide();
            $("#throwFee").val(0);
        }
        if (project == null || project == undefined || project == '') {
            layer.msg('代练项目不能为空', { time: 1500 }, function () { 
            });
            $("#project").focus();
            return;
        }
    }); 
    form.on('submit(savebtn)', function (data) { 
        var orderID = data.field.orderID;
        var customerInputOrder = data.field.customerInputOrder;
        if (data.field.project == "" || data.field.project == undefined || data.field.project == null) {
            layer.msg('代练/陪玩项目不可为空');
            return false;
        }
        if (data.field.project.indexOf('陪玩') > -1 || data.field.project.indexOf('陪练') > -1) {
            data.field.orderType = 1;
        }

        if (readTaoBaoPrice > 0 && (readTaoBaoPrice != parseFloat(data.field.price))) {
            $("#price").val(readTaoBaoPrice);
        } 
        data.field.customerId = customerId
        if (data.field.customerName && data.field.orderType == 1) {
            data.field.gameRole = data.field.customerName
        }
        if (selectUserDataList.length > 0) {
            data.field.recUser = selectUserDataList.map(item => item.userId).join(',')
        } else {
            data.field.recUser = selectUserId
        }
        var strParameter = JSON.stringify(data.field);
        if (strParameter == null || strParameter == "" || strParameter == undefined) {
            layer.alert("无可提交数据！", {
                title: '提示'
            });
            return false;
        } 
        strParameter = encodeURIComponent(strParameter);
        let gameArea = formSelects.value('gameArea', 'nameStr');
        let gameServer = formSelects.value('gameServer', 'nameStr');
        if ($("#orderID").val() != null && $("#orderID").val() != '') {
            if (gameServer == "" || gameServer == null || gameServer == undefined) {
                gameServer = $("#tGameServer").val();
            }
        }
        let gameJob = formSelects.value('gameJob', 'nameStr');
        let gameGroup = formSelects.value('gameGroup', 'nameStr');
        if (gameArea == "" || gameArea == null || gameArea == undefined) {
            gameArea = "全区"; 
        }
        if (gameServer == "" || gameServer == null || gameServer == undefined) {
            gameServer = "全服"; 
        }
        if (!re)
            return false;
        re = false;
        if (selectUserDataList.length == 1) {
            selectUserDataList[0].fee = $('#throwFee').val()
        }
        $.ajax({
            type: "POST",
            url: "/OrderAjax/AddOrderAjax",
            data: { strParameter: strParameter, gameName: gameName, gameArea: gameArea, gameServer: gameServer, gameJob: gameJob, gameGroup: gameGroup, emps: JSON.stringify(selectUserDataList) },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误，请检查每一项录单格式上是否存在超长、不正确的情况'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    if (data.remark == "平台") {
                        layer.alert(data.msg, function (lx) {
                            if (orderID != "") {
                                try {
                                    parent.tools.reloadOrderData();
                                    parent.functions.func1();
                                } catch (err) { }
                                try {
                                    window.parent.reloadOrderData();
                                } catch (err) { }
                                try {
                                    execJs.closeWindow()
                                } catch (err) { }
                            }
                            else {
                                if (customerInputOrder == "Y") {
                                    window.location.href = 'ClientOrderGenerate?oid=' + data.code;
                                } else {
                                    location.reload();
                                }
                            }
                            layer.close(lx);
                        });
                    }
                    else {
                        layer.msg(data.msg, { time: 1000 }, function () {
                            if (orderID != "") {
                                try {
                                    parent.tools.reloadOrderData();
                                    parent.functions.func1();
                                } catch (err) { }
                                try {
                                    window.parent.reloadOrderData();
                                } catch (err) { }
                                try {
                                    execJs.closeWindow()
                                } catch (err) { }

                            }
                            else {
                                if (customerInputOrder == "Y") {
                                    window.location.href = 'ClientOrderGenerate?oid=' + data.code;
                                } else {
                                    location.reload();
                                }
                            }
                        });
                    }
                }
                else {
                    re = true;
                    layer.alert(data.msg, function (lx) { 
                        layer.close(lx);
                        return false;
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });   
    formSelects.on('orderSoures', function (id, vals, val, isAdd, isDisabled) {
        var payMethed = $("#payMethed").val(); 
        changeServiceFee(val.value, payMethed);
    });
    form.on('select(payMethed)', function (data) {
        let orderSoures = formSelects.value('orderSoures', 'nameStr');
        changeServiceFee(orderSoures, data.value);
    });
    function changeServiceFee(soure, selectVal) {
        var price = $("#price").val();
        var baseFee = 0.031;
        var totalFee = 0; 
        if (soure.indexOf("天猫") > -1) {
            if (selectVal == 10) {
                //花呗
                totalFee = price * (baseFee + 0.008);
            }
            else if (selectVal == 20) {
                //信用卡
                totalFee = price * (baseFee + 0.01);
            } else {
                totalFee = price * baseFee;
            }

        } else {
            if (selectVal == 10) {
                //花呗
                totalFee = price * 0.008;
            }
            else if (selectVal == 20) {
                //信用卡
                totalFee = price * 0.01;
            } else {
                totalFee = 0;
            }
        }
        $("#desServiceFee").val(totalFee.toFixed(2));
    }
    $("#price").bind('input propertychange', function () {
        if (!VerifyMoeny($("#price").val())) {
            return false;
        }
        let orderSoures = formSelects.value('orderSoures', 'nameStr');
        var payMethed = $("#payMethed").val();
        changeServiceFee(orderSoures, payMethed);
    });
    var upindex;
    function uploadFileAddOrder() {
        if (upLoadFileTag == 1) {
            uploadInst1.reload({
                 data: {
                    gameName: function () {
                        return upGameName;
                    },
                    fileSoure: function () {
                        return 10;
                    },
                    throwAction: function () {
                        return throwAction;
                    }
                }
            })
        }
        else
        {
        }
    }
    //$(document).on('click', '.up1', function () { 
    //    uploadFileAddOrder();
    //});
    var upGameName = "";
    var throwAction = 0;
    form.on('radio(importGameName)', function (data) {
        upGameName = data.value; 
    });
    form.on('radio(throwAction)', function (data) {
        throwAction = data.value;
    });
    var fileSoure = 60;
    form.on('radio(fileSoure)', function (data) {
        fileSoure = data.value;
        if (data.value == 10) {
            $(".throwaction").hide();
            $(".ctips").html('因从魔游客导出的EXECL会出现乱码，所以需要先把魔游客订单里的内容复制出来，新建一个EXECL文档，把复制的内容原样粘贴到新建的EXECL文档里，保存好，最后再把新建的这个EXECL文件导入进来');
        } else if (data.value == 20) {
            $(".throwaction").hide();
            $(".ctips").html('<a style="color:#1E9FFF" href="https://oss4.jidanpu.com/file/%E5%AF%BC%E5%85%A5%E8%AE%A2%E5%8D%95_%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%A5%BD%E7%9A%84%E8%AE%A2%E5%8D%95%E5%86%85%E5%AE%B9%E5%8F%82%E8%80%83%E6%A0%BC%E5%BC%8F1.xlsx" target="_blank" title="点击下载参考格式">请点击这里下载参考导入模板1</a>');
        } else if (data.value == 30) {
            $(".throwaction").show();
            $(".ctips").html('<a style="color:#1E9FFF" href="https://oss4.jidanpu.com/file/%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF3.xlsx" target="_blank" title="点击下载参考格式">请点击这里下载参考导入模板2</a>');
        } else if (data.value == 50) {
            $(".throwaction").hide();
            $(".ctips").html('<a style="color:#1E9FFF" href="https://oss4.jidanpu.com/file/%E8%B4%A6%E5%8F%B7----%E5%AF%86%E7%A0%81----%E6%9C%8D%E5%8A%A1%E5%99%A8----%E9%A1%B9%E7%9B%AE.txt" target="_blank" title="点击下载参考格式">请点击这里下载参考导入模板，鼠标右键选择：将链接另存为</a>');
        } else if (data.value == 60) {
            $(".throwaction").hide();
            $(".ctips").html('<a style="color:#1E9FFF" href="https://oss4.jidanpu.com/file/%E9%B8%A1%E8%9B%8B%E9%93%BATXT%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF%E6%A0%BC%E5%BC%8F.txt" target="_blank" title="点击下载参考格式">请点击这里下载参考导入格式，鼠标右键选择：将链接另存为</a>');
        } else if (data.value == 70) {
            $(".throwaction").hide();
            $(".ctips").html('<span style="color:#1E9FFF">从本系统里导出默认的EXECL格式，可以直接导入进来</a>');
        } else if (data.value == 80) {
            $(".throwaction").hide();
            $(".ctips").html('<a style="color:#1E9FFF" href="https://oss4.jidanpu.com/file/%E5%AF%BC%E5%85%A5%E4%BB%A3%E7%BB%83%E9%80%9A%E7%9A%84%E6%A0%BC%E5%BC%8F.xls" target="_blank" title="点击下载参考格式">点击这里下载模板格式</a>');
        }
    })
    $(document).on('click', '.disbtn', function () {
        disContent($("#dlcontent").val());
        return false;
    }); 
    formSelects.on('orderSoures', function (id, vals, val, isAdd, isDisabled) {
        getTaobaoOrderInfo(val.value);
        return true;
    });
    form.on('select(orderSoures2)', function (data) {
        orderSoure2 = data.value;
    });
    $(".pushpriceinput").change(function () {
        var pushprice = $("#throwPrice").val();
        if (pushprice > 0) {
            $(".interpushdiv").hide();
            $(".savebtnclass").html("保存订单并发到平台");
        }
        else {
            $(".interpushdiv").show();
            $(".savebtnclass").html("提交保存");
        }
        
        return false;
    })
    var tempData = [];
    function loadtemplate() {
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetPushJdp_TemplateList",
            data: { gameName: gameName },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                $("#pushplatformtemplte").empty();
                $("#pushplatformtemplte").prepend("<option value='0'>快速发单配置的要求</option>");
                tempData = data.data;
                var defInputValue = '';
                for (let i = 0; i < tempData.length; i++) {
                    if (tempData[i].isdef == "Y") {
                        defInputValue = tempData[i].content;
                    }
                    var option = '<option value="' + tempData[i].tid + '" data-platform="' + tempData[i].platformType + '"><span lay-tips="' + tempData[i].content + '">' + tempData[i].title + '</span></option>';
                    $("#pushplatformtemplte").append(option);
                }
                form.render('select');
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    }
    $(document).on('click', '.seachBtn', function () {
        getAllRecUserData();
        return false;
    });
    $(document).on('click', '.resetSeachBtn', function () {
        $("#seachUserKey1").val('');
        getAllRecUserData();
        return false;
    });
    var orderTypeData = [];

    function getOrderTypeList(gameId,defName) { 
        orderTypeData = [];
        $.get('/GameAjax/GetAllOrderTypeList?gameId=' + gameId + '&defOrderType=' + defName, function (result) {
            orderTypeData = result.data;
            if (result.count > 0) {
                $(".orderTypeArea").show();
                $(".orderTypeDiv").html("");
                var html = "";
                $.each(orderTypeData, function (index, item) {
                    let ck = item.selected == "selected" ? 'checked=""' : '';
                    html += '<input type="radio" lay-filter="projectType"  name="projectType"   title="' + item.TypeName + '" value="' + item.TypeName + '" ' + ck + '/>';
                });
                $(".orderTypeDiv").append(html);
                form.render('radio');
            }
            else {
                $(".orderTypeArea").hide();
            }
           
        });
    }
    form.on('radio(projectType)', function (data) {
        var elem = data.elem; 
        var value = elem.value; 
        const targetItem = orderTypeData.find(item => item.TypeName === value);
        var projectVal = $('#project').val();
        targetItem.AppendTitleByFront = targetItem.AppendTitleByFront == null ? "" : targetItem.AppendTitleByFront;
        targetItem.AppendTitleByEnd = targetItem.AppendTitleByEnd == null ? "" : targetItem.AppendTitleByEnd;
        if (projectVal) {
            var newProjectVal = targetItem.AppendTitleByFront + projectVal + targetItem.AppendTitleByEnd
            $('#project').val(newProjectVal)
        }
    });



    $("#throwPrice").change(function () {
        delayDivShow();
        return false;
    })
    $("#throwInterPrice").change(function () {
        delayDivShow();
        return false;
    })
    $("#price").change(function () {
        var price = $("#price").val(); 
        if (parseInt(currentSelectRecUserId) > 0) { 
            //重计算发单比率 
            let recFee = 0;
            for (let u = 0; u < allUserList.length; u++) {
                if (parseInt(currentSelectRecUserId) > 0) {
                    if (parseInt(currentSelectRecUserId) === parseInt(allUserList[u].value)) {
                        if (allUserList[u].tichen > 0) {
                            if (allUserList[u].brokerageType === 20) {
                                recFee = ((allUserList[u].tichen / 100) * price).toFixed(2);
                            }
                            else if (allUserList[u].brokerageType === 10) {
                                recFee = allUserList[u].tichen;
                            }
                        }
                    }
                }
            } 
            if (recFee>0) {
                $("#throwFee").val(recFee);
            }
        } 
        if (isVipDedAmount=='Y') {
            if (parseFloat(price) > 0) {
                if (memberBalance < 1) {
                    $(this).prop('checked', false);
                    form.render();
                    isVipDedAmount = "N";
                    layer.msg('老板余额小于1元，不能从预存扣款', { time: 2500 });
                    return false;
                }
                if ((memberBalance - parseFloat(price)) < 0) { 
                    layer.msg('注意，该老板预存余额不足，录单后会产生欠费，请注意追款', { time: 2000 });
                }
            }
        }
        return false;
    })   
    function delayDivShow() {
        let pushPlatmPrice = $("#throwPrice").val();
        let throwInterPrice = $("#throwInterPrice").val();
        if (parseFloat(pushPlatmPrice) > 0 && parseFloat(throwInterPrice)) {
            $(".delayDiv").show();
        }
        else {
            $(".delayDiv").hide();
        }
        return false;
    } 
    form.on('checkbox(vipDedCheck)', function (data) {
        if (data.elem.checked) {
            let pfee = $("#price").val();
            var orderID = $("#orderID").val();
            if (orderID != '') {
                $(this).prop('checked', false);
                form.render();
                isVipDedAmount = "N";
                return false;
            }
            if (memberBalance < 1) {
                $(this).prop('checked', false);
                form.render();
                isVipDedAmount = "N";
                layer.msg('老板余额小于1元，不能从预存扣款', { time: 2500 });
                return false;
            }
            if ((memberBalance - parseFloat(pfee)) < 0) {
                isVipDedAmount = "Y";
                layer.msg('注意，该老板预存余额不足，录单后会产生欠费，请注意追款', { time: 2000 });
                return false;
            }
        }
        else {
            isVipDedAmount = "N";
        } 

    });
    $('#moblie').on('blur', function (data) {
        var val = $('#moblie').val();
        if (!VerifyMoblie(val)) {
            return false;
        }
        //GetMemberBalance();
        getCustomerOrderLog();
    })
    $('#gameRole').on('blur', function (data) {
        var val = $('#gameRole').val();
        if (val == '' || isorderType!=1) {
            return false;
        }
        //GetMemberBalance();
        getCustomerOrderLog();
    })
    $('#ww').on('blur', function (data) {
        var val = $('#ww').val();
        if (val=='') {
            return false;
        }
        //GetMemberBalance();
    })
    function GetMemberBalance() {
        let memberDedSwitch = $("#memberDedSwitch").val();
        if (memberDedSwitch != "Y") {
            return false;
        }
        var orderID = $("#orderID").val();
        if (orderID != '') {
            return false;
        }
        let moblie = $("#moblie").val();
        let bossName = $("#gameRole").val();
        let ww = $("#ww").val();
        if (!VerifyMoblie(moblie) && bossName == '' && ww == '') {
            return false;
        }
        if (ww != '') {
            ww = encodeURIComponent(ww);
        }
        if (bossName != '') {
            bossName = encodeURIComponent(bossName);
        }
        $.ajax({
            type: "GET",
            url: "/CustomerAjax/GetMemberBalance?moblie=" + moblie + "&bossName=" + bossName + "&ww=" + ww,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                memberBalance = data.data;
                $(".viplabel").html('从会员余额扣款(可用余额' + memberBalance + '元)');
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    
});