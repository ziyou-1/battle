# 客户端 PC 端全流程实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** 在保留现有手机端的前提下，为 `/app/` 的全部客户路由提供清晰、完整的 PC 端布局与交互。

**Architecture:** 继续共用 Vue Router、现有页面组件、API 和业务状态。在 Vue 根壳层保持桌面导航一致，各页面组件用语义化桌面布局类组织内容；所有桌面样式限定在 960px 及以上，通过 1280px 增强宽屏双栏，窄于 960px 完全保留现有手机体验。

**Tech Stack:** Flask 提供静态资源；原生 Vue 3、Vue Router、现有 API 封装、原生 CSS；不添加依赖。

**Spec:** `docs/superpowers/specs/2026-09-23-client-desktop-design.md`

## Global Constraints

- PC 是客户买家端，不改后台员工管理系统。
- `/app/` 所有路由复用现有 API、接口数据、金额规则、表单校验和登录拦截。
- `< 960px` 保留现有手机导航和布局；所有桌面专属样式必须放在 `@media (min-width: 960px)` 内。
- 不修改 Flask API、数据库结构或外部服务集成，不伪造尚未接入的支付、短信等能力。
- 不引入前端依赖或重复业务状态源。

---

## 文件结构与职责

- `static/app/app.js`：全局 Vue 壳层、PC 顶部导航、路由高亮、账户入口；不得复制路由或业务状态。
- `static/app/pages.js`：首页、游戏/商城、报价下单、订单、账户、权益、帮助、认证等主要页面模板。
- `static/app/pages2.js`：常用角色、会话、邀请、报价器、打手、售后、搜索、法律页面模板。
- `static/app/app.css`：共用原子组件和桌面布局系统，集中管理断点、页面网格、辅助栏、焦点与暗色主题。
- `README.md`：说明 PC 客户端访问方式和桌面端功能。

布局类约定：`.pc-page-head` 用于页面标题和次级操作，`.pc-toolbar` 用于搜索/筛选，`.pc-grid` 用于桌面卡片栅格，`.pc-layout` + `.pc-main` + `.pc-aside` 用于主内容和摘要栏，`.pc-list` 用于桌面订单/明细行。组件继续使用原有 `data()` / `methods`，新增 class 只改变显示结构与样式。

## Task 1: 完成桌面框架与共享布局基础

**Files:** `static/app/app.js`, `static/app/app.css`

**Interfaces:** 根组件继续消费 `store.user`, `store.company`, `tabs`, `mobileTabs` 和当前路由 meta；页面模板可使用上述 `.pc-*` 类。已有 `/search`、`/orders`、`/me` 路由是导航目标。

- [x] 调整桌面顶栏：品牌、主导航（首页/游戏/套餐/报价/订单）、搜索入口和账户菜单；根据当前路由的 `meta.tab` 与路径同时高亮正确父项。账户菜单显示资料/订单等已有入口以及现有退出操作。
- [x] 修正内页标题与返回入口规则：桌面顶栏不显示手机 `TopBar`；内页显示 `.pc-page-head`，需要后退时通过 `$router.back()`，无历史时退回对应一级路由。
- [x] 在 `app.css` 建立仅限桌面的容器规则：960–1279px 使用单主列和较窄网格；1280px 以上允许 2 列主辅布局；页面最大宽度 1200px，法律文本最大宽度 800px；表单/表格不得引发 viewport 横向溢出。
- [x] 为 `.pc-layout`、`.pc-main`、`.pc-aside`、`.pc-toolbar`、`.pc-grid`、`.pc-list` 增加基础网格、间距、粘性定位和窄桌面折叠规则；在暗色模式下使用现有 CSS 变量。
- [x] 逐项审阅 `@media` 选择器，确认顶栏、标题、按钮、弹层不会覆盖 `<960px` 的手机布局。

## Task 2: 首页、发现和搜索页面

**Files:** `static/app/pages.js`, `static/app/pages2.js`, `static/app/app.css`

