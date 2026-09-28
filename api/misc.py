# -*- coding: utf-8 -*-
"""杂项：避坑板、系统圈子、图片上传、二维码、系统设置页各接口、系统操作接口别名等"""
import os, json, uuid, base64, io, hashlib, datetime
from flask import jsonify, request, send_from_directory, Response, abort, session
from PIL import Image, UnidentifiedImageError
import db
from . import route, P, json_ok, json_err, table, paged, current_user, uid, uname, is_super, log, now
from .system import generic_list, generic_save, generic_del

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(BASE, 'data', 'uploads')
LEGACY_UPLOAD_DIR = os.path.join(BASE, 'static', 'upload')
IMAGE_TYPES = {'PNG': '.png', 'JPEG': '.jpg', 'GIF': '.gif', 'WEBP': '.webp', 'BMP': '.bmp'}
DOCUMENT_TYPES = {'.txt', '.csv', '.xlsx', '.xls', '.pdf'}
MAX_FILE_BYTES = 10 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 20_000_000


# ---------------- 上传 ----------------
def _save_file(f, private=False):
    raw = f.read(MAX_FILE_BYTES + 1)
    if not raw or len(raw) > MAX_FILE_BYTES:
        raise ValueError('文件不能为空且不能超过 10 MB')
    ext = os.path.splitext(f.filename or '')[1].lower()
    if ext in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'):
        try:
            image = Image.open(io.BytesIO(raw))
            if image.format not in IMAGE_TYPES or image.width * image.height > Image.MAX_IMAGE_PIXELS:
                raise ValueError('图片格式或尺寸不符合要求')
            actual_ext = IMAGE_TYPES[image.format]
            image.verify()
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
            raise ValueError('图片文件无效')
        if ext == '.jpeg':
            ext = '.jpg'
        if ext != actual_ext:
            raise ValueError('图片扩展名与内容不一致')
    elif ext in DOCUMENT_TYPES:
        private = True
        valid = (ext in ('.txt', '.csv') and b'\x00' not in raw and _is_utf8(raw)) or \
                (ext == '.pdf' and raw.startswith(b'%PDF-')) or \
                (ext == '.xlsx' and raw.startswith(b'PK\x03\x04')) or \
                (ext == '.xls' and raw.startswith(b'\xd0\xcf\x11\xe0'))
        if not valid:
            raise ValueError('文件扩展名与内容不一致')
    else:
        raise ValueError('不支持此文件类型')
    scope = 'private' if private else 'public'
    folder = os.path.join(UPLOAD_DIR, scope)
    os.makedirs(folder, exist_ok=True)
    name = datetime.datetime.now().strftime('%Y%m%d') + '_' + uuid.uuid4().hex + ext
    with open(os.path.join(folder, name), 'xb') as out:
        out.write(raw)
    return '/upload/' + scope + '/' + name


def _is_utf8(raw):
    try:
        raw.decode('utf-8')
        return True
    except UnicodeDecodeError:
        return False


def _legacy_public(url):
    # Older uploads are public only when referenced by client-facing content.
    for coll in ('mp_news', 'mp_shop_items', 'mp_awards', 'mp_integral', 'games', 'projects', 'users'):
        if any(url in json.dumps(row, ensure_ascii=False) for row in db.all_(coll)):
            return True
    return url in json.dumps(db.setting('clientSetting', {}), ensure_ascii=False)


def _customer_owns_upload(url):
    cid = session.get('cid')
    return bool(cid and any(o.get('customerId') == cid and url in (o.get('imgs') or []) for o in db.all_('orders')))


def deliver_upload(fn):
    parts = fn.split('/')
    if len(parts) == 2 and parts[0] in ('public', 'private'):
        scope, name = parts
        folder = os.path.join(UPLOAD_DIR, scope)
        public = scope == 'public'
    elif len(parts) == 1:
        name = parts[0]
        folder = LEGACY_UPLOAD_DIR
        public = _legacy_public('/upload/' + name)
    else:
        abort(404)
    if not name or name != os.path.basename(name):
        abort(404)
    if not public and not current_user() and not _customer_owns_upload('/upload/' + fn):
        abort(403)
    response = send_from_directory(folder, name, as_attachment=os.path.splitext(name)[1].lower() not in ('.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp'))
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Cache-Control'] = 'public, max-age=3600' if public else 'private, no-store'
    return response


