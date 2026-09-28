import re,sys
s=open(sys.argv[1],encoding='utf-8').read()
for m in re.finditer(r'<select[^>]*(?:id|name)="([^"]+)"[^>]*>(.*?)</select>',s,re.S):
    opts=re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>',m.group(2))
    print(m.group(1), len(opts), opts[:int(sys.argv[2]) if len(sys.argv)>2 else 12])
