var i18n = layui.i18n;
var laytpl = layui.laytpl;
var i18nVersion = localStorage.getItem('i18nVersion')
var i18nData = {
    locale: localStorage.getItem('layui-i18n-local-test') || 'zh-CN', // 当前语言环
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
                gameName: '游戏权限',
                jobRole: '选择职位',
                status: '有效状态',
                status1: '全部',
                status2: '有效',
                status3: '禁用',
                bussType: '业务类型',
                bussType2: '代练',
                bussType3: '陪玩',
                userType: '成员类型',
                userType2: '内部成员',
                userType3: '合作用户',
                isCert: '是否实名',
                isCert1: '未实名',
                isCert2: '已实名',
                isDisSett: '禁止结算',
                isDisSett1: '未禁止',
                isDisSett2: '已禁止',
                key: '搜索1',
                keyplaceholder: '账号/姓名/电话/QQ微信',
                key2: '搜索2',
                key2placeholder: '收款支付宝账号/姓名',
                key3: '搜索3',
                key3placeholder: '备注/标记',
                seachBtn: '搜索',
                switch1: '正常|禁用',
                switch2: '是|否',
                toolbarDemotips1: '新开一个系统子账户',
                toolbarDemotips2: '刷新当前数据',
                toolbarDemotips3: '勾选单个或多个子账号，批量更改他们的有效状态，如果当前是有效的，则将其禁用，反之启用',
                toolbarDemotips4: '可以批量发起签入职电子合同。要求提前将勾选的用户填好姓名、身份证号、联系电话才可以',
                toolbarDemotips5: '批量或单个设置其标记',
                toolbarDemotips6: '批量或单个设置其游戏权限',
                toolbarDemotips7: '批量或单个设置业务类型',
                toolbarDemotips8: '批量或单个设置指定用户在内部接单页面最大接单数',
                toolbarDemotips9: '批量或单个设置指定用户在内部抢单大厅里接单时所能接的价格范围',
                toolbarDemotips10: '批量或单个设置禁止查看订单密码',
                toolbarDemotips11: '批量或单个设置允许查看订单密码',
                toolbarDemotips12: '批量或单个设置指定用户无法查看客户电话，必须使用中转号联系客户',
                toolbarDemotips13: '批量或单个设置指定用户允许直接查看客户电话',
                toolbarDemotips14: '批量或单个设置指定用户在指派接手人时的排列顺序，数值越大越在前面，默认0',
                toolbarDemotips15: '批量或单个设置指定用户的禁止结算状态，如果此人当前是禁止结算状态，则会解除禁止，反之会禁止',
                toolbarDemotips16: '重新计算统计指定或全部用户的订单完单率',
                toolbarDemotips17: '查看所有游戏下每个子账号的接单情况',
                toolbarDemotips18: '检测重复收款支付宝账号的用户或其它功能，点击此按钮会出现二级菜单',
                toolbarDemotips19: '勾选一个子账号，将其加入系统用户黑名单里，在黑名单里的将无法给TA开子账号',
                toolbarDemotips20: '删除指定用户，慎用',
                toolbarDemo1: '新增系统子账户',
                toolbarDemo2: '刷新列表',
                toolbarDemo3: '禁用/启用',
                toolbarDemo4: '发起/更改签约',
                toolbarDemo5: '设置标记',
                toolbarDemo6: '设置游戏权限',
                toolbarDemo7: '设置业务类型',
                toolbarDemo8: '设自助接单数',
                toolbarDemo9: '设抢单价范围',
                toolbarDemo10: '禁止看订单密码',
                toolbarDemo11: '允许看订单密码',
                toolbarDemo12: '禁止看订单电话',
                toolbarDemo13: '允许看订单电话',
                toolbarDemo14: '设置排序',
                toolbarDemo15: '禁/解结算',
                toolbarDemo16: '统计完单率',
                toolbarDemo17: '接单统计',
                toolbarDemo18: '检测功能',
                toolbarDemo19: '加入黑名单',
                toolbarDemo20: '删除用户',
                submitEdittitle: '编辑用户资料',
                submitEdit: '编辑',
                submitRestPwdtitle: '重置该用户的登录密码为123456',
                submitRestPwd: '重置',
                price_min: '接单价范围',
                setRecPriceSaveBtn: '保存',
                selbussType: '选择业务类型：',
                selbussType1: '代练+陪玩',
                selbussType2: '专做代练',
                selbussType3: '专做陪玩',
                settypes: '保存',
                selectGameTotal: '游戏权限',
                rsDate: '接单开始日',
                reDate: '接单结束日',
                toolbarDemo2tips: '刷新当前数据',
                toolbarDemo2tips: '勾选子账号，将其禁用，禁用的子账号将无法登录系统',
                toolbarDemo2tips: '删除指定用户，慎用，一旦删除，找不回来',
                toolbarDemo21: '刷新列表',
                toolbarDemo22: '禁用子账号',
                toolbarDemo23: '删除用户',
                toolbarDemo2Span: '这里已排除了禁用的子账号，只统计有效状态为正常的子账号。注意，数据有2分钟缓存，禁用账号、删除子账号均会有缓存',
                toolbarDemo3Span: '这里包含了系统所有状态下的子账号',

            },
            js: {
                loginAcc: '登录账号',
                loginAcctitle: '点击可以进入用户详情',
                userName: '账号昵称',
                rnameCertification: '已通过人脸识别实名认证',
                userTypeSpantips1: '合作用户',
                userTypeSpantips2: '内部成员',
                userTypeSpan1: '外',
                userTypeSpan2: '内',
                userTypeSpanTips: ',点击可以进入用户详情',
                userTypeSpanTit: '该用户为2级用户',
                rname: '姓名',
                bussTypetips: '业务类型',
                bussType: '业类',
                bussType1: '代陪',
                bussType2: '陪玩',
                signStatus: '签约',
                signStatustips1: '还未签约协议',
                signStatustips2: '已签约协议',
                jobName: '角色职位',
                insureAmount: '保证金',
                recOrderMaxCount: '接单上限',
                complateRate: '完单率',
                complateRatetitle: '订单完成率(只计算待验收+已完成的)',
                recPriceMinValue: '接单价限制',
                qq: 'QQ/微信',
                qqtitle: '点击可以快速与该用户QQ对话',
                moblie: '电话',
                remark: '备注说明',
                statips: '绿色代表这个用户可以正常登录本系统，灰色代表禁用状态，这个人就无法登录本系统，即时在登录状态只要刷新也会立即退出',
                sta: '有效状态',
                isExcuseLoginVertips: '激活成绿色后，这个人在登录本系统时将永远不会出现登录验证码，即时系统发现登录有风险时也不会出现。强烈建议保持为灰色就行，若激活成绿色，会降低安全性',
                isExcuseLoginVer: '登录免验证',
                isAutoSetttips: '激活成绿色后，当该打手的订单状态改成已完成时，系统将按绩效账单里的生效金额给他执行自动打款(要求这个打手的子账号资料里填写了收款支付宝账号)',
                isAutoSett: '自动结算',
                isProhibitSettStatustips: '如果你临时不想给TA结算，可以开启此开关，此人在冻结期间的所有账单都将无法结算，其它功能不受影响',
                isProhibitSettStatus: '禁止结算',
                isNeedPrivatePhonetips: '激活成绿色后，该用户查看订单时，将无法看到玩家真实联系电话。如果系统启用了虚拟电话功能，可以通过订单详情页面上点击提取虚拟电话按钮，能有效避免客户电话泄漏',
                isNeedPrivatePhone: '隐藏订单电话',
                prohibitedViewOrderPwdtips: '激活成绿色后，这个人查看订单详情、导出订单、复制订单时将无法看到订单密码，但账号可以看',
                prohibitedViewOrderPwd: '禁看密码',
                isProhibitPublicRecOrdertips: '激活成绿色代表这个人在内部抢单页面无法接单，如果你想让这个人不能在内部抢单页面接单，就激活成绿色',
                isProhibitPublicRecOrder: '禁自助接单',
                forbidViewOrderContenttips: '激活成绿色代表不让这个人看订单详情里的订单内容区域',
                forbidViewOrderContent: '禁看内容区',
                mark: '标记',
                wu: '无',
                marktitle1: '标记：',
                marktitle2: '，点击可以编辑',
                games: '游戏权限',
                gamestitle1: '拥有游戏权限：',
                gamestitle2: '，点击可以重新选择',
                lastLoginTime: '最后登录',
                orderBy: '排序值',
                orderBytitle: '在指派界面按排序值排列时，数值越大越排前面，点击可以编辑',
                createUserName: '开户人',
                toolbar: '操作',
                datatotal1: '本系统内共有',
                datatotal2: '个系统子账户，其中有',
                datatotal3: '个系统子账户状态正常，',
                datatotal4: '个系统子账户被禁用，总计已登记保证金',
                yuan: '元',
                error: '系统繁忙！',
                UpUserSta1: '该子账户已被禁用，该用户将无法进入系统',
                UpUserSta2: '该子账户已启用，该用户可以正常进入系统',
                tableList_user: '请勾选要操作的数据行',
                typebox: '修改业务类型',
                recPricebox: '批量设置内部抢单价格范围限制',
                addToBlackBtn: '请勾选一个子账号',
                recTotalDiv: '接单统计',
                checkDropdown: '检测重复收款支付宝账号者',
                checkAliPayAccDiv: '重复收款支付宝子账号检测',
                submitRestPwd: '确定将该用户的登录密码重置为123456吗？',
                tableList_value: '金额填写错误',
                tableList_title: '提示',
                GroupDetails: '排团详情',
                settypes: '请选择业务类型',
                setRecPriceSaveBtn1: '请输入最小接单价，不能小于0',
                setRecPriceSaveBtn2: '请输入最大接单价，不能大于99999',
                setRecPriceSaveBtn3: '最小接单价格式不正确，必须是0到99999之间的整数',
                setRecPriceSaveBtn4: '最大接单价格式不正确，必须是0到99999之间的整数',
                setRecPriceSaveBtn5: '最小接单价必须大于或等于0',
                setRecPriceSaveBtn6: '最大接单价必须小于或等于99999',
                setUserTagtitle: '设置用户标记，不需要请填写：无',
                setUserTagmsg: '编辑的内容与原先一样，无需提交',
                setUserGames: '设定游戏权限',
                changeBalacePosttitle: '设置可用余额，不需要请填写：0',
                changeBalacePostmsg1: '编辑的内容与原先一样，无需提交',
                changeBalacePostmsg2: '请输入正整数',
                changeSetSta: '更改排团状态',
                delUserconfirm1: '确认要删除吗？ <br/> <br/> 警告：一旦删除，将彻底无法恢复，强烈建议不要删除，只需要将此用户的有效状态改为禁用即可，请三思再操作！ <br/>',
                delUserconfirm2: '第二次确认:  <br/> <br/> 是不是真的要删除？删除就永远无法恢复了 <br/>',
                addUserToBlack: '确认要将其加入到系统用户黑名单里吗？',
                exportdropdowntitle1: '发起签约',
                exportdropdowntitle2: '更改签约状态',
                IDX: '请选择要操作的记录！',
                addUserLayerIndex: '批量发起签约',
                successStr: '是否对以下人员发起签约',
                numArr: '以下人员信息不全(姓名/身份证号/手机号缺失)或已签约过',
                qySettingBtn: '确认发起签约',
                dataStr: '选择合同模板',
                qySettingBtnmsg: '您勾选的人员信息不全，无法发起签约，请先完善这些人员的姓名、身份证号、手机号等资料。',
                contractTemplate: '选择的合同模板不能为空',
                addUserLayerIndextitle: '批量更改签约状态',
                qquserStatus: '签约状态',
                qquserStatus1: '选择签约状态',
                qquserStatus2: '未签约',
                qquserStatus3: '已签约',
                qyBoxTitle: '是否对以下人员发起签约',
                ggSettingBtn: '确认更改',
                qquserStatusmsg: '请选择需要更改的签约状态',
                addEditUsertitle1: '编辑',
                addEditUsertitle2: '新开',
                addEditUsertitle3: '系统子账户',
                saveSettbtnalert1: '请选择一种状态！',
                saveSettbtnalert2: '提示',
                changeUserOrderBy: '设置指派接手人时的排序值，值越大越在前，默认0',
                changeUserOrderBymsg: '请输入正整数',
                setSelfRecOrderCounttitle: '设置用户在内部接单页面接单上限（以用户当前未完成订单数为准），0代表不限制',
                setSelfRecOrderCountmsg: '请输入正整数',
                tableidx: '排名',
                tableuserName: '姓名/名称',
                tableorderCount: '接单量',
                tablenoSettAmount: '还未结算',
                tablecomplateRate: '完单率',
                tablecomplateRatetitle: '订单完成率(只计算待验收+已完成的)',
                tablecreateUserDate: '开通日期',
                tablelastRecOrderDate: '最近接单',
                str1: '子账号名称',
                str2: '支付宝账号',
                str3: '职位',
                id2: '重复数量',
                id2tips1: '此收款支付宝账号存在',
                id2tips2: '个，该子账号是其中一个',
                str4: '当前状态',
                str4badge1: '正常',
                str4badge2: '禁用',
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
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'dropdown'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var dropdown = layui.dropdown;
    var table = layui.table;
    var devices = layui.device();
    var isPc = true;
    var curids = '';
    var settypeLayer = null;
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    var seachParam = '';
    var indexLoad;
    var re = true;
    var gameName = $("#gameName").find("option:selected").text();
    var gameNameTotal = '';
    var page = 1;
    var page2 = 1;
    var curtable = [];
    var curtable2 = [];
    var tableList2;
    var tableList3;
    var rankLayer;
    laydate.render({
        elem: '#rsDate'
        , type: 'date'
        , done: function (value, date, endDate) {
            rsDate = value;
            getRecOrderTotal();
        }
    });
    laydate.render({
        elem: '#reDate'
        , type: 'date'
        , done: function (value, date, endDate) {
            reDate = value;
            getRecOrderTotal();
        }
    });
    var rsDate = $("#rsDate").val();
    var reDate = $("#reDate").val();
    $(document).keydown(function (event) {
        if (event.keyCode == 13) {
            page = 1;
            reloadOrderList();
        }
    });
    getAllRoleData();
    function getAllRoleData() {
        $.get('/SystemAjax/GetAllRoleList', function (result) {
            formSelects.data('jobRole', 'local', {
                arr: result.data
            });
        });
    }
    var tableList = table.render({
        elem: '#tableList_user'
        , url: '/UserAjax/GetUserList?' + seachParam
        , defaultToolbar: []
        , toolbar: '#toolbarDemo'
        , defaultToolbar: ['filter']
        , cols: [function () {
            var arr = [
                { type: 'checkbox', fixed: 'left', width: 30 }
                , {
                    field: 'loginAcc', title: '登录账号', minwidth: 90, maxWidth: 110, fixed: 'left', unresize: false, sort: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0);" class="viewUser" style="color:' + (res.sta == 'Y' ? '#1E9FFF' : '#FF534D') + '" title="点击可以进入用户详情" data-id="' + res.uid + '">' + res.loginAcc + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'userName', title: '账号昵称', minwidth: 110, maxWidth: 110, unresize: false, templet: function (res) {
                        let cert = '';
                        if (res.rnameCertification == 'Y') {
                            cert = '<i class="layui-icon layui-icon-vercode" style="margin-right:2px;color:#9ACD32" title="已通过人脸识别实名认证"></i>';
                        }
                        let userTypeSpan = '';
                        if (res.userType == 1) {
                            userTypeSpan = '<span class="layui-badge layui-bg-green" lay-tips="合作用户">外</span>';
                        } else {
                            userTypeSpan = '<span class="layui-badge layui-bg-blue" lay-tips="内部成员">内</span>';
                        }
                        let vo = cert + '<a href="javascript:void(0);" class="viewUser" style="color:' + (res.sta == 'Y' ? '#1E9FFF' : '#FF534D') + '" lay-tips="' + (res.userType == 1 ? '外部成员' : '内部成员') + ',点击可以进入用户详情" data-id="' + res.uid + '">' + (res.recommend != '0' ? '<span class="layui-badge" title="该用户为2级用户">2</span>' : '') + res.userName + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'rname', title: '姓名', width: 90, unresize: false, sort: false, hide: true
                }
                , {
                    field: 'bussType', title: '<span lay-tips="业务类型">业类</span>', width: 50, align: 'center', unresize: false, templet: function (res) {
                        let span = '';
                        if (res.bussType == 0) {
                            span = '<span class="layui-badge layui-bg-blue">代陪</span>';
                        } else if (res.bussType == 2) {
                            span = '<span class="layui-badge layui-bg-orange">陪玩</span>';
                        } else if (res.bussType == 1) {
                            span = '<span class="layui-badge layui-bg-green">代练</span>';
                        }
                        return span;
                    }
                }, {
                    field: 'signStatus', title: '签约', hide: true, width: 40, unresize: false, align: 'center', templet: function (res) {
                        let vo = '';
                        if (res.signStatus == 0) {
                            vo = `<i class="layui-icon layui-icon-close-fill" lay-tips="还未签约协议" style="color:#aaa;font-size: 26px;"></i> `
                        } else if (res.signStatus == 1) {
                            vo = `<i class="layui-icon layui-icon-ok-circle" lay-tips="已签约协议" style="color:#16BAAA;font-size: 26px;"></i> `
                        }
                        return vo;
                    }
                }
                , {
                    field: 'jobName', title: '角色职位', width: 83, unresize: false, templet: function (res) {
                        let vo = '<span class="lableb" style="background-color: #9ACD32;" title="' + res.jobName + '">' + res.jobName + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'insureAmount', title: '保证金', width: 50, unresize: false, align: 'center', edit: true, templet: function (res) {
                        let vo = '<span class="prmisemount" style="color: red;" >' + res.insureAmount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'recOrderMaxCount', title: '接单上限', width: 60, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.recOrderMaxCount + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'complateRate', title: '完单率', width: 65, sort: true, hide: true, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span title="订单完成率(只计算待验收+已完成的)">' + res.complateRate + '%</span>';
                        return vo;
                    }
                }
                , {
                    field: 'recPriceMinValue', title: '接单价限制', width: 80, hide: true, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.recPriceMinValue + '-' + res.recPriceMaxValue + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'qq', title: 'QQ/微信', width: 90, unresize: false, templet: function (res) {
                        let vo = '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=' + res.qq + '&site=qq&menu=yes" title="点击可以快速与该用户QQ对话">' + res.qq + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'moblie', title: '电话', width: 90, align: 'left', unresize: false, templet: function (res) {
                        let vo = '<span>' + res.moblie + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'remark', title: '备注说明', unresize: false, minwidth: 120, templet: function (res) {
                        let vo = '<span>' + res.remark + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'sta', title: '<span lay-tips="绿色代表这个用户可以正常登录本系统，灰色代表禁用状态，这个人就无法登录本系统，即时在登录状态只要刷新也会立即退出">有效状态</span>', width: 75, align: 'center', unresize: false, templet: '#switchTpl1'
                }
                , {
                    field: 'isExcuseLoginVer', title: '<span lay-tips="激活成绿色后，这个人在登录本系统时将永远不会出现登录验证码，即时系统发现登录有风险时也不会出现。强烈建议保持为灰色就行，若激活成绿色，会降低安全性">登录免验证</span>', width: 80, align: 'center', unresize: false, templet: '#switchTpl2'
                }
                // , {
                //     field: 'isAutoSett', title: '<span style="color:#FF5722" lay-tips="激活成绿色后，当该打手的订单状态改成已完成时，系统将按绩效账单里的生效金额给他执行自动打款(要求这个打手的子账号资料里填写了收款支付宝账号)">自动结算</span>', width: 70, align: 'center', unresize: false, templet: '#switchTpl3'
                // }
                , {
                    field: 'isProhibitSettStatus', title: '<span lay-tips="如果你临时不想给TA结算，可以开启此开关，此人在冻结期间的所有账单都将无法结算，其它功能不受影响">禁止结算</span>', width: 40, align: 'center', unresize: false, templet: '#switchTpl8'
                }
                , {
                    field: 'isNeedPrivatePhone', title: '<span lay-tips="激活成绿色后，该用户查看订单时，将无法看到玩家真实联系电话。如果系统启用了虚拟电话功能，可以通过订单详情页面上点击提取虚拟电话按钮，能有效避免客户电话泄漏">隐藏订单电话</span>', width: 85, align: 'center', unresize: false, templet: '#switchTpl4'
                }
                , {
                    field: 'prohibitedViewOrderPwd', title: '<span lay-tips="激活成绿色后，这个人查看订单详情、导出订单、复制订单时将无法看到订单密码，但账号可以看">禁看密码</span>', width: 70, align: 'center', unresize: false, templet: '#switchTpl5'
                }
                , {
                    field: 'isProhibitPublicRecOrder', title: '<span lay-tips="激活成绿色代表这个人在内部抢单页面无法接单，如果你想让这个人不能在内部抢单页面接单，就激活成绿色">禁自助接单</span>', width: 80, align: 'center', unresize: false, templet: '#switchTpl6'
                }
                , {
                    field: 'forbidViewOrderContent', title: '<span lay-tips="激活成绿色代表不让这个人看订单详情里的订单内容区域">禁看内容区</span>', width: 80, align: 'center', unresize: false, templet: '#switchTpl7'
                }
                , {
                    field: 'mark', title: '标记', minwidth: 82, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="tags" style="color:#FF5722" data-id="' + res.uid + '" data-tag="' + res.mark + '" title="标记：' + res.mark + '，点击可以编辑">' + (res.mark == '' ? '无' : res.mark) + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'games', title: '游戏权限', minwidth: 95, unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="games" style="" data-id="' + res.uid + '" title="拥有游戏权限：' + res.games + '，点击可以重新选择">' + res.games + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'lastLoginTime', title: '最后登录', width: 90, hide: true, align: 'center', unresize: false, sort: true
                }
                , {
                    field: 'orderBy', title: '排序值', width: 50, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<a href="javascript:void(0)" class="editOrderBy" data-id="' + res.uid + '" data-orderby="' + res.orderBy + '" title="在指派界面按排序值排列时，数值越大越排前面，点击可以编辑">' + res.orderBy + '</a>';
                        return vo;
                    }
                }
                , {
                    field: 'createUserName', title: '开户人', width: 75, align: 'center', hide: true, unresize: false
                }
                , { fixed: '', title: '操作', width: 88, toolbar: '#baroperating', unresize: false, }
            ];
            // 初始化筛选状态
            var local = layui.data('tableList_user');
            layui.each(arr, function (index, item) {
                if (item.field in local) {
                    item.hide = local[item.field];
                }
            });
            return arr;
        }()
        ]
        , page: true
        , limit: 20
        , limits: [10, 20, 30, 40, 50, 100]
        , done: function (res, curr, count) {
            // 记录筛选状态
            var that = this;
            curtable = res.data;
            page = curr;
            var total = '本系统内共有' + res.count + '个系统子账户，其中有' + (res.count - res.disableCount) + '个系统子账户状态正常，' + res.disableCount
                + '个系统子账户被禁用，总计已登记保证金' + res.totalInsureAmount + '元';
            $("#total").html(total);
            that.elem.next().on('mousedown', 'input[lay-filter="LAY_TABLE_TOOL_COLS"]+', function () {
                var input = $(this).prev()[0];
                layui.data('tableList_user', {
                    key: input.name
                    , value: input.checked
                })
            });
        }
    });
    form.on('switch(staChecked)', function (obj) {
        //console.log(obj)
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/UpUserSta",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.tips(sta == false ? '该子账户已被禁用，该用户将无法进入系统' : '该子账户已启用，该用户可以正常进入系统', obj.othis);
                }
                else {
                    layer.msg(data.msg, { time: 2000 }, function () {
                    })
                }
                re = true;
                reloadOrderList();
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(loginVerChecked)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/UpUserVerSta",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(isAutoSettChecked)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/ChangeUserIsAutoSett",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code < 1) {
                    layer.alert(data.msg, function (res) {
                        layer.close(res);
                        reloadOrderList();
                    })
                } else {
                    layer.msg(data.msg, { time: 1500 }, function () {

                    })
                }

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(privatePhoneChecked)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SetUserPrivatePhone",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(prohibitedViewOrderPwdChecked)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SetUserProhibitedViewOrderPwd",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(isProhibitPublicRecOrder)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SetIsProhibitPublicRecOrder",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(forbidViewOrderContent)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/SetForbidViewOrderContent",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1000 }, function () {
                })
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false;
    });
    form.on('switch(disSettStatus)', function (obj) {
        var sta = obj.elem.checked;
        var uid = this.value;
        setUserDisSettSta(uid, false);
        return false;
    });
    table.on('toolbar(tableList_user)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh':
                reloadOrderList();
                break;
            case 'addUserBtn':
                addEditUser(0);
                break;
            case 'disBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                modityUserSta(uid, 0);
                break;
            case 'setTagBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setUserTag(uid, '');
                break;
            case 'setGamesBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setUserGames(uid);
                break;
            case 'setTypeBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                curids = tempData.join(',');

                settypeLayer = layer.open({
                    title: "修改业务类型",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '700px' : '80%', '300px'],
                    content: $(".typebox"),
                    end: function (res) {
                        $('.typebox').hide();
                    }
                });
                //settypes(uid);
                break;
            case 'setSelfRecOrderCountBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setSelfRecOrderCount(uid);
                break;
            case 'setSelfRecOrderPriceBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                curids = tempData.join(',');
                settypeLayer = layer.open({
                    title: "批量设置内部抢单价格范围限制",
                    shade: [0.3, '#333'],
                    shadeClose: true,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 5,
                    area: [isPc ? '410px' : '85%', '230px'],
                    content: $(".recPricebox"),
                    end: function (res) {
                        $('.recPricebox').hide();
                    }
                });
                break;
            case 'setDontLookOrderPwdBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setProhibitedViewOrderPwd(uid, 'Y');
                break;
            case 'setDontLookOrderPwd2Btn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setProhibitedViewOrderPwd(uid, 'N');
                break;
            case 'setDontLookOrderPhoneBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setDontLookOrderPhoneBtn(uid, 'Y');
                break;
            case 'setDontLookOrderPhone2Btn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setDontLookOrderPhoneBtn(uid, 'N');
                break;
            case 'delUserBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                delUser(uid, 0);
                break;
            case 'setOrderByBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                changeUserOrderBy(uid, 0);
                break;

            case 'setDisSettBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                setUserDisSettSta(uid, true);
                break;
            case 'addToBlackBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选一个子账号');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                addUserToBlack(uid);
                break;
            case 'viewRecTotal':
                rankLayer = layer.open({
                    title: "接单统计",
                    shade: [0.3, '#333'],
                    shadeClose: isPc ? true : false,
                    type: 1,
                    skin: 'layui-layer-lan',
                    anim: 8,
                    closeBtn: isPc ? 0 : 1,
                    maxmin: isPc ? false : true,
                    area: [isPc ? '38%' : '95%', isPc ? '90%' : '95%'],
                    content: $(".recTotalDiv"),
                    cancel: function (index, layero) {
                        $('.recTotalDiv').hide();
                    },
                    end: function (index, layero) {
                        $('.recTotalDiv').hide();
                    }
                });
                if (!isPc) {
                    layer.full(rankLayer);
                }
                getRecOrderTotal();
                break;
            case 'checkDropdown':
                dropdown.render({
                    elem: '#checkDropdown', // 触发事件的 DOM 对象
                    show: true, // 外部事件触发即显示 
                    data: [{
                        title: '检测重复收款支付宝账号者',
                        id: 10
                    }],
                    shade: [0.3, '#2f363c'],
                    click: function (menudata) {
                        if (menudata.id == 10) {
                            rankLayer = layer.open({
                                title: "重复收款支付宝子账号检测",
                                shade: [0.3, '#333'],
                                shadeClose: isPc ? true : false,
                                type: 1,
                                skin: 'layui-layer-lan',
                                anim: 8,
                                closeBtn: isPc ? 0 : 1,
                                maxmin: isPc ? false : true,
                                area: [isPc ? '38%' : '95%', isPc ? '90%' : '95%'],
                                content: $(".checkAliPayAccDiv"),
                                cancel: function (index, layero) {
                                    $('.checkAliPayAccDiv').hide();
                                },
                                end: function (index, layero) {
                                    $('.checkAliPayAccDiv').hide();
                                }
                            });
                            if (!isPc) {
                                layer.full(rankLayer);
                            }
                            getCheckIdenticalAliPayAcc();
                        }
                    }
                });
                break;
            case 'recComplateRate':
                var data = checkStatus.data;
                var tempData = [];
                if (parseInt(checkStatus.data.length) > 0) {
                    for (let i = 0; i < data.length; i++) {
                        tempData.push(data[i].uid);
                    };
                }
                var uid = tempData.length > 0 ? tempData.join(',') : '';
                getRecComplateRate(uid);
                break;
            case 'groupOrInvitation':
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].jdpUid);
                };
                var uid = tempData.join(',');
                groupOrInvitation(uid);
                break;
        };
    });
    table.on('tool(tableList_user)', function (obj) {
        var data = obj.data;
        if (obj.event === 'submitEdit') {
            var uid = obj.data.uid;
            addEditUser(uid);
            return false;
        }
        else if (obj.event === 'submitRestPwd') {
            layer.confirm('确定将该用户的登录密码重置为123456吗？', function (index) {
                var uid = obj.data.uid;
                resetPwd(uid);
                layer.close(index);
            });
            return false;
        }
    });
    table.on('edit(tableList_user)', function (obj) {
        var oldtr = obj.tr;
        var oldtext = $(oldtr).find("td[data-field='" + obj.field + "'] .prmisemount").text();
        if (!VerifyMoeny(obj.value)) {
            //tableList.reload({
            //    data: curtable
            //});
            layer.alert('金额填写错误', {
                icon: 0,
                title: "提示"
            });
            return false;
        }
        $.ajax({
            type: "POST",
            url: "/UserAjax/ChangeUserEnsureAmount",
            data: { uid: obj.data.uid, value: obj.value },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.close(settypeLayer);
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
                else {
                    //tableList.reload({
                    //    data: curtable
                    //});
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
    form.on('submit(seachBtn)', function (data) {
        page = 1;
        reloadOrderList();
        return false;
    });
    function reloadOrderList() {
        var tempGame = $("#gameName").find("option:selected").text();
        gameName = tempGame;
        var jobRole = formSelects.value('jobRole', 'valStr');
        var status = $("#status").val();
        var userType = formSelects.value('userType', 'valStr');
        var isCert = $("#isCert").val();
        var key = $("#key").val();
        var key2 = $("#key2").val();
        var key3 = $("#key3").val();
        var bussType = formSelects.value('bussType', 'valStr');
        var isDisSett = $("#isDisSett").val();
        seachParam = 'game=' + gameName + '&userRole=' + jobRole + '&sta=' + status + '&userType=' + userType + '&key=' + key + '&bussType=' + bussType + '&isCert=' + isCert + '&isDisSett=' + isDisSett + '&key2=' + key2 + '&key3=' + key3 ;
        tableList.reload({
            url: '/UserAjax/GetUserList?' + seachParam
            , where: {
            }
            , page: {
                curr: page
            }
        });
        return false;
    }
    $(document).on('click', '.viewTask', function () {
        var ids = $(this).attr('data-id');
        viewTaskDetails(ids);
    });
    var certLayer 
    function groupOrInvitation(uid) {
        var arr = []
        if (uid) {
            arr = uid.split(',')
        }
        certLayer = layer.open({
            title: '组建群聊',
            shade: [0.3, '#333'],
            shadeClose: false,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 1,
            area: [isPc ? '625px' : '95%', isPc ? '400px' : '95%'],
            content: `
            <form class="layui-form" action="" lay-filter="fm1" style="padding:10px 10px;">
                <span style="color:#ff6a00">注意：成员需绑定平台个人账号才能被拉取。若操作后群聊中缺少某位成员，请检查：1.对方是否已绑定平台个人账号；2.对方账号是否被禁止；3.若无以上问题，请等待系统延迟同步。</span>
                 <div class="layui-form-pane" style="margin-top:10px;margin-bottom:10px;margin-left:10px">
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>已选成员数量</label>
                         <div class="layui-input-inline" style="line-height:38px;margin-left:10px;font-size:14px;color:red">
                            ${arr.length}位
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>成员选择方式</label>
                         <div class="layui-input-inline" style="width: calc(100% - 157px);">
                            <span lay-tips="将勾选的全部成员拉进群聊">
                              <input type="radio" name="fm1radio1" value="1" lay-filter="fm1radio1" title="按照勾选方式" ${arr.length > 0 ?'checked':'disabled'}  >
                            </span>
                            <span lay-tips="将搜索结果的全部成员拉进群聊。本次勾选的成员不生效">
                              <input type="radio" name="fm1radio1" value="2" lay-filter="fm1radio1" title="按照搜索筛选方式" ${arr.length > 0 ? '' : 'checked'}> 
                            </span>
                        </div>
                     </div>
                     <div class="layui-form-item">
                         <label class="layui-form-label" style='width:130px'>组群方式</label>
                         <div class="layui-input-inline" style="width: calc(100% - 157px);">
                              <input type="radio" name="fm1radio2" value="1" lay-filter="fm1radio2" title="创建群聊" checked>
                              <input type="radio" name="fm1radio2" value="2" lay-filter="fm1radio2" title="邀请入群" > 
                        </div>
                     </div>
                      <div class="layui-form-item GroupNameBox">
                         <label class="layui-form-label fm1lable" style='width:130px'><span class="layui-font-red">*</span>群聊名称</label>
                         <div class="layui-input-inline" style="width: calc(100% - 157px);">
                            <input lay-verify="required" type="text" name="GroupName" id="GroupName"   autocomplete="off" class="layui-input layui-input-shadow" value="">
                        </div>
                     </div>
                      <div class="layui-form-item GroupIdBox" style="display:none">
                         <label class="layui-form-label fm1lable" style='width:130px'><span class="layui-font-red">*</span>群ID</label>
                         <div class="layui-input-inline" style="width: calc(100% - 157px);">
                                <select class="GroupId" name="GroupId" id="GroupId">
                                </select>
                        </div>
                     </div>


                  <div class="layui-form-item layui-layout-admin" style="margin-top:20px">
                      <div class="layui-input-block" style="margin-top:10px">
                          <button class="layui-btn  layui-btn-normal" lay-submit="saveBtnPop" lay-filter="saveBtnPop" style="margin-left: 147px;">确定</button>
                      </div>
                      </div>
                 </div>
            </form>
            `,
            success: function () {
                form.render()
                $.ajax({
                    type: "get",
                    url: "/SystemAjax/GetSystemGroupList?page=1&limit=100&&groupType=-1",
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                    success: function (data) {
                        re = true;
                        var str = '<option value="">请选择</option>'
                        console.log(data.data)
                        data.data.forEach(item => {
                            str += `<option value="${item.GroupId}">${item.GroupName}</option>`
                        })
                        $('.GroupId').html(str)
                        form.render()
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
                form.on('radio(fm1radio2)', function (data) {
                    var elem = data.elem; 
                    var value = elem.value; 
                    if (value == 1) {
                        $('.GroupNameBox').show()
                        $('.GroupIdBox').hide()
                        $('#GroupName').attr('lay-verify', 'required')
                        $('#GroupId').removeAttr('lay-verify')
                        form.val('fm1', { GroupId :''})
                        
                    } else {
                        $('.GroupIdBox').show()
                        $('.GroupNameBox').hide()
                        $('#GroupId').attr('lay-verify', 'required')
                        $('#GroupName').removeAttr('lay-verify');
                        form.val('fm1', { GroupName: '' })

                    }
                });
                form.on('submit(saveBtnPop)', function (data) {
                    var field = data.field;
                    var model = {}
                    if (field.fm1radio1 == 1) {
                        model.Users = arr
                        saveBtnPopFun(model, field)
                    } else if (field.fm1radio1 == 2) {
                        var tempGame = $("#gameName").find("option:selected").text();
                        gameName = tempGame;
                        var jobRole = formSelects.value('jobRole', 'valStr');
                        var status = formSelects.value('status', 'valStr');
                        var userType = formSelects.value('userType', 'valStr');
                        var isCert = $("#isCert").val();
                        var key = $("#key").val();
                        var key2 = $("#key2").val();
                        var bussType = formSelects.value('bussType', 'valStr');
                        var isDisSett = $("#isDisSett").val();
                        seachParam = 'game=' + gameName + '&userRole=' + jobRole + '&sta=' + status + '&userType=' + userType + '&key=' + key + '&bussType=' + bussType + '&isCert=' + isCert + '&isDisSett=' + isDisSett + '&key2=' + key2 ;
                        $.ajax({
                            type: "get",
                            url: "/UserAjax/GetJdpUidList?" + seachParam,
                            dataType: 'json',
                            cache: false,
                            timeout: 60000,
                            error: function (xhr) { re = true; layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) { }); },
                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1); },
                            success: function (datares) {
                                re = true;
                                if (datares.code > 0) {
                                    model.Users = datares.data
                                    saveBtnPopFun(model, field)
                                } 
                            },
                            complete: function (XMLHttpRequest) {
                                layer.close(indexLoad);
                            }
                        });
                    }
                    return false
                });
            }

        });

    }
    function saveBtnPopFun(model, field) {
        console.log(model, field)
        if (field.fm1radio2 == 1) {
            model.GroupName = field.GroupName
        } else if (field.fm1radio2 == 2) {
            model.GroupId = field.GroupId
        }
        $.ajax({
            type: "post",
            url: "/UserAjax/CreateGroupOrInvitation",
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
                    layer.msg(data.msg)
                    layer.close(certLayer)

                } else {
                    layer.msg(data.msg)
                }
                return false
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
        return false
        
    }
    function viewTaskDetails(taskid) {
        layer.open({
            title: taskid + "排团详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '90%'],
            content: 'GroupDetails?taskID=' + taskid
        });
    }
    $('.settypes').on('click', function () {
        var val = $("input[name=selbussType]:checked").val();
        if (val == '' || val == 'undefined') {
            layer.msg('请选择业务类型');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAJax/ChangeUserBussType",
            data: { uid: curids, value: val },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.close(settypeLayer);
                    layer.msg(data.msg, { time: 1000 }, function () {
                        reloadOrderList();
                    });

                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
    $('.setRecPriceSaveBtn').on('click', function () {
        var price_min = $("#price_min").val();
        var price_max = $("#price_max").val();
        if (price_min == null || price_min == '') {
            layer.msg('请输入最小接单价，不能小于0');
            return false;
        }
        if (price_max == null || price_max == '') {
            layer.msg('请输入最大接单价，不能大于99999');
            return false;
        }
        if (!VerifyMoeny(price_min)) {
            layer.msg('最小接单价格式不正确，必须是0到99999之间的整数');
            return false;
        }
        if (!VerifyMoeny(price_max)) {
            layer.msg('最大接单价格式不正确，必须是0到99999之间的整数');
            return false;
        }
        if (price_min < 0) {
            layer.msg('最小接单价必须大于或等于0');
            return false;
        }
        if (price_max > 99999) {
            layer.msg('最大接单价必须小于或等于99999');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAJax/ChangeUserRecOrderPrice",
            data: { uid: curids, min: price_min, max: price_max },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.close(settypeLayer);
                    layer.msg(data.msg, { time: 1000 }, function () {
                        reloadOrderList();
                    });

                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    })
    function delTask(id) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/DelPveTask",
            data: { taskId: id },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    $(document).on('click', '.setdlsta', function () {
        var ids = $(this).attr('data-id');
        changeSetSta(ids);
    });
    $(document).on('click', '.tags', function () {
        var ids = $(this).attr('data-id');
        var tag = $(this).attr('data-tag');
        setUserTag(ids, tag);
    });
    function setUserTag(ids, tag) {
        layer.prompt({ title: '设置用户标记，不需要请填写：无', formType: 0, value: tag, maxlength: 100 }, function (value, index, elem) {
            if (tag == value) {
                layer.msg('编辑的内容与原先一样，无需提交');
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/EditUserMark",
                data: { uid: ids, tag: value },
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
    $(document).on('click', '.games', function () {
        var ids = $(this).attr('data-id');
        setUserGames(ids);
    });
    function setUserGames(ids) {
        layer.open({
            title: "设定游戏权限",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '30%'],
            content: '/User/SetGames?id=' + ids
        });
        return false;
    }
    $(document).on('click', '.changeBalance', function () {
        var ids = $(this).attr('data-id');
        var balance = $(this).attr('data-balance');
        changeBalacePost(ids, balance);
    });
    function changeBalacePost(ids, balance) {
        layer.prompt({ title: '设置可用余额，不需要请填写：0', formType: 0, value: balance, maxlength: 6 }, function (value, index, elem) {
            if (balance == value) {
                layer.msg('编辑的内容与原先一样，无需提交');
                return false;
            }
            if (!VerifyInt(value)) {
                layer.msg('请输入正整数');
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/ChangeUserBalance",
                data: { uid: ids, amount: value },
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
    var selectTaskId = 0;
    var settLayerIndex;
    function changeSetSta(ID) {
        selectTaskId = ID;
        settLayerIndex = layer.open({
            title: "更改排团状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['40%', '25%'],
            content: $(".setStaDiv"),
            cancel: function (index, layero) {
                $('.setStaDiv').hide();
            },
            end: function (index, layero) {
                $('.setStaDiv').hide();
            }
        });
    }
    function delUser(ids, refresh) {
        layer.confirm('确认要删除吗？ <br/> <br/> 警告：一旦删除，将彻底无法恢复，强烈建议不要删除，只需要将此用户的有效状态改为禁用即可，请三思再操作！ <br/>', function (indexs) {
            layer.close(indexs);
            layer.confirm('第二次确认:  <br/> <br/> 是不是真的要删除？删除就永远无法恢复了 <br/>', function (index) {

                confirmDelUser(ids, index, refresh);
            });
            /*confirmDelUser(ids, index);*/
        });
        return false;
    }
    function addUserToBlack(ids) {
        layer.confirm('确认要将其加入到系统用户黑名单里吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/AddModiftySystemUserBackList",
                data: { uid: ids },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    layer.alert(data.msg, function (zindex) {
                        layer.close(zindex);
                        reloadOrderList();
                    });
                    re = true;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
        return false;
    }
    function confirmDelUser(ids, index, refresh) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/DelUser",
            data: { uid: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
                        if (refresh == 2) {
                            reloadOrderList2();
                        } else {
                            reloadOrderList();
                        }
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
    var addUserLayerIndex;
    form.on('submit(exportBtn)', function (data) {
        console.log(1111)
        dropdown.render({
            elem: '#exportdropdown', // 触发事件的 DOM 对象
            show: true, // 外部事件触发即显示 
            data: [{
                title: '发起签约',
                id: 10
            }, {
                title: '更改签约状态',
                id: 20
            }],
            click: function (menudata) {
                console.log(222)

                dropdown.close('exportdropdown')
                var seltable = table.checkStatus('tableList_user').data;
                var IDX = [];
                var NAMEX = [];
                seltable.forEach(function (item, index) {
                    IDX.push(item.uid);
                    NAMEX.push(item.userName);
                });
                if (IDX == undefined || IDX == null || IDX.join(',') == "") {
                    layer.msg('请选择要操作的记录！', { time: 800 });
                    return false;
                }
                IDX = IDX.join(',');
                NAMEX = NAMEX.join('，');
                if (!re)
                    return false;
                re = false;
                if (menudata.id == 10) {
                    $.ajax({
                        type: "get",
                        url: "/api/SignContract/CheckContract",
                        data: { ids: IDX },
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
                            if (data.code > 0) {
                                const errorStr = data.data.error.map(user => user.userName).join('，');
                                const successStr = data.data.success.map(user => user.userName).join('，');
                                const numArr = data.data.success.map(user => user.id);
                                addUserLayerIndex = layer.open({
                                    title: "批量发起签约",
                                    shade: [0.3, '#333'],
                                    shadeClose: false,
                                    type: 1,
                                    skin: 'layui-layer-lan',
                                    anim: 5,
                                    area: [isPc ? '660px' : '90%', '380px'],
                                    content: `
                                    <form class="layui-form" action="" lay-filter="popfm" style="padding:20px;">
                                         <div class="layui-form-item">
                                            <label class="layui-form-label "><span class="layui-font-red">*</span>合同模板</label>
                                            <div  class="layui-input-inline" style="width:calc(100% - 130px)">
                                                <select id="contractTemplate" name="pushType" >

                                                </select>
                                            </div>

                                        </div>
                                        <div class="qyBoxTitle">是否对以下人员发起签约</div>
                                        <div class="qyBoxCont">${successStr}</div>
                                        <div class="qyBoxTitle" style="color:red">${!numArr.length ?`以下人员信息不全(姓名/身份证号/手机号缺失)或已签约过`:``}</div>
                                        <div class="qyBoxCont">${errorStr}</div>
                                        <div style="text-align:center;align-items:center">
                                            <div  class="layui-btn  layui-btn-normal layui-btn-lg qySettingBtn"  >确认发起签约</div>
                                        </div>
                                    </form>
                                    `,
                                    success: function () {
                                        $.ajax({
                                            type: "get",
                                            url: "/api/SignContract/GetContractTemplateList",
                                            dataType: 'json',
                                            cache: false,
                                            timeout: 60000,
                                            error: function () {
                                                layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                                                });
                                            },
                                            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                                            success: function (dataList) {
                                                var dataStr = ''
                                                if (dataList.data.length > 1) {
                                                    dataStr += `<option  value="" >选择合同模板</option>`
                                                }
                                                dataList.data.forEach(item => {
                                                    dataStr += `<option  value="${item.templateNo}" >${item.templateTitle}</option>`
                                                })
                                                $('#contractTemplate').html(dataStr)
                                                form.render()

                                                re = true;
                                                $('.qySettingBtn').on('click', function () {
                                                    if (!numArr.length) {
                                                        layer.msg('您勾选的人员信息不全，无法发起签约，请先完善这些人员的姓名、身份证号、手机号等资料。', { time: 2000 }, function () {
                                                            layer.close(addUserLayerIndex);
                                                        })
                                                        return false
                                                    }
                                                    if (!$('#contractTemplate').val()) {
                                                        layer.msg('选择的合同模板不能为空', { time: 2000 }, function () { })
                                                        return false
                                                    }
                                                    $.ajax({
                                                        type: "Post",
                                                        url: "/api/SignContract/BatchCreateContract/" + $('#contractTemplate').val(),
                                                        data: JSON.stringify(numArr),
                                                        contentType: 'application/json',
                                                        dataType: 'json',
                                                        cache: false,
                                                        timeout: 60000,
                                                        error: function () {
                                                            layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                                                            });
                                                        },
                                                        beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                                                        success: function (data) {
                                                            layer.msg(data.msg, { time: 1500 }, function () {
                                                                layer.close(addUserLayerIndex);
                                                                reloadOrderList();

                                                            })
                                                            re = true;
                                                        },
                                                        complete: function (XMLHttpRequest) {
                                                            layer.close(indexLoad);
                                                        }
                                                    });
                                                })
                                            },
                                            complete: function (XMLHttpRequest) {
                                                layer.close(indexLoad);
                                            }
                                        });

                                    }   });
                            }

                        },
                        complete: function (XMLHttpRequest) {
                            re = true;
                            layer.close(indexLoad);
                        }
                    });

                    return false;
                }
                else {
                    addUserLayerIndex = layer.open({
                        title: "批量更改签约状态",
                        shade: [0.3, '#333'],
                        shadeClose: false,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 5,
                        area: [isPc ? '660px' : '90%', '330px'],
                        content: `
                                    <div style="padding:20px;">
                                    <form class="layui-form" action="" style="margin-bottom:30px">
                                    <div class="layui-form-pane">
                                         <div class="layui-inline">
                                            <label class="layui-form-label">签约状态</label>
                                            <div class="layui-input-inline" style="width: 180px">
                                                <select id="qquserStatus" name="qquserStatus">
                                                    <option value="">选择签约状态</option>
                                                    <option value="0">未签约</option>
                                                    <option value="1">已签约</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                        <div class="qyBoxTitle">是否对以下人员发起签约</div>
                                        <div class="qyBoxCont">${NAMEX}</div>
                                        <div style="text-align:center;align-items:center">
                                            <div  class="layui-btn  layui-btn-normal layui-btn-lg ggSettingBtn"  >确认更改</div>
                                        </div>
                                    </div>
                                    `,
                        success: function () {
                            form.render()
                            $('.ggSettingBtn').on('click', function () {
                                console.log($('#qquserStatus').val())
                                if ($('#qquserStatus').val() === '') {
                                    layer.msg('请选择需要更改的签约状态')
                                    return false
                                }
                                var model = {
                                    status: $('#qquserStatus').val(),
                                    idList: IDX.split(',')
                                }
                                $.ajax({
                                    type: "Post",
                                    url: "/api/SignContract/SetSignStatus",
                                    data: JSON.stringify(model),
                                    contentType: 'application/json',
                                    dataType: 'json',
                                    cache: false,
                                    timeout: 60000,
                                    error: function () {
                                        layer.msg(xhr.responseJSON.msg, { time: 2000 }, function (res) {
                                        });
                                    },
                                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                                    success: function (data) {
                                        layer.msg(data.msg, { time: 1500 }, function () {
                                            layer.close(addUserLayerIndex);
                                            reloadOrderList();

                                        })
                                        re = true;
                                    },
                                    complete: function (XMLHttpRequest) {
                                        layer.close(indexLoad);
                                    }
                                });
                            })
                        }
                    });
                }
            }
        });
        return false;
    });
    function addEditUser(id) {
        addUserLayerIndex = layer.open({
            title: (id > 0 ? "编辑" : "新开") + "系统子账户",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '90%'],
            content: '/User/AddUser?uid=' + id
        });
    }
    function resetPwd(uid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/RefChangePwd",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) {
                re = true;
                layer.close(indexLoad);
            }
        });
        return false;
    }
    form.on('submit(saveSettbtn)', function (data) {
        var sta = data.field.sta;
        if (sta == null || sta == "" || sta == undefined) {
            layer.alert("请选择一种状态！", {
                title: '提示'
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/PveTaskAjax/UpPveTaskSta",
            data: { taskId: selectTaskId, sta: sta },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(settLayerIndex);
                        reloadOrderList();
                    });
                }
                else {
                    re = true;
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    function setProhibitedViewOrderPwd(uid, sta) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/ChangeProhibitedViewOrderPwd",
            data: { uid: uid, sta: sta },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    function setDontLookOrderPhoneBtn(uid, sta) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/ChangeProhibitedViewOrderPhone",
            data: { uid: uid, sta: sta },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    $(document).on('click', '.editOrderBy', function () {
        var ids = $(this).attr('data-id');
        var orderby = $(this).attr('data-orderby');
        changeUserOrderBy(ids, orderby);
    });
    function changeUserOrderBy(ids, orderby) {
        layer.prompt({ title: '设置指派接手人时的排序值，值越大越在前，默认0', formType: 0, value: orderby, maxlength: 4 }, function (value, index, elem) {
            if (orderby == value) {
                layer.close(index);
                return false;
            }
            if (!VerifyInt(value)) {
                layer.msg('请输入正整数');
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/ChangeUserOrderBy",
                data: { uid: ids, by: value },
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
    function setSelfRecOrderCount(ids) {
        layer.prompt({ title: '设置用户在内部接单页面接单上限（以用户当前未完成订单数为准），0代表不限制', formType: 0, value: 0, maxlength: 4 }, function (value, index, elem) {
            if (!VerifyInt(value)) {
                layer.msg('请输入正整数');
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/UserAjax/SetUserSelfRecOrderMaxCount",
                data: { uid: ids, count: value },
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
    function setUserDisSettSta(uid, isRefresh) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/UpUserDisSettSta",
            data: { uid: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1300 }, function () {
                        if (isRefresh) {
                            reloadOrderList();
                        }
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    function getRecOrderTotal() {
        tableList2 = table.render({
            elem: '#tableList2'
            , url: '/UserAjax/GetRecOrderTotalList?stime=' + rsDate + '&etime=' + reDate
            , defaultToolbar: []
            , toolbar: '#toolbarDemo2'
            , defaultToolbar: ['filter', 'exports']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 }
                , {
                    field: 'idx', title: '排名', width: 55, align: 'center', sort: true, unresize: false
                }
                , {
                    field: 'userName', title: '姓名/名称', unresize: false
                }
                , {
                    field: 'orderCount', title: '接单量', width: 140, align: 'center', sort: true, unresize: false
                }
                , {
                    field: 'noSettAmount', title: '还未结算', width: 120, align: 'center', sort: true, unresize: false
                }
                , {
                    field: 'complateRate', title: '完单率', width: 70, sort: true, align: 'center', unresize: false, templet: function (res) {
                        let vo = '<span title="订单完成率(只计算待验收+已完成的)">' + res.complateRate + '%</span>';
                        return vo;
                    }
                }
                , {
                    field: 'createUserDate', title: '开通日期', width: 120, align: 'center', sort: true, unresize: false
                }
                , {
                    field: 'lastRecOrderDate', title: '最近接单', width: 120, align: 'center', sort: true, unresize: false
                }
            ]]
            , page: true
            , limit: 100
            , limits: [20,30,50,100,500,1000, 2000]
            , done: function (res, curr, count) {
                curtable2 = res.data;
                page2 = curr;
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
            }
        });
        return false;
    }
    function reloadOrderList2() {
        tableList2.reload({
            url: '/UserAjax/GetRecOrderTotalList?stime=' + rsDate + '&etime=' + reDate + '&gameName=' + gameNameTotal
            , where: {
            }
            , page: {
                curr: page2
            }
        });
        return false;
    }
    form.on('select(selectGameTotal)', function (data) {
        var elem = data.elem;
        var value = data.value;
        gameNameTotal = value;
        reloadOrderList2();
    });
    table.on('toolbar(tableList2)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh2':
                reloadOrderList2();
                break;
            case 'disBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                modityUserSta(uid, 2);
                break;
            case 'delUserBtn2':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].uid);
                };
                var uid = tempData.join(',');
                delUser(uid, 2);
                break;
        };
    });
    function modityUserSta(uidx, refreshList) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/UpUserStaBatch",
            data: { uid: uidx },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1500 }, function () { })
                }
                else {
                    layer.msg(data.msg, { time: 3000 }, function () {
                    })
                }
                re = true;
                if (refreshList == 0) {
                    reloadOrderList();
                } else {
                    reloadOrderList2();
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getCheckIdenticalAliPayAcc() {
        tableList3 = table.render({
            elem: '#tableList3'
            , url: '/UserAjax/GetCheckIdenticalAliPayAcc'
            , defaultToolbar: []
            , toolbar: '#toolbarDemo3'
            , defaultToolbar: ['filter']
            , cols: [[
                { type: 'checkbox', fixed: 'left', width: 30 }
                , {
                    field: 'str1', title: '子账号名称', width: 110, unresize: false
                }
                , {
                    field: 'str2', title: '支付宝账号', width: 170, align: 'left', unresize: false
                }
                , {
                    field: 'str3', title: '职位', width: 85, align: 'center', unresize: false
                }
                , {
                    field: 'id2', title: '重复数量', width: 85, align: 'center', sort: true, unresize: false, templet: function (res) {
                        let vo = '<span lay-tips="此收款支付宝账号存在' + res.id2 + '个，该子账号是其中一个">' + res.id2 + '</span>';
                        return vo;
                    }
                }
                , {
                    field: 'str4', title: '当前状态', width: 85, align: 'center', sort: true, unresize: false, templet: function (res) {
                        let vo = res.str4 == 'true' ? '<span class="layui-badge layui-bg-blue">正常</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>';
                        return vo;
                    }
                }
            ]]
            , page: false
            , done: function (res, curr, count) {
                if (res.msg == "请先登录") {
                    layer.msg("登录过期了，请重新登录系统");
                    return;
                }
            }
        });
        return false;
    }
    function reloadOrderList3() {
        tableList3.reload({
            url: '/UserAjax/GetCheckIdenticalAliPayAcc'
            , where: {
            }
            , page: false
        });
        return false;
    }

    function getRecComplateRate(uid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "POST",
            url: "/UserAjax/TotalAllUserOrderComplateRat",
            data: { user: uid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('出现错误'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (lx) {
                    layer.close(lx);
                    reloadOrderList();
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    table.on('toolbar(tableList3)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'refresh2':
                reloadOrderList3();
                break;
            case 'disBtn':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var uid = tempData.join(',');
                modityUserSta(uid, 2);
                break;
            case 'delUserBtn2':
                if (parseInt(checkStatus.data.length) < 1) {
                    layer.msg('请勾选要操作的数据行');
                    return false;
                }
                var data = checkStatus.data;
                var tempData = [];
                for (let i = 0; i < data.length; i++) {
                    tempData.push(data[i].id);
                };
                var uid = tempData.join(',');
                delUser(uid, 2);
                break;
        };
    });
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll(); //关闭现有所有弹层
            reloadOrderList();
        }
    };
    window.tools = _tools;
});