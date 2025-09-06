正面：

<div id="version-info" style="display: none;">version: 2.1.0 (Aurora)</div>

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
    // 可用的美式英语语音列表
    const voices = [
        "en-US-EricNeural",
        "en-US-JennyNeural",
        "en-US-AvaNeural",
        "en-US-SteffanNeural"   
    ];
    // 随机选择一个语音
    const voice = voices[Math.floor(Math.random() * voices.length)];
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
        'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/idiom.txt',
        // 新增：排除列表的 URL
        'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/Excluded.txt'
    ];
    // TODO: 在这里写入你的 JSON URL。格式如下:
    const WORD_FORMS_URL = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Notes/stems.json'; // <--- 更新为你的 stems.json URL

    // 异步加载所有文件
    Promise.all([
        ...URL_LIST.map(url => fetch(url).then(r => r.text())),
        fetch(WORD_FORMS_URL).then(r => r.json())
    ])
    // 修改：将所有加载结果解构为不同的变量
    .then(([oneTxt, twoTxt, idiomTxt, excludedTxt, wordForms]) => {
        const blueWords = new Set(oneTxt.split('\n').map(w => w.trim()).filter(Boolean));
        const redWords = new Set(twoTxt.split('\n').map(w => w.trim()).filter(Boolean));
        const idiomWords = new Set(idiomTxt.split('\n').map(w => w.trim()).filter(Boolean));
        // 新增：创建排除列表的 Set
        const excludedWords = new Set(excludedTxt.split('\n').map(w => w.trim()).filter(Boolean));

        const isConsonant = (char) => {
            const vowels = 'aeiou';
            return vowels.indexOf(char.toLowerCase()) === -1 && char.match(/[a-z]/i);
        };

        const endsWithCVC = (word) => {
            if (word.length < 3) return false;
            const c1 = word[word.length - 3];
            const v = word[word.length - 2];
            const c2 = word[word.length - 1];
            return isConsonant(c1) && 'aeiou'.includes(v) && isConsonant(c2) && !['w','x','y'].includes(c2);
        };

        // 新增的 getWordBaseForms 函数（来自2025.9.4版本）
        function getWordBaseForms(word, wordForms, isExcludedCheck = false) { // 增加一个参数
            const lowerCaseWord = word.toLowerCase();
            const len = lowerCaseWord.length;
            const baseForms = new Set([lowerCaseWord]); // 总是包含原始词的标准化形式
            
            // 修复：只在进行普通单词高亮时，才检查排除列表
            if (!isExcludedCheck && excludedWords.has(lowerCaseWord)) {
                 return [];
            }


            // 1. 优先从 JSON 映射中查找
            if (wordForms[lowerCaseWord]) {
                baseForms.add(wordForms[lowerCaseWord]);
            }

            // 2. 形容词比较级 / 最高级
            if (len > 3) {
                if (lowerCaseWord.endsWith('er')) {
                    if (lowerCaseWord.endsWith('ier')) baseForms.add(lowerCaseWord.slice(0, len - 3) + 'y');
                    const base = lowerCaseWord.slice(0, len - 2);
                    if (endsWithCVC(base)) baseForms.add(lowerCaseWord.slice(0, len - 3));
                    baseForms.add(base);
                }
                if (lowerCaseWord.endsWith('est')) {
                    if (lowerCaseWord.endsWith('iest')) baseForms.add(lowerCaseWord.slice(0, len - 4) + 'y');
                    const base = lowerCaseWord.slice(0, len - 3);
                    if (endsWithCVC(base)) baseForms.add(lowerCaseWord.slice(0, len - 4));
                    baseForms.add(base);
                }
            }

            // 3. 动词过去式 / 过去分词
            if (len > 2 && lowerCaseWord.endsWith('ed')) {
                // 修复：处理以 'e' 结尾的单词，如 'grooved' -> 'groove'
                const base = lowerCaseWord.slice(0, len - 1);
                baseForms.add(base);

                // 旧的逻辑 (仍保留以兼容其他情况)
                if (lowerCaseWord.endsWith('ied')) baseForms.add(lowerCaseWord.slice(0, len - 3) + 'y');
                let base2 = lowerCaseWord.slice(0, len - 2);
                if (endsWithCVC(base2)) baseForms.add(lowerCaseWord.slice(0, len - 3));
                if (base2.endsWith('e')) baseForms.add(base2);
                baseForms.add(base2);
            }

            // 4. 动词现在分词 -ing
            if (len > 3 && lowerCaseWord.endsWith('ing')) {
                // 修复：处理以 'e' 结尾的单词，如 'rejuvenating' -> 'rejuvenate'
                const base = lowerCaseWord.slice(0, len - 3) + 'e';
                baseForms.add(base);

                // 旧的逻辑 (仍保留以兼容其他情况)
                const stem = lowerCaseWord.slice(0, len - 3);
                const stemLen = stem.length;
                if (stemLen > 1 && isConsonant(stem[stemLen - 1]) && stem[stemLen - 1] === stem[stemLen - 2]) {
                    baseForms.add(stem.slice(0, stemLen - 1));
                }
                if (stem.endsWith('e')) {
                    baseForms.add(stem.slice(0, -1));
                }
                baseForms.add(stem);
            }

            // 5. 副词
            if (len > 2 && lowerCaseWord.endsWith('ly')) {
                if (lowerCaseWord.endsWith('ily')) baseForms.add(lowerCaseWord.slice(0, len - 3) + 'y');
                if (lowerCaseWord.endsWith('ically')) baseForms.add(lowerCaseWord.slice(0, len - 5));
                baseForms.add(lowerCaseWord.slice(0, len - 2));
            }

            // 6. 名词复数 & 动词单三形式
            if (len > 1 && lowerCaseWord.endsWith('s')) {
                // 修复：简单处理大部分情况，去掉 's' 或 'es'
                baseForms.add(lowerCaseWord.slice(0, len - 1));

                // 旧的逻辑 (仍保留以兼容其他情况)
                if (lowerCaseWord.endsWith('ies') && !'aeiou'.includes(lowerCaseWord[len - 4])) baseForms.add(lowerCaseWord.slice(0, len - 3) + 'y');
                if (lowerCaseWord.endsWith('es')) {
                    const ch = lowerCaseWord[len - 3];
                    if (['s', 'x', 'z'].includes(ch) || lowerCaseWord.slice(len - 4, len - 2) === 'ch' || lowerCaseWord.slice(len - 4, len - 2) === 'sh') {
                        baseForms.add(lowerCaseWord.slice(0, len - 2));
                    }
                }
                if (!lowerCaseWord.endsWith('ss')) baseForms.add(lowerCaseWord.slice(0, len - 1));
            }

            return Array.from(baseForms).filter(b => b && b.length > 0);
        }

        // isWordInSet 函数现在检查所有可能的词根
        function isWordInSet(word, set, wordForms) {
            // 修改：调用时传入一个标志，表示是习语检查还是普通单词检查
            const baseForms = getWordBaseForms(word, wordForms, true);
            // 检查 getWordBaseForms 返回的数组是否为空，如果为空则直接返回 false
            if (baseForms.length === 0) {
                 return false;
            }
            for (const base of baseForms) {
                if (set.has(base)) {
                    return true;
                }
            }
            return false;
        }
        // 辅助函数：获取例句中所有不带 HTML 标签的单词
        function getExampleWords() {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = exampleSentence.innerHTML;
            return tempDiv.innerText.toLowerCase().match(/\b\w+\b/g) || [];
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

        // 习语匹配逻辑 (来自2025.9.4版本，能够匹配多个习语)
        idiomWords.forEach(idiom => {
            const idiomWordsArray = idiom.split(' ').filter(word => word.trim() !== '');

            // 只有当习语包含至少两个单词时才进行匹配
            if (idiomWordsArray.length >= 2) {
                // 修改：在获取习语词根时，忽略排除列表的检查
                const baseFormIdiomWords = idiomWordsArray.map(word => getWordBaseForms(word, wordForms, true)).flat();

                // 查找习语在例句中的所有位置
                for (let j = 0; j <= exampleWords.length - idiomWordsArray.length; j++) {
                    let isMatch = true;
                    for (let k = 0; k < idiomWordsArray.length; k++) {
                        const currentExampleBaseForms = getWordBaseForms(exampleWords[j + k], wordForms, true); // 修复：这里也应该忽略排除列表检查
                        // 检查当前例句词的任何一个词根是否与当前习语词的词根匹配
                        const wordMatch = currentExampleBaseForms.some(baseForm => {
                            return baseFormIdiomWords.includes(baseForm);
                        });
                        if (!wordMatch) {
                            isMatch = false;
                            break;
                        }
                    }

                    if (isMatch) {
                        const matchedPhrase = exampleWords.slice(j, j + idiomWordsArray.length).join(' ');
                        matchedIdioms.add(matchedPhrase);
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

            // 新增：在进行高亮前，先检查单词是否在排除列表中
            // 修复：现在这里才进行排除列表检查
            if (excludedWords.has(lowerCaseWord)) {
                 return; // 如果在排除列表里，直接跳过当前循环
            }

            if (isWordInSet(lowerCaseWord, blueWords, wordForms)) {
                replacementHtml = `<span class="blue-word">${word}</span>`;
            } else if (isWordInSet(lowerCaseWord, redWords, wordForms)) {
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