**Interfaces:** 首页使用现有 `API.get('home')` 数据；搜索继续调用 `API.get('search')`；公告、商品、游戏、打手卡片沿用当前 `$router.push` 目标。

- [x] 将首页内容分为欢迎/活动主区、游戏入口、热门服务、公告和权益入口；在桌面将游戏显示 6–8 列、服务卡片显示 4 列，保留现有活动倒计时和跳转。
- [x] 将 `/search` 页面整理成顶部查询栏和分组结果区，项目、商品、游戏结果按桌面多列展示，空结果继续使用现有 Empty 组件。
- [x] 将 `/boosters` 资料卡调整为桌面多列结果，头像、评价和现有操作保持原数据与链接。
- [x] 适配 `/news` 与 `/news/:id`：列表使用宽列摘要；详情使用适合阅读的窄正文列和回到公告列表入口。

## Task 3: 游戏目录、商品商城与商品详情

**Files:** `static/app/pages.js`, `static/app/app.css`

**Interfaces:** `Games`, `GameDetail`, `Shop`, `ShopDetail` 继续用现有 `games`、`game`、`shop`、`item` API 与现有查询参数。

- [x] 为 `/games` 加桌面页标题、搜索工具栏和 4–6 列游戏入口网格，空态和即时搜索行为保留。
- [x] 为 `/game/:id` 使用桌面页标题和项目/商品切换；项目区和商品区分别使用桌面卡片网格，自定义需求按钮继续进入 `/order/new`。
- [x] 为 `/shop` 整理搜索框和商品分类筛选工具栏，支持现有关键词、分类、游戏筛选和 URL 初始筛选；商品卡片 3–4 列展示。
- [x] 为 `/item/:id` 设置商品图文主区与价格/规格/购买摘要侧栏；摘要中的立即下单继续传递现有 `shopItemId`。
- [x] 确认 960–1279px 详情页自动改为上下布局，1280px 以上才使用并列主辅栏。

## Task 4: 报价器与下单流程

**Files:** `static/app/pages.js`, `static/app/pages2.js`, `static/app/app.css`

**Interfaces:** `Calc` 和 `OrderNew` 保持现有报价 API、校验方法和路由 query；不改商品金额/折扣算法与提交 API 参数。

- [x] 将报价器输入区分组为游戏/项目、当前段位、目标段位和可选套餐；报价结果在宽屏右侧显示，提交动作继续导航到 `/order/new` 并携带现有 `calc` query。
- [x] 将 `/order/new` 的长表单按服务/角色与区服/登录凭证/联系与备注/优惠与支付分组；桌面右栏显示订单项目、价格明细和提交操作。
- [x] 粘性摘要仅用于宽屏；在 960–1279px 将摘要移到表单下方；内容过长时摘要内部可滚动且不截断提交按钮。
- [x] 保留已登录拦截、常用角色自动带入、满减/会员折扣/优惠券、余额付款/联系客服、服务端错误消息与提交禁用状态。

## Task 5: 订单、会话和售后

**Files:** `static/app/pages.js`, `static/app/pages2.js`, `static/app/app.css`

**Interfaces:** 订单列表和详情继续读取当前订单 API；`Chat` 继续使用现有会话接口；`Aftersales` 沿用现有列表 API；操作方法及状态值不变。

- [x] 为 `/orders` 建立桌面筛选与状态切换栏，订单摘要按行呈现编号、项目、金额、状态、时间与可用操作；较窄桌面自动改为卡片行。
- [x] 为 `/order/:oid` 分区展示订单状态时间线、订单资料、金额、客户操作和售后/评价；关键状态和动作置于首屏可见区域。
- [x] 为 `/order/:oid/chat` 在 1280px 以上使用消息主区和订单摘要侧栏，消息发送栏在桌面仅锚定会话容器底部，不覆盖内容；消息仍按当前逻辑轮询/刷新。
- [x] 为 `/aftersales` 采用可扫描的桌面售后记录行或表格，保留详情入口、状态和结果文案。
- [x] 对列表空态、接口失败、无权限/登录过期路径沿用现有反馈，不添加模拟订单数据。

