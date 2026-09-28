# -*- coding: utf-8 -*-
"""诊断探针 —— 复现上报的后台症状（HTTP 层）。

只读；唯一的写操作是上传探针（往 data/uploads 存一张 1x1 的 PNG）。

用法:
    python tools/diag_17.py            # 全跑
    python tools/diag_17.py 1 10 14    # 只跑指定编号

标记: [RED] 症状复现（要修）  [STUB] 接口在但是桩  [GREEN] 正常
"""
import base64, io, json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod, db

db.init()
NOTFOUND = '页面，我找不到你'
c = appmod.app.test_client()
_r = c.get('/Login/index.html')
_m = re.search(r'name="csrf-token" content="([^"]+)"', _r.get_data(as_text=True))
H = {'X-CSRF-Token': _m.group(1)} if _m else {}
resp = c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='',
                                        deviceInfo='probe', isRemember=0), headers=H)
try:
    LOGIN = resp.get_json().get('code')
except Exception:
    LOGIN = None
print('login: HTTP %s code=%s csrf=%s' % (resp.status_code, LOGIN, bool(H)))

_o = (db.all_('orders') or [{}])[0]
OID = _o.get('orderId')
PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')

SYMPTOMS = [
    (1, '内部沟通 iframe 页', '/user/imauth', 'page'),
    (1, '内部沟通：建群', '/OrderAjax/CreateTempGroup', 'json', 'POST', {'orderId': OID}),
    (2, '一键发到交易平台', '/OrderAjax/PushTransctionToPlatform', 'json'),
    (2, '交易平台余额', '/OrderAjax/GetTradingPlatformBalance', 'json'),
    (2, '发单页', '/Order/PushJdp?orderId=%s' % OID, 'page'),
    (3, '提交举报(空参数应被拒)', '/home/AddBlackListData', 'reject'),
    (3, '举报页', '/home/addblacklistplan', 'page'),
    (5, '申诉提交接口', '/Home/BlacklistAppeal', 'json', 'POST', {}),
    (5, '举报列表页', '/home/blacklistplan', 'page'),
    (6, '系统圈子列表', '/Home/SystemCircleGetList', 'json'),
    (6, '圈子返回类型(前端 JSON.parse)', '/Home/SystemCircleGetList', 'strdata'),
    (8, '上传头像', '/UserAjax/UploadMyPic', 'upload'),
    (9, '保存我的资料', '/UserAjax/saveMyInfo', 'json'),
    (9, '改资料能否落库', '/UserAjax/saveMyInfo', 'savecheck'),
    (9, '发送验证码', '/SystemAjax/SendCode', 'json'),
    (9, '清空密码', '/SystemAjax/ClearPassword', 'json'),
    (9, '绑定邮箱并改密', '/SystemAjax/BindEmailAndClearPwd', 'json'),
    (10, '右上角·关于视图', '/layuiadmin/tpl/system/about.html', 'page'),
    (10, '右上角·更多视图', '/layuiadmin/tpl/system/more.html', 'page'),
    (10, '报错兜底视图 404', '/layuiadmin/tpl/template/tips/404.html', 'page'),
    (11, '结算导出', '/Emp/ExportEmp?page=1&limit=5', 'file'),
    (11, '订单导出', '/Order/ExportOrder?orderId=%s' % OID, 'page'),
    (13, '新开账号页', '/User/adduser', 'page'),
    (14, '排行榜数据', '/EmpAjax/GetRecOrderRankList', 'json'),
    (14, '排行榜有内容', '/EmpAjax/GetRecOrderRankList', 'nonempty'),
    (14, '排行榜(页面默认参数)', '/EmpAjax/GetRecOrderRankList', 'rank'),
    (15, '文章列表(封面字段)', '/SystemAjax/GetPublicNewsList', 'newscover'),
    (16, '上传授权(OSS policy)', '/CommonPermissionAjax/GetAliOssPolicy?bk=10', 'policy'),
    (16, '文章封面/图片上传', '/CommonPermissionAjax/UploadSingleImg', 'roundtrip'),
    (17, '通用上传回读', '/CommonPermissionAjax/UploadImg', 'roundtrip'),
]

