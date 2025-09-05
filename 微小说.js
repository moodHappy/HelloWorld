
{{FrontSide}}

<style>
.definition, .phonetics {
    filter: none;
}
</style>

{{#笔记}}
<div class="notes">{{笔记}}</div>
{{/笔记}}

<script>
document.addEventListener("DOMContentLoaded", function() {
  const frontText = document.querySelector('.front') ? document.querySelector('.front').textContent.trim() : '';
  if (!frontText) {
    console.log('没有找到正面内容，无法进行分析');
    return;
  }

  let notesElement = document.querySelector('.notes');
  if (!notesElement) {
    notesElement = document.createElement('div');
    notesElement.classList.add('notes');
    const backElement = document.querySelector('.back');
    if (backElement) {
      backElement.insertAdjacentElement('afterend', notesElement);
    } else {
      document.body.appendChild(notesElement);
    }
  }

  const noteTitle = document.createElement('div');
  noteTitle.classList.add('note');
  noteTitle.textContent = '笔记';
  noteTitle.style.marginBottom = '20px';
  noteTitle.style.marginTop = '20px';
  notesElement.insertAdjacentElement('beforebegin', noteTitle);

  if (notesElement.textContent.trim()) {
    console.log('发现已有笔记，无需分析');
    return;
  }

  const cacheKey = `analysis_cache_${frontText}`;
  const cachedAnalysis = localStorage.getItem(cacheKey);
  if (cachedAnalysis) {
    console.log('使用缓存的分析结果');
    insertAnalysis(cachedAnalysis);
  } else {
    fetchAnalysis();
  }

  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy';
  copyButton.style.position = 'fixed';
  copyButton.style.left = '0';
  copyButton.style.bottom = '0';
  copyButton.style.padding = '10px 20px';
  copyButton.style.backgroundColor = 'transparent';
  copyButton.style.color = 'black';
  copyButton.style.border = 'none';
  copyButton.style.borderRadius = '5px';
  copyButton.style.cursor = 'pointer';
  copyButton.style.opacity = '0.5';
  document.body.appendChild(copyButton);

  copyButton.addEventListener('click', function() {
    const notesText = notesElement.textContent.trim();
    if (notesText) {
      navigator.clipboard.writeText(notesText)
        .then(() => alert('分析内容已复制！'))
        .catch((error) => {
          console.error('复制失败:', error);
          alert('复制失败，请重试！');
        });
    } else {
      alert('没有可复制的分析内容！');
    }
  });

  function insertAnalysis(analysis) {
    if (notesElement) {
      notesElement.innerHTML = '';
      notesElement.textContent = analysis;
    }
  }

  async function fetchAnalysis() {
    const apiKey = 'a96b8f1ea985481a89e8c142b32cd233.O3Qst5YxUmFw7B4T';
    const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'GLM-4.5',
          messages: [
            {
              role: "system",
              content: "你是英语老师，请分析以下英文文本：\n1. 给出难度等级（A1–C2）并说明原因。\n2. 分析主要句子结构和语法特点。\n3. 解释重要词汇和短语。\n4. 简述文章主题和写作风格。"
            },
            {
              role: "user",
              content: frontText
            }
          ]
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0].message) {
        const analysis = data.choices[0].message.content + '\n\n来源：GLM-4.5';
        localStorage.setItem(cacheKey, analysis);
        insertAnalysis(analysis);
      } else {
        if (data.error && data.error.message) {
          throw new Error(`AI API Error: ${data.error.message}`);
        }
        throw new Error('AI返回格式错误');
      }
    } catch (error) {
      console.error('AI请求失败:', error);
      alert('无法获取分析数据，请检查网络或API配置！');
    }
  }
});
</script>

