背面：

<div class="card">


{{FrontSide}}


{{片假名}}
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation blurred" onclick="toggleBlur(this)">{{例句翻译}}
</div>


<style>
  .translation {
    display: inline-block; /* 让它更自然地占位 */
    cursor: pointer; /* 鼠标指针变成可点击 */
    transition: filter 0.3s ease-in-out; /* 平滑过渡 */
  }

  .blurred {
    filter: blur(5px); /* 初始模糊 */
  }
</style>

<script>
  // 确保脚本在 Anki 加载完成后执行
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".translation").forEach(el => {
      el.addEventListener("click", function () {
        this.classList.toggle("blurred"); // 切换模糊状态
      });
    });
  });
</script>



<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>
{{#Source-news}}
<div class="source-news">
<div class="news-title">News</div>
<hr style="border: 1px solid grey;">


<script>
function createLink() {
var field = "{{Source-news}}"; // 确保字段名称与实际一致
var parts = field.split('|');
if (parts.length === 2) {
document.getElementById('link').innerHTML = '<a href="' + parts[0] + '" target="_blank">' + parts[1] + '</a>';
} else {
document.getElementById('link').innerHTML = field; // 如果格式不正确，则直接显示内容
}
}
window.onload = createLink;
</script>
<div id="link"></div>
</div>
{{/Source-news}}
<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter</a>
</div>
<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>
<div id="resource1" class="resource-content">




<div class="mammoth-memory">
    <a href="https://mammothmemory.net/search/?q={{单词}}" target="_blank">Mammoth Memory</a>
</div>

<div class="thread">
    <a href="https://www.threads.net/search?q={{单词}}" target="_blank">thread</a>
</div>


<div class="spotify">
    <a href="spotify:search:{{单词}}" target="_blank">Spotify</a>
</div>


<div class="reddit">
<a href="https://www.reddit.com/search/?q={{单词}}" target="_blank">Reddit</a>

<div class="youdao">
    <a href="https://dict.youdao.com/m/result?word={{单词}}&lang=en" target="_blank">有道词典</a>
</div>

<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">GIPHY</a>
</div>

<div class="vocabulary">
<a href="https://www.vocabulary.com/dictionary/{{单词}}" target="_blank">Vocabulary</a>
</div>

<div class="picture">
<a href="https://www.google.com/search?tbm=isch&q={{单词}}" target="_blank">谷歌搜图</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌新闻</a>
</div>

<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">YouTube</a>
</div>

<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">Threads</a>
</div>


<div class="TwitterWeb">
<a href="#" onclick="searchTwitter()">TwitterWeb</a>
</div>

<div class="TwitterApp">
<a href="twitter://search?query={{单词}}" target="_blank">TwitterApp</a>
</div>


<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%88%E4%BD%93/{{单词}}" target="_blank">Cambridge</a>
</div>

<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>

<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>

<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>

<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>

<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>


{{image}}

<div class="notes">
{{笔记}}<br>
</div>
<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}
// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});
// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();
var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');
var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});
notesElement.innerHTML = formattedNotes;
// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";
if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>





<div class="bottom-container">

</div>
<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整
// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});
</script>
<script>
function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}
document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID
if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});
</script>
<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>






<!-- 
<iframe id="youdao_iframe" class="lt-iframe"    
        src="https://dict.youdao.com/m/search?q={{单词}}#bd"    
        style="width:100%; height:500px;"></iframe>  

-->










<script>
// 等待 DOM 完全加载
document.addEventListener("DOMContentLoaded", function() {
  // 获取正面字段的文本内容
  const frontText = document.querySelector('.typing-effect') ? document.querySelector('.typing-effect').textContent.trim() : '';  // 获取正面内容
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


背面：

<div class="card">


{{FrontSide}}


{{片假名}}
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation blurred" onclick="toggleBlur(this)">{{例句翻译}}
</div>


<style>
  .translation {
    display: inline-block; /* 让它更自然地占位 */
    cursor: pointer; /* 鼠标指针变成可点击 */
    transition: filter 0.3s ease-in-out; /* 平滑过渡 */
  }

  .blurred {
    filter: blur(5px); /* 初始模糊 */
  }
</style>

<script>
  // 确保脚本在 Anki 加载完成后执行
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".translation").forEach(el => {
      el.addEventListener("click", function () {
        this.classList.toggle("blurred"); // 切换模糊状态
      });
    });
  });
