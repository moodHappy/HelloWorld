## 五版

## 添加复制按钮

{{FrontSide}}

<hr>
<span class="back-text">{{Back}}</span>


{{#笔记}}
<div class="notes">{{笔记}}</div>
{{/笔记}}



<script>
// 等待 DOM 完全加载
document.addEventListener("DOMContentLoaded", function() {
  // 获取正面字段的文本内容
  const frontText = document.querySelector('.front-text') ? document.querySelector('.front-text').textContent.trim() : '';  // 获取正面内容
  if (!frontText) {
    console.log('没有找到正面内容，无法进行分析');
    return;
  }

  // 检查 .notes 元素是否存在
  let notesElement = document.querySelector('.notes');
  if (!notesElement) {
    // 如果 .notes 元素不存在，创建一个新的 .notes 元素并添加到页面中
    notesElement = document.createElement('div');
    notesElement.classList.add('notes');
    // 将新的 .notes 元素插入到 .back 元素之后
    const backElement = document.querySelector('.back');
    if (backElement) {
      backElement.insertAdjacentElement('afterend', notesElement);
    } else {
      // 如果 .back 元素也不存在，将 .notes 元素添加到 body 的末尾
      document.body.appendChild(notesElement);
    }
  }

  // 创建“笔记”标题并添加 class
  const noteTitle = document.createElement('div');
  noteTitle.classList.add('note');
  noteTitle.textContent = '笔记';

  // 设置 noteTitle 和 .notes 之间的间距
  noteTitle.style.marginBottom = '20px';  // 添加底部间距

  // 设置 .note 与上方元素的间距
  noteTitle.style.marginTop = '20px';  // 添加顶部间距

  // 在 .notes 元素前面插入“笔记”标题
  notesElement.insertAdjacentElement('beforebegin', noteTitle);

  // 检查 .notes 元素是否已有内容
  if (notesElement.textContent.trim()) {
    console.log('发现已有笔记，无需分析');
    return;
  }

  // 在 Anki 中使用字段存储缓存数据
  const cacheKey = `analysis_cache_${frontText}`; // 使用文本作为缓存的 key

  // 获取缓存内容
  const cachedAnalysis = localStorage.getItem(cacheKey);
  if (cachedAnalysis) {
    console.log('使用缓存的分析结果');
    insertAnalysis(cachedAnalysis);  // 插入缓存内容
  } else {
    // 如果没有缓存，调用 API 进行分析
    const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';  // API 密钥
    const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';  // API 请求地址

    async function fetchAnalysis() {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'Meta-Llama-3.1-405B-Instruct',
            messages: [
              {
                role: "system",
                content: "你是一个智能助手，请用中文分析下面的句子，按照以下要求：\n1. 难度等级（A1-C2），并简要说明判断依据。\n2. 句子结构分析，列出主要成分（主语、谓语、宾语等）。\n3. 短语与用法，列出句中的固定搭配、短语、从句等，并解释其作用。\n4. 完整翻译。\n5. 拓展相关短语。"
              },
              {
                role: "user",
                content: frontText
              }
            ]
          })
        });

        const data = await response.json();
        console.log('API 返回数据:', data);

        if (data.choices && data.choices[0].message) {
          const analysis = data.choices[0].message.content;  // 获取分析内容

          // 缓存分析内容
          localStorage.setItem(cacheKey, analysis);  // 将分析内容存储到缓存中

          // 插入分析结果
          insertAnalysis(analysis);
          console.log('已插入分析结果:', analysis);
        } else {
          console.error('API 返回的数据格式不正确');
        }
      } catch (error) {
        console.error('请求失败:', error);
        alert('无法获取分析数据，请稍后再试！');
      }
    }

    // 执行 API 请求
    fetchAnalysis();
  }

  // 添加复制按钮并设置位置
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.style.position = 'fixed';
  copyButton.style.left = '0';
  copyButton.style.bottom = '0';
  copyButton.style.padding = '10px 20px';
  copyButton.style.backgroundColor = 'transparent';  // 背景色透明
  copyButton.style.color = 'black';  // 设置按钮文字颜色为黑色
  copyButton.style.border = 'none';  // 去除边框
  copyButton.style.borderRadius = '5px';
  copyButton.style.cursor = 'pointer';
  copyButton.style.opacity = '0.5';  // 设置50%透明度

  document.body.appendChild(copyButton);

  // 绑定点击事件以复制内容
  copyButton.addEventListener('click', function() {
    const notesText = notesElement.textContent.trim();
    if (notesText) {
      navigator.clipboard.writeText(notesText)
        .then(() => {
          alert('分析内容已复制！');
        })
        .catch((error) => {
          console.error('复制失败:', error);
          alert('复制失败，请重试！');
        });
    } else {
      alert('没有可复制的分析内容！');
    }
  });
});

// 插入分析内容到 .notes
function insertAnalysis(analysis) {
  const notesElement = document.querySelector('.notes');
  if (notesElement) {
    // 清空 .notes 元素的现有内容
    notesElement.innerHTML = '';
    // 创建并插入分析内容
    notesElement.textContent = analysis;  // 将分析内容放入 .notes 中
  }
}
</script>





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
// 辅助函数：处理内联格式（加粗）
function processInlineFormatting(text) {
    // 处理 **加粗** 和 __加粗__
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/__(.*?)__/g, '<strong>$1</strong>');
}

// Markdown 转换函数
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
                // 同时处理内联格式
                return `<h${level}>${processInlineFormatting(content)}</h${level}>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理引用
        if (/^>\s*(.*)$/.test(line)) {
            line = line.replace(/^>\s*(.*)$/, (match, content) => {
                return `<blockquote>${processInlineFormatting(content)}</blockquote>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        // 处理内联格式（加粗）
        line = processInlineFormatting(line);
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
    const headers = headerLine.split('|').map(cell => processInlineFormatting(cell.trim()));
    // 表体行（从第三行开始）  
    const bodyRows = [];
    for (let j = 2; j < lines.length; j++) {
        let rowLine = lines[j].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
            rowLine = rowLine.substring(1, rowLine.length - 1);
        }
        const cells = rowLine.split('|').map(cell => processInlineFormatting(cell.trim()));
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
        listHTML += `<li>${processInlineFormatting(item)}</li>`;
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