## Task 6: 个人中心、资料和权益页面

**Files:** `static/app/pages.js`, `static/app/pages2.js`, `static/app/app.css`

**Interfaces:** 各页面使用当前会员资料、余额、优惠券、通知、积分、抽奖、角色、邀请和等级 API；所有提交操作沿用现有方法。

- [x] 将 `/me` 设计为账户摘要主卡 + 功能菜单分栏，含现有余额、订单、未读消息及账户设置入口。
- [x] 将 `/profile`、`/fees`、`/coupons`、`/notices`、`/points`、`/lottery`、`/roles`、`/invite`、`/levels` 改为适合桌面阅读的表单、列表或卡片分区；只有确有多列字段对比的数据用表格。
- [x] 对可编辑表单统一设定标签列宽、输入最大宽度和主次按钮位置；保留当前表单字段、校验、确认弹窗与提交结果。
- [x] 抽奖转盘在桌面使用较大但有界的尺寸，奖品规则/记录并列展示；角色管理和邀请页使用明确的主操作区域。

## Task 7: 帮助、客服、协议和认证页面

**Files:** `static/app/pages.js`, `static/app/pages2.js`, `static/app/app.css`

**Interfaces:** `Faq`、`Contact`、`Legal`、`Login`、`Register` 使用原有 API、路由和登录回跳 query。

- [x] 将 FAQ 和法律/隐私正文限定在舒适阅读宽度；保留现有分类、正文内容与链接。
- [x] 将联系表单、常见问题入口及提交结果置于清晰主列；登录状态拦截及消息提交流程不变。
- [x] 为登录和注册提供 PC 居中卡片及品牌说明空间；保留手机号、协议勾选、密码规则、返回路径和“先逛逛”操作。
- [x] 检查认证无导航布局不会继承桌面主框架的顶栏间距或固定定位。

## Task 8: 完成响应式边界、说明和交付检查

**Files:** `static/app/app.css`, `static/app/app.js`, `static/app/pages.js`, `static/app/pages2.js`, `README.md`

- [x] 从路由数组逐一核对：`/`、`/games`、`/game/:id`、`/shop`、`/item/:id`、`/order/new`、`/orders`、`/order/:oid`、`/order/:oid/chat`、`/me`、`/profile`、`/fees`、`/coupons`、`/notices`、`/points`、`/lottery`、`/roles`、`/invite`、`/aftersales`、`/calc`、`/boosters`、`/search`、`/agreement`、`/privacy`、`/news`、`/news/:id`、`/faq`、`/levels`、`/contact`、`/login`、`/register`。
- [x] 静态审阅桌面选择器作用域和路由/模板 diff，确认手机样式、暗色主题、键盘焦点、加载/错误/空态与 API 调用没有因展示调整被删除或重复。
- [x] 更新 README 的客户端说明，说明 PC 使用同一个 `/app/` 地址、桌面布局适配行为及仍未接入的外部服务限制。
- [x] 在交付说明中列出实际完成的路由和剩余限制；未实际运行的测试与未做的浏览器检查不得表述为已验证。

## Spec coverage self-review

- 全局框架、路由高亮、断点和手机端保护：Task 1、Task 8。
- 首页/游戏/商城/商品详情：Task 2、Task 3。
- 报价/下单/摘要侧栏：Task 4。
- 订单/会话/售后：Task 5。
- 账户与权益：Task 6。
- 帮助、协议、登录注册：Task 7。
- 暗色主题、无横溢出和文档：Task 1、Task 8。
- 后端不变和集成限制：Global Constraints、Task 4–8。

## Execution note

当前运行环境没有 `superpowers:subagent-driven-development` 或 `superpowers:executing-plans` 技能可用；同时本任务的协作规则不允许主动派发子代理。执行者应在当前会话按 Task 1 到 Task 8 顺序内联推进，并在每组完成后检查变更范围。Git 索引当前不可写，因此本环境无法按步骤提交 Git commit。
