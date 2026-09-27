// 代码块语言识别

$(function () {
  var $highlight_lang = $('<div class="code_lang" title="代码语言"></div>');

  $('pre').before($highlight_lang);
  $('pre').each(function () {
    var code_language = $(this).attr('class');

    if (!code_language) {
      // highlight.js 渲染时语言类名挂在 figure 上（如 class="highlight python"），pre 上没有 class，
      // 所以这里回退到父级 figure 上取语言名，否则标签一直是空的。
      var $figure = $(this).closest('figure.highlight');
      if ($figure.length) {
        code_language = ($figure.attr('class') || '').replace('highlight', '').trim();
      }
    }

    if (!code_language) {
      return true;
    };
    var lang_name = code_language.replace("line-numbers", "").trim().replace("language-", "").trim();

    // 首字母大写
    // lang_name = lang_name.slice(0, 1).toUpperCase() + lang_name.slice(1);

    $(this).siblings(".code_lang").text(lang_name);
  });
});