@route(['/CommonPermissionAjax/UploadSingleImg', '/CommonPermissionAjax/UploadImg', '/OrderAjax/UploadOrderImg', '/UserAjax/UploadPhoto', '/CommonPermissionAjax/UploadFile'])
def upload_single():
    f = request.files.get('file') or (list(request.files.values())[0] if request.files else None)
    if not f:
        return json_err('没有文件')
    try:
        url = _save_file(f, private=request.path.lower().startswith('/orderajax/'))
    except ValueError as exc:
        return json_err(str(exc))
    return jsonify(dict(code=1, msg='上传成功', data=dict(src=url, url=url, title=f.filename), src=url, url=url))


@route('/CommonPermissionAjax/DelSingleImg')
def del_single_img():
    p = P()
    url = p.get('url') or p.get('src') or p.get('img') or p.get('imgpath')
    if url.startswith('/upload/'):
        parts = url.split('/')
        fp = os.path.join(UPLOAD_DIR, parts[2], os.path.basename(url)) if len(parts) == 4 and parts[2] in ('public', 'private') else os.path.join(LEGACY_UPLOAD_DIR, os.path.basename(url))
        if os.path.exists(fp):
            os.remove(fp)
    return json_ok('删除成功')


@route('/CommonPermissionAjax/GetAliOssPolicy')
def oss_policy():
    """原站这里返回阿里云 OSS 的直传签名；本版没有 OSS 凭证，改成「本地直传」：
    aliossUploader 约定 codeStatus=0，所以成功必须返回 code=0，且 data 里带 local 标记，
    组件拿到 local 后会把文件 POST 给 /CommonPermissionAjax/UploadSingleImg。"""
    return jsonify(dict(code=0, success=True, msg='', data=dict(
        local=True, host='/CommonPermissionAjax/UploadSingleImg',
        accessid='local', policy='local', signature='local',
        dir='', bk=request.args.get('bk') or '')))


@route('/UserAjax/GetDyplsOSSInfoForUploadFile')
def dypls_oss_info():
    return json_err('本地版未接入阿里云 OSS，请使用本地上传')


@route('/GameAccountsAjax/ImputGameAccByExecl')
def import_acc_excel():
    from .game import resolve_game
    f = request.files.get('file') or (list(request.files.values())[0] if request.files else None)
    if not f:
        return json_err('没有文件')
    try:
        import openpyxl
    except ImportError:
        return json_err('服务器未安装 openpyxl，无法解析 Excel；可在“导入内部游戏号”里用文本粘贴导入')
    wb = openpyxl.load_workbook(io.BytesIO(f.read()), read_only=True)
    ws = wb.active
    gm = resolve_game(P().get('gameName') or P().get('gameId'))
    n = 0
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0 or not row or not row[0]:
            continue
        db.insert('game_accounts', dict(gameName=gm['gameName'] if gm else str(row[0]), gameId=gm['id'] if gm else 0, gameAcc=str(row[1] if len(row) > 1 else row[0]),
                                        gamePwd=str(row[2]) if len(row) > 2 and row[2] else '', gameRoleName=str(row[3]) if len(row) > 3 and row[3] else '', gameArea='', gameServer='',
                                        gameJob='', gameGroup='', gameInfo='', gameTF='', costPrice=0, sellPrice=0, accStatus=10, accUseType='A', Tips='', remark='Excel导入', sellTradeNo='',
                                        profit=0, recUserName='', recUserId=0, img='', jiwei='', proStatus=10, otherLevel='', otherMark='', zgameAcc='', moblie='', tempDisableTime=''))
        n += 1
    return json_ok('成功导入 %d 个账号' % n)


# ---------------- 订单图片 ----------------
@route(['/OrderAjax/GetOrderImgList', '/OrderAjax/GetOrderPicList', '/GameAccountsAjax/GetGameAccImgList'])
def order_img_list():
    from .order import find_order
    o = find_order(P().get('orderId') or P().get('gameAccId') or P().get('ids'))
    imgs = (o.get('imgs') or []) if o else []
    return jsonify(dict(code=0, msg='', count=len(imgs), data=[dict(id=i + 1, url=u, src=u, createTime='') for i, u in enumerate(imgs)]))


