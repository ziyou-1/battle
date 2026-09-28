/*
 * Small local editor compatible with the Layui layedit API used by this
 * project.  The original third-party module is not shipped with the local
 * build; this keeps QA, learning material and system FAQ editing functional
 * without an external editor dependency.
 */
layui.define(function (exports) {
    'use strict';
    var editors = {};
    var nextId = 0;
    var styleAdded = false;

    function addStyle() {
        if (styleAdded) return;
        styleAdded = true;
        var style = document.createElement('style');
        style.textContent = '.layedit-lite{border:1px solid #e6e6e6;background:#fff}.layedit-lite-toolbar{display:flex;gap:4px;flex-wrap:wrap;padding:6px;border-bottom:1px solid #e6e6e6;background:#fafafa}.layedit-lite-toolbar button{border:1px solid #d2d2d2;background:#fff;border-radius:2px;padding:3px 8px;color:#555;cursor:pointer}.layedit-lite-toolbar button:hover{color:#1e9fff;border-color:#1e9fff}.layedit-lite-area{min-height:220px;padding:10px;outline:0;line-height:1.7;overflow:auto}.layedit-lite-area:empty:before{content:"请输入内容";color:#b2b2b2}';
        document.head.appendChild(style);
    }

    function entry(index) {
        return editors[index] || null;
    }

    function sync(item) {
        if (item && item.textarea && item.area) item.textarea.value = item.area.innerHTML;
    }

    var layedit = {
        config: {},
        set: function (options) {
            this.config = Object.assign(this.config || {}, options || {});
            return this;
        },
        build: function (textareaId, options) {
            addStyle();
            var textarea = document.getElementById(textareaId);
            if (!textarea) return null;
            var index = ++nextId;
            var wrap = document.createElement('div');
            wrap.className = 'layedit-lite';
            var toolbar = document.createElement('div');
            toolbar.className = 'layedit-lite-toolbar';
            [['加粗', 'bold'], ['斜体', 'italic'], ['下划线', 'underline'], ['清除格式', 'removeFormat']].forEach(function (item) {
                var button = document.createElement('button');
                button.type = 'button';
                button.textContent = item[0];
                button.addEventListener('click', function () {
                    document.execCommand(item[1], false, null);
                    area.focus();
                    sync(editors[index]);
                });
                toolbar.appendChild(button);
            });
            var area = document.createElement('div');
            area.className = 'layedit-lite-area';
            area.contentEditable = 'true';
            area.innerHTML = textarea.value || '';
            area.addEventListener('input', function () { sync(editors[index]); });
            wrap.appendChild(toolbar);
            wrap.appendChild(area);
            textarea.style.display = 'none';
            textarea.parentNode.insertBefore(wrap, textarea);
            editors[index] = { textarea: textarea, area: area, wrap: wrap };
            sync(editors[index]);
            return index;
        },
        getContent: function (index) {
            var item = entry(index);
            return item ? item.area.innerHTML : '';
        },
        getText: function (index) {
            var item = entry(index);
            return item ? item.area.textContent : '';
        },
        setContent: function (index, content, append) {
            var item = entry(index);
            if (!item) return;
            item.area.innerHTML = append ? item.area.innerHTML + (content || '') : (content || '');
            sync(item);
        },
        sync: function (index) { sync(entry(index)); }
    };

    exports('layedit', layedit);
});
