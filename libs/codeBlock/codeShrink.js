// 代码块收缩

$(function () {
  var $code_expand = $('<i class="fas fa-angle-up code-expand" aria-hidden="true"></i>');

  $('.code-area').prepend($code_expand);
  $('.code-expand').on('click', function () {
    // highlight.js 渲染出来的代码块里没有 <code> 元素，
    // 原来的 $pre.find('code').hide() / .show() 实际什么都没做（只有按钮图标转了），
    // 所以点击看起来“没反应”。这里只切换状态类，折叠高度由 CSS 控制。
    $(this).parent().toggleClass('code-closed');
  });
});
