# -*- coding: utf-8 -*-
"""登录 / 找回密码"""
import hashlib, secrets, datetime, os, smtplib, ssl
from email.message import EmailMessage
from flask import session, request
from werkzeug.security import check_password_hash, generate_password_hash
import db
from . import route, P, json_ok, json_err, current_user


def hash_pwd(pwd):
    return generate_password_hash(pwd)


def verify_pwd(user, pwd):
    h = user.get('pwdHash') or ''
    if h.startswith(('pbkdf2:', 'scrypt:')):
        return check_password_hash(h, pwd)
    return user.get('password') == pwd


def is_weak(pwd):
    return len(pwd) < 6 or pwd in ('123456', '111111', '000000', '123123', '888888')


@route('/Login/GetCompany', public=True)
def get_company():
    return json_ok(db.system_info().get('company', ''))


@route('/Login/LoginSecurityVerification', public=True)
def login_sec_verify():
    # 原站：账号开启了登录短信验证时返回 code>0 显示验证码框；本地版不启用
    return json_err('', code=0)


@route('/Login/LoginGetSmsCode', public=True)
def login_sms():
    return json_err('本地版未开启短信验证')


def _login_throttled(account, ip):
    cutoff = (datetime.datetime.now() - datetime.timedelta(minutes=15)).strftime('%Y-%m-%d %H:%M:%S')
    failures = db.find('checkin_logs', lambda row: row.get('checkType') == '登录失败' and
                       (row.get('createTime') or '') >= cutoff and
                       (row.get('loginAcc') == account or row.get('ip') == ip))
    return (sum(row.get('loginAcc') == account for row in failures) >= 5 or
            sum(row.get('ip') == ip for row in failures) >= 20)


@route('/Login/Login', public=True)
def login():
    p = P()
    acc, pwd = p.get('acc').strip(), p.get('pwd')
    if not acc or not pwd:
        return json_err('请输入登录账号和密码')
    if _login_throttled(acc, request.remote_addr):
        return json_err('登录尝试过多，请 15 分钟后重试')
    u = db.first('users', lambda r: r.get('loginAcc') == acc)
    if not u or not verify_pwd(u, pwd):
        db.insert('checkin_logs', dict(userId=u['id'] if u else 0, loginAcc=acc, userName=u['userName'] if u else '',
                                       roleName=u.get('jobName') if u else '', ip=request.remote_addr, computer=p.get('deviceInfo')[:120],
                                       checkType='登录失败', remark='账号或密码错误'))
        return json_err('账号或密码错误')
    if u.get('sta') == 'N':
        return json_err('该账号已被禁用，请联系管理员')
    from .user import check_login_restrict
    deny = check_login_restrict(u, request.remote_addr)
    if deny:
        db.insert('checkin_logs', dict(userId=u['id'], loginAcc=acc, userName=u['userName'], roleName=u.get('jobName', ''), ip=request.remote_addr, computer=p.get('deviceInfo')[:120],
                                       checkType='登录被拒', remark=deny))
        return json_err(deny)
    csrf = session.get('_csrf_token')
    session.clear()
    if csrf:
        session['_csrf_token'] = csrf
    session['uid'] = u['id']
    session.permanent = p.get('isRemember') in ('1', 'true', 'True')
    db.update('users', u['id'], dict(prevLoginTime=u.get('lastLoginTime') or '', prevLoginIp=u.get('lastLoginIp') or '', prevLoginCity=u.get('lastLoginCity') or '',
                                     lastLoginTime=db.now_str(), lastLoginIp=request.remote_addr, lastLoginCity='本地网络'))
    db.insert('checkin_logs', dict(userId=u['id'], loginAcc=acc, userName=u['userName'], roleName=u.get('jobName', ''),
                                   ip=request.remote_addr, computer=p.get('deviceInfo')[:120], checkType='登录', remark=''))
    return json_ok('登录成功', data='Y' if is_weak(pwd) else 'N')


