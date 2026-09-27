// 代码块一键复制

$(function () {
    var $copyIcon = $('<i class="fas fa-copy code_copy" title="复制代码" aria-hidden="true"></i>')
    var $notice = $('<div class="codecopy_notice"></div>')
    $('.code-area').prepend($copyIcon)
    $('.code-area').prepend($notice)
    // 复制结果提示
    function showNotice(ctx, msg) {
        $(ctx).prev('.codecopy_notice')
            .text(msg)
            .animate({
                opacity: 1,
                top: 30
            }, 450, function () {
                setTimeout(function () {
                    $(ctx).prev('.codecopy_notice').animate({
                        opacity: 0,
                        top: 0
                    }, 650)
                }, 400)
            })
    }

    // 老式复制：依赖页面上已经存在的选区。
    // 注意：部分浏览器在拿不到选区焦点时 execCommand('copy') 依然返回 true，但剪贴板里其实是空的，
    // 所以它只能作为回退方案，不能作为成功判据。
    function legacyCopy() {
        try {
            return document.execCommand('copy')
        } catch (ex) {
            return false
        }
    }

    // 优先使用异步剪贴板 API（https / localhost 属于安全上下文，可用）：
    // 它直接写入文本、不依赖页面选区，并且能用 Promise 结果确认是否真的写成功。
    // 失败或非安全上下文（如 http 局域网 IP）时，再回退到 execCommand。
    function writeClipboard(text, done) {
        if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                done(true)
            }, function () {
                done(legacyCopy())
            })
        } else {
            done(legacyCopy())
        }
    }

    // 复制
    $('.code-area .fa-copy').on('click', function () {
        var ctx = this
        // highlight.js 渲染出来的代码块是 <pre><span class="line">…</span></pre>，
        // 没有 <code> 元素，直接取 .find('code')[0] 会是 undefined，
        // selectNodeContents(undefined) 抛错，整个复制就静默失效了，所以这里回退到 <pre> 本身。
        var $pre = $(ctx).siblings('pre').first()
        var target = $pre.find('code').first()[0] || $pre[0]
        if (!target) {
            return
        }

        var selection = window.getSelection()
        var range = document.createRange()
        range.selectNodeContents(target)
        selection.removeAllRanges()
        selection.addRange(range)
        // 行号是用 CSS 计数器画的伪元素，selection.toString() 里不会包含它们；万一为空则直接用 DOM 文本兜底
        var text = selection.toString() || $pre.text()

        writeClipboard(text, function (ok) {
            showNotice(ctx, ok && text ? "复制成功" : "复制失败")
            // 等复制流程结束（含异步回退）再清掉选区，否则回退到 execCommand 时选区已经没了
            if (selection.removeAllRanges) {
                selection.removeAllRanges()
            }
        })
    })
});
