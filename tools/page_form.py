# 打印某个抓取页面里的表单控件（名称/类型/值/选中）与下拉选项，用于逐页核对
import re, sys
s = open(sys.argv[1], encoding='utf-8').read()
for m in re.finditer(r'<(input|textarea)\b([^>]*)>', s):
    a = m.group(2)
    name = re.search(r'name="([^"]*)"', a); typ = re.search(r'type="([^"]*)"', a); val = re.search(r'value="([^"]*)"', a)
    if not name or (typ and typ.group(1) in ('radio',) and 'checked' not in a):
        continue
    print('%-9s %-28s %-30s %s' % (typ.group(1) if typ else m.group(1), name.group(1), (val.group(1) if val else '')[:30], 'checked' if 'checked' in a else ''))
for m in re.finditer(r'<select[^>]*name="([^"]*)"[^>]*>(.*?)</select>', s, re.S):
    opts = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>', m.group(2))
    sel = re.findall(r'<option[^>]*value="([^"]*)"[^>]*selected', m.group(2))
    print('select    %-28s %d options, selected=%s  %s' % (m.group(1), len(opts), sel, [o[1][:8] for o in opts[:6]]))