FAILS = []


def hit(no, desc, url, kind='page', method='GET', data=None):
    try:
        if kind in ('upload', 'roundtrip', 'policy'):
            r = c.post(url, data={'file': (io.BytesIO(PNG), 'probe.png')}, headers=H,
                       content_type='multipart/form-data') if kind != 'policy' else c.get(url, headers=H)
        elif method == 'POST':
            r = c.post(url, data=data or {}, headers=H)
        else:
            r = c.get(url, headers=H)
    except Exception as exc:
        FAILS.append((no, desc, url, 'exception %s' % exc))
        print('[RED]   %-3s %-24s %s -> %s' % (no, desc, url, exc))
        return
    body = r.get_data(as_text=False).decode('utf-8', 'ignore')
    why, tag = [], '[GREEN]'
    if kind == 'page':
        _ct = (r.headers.get('Content-Type') or '').split(';')[0]
        if r.status_code != 200:
            why.append('HTTP %s' % r.status_code)
        if _ct and _ct != 'text/html':
            why.append('返回的不是 HTML（%s），可能被同名接口抢了页面' % _ct)
        if NOTFOUND in body:
            why.append('渲染 404 页')
    elif kind == 'file':
        if r.status_code != 200:
            why.append('HTTP %s' % r.status_code)
    elif kind == 'policy':
        j = r.get_json() if r.is_json else None
        d = (j or {}).get('data')
        # aliossUploader 约定 codeStatus=0：成功必须是 code==0 且 data 是对象
        if (j or {}).get('code') != 0 or not isinstance(d, dict):
            why.append('上传授权拿不到: %s' % str(j)[:60])
        elif not d.get('local'):
            why.append('data 里缺 local 标记，组件仍会去请求阿里云 OSS: %s' % list(d)[:5])
    elif kind == 'roundtrip':
        j = r.get_json() if r.is_json else None
        if r.status_code != 200 or not j or j.get('code') != 1:
            why.append('上传失败: %s' % str(j)[:60])
        else:
            u = (j.get('data') or {}).get('src') or j.get('src') or ''
            r2 = c.get(u, headers=H)
            if r2.status_code != 200 or not (r2.headers.get('Content-Type') or '').startswith('image'):
                why.append('回读 %s -> HTTP %s %s' % (u, r2.status_code, r2.headers.get('Content-Type')))
    elif kind == 'strdata':
        j = r.get_json() if r.is_json else None
        if not j or not isinstance(j.get('data'), str):
            why.append('data 是 %s，前端 JSON.parse(data.data) 会抛错' % type((j or {}).get('data')).__name__)
    elif kind == 'savecheck':
        # 「系统管理员基本资料不能修改吗」→ 真改一次再读回，最后恢复原值
        def _read_user():
            rr = c.get('/api/UserApi/GetUserInfo', headers=H)
            jj = rr.get_json() if rr.is_json else None
            d = (jj or {}).get('data')
            return d if isinstance(d, dict) else (jj if isinstance(jj, dict) else {})
        u0 = _read_user()
        origin = u0.get('Name') or u0.get('userName') or ''
        if not origin:
            why.append('读不到当前用户资料，无法校验（GetUserInfo 返回 %s）' % str(u0)[:60])
        else:
            probe_val = origin + '_probe'
            payload = {'userName': probe_val, 'loginAcc': u0.get('Account') or u0.get('loginAcc') or ''}
            r1 = c.post(url, data={'paramStr': json.dumps(payload)}, headers=H)
            j1 = r1.get_json() if r1.is_json else {}
            after = (_read_user().get('Name') or '')
            c.post(url, data={'paramStr': json.dumps({'userName': origin, 'loginAcc': payload['loginAcc']})}, headers=H)
            if j1.get('code') != 1:
                why.append('保存返回失败: %s' % str(j1)[:60])
            elif after != probe_val:
                why.append('保存后读回仍是 %r，改动没落库' % after)
    elif kind == 'reject':
        # 期望被业务校验挡下（例如举报接口的空提交），挡不住才是问题
        j = r.get_json() if r.is_json else None
        if not j or j.get('code') != 0 or '请至少填写' not in str(j.get('msg')):
            why.append('空提交没被拦住：%s' % str(j)[:60])
    elif kind == 'rank':
        import datetime as _dt
        _t = _dt.date.today()
        for label, s, e in (('最近60天', (_t - _dt.timedelta(days=60)).strftime('%Y-%m-%d'), _t.strftime('%Y-%m-%d')),
                            ('页面旧默认值', '2026-9-01', _t.strftime('%Y-%m-%d'))):
            rr = c.post(url, data=dict(gameName='全部游戏', stime=s, etime=e, type='0'), headers=H)
            jj = rr.get_json() if rr.is_json else None
            rows = (jj or {}).get('data')
            n = len(rows) if isinstance(rows, list) else 0
            print('     · 排行榜[%s] stime=%s -> %d 条' % (label, s, n))
            if label == '最近60天' and n == 0:
                why.append('最近 60 天区间查不到数据')
    elif kind == 'nonempty':
        j = r.get_json() if r.is_json else None
        d = (j or {}).get('data')
        rows = d.get('data') if isinstance(d, dict) else d
        if not rows:
            why.append('列表为空: %s' % str(j)[:80])
    elif kind == 'newscover':
        j = r.get_json() if r.is_json else None
        d = (j or {}).get('data')
        rows = d.get('data') if isinstance(d, dict) else (d or [])
        rows = rows or []
        if not rows:
            why.append('列表为空（无文章可看封面图）')
        else:
            keys = set()
            for row in rows[:3]:
                if isinstance(row, dict):
                    keys |= set(row.keys())
            if 'coverImg' not in keys:
                why.append('返回字段里没有 coverImg（封面图链接会变空）')
            else:
                empty = [r for r in rows[:3] if not r.get('coverImg')]
                if empty:
                    why.append('coverImg 为空值')
    elif kind == 'json':
        j = None
        try:
            j = r.get_json()
        except Exception:
            pass
        if r.status_code != 200:
            why.append('HTTP %s' % r.status_code)
        elif j is None:
            why.append('非 JSON: %s' % body[:50].replace('\n', ' '))
        elif j.get('code') == 0 and '未接入' in str(j.get('msg')):
            tag = '[STUB] '
            why.append('桩: ' + str(j.get('msg'))[:36])
        elif j.get('code') == 0 and j.get('msg'):
            why.append('返回失败: ' + str(j.get('msg'))[:40])
    elif kind == 'upload':
        j = None
        try:
            j = r.get_json()
        except Exception:
            pass
        if r.status_code != 200:
            why.append('HTTP %s' % r.status_code)
        elif not j or j.get('code') != 1:
            why.append('上传失败: %s' % str(j)[:60] if j else body[:60])
    if why:
        if tag == '[GREEN]':
            tag = '[RED]  '
        FAILS.append((no, desc, url, '; '.join(why)))
    print('%s %-3s %-24s %-46s%s' % (tag, no, desc, url, ('  <- ' + '; '.join(why)) if why else ''))


if __name__ == '__main__':
    want = [int(a) for a in sys.argv[1:] if a.isdigit()]
    for item in SYMPTOMS:
        if want and item[0] not in want:
            continue
        hit(*item)
    red = [f for f in FAILS if not f[3].startswith('桩')]
    print('\nRED %d / STUB %d / 共 %d 条断言' % (len(red), len(FAILS) - len(red), len(SYMPTOMS)))
