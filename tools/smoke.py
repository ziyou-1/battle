# 冒烟测试：登录后请求全部页面 + 全部表格接口，检查状态码/JSON 格式
import os, sys, json, re
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import app as appmod, db
from api.spec import TABLE_URLS, AJAX_METHODS
db.init()
c = appmod.app.test_client()
# 登录前先取 CSRF（登录页会在 </head> 注入 meta）
_r0 = c.get('/Login/index.html')
_m = re.search(r'name="csrf-token" content="([^"]+)"', _r0.get_data(as_text=True))
H = {'X-CSRF-Token': _m.group(1)} if _m else {}
r = c.post('/Login/Login', data=dict(acc='1234567890', pwd='394607', code='', deviceInfo='test', isRemember=0), headers=H)
assert r.get_json()['code'] == 1, r.get_data(as_text=True)


def _txt(resp, n=200):
    return resp.get_data(as_text=False).decode('utf-8', 'ignore')[:n].replace('\n', ' ')
pages = sorted(k for k in appmod.TEMPLATES if k != 'noauth')  # noauth 只在 403 时内部渲染
bad = []
for k in pages:
    url = '/' + k
    if k.startswith('login/') or k in ('notfound', 'index', 'public/buiderqrcode'):
        continue
    q = ''
    if k in ('order/orderview', 'order/assignation', 'emp/changerecpricebyorder', 'order/sendsms', 'order/uploadpic', 'group/neworder togroup'.replace(' ', ''), 'group/ordergroup', 'order/setordersta', 'order/orderremark'):
        q = '?orderId=' + str(db.all_('orders')[0]['orderId'])
    if k == 'order/addorder':
        q = '?orderID=' + str(db.all_('orders')[0]['orderId'])
    r = c.get(url + q, headers=H)
    _ct = (r.headers.get('Content-Type') or '').split(';')[0]
    if r.status_code != 200 or (_ct and _ct != 'text/html'):
        # 页面必须渲染 HTML：同名接口会抢走页面（曾让「我也要举报」返回一段 JSON）
        bad.append((url, r.status_code, 'ct=%s ' % _ct + _txt(r)))
print('pages:', len(pages), 'bad:', len(bad))
for b in bad: print('  ', b)
r = c.get('/'); print('index', r.status_code, len(r.data))
badapi = []
for u in sorted(TABLE_URLS):
    r = c.get(u + '?page=1&limit=5', headers=H)
    try:
        j = r.get_json()
        if j is None or 'code' not in j:
            badapi.append((u, r.status_code, _txt(r, 120)))
    except Exception as e:
        badapi.append((u, r.status_code, str(e)))
print('table apis:', len(TABLE_URLS), 'bad:', len(badapi))
for b in badapi: print('  ', b)
# 主要 ajax 接口 GET/POST 冒烟（只测不改数据的 Get* 开头）
n = 0; badajax = []
for u, methods in sorted(AJAX_METHODS.items()):
    name = u.rsplit('/', 1)[-1]
    if not name.startswith('get'):
        continue
    r = c.post(u, data={}, headers=H) if 'POST' in methods else c.get(u, headers=H)
    n += 1
    if r.status_code >= 500 or (r.mimetype == 'application/json' and r.get_json() is None):
        badajax.append((u, r.status_code, _txt(r, 150)))
    elif r.status_code == 200 and r.mimetype != 'application/json' and not r.mimetype.startswith('image') and 'svg' not in r.mimetype:
        badajax.append((u, r.status_code, 'non-json: ' + r.mimetype))
print('get-ajax:', n, 'bad:', len(badajax))
for b in badajax: print('  ', b)
