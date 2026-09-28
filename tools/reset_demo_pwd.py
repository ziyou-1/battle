# -*- coding: utf-8 -*-
"""把演示账号的密码恢复到 README 里的设计值（默认处理登录失败的 boss）。

用法:
    python tools/reset_demo_pwd.py                 # boss -> 123456
    python tools/reset_demo_pwd.py kf小晴 123456    # 指定账号与密码
"""
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import db  # noqa: E402
from api.login import hash_pwd, verify_pwd  # noqa: E402

if __name__ == '__main__':
    db.init()
    acc = sys.argv[1] if len(sys.argv) > 1 else 'boss'
    pwd = sys.argv[2] if len(sys.argv) > 2 else '123456'
    u = db.first('users', lambda x: x.get('loginAcc') == acc)
    if not u:
        print('找不到账号 %s' % acc)
        sys.exit(1)
    if verify_pwd(u, pwd):
        print('%s 已经符合该密码，不需要改' % acc)
        sys.exit(0)
    db.update('users', u['id'], dict(pwdHash=hash_pwd(pwd), password=''))
    db.conn().commit()
    print('已把 %s 的密码重置为 %s（原来的密码是哈希，无法反推）' % (acc, pwd))