@route(['/OrderAjax/UploadOrderPic', '/OrderAjax/SaveOrderImg', '/OrderAjax/UploadPic'])
def upload_order_pic():
    from .order import find_order, add_log
    o = find_order(P().get('orderId'))
    if not o:
        return json_err('订单不存在')
    urls = []
    try:
        for f in request.files.values():
            urls.append(_save_file(f, private=True))
    except ValueError as exc:
        return json_err(str(exc))
    imgs = list(o.get('imgs') or []) + urls
    db.update('orders', o['id'], dict(imgs=imgs))
    add_log(o, '上传了 %d 张订单截图' % len(urls), '截图')
    return jsonify(dict(code=1, msg='上传成功', data=dict(src=urls[0] if urls else '', urls=urls), src=urls[0] if urls else ''))


@route(['/OrderAjax/DelOrderImg', '/OrderAjax/DelOrderPic'])
def del_order_pic():
    from .order import find_order
    p = P()
    o = find_order(p.get('orderId'))
    if not o:
        return json_err('订单不存在')
    url = p.get('url') or p.get('src')
    imgs = [u for u in (o.get('imgs') or []) if u != url]
    db.update('orders', o['id'], dict(imgs=imgs))
    return json_ok('删除成功')


# ---------------- 避坑板（黑名单查询）----------------
@route('/home/BlackListGetList')
def blacklist_get():
    kw = (P().get('key') or '').strip()
    if not kw:
        return json_err('请输入要查询的关键字')
    rows = [r for r in db.all_('blacklist_board') if db.like(r, ['phone', 'qq', 'wx', 'content', 'jdpName', 'bussineName'], kw)]
    rows += [dict(bid='C%d' % r['id'], phone=r.get('moblie'), qq=r.get('qq'), wx=r.get('ww'), content=r.get('remark'), fee=0, roleType='客户', jdpName=db.system_info()['company'],
                  bussineName=db.system_info()['company'], createTime=r.get('lastTime') or r.get('createTime'), actionTime='', imgList='') for r in db.all_('customer_backlist') if db.like(r, ['moblie', 'qq', 'ww', 'remark'], kw)]
    rows += [dict(bid='U%d' % r['id'], phone=r.get('moblie'), qq=r.get('qq'), wx=r.get('ww'), content=r.get('remark'), fee=0, roleType='打手', jdpName=db.system_info()['company'],
                  bussineName=db.system_info()['company'], createTime=r.get('lastTime') or r.get('createTime'), actionTime='', imgList='') for r in db.all_('user_backlist') if db.like(r, ['moblie', 'qq', 'ww', 'rname', 'remark'], kw)]
    if not rows:
        return json_err('没有查询到相关黑名单记录')
    return jsonify(dict(code=1, msg='', data=json.dumps(rows, ensure_ascii=False)))


@route('/home/GetBlackListMangeByMy')
def blacklist_mine():
    rows = [dict(r, bid=r['id'], imgList=r.get('imgList') or '') for r in db.find('blacklist_board', lambda r: r.get('userId') == uid())]
    return jsonify(dict(code=1 if rows else 0, msg='' if rows else '你还没有发布过记录', data=json.dumps(rows, ensure_ascii=False)))


# 注意：/home/addblacklistplan 是页面（templates/home/addblacklistplan.html）。
# 这里不能注册同名接口 —— app.page 会优先命中接口，导致「我也要举报」打开的是
# 一段 JSON 而不是举报表单。前端真正提交的地址是 /home/AddBlackListData。
@route('/home/AddBlackListData')
def add_blacklist_data():
    """「我也要举报」提交：写入避坑板，等管理员审核"""
    f = P().all()
    # 全空提交会插一条没人看得懂的空白记录（历史上就是这样攒出 37 条空壳），先挡掉
    if not any((f.get('phone'), f.get('qq'), f.get('wx') or f.get('wechat'),
                f.get('content') or f.get('explanation') or f.get('reason'),
                f.get('bussinename') or f.get('jdpname'))):
        return json_err('请至少填写举报对象、联系方式或举报内容')
    d = dict(phone=f.get('phone', ''), qq=f.get('qq', ''), wx=f.get('wx') or f.get('wechat', ''),
             content=f.get('content') or f.get('explanation', '') or f.get('reason', ''),
             fee=float(f.get('fee') or 0), roleType=f.get('roletype') or '打手',
             jdpName=f.get('jdpname') or db.system_info()['company'],
             bussineName=f.get('bussinename') or db.system_info()['company'],
             imgList=f.get('imglist') or f.get('imagelist') or '', actionTime=f.get('actiontime', ''),
             userId=uid(), userName=uname(), createTime=now())
    db.insert('blacklist_board', d)
    log('避坑板', '发布举报记录')
    return json_ok('举报已提交，等待审核')


