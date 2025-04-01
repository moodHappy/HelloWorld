<script>
function markdownToHTML(markdown) {
    // 标题
    markdown = markdown.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level}>${content}</h${level}>`;
    });

    // 加粗
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // 列表
    markdown = markdown.replace(/^\s*[\*\-\+]\s+(.*)$/gm, '<ul><li>$1</li></ul>');

    // 引用
    markdown = markdown.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

    // 表格
    const tableRegex = /^\|(.*)\|\n\|(.*)\|\n((?:\|.*\|\n)*)/gm;
    markdown = markdown.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
        const headers = headerRow.split('|').map(cell => cell.trim()).filter(cell => cell !== "");
        const bodyLines = bodyRows.trim().split('\n');
        const body = bodyLines.map(row => row.split('|').map(cell => cell.trim()).filter(cell => cell !== ""));

        let tableHTML = '<table><thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th style="border: 1px solid black; padding: 8px; text-align: left; background-color: #f2f2f2;">${header}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        body.forEach(row => {
            let rowHTML = '<tr>';
            for (let i = 0; i < headers.length; i++) {
                const cellContent = row[i] !== undefined ? row[i] : '';
                rowHTML += `<td style="border: 1px solid black; padding: 8px; text-align: left;">${cellContent}</td>`;
            }
            rowHTML += '</tr>';
            tableHTML += rowHTML;
        });
        tableHTML += '</tbody></table>';
        return tableHTML;
    });

    return markdown;
}

document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes');

    if (notesDiv) {
        const originalMarkdown = notesDiv.innerText;
        const convertedHTML = markdownToHTML(originalMarkdown);

        // 检查转换后的 HTML 是否包含 Markdown 生成的标签
        const markdownDetected = /<h[1-6]>|<strong>|<(ul|ol)>|<blockquote>|<table>/i.test(convertedHTML);

        let finalHTML = "";
        if (markdownDetected) {
            finalHTML = convertedHTML;
        } else {
            // 如果没有检测到 Markdown 格式，则将原始文本的换行替换为 <br>
            finalHTML = originalMarkdown.replace(/\n/g, '<br>');
        }

        // 使用正则匹配以 $ 开头和结尾的部分，并将中间内容替换为红色的 <span>
        const formattedContent = finalHTML.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');

        // 更新 .notes 的内容
        notesDiv.innerHTML = formattedContent;

        // 为表格添加边框和样式 (你要求融合 CSS)
        const tables = notesDiv.querySelectorAll('table');
        tables.forEach(table => {
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            const ths = table.querySelectorAll('th');
            ths.forEach(th => {
                th.style.border = '1px solid black';
                th.style.padding = '8px';
                th.style.textAlign = 'left';
                th.style.backgroundColor = '#f2f2f2';
            });
            const tds = table.querySelectorAll('td');
            tds.forEach(td => {
                td.style.border = '1px solid black';
                td.style.padding = '8px';
                td.style.textAlign = 'left';
            });
        });
    }
});
</script>




这个代码绑定的 class 是 .notes 和 .note。

// 带表格功能

.notes：用于显示笔记内容，JavaScript 通过这个类选择该元素，并将其中的 Markdown 内容转换为 HTML。如果有 Markdown 格式，它会转换并显示；如果没有，它将替换为带有 <br> 标签的纯文本内容。

.note：用于显示“笔记”标签，如果字段为空，会隐藏该元素。


