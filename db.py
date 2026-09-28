# -*- coding: utf-8 -*-
"""SQLite 数据层：通用文档存储 (collection + JSON) + 初始化种子数据"""
import os, json, sqlite3, secrets, datetime, random, threading
from flask import g, has_request_context
from cryptography.fernet import Fernet, InvalidToken

_local = threading.local()

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, 'data')
DB_PATH = os.path.join(DATA_DIR, 'app.db')
FIELD_KEY_PATH = os.path.join(DATA_DIR, 'field.key')
os.makedirs(DATA_DIR, exist_ok=True)

SENSITIVE_FIELDS = {
    'orders': ('gamePwd', 'accPwd', 'loginKey'),
    'game_accounts': ('gamePwd', 'privateInfo', 'useInfo', 'safePhone', 'safeEmail', 'secondPwd', 'idInfo', 'privateRemark'),
    'client_roles': ('gamePwd',),
    'taobao_interfaces': ('appSecret', 'accessToken'),
    'push_group_msg': ('webhookUrl',),
}
ENCRYPTED_PREFIX = 'enc:v1:'
_cipher = None


def _field_cipher():
    global _cipher
    if _cipher is None:
        key = os.environ.get('SQ_DATA_KEY')
        if not key:
            try:
                key = open(FIELD_KEY_PATH, 'rb').read().strip()
            except FileNotFoundError:
                created = Fernet.generate_key()
                try:
                    fd = os.open(FIELD_KEY_PATH, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
                    with os.fdopen(fd, 'wb') as output:
                        output.write(created)
                    key = created
                except FileExistsError:
                    key = open(FIELD_KEY_PATH, 'rb').read().strip()
        try:
            _cipher = Fernet(key)
        except (TypeError, ValueError) as exc:
            raise RuntimeError('SQ_DATA_KEY / data/field.key 无效') from exc
    return _cipher


def _protect(coll, data):
    result = dict(data)
    for field in SENSITIVE_FIELDS.get(coll, ()):
        value = result.get(field)
        if isinstance(value, str) and value and not value.startswith(ENCRYPTED_PREFIX):
            result[field] = ENCRYPTED_PREFIX + _field_cipher().encrypt(value.encode('utf-8')).decode('ascii')
    return result


def _reveal(coll, data):
    for field in SENSITIVE_FIELDS.get(coll, ()):
        value = data.get(field)
        if isinstance(value, str) and value.startswith(ENCRYPTED_PREFIX):
            try:
                data[field] = _field_cipher().decrypt(value[len(ENCRYPTED_PREFIX):].encode('ascii')).decode('utf-8')
            except InvalidToken as exc:
                raise RuntimeError('数据加密密钥不匹配；请恢复原有 SQ_DATA_KEY / data/field.key') from exc
    return data


def connect():
    conn = sqlite3.connect(DB_PATH, timeout=30, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA foreign_keys=ON')
    return conn


def conn():
    """当前请求的连接；无请求上下文（如初始化/脚本）时使用线程级连接"""
    if has_request_context():
        if 'db' not in g:
            g.db = connect()
        return g.db
    if getattr(_local, 'conn', None) is None:
        _local.conn = connect()
    return _local.conn


def now_str(dt=None):
    return (dt or datetime.datetime.now()).strftime('%Y-%m-%d %H:%M:%S')


# ---------------- 通用文档存储 ----------------
def _row(r, coll):
    d = json.loads(r['data'])
    d['id'] = r['id']
    return _reveal(coll, d)


def insert(coll, data):
    c = conn()
    data = dict(data)
    data.setdefault('createTime', now_str())
    cur = c.execute('INSERT INTO docs(coll, data, created) VALUES(?,?,?)', (coll, json.dumps(_protect(coll, data), ensure_ascii=False), now_str()))
    data['id'] = cur.lastrowid
    c.execute('UPDATE docs SET data=? WHERE id=?', (json.dumps(_protect(coll, data), ensure_ascii=False), cur.lastrowid))
    return data


def insert_with_id(coll, id_, data):
    c = conn()
    data = dict(data); data['id'] = id_
    data.setdefault('createTime', now_str())
    c.execute('INSERT OR REPLACE INTO docs(id, coll, data, created) VALUES(?,?,?,?)', (id_, coll, json.dumps(_protect(coll, data), ensure_ascii=False), now_str()))
    return data


def get(coll, id_):
    try:
        id_ = int(id_)
    except (TypeError, ValueError):
        return None
    r = conn().execute('SELECT id, data FROM docs WHERE coll=? AND id=?', (coll, id_)).fetchone()
    return _row(r, coll) if r else None


def update(coll, id_, patch):
    d = get(coll, id_)
    if not d:
        return None
    d.update(patch)
    d['id'] = int(id_)
    conn().execute('UPDATE docs SET data=? WHERE coll=? AND id=?', (json.dumps(_protect(coll, d), ensure_ascii=False), coll, int(id_)))
    return d


def save(coll, d):
    return update(coll, d['id'], d)


def delete(coll, id_):
    conn().execute('DELETE FROM docs WHERE coll=? AND id=?', (coll, int(id_)))


def all_(coll):
    return [_row(r, coll) for r in conn().execute('SELECT id, data FROM docs WHERE coll=? ORDER BY id', (coll,))]


def migrate_sensitive_fields():
    """Encrypt existing plaintext credentials once, in the startup transaction."""
    c = conn()
    changed = False
    for coll in SENSITIVE_FIELDS:
        for row in c.execute('SELECT id, data FROM docs WHERE coll=?', (coll,)).fetchall():
            data = json.loads(row['data'])
            protected = _protect(coll, data)
            if protected != data:
                c.execute('UPDATE docs SET data=? WHERE id=?', (json.dumps(protected, ensure_ascii=False), row['id']))
                changed = True
    return changed


def find(coll, pred=None, order=None, desc=True):
    rows = all_(coll)
    if pred:
        rows = [r for r in rows if pred(r)]
    if order:
        rows.sort(key=lambda r: (r.get(order) is None, r.get(order) or 0) if not isinstance(r.get(order), str) else (False, r.get(order)), reverse=desc)
    return rows


def first(coll, pred):
    for r in all_(coll):
        if pred(r):
            return r
    return None


def count(coll, pred=None):
    return len(find(coll, pred))


def paginate(rows, page, limit):
    try:
        page = max(1, int(page or 1)); limit = max(1, int(limit or 10))
    except ValueError:
        page, limit = 1, 10
    return rows[(page - 1) * limit: page * limit]


def match(row, **conds):
    """简单相等匹配（空值条件忽略）"""
    for k, v in conds.items():
        if v is None or v == '':
            continue
        if str(row.get(k, '')) != str(v):
            return False
    return True


def like(row, keys, kw):
    if not kw:
        return True
    kw = str(kw).lower()
    return any(kw in str(row.get(k, '')).lower() for k in keys)


# ---------------- 系统信息 / 设置 ----------------
def system_info():
    r = conn().execute("SELECT v FROM kv WHERE k='system'").fetchone()
    return json.loads(r['v']) if r else {}


def set_system_info(d):
    conn().execute("INSERT OR REPLACE INTO kv(k, v) VALUES('system', ?)", (json.dumps(d, ensure_ascii=False),))


def setting(key, default=None):
    r = conn().execute('SELECT v FROM kv WHERE k=?', ('s:' + key,)).fetchone()
    return json.loads(r['v']) if r else default


def set_setting(key, value):
    conn().execute('INSERT OR REPLACE INTO kv(k, v) VALUES(?, ?)', ('s:' + key, json.dumps(value, ensure_ascii=False)))


def get_secret():
    p = os.path.join(DATA_DIR, 'secret.key')
    if not os.path.exists(p):
        open(p, 'w').write(secrets.token_hex(32))
    return open(p).read().strip()


# ---------------- 初始化 ----------------
SCHEMA = '''
CREATE TABLE IF NOT EXISTS docs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coll TEXT NOT NULL,
  data TEXT NOT NULL,
  created TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_docs_coll ON docs(coll);
CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL);
'''


def init():
    c = connect()
    c.executescript(SCHEMA)
    c.commit()
    if not c.execute("SELECT 1 FROM kv WHERE k='system'").fetchone():
        c.close()
        _local.conn = connect()
        from seed import seed_all
        seed_all()
        _local.conn.commit()
        _local.conn.close(); _local.conn = None
        print('数据库已初始化并写入示例数据 →', DB_PATH)
    else:
        c.close()
    _local.conn = connect()
    from seed import migrate
    migrate()
    encrypted_existing = migrate_sensitive_fields()
    _local.conn.commit()
    _local.conn.close(); _local.conn = None
    if encrypted_existing:
        # Rebuild SQLite pages and discard the WAL that held older plaintext.
        maintenance = connect()
        maintenance.execute('PRAGMA wal_checkpoint(TRUNCATE)')
        maintenance.execute('VACUUM')
        maintenance.close()
