# -*- coding: utf-8 -*-
"""云序工作室管理系统 — 本地版 (Flask + SQLite)

启动:  python app.py   →  http://127.0.0.1:8100
"""
import os, sys, time, datetime, hashlib, secrets
from flask import Flask, request, session, redirect, render_template, jsonify, abort, send_from_directory, g

BASE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE)

import db
from api import api_bp, current_user, json_ok, json_err, dispatch
from security import csrf_token, csrf_required, csrf_valid, inject_csrf_bootstrap

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')
app.config['SECRET_KEY'] = os.environ.get('SQ_SECRET') or db.get_secret()
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(days=3)
app.config['JSON_AS_ASCII'] = False
app.config['MAX_CONTENT_LENGTH'] = 12 * 1024 * 1024
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('SQ_PUBLIC') == '1'
trusted_hosts = [host.strip() for host in os.environ.get('SQ_TRUSTED_HOSTS', '').split(',') if host.strip()]
if trusted_hosts:
    app.config['TRUSTED_HOSTS'] = trusted_hosts
if os.environ.get('SQ_PUBLIC') == '1':
    if not os.environ.get('SQ_SECRET') or not trusted_hosts:
        raise RuntimeError('公开模式需要设置 SQ_SECRET 和 SQ_TRUSTED_HOSTS，并在 HTTPS 反向代理后运行')
app.json.ensure_ascii = False
app.json.sort_keys = False

# 页面里大量使用 layui 的 {{ }} 模板语法，Jinja 改用 [[ ]] / [% %] 作为分隔符
app.jinja_env.variable_start_string = '[['
app.jinja_env.variable_end_string = ']]'
app.jinja_env.block_start_string = '[%'
app.jinja_env.block_end_string = '%]'
app.jinja_env.comment_start_string = '[#'
app.jinja_env.comment_end_string = '#]'
app.jinja_env.autoescape = True
app.jinja_env.finalize = lambda v: '' if v is None else v
import jinja2
app.jinja_env.undefined = jinja2.ChainableUndefined

app.register_blueprint(api_bp)


@app.route('/api/csrf')
def get_csrf_token():
    return jsonify(token=csrf_token())


@app.before_request
def _protect_requests():
    if csrf_required(request.path, request.method, app.debug) and not csrf_valid():
        return json_err('请求验证失败，请刷新页面后重试'), 403


@app.after_request
def _add_csrf_bootstrap(response):
    return inject_csrf_bootstrap(response)

# ---------- 模板索引：ASP.NET 路由不区分大小写 ----------
TEMPLATES = {}
for root, _, files in os.walk(os.path.join(BASE, 'templates')):
    for f in files:
        if f.endswith('.html'):
            rel = os.path.relpath(os.path.join(root, f), os.path.join(BASE, 'templates')).replace(os.sep, '/')
            TEMPLATES[rel[:-5].lower()] = rel


def base_ctx():
    u = current_user()
    if u:
        u = dict(u, name=u.get('userName'), account=u.get('loginAcc'))
    s = db.system_info()
    now = datetime.datetime.now()
    return dict(
        dev=app.debug, user=u or {}, company=s['company'], sys=s,
        now_ms=int(time.time() * 1000), now_cn=now.strftime('%Y年%m月%d日 %H:%M'),
        minD=(now - datetime.timedelta(days=62)).strftime('%Y-%m-%d'), maxD=now.strftime('%Y-%m-%d'),
        dago=lambda n: (now - datetime.timedelta(days=int(n))).strftime('%Y-%m-%d'),   # 页面里“默认查最近 N 天”的日期
        msg_tag=hashlib.md5(f"{s['id']}-{(u or {}).get('id')}".encode()).hexdigest(),
    )


def _find_static(rel):
    """在 static 下按段查找文件；精确匹配不到时退回大小写不敏感匹配。

    Windows 开发不区分大小写、Linux 部署区分：模板里写着 /JS2019/Common.js 而磁盘上
    是 common.js 时，本地一切正常、服务器 404。这里做一层兜底，避免以后再踩。
    """
    cur = os.path.join(BASE, 'static')
    for part in rel.split('/'):
        if not os.path.isdir(cur):
            return None
        exact = os.path.join(cur, part)
        if os.path.exists(exact):
            cur = exact
            continue
        hit = next((e for e in os.listdir(cur) if e.lower() == part.lower()), None)
        if not hit:
            return None
        cur = os.path.join(cur, hit)
    return cur if os.path.isfile(cur) else None


@app.before_request
def _open_db():
    # 静态文件优先（原站 /layuiadmin、/JS2019、/CSS、/images 等目录直接映射到 static/）
    rel = request.path.lstrip('/')
    if rel and not rel.startswith('upload/') and '..' not in rel and '.' in rel.rsplit('/', 1)[-1]:
        sp = _find_static(rel)
        if sp:
            return send_from_directory(os.path.dirname(sp), os.path.basename(sp))
    g.db = db.connect()


@app.teardown_request
def _close_db(exc):
    conn = g.pop('db', None) if hasattr(g, 'db') else None
    if conn is not None:
        if exc is None:
            conn.commit()
        conn.close()


