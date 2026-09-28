# Convert captured reference pages (ref/) into Jinja templates (templates/) using [[ ]] delimiters.
import os, re, json, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = os.path.join(ROOT, 'ref'); OUT = os.path.join(ROOT, 'templates')
pages = json.load(open(os.path.join(REF, '_pages.json')))
subpages = [p for p in json.load(open(os.path.join(REF, '_subpages.json'))) if p.startswith('/') and '#' not in p]
extra = ['/Index/console', '/Login/index.html', '/Login/Index1.html', '/Login/Index2.html', '/Login/Index3.html',
         '/notfound.html', '/html/EmployeeSettAgreement.html', '/Emp/viewlearminformation', '/Game/commonpricesetting',
         '/Game/pricecalculatorsetting', '/home/addblacklistplan', '/order/pushjdp', '/Order/UploadPic']
SUBS = [
    ('https://oss5.jidanpu.com/worksystem/Login/4.jpg', '/images/login-bg.jpg'),
    ('https://oss4.jidanpu.com/music/msg2.wav', '/media/msg2.wav'),
    ('https://oss4.jidanpu.com/music/msg.wav', '/media/msg.wav'),
    ('https://oss4.jidanpu.com/music/appmsg_end.mp3', '/media/appmsg_end.mp3'),
    ('https://oss4.jidanpu.com/images/jidanpuWeChat.jpg', '/images/jidanpuWeChat.jpg'),
    ('https://oss4.jidanpu.com/images/www2025/shouqiankefu.jpg', '/images/shouqiankefu.jpg'),
    ('http://oss4.jidanpu.com/images/nofund_1.jpg', '/images/nofund_1.jpg'),
    ('https://oss2.jidanpu.com/userPic.png', '/images/userPic.png'),
    ('https://oss4.jidanpu.com/js/sys/vue.min.js', '/JS2019/vue.min.js'),
    ('https://oss4.jidanpu.com/js/sys/elementindex.js', '/JS2019/elementindex.js'),
    ('测试用(系统管理员)', "[[ user.name ]]([[ user.jobName ]])"),
    ('测试用[系统管理员]', "[[ user.name ]][[ '[' ~ user.jobName ~ ']' ]]"),
    ('id="userId" value="615"', 'id="userId" value="[[ user.id ]]"'),
    ('<span class="info ft14">1234567890</span>', '<span class="info ft14">[[ user.account ]]</span>'),
    ('id="msgTag" value="404cf6f8e4e7dda7a69dff9db80e11e8"', 'id="msgTag" value="[[ msg_tag ]]"'),
    ('id="serverTime" value="1789784833043"', 'id="serverTime" value="[[ now_ms ]]"'),
    ('id="minD" value="2026-07-19"', 'id="minD" value="[[ minD ]]"'),
    ('id="maxD" value="2026-09-19"', 'id="maxD" value="[[ maxD ]]"'),
    ('value="15377167407"', 'value="[[ sys.ownerAccount ]]"'),
    ('ARog4WldlNVSG56MZhBmLg==', '[[ sys.jdpKey ]]'),
    ('value="66253"', 'value="[[ sys.jdpId ]]"'),
    ('value="5819"', 'value="[[ sys.id ]]"'),
    ('素晴一号', '[[ company ]]'),
]
DEV_HOOK = ("[% if dev %]<script>window.addEventListener('error',function(e){try{navigator.sendBeacon('/api/DevApi/JsError',JSON.stringify({page:location.pathname,msg:String(e.message),src:String(e.filename)+':'+e.lineno}))}catch(x){}});"
            "window.addEventListener('unhandledrejection',function(e){try{navigator.sendBeacon('/api/DevApi/JsError',JSON.stringify({page:location.pathname,msg:'unhandledrejection: '+String(e.reason)}))}catch(x){}});</script>[% endif %]" + chr(10))


def convert(src, dst):
    s = open(src, encoding='utf-8', errors='replace').read()
    for a, b in SUBS:
        s = s.replace(a, b)
    # 开发模式下把页面 JS 错误回传给服务端，便于排查
    s = s.replace('<script src="/layuiadmin/layui/layui.js', DEV_HOOK + '<script src="/layuiadmin/layui/layui.js', 1)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(s)
n = 0
for p in pages + subpages + extra:
    src = os.path.join(REF, p.lstrip('/'))
    if not os.path.exists(src):
        print('missing', p); continue
    rel = p.lstrip('/')
    if not rel.endswith('.html'): rel += '.html'
    convert(src, os.path.join(OUT, rel)); n += 1
convert(os.path.join(REF, 'index.html'), os.path.join(OUT, 'index.html')); n += 1
print('templates written:', n)
