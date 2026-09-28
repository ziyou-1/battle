import re,os,glob,json,collections
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ref'))
pages=json.load(open('_pages.json'))+json.load(open('_subpages.json'))+['/Index/console','/']
files=[]
for p in pages:
    if p.startswith('//'): continue
    f='index.html' if p=='/' else p.lstrip('/').split('#')[0]
    if os.path.exists(f): files.append(f)
files += [f.replace(os.sep,'/') for f in glob.glob('JS2019/**/*.js',recursive=True) if not f.endswith(('jquery-3.3.1.min.js','echarts.min.js','howler.js'))]
tables=[]; ajax=[]
def balanced(s,i,open_='{',close='}'):
    # return substring from s[i] (which must be open_) to matching close
    depth=0
    for j in range(i,len(s)):
        c=s[j]
        if c==open_: depth+=1
        elif c==close:
            depth-=1
            if depth==0: return s[i:j+1]
    return s[i:]
for f in files:
    s=open(f,encoding='utf-8',errors='replace').read()
    # table.render({...})
    for m in re.finditer(r'table\.render\(\s*\{',s):
        blk=balanced(s,m.end()-1)
        url=re.search(r'''url\s*:\s*['"]([^'"]+)['"]''',blk)
        fields=re.findall(r'''field\s*:\s*['"]([^'"]+)['"]''',blk)
        titles=re.findall(r'''title\s*:\s*['"]([^'"]*)['"]''',blk)
        where=re.search(r'where\s*:\s*\{',blk)
        wkeys=re.findall(r'(\w+)\s*:',balanced(blk,where.end()-1)) if where else []
        elem=re.search(r'''elem\s*:\s*['"]([^'"]+)['"]''',blk)
        method=re.search(r'''method\s*:\s*['"](\w+)['"]''',blk)
        tables.append({'file':f,'elem':elem.group(1) if elem else None,'url':url.group(1) if url else None,'method':(method.group(1).upper() if method else 'GET'),'fields':fields,'titles':titles,'where':wkeys})
    # $.ajax({...})
    for m in re.finditer(r'\$\.ajax\(\s*\{',s):
        blk=balanced(s,m.end()-1)
        url=re.search(r'''url\s*:\s*['"]([^'"]+)['"]''',blk)
        if not url:
            url2=re.search(r'''url\s*:\s*([^,\n]+)''',blk); u=('DYN:'+url2.group(1).strip()) if url2 else None
        else: u=url.group(1)
        typ=re.search(r'''type\s*:\s*['"](\w+)['"]''',blk,re.I)
        data=re.search(r'data\s*:\s*\{',blk)
        dkeys=re.findall(r'''['"]?(\w+)['"]?\s*:''',balanced(blk,data.end()-1)) if data else []
        if not data:
            d2=re.search(r'data\s*:\s*([^,\n]+)',blk); dkeys=['DYN:'+d2.group(1).strip()] if d2 else []
        ajax.append({'file':f,'url':u,'type':(typ.group(1).upper() if typ else 'GET'),'data':dkeys})
    for m in re.finditer(r'''\$\.(post|get|getJSON)\(\s*['"]([^'"]+)['"]\s*,\s*(\{[^)]*\})?''',s):
        dkeys=re.findall(r'''['"]?(\w+)['"]?\s*:''',m.group(3) or '')
        ajax.append({'file':f,'url':m.group(2),'type':m.group(1).upper().replace('GETJSON','GET'),'data':dkeys})
json.dump({'tables':tables,'ajax':ajax},open('_api_spec.json','w'),ensure_ascii=False,indent=1)
print('tables',len(tables),'ajax',len(ajax))
urls=collections.Counter([t['url'] for t in tables]+[a['url'] for a in ajax])
print('distinct urls',len(urls))
print('dynamic urls:',[u for u in urls if u and u.startswith('DYN:')][:20])