@route('/home/RevokeBlackListData')
def revoke_blacklist():
    r = db.get('blacklist_board', P().get('logId'))
    if r and r.get('userId') == uid():
        db.delete('blacklist_board', r['id'])
    return json_ok('已撤销')


@route('/Home/BlacklistAppeal')
def blacklist_appeal():
    try:
        m = json.loads(request.get_data(as_text=True) or '{}')
    except ValueError:
        m = P().all()
    db.insert('blacklist_appeals', dict(m, userId=uid()))
    return json_ok('申诉已提交（本地版仅记录）')


# ---------------- 系统圈子 ----------------
@route('/Home/SystemCircleGetList')
def circle_list():
    p = P()
    g = p.get('gameName')
    rows = db.find('circle', lambda r: not g or g == '全部游戏' or r.get('gameName') == g, 'createTime')
    # 原站这个接口把列表再序列化成字符串返回，前端 systemcircle.js 会 JSON.parse(data.data)；
    # 直接返回对象会让前端抛 SyntaxError，页面停在「一直转圈」。
    payload = dict(topList=[r for r in rows if r.get('top')], normalList=[r for r in rows if not r.get('top')])
    return jsonify(dict(code=1, msg='', data=json.dumps(payload, ensure_ascii=False)))


@route('/Home/SystemCircleRelease')
def circle_release():
    p = P()
    if not p.get('content').strip():
        return json_err('内容不能为空')
    db.insert('circle', dict(gameName=p.get('gameName') or '全部游戏', content=p.get('content'), wechat=p.get('wechat') or p.get('concantwechat'), qq=p.get('qq') or p.get('concantqq'),
                             releaseSystemName=db.system_info()['company'], begissuance=p.get('begissuance') or '', userId=uid(), top=False))
    return json_ok('发布成功（本地版仅本系统可见）')


@route('/Home/SystemCircleGetMyReleseaList')
def circle_mine():
    rows = db.find('circle', lambda r: r.get('userId') == uid(), 'createTime')
    return json_ok('', data=rows)


@route('/Home/SystemCircleRePushItem')
def circle_repush():
    r = db.get('circle', P().get('id'))
    if r:
        db.update('circle', r['id'], dict(createTime=now()))
    return json_ok('已刷新')


@route('/Home/SystemCircleDelItem')
def circle_del():
    r = db.get('circle', P().get('id'))
    if r and r.get('userId') == uid():
        db.delete('circle', r['id'])
    return json_ok('删除成功')


# ---------------- 二维码 ----------------
@route('/Public/BuiderQRcode', public=True)
def build_qrcode():
    content = P().get('content') or ''
    try:
        import qrcode
        img = qrcode.make(content)
        buf = io.BytesIO(); img.save(buf, format='PNG')
        return Response(buf.getvalue(), mimetype='image/png')
    except ImportError:
        svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#fff"/>'
               '<text x="120" y="110" font-size="12" text-anchor="middle" fill="#333">未安装 qrcode 库</text>'
               '<text x="120" y="135" font-size="10" text-anchor="middle" fill="#666">pip install qrcode[pil]</text></svg>')
        return Response(svg, mimetype='image/svg+xml')


# ---------------- 系统设置页 / 来源 / 标签 / 公告 的原站接口名 ----------------
@route('/SystemAjax/AddEdiSoure')
def add_edi_soure():
    from .system import add_edit_source
    return add_edit_source()


@route('/SystemAjax/DelSoure')
def del_soure():
    from .system import del_source
    return del_source()


@route('/SystemAjax/ChangeSoureDoNotSendSms')
def soure_sms_switch():
    r = db.get('sources', P().int('id'))
    if not r:
        return json_err('来源不存在')
    db.update('sources', r['id'], dict(doNotSendSms='N' if r.get('doNotSendSms') == 'Y' else 'Y'))
    return json_ok('已切换')


@route('/SystemAjax/ModifySoureSmsSign')
def soure_sms_sign():
    p = P()
    r = db.get('sources', p.int('id'))
    if not r:
        return json_err('来源不存在')
    db.update('sources', r['id'], dict(smsSign=p.get('smsSign')))
    return json_ok('保存成功')


