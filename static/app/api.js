/* 客户端接口封装：所有接口在 /api/client/*，返回 {code, msg, data}；code -1 = 未登录 */
window.API = (function () {
    var REQUEST_TIMEOUT = 10000;
    var listeners = [];
    function responseJson(response) {
        return response.text().then(function (text) {
            var payload;
            try { payload = JSON.parse(text); } catch (e) {
                throw new Error('服务器返回了无法解析的内容（HTTP ' + response.status + '）');
            }
            if (!response.ok) {
                throw new Error((payload && payload.msg) || '请求失败（HTTP ' + response.status + '）');
            }
            return payload;
        });
    }
    function fetchJson(url, opt) {
        opt = opt || {};
        var controller = window.AbortController ? new AbortController() : null;
        var timer = null;
        if (controller) opt.signal = controller.signal;
        var request = fetch(url, opt);
        var timeout = new Promise(function (_, reject) {
            timer = setTimeout(function () {
                if (controller) controller.abort();
                reject(new Error('请求超时，请稍后重试'));
            }, REQUEST_TIMEOUT);
        });
        return Promise.race([request, timeout]).then(function (response) {
            clearTimeout(timer);
            return responseJson(response);
        }, function (err) {
            clearTimeout(timer);
            if (err && err.name === 'AbortError') throw new Error('请求超时，请稍后重试');
            throw err;
        });
    }
    var csrf = fetchJson('/api/csrf', { credentials: 'same-origin' })
        .then(function (r) {
            if (!r || !r.token) throw new Error('会话初始化失败，请刷新页面重试');
            return r.token;
        });
    function req(method, path, data) {
        var opt = { method: method, headers: {}, credentials: 'same-origin' };
        var url = '/api/client/' + path;
        if (method === 'GET') {
            if (data) url += (url.indexOf('?') > -1 ? '&' : '?') + new URLSearchParams(data).toString();
        } else {
            opt.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            opt.body = new URLSearchParams(data || {}).toString();
        }
        return csrf.then(function (token) {
            opt.headers['X-CSRF-Token'] = token;
            return fetchJson(url, opt);
        }).then(function (res) {
            if (res.code === -1) listeners.forEach(function (fn) { fn(); });
            return res;
        }).catch(function (err) {
            return { code: 0, msg: (err && err.message) || '网络异常，请稍后重试', data: null };
        });
    }
    return {
        get: function (p, d) { return req('GET', p, d); },
        post: function (p, d) { return req('POST', p, d); },
        onNeedLogin: function (fn) { listeners.push(fn); }
    };
})();

/* 后台可编辑内容只允许展示安全的富文本，移除脚本、事件属性和危险协议。 */
window.SafeHtml = function (value) {
    var html = value == null ? '' : String(value);
    if (!html) return '';
    if (!window.DOMParser || typeof document === 'undefined' || !document.createElement) {
        return html.replace(/<\/?(script|style|iframe|object|embed|svg|math)[^>]*>/gi, '');
    }
    var allowed = {
        A: 1, ABBR: 1, B: 1, BLOCKQUOTE: 1, BR: 1, CODE: 1, COL: 1, COLGROUP: 1,
        DD: 1, DIV: 1, DL: 1, DT: 1, EM: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1,
        H6: 1, HR: 1, I: 1, IMG: 1, LI: 1, OL: 1, P: 1, PRE: 1, S: 1, SPAN: 1,
        STRONG: 1, SUB: 1, SUP: 1, TABLE: 1, TBODY: 1, TD: 1, TFOOT: 1, TH: 1,
        THEAD: 1, TR: 1, U: 1, UL: 1
    };
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    Array.prototype.slice.call(doc.body.querySelectorAll('*')).forEach(function (el) {
        var tag = el.tagName;
        if (!allowed[tag]) {
            if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|SVG|MATH|LINK|META|BASE|FORM)$/i.test(tag)) {
                el.remove();
            } else {
                var parent = el.parentNode;
                while (el.firstChild) parent.insertBefore(el.firstChild, el);
                parent.removeChild(el);
            }
            return;
        }
        Array.prototype.slice.call(el.attributes).forEach(function (attr) {
            var name = attr.name.toLowerCase();
            var keep = ['class', 'title', 'alt', 'width', 'height', 'colspan', 'rowspan'].indexOf(name) > -1;
            if (tag === 'A' && ['href', 'target', 'rel'].indexOf(name) > -1) keep = true;
            if (tag === 'IMG' && ['src', 'alt', 'width', 'height'].indexOf(name) > -1) keep = true;
            if (name.indexOf('on') === 0 || !keep) el.removeAttribute(attr.name);
        });
        ['href', 'src'].forEach(function (name) {
            if (!el.hasAttribute(name)) return;
            var url = (el.getAttribute(name) || '').trim();
            var safe = /^(https?:|mailto:|\/|#)/i.test(url);
            if (name === 'src') safe = /^(https?:|\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(url);
            if (!safe) el.removeAttribute(name);
        });
        if (tag === 'A' && el.getAttribute('target') === '_blank') el.setAttribute('rel', 'noopener noreferrer');
    });
    return doc.body.innerHTML;
};

window.Fmt = {
    money: function (v) { v = Number(v || 0); return (Math.round(v * 100) / 100).toString(); },
    game: function (name) { return (name || '').replace(/[：:].*$/, '').slice(0, 2); },
    color: function (name) {
        var cs = ['#1677ff', '#13c2c2', '#722ed1', '#eb2f96', '#fa8c16', '#52c41a', '#2f54eb', '#f5222d'];
        var n = 0; for (var i = 0; i < (name || '').length; i++) n += name.charCodeAt(i);
        return cs[n % cs.length];
    }
};
