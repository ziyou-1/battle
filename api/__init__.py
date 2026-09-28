# -*- coding: utf-8 -*-
"""接口层：统一注册表 + 请求参数/响应格式辅助。

原站约定：
  layui 表格列表  → {"code":0,"msg":"","count":N,"data":[...]}
  普通操作/查询   → {"code":1(成功)/0(失败),"msg":"...","data":...}
"""
import functools, datetime, json
from flask import Blueprint, request, session, jsonify, g
import db

api_bp = Blueprint('api', __name__)
REG = {}          # 小写路径 -> handler
PUBLIC = set()    # 无需登录的接口


def route(path, public=False):
    """注册接口；ASP.NET 路由不区分大小写，这里统一小写匹配"""
    def deco(fn):
        for p in ([path] if isinstance(path, str) else path):
            REG[p.lower()] = fn
            if public:
                PUBLIC.add(p.lower())
        return fn
    return deco


# ---------- 参数 ----------
class Params:
    """合并 query/form/json 参数，键不区分大小写（模拟 MVC 模型绑定）"""
    def __init__(self):
        d = {}
        for src in (request.args, request.form):
            for k in src:
                vals = src.getlist(k)
                d[k.lower()] = vals if len(vals) > 1 else vals[0]
        if request.is_json:
            try:
                for k, v in (request.get_json(silent=True) or {}).items():
                    d[str(k).lower()] = v
            except Exception:
                pass
        self.d = d

    def get(self, key, default=''):
        v = self.d.get(key.lower(), default)
        if isinstance(v, list):
            v = v[0] if v else default
        return default if v is None else v

    def list(self, key):
        v = self.d.get(key.lower())
        if v is None or v == '':
            return []
        if isinstance(v, list):
            return v
        return [x for x in str(v).replace('，', ',').split(',') if x != '']

    def int(self, key, default=0):
        try:
            return int(float(self.get(key, default) or default))
        except (TypeError, ValueError):
            return default

    def float(self, key, default=0.0):
        try:
            return float(self.get(key, default) or default)
        except (TypeError, ValueError):
            return default

    def ids(self, key='ids'):
        out = []
        for x in self.list(key):
            try:
                out.append(int(float(x)))
            except ValueError:
                pass
        return out

    def __contains__(self, key):
        return key.lower() in self.d

    def all(self):
        return dict(self.d)


def P():
    if not hasattr(g, '_params'):
        g._params = Params()
    return g._params


# ---------- 响应 ----------
def json_ok(msg='操作成功', data=None, **extra):
    d = {'code': 1, 'msg': msg, 'data': data}
    d.update(extra)
    return jsonify(d)


def json_err(msg='操作失败', code=0, data=None, **extra):
    d = {'code': code, 'msg': msg, 'data': data}
    d.update(extra)
    return jsonify(d)


def table(rows, count=None, **extra):
    d = {'code': 0, 'msg': '', 'count': len(rows) if count is None else count, 'data': rows}
    d.update(extra)
    return jsonify(d)


def paged(rows, **extra):
    p = P()
    page, limit = p.int('page', 1), p.int('limit', 10)
    return table(db.paginate(rows, page, limit), len(rows), **extra)


# ---------- 会话 ----------
def current_user():
    uid = session.get('uid')
    if not uid:
        return None
    if getattr(g, '_user', None) and g._user.get('id') == uid:
        return g._user
    u = db.get('users', uid)
    if not u or u.get('sta') == 'N':
        return None
    g._user = u
    return u


def uid():
    u = current_user()
    return u['id'] if u else 0


def uname():
    u = current_user()
    return u['userName'] if u else ''


def is_super():
    u = current_user()
    return bool(u and (u.get('isSuper') or u.get('jobName') == '系统管理员'))


def log(logType, remark, orderId='', gameName='', roleName='', soureOrderId=''):
    db.insert('system_logs', dict(joinOrderId=orderId, logType=logType, soureOrderId=soureOrderId, gameRoleName=roleName,
                                  gameName=gameName, remark=remark, userName=uname(), userId=uid()))


def now():
    return db.now_str()


def S(key, default=''):
    """系统各项设置（/System/systemsetting 里的开关）"""
    v = db.setting('system', {}).get(key)
    return default if v in (None, '') else str(v)


def is_dashou():
    u = current_user()
    return bool(u) and not u.get('isSuper') and u.get('jobName') in ('打手', '代练员')


# ---------- 分发 ----------
def dispatch(path, is_page=None):
    """由 app.py 的兜底路由调用；返回 None 表示不是接口。is_page: 该路径是否存在页面模板"""
    key = path.lower().rstrip('/')
    fn = REG.get(key) or REG.get(key + '/')
    from .spec import TABLE_URLS, AJAX_METHODS
    if fn is None and is_page:
        return None
    is_api = fn is not None or key in TABLE_URLS or key in AJAX_METHODS or 'ajax' in key or key.startswith('/api/')
    if not is_api:
        return None
    if key not in PUBLIC and not current_user():
        return json_err('请先登录', code=0)
    if fn is None:
        return json_err('接口不存在: ' + path), 404
    if key.startswith('/smsajax/') or key in ('/systemajax/smssetting', '/systemajax/opensmssig', '/systemajax/qsendsms'):
        from .system import user_permissions
        if not user_permissions().intersection({'system/smssetting', 'sms/smslogslist', 'sms/smstemplatelist', 'sms/smsbulkhair'}):
            return json_err('无权使用短信业务'), 403
    if key.startswith(('/orderajax/', '/pvetaskajax/')) or key == '/empajax/getorderemplogs':
        from .order import guard_order_request
        denied = guard_order_request(key)
        if denied is not None:
            return denied
    if key.startswith('/gameaccountsajax/'):
        from .gameaccounts import guard_account_request
        denied = guard_account_request(key)
        if denied is not None:
            return denied
    from .guards import guard_module_request
    denied = guard_module_request(key)
    if denied is not None:
        return denied
    return fn()


# 注册各模块（import 即注册）
from . import login, home, system, game, user, order, emp, customer, pvetask, gameaccounts, sms, misc, extra, miniapp, pricecalc, clientorder, client, client_ext  # noqa: E402,F401
