// 在浏览器里执行：统计当前页可见的错误提示 / 表格行数 / 未渲染的模板标记
(() => {
  const msgs = [...document.querySelectorAll('.layui-layer-msg, .layui-layer-content')].map(e => e.innerText.trim()).filter(Boolean);
  const rows = document.querySelectorAll('.layui-table-body tr').length;
  const raw = (document.body.innerText.match(/\[\[|\]\]|\[%|%\]/g) || []).length;
  const emptyTpl = (document.body.innerText.match(/\{\{=?/g) || []).length;
  return {title: document.title, rows, msgs: msgs.slice(0, 5), rawJinja: raw, layuiTplLeft: emptyTpl, url: location.pathname};
})()
