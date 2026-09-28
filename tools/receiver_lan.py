import receiver, sys
from http.server import ThreadingHTTPServer
port = int(sys.argv[1]) if len(sys.argv) > 1 else 47124
print('receiver(LAN) on 0.0.0.0:%d -> %s' % (port, receiver.ROOT), flush=True)
ThreadingHTTPServer(('0.0.0.0', port), receiver.H).serve_forever()