def _send_recovery_email(address, code):
    host = os.environ.get('SQ_SMTP_HOST')
    sender = os.environ.get('SQ_SMTP_FROM')
    port = int(os.environ.get('SQ_SMTP_PORT', '465'))
    message = EmailMessage()
    message['From'] = sender
    message['To'] = address
    message['Subject'] = (db.system_info().get('company') or '云序工作室') + '登录密码找回验证码'
    message.set_content('您的验证码是 %s，10 分钟内有效。如果不是您本人操作，请忽略此邮件。' % code)
    context = ssl.create_default_context()
    connection = smtplib.SMTP_SSL(host, port, timeout=10, context=context) if port == 465 else smtplib.SMTP(host, port, timeout=10)
    with connection as smtp:
        if port != 465:
            smtp.starttls(context=context)
        if os.environ.get('SQ_SMTP_USER'):
            smtp.login(os.environ['SQ_SMTP_USER'], os.environ.get('SQ_SMTP_PASSWORD', ''))
        smtp.send_message(message)


@route('/Login/SendEmailCode', public=True)
def send_email_code():
    if not os.environ.get('SQ_SMTP_HOST') or not os.environ.get('SQ_SMTP_FROM'):
        return json_err('邮箱找回尚未配置，请联系管理员')
    p = P()
    u = db.first('users', lambda r: r.get('loginAcc') == p.get('account').strip())
    if not u or not u.get('email') or u['email'].lower() != p.get('email').strip().lower():
        return json_err('账号或绑定邮箱不匹配')
    rate_key = 'forget-rate:%s' % u['id']
    last = db.setting(rate_key, '')
    if last:
        try:
            if (datetime.datetime.now() - datetime.datetime.fromisoformat(last)).total_seconds() < 60:
                return json_err('发送过于频繁，请稍后重试')
        except ValueError:
            pass
    uuid_ = secrets.token_hex(8)
    code = ''.join(secrets.choice('0123456789') for _ in range(6))
    try:
        _send_recovery_email(u['email'], code)
    except (OSError, ValueError, smtplib.SMTPException):
        return json_err('邮件发送失败，请联系管理员')
    db.set_setting('forget:' + uuid_, {'uid': u['id'], 'code': code, 'exp': (datetime.datetime.now() + datetime.timedelta(minutes=10)).isoformat(), 'ok': False, 'attempts': 0})
    db.set_setting(rate_key, datetime.datetime.now().isoformat())
    return json_ok('验证码已发送到绑定邮箱', data=uuid_)


@route('/Login/VerifyForgetCode', public=True)
def verify_forget_code():
    p = P()
    rec = db.setting('forget:' + p.get('uuid'))
    if not rec or rec.get('attempts', 0) >= 5:
        return json_err('验证码错误或已失效')
    if datetime.datetime.fromisoformat(rec['exp']) < datetime.datetime.now():
        return json_err('验证码已过期')
    if not secrets.compare_digest(rec['code'], p.get('code').strip()):
        rec['attempts'] = rec.get('attempts', 0) + 1
        db.set_setting('forget:' + p.get('uuid'), rec)
        return json_err('验证码错误或已失效')
    rec['ok'] = True
    db.set_setting('forget:' + p.get('uuid'), rec)
    return json_ok('验证成功')


@route('/Login/ForgetPassword', public=True)
def forget_password():
    p = P()
    rec = db.setting('forget:' + p.get('uuid'))
    if not rec or not rec.get('ok') or datetime.datetime.fromisoformat(rec['exp']) < datetime.datetime.now():
        return json_err('请先完成邮箱验证')
    password = p.get('password')
    if len(password) < 8:
        return json_err('新密码至少需要 8 位')
    db.update('users', rec['uid'], dict(pwdHash=hash_pwd(password), password=None))
    db.set_setting('forget:' + p.get('uuid'), {})
    return json_ok('密码重置成功')
