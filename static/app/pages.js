/* 客户端页面组件（Vue 3，模板内联）。UI.toast / UI.confirm / store 由 app.js 提供 */
window.Pages = (function () {
    var money = Fmt.money;

    var TopBar = {
        props: { title: String, back: { type: Boolean, default: true } },
        template: '<div class="topbar"><button v-if="back" class="back" aria-label="返回上一页" @click="goBack">‹</button><div class="title" :class="{left:!back}">{{ title }}</div><slot></slot></div>' +
            '<h1 class="desk-title" v-if="title"><button v-if="back" class="back" aria-label="返回上一页" @click="goBack">‹</button>{{ title }}</h1>',
        methods: { goBack: function () { if (window.history.state && window.history.state.back) { this.$router.back(); return; } var tabs = { home: '/', games: '/games', shop: '/shop', calc: '/calc', orders: '/orders', me: '/me' }; this.$router.push(tabs[this.$route.meta.tab] || '/'); } }
    };

    var Empty = { props: { text: { type: String, default: '暂无数据' }, ico: { type: String, default: '📭' } }, template: '<div class="empty"><div class="ico">{{ ico }}</div>{{ text }}</div>' };

    var Home = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { d: null, loading: true, error: '', countdown: '', timer: null }; },
        template: '<div class="page pc-page pc-home">' +
            '<div v-if="loading" class="card load-state"><div class="skeleton"></div><div class="skeleton" style="width:70%"></div><div class="skeleton" style="width:42%"></div></div>' +
            '<div v-else-if="error" class="card load-error"><div>{{ error }}</div><button class="btn sm ghost" @click="load">重试</button></div>' +
            '<div v-if="d && !error" class="hero"><div class="deco"></div><h2>{{ d ? d.company : "" }}</h2><p>专业代练 · 全程进度可查 · 完单短信通知</p>' +
            '<div class="btns" style="margin-top:12px"><button class="btn gold" @click="$router.push(\'/games\')">立即下单</button><button class="btn plain" @click="$router.push(\'/orders\')">查看我的订单</button></div></div>' +
            '<button v-if="d && !error" type="button" class="search-box" aria-label="搜索游戏、项目、套餐" @click="$router.push(\'/search\')"><span aria-hidden="true">⌕</span><span>搜索游戏、项目、套餐</span></button>' +
            '<div v-if="d && d.bulletin" class="notice-bar">📢 <span class="grow ellipsis">{{ d.bulletin }}</span></div>' +
            '<div v-if="d && d.activity" class="activity" @click="d.activity.link && $router.push(d.activity.link)"><div><div class="t">🔥 {{ d.activity.title }}</div><div class="d">{{ d.activity.desc }}</div></div><div class="cd" v-if="countdown"><b>{{ countdown }}</b>后结束</div></div>' +
            '<div v-if="d && d.banners.length" class="banner" :style="d.banners[0].img ? {backgroundImage: \'url(\' + d.banners[0].img + \')\'} : {}" @click="$router.push(\'/news/\' + d.banners[0].id)">{{ d.banners[0].title }}</div>' +
            '<div v-if="d && !error" class="card"><div class="card-title">选择游戏 <a class="more" @click="$router.push(\'/games\')">全部 ›</a></div>' +
            '<div class="grid g4"><div v-for="g in (d ? d.games.slice(0, 8) : [])" :key="g.id" class="game-tile" @click="$router.push(\'/game/\' + g.id)"><div class="ico" :style="{background: color(g.name)}">{{ abbr(g.name) }}</div><div class="n">{{ g.name }}</div></div></div>' +
            '<div v-if="d && !d.games.length" class="empty">暂无游戏</div></div>' +
            '<div class="card" v-if="d && d.types && d.types.length"><div class="card-title">分类专区</div><div class="chips"><span class="chip" v-for="t in d.types" :key="t" @click="$router.push({path:\'/shop\', query:{type:t}})">{{ t }}</span><span class="chip" @click="$router.push(\'/calc\')">🧮 自助报价</span><span class="chip" @click="$router.push(\'/boosters\')">🏆 打手风采</span></div></div>' +
            '<div class="card" v-if="d && d.hot.length"><div class="card-title">热门服务 <a class="more" @click="$router.push(\'/shop\')">更多 ›</a></div>' +
            '<div class="grid g2 desk4"><div v-for="it in d.hot" :key="it.id" class="card flat" style="margin:0;padding:10px;cursor:pointer" @click="$router.push(\'/item/\' + it.id)">' +
            '<div class="thumb" style="width:100%;height:90px;margin-bottom:8px" :style="it.img ? {backgroundImage:\'url(\'+it.img+\')\'} : {}"><span v-if="!it.img">🎮</span></div>' +
            '<div class="clamp2" style="font-size:13px;height:40px">{{ it.title }}</div><div class="row between" style="margin-top:4px"><span class="price">¥{{ money(it.price) }}<span class="del" v-if="it.yprice>it.price">¥{{ money(it.yprice) }}</span></span><span class="tiny muted">已售{{ it.sellCount }}</span></div></div></div></div>' +
            '<div class="card" v-if="d && d.notices.length"><div class="card-title">公告 <a class="more" @click="$router.push(\'/news\')">更多 ›</a></div>' +
            '<div class="cell" v-for="n in d.notices" :key="n.id" @click="$router.push(\'/news/\' + n.id)"><div class="lbl"><div class="ellipsis">{{ n.title }}</div><div class="small muted ellipsis">{{ n.summary }}</div></div><span class="val">{{ n.time }}</span><span class="arrow">›</span></div></div>' +
            '<div v-if="d && !error" class="grid g2" style="margin-top:4px"><div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/points\')">🎁 <b>积分商城</b><div class="small muted">消费返积分，兑好礼</div></div>' +
            '<div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/lottery\')">🎯 <b>幸运抽奖</b><div class="small muted">每天都有机会</div></div>' +
            '<div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/faq\')">❓ <b>常见问题</b><div class="small muted">下单前先看看</div></div>' +
            '<div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/contact\')">💬 <b>在线客服</b><div class="small muted">有问题随时找我们</div></div>' +
            '<div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/invite\')">🤝 <b>邀请有礼</b><div class="small muted">邀请好友双方得积分</div></div>' +
            '<div class="card" style="margin:0;cursor:pointer" @click="$router.push(\'/calc\')">🧮 <b>自助报价</b><div class="small muted">选段位，立刻知道价格</div></div></div>' +
            '</div>',
        created: function () { this.load(); },
        unmounted: function () { clearInterval(this.timer); },
        methods: {
            money: money, abbr: Fmt.game, color: Fmt.color,
            load: function () {
                var self = this;
                clearInterval(this.timer);
                this.loading = true; this.error = ''; this.d = null;
                API.get('home').then(function (r) {
                    self.loading = false;
                    if (r.code > 0 && r.data) {
                        var d = r.data;
                        d.games = Array.isArray(d.games) ? d.games : [];
                        d.banners = Array.isArray(d.banners) ? d.banners : [];
                        d.hot = Array.isArray(d.hot) ? d.hot : [];
                        d.notices = Array.isArray(d.notices) ? d.notices : [];
                        self.d = d;
                        document.title = d.company || '云序工作室';
                        self.tick();
                        self.timer = setInterval(function () { self.tick(); }, 1000);
                    } else {
                        self.d = null;
                        self.error = r.msg || '首页加载失败，请稍后重试';
                    }
                });
            },
            tick: function () {
                var a = this.d && this.d.activity; if (!a || !a.end) { this.countdown = ''; return; }
                var ms = new Date(a.end.replace(/-/g, '/')) - new Date(); if (ms <= 0) { this.countdown = '已结束'; return; }
                var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
                this.countdown = (d ? d + '天' : '') + (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
            }
        }
    };

    var Games = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { games: [], key: '' }; },
        computed: { list: function () { var k = this.key.trim(); return k ? this.games.filter(function (g) { return g.name.indexOf(k) > -1; }) : this.games; } },
        template: '<div><top-bar title="游戏服务" :back="false"></top-bar><div class="page pc-page pc-games">' +
            '<div class="pc-page-head"><div><h1>游戏服务</h1><p>选择游戏，查看可下单项目和套餐</p></div><button class="btn ghost" @click="$router.push(\'/calc\')">自助报价</button></div>' +
            '<div class="pc-toolbar"><input class="input" v-model="key" placeholder="搜索游戏" aria-label="搜索游戏"></div>' +
            '<div class="grid g2 desk4 pc-game-grid"><div v-for="g in list" :key="g.id" class="card" style="margin:0;cursor:pointer;display:flex;gap:10px;align-items:center" role="link" tabindex="0" @keyup.enter="$event.currentTarget.click()" @click="$router.push(\'/game/\' + g.id)">' +
            '<div class="thumb" style="width:48px;height:48px;color:#fff;font-weight:700" :style="{background: color(g.name)}">{{ abbr(g.name) }}</div>' +
            '<div class="grow"><div class="bold ellipsis">{{ g.name }}</div><div class="small muted">{{ g.projects }} 个代练项目 · {{ g.items }} 个商品</div></div><span class="muted">›</span></div></div>' +
            '<empty v-if="!list.length" text="没有找到游戏"></empty></div></div>',
        created: function () { var self = this; API.get('games').then(function (r) { self.games = Array.isArray(r.data) ? r.data : []; }); },
        methods: { abbr: Fmt.game, color: Fmt.color }
    };

    var GameDetail = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { g: null, tab: 'projects' }; },
        template: '<div><top-bar :title="g ? g.name : \'游戏\'"></top-bar><div class="page pc-page pc-game-detail" v-if="g">' +
            '<div class="pc-page-head"><div><div class="eyebrow">游戏服务</div><h1>{{ g.name }}</h1><p>{{ g.projects.length }} 个代练项目 · {{ g.items.length }} 个套餐商品</p></div><button class="btn ghost" @click="$router.push(\'/games\')">返回游戏列表</button></div>' +
            '<div class="filter-tabs"><span role="button" tabindex="0" @keyup.enter="$event.currentTarget.click()" :class="{on: tab==\'projects\'}" @click="tab=\'projects\'">代练项目（{{ g.projects.length }}）</span><span role="button" tabindex="0" @keyup.enter="$event.currentTarget.click()" :class="{on: tab==\'items\'}" @click="tab=\'items\'">套餐商品（{{ g.items.length }}）</span></div>' +
            '<div v-show="tab==\'projects\'"><div class="pc-grid pc-project-list"><div class="card" v-for="p in g.projects" :key="p.id" style="cursor:pointer" role="link" tabindex="0" @keyup.enter="$event.currentTarget.click()" @click="$router.push({path:\'/order/new\', query:{gameId:g.id, projectId:p.id}})">' +
            '<div class="row between"><div class="grow"><div class="bold">{{ p.name }}</div><div class="small muted">预计 {{ p.hours || "-" }} 小时完成 <span v-if="p.remark">· {{ p.remark }}</span></div></div>' +
            '<div style="text-align:right"><div class="price" v-if="p.price>0">¥{{ money(p.price) }}</div><div class="small muted" v-else>客服报价</div><button class="btn sm" style="margin-top:4px">下单</button></div></div></div>' +
            '<div class="card flat" style="cursor:pointer" @click="$router.push({path:\'/order/new\', query:{gameId:g.id}})"><div class="row between"><div><div class="bold">自定义需求</div><div class="small muted">没有合适的项目？描述你的需求，客服报价后再确认</div></div><span class="muted">›</span></div></div>' +
            '<empty v-if="!g.projects.length" text="该游戏暂无固定项目，可提交自定义需求"></empty></div></div>' +
            '<div v-show="tab==\'items\'"><div class="pc-grid pc-game-items"><div class="list-item card" style="margin-bottom:10px;cursor:pointer" v-for="it in g.items" :key="it.id" @click="$router.push(\'/item/\' + it.id)">' +
            '<div class="thumb" :style="it.img ? {backgroundImage:\'url(\'+it.img+\')\'} : {}"><span v-if="!it.img">🎮</span></div>' +
            '<div class="grow"><div class="clamp2">{{ it.title }}</div><div class="small muted"><span class="tag gray">{{ it.itemType }}</span>已售 {{ it.sellCount }}</div><div class="price">¥{{ money(it.price) }}<span class="del" v-if="it.yprice>it.price">¥{{ money(it.yprice) }}</span></div></div></div>' +
            '<empty v-if="!g.items.length" text="该游戏暂无套餐商品"></empty></div></div>' +
            '</div></div>',
        created: function () { var self = this; API.get('game', { id: this.$route.params.id }).then(function (r) { if (r.code > 0 && r.data) { self.g = r.data; self.g.projects = Array.isArray(self.g.projects) ? self.g.projects : []; self.g.items = Array.isArray(self.g.items) ? self.g.items : []; } else UI.toast(r.msg); }); },
        methods: { money: money }
    };

    var Shop = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { var m = {}; try { m = JSON.parse(localStorage.getItem('shopFilter') || '{}'); } catch (e) { } return { items: [], types: [], type: this.$route.query.type || m.type || '', key: '', game: this.$route.query.game || m.game || '', loading: false, error: '' }; },
        template: '<div><top-bar title="套餐商品" :back="false"></top-bar><div class="page pc-page pc-shop">' +
            '<div class="pc-page-head"><div><h1>套餐商城</h1><p>浏览优惠套餐，选择适合你的服务</p></div><button class="btn ghost" @click="$router.push(\'/calc\')">自助报价</button></div>' +
            '<div v-if="error" class="card load-error"><div>{{ error }}</div><button class="btn sm ghost" @click="load">重试</button></div>' +
            '<div v-if="loading" class="card load-state"><div class="skeleton"></div><div class="skeleton" style="width:65%"></div></div>' +
            '<div class="row pc-toolbar" style="gap:8px;margin-bottom:10px"><input class="input grow" v-model="key" placeholder="搜索商品" aria-label="搜索商品" @keyup.enter="load"><button class="btn" @click="load">搜索</button></div>' +
            '<div v-if="!error && !loading" class="chips pc-categories" style="margin-bottom:12px"><span class="chip" :class="{on: type==\'\'}" @click="type=\'\';load()">全部</span><span class="chip" v-for="t in types" :key="t" :class="{on: type==t}" @click="type=t;load()">{{ t }}</span></div>' +
            '<div v-if="!error && !loading" class="grid g2 desk4 pc-grid pc-product-grid"><div v-for="it in items" :key="it.id" class="card pc-product-card" style="margin:0;padding:10px;cursor:pointer" role="link" tabindex="0" @keyup.enter="$event.currentTarget.click()" @click="$router.push(\'/item/\' + it.id)">' +
            '<div class="thumb" style="width:100%;height:110px;margin-bottom:8px" :style="it.img ? {backgroundImage:\'url(\'+it.img+\')\'} : {}"><span v-if="!it.img">🎮</span></div>' +
            '<div class="clamp2" style="font-size:13px;height:40px">{{ it.title }}</div><div class="small muted">{{ it.gameName }}</div>' +
            '<div class="row between" style="margin-top:4px"><span class="price">¥{{ money(it.price) }}<span class="del" v-if="it.yprice>it.price">¥{{ money(it.yprice) }}</span></span><span class="tiny muted">已售{{ it.sellCount }}</span></div></div></div>' +
            '<empty v-if="!loading && !error && !items.length" text="暂无商品"></empty></div></div>',
        created: function () { this.load(); },
        methods: {
            money: money,
            load: function () { var self = this; try { localStorage.setItem('shopFilter', JSON.stringify({ game: this.game, type: this.type })); } catch (e) { } this.loading = true; this.error = ''; this.items = []; API.get('shop', { game: this.game, type: this.type, key: this.key }).then(function (r) { self.loading = false; if (r.code > 0 && r.data) { self.items = Array.isArray(r.data.items) ? r.data.items : []; if (!self.type) self.types = Array.isArray(r.data.types) ? r.data.types : []; } else { self.types = []; self.error = r.msg || '商品加载失败，请稍后重试'; } }); }
        }
    };

    var ShopDetail = {
        components: { TopBar: TopBar },
        data: function () { return { it: null }; },
        template: '<div><top-bar title="商品详情"></top-bar><div class="page pc-page pc-item-detail" v-if="it">' +
            '<div class="card pc-item-media"><div class="thumb" style="width:100%;height:180px;margin-bottom:10px;font-size:40px" :style="it.img ? {backgroundImage:\'url(\'+it.img+\')\'} : {}"><span v-if="!it.img">🎮</span></div></div>' +
            '<div class="card pc-item-summary"><h2 style="font-size:21px;margin:0 0 8px">{{ it.title }}</h2><div class="small muted"><span class="tag">{{ it.gameName }}</span><span class="tag gray">{{ it.itemType }}</span>已售 {{ it.sellCount }}</div>' +
            '<div class="price big" style="margin:16px 0">¥{{ money(it.price) }}<span class="del" v-if="it.yprice>it.price">¥{{ money(it.yprice) }}</span></div><button class="btn lg block gold" @click="$router.push({path:\'/order/new\', query:{shopItemId: it.id}})">立即下单</button></div>' +
            '<div class="card pc-item-description"><div class="card-title">商品详情</div><div class="article" v-html="$safeHtml(it.details || \'<span class=muted>暂无详情</span>\')"></div></div></div>',
        created: function () { var self = this; API.get('shop/detail', { id: this.$route.params.id }).then(function (r) { if (r.code > 0) self.it = r.data; else { UI.toast(r.msg); self.$router.back(); } }); },
        methods: { money: money }
    };

    var OrderNew = {
        components: { TopBar: TopBar },
        data: function () {
            var q = this.$route.query;
            return { q: q, g: null, item: null, project: null, customProject: '', quote: null, coupons: [], couponId: 0, submitting: false, done: null, roles: [], roleId: 0, saveRole: true, calc: q.calc || '',
                f: { gameArea: q.gameArea || '', gameServer: q.gameServer || '', gameJob: q.gameJob || '', gameGroup: q.gameGroup || '', roleName: q.roleName || '', gameAcc: q.gameAcc || '', gamePwd: '', moblie: '', qq: '', remark: '', payMethod: 'balance', urgent: false } };
        },
        computed: {
            servers: function () { var a = this.g && this.g.areas.filter(function (x) { return x.name === this.f.gameArea; }, this)[0]; return a ? a.servers : []; },
            myRoles: function () { var gn = this.g ? this.g.name : (this.item ? this.item.gameName : (this.q.gameName || '')); return this.roles.filter(function (r) { return !gn || r.gameName === gn; }); },
            needAcc: function () { return this.item ? this.item.needAcc : (this.g ? this.g.needAcc : true); },
            title: function () { return this.item ? this.item.title : (this.project ? this.project.name : (this.customProject || '自定义需求')); }
        },
        template: '<div><top-bar title="确认下单"></top-bar><div class="page pc-page pc-order-new">' +
            '<div v-if="done" class="card" style="text-align:center;padding:30px 16px"><div style="font-size:52px">🎉</div><h2 style="margin:8px 0">下单成功</h2><p class="muted">订单号 {{ done.orderNo }}，客服会尽快为您安排打手<br>当前余额 ¥{{ money(done.balance) }}</p>' +
            '<div class="btns" style="justify-content:center;margin-top:12px"><button class="btn" @click="$router.replace(\'/order/\' + done.oid)">查看订单</button><button class="btn plain" @click="$router.replace(\'/\')">返回首页</button></div></div>' +
            '<template v-else>' +
            '<div class="steps"><span data-n="1" class="on">选择项目</span><span data-n="2" class="on">填写资料</span><span data-n="3" :class="{on: quote}">确认支付</span></div>' +
            '<div class="card"><div class="card-title">{{ g ? g.name : (item ? item.gameName : "") }}</div>' +
            '<div v-if="item" class="row between"><div class="grow"><div class="bold">{{ item.title }}</div><div class="small muted">套餐商品</div></div><span class="price">¥{{ money(item.price) }}</span></div>' +
            '<div v-else-if="project" class="row between"><div class="grow"><div class="bold">{{ project.name }}</div><div class="small muted">预计 {{ project.hours || "-" }} 小时</div></div><span class="price" v-if="project.price>0">¥{{ money(project.price) }}</span><span class="muted small" v-else>客服报价</span></div>' +
            '<div v-else-if="calc && quote" class="row between"><div class="grow"><div class="bold">{{ quote.project }}</div><div class="small muted">自助报价<template v-if="quote.hours">，预计 {{ quote.hours }} 小时</template></div></div><span class="price">¥{{ money(quote.base) }}</span></div>' +
            '<div v-else-if="calc" class="small muted">正在计算报价…</div>' +
            '<div v-else class="form-item"><label><b>*</b>需求描述</label><input class="input" v-model="customProject" placeholder="例如：黄金到钻石、周本代打…" @change="loadQuote"><div class="small muted" style="margin-top:6px">自定义需求由客服报价后再付款，提交后客服会联系您</div></div>' +
            '<div v-if="g && g.projects.length && !item && !calc" class="chips" style="margin-top:8px"><span class="chip" v-for="p in g.projects" :key="p.id" :class="{on: project && project.id==p.id}" @click="pick(p)">{{ p.name }}</span></div></div>' +
            '<div class="card"><div class="card-title">角色资料 <a class="more" @click="$router.push(\'/roles\')">管理常用角色 ›</a></div>' +
            '<div v-if="myRoles.length" style="margin-bottom:12px"><div class="small muted" style="margin-bottom:6px">一键带入常用角色</div><div class="chips"><span class="chip" v-for="r in myRoles" :key="r.id" :class="{on: roleId==r.id}" @click="useRole(r)">{{ r.roleName }}<span class="tiny muted" v-if="r.gameArea"> {{ r.gameArea }}</span></span></div></div>' +
            '<div class="form-item" v-if="g && g.areas.length"><label><b>*</b>大区</label><select class="select" v-model="f.gameArea" @change="f.gameServer=\'\'"><option value="">请选择</option><option v-for="a in g.areas" :key="a.id" :value="a.name">{{ a.name }}</option></select></div>' +
            '<div class="form-item" v-else><label>区服</label><input class="input" v-model="f.gameArea" placeholder="如：安卓QQ区 / 微信区"></div>' +
            '<div class="form-item" v-if="servers.length"><label>服务器</label><select class="select" v-model="f.gameServer"><option value="">请选择</option><option v-for="s in servers" :key="s" :value="s">{{ s }}</option></select></div>' +
            '<div class="row" style="gap:10px"><div class="form-item grow" v-if="g && g.jobs.length"><label>职业</label><select class="select" v-model="f.gameJob"><option value="">请选择</option><option v-for="s in g.jobs" :key="s" :value="s">{{ s }}</option></select></div>' +
            '<div class="form-item grow" v-if="g && g.groups.length"><label>阵营</label><select class="select" v-model="f.gameGroup"><option value="">请选择</option><option v-for="s in g.groups" :key="s" :value="s">{{ s }}</option></select></div></div>' +
            '<div class="form-item"><label><b>*</b>角色名</label><input class="input" v-model="f.roleName" placeholder="游戏内角色名" maxlength="30"></div>' +
            '<template v-if="needAcc"><div class="form-item"><label><b>*</b>游戏账号</label><input class="input" v-model="f.gameAcc" placeholder="打手上号用" maxlength="50"></div>' +
            '<div class="form-item"><label><b>*</b>游戏密码</label><input class="input" v-model="f.gamePwd" placeholder="密码仅打手上号可见，完单后系统会清除" maxlength="50"></div></template>' +
            '<div class="row" style="gap:10px"><div class="form-item grow"><label>联系手机</label><input class="input" v-model="f.moblie" placeholder="默认用注册手机" maxlength="20"></div><div class="form-item grow"><label>QQ / 微信</label><input class="input" v-model="f.qq" placeholder="选填" maxlength="30"></div></div>' +
            '<div class="form-item"><label>备注要求</label><textarea class="textarea" v-model="f.remark" placeholder="如：指定英雄、上号时间、不要用皮肤…" maxlength="300"></textarea></div>' +
            '<label class="row" style="gap:8px;cursor:pointer"><input type="checkbox" v-model="f.urgent"> 加急（客服优先安排）</label>' +
            '<label class="row" style="gap:8px;cursor:pointer;margin-top:6px" v-if="!roleId"><input type="checkbox" v-model="saveRole"> 保存为常用角色，下次一键带入</label></div>' +
            '<div class="card" v-if="quote"><div class="card-title">费用明细</div>' +
            '<div class="kv"><span class="k">项目价格</span><span>¥{{ money(quote.base) }}</span></div>' +
            '<div class="kv" v-if="quote.discount<1"><span class="k">会员折扣（{{ quote.discountText }}）</span><span class="price">-¥{{ money(quote.base - quote.afterDiscount) }}</span></div>' +
            '<div class="kv" v-if="quote.fullDec>0"><span class="k">满减优惠</span><span class="price">-¥{{ money(quote.fullDec) }}</span></div>' +
            '<div class="kv"><span class="k">抵扣券</span><span><select class="select" style="height:32px;width:180px" v-model="couponId" @change="loadQuote"><option :value="0">不使用</option><option v-for="c in coupons" :key="c.id" :value="c.id">{{ c.name }} -¥{{ money(c.faceValue) }}<template v-if="c.availableAmount>0">（满{{ money(c.availableAmount) }}可用）</template></option></select></span></div>' +
            '<div class="kv" v-if="quote.coupon>0"><span class="k">券抵扣</span><span class="price">-¥{{ money(quote.coupon) }}</span></div>' +
            '<div class="divider"></div><div class="kv"><span class="k bold" style="color:var(--text)">应付</span><span class="price big">¥{{ money(quote.final) }}</span></div>' +
            '<div class="radio-row" style="margin-top:10px"><div class="radio-box" :class="{on: f.payMethod==\'balance\'}" @click="f.payMethod=\'balance\'"><div class="t">余额支付</div><div class="d">当前余额 ¥{{ money(quote.balance) }}<span v-if="quote.balance<quote.final && !quote.allowDebt" style="color:var(--danger)"> 不足</span></div></div>' +
            '<div class="radio-box" :class="{on: f.payMethod==\'offline\'}" @click="f.payMethod=\'offline\'"><div class="t">联系客服付款</div><div class="d">先提交，付款后开打</div></div></div></div>' +
            '<div class="card" v-else-if="!item && !project && customProject"><div class="muted small">自定义需求提交后由客服报价，报价确认后再支付</div></div>' +
            '<button class="btn lg block gold" :disabled="submitting" @click="submit">{{ quote ? "确认下单 ¥" + money(quote.final) : "提交需求" }}</button>' +
            '<p class="tiny muted" style="text-align:center;margin-top:8px">提交即表示同意由本店打手登录您的账号完成代练</p>' +
            '</template></div></div>',
        created: function () {
            var self = this, q = this.q;
            if (q.shopItemId) {
                API.get('shop/detail', { id: q.shopItemId }).then(function (r) {
                    if (r.code <= 0) { UI.toast(r.msg); return; }
                    self.item = r.data;
                    if (r.data.gameId) API.get('game', { id: r.data.gameId }).then(function (g) { if (g.code > 0) self.g = g.data; });
                    self.loadQuote();
                });
            } else if (q.gameId) {
                API.get('game', { id: q.gameId }).then(function (r) {
                    if (r.code <= 0) { UI.toast(r.msg); return; }
                    self.g = r.data || {};
                    self.g.projects = Array.isArray(self.g.projects) ? self.g.projects : [];
                    self.g.items = Array.isArray(self.g.items) ? self.g.items : [];
                    self.g.areas = Array.isArray(self.g.areas) ? self.g.areas : [];
                    self.g.jobs = Array.isArray(self.g.jobs) ? self.g.jobs : [];
                    self.g.groups = Array.isArray(self.g.groups) ? self.g.groups : [];
                    if (q.projectId) { self.project = self.g.projects.filter(function (p) { return String(p.id) === String(q.projectId); })[0] || null; }
                    else if (q.project) { self.project = self.g.projects.filter(function (p) { return p.name === q.project; })[0] || null; if (!self.project) self.customProject = q.project; }
                    self.loadQuote();
                });
            } else if (q.calc) {
                API.get('games').then(function (r) { var g = (r.data || []).filter(function (x) { return x.name === q.gameName; })[0]; if (g) API.get('game', { id: g.id }).then(function (gd) { if (gd.code > 0) self.g = gd.data; }); });
                this.loadQuote();
            }
            API.get('coupons').then(function (r) { var rows = r.code > 0 && Array.isArray(r.data) ? r.data : []; self.coupons = rows.filter(function (c) { return c.status === '未使用'; }); });
            API.get('roles').then(function (r) { if (r.code > 0) { self.roles = Array.isArray(r.data) ? r.data : []; if (q.roleId) { var role = self.roles.filter(function (x) { return String(x.id) === String(q.roleId); })[0]; if (role) self.useRole(role); } } else self.roles = []; });
            if (store.user) this.f.moblie = store.user.phone;
        },
        methods: {
            money: money,
            pick: function (p) { this.project = p; this.customProject = ''; this.calc = ''; this.loadQuote(); },
            useRole: function (r) { var self = this; this.roleId = r.id; ['gameArea', 'gameServer', 'gameJob', 'gameGroup', 'roleName', 'gameAcc'].forEach(function (k) { self.f[k] = r[k] || ''; }); if (r.hasPwd) { API.get('roles', { gameName: r.gameName }).then(function (res) { var x = (res.data || []).filter(function (y) { return y.id === r.id; })[0]; if (x && x.gamePwd) self.f.gamePwd = x.gamePwd; }); } },
            params: function () {
                var d = { gameId: this.g ? this.g.id : (this.item ? this.item.gameId : ''), shopItemId: this.item ? this.item.id : '', projectId: this.project ? this.project.id : '', project: this.customProject, couponId: this.couponId || '', calc: this.calc || '' };
                return d;
            },
            loadQuote: function () {
                var self = this;
                if (!this.item && !this.project && !this.customProject && !this.calc) { this.quote = null; return; }
                API.get('order/quote', this.params()).then(function (r) { self.quote = r.code > 0 ? r.data : null; });
            },
            submit: function () {
                var self = this;
                if (!store.user) { UI.toast('请先登录'); this.$router.push({ path: '/login', query: { back: this.$route.fullPath } }); return; }
                if (!this.item && !this.project && !this.customProject.trim() && !this.calc) { UI.toast('请选择项目或填写需求'); return; }
                if (!this.f.roleName.trim()) { UI.toast('请填写角色名'); return; }
                if (this.needAcc && (!this.f.gameAcc.trim() || !this.f.gamePwd.trim())) { UI.toast('请填写游戏账号和密码'); return; }
                if (!this.quote) { UI.toast('该需求需要客服报价，请通过“在线客服”联系我们'); this.$router.push('/contact'); return; }
                var d = Object.assign({}, this.params(), this.f, { urgent: this.f.urgent ? '1' : '0', saveRole: this.saveRole && !this.roleId ? '1' : '0', roleId: this.roleId || '' });
                this.submitting = true;
                API.post('order/create', d).then(function (r) {
                    self.submitting = false;
                    if (r.code > 0) { self.done = r.data; store.refreshMe(); } else UI.toast(r.msg);
                });
            }
        }
    };

    var Orders = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { tab: 'active', rows: [], total: 0, loading: true, error: '' }; },
        template: '<div><top-bar title="我的订单" :back="false"></top-bar><div class="page pc-page pc-orders">' +
            '<div class="pc-page-head"><div><h1>我的订单</h1><p>查看服务进度、联系商家并管理售后</p></div><button class="btn" @click="$router.push(\'/games\')">继续下单</button></div>' +
            '<div class="filter-tabs"><span role="button" tabindex="0" @keyup.enter="$event.currentTarget.click()" :class="{on: tab==\'active\'}" @click="tab=\'active\';load()">进行中</span><span role="button" tabindex="0" @keyup.enter="$event.currentTarget.click()" :class="{on: tab==\'done\'}" @click="tab=\'done\';load()">已完成</span><span role="button" tabindex="0" @keyup.enter="$event.currentTarget.click()" :class="{on: tab==\'all\'}" @click="tab=\'all\';load()">全部</span></div>' +
            '<div v-if="error" class="card load-error"><div>{{ error }}</div><button class="btn sm ghost" @click="load">重试</button></div>' +
            '<div class="card pc-order-row" v-if="!error" v-for="o in rows" :key="o.oid" style="cursor:pointer" role="link" tabindex="0" @keyup.enter="$event.currentTarget.click()" @click="$router.push(\'/order/\' + o.oid)">' +
            '<div class="row between"><span class="small muted">{{ o.createTime }} · {{ o.orderNo }}</span><span class="small bold" :style="{color:o.staColor}"><i class="status-dot" :style="{background:o.staColor}"></i>{{ o.orderSta }}</span></div>' +
            '<div class="row" style="margin-top:8px;gap:10px"><div class="thumb" style="width:44px;height:44px;color:#fff;font-weight:700;font-size:15px" :style="{background: color(o.gameName)}">{{ abbr(o.gameName) }}</div>' +
            '<div class="grow"><div class="bold ellipsis">{{ o.project }}</div><div class="small muted ellipsis">{{ o.gameName }} · {{ o.roleName }}<span v-if="o.gameArea"> · {{ o.gameArea }}</span></div></div><div class="price">¥{{ money(o.price) }}</div></div>' +
            '<div class="progress"><i :style="{width: o.progress + \'%\'}"></i></div>' +
            '<div class="row between small muted"><span>{{ o.orderSta=="已完成" ? "完成于 " + o.completeTime : (o.expectEndTime ? "预计 " + o.expectEndTime + " 完成" : "等待安排") }}</span><span><span class="tag" v-if="o.payStatus" :class="o.payStatus==\'已付款\' ? \'green\' : \'red\'">{{ o.payStatus }}</span><span v-if="o.isJiaJi==\'Y\'" class="tag red">加急</span><span v-if="o.unread" class="tag red">{{ o.unread }} 条新回复</span><span v-if="o.canReview" class="tag gold">待评价</span></span></div></div>' +
            '<empty v-if="!loading && !error && !rows.length" text="还没有订单" ico="🧾"></empty>' +
            '<div class="btns" style="justify-content:center" v-if="!loading && !error && !rows.length"><button class="btn" @click="$router.push(\'/games\')">去下单</button></div></div></div>',
        created: function () { this.load(); },
        methods: {
            money: money, abbr: Fmt.game, color: Fmt.color,
            load: function () { var self = this; this.loading = true; this.error = ''; API.get('orders', { status: this.tab, limit: 100 }).then(function (r) { self.loading = false; if (r.code > 0 && r.data) { self.rows = Array.isArray(r.data.rows) ? r.data.rows : []; self.total = Number(r.data.total) || 0; } else { self.rows = []; self.total = 0; self.error = r.msg || '订单加载失败，请稍后重试'; } }); }
        }
    };

    var OrderDetail = {
        components: { TopBar: TopBar },
        data: function () { return { o: null, sending: false, showReview: false, rv: { stars: 5, content: '' }, showAs: false, as: { type: '退款', amount: '', reason: '' } }; },
        template: '<div><top-bar title="订单详情"></top-bar><div class="page pc-page pc-order-detail" v-if="o">' +
            '<div class="card pc-order-status" :style="{borderTop: \'4px solid \' + o.staColor}"><div class="row between"><h2 style="margin:0;font-size:18px;color:var(--text)">{{ o.orderSta }}</h2><span class="tag" v-if="o.payStatus" :class="o.payStatus==\'已付款\' ? \'green\' : \'red\'">{{ o.payStatus }}</span></div>' +
            '<div class="progress"><i :style="{width: o.progress + \'%\'}"></i></div>' +
            '<div class="small muted">{{ stageText }}</div>' +
            '<div class="btns" style="margin-top:12px"><button v-if="o.canConfirm" class="btn" @click="confirmDone">确认验收</button><button v-if="o.canReview" class="btn gold" @click="showReview=true">评价订单</button>' +
            '<button v-if="o.canMessage" class="btn ghost" @click="$router.push(\'/order/\' + o.oid + \'/chat\')">联系客服<span v-if="o.unread" class="tag red" style="margin-left:4px">{{ o.unread }}</span></button>' +
            '<button class="btn plain" @click="reorder">再来一单</button><button v-if="o.canAftersale" class="btn plain" @click="showAs=true">申请售后</button><button v-if="o.canCancel" class="btn plain" @click="cancel">撤销订单</button></div></div>' +
            '<div class="card" v-if="o.review"><div class="card-title">我的评价 <span class="stars">{{ "★".repeat(o.review.stars) }}{{ "☆".repeat(5 - o.review.stars) }}</span></div><div>{{ o.review.content || "好评" }}</div><div class="small muted">{{ o.review.time }}</div><div class="small" style="margin-top:6px;color:var(--primary)" v-if="o.review.reply">商家回复：{{ o.review.reply }}</div></div>' +
            '<div class="card" v-if="o.aftersales && o.aftersales.length"><div class="card-title">售后申请</div><div v-for="a in o.aftersales" :key="a.id" style="padding:6px 0;border-bottom:1px solid var(--line)"><div class="row between"><b>{{ a.type }}<template v-if="a.amount"> ¥{{ money(a.amount) }}</template></b><span class="tag" :class="a.status==\'已完成\' ? \'green\' : (a.status==\'已驳回\' ? \'gray\' : \'gold\')">{{ a.status }}</span></div><div class="small muted">{{ a.time }} · {{ a.reason }}</div><div class="small" style="color:var(--primary)" v-if="a.result">客服：{{ a.result }}<template v-if="a.refundAmount">（已退款 ¥{{ money(a.refundAmount) }}）</template></div></div></div>' +
            '<div class="card"><div class="card-title">订单信息</div>' +
            '<div class="kv"><span class="k">订单号</span><span>{{ o.orderNo }}</span></div><div class="kv"><span class="k">游戏</span><span>{{ o.gameName }}</span></div><div class="kv"><span class="k">项目</span><span style="text-align:right">{{ o.project }}</span></div>' +
            '<div class="kv"><span class="k">角色</span><span>{{ o.roleName }}<template v-if="o.gameArea"> / {{ o.gameArea }}</template><template v-if="o.gameServer"> {{ o.gameServer }}</template></span></div>' +
            '<div class="kv" v-if="o.gameJob || o.gameGroup"><span class="k">职业/阵营</span><span>{{ o.gameJob }} {{ o.gameGroup }}</span></div>' +
            '<div class="kv" v-if="o.gameAcc"><span class="k">游戏账号</span><span>{{ o.gameAcc }}</span></div>' +
            '<div class="kv"><span class="k">下单时间</span><span>{{ o.createTime }}</span></div><div class="kv" v-if="o.startTime"><span class="k">开始时间</span><span>{{ o.startTime }}</span></div>' +
            '<div class="kv" v-if="o.expectEndTime && o.orderSta!=\'已完成\'"><span class="k">预计完成</span><span>{{ o.expectEndTime }}</span></div><div class="kv" v-if="o.completeTime"><span class="k">完成时间</span><span>{{ o.completeTime }}</span></div>' +
            '<div class="kv" v-if="o.kefu"><span class="k">专属客服</span><span>{{ o.kefu }}</span></div><div class="kv" v-if="o.remark"><span class="k">备注</span><span style="text-align:right">{{ o.remark }}</span></div>' +
            '<div class="divider"></div><div class="kv"><span class="k">实付金额</span><span class="price big">¥{{ money(o.price) }}<span class="del" v-if="o.originPrice>o.price">¥{{ money(o.originPrice) }}</span></span></div></div>' +
            '<div class="card" v-if="o.imgs && o.imgs.length"><div class="card-title">代练截图</div><div class="grid g2"><img v-for="(im, i) in o.imgs" :key="i" :src="im.url || im" style="border-radius:8px;width:100%"></div></div>' +
            '<div class="card"><div class="card-title">进度记录</div><div class="timeline"><div v-for="(l, i) in o.logs" :key="i" :class="{mine: l.mine}">{{ l.content }}<small>{{ l.time }}</small></div><div v-if="!o.logs.length" class="muted">暂无记录</div></div></div>' +
            '<div class="mask" v-if="showReview" @click.self="showReview=false"><div class="sheet"><h3>评价这笔订单</h3><div class="small muted" style="margin-bottom:8px">打手：{{ o.recManName || "本店打手" }}，评价后奖励 5 积分</div>' +
            '<div class="star-pick" style="margin-bottom:12px"><span v-for="n in 5" :key="n" :class="{on: n<=rv.stars}" @click="rv.stars=n">★</span><span class="small muted" style="font-size:13px;align-self:center;margin-left:6px">{{ ["", "很差", "较差", "一般", "满意", "非常满意"][rv.stars] }}</span></div>' +
            '<textarea class="textarea" v-model="rv.content" placeholder="说说这次代练的体验（选填）" maxlength="300"></textarea>' +
            '<div class="btns" style="margin-top:12px"><button class="btn grow" :disabled="sending" @click="review">提交评价</button><button class="btn plain" @click="showReview=false">取消</button></div></div></div>' +
            '<div class="mask" v-if="showAs" @click.self="showAs=false"><div class="sheet"><h3>申请售后</h3>' +
            '<div class="radio-row" style="margin-bottom:12px"><div class="radio-box" v-for="t in [\'退款\', \'投诉\', \'补打\']" :key="t" :class="{on: as.type==t}" @click="as.type=t"><div class="t">{{ t }}</div><div class="d">{{ {退款: "申请部分或全额退款", 投诉: "反馈打手或服务问题", 补打: "未完成部分要求补打"}[t] }}</div></div></div>' +
            '<div class="form-item" v-if="as.type==\'退款\'"><label>申请退款金额（实付 ¥{{ money(o.price) }}）</label><input class="input" v-model="as.amount" inputmode="decimal"></div>' +
            '<div class="form-item"><label><b>*</b>问题描述</label><textarea class="textarea" v-model="as.reason" placeholder="请描述遇到的问题，客服会尽快处理" maxlength="500"></textarea></div>' +
            '<div class="btns"><button class="btn grow" :disabled="sending" @click="aftersale">提交申请</button><button class="btn plain" @click="showAs=false">取消</button></div></div></div>' +
            '</div></div>',
        computed: {
            stageText: function () {
                var o = this.o; if (!o) return '';
                return { '未分配': '客服正在为您安排打手', '待上号': '打手已安排，即将上号', '代练中': '正在代练中，请勿登录游戏', '待验收': '代练已完成，请登录游戏确认后点“确认验收”', '已完成': '订单已完成，感谢支持', '已暂停': '订单已暂停，如有疑问请留言', '问题单': '订单有问题，客服会尽快联系您', '已撤销': '订单已撤销' }[o.orderSta] || '';
            }
        },
        created: function () { this.load(); },
        methods: {
            money: money,
            load: function () { var self = this; API.get('order/detail', { oid: this.$route.params.oid }).then(function (r) { if (r.code > 0) self.o = r.data; else { UI.toast(r.msg); self.$router.replace('/orders'); } }); },
            review: function () { var self = this; this.sending = true; API.post('order/review', { oid: this.o.oid, stars: this.rv.stars, content: this.rv.content }).then(function (r) { self.sending = false; UI.toast(r.msg); if (r.code > 0) { self.showReview = false; self.load(); store.refreshMe(); } }); },
            aftersale: function () { var self = this; if ((this.as.reason || '').trim().length < 5) { UI.toast('请描述问题（至少 5 个字）'); return; } this.sending = true; API.post('order/aftersale', { oid: this.o.oid, type: this.as.type, amount: this.as.amount, reason: this.as.reason }).then(function (r) { self.sending = false; UI.toast(r.msg); if (r.code > 0) { self.showAs = false; self.as = { type: '退款', amount: '', reason: '' }; self.load(); } }); },
            reorder: function () { var o = this.o, q = o.shopItemId ? { shopItemId: o.shopItemId } : { gameId: o.gameId, project: o.project }; Object.assign(q, { roleName: o.roleName, gameArea: o.gameArea, gameServer: o.gameServer, gameJob: o.gameJob, gameGroup: o.gameGroup, gameAcc: o.gameAcc }); this.$router.push({ path: '/order/new', query: q }); },
            confirmDone: function () { var self = this; UI.confirm('确认代练已完成？确认后订单将结束').then(function (ok) { if (!ok) return; API.post('order/confirm', { oid: self.o.oid }).then(function (r) { UI.toast(r.msg); if (r.code > 0) self.load(); }); }); },
            cancel: function () { var self = this; UI.confirm('确定撤销这笔订单？已支付的金额会退回余额').then(function (ok) { if (!ok) return; API.post('order/cancel', { oid: self.o.oid }).then(function (r) { UI.toast(r.msg); if (r.code > 0) { self.load(); store.refreshMe(); } }); }); }
        }
    };

    var Me = {
        components: { TopBar: TopBar },
        template: '<div><top-bar title="我的" :back="false"></top-bar><div class="page pc-page pc-me">' +
            '<div class="me-head" v-if="u"><div class="row"><div class="avatar">{{ (u.name || "客").slice(0,1) }}</div><div class="grow"><div class="bold" style="font-size:17px">{{ u.name }} <span class="tag gold">{{ u.levelName }}</span></div><div class="small" style="opacity:.85">{{ u.phone }} · 会员号 {{ u.customerNo }}</div></div><button class="btn sm plain" @click="$router.push(\'/profile\')">编辑</button></div>' +
            '<div class="me-stats"><div @click="$router.push(\'/fees\')"><b>¥{{ money(u.balance) }}</b><span>余额</span></div><div @click="$router.push(\'/points\')"><b>{{ u.integral }}</b><span>积分</span></div><div @click="$router.push(\'/coupons\')"><b>{{ u.coupons }}</b><span>优惠券</span></div><div @click="$router.push(\'/levels\')"><b>{{ u.discount<1 ? (Math.round(u.discount*100)/10) + "折" : "无折扣" }}</b><span>会员折扣</span></div></div></div>' +
            '<div class="card" v-else style="text-align:center;padding:24px"><div class="muted" style="margin-bottom:10px">登录后可下单、查看进度、领取积分奖励</div><div class="btns" style="justify-content:center"><button class="btn" @click="$router.push(\'/login\')">登录</button><button class="btn ghost" @click="$router.push(\'/register\')">注册</button></div></div>' +
            '<div class="card" v-if="u"><div class="cell" @click="$router.push(\'/orders\')"><span class="ico">🧾</span><span class="lbl">我的订单</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/notices\')"><span class="ico">🔔</span><span class="lbl">消息通知</span><span class="tag red" v-if="u.unread">{{ u.unread }}</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/fees\')"><span class="ico">💰</span><span class="lbl">余额明细 / 充值</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/points\')"><span class="ico">🎁</span><span class="lbl">积分商城</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/lottery\')"><span class="ico">🎯</span><span class="lbl">幸运抽奖</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/coupons\')"><span class="ico">🎫</span><span class="lbl">我的优惠券</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/roles\')"><span class="ico">🎮</span><span class="lbl">我的游戏角色</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/aftersales\')"><span class="ico">🛡️</span><span class="lbl">售后记录</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/invite\')"><span class="ico">🤝</span><span class="lbl">邀请有礼</span><span class="val" v-if="u && u.inviteCode">邀请码 {{ u.inviteCode }}</span><span class="arrow">›</span></div></div>' +
            '<div class="card"><div class="cell" @click="$router.push(\'/calc\')"><span class="ico">🧮</span><span class="lbl">自助报价</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/boosters\')"><span class="ico">🏆</span><span class="lbl">打手风采</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/levels\')"><span class="ico">👑</span><span class="lbl">会员等级与折扣</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/circle\')"><span class="ico">📣</span><span class="lbl">系统圈子</span><span class="arrow">›</span></div>' +
'<div class="cell" @click="$router.push(\'/blacklist\')"><span class="ico">🧭</span><span class="lbl">避坑查询</span><span class="arrow">›</span></div>' +
'<div class="cell" @click="$router.push(\'/faq\')"><span class="ico">❓</span><span class="lbl">常见问题</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/contact\')"><span class="ico">💬</span><span class="lbl">在线客服</span><span class="val" v-if="u && u.servicePerson">专属客服 {{ u.servicePerson }}</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/news\')"><span class="ico">📢</span><span class="lbl">公告</span><span class="arrow">›</span></div></div>' +
            '<div class="card"><div class="cell" style="cursor:default"><span class="ico">🌙</span><span class="lbl">深色模式</span><div class="seg"><span :class="{on: theme==\'auto\'}" @click="setTheme(\'auto\')">跟随系统</span><span :class="{on: theme==\'light\'}" @click="setTheme(\'light\')">浅色</span><span :class="{on: theme==\'dark\'}" @click="setTheme(\'dark\')">深色</span></div></div>' +
            '<div class="cell" style="cursor:default"><span class="ico">🔠</span><span class="lbl">字号</span><div class="seg"><span :class="{on: font==\'normal\'}" @click="setFont(\'normal\')">标准</span><span :class="{on: font==\'large\'}" @click="setFont(\'large\')">大字</span></div></div>' +
            '<div class="cell" @click="$router.push(\'/agreement\')"><span class="ico">📄</span><span class="lbl">用户协议</span><span class="arrow">›</span></div>' +
            '<div class="cell" @click="$router.push(\'/privacy\')"><span class="ico">🔒</span><span class="lbl">隐私政策</span><span class="arrow">›</span></div></div>' +
            '<button v-if="u" class="btn plain block" @click="logout">退出登录</button></div></div>',
        computed: { u: function () { return store.user; }, theme: function () { return store.theme; }, font: function () { return store.font; } },
        created: function () { store.refreshMe(); },
        methods: { money: money, logout: function () { var self = this; API.post('logout').then(function () { store.user = null; UI.toast('已退出'); self.$router.replace('/'); }); },
            setTheme: function (v) { UI.applyTheme(v); }, setFont: function (v) { UI.applyFont(v); } }
    };

    var Profile = {
        components: { TopBar: TopBar },
        data: function () { var u = store.user || {}; return { f: { name: u.name || '', wxNo: u.wxNo || '', qq: u.qq || '' }, pw: { old: '', new: '', again: '' }, closePwd: '' }; },
        template: '<div><top-bar title="个人资料"></top-bar><div class="page narrow pc-profile">' +
            '<div class="card"><div class="form-item"><label>昵称</label><input class="input" v-model="f.name" maxlength="20"></div><div class="form-item"><label>微信号</label><input class="input" v-model="f.wxNo" maxlength="30"></div><div class="form-item"><label>QQ</label><input class="input" v-model="f.qq" maxlength="30"></div><button class="btn block" @click="save">保存</button></div>' +
            '<div class="card"><div class="card-title">修改密码</div><div class="form-item"><label>原密码</label><input class="input" type="password" v-model="pw.old"></div><div class="form-item"><label>新密码</label><input class="input" type="password" v-model="pw.new" placeholder="至少 6 位"></div><div class="form-item"><label>确认新密码</label><input class="input" type="password" v-model="pw.again"></div><button class="btn plain block" @click="changePw">修改密码</button></div>' +
            '<div class="card"><div class="card-title">注销账号</div><p class="small muted">注销后账号将停用、无法登录，进行中的订单需先完成。</p><div class="form-item"><label>输入密码确认</label><input class="input" type="password" v-model="closePwd"></div><button class="btn plain block" style="color:var(--danger)" @click="closeAcc">注销账号</button></div></div></div>',
        methods: {
            save: function () { API.post('profile', this.f).then(function (r) { UI.toast(r.msg); if (r.code > 0) store.user = r.data; }); },
            changePw: function () { var self = this; if (this.pw.new !== this.pw.again) { UI.toast('两次输入的新密码不一致'); return; } API.post('password', { old: this.pw.old, new: this.pw.new }).then(function (r) { UI.toast(r.msg); if (r.code > 0) self.pw = { old: '', new: '', again: '' }; }); },
            closeAcc: function () { var self = this; if (!this.closePwd) { UI.toast('请输入密码'); return; } UI.confirm('确定注销账号？此操作不可恢复').then(function (ok) { if (!ok) return; API.post('close', { pwd: self.closePwd }).then(function (r) { UI.toast(r.msg); if (r.code > 0) { store.user = null; self.$router.replace('/'); } }); }); }
        }
    };

    var Fees = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], loaded: false }; },
        template: '<div><top-bar title="余额明细"></top-bar><div class="page narrow pc-fees">' +
            '<div class="card" v-if="u" style="background:linear-gradient(135deg,#13c2c2,#36cfc9);color:#fff"><div class="small" style="opacity:.9">当前余额</div><div style="font-size:28px;font-weight:700">¥{{ money(u.balance) }}</div><div class="small" style="opacity:.9;margin-top:6px">充值请联系在线客服，客服确认收款后余额即时到账</div><button class="btn sm plain" style="margin-top:8px" @click="$router.push(\'/contact\')">联系客服充值</button></div>' +
            '<div class="card"><div class="card-title">收支记录</div><div class="list-item" v-for="(r, i) in rows" :key="i" style="align-items:center"><div class="grow"><div>{{ r.type }}<span class="small muted" v-if="r.orderNo"> · {{ r.orderNo }}</span></div><div class="small muted">{{ r.time }} {{ r.remark }}</div></div><div style="text-align:right"><div :class="r.amount>=0 ? \'price\' : \'bold\'" :style="r.amount>=0 ? {color:\'var(--success)\'} : {}">{{ r.amount>=0 ? "+" : "" }}{{ money(r.amount) }}<span class="small muted" v-if="r.gift>0">（赠{{ money(r.gift) }}）</span></div><div class="tiny muted">余额 {{ money(r.balance) }}</div></div></div>' +
            '<empty v-if="loaded && !rows.length" text="暂无记录"></empty></div></div></div>',
        computed: { u: function () { return store.user; } },
        created: function () { var self = this; API.get('fees').then(function (r) { self.loaded = true; if (r.code > 0) self.rows = r.data; }); },
        methods: { money: money }
    };

    var Coupons = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], loaded: false }; },
        template: '<div><top-bar title="我的优惠券"></top-bar><div class="page narrow pc-coupons">' +
            '<div class="card" v-for="c in rows" :key="c.id" :style="c.status!=\'未使用\' ? {opacity:.55} : {}"><div class="row"><div class="price big" style="width:90px">¥{{ money(c.faceValue) }}</div><div class="grow"><div class="bold">{{ c.name }}</div><div class="small muted">{{ c.availableAmount>0 ? "满 " + money(c.availableAmount) + " 元可用" : "无门槛" }} · 来源：{{ c.source }} · {{ c.time }}</div></div><span class="tag" :class="c.status==\'未使用\' ? \'green\' : \'gray\'">{{ c.status }}</span></div></div>' +
            '<empty v-if="loaded && !rows.length" text="暂无优惠券，可到积分商城兑换" ico="🎫"></empty></div></div>',
        created: function () { var self = this; API.get('coupons').then(function (r) { self.loaded = true; if (r.code > 0) self.rows = r.data; }); },
        methods: { money: money }
    };

    var Notices = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], loaded: false }; },
        template: '<div><top-bar title="消息通知"></top-bar><div class="page narrow pc-notices">' +
            '<div class="card" v-for="n in rows" :key="n.id" :style="n.isRead!=\'Y\' ? {borderLeft:\'3px solid var(--primary)\'} : {}" @click="n.orderId && $router.push(\'/order/\' + n.orderId)" :class="{pointer: n.orderId}"><div class="row between"><b>{{ n.title }}</b><span class="small muted">{{ n.time }}</span></div><div class="small" style="margin-top:4px">{{ n.content }}</div></div>' +
            '<empty v-if="loaded && !rows.length" text="暂无消息" ico="🔔"></empty></div></div>',
        created: function () { var self = this; API.get('notices').then(function (r) { self.loaded = true; if (r.code > 0) { self.rows = r.data; store.refreshMe(); } }); }
    };

    var Points = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { d: null, tab: 'shop', pick: null, f: { recName: '', phone: '', address: '' }, busy: false }; },
        template: '<div><top-bar title="积分商城"></top-bar><div class="page narrow pc-points" v-if="d">' +
            '<div class="card" style="background:linear-gradient(135deg,#fa8c16,#ffc53d);color:#fff"><div class="row between"><div><div class="small" style="opacity:.9">我的{{ d.unit }}</div><div style="font-size:28px;font-weight:700">{{ d.integral }}</div></div><button class="btn sm plain" @click="$router.push(\'/lottery\')">去抽奖 ›</button></div><div class="small" style="opacity:.95;margin-top:6px">{{ d.rule }}</div></div>' +
            '<div class="filter-tabs"><span :class="{on: tab==\'shop\'}" @click="tab=\'shop\'">兑换商品</span><span :class="{on: tab==\'mine\'}" @click="tab=\'mine\'">我的兑换</span><span :class="{on: tab==\'log\'}" @click="tab=\'log\'">积分明细</span></div>' +
            '<div v-show="tab==\'shop\'"><div class="list-item card" style="margin-bottom:10px" v-for="it in d.items" :key="it.id"><div class="thumb" :style="it.img ? {backgroundImage:\'url(\'+it.img+\')\'} : {}"><span v-if="!it.img">🎁</span></div>' +
            '<div class="grow"><div class="bold">{{ it.name }}</div><div class="small muted"><span class="tag gray">{{ it.ctypeName }}</span><template v-if="it.ctype==20">面值 ¥{{ money(it.faceValue) }}<template v-if="it.available>0">，满 {{ money(it.available) }} 可用</template></template><template v-else-if="it.faceValue">价值 ¥{{ money(it.faceValue) }}</template> · 库存 {{ it.stock }}</div>' +
            '<div class="row between" style="margin-top:6px"><span class="price">{{ it.need }} {{ d.unit }}</span><button class="btn sm" :disabled="it.stock<=0 || (u && d.integral<it.need)" @click="pickItem(it)">{{ !u ? "登录后兑换" : (it.stock<=0 ? "已兑完" : (d.integral<it.need ? "积分不足" : "兑换")) }}</button></div></div></div>' +
            '<empty v-if="!d.items.length" text="暂无可兑换商品" ico="🎁"></empty></div>' +
            '<div v-show="tab==\'mine\'"><div class="card" v-for="e in (d.exchanges || [])" :key="e.id"><div class="row between"><b>{{ e.name }}</b><span class="tag" :class="e.status==\'已发货\' ? \'green\' : \'gold\'">{{ e.status }}</span></div><div class="small muted">{{ e.time }} · 消耗 {{ e.need }} {{ d.unit }}</div><div class="small" v-if="e.shipNo2">{{ e.ctype==30 ? "卡密：" : "快递：" }}{{ e.shipNo }} {{ e.shipNo2 }}</div><div class="small muted" v-if="e.remark">{{ e.remark }}</div></div><empty v-if="!(d.exchanges||[]).length" text="还没有兑换记录"></empty></div>' +
            '<div v-show="tab==\'log\'"><div class="card"><div class="kv" v-for="(l, i) in (d.logs || [])" :key="i"><span class="k">{{ l.reason }}<br><span class="tiny">{{ l.time }}</span></span><span :style="{color: l.change>0 ? \'var(--success)\' : \'var(--danger)\'}">{{ l.change>0 ? "+" : "" }}{{ l.change }}</span></div><empty v-if="!(d.logs||[]).length" text="暂无明细"></empty></div></div>' +
            '<div class="mask" v-if="pick" @click.self="pick=null"><div class="sheet"><h3>兑换「{{ pick.name }}」</h3><p class="small muted">将消耗 {{ pick.need }} {{ d.unit }}，兑换后剩余 {{ d.integral - pick.need }}</p>' +
            '<template v-if="pick.ctype==10"><div class="form-item"><label><b>*</b>收货人</label><input class="input" v-model="f.recName"></div><div class="form-item"><label><b>*</b>电话</label><input class="input" v-model="f.phone"></div><div class="form-item"><label><b>*</b>收货地址</label><textarea class="textarea" v-model="f.address"></textarea></div></template>' +
            '<div class="form-item" v-else-if="pick.ctype==30"><label>接收卡密的微信 / QQ</label><input class="input" v-model="f.address" placeholder="留空则发到你的资料联系方式"></div>' +
            '<p class="small muted" v-else>抵扣券会直接放入你的账户，下单时选择使用</p>' +
            '<div class="btns"><button class="btn grow" :disabled="busy" @click="doExchange">确认兑换</button><button class="btn plain" @click="pick=null">取消</button></div></div></div>' +
            '</div></div>',
        created: function () { this.load(); var u = store.user || {}; this.f.recName = u.name || ''; this.f.phone = u.phone || ''; },
        computed: { u: function () { return store.user; } },
        methods: {
            money: money,
            pickItem: function (it) { if (!store.user) { this.$router.push({ path: '/login', query: { back: '/points' } }); return; } if (it.stock <= 0 || this.d.integral < it.need) return; this.pick = it; },
            load: function () { var self = this; API.get('points').then(function (r) { if (r.code > 0) self.d = r.data; }); },
            doExchange: function () { var self = this; this.busy = true; API.post('points/exchange', Object.assign({ id: this.pick.id }, this.f)).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) { self.pick = null; self.load(); store.refreshMe(); } }); }
        }
    };

    var Lottery = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { d: null, busy: false, active: -1, result: null }; },
        template: '<div><top-bar title="幸运抽奖"></top-bar><div class="page narrow pc-lottery" v-if="d">' +
            '<div class="card" style="background:linear-gradient(135deg,#eb2f96,#ff85c0);color:#fff;text-align:center"><div style="font-size:20px;font-weight:700">🎯 幸运大转盘</div>' +
            '<div class="small" style="opacity:.95;margin-top:4px" v-if="d.settings.on">每次消耗 {{ d.settings.cost }} {{ d.settings.way==\'balance\' ? "元余额" : d.settings.unit }}，每天 {{ d.settings.perDay }} 次<template v-if="u">，今天还剩 {{ Math.max(0, d.settings.perDay - (d.todayCount||0)) }} 次</template></div>' +
            '<div class="small" v-else style="opacity:.95">活动暂未开启，敬请期待</div></div>' +
            '<div class="card"><div class="lottery-wheel"><div v-for="(a, i) in d.awards" :key="a.id" class="cell2" :class="{on: active==i}"><div class="ico">{{ icon(a.atype) }}</div><div class="ellipsis" style="width:100%">{{ a.title }}</div><div class="tiny muted" v-if="a.atype!=20">概率 {{ a.prob }}%</div></div>' +
            '<div class="cell2" v-if="!d.awards.length" style="grid-column:span 3">暂无奖品</div></div>' +
            '<button class="btn lg block gold" style="margin-top:14px" :disabled="busy || !d.settings.on" @click="draw">{{ busy ? "抽奖中…" : "立即抽奖" }}</button>' +
            '<div class="small muted" style="text-align:center;margin-top:8px" v-if="u">我的{{ d.settings.unit }} {{ d.integral }} · 余额 ¥{{ money(d.balance) }}</div></div>' +
            '<div class="card" v-if="u && d.mine && d.mine.length"><div class="card-title">我的中奖记录</div><div class="kv" v-for="m in d.mine" :key="m.id"><span class="k">{{ m.time }}</span><span>{{ m.title }} <span class="tag" :class="m.status==\'已发放\' ? \'green\' : \'gold\'" v-if="m.atype!=20">{{ m.status }}</span></span></div></div>' +
            '<div class="mask" v-if="result" @click.self="result=null"><div class="sheet" style="text-align:center"><div style="font-size:52px">{{ result.hit ? "🎉" : "😢" }}</div><h3>{{ result.hit ? "恭喜中奖：" + result.title : "很遗憾，没有中奖" }}</h3><p class="small muted">{{ result.remark }}<template v-if="result.left>0"><br>今天还可以抽 {{ result.left }} 次</template></p><button class="btn block" @click="result=null">知道了</button></div></div>' +
            '</div></div>',
        computed: { u: function () { return store.user; } },
        created: function () { this.load(); },
        methods: {
            money: money,
            icon: function (t) { return { 0: '🎁', 10: '🎫', 15: '⭐', 18: '💰', 20: '🍬' }[t] || '🎁'; },
            load: function () { var self = this; API.get('lottery').then(function (r) { if (r.code > 0) self.d = r.data; }); },
            draw: function () {
                var self = this;
                if (!store.user) { this.$router.push({ path: '/login', query: { back: '/lottery' } }); return; }
                this.busy = true;
                var n = this.d.awards.length, step = 0, timer = setInterval(function () { self.active = n ? (step++ % n) : -1; }, 90);
                API.post('lottery/draw').then(function (r) {
                    setTimeout(function () {
                        clearInterval(timer); self.busy = false;
                        if (r.code > 0) {
                            var idx = -1; self.d.awards.forEach(function (a, i) { if (a.title === r.data.title) idx = i; });
                            self.active = idx; self.result = r.data; self.load(); store.refreshMe();
                        } else { self.active = -1; UI.toast(r.msg); }
                    }, 900);
                });
            }
        }
    };

    var NewsList = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [] }; },
        template: '<div><top-bar title="公告"></top-bar><div class="page narrow pc-news"><div class="card"><div class="cell" v-for="n in rows" :key="n.id" @click="$router.push(\'/news/\' + n.id)"><div class="lbl"><div>{{ n.title }}</div><div class="small muted ellipsis">{{ n.summary }}</div></div><span class="val">{{ n.time }}</span><span class="arrow">›</span></div><empty v-if="!rows.length" text="暂无公告"></empty></div></div></div>',
        created: function () { var self = this; API.get('news').then(function (r) { self.rows = r.data || []; }); }
    };

    var NewsDetail = {
        components: { TopBar: TopBar },
        data: function () { return { n: null }; },
        template: '<div><top-bar title="详情"></top-bar><div class="page narrow pc-news-detail" v-if="n"><div class="card"><h2 style="font-size:18px;margin:0 0 6px">{{ n.title }}</h2><div class="small muted" style="margin-bottom:12px">{{ n.time }}</div><div class="article" v-html="$safeHtml(n.content)"></div></div></div></div>',
        created: function () { var self = this; API.get('news/detail', { id: this.$route.params.id }).then(function (r) { if (r.code > 0) self.n = r.data; else UI.toast(r.msg); }); }
    };

    var Faq = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], open: -1 }; },
        template: '<div><top-bar title="常见问题"></top-bar><div class="page narrow pc-faq"><div class="card" v-for="(q, i) in rows" :key="q.id" style="cursor:pointer" @click="open = open==i ? -1 : i"><div class="row between"><b>{{ q.title }}</b><span class="muted">{{ open==i ? "−" : "+" }}</span></div><div class="article small" style="margin-top:8px" v-if="open==i" v-html="$safeHtml(q.content)"></div></div>' +
            '<empty v-if="!rows.length" text="暂无内容"></empty><div class="card" style="text-align:center"><div class="muted small">没找到答案？</div><button class="btn ghost" style="margin-top:8px" @click="$router.push(\'/contact\')">联系在线客服</button></div></div></div>',
        created: function () { var self = this; API.get('faq').then(function (r) { self.rows = r.data || []; }); }
    };

    var Levels = {
        components: { TopBar: TopBar },
        data: function () { return { rows: [] }; },
        template: '<div><top-bar title="会员等级"></top-bar><div class="page narrow pc-levels"><div class="card" v-if="u"><div class="row between"><div><b>{{ u.levelName }}</b><div class="small muted">累计消费 ¥{{ money(u.totalConsAmount) }}</div></div><span class="tag gold">{{ u.discount<1 ? Math.round(u.discount*100)/10 + "折" : "无折扣" }}</span></div><div class="small muted" style="margin-top:6px">{{ u.levelGap }}</div></div>' +
            '<div class="card"><table class="table"><tr><th>等级</th><th>累计消费</th><th>折扣</th></tr><tr v-for="l in rows" :key="l.name" :class="{bold: u && u.levelName==l.name}"><td>{{ l.name }}</td><td>¥{{ money(l.start) }} 起</td><td>{{ l.discount>0 && l.discount<1 ? Math.round(l.discount*100)/10 + "折" : "—" }}</td></tr></table><div class="small muted" style="margin-top:8px">{{ rows.length && rows[0].note }}</div></div></div></div>',
        computed: { u: function () { return store.user; } },
        created: function () { var self = this; API.get('levels').then(function (r) { self.rows = r.data || []; }); },
        methods: { money: money }
    };

    var Contact = {
        components: { TopBar: TopBar },
        data: function () { return { txt: '', busy: false }; },
        template: '<div><top-bar title="在线客服"></top-bar><div class="page narrow pc-contact"><div class="card"><div class="card-title">给客服留言</div><p class="small muted">充值、报价、订单问题都可以在这里留言，客服看到后会通过站内消息或电话回复您<template v-if="u && u.servicePerson">（您的专属客服：{{ u.servicePerson }}）</template></p>' +
            '<textarea class="textarea" v-model="txt" placeholder="请描述您的问题…" maxlength="300" style="min-height:120px"></textarea><button class="btn block" style="margin-top:10px" :disabled="busy" @click="send">发送</button></div>' +
            '<div class="card"><div class="card-title">服务时间</div><div class="small muted">每天 9:00 - 24:00，紧急问题请在订单详情里留言并标注“加急”</div></div></div></div>',
        computed: { u: function () { return store.user; } },
        methods: { send: function () { var self = this; if (!store.user) { this.$router.push({ path: '/login', query: { back: '/contact' } }); return; } if (!this.txt.trim()) { UI.toast('请输入内容'); return; } this.busy = true; API.post('contact', { content: this.txt }).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) self.txt = ''; }); } }
    };

    var Login = {
        data: function () { return { phone: '', pwd: '', busy: false }; },
        template: '<div class="page no-tab"><div class="login-box card"><h1>登录</h1><div class="form-item"><label>手机号</label><input class="input" v-model="phone" placeholder="11 位手机号" maxlength="11" inputmode="numeric"></div><div class="form-item"><label>密码</label><input class="input" type="password" v-model="pwd" @keyup.enter="go"></div>' +
            '<button class="btn lg block" :disabled="busy" @click="go">登录</button><div class="row between" style="margin-top:14px"><a @click="$router.push({path:\'/register\', query:$route.query})">没有账号？注册</a><a class="muted" @click="$router.push(\'/\')">先逛逛</a></div></div></div>',
        methods: { go: function () { var self = this; this.busy = true; API.post('login', { phone: this.phone, pwd: this.pwd }).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) { store.user = r.data; self.$router.replace(self.$route.query.back || '/me'); } }); } }
    };

    var Register = {
        data: function () { return { phone: '', pwd: '', name: '', inviteCode: this.$route.query.invite || '', agree: false, busy: false }; },
        template: '<div class="page no-tab"><div class="login-box card"><h1>注册</h1><div class="form-item"><label>手机号</label><input class="input" v-model="phone" placeholder="11 位手机号" maxlength="11" inputmode="numeric"></div><div class="form-item"><label>昵称</label><input class="input" v-model="name" placeholder="怎么称呼您（选填）" maxlength="20"></div><div class="form-item"><label>密码</label><input class="input" type="password" v-model="pwd" placeholder="至少 6 位" @keyup.enter="go"></div>' +
            '<div class="form-item"><label>邀请码</label><input class="input" v-model="inviteCode" placeholder="选填，填好友的邀请码双方得积分" maxlength="8"></div>' +
            '<label class="row small" style="gap:6px;margin-bottom:12px;cursor:pointer"><input type="checkbox" v-model="agree"> 我已阅读并同意 <a @click.stop.prevent="$router.push(\'/agreement\')">《用户协议》</a> 和 <a @click.stop.prevent="$router.push(\'/privacy\')">《隐私政策》</a></label>' +
            '<button class="btn lg block" :disabled="busy" @click="go">注册并登录</button><div style="margin-top:14px;text-align:center"><a @click="$router.push({path:\'/login\', query:$route.query})">已有账号？登录</a></div></div></div>',
        methods: { go: function () { var self = this; if (!this.agree) { UI.toast('请先同意用户协议和隐私政策'); return; } this.busy = true; API.post('register', { phone: this.phone, pwd: this.pwd, name: this.name, inviteCode: this.inviteCode }).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) { store.user = r.data; self.$router.replace(self.$route.query.back || '/'); } }); } }
    };

    return { Home: Home, Games: Games, GameDetail: GameDetail, Shop: Shop, ShopDetail: ShopDetail, OrderNew: OrderNew, Orders: Orders, OrderDetail: OrderDetail, Me: Me, Profile: Profile, Fees: Fees, Coupons: Coupons,
        Notices: Notices, Points: Points, Lottery: Lottery, NewsList: NewsList, NewsDetail: NewsDetail, Faq: Faq, Levels: Levels, Contact: Contact, Login: Login, Register: Register, _TopBar: TopBar, _Empty: Empty };
})();
