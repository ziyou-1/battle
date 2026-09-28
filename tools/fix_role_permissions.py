# -*- coding: utf-8 -*-
"""收敛角色权限：把「人事 / 财务」这类管理类菜单从客服、团长（以及财务的人事部分）身上摘掉。

背景：分角色体检发现客服(46)、财务(46)、团长(52) 三个角色的权限里含几乎全部 user/* 与 emp/*，
于是他们在页面上就能打开「人员管理」「打手与客服报酬」「结算记录」，接口层也因此放行 ——
全员报酬、人员档案、系统日志这类数据对这三个岗位本来是敞开的。

这个脚本只做「减法」，且会先把原配置备份到 setting('rolePermsBackup')，可一键还原。

用法:
    python tools/fix_role_permissions.py            # 收敛
    python tools/fix_role_permissions.py --restore  # 还原到备份
    python tools/fix_role_permissions.py --dry      # 只看会去掉哪些
"""
import json
import os
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import db  # noqa: E402

# 人事管理：只有系统管理员与老板该有
USER_ADMIN = {
    'user/adduser', 'user/userlist', 'user/applyonboardingmange', 'user/checkinlog', 'user/checkinstatic',
    'user/userloginrestrict', 'user/backuserlist', 'user/rnamecertlogandsetting', 'user/usercontractsigning',
    'user/usergroup',
}
# 财务与绩效管理：财务保留，客服与团长去掉
EMP_ADMIN = {
    'emp/emplist', 'emp/billsummary', 'emp/onlinepaytorecdetail', 'emp/salesmanstatistics', 'emp/dayoperation',
    'emp/booklist', 'emp/funddetailslist', 'emp/bindalipaysettauth', 'emp/privatephonecalllog',
}

# 岗位 -> 要去掉的 key
TRIM = {
    '客服': USER_ADMIN | EMP_ADMIN,
    '团长': USER_ADMIN | EMP_ADMIN,
    '财务': USER_ADMIN,
}


def main():
    if '--restore' in sys.argv:
        backup = db.setting('rolePermsBackup')
        if not backup:
            print('没有备份，无法还原')
            return
        for rid, perms in backup.items():
            db.update('roles', int(rid), dict(permissions=perms))
        db.conn().commit()
        print('已按备份还原 %d 个角色' % len(backup))
        return

    dry = '--dry' in sys.argv
    roles = db.all_('roles')
    backup = {str(r['id']): list(r.get('permissions') or []) for r in roles}
    if not dry and not db.setting('rolePermsBackup'):
        db.set_setting('rolePermsBackup', backup)
        print('已备份原权限配置到 setting(rolePermsBackup)')

    for r in roles:
        name = r.get('roleName')
        if name not in TRIM:
            continue
        old = list(r.get('permissions') or [])
        new = [k for k in old if k not in TRIM[name]]
        gone = [k for k in old if k in TRIM[name]]
        print('%s：%d -> %d 项，去掉 %s' % (name, len(old), len(new), '、'.join(gone) or '（无）'))
        if not dry:
            db.update('roles', r['id'], dict(permissions=new))
    if not dry:
        db.conn().commit()
        print('\n已写入（用 --restore 可还原）')


if __name__ == '__main__':
    db.init()
    main()
