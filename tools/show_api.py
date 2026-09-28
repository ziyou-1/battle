import json,sys,re
spec=json.load(open('ref/_api_spec.json',encoding='utf-8',errors='replace'))
pat=sys.argv[1]
seen=set()
for a in spec['ajax']:
    if re.search(pat,a['file'],re.I) and a['url'] and not a['url'].startswith('DYN'):
        key=(a['url'].split('?')[0],a['type'],tuple(a['data']))
        if key in seen: continue
        seen.add(key)
        print(f"{a['type']:4} {a['url'][:70]:70} {','.join(a['data'])[:110]}   [{a['file'].split('/')[-1]}]")
for t in spec['tables']:
    if re.search(pat,t['file'],re.I) and t['url']:
        print(f"TBL  {t['url'][:70]:70} where={','.join(t['where'])}  fields={','.join(t['fields'])[:150]}   [{t['file'].split('/')[-1]}]")
