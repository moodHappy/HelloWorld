背面：

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

正面：

<script>
// --- 背景色设置 ---
// 设置为 true 开启随机背景色功能 (在浅色模式下排除绿色、蓝色、紫色等)
// 设置为有效的CSS颜色字符串 (在浅色模式下使用)
// 设置为 'auto' 则根据系统深色模式自动切换 (深色模式强制为 #1E1E1E)
// 设置为 false 或其他非字符串/非 true /非 'auto' 的值则不应用特殊背景色 (使用Anki默认或CSS中定义的背景)
// #F0F8FF  爱丽丝蓝
// #FAF9F6  米白色
// #EAF3FB  浅灰蓝
// #EDF6EC  淡抹茶绿
// #F5F5DC  沙色
// #F2F2F2  浅灰
// #FFF8DC  玉米丝色
// #FFFAF0  花白色
// #F4F1EE  烟雾米
// #ECEBE4  砂岩灰
// #F3E3E8  米灰色
// #FAFAD2  淡金黄
// #FFFACD  柠檬绸
// #FFDAB9  桃仁色
// #FFEBCD  白杏仁色
// #FAF0E6  亚麻色
// #FDF5E6  旧花边色
// #F0FFF0  蜜露绿
// #FFF5EE  海贝壳色
// #F8F8FF  幽灵白
// #E0FFFF  淡青色
// #F0FFFF  蔚蓝
// #FFF0F5  薰衣草绯红
// #FFFAFA  雪白
// #F5FFFA  薄荷奶油
// #E6E6FA  淡紫罗兰
// #FBEEC1  奶油杏
// #F3E5AB  浅奶油黄
// #EDEDED  极淡灰
// #1E1E1E  夜间模式
const backgroundColorSetting = '#E0FFFF'; // <--- 在这里设置 'true'、颜色字符串、'auto' 或 'false'
// 深色模式强制背景色
const darkModeOverrideColor = '#1E1E1E';
// ---------------------
let finalBackgroundColor = null; // 存储最终需要应用的背景色
// --- HSL到Hex颜色转换函数 (标准实现) ---
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
// --- 结束 HSL到Hex颜色转换函数 ---
// 应用背景色的函数
function applyBackgroundColor(color) {
    if (color) {
        const style = document.createElement('style');
        style.innerHTML = `body, html, .card, * { background-color: ${color} !important; }`;
        // 移除之前可能存在的 style 标签，避免叠加
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
        style.setAttribute('data-background-changer', 'true'); // 添加标记，方便后续查找和移除
        document.head.appendChild(style);
    } else {
        // 如果 finalBackgroundColor 为 null，移除我们添加的 style 标签，恢复默认或 CSS 样式
        const existingStyle = document.querySelector('style[data-background-changer]');
        if (existingStyle) {
            document.head.removeChild(existingStyle);
        }
    }
}
function determineBackgroundColor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return darkModeOverrideColor; // 强制返回深色模式颜色
    } else {
        // 浅色模式下，根据 backgroundColorSetting 决定颜色
        if (typeof backgroundColorSetting === 'string' && backgroundColorSetting) {
            return backgroundColorSetting; // 使用自定义颜色
        } else if (backgroundColorSetting === true) {
            let isExcludedHue = true;
            let h, s, l;
            while (isExcludedHue) {
                h = Math.floor(Math.random() * 361);
                isExcludedHue =
                    (h >= 90 && h <= 150) ||
                    (h >= 210 && h <= 270) ||
                    (h >= 270 && h <= 330);
            }
            s = Math.floor(Math.random() * (101 - 40)) + 40;
            l = Math.floor(Math.random() * (81 - 40)) + 40;
            return hslToHex(h, s, l); // 返回随机颜色
        } else {
            return null; // 不应用特殊背景色
        }
    }
}
// 初始应用背景色
applyBackgroundColor(determineBackgroundColor());
// 监听系统颜色模式的变化
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        applyBackgroundColor(determineBackgroundColor());
    });
}
</script>
<style>
/* 将来自 two.txt 的单词变为红色，且不加粗 */
.front .red-word {
    color: red;
}
/* 将来自 one.txt 的单词变为蓝色 */
.front .blue-word {
    color: blue;
}
/* 新增：将来自 idiom.txt 的单词变为绿色 */
.front .green-word {
    color: green;
}
/* 初始化例句字段中的 i 标签为模糊效果 */
.front i {
    filter: blur(2px);
    transition: filter 0.3s ease; /* 添加平滑过渡效果 */
}
/* 为 i 标签添加一个 .unblurred 类，用于移除模糊效果 */
.front i.unblurred {
    filter: none;
}
</style>
<div class="word"></div>
<div class="phonetics">
</div>
<div class="definition" onclick="toggleBlur(this)"></div>
<div class="title">
    {{标题}}
