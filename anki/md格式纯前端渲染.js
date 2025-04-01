
{{#笔记}}
  <div class="note">笔记</div>

  <div class="notes">{{笔记}}</div>
{{/笔记}}

<!-- // Markdown 渲染处理。 -->

<style>
.table-container {
    max-height: 300px; /* 根据需要调整高度 */
    overflow: auto;
}
/* 文本容器，保留纯文本的换行 */
.notes {
    overflow: auto;
    white-space: pre-wrap;
}
/* 表格基本样式 */
table {
    border-collapse: collapse;
    width: 100%;
}
th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
}
th {
    background-color: #f2f2f2;
}
</style>


<script>

// JS 代码：将 Markdown 转换为 HTML
function markdownToHTML(markdown) {
    // 按行拆分文本
    const lines = markdown.split('\n');
    let resultLines = [];
    let i = 0;
    while (i < lines.length) {
        let line = lines[i];
        // 处理表格块：行以 | 开头和结尾
        if (/^\s*\|.*\|\s*$/.test(line)) {
            let tableLines = [];
            while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
                tableLines.push(lines[i]);
                i++;
            }
            const tableHTML = processTableBlock(tableLines);
            resultLines.push(tableHTML);
            continue;
        }
        // 处理列表块：行以 *、- 或 + 开头
        if (/^\s*[\*\-\+]\s+/.test(line)) {
            let listLines = [];
            while (i < lines.length && /^\s*[\*\-\+]\s+/.test(lines[i])) {
                listLines.push(lines[i]);
                i++;
            }
            const listHTML = processListBlock(listLines);
            resultLines.push(listHTML);
            continue;
        }
        // 处理标题（1-6级标题）
        if (/^(#{1,6})\s*(.*)$/.test(line)) {
            line = line.replace(/^(#{1,6})\s*(.*)$/, (match, hashes, content) => {
                const level = hashes.length;
                return `<h${level}>${content}</h${level}>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理引用
        if (/^>\s*(.*)$/.test(line)) {
            line = line.replace(/^>\s*(.*)$/, '<blockquote>$1</blockquote>');
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理内联格式（粗体）
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/__(.*?)__/g, '<strong>$1</strong>');
        resultLines.push(line);
        i++;
    }
    let html = resultLines.join('\n');
    // 处理以 $ 包裹的内容变红色
    html = html.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');
    // 如果转换结果中没有 HTML 标签（即纯文本），则替换换行符为 <br>
    if (!/<[^>]+>/.test(html)) {
        html = html.replace(/\n/g, '<br>');
    }
    return html;
}

// 处理表格块，将表格内容包裹在滚动容器中
function processTableBlock(lines) {
    if (lines.length < 2) {
        return lines.join('<br>');
    }
    // 处理表头：去掉首尾的 | 后按 | 分割
    let headerLine = lines[0].trim();
    headerLine = headerLine.substring(1, headerLine.length - 1);
    const headers = headerLine.split('|').map(cell => cell.trim());
    // 表体行（从第三行开始）
    const bodyRows = [];
    for (let j = 2; j < lines.length; j++) {
        let rowLine = lines[j].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
            rowLine = rowLine.substring(1, rowLine.length - 1);
        }
        const cells = rowLine.split('|').map(cell => cell.trim());
        bodyRows.push(cells);
    }
    // 构造表格 HTML
    let tableHTML = '<div class="table-container"><table>';
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    tableHTML += '<tbody>';
    bodyRows.forEach(row => {
        tableHTML += '<tr>';
        for (let i = 0; i < headers.length; i++) {
            const cellContent = row[i] !== undefined ? row[i] : '';
            tableHTML += `<td>${cellContent}</td>`;
        }
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table></div>';
    return tableHTML;
}

// 处理列表块，将连续的列表项合并为一个 <ul>
function processListBlock(lines) {
    let listHTML = '<ul>';
    lines.forEach(line => {
        // 移除列表标记（*、-、+）及多余空白
        const item = line.replace(/^\s*[\*\-\+]\s+/, '');
        listHTML += `<li>${item}</li>`;
    });
    listHTML += '</ul>';
    return listHTML;
}

// Anki 渲染时执行转换
document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes');
    if (notesDiv) {
        const originalMarkdown = notesDiv.innerText;
        const convertedHTML = markdownToHTML(originalMarkdown);
        notesDiv.innerHTML = convertedHTML;
    }
});

</script>



// 一版本

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


