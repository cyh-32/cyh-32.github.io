// 代码块收缩

$(function () {
  // 行数超过这个值的代码块默认折叠（想要别的阈值改这里即可）
  var shrinkAfterLines = 5;

  var $code_expand = $('<i class="fas fa-angle-up code-expand" aria-hidden="true"></i>');

  // 统计代码行数：
  // highlight.js 渲染时一行对应一个 <span class="line">；
  // 其它渲染结果（prismjs、纯 <pre><code>）则按文本换行数统计。
  var countLines = function (pre) {
    var spans = pre.querySelectorAll('.line').length;
    if (spans) {
      return spans;
    }
    var text = pre.textContent.replace(/\n$/, '');
    return text ? text.split('\n').length : 0;
  };

  $('.code-area').prepend($code_expand);

  // 超过 shrinkAfterLines 行的代码块，加载时就折叠起来
  $('.code-area').each(function () {
    var $area = $(this);
    var $pre = $area.children('pre').first();
    if (!$pre.length) {
      $pre = $area.find('pre').first();
    }
    if ($pre.length && countLines($pre[0]) > shrinkAfterLines) {
      $area.addClass('code-closed');
    }
  });

  $('.code-expand').on('click', function () {
    // highlight.js 渲染出来的代码块里没有 <code> 元素，
    // 原来的 $pre.find('code').hide() / .show() 实际什么都没做（只有按钮图标转了），
    // 所以点击看起来“没反应”。这里只切换状态类，折叠高度由 CSS 控制。
    $(this).parent().toggleClass('code-closed');
  });
});
