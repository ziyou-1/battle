import sqlite3,glob,os
p='data/app.db'; con=sqlite3.connect(p); cur=con.cursor();
for row in cur.execute("select name from sqlite_master where type='table' order by name"): print(row[0])