@route('/SystemAjax/AddModityOrderLabel')
def add_modify_label():
    p = P()
    d = dict(labelName=p.get('labelName').strip(), gameName=p.get('gameName') or '全部游戏', remark=p.get('remark'), keywords=p.get('keywords'), colorValue=p.get('colorValue') or '#1E9FFF', orderBy=p.int('orderBy'))
    if not d['labelName']:
        return json_err('标签名称不能为空')
    lid = p.int('id')
    if lid and db.get('labels', lid):
        db.update('labels', lid, d)
        return json_ok('修改成功')
    db.insert('labels', dict(d, labelStatus='Y'))
    return json_ok('新增成功')


@route('/SystemAjax/ModityOrderLabelStatus')
def modify_label_status():
    r = db.get('labels', P().int('id'))
    if not r:
        return json_err('标签不存在')
    db.update('labels', r['id'], dict(labelStatus='N' if r.get('labelStatus') == 'Y' else 'Y'))
    return json_ok('已切换')


@route('/SystemAjax/SaveSystemNotice')
def save_notice():
    p = P()
    content = p.get('content')
    title = p.get('title') or (content.replace('<', ' <')[:40] if content else '')
    import re
    title = re.sub(r'<[^>]+>', '', title).strip()[:40] or '系统公告'
    nid = p.int('id')
    if nid and db.get('notices', nid):
        db.update('notices', nid, dict(title=title, content=content, userName=uname()))
        return json_ok('修改成功')
    db.insert('notices', dict(title=title, content=content, userName=uname(), popup='Y'))
    for u in db.all_('users'):
        db.insert('messages', dict(userId=u['id'], msgType=0, title='系统公告：' + title, content=re.sub(r'<[^>]+>', '', content or ''), sendUserName=uname(), isRead='N', orderId=''))
    return json_ok('发布成功')


@route('/SystemAjax/SystemOrderSetting')
def system_order_setting():
    p = P()
    try:
        f = json.loads(p.get('param') or '{}')
    except ValueError:
        f = p.all()
    cur = db.setting('system', {})
    cur.update({k: v for k, v in f.items() if k not in ('pwd', 'jdpAcc', 'extorigpwd', 'extnewpwd', 'extnewpwd2', 'qtitle', 'content', 'company', 'jid', 'loginAcc', 'sta')})
    db.set_setting('system', cur)
    log('设置', '修改系统各项设置')
    return json_ok('保存成功')


@route('/SystemAjax/SaveOrderExportPwd')
def save_export_pwd():
    p = P()
    cur = db.setting('system', {})
    if cur.get('exportPwd') and cur['exportPwd'] != p.get('orginpwd'):
        return json_err('原导出密码不正确')
    cur['exportPwd'] = p.get('newpwd')
    db.set_setting('system', cur)
    return json_ok('导出密码已保存')


@route('/SystemAjax/SendCode')
def send_export_code():
    """订单导出密码的邮箱验证码。本地版没有邮件通道：直接放行，
    让「清空导出密码」这一步能走通，而不是卡在 404。"""
    return json_ok('本地版未接入邮件通道：跳过验证码，直接点「确定」即可清空导出密码')


@route(['/SystemAjax/ClearPassword', '/SystemAjax/BindEmailAndClearPwd'])
def clear_export_pwd():
    p = P()
    cur = db.setting('system', {})
    cur['exportPwd'] = ''
    db.set_setting('system', cur)
    if p.get('email'):
        db.update('users', uid(), dict(email=p.get('email')))
    log('系统设置', '清空订单导出密码')
    return json_ok('导出密码已清空')


@route(['/SystemAjax/VeryJdpAcc', '/SystemAjax/ClearSystemJdpBind'])
def jdp_bind():
    return json_err('本地版不支持绑定平台账号')


@route('/SystemAjax/SavePublicSeachOrderQuestion')
def save_search_question():
    p = P()
    d = dict(SeachQuestion_Title=p.get('title'), content=p.get('content'), Hot=0, Status='Y', createTimeStr=now())
    qid = p.int('qid')
    if qid and db.get('search_questions', qid):
        db.update('search_questions', qid, dict(SeachQuestion_Title=p.get('title'), content=p.get('content')))
        return json_ok('修改成功')
    db.insert('search_questions', d)
    return json_ok('新增成功')


@route('/SystemAjax/ChangePublicSeachOrderQuestionHot')
def question_hot():
    p = P()
    db.update('search_questions', p.int('qid'), dict(Hot=p.int('value')))
    return json_ok('修改成功')


@route('/SystemAjax/ChangePublicSeachOrderQuestionSta')
def question_sta():
    r = db.get('search_questions', P().int('qid'))
    if r:
        db.update('search_questions', r['id'], dict(Status='N' if r.get('Status') == 'Y' else 'Y'))
    return json_ok('已切换')


