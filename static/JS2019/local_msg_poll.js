/* 本地版消息推送：原站靠 WebSocket（msg.jidanpu.com）推送新订单/留言，这里改为每 10 秒轮询本人未读消息，
   有新消息时：右上角弹出提示 + 提示音 + 浏览器通知 + 自动刷新当前打开的订单类列表（不关闭正在操作的弹窗）。 */
window.startLocalMsgPoll = function (ctx) {
    var $ = ctx.$, layer = ctx.layer, notice = ctx.notice, lastId = 0, inited = false, busy = false;
    var LIST_PAGES = /orderlist|myorderlist|insiderecorderlist|coreordercenter|aftersales|clientreviews|mymessage/i;
    var ORDER_KEYWORDS = /订单|留言|售后|评价|咨询|撤单|指派/;

    function playSound() {
        try {
            var snd = document.getElementById('chatAudio');
            if (snd && ctx.isPlayMsgSound !== 'N') { snd.muted = false; var p = snd.play(); if (p && p.catch) p.catch(function () { }); }
        } catch (e) { }
    }

    function openOrder(orderId) {
        layer.open({ title: orderId + ' 订单详情', shade: [0.3, '#333'], shadeClose: true, type: 2, skin: 'layui-layer-lan', anim: 8, area: ['1280px', '980px'], content: '/Order/OrderView?orderId=' + orderId + '&viewType=10' });
    }

    function show(item) {
        var options = {
            closeButton: true, debug: false, positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '15000', extendedTimeOut: '1000',
            showEasing: 'swing', hideEasing: 'linear', iconClass: 'layui-icon layui-icon-speaker',
            onclick: function () { if (item.orderId) openOrder(item.orderId); }
        };
        playSound();
        try { notice.success(item.content, item.title, options); } catch (e) { try { console.error('[消息轮询] 弹窗失败', e); } catch (x) { } }
        try { if (window.execJs && execJs.showNotiyMessage) execJs.showNotiyMessage(item.title, item.content, item.sendUserName, ctx.domain + '/User/mymessage'); } catch (e) { }
        try {   // 浏览器桌面通知（用户允许后在别的标签页也能看到）
            if (window.Notification && Notification.permission === 'granted') {
                var n = new Notification(item.title, { body: item.content, tag: 'msg' + item.msgId });
                n.onclick = function () { window.focus(); if (item.orderId) openOrder(item.orderId); n.close(); };
                setTimeout(function () { n.close(); }, 8000);
            }
        } catch (e) { }
    }

    function refreshLists() {
        $('.layadmin-tabsbody-item iframe').each(function () {
            try {
                var w = this.contentWindow;
                if (!w || !w.location || !LIST_PAGES.test(w.location.pathname) || !w.tools) return;
                if (w.tools.reloadOrderDataNoCloseLayer) { w.tools.reloadOrderDataNoCloseLayer(); return; }
                var hasLayer = w.document.querySelector('.layui-layer');
                if (!hasLayer && w.tools.reloadOrderData) w.tools.reloadOrderData();
            } catch (e) { }
        });
    }

    function poll() {
        if (busy || document.visibilityState === 'hidden') return;
        busy = true;
        $.ajax({
            type: 'GET', url: '/UserAjax/GetMyMessageList', data: { page: 1, limit: 5, isRead: 'N' }, dataType: 'json', cache: false, timeout: 8000,
            success: function (data) {
                var rows = (data.data || []).slice().sort(function (a, b) { return a.msgId - b.msgId; });
                if (!inited) { inited = true; rows.forEach(function (r) { if (r.msgId > lastId) lastId = r.msgId; }); return; }
                var fresh = rows.filter(function (r) { return r.msgId > lastId; });
                if (!fresh.length) return;
                fresh.forEach(function (r) { if (r.msgId > lastId) lastId = r.msgId; });
                try { console.log('[消息轮询] 新消息', fresh.length, fresh.map(function (r) { return r.title; })); } catch (e) { }
                fresh.forEach(show);
                if (ctx.getAllDontNotice) ctx.getAllDontNotice();
                if (fresh.some(function (r) { return ORDER_KEYWORDS.test((r.title || '') + (r.content || '')); })) refreshLists();
            },
            complete: function () { busy = false; }
        });
    }

    try { if (window.Notification && Notification.permission === 'default') Notification.requestPermission(); } catch (e) { }
    poll();
    setInterval(poll, 10000);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') poll(); });
};
