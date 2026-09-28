/* 客户端第二批页面：常用角色、订单会话、邀请、自助报价器、打手风采、协议、售后记录、搜索 */
window.Pages2 = (function () {
    var money = Fmt.money;
    var TopBar = Pages._TopBar, Empty = Pages._Empty;

    var Roles = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], games: [], edit: null, busy: false, loaded: false }; },
        template: '<div><top-bar title="我的游戏角色"></top-bar><div class="page pc-page pc-roles">' +
            '<div class="card flat small muted">保存常用角色后，下单时一键带入区服 / 角色名 / 账号，不用每次重填。密码只用于打手上号，完单后订单里会自动清除。</div>' +
            '<div class="card" v-for="r in rows" :key="r.id"><div class="row between"><div class="grow"><div class="bold">{{ r.roleName }} <span class="tag">{{ r.gameName }}</span></div>' +
            '<div class="small muted">{{ r.gameArea }} {{ r.gameServer }} {{ r.gameJob }} {{ r.gameGroup }}<template v-if="r.gameAcc"> · 账号 {{ r.gameAcc }}</template><template v-if="r.hasPwd"> · 已存密码</template></div>' +
            '<div class="tiny muted">使用 {{ r.useCount }} 次<template v-if="r.lastUsed"> · 最近 {{ r.lastUsed }}</template></div></div>' +
            '<div class="btns"><button class="btn sm" @click="$router.push({path:\'/order/new\', query:{gameId:r.gameId, roleId:r.id}})">下单</button><button class="btn sm plain" @click="openEdit(r)">编辑</button><button class="btn sm plain" @click="del(r)">删除</button></div></div></div>' +
            '<empty v-if="loaded && !rows.length" text="还没有保存角色，下单时勾选“保存为常用角色”即可" ico="🎮"></empty>' +
            '<button class="btn block ghost" @click="openEdit(null)">＋ 新增角色</button>' +
            '<div class="mask" v-if="edit" @click.self="edit=null"><div class="sheet"><h3>{{ edit.id ? "编辑角色" : "新增角色" }}</h3>' +
            '<div class="form-item"><label><b>*</b>游戏</label><select class="select" v-model="edit.gameId"><option value="">请选择</option><option v-for="g in games" :key="g.id" :value="g.id">{{ g.name }}</option></select></div>' +
            '<div class="row" style="gap:10px"><div class="form-item grow"><label>区服</label><input class="input" v-model="edit.gameArea"></div><div class="form-item grow"><label>服务器</label><input class="input" v-model="edit.gameServer"></div></div>' +
            '<div class="row" style="gap:10px"><div class="form-item grow"><label>职业</label><input class="input" v-model="edit.gameJob"></div><div class="form-item grow"><label>阵营</label><input class="input" v-model="edit.gameGroup"></div></div>' +
            '<div class="form-item"><label><b>*</b>角色名</label><input class="input" v-model="edit.roleName" maxlength="30"></div>' +
            '<div class="form-item"><label>游戏账号</label><input class="input" v-model="edit.gameAcc" maxlength="50"></div>' +
            '<div class="form-item"><label>游戏密码</label><input class="input" type="password" v-model="edit.gamePwd" :placeholder="edit.hasPwd ? \'已保存，留空不改\' : \'选填\'" maxlength="50"></div>' +
            '<div class="btns"><button class="btn grow" :disabled="busy" @click="save">保存</button><button class="btn plain" @click="edit=null">取消</button></div></div></div></div></div>',
        created: function () { this.load(); var self = this; API.get('games').then(function (r) { self.games = Array.isArray(r.data) ? r.data : []; }); },
        methods: {
            load: function () { var self = this; API.get('roles').then(function (r) { self.loaded = true; self.rows = r.code > 0 && Array.isArray(r.data) ? r.data : []; }); },
            openEdit: function (r) { this.edit = r ? Object.assign({ gamePwd: '' }, r) : { id: 0, gameId: '', gameArea: '', gameServer: '', gameJob: '', gameGroup: '', roleName: '', gameAcc: '', gamePwd: '' }; },
            save: function () { var self = this; this.busy = true; API.post('roles/save', this.edit).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) { self.edit = null; self.load(); } }); },
            del: function (r) { var self = this; UI.confirm('删除角色「' + r.roleName + '」？').then(function (ok) { if (ok) API.post('roles/del', { id: r.id }).then(function (res) { UI.toast(res.msg); self.load(); }); }); }
        }
    };

    var Chat = {
        components: { TopBar: TopBar },
        data: function () { return { d: null, txt: '', busy: false, timer: null }; },
        template: '<div><top-bar :title="d ? \'订单会话 · \' + d.orderNo : \'订单会话\'"></top-bar><div class="page pc-page pc-chat" v-if="d">' +
            '<div class="card flat small" style="margin-bottom:12px"><span class="muted">{{ d.project }}</span> · <b>{{ d.orderSta }}</b> · 客服 {{ d.kefu }}<span class="muted"> · 消息会同步到客服的后台</span></div>' +
            '<div class="chat"><template v-for="(m, i) in d.msgs" :key="i"><div v-if="m.system" class="sys"><span>{{ m.content }} {{ m.time }}</span></div>' +
            '<div v-else class="msg" :class="{mine: m.mine}"><div><div class="who" v-if="!m.mine">{{ m.who }}</div><div class="bubble">{{ m.content }}<div class="time">{{ m.time }}</div></div></div></div></template>' +
            '<div v-if="!d.msgs.length" class="empty" style="padding:20px 0">还没有消息，有问题直接在下面说</div></div>' +
            '<div class="chat-input" v-if="d.canMessage"><input class="input" v-model="txt" placeholder="输入消息…" maxlength="200" @keyup.enter="send"><button class="btn" :disabled="busy" @click="send">发送</button></div>' +
            '</div></div>',
        created: function () { this.load(); var self = this; this.timer = setInterval(function () { self.load(true); }, 15000); },
        unmounted: function () { clearInterval(this.timer); },
        methods: {
            load: function (silent) { var self = this; API.get('order/chat', { oid: this.$route.params.oid }).then(function (r) { if (r.code > 0 && r.data) { var data = r.data || {}; data.msgs = Array.isArray(data.msgs) ? data.msgs : []; var was = self.d && Array.isArray(self.d.msgs) ? self.d.msgs.length : 0; self.d = data; if (!silent || data.msgs.length !== was) self.$nextTick(function () { window.scrollTo(0, document.body.scrollHeight); }); if (!silent) store.refreshMe(); } else if (!silent) { UI.toast(r.msg); self.$router.back(); } }); },
            send: function () { var self = this; if (!this.txt.trim()) return; this.busy = true; API.post('order/message', { oid: this.d ? this.$route.params.oid : 0, content: this.txt }).then(function (r) { self.busy = false; if (r.code > 0) { self.txt = ''; self.load(); } else UI.toast(r.msg); }); }
        }
    };

    var Invite = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { d: null, loading: true, error: '' }; },
        template: '<div><top-bar title="邀请有礼"></top-bar><div class="page pc-page pc-invite" v-if="d">' +
            '<div class="card" style="background:linear-gradient(135deg,#722ed1,#b37feb);color:#fff;text-align:center"><div style="font-size:18px;font-weight:700">邀请好友，双方得积分</div>' +
            '<div class="small" style="opacity:.9;margin-top:4px" v-if="d.on">好友用你的邀请码注册得 {{ d.inviteeReward }} 积分，好友首次付款下单后你得 {{ d.reward }} 积分</div><div class="small" v-else style="opacity:.9">活动暂未开启</div>' +
            '<div style="margin:14px 0 6px;font-size:12px;opacity:.9">我的邀请码</div><div style="font-size:32px;font-weight:700;letter-spacing:4px">{{ d.code }}</div>' +
            '<div class="btns" style="justify-content:center;margin-top:12px"><button class="btn plain" @click="copy(d.code)">复制邀请码</button><button class="btn plain" @click="copy(d.link)">复制邀请链接</button></div></div>' +
            '<div class="card"><div class="card-title">已邀请的好友（{{ d.friends.length }}）</div><div class="kv" v-for="(f, i) in d.friends" :key="i"><span class="k">{{ f.name }}<span class="tiny"> {{ f.time }} 注册</span></span><span class="tag" :class="f.rewarded ? \'green\' : \'gray\'">{{ f.rewarded ? "已获奖励" : "待首单" }}</span></div><empty v-if="!d.friends.length" text="还没有邀请到好友" ico="🤝"></empty></div></div></div>',
        created: function () { var self = this; API.get('invite').then(function (r) { if (r.code > 0 && r.data) { self.d = r.data; self.d.friends = Array.isArray(self.d.friends) ? self.d.friends : []; } }); },
        methods: { copy: function (t) { UI.copy(t); } }
    };

    var Calc = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { games: [], game: '', project: '', ladder: null, st: null, et: null, service: 10, platform: 0, pkg: '', items: null, busy: false, dfs: { st: '', et: '' } }; },
        computed: {
            groups: function () { var g = [], seen = {}; (this.ladder ? this.ladder.rows : []).forEach(function (r) { if (!seen[r.l1]) { seen[r.l1] = { l1: r.l1, rows: [] }; g.push(seen[r.l1]); } seen[r.l1].rows.push(r); }); return g; },
            curGame: function () { var n = this.game; return this.games.filter(function (g) { return g.name === n; })[0]; }
        },
        template: '<div><top-bar title="自助报价"></top-bar><div class="page pc-page pc-calc">' +
            '<div class="card flat small muted">选择游戏、当前段位和目标段位，价格按本店报价表实时计算，满意可直接生成订单。</div>' +
            '<div class="card"><div class="form-item"><label>游戏</label><select class="select" v-model="game" @change="project=\'\';ladder=null;items=null;if(curGame){project=curGame.projects[0];loadLadder()}"><option value="">请选择</option><option v-for="g in games" :key="g.name" :value="g.name">{{ g.name }}</option></select></div>' +
            '<div class="form-item" v-if="curGame"><label>项目</label><div class="chips"><span class="chip" v-for="p in curGame.projects" :key="p" :class="{on: project==p}" @click="project=p;loadLadder()">{{ p }}</span></div></div>' +
            '<empty v-if="!games.length" text="商家还没有配置报价表，请联系客服报价" ico="🧮"></empty></div>' +
            '<template v-if="ladder && ladder.isDw"><div class="card"><div class="card-title">当前段位 <span class="small muted" v-if="st">{{ st.l1 }} {{ st.l2 }}</span></div><div v-for="g in groups" :key="\'s\'+g.l1" style="margin-bottom:8px"><div class="small muted" style="margin-bottom:4px">{{ g.l1 }}</div><div class="rank-grid"><span class="r" v-for="r in g.rows" :key="r.id" :class="{on: st && st.id==r.id}" @click="st=r;quote()">{{ r.l2 }}</span></div></div></div>' +
            '<div class="card"><div class="card-title">目标段位 <span class="small muted" v-if="et">{{ et.l1 }} {{ et.l2 }}</span></div><div v-for="g in groups" :key="\'e\'+g.l1" style="margin-bottom:8px"><div class="small muted" style="margin-bottom:4px">{{ g.l1 }}</div><div class="rank-grid"><span class="r" v-for="r in g.rows" :key="r.id" :class="{on: et && et.id==r.id}" @click="et=r;quote()">{{ r.l2 }}</span></div></div></div></template>' +
            '<div class="card" v-else-if="ladder"><div class="card-title">分数区间</div><div class="small muted" style="margin-bottom:8px">可报价区间：{{ ladder.rows.map(function(r){return r.start + "-" + r.end}).join("，") }}</div>' +
            '<div class="row" style="gap:10px"><div class="form-item grow"><label>当前分</label><input class="input" v-model="dfs.st" inputmode="numeric" @change="quote"></div><div class="form-item grow"><label>目标分</label><input class="input" v-model="dfs.et" inputmode="numeric" @change="quote"></div></div></div>' +
            '<div class="card" v-if="ladder"><div class="row between"><span class="small muted">服务类型</span><div class="seg"><span :class="{on: service==10}" @click="service=10;quote()">代练</span><span :class="{on: service==20}" @click="service=20;quote()">陪练</span></div></div>' +
            '<div class="row between" style="margin-top:10px" v-if="ladder.ios"><span class="small muted">平台</span><div class="seg"><span :class="{on: platform==0}" @click="platform=0;quote()">安卓</span><span :class="{on: platform==1}" @click="platform=1;quote()">苹果</span></div></div></div>' +
            '<div class="card" v-if="items && items.length"><div class="card-title">报价结果 <span class="small muted">{{ items[0].project }}</span></div>' +
            '<div class="radio-box" v-for="it in items" :key="it.packgeName" :class="{on: pkg==it.packgeName}" style="margin-bottom:8px" @click="pkg=it.packgeName"><div class="row between"><div><div class="t">{{ it.packgeName || "标准报价" }}</div><div class="d">{{ it.packgeMark }}<template v-if="it.hours"> 预计 {{ it.hours }} 小时</template></div></div><span class="price big">¥{{ money(it.price) }}</span></div></div>' +
            '<button class="btn lg block gold" @click="order">按此报价下单</button><div class="tiny muted" style="text-align:center;margin-top:6px">下单时还会自动叠加你的会员折扣和优惠券</div></div>' +
            '<empty v-else-if="items" text="暂无可用报价" ico="🧮"></empty>' +
            '</div></div>',
        created: function () { var self = this; API.get('calc/games').then(function (r) { self.games = Array.isArray(r.data) ? r.data.map(function (g) { g.projects = Array.isArray(g.projects) ? g.projects : []; return g; }) : []; if (self.games.length) { self.game = self.games[0].name; self.project = self.games[0].projects[0] || ''; if (self.project) self.loadLadder(); } }); },
        methods: {
            money: money,
            loadLadder: function () { var self = this; this.st = this.et = null; this.items = null; if (!this.game || !this.project) return; API.get('calc/ladder', { gameName: this.game, project: this.project }).then(function (r) { if (r.code > 0 && r.data) { self.ladder = r.data; self.pkg = Array.isArray(r.data.packages) ? (r.data.packages[0] || '') : ''; } else { self.ladder = null; UI.toast(r.msg || '报价配置加载失败'); } }); },
            params: function () {
                var p = { gameName: this.game, project: this.project, serviceType: this.service, platfrom: this.platform, priceType: '', mw: '', ssd: '', esd: '', fst: 0, fet: 0 };
                if (this.ladder.isDw) { if (!this.st || !this.et) return null; p.st = this.st.id; p.et = this.et.id; }
                else { if (!this.dfs.st || !this.dfs.et) return null; p.st = this.dfs.st; p.et = this.dfs.et; }
                return p;
            },
            quote: function () { var self = this, p = this.params(); if (!p) { this.items = null; return; } API.get('calc/quote', p).then(function (r) { if (r.code > 0) { self.items = Array.isArray(r.data) ? r.data : []; if (self.items.length && !self.items.some(function (i) { return i.packgeName === self.pkg; })) self.pkg = self.items[0].packgeName || ''; } else { self.items = null; UI.toast(r.msg); } }); },
            order: function () { var p = this.params(); if (!p || !this.items) return; p.packgeName = this.pkg; this.$router.push({ path: '/order/new', query: { calc: JSON.stringify(p), gameName: this.game } }); }
        }
    };

    var Boosters = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], loaded: false }; },
        template: '<div><top-bar title="打手风采"></top-bar><div class="page pc-page pc-boosters">' +
            '<div class="grid g2 desk4" style="grid-template-columns:1fr"><div class="card" v-for="b in rows" :key="b.id" style="margin:0"><div class="booster"><div class="avatar" :style="b.photo ? {backgroundImage:\'url(\'+b.photo+\')\'} : {}"><span v-if="!b.photo">{{ b.name.slice(0,1) }}</span></div>' +
            '<div class="grow"><div class="row between"><b>{{ b.name }}</b><span class="stars small" v-if="b.rating">{{ "★".repeat(Math.round(b.rating)) }} {{ b.rating }}</span><span class="tiny muted" v-else>暂无评分</span></div>' +
            '<div class="small muted" style="margin:4px 0">完成 {{ b.done }} 单 · {{ b.reviews }} 条评价</div><div><span class="tag" v-for="g in b.games" :key="g">{{ g }}</span><span class="tag gold" v-for="t in b.tags" :key="t">{{ t }}</span></div>' +
            '<div class="small muted" style="margin-top:6px" v-for="(r, i) in b.recent" :key="i">“{{ r.content || "好评" }}” — {{ r.name }} <span class="stars">{{ "★".repeat(r.stars) }}</span></div></div></div></div></div>' +
            '<empty v-if="loaded && !rows.length" text="暂无打手信息" ico="🏆"></empty></div></div>',
        created: function () { var self = this; API.get('boosters').then(function (r) { self.loaded = true; if (r.code > 0) self.rows = r.data; }); }
    };

    var Legal = {
        components: { TopBar: TopBar },
        data: function () { return { d: null, loading: true, error: '' }; },
        computed: { kind: function () { return this.$route.path.indexOf('privacy') > -1 ? 'privacy' : 'agreement'; } },
        template: '<div><top-bar :title="kind==\'privacy\' ? \'隐私政策\' : \'用户协议\'"></top-bar><div class="page pc-page pc-legal"><div v-if="loading" class="card load-state"><div class="skeleton"></div><div class="skeleton" style="width:70%"></div></div><div v-else-if="error" class="card load-error"><div>{{ error }}</div><button class="btn sm ghost" @click="load">重试</button></div><div v-else-if="d" class="card"><h2 style="font-size:17px;margin:0 0 10px">{{ d.company }}{{ kind==\'privacy\' ? "隐私政策" : "用户服务协议" }}</h2><div class="legal">{{ d[kind] || "暂无内容" }}</div></div></div></div>',
        created: function () { this.load(); },
        methods: { load: function () { var self = this; this.loading = true; this.error = ''; this.d = null; API.get('legal').then(function (r) { self.loading = false; if (r.code > 0 && r.data) self.d = r.data; else self.error = r.msg || '协议加载失败，请稍后重试'; }); } }
    };

    var Aftersales = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { rows: [], loaded: false }; },
        template: '<div><top-bar title="售后记录"></top-bar><div class="page pc-page pc-aftersales">' +
            '<div class="card" v-for="a in rows" :key="a.id" style="cursor:pointer" @click="$router.push(\'/order/\' + a.oid)"><div class="row between"><b>{{ a.type }} · {{ a.orderNo }}</b><span class="tag" :class="{\'红\':0, gold: a.status==\'待处理\' || a.status==\'处理中\', green: a.status==\'已完成\', gray: a.status==\'已驳回\'}">{{ a.status }}</span></div>' +
            '<div class="small muted">{{ a.project }} · {{ a.time }}</div><div class="small" style="margin-top:4px">{{ a.reason }}</div><div class="small" v-if="a.result" style="margin-top:4px;color:var(--primary)">客服：{{ a.result }}<template v-if="a.refundAmount"> （已退款 ¥{{ money(a.refundAmount) }}）</template></div></div>' +
            '<empty v-if="loaded && !rows.length" text="没有售后记录" ico="🛡️"></empty></div></div>',
        created: function () { var self = this; API.get('aftersales').then(function (r) { self.loaded = true; if (r.code > 0) self.rows = r.data; }); },
        methods: { money: money }
    };

    var Search = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { key: this.$route.query.key || '', d: null, loading: false, error: '' }; },
        template: '<div><top-bar title="搜索"></top-bar><div class="page pc-page pc-search">' +
            '<div v-if="error" class="card load-error"><div>{{ error }}</div><button class="btn sm ghost" @click="go">重试</button></div>' +
            '<div class="search-box">🔍 <input v-model="key" placeholder="搜索游戏、项目、套餐" @keyup.enter="go" autofocus><button class="btn sm" @click="go">搜索</button></div>' +
            '<template v-if="d && !error"><div class="card" v-if="d.games.length"><div class="card-title">游戏</div><div class="chips"><span class="chip" v-for="g in d.games" :key="g.id" @click="$router.push(\'/game/\' + g.id)">{{ g.name }}</span></div></div>' +
            '<div class="card" v-if="d.projects.length"><div class="card-title">代练项目</div><div class="cell" v-for="p in d.projects" :key="p.id" @click="$router.push({path:\'/order/new\', query:{gameId:p.gameId, projectId:p.id}})"><div class="lbl">{{ p.name }}<div class="small muted">{{ p.gameName }}</div></div><span class="price" v-if="p.price>0">¥{{ money(p.price) }}</span><span class="arrow">›</span></div></div>' +
            '<div class="card" v-if="d.items.length"><div class="card-title">套餐商品</div><div class="cell" v-for="it in d.items" :key="it.id" @click="$router.push(\'/item/\' + it.id)"><div class="lbl">{{ it.title }}<div class="small muted">{{ it.gameName }}</div></div><span class="price">¥{{ money(it.price) }}</span><span class="arrow">›</span></div></div>' +
            '<empty v-if="!d.games.length && !d.projects.length && !d.items.length" text="没有找到相关内容" ico="🔍"></empty></template></div></div>',
        created: function () { if (this.key) this.go(); },
        methods: { money: money, go: function () { var self = this; if (!this.key.trim()) { this.d = null; this.error = ''; return; } this.loading = true; this.error = ''; this.d = null; this.$router.replace({ path: '/search', query: { key: this.key } }); API.get('search', { key: this.key }).then(function (r) { self.loading = false; if (r.code > 0 && r.data) { self.d = { games: Array.isArray(r.data.games) ? r.data.games : [], projects: Array.isArray(r.data.projects) ? r.data.projects : [], items: Array.isArray(r.data.items) ? r.data.items : [] }; } else self.error = r.msg || '搜索失败，请稍后重试'; }); } }
    };

    var Circle = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { d: null, mine: [], tab: 'all', busy: false, loaded: false, form: null, games: [] }; },
        template: '<div><top-bar title="系统圈子"></top-bar><div class="page pc-page pc-circle">' +
            '<div class="card flat small muted">发布接单 / 发单的合作消息，平台上的商家都能看到；请勿发布虚假、违法信息。</div>' +
            '<div class="row" style="gap:8px;margin:0 0 12px"><button class="btn sm" :class="{plain:tab!==\'all\'}" @click="go(\'all\')">全部消息</button>' +
            '<button class="btn sm" :class="{plain:tab!==\'mine\'}" @click="go(\'mine\')">我发布的</button>' +
            '<button class="btn sm grow" @click="openForm">＋ 我要发布</button></div>' +
            '<template v-if="tab===\'all\' && d">' +
            '<div class="card" v-for="r in d.topList.concat(d.normalList)" :key="r.id"><div class="bold"><span class="tag">{{ r.type }}</span> {{ r.gameName }}<span v-if="r.top" class="tag" style="background:#fff1e6;color:#d46b08">置顶</span></div>' +
            '<div style="margin:6px 0">{{ r.content }}</div>' +
            '<div class="small muted">微信 {{ r.wechat || "—" }} · QQ {{ r.qq || "—" }} · {{ r.system }} · {{ r.time }}</div></div>' +
            '<empty v-if="loaded && !d.count" text="还没有人发布，你可以发第一条" ico="📣"></empty></template>' +
            '<template v-if="tab===\'mine\'"><div class="card" v-for="r in mine" :key="r.id"><div class="bold"><span class="tag">{{ r.type }}</span> {{ r.gameName }}</div>' +
            '<div style="margin:6px 0">{{ r.content }}</div><div class="small muted">微信 {{ r.wechat || "—" }} · QQ {{ r.qq || "—" }} · {{ r.time }}</div>' +
            '<div class="btns" style="margin-top:8px"><button class="btn sm plain" @click="refresh(r)">刷新</button><button class="btn sm plain" @click="del(r)">删除</button></div></div>' +
            '<empty v-if="loaded && !mine.length" text="你还没有发布过" ico="📭"></empty></template>' +
            '<div class="mask" v-if="form" @click.self="form=null"><div class="sheet"><h3>发布合作消息</h3>' +
            '<div class="form-item"><label><b>*</b>类型</label><select class="select" v-model="form.type"><option value="0">接单（我能接）</option><option value="1">发单（我要找人做）</option></select></div>' +
            '<div class="form-item"><label>适用游戏</label><select class="select" v-model="form.gameName"><option value="全部游戏">全部游戏</option><option v-for="g in games" :key="g.id" :value="g.name">{{ g.name }}</option></select></div>' +
            '<div class="form-item"><label><b>*</b>内容</label><textarea class="input" rows="4" maxlength="200" v-model="form.content" placeholder="不超过 200 字，写清需求与条件"></textarea></div>' +
            '<div class="row" style="gap:10px"><div class="form-item grow"><label><b>*</b>微信</label><input class="input" v-model="form.wechat" maxlength="40"></div>' +
            '<div class="form-item grow"><label>QQ</label><input class="input" v-model="form.qq" maxlength="20"></div></div>' +
            '<div class="btns"><button class="btn grow" :disabled="busy" @click="save">发布</button><button class="btn plain" @click="form=null">取消</button></div></div></div></div></div>',
        created: function () { var self = this; this.go('all'); API.get('games').then(function (r) { self.games = Array.isArray(r.data) ? r.data : []; }); },
        methods: {
            go: function (tab) { var self = this; this.tab = tab; this.loaded = false; if (tab === 'mine') { API.get('circle/mine').then(function (r) { self.loaded = true; self.mine = r.code > 0 && Array.isArray(r.data) ? r.data : []; }); } else { API.get('circle/list').then(function (r) { self.loaded = true; if (r.code > 0) { var data = r.data || {}; data.topList = Array.isArray(data.topList) ? data.topList : []; data.normalList = Array.isArray(data.normalList) ? data.normalList : []; data.count = Number(data.count) || data.topList.length + data.normalList.length; self.d = data; } else self.d = { topList: [], normalList: [], count: 0 }; }); } },
            openForm: function () { if (!store.user) { this.$router.push({ path: '/login', query: { back: '/circle' } }); return; } this.form = { type: '0', gameName: '全部游戏', content: '', wechat: '', qq: '' }; },
            save: function () { var self = this; if (!this.form.content.trim()) { UI.toast('请填写发布内容'); return; } if (!this.form.wechat.trim() && !this.form.qq.trim()) { UI.toast('请至少留一个联系方式'); return; } this.busy = true; API.post('circle/publish', this.form).then(function (r) { self.busy = false; UI.toast(r.msg); if (r.code > 0) { self.form = null; self.go('mine'); } }); },
            refresh: function (r) { var self = this; API.post('circle/refresh', { id: r.id }).then(function (res) { UI.toast(res.msg); self.go('mine'); }); },
            del: function (r) { var self = this; UI.confirm('删除这条消息？').then(function (ok) { if (ok) API.post('circle/del', { id: r.id }).then(function (res) { UI.toast(res.msg); self.go('mine'); }); }); }
        }
    };

    var Blacklist = {
        components: { TopBar: TopBar, Empty: Empty },
        data: function () { return { key: '', d: null, busy: false }; },
        template: '<div><top-bar title="避坑查询"></top-bar><div class="page pc-page pc-blacklist">' +
            '<div class="card flat small muted">下单前先查一下对方留的手机号 / 微信号 / QQ：平台里被其他商家举报过的对象会出现在这里，只展示被举报对象与原因，不展示举报人。</div>' +
            '<div class="row" style="gap:8px;margin:0 0 12px"><input class="input grow" v-model="key" placeholder="手机号 / 微信号 / QQ / 昵称" @keyup.enter="search"><button class="btn" :disabled="busy" @click="search">查询</button></div>' +
            '<div class="card" v-for="r in (d ? d.list : [])" :key="r.id"><div class="bold">{{ r.name || "未填写名称" }} <span class="tag">{{ r.roleType }}</span></div>' +
            '<div style="margin:6px 0">{{ r.content }}</div>' +
            '<div class="small muted">公开结果不展示举报对象联系方式<template v-if="r.fee"> · 涉及金额 {{ r.fee }} 元</template> · {{ r.time }}</div></div>' +
            '<empty v-if="d && !d.count" text="没有查到相关记录，这是个好消息" ico="✅"></empty></div></div>',
        methods: {
            search: function () { var self = this; if (!this.key.trim()) { UI.toast('请输入查询内容'); return; } this.busy = true; API.get('blacklist/search', { key: this.key }).then(function (r) { self.busy = false; if (r.code > 0) { self.d = r.data; } else { self.d = { list: [], count: 0 }; UI.toast(r.msg); } }); }
        }
    };

    return { Roles: Roles, Chat: Chat, Invite: Invite, Calc: Calc, Boosters: Boosters, Legal: Legal, Aftersales: Aftersales, Search: Search, Circle: Circle, Blacklist: Blacklist };
})();