</script>



<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>
{{#Source-news}}
<div class="source-news">
<div class="news-title">News</div>
<hr style="border: 1px solid grey;">


<script>
function createLink() {
var field = "{{Source-news}}"; // 确保字段名称与实际一致
var parts = field.split('|');
if (parts.length === 2) {
document.getElementById('link').innerHTML = '<a href="' + parts[0] + '" target="_blank">' + parts[1] + '</a>';
} else {
document.getElementById('link').innerHTML = field; // 如果格式不正确，则直接显示内容
}
}
window.onload = createLink;
</script>
<div id="link"></div>
</div>
{{/Source-news}}
<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter</a>
</div>
<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>
<div id="resource1" class="resource-content">




<div class="mammoth-memory">
    <a href="https://mammothmemory.net/search/?q={{单词}}" target="_blank">Mammoth Memory</a>
</div>

<div class="thread">
    <a href="https://www.threads.net/search?q={{单词}}" target="_blank">thread</a>
</div>


<div class="spotify">
    <a href="spotify:search:{{单词}}" target="_blank">Spotify</a>
</div>


<div class="reddit">
<a href="https://www.reddit.com/search/?q={{单词}}" target="_blank">Reddit</a>

<div class="youdao">
    <a href="https://dict.youdao.com/m/result?word={{单词}}&lang=en" target="_blank">有道词典</a>
</div>

<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">GIPHY</a>
</div>

<div class="vocabulary">
<a href="https://www.vocabulary.com/dictionary/{{单词}}" target="_blank">Vocabulary</a>
</div>

<div class="picture">
<a href="https://www.google.com/search?tbm=isch&q={{单词}}" target="_blank">谷歌搜图</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌新闻</a>
</div>

<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">YouTube</a>
</div>

<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">Threads</a>
</div>


<div class="TwitterWeb">
<a href="#" onclick="searchTwitter()">TwitterWeb</a>
</div>

<div class="TwitterApp">
<a href="twitter://search?query={{单词}}" target="_blank">TwitterApp</a>
</div>


<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%88%E4%BD%93/{{单词}}" target="_blank">Cambridge</a>
</div>

<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>

<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>

<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>

<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>

<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>


{{image}}

<div class="notes">
{{笔记}}<br>
</div>
<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}
// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});
// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();
var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');
var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});
notesElement.innerHTML = formattedNotes;
// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";
if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>





<div class="bottom-container">

</div>
<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整
// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});
</script>
<script>
function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}
document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID
if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});
</script>
<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>






<!-- 
<iframe id="youdao_iframe" class="lt-iframe"    
        src="https://dict.youdao.com/m/search?q={{单词}}#bd"    
        style="width:100%; height:500px;"></iframe>  

-->










<script>
// 等待 DOM 完全加载
document.addEventListener("DOMContentLoaded", function() {
  // 获取正面字段的文本内容
  const frontText = document.querySelector('.typing-effect') ? document.querySelector('.typing-effect').textContent.trim() : '';  // 获取正面内容
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
                content: "你是一个智能助手，请用中文分析下面的单词，按照以下要求：\n1. 提供一个典型英文例句附中文。\n2. 列出常用的固定搭配，简要说明它们的用法，并例句附中文，"
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





背面：
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Anki Card Template</title>
<link href="https://fonts.googleapis.com/css2?family=PingFang+SC&family=Roboto:wght@700&family=Lobster&display=swap" rel="stylesheet">
</head>
<body>
<div class="card">


{{FrontSide}}



{{片假名}}
<div class="definition">{{释义}}</div>
<div class="example">{{例句}}</div>
<div class="translation blurred" onclick="toggleBlur(this)">{{例句翻译}}
</div>


<style>
  .translation {
    display: inline-block; /* 让它更自然地占位 */
    cursor: pointer; /* 鼠标指针变成可点击 */
    transition: filter 0.3s ease-in-out; /* 平滑过渡 */
  }

  .blurred {
    filter: blur(5px); /* 初始模糊 */
  }
</style>

<script>
  // 确保脚本在 Anki 加载完成后执行
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".translation").forEach(el => {
      el.addEventListener("click", function () {
        this.classList.toggle("blurred"); // 切换模糊状态
      });
    });
  });