</div>
<div class="front">
    {{例句}}
</div>
{{#来源}}
<div class="source">
    <a href="{{来源}}" target="_blank" rel="noopener noreferrer">来源</a>
</div>
{{/来源}}
<button id="exampleTTSButton" onclick="playTTS('example')" class="tts-button">▶️</button>
<script>
// 播放音频的函数
function playTTS(type) {
    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-2.vercel.app/',
    ];
    let exampleText;
    if (type === 'word') {
        exampleText = document.querySelector('.word').innerText.trim(); // 获取单词文本
    } else if (type === 'example') {
        exampleText = document.querySelector('.front').innerText.trim(); // 获取正面文本
    }
    // 如果文本为空，则返回
    if (!exampleText) {
        alert(`${type === 'word' ? '单词' : '正面'}字段为空，无法生成音频`);
        return;
    }
    // 保留空格，不去除空格
    const voice = 'en-US-EricNeural';
    // 设置语速为 0.5倍
    const speed = -20;
    // 生成查询参数
    const queryString = new URLSearchParams({
        text: exampleText, // 保留空格的文本
        voiceName: voice,
        speed: speed, // 语速设置为 -50, 对应 0.5倍速
    }).toString();
    // 检查是否已存在音频元素
    let existingAudio = document.getElementById('hiddenAudioExample');
    if (existingAudio) {
        existingAudio.remove(); // 如果存在，先移除旧的音频元素
    }
    // 创建音频元素
    const audio = document.createElement('audio');
    audio.id = 'hiddenAudioExample'; // 设置ID以便于控制
    audio.style.display = 'none'; // 隐藏音频条
    // 为每个域名生成音频源
    for (const url of domain) {
        const source = document.createElement('source');
        source.src = `${url}api/aiyue?${queryString}`;
        source.type = 'audio/mpeg';
        audio.append(source);
    }
    // 将音频元素插入页面
    document.body.append(audio);
    // 播放音频
    audio.play();
}
// 获取例句字段的元素
const exampleSentence = document.querySelector('.front');
// 检查例句字段是否有内容
if (exampleSentence.innerHTML.trim() !== "") {
    // 定义要获取的URL列表
    const URL_LIST = [
        'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/one.txt',
        'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/two.txt',
        'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/idiom.txt'
    ];
    // TODO: 在这里写入你的 JSON URL。格式如下:
    const WORD_FORMS_URL = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/stems.json'; // <--- 更新为你的 stems.json URL
    
    // 异步加载所有文件
    Promise.all([
        ...URL_LIST.map(url => fetch(url).then(r => r.text())),
        fetch(WORD_FORMS_URL).then(r => r.json())
    ])
    .then(([oneTxt, twoTxt, idiomTxt, wordForms]) => {
        const blueWords = new Set(oneTxt.split('\n').map(w => w.trim()).filter(Boolean));
        const redWords = new Set(twoTxt.split('\n').map(w => w.trim()).filter(Boolean));
        const idiomWords = new Set(idiomTxt.split('\n').map(w => w.trim()).filter(Boolean));
        
        /**
         * 辅助函数：将单词还原为基本形式。
         * 首先尝试通过规则推断，如果失败则在 stems.json 中查找。
         */
        function getWordBaseForm(word) {
            const lowerCaseWord = word.toLowerCase();
            
            // 1. 在 stems.json 中查找不规则变化
            if (wordForms[lowerCaseWord]) {
                return wordForms[lowerCaseWord];
            }
            
            // 2. 规则推断（处理常见变体）
            // 移除 's'
            if (lowerCaseWord.endsWith('s')) {
                const singularForm = lowerCaseWord.slice(0, -1);
                // 检查是否以'ss', 'is'结尾，防止误删，例如：'this'
                if (!lowerCaseWord.endsWith('ss') && !lowerCaseWord.endsWith('is')) {
                    return singularForm;
                }
            }
            
            // 移除 'es'
            if (lowerCaseWord.endsWith('es')) {
                return lowerCaseWord.slice(0, -2);
            }
            
            // 移除 'ies'
            if (lowerCaseWord.endsWith('ies')) {
                return lowerCaseWord.slice(0, -3) + 'y';
            }
            
            // 移除 'ed'
            if (lowerCaseWord.endsWith('ed')) {
                return lowerCaseWord.slice(0, -2);
            }

            // 移除 'd'
            if (lowerCaseWord.endsWith('d')) {
                return lowerCaseWord.slice(0, -1);
            }

            // 移除 'ing'
            if (lowerCaseWord.endsWith('ing')) {
                return lowerCaseWord.slice(0, -3);
            }
            
            // 3. 如果以上规则都不匹配，返回原始单词
            return lowerCaseWord;
        }

        // 辅助函数：获取例句中所有不带 HTML 标签的单词
        function getExampleWords() {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = exampleSentence.innerHTML;
            return tempDiv.innerText.toLowerCase().match(/\b\w+\b/g) || [];
        }

        // 检查一个单词或其基本形式是否在某个集合中
        function isWordInSet(word, set) {
             return set.has(word.toLowerCase()) || set.has(getWordBaseForm(word));
        }
        
        // 开始处理例句
        let originalHtml = exampleSentence.innerHTML;
        const placeholders = {};
        let i = 0;
        originalHtml = originalHtml.replace(/<i[^>]*>.*?<\/i>/g, (match) => {
            const placeholder = `__I_TAG_${i}__`;
            placeholders[placeholder] = match;
            i++;
            return placeholder;
        });

        const matchedIdioms = new Set();
        let newHtml = originalHtml;
        const exampleWords = getExampleWords();

        // 习语匹配逻辑 (最优先)
        idiomWords.forEach(idiom => {
            const idiomWordsArray = idiom.split(' ').filter(word => word.trim() !== '');
            
            // 只有当习语包含至少两个单词时才进行匹配
            if (idiomWordsArray.length >= 2) {
                const baseFormIdiomWords = idiomWordsArray.map(word => getWordBaseForm(word));
            
                // 查找习语在例句中的位置
                let startIndex = -1;
                let currentIdiomWordIndex = 0;
                for (let j = 0; j < exampleWords.length; j++) {
                    const currentExampleBaseForm = getWordBaseForm(exampleWords[j]);
                    if (currentIdiomWordIndex === 0 && currentExampleBaseForm === baseFormIdiomWords[0]) {
                        startIndex = j;
                        currentIdiomWordIndex++;
                    } else if (startIndex !== -1 && currentIdiomWordIndex < baseFormIdiomWords.length && currentExampleBaseForm === baseFormIdiomWords[currentIdiomWordIndex]) {
                        currentIdiomWordIndex++;
                    }
                    
                    if (currentIdiomWordIndex === baseFormIdiomWords.length) {
                        const endIndex = j;
                        const matchedPhrase = exampleWords.slice(startIndex, endIndex + 1).join(' ');
                        matchedIdioms.add(matchedPhrase);
                        // 找到了，跳出循环
                        break;
                    }
                }
            }
        });

        // 将匹配到的习语高亮
        matchedIdioms.forEach(phrase => {
            const regex = new RegExp(phrase.replace(/\s/g, '\\s*'), 'gi');
            newHtml = newHtml.replace(regex, `<span class="green-word">${phrase}</span>`);
        });

        // 普通单词匹配逻辑 (在习语匹配之后执行)
        const allExampleWords = newHtml.match(/\b\w+\b/g) || [];
        allExampleWords.forEach(word => {
            const lowerCaseWord = word.toLowerCase();
            let replacementHtml = word;

            if (isWordInSet(lowerCaseWord, blueWords)) {
                replacementHtml = `<span class="blue-word">${word}</span>`;
            } else if (isWordInSet(lowerCaseWord, redWords)) {
                replacementHtml = `<span class="red-word">${word}</span>`;
            }
            
            // 仅替换未被习语高亮的单词
            if (replacementHtml !== word && !newHtml.includes(`<span class="green-word">${word}</span>`)) {
                 const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
                 newHtml = newHtml.replace(wordRegex, replacementHtml);
            }
        });

        // 恢复之前临时替换的标签内容
        for (const placeholder in placeholders) {
            newHtml = newHtml.replace(placeholder, placeholders[placeholder]);
        }
        
        // 将处理后的HTML重新赋值给例句字段
        exampleSentence.innerHTML = newHtml;

        const elementsToToggle = document.querySelectorAll('.definition, .phonetics, .front i');
        elementsToToggle.forEach(element => {
            element.addEventListener('click', () => {
                element.classList.toggle('unblurred');
            });
        });
    })
    .catch(error => {
        console.error('加载远程文件时出错:', error);
    });
}
</script>