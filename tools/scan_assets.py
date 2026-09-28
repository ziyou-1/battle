import re,os,glob,sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','ref'))
files=[f.replace(os.sep,'/') for f in glob.glob('**/*',recursive=True) if os.path.isfile(f) and not f.startswith(('ext','_'))]
assets=set()
for f in files:
    if f.endswith(('.png','.jpg','.jpeg','.gif','.woff','.woff2','.ttf','.eot','.mp3','.ico','.svg')): continue
    try: s=open(f,encoding='utf-8',errors='replace').read()
    except: continue
    for m in re.findall(r'["\'(](/(?:JS2019|layuiadmin|CSS|images|Images|img|Content|Scripts|fonts|font|Plugins|plugins|static|js|css|lib)/[^"\')\s?#]+)',s):
        assets.add(m)
    if f.endswith('.css'):
        base=os.path.dirname(f)
        for m in re.findall(r'url\((?:\'|")?([^\'")]+)',s):
            m=m.strip()
            if m.startswith(('data:','http','//')): continue
            if m.startswith('/'): assets.add(m.split('?')[0].split('#')[0]); continue
            p=os.path.normpath(os.path.join(base,m.split('?')[0].split('#')[0])).replace(os.sep,'/')
            assets.add('/'+p)
need=sorted(a for a in assets if not os.path.exists('.'+a))
print('refs',len(assets),'need',len(need))
open('_need_assets2.txt','w').write('\n'.join(need))
for n in need: print(n)