</script>



<a href="https://www.playphrase.me/#/search?q={{单词}}&language=en" class="source-link">{{单词}}</a>
</div>
{{#Source-news}}
<div class="source-news">
<div class="news-title">News</div>
<hr style="border: 1px solid grey;">


<script>
function createLink() {
var field = "{{Source-news}}"; // 确保字段名称与实际一致
var parts = field.split('|');
if (parts.length === 2) {
document.getElementById('link').innerHTML = '<a href="' + parts[0] + '" target="_blank">' + parts[1] + '</a>';
} else {
document.getElementById('link').innerHTML = field; // 如果格式不正确，则直接显示内容
}
}
window.onload = createLink;
</script>
<div id="link"></div>
</div>
{{/Source-news}}
<div class="Twitter-header">
<a href="#" onclick="searchTwitter()">Twitter</a>
</div>
<div class="resources">
<div class="resource-header">点击展开/折叠资源链接</div>
<div id="resource1" class="resource-content">




<div class="mammoth-memory">
    <a href="https://mammothmemory.net/search/?q={{单词}}" target="_blank">Mammoth Memory</a>
</div>

<div class="thread">
    <a href="https://www.threads.net/search?q={{单词}}" target="_blank">thread</a>
</div>


<div class="spotify">
    <a href="spotify:search:{{单词}}" target="_blank">Spotify</a>
</div>


<div class="reddit">
<a href="https://www.reddit.com/search/?q={{单词}}" target="_blank">Reddit</a>

<div class="youdao">
    <a href="https://dict.youdao.com/m/result?word={{单词}}&lang=en" target="_blank">有道词典</a>
</div>

<div class="giphy">
<a href="https://giphy.com/search/{{单词}}" target="_blank">GIPHY</a>
</div>

<div class="vocabulary">
<a href="https://www.vocabulary.com/dictionary/{{单词}}" target="_blank">Vocabulary</a>
</div>

<div class="picture">
<a href="https://www.google.com/search?tbm=isch&q={{单词}}" target="_blank">谷歌搜图</a>
</div>

<div class="dictionary">
<a href="https://news.google.com/search?q={{单词}}&hl=en" target="_blank">谷歌新闻</a>
</div>

<a href="https://www.youtube.com/results?search_query={{单词}}" target="_blank">YouTube</a>
</div>

<div class="Threads">
<a href="https://www.threads.net/search?q={{单词}}" target="_blank">Threads</a>
</div>


<div class="TwitterWeb">
<a href="#" onclick="searchTwitter()">TwitterWeb</a>
</div>

<div class="TwitterApp">
<a href="twitter://search?query={{单词}}" target="_blank">TwitterApp</a>
</div>


<div class="dictionary">
<a href="https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/{{单词}}" target="_blank">Cambridge</a>
</div>

<div class="dictionary">
<a href="https://www.oxfordlearnersdictionaries.com/definition/english/{{单词}}" target="_blank">Oxford</a>
</div>

<div class="dictionary">
<a href="https://www.merriam-webster.com/dictionary/{{单词}}" target="_blank">Merriam</a>
</div>

<div class="dictionary">
<a href="https://www.macmillandictionary.com/dictionary/british/{{单词}}" target="_blank">Macmillan</a>
</div>

<div class="dictionary">
<a href="https://en.wiktionary.org/wiki/{{单词}}" target="_blank">Wiktionary</a>
</div>

<div class="dictionary">
<a href="https://www.wordreference.com/enzh/{{单词}}" target="_blank">WordReference</a>
</div>
</div>

<div class="notes">
{{笔记}}<br>
</div>
<div id="video-container" class="video-container">
<iframe src="https://www.youtube.com/embed/{{YouTube-Video}}" frameborder="0" allowfullscreen></iframe>
</div>
<script>
document.addEventListener("DOMContentLoaded", function() {
// Toggle content display
function toggleContent(id) {
var content = document.getElementById(id);
if (content.style.display === "none" || content.style.display === "") {
content.style.display = "block";
} else {
content.style.display = "none";
}
}
// Attach click event to resource header
var resourceHeader = document.querySelector(".resource-header");
resourceHeader.addEventListener("click", function() {
toggleContent('resource1');
});
// Highlight word forms in notes
var wordElement = document.querySelector(".word");
var notesElement = document.querySelector(".notes");
var wordText = wordElement.textContent.trim().toLowerCase().replace(/\s+/g, '');
var notesText = notesElement.innerHTML.trim();
var wordFormsRegex = new RegExp('\\b(' +
wordText + '|' +
wordText + 's?' + '|' +
wordText.replace(/y$/, 'i') + 'es?' + '|' +
wordText + 'ed' + '|' +
wordText + 'ing' + '|' +
wordText + 'd' + '|' +
wordText + 'er' + '|' +
wordText + 'est' + '|' +
wordText + 'ly' + '|' +
wordText.replace(/y$/, 'ily') + '|' +
wordText.replace(/ic$/, 'ically') + '|' +
wordText.replace(/le$/, 'ly') +
')\\b', 'gi');
var formattedNotes = notesText.replace(wordFormsRegex, function(match) {
return '<strong class="highlight">' + match + '</strong>';
});
notesElement.innerHTML = formattedNotes;
// Hide video container if no source URL
var videoContainer = document.getElementById("video-container");
var sourceURL = "{{YouTube-Video}}";
if (!sourceURL) {
videoContainer.style.display = "none";
}
});
</script>
<script>
document.addEventListener('DOMContentLoaded', function() {
const iframe = document.querySelector('#video-container iframe');
if (iframe) {
let src = iframe.src;
src = src.replace('https://youtu.be/', '');
iframe.src = src;
}
});
</script>





<!-- 插入本地语音代码开始 -->
<div class="bottom-container">

</div>
<!-- 插入本地语音代码结束 -->







<div class="responsive-iframe">
<iframe frameborder="0" id="dailymotion-video" src="https://www.dailymotion.com/embed/video/{{Dailymotion-Video}}" allowfullscreen></iframe>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
// 获取 dailymotion-Video 字段的值
var dailymotionVideoId = document.querySelector('#dailymotion-video').src.split('/').pop(); // 示例：获取视频 ID，实际值需要调整
// 如果视频 ID 为空，则移除包含 iframe 的 div
if (!dailymotionVideoId) {
var videoContainer = document.querySelector('.responsive-iframe');
if (videoContainer) {
videoContainer.parentNode.removeChild(videoContainer);
}
}
});
</script>
<script>
function getVideoId(url) {
// 匹配 dailymotion 视频 URL 并提取视频 ID
const match = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
return match ? match[1] : '';
}
document.addEventListener('DOMContentLoaded', () => {
const dailymotionVideo = '{{Dailymotion-Video}}'; // 获取 dailymotion-Video 字段内容
const videoId = getVideoId(dailymotionVideo); // 提取视频 ID
if (videoId) {
// 将 iframe 的 src 属性设置为提取到的视频 ID
document.getElementById('dailymotion-video').src = `https://www.dailymotion.com/embed/video/${videoId}`;
}
});
</script>
<script>
function searchTwitter() {
window.open("https://twitter.com/search?q=" + encodeURIComponent("{{单词}}"), "_blank");
}
</script>
</body>
</html>


