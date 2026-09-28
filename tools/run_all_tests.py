# -*- coding: utf-8 -*-
"""一键跑完项目自带的全部分层测试（自动补上 CSRF 头，免得每个脚本各改一遍）。

用法:
    python tools/run_all_tests.py                 # 跑全部
    python tools/run_all_tests.py flow client     # 只跑名字里含这些关键字的

做法：把 app.test_client 包一层，首次请求前先抓登录页里的 csrf-token，
之后每个请求默认带上 X-CSRF-Token —— 产品代码不动，测试脚本也不动。
"""
import os
import re
import runpy
import sys
import traceback

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE)
import app as appmod  # noqa: E402

SUITES = ['smoke', 'flow_test', 'settings_test', 'miniapp_test', 'pricecalc_test',
          'clientorder_test', 'popup_test', 'client_test', 'client2_test']


class CsrfClient:
    """给 test_client 自动带 X-CSRF-Token 的壳"""

    _METHODS = ('get', 'post', 'put', 'patch', 'delete', 'head', 'options')

    def __init__(self, inner):
        self.__dict__['_inner'] = inner
        self.__dict__['_hdr'] = None

    def _csrf(self):
        if self.__dict__['_hdr'] is None:
            r = self.__dict__['_inner'].get('/Login/index.html')
            m = re.search(r'name="csrf-token" content="([^"]+)"', r.get_data(as_text=True))
            self.__dict__['_hdr'] = {'X-CSRF-Token': m.group(1)} if m else {}
        return self.__dict__['_hdr']

    def __getattr__(self, item):
        if item in self._METHODS:
            def call(*a, **kw):
                kw.setdefault('headers', self._csrf())
                resp = getattr(self.__dict__['_inner'], item)(*a, **kw)
                # 会话换过（例如脚本中途登出）时旧 token 会失效：
                # 刷新一次再重试，免得把「请求验证失败」当成业务结果。
                if resp.status_code == 403 and '请求验证失败'.encode('utf-8') in resp.data:
                    self.__dict__['_hdr'] = None
                    kw['headers'] = self._csrf()
                    resp = getattr(self.__dict__['_inner'], item)(*a, **kw)
                return resp
            return call
        return getattr(self.__dict__['_inner'], item)

    def __setattr__(self, key, value):
        setattr(self.__dict__['_inner'], key, value)


def patch_client():
    real = appmod.app.test_client

    def factory(*a, **kw):
        return CsrfClient(real(*a, **kw))
    appmod.app.test_client = factory


if __name__ == '__main__':
    want = [a for a in sys.argv[1:] if not a.startswith('-')]
    patch_client()
    results = []
    for name in SUITES:
        if want and not any(w in name for w in want):
            continue
        path = os.path.join(BASE, 'tools', name + '.py')
        print('\n' + '=' * 22 + ' %s ' % name + '=' * 22)
        status = 'PASS'
        try:
            runpy.run_path(path, run_name='__main__')
        except SystemExit as exc:
            if exc.code not in (0, None):
                status = 'FAIL (exit %s)' % exc.code
        except AssertionError as exc:
            status = 'FAIL (断言)'
            print('AssertionError: %s' % exc)
        except Exception:
            status = 'FAIL (异常)'
            traceback.print_exc()
        results.append((name, status))
    print('\n' + '=' * 56)
    for name, status in results:
        print('%-20s %s' % (name, status))
    bad = [n for n, s in results if s != 'PASS']
    print('\n通过 %d / %d；失败：%s' % (len(results) - len(bad), len(results), ', '.join(bad) or '无'))
