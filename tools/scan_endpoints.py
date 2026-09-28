import re,os,glob,json,collections
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ref'))
pages=json.load(open('_pages.json'))+['/Index/console','/']
files=[]
for p in pages:
    f='index.html' if p=='/' else p.lstrip('/')
    files.append(f)
files += [f.replace(os.sep,'/') for f in glob.glob('JS2019/**/*.js',recursive=True) if not f.endswith(('jquery-3.3.1.min.js','echarts.min.js','howler.js'))]
files += ['layuiadmin/lib/admin.js','layuiadmin/lib/view.js','layuiadmin/lib/extend/notice.js','layuiadmin/lib/aliossUploader.js']
ep=collections.defaultdict(lambda: {'files':set(),'methods':set(),'kinds':set()})
pat=re.compile(r'''(url|href|action)\s*[:=]\s*["'](/(?:[A-Za-z][\w]*)(?:/[\w.-]+)+)(\?[^"']*)?["']''')
pat2=re.compile(r'''\$\.(post|get|getJSON)\(\s*["'](/[\w/.-]+)''')
pat3=re.compile(r'''location\.href\s*=\s*["'](/[\w/.-]+)''')
for f in files:
    if not os.path.exists(f): continue
    s=open(f,encoding='utf-8',errors='replace').read()
    for m in pat.finditer(s):
        kind,u,q=m.group(1),m.group(2),m.group(3)
        # determine method by looking back for type:
        ctx=s[max(0,m.start()-300):m.end()+300]
        mm=re.search(r'''type\s*:\s*["'](\w+)["']''',ctx,re.I)
        meth=mm.group(1).upper() if mm else ('GET' if kind!='action' else 'POST')
        e=ep[u]; e['files'].add(f); e['methods'].add(meth); e['kinds'].add(kind)
    for m in pat2.finditer(s):
        e=ep[m.group(2)]; e['files'].add(f); e['methods'].add(m.group(1).upper()); e['kinds'].add('jq')
    for m in pat3.finditer(s):
        e=ep[m.group(1)]; e['files'].add(f); e['methods'].add('NAV'); e['kinds'].add('nav')
out={k:{'files':sorted(v['files']),'methods':sorted(v['methods']),'kinds':sorted(v['kinds'])} for k,v in sorted(ep.items())}
json.dump(out,open('_endpoints.json','w'),ensure_ascii=False,indent=1)
print('endpoints:',len(out))
bycontroller=collections.Counter(k.split('/')[1] for k in out)
print(bycontroller.most_common())