@route('/SystemAjax/DelPublicSeachOrderQuestion')
def question_del():
    db.delete('search_questions', P().int('qid'))
    return json_ok('删除成功')


@route(['/UserAjax/GetMyExportOrderColCache'])
def export_col_cache():
    u = current_user()
    return json_ok('', data=u.get('exportCols') or '')


@route(['/UserAjax/SaveMyExportOrderColCache'])
def save_export_col_cache():
    db.update('users', uid(), dict(exportCols=P().get('cols') or P().get('value')))
    return json_ok('ok')


@route(['/EmpAjax/GetEmpQrCode'])
def emp_qrcode():
    return json_err('本地版未接入在线收款码')


@route('/EmpAjax/UpEmpSta')
def up_emp_sta():
    from .emp import settlement
    p = P()
    if (p.get('sta') or '') in ('Y', '已结账', '1'):
        return settlement()
    from . import S
    if S('SK108', 'Y') != 'Y':
        return json_err('系统设置：已结算的账单不允许改成未结算')
    for x in p.ids('empId'):
        r = db.get('emp_pay', x)
        if r:
            db.update('emp_pay', x, dict(settingSta='N', settingTime=''))
            o = db.get('orders', r.get('orderId'))
            if o:
                db.update('orders', o['id'], dict(isSettStatus='未结算'))
    return json_ok('已标记为未结账')


@route('/EmpAjax/SaveQAContent')
def save_qa_content():
    p = P()
    try:
        f = json.loads(p.get('paramsStr') or '{}')
    except ValueError:
        f = {}
    d = dict(question=f.get('title') or f.get('question') or '', answer=p.get('content') or f.get('content') or '', typeName=f.get('typeName') or f.get('type') or '', userName=uname())
    if not d['question']:
        return json_err('问题标题不能为空')
    qid = int(f.get('id') or 0)
    if qid and db.get('qa', qid):
        db.update('qa', qid, d)
        return json_ok('修改成功')
    db.insert('qa', dict(d, hot=0))
    return json_ok('保存成功')


@route('/EmpAjax/GetQATypeList')
def qa_type_list():
    return json_ok('', data=[dict(id=r['id'], name=r.get('name'), value=r['id']) for r in db.all_('qa_types')])


@route('/OrderAjax/GetOrderAssignationLogs')
def order_ass_logs_alias():
    from .order import order_ass_logs
    return order_ass_logs()


@route(['/jdpshop/GetShopIndex', '/jdpshop/GetShopTypeList', '/jdpshop/GetShopItemList'])
def shop_stub():
    return table([])


JS_ERRORS = []


@route('/api/DevApi/JsError', public=True)
def js_error():
    try:
        d = json.loads(request.get_data(as_text=True) or '{}')
    except ValueError:
        d = {}
    d['time'] = now()
    JS_ERRORS.append(d)
    del JS_ERRORS[:-200]
    print('[JS错误] %s  %s  (%s)' % (d.get('page'), d.get('msg'), d.get('src')))
    return json_ok('ok')


@route('/api/DevApi/JsErrors', public=True)
def js_errors():
    return json_ok('', data=JS_ERRORS)


@route('/api/DevApi/LoginAs', public=True)
def dev_login_as():
    """仅开发模式（python app.py --dev）：免密切换到指定账号，方便在浏览器里逐页核对各角色界面"""
    from flask import current_app, session, redirect
    if not current_app.debug:
        return json_err('仅开发模式可用')
    acc = P().get('acc') or '1234567890'
    u = db.first('users', lambda r: r.get('loginAcc') == acc)
    if not u:
        return json_err('账号不存在')
    session.clear()
    session['uid'] = u['id']
    return redirect(P().get('to') or '/')


@route('/api/DevApi/LoginAsCustomer', public=True)
def dev_login_as_customer():
    """仅开发模式：免密以某个会员身份打开客户端（/app），方便核对客户端界面"""
    from flask import current_app, session, redirect
    if not current_app.debug:
        return json_err('仅开发模式可用')
    key = P().get('phone') or P().get('no')
    cu = db.first('customers', lambda r: r.get('phone') == key or r.get('customerNo') == key) if key else (db.all_('customers') or [None])[0]
    if not cu:
        return json_err('会员不存在')
    session['cid'] = cu['id']
    return redirect('/app/')
