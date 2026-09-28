/* 客户端入口：路由、全局状态（store.user）、提示（UI.toast / UI.confirm）、外观设置、未读轮询、手机底栏 / 电脑顶栏 */
(function () {
    var reactive = Vue.reactive;
    var ls = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { } } };
    window.store = reactive({
        user: null, company: '', theme: ls.get('theme') || 'auto', font: ls.get('font') || 'normal',
        refreshMe: function () { return API.get('me').then(function (r) { store.user = r.code > 0 ? r.data : null; return store.user; }); }
    });
    window.UI = {
        toast: function (msg) { store._toast = msg; clearTimeout(UI._t); UI._t = setTimeout(function () { store._toast = ''; }, 1800); },
        confirm: function (msg) { return new Promise(function (resolve) { store._confirm = { msg: msg, resolve: resolve }; }); },
        copy: function (text) {
            var done = function () { UI.toast('已复制'); };
            if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () { UI._fallbackCopy(text); done(); }); } else { UI._fallbackCopy(text); done(); }
        },
        _fallbackCopy: function (text) { var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) { } document.body.removeChild(ta); },
        applyTheme: function (v) {
            store.theme = v; ls.set('theme', v);
            var dark = v === 'dark' || (v === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
            document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
            var meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.setAttribute('content', dark ? '#1c2027' : '#1677ff');
        },
        applyFont: function (v) { store.font = v; ls.set('font', v); document.documentElement.setAttribute('data-font', v); }
    };
    UI.applyTheme(store.theme); UI.applyFont(store.font);
    if (window.matchMedia) { try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (store.theme === 'auto') UI.applyTheme('auto'); }); } catch (e) { } }

    /* 圈子列表公开；发布和“我发布的”由对应接口继续校验登录。 */
    var needLogin = ['/order/new', '/orders', '/order/', '/profile', '/fees', '/coupons', '/notices', '/roles', '/invite', '/aftersales'];
    var routes = [
        { path: '/', component: Pages.Home, meta: { tab: 'home', title: '首页' } },
        { path: '/games', component: Pages.Games, meta: { tab: 'games' } },
        { path: '/game/:id', component: Pages.GameDetail, meta: { tab: 'games' } },
        { path: '/shop', component: Pages.Shop, meta: { tab: 'shop' } },
        { path: '/item/:id', component: Pages.ShopDetail, meta: { tab: 'shop' } },
        { path: '/order/new', component: Pages.OrderNew, meta: { tab: 'games' } },
        { path: '/orders', component: Pages.Orders, meta: { tab: 'orders' } },
        { path: '/order/:oid', component: Pages.OrderDetail, meta: { tab: 'orders' } },
        { path: '/order/:oid/chat', component: Pages2.Chat, meta: { tab: 'orders' } },
        { path: '/me', component: Pages.Me, meta: { tab: 'me' } },
        { path: '/profile', component: Pages.Profile, meta: { tab: 'me' } },
        { path: '/fees', component: Pages.Fees, meta: { tab: 'me' } },
        { path: '/coupons', component: Pages.Coupons, meta: { tab: 'me' } },
        { path: '/notices', component: Pages.Notices, meta: { tab: 'me' } },
        { path: '/points', component: Pages.Points, meta: { tab: 'me' } },
        { path: '/lottery', component: Pages.Lottery, meta: { tab: 'me' } },
        { path: '/roles', component: Pages2.Roles, meta: { tab: 'me' } },
        { path: '/invite', component: Pages2.Invite, meta: { tab: 'me' } },
        { path: '/aftersales', component: Pages2.Aftersales, meta: { tab: 'me' } },
        { path: '/calc', component: Pages2.Calc, meta: { tab: 'calc' } },
        { path: '/boosters', component: Pages2.Boosters, meta: { tab: 'home' } },
        { path: '/search', component: Pages2.Search, meta: { tab: 'home' } },
        { path: '/agreement', component: Pages2.Legal, meta: { tab: 'me' } },
        { path: '/privacy', component: Pages2.Legal, meta: { tab: 'me' } },
        { path: '/news', component: Pages.NewsList, meta: { tab: 'home' } },
        { path: '/news/:id', component: Pages.NewsDetail, meta: { tab: 'home' } },
        { path: '/faq', component: Pages.Faq, meta: { tab: 'me' } },
        { path: '/circle', component: Pages2.Circle, meta: { tab: 'me' } },
        { path: '/blacklist', component: Pages2.Blacklist, meta: { tab: 'me' } },
        { path: '/levels', component: Pages.Levels, meta: { tab: 'me' } },
        { path: '/contact', component: Pages.Contact, meta: { tab: 'me' } },
        { path: '/login', component: Pages.Login, meta: { tab: 'me', bare: true } },
        { path: '/register', component: Pages.Register, meta: { tab: 'me', bare: true } },
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ];
    var router = VueRouter.createRouter({ history: VueRouter.createWebHashHistory(), routes: routes, scrollBehavior: function () { return { top: 0 }; } });
    router.afterEach(function () { store._accountOpen = false; });
    router.beforeEach(function (to) {
        if (store._ready && !store.user && needLogin.some(function (p) { return to.path.indexOf(p) === 0; })) return { path: '/login', query: { back: to.fullPath } };
    });
    API.onNeedLogin(function () { if (store.user) { store.user = null; } if (router.currentRoute.value.path !== '/login') router.push({ path: '/login', query: { back: router.currentRoute.value.fullPath } }); });

    var App = {
        template: '<div class="shell">' +
        '<header class="desk-header" v-if="!$route.meta.bare" @keydown.esc="store._accountOpen=false"><div class="inner"><a class="logo" href="#/" @click.prevent="$router.push(\'/\')"><img src="/brand-mark.svg" alt="">{{ store.company || "云序工作室" }}</a>' +
            '<nav aria-label="主导航"><a v-for="t in tabs" :key="t.path" :class="{active: isActive(t)}" :aria-current="isActive(t) ? \'page\' : null" :href="\'#\'+t.path" @click.prevent="$router.push(t.path)">{{ t.name }}<span class="badge" v-if="t.tab==\'me\' && store.user && store.user.unread">{{ store.user.unread }}</span></a></nav>' +
            '<button class="desk-search" aria-label="搜索游戏、项目或套餐" @click="$router.push(\'/search\')"><span aria-hidden="true">⌕</span><span>搜索游戏、项目、套餐</span><kbd>搜索</kbd></button>' +
            '<div class="user"><template v-if="store.user"><button class="account-trigger" :aria-expanded="store._accountOpen ? \'true\' : \'false\'" @click="store._accountOpen=!store._accountOpen"><span class="account-avatar" aria-hidden="true">{{ (store.user.name || \'我\').slice(0,1) }}</span><span class="account-name">{{ store.user.name || \'我的账户\' }}<small>{{ store.user.levelName || \'会员\' }} · ¥{{ store.user.balance }}</small></span><span class="account-caret" aria-hidden="true">⌄</span></button><div class="account-menu" v-if="store._accountOpen"><button @click="goAccount(\'/me\')">个人中心<span v-if="store.user.unread" class="menu-badge">{{ store.user.unread }}</span></button><button @click="goAccount(\'/orders\')">我的订单</button><button @click="goAccount(\'/profile\')">账户资料</button><button class="logout" @click="logout">退出登录</button></div></template><template v-else><button class="btn sm" @click="$router.push(\'/login\')">登录</button><button class="btn sm ghost" @click="$router.push(\'/register\')">注册</button></template></div></div></header>' +
            '<router-view :key="$route.fullPath"></router-view>' +
            '<nav class="tabbar" v-if="!$route.meta.bare"><a v-for="t in mobileTabs" :key="t.path" :class="{active: $route.meta.tab==t.tab || ($route.meta.tab==\'calc\' && t.tab==\'games\')}" @click="$router.push(t.path)"><span class="ico">{{ t.ico }}</span>{{ t.name }}<span class="badge" v-if="t.tab==\'me\' && store.user && store.user.unread">{{ store.user.unread }}</span></a></nav>' +
            '<div class="toast" v-if="store._toast">{{ store._toast }}</div>' +
            '<div class="mask" v-if="store._confirm" style="align-items:center"><div class="sheet" style="border-radius:14px;width:320px;max-width:86%"><h3>提示</h3><p style="margin:0 0 16px;font-size:14px">{{ store._confirm.msg }}</p><div class="btns"><button class="btn plain grow" @click="answer(false)">取消</button><button class="btn grow" @click="answer(true)">确定</button></div></div></div>' +
            '</div>',
        data: function () {
            return {
                store: store,
                tabs: [{ path: '/', name: '首页', tab: 'home' }, { path: '/games', name: '游戏服务', tab: 'games' }, { path: '/shop', name: '套餐商城', tab: 'shop' }, { path: '/calc', name: '自助报价', tab: 'calc' }, { path: '/orders', name: '我的订单', tab: 'orders' }],
                mobileTabs: [{ path: '/', name: '首页', tab: 'home', ico: '🏠' }, { path: '/games', name: '服务', tab: 'games', ico: '🎮' }, { path: '/orders', name: '订单', tab: 'orders', ico: '🧾' }, { path: '/me', name: '我的', tab: 'me', ico: '👤' }]
            };
        },
        methods: {
            answer: function (v) { var c = store._confirm; store._confirm = null; c && c.resolve(v); },
            isActive: function (t) {
                if (t.tab === 'home') return this.$route.meta.tab === 'home';
                if (t.tab === 'calc') return this.$route.meta.tab === 'calc';
                return this.$route.meta.tab === t.tab;
            },
            goAccount: function (path) { store._accountOpen = false; this.$router.push(path); },
            logout: function () { store._accountOpen = false; API.post('logout', {}).then(function (r) { store.user = null; UI.toast(r.msg || '已退出登录'); router.push('/'); }); }
        },
        mounted: function () { var self = this; this._clickAway = function (e) { if (!e.target.closest('.desk-header .user')) store._accountOpen = false; }; document.addEventListener('click', this._clickAway); },
        beforeUnmount: function () { if (this._clickAway) document.removeEventListener('click', this._clickAway); }
    };

    store.refreshMe().then(function () {
        store._ready = true;
        API.get('home').then(function (r) { if (r.code > 0) store.company = r.data.company; });
        var app = Vue.createApp(App);
        app.config.globalProperties.$safeHtml = window.SafeHtml || function (v) { return v == null ? '' : String(v); };
        app.use(router);
        app.mount('#app');
        // 未读消息轮询：登录后每 30 秒刷新一次（页面在前台时）
        setInterval(function () { if (store.user && document.visibilityState === 'visible') store.refreshMe(); }, 30000);
        document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && store.user) store.refreshMe(); });
    });
})();
