import sqlite3,json
con=sqlite3.connect('data/app.db');
cur=con.cursor();
print(cur.execute('pragma table_info(docs)').fetchall())
rows=cur.execute('select * from docs limit 5').fetchall();
for r in rows: print(r[0],str(r[1])[:500])