# ---------- 登录相关页面 ----------
@app.route('/Login/index.html')
@app.route('/Login/Index.html')
@app.route('/Login/Index1.html')
@app.route('/Login/Index2.html')
@app.route('/Login/Index3.html')
def login_page():
    # 登录页是本地重新设计的（不再用原站三套模板）；“系统登录界面风格”设置只切换左侧配色
    style = str(db.setting('system', {}).get('SystemLoginStyle') or '')
    bgs = {'1': 'linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)', '2': 'linear-gradient(135deg, #be123c 0%, #f97316 100%)', '3': 'linear-gradient(135deg, #111827 0%, #4f46e5 100%)'}
    ctx = base_ctx()
    ctx['login_bg'] = bgs.get(style, 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #db2777 100%)')
    return render_template('Login/index.html', **ctx)


@app.route('/Login/loginout')
def logout():
    session.clear()
    return redirect('/Login/index.html')


@app.route('/notfound.html')
def notfound():
    return render_template('notfound.html', **base_ctx())


@app.route('/PlatformRedirect', defaults={'rest': ''})
@app.route('/PlatformRedirect/<path:rest>')
def platform_redirect(rest=''):
    """原站有跳去外部平台（商家平台 / 用户中心 / 支付页）的入口，本地版统一在这里说明未接入，
    免得点一下跳到一个和本系统无关的站点（tools/patch_brand_text.py 会把那些域名指过来）。"""
    return render_template('Public/PlatformRedirect.html', **base_ctx())


@app.route('/media/<path:fn>')
def media(fn):
    return send_from_directory(os.path.join(BASE, 'static', 'media'), fn)


@app.route('/upload/<path:fn>')
def uploaded_file(fn):
    from api.misc import deliver_upload
    return deliver_upload(fn)


@app.route('/')
def index():
    if not current_user():
        return redirect('/Login/index.html')
    ctx = base_ctx()
    from pages import page_context
    ctx.update(page_context('index', ctx))
    return render_template('index.html', **ctx)


@app.route('/app')
@app.route('/app/')
def client_app():
    """客户端（手机 / 电脑自适应的单页应用），静态文件在 static/app/"""
    resp = send_from_directory(os.path.join(BASE, 'static', 'app'), 'index.html')
    resp.headers['Cache-Control'] = 'no-cache'
    return resp


# ---------- 接口 + 业务页面：/Controller/Action ----------
@app.route('/api/<ctrl>/<action>', methods=['GET', 'POST'])
@app.route('/api/<ctrl>/<action>/<arg>', methods=['GET', 'POST'])
def api3(ctrl, action, arg=None):
    from api import REG
    g.path_arg = arg
    full = f'/api/{ctrl}/{action}/{arg}'
    r = dispatch(full) if arg and full.lower() in REG else dispatch(f'/api/{ctrl}/{action}')
    if r is None:
        abort(404)
    return r


@app.route('/<ctrl>/<action>/<arg>', methods=['GET', 'POST'])
def api3b(ctrl, action, arg):
    from api import REG
    g.path_arg = arg
    full = f'/{ctrl}/{action}/{arg}'
    r = dispatch(full) if full.lower() in REG else dispatch(f'/{ctrl}/{action}')
    if r is None:
        abort(404)
    return r


@app.route('/<ctrl>/<action>', methods=['GET', 'POST'])
def page(ctrl, action):
    key = f'{ctrl}/{action}'.lower()
    if key.endswith('.html'):
        key = key[:-5]
    tpl = TEMPLATES.get(key)
    r = dispatch(f'/{ctrl}/{action}', is_page=tpl is not None)
    if r is not None:
        return r
    if not tpl:
        abort(404)
    if not current_user() and not key.startswith('login/') and key not in ('html/employeesettagreement',):
        return redirect('/Login/index.html')
    ctx = base_ctx()
    from pages import page_context
    ctx.update(page_context(key, ctx))
    # 菜单页按角色权限控制（弹窗子页不在菜单里，不拦截）
    from api.system import all_menu_keys
    if current_user() and key in all_menu_keys() and key not in ctx['perms']:
        return render_template('noauth.html', **ctx), 403
    return render_template(tpl, **ctx)


@app.errorhandler(404)
def _404(e):
    if request.path.lower().endswith('ajax') or 'ajax' in request.path.lower() or request.path.startswith('/api/'):
        return json_err('接口不存在: ' + request.path), 404
    return render_template('notfound.html', **base_ctx()), 404


@app.errorhandler(403)
def _403(e):
    """页面里越权（pages.py 的 abort(403)）以前会弹 Flask 自带的英文 403 页，
    这里统一换成中文的无权限页；接口仍然回 JSON。"""
    if request.path.startswith('/api/') or 'ajax' in request.path.lower():
        return json_err('没有权限访问该操作'), 403
    return render_template('noauth.html', **base_ctx()), 403


if __name__ == '__main__':
    db.init()
    port = int(os.environ.get('PORT', 8100))
    print(f'云序工作室管理系统 → http://127.0.0.1:{port}   账号 1234567890 / 密码 394607')
    dev = '--dev' in sys.argv or os.environ.get('DEBUG') == '1'
    app.run(host=os.environ.get('HOST', '127.0.0.1'), port=port, debug=dev, use_reloader=dev, threaded=True)
