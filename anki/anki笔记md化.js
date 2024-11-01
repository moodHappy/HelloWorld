{{#笔记}}
<div class="note">笔记：</div>
<div class="notes">{{笔记}}</div>
{{/笔记}}

<style>
/* Github 风格的 Markdown 样式 */
.markdown-body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    line-height: 1.6;
    padding: 15px;
}

.markdown-body h1 {
    font-size: 24px;
    font-weight: bold;
}

.markdown-body ul {
    list-style-type: disc;
    margin-left: 20px;
}

.markdown-body li {
    margin-bottom: 5px;
}
</style>

<script>
'use strict';

function consoleLog(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    document.body.appendChild(div);
}

var MARKDOWN_IT_CDN = 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/markdown-it/12.3.2/markdown-it.min.js';
var HIGHLIGHT_JS_CDN = 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/highlight.min.js';
var HIGHLIGHT_CSS_CDN = 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/highlight.js/11.4.0/styles/base16/onedark.min.css';
var GITHUB_MARKDOWN_CSS_CDN = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/github-markdown-css/5.1.0/github-markdown.min.css';

var createScript = (src) => {
    var scriptElement = document.createElement('script');
    scriptElement.src = src;
    scriptElement.async = true;
    scriptElement.type = 'text/javascript';
    document.head.appendChild(scriptElement);
    return new Promise((resolve) => {
        scriptElement.onload = function () {
            resolve(src);
        };
    });
};

var createLink = (url) => {
    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = url;
    linkElement.onload = () => {};
    document.head.appendChild(linkElement);
};

createLink(GITHUB_MARKDOWN_CSS_CDN);
createLink(HIGHLIGHT_CSS_CDN);

var clearBR = (str) => {
    str = str.replace(/<br>/g, '\r\n');
    return str;
};

var clearBlankNbsp = (str) => {
    str = str.replace(/&nbsp;/g, ' ');
    return str;
};

var unescapeHTMLEntities = (innerHTML) =>
    Object.assign(document.createElement('textarea'), { innerHTML }).value;

var parseMarkDownFn = () => {
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, { language: lang }).value;
                } catch (__) {}
            }
            return '';
        },
    });
    document.querySelectorAll('.notes').forEach((div) => {
        var text = unescapeHTMLEntities(div.innerHTML).trim();
        text = clearBR(text);
        var html = md.render(text);
        var newDiv = document.createElement('div');
        newDiv.innerHTML = html;
        newDiv.className = 'markdown-body';
        div.parentNode.insertBefore(newDiv, div.nextSibling);
        div.style.display = 'none';
    });
};

createScript(HIGHLIGHT_JS_CDN)
    .then(() => {
        return createScript(MARKDOWN_IT_CDN);
    })
    .then(() => {
        parseMarkDownFn();
    });
</script>


<script>
document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes');
    const notesContent = notesDiv.innerHTML;

    // 使用正则匹配以 $ 开头和结尾的部分，并将中间内容替换为红色的 <span>
    const formattedContent = notesContent.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');

    // 更新 .notes 的内容
    notesDiv.innerHTML = formattedContent;
});
</script>