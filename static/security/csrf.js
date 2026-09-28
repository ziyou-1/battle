/* Attach the session-bound request token to same-origin legacy AJAX calls. */
(function () {
    var meta = document.querySelector('meta[name="csrf-token"]');
    var token = meta && meta.getAttribute('content');
    if (!token) return;
    function local(url) {
        try { return new URL(url, location.href).origin === location.origin; }
        catch (e) { return false; }
    }
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._csrfLocal = local(url);
        return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        if (this._csrfLocal) this.setRequestHeader('X-CSRF-Token', token);
        return send.apply(this, arguments);
    };
    if (window.fetch) {
        var originalFetch = window.fetch;
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : input.url;
            if (!local(url)) return originalFetch.apply(this, arguments);
            var options = Object.assign({}, init || {});
            var headers = new Headers(options.headers || (input instanceof Request ? input.headers : undefined));
            headers.set('X-CSRF-Token', token);
            options.headers = headers;
            return originalFetch.call(this, input, options);
        };
    }
})();
