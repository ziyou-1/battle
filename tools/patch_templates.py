# Structural patches on generated templates: turn server-rendered lists into Jinja loops, scrub PII, extract seed catalogs.
import re, os, glob, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
T = os.path.join(ROOT, 'templates'); DATA = os.path.join(ROOT, 'data'); os.makedirs(DATA, exist_ok=True)
GAMES = ['全部游戏', '崩坏：星穹铁道', '原神', '三角洲行动', '鸣潮', '绝区零', '无限暖暖', '遗忘之海', '异环', '王者荣耀世界', '洛克王国：世界', '逆战：未来', '明日方舟：终末地', '燕云十六声']
GAMES_ALT = '|'.join(re.escape(g) for g in GAMES)


def rw(rel, fn):
    f = os.path.join(T, rel)
    if not os.path.exists(f):
        return False
    s = open(f, encoding='utf-8').read(); o = s
    s = fn(s)
    if s != o:
        open(f, 'w', encoding='utf-8').write(s); print('patched', rel)
    return s != o


# ---- 1. PII scrub: alipay account option
rw('Emp/emplist.html', lambda s: s.replace('<option value="1170">ghh20011124@outlook.com</option>',
    '[% for a in payAlipayAccs %]<option value="[[ a.id ]]">[[ a.acc ]]</option>[% endfor %]'))

# ---- 2. gameName selects with numeric game ids (all pages); keep data-* attributes and support edit-mode selection (o.gameId)
pat = re.compile(r'(<select[^>]*(?:id|name)="gameName"[^>]*>)(.*?)(</select>)', re.S)


def rep_numeric(m):
    head, body, tail = m.groups()
    sample = re.search(r'<option[^>]*value="\d+"[^>]*>', body)
    if not sample:
        return m.group(0)
    kept = re.sub(r'\s*<option[^>]*value="\d+"[^>]*>[^<]*</option>', '', body)
    attrs = ''
    if 'data-mobliegame' in sample.group(0):
        attrs += ' data-mobliegame="[[ gm.isMoblieGame ]]" data-pw="[[ gm.isPw ]]"'
    if 'data-accpwd' in sample.group(0):
        attrs += ' data-accpwd="[[ \'N\' if gm.isNotAccPwd == \'Y\' else \'Y\' ]]"'
    sel = "[% if o and o.gameId == gm.gameId %] selected='selected'[% endif %]"
    return head + kept.rstrip() + '\n[% for gm in games %]<option value="[[ gm.gameId ]]"' + attrs + sel + '>[[ gm.gameName ]]</option>[% endfor %]\n' + tail


# name-valued option lists (value == game name)
opt_named = re.compile(r'(?:\s*<option[^>]*value="(?:' + GAMES_ALT + r')"[^>]*>(?:' + GAMES_ALT + r')</option>){2,}')


def rep_named(m):
    return '\n[% for gm in games %]<option value="[[ gm.gameName ]]">[[ gm.gameName ]]</option>[% endfor %]\n'


for f in glob.glob(os.path.join(T, '**', '*.html'), recursive=True):
    rel = os.path.relpath(f, T).replace(os.sep, '/')

    def fn(s):
        s = pat.sub(rep_numeric, s)
        if rel != 'Game/AddEditGame.html':
            s = opt_named.sub(rep_named, s)
        return s
    rw(rel, fn)

# ---- 3. page specific structures
rw('Index/console.html', lambda s: re.sub(r'<td>全部游戏,崩坏：星穹铁道[^<]*</td>', '<td>[[ user.games ]]</td>', s))

rw('home/SystemCircle.html', lambda s: re.sub(r'(?:\s*<dd><a href="javascript:;" class="sgame" data-game="(?:' + GAMES_ALT + r')">(?:' + GAMES_ALT + r')</a></dd>)+',
    '\n[% for gm in games %]<dd><a href="javascript:;" class="sgame" data-game="[[ gm.gameName ]]">[[ gm.gameName ]]</a></dd>[% endfor %]\n', s))

rw('Order/ClientOrderGenerate.html', lambda s: re.sub(r'(?:\s*<option data-mobliegame="[YN]" data-pw="[YN]" data-accpwd="[YN]" >(?:' + GAMES_ALT + r')</option>)+',
    '\n[% for gm in games %]<option data-mobliegame="[[ gm.isMoblieGame ]]" data-pw="[[ gm.isPw ]]" data-accpwd="[[ "N" if gm.isNotAccPwd == "Y" else "Y" ]]" >[[ gm.gameName ]]</option>[% endfor %]\n', s))

rw('System/OrderPushGroupMsgSet.html', lambda s: re.sub(r'(?:\s*<input type="checkbox" name="gameName" value="(?:' + GAMES_ALT + r')" title="(?:' + GAMES_ALT + r')" />)+',
    '\n[% for gm in games_real %]<input type="checkbox" name="gameName" value="[[ gm.gameName ]]" title="[[ gm.gameName ]]" />[% endfor %]\n', s))

rw('System/PlatformAutoReply.html', lambda s: s.replace('id="defGame" value="崩坏：星穹铁道"', 'id="defGame" value="[[ defaultGame ]]"'))

rw('Order/addorder.html', lambda s: re.sub(r'(?:\s*<input type="radio" name="importGameName" value="(?:' + GAMES_ALT + r')" title="(?:' + GAMES_ALT + r')" lay-filter="importGameName">)+',
    '\n[% for gm in games_real %]<input type="radio" name="importGameName" value="[[ gm.gameName ]]" title="[[ gm.gameName ]]" lay-filter="importGameName">[% endfor %]\n', s))