<style>
.table-container {
    max-height: 300px;
    overflow: auto;
}
.notes {
    overflow: auto;
    white-space: pre-wrap;
}
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
function processInlineFormatting(text) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/__(.*?)__/g, '<strong>$1</strong>');
}
function markdownToHTML(markdown) {
    const lines = markdown.split('\n');
    let resultLines = [];
    let i = 0;
    while (i < lines.length) {
        let line = lines[i];
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
        if (/^(#{1,6})\s*(.*)$/.test(line)) {
            line = line.replace(/^(#{1,6})\s*(.*)$/, (match, hashes, content) => {
                const level = hashes.length;
                return `<h${level}>${processInlineFormatting(content)}</h${level}>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        if (/^>\s*(.*)$/.test(line)) {
            line = line.replace(/^>\s*(.*)$/, (match, content) => {
                return `<blockquote>${processInlineFormatting(content)}</blockquote>`;
            });
            resultLines.push(line);
            i++;
            continue;
        }
        line = processInlineFormatting(line);
        resultLines.push(line);
        i++;
    }
    let html = resultLines.join('\n');
    html = html.replace(/\$(.*?)\$/g, '<span style="color: red;">$1</span>');
    if (!/<[^>]+>/.test(html)) {
        html = html.replace(/\n/g, '<br>');
    }
    return html;
}
function processTableBlock(lines) {
    if (lines.length < 2) return lines.join('<br>');
    let headerLine = lines[0].trim();
    headerLine = headerLine.substring(1, headerLine.length - 1);
    const headers = headerLine.split('|').map(cell => processInlineFormatting(cell.trim()));
    const bodyRows = [];
    for (let j = 2; j < lines.length; j++) {
        let rowLine = lines[j].trim();
        if (rowLine.startsWith('|') && rowLine.endsWith('|')) {
            rowLine = rowLine.substring(1, rowLine.length - 1);
        }
        const cells = rowLine.split('|').map(cell => processInlineFormatting(cell.trim()));
        bodyRows.push(cells);
    }
    let tableHTML = '<div class="table-container"><table>';
    tableHTML += '<thead><tr>';
    headers.forEach(header => tableHTML += `<th>${header}</th>`);
    tableHTML += '</tr></thead><tbody>';
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
function processListBlock(lines) {
    let listHTML = '<ul>';
    lines.forEach(line => {
        const item = line.replace(/^\s*[\*\-\+]\s+/, '');
        listHTML += `<li>${processInlineFormatting(item)}</li>`;
    });
    listHTML += '</ul>';
    return listHTML;
}
document.addEventListener("DOMContentLoaded", function() {
    const notesDiv = document.querySelector('.notes');
    if (notesDiv) {
        const originalMarkdown = notesDiv.innerText;
        const convertedHTML = markdownToHTML(originalMarkdown);
        notesDiv.innerHTML = convertedHTML;
    }
});
</script>

css：

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');

.card {
    font-family: 'Roboto', Arial, sans-serif; /* 使用 Playfair Display 字体 */
    background-color: #f4f4f4; /* 浅灰色背景 */
    display: flex;
    flex-direction: column; /* 垂直布局 */
    justify-content: flex-start; /* 顶部对齐 */
    align-items: center; /* 水平居中 */
    padding: 5px; /* 增加内边距 */
    position: relative; /* 定位调整 */
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3); /* 增强阴影效果 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加卡片阴影 */
    border-radius: 10px; /* 卡片圆角 */
    box-sizing: border-box; /* 避免 padding 影响整体宽高 */
    height: auto; /* 让高度自适应内容 */
    max-height: 100%; /* 不超出容器高度 */
    overflow: visible; /* 禁止滚动 */
}

/* 单词显示 */
.word {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
    text-align: center;
}

.definition, .phonetics {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;
    transition: filter 0.3s ease;
    filter: blur(8px); /* 初始模糊 */
}

/* 正面显示 */
.front, .source {
    font-size: 18px; /* 设置字号为18px */
    color: #444; /* 文字黑色 */
    margin-bottom: 20px;
    text-align: left;
    border: 2px solid red; /* 红色边框 */
    padding: 10px; /* 添加内边距 */
    box-sizing: border-box; /* 确保 padding 不影响元素的宽度和高度 */
    background-color: #fff; /* 背景色设置为白色，确保边框清晰可见 */
}

/* 增强红色边框的可见度 */
.front {
    border: 2px solid #e74c3c; /* 更深的红色边框 */
}

.source {
    border: 2px solid #e74c3c; /* 同样的深红色边框 */
}

/* 正面显示 */
.back, .url {
    font-size: 18px; /* 设置字号为18px */
    color: #444; /* 文字黑色 */
    margin-bottom: 20px;
    text-align: center;
    border: 2px solid black; /* 黑色边框 */
    padding: 10px; /* 添加内边距 */
}

/* 去掉URL下划线 */
.url a {
    text-decoration: none; /* 去掉下划线 */
    color: #444; /* 确保文字颜色为黑色 */
}

/* 按钮样式 */
button.tts-button {
    color: #007bff; /* 设置文本颜色 */
    padding: 10px 20px;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    background: none; /* 去掉背景色 */
    border: none; /* 去掉边框 */
    outline: none; /* 去掉点击时的轮廓 */
    margin: 5px 0;
}

/* 调整两个按钮的位置，居中且底部向上200px */
button#ttsButton,
button#exampleTTSButton {
    position: fixed;
    bottom: 260px; /* 距离底部向上200px */
    left: 50%;
    transform: translateX(-50%); /* 水平居中 */
    opacity: 0.3;
}

/* 调整两个按钮之间的间距 */
button#exampleTTSButton {
    bottom: 200px; /* 第二个按钮距离底部260px */
    opacity: 0.3;
}

/* 隐藏音频元素 */
audio {
    display: none;
}

/* 笔记字段样式 */
.notes {
    font-size: 14px;
    color: #34495e; /* 笔记文字颜色 */
    background-color: #ecf0f1; /* 柔和背景色 */
    border-left: 4px solid #2980b9; /* 左侧彩色边框 */
    padding: 10px; /* 调整内边距，确保文本有足够的空白 */
    margin-top: 10px;
    border-radius: 6px; /* 圆角边框 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 轻微阴影 */
    line-height: 1.6; /* 行高调整 */
    word-wrap: break-word; /* 防止长词溢出 */
    text-align: left !important; /* 使用 !important 强制左对齐 */
    display: block; /* 使元素呈现为块级元素，确保高度自适应 */
    height: auto; /* 高度自适应 */
    overflow: visible; /* 确保不发生溢出 */
}

/* 确保父容器不限制高度 */
.parent-container {
    height: auto; /* 允许父容器高度自适应 */
    overflow: visible; /* 不限制子元素的溢出 */
}

/* .source 字段中的链接样式 */
.source a {
    text-decoration: none;  /* 去掉下划线 */
    color: #444;            /* 设置文本颜色为黑色 */
}

/* 标题样式 */
.note {
    font-size: 24px;               /* 字体更大 */
    font-weight: bold;             /* 字体加粗 */
    color: #222;                   /* 字体颜色稍深 */
    text-align: left;              /* 左对齐 */
    margin-bottom: 15px;           /* 底部间距 */
    letter-spacing: 1px;           /* 字母间距 */
    text-transform: capitalize;    /* 首字母大写 */
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2); /* 轻微文字阴影 */
    border-bottom: 2px solid #2980b9; /* 底部下划线边框 */
    padding: 10px 10px 5px 10px;   /* 内边距，底部间距小一些 */
    background-color: #e0e0e0;     /* 背景色略深 */
    border-radius: 8px;            /* 圆角 */
    display: block;                /* 改为 block，使背景宽度占满屏幕 */
    width: calc(100% - 20px);       /* 背景宽度占满屏幕，左右边距各10px */
    margin: 15 30px;                /* 左右边距10px */
}

/* 夜间模式 */
.nightMode .card {
    background-color: #222; /* 深灰色背景 */
    color: #fff; /* 白色文字 */
    text-shadow: 2px 2px 6px rgba(255, 255, 255, 0.1); /* 调整阴影 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* 更深的阴影 */
}

.nightMode .word {
    color: #fff; /* 白色文字 */
}

.nightMode .definition, .nightMode .phonetics {
    color: #ddd; /* 浅灰色文字 */
}

.nightMode .front, .nightMode .source {
    color: #fff; /* 白色文字 */
    background-color: #333; /* 深灰色背景 */
    border-color: #e74c3c; /* 红色边框保持不变 */
}

.nightMode .back, .nightMode .url {
    color: #fff; /* 白色文字 */
    background-color: #333; /* 深灰色背景 */
    border-color: #555; /* 黑色边框调整为深灰色 */
}

.nightMode .url a {
    color: #fff; /* 白色文字 */
}

.nightMode button.tts-button {
    color: #a7c9ff; /* 调整按钮文字颜色 */
}

.nightMode .notes {
    color: #d0d0d0; /* 调整笔记文字颜色 */
    background-color: #333; /* 深灰色背景 */
    border-left-color: #4ab0ff; /* 调整左侧边框颜色 */
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1); /* 调整阴影 */
}

.nightMode .source a {
    color: #fff; /* 白色文字 */
}

.nightMode .note {
    color: #fff;                   /* 白色字体 */
    background-color: #3a3a3a;     /* 背景色略深 */
    border-bottom-color: #4ab0ff; /* 底部下划线边框 */
    text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.1); /* 轻微文字阴影 */
}


.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;   /* 加粗 */
  margin: 20px 0;
}