<iframe id="youdao_iframe" class="lt-iframe" 
        src="https://dict.youdao.com/m/search?q={{单词}}#bd" 
        style="width:100%; height:500px;"></iframe>

正面：
<!DOCTYPE html>  
<html lang="en">    
<head>    
    <meta charset="UTF-8">    
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    
    <title>Smooth</title>    
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PingFang+SC&display=swap">    
</head>    
<body>    
    <div class="card">    
        <div class="word typing-effect" id="animated-text"></div>    
        <div class="phonetic" id="phonetic-text"></div>    
    </div>  
    <!-- 播放按钮，播放单词 -->    
    <button class="btn" id="playWordButton" onclick="playWordTTS()">▶️</button>    
    <!-- 播放按钮，播放例句 -->    
    <button class="btn" id="playExampleButton" onclick="playExampleTTS()">▶️</button>

<script>    
    const word = "{{单词}}";    
    const language = "{{语种}}".trim(); // 语种字段    
    const container = document.getElementById("animated-text");    
    const phoneticContainer = document.getElementById("phonetic-text");    
  
    const eudicURL = `eudic://dict/${word}`;    
    let index = 0;    

    function typeLetter() {    
        if (index < word.length) {    
            container.innerHTML = `<a href="${eudicURL}" style="color: inherit; text-decoration: none;">${word.substring(0, index + 1)}</a>`;    
            index++;    
            setTimeout(typeLetter, 500);    
        } else {    
            container.style.borderRight = 'none';    
        }    
    }    
  
    phoneticContainer.textContent = "{{IPA}}";    
    typeLetter();    

    // 语言映射表    
    const voiceMap = {
        "de": "de-DE-ConradNeural",
        "es": "es-ES-AlvaroNeural",
        "it": "it-IT-DiegoNeural",
        "hi": "hi-IN-MadhurNeural",
        "ko": "ko-KR-SunHiNeural",
        "fr": "fr-FR-DeniseNeural",
        "ru": "ru-RU-DmitryNeural",
        "he": "he-IL-AvriNeural",
        "": "en-US-EricNeural" // 默认英语
    };

    const selectedVoice = voiceMap[language] || "en-US-EricNeural";    

    function playTTS(text, audioId) {    
        const domain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];    

        if (!text) {    
            alert('文本为空，无法生成音频');    
            return;    
        }    

        const queryString = new URLSearchParams({    
            text: text.trim(),    
            voiceName: selectedVoice,    
            speed: 0,    
        }).toString();    

        let existingAudio = document.getElementById(audioId);    
        if (existingAudio) {    
            existingAudio.remove();    
        }    

        const audio = document.createElement('audio');    
        audio.id = audioId;    
        audio.style.display = 'none';    

        for (const url of domain) {    
            const source = document.createElement('source');    
            source.src = `${url}api/aiyue?${queryString}`;    
            source.type = 'audio/mpeg';    
            audio.append(source);    
        }    

        document.body.append(audio);    
        audio.play();    
    }    

    function playWordTTS() {    
        playTTS(word, 'hiddenAudioWord');    
    }    

    function playExampleTTS() {    
        const exampleText = document.querySelector('.example')?.innerText?.trim();    
        playTTS(exampleText, 'hiddenAudioExample');    
    }    

    // 设置播放按钮样式    
    const playWordButton = document.getElementById('playWordButton');    
    const playExampleButton = document.getElementById('playExampleButton');    

    playWordButton.style.position = 'fixed';    
    playWordButton.style.bottom = '260px';    
    playWordButton.style.left = '50%';    
    playWordButton.style.transform = 'translateX(-50%)';    

    playExampleButton.style.position = 'fixed';    
    playExampleButton.style.bottom = '200px';    
    playExampleButton.style.left = '50%';    
    playExampleButton.style.transform = 'translateX(-50%)';    

    window.onload = function() {    
        playWordTTS();    
    };    
</script>  
</body>    
</html>

{{语种}}