# ---- 4. AddEditGame: extract the global game catalog (radio list) and the select of catalog games
def addeditgame(s):
    radios = re.findall(r'<input type="radio" name="games" value="([^"]*)" data-isPw="([YN])" data-isMoblie="(\d+)" title="[^"]*" data-name="[^"]*" data-firstKey="([^"]*)" lay-filter="" />', s)
    if radios:
        json.dump([{'name': a, 'isPw': b, 'isMoblie': c, 'firstKey': d} for a, b, c, d in radios], open(os.path.join(DATA, 'game_catalog.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
        print('catalog games:', len(radios))
    s = re.sub(r'(?:\s*<div class="layui-inline" style="width:200px">\s*<input type="radio" name="games" value="[^"]*" data-isPw="[YN]" data-isMoblie="\d+" title="[^"]*" data-name="[^"]*" data-firstKey="[^"]*" lay-filter="" />\s*</div>)+',
        '\n[% for g in catalog %]<div class="layui-inline" style="width:200px"><input type="radio" name="games" value="[[ g.name ]]" data-isPw="[[ g.isPw ]]" data-isMoblie="[[ g.isMoblie ]]" title="[[ g.name ]]" data-name="[[ g.name ]]" data-firstKey="[[ g.firstKey ]]" lay-filter="" /></div>[% endfor %]\n', s)
    s = re.sub(r'(?:\s*<option value="([^"]+)">\1</option>){10,}', '\n[% for g in catalog %]<option value="[[ g.name ]]">[[ g.name ]]</option>[% endfor %]\n', s)
    return s


rw('Game/AddEditGame.html', addeditgame)

# ---- 5. user pages: game checkbox lists
for _rel in ('User/adduser.html', 'User/AddUser.html'):
    rw(_rel, lambda s: re.sub(r'(?:\s*<div class="layui-inline" style="margin-right:5px; margin-top:0px">\s*<input type="checkbox" name="games" lay-skin="tag" value="(?:' + GAMES_ALT + r')"  title="(?:' + GAMES_ALT + r')" />\s*</div>)+',
        '\n[% for gm in games %]<div class="layui-inline" style="margin-right:5px; margin-top:0px"><input type="checkbox" name="games" lay-skin="tag" value="[[ gm.gameName ]]"  title="[[ gm.gameName ]]" [% if eu and gm.gameName in eu_games %]checked=""[% endif %]/></div>[% endfor %]\n', s))
rw('User/myinfo.html', lambda s: re.sub(r'(?:\s*<div class="layui-inline" style="width:110px; margin-top:0px">\s*<input type="checkbox" disabled="disabled" value="(?:' + GAMES_ALT + r')" name="gamelist" lay-skin="primary" title="(?:' + GAMES_ALT + r')" checked="">\s*</div>)+',
    '\n[% for gm in games %]<div class="layui-inline" style="width:110px; margin-top:0px"><input type="checkbox" disabled="disabled" value="[[ gm.gameName ]]" name="gamelist" lay-skin="primary" title="[[ gm.gameName ]]" [% if gm.gameName in user_games %]checked=""[% endif %]></div>[% endfor %]\n', s))
rw('User/SetGames.html', lambda s: re.sub(r'(?:\s*<input type="checkbox" name="games" value="(?:' + GAMES_ALT + r')"  title="(?:' + GAMES_ALT + r')" lay-filter="selectGame" lay-skin="tag" />)+',
    '\n[% for gm in games %]<input type="checkbox" name="games" value="[[ gm.gameName ]]"  title="[[ gm.gameName ]]" lay-filter="selectGame" lay-skin="tag" [% if eu and gm.gameName in eu_games %]checked=""[% endif %]/>[% endfor %]\n', s))


# ---- 6. tenant/account specific values -> variables (also scrubs the studio owner's phone number)
def tenant_scrub(s):
    for a, b in [('(15377167407)', '([[ sys.ownerAccount ]])'), ('u=66253', 'u=[[ sys.jdpId ]]'), ('order/5819', 'order/[[ sys.id ]]'),
                 ('?u=5819', '?u=[[ sys.id ]]'), ('已绑定了鸡蛋铺个人账号：15377167407', '已绑定了鸡蛋铺个人账号：[[ sys.ownerAccount ]]'),
                 ('sellacc/?id=5819', 'sellacc/?id=[[ sys.id ]]'), ('2019071918003165108', '[[ sys.taobaoAppId ]]')]:
        s = s.replace(a, b)
    s = re.sub(r'截至\d{4}年\d{2}月\d{2}日 \d{2}:\d{2}您的鸡蛋铺个人账户\(\[\[ sys.ownerAccount \]\]\)可用余额为：[\d.]+元，短信余量：\d+条，虚拟电话套餐剩余：\d+分钟',
               '截至[[ now_cn ]]您的鸡蛋铺个人账户([[ sys.ownerAccount ]])可用余额为：[[ sys.balance ]]元，短信余量：[[ sys.smsLeft ]]条，虚拟电话套餐剩余：[[ sys.phoneMinutes ]]分钟', s)
    return s


for f in glob.glob(os.path.join(T, '**', '*.html'), recursive=True):
    rw(os.path.relpath(f, T).replace(os.sep, '/'), tenant_scrub)


# ---- 7. 主框架菜单按权限显示：无权限的 li 加 layui-hide / dd 整体不渲染
def menu_perm(s):
    m = re.search(r'<ul class="layui-nav layui-nav-tree"[^>]*>(.*?)</ul>\s*</div>\s*</div>', s, re.S)
    nav = m.group(1); orig = nav
    nav = re.sub(r'(<dd>\s*<a lay-href="(/[^"]+)"[\s\S]*?</dd>)', lambda mm: '[% if can("' + mm.group(2) + '") %]' + mm.group(1) + '[% endif %]', nav)
    nav = re.sub(r'<li data-name="([^"]*)" class="layui-nav-item([^"]*)">(\s*<a href="javascript:;" lay-href="(/[^"]+)")',
                 lambda mm: '<li data-name="%s" class="layui-nav-item%s[%% if not can("%s") %%] layui-hide[%% endif %%]">%s' % (mm.group(1), mm.group(2).replace(' layui-hide', ''), mm.group(4), mm.group(3)), nav)

    def parent(mm):
        block = mm.group(0)
        hrefs = re.findall(r'lay-href="(/[^"]+)"', block)
        cond = ' or '.join('can("%s")' % h for h in hrefs) or 'True'
        return block.replace('class="layui-nav-item">', 'class="layui-nav-item[%% if not (%s) %%] layui-hide[%% endif %%]">' % cond, 1)
    nav = re.sub(r'<li data-name="[^"]*" class="layui-nav-item">\s*<a href="javascript:;" lay-direction="2">[\s\S]*?</dl>\s*</li>', parent, nav)
    return s.replace(orig, nav)


# ---- 7b. 本地新增的后台页面加进左侧菜单（在权限包裹之前插入，权限键见 api/menu.py）
def menu_extra(s):
    pad = '\n                                    '

    def dd(href, text, icon):
        return pad + '<dd>' + pad + '    <a lay-href="%s" lay-text="%s" class="">' % (href, text) + pad + '        <i class="layui-icon %s"></i>' % icon + pad + '        <cite>%s</cite>' % text + pad + '    </a>' + pad + '</dd>'
    a = s.find('<a lay-href="/Order/ClientOrderGenerate"')
    if a > 0 and '/Order/clientreviews' not in s:
        e = s.index('</dd>', a) + len('</dd>')
        s = s[:e] + dd('/Order/clientreviews', '客户评价', 'layui-icon-rate') + dd('/Order/aftersales', '售后处理', 'layui-icon-survey') + s[e:]
    a = s.find('<a lay-href="/System/wechatappmange"')
    if a > 0 and '/System/clientsetting' not in s:
        e = s.index('</dd>', a) + len('</dd>')
        s = s[:e] + dd('/System/clientsetting', '客户端设置', 'layui-icon-cellphone') + s[e:]
    return s


rw('index.html', menu_extra)
rw('index.html', menu_perm)


# ---- 8. 控制台：登录信息 / 职位（清掉抓取时的真实 IP、地理位置）
def console_info(s):
    s = re.sub(r"""\{\{= i18n\.\$t\('page\.logTime'\) \}\}：2026-09-19 09:55:42 \{\{= i18n\.\$t\('page\.LoginIP'\) \}\}：[\d.]+ \{\{= i18n\.\$t\('page\.LoginCity'\) \}\}：[^<]*""",
               "{{= i18n.$t('page.logTime') }}：[[ user.lastLoginTime ]] {{= i18n.$t('page.LoginIP') }}：[[ user.lastLoginIp ]] {{= i18n.$t('page.LoginCity') }}：[[ user.lastLoginCity ]]", s)
    s = re.sub(r"""\{\{= i18n\.\$t\('page\.logTime'\) \}\}：2026-09-18 19:14:08 \{\{= i18n\.\$t\('page\.LoginIP'\) \}\}：[\d.]+ \{\{= i18n\.\$t\('page\.LoginCity'\) \}\}：[^<]*""",
               "{{= i18n.$t('page.logTime') }}：[[ user.prevLoginTime ]] {{= i18n.$t('page.LoginIP') }}：[[ user.prevLoginIp ]] {{= i18n.$t('page.LoginCity') }}：[[ user.prevLoginCity ]]", s)
    s = s.replace("""<span class='' style="margin-top:10px">系统管理员</span>""", """<span class='' style="margin-top:10px">[[ user.jobName ]]</span>""")
    return s


rw('Index/console.html', console_info)


# ---- 9. 订单详情弹窗：由抓取的实例页转成模板（值来自 o = 订单记录）
def build_orderview():
    src = os.path.join(ROOT, 'ref', 'Order', 'OrderView__q_orderId-20260919104919472489_viewType-10')
    if not os.path.exists(src):
        return
    s = open(src, encoding='utf-8').read()
    OID = '20260919104919472489'
    s = s.replace('3316426467044100174', '[[ o.orderIdView ]]').replace(OID, '[[ o.orderId ]]')
    s = s.replace('<span class="left" style="color:#ff0000;">崩坏：星穹铁道</span>', '<span class="left" style="color:#ff0000;">[[ o.gameName ]]</span>')
    s = re.sub(r'(<span class="left" style="color:#666">)/全区(</span>\s*<span class="left" style="color:#666">)/全服(</span>\s*<span class="left" style="color:#666">)/全部(</span>\s*<span class="left" style="color:#666">)/全部(</span>)',
               r'\1/[[ o.gameArea ]]\2/[[ o.gameServer ]]\3/[[ o.gameJob ]]\4/[[ o.gameGroup ]]\5', s)
    s = re.sub(r'(<label class="itemTitle">角色信息：</label>\s*<span class="left" style="color:#5BB75B;">)(</span>\s*<span class="left" style="color:#666">)【0】(</span>\s*<span class="left" style="color:#666">)(</span>\s*<span class="left" style="color:#666">)(</span>)',
               r'\1[[ o.roleName ]]\2【[[ o.levelMark ]]】\3[[ o.gameInfo ]]\4[[ o.itemRemark ]]\5', s)
    s = re.sub(r'(<label class="itemTitle">游戏账号：</label>\s*<span class="left" style="color:#ff0000; line-height:18px">)(</span>\s*<a class="layui-btn layui-btn-xs layui-btn-primary copyacc"[^>]*data-clipboard-text=\')(\')',
               r"\1[[ o.gameAcc ]]\2[[ o.gameAcc ]]\3", s)
    s = re.sub(r'(<label class="itemTitle">子账号：</label>\s*<span class="left" style="color:#666;">)(</span>)', r'\1[[ o.zgameAcc ]]\2', s)
    s = re.sub(r'(<label class="itemTitle">登录密码：</label>\s*<span class="left pwd" style="color:#ff0000;">)(</span>\s*<a class="layui-btn layui-btn-xs layui-btn-primary copypwd"[^>]*data-clipboard-text=\')(\')',
               r"\1[[ o.gamePwd ]]\2[[ o.gamePwd ]]\3", s)
    s = re.sub(r'(<label class="itemTitle">暗号/口令：</label>\s*<span class="left" style="color:#5BB75B;">)(</span>)', r'\1[[ o.loginKey ]]\2', s)
    s = re.sub(r'(<label class="itemTitle">项目分类：</label>\s*<span class="left" style="color: #31BDEC; ">)(</span>)', r'\1[[ o.projectTypeName ]]\2', s)
    s = re.sub(r'(<label class="itemTitle">代练项目：</label>\s*<span class="left" style="color:#666;font-weight:600">)[^<]*(</span>\s*<span class="layui-badge layui-bg-green">)代练(</span>)',
               r'\1[[ o.project ]]\2[[ "陪玩" if o.bussType == 2 else "代练" ]]\3', s)
    s = re.sub(r'(<label class="itemTitle">订单状态：</label>\s*<span class="left" style="color:)#289f16;">代练中(</span>)', r'\1[[ staColor ]];">[[ o.orderSta ]]\2', s)
    s = re.sub(r'(<label class="itemTitle">订单计时：</label>\s*<span class="left" style="color:#5BB75B;">)1天0小时0分钟(</span>\s*<span class="left" style="color:#666;margin-left:10px">还剩<span style="color: #289f16">)0天23时41分(</span>)',
               r'\1[[ o.days ]]天[[ o.hours ]]小时0分钟\2[[ remain ]]\3', s)
    s = re.sub(r'(<label class="itemTitle">当前接手：</label>\s*<a class="" href="javascript:void\(0\)" style="">)素晴网络 (</a>)', r'\1[[ o.recManName ]] \2', s)
    s = re.sub(r'(<label class="itemTitle">联系电话：</label>\s*<span class="left" style="color:#666;">)(</span>)', r'\1[[ o.moblie ]]\2', s)
    s = re.sub(r'(<label class="itemTitle" style="font-weight:600;color:#ff0000">指定电话：</label>\s*<span class="" style="">)(</span>)', r'\1[[ o.sphone ]]\2', s)
    s = s.replace('class="layui-textarea" readonly="readonly" name="desc" id="desc"></textarea>', 'class="layui-textarea" readonly="readonly" name="desc" id="desc">[[ o.orderContent ]]</textarea>')
    s = s.replace("""id="copybtn" style="" href="javascript:void(0)" data-id="[[ o.orderId ]]" data-clipboard-text=''""", """id="copybtn" style="" href="javascript:void(0)" data-id="[[ o.orderId ]]" data-clipboard-text='[[ o.orderContent ]]'""")
    s = s.replace('id="viewType" name="viewType" value="10"', 'id="viewType" name="viewType" value="[[ viewType ]]"')
    s = s.replace('素晴一号', '[[ company ]]')
    hook = ("[% if dev %]<script>window.addEventListener('error',function(e){try{navigator.sendBeacon('/api/DevApi/JsError',JSON.stringify({page:location.pathname,msg:String(e.message),src:String(e.filename)+':'+e.lineno}))}catch(x){}});</script>[% endif %]" + chr(10))
    s = s.replace('<script src="/layuiadmin/layui/layui.js', hook + '<script src="/layuiadmin/layui/layui.js', 1)
    open(os.path.join(T, 'Order', 'OrderView.html'), 'w', encoding='utf-8').write(s)
    print('built Order/OrderView.html')


build_orderview()


# ---- 10. 录入订单页：编辑模式（o = 被编辑的订单）
def addorder_edit(s):
    s = s.replace('<li lay-id="20" class="layui-hide-xs ">导入文件订单</li>', '<li lay-id="20" class="layui-hide-xs [% if o %] layui-hide[% endif %]">导入文件订单</li>')
    s = s.replace('订单内容[会自动识别订单各项内容]</label>', '订单内容[% if not o %][会自动识别订单各项内容][% endif %]</label>')
    s = re.sub(r'(<a lay-href="/System/autodiscernset"[^>]*>\s*<cite>识别不出来或有误？点击这里进行录单识别设置</cite>\s*</a>)',
               r'[% if not o %]\1[% else %]<span style="color:#ff0000">编辑订单时不会自动识别，请手动填写右边项或</span><div class="layui-btn layui-btn-xs layui-btn-warm disbtn" title="点击可以识别上面的订单内容到右侧">点我识别订单</div>[% endif %]', s)
    # 区服/职业/阵营下拉：编辑时预置当前值
    for sid, field in (('gameArea', 'gameArea'), ('gameServer', 'gameServer'), ('gameJob', 'gameJob'), ('gameGroup', 'gameGroup')):
        s = re.sub(r'(<select[^>]*(?:id|name)="%s"[^>]*>\s*)<option value="">请选择或输入</option>' % sid,
                   r'\1[%% if o and o.%s %%]<option value="[[ o.%s ]]">[[ o.%s ]]</option>[%% else %%]<option value="">请选择或输入</option>[%% endif %%]' % (field, field, field), s)
    # 文本框预填
    def val(name, expr):
        nonlocal s
        s = re.sub(r'(<input type="text" name="%s" id="%s"[^>]*?)(\s*/?>)' % (name, name),
                   lambda mm: (re.sub(r' value="[^"]*"', '', mm.group(1)) + ' value="[[ %s ]]"' % expr + mm.group(2)) if 'value=' in mm.group(1) or True else mm.group(0), s)
    val('project', "o.project if o else ''")
    val('souresOrderID', "o.orderIdView if o else ''")
    val('price', "o.price if o else ''")
    val('priceReceipts', "o.netReceipts if o else 0")
    val('desServiceFee', "o.serviceAmount if o else 0")
    val('ww', "o.WangWang if o else ''")
    val('remark', "o.orderRemark if o else ''")
    val('tag', "o.customizeTag if o else ''")
    val('qq', "o.qq if o else ''")
    val('moblie', "o.moblie if o else ''")
    val('gameAcc', "o.gameAcc if o else ''")
    val('gameZAcc', "o.zgameAcc if o else ''")
    val('gameRole', "o.roleName if o else ''")
    s = s.replace('<input type="hidden" id="orderID" name="orderID" value="" />', '<input type="hidden" id="orderID" name="orderID" value="[[ o.orderId if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="tGameArea" name="tGameArea" />', '<input type="hidden" id="tGameArea" name="tGameArea" value="[[ o.gameArea if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="tGameServer" name="tGameServer" />', '<input type="hidden" id="tGameServer" name="tGameServer" value="[[ o.gameServer if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="tGameJob" name="tGameJob" />', '<input type="hidden" id="tGameJob" name="tGameJob" value="[[ o.gameJob if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="tGameGroup" name="tGameGroup" />', '<input type="hidden" id="tGameGroup" name="tGameGroup" value="[[ o.gameGroup if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="editCustomerService" name="editCustomerService" />', '<input type="hidden" id="editCustomerService" name="editCustomerService" value="[[ o.kefu if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="editOrderSoure" name="editOrderSoure" value="" />', '<input type="hidden" id="editOrderSoure" name="editOrderSoure" value="[[ o.orderSoure if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="tproject" name="tproject" value="" />', '<input type="hidden" id="tproject" name="tproject" value="[[ o.project if o else \'\' ]]" />')
    s = s.replace('<input type="hidden" id="ypwd" name="ypwd" />', '<input type="hidden" id="ypwd" name="ypwd" value="[[ o.gamePwd if o else \'\' ]]" />')
    s = s.replace('id="gameNumber" name="gameNumber" value="13"', 'id="gameNumber" name="gameNumber" value="[[ games_real|length ]]"')
    s = s.replace('id="readPriceIsAllowEdit" name="readPriceIsAllowEdit" value="N"', 'id="readPriceIsAllowEdit" name="readPriceIsAllowEdit" value="[[ flags.readPriceIsAllowEdit ]]"')
    s = s.replace('class="layui-textarea" name="dlcontent" id="dlcontent"', 'class="layui-textarea" name="dlcontent" id="dlcontent"')
    s = re.sub(r'(<textarea[^>]*name="dlcontent"[^>]*>)(</textarea>)', r'\1[[ o.orderContent if o else "" ]]\2', s)
    return s


rw('Order/addorder.html', addorder_edit)


# ---- 11. 带订单 id 抓取的其它弹窗：改成模板
OID = '20260919104919472489'


def build_from_capture(src_rel, dst_rel, fn):
    src = os.path.join(ROOT, 'ref', src_rel)
    if not os.path.exists(src):
        return
    s = open(src, encoding='utf-8').read()
    s = fn(s).replace('素晴一号', '[[ company ]]').replace('value="5819"', 'value="[[ sys.id ]]"')
    import importlib.util
    spec = importlib.util.spec_from_file_location('bt', os.path.join(ROOT, 'tools', 'build_templates.py'))
    hook = ("[% if dev %]<script>window.addEventListener('error',function(e){try{navigator.sendBeacon('/api/DevApi/JsError',JSON.stringify({page:location.pathname,msg:String(e.message),src:String(e.filename)+':'+e.lineno}))}catch(x){}});</script>[% endif %]" + chr(10))
    s = s.replace('<script src="/layuiadmin/layui/layui.js', hook + '<script src="/layuiadmin/layui/layui.js', 1)
    d = os.path.join(T, dst_rel); os.makedirs(os.path.dirname(d), exist_ok=True)
    open(d, 'w', encoding='utf-8').write(s); print('built', dst_rel)


def assignation(s):
    s = re.sub(r'(?:\s*<input type="radio" name="userRole" lay-filter="userRole" value="\d+" title="[^"]*" >)+',
               '\n[% for r in roles %]<input type="radio" name="userRole" lay-filter="userRole" value="[[ r.id ]]" title="[[ r.roleName ]]" >[% endfor %]\n', s)
    s = s.replace('id="gameName" name="gameName" value="崩坏：星穹铁道"', 'id="gameName" name="gameName" value="[[ o.gameName ]]"')
    s = s.replace('id="orderId" name="orderId" value="%s"' % OID, 'id="orderId" name="orderId" value="[[ o.orderId ]]"')
    s = re.sub(r'id="orderProject" name="orderProject" value="[^"]*"', 'id="orderProject" name="orderProject" value="[[ o.project ]]"', s)
    s = s.replace('id="orderHours" name="orderHours" value="24.0"', 'id="orderHours" name="orderHours" value="[[ o.days * 24 + o.hours ]]"')
    s = s.replace('id="price" name="price" value="110.00"', 'id="price" name="price" value="[[ o.price ]]"')
    s = s.replace('id="taskId" name="taskId" value="0"', 'id="taskId" name="taskId" value="[[ taskId ]]"')
    s = s.replace('id="taskNeedJobId" name="taskNeedJobId" value="0"', 'id="taskNeedJobId" name="taskNeedJobId" value="[[ taskNeedJobId ]]"')
    return s


build_from_capture('Order/Assignation__q_orderId-%s_taskId-0_taskNeedJobId-0' % OID, 'Order/Assignation.html', assignation)
build_from_capture('Emp/ChangeRecPriceByOrder__q_orderId-%s' % OID, 'Emp/ChangeRecPriceByOrder.html', lambda s: s.replace(OID, '[[ o.orderId ]]'))
build_from_capture('Order/UploadPic__q_orderId-%s' % OID, 'Order/UploadPic.html', lambda s: s.replace(OID, '[[ o.orderId ]]'))
build_from_capture('Order/SendSms__q_orderId-%s' % OID, 'Order/SendSms.html', lambda s: s.replace(OID, '[[ o.orderId ]]'))
build_from_capture('Order/PicMange__q_gameAccId-%s' % OID, 'Order/PicMange.html', lambda s: s.replace(OID, '[[ accId ]]'))
build_from_capture('Group/OrderGroup__q_orderId-%s_gameName-%%E5%%B4%%A9%%E5%%9D%%8F%%EF%%BC%%9A%%E6%%98%%9F%%E7%%A9%%B9%%E9%%93%%81%%E9%%81%%93' % OID, 'Group/OrderGroup.html',
                   lambda s: s.replace(OID, '[[ o.orderId ]]').replace('崩坏：星穹铁道', '[[ o.gameName ]]'))


def new_order_to_group(s):
    s = re.sub(r'(?:\s*<input type="checkbox" name="taskDate" value="\d{4}-\d{2}-\d{2}" title="[^"]*" lay-filter="taskDatefilter">)+',
               '\n[% for d in taskDates %]<input type="checkbox" name="taskDate" value="[[ d.value ]]" title="[[ d.title ]]" lay-filter="taskDatefilter">[% endfor %]\n', s)
    return s.replace(OID, '[[ o.orderId ]]').replace('崩坏：星穹铁道', '[[ o.gameName ]]').replace('value="21708"', 'value="[[ o.gameId ]]"')


build_from_capture('Group/NewOrderToGroup__q_orderId-%s_gameID-21708' % OID, 'Group/NewOrderToGroup.html', new_order_to_group)


# ---- 12. 其它按 id 抓取的弹窗页：去掉查询后缀落成模板（订单 id → o.orderId）
for src_rel, dst_rel in [('Order/SetOrderSta__q_orderId-%s' % OID, 'Order/SetOrderSta.html'), ('Order/orderremark__q_orderId-%s' % OID, 'Order/orderremark.html'),
                         ('Order/ViewSplitOrder__q_splitId-%s' % OID, 'Order/ViewSplitOrder.html'), ('Order/PushJdp__q_orderId-%s' % OID, 'Order/PushJdp.html'),
                         ('Order/MyExportOrder__q_orderId-%s' % OID, 'Order/MyExportOrder.html'), ('Order/ExportOrder__q_orderId-%s' % OID, 'Order/ExportOrder.html'),
                         ('Order/SelectRecUser__q_game-%E5%B4%A9%E5%9D%8F%EF%BC%9A%E6%98%9F%E7%A9%B9%E9%93%81%E9%81%93', 'Order/SelectRecUser.html'),
                         ('Customer/CustomerEdit__q_hid-0', 'Customer/CustomerEdit.html'), ('Emp/AddEditQA__q_id-0', 'Emp/AddEditQA.html'),
                         ('GameAccounts/AddEditAccount__q_gameAccId-0', 'GameAccounts/AddEditAccount.html'), ('Group/AddEditGroup2025__q_isConfigJob-N', 'Group/AddEditGroup2025.html'),
                         ('Group/GroupDetails2025__q_taskID-0', 'Group/GroupDetails2025.html'), ('Group/AddEditGroup__q_taskId-0', 'Group/AddEditGroup.html'),
                         ('Group/GroupDetails__q_taskID-0', 'Group/GroupDetails.html'), ('Emp/SettlementEmp__q_ids-0', 'Emp/SettlementEmp.html'),
                         ('GameAccounts/GameAccDetails__q_gameAccId-0', 'GameAccounts/GameAccDetails.html'), ('GameAccounts/AssignationGamAcc__q_gameAccId-0', 'GameAccounts/AssignationGamAcc.html'),
                         ('System/RoleAuthorityView__q_roleId-1', 'System/RoleAuthorityView.html'), ('Game/AddEditItem__q_gameId-21708', 'Game/AddEditItem.html')]:
    build_from_capture(src_rel, dst_rel, lambda s: s.replace(OID, '[[ o.orderId if o else "" ]]').replace('崩坏：星穹铁道', '[[ gameName ]]'))


# ---- 13. 角色权限编辑弹窗：编辑态回填
def role_edit(s):
    s = s.replace('maxlength="5" class="layui-input layui-input-shadow boxshadow-success">', 'maxlength="5" class="layui-input layui-input-shadow boxshadow-success" value="[[ role.roleName if role else \'\' ]]">')
    s = s.replace('maxlength="50" class="layui-input layui-input-shadow boxshadow-success">', 'maxlength="50" class="layui-input layui-input-shadow boxshadow-success" value="[[ role.remark if role else \'\' ]]">')
    s = s.replace('<input type="hidden" name="roleId" id="roleId" value="0" />', '<input type="hidden" name="roleId" id="roleId" value="[[ role.id if role else 0 ]]" />')
    s = s.replace('<input type="hidden" name="menuId" id="menuId" />', '<input type="hidden" name="menuId" id="menuId" value="[[ role.id if role else 0 ]]" />')
    return s


rw('System/AddEditRoleAuthority.html', role_edit)



# ---- 14. 新开/编辑系统账号：角色单选按本系统角色渲染，编辑态回填
def adduser_edit(s):
    s = re.sub(r'(?:\s*<div class="layui-inline" style="width:130px; margin-top:0px">\s*<input type="radio" name="userRole" value="\d+" data-name="[^"]*" title="[^"]*"  lay-filter="roleFilter" />\s*</div>)+',
               '\n[% for r in roles %]<div class="layui-inline" style="width:130px; margin-top:0px"><input type="radio" name="userRole" value="[[ r.id ]]" data-name="[[ r.roleName ]]" title="[[ r.roleName ]]" [% if eu and eu.jobId == r.id %]checked[% endif %] lay-filter="roleFilter" /></div>[% endfor %]\n', s)
    fields = {'loginAcc': 'eu.loginAcc', 'userName': 'eu.userName', 'qq': 'eu.qq', 'moblie': 'eu.moblie', 'remark': 'eu.remark', 'tips': 'eu.tips', 'insureAmount': 'eu.insureAmount',
              'recOrderMaxCount': 'eu.recOrderMaxCount', 'recPriceMin': 'eu.recPriceMinValue', 'recPriceMax': 'eu.recPriceMaxValue', 'basicSalary': 'eu.basicSalary',
              'brokerageAmount': 'eu.brokerageAmount', 'setAlipayAcc': 'eu.alipayAcc', 'setAlipayAccName': 'eu.alipayName', 'setBankCardNo': 'eu.bankCardNo',
              'setBankName': 'eu.bankName', 'livestreaming': 'eu.livestreaming', 'inputDate': 'eu.inputDate'}
    for name, expr in fields.items():
        s = re.sub(r'(<input type="text" name="%s"(?:(?!>).)*?)(\s*/?>)' % name,
                   lambda mm: re.sub(r' value="[^"]*"', '', mm.group(1)) + ' value="[[ %s if eu else \'\' ]]"' % expr + mm.group(2), s, count=1, flags=re.S)
    s = s.replace('<input type="hidden" name="uid" id="uid" value="0" />', '<input type="hidden" name="uid" id="uid" value="[[ eu.id if eu else 0 ]]" />')
    s = re.sub(r'<input type="radio" name="bussType" value="(\d)" title="默认" checked=&#39;&#39; />', r'<input type="radio" name="bussType" value="\1" title="默认" [% if (eu.bussType if eu else 1)|string == "\1" %]checked[% endif %] />', s)
    s = re.sub(r'<input type="radio" name="bussType" value="(\d)" title="默认"  />', r'<input type="radio" name="bussType" value="\1" title="默认" [% if (eu.bussType if eu else 1)|string == "\1" %]checked[% endif %] />', s)
    s = re.sub(r'<input type="radio" name="userType" value="(\d)" title="默认" checked=&#39;&#39;>', r'<input type="radio" name="userType" value="\1" title="默认" [% if (eu.userType if eu else 0)|string == "\1" %]checked[% endif %]>', s)
    s = re.sub(r'<input type="radio" name="userType" value="(\d)" title="默认" >', r'<input type="radio" name="userType" value="\1" title="默认" [% if (eu.userType if eu else 0)|string == "\1" %]checked[% endif %]>', s)
    s = re.sub(r'(<textarea[^>]*name="description"[^>]*>)(</textarea>)', r'\1[[ eu.description if eu else "" ]]\2', s)
    s = re.sub(r'(<textarea[^>]*name="keywords"[^>]*>)(</textarea>)', r'\1[[ eu.keywords if eu else "" ]]\2', s)
    return s


rw('User/adduser.html', adduser_edit)


# ---- 15. 结算弹窗：笔数/金额/结算对象由服务端按 ids 计算
def settlement_popup(s):
    s = s.replace('<span style="margin-left:10px;line-height:36px;color:#ff0000">0笔</span>', '<span style="margin-left:10px;line-height:36px;color:#ff0000">[[ sett.count ]]笔</span>')
    s = s.replace('<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600">0元</span>\n            </div>\n        </div>\n        <div class="layui-form-item">\n            <label class="layui-form-label">实际需结总额</label>',
                  '<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600">[[ sett.total ]]元</span>\n            </div>\n        </div>\n        <div class="layui-form-item">\n            <label class="layui-form-label">实际需结总额</label>')
    s = s.replace('<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600">0元</span>', '<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600">[[ sett.real ]]元</span>')
    s = s.replace('<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600"></span>', '<span style="margin-left:10px;line-height:36px;color:#ff0000;font-weight:600">[[ sett.names ]]</span>')
    s = s.replace('<input type="hidden" id="empIds" name="empIds" value="0" />', '<input type="hidden" id="empIds" name="empIds" value="[[ sett.ids ]]" />')
    s = s.replace('<input type="radio" name="sta" value="N" title="未结算" lay-filter="sta">', '<input type="radio" name="sta" value="N" title="未结算" lay-filter="sta" [% if sett.allSettled %]checked[% endif %]>')
    s = s.replace('<input type="radio" name="sta" value="Y" title="已结算" lay-filter="sta">', '<input type="radio" name="sta" value="Y" title="已结算" lay-filter="sta" [% if not sett.allSettled %]checked[% endif %]>')
    return s


rw('Emp/SettlementEmp.html', settlement_popup)


# ---- 16. 手写模板（原站抓不到/报错的弹窗）：tools/hand_templates/ 覆盖到 templates/
import shutil
HAND = os.path.join(ROOT, 'tools', 'hand_templates')
for root_, _, files in os.walk(HAND):
    for fn in files:
        src = os.path.join(root_, fn); rel = os.path.relpath(src, HAND)
        dst = os.path.join(T, rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst); print('hand template', rel.replace(os.sep, '/'))



# ---- 17. 通用：把页面里的单选/文本框绑定到 settings（缺省用抓取时的原值）
def bind_settings(s, var='settings', exclude=()):
    names = set(re.findall(r'<input type="radio" name="([^"]+)"', s))
    for name in names:
        if name in exclude:
            continue
        chk = re.findall(r'<input type="radio" name="%s" value="([^"]*)"[^>]*checked' % re.escape(name), s)
        default = chk[0] if chk else ''
        def rep(m, name=name, default=default):
            attrs = re.sub(r"\s*checked(?:=(?:&#39;checked&#39;|'checked'|\"checked\"|checked))?", '', m.group(2))
            return '<input type="radio" name="%s" value="%s"%s [%% if (%s.%s if %s.%s is defined else "%s")|string == "%s" %%]checked[%% endif %%]>' % (
                name, m.group(1), attrs, var, name, var, name, default, m.group(1))
        s = re.sub(r'<input type="radio" name="%s" value="([^"]*)"([^>]*)>' % re.escape(name), rep, s)
    return s


def bind_text(s, names, var='settings'):
    for name in names:
        def rep(m, name=name):
            attrs = m.group(1)
            v = re.search(r' value="([^"]*)"', attrs)
            default = v.group(1) if v else ''
            if '[[' in default:
                # Captured templates may already contain a binding with an unquoted fallback.
                bound = re.fullmatch(r'\[\[ (.*?) is defined else (.*?) \]\]', default)
                if bound and not bound.group(2).startswith(("'", '"')):
                    fallback = bound.group(2).replace('\\', '\\\\').replace("'", "\\'")
                    value = '[[ ' + bound.group(1) + " is defined else '" + fallback + "' ]]"
                    return m.group(0).replace(v.group(0), ' value="' + value + '"')
                return m.group(0)
            attrs = re.sub(r' value="[^"]*"', '', attrs)
            return '<input type="text" name="%s"%s value="[[ %s.%s if %s.%s is defined else \'%s\' ]]"%s>' % (name, attrs, var, name, var, name, default.replace("'", ''), m.group(2))
        s = re.sub(r'<input type="text" name="%s"([^>]*?)(\s*/?)>' % re.escape(name), rep, s, count=1)
    return s


rw('System/systemsetting.html', lambda s: bind_text(bind_settings(s, exclude=('sta',)), ['ExpOdMax', 'DefulatDLHours', 'SK152', 'recOrderInterval', 'PublicSeachOrderBulletin']))


# ---- 18. 各页面里由设置决定的隐藏开关
def flags(rel, mapping):
    def fn(s):
        for hid, expr in mapping.items():
            s = re.sub(r'(<input type="hidden"[^>]*id="%s"[^>]*?)\s*value="[^"]*"' % hid, r'\1 value="[[ %s ]]"' % expr, s, count=1)
        return s
    rw(rel, fn)


flags('Order/orderlist.html', {'IsViewServer': 'flags.IsViewServer', 'moreOpenOrderDetails': 'flags.moreOpenOrderDetails', 'remarkLocation': 'flags.remarkLocation',
                               'isEnableServiceAmount': 'flags.isEnableServiceAmount', 'rightMenuCopyOrder': 'flags.rightMenuCopyOrder', 'taskPullDownListIsViewAll': 'flags.taskPullDownListIsViewAll',
                               'orderSoureOnlyViewSoure': 'flags.orderSoureOnlyViewSoure', 'isViewSoure': 'flags.isViewSoure', 'isViewNetReceipts': 'flags.isViewNetReceipts'})
flags('Order/myorderlist.html', {'remarkLocation': 'flags.remarkLocation', 'isViewWW': 'flags.isViewWW'})
flags('Order/addorder.html', {'isChangeService': 'flags.isChangeService', 'memberDedSwitch': 'flags.memberDedSwitch', 'userBussType': 'user.bussType or 0'})
flags('Emp/emplist.html', {'serviceObject': 'flags.serviceObject'})
flags('Index/console.html', {'isAdmin': 'flags.isAdmin'})


# ---- 19. 主框架：SK70 打手不显示“找上下家”
rw('index.html', lambda s: s.replace('<li class="layui-nav-item layui-hide-xs " lay-unselect>\n                            <a href="https://www.jidanpu.com/work/"',
                                     '<li class="layui-nav-item layui-hide-xs [% if flags.hideFindWork %] layui-hide[% endif %]" lay-unselect>\n                            <a href="https://www.jidanpu.com/work/"'))


# ---- 20. 短信业务设置：开关/自定义常用短信按 sms_settings 渲染
rw('System/smssetting.html', lambda s: bind_text(bind_settings(s, var='sms_settings'), ['ReadInputSMSZdy%d%s' % (i, t) for i in (1, 2, 3, 5, 6, 7) for t in ('Title', '')], var='sms_settings'))
rw('System/customerphoneprivatesetting.html', lambda s: bind_settings(s, var='privacyPhone_settings'))
rw('System/wechartsetting.html', lambda s: bind_text(bind_settings(s, var='wechat_settings'), ['appId', 'appSecret', 'wechatAppappId', 'wechatAppappSecret', 'wechatAppMchid', 'wechatAppPayKey',
    'wechatAppPayHostIP', 'wechatAppMsgTemplateId', 'wechatAppChatMsgTemplateId', 'msgTempleteId', 'customizeMsg1', 'customizeMsg2', 'customizeMsg3', 'chatMsgTempleteId'], var='wechat_settings'))
rw('System/tripartiteplatformsetting.html', lambda s: bind_settings(s, exclude=('platforms',)))
rw('System/taobaoshipsetting.html', lambda s: bind_text(bind_settings(s, var='taobaoShip_settings', exclude=('platforms',)), ['TaoBaoSendWWMsg', 'TaobaoShopItemKey'], var='taobaoShip_settings'))
rw('System/pddshipsetting.html', lambda s: bind_text(bind_settings(s, var='pddShip_settings', exclude=('platforms',)), ['XianyuSendMsg', 'XianyuRefundSendMsg', 'PddShopItemKey', 'PddSendMsgCXZ', 'PddSendMsgYWC', 'DyinShopItemKey', 'KshouShopItemKey', 'XhsShopItemKey', 'JdShopItemKey'], var='pddShip_settings'))

# Keep generated pages honest until the external providers are integrated.
LOCAL_SMS_NOTICE = '<div style="margin:12px 5px;padding:12px 16px;border:1px solid #f0b45b;background:#fff8e8;color:#754719;font-size:14px">本地版尚未接入短信通道。模板和记录可以管理，但验证码、自动短信与群发短信不会送达。请先接入短信服务后再启用。</div>'
LOCAL_WECHAT_NOTICE = '<div style="margin:12px 5px;padding:12px 16px;border:1px solid #f0b45b;background:#fff8e8;color:#754719;font-size:14px">本地版尚未接入微信开放平台。此页设置可以保存，但公众号通知、小程序支付及绑定不会实际生效。</div>'
rw('System/smssetting.html', lambda s: s.replace('<form class="layui-form" action="" lay-filter="pro">', LOCAL_SMS_NOTICE + '<form class="layui-form" action="" lay-filter="pro">', 1))
rw('System/wechartsetting.html', lambda s: re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + LOCAL_WECHAT_NOTICE, s, count=1))
rw('System/smssetting.html', lambda s: s.replace('lay-filter="payBtn"', 'lay-filter="payBtn" disabled title="短信通道未接入"', 1).replace('lay-filter="payczBtn"', 'lay-filter="payczBtn" disabled title="短信通道未接入"', 1))

def protect_order_password(s):
    old = '                                                <span class="left pwd" style="color:#ff0000;">[[ o.gamePwd ]]</span>\n                                                <a class="layui-btn layui-btn-xs layui-btn-primary copypwd" style="margin-left:10px" href="#" data-clipboard-text=\'[[ o.gamePwd ]]\'>复制</a>\n                                                <a class="layui-btn layui-btn-xs layui-btn-primary setpwd" style="margin-left:10px" href="#">更改密码</a>'
    new = '                                                <span class="left pwd" style="color:#ff0000;">[[ "******" if o.gamePwd else "" ]]</span>\n                                                <a class="layui-btn layui-btn-xs layui-btn-primary revealpwd" style="margin-left:10px" href="#" data-orderid="[[ o.orderId ]]">查看密码</a>\n                                                <a class="layui-btn layui-btn-xs layui-btn-primary copypwd" style="margin-left:10px;display:none" href="#" data-clipboard-text="">复制</a>\n                                                <a class="layui-btn layui-btn-xs layui-btn-primary setpwd" style="margin-left:10px" href="#">更改密码</a>'
    if old not in s:
        raise RuntimeError('OrderView password markup changed; update its masking patch')
    return s.replace(old, new, 1).replace('[[ o.loginKey ]]', "[[ '******' if o.loginKey else '' ]]", 1)


rw('Order/OrderView.html', protect_order_password)



# ---- 21. 登录限制弹窗：编辑态回填；实名/合同设置表单绑定
def restrict_popup(s):
    s = s.replace('<input type="hidden" name="uid" id="uid" value="615" />', '<input type="hidden" name="uid" id="uid" value="[[ user.id ]]" />')
    s = s.replace('<input type="hidden" name="userLoginRestrictIds" id="userLoginRestrictIds" value="0" />', '<input type="hidden" name="userLoginRestrictIds" id="userLoginRestrictIds" value="[[ rr.id if rr else 0 ]]" />')
    s = s.replace('<input type="hidden" name="weekDayStr" id="weekDayStr" value="" />', '<input type="hidden" name="weekDayStr" id="weekDayStr" value="[[ rr.weekDay if rr else \'\' ]]" />')
    s = re.sub(r'(<input type="checkbox" name="weekDay" value="(\d)")', r'\1 [% if rr and "\2" in (rr.weekDay or "").split(",") %]checked[% endif %]', s)
    s = re.sub(r'(<textarea[^>]*name="ipWhitelist"[^>]*>)(</textarea>)', r'\1[[ rr.ipWhitelist if rr else "" ]]\2', s)
    for sel, expr in (('restrictTimeS', 'rr.restrictTimeS'), ('restrictTimeE', 'rr.restrictTimeE'), ('restrictType', 'rr.restrictType')):
        s = re.sub(r'(<select[^>]*name="%s"[^>]*>)(.*?)(</select>)' % sel,
                   lambda m: m.group(1) + re.sub(r'<option\s+(?:selected\s+)?value="(\d+)">', lambda o: '<option value="%s" [%% if (rr and (%s|string) == "%s") or (not rr and "%s" == "%s") %%]selected[%% endif %%]>' % (o.group(1), expr, o.group(1), o.group(1), '0' if expr.endswith('restrictType') else '-1'), m.group(2)) + m.group(3), s, flags=re.S)
    return s


rw('User/AddUserLoginRestrict.html', restrict_popup)
def bind_number(s, names, var):
    for name in names:
        def rep(m, name=name):
            if '[[' in m.group(2):  # 已绑定过（脚本重复执行时保持幂等）
                return m.group(0)
            return m.group(1) + ' value="[[ ' + var + '.' + name + ' if ' + var + '.' + name + ' is defined else ' + chr(39) + m.group(2) + chr(39) + ' ]]"'
        s = re.sub(r'(<input type="number" name="%s"(?:(?!>).)*?) value="([^"]*)"' % name, rep, s, count=1, flags=re.S)
    return s


rw('User/RnameCertLogAndSetting.html', lambda s: bind_number(bind_settings(s, var='certSetting_settings'), ['CertMinAge', 'CertMaxAge'], 'certSetting_settings'))
rw('User/UserContractSigning.html', lambda s: bind_number(bind_settings(s, var='contractSetting_settings'), ['signMinAge', 'signMaxAge'], 'contractSetting_settings'))


# ---- 21b. 小程序维护：抽奖设置表单绑定 award_settings（弹窗表单里的单选不绑）
def miniapp_bind(s):
    s = s.replace("checked=&#39;&#39;>", "checked>")
    s = bind_settings(s, var='award_settings', exclude=('newsType', 'ctype', 'expree', 'shipStatus', 'awardType'))
    return bind_text(s, ['awardunit', 'awardamount', 'awardcount'], var='award_settings')


rw('System/wechatappmange.html', miniapp_bind)


# ---- 21c. 报价器：页面隐藏的 gameName 取自 ?gameName=（原站由后端填入）
rw('Game/pricecalculator.html', lambda s: s.replace('<input type="hidden" name="gameName" id="gameName" value="王者荣耀" />',
                                                     '<input type="hidden" name="gameName" id="gameName" value="[[ request.args.get("gameName") or "王者荣耀" ]]" />'))
rw('Game/commonpricesetting.html', lambda s: s.replace('<input type="hidden" id="gameName" name="gameName" />',
                                                        '<input type="hidden" id="gameName" name="gameName" value="[[ request.args.get("gameName") or "英雄联盟手游" ]]" />'))


# ---- 21d. 客户填单设置：提示语 / 图片 / 查进度入口 按 clientWriteOrder_settings 回显
def client_order_bind(s):
    s = s.replace('<textarea class="layui-textarea" name="mark" lay-verify="" id="mark" maxlength="100"></textarea>',
                  '<textarea class="layui-textarea" name="mark" lay-verify="" id="mark" maxlength="100">[[ clientWriteOrder_settings.mark ]]</textarea>')
    s = s.replace('<span class="pic" style="cursor:pointer;"></span>', '<span class="pic" style="cursor:pointer;">[% if clientWriteOrder_settings.pic %]已上传，点击查看[% endif %]</span>')
    s = s.replace('<img id="upimg" style="display:none;" />', '<img id="upimg" style="display:none;" src="[[ clientWriteOrder_settings.pic ]]" />')
    return bind_settings(s, var='clientWriteOrder_settings')


rw('Order/ClientOrderGenerate.html', client_order_bind)


# ---- 21e. 消息提示音设置：主框架读用户的开关 / 音源，我的消息页单选回显
def msg_sound_index(s):
    s = s.replace('<input type="hidden" id="myMsgSoundSoure" value="0" />', '<input type="hidden" id="myMsgSoundSoure" value="[[ user.myMsgSoundSoure or 0 ]]" />')
    s = s.replace('<input type="hidden" id="isPlayMsgSound" />', '<input type="hidden" id="isPlayMsgSound" value="[[ user.isPlayMsgSound or "Y" ]]" />')
    return s.replace('<source src="/media/msg.wav" type="audio/mpeg" muted="true">',
                     '<source src="[[ "/media/msg2.wav" if (user.myMsgSoundSoure|string) == "2" else "/media/msg.wav" ]]" type="audio/mpeg" muted="true">')


def msg_sound_page(s):
    q = "{{= i18n.$t('page.%s') }}"
    s = s.replace('name="msgsound" lay-filter="msgsound" value="Y" title="%s" checked=&#39;checked&#39;>' % (q % 'msgsoundradio1'),
                  'name="msgsound" lay-filter="msgsound" value="Y" title="%s" [%% if (user.isPlayMsgSound or "Y") != "N" %%]checked[%% endif %%]>' % (q % 'msgsoundradio1'))
    s = s.replace('name="msgsound" lay-filter="msgsound" value="N" title="%s" >' % (q % 'msgsoundradio2'),
                  'name="msgsound" lay-filter="msgsound" value="N" title="%s" [%% if user.isPlayMsgSound == "N" %%]checked[%% endif %%]>' % (q % 'msgsoundradio2'))
    s = s.replace('name="selectsound" lay-filter="selectsound" value="0" title="%s" checked=&#39;checked&#39;>' % (q % 'selectsoundradio1'),
                  'name="selectsound" lay-filter="selectsound" value="0" title="%s" [%% if (user.myMsgSoundSoure|string) != "2" %%]checked[%% endif %%]>' % (q % 'selectsoundradio1'))
    return s.replace('name="selectsound" lay-filter="selectsound" value="2" title="%s" >' % (q % 'selectsoundradio2'),
                     'name="selectsound" lay-filter="selectsound" value="2" title="%s" [%% if (user.myMsgSoundSoure|string) == "2" %%]checked[%% endif %%]>' % (q % 'selectsoundradio2'))


rw('index.html', msg_sound_index)
rw('User/mymessage.html', msg_sound_page)


# ---- 21f. 游戏号详情 / 指派游戏号弹窗：原站按 id=0 抓的空壳，这里按本地号库数据补全
ACC_DETAIL_BOX = '''<div class="layui-field-box">
                    [% if not acc %]<span style="color:#FF5722">账号不存在或已删除</span>[% else %]
                    <div class="layui-row" style="line-height:26px">
                        [% for k, v in [('编号', acc.gameAccId), ('状态', acc.accStatusStr), ('游戏', acc.gameName), ('用途', acc.accUseTypeStr), ('区服', (acc.gameArea ~ ' ' ~ acc.gameServer)|trim), ('阵营/职业', (acc.gameGroup ~ ' ' ~ acc.gameJob)|trim),
                                         ('角色名', acc.gameRoleName), ('区服信息', acc.gameInfo), ('当前信息', (acc.gameTF ~ ' ' ~ acc.otherLevel ~ ' ' ~ acc.otherMark)|trim), ('成本/售价', acc.costPrice ~ ' / ' ~ acc.sellPrice ~ '（利润 ' ~ acc.profit ~ '）'),
                                         ('接手人', acc.recUserName or '无'), ('标签', acc.Tips), ('机位', acc.jiwei), ('入库时间', acc.createTime), ('备注', acc.remark)] %]
                        <div class="layui-col-xs12 layui-col-md6" style="padding:0 6px;word-break:break-all"><span style="color:#888;display:inline-block;width:70px;text-align:right;margin-right:8px">[[ k ]]</span>[[ v ]]</div>
                        [% endfor %]
                    </div>
                    <div style="margin-top:8px">
                        <a class="layui-btn layui-btn-sm layui-btn-normal getGameAccountUseInfo" href="javascript:;" title="提取账号密码，会记录到账号日志">提取使用资料</a>
                        <a class="layui-btn layui-btn-sm layui-btn-warm getGameAccountPrivateInfo" href="javascript:;" title="提取密保等机密资料，会记录到账号日志">提取机密资料</a>
                        <a class="layui-btn layui-btn-sm layui-btn-primary upImg" href="javascript:;" data-id="[[ acc.gameAccId ]]">上传账号截图</a>
                        <a class="layui-btn layui-btn-sm layui-btn-primary mangeImg" href="javascript:;" data-id="[[ acc.gameAccId ]]">查看账号截图</a>
                    </div>
                    <div class="uinfo" style="margin-top:8px;line-height:24px"></div>
                    <div class="pinfo" style="margin-top:4px;line-height:24px"></div>
                    [% endif %]
                </div>'''


def acc_details(s):
    s = re.sub(r'<legend>账号详情</legend>\s*<div class="layui-field-box">\s*</div>', lambda m: '<legend>账号详情</legend>\n                ' + ACC_DETAIL_BOX, s, count=1)
    return s.replace('<input type="hidden" id="accId" name="accId" value="0" />', '<input type="hidden" id="accId" name="accId" value="[[ acc.gameAccId if acc else 0 ]]" />')


def acc_assign(s):
    s = re.sub(r'(?:\s*<input type="radio" name="userRole" lay-filter="userRole" value="\d+" title="[^"]*">)+',
               '\n[% for r in roles %]<input type="radio" name="userRole" lay-filter="userRole" value="[[ r.id ]]" title="[[ r.roleName ]]">[% endfor %]\n', s, count=1)
    s = s.replace('<input type="hidden" id="gameName" name="gameName" value="" />', '<input type="hidden" id="gameName" name="gameName" value="[[ acc.gameName if acc else "" ]]" />')
    s = s.replace('<input type="hidden" id="accId" name="accId" value="0" />', '<input type="hidden" id="accId" name="accId" value="[[ acc.gameAccId if acc else 0 ]]" />')
    return s.replace('<input type="hidden" id="currentRecUserName" name="currentRecUserName" value="" />', '<input type="hidden" id="currentRecUserName" name="currentRecUserName" value="[[ acc.recUserName if acc else "" ]]" />')


rw('GameAccounts/GameAccDetails.html', acc_details)
rw('GameAccounts/AssignationGamAcc.html', acc_assign)


# ---- 21g. 会员编辑弹窗：客户端登录密码（短信找回接上之前，客户忘密码由客服在这里重置）
def customer_edit_pwd(s):
    a = s.find('<input type="text" name="wxNo" lay-verify=""')
    if a < 0 or 'name="clientPwd"' in s:
        return s
    e = s.index('</div>', s.index('</div>', a) + 6) + 6   # 跳过 layui-input-inline 与 layui-form-item 两层
    pad = '\n                        '
    block = (pad + '<div class="layui-form-item">' + pad + '    <label class="layui-form-label">客户端密码</label>' + pad + '    <div class="layui-input-inline">' +
             pad + '        <input type="text" name="clientPwd" lay-verify="" autocomplete="off" placeholder="留空不改；填写=重置客户端登录密码" class="layui-input" maxlength="20">' +
             pad + '    </div>' + pad + '    <div class="layui-form-mid layui-word-aux">客户用手机号 + 此密码登录 /app 客户端</div>' + pad + '</div>')
    return s[:e] + block + s[e:]


rw('Customer/CustomerEdit.html', customer_edit_pwd)


# ---- 21h. 主框架：用轮询代替原站的 WebSocket 推送（新订单 / 留言 提示音 + 自动刷新列表），代码在 static/JS2019/local_msg_poll.js
def msg_poll(s):
    if 'local_msg_poll.js' in s:
        return s
    nl = chr(10)
    s = s.replace('<script type="text/javascript" src="/JS2019/common.js?v=11107"></script>', '<script type="text/javascript" src="/JS2019/common.js?v=11107"></script>' + nl + '<script src="/JS2019/local_msg_poll.js?v=4"></script>', 1)
    return s.replace('        createWebSocket();' + nl + '        getAllDontNotice();',
                     '        createWebSocket();' + nl + '        startLocalMsgPoll({ $: $, layer: layer, notice: notice, isPlayMsgSound: isPlayMsgSound, domain: domain, getAllDontNotice: getAllDontNotice });' + nl + '        getAllDontNotice();', 1)


rw('index.html', msg_poll)


# ---- 21i. 抓取时页面里写死的默认查询日期（抓取日 2026-09-19）→ 相对“今天”的日期，否则新单永远不在默认范围内
import datetime as _dt
CAPTURE_DAY = _dt.date(2026, 9, 19)


def relative_dates(s):
    def rep(m):
        try:
            d = _dt.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except ValueError:
            return m.group(0)
        n = (CAPTURE_DAY - d).days
        if n < 0 or n > 400:
            return m.group(0)
        return '[[ dago(%d) ]]' % n
    out = re.sub(r'(?<=value=")(2026)-(\d{1,2})-(\d{1,2})(?=[ "~])', lambda m: rep(m), s)
    out = re.sub(r'(?<=~ )(2026)-(\d{1,2})-(\d{1,2})(?=")', lambda m: rep(m), out)
    out = re.sub(r"(?<=(?:max|min): ')(2026)-(\d{1,2})-(\d{1,2})(?=')", lambda m: rep(m), out)
    return out


for _f in glob.glob(os.path.join(T, '**', '*.html'), recursive=True):
    rw(os.path.relpath(_f, T).replace(os.sep, '/'), relative_dates)


# ---- 21j. 后台皮肤：所有带 zdy.css 的页面在其后加载 /CSS/admin-skin.css；页面里的原站品牌字样替换
def admin_skin(s):
    if 'admin-skin.css' not in s and '/CSS/zdy.css?v=1100008" media="all" />' in s:
        s = s.replace('/CSS/zdy.css?v=1100008" media="all" />', '/CSS/zdy.css?v=1100008" media="all" />' + chr(10) + '<link rel="stylesheet" href="/CSS/admin-skin.css?v=3" media="all" />', 1)
    s = s.replace('鸡蛋铺个人账号', '平台个人账号').replace('鸡蛋铺账号', '平台账号').replace('鸡蛋铺已推出', '平台已推出').replace('鸡蛋铺商铺', '平台商铺').replace('鸡蛋铺', '平台')
    s = s.replace('素晴网游', '云序工作室').replace('素晴网络', '云序工作室').replace('找素晴', '找客服')
    s = s.replace('http://suqing1.jidanpu.com/Index/onlineorder', '/app/')
    return s


for _f in glob.glob(os.path.join(T, '**', '*.html'), recursive=True):
    rw(os.path.relpath(_f, T).replace(os.sep, '/'), admin_skin)


# ---- 22. 我的资料：个人字段回填 + 头像
def myinfo_bind(s):
    s = s.replace('<img id="avatar" style="max-width:240px" class="layui-circle" src="https://oss2.jidanpu.com/userPic.png">', '<img id="avatar" style="max-width:240px" class="layui-circle" src="[[ user.photo or \'/images/userPic.png\' ]]">')
    s = s.replace('class="layui-input layui-input-shadow" value="1234567890" maxlength="16">', 'class="layui-input layui-input-shadow" value="[[ user.loginAcc ]]" maxlength="16">')
    for name, expr in (('basicSalary', 'user.basicSalary or "0.00"'), ('setAlipayAcc', 'user.alipayAcc'), ('setAlipayAccName', 'user.alipayName'), ('setBankName', 'user.bankName'),
                       ('setBankCardNo', 'user.bankCardNo'), ('qq', 'user.qq'), ('moblie', 'user.moblie'), ('livestreaming', 'user.livestreaming'), ('sid', 'user.rname')):
        s = re.sub(r'(<input type="text" name="%s"(?:(?!>).)*?) value="[^"]*"' % name, lambda m, e=expr: m.group(1) + ' value="[[ %s ]]"' % e, s, count=1, flags=re.S)
    s = s.replace('<input type="hidden" name="qrCode1" id="qrCode1" value="" />', '<input type="hidden" name="qrCode1" id="qrCode1" value="[[ user.qrCode1 ]]" />')
    return s


rw('User/myinfo.html', myinfo_bind)


# ---- 23. 品牌图标：主框架与客户端共用 static/brand-mark.svg
def brand_shell(s):
    if '/brand-mark.svg' not in s:
        s = s.replace('<title>[[ company ]]管理系统</title>',
                      '<title>[[ company ]]管理系统</title>\n    <link rel="icon" type="image/svg+xml" href="/brand-mark.svg">', 1)
        s = s.replace('<span class="btn">[[ company ]]</span>',
                      '<img src="/brand-mark.svg" alt="" width="30" height="30" style="vertical-align:middle;margin-right:8px"><span class="btn">[[ company ]]</span>', 1)
    return s


rw('index.html', brand_shell)


# ---- 24. 系统子账户表单：必填项的标签要看得出来（原站这几个字段是 required 但标签没标红）
def required_marks(s):
    for label in ('基本底薪', '提成金额/百分比', '内部抢代练单上限', '内部抢陪玩单上限', '入职日期', '已交保证金'):
        s = s.replace('<label class="layui-form-label">%s</label>' % label,
                      '<label class="layui-form-label" style="color:#ff0000">%s</label>' % label)
    s = s.replace('<label class="layui-form-label tcLabel">提成金额/百分比</label>',
                  '<label class="layui-form-label tcLabel" style="color:#ff0000">提成金额/百分比</label>')
    return s


rw('User/adduser.html', required_marks)


# ---- 25. 系统操作日志：原站页面只有「刷新列表」，补一个「清理全部日志」（对应 /SystemAjax/ClearSystemLog）
def system_log_toolbar(s):
    old = ('<button class="layui-btn layui-btn-xs" lay-event="refresh" type="button" title="刷新当前数据">'
           '<i class="layui-icon">&#xe669;</i>刷新列表</button>')
    new = ('<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="clearAll" type="button" '
           'title="清空所有系统操作日志（不可恢复）"><i class="layui-icon">&#xe640;</i>清理全部日志</button>')
    if 'lay-event="clearAll"' not in s and old in s:
        s = s.replace(old, old + chr(10) + '            ' + new, 1)
    return s


rw('System/systemlog.html', system_log_toolbar)


# ---- 26. 静态资源引用的大小写：Windows 上不区分、Linux 上区分，
#          引用了 /JS2019/Common.js 而磁盘上是 common.js，部署到服务器就 404
def fix_asset_case(s):
    return s.replace('/JS2019/Common.js', '/JS2019/common.js')


for _f in glob.glob(os.path.join(T, '**', '*.html'), recursive=True):
    rw(os.path.relpath(_f, T).replace(os.sep, '/'), fix_asset_case)
