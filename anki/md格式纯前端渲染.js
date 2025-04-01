// Markdown 转换为 HTML 的函数
function markdownToHTML(markdown) {
    // 处理标题（例如：# 一级标题, ## 二级标题）
    markdown = markdown.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, content) => {
        const level = hashes.length; // 获取标题级别
        return `<h${level}>${content}</h${level}>`; // 返回相应级别的 <h1> 到 <h6> 标签
    });

    // 处理加粗（例如：**加粗内容** 或 __加粗内容__）
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // 处理列表（例如：- 列表项 或 * 列表项）
    markdown = markdown.replace(/^\s*[\*\-\+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');

    // 处理引用（例如：> 引用内容）
    markdown = markdown.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

    return markdown;
}

// 文档加载后执行的操作
document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes'); // 获取 .notes 元素

    if (notesDiv) {
        const originalMarkdown = notesDiv.innerText; // 获取原始的 Markdown 文本
        const convertedHTML = markdownToHTML(originalMarkdown); // 将 Markdown 转换为 HTML

        // 检查转换后的 HTML 是否包含 Markdown 生成的标签（如 <h1>, <strong>, <ul> 等）
        const markdownDetected = /<h[1-6]>|<strong>|<(ul|ol)>|<blockquote>/i.test(convertedHTML);

        let finalHTML = "";
        if (markdownDetected) {
            finalHTML = convertedHTML; // 如果有 Markdown 格式，则直接使用转换后的 HTML
        } else {
            // 如果没有 Markdown 格式，则将原始文本的换行替换为 <br>
            finalHTML = originalMarkdown.replace(/\n/g, '<br>');
        }

        // 使用正则表达式，将以 $ 开头和结尾的部分替换为红色的 <span>
        const formattedContent = finalHTML.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');

        // 更新 .notes 元素的 HTML 内容
        notesDiv.innerHTML = formattedContent;
    }

    // 处理笔记字段的显示逻辑：如果笔记为空，则隐藏笔记部分
    var noteField = "{{笔记}}";
    if (!noteField.trim()) {
        document.querySelector(".note").style.display = "none";
    }
});



//

这个代码绑定的 class 是 .notes 和 .note。

.notes：用于显示笔记内容，JavaScript 通过这个类选择该元素，并将其中的 Markdown 内容转换为 HTML。如果有 Markdown 格式，它会转换并显示；如果没有，它将替换为带有 <br> 标签的纯文本内容。

.note：用于显示“笔记”标签，如果字段为空，会隐藏该元素。


