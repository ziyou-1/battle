"""Same-origin request token for the legacy layui pages and client SPA."""
import hmac
import secrets

from flask import request, session


_PUBLIC_GET_PAGES = {
    '/public/writeorder', '/public/searchorder', '/public/news',
    '/public/buiderqrcode',
}


def csrf_token():
    token = session.get('_csrf_token')
    if not token:
        token = secrets.token_urlsafe(32)
        session['_csrf_token'] = token
    return token


def csrf_valid():
    expected = session.get('_csrf_token')
    actual = request.headers.get('X-CSRF-Token') or request.form.get('_csrf_token')
    return bool(expected and actual and hmac.compare_digest(expected, actual))


def csrf_required(path, method, debug=False):
    path = path.lower().rstrip('/')
    # 未登录的会话不做 token 校验：交给业务层回「请先登录」。
    # 否则登录态过期时前端拿到的是「请求验证失败」，而各页面的判断都是
    # msg == '请先登录'，于是既不提示重新登录也不跳转，只会一直转圈或报错。
    # 注意后台是 session['uid']、客户端会员是 session['cid']，两边都要看。
    if not (session.get('uid') or session.get('cid')):
        return False
    if debug and path in ('/api/devapi/jserror', '/api/devapi/jserrors'):
        return False
    if method in ('POST', 'PUT', 'PATCH', 'DELETE'):
        return True
    if method != 'GET' or path in _PUBLIC_GET_PAGES:
        return False
    # The original API accepts GET even for writes. Require a token on all
    # registered API GET requests so a cross-site link cannot invoke one.
    from api import REG
    return path in REG or path + '/' in REG


def inject_csrf_bootstrap(response):
    if response.status_code != 200 or response.mimetype != 'text/html' or response.direct_passthrough:
        return response
    html = response.get_data(as_text=True)
    idx = html.lower().find('</head>')
    if idx < 0:
        return response
    tag = ('<meta name="csrf-token" content="' + csrf_token() + '">'
           '<script src="/security/csrf.js?v=1"></script>')
    response.set_data(html[:idx] + tag + html[idx:])
    response.headers['Cache-Control'] = 'no-store'
    return response
