# Local receiver: the logged-in browser page POSTs fetched resources here; we write them under ref/
import json, os, sys, base64
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ref'))
MANIFEST = os.path.join(ROOT, '_manifest.jsonl')

def safe_path(url):
    u = urlsplit(url)
    path = u.path or '/'
    if path.endswith('/'):
        path += 'index.html'
    if u.query:
        q = u.query.replace('&', '_').replace('=', '-').replace('/', '_')[:120]
        path += '__q_' + q
    parts = [p for p in path.split('/') if p not in ('', '.', '..')]
    host = u.netloc if u.netloc and 'suqing1.jidanpu.com' not in u.netloc else ''
    base = os.path.join(ROOT, 'ext', host) if host else ROOT
    return os.path.join(base, *parts)

class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_GET(self):
        if self.path.startswith('/relay.html'):
            data = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'relay.html'), 'rb').read()
            self.send_response(200); self._cors(); self.send_header('Content-Type','text/html; charset=utf-8'); self.end_headers()
            self.wfile.write(data); return
        self.send_response(200); self._cors(); self.send_header('Content-Type','text/plain'); self.end_headers()
        self.wfile.write(b'ok')
    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(n)
        try:
            msg = json.loads(body.decode('utf-8'))
            url = msg['url']
            out = safe_path(url)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if msg.get('b64'):
                data = base64.b64decode(msg['b64'])
            else:
                data = (msg.get('text') or '').encode('utf-8')
            with open(out, 'wb') as f:
                f.write(data)
            with open(MANIFEST, 'a', encoding='utf-8') as f:
                f.write(json.dumps({'url': url, 'status': msg.get('status'), 'type': msg.get('type'),
                                    'size': len(data), 'file': os.path.relpath(out, ROOT), 'method': msg.get('method','GET'),
                                    'reqBody': msg.get('reqBody')}, ensure_ascii=False) + '\n')
            resp = json.dumps({'ok': True, 'file': os.path.relpath(out, ROOT), 'size': len(data)}).encode()
        except Exception as e:
            resp = json.dumps({'ok': False, 'err': str(e)}).encode()
        self.send_response(200); self._cors(); self.send_header('Content-Type','application/json'); self.end_headers()
        self.wfile.write(resp)
    def log_message(self, *a):
        pass

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 47123
    print('receiver on 127.0.0.1:%d -> %s' % (port, ROOT), flush=True)
    ThreadingHTTPServer(('127.0.0.1', port), H).serve_forever()
