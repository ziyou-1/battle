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
                gameName: '游戏筛选',
                gameServer: '服务器/平台',
                gameServertips: '可以直接输入要搜索的服务器名称，如果是搜索平台，可以输入例如苹果QQ',
                gameServerplaceholder: '大区/服务器/平台',
                gameServerlabel: '职业',
                gameJob: '选择职业',
                gameServerlabel: '阵营',
                gameGroup: '阵营门派',
                dateType1: '录单时间',
                dateType2: '开始时间',
                dateType3: '完成时间',
                dateType4: '收款时间',
                dateType5: '退款时间',
                showPriceType1: '接单价格',
                showPriceType2: '发单价格',
                showPriceType3: '退款金额',
                showPriceType4: '接发组合',
                showPriceType5: '搜亏本单',
                orderSoures: '订单来源',
                orderSta: '订单状态',
                orderSta1: '全部',
                orderSta2: '以下几个只能单选',
                orderSta3: '抢单中',
                orderSta4: '已超时',
                orderSta5: '已超时(未完成)',
                orderSta6: '以下几个可多选',
                orderSta7: '待完善',
                orderSta8: '未分配',
                orderSta9: '待上号',
                orderSta10: '代练中',
                orderSta11: '撤销中',
                orderSta12: '撤销中(交易单)',
                orderSta13: '已撤销',
                orderSta14: '已撤销(交易单)',
                orderSta15: '仲裁中',
                orderSta16: '仲裁中(交易单)',
                orderSta17: '已仲裁',
                orderSta18: '已仲裁(交易单)',
                orderSta19: '待验收',
                orderSta20: '已完成',
                orderSta21: '异常中',
                orderSta22: '问题单',
                orderSta23: '已暂停',
                orderSta24: '已退单',
                recType1: '代练打手',
                recType2: '发单人',
                projectTypeDiv: '项目分类',
                projectType: '选择或输入',
                projectSelect: '代练项目',
                projectSelectoption: '选择或输入后再选择',
                orderTypeDiv: '订单类型',
                bussType1: '全部',
                bussType2: '代练订单',
                bussType3: '陪玩订单',
                kefuType1: '销售客服',
                kefuType2: '录单人',
                kefuType3: '记录退款者',
                inputOrderKefu: '选择或输入',
                task: '排团团号',
                taskSelect1: '未参团的',
                taskSelect2: '已参过团',
                setStalabel: '收款状态',
                setSta1: '未收款',
                setSta2: '结算中',
                setSta3: '已结款',
                operatorlabel: '派单人',
                operator: '选择或输入',
                selectSeach1: '搜索1',
                selectSeach2: '批量搜单号',
                key1: '系统订单号/角色名/电话',
                key1title: '可以输入系统单号、淘宝单号、角色名、电话',
                key2label: '搜索2',
                key2: '项目/标题/微信/旺旺',
                key2title: '可以输入代练项目关键词、微信号、QQ、买家旺旺/YY等',
                key4label: '平台单号',
                key4placeholder: '机位/备注',
                key4title: '可以输入机位、备注关键词，或者选择前面搜索订单标签等',
                keytidlabel: '平台单号',
                keytidplaceholder: '交易平台订单号',
                keytidtitle: '可以输入交易平台订单号',
                gameAcclabel: '游戏账号',
                gameAccplaceholder: '可输入游戏账号搜索',
                gameAcctitle: '可以输入完整的游戏账号搜索',
                orderLabellabel: '订单标签',
                orderLabeltitle: '可以到系统维护->订单标签维护中管理',
                orderLabel1: '全部',
                orderLabel2: '无标签',
                qainput: '搜QA资料',
                qainputplaceholder: '可输入QA词条关键词',
                isJiajiChecktitle: '加急单',
                isJiajiChecktips: '勾选后将筛选出加急的订单',
                viewLeakOrdertitle: '未安排',
                viewLeakOrdertips: '勾选后将筛选出状态为未分配或者没有指派过打手陪玩的单子',
                seachBtnOk: '搜索',
                refreshtips: '刷新当前数据',
                refresh: '刷新',
                setRecMantips: '批量或单笔将订单指派给接手人',
                setRecMan: '指派打手',
                changeStaBtntips: '批量或单笔更改订单状态',
                changeStaBtn: '改状态',
                changetypesBtntips: '批量或单笔更改订单类型',
                changetypesBtn: '改类型',
                setOrderThrowHomeBtntips: '将指定订单放到内部接单大厅里让接手人自由领取',
                setOrderThrowHomeBtn: '发内部',
                copyToNewOrderBtntips: '批量或单笔将订单复制成新的订单',
                copyToNewOrderBtn: '复制',
                refundOrderBtntips: '批量或单笔记录要退款的单子，可以用来记录订单退红包、退差价部分',
                refundOrderBtn: '记退款',
                insideOrderPushGroupMsgBtntips: '选择一些发到内部抢单大厅或交易平台的单子，点击后会自动复制订单信息用来发到Q群或V群里通知抢单(仅对待抢单状态或正在发平台的订单有效)',
                insideOrderPushGroupMsgBtn: '发群聊',
                exportBtntips: '批量或单笔导出订单',
                exportBtn: '导出',
                setOrderLabelBtntips: '批量或单笔设置订单标签',
                setOrderLabelBtn: '打标签',
                setJiWeitips: '批量或单笔设定订单的所在机位或机器',
                setJiWei: '设机位',
                setOrderToTaskBtntips: '将指定订单加入到排团里',
                setOrderToTaskBtn: '加入团',
                cleanOrderBtTaskBtntips: '将指定订单从当前排团里解除',
                cleanOrderBtTaskBtn: '解排团',
                assOrderToTaskMangerBtntips: '将订单指定一个团长，该团长就可以在管理订单列表里看到属于自己的订单了',
                assOrderToTaskMangerBtn: '指定团长',
                setOrderTipsBtntips: '批量或单笔打订单标记或删除标记（不是标签）',
                setOrderTipsBtn: '设标记',
                setOrderJiajiBtntips: '将指定订单设置加急标记或清除加急标记',
                setOrderJiajiBtn: '加急',
                changeOrderPriceBtntips: '将指定订单批量更改接单价',
                changeOrderPriceBtn: '改接单价',
                changeOrderThrowPriceBtntips: '将指定订单批量更改发单价',
                changeOrderThrowPriceBtn: '改发单价',
                asyncHomeOrderPriceBtntips: '可批量同步上家发过来的订单价格',
                asyncHomeOrderPriceBtn: '同步接单价',
                sendSmsBtntips: '给指定订单的客户发送手机短信',
                sendSmsBtn: '发送短信',
                setOrderJSBtntips: '更改指定订单的收款的状态标记',
                setOrderJSBtn: '收款状态',
                setOrderSoureIdBtntips: '批量更改指定订单的来源订单号',
                setOrderSoureIdBtn: '改单号',
                setOrderProjectBtntips: '批量更改指定订单的代练项目',
                setOrderProjectBtn: '改项目',
                setOrderRemarkBtntips: '批量更改指定订单的重要备注',
                setOrderRemarkBtn: '备注',
                builderSellEmpOrderBtntips: '重新计算你勾选的订单客服销售提成绩效账单。如果该订单的客服销售绩效账单缺失或需要更新，可以点击此按钮重新计算生成',
                builderSellEmpOrderBtn: '重算客服提成',
                delOrderBtntips: '将指定订单删除（谨慎操作）',
                delOrderBtn: '删除',
                total: '本次搜索统计共0笔，预计总发单价0.00元(不含接单提成)，总接单价0.00元，预计差额0.00元。其中：未分配0笔，待上号0笔，代练中0笔，待验收0笔，已完成0笔，已暂停0笔，问题单0笔，已退单0笔',
                selectTotal: '点击可查看本次查询所有的职业统计',
                zyTotal: '(查看职业统计)',
                setDiv: '请注意：这里的结算是指和发单方（上家）结算，若需要与接手人（下家）结算，请到财务运营->绩效管理里进行清算',
                jsst1: '未结算',
                jsst1Tit: '未收款',
                jsst2: '结算中',
                jsst2Tit: '收款中',
                jsst3: '已结算',
                jsst3Tit: '已收款',
                saveSettbtn: '保存',
                setprice: '发单价模式',
                pushPriceMode1: '发单价',
                pushPriceMode1: '按接单价的百分比设定',
                setpricelabel: '设定发单价',
                setprice: '输入发单价',
                setorderid: '用户最低缴纳保证金',
                setbprice: '输入用户最低缴纳保证金,写0为不限制',
                setorderidTip: '填0为不限制',
                setOrderToGroupMange: '请选一个团长',
                groupFee: '给团长的价格',
                groupFeeTips: '请注意：若在此给团长的价格金额大于0，后面再次指派这些订单给其它打手/代练员时将无法设定抛单价（为了防止出现错误的记账）',
                changeToDSH: '同时改订单状态',
                changeToDSH1: '不改',
                changeToDSH2: '改成待上号',
                clearGroupMange: '清除',
                saveGroupMange: '保存',
                typebox: '选择订单类型：',
                selbussType1: '代练单',
                selbussType2: '陪玩单',
                setrefundOrderLog: '特别注意：如果接进来的订单出现退款或要退部分红包，就只需要在这里记录这笔单子最终总共退款金额就行，不要去改接单价，否则会形成又改接单价又记退款，最终导致错账',
                setrefundOrderLogLable: '退款方式',
                refundModel1: '原订单退款',
                refundModel2: '支付宝',
                refundModel3: '微信',
                refundModel4: 'QQ',
                refundModel5: '银行转账',
                refundFee: '退款金额',
                paytranno: '支付单号',
                paytrannoplaceholder: '如果是转账就填转账流水号，若没有就留空',
                refundDate: '退款日期',
                refundRemark: '备注',
                refundChangeToYTDLable: '同时改订单状态',
                refundChangeToYTD1: '不改',
                refundChangeToYTD2: '改成已退单',
                saveReFundOrderBtn: '确定记录',
                seachMutPriceDiv1: '接单价区间',
                seachMutPriceDiv2: '发单价区间',
                seachMutPrice_p1: '接单价最小值',
                seachMutPrice_p2: '接单价最大值',
                seachMutPrice_p3: '发单价最小值',
                seachMutPrice_p4: '发单价最大值',
                seachMutPriceBtn: '搜索',
            },
            js: {
                setOrderTipsBtn1: '做标记',
                setOrderTipsBtn2: '删除标记',
                listData: '全部',
                paodanprice: '抛单价',
                orderIDcopy: '这是系统内置单号，每笔单号不一样，单击可复制',
                pushJdpOrderState1: '未接手',
                cancelPlatorderTips: '仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响',
                cancelPlatorder: '撤回',
                changePlatorderPriceTips: '还没接手时可以全平台更改发单价，注意：是全平台改价',
                changePlatorderPrice: '改价',
                submitEditSonTips: '在还没被接手前可以修改交易订单标题、内容、价格（单独编辑此平台）',
                submitEditSon: '编辑',
                pushJdpOrderState2: '代练中',
                revokeBtnTips: '仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响',
                revokeBtn: '撤销',
                changePlatorderLock: '锁定',
                pushJdpOrderState3: '已锁定',
                changePlatorderLock1Tips: '锁除锁定',
                changePlatorderLock1: '解锁',
                pushJdpOrderState4: '异常中',
                repushorderTips: '可以重新发布到交易平台，注意，前面还在代练中的不要重新发，以免重复',
                repushorder: '重发',
                pushJdpOrderState5: '撤销中',
                pushJdpOrderState6: '仲裁中',
                unRevokeBtnTips: '同意撤销(打手那边申请的撤销才有效)',
                unRevokeBtn: '同意',
                pushJdpOrderState7: '待验收',
                pushJdpOrderState8: '已结算',
                pushJdpOrderState9: '已仲裁',
                change: '确定同意撤销吗？要不要再看看',
                btn1: '确认',
                btn2: '取消',
                cancelUnRevokeBtn: '确定取消撤销吗？',
                error: '系统繁忙！',
                repushorderlayer: '重发平台订单！',
                revokeContentIndex: '申请撤销',
                paytorec: '支付代练费',
                paytorecplaceholder: '支付给接单方的金额',
                pcamount: '赔保证金',
                pcamountplaceholder: '接单方赔偿给发单的',
                revokeremark: '撤销理由',
                revokeremarkplaceholder: '请输入理由',
                revokeOKBtn: '立即提交',
                revokeOKBtnmsg: '请刷新该页面重新点击申请',
                paytorecmsg: '支付给对方的金额格式不正确，请输入整数',
                pcamountmsg: '要求对方赔偿给我的金额格式不正确，请输入整数',
                revokeremarkmsg: '撤销理由不能为空',
                viewPlatOrderDetails: '交易详情',
                changePlatorderPriceAllTitle1: '您正在修改这笔单的全平台发单价，请输入新价格',
                changePlatorderPriceAllTitle2: '请输入新的发单价金额',
                VerifyMoeny1: '请输入正确的金额，默认为1',
                VerifyMoeny2: '价格必须大于0元',
                pushjdp: '编辑交易平台订单：',
                cancelPlatorderpop: '确认从平台撤回这一笔交易单吗？注意：该操作仅针对这一笔有效',
                cancelPlatorderpopBtn1: '确认',
                cancelPlatorderpopBtn2: '点错了',
                orderIdRowTips1: '这是一笔陪玩订单',
                orderIdRowTips2: '新订单，请急时查阅',
                orderIdRowTips3: '会员单',
                orderIdRowTips4: '加急订单，优先安排',
                orderIdRowTips5a: '标记：',
                orderIdRowTips5b: '，点击可以编辑',
                orderIdRowTips6: '该订单已被拆分成多笔订单，点击可以查看关联订单',
                orderIdRowTips7a: '该笔订单有参与排团，团号：',
                orderIdRowTips7b: '，排团名称：',
                orderIdRowTips8: '代练通',
                orderIdRowTips9: '代练妈妈',
                orderIdRowTips10: '趣代练',
                orderIdRowTips11: '咕噜代练',
                orderIdRowTips12: '易代练',
                orderIdRowTips13: '代练宝',
                orderIdRowTips14: '代练丸子',
                orderIdRowTips15: '代练多',
                orderIdRowTips16: '第三方交易平台',
                orderIdRowTips17: 'Show91',
                orderIdRowTips18: '代游通',
                orderIdRowTips19: '天玩代练',
                orderIdRow1: '陪',
                orderIdRow2: '新',
                orderIdRow3: '会',
                orderIdRow4: '急',
                orderIdRow5: '',
                orderIdRow6: '拆',
                orderIdRow7: '团',
                orderIdRow8: '通',
                orderIdRow9: '妈',
                orderIdRow10: '趣',
                orderIdRow11: '噜',
                orderIdRow12: '易',
                orderIdRow13: '宝',
                orderIdRow14: '丸',
                orderIdRow15: '多',
                orderIdRow16: '鸡',
                orderIdRow17: '9',
                orderIdRow18: '通',
                orderIdRow19: '天',
                platOrder: '点击可查看该订单下所有平台的子订单',
                voTitle: '点击查看订单详情，也可以鼠标右键试试看',
                copyOrderIdspanTitle: '鼠标右键看看~',
                backListtips: '该客户在黑名单中，请留意',
                spanstips1: '角色名：',
                spanstips2: '，该订单正在交易平台，无法快速编辑角色名',
                spanstips3: '，点击可以快速编辑',
                projectRowtips1: '项目分类：',
                projectRowtips2: '，代练/陪玩项目：',
                projectRowtips3: '，点击可快速编辑代练/陪玩项目',
                orderStaRow1: '待抢单',
                orderStaRow2: '待完善',
                orderStaRow3: '待付款',
                orderStaRow4: '待抢单',
                orderStaRow5: '待上号',
                orderStaRow6: '代练中',
                orderStaRow7: '待验收',
                orderStaRow8: '已完成',
                orderStaRow9: '已暂停',
                orderStaRow10: '问题单',
                orderStaRow11: '已退单',
                orderStaRow12: '撤销中',
                orderStaRow13: '仲裁中',
                orderStaRow14: '已仲裁',
                orderStaRow15: '已撤销',
                orderStaRow16: '异常中',
                setdlsta1: '中',
                setdlsta2: '，点击可以更改订单状态',
                wangwangRow: '来源：',
                wangwangRowtips1: '该订单来源：',
                wangwangRowtips2: '，点击可以直接和买家旺旺对话(需要安装千牛，并且注意窗口提示，点击打开或确定才可以)',
                wangwangRowtips3: '，点击可以直接和老板QQ对话',
                autoStr1: '该订单开启了智能分配，人员分配顺序为：',
                autoStr2: '智',
                DLStaffTil1: '还未设置，点此指派打手',
                DLStaffTil2: '当前打手：',
                DLStaffTil3: '点击可进入指派',
                DLStaffTxt: '指派打手',
                DLStaff: '该订单已启用了智能分配，智能分配打手分别为：',
                throwPriceRowtitle: '该订单已与打手结算了（详细的结算明细请到财务运营/绩效账单里查询）',
                throwPriceRowspan: '游戏区服',
                changeThrowFeeEdit: '该笔订单还未指派过接手人，可以直接修改抛单价作为记账用，点击修改',
                changeThrowFee1: '预计该笔订单总抛单金额：',
                changeThrowFee2: '元',
                changeThrowFee3: '，点击可以修改抛单价',
                orderPriceRowtid: '安全保证金|效率保证金',
                orderPriceRowtitle1: '该订单在实际中还未收到款（注意：与代练员或下家结账请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）',
                orderPriceRowtitle2: '该订单在实际中处于正在结算中（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）',
                orderPriceRowtitle3: '该订单实际中已收款（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）',
                orderPriceRowspan1: '未',
                orderPriceRowspan2: '中',
                orderPriceRowspan3: '收',
                orderPriceRowpayMethod1: '默认',
                orderPriceRowpayMethod2: '花呗付款，其中服务费',
                orderPriceRowpayMethod3: '信用卡付款，其中服务费',
                yuan: '元',
                editOrderPrice1: '该笔订单的接单金额：',
                editOrderPrice2: '元',
                editOrderPrice3: '，支付方式：',
                editOrderPrice4: '（原',
                editOrderPrice5: '元，已打',
                editOrderPrice6: '折）',
                orderNetReceiptsRow: '该订单实际收款，点击可以快速修改',
                orderRefundRowtitle1: '没有退款，点击可以快速记录退款',
                orderRefundRowtitle2: '退款金额：',
                orderRefundRowtitle3: '元，退款方式：',
                orderRefundRowtitle4: '，退款时间：',
                orderRefundRowtitle5: '，操作人：',
                orderRefundRowtitle6: '，点击可以快速编辑退款',
                csoure: '订单来自：',
                assUserNameRow: '无',
                jiweiRowVo1: '当前没有分配机位，点击可分配',
                jiweiRowVo2: '当前机位：',
                jiweiRowVo3: '当前订单已分配团长：',
                orderLogRow: '点击可以快速添加订单日志',
                btnfuneditBtn: '编辑订单',
                btnfunthnb: '发到内部接单大厅',
                btnfunjoinTaskBtn: '将订单加入到排团',
                btnfunpushJdpBtn: '把这笔订单一键发到各大交易平台',
                btnfunsendsmsOrderBtn: '发送短信',
                btnfunisNewTaskModel: '将该笔订单加入到坑位排团模式，适用于魔兽/诛仙世界专用',
                isThrowOrder: '从内部接单大厅撤回',
                pushJdpCancel: '把这笔订单从所有第三方交易平台撤回',
                remarkRow: '点击可以编辑订单重要备注',
                orderLabelRow1: '点击设置订单标签',
                orderLabelRow2: '设标签',
                orderLabelRow3: '订单标签：',
                orderLabelRow4: '，点击可选择移除标签',
                _orderid: '订单号',
                orderId: '系统内置单号',
                _role: '角色名',
                _orderLabel: '订单标签',
                _remark2: '重要备注',
                _group: '阵营',
                _project: '代练/陪玩内容',
                _info: '角色信息',
                _sta: '状态',
                _hour: '时间',
                _ww: '旺旺/来源',
                _soure: '订单来源',
                _rec: '接手人',
                _throw: '发单价',
                _price: '接单价',
                _netreceipts: '实收款',
                _refund: '退款',
                _img: '订单截图',
                upImg: '上传截图',
                mangeImg1: '图片管理',
                mangeImg2: '，当前截图数量：',
                mangeImg3: '张',
                _kefu: '销售客服',
                _assUserName: '发单人',
                _create: '录单时间',
                _completeTime: '完单时间',
                addOrderUserName: '录单人',
                _jiwei: '机位/团长',
                _remark: '重要备注',
                _orderlog: '日志',
                _change: '操作',
                datatable: '重置表格排版',
                RESET_TABLE: '是否重置表格排版',
                selectTotal1: '勾选统计接单价：',
                selectTotal2: '，发单价：',
                ajaxDatatotal1: '本次',
                ajaxDatatotal2: '按单号批量',
                ajaxDatatotal3: '按接发接单+发单价组合',
                ajaxDatatotal4: '搜索统计共',
                ajaxDatatotal5: '笔，预计总发单价',
                ajaxDatatotal6: '元(不含销售提成)，总接单价',
                ajaxDatatotal7: '元',
                ajaxDatatotal8: '(实际总收款',
                ajaxDatatotal9: '元)',
                ajaxDatatotal11: '，总退款',
                ajaxDatatotal12: '元，',
                ajaxDatatotal13: '(花呗付款',
                ajaxDatatotal14: '笔，服务费',
                ajaxDatatotal15: '元，信用卡付款',
                ajaxDatatotal16: '笔，服务费',
                ajaxDatatotal17: '元)，',
                ajaxDatatotal18: '预计利润',
                ajaxDatatotal19: '元(含已退单部分)。其中：',
                statustabTips1: '点击可以快速筛选未分配的订单',
                statustabTips2: '点击可以快速筛选待上号的订单',
                statustabTips3: '点击可以快速筛选代练中的订单',
                statustabTips4: '点击可以快速筛选待验收的订单',
                statustabTips5: '点击可以快速筛选已完成的订单',
                statustabTips6: '点击可以快速筛选已暂停的订单',
                statustabTips7: '点击可以快速筛选问题单的订单',
                statustabTips8: '点击可以快速筛选异常中的订单',
                statustabTips9: '点击可以快速筛选已退单的订单',
                statustabTips10: '点击可以快速筛选撤销中的订单',
                statustabTips11: '点击可以快速筛选仲裁中的订单',
                statustabTips12: '点击可以快速筛选已仲裁的订单',
                statustabTips13: '点击可以快速筛选已撤销的订单',
                statustab1: '未分配',
                statustab2: '待上号',
                statustab3: '代练中',
                statustab4: '待验收',
                statustab5: '已完成',
                statustab6: '已暂停',
                statustab7: '问题单',
                statustab8: '异常中',
                statustab9: '已退单',
                statustab10: '撤销中',
                statustab11: '仲裁中',
                statustab12: '已仲裁',
                statustab13: '已撤销',
                bi: '笔',
                selectSeach1Btn1: '搜索',
                selectSeach1Btn2: '关闭',
                selectSeach1title: '按单号批量查询，每行一笔单号。注意：该搜索会排除其它搜索条件',
                selectSeach1Msg: '单号格式不符合要求',
                key1placeholder1: '请输入交易平台单号',
                key1placeholder2: '请输入电话号码',
                key1placeholder3: '请输入游戏角色名',
                key1placeholder4: '请输入系统订单号',
                qainput: '搜索QA：',
                timetitle1: '录单时间',
                timetitle2: '开始时间',
                timetitle3: '完成时间',
                timetitle4: '收款时间',
                setRecMan: '请选择要操作的记录！',
                settypeLayer: '修改订单类型',
                throwToJdpTransctionBtn: '请选择要操作的记录，且只能选择一笔订单！',
                exportBtn: '勾选的情况下导出订单，每次最多只支持50笔。如果需要导出全部查询结果，可以不用勾选',
                jobdatatable: '查看职业统计',
                alias: '职业',
                total: '数量',
                ratios: '职业比例',
                settypes: '请选择业务类型',
                viewOrderDetails: '订单详情',
                editOrder: '编辑订单',
                seachSplitOrderTit1: '查看',
                seachSplitOrderTit2: '关联订单',
                saveSettpricebtn: '请填写金额和保证金，默认为0',
                saveSettpricebtnmsg1: '请输入正确的百分比数值(不需要带%)',
                saveSettpricebtnmsg2: '请输入正确的金额，默认为0',
                pushPriceMode1: '发单价百分比',
                pushPriceMode2: '设定发单价',
                settLayerIndex: '设定抛单价及保证金',
                refundOrderLogs: '记录订单退款',
                postThrowOrderToInternal: '请输入正确的金额，填0代表不限制',
                CancelInternalThorwOrder: '确定从内部接单大厅撤销该订单吗？撤销后，内部接单大厅将看不到该订单',
                setJiWeiprompt: '设置机位(不需要机位请写无)',
                zpOrder: '将订单指派给接手人/代练员',
                upImgpop: '上传订单截图',
                mangeImg: '查看订单截图',
                orderLogs: '的订单日志',
                changeThrowOrderSetSta: '更改与接手方的结算状态',
                changeSettOrderStatus: '更改与发单方的结算状态',
                saveSettbtnalert: '请选择一种结算状态！',
                saveSettbtnTit: '提示',
                addOrderToTaskTit1: '将勾选的订单加入到排团坑位【坑位模式，适合魔兽/诛仙世界专用】',
                addOrderToTaskTit2: '将勾选的订单加入到排团【普通模式】',
                cleanOrderByTask: '确定将该订单与该排团解除关系吗？',
                setOrderGameRoleName: '编辑订单角色名，若没有请写无',
                setOrderTagmsg: '请勾选要操作的订单',
                setOrderTagtitle: '编辑订单标记',
                cleanOrderTagmsg: '请勾选要操作的订单',
                cleanOrderTagconfirm: '确定将这些订单的自定义标记清除吗？',
                viewTaskDetails: '排团详情',
                delOrderconfirm1: '真的删除吗？警告：一旦删除，将无法找回，请谨慎处理',
                delOrderconfirm2: '删除订单会自动删除接单客服的接单提成记录，是否需要同步删除代练接手人的绩效记录？',
                delOrderbtn1: '需要删除接手人绩效',
                delOrderbtn2: '不需要删除接手人绩效',
                exportOrder: '导出订单',
                sendSms: '对指定订单客户发送短信',
                changeThrowPrice: '查看或编辑订单接手绩效',
                changeThrowPriceprompt: '改发单价，可为0，但不能为空，带%号代表按接单价比例发单',
                changeOrderPricetitle: '更改接单价，可为0，但不能为空',
                changeThrowPricemsg: '请输入正确的金额，默认为',
                changeOrderNetReceiptsPricetitle: '更改实收款，可为0，但不能为空',
                changeOrderNetReceiptsPricemsg: '请输入正确的金额，默认为',
                setOrderRemark: '修改订单重要备注',
                throwToJdpTransction: '发单到交易平台：请确认发单内容',
                cancelThrowJdpTransction: '确定将该订单从所有平台撤回吗？',
                cancelThrowJdpTransctionBtn1: '确定撤回',
                cancelThrowJdpTransctionBtn2: '我再想想',
                changeOrderLocktipsMsg1: '确定将选中的订单临时锁单？<br/>注意，最多只能锁单24小时，锁单期间，除了你自己其它任何人都不能编辑订单但可以改状态<br/>如果不主动解锁，24小时后会自动解锁',
                changeOrderLocktipsMsg2: '确定解锁吗？',
                changeOrderLocktipsBtn1: '确定',
                changeOrderLocktipsBtn2: '点错了',
                setOrderProject: '请输入新的订单代练项目',
                itemModel: '删除标签',
                bindSelectOrderLabelmsg: '该游戏没有配置订单标签，请到系统维护->订单标签维护 中设置',
                bindSelectOrderTipsBtnTit1: '做标记',
                bindSelectOrderTipsBtnTit2: '删除标记',
                copyOrderIdClipboard1: '已成功复制订单号：',
                copyOrderIdClipboard2: '到剪贴板',
                copyOrderIdClipboard3: '复制订单号失败了，请手动复制',
                copyOrderIdClipboard4: '已成功复制订单内容到剪贴板',
                copyOrderIdClipboard5: '复制订单内容失败了，请手动复制',
                changeThrowFeeEditprompt: '更改发单价，可为0，但不能为空',
                changeThrowFeeEditmsg: '请输入正确的金额，默认为',
                changeThrowFeeEditByPlatform: '追加所有第三方交易平台抛单价，当前抛单价',
                changeThrowFeeEditByPlatformmsg1: '请输入正确的金额，默认为0元',
                changeThrowFeeEditByPlatformmsg2: '要追加的价格必须大于0元',
                viewDetailsitems1: '查看详情',
                viewDetailsitems2: '复制订单编号',
                viewDetailsitems3: '复制订单内容',
                viewDetailsitems4: '复制成新订单',
                viewDetailsitems5: '复制玩家自助完善订单链接',
                viewDetailsitems6: '获取玩家上号扫码授权链接',
                viewDetailsitems7: '查看订单截图',
                viewDetailsitems8: '与接手人QQ对话',
                viewDetailsitems9: '获取发群聊用的新单消息',
                getScanqrCodemsg1: '已成功复制链接：',
                getScanqrCodemsg2: '到剪贴板，有效时间',
                getScanqrCodemsg3: '小时',
                getScanqrCodemsg4: '复制失败了',
                getLinkappendMsg: '麻烦根据提示填写链接',
                getLinkvalue: '点击以下链接补充订单信息：',
                getLinkalert: '提示： 以上消息已自动复制到剪贴板，请粘贴给老板',
                getRecManQQ: '正在试图唤起QQ...',
                getRecManQQmsg: '该订单当前接手人没有登记QQ号或无法提取接手人信息',
                getSendGroupNewOrderMsg: '已自动复制，点击窗口外面任意地方可关闭',
                getSendGroupNewOrderMsgmsg1: '已成功复制到剪贴板',
                getSendGroupNewOrderMsgmsg2: '复制失败了',
                viewIsJiaJitips: '勾选后将筛选出加急的订单',
                gwindowtitle1: '将订单',
                gwindowtitle2: '指定团长，当前团长：',
                gwindowtitle3: '将订单指定团长',
                gwindowtitle4: '没有团长',
                saveGroupMangemsg1: '请刷新页面重新选择订单再指定团长',
                saveGroupMangemsg2: '请选择一个团长',
                clearGroupMangemsg: '请刷新页面重新选择订单再清除',
                clearGroupMangeconfirm: '确定清除订单的指定团长吗？',
                clearGroupMangebtn1: '确定清除',
                clearGroupMangebtn2: '我再想想',
                viewSystemLogs: '查看订单浏览记录',
                viewLeakOrdertips: '勾选后将筛选出状态为未分配或者没有指派过打手陪玩的单子',
                setOrderSoureIdprompt: '更改订单来源单号',
                setOrderSphoneprompt: '请输入指定上号电话，若不需要请输入任意1个字符',
                builderSellEmpOrderFunctipsMsg: '确定需要为选中的订单生成或更新客服销售绩效账单吗？<br/>提示：当确认这些订单没有客服销售绩效账单时再生成，一般情况下系统会自动生成。<br>如果系统发现账单存在，将会重新计算并更新该订单的客服销售账单',
                builderSellEmpOrderFuncbtn1: '确定生成',
                builderSellEmpOrderFuncbtn2: '点错了',
                saveReFundOrderBtnmsg: '请输入正确的金额',
                seachMutPriceLayerIndextitle: '接单价+发单价组合查询',
                seachMutPriceBtnmsg1: '接单价最低价格格式不正确',
                seachMutPriceBtnmsg2: '接单价最高价格格式不正确',
                seachMutPriceBtnmsg3: '发单价最低价格格式不正确',
                seachMutPriceBtnmsg4: '发单价最高价格格式不正确',
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
    xmSelect: 'lib/xm-select',
    formSelects: '/lib/formSelects-v4',
    ClipboardJS: '/lib/clipboard',
}).use(['index', 'form', 'formSelects', 'util', 'laydate', 'table', 'ClipboardJS', 'laypage', 'dropdown', 'treeTable', 'xmSelect'], function () {
    var $ = layui.$,
        form = layui.form,
        util = layui.util,
        layPage = layui.laypage,
        formSelects = layui.formSelects,
        laydate = layui.laydate;
    var treeTable = layui.treeTable
    var screenWidth = window.screen.width;
    var screenHeight = window.screen.height;
    var soulTable = layui.soulTable;
    var xmSelect = layui.xmSelect;
    var dropdown = layui.dropdown;
    var dropdownMut = layui.dropdown;
    var dropdownTips = layui.dropdown;
    var ClipboardJS = layui.ClipboardJS;
    var table = layui.table;
    var popPlatfromId
    var devices = layui.device();
    var isPc = true;
    var settypeLayer = null;
    var allcheckIcon = '';
    var taskSelectId = 0;
    var dataParams = {};
    var sechbtnValue = true
    if (devices.android === true || devices.ios === true) {
        isPc = false;
    }
    laydate.render({
        elem: '#sDate'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#eDate'
        , type: 'datetime'
    });
    laydate.render({
        elem: '#refundDate'
        , type: 'date'
    });
    var re = true;
    /**
     * 保存所有页的数据，仅适用于数据量小的时候
     * */
    var currentData = [];
    /**
     * 动态菜单是否已加载
     * */
    var inst;
    /**
     * 设置全局变量以保存选中行信息
     * */
    var allIds = new Array();
    $(document).keyup(function (event) {
        getKey();
    });

    function getKey() {
        if (event.keyCode == 13 && sechbtnValue) {
            allIds = [];
            $(".sechbtn").trigger("click");
        }
        if (event.keyCode === 27) {
            layer.closeAll();
        }
    }
    var gameName = $("#gameName").find("option:selected").text();
    var sDate = $("#sDate").val();
    var eDate = $("#eDate").val();
    var minPrice = $("#minPrice").val();
    var maxPirce = $("#maxPirce").val();
    var isPw = false;
    var popTid
    var isMoblieGame = false;
    var selectLineRowTotalPrice = new Array();
    /**
     * 发内部抢单是否需要开启押金限制
     * */
    var isInvoFee = $("#isInvoFee").val();
    var remarkLocation = $("#remarkLocation").val();
    var isEnableServiceAmount = $("#isEnableServiceAmount").val();
    var isNewTaskModel = $("#isNewTaskModel").val();
    var rightMenuCopyOrder = $("#rightMenuCopyOrder").val();
    var taskPullDownListIsViewAll = $("#taskPullDownListIsViewAll").val();
    var orderSoureOnlyViewSoure = $("#orderSoureOnlyViewSoure").val();
    var isViewSoure = $("#isViewSoure").val();
    var isViewNetReceipts = $("#isViewNetReceipts").val();
    var pushPlatmMode = $("#pushPlatmMode").val();
    var currentGameGroupData = [];
    var currentProjectData = [];
    var IDX = [];
    getGameGroup();
    getGameJob();
    getGameProject($("#gameName").val());
    getAllRecUserData();
    getAllGroupUserData();
    getCustomerService();
    getAllOrderSoure();
    getAllTaskData();
    getOrderTypeList($("#gameName").val(), '');
    var indexLoad;
    var mobliegame = false;
    var ispw = false;
    var currPage = 1;
    var limit = 20;
    /**
     * 查询变量
     */
    var params;
    var OrderIDX = '';
    var orders = "";
    dropdownTips.render({
        elem: '#setOrderTipsBtn',
        //trigger: 'hover',
        data: [{
            title: '做标记',
            id: 0
        }, {
            title: '删除标记',
            id: 1
        }],
        click: function (obj) {
            if (obj.id == 0) {
                setOrderTag(OrderIDX, '');
            }
            else {
                cleanOrderTag(OrderIDX);
            }
        }
    });
    /**
     * 批量查单号变量
     * */
    var batchOrderId = "";
    var seachParam = 'gameName=' + gameName + '&sDate=' + encodeURIComponent(sDate) + '&eDate=' + encodeURIComponent(eDate) + '&minPrice=' + minPrice + '&maxPrice=' + maxPirce + '&page=1&limit=' + limit;
    var device = isPc;
    var tabelist;
    /**
     * 组合接发单价
     */
    var seachMutPrice1 = -999999;
    var seachMutPrice2 = 99999999;
    var seachMutPrice3 = -999999;
    var seachMutPrice4 = 99999999;
    var settLayerIndex;
    var seachMutPriceLayerIndex;
    defaultGame();
    columeTable();
    function defaultGame() {
        var tempIsMoblieGame = false;
        var tempIsPw = false;
        $("#gameName option").each(function () {
            var item = $(this).text();
            if (item == $("#gameName").find("option:selected").text()) {
                var temp = $(this).data('mobliegame');
                tempIsMoblieGame = temp == "Y" ? true : false;
                tempIsPw = $(this).data('pw') == "Y" ? true : false;
                tempIsAccPwd = $(this).data('accpwd') == "Y" ? true : false;
            }
        });
        mobliegame = tempIsMoblieGame;
        ispw = tempIsPw;
    }
    formSelects.data('gameGroup', 'server', {
        url: '/GameAjax/getGameData?type=50&parentId=' + $("#gameName").find("option:selected").text(),
    });
    form.on('select(selectGame)', function (data) {
        var tempIsMoblieGame = false;
        var tempIsPw = false;
        $("#gameName option").each(function () {
            var item = $(this).val();
            if (item == data.value) {
                gameName = $(this).text();
                var temp = $(this).data('mobliegame');
                tempIsMoblieGame = temp == "Y" ? true : false;
                tempIsPw = $(this).data('pw') == "Y" ? true : false;
                tempIsAccPwd = $(this).data('accpwd') == "Y" ? true : false;
            }
        });
        mobliegame = tempIsMoblieGame;
        ispw = tempIsPw;
        columeTable();
        getGameGroup();
        getGameJob();
        getGameProject(data.value);
        formSelects.data('gameServer', 'local', {
            arr: [
            ]
        });
        getAllRecUserData();
        form.val('form', { recType: 0 })
        getCustomerService();
        getAllTaskData();
        getOrderTypeList(data.value, '');
        getOrderLabelByGame();

        allIds = []; //清除勾选的记录
        $(".sechbtn").trigger("click");
        if (gameName.indexOf('魔兽') > -1 || gameName.indexOf('诛仙世界') > -1) {
            $(".group").show();
            $(".task").show();
            $(".taskman").show();
            $("#groupTh").show();
            $("#col_project").width('10.4%');
            $("#col_group").show();
            $("#plstaTH").hide();
            $("#col_ptsta").hide();
            $(".orderTypeDiv").hide();
        } else {
            $(".group").hide();
            $(".task").hide();
            $(".taskman").hide();
            $("#groupTh").hide();
            $("#col_project").width(230);
            $("#col_group").hide();
            $("#plstaTH").show();
            $("#col_ptsta").show();
            $(".orderTypeDiv").show();
        }
        return false;
    });
    function getGameGroup() {
        $.get('/GameAjax/getGameData?type=50&parentId=' + gameName, function (result) {
            currentGameGroupData = result.data;
            formSelects.data('gameGroup', 'local', {
                arr: currentGameGroupData
            });
        });
    }
    function getGameJob() {
        formSelects.data('gameJob', 'server', {
            url: '/GameAjax/getGameData?type=40&parentId=' + $("#gameName").find("option:selected").text(),
        });
    }
    function getGameProject(gameId) {
        $.get('/GameAjax/getProject?gameId=' + gameId, function (result) {
            currentProjectData = result.data;
            formSelects.data('projectSelect', 'local', {
                arr: currentProjectData
            });
        });
    }
    function getAllOrderSoure() {
        var soureData = [];
        $.get('/SystemAjax/GetOrderSoureList', function (result) {
            soureData = result.data;
            formSelects.data('orderSoures', 'local', {
                arr: soureData
            });
        });
    }
    var RecUserSelect
    function getAllRecUserData() {
        let Userlimit = 2000
        var soureData = [];
        function processDataWithCustomClick(dataList) {
            if (!Array.isArray(dataList)) return [];

            return dataList.map(item => {
                if (item.optgroup) {
                    return {
                        ...item,
                        click: function (groupItem) {
                            const searchVal = $('#popgameName .xm-input.xm-search-input').val().trim().toLowerCase();
                            const children = groupItem.children || [];


                            const matchedValues = children
                                .filter(child => {
                                    const isMatch = !searchVal || (child.name && child.name.toLowerCase().includes(searchVal));
                                    const isDisabled = !!child.disabled;
                                    return isMatch && !isDisabled;
                                })
                                .map(child => child.value);
                            if (matchedValues.length === 0) return;
                            const currentSelectedValues = RecUserSelect.getValue('value');
                            const isAllSelected = matchedValues.every(val => currentSelectedValues.includes(val));
                            let newValues = [];
                            if (isAllSelected) {
                                newValues = currentSelectedValues.filter(val => !matchedValues.includes(val));
                            } else {
                                newValues = Array.from(new Set([...currentSelectedValues, ...matchedValues]));
                            }
                            RecUserSelect.setValue(newValues);
                        }
                    };
                }
                return item;
            });
        }
        $.get(`/UserAjax/GetAllUserByGameName?gameName=${gameName}&page=1&limit=${Userlimit}`, function (result) {
            soureData = processDataWithCustomClick(result.data);
            //formSelects.data('recUser', 'local', {
            //    arr: soureData
            //});
            if (result.count > Userlimit) {
                RecUserSelect = xmSelect.render({
                    el: '#popgameName',
                    language: 'zn',
                    radio: true,
                    filterable: true,
                    clickClose: true,
                    height: '400px',
                    remoteSearch: true,
                    paging: true,
                    pageSize: Userlimit,
                    pageRemote: true,
                    pageEmptyShow: false,
                    toolbar: {
                        show: true,
                        list: ['CLEAR']
                    },
                    remoteMethod: function (val, cb, show, pageIndex) {
                        $.get(`/UserAjax/GetAllUserByGameName?gameName=${gameName}&page=${pageIndex}&limit=${Userlimit}&accurate=1&seachKey=${val}`, function (res) {
                            const processedData = processDataWithCustomClick(res.data);
                            cb(processedData, Math.ceil(res.count / Userlimit));
                        })
                    },
                    data: soureData,
                })
            } else {
                RecUserSelect = xmSelect.render({
                    el: '#popgameName',
                    language: 'zn',
                    radio: true,
                    height: '400px',
                    filterable: true,
                    clickClose: true,
                    data: soureData,
                    toolbar: {
                        show: true,
                        list: ['CLEAR']
                    },
                })
            }
        });
    }

    function getAllGroupUserData() {
        var soureData = [];
        $.get('/UserAjax/GetGroupUserSelect?gameName=' + gameName + '&isAppendSetting=Y', function (result) {
            soureData = result.data;

            formSelects.data('orderGroupUser', 'local', {
                arr: soureData
            });
        });
    }
    function getCustomerService() {
        var soureData = [];
        $.get('/UserAjax/GetAllUserByGroupName?groupType=20&isSelectCurrentUser=N&gameName=' + gameName, function (result) {
            soureData = result.data;
            formSelects.data('inputOrderKefu', 'local', {
                arr: soureData
            });
        });
    }

    var OperatorSelect
    function getOperatorService() {
        $.get('/UserAjax/GetZpRootUsers', function (result) {
            //formSelects.data('recUser', 'local', {
            //    arr: result.data
            //});
            OperatorSelect = xmSelect.render({
                el: '#popgameName',
                language: 'zn',
                radio: true,
                filterable: true,
                clickClose: true,
                height: '400px',
                data: result.data,
                toolbar: {
                    show: true,
                    list: ['CLEAR']
                },
            })
        });
    }
    form.on('select(recType)', function (data) {
        var recType = data.value;
        if (recType == 10) {
            //派单人
            getOperatorService();
        } else {
            getAllRecUserData();
        }
        return false;
    });
    function getAllTaskData() {
        var listData = [];
        var status = taskPullDownListIsViewAll != "N" ? 0 : 10;
        $.get('/PveTaskAjax/GetAllTaskSelectListData?gameId=' + $("#gameName").val() + '&status=' + status, function (result) {
            listData = result.data;
            listData.unshift({
                value: '0',
                name: '全部'
            })
            formSelects.data('taskSelect', 'local', {
                arr: listData
            });


            // formSelects.data('taskSelect',  {
            //    arr: listData
            // });
        });
    }
    function columeTable() {
        $("#groupTh").show();
        $("#jiweiTh").show();
        $("#rizhiTH").show();
        $("#imgTH").show();
        $("#col_group").show();
        $("#col_img").show();
        $("#col_jiwei").show();
        $("#col_orderlog").show();
        $("#col_d1").hide();
        $("#col_d2").hide();
        $("#col_d3").hide();
        $("#col_d4").hide();
        $("#col_d5").hide();
        $("#col_d6").hide();
        $("#d1TH").hide();
        $("#d2TH").hide();
        $("#d3TH").hide();
        $("#d4TH").hide();
        $("#d5TH").hide();
        $("#d6TH").hide();
        $("#paodanprice").html('抛单价');
    }
    params = {
        gameName: gameName
        , stime: encodeURIComponent(sDate)
        , etime: encodeURIComponent(eDate)
        , minPrice: minPrice
        , maxPrice: maxPirce
        , limit: limit
    };
    function reloadOrderList() {
        allIds = [];
        layer.closeAll();
        ajaxData(params);
    }
    function reloadOrderListNoCloseLayer() {
        allIds = [];
        ajaxData(params);
    }
    var _Functions = {
        func1: function () {
            reloadOrderList();
        }
    }
    window.functions = _Functions;
    function sysorderIdRow(res) {
        let vo = '<span class="orderIDcopy"  data-clipboard-text="' + res.orderId + '" style="cursor:pointer;color:' + (res.isPushJdp == 'Y' || res.tid ? '#D15FE8' : '#0094ff') + '" lay-tips="这是系统内置单号，每笔单号不一样，单击可复制">' + res.orderId + '</span>';;
        //let vo = '<a style="color:' + (res.isPushJdp == 'Y' ? '#D15FE8' : '#0094ff') + '">' + res.orderId + '</a>';
        return vo;
    }
    function sonbtnfun(res) {

        let editBtn = ''
        let thnb = ''
        let changePlatorderPriceBtn = ''
        let appenddPlatorderPriceBtn = ''
        let pushJdpBtn = ''
        let sendsmsOrderBtn = ''
        if (res.pushJdpOrderState == '未接手') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm cancelPlatorder" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响" data-tid="' + res.tid + '"  data-pid="' + res.platformId + '" data-id="' + res.orderId + '" >撤回</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs changePlatorderPrice " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="还没接手时可以全平台更改发单价，注意：是全平台改价" data-pid="' + res.platformId + '" data-pushprice="' + res.recFee + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" >改价</a>';
            editBtn = '<a class="layui-btn layui-btn-xs layui-btn-danger submitEditSon " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="在还没被接手前可以修改交易订单标题、内容、价格（单独编辑此平台）" data-pid="' + res.platformId + '" data-eff="' + res.effAmount + '" data-safe="' + res.safeAmount + '" data-pushprice="' + res.pushPrice + '" data-title="' + res.orderTitle + '" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">编辑</a>';
        }
        if (res.pushJdpOrderState == '代练中') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响" popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '" data-viewId="' + res.viewOrderId + '">撤销</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs changePlatorderLock " style="margin-right: 0px;margin-bottom: 0px;" lay-submit=""  popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">锁定</a>';
            editBtn = '<a class="layui-btn layui-btn-xs layui-btn-danger submitEditSon " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="在还没被接手前可以修改交易订单标题、内容、价格（单独编辑此平台）" data-popTid="' + res.platformId + '" data-eff="' + res.effAmount + '" data-safe="' + res.safeAmount + '" data-pushprice="' + res.pushPrice + '" data-title="' + res.orderTitle + '" data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">编辑</a>';
        }
        if (res.pushJdpOrderState == '已锁定') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响" popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '" data-viewId="' + res.viewOrderId + '">撤销</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs changePlatorderLock1 " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="锁除锁定"  popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">解锁</a>';
        }
        if (res.pushJdpOrderState == '异常中') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="仅从这个交易平台撤回此单，只对这个平台交易单有效，其它平台不受影响" popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '" data-viewId="' + res.viewOrderId + '">撤销</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs repushorder " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="可以重新发布到交易平台，注意，前面还在代练中的不要重新发，以免重复" orderId="' + res.orderId + '" popPlatfromId="' + res.taskId + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">重发</a>';
        }
        if (res.pushJdpOrderState == '撤销中' || res.pushJdpOrderState == '仲裁中') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-primary layui-border-blue unRevokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit=""  data-change="30" lay-tips="同意撤销(打手那边申请的撤销才有效)"  data-tid="' + res.tid + '"  data-pid="' + res.platformId + '">同意</a>';
            editBtn = '<a class="layui-btn layui-btn-xs layui-btn-primary layui-border-blue revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" data-change="20" lay-tips="取消这个撤销申请(由我们这边申请的撤销时才有用)" data-tid="' + res.tid + '"  data-pid="' + res.platformId + '">取消</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs repushorder " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="可以重新发布到交易平台，注意，前面还在代练中的不要重新发，以免重复" orderId="' + res.orderId + '" popPlatfromId="' + res.taskId + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">重发</a>';
        }
        if (res.pushJdpOrderState == '待验收') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="从平台撤回" popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '" data-viewId="' + res.viewOrderId + '">撤销</a>';
        }
        if (res.pushJdpOrderState == '已结算' || res.pushJdpOrderState == '已仲裁') {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm revokeBtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="从平台撤回" popTid="' + res.tid + '" popPlatfromId="' + res.taskId + '" data-viewId="' + res.viewOrderId + '">撤销</a>';
            changePlatorderPriceBtn = '<a class="layui-btn layui-btn-xs repushorder " style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="可以重新发布到交易平台，注意，前面还在代练中的不要重新发，以免重复" orderId="' + res.orderId + '" popPlatfromId="' + res.taskId + '"  data-tid="' + res.tid + '" data-id="' + res.orderId + '" data-viewId="' + res.viewOrderId + '">重发</a>';
        }


        let btn = editBtn + thnb + changePlatorderPriceBtn + '<br/>' + appenddPlatorderPriceBtn + pushJdpBtn + sendsmsOrderBtn;
        return btn
    }
    $(document).on('click', '.unRevokeBtn', function () {
        var change = $(this).attr('data-change');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        layer.confirm('确定同意撤销吗？要不要再看看', {
            btn: ['确认', '取消']
        }, function () {
            unRevokechange(change, tid, pid)
            return false;
        });
    });
    $(document).on('click', '.cancelUnRevokeBtn', function () {
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        var change = $(this).attr('data-change');
        layer.confirm('确定取消撤销吗？', {
            btn: ['确认', '取消']
        }, function () {
            unRevokechange(change, tid, pid)
            return false;
        });
    });
    function unRevokechange(change, tid, pid) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/ChangeTransctionOrderRevoke",
            data: { tid: tid, value: change, payAmount: 0, pcAmount: 0, remark: '', platfromId: pid },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (index2) {
                    reloadOrderList();
                    layer.close(index2);
                }
                );
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    $(document).on('click', '.changePlatorderLock', function () {
        popPlatfromId = $(this).attr('popPlatfromId')
        popTid = $(this).attr('popTid')
        changePlatfromOrderLock(1);
    });
    $(document).on('click', '.changePlatorderLock1', function () {
        popPlatfromId = $(this).attr('popPlatfromId')
        popTid = $(this).attr('popTid')
        changePlatfromOrderLock(0);
    });
    $(document).on('click', '.repushorder', function () {
        let orderId = $(this).attr('orderId')
        let url = pushPlatmMode == 1 ? '/order/pushjdp?orderId=' + orderId : '/order/pushjdp2026?orderId=' + orderId
        try {
            let domain = window.location.host;
            execJs.showNewWindow(domain + url)
        } catch (ex) {
            parent.layer.open({
                title: "重发平台订单",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 5,
                fixed: false,
                area: ['80%', '95%'],
                maxmin: false,
                content: url
            })
        }

    });
    function changePlatfromOrderLock(value) {

        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/ChangeTransctionOrderLock",
            data: { tid: popTid, value: value, platfromId: popPlatfromId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (index2) {
                    reloadOrderList();
                    layer.close(index2);
                    layer.close(index);
                }
                );
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    var revokeContentIndex;
    $(document).on('click', '.revokeBtn', function () {
        popPlatfromId = $(this).attr('popPlatfromId')
        popTid = $(this).attr('popTid')

        revokeContentIndex = layer.open({
            title: "申请撤销",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['80%', '300px'],
            content: `    <div class="applyPlatorderRevokeContent" style="padding:10px 10px">
        <div class="layui-form-item">
            <label class="layui-form-label">支付代练费</label>
            <div class="layui-input-block">
                <input type="text" name="paytorec" id="paytorec" lay-verify="" autocomplete="off" placeholder="支付给接单方的金额" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">赔保证金</label>
            <div class="layui-input-block">
                <input type="text" name="pcamount" id="pcamount" lay-verify="" autocomplete="off" placeholder="接单方赔偿给发单的" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">撤销理由</label>
            <div class="layui-input-block">
                <input type="text" name="revokeremark" id="revokeremark" lay-verify="" autocomplete="off" placeholder="请输入理由" maxlength="256" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-input-block">
                <a class="layui-btn layui-btn-normal revokeOKBtn">立即提交</a>
            </div>
        </div>
    </div>`

        });
    });
    $(document).on('click', '.revokeOKBtn', function () {
        if (popPlatfromId == 0) {
            layer.msg('请刷新该页面重新点击申请');
            return false;
        }
        var paytorec = $("#paytorec").val();
        var pcamount = $("#pcamount").val();
        var revokeremark = $("#revokeremark").val();
        if (!VerifyInt(paytorec)) {
            layer.msg('支付给对方的金额格式不正确，请输入整数');
            return false;
        }
        if (!VerifyInt(pcamount)) {
            layer.msg('要求对方赔偿给我的金额格式不正确，请输入整数');
            return false;
        }
        if (revokeremark == null || revokeremark == '' || revokeremark == undefined) {
            layer.msg('撤销理由不能为空');
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/ChangeTransctionOrderRevoke",
            data: { tid: popTid, value: 10, payAmount: paytorec, pcAmount: pcamount, remark: revokeremark, platfromId: popPlatfromId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (index2) {
                    $("#paytorec").val('');
                    $("#pcamount").val('');
                    $("#revokeremark").val('');
                    $('.applyPlatorderRevokeContent').hide()
                    reloadOrderList()
                    layer.close(index2);
                    layer.close(revokeContentIndex);
                }
                );
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    $(document).on('click', '.viewPlatmTid', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        viewPlatOrderDetails(tid, orderId, pid);
    });
    function viewPlatOrderDetails(tid, orderId, pid) {
        layer.open({
            title: "交易详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1440px' : '90%', '940px'],
            content: 'platfromorderview?orderId=' + orderId + '&tid=' + tid + '&platfromId=' + pid
        });
    }
    $(document).on('click', '.changePlatorderPrice', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pushPrice = $(this).attr('data-pushprice');
        var pid = $(this).attr('data-pid');
        changePlatorderPriceAll(0, orderId, tid, pid, pushPrice);
    });
    function changePlatorderPriceAll(types, orderId, tid, platfromId, pushPrice) {
        layer.prompt({ title: types == 20 ? '您正在修改这笔单的全平台发单价，请输入新价格' : '请输入新的发单价金额', formType: 0, value: pushPrice, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为1', { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (parseInt(value) < 1) {
                layer.msg('价格必须大于0元', { time: 1500 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/EditTransctionOrderPrice",
                data: { orderId: orderId, tid: types == 20 ? "" : tid, fee: value, platfromId: platfromId },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index2) {
                        reloadOrderList();
                        return false;
                    });
                    return false;
                },
                complete: function (XMLHttpRequest) {
                    layer.close(indexLoad);
                }
            });
        });
    }

    $(document).on('click', '.submitEditSon', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        let url = '/order/pushjdp?orderId=' + orderId + '&tid=' + tid
        layer.open({
            title: "编辑交易平台订单：" + tid,
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [isPc ? '1492px' : '95%', isPc ? '1070px' : '95%'],
            content: url
        });
    });
    $(document).on('click', '.cancelPlatorder', function () {
        var orderId = $(this).attr('data-id');
        var tid = $(this).attr('data-tid');
        var pid = $(this).attr('data-pid');
        layer.confirm('确认从平台撤回这一笔交易单吗？注意：该操作仅针对这一笔有效', {
            btn: ['确认', '点错了']
        }, function () {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/DeTransctionPlatformOrder",
                data: { tid: tid, platfromId: pid },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { re = true; layer.msg('数据请求出现异常！'); },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.alert(data.msg, function (index) {
                        if (data.code > 0) {
                            reloadOrderList();
                            return false;
                        }
                        layer.close(index);
                    });
                    return false;
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
            return false;
        });
    });
    function orderIdRow(res) {
        let vo = '';
        let isNew = '';
        let tp = '';
        let isSplit = '';
        let ji = '';
        let vip = ''
        let taskspan = '';
        let platOrder = '';
        var typestr = '';
        if (res.levelMark == 1) {
            typestr = '<span class="lableb layui-bg-orange" lay-tips="这是一笔陪玩订单">陪</span>';
        }

        if (res.isRead == 'N') {
            isNew = '<span class="lableb" style="background-color:#9ACD32" lay-tips="新订单，请急时查阅">新</span>';
        }
        if (res.customerId > 0) {
            vip = '<span class="lableb "  style="background-color:#a233c6" lay-tips="会员单">会</span>';
        }
        if (res.isJiaJi == "Y") {
            ji = '<span class="lableb" style="background-color:#FFBBFF" lay-tips="加急订单，优先安排">急</span>';
        }
        if (res.customizeTag != null && res.customizeTag != '') {
            tp = '<a href="javascript:void(0);" class="lableb changeTag" style="background-color:#1E9FFF" data-id="' + res.orderId + '" data-tag="' + res.customizeTag + '" lay-tips="标记：' + res.customizeTag + '，点击可以编辑">' + res.customizeTag.substring(0, 2) + '</a>';
        }
        if (res.isSplitOrder == 'Y') {
            isSplit = '<a href="javascript:void(0);" class="lableb seachSplitOrder" data-splitId="' + res.splitId + '" data-viewId="' + res.orderIdView + '" data-game="' + res.gameName + '" style="background-color:#FF6347" lay-tips="该订单已被拆分成多笔订单，点击可以查看关联订单">拆</a>';
        }
        if (res.taskId > 0 && !res.tid) {
            taskspan = '<a href="javascript:void(0)" class="lableb groupview" style="background-color:#FF6347" data-id="' + res.taskId + '" lay-tips="该笔订单有参与排团，团号：' + res.taskId + '，排团名称：' + res.taskName + '">团</a>';
        }
        if (res.tid) {
            let vo = '';
            switch (res.taskId) {
                case 10:
                    vo = '<span class="lableb" style="background-color:#16b777" lay-tips="代练通">通</span>';
                    break;
                case 30:
                    vo = '<span class="lableb" style="background-color:#ff5722" lay-tips="代练妈妈">妈</span>';
                    break;
                case 90:
                    vo = '<span class="lableb" style="background-color:#ff5722" lay-tips="趣代练">趣</span>';
                    break;
                case 50:
                    vo = '<span class="lableb" style="background-color:#1e9fff" lay-tips="咕噜代练">噜</span>';
                    break;
                case 60:
                    vo = '<span class="lableb" style="background-color:#a233c6" lay-tips="易代练">易</span>';
                    break;
                case 70:
                    vo = '<span class="lableb" style="background-color:#23292e" lay-tips="代练宝">宝</span>';
                    break;
                case 80:
                    vo = '<span class="lableb" style="background-color:#31bdec" lay-tips="代练丸子">丸</span>';
                    break;
                case 91:
                    vo = '<span class="lableb" style="background-color:#EE9E9D" lay-tips="代练多">多</span>';
                    break;
                case 8:
                    vo = '<span class="lableb" style="background-color:#5199D0" lay-tips="全能代(平台公共交易)">全</span>';
                    break;
                case 20:
                    vo = '<span class="lableb" style="background-color:#27a7f5" lay-tips="Show91">9</span>';
                    break;
                case 92:
                    vo = '<span class="lableb" style="background-color:#6484e4" lay-tips="代游通">通</span>';
                    break;
                case 93:
                    vo = '<span class="lableb" style="background-color:#6CCDAC" lay-tips="天玩代练">天</span>';
                    break;
            }
            taskspan = vo;
        }
        let isNewOpen = 'OrderView?orderId=' + res.orderId + '&viewType=20';
        let isNewPage = $("#isNewPage").val();
        let tk = '';
        if (isNewPage != 'Y') {
            isNewOpen = 'javascript:void(0);';
        } else {
            tk = ' target="_blank" ';
        }
        if (res.isPushJdp == 'Y') {
            platOrder = '<i style="color:#D15FE8" lay-tips="点击可查看该订单下所有平台的子订单" data-id=' + res.orderId + ' from-id=' + res.fromId + ' class="tree_btn layui-icon ' + (res.openValue == 'open' ? "layui-icon-triangle-d openValue" : "layui-icon-triangle-r") + '  "></i>';

        }
        vo = '<a href="' + isNewOpen + '" ' + tk + ' class="' + (isNewPage != "Y" ? "orderdetails" : "") + '" data-tid="' + (res.tid ? res.tid : '') + '" data-viewId="' + res.orderIdView + '" data-id="' + res.orderId + '" style="color:' + (res.isPushJdp == 'Y' || res.tid ? '#D15FE8' : '#0094ff') + '" title="点击查看订单详情，也可以鼠标右键试试看">' + res.orderIdView + '</a>';
        let copyOrderIdspan = '<span id="orderid_span_' + res.orderId + '" style="display:none" class="orderIDcopy"  data-clipboard-text="' + res.orderIdView + '"></span>';
        let copyOrderInfospan = '<span id="orderinfo_span_' + res.orderId + '" style="display:none" class="orderInfocopy"  data-clipboard-text="' + res.orderContent + '"></span>';

        return '<div  style="margin-left:' + (res.fromId ? '20px' : 'auto') + '" ' + (res.openItem ? 'openItem="' + res.openItem + '"' : '') + '  class="orderLine ' + (res.fromId ? 'sontr' : '') + ' fromId-' + res.fromId + '" id="order_' + res.orderId + '" data-id="' + res.orderId + '"  data-orderIdView="' + res.orderIdView + ' data-qq="' + res.qq + '"  title="鼠标右键看看~">' + platOrder + copyOrderIdspan + copyOrderInfospan + typestr + isNew + ji + tp + isSplit + taskspan + vo + '</div>';
    }
    function roleNameRow(res) {
        let backList = res.backListId > 0 ? '<i class="layui-icon layui-heimingdan2" style="color:#FA4462;margin-right:3px" lay-tips="该客户在黑名单中，请留意"/>' : '';
        let spans = '<a style="' + (res.isPushJdp == 'Y' || res.tid ? 'color:#D15FE8' : '') + '" href="javascript:void(0)" lay-tips="角色名：' + res.roleName + (res.isPushJdp == 'Y' ? '，该订单正在交易平台，无法快速编辑角色名' : '，点击可以快速编辑') + '" class="' + (res.isPushJdp == 'Y' ? '' : 'changeRoleName') + '" data-id="' + res.orderId + '" data-rolename="' + res.roleName + '">' + (res.roleName == '' ? '无' : res.roleName) + '</a>';

        return backList + spans;
    }
    function gameGroupRow(res) {
        let group = '<span lay-tips="' + res.gameGroup + '" style="color:#FF6347">' + res.gameGroup + '</span>';
        if (res.gameGroup) {
            if (res.gameGroup.toUpperCase().indexOf('LM') > -1 || res.gameGroup.indexOf('联盟') > -1) {
                group = '<span lay-tips="' + res.gameGroup + '" style="color:#0094ff">' + res.gameGroup + '</span>';
            }
            if (res.gameGroup.indexOf('全部') > -1) {
                group = '<span lay-tips="' + res.gameGroup + '" style="color:#666">' + res.gameGroup + '</span>';
            }
        }
        if (res.gameArea) {
            if (res.gameArea.toUpperCase().indexOf('IOS') > -1 || res.gameArea.indexOf('苹果') > -1) {
                group = '<span lay-tips="' + res.gameArea + '" style="color:#0094ff">' + res.gameArea + '</span>';
            }
        }
        return group;

    }
    function projectRow(res) {
        let vo = '<a href="javascript:void(0)" lay-tips="项目分类：' + (res.projectTypeName) + '，代练/陪玩项目：' + res.project + '，点击可快速编辑代练/陪玩项目" style="' + (res.isPushJdp == 'Y' || res.tid ? 'color:#D15FE8' : '') + '" class="modityProject" data-id="' + res.orderId + '" data-project="' + res.project + '">'
            + (res.projectTypeName != "" && res.projectTypeName != null ? "<span style='color:#31BDEC'><" + res.projectTypeName + "></span>" : "") + res.project + '</a>';
        return vo;

    }
    function roleInfoRow(res) {
        var area = gameName != "魔兽世界" ? res.gameArea + "/" : "";
        var server = res.gameServer;
        var job = isMoblieGame ? '' : res.gameJob;
        var itemlevel = gameName == "魔兽世界" && res.itemRemark ? res.itemRemark + '/' : '';
        var otherRemark = res.otherRemark;

        return '<span style="' + (res.isPushJdp == 'Y' || res.tid ? 'color:#D15FE8' : '') + '" lay-tips="' + (gameName == "全部游戏" || gameName == "所有游戏" ? '[' + res.gameName + ']' : '') + area + server + '/' + job + '">' + (gameName == "全部游戏" || gameName == "所有游戏" ? '[' + res.gameName + ']' : '') + area + server + '/' + job + '/' + itemlevel + otherRemark + '</span>';
    }
    function orderStaRow(res) {
        var orderSta = res.orderSta

        let colorStr = '#b0aeae;';
        if (res.isThrowOrder == "Y" && res.isPushJdp != 'Y') {
            orderSta = '待抢单';
        }
        if (res.tid) {
            orderSta = res.pushJdpOrderState
        }
        switch (orderSta) {
            case '待完善':
                colorStr = '#E03636';
                break;
            case '待付款':
                colorStr = '#E03636';
                break;
            case '待抢单':
                colorStr = '#D15FE8';
                break;
            case '待上号':
                colorStr = '#585858';
                break;
            case '代练中':
                colorStr = '#219227';
                break;
            case '待验收':
                colorStr = '#ff6a00';
                break;
            case '已完成':
                colorStr = '#0094ff';
                break;
            case '已暂停':
                colorStr = '#FF5722';
                break;
            case '问题单':
                colorStr = '#ff0000';
                break;
            case '已退单':
                colorStr = '#efaaaa';
                break;
            case '撤销中':
                colorStr = '#ff5722';
                break;
            case '仲裁中':
                colorStr = '#31bdec';
                break;
            case '已仲裁':
                colorStr = '#c2c2c2';
                break;
            case '已撤销':
                colorStr = '#c2c2c2';
                break;
            case '异常中':
                colorStr = '#ffb800';
                break;
        }
        let title = '';
        let str = '<a href="javascript:void(0)" class="lableb setdlsta" tid="' + (res.tid ? res.tid : '') + '" data-id="' + res.orderId + '" lay-tips="' + orderSta + '中' + (res.tid ? '' : '，点击可以更改订单状态') + title + '" style="background-color:' + colorStr + ';">' + orderSta + '</a>';

        return str;
    }
    function orderHourDescRow(res) {
        let timestr = res.orderHoursDescStr;
        if (!timestr) {
            return ''
        }
        if (res.levelMark == 2 && res.orderHoursDescStr) {
            timestr = res.orderHoursDescStr.split('天-')[1];
        }
        let div = '<span style="color:#5BB75B">' + timestr + '</span>';
        if (res.orderHoursDescStr.indexOf('-') > -1) {
            div = '<span style="color:#ff0000">' + timestr + '</span>';
        }
        return div;
    }
    function wangwangRow(res) {
        let concat = '';
        let tity = 0;
        if (orderSoureOnlyViewSoure == "Y") {
            concat = res.orderSoure;
        } else {
            let tbww = '<a href="/order/OpenWangwang?orderId=' + res.orderId + '" class="" data-orderId="' + res.orderId + '" target="_blank" title="来源：' + res.orderSoure + '">' + res.WangWang + '</a>';

            if (res.WangWang != undefined && res.WangWang != null && res.WangWang != '') {
                concat = tbww;
                tity = 10;
            }
            else if ((res.qq != undefined && res.qq != '' && res.qq != null) && (res.orderSoure.indexOf('微信') > -1 || res.orderSoure.indexOf('QQ') > -1)) {
                concat = res.qq;
            }
            else if (res.qq != '' && res.qq != undefined && res.WangWang == '') {
                concat = res.qq;
                if (VerifyInt(concat)) {
                    concat = '<a target="_blank" href="https://wpa.qq.com/msgrd?v=3&amp;uin=' + concat + '&amp;site=qq&amp;menu=yes" class="qq-btn">' + concat + '</a>';
                    tity = 20;
                }
            }
            else {
                if (isViewSoure != "Y") {
                    concat = res.orderSoure;
                }
            }
        }
        let color = '';

        return '<span lay-tips="该订单来源：' + res.orderSoure + (tity == 10 ? '，点击可以直接和买家旺旺对话(需要安装千牛，并且注意窗口提示，点击打开或确定才可以)' : tity == 20 ? '，点击可以直接和老板QQ对话' : '') + '" style="' + (color) + '">' + (concat == null ? '' : concat) + '</span>';
    }
    function recManRow(res) {
        if (res.recManName == "无权查看") {
            return '<span>无权查看</span>';
        }
        var recMan = res.recManName;
        let color = "";
        if (res.isPushJdp == 'Y' || res.tid) {
            color = 'color:#D15FE8';
        }
        var autoStr = res.isAutoAssignment == "Y" ? '<span class="lableb" style="background-color:#9ACD32;margin-left:3px" lay-tips="该订单开启了智能分配，人员分配顺序为：' + res.autoAssignmentManName + '">智</span>' : '';
        var DLStaffTil = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? "还未设置，点此指派打手" : "当前打手：" + res.recManName + (res.tid ? '' : ' 点击可进入指派')
            , DLStaffClass = (res.recManName == null || res.recManName == "") ? "layui-btn layui-btn-xs layui-btn-normal jsr" : " jsr"
            , DLStaffTxt = (res.recManName == null || res.recManName == "" || res.recManName == '/') ? "指派打手" : res.recManName
            , DLStaff = (res.isAutoAssignment == "Y" && res.recManName != null && res.recManName != "") ? "<a class='lableb' href='javascript:void(0)' style='background-color:#9ACD32;margin-left:3px' lay-tips='该订单已启用了智能分配，智能分配打手分别为：" + (res.autoAssignmentManName != null ? res.autoAssignmentManName.replace("/", "->") : "") + "'>智</a>" : '';

        return '<a class="' + DLStaffClass + '" href="javascript:void(0)" tid="' + (res.tid ? res.tid : '') + '" data-id="' + res.orderId + '" lay-tips="' + DLStaffTil + '" style="' + color + '">' + DLStaffTxt + '</a>' + DLStaff
    }
    function throwPriceRow(res) {
        let color = '#5FB878';
        let title = '该订单已与打手结算了（详细的结算明细请到财务运营/绩效账单里查询）';
        let span = '结';
        let maxTips = '';
        if (res.recFee > res.price) {
            maxTips = 'red;font-weight:600';
        }
        if (res.throwCount == 0 && res.isPushJdp == 'N') {
            return '<a href="javascript:void(0)" class="changeThrowFeeEdit" style="color:' + (maxTips != '' ? maxTips : '#ff6a00') + ';" data-id="' + res.orderId + '" data-fee="' + res.recFee + '" lay-tips="该笔订单还未指派过接手人，可以直接修改抛单价作为记账用，点击修改">' + res.recFee + '</a>';
        }

        let label = '<a href="javascript:void(0)" class="lableb" style="background-color:' + color + '" lay-tips="' + title + '">' + span + '</a>';
        if (res.recSettCount == 0) {
            label = '';
        }

        return label + '<a href="javascript:void(0)" tid="' + (res.tid ? res.tid : '') + '" class="changeThrowFee" style="color:' + (maxTips != '' ? maxTips : '#ff6a00') + ';" data-id="' + res.orderId + '" data-fee="' + res.recFee + '" data-isThrow="' + res.isThrowOrder + '" lay-tips="预计该笔订单总抛单金额：' + res.recFee + '元' + (res.tid ? '' : '，点击可以修改抛单价') + '">' + res.recFee + '</a>';

    }
    function orderPriceRow(res) {
        if (res.tid) {
            return `<a href="javascript:void(0)" style="color:#E03636" lay-tips="安全保证金|效率保证金">${res.recOrderInsureAmount}|${res.serviceAmount}</a>`
        }
        let color = '#E6E6FA';
        let title = '该订单在实际中还未收到款（注意：与代练员或下家结账请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
        let span = '未';
        if (res.isSettStatus == "结算中") {
            color = '#B0E0E6';
            span = '中';
            title = '该订单在实际中处于正在结算中（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
        }
        else if (res.isSettStatus == "已结算") {
            color = '#98FB98';
            span = '收';
            title = '该订单实际中已收款（注意：与代练员或下家结算请到财务运营-绩效管理中操作，此处是用来与发单方/上家进行结算）';
        }
        let payMethod = '默认';
        let serviceAmount = res.serviceAmount;
        if (res.payMethod == 10) {
            payMethod = "花呗付款，其中服务费" + serviceAmount + "元";
        }
        else if (res.payMethod == 20) {
            payMethod = "信用卡付款，其中服务费" + serviceAmount + "元";
        }

        let label = '<a href="javascript:void(0)" tid="' + (res.tid ? res.tid : '') + '" class="lableb jsSta" data-id="' + res.orderId + '" style="background-color:' + color + '" lay-tips="' + title + '">' + span + '</a>';
        return label + '<a href="javascript:void(0)" tid="' + (res.tid ? res.tid : '') + '" class="' + (res.isAllowChangeOrderFee == "N" ? "" : "editOrderPrice") + '" data-id="' + res.orderId + '" data-fee="' + res.price + '" style="color:#E03636;"  lay-tips="该笔订单的接单金额：' + res.price.toFixed(1) + '元' + (isEnableServiceAmount == 'Y' ? '，支付方式：' + payMethod : '') + '（原' + res.originPrice.toFixed(1) + '元，已打' + (res.discount * 10).toFixed(1) + '折）">' + res.price.toFixed(1) + '</a>';
    }
    function orderNetReceiptsRow(res) {
        return label = '<a href="javascript:void(0)" lay-tips="该订单实际收款，点击可以快速修改" class="' + (res.isAllowChangeOrderFee == "N" ? "" : "editNetReceiptsPrice") + '" data-id="' + res.orderId + '" data-fee="' + res.netReceipts + '">' + res.netReceipts + '</a>';
    }
    function orderRefundRow(res) {
        let title = '没有退款，点击可以快速记录退款';
        if (res.refundFee > 0) {
            title = '退款金额：' + res.refundFee + '元，退款方式：' + res.refundModel + '，退款时间：' + res.refundTimeStr + '，操作人：' + res.refundUserName + '，点击可以快速编辑退款';
        }
        let label = '<a href="javascript:void(0)" class="refundFee" data-id="' + res.orderId + '" data-fee="' + res.refundFee + '" data-refundmodel="' + res.refundModel + '" style="' + (res.refundFee > 0 ? "color:red" : "color:#999") + '" lay-tips=' + title + '>' + res.refundFee + '</a>';
        return label;
    }
    function csoure(res) {
        return '<span lay-tips="订单来自：' + res.orderSoure + '">' + res.orderSoure + '</span>';
    }
    function kefuRow(res) {
        return '<span lay-tips="' + res.inputOrderManName + '">' + (res.inputOrderManName ? res.inputOrderManName : '') + '</span>';
    }
    function assUserNameRow(res) {
        let assUserName = res.assUserName == null || res.assUserName == '' ? '无' : res.assUserName;
        return '<span lay-tips="' + assUserName + '">' + assUserName + '</span>';
    }
    function createTimeRow(res) {
        return '<span>' + res.createTime + '</span>';
    }
    function completeTimeRow(res) {
        if (!res.completeTime) {
            return ''
        }
        const timestamp = res.completeTime.replace(/\D/g, '');
        const date = new Date(Number(timestamp));
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `<span>${month}-${day} ${hours}:${minutes}</span>`;
    }

    function jiweiRow(res) {
        let vo = '<a href="javascript:void(0)" lay-tips="' + (res.jiwei == null || res.jiwei == "" || res.jiwei.length < 1 ? '当前没有分配机位，点击可分配' : '当前机位：' + res.jiwei) + '" style="" class="setjiwei" data-id="' + res.orderId + '" data-jiwei="' + res.jiwei + '">' + (res.jiwei == null || res.jiwei == "" || res.jiwei.length < 1 ? "无" : res.jiwei) + '</a>';;
        if (res.groupMangeUid > 0 && (res.jiwei != null && res.jiwei != '')) {
            vo = '<a href="javascript:void(0)" lay-tips="当前订单已分配团长：' + res.jiwei + '" class="setOrderToGroupManger" data-id="' + res.orderId + '" data-man="' + res.jiwei + '">' + res.jiwei + '</a>';
        }
        return vo;
    }
    function orderLogRow(res) {
        return '<a href="javascript:void(0)" lay-tips="' + (res.dynamicRemark != null ? res.dynamicRemark : "点击可以快速添加订单日志") + '" style="" class="orderLogs"  data-id="' + res.orderId + '" data-vieworderid="' + res.orderIdView + '">' + (res.dynamicRemark != null && res.dynamicRemark != '' ? res.dynamicRemark : "无") + '</a>';
    }

    function btnfun(res) {
        if (res.tid) {
            var btnstr = sonbtnfun(res)
            return btnstr
        }
        let editBtn = '<a class="layui-btn layui-btn-xs layui-btn-danger submitEdit" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="编辑订单" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-edit"></i></a>';
        let thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm throwEdit" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="发到内部接单大厅" data-id="' + res.orderId + '" data-fee="' + res.recFee.toFixed(1) + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-home"></i></a>';
        let joinTaskBtn = '<a class="layui-btn layui-btn-xs joinTask" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="将订单加入到排团" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-template-1"></i></a>';
        let pushJdpBtn = '<a class="layui-btn layui-btn-xs layui-btn-normal pushJdpEdit" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="把这笔订单一键发到各大交易平台" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '" data-recMan="' + res.recManName + '"><i class="layui-icon layui-icon-website"></i></a>';
        let sendsmsOrderBtn = '<a class="layui-btn layui-btn-xs sendsmsorderbtn" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="发送短信" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-cellphone"></i></a>';
        if (isNewTaskModel == "Y") {
            joinTaskBtn = '<a class="layui-btn layui-btn-xs addToPostionTask" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="将该笔订单加入到坑位排团模式，适用于魔兽/诛仙世界专用" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-unlink"></i></a>';
        }
        if (gameName != "魔兽世界" && gameName != "诛仙世界") {
            joinTaskBtn = '';
        } else {
            sendsmsOrderBtn = '';
        }
        if (res.isThrowOrder == "Y") {
            thnb = '<a class="layui-btn layui-btn-xs layui-btn-warm cancelThrowHome" style="margin-bottom: 0px;" lay-submit="" lay-tips="从内部接单大厅撤回" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-prev"></i></a>';
        }
        if (res.isPushJdp == 'Y') {
            thnb = '';
            pushJdpBtn = '<a class="layui-btn layui-btn-xs layui-btn-normal pushJdpCancel" style="margin-right: 0px;margin-bottom: 0px;" lay-submit="" lay-tips="把这笔订单从所有第三方交易平台撤回" data-id="' + res.orderId + '" data-viewId="' + res.orderIdView + '"><i class="layui-icon layui-icon-return"></i></a>' + pushJdpBtn;
        }

        let btn = editBtn + thnb + joinTaskBtn + pushJdpBtn + sendsmsOrderBtn;
        return btn
    }
    function remarkRow(res) {
        return '<a href="javascript:void(0)" lay-tips="' + (res.orderRemark != null ? res.orderRemark : "点击可以编辑订单重要备注") + '" style="color:#E03636" class="orderRemark"  data-id="' + res.orderId + '" data-remark="' + (res.orderRemark != null ? res.orderRemark : "") + '">' + (res.orderRemark != null && res.orderRemark != '' ? res.orderRemark : "无") + '</a>';
    }
    function orderLabelRow(res) {
        let obtn = '<span id="lineLabel_' + res.orderId + '" class="selectOrderLabelBtn layui-btn layui-btn-primary layui-btn-xs" data-label="" data-id="' + res.orderId + '" data-game="' + res.gameName + '" title="点击设置订单标签">设标签</span>';
        let labelSpan = res.orderLabel != '' && res.orderLabel != null ? '<div class="selectOrderLabelBtn" data-label="' + res.orderLabel + '" data-id="' + res.orderId + '" data-game="' + res.gameName + '" style="background-color:' + res.orderLabelColor + '!important;color:#fff!important" lay-tips="订单标签：' + res.orderLabel + '，点击可选择移除标签">' + res.orderLabel + '</div>' : '';
        return (res.orderLabel != '' && res.orderLabel != null ? '' : obtn) + labelSpan;
    }
    function tablerender(resList, isViewSoure) {

        var colsdata = [
            { unresize: false, field: '_orderId0', type: 'checkbox', width: 35 },
            {
                unresize: false, title: '订单号', field: '_orderid', width: device ? '12%' : 180, templet: orderIdRow
            },
            {
                unresize: false, title: '系统内置单号', hide: true, field: 'orderId', width: 142, templet: sysorderIdRow
            },
            { unresize: false, title: '角色名', field: '_role', width: device ? '5.5%' : 88, templet: roleNameRow },
            { unresize: false, title: '订单标签', field: '_orderLabel', align: 'center', width: 80, hide: true, templet: orderLabelRow },
            { unresize: false, field: '_remark2', title: '重要备注', width: 80, hide: remarkLocation == "Y" ? false : true, templet: remarkRow },
            { unresize: false, title: '阵营', align: 'center', field: '_group', width: 45, templet: gameGroupRow, hide: gameName.indexOf('魔兽') > -1 || gameName.indexOf('诛仙世界') > -1 ? false : true },
            { unresize: false, title: '代练/陪玩内容', field: '_project', width: device ? '10.4%' : 163, templet: projectRow },
            { unresize: false, title: '角色信息', field: '_info', width: device ? '' : 163, templet: roleInfoRow },
            { unresize: false, title: '状态', align: 'center', field: '_sta', width: 60, templet: orderStaRow },
            { unresize: false, title: '时间', align: 'center', field: '_hour', width: 80, templet: orderHourDescRow },
            { unresize: false, title: '旺旺/来源', align: 'center', field: '_ww', width: device ? '5%' : 85, templet: wangwangRow },
            { unresize: false, title: '订单来源', align: 'center', field: '_soure', width: 100, hide: isViewSoure == 'Y' ? false : true, templet: csoure },
            { unresize: false, title: '接手人', align: 'center', field: '_rec', width: device ? '4.7%' : 80, templet: recManRow },
            { unresize: false, title: '发单价', align: 'center', field: '_throw', width: 78, templet: throwPriceRow },
            { unresize: false, title: '接单价', align: 'center', field: '_price', width: 78, templet: orderPriceRow },
            { unresize: false, title: '实收款', align: 'center', field: '_netreceipts', width: 78, hide: true, templet: orderNetReceiptsRow },
            { unresize: false, title: '退款', align: 'center', field: '_refund', width: 60, hide: true, templet: orderRefundRow },
            {
                unresize: false, field: '_img', align: 'center', title: '订单截图', width: 64, templet: function (res) {
                    var str = '<div class="layui-btn-group">' +
                        '<a href="javascript:void(0)" class="layui-btn layui-btn-xs layui-btn-normal upImg" data-id="' + res.orderId + '" lay-tips="上传截图"><i class="layui-icon">&#xe681;</i></a>' +
                        '<a href="javascript:void(0)" class="layui-btn layui-btn-xs layui-btn-normal mangeImg" data-id="' + res.orderId + '" lay-tips="图片管理' + (res.imgCount > 0 ? '，当前截图数量：' + res.imgCount + '张' : '') + '">' + (res.imgCount > 0 ? '<span class="">' + res.imgCount + (res.imgCount > 9 ? '' : '张') + '</span>' : '<i class="layui-icon">&#xe60d;</i>') + '</a>' +
                        '</div>'
                    return str;
                }
            },
            { unresize: false, field: '_kefu', align: 'center', title: '销售客服', width: 60, templet: kefuRow },
            { unresize: false, field: '_assUserName', align: 'center', hide: true, title: '发单人', width: 60, templet: assUserNameRow },
            { unresize: false, field: '_create', align: 'center', title: '录单时间', width: 75, templet: createTimeRow },
            {
                unresize: false, field: '_completeTime', align: 'center', title: '完单时间', width: 75, templet: completeTimeRow, hide: true
            },
            { unresize: false, field: 'addOrderUserName', hide: true, align: 'center', title: '录单人', width: 60 },
            { unresize: false, field: '_jiwei', title: '机位/团长', width: 68, templet: jiweiRow, hide: isViewSoure == 'Y' ? true : false },
            { unresize: false, field: '_remark', title: '重要备注', width: 80, hide: remarkLocation == "Y" ? true : false, templet: remarkRow },
            { unresize: false, field: '_orderlog', title: '日志', width: 55, templet: orderLogRow },
            { unresize: false, field: '_change', title: '操作', width: 130, templet: btnfun, fixed: 'right' }
        ]

        //从缓存中取隐藏列
        var localTest = layui.data('orderlistlocal');
        if (localTest && localTest.ishide && localTest.ishide.split(',').length != colsdata.length) {
            layui.data('orderlistlocal', null);
        }
        if (localTest && localTest.cols && JSON.parse(localTest.cols).length != colsdata.length) {
            layui.data('orderlistlocal', null);
        }
        if (localTest.ishide) {
            var localarrs = localTest.ishide.split(',');
            localarrs.forEach(function (item, index) {
                colsdata[index].hide = item == 'true' ? true : false;
            })
        }
        if (localTest.cols) {
            var newcols = JSON.parse(localTest.cols);
            for (var i = 0; i < newcols.length; i++) {
                colsdata[i].width = newcols[i].width || '';
            }
        }

        tabelist = treeTable.render({
            elem: '#datatable',
            treeColIndex: 1,
            treeIdName: 'orderId',       // 	id字段的名称
            treePidName: 'orderId',    // 	pid字段的名称
            treeDefaultClose: true,
            data: resList
            , toolbar: '#toolbarDemo'
            , defaultToolbar: ['filter', {
                title: '重置表格排版' //标题
                , layEvent: 'RESET_TABLE' //事件名，用于 toolbar 事件中使用
                , icon: 'layui-icon-fonts-clear' //图标类名
            }]
            , cols: [colsdata]
            , page: false
            , limit: limit
            , limits: [20, 40]
            , done: function (res, curr, count) {
                //$('.layui-table-header').find('[name="layTableCheckbox"]').hide()
                //$('.layui-table-header').find('.layui-form-checkbox').hide()

                //var clone = '<div class=" allCheckbox" lay-skin="primary"><i class="layui-icon layui-icon-ok"></i></div>'
                //$('.layui-table-header').find('.layui-form-checkbox').before(clone);
                $('.layui-table-header').find('.layui-form-checkbox').find('.layui-icon').removeAttr('class').attr('class', allcheckIcon)
                $('[openItem="close"]').parents('tr').hide();
                $('.sontr').parents('tr').addClass('sontrLine').css('background-color', '#fff')
                $('.sontr').parents('tr').children('[data-field="_orderId0"]').children().hide()
                $('.tree_btn').on('click', function () {
                    allcheckIcon = $('.layui-table-header').find('.layui-form-checkbox').find('.layui-icon').attr('class')
                    var orderId = $(this).attr('data-id')
                    if ($('.fromId-' + orderId).length > 0 || $(this).hasClass('openValue')) {
                        if ($(this).hasClass('layui-icon-triangle-r')) {
                            $('.tree_btn.layui-icon-triangle-d').removeClass('layui-icon-triangle-d').addClass('layui-icon-triangle-r')
                            $(this).removeClass('layui-icon-triangle-r').addClass('layui-icon-triangle-d')
                            $('.sontrLine').hide()
                        } else if ($(this).hasClass('layui-icon-triangle-d')) {
                            let indexToInsertAfter = -1;
                            var dataList = getDataList("datatable");
                            dataList.forEach(item => {
                                if (item.fromId == orderId) {
                                    item.openItem = 'close';
                                }
                            });
                            for (let i = 0; i < dataList.length; i++) {
                                if (dataList[i].orderId == orderId) {
                                    indexToInsertAfter = i;
                                    break;
                                }
                            }
                            if (indexToInsertAfter != -1) {
                                dataList[indexToInsertAfter].openValue = 'close'
                            }

                            $(this).removeClass('layui-icon-triangle-d').addClass('layui-icon-triangle-r')
                        }
                        $('.fromId-' + orderId).parents('tr').toggle();
                        return false
                    }

                    $.ajax({
                        url: '/OrderAjax/GetTransactionOrderByOrderIdFunc?orderId=' + orderId,
                        method: 'GET',
                        success: function (res) {
                            let indexToInsertAfter = -1;
                            var dataList = getDataList("datatable");
                            for (let i = 0; i < dataList.length; i++) {
                                if (dataList[i].orderId == orderId) {
                                    indexToInsertAfter = i;
                                    break;
                                }
                            }
                            res.data.forEach(item => {
                                item.fromId = orderId;
                            });
                            dataList.forEach(item => {
                                if (item.tid) {
                                    item.openItem = 'close'
                                }
                                if (item.isPushJdp == 'Y') {
                                    item.openValue = 'close'
                                }
                            })

                            if (indexToInsertAfter != -1) {
                                dataList[indexToInsertAfter].openValue = 'open'
                                res.data.forEach(item => {
                                    item.openItem = 'open';
                                });
                                dataList.splice(indexToInsertAfter + 1, 0, ...res.data);
                            }

                            table.renderData("datatable", {
                                data: dataList
                            })


                        },
                    });
                })
                var isdrag;
                $('tr th').on('mousedown', function (e) {
                    if (e.currentTarget.clientWidth - e.offsetX <= 10) {
                        isdrag = true
                    }
                })
                $('tr th').on('mouseup', function (e) {
                    if (isdrag) {
                        var arrs = tabelist.config.cols[0];
                        arrs[e.currentTarget.cellIndex].width = e.currentTarget.clientWidth;
                        layui.data('orderlistlocal', {
                            key: 'cols'
                            , value: JSON.stringify(arrs)
                        });
                        isdrag = false;
                    }
                })
            }
        });
        table.on('rowDouble(datatable)', function (obj) {
            var data = obj.dataCache
            var orderId = obj.dataCache.orderId
            if (data.isPushJdp != 'Y') return false
            if ($('.fromId-' + orderId).length > 0 || $('#order_' + orderId).hasClass('openValue')) {
                if ($('#order_' + orderId).children('.tree_btn ').hasClass('layui-icon-triangle-r')) {
                    $('.tree_btn.layui-icon-triangle-d').removeClass('layui-icon-triangle-d').addClass('layui-icon-triangle-r')
                    $('#order_' + orderId).children('.tree_btn ').removeClass('layui-icon-triangle-r').addClass('layui-icon-triangle-d')
                    $('.sontrLine').hide()

                } else if ($('#order_' + orderId).children('.tree_btn ').hasClass('layui-icon-triangle-d')) {
                    let indexToInsertAfter = -1;
                    var dataList = getDataList("datatable");
                    dataList.forEach(item => {
                        if (item.fromId == orderId) {
                            item.openItem = 'close';
                        }
                    });
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].orderId == orderId) {
                            indexToInsertAfter = i;
                            break;
                        }
                    }
                    if (indexToInsertAfter != -1) {
                        dataList[indexToInsertAfter].openValue = 'close'
                    }

                    $('#order_' + orderId).children('.tree_btn ').removeClass('layui-icon-triangle-d').addClass('layui-icon-triangle-r')
                }
                $('.fromId-' + orderId).parents('tr').toggle();
                return false
            }
            $.ajax({
                url: '/OrderAjax/GetTransactionOrderByOrderIdFunc?orderId=' + orderId,
                method: 'GET',
                success: function (res) {
                    let indexToInsertAfter = -1;
                    var dataList = getDataList("datatable");
                    for (let i = 0; i < dataList.length; i++) {
                        if (dataList[i].orderId == orderId) {
                            indexToInsertAfter = i;
                            break;
                        }
                    }
                    res.data.forEach(item => {
                        item.fromId = orderId;
                    });
                    dataList.forEach(item => {
                        if (item.tid) {
                            item.openItem = 'close'
                        }
                        if (item.isPushJdp == 'Y') {
                            item.openValue = 'close'
                        }
                    })

                    if (indexToInsertAfter != -1) {
                        dataList[indexToInsertAfter].openValue = 'open'
                        res.data.forEach(item => {
                            item.openItem = 'open';
                        });
                        dataList.splice(indexToInsertAfter + 1, 0, ...res.data);
                    }

                    table.renderData("datatable", {
                        data: dataList
                    })

                },
            });
        });
        table.on('row(datatable)', function (obj) {
            var tr = obj.tr;
            $('.layui-table-box .layui-table-body tr').removeClass('selectTr')
            tr.addClass('selectTr')
        });

        function getDataList(tableId) {
            if (table.cache[tableId]) {
                return table.cache[tableId];
            }
            return [];
        }
        table.on('toolbar(datatable)', function (obj) {
            switch (obj.event) {
                case 'LAYTABLE_COLS':
                    $('ul.layui-table-tool-panel li').on('click', function () {
                        var arrs = tabelist.config.cols;
                        var strs = [];
                        arrs[0].forEach(function (item, index) {
                            strs.push(item.hide)
                        })
                        layui.data('orderlistlocal', {
                            key: 'ishide'
                            , value: strs.join(',')
                        });
                    })
                    break;
                case 'RESET_TABLE':
                    layer.confirm('是否重置表格排版', function (index) {
                        layui.data('orderlistlocal', null);
                        reloadOrderList();
                        layer.close(index)
                    });
                    break;
            };
        });

        table.on('checkbox(datatable)', function (obj) {
            if (obj.checked == true) {
                //勾选
                if (obj.type == 'one') {
                    //单选
                    allIds.push(obj.data.orderId);
                    let selectModel = {
                        orderId: obj.data.orderId,
                        price: obj.data.price,
                        recFee: obj.data.recFee
                    };
                    if ($.inArray(selectModel, selectLineRowTotalPrice) == -1) {
                        selectLineRowTotalPrice.push(selectModel);
                    }
                } else {
                    //全选
                    selectLineRowTotalPrice = [];
                    var selectedData = table.checkStatus('datatable').data;
                    selectedData = selectedData.filter(item => !item.tid);
                    $.each(selectedData, function (idx, item) {
                        if (!item.tip) {
                            allIds.push(item.orderId);
                            let selectModel = {
                                orderId: item.orderId,
                                price: item.price,
                                recFee: item.recFee
                            };
                            selectLineRowTotalPrice.push(selectModel);
                        }
                    });
                }
            } else {
                //反选
                if (obj.type == 'one') {
                    let s = selectLineRowTotalPrice.length;
                    while (s--) {
                        if (selectLineRowTotalPrice[s].orderId == obj.data.orderId) {
                            selectLineRowTotalPrice.splice(s, 1);
                        }
                    }

                    let i = allIds.length;
                    while (i--) {
                        if (allIds[i] == obj.data.orderId) {
                            allIds.splice(i, 1);
                        }
                    }
                } else {
                    selectLineRowTotalPrice = [];
                    $.each(currentData, function (idx, val) {
                        if ($.inArray(val, allIds) == -1) {
                            //不在数组中，不做处理
                        }
                        else {
                            //删除
                            allIds.splice($.inArray(val, allIds), 1);
                        }
                    });
                }
            }
            let totalSelectTotal1 = 0;
            let totalSelectTotal2 = 0;
            $.each(selectLineRowTotalPrice, function (idx, item) {
                totalSelectTotal1 += item.price;
                totalSelectTotal2 += item.recFee;
            });
            if (totalSelectTotal1 == 0 && totalSelectTotal2 == 0) {
                $('.selectTotal').html('');
            }
            else {
                $('.selectTotal').html('(勾选统计接单价：' + totalSelectTotal1 + '，发单价：' + totalSelectTotal2 + ')');
            }
            refreshCheckBox();
        });
        //table.on('row(datatable)', function (obj) { 
        //    // 标注当前点击行的选中状态
        //    obj.setRowChecked({
        //        type: 'radio'
        //    }); 
        //});
    }
    function ajaxData(params) {
        if (!params || typeof params !== 'object') return;
        $.ajax({
            url: '/OrderAjax/GetOrderList'
            , type: 'POST'
            , data: params
            , dataType: 'json',
            error: function () { layer.msg('数据读取错误，请刷新重试！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        }).done(function (resData) {
            layer.close(indexLoad);
            if (resData.msg == "请先登录") {
                layer.msg("登录过期了，请重新登录系统");
                return;
            }
            if (resData.msg.indexOf("时间跨度") > -1) {
                layer.msg(resData.msg);
                return;
            }
            if (!resData.data) return;
            var resList = resData.data;
            if (gameName.indexOf('魔兽') > -1 || gameName.indexOf('诛仙世界') > -1) {
                $(".group").show();
                $(".task").show();
                $(".taskman").show();
            } else {
                $(".group").hide();
                $(".task").hide();
                $(".taskman").hide();
            }

            var Html = '';
            var moreOpenOrderDetails = $("#moreOpenOrderDetails").val();
            tablerender(resList, isViewSoure);
            let totalPrice = resData.total.TotalPrice;
            let totalRecFee = resData.total.TotalRecFee;
            let totalReFundAmount = resData.total.TotalReFundAmount;
            let totalProfit = totalPrice - totalReFundAmount;
            totalProfit = totalProfit - (totalRecFee);
            if ((totalPrice - totalReFundAmount) < 1 && totalRecFee < 0) {
                totalProfit = Math.abs(totalProfit);
            }
            var total = '本次' + (batchOrderId != '' ? '<span style="color:#000;font-size:14px">按单号批量</span>' : params.showPriceType == 3 ? '<span style="color:#000;font-size:14px">按接发接单+发单价组合</span>' : '') + '搜索统计共' + resData.total.TotalCount + '笔，预计总发单价' + resData.total.TotalRecFee + '元(不含销售提成)，总接单价' + resData.total.TotalPrice
                + '元' + (isViewNetReceipts == 'Y' ? '(实际总收款' + resData.total.TotalNetReceipts + '元)' : '') + '，总退款' + resData.total.TotalReFundAmount + '元，' + (isEnableServiceAmount == 'Y' ? '(花呗付款' + resData.total.payMethodByHB + '笔，服务费' + resData.total.payMethodByHBAmount + '元，信用卡付款'
                    + resData.total.payMethodBycreditCard + '笔，服务费' + resData.total.payMethodBycreditCardAmount + '元)，' : '') + '预计利润'
                + totalProfit.toFixed(2) + '元(含已退单部分)。其中：<span style="cursor:pointer" class="statustab" data-tit="未分配" lay-tips="点击可以快速筛选未分配的订单">未分配' + resData.total.WFP
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="待上号" lay-tips="点击可以快速筛选待上号的订单">待上号' + resData.total.DSH
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="代练中" lay-tips="点击可以快速筛选代练中的订单">代练中' + resData.total.DLZ
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="待验收" lay-tips="点击可以快速筛选待验收的订单">待验收' + resData.total.DYS
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="已完成" lay-tips="点击可以快速筛选已完成的订单">已完成' + resData.total.YWC
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="已暂停" lay-tips="点击可以快速筛选已暂停的订单">已暂停' + resData.total.YZT
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="问题单" lay-tips="点击可以快速筛选问题单的订单">问题单' + resData.total.WTD
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="异常中" lay-tips="点击可以快速筛选异常中的订单">异常中' + resData.total.YCZ
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="已退单" lay-tips="点击可以快速筛选已退单的订单">已退单' + resData.total.YTD
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="撤销中" lay-tips="点击可以快速筛选撤销中的订单">撤销中' + resData.total.CXZ
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="仲裁中" lay-tips="点击可以快速筛选仲裁中的订单">仲裁中' + resData.total.ZCZ
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="已仲裁" lay-tips="点击可以快速筛选已仲裁的订单">已仲裁' + resData.total.YZC
                + '笔</span>，<span style="cursor:pointer" class="statustab" data-tit="已撤销" lay-tips="点击可以快速筛选已撤销的订单">已撤销' + resData.total.YCX
                + '笔</span>';
            $(".total").html(total);
            batchOrderId = ""; //每次查询完将批量单号置空
            pageFlag = false;
            countPage = resData.count;
            selectLineRowTotalPrice = [];
            $('.statustab').on('click', function () {
                let val = $(this).attr('data-tit');
                formSelects.value('orderSta', []);
                formSelects.value('orderSta', [val]);
                form.render();
                $('.sechbtn').click();
            })
            if (!clickLock) {
                pagation();
            }
            clickLock = false;
            if (params.gameName == '魔兽世界' && params.taskId == '10' && params.orderSta == '未分配') {
                $('.zyTotal').show()
            } else {
                $('.zyTotal').hide()
            }

            //设置当前页选中项
            currentData = [];
            $.each(resData.data, function (idx, val) {
                currentData.push(val.orderId);
                if (allIds.indexOf(val.orderId) > -1) {
                    val["LAY_CHECKED"] = 'true';
                    //找到对应数据改变勾选样式，呈现出选中效果
                    let index = val['LAY_INDEX'];
                    $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', 'true');
                    form.render('checkbox'); //刷新checkbox选择框渲染
                }
            });
            // 获取表格勾选状态，全选中时设置全选框选中
            //重载翻页事件
            $('.layui-laypage-default a[data-page],.layui-laypage-btn').unbind('click').bind('click', function () {
                if ($(this).hasClass('layui-disabled')) {
                    return;
                }
                refreshCheckBox();
            });
            $('.layui-laypage-limits select').unbind('change').bind('change', function () {
                refreshCheckBox();
            });
            setTimeout(function () {
                $('.layui-table-cell').attr('title', function () {//单元格鼠标放上去显示单元中文字内容
                    return this.innerText;
                })
            });
            let toPage = countPage / limit;
            if ($("#showPriceType").val() == 3) {
                //只有1页时才重置组合价搜索
                if (toPage <= 1.0000) {
                    form.val("form", {
                        "showPriceType": 0
                    });
                }
            }
            form.render();
        })
    }
    var refreshCheckBox = function () {
        var c = $('.layui-table-header th[data-field="0"] input[type="checkbox"]');
        if (allIds.length == currentData.length && currentData.length && currentData.length > 0) {
            c.prop('checked', true);
        } else {
            c.prop('checked', false);
        }
        form.render('checkbox'); //刷新checkbox选择框渲染
    }
    var pageFlag = false, countPage = 0, clickLock = false;
    function pagation() {
        if (countPage <= limit) {
            $('#page').hide();
        } else {
            $('#page').show();
        }
        layPage.render({
            elem: 'page'
            , limit: limit
            , limits: [10, 20, 30, 40, 50, 100]
            , curr: currPage
            , count: countPage //数据总数
            , layout: ['count', 'prev', 'page', 'next', 'limit']
            , jump: function (obj) {
                currPage = obj.curr;
                limit = obj.limit;
                pageFlag = true;
                setTimeout(function () {
                    if (clickLock) {
                        getOrderData();
                        //$(".sechbtn").trigger("click");
                    }
                }, 500)
            }
        });
    }
    $('#page').click('a', function () {
        clickLock = true;
    })
    setTimeout(function () {
        $(".sechbtn").trigger("click");
    }, 500);
    form.on('select(selectSeach1)', function (data) {
        var value = data.value;
        sechbtnValue = false
        if (value == 10) {
            layer.prompt({
                formType: 2,
                value: '',
                btn: ['搜索', '关闭'],
                title: '按单号批量查询，每行一笔单号。注意：该搜索会排除其它搜索条件',
                area: ['520px', '300px'] // 自定义文本域宽高 
                , end: function () {
                    sechbtnValue = true
                    //关闭
                    endBatchOrderKeyLayer();
                }
            }, function (value, index, elem) {
                sechbtnValue = true
                if (value == null || value == undefined || value == '' || value.length < 5) {
                    layer.msg('单号格式不符合要求');
                    layer.close(index); // 关闭层
                    endBatchOrderKeyLayer();
                    return false;
                }
                batchOrderId = value.replace(/\r?\n/g, ',');
                allIds = []; //清除勾选的记录
                layer.close(index); // 关闭层
                $(".sechbtn").trigger("click");
            }
            )
        }
        else if (value == 5) {
            $("#key1").attr("placeholder", "请输入交易平台单号");
        }
        else if (value == 2) {
            $("#key1").attr("placeholder", "请输入电话号码");
        }
        else if (value == 3) {
            $("#key1").attr("placeholder", "请输入游戏角色名");
        }
        else {
            $("#key1").attr("placeholder", "请输入系统订单号");
        }
        $("#key1").get(0).focus();
        return false;
    });
    /**
     * 关闭批量单号搜索弹层
     * */
    function endBatchOrderKeyLayer() {
        form.val("form", {
            "selectSeach1": 0
        });
        form.render($('#selectSeach1'));
    }
    form.on('checkbox(allChoose)', function (data) {
        var child = $(data.elem).parents('table').find('tbody input[type="checkbox"]');
        child.each(function (index, item) {
            item.checked = data.elem.checked;
        });
        form.render('checkbox');
    });
    /**
     * 点击搜索按钮
     * */
    form.on('submit(seachBtnOk)', function (data) {
        allIds = []; //清除勾选的记录
        //$(".sechbtn").trigger("click");
        getOrderData();
    });
    function getOrderData(s) {
        let qainput = $("#qainput").val();
        if (qainput != '') {
            layer.open({
                title: "搜索QA：" + qainput,
                shade: [0.3, '#333'],
                shadeClose: true,
                maxmin: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['95%', '95%'],
                content: '/Emp/QACenter?seachKey=' + qainput
            });
            $("#qainput").val('');
            return false;
        }
        if (!pageFlag) {
            currPage = 1;
        }
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        minPrice = $("#minPrice").val();
        maxPirce = $("#maxPirce").val();
        var gameServer = $("#gameServer").val();
        var gameJob = formSelects.value('gameJob', 'nameStr');
        var groupName = formSelects.value('gameGroup', 'nameStr');
        var orderSta = formSelects.value('orderSta', 'valStr');
        var projectTypeName = formSelects.value('projectType', 'nameStr');
        var project = formSelects.value('projectSelect', 'nameStr');
        var recType = $("#recType").val();
        var kefuType = $("#kefuType").val();
        var key4Type = $("#key4Type").val();
        var recUser = 0
        var operator = ''
        if (recType == 10) {
            recUser = 0;
            operator = OperatorSelect && typeof OperatorSelect.getValue === 'function'
                ? OperatorSelect.getValue('nameStr')
                : '';
        } else {
            operator = '';
            recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
                ? RecUserSelect.getValue('valueStr')
                : '';
        }
        var orderKefu = formSelects.value('inputOrderKefu', 'valStr');
        var taskId
        if (formSelects.value('taskSelect')[0]) {
            if (formSelects.value('taskSelect')[0].innerHTML) {
                taskId = formSelects.value('taskSelect')[0].value
            } else {
                taskId = formSelects.value('taskSelect')[0].name
            }
        }
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var orderGroupUser = formSelects.value('orderGroupUser', 'valStr');
        var setSta = formSelects.value('setSta', 'valStr');
        var timeType = $("#dateType").val();
        var showPriceType = $("#showPriceType").val();
        var skey1 = $("#key1").val();
        var skey2 = $("#key2").val();
        var skey4 = $("#key4").val();
        var gameAcc = $("#gameAcc").val();
        var keytid = $("#keytid").val();
        var isJiaji = $("input[name='isJiajiCheck']").prop('checked') === true ? "Y" : "";
        var isLeakOrder = $("input[name='viewLeakOrder']").prop('checked') === true ? "Y" : "";
        var bussType = $("#bussType option:selected").val();
        var selectSeach1 = $("#selectSeach1").val();
        var orderLabel = $("#orderLabel").val();

        seachParam = 'gameName=' + gameName + '&stime=' + encodeURIComponent(sDate) + '&etime=' + encodeURIComponent(eDate) +
            '&gameServer=' + gameServer + '&gameJob=' + gameJob + '&project=' + project + '&recUserId=' + recUser +
            '&customerServiceUserId=' + orderKefu + '&orderSoure=' + orderSoure + '&taskId=' + taskId + '&orderGroupUser=' + orderGroupUser + '&setSta=' + setSta +
            '&timeType=' + timeType + '&groupName=' + groupName + '&orderSta=' + orderSta + '&minPrice=' + minPrice + '&maxPrice=' + maxPirce + '&key1=' + skey1 +
            '&key2=' + skey2 + '&key3=' + gameAcc + '&key4=' + skey4 + '&limit=' + limit + '&isJiaji=' + isJiaji + '&isLeakOrder=' + isLeakOrder + '&showPriceType=' + showPriceType + '&operatorName=' + operator + '&bussType=' + bussType +
            "&kefuType=" + kefuType + '&projectTypeName=' + projectTypeName + '&batchOrderId=' + batchOrderId + '&keytid=' + keytid +
            '&selectSeach1=' + selectSeach1 + '&orderLabel=' + orderLabel + '&taskId=' + taskId + '&key4Type=' + key4Type;
        if (timeType == 10) {
            $(".timetitle").html('录单时间');
        }
        else if (timeType == 20) {
            $(".timetitle").html('开始时间');
        } else if (timeType == 30) {
            $(".timetitle").html('完成时间');
        } else if (timeType == 40) {
            $(".timetitle").html('收款时间');
        }
        params = {
            page: currPage
            , taskId: taskId
            , gameName: gameName
            , stime: encodeURIComponent(sDate)
            , etime: encodeURIComponent(eDate)
            , gameArea: ''
            , gameServer: gameServer
            , gameJob: gameJob
            , project: project
            , recUserId: recUser
            , customerServiceUserId: orderKefu
            , orderSoure: orderSoure
            , taskId: taskId
            , orderGroupUser: orderGroupUser
            , setSta: setSta
            , timeType: timeType
            , groupName: groupName
            , orderSta: orderSta
            , minPrice: minPrice
            , maxPrice: maxPirce
            , key1: skey1,
            key2: skey2,
            key3: gameAcc,
            key4: skey4,
            limit: limit,
            isJiaji: isJiaji,
            isLeakOrder: isLeakOrder,
            showPriceType: showPriceType,
            operatorName: operator,
            bussType: bussType,
            kefuType: kefuType,
            projectTypeName: projectTypeName,
            batchOrderId: batchOrderId,
            keytid: keytid,
            selectSeach1: selectSeach1,
            orderLabel: orderLabel,
            seachMutPrice1: seachMutPrice1,
            seachMutPrice2: seachMutPrice2,
            seachMutPrice3: seachMutPrice3,
            seachMutPrice4: seachMutPrice4,
            key4Type
        };
        ajaxData(params);
        return false;
    }
    form.on('submit(seachBtn)', function (data) {
        let qainput = $("#qainput").val();
        if (qainput != '') {
            layer.open({
                title: "搜索QA：" + qainput,
                shade: [0.3, '#333'],
                shadeClose: true,
                maxmin: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['95%', '95%'],
                content: '/Emp/QACenter?seachKey=' + qainput
            });
            $("#qainput").val('');
            return false;
        }
        if (!pageFlag) {
            currPage = 1;
        }
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        minPrice = $("#minPrice").val();
        maxPirce = $("#maxPirce").val();
        var gameServer = $("#gameServer").val();
        var gameJob = formSelects.value('gameJob', 'nameStr');
        var groupName = formSelects.value('gameGroup', 'nameStr');
        var orderSta = formSelects.value('orderSta', 'valStr');
        var projectTypeName = formSelects.value('projectType', 'nameStr');
        var project = formSelects.value('projectSelect', 'nameStr');
        var recType = $("#recType").val();
        var kefuType = $("#kefuType").val();
        var recUser = 0
        var operator = ''
        if (recType == 10) {
            recUser = 0;
            operator = OperatorSelect && typeof OperatorSelect.getValue === 'function'
                ? OperatorSelect.getValue('nameStr')
                : '';
        } else {
            operator = '';
            recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
                ? RecUserSelect.getValue('valueStr')
                : '';
        }

        var orderKefu = formSelects.value('inputOrderKefu', 'valStr');
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var taskId = $("#taskSelect").val();// formSelects.value('taskSelect', 'valStr');
        var orderGroupUser = formSelects.value('orderGroupUser', 'valStr');
        var setSta = formSelects.value('setSta', 'valStr');
        var timeType = $("#dateType").val();
        var showPriceType = $("#showPriceType").val();
        var skey1 = $("#key1").val();
        var skey2 = $("#key2").val();
        var skey4 = $("#key4").val();
        var gameAcc = $("#gameAcc").val();
        var isJiaji = $("input[name='isJiajiCheck']").prop('checked') === true ? "Y" : "";
        var isLeakOrder = $("input[name='viewLeakOrder']").prop('checked') === true ? "Y" : "";
        var bussType = $("#bussType option:selected").val();
        var selectSeach1 = $("#selectSeach1").val();
        var orderLabel = $("#orderLabel").val();

        seachParam = 'gameName=' + gameName + '&stime=' + encodeURIComponent(sDate) + '&etime=' + encodeURIComponent(eDate) +
            '&gameServer=' + gameServer + '&gameJob=' + gameJob + '&project=' + project + '&recUserId=' + recUser +
            '&customerServiceUserId=' + orderKefu + '&orderSoure=' + orderSoure + '&taskId=' + taskId + '&orderGroupUser=' + orderGroupUser + '&setSta=' + setSta +
            '&timeType=' + timeType + '&groupName=' + groupName + '&orderSta=' + orderSta + '&minPrice=' + minPrice + '&maxPrice=' + maxPirce + '&key1=' + skey1 +
            '&key2=' + skey2 + '&key3=' + gameAcc + '&key4=' + skey4 + '&limit=' + limit + '&isJiaji=' + isJiaji + '&isLeakOrder=' + isLeakOrder + '&showPriceType=' + showPriceType + '&operatorName=' + operator + '&bussType=' + bussType +
            "&kefuType=" + kefuType + '&projectTypeName=' + projectTypeName + '&batchOrderId=' + batchOrderId + '&selectSeach1=' + selectSeach1 + '&orderLabel=' + orderLabel;

        if (timeType == 10) {
            $(".timetitle").html('录单时间');
        }
        else if (timeType == 20) {
            $(".timetitle").html('开始时间');
        } else if (timeType == 30) {
            $(".timetitle").html('完成时间');
        } else if (timeType == 40) {
            $(".timetitle").html('收款时间');
        }

        params = {
            page: currPage
            , gameName: gameName
            , stime: encodeURIComponent(sDate)
            , etime: encodeURIComponent(eDate)
            , gameArea: ''
            , gameServer: gameServer
            , gameJob: gameJob
            , project: project
            , recUserId: recUser
            , customerServiceUserId: orderKefu
            , orderSoure: orderSoure
            , taskId: taskId
            , orderGroupUser: orderGroupUser
            , setSta: setSta
            , timeType: timeType
            , groupName: groupName
            , orderSta: orderSta
            , minPrice: minPrice
            , maxPrice: maxPirce
            , key1: skey1,
            key2: skey2,
            key3: gameAcc,
            key4: skey4,
            limit: limit,
            isJiaji: isJiaji,
            isLeakOrder: isLeakOrder,
            showPriceType: showPriceType,
            operatorName: operator,
            bussType: bussType,
            kefuType: kefuType,
            projectTypeName: projectTypeName,
            batchOrderId: batchOrderId,
            orderLabel: orderLabel,
            seachMutPrice1: seachMutPrice1,
            seachMutPrice2: seachMutPrice2,
            seachMutPrice3: seachMutPrice3,
            seachMutPrice4: seachMutPrice4
        };
        ajaxData(params);
        return false;
    });
    form.on('submit(refresh)', function (data) {
        reloadOrderList();
        return false;
    });
    form.on('submit(setRecMan)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        zpOrder(IDX.join(','));
        return false;
    });
    form.on('submit(changeStaBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        changeOrderSta(IDX.join(','));
        return false;
    });
    form.on('submit(changetypesBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        settypeLayer = layer.open({
            title: "修改订单类型",
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
        return false;
    });
    form.on('submit(setOrderLockBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的订单！', { time: 800 });
            return false;
        }
        changeOrderLock(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderThrowHomeBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        throwOrderToInternal(IDX.join(','), 0);
        return false;
    });
    form.on('submit(throwToJdpTransctionBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录，且只能选择一笔订单！', { time: 800 });
            return false;
        }
        let orderId = IDX[0];
        throwToJdpTransction(orderId, orderId);
        return false;
    });
    form.on('submit(cleanOrderJdpTransctionBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录，且只能选择一笔订单！', { time: 800 });
            return false;
        }
        let orderId = IDX[0];
        cancelThrowJdpTransction(orderId);
        return false;
    });
    form.on('submit(cleanOrderThrowHomeBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        CancelInternalThorwOrder(IDX.join(','));
        return false;
    });
    form.on('submit(exportBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        var orderID = '';
        if (IDX.length > 0) {
            orderID = IDX.join(',');
        }
        if (IDX.length > 50) {
            layer.alert('勾选的情况下导出订单，每次最多只支持50笔。如果需要导出全部查询结果，可以不用勾选', function (xx) {
                layer.close(xx);
                return false;
            })
            return false;
        }
        exportOrder(orderID);
        return false;
    });
    form.on('submit(setJiWei)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setJiWei(IDX.join(','));
        return false;
    });
    form.on('submit(copyToNewOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        copyOrderToNewOrder(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderToTaskBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        addOrderToTask(IDX.join(','), 1);
        return false;
    });
    form.on('submit(cleanOrderBtTaskBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        cleanOrderByTask(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderTipsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        OrderIDX = IDX.join(',')
        bindSelectOrderTipsBtn();
        return false;
    });
    form.on('submit(setOrderSoureIdBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setOrderSoureId(IDX.join(','), '');
        return false;
    });
    form.on('submit(cleanOrderTipsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }

        OrderIDX = IDX.join(',')
        bindSelectOrderTipsBtn();
        return false;
    });
    form.on('submit(setOrderJiajiBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeOrderJiaji(IDX);
        return false;
    });
    form.on('submit(sendSmsBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        sendSms(IDX);
        return false;
    });
    form.on('submit(setOrderJSBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeSettOrderStatus(IDX);
        return false;
    });

    $(document).on('click', '.zyTotal', function () {

        // return false;
        if (!pageFlag) {
            currPage = 1;
        }
        sDate = $("#sDate").val();
        eDate = $("#eDate").val();
        minPrice = $("#minPrice").val();
        maxPirce = $("#maxPirce").val();
        var gameServer = $("#gameServer").val();
        var gameJob = formSelects.value('gameJob', 'nameStr');
        var groupName = formSelects.value('gameGroup', 'nameStr');
        var orderSta = formSelects.value('orderSta', 'valStr');
        var projectTypeName = formSelects.value('projectType', 'nameStr');
        var project = formSelects.value('projectSelect', 'nameStr');
        var recType = $("#recType").val();
        var kefuType = $("#kefuType").val();

        var recUser = 0
        var operator = ''
        if (recType == 10) {
            recUser = 0;
            operator = OperatorSelect && typeof OperatorSelect.getValue === 'function'
                ? OperatorSelect.getValue('nameStr')
                : '';
        } else {
            operator = '';
            recUser = RecUserSelect && typeof RecUserSelect.getValue === 'function'
                ? RecUserSelect.getValue('valueStr')
                : '';
        }
        var orderKefu = formSelects.value('inputOrderKefu', 'valStr');
        var orderSoure = formSelects.value('orderSoures', 'valStr');
        var taskId
        if (formSelects.value('taskSelect')[0]) {
            if (formSelects.value('taskSelect')[0].innerHTML) {
                taskId = formSelects.value('taskSelect')[0].value
            } else {
                taskId = formSelects.value('taskSelect')[0].name
            }
        }
        var orderGroupUser = formSelects.value('orderGroupUser', 'valStr');
        var setSta = formSelects.value('setSta', 'valStr');
        var timeType = $("#dateType").val();
        var showPriceType = $("#showPriceType").val();
        var skey1 = $("#key1").val();
        var skey2 = $("#key2").val();
        var skey4 = $("#key4").val();
        var gameAcc = $("#gameAcc").val();
        var isJiaji = $("input[name='isJiajiCheck']").prop('checked') === true ? "Y" : "";
        var isLeakOrder = $("input[name='viewLeakOrder']").prop('checked') === true ? "Y" : "";
        var bussType = $("#bussType option:selected").val();
        var selectSeach1 = $("#selectSeach1").val();
        var orderLabel = $("#orderLabel").val();

        if (timeType == 10) {
            $(".timetitle").html('录单时间');
        }
        else if (timeType == 20) {
            $(".timetitle").html('开始时间');
        } else if (timeType == 30) {
            $(".timetitle").html('完成时间');
        } else if (timeType == 40) {
            $(".timetitle").html('收款时间');
        }

        params = {
            page: currPage
            , gameName: gameName
            , stime: encodeURIComponent(sDate)
            , etime: encodeURIComponent(eDate)
            , gameArea: ''
            , gameServer: gameServer
            , gameJob: gameJob
            , project: project
            , recUserId: recUser
            , customerServiceUserId: orderKefu
            , orderSoure: orderSoure
            , taskId: taskId
            , orderGroupUser: orderGroupUser
            , setSta: setSta
            , timeType: timeType
            , groupName: groupName
            , orderSta: orderSta
            , minPrice: minPrice
            , maxPrice: maxPirce
            , key1: skey1,
            key2: skey2,
            selectSeach1: selectSeach1,
            key3: gameAcc,
            key4: skey4,
            limit: limit,
            isJiaji: isJiaji,
            isLeakOrder: isLeakOrder,
            showPriceType: showPriceType,
            operatorName: operator,
            bussType: bussType,
            kefuType: kefuType,
            projectTypeName: projectTypeName,
            batchOrderId: batchOrderId,
            orderLabel: orderLabel,
            seachMutPrice1: seachMutPrice1,
            seachMutPrice2: seachMutPrice2,
            seachMutPrice3: seachMutPrice3,
            seachMutPrice4: seachMutPrice4
        };


        layer.open({
            title: '查看职业统计',
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '390px' : '95%', isPc ? '645px' : '95%'],
            content: `
                <table class="datatable layui-hide" id="jobdatatable" style="table-layout:fixed; " lay-filter="jobdatatable"></table>
            `,
            success: function () {
                $.ajax({
                    type: "GET",
                    url: "/OrderAjax/GetOrderJobGroupTotal",
                    data: params,
                    dataType: 'json',
                    timeout: 60000,
                    error: function () { layer.msg('出现错误'); },
                    success: function (data) {
                        if (data.code > 0) {
                            // if(!data.data||!data.data.length) {
                            //     return false
                            // }
                            var tableChart = table.render({
                                elem: '#jobdatatable'
                                , defaultToolbar: []
                                , width: '100%'
                                , data: data.data
                                , cols: [[
                                    {
                                        field: 'alias', title: '职业', width: 115, unresize: false, align: 'center'
                                    }
                                    , {
                                        field: 'total', title: '数量', sort: true, width: 135, unresize: false, align: 'center',
                                    }
                                    , {
                                        field: 'ratios', title: '职业比例', sort: true, width: 135, unresize: false, align: 'center', templet: function (d) {
                                            vo = '<div >' + d.ratios + '%</div>';
                                            return vo;
                                        }
                                    }
                                ]]
                                , done: function (res, curr, count) {

                                }
                            });

                        }
                        else {
                            layer.alert(data.msg);
                        }
                    }
                });
            }
        });


    });
    form.on('submit(delOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        delOrder(IDX);
        return false;
    });
    form.on('submit(changeOrderPriceBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeOrderPrice(0, IDX);
        return false;
    });
    form.on('submit(changeOrderThrowPriceBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        changeThrowPrice(IDX, 0, 50);
        return false;
    });
    form.on('submit(asyncHomeOrderPriceBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        var IDX = IDX.join(',');
        asyncHomeOrderPrice(IDX);
        return false;
    });
    form.on('submit(assOrderToTaskMangerBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        zpOrderToGroupManger(IDX.join(','), "", 0, 0);
        return false;
    });
    form.on('submit(setOrderSphoneBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setOrderSphone(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderRemarkBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setOrderRemark(IDX.join(','));
        return false;
    });
    form.on('submit(setOrderProjectBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        setOrderProject(IDX.join(','));
        return false;
    });
    form.on('submit(refundOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        IDX = allIds;
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        refundOrderLogs(IDX.join(','), '', '支付宝');
        return false;
    });
    form.on('submit(setOrderLabelBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        var haveDel = '';
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
            if (item.orderLabel != null && item.orderLabel != '') {
                haveDel = '1';
            }
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            OrderIDX = '';
            layer.msg('请选择要操作的记录！', { time: 800 }, function () {
                return false;
            });
            return false;
        }
        OrderIDX = IDX.join(',');
        bindSelectOrderLabel(".setMuitOrderLabelBtn", '', haveDel);
        return false;
    });
    form.on('submit(insideOrderPushGroupMsgBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            OrderIDX = '';
            layer.msg('请选择要操作的记录！', { time: 800 }, function () {
                return false;
            });
            return false;
        }
        OrderIDX = IDX.join(',');
        getSendGroupNewOrderMsg(OrderIDX);
        return false;
    });
    $(document).on('click', '.submitEdit', function () {
        var orderId = $(this).attr('data-id');
        var viewID = $(this).attr('data-viewId');
        editOrder(orderId, viewID);
    });
    $(document).on('click', '.throwEdit', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee')
        throwOrderToInternal(orderId, fee);
    });
    var timoutid;
    $(document).on('click', '.orderdetails', function () {
        var ids = $(this).attr('data-id');
        var viewID = $(this).attr('data-viewId');
        var tid = $(this).attr('data-tid');
        viewOrderDetails(ids, viewID, tid);
    });
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
            url: "/OrderAJax/ChangeOrderBussType",
            data: { orderIdx: IDX.join(','), value: val },
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
    function viewOrderDetails(orderid, viewID, tid) {
        layer.open({
            title: viewID + "订单详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: false,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['85%', '92%'],
            content: 'OrderView?orderId=' + orderid + '&viewType=20' + '&tid=' + tid
        });
    }
    function editOrder(orderid, viewID) {
        layer.open({
            title: viewID + "编辑订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['95%', '95%'],
            content: 'AddOrder?orderId=' + orderid
        });
    }
    $(document).on('click', '.seachSplitOrder', function () {
        var ids = $(this).attr('data-splitId');
        var viewId = $(this).attr('data-viewId');
        layer.open({
            title: "查看" + viewId + "关联订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['90%', '450px'],
            content: 'ViewSplitOrder?splitId=' + ids + '&gameName=' + gameName
        });
        return false;
    });
    $(document).on('click', '.setdlsta', function () {
        var ids = $(this).attr('data-id');
        var tid = $(this).attr('tid');
        if (tid) return false
        changeOrderSta(ids);
    });
    function changeOrderSta(orderId) {
        layer.open({
            title: "更改订单状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '1000px' : '90%', isPc ? '300px' : '85%'],
            content: 'SetOrderSta?orderId=' + orderId + '&type=1'
        });
    }
    form.on('submit(saveSettpricebtn)', function () {
        var orderID = $("#setorderid").val();
        var pfee = $("#setprice").val();
        var value = $("#setbprice").val();
        var pushPriceMode = $('input[type=radio][name=pushPriceMode]:checked').val();
        if (pfee == '' || value == '') {
            layer.msg('请填写金额和保证金，默认为0', { time: 1000 }, function () {
                return;
            });
            return false
        }
        if (!VerifyMoeny(pfee)) {
            layer.msg(pushPriceMode == 20 ? '请输入正确的百分比数值(不需要带%)' : '请输入正确的金额，默认为0', { time: 3000 }, function () {
                return;
            });
            return;
        }
        postThrowOrderToInternal(orderID, pfee, value, settLayerIndex, pushPriceMode);
    })
    form.on('radio(pushPriceMode)', function (data) {
        var pushPriceMode = data.value;
        if (pushPriceMode == 20) {
            $(".setpricelabel").html('发单价百分比');
        } else {
            $(".setpricelabel").html('设定发单价');
        }
    });
    function throwOrderToInternal(orderID, yfee) {
        var pfee = 0;
        if (isInvoFee == "Y") {

        }
        //form.val("form", {
        //    "pushPriceMode": 10,
        //    "setorderid": orderID,
        //    "setprice": yfee,
        //    "setbprice": '0'
        //});
        //form.render();

        $("#setprice").val(yfee);
        $("#setorderid").val(orderID);
        settLayerIndex = layer.open({
            title: "设定抛单价及保证金",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [isPc ? '510px' : '90%', '350px'],
            content: $(".setprice"),
            end: function () {
                $(".setprice").hide();
                //$("#setorderid").val('');
                //$("#setprice").val('0');
                //$("#setbprice").val('0');

                form.val("form", {
                    "pushPriceMode": 10,
                    "setorderid": '',
                    "setprice": '0',
                    "setbprice": '0'
                });
                form.render();
            }
        });
        return false
        //layer.prompt({ title: '请设定抛单价', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: yfee }, function (value, index, elem) {
        //    if (!VerifyMoeny(value)) {
        //        layer.msg('请输入正确的金额，默认为0', { time: 1000 }, function () {
        //            return;
        //        });
        //        return;
        //    }
        //    pfee = value;
        //    if (isInvoFee == "Y") {
        //        layer.close(index);
        //        layer.prompt({ title: '用户交纳了多少保证金或以上才能接？写0为不限制', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: 0 }, function (value, index, elem) {
        //            postThrowOrderToInternal(orderID, pfee, value, index);
        //        });
        //    } else {
        //        postThrowOrderToInternal(orderID, pfee, 0, index);
        //    }
        //});
    }
    function refundOrderLogs(orderId, yfee, refundmodel) {
        OrderIDX = orderId;
        form.val("form", {
            "refundFee": yfee,
            "refundModel": refundmodel,
            "paytranno": '',
            "refundRemark": ''
        });
        settLayerIndex = layer.open({
            title: "记录订单退款",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['720px', '600px'],
            content: $(".setrefundOrderLog"),
            end: function () {
                $(".setrefundOrderLog").hide();
            }
        });
        return false
    }
    function postThrowOrderToInternal(orderId, pfee, value, index, pushPriceMode) {
        if (!VerifyMoeny(value)) {
            layer.msg('请输入正确的金额，填0代表不限制', { time: 1500 }, function () {
                return;
            });
            return;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpdateDLOrderRevPriceByOrderID",
            data: { orderId: orderId, fee: pfee, action: 10, insureFee: value, pushPriceMode: pushPriceMode },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(index);
                        reloadOrderList();
                    });
                } else {
                    layer.msg(data.msg, { time: 3000 }, function () {
                    });
                }
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function CancelInternalThorwOrder(orderID) {
        layer.confirm('确定从内部接单大厅撤销该订单吗？撤销后，内部接单大厅将看不到该订单', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/RelesOrderToHomeByOrderID",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
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
    $(document).on('click', '.setjiwei', function () {
        var ids = $(this).attr('data-id');
        var jiwei = $(this).attr('data-jiwei');
        setJiWei(ids, jiwei);
    });
    function setJiWei(orderID, jiwei) {
        if (jiwei == null || jiwei == 'null') {
            jiwei = "";
        }
        layer.prompt({ title: '设置机位(不需要机位请写无)', shade: [0.3, '#333'], shadeClose: true, formType: 0, anim: 2, value: jiwei }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;

            $.ajax({
                type: "Post",
                url: "/OrderAjax/SetOrderJiWei",
                data: { orderId: orderID, jiwei: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('数据请求出现异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    re = true;
                    layer.msg(data.msg, { time: 1000 }, function () {
                        if (data.code > 0) {
                            layer.close(index);
                            reloadOrderList();
                        }
                    });
                }
                , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
            });
        });
    }
    $(document).on('click', '.jsr', function () {
        var ids = $(this).attr('data-id');
        var tid = $(this).attr('tid');
        if (tid) return false
        zpOrder(ids);
    });
    function zpOrder(orderID) {
        layer.open({
            title: "将订单指派给接手人/代练员",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['85%', '95%'],
            content: 'assignation?orderId=' + orderID
        });
    }
    $(document).on('click', '.upImg', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: "上传订单截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [device ? '70%' : '90%', device ? '85%' : '90%'],
            content: 'uploadpic?orderId=' + ids
        });
        return false;
    });
    $(document).on('click', '.mangeImg', function () {
        var ids = $(this).attr('data-id');
        layer.open({
            title: "查看订单截图",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: ['80%', device ? '85%' : '500px'],
            content: 'picmange?viewType=20&orderId=' + ids
        });
        return false;
    });
    function viewOrderPic(orderID) {
        $.getJSON('/OrderAjax/ViewPic?orderId=' + orderID, function (data) {
            layer.photos({
                photos: data.msg
                , anim: 5
                , shade: [0.3, '#333'],
                shadeClose: true
            });
        });
    }
    $(document).on('click', '.orderLogs', function () {
        var ids = $(this).attr('data-id');
        var vieworderid = $(this).attr('data-vieworderid');
        layer.open({
            title: vieworderid + "的订单日志",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: [device ? '485px' : '90%', device ? '70%' : '90%'],
            content: 'orderremark?orderId=' + ids
        });
        return false;
    });
    $(document).on('click', '.throwJsSta', function () {
        var ids = $(this).attr('data-id');
        changeThrowOrderSetSta(ids);
    });
    function changeThrowOrderSetSta(orderID) {
        layer.open({
            title: "更改与接手方的结算状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 1,
            area: ['80%', '200px'],
            content: 'setthrowordersta?orderID=' + orderID
        });
    }
    $(document).on('click', '.jsSta', function () {
        var ids = $(this).attr('data-id');
        var tid = $(this).attr('tid');
        if (tid) return false
        changeSettOrderStatus(ids);
    });
    function changeSettOrderStatus(orderID) {
        orders = orderID;
        settLayerIndex = layer.open({
            title: "更改与发单方的结算状态",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 1,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['70%', '260px'],
            content: $(".setDiv"),
            end: function () {
                $(".setDiv").hide();
            }
        });
    }
    form.on('submit(saveSettbtn)', function (data) {
        if (data.field.jsst == "" || data.field.jsst == undefined) {
            layer.alert("请选择一种结算状态！", {
                title: '提示'
            });
            return false;
        }
        if (!re)
            return false;
        re = false;

        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpSettlementOrderByIDX",
            data: { orderId: orders, sta: data.field.jsst },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('数据请求出现异常！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.msg(data.msg, { time: 1500 }, function () {
                    if (data.code > 0) {
                        layer.close(settLayerIndex);
                        reloadOrderList();
                    }
                });
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    });
    function addOrderToTask(orderID, mode) {
        if (mode == 2) {
            layer.open({
                title: "将勾选的订单加入到排团坑位【坑位模式，适合魔兽/诛仙世界专用】",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['90%', '95%'],
                content: '/Group/NewOrderToGroup?orderId=' + orderID + '&gameID=' + $("#gameName").val()
            });
        } else {
            layer.open({
                title: "将勾选的订单加入到排团【普通模式】",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['80%', '90%'],
                content: '/Group/OrderGroup?orderId=' + orderID + '&gameName=' + gameName
            });
        }
    }
    function cleanOrderByTask(orderID) {
        layer.confirm('确定将该订单与该排团解除关系吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/RelesOrderAndTaskByOrderID",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
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
    $(document).on('click', '.changeRoleName', function () {
        var ids = $(this).attr('data-id');
        var rolename = $(this).attr('data-rolename');
        setOrderGameRoleName(ids, rolename);
    });
    function setOrderGameRoleName(orderID, rolename) {
        layer.prompt({ title: '编辑订单角色名，若没有请写无', formType: 0, value: rolename, maxlength: 25 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderGameRoleNameByOrderId",
                data: { orderId: orderID, newRoleName: value },
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
    $(document).on('click', '.changeTag', function () {
        var ids = $(this).attr('data-id');
        var tag = $(this).attr('data-tag');
        setOrderTag(ids, tag);
    });
    function setOrderTag(orderID, tag) {
        if (orderID == '' || orderID == null) {
            layer.msg('请勾选要操作的订单', { time: 1000 });
            return false;
        }
        layer.prompt({ title: '编辑订单标记', formType: 0, value: tag, maxlength: 50 }, function (value, index, elem) {
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
    function cleanOrderTag(orderID) {
        if (orderID == '' || orderID == null) {
            layer.msg('请勾选要操作的订单', { time: 1000 });
            return false;
        }
        layer.confirm('确定将这些订单的自定义标记清除吗？', function (index) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/upOrderTips",
                data: { orderId: orderID },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('请求异常！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1000 }, function () {
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
    function changeOrderJiaji(orderID) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UrgentOrderByIDX",
            data: { orderId: orderID },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
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
        return false;
    }
    $(document).on('click', '.groupview', function () {
        var taskid = $(this).attr('data-id');
        viewTaskDetails(taskid);
    })
    function viewTaskDetails(taskId) {
        layer.open({
            title: taskId + "排团详情",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['90%', '90%'],
            content: '/Group/GroupDetails?taskID=' + taskId
        });
    }
    function delOrder(orderID) {
        layer.confirm('真的删除吗？警告：一旦删除，将无法找回，请谨慎处理', function (index) {
            layer.confirm('删除订单会自动删除接单客服的接单提成记录，是否需要同步删除代练接手人的绩效记录？', {
                btn: ['需要删除接手人绩效', '不需要删除接手人绩效'] //按钮
            }, function () {
                delOrderPost(orderID, "Y", index);
            }, function () {
                delOrderPost(orderID, "N", index);
            });
        });
        return false;
    }
    function delOrderPost(orderID, isDelEmp, index) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/DelOrderByIDX",
            data: { orderID: orderID, isDelEmp: isDelEmp },
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
    }
    function exportOrder(orderID) {
        var base64 = new Base64();
        var seach = base64.encode(seachParam);
        layer.open({
            title: "导出订单",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 5,
            area: ['75%', '420px'],
            content: 'ExportOrder?orderId=' + orderID + '&seachText=' + seach
        });
    }
    function sendOrderToMySystem(orderID) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SendOrderToMySystem",
            data: { orderId: orderID },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                larryms.message(data.msg, 'success', data.code > 0 ? 'layui-toast' : 'layui-cuowu2', 5);
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function sendSms(orderID) {
        layer.open({
            title: "对指定订单客户发送短信",
            shade: [0.3, '#333'],
            shadeClose: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: ['80%', '380px'],
            content: '/Order/SendSms?orderId=' + orderID
        });
    }
    $(document).on('click', '.changeThrowFee', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        var isThrow = $(this).attr('data-isThrow');
        var tid = $(this).attr('tid');
        if (tid) return false

        if (isThrow == "Y") {
            changeThrowPrice(orderId, fee, 30);
        }
        else {
            layer.open({
                title: "查看或编辑订单接手绩效",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 2,
                skin: 'layui-layer-lan',
                anim: 8,
                area: ['60%', '45%'],
                content: '/Emp/ChangeRecPriceByOrder?orderId=' + orderId
            });
        }
    })
    function changeThrowPrice(orderID, fee, action) {
        layer.prompt({ title: '改发单价，可为0，但不能为空，带%号代表按接单价比例发单', formType: 0, value: fee, maxlength: 10 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/sendDLOrderRevPriceByOrderID",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    orderId: orderID,
                    fee: value,
                    action: action
                }),
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
    }
    $(document).on('click', '.editOrderPrice', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        var tid = $(this).attr('tid');
        if (tid) return false
        changeOrderPrice(fee, orderId);
        return false;
    })
    function changeOrderPrice(fee, orderId) {
        layer.prompt({ title: '更改接单价，可为0，但不能为空', formType: 0, value: fee, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为' + fee, { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderPrice",
                data: { orderId: orderId, fee: value },
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
    }
    $(document).on('click', '.editNetReceiptsPrice', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        changeOrderNetReceiptsPrice(fee, orderId);
        return false;
    })
    function changeOrderNetReceiptsPrice(fee, orderId) {
        layer.prompt({ title: '更改实收款，可为0，但不能为空', formType: 0, value: fee, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为' + fee, { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderNetReceiptsPrice",
                data: { orderId: orderId, fee: value },
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
    }
    $(document).on('click', '.orderRemark', function () {
        var orderId = $(this).attr('data-id');
        var remark = $(this).attr('data-remark');
        setOrderRemark(orderId, remark);
    })
    function setOrderRemark(idx, remark) {
        layer.prompt({ title: '修改订单重要备注', formType: 0, value: remark, maxlength: 500 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderRemark",
                data: { orderId: idx, remark: value },
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
    }
    $(document).on('click', '.pushJdpEdit', function () {
        var orderId = $(this).attr('data-id');
        var viewId = $(this).attr('data-viewId');
        var recMan = $(this).attr('data-recMan');
        if (recMan == "无权查看") {
            recMan = "";
        }
        throwToJdpTransction(orderId, viewId);
    })
    function throwToJdpTransction(orderId, viewId) {
        layer.open({
            title: viewId + "发单到交易平台：请确认发单内容",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [device ? '1280px' : '95%', device ? screenHeight <= 1080 ? '95%' : screenHeight > 1080 && screenHeight <= 1440 ? '90%' : screenHeight > 1600 ? '70%' : '80%' : '95%'],
            content: pushPlatmMode == 1 ? 'PushJdp?orderId=' + orderId : 'PushJdp2026?orderId=' + orderId
        });
    }
    $(document).on('click', '.pushJdpCancel', function () {
        var orderId = $(this).attr('data-id');
        var viewId = $(this).attr('data-viewId');
        cancelThrowJdpTransction(orderId);
    })
    function cancelThrowJdpTransction(orderId) {
        layer.confirm('确定将该订单从所有平台撤回吗？'
            , {
                btn: ['确定撤回', '我再想想']
            }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/DeTransctionAllPlatformOrder",
                    data: { orderId: orderId },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.alert(data.msg, function () {
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.alert(data.msg);
                        }
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            }
        )
    }
    $(document).on('click', '.addToPostionTask', function () {
        var orderId = $(this).attr('data-id');
        addOrderToTask(orderId, 2);
    })
    $(document).on('click', '.cancelThrowHome', function () {
        var orderId = $(this).attr('data-id');
        CancelInternalThorwOrder(orderId);
    })
    $(document).on('click', '.sendsmsorderbtn', function () {
        var orderId = $(this).attr('data-id');
        sendSms(orderId);
    })
    function changeOrderLock(orderId, value) {
        var tipsMsg = "确定将选中的订单临时锁单？<br/>注意，最多只能锁单24小时，锁单期间，除了你自己其它任何人都不能编辑订单但可以改状态<br/>如果不主动解锁，24小时后会自动解锁";
        if (value == 20) {
            tipsMsg = "确定解锁吗？";
        }
        layer.confirm(tipsMsg
            , {
                btn: ['确定', '点错了']
            }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/ChangeOrderLock",
                    data: { orderId: orderId, value: value },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.alert(data.msg, function () {
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.alert(data.msg);
                        }
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            }
        )
    }
    function setOrderProject(idx, remark) {
        layer.prompt({ title: '请输入新的订单代练项目', formType: 0, value: remark, maxlength: 100 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderProject",
                data: { orderId: idx, newProject: value },
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
    }
    $(document).on('click', '.modityProject', function () {
        var ids = $(this).attr('data-id');
        var project = $(this).attr('data-project');
        setOrderProject(ids, project);
    });
    $(document).on('click', '.selectOrderLabelBtn', function () {
        var elm = $(this);
        var idsx = $(this).attr('data-id');
        let thisGame = elm.attr('data-game');
        let label = elm.attr('data-label');
        OrderIDX = idsx;
        bindSelectOrderLabel(elm, thisGame, label, 'row');
    });
    function bindSelectOrderLabel(elm, thisGame, haveLabel, rowbtn) {
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetOrderLabelList?status=0&gameName=" + thisGame,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('读取标签数据请求异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.count > 0) {
                    var labelSelectData = [];
                    if (haveLabel != '') {
                        let itemModel = {
                            title: '删除标签',
                            id: 0
                        };
                        labelSelectData.push(itemModel);
                    }
                    $.each(data.data, function (index, item) {
                        let itemModel = {
                            title: item.labelName,
                            id: item.id
                        };
                        labelSelectData.push(itemModel);
                    });
                    if (labelSelectData.length > 0) {
                        if (rowbtn == 'row') {
                            //行
                            dropdown.render({
                                elem: elm, // 触发事件的 DOM 对象
                                show: true, // 外部事件触发即显示
                                data: labelSelectData,
                                click: function (menudata) {
                                    UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                }
                            });
                        } else {
                            //多选
                            if (inst == null) {
                                inst = dropdownMut.render({
                                    elem: '#setMuitOrderLabelBtn',
                                    show: true,
                                    data: labelSelectData,
                                    click: function (menudata) {
                                        UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                    }
                                });
                            } else {
                                dropdownMut.reloadData('setMuitOrderLabelBtn', {
                                    show: true,
                                    data: labelSelectData,
                                    click: function (menudata) {
                                        UpdateOrderLabelQue(menudata.id == 0 ? '' : menudata.title);
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    layer.msg('该游戏没有配置订单标签，请到系统维护->订单标签维护 中设置', { time: 2000 });
                }
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
    }
    function UpdateOrderLabelQue(selectLabel) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/UpdateOrderLabel",
            data: { ids: OrderIDX, label: selectLabel },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                reloadOrderList();
                layer.msg(data.msg, { time: 1500 }, function (index2) {
                    layer.close(index2);
                    return false;
                });
                return false;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function bindSelectOrderTipsBtn() {
        dropdownTips.render('setOrderTipsBtn', {
            data: [{
                title: '做标记',
                id: 0
            }, {
                title: '删除标记',
                id: 1
            }],
            click: function (obj) {
                if (obj.id == 0) {
                    setOrderTag(OrderIDX, '');
                }
                else {
                    cleanOrderTag(OrderIDX);
                }
            }
        });
    }
    var _tools = {
        reloadOrderData: function () {
            layer.closeAll();
            reloadOrderList();
        },
        reloadOrderDataNoCloseLayer: function () {
            reloadOrderListNoCloseLayer();
        }
    };
    window.tools = _tools;
    var copyOrderIdClipboard = new ClipboardJS('.orderIDcopy');
    copyOrderIdClipboard.on('success', function (e) {
        layer.msg('已成功复制订单号：' + e.text + '到剪贴板', { time: 1000 });
        e.clearSelection();
    });
    copyOrderIdClipboard.on('error', function (e) {
        layer.msg('复制订单号失败了，请手动复制', { time: 1000 });
    });
    var copyOrderInfoClipboard = new ClipboardJS('.orderInfocopy');
    copyOrderInfoClipboard.on('success', function (e) {
        let triggerid = e.trigger.id;
        let orderId = triggerid.replace('orderinfo_span_', '');
        $.ajax({
            type: "Post",
            url: "/OrderAjax/CopyOrderLog",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { },
            beforeSend: function (XMLHttpRequest) { },
            success: function (data) {
            },
            complete: function (XMLHttpRequest) {
            }
        });
        layer.msg('已成功复制订单内容到剪贴板', { time: 1000 });
        e.clearSelection();
    });
    copyOrderInfoClipboard.on('error', function (e) {
        layer.msg('复制订单内容失败了，请手动复制', { time: 1000 });
    });
    $(document).on('click', '.changeThrowFeeEdit', function () {
        var orderId = $(this).attr('data-id');
        var fee = $(this).attr('data-fee');
        layer.prompt({ title: '更改发单价，可为0，但不能为空', formType: 0, value: fee, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为' + fee, { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/sendDLOrderRevPriceByOrderID",
                data: { orderId: orderId, fee: value, action: 40 },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 800 }, function () {
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
    })
    $(document).on('click', '.changeThrowFeeEditByPlatform', function () {
        var ids = $(this).attr('data-id');
        var viewID = $(this).attr('data-viewId');
        viewOrderDetails(ids, viewID);
        return false;
        //未启用
        layer.prompt({ title: '追加所有第三方交易平台抛单价，当前抛单价' + fee + '元', formType: 0, value: 1, maxlength: 5 }, function (value, index, elem) {
            if (!VerifyMoeny(value)) {
                layer.msg('请输入正确的金额，默认为' + fee, { time: 800 }, function () {
                    return false;
                });
                return false;
            }
            if (parseInt(value) < 1) {
                layer.msg('要追加的价格必须大于0元', { time: 1500 }, function () {
                    return false;
                });
                return false;
            }
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/AppendAllTransctionOrderPrice",
                data: { orderId: orderId, fee: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.alert(data.msg, function () {
                        layer.close(index);
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
    })
    $.contextMenu({
        selector: '.orderLine',
        callback: function (key, options) {
            var orderID = options.$trigger.attr("data-id");
            var orderIdView = options.$trigger.attr("data-orderIdView");
            if (key == 'copyOrderID') {

                $("#orderid_span_" + orderID).trigger("click");
            }
            else if (key == 'copyOrder') {
                if (rightMenuCopyOrder == "Y") {
                    $("#orderinfo_span_" + orderID).trigger("click");
                }
            }
            else if (key == 'viewDetails') {
                viewOrderDetails(orderID, orderIdView);
            }
            else if (key == 'viewPic') {
                viewOrderPic(orderID);
            }
            else if (key == 'recUserQQ') {
                getRecManQQ(orderID);
            }
            else if (key == 'viewSystemLogs') {

            }
            else if (key == 'copyOrderToNewOrder') {
                copyOrderToNewOrder(orderID);
            }
            else if (key == 'getScanqrCode') {
                getScanqrCode(orderID);
            }
            else if (key == 'getSendGroupNewOrderMsg') {
                getSendGroupNewOrderMsg(orderID);
            }
            else if (key == 'getLink') {
                getLink(orderID);
            }
        },
        items: {
            "viewDetails": { name: "查看详情", icon: "paste" },
            "sep1": "---------",
            'copyOrderID': { name: "复制订单编号", icon: "edit" },
            "sep2": "---------",
            "copyOrder": { name: rightMenuCopyOrder == "Y" ? "复制订单内容" : "", icon: rightMenuCopyOrder == "Y" ? "copy" : "" },
            "sep3": "---------",
            'copyOrderToNewOrder': { name: "复制成新订单", icon: "copy" },
            "sep4": "---------",
            'none': { name: "" },
            "sep5": "---------",
            'getLink': { name: "复制玩家自助完善订单链接" },
            "sep6": "---------",
            'getScanqrCode': { name: "获取玩家上号扫码授权链接", icon: "url" },
            "sep7": "---------",
            'viewPic': { name: "查看订单截图", icon: "images" },
            'recUserQQ': { name: "与接手人QQ对话", icon: "phone" },
            "sep8": "---------",
            'getSendGroupNewOrderMsg': { name: "获取发群聊用的新单消息", icon: "list" }
        }
    });
    function getScanqrCode(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: "/OrderAjax/GetBuiderGameScanQrCode?orderId=" + orderId,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    let copyurlClipboard = new ClipboardJS('.copyurl', {
                        text: function (trigger) {
                            return data.data;
                        }
                    });
                    copyurlClipboard.on('success', function (e) {
                        layer.msg('已成功复制链接：' + e.text + '到剪贴板，有效时间' + data.hour + '小时', { time: 4000 });
                        e.clearSelection();
                    });
                    copyurlClipboard.on('error', function (e) {
                        layer.msg('复制失败了', { time: 1000 });
                    });
                    $('.copyurl').trigger('click')

                } else {
                    layer.alert(data.msg, function (index) {
                        layer.close(index);
                    });
                }

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getLink(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetOrderClientOrderUrlLink",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    if (!data.appendMsg) {
                        data.appendMsg = '麻烦根据提示填写链接'
                    }
                    const oInput = document.createElement('textarea')
                    oInput.value = '点击以下链接补充订单信息： \n' + data.data + ' \n \n' + data.appendMsg
                    document.body.appendChild(oInput)
                    oInput.select() // 选择对象
                    document.execCommand('Copy') // 执行浏览器复制命令
                    oInput.className = 'oInput'
                    oInput.style.display = 'none'
                    document.body.removeChild(oInput)
                    layer.alert('点击以下链接补充订单信息：<br>' + data.data + '<br><br>' + data.appendMsg + '<br><br>提示： 以上消息已自动复制到剪贴板，请粘贴给老板');

                    //let copyurlClipboard = new ClipboardJS('.copyurl', {
                    //    text: function (trigger) {
                    //        return '点击以下链接补充订单信息：<br>' + data.data + '<br><br>麻烦根据提示填写';
                    //    }
                    //});
                    //copyurlClipboard.on('success', function (e) {
                    //    layer.alert('点击以下链接补充订单信息：<br>' + e.text + '<br><br>麻烦根据提示填写<br><br>提示： 以上消息已自动复制到剪贴板，请粘贴给老板');
                    //    e.clearSelection();
                    //});
                    //copyurlClipboard.on('error', function (e) {
                    //    layer.alert('复制失败了', { time: 1000 });
                    //});
                    //$('.copyurl').trigger('click')

                } else {
                    layer.alert(data.data, function (index) {
                        layer.close(index);
                    });
                }

            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }

        });
    }
    function copyOrderToNewOrder(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/CopyOrderToNewOrder",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('请求出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                layer.alert(data.msg, function (index) {
                    re = true;
                    if (data.code > 0) {
                        layer.close(index);
                        reloadOrderList();
                    }
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getRecManQQ(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetUserQQByOrderId",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.open({
                        title: "正在试图唤起QQ...",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 2,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        time: 2000,
                        area: ['300px', '150px'],
                        content: 'tencent://message/?uin=' + data.msg + '&Site=平台&Menu=yes'
                    });
                }
                else {
                    layer.msg('该订单当前接手人没有登记QQ号或无法提取接手人信息', { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    function getSendGroupNewOrderMsg(ids) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetSendGroupNewOrderMsg",
            data: { ids: ids },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.open({
                        title: "已自动复制，点击窗口外面任意地方可关闭",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        area: [isPc ? '510px' : '95%', '400px'],
                        content: '<div style="padding:10px 10px">' + data.layer + '</div>'
                    });
                    let copyurlClipboard = new ClipboardJS('.copyGetGroupPushOrderMsg', {
                        text: function (trigger) {
                            return data.data;
                        }
                    });
                    copyurlClipboard.on('success', function (e) {
                        layer.msg('已成功复制到剪贴板', { time: 4000 });
                        e.clearSelection();
                    });
                    copyurlClipboard.on('error', function (e) {
                        layer.msg('复制失败了', { time: 1000 });
                    });
                    $('.copyGetGroupPushOrderMsg').trigger('click');
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
    }
    form.on('checkbox(viewIsJiaJi)', function (data) {
        layer.tips('勾选后将筛选出加急的订单', '#isJiajiCheck', { tips: 1, time: 2000 });
        allIds = []; //清除勾选的记录
        $(".sechbtn").trigger("click");
    });
    $(document).on('click', '.joinTask', function () {
        var orderId = $(this).attr('data-id');
        addOrderToTask(orderId);
        return false;
    });
    var toGroupMangeOrderIdx = "";
    var ckGroupId = 0;
    var gwindow;
    function zpOrderToGroupManger(orderId, man, ckuid, fee) {
        toGroupMangeOrderIdx = orderId;
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/UserAjax/GetGroupMangeList",
            data: { gameName: $("#gameName").find("option:selected").text() },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    let list = data.data;
                    ckGroupId = ckuid;
                    $(".kszp").html('');
                    $("#groupFee").val(fee);
                    for (let i = 0; i < list.length; i++) {
                        let html = '<input type="radio" name="groupMange" lay-filter="ckGroup" ' + (ckuid == list[i].uid ? "checked=''" : "") + ' value="' + list[i].uid + '" title="' + list[i].userName + '">';
                        $(".kszp").append(html);
                    }
                    form.render('radio');
                    gwindow = layer.open({
                        title: man != "" ? "将订单" + orderId + "指定团长，当前团长：" + man : "将订单指定团长",
                        shade: [0.3, '#333'],
                        shadeClose: true,
                        type: 1,
                        skin: 'layui-layer-lan',
                        anim: 8,
                        area: [device ? '30%' : '90%', device ? '45%' : '75%'],
                        content: $('.setOrderToGroupMange'),
                        end: function () {
                            $(".setOrderToGroupMange").hide();
                        }
                    });
                }
                else {
                    layer.msg(gameName + '没有团长', { time: 2000 }, function () {
                    })
                }
                re = true;
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    form.on('radio(ckGroup)', function (data) {
        ckGroupId = data.value;
    });
    $(document).on('click', '.saveGroupMange', function () {
        if (toGroupMangeOrderIdx == "") {
            layer.msg('请刷新页面重新选择订单再指定团长', { time: 2000 });
            return false;
        }
        if (ckGroupId < 1) {
            layer.msg('请选择一个团长', { time: 2000 });
            return false;
        }
        let groupFee = $("#groupFee").val();
        let changeOrderStatus = $('input:radio[name="changeToDSH"]:checked').val();
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/SaveOrderToGroupManger",
            data: { orderIdx: toGroupMangeOrderIdx, uid: ckGroupId, fee: groupFee, changeOrderStatus: changeOrderStatus },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 1000 }, function () {
                        layer.close(gwindow);
                        reloadOrderList();
                    });
                }
                else {
                    layer.msg(data.msg, { time: 2000 });
                }
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });

        return false;
    });
    $(document).on('click', '.setOrderToGroupManger', function () {
        let orderId = $(this).attr('data-id');
        let man = $(this).attr('data-man');
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetOrderGroupMangerLog",
            data: { orderId: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                zpOrderToGroupManger(orderId, man, data.code, data.data);
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    });
    $(document).on('click', '.clearGroupMange', function () {
        if (toGroupMangeOrderIdx == "") {
            layer.msg('请刷新页面重新选择订单再清除', { time: 2000 });
            return false;
        }
        layer.confirm('确定清除订单的指定团长吗？'
            , {
                btn: ['确定清除', '我再想想']
            }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/ClearOrderToGroupManger",
                    data: { orderIdx: toGroupMangeOrderIdx },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('获取出错！'); re = true; },
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
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            }
        )

        return false;
    });
    function viewSystemLogs(orderId) {
        layer.open({
            title: "查看订单浏览记录",
            shade: [0.3, '#333'],
            shadeClose: true,
            maxmin: true,
            type: 2,
            skin: 'layui-layer-lan',
            anim: 8,
            area: [device ? '80%' : '95%', device ? '70%' : '95%'],
            content: '/System/SystemLog?id=' + orderId
        });
    }
    form.on('checkbox(viewLeakOrder)', function (data) {
        layer.tips('勾选后将筛选出状态为未分配或者没有指派过打手陪玩的单子', '#viewLeakOrder', { tips: 1, time: 2000 });
        allIds = []; //清除勾选的记录
        $(".sechbtn").trigger("click");
    });
    function setOrderSoureId(idx, yvalue) {
        layer.prompt({ title: '更改订单来源单号', formType: 0, value: yvalue, maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderSoureId",
                data: { orderId: idx, value: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1500 }, function () {
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
    function setOrderSphone(idx) {
        layer.prompt({ title: '请输入指定上号电话，若不需要请输入任意1个字符', formType: 0, value: '', maxlength: 50 }, function (value, index, elem) {
            if (!re)
                return false;
            re = false;
            $.ajax({
                type: "Post",
                url: "/OrderAjax/ChangeOrderShphone",
                data: { idx: idx, sphone: value },
                dataType: 'json',
                cache: false,
                timeout: 60000,
                error: function () { layer.msg('系统繁忙！'); re = true; },
                beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                success: function (data) {
                    layer.close(index);
                    if (data.code > 0) {
                        layer.msg(data.msg, { time: 1500 }, function () {
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
    function asyncHomeOrderPrice(orderId) {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/GetRecEmpAmountByOrderId",
            data: { orderIds: orderId },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('获取出错！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                layer.alert(data.msg, function (sindex) {
                    if (data.code > 0) {
                        reloadOrderList();
                    }
                    layer.close(sindex);
                });
            },
            complete: function (XMLHttpRequest) {
                layer.close(indexLoad);
            }
        });
    }
    form.on('submit(builderSellEmpOrderBtn)', function (data) {
        var seltable = table.checkStatus('datatable').data;
        seltable = seltable.filter(item => !item.tid);
        IDX = [];
        seltable.forEach(function (item, index) {
            IDX.push(item.orderId);
        });
        if (IDX == undefined || IDX == null || IDX.join(',') == "") {
            layer.msg('请选择要操作的记录！', { time: 800 });
            return false;
        }
        builderSellEmpOrderFunc(IDX.join(','));
        return false;
    });
    function builderSellEmpOrderFunc(orderId) {
        var tipsMsg = "确定需要为选中的订单生成或更新客服销售绩效账单吗？<br/>提示：当确认这些订单没有客服销售绩效账单时再生成，一般情况下系统会自动生成。<br>如果系统发现账单存在，将会重新计算并更新该订单的客服销售账单";
        layer.confirm(tipsMsg
            , {
                btn: ['确定生成', '点错了']
            }, function (index) {
                if (!re)
                    return false;
                re = false;
                $.ajax({
                    type: "Post",
                    url: "/OrderAjax/BuilderSellEmpOrderLog",
                    data: { orderId: orderId },
                    dataType: 'json',
                    cache: false,
                    timeout: 60000,
                    error: function () { layer.msg('系统繁忙！'); re = true; },
                    beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
                    success: function (data) {
                        if (data.code > 0) {
                            layer.alert(data.msg, function () {
                                reloadOrderList();
                            });
                        }
                        else {
                            layer.alert(data.msg);
                        }
                        re = true;
                    },
                    complete: function (XMLHttpRequest) {
                        layer.close(indexLoad);
                    }
                });
            }
        )
    }
    $(document).on('click', '.refundFee', function () {
        var ids = $(this).attr('data-id');
        var refundmodel = $(this).attr('data-refundmodel');
        var fee = $(this).attr('data-fee');
        refundOrderLogs(ids, fee, refundmodel);
    });
    $(document).on('click', '.saveReFundOrderBtn', function () {
        var orderId = OrderIDX;
        var refundModel = $('input[name="refundModel"]:checked').val();
        var refundFee = $("#refundFee").val();
        var paytranno = $("#paytranno").val();
        var sdate = $("#refundDate").val();
        var refundRemark = $("#refundRemark").val();
        var refundChangeToYTD = $('input[name="refundChangeToYTD"]:checked').val();
        if (!VerifyMoeny(refundFee)) {
            layer.msg('请输入正确的金额', { time: 800 }, function () {
                return false;
            });
            return false;
        }
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "Post",
            url: "/OrderAjax/AddOrderRefundLogs",
            data: { orderIdx: orderId, refundModel: refundModel, fee: refundFee, sdate: sdate, tranNo: paytranno, remark: refundRemark, changeOrderStatus: refundChangeToYTD },
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { layer.msg('系统繁忙！'); re = true; },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                if (data.code > 0) {
                    layer.msg(data.msg, { time: 800 }, function () {
                        layer.close(settLayerIndex);
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
        return false;
    })
    function getOrderTypeList(gameId, defName) {
        var orderTypeData = [];
        $.get('/GameAjax/GetAllOrderTypeList?gameId=' + gameId + '&defOrderType=' + defName + '&returnSelect=Y', function (result) {
            orderTypeData = result.data;
            formSelects.data('projectType', 'local', {
                arr: orderTypeData
            });
        });
    }
    function getOrderLabelByGame() {
        if (!re)
            return false;
        re = false;
        $.ajax({
            type: "GET",
            url: "/SystemAjax/GetOrderLabelList?gameName=" + gameName,
            data: {},
            dataType: 'json',
            cache: false,
            timeout: 60000,
            error: function () { re = true; layer.msg('读取标签数据请求异常！'); },
            beforeSend: function (XMLHttpRequest) { indexLoad = layer.load(1, { shade: false }); },
            success: function (data) {
                re = true;
                $("#orderLabel").empty();//清空select
                form.render('select');
                //重新动态加载select
                $("#orderLabel").append(new Option("全部", ""));
                $("#orderLabel").append(new Option("无标签", "NoLael"));
                $.each(data.data, function (index, item) {
                    $("#orderLabel").append(new Option(item.labelName, item.labelName));
                })
                form.render('select');
                return false;
            }
            , complete: function (XMLHttpRequest) { layer.close(indexLoad); }
        });
        return false;
    }
    form.on('select(showPriceType)', function (data) {
        var value = data.value;
        if (value == 3) {
            form.val("form", {
                "seachMutPrice_p1": '-999999',
                "seachMutPrice_p2": '999999',
                "seachMutPrice_p3": '-999999',
                "seachMutPrice_p4": '999999'
            });
            form.render('text');
            seachMutPriceLayerIndex = layer.open({
                title: "接单价+发单价组合查询",
                shade: [0.3, '#333'],
                shadeClose: true,
                type: 1,
                skin: 'layui-layer-lan',
                anim: 5,
                area: ['560px', '250px'],
                content: $(".seachMutPriceDiv"),
                end: function () {
                    $(".seachMutPriceDiv").hide();
                    layer.close(seachMutPriceLayerIndex);
                }
            });
        } else {
            $(".seachMutPriceDiv").hide();
            layer.close(seachMutPriceLayerIndex);
        }
        return false;
    });
    $(document).on('click', '.seachMutPriceBtn', function () {
        let p1 = $("#seachMutPrice_p1").val();
        let p2 = $("#seachMutPrice_p2").val();
        let p3 = $("#seachMutPrice_p3").val();
        let p4 = $("#seachMutPrice_p4").val();

        if (!VerifyMoeny(p1)) {
            layer.msg('接单价最低价格格式不正确');
            return false;
        }
        if (!VerifyMoeny(p2)) {
            layer.msg('接单价最高价格格式不正确');
            return false;
        }
        if (!VerifyMoeny(p3)) {
            layer.msg('发单价最低价格格式不正确');
            return false;
        }
        if (!VerifyMoeny(p4)) {
            layer.msg('发单价最高价格格式不正确');
            return false;
        }
        seachMutPrice1 = p1;
        seachMutPrice2 = p2;
        seachMutPrice3 = p3;
        seachMutPrice4 = p4;
        $(".seachMutPriceDiv").hide();
        layer.close(seachMutPriceLayerIndex);
        $(".sechbtn").trigger("click");
        return false;
    })
    form.on('select(taskSelect)', function (data) {
        //var value = data.value;
        taskSelectId = data.value;
    });
});