import sqlite3,json
con=sqlite3.connect('data/app.db'); cur=con.cursor();
for coll in ['users','customers','user','accounts','systemUsers']:
  rows=cur.execute('select id,coll,data from docs where coll=? limit 20',(coll,)).fetchall();
  if rows: print('COLL',coll,len(rows));
  for id,c,d in rows: print(id,d[:1000])
print('colls')
for c,n in cur.execute('select coll,count(*) from docs group by coll order by coll'): print(c,n)
