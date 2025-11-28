弹出释义：

<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/animations/shift-away.css"/>
<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/light-border.css"/>

<style>
    /* 单词交互样式 */
    .anki-word {
        cursor: pointer;
        border-bottom: 1px dashed #999; /* 虚线表示可点击查词 */
        transition: all 0.2s ease;
        padding: 0 1px;
    }

    /* 悬停/点击高亮 */
    .anki-word:hover, .anki-word[aria-expanded="true"] {
        background-color: #E3F2FD;
        border-bottom: 2px solid #2196F3;
        color: #1565C0;
        border-radius: 3px;
    }

    /* 弹窗内容容器 - 迷你词典风 */
    .dict-popup {
        text-align: left;
        font-size: 14px;
        line-height: 1.5;
        max-width: 280px;
        color: #333;
    }

    .dict-header {
        font-weight: bold;
        color: #D32F2F; /* 红色标题 */
        font-size: 16px;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .dict-phonetic {
        color: #777;
        font-weight: normal;
        font-size: 13px;
        font-family: monospace;
    }

    .dict-pos-block {
        margin-bottom: 6px;
    }

    .dict-pos-tag {
        font-style: italic;
        color: #1976D2; /* 蓝色词性 */
        font-weight: bold;
        font-size: 12px;
        margin-right: 4px;
    }

    .dict-def-list {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    
    .dict-def-item {
        display: inline;
    }
    
    .dict-def-item::after {
        content: "; ";
        color: #999;
    }
    .dict-def-item:last-child::after {
        content: "";
    }

    .dict-loading {
        color: #666;
        font-style: italic;
        font-size: 12px;
    }
    
    /* 隐藏播放器 */
    #hiddenAudio { display: none; }
</style>

<span class="btn" id="playBackButton" style="font-size: 24px; cursor: pointer; opacity: 0.8;">🗣️</span>

<div class="front-text" id="frontTextContainer">{{Front}}</div>

<script>
    // --- 核心功能：在线查词 ---
    function initDictionary() {
        const container = document.getElementById('frontTextContainer');
        if (!container) return;

        // 1. 单词切分
        const text = container.innerText;
        // 匹配单词，忽略标点
        container.innerHTML = text.replace(/([a-zA-Z0-9']+)/g, '<span class="anki-word">$1</span>');

        // 2. 配置 Tippy
        tippy('.anki-word', {
            trigger: 'click',
            interactive: true,
            theme: 'light-border',
            placement: 'bottom',
            animation: 'shift-away',
            appendTo: document.body,
            allowHTML: true,
            maxWidth: 300,
            
            // 每次点击触发
            onShow(instance) {
                const word = instance.reference.innerText.trim();
                
                // 显示加载状态
                instance.setContent('<div class="dict-popup"><span class="dict-loading">🔍 Searching...</span></div>');

                // 3. 调用 API 获取释义
                fetchTranslation(word)
                    .then(data => {
                        const html = formatDictData(word, data);
                        instance.setContent(html);
                    })
                    .catch(err => {
                        console.error(err);
                        instance.setContent('<div class="dict-popup" style="color:red">Network Error / Not Found</div>');
                    });
            }
        });
    }

    // --- 辅助函数：调用 Google Translate API ---
    async function fetchTranslation(text) {
        // client=gtx: 免费客户端标识
        // sl=en: 源语言英语
        // tl=zh-CN: 目标语言中文
        // dt=t: 简单翻译
        // dt=bd: 词典释义 (重点)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
    }

    // --- 辅助函数：格式化 API 返回的 JSON 数据 ---
    function formatDictData(originalWord, data) {
        let html = `<div class="dict-popup">`;
        
        // data[0][0][0] 是最基础的翻译
        const basicTrans = data[0] && data[0][0] ? data[0][0][0] : '';
        
        // 头部：单词 + 基础翻译
        html += `<div class="dict-header">
                    <span>${originalWord}</span>
                    <span style="font-size:14px; font-weight:normal; color:#555">${basicTrans}</span>
                 </div>`;

        // data[1] 包含详细词典分类 (名词, 动词等)
        const dictEntries = data[1];

        if (dictEntries && dictEntries.length > 0) {
            // 遍历词性 (noun, verb...)
            dictEntries.forEach(entry => {
                const pos = entry[0]; // 词性
                const defs = entry[1]; // 释义数组
                
                // 只取前 4 个释义，防止太长
                const displayDefs = defs.slice(0, 4);

                html += `<div class="dict-pos-block">
                            <span class="dict-pos-tag">${pos}.</span>
                            <ul class="dict-def-list">`;
                
                displayDefs.forEach(def => {
                    html += `<li class="dict-def-item">${def}</li>`;
                });
                
                html += `</ul></div>`;
            });
        } else {
            // 如果没有详细词典，只显示一个简单的提示
            if(!basicTrans) {
                html += `<div style="padding:5px">No definition found.</div>`;
            }
        }

        html += `</div>`;
        return html;
    }

    // --- 保持不变的 TTS 逻辑 ---
    function playTTS(type) {
        const domains = [
          'https://ms-ra-forwarder-for-ifreetime-2.vercel.app', 
          'https://libre-tts-nu.vercel.app/' 
        ];

        let textToRead = '';
        if (type === 'front') {
          let frontText = document.querySelector('.front-text').innerText.trim();
          if (!frontText) return;
          textToRead = frontText;
        }
        const voice = 'en-US-EricNeural';

        function createAndPlayAudio(domainIndex) {
          if (domainIndex >= domains.length) {
            console.log('TTS Failed');
            return;
          }

          const domain = domains[domainIndex];
          let src = '';

          if (domain.includes('aiyue')) {
            const queryString = new URLSearchParams({
              text: textToRead,
              voiceName: voice,
              speed: 0,
            }).toString();
            src = `${domain}api/aiyue?${queryString}`;
          } else {
            src = `${domain}api/tts?t=${encodeURIComponent(textToRead)}&v=${encodeURIComponent(voice)}&r=0&p=0`;
          }
          
          let existingAudio = document.getElementById('hiddenAudio');
          if (existingAudio) existingAudio.remove();

          const audio = document.createElement('audio');
          audio.id = 'hiddenAudio';
          audio.style.display = 'none';
          audio.crossOrigin = 'anonymous'; 

          const source = document.createElement('source');
          source.src = src;
          source.type = 'audio/mpeg';
          audio.append(source);
          document.body.append(audio);

          audio.onerror = () => createAndPlayAudio(domainIndex + 1);
          audio.play().catch(e => createAndPlayAudio(domainIndex + 1));
        }
        createAndPlayAudio(0);
    }

    const playBackButton = document.getElementById('playBackButton');
    playBackButton.style.position = 'fixed';
    playBackButton.style.bottom = '250px';
    playBackButton.style.left = '50%';
    playBackButton.style.transform = 'translateX(-50%)';
    playBackButton.style.zIndex = '999';

    playBackButton.addEventListener('click', function() {
        playTTS('front');
    });

    // --- 初始化入口 ---
    setTimeout(() => {
        initDictionary();
        playTTS('front');
    }, 500);

</script>


弹出变形：

弹出变形：

<script src="https://unpkg.com/compromise"></script>

<script src="https://unpkg.com/@popperjs/core@2"></script>
<script src="https://unpkg.com/tippy.js@6"></script>
<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/animations/scale.css"/>
<link rel="stylesheet" href="https://unpkg.com/tippy.js@6/themes/light.css"/>

<style>
    /* 单词样式 */
    .anki-word {
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        padding: 0 2px;
        border-radius: 4px;
        display: inline-block;
    }

    /* 悬停/点击高亮 */
    .anki-word:hover, .anki-word[aria-expanded="true"] {
        background-color: rgba(33, 150, 243, 0.15);
        border-bottom: 2px solid #2196F3;
        color: #0D47A1;
    }

    /* 弹窗内容容器 */
    .nlp-popup {
        text-align: left;
        font-size: 14px;
        line-height: 1.6;
        min-width: 140px;
    }

    .nlp-header {
        font-weight: bold;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;
        margin-bottom: 4px;
        font-size: 15px;
    }

    .nlp-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nlp-list li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2px;
    }

    .nlp-label {
        color: #888;
        font-size: 12px;
        font-weight: bold;
        margin-right: 12px;
    }

    .nlp-val {
        color: #2196F3;
        font-weight: 500;
        text-align: right;
    }
    
    /* 隐藏播放器 */
    #hiddenAudio { display: none; }
</style>

<span class="btn" id="playBackButton" style="font-size: 24px; cursor: pointer; opacity: 0.8;">🗣️</span>

<div class="front-text" id="frontTextContainer">{{Front}}</div>

<script>
    // --- NLP & Tippy 交互逻辑 ---
    function initNLP() {
        const container = document.getElementById('frontTextContainer');
        if (!container) return;

        // 1. 单词切分 (Tokenize)
        // 将文本拆分为单词并包裹 span，保留符号
        const text = container.innerText;
        container.innerHTML = text.replace(/([a-zA-Z0-9']+)/g, '<span class="anki-word">$1</span>');

        // 2. 配置 Tippy
        tippy('.anki-word', {
            trigger: 'click',      // 点击触发
            interactive: true,     // 允许选中弹窗文字
            theme: 'light',        // 亮色主题
            placement: 'bottom',   // 弹窗位置
            animation: 'scale',    // 动画效果
            appendTo: document.body,
            allowHTML: true,       // 允许 HTML
            maxWidth: 350,
            
            // 每次点击时动态生成内容
            onShow(instance) {
                const word = instance.reference.innerText.trim();
                
                // 检查 NLP 库是否加载成功
                if (typeof nlp === 'undefined') {
                    instance.setContent('<div class="nlp-popup">NLP library loading...</div>');
                    return;
                }

                // === Compromise 分析开始 ===
                const doc = nlp(word);
                doc.compute('root'); // 计算词根
                
                const json = doc.json()[0];
                if (!json) {
                    instance.setContent('No data');
                    return;
                }

                // 构建 HTML
                let html = `<div class="nlp-popup"><div class="nlp-header">${word}</div><ul class="nlp-list">`;
                let foundData = false;

                // 1. 原形 (Lemma/Root)
                const root = json.terms[0].root || null;
                if (root && root.toLowerCase() !== word.toLowerCase()) {
                    html += `<li><span class="nlp-label">原形</span><span class="nlp-val">${root}</span></li>`;
                    foundData = true;
                }

                // 2. 动词变位 (Verb Conjugation)
                // 即使是名词，也尝试变位看看 (比如 "book" -> "booked")
                const verbs = nlp(root || word).verbs().conjugate()[0];
                if (verbs) {
                    if (verbs.PastTense && verbs.PastTense !== word) {
                        html += `<li><span class="nlp-label">过去式</span><span class="nlp-val">${verbs.PastTense}</span></li>`;
                        foundData = true;
                    }
                    if (verbs.Gerund && verbs.Gerund !== word) {
                        html += `<li><span class="nlp-label">进行时</span><span class="nlp-val">${verbs.Gerund}</span></li>`;
                        foundData = true;
                    }
                    if (verbs.PresentTense && verbs.PresentTense !== word) {
                        html += `<li><span class="nlp-label">现在式</span><span class="nlp-val">${verbs.PresentTense}</span></li>`;
                        foundData = true;
                    }
                }

                // 3. 名词变位 (Plurals)
                const nounDoc = nlp(root || word);
                if (nounDoc.nouns().found) {
                    const isPlural = nounDoc.nouns().isPlural().found;
                    if (isPlural) {
                         const singular = nounDoc.nouns().toSingular().text();
                         html += `<li><span class="nlp-label">单数</span><span class="nlp-val">${singular}</span></li>`;
                         foundData = true;
                    } else {
                         const plural = nounDoc.nouns().toPlural().text();
                         if (plural !== word) {
                            html += `<li><span class="nlp-label">复数</span><span class="nlp-val">${plural}</span></li>`;
                            foundData = true;
                         }
                    }
                }

                // 4. 显示词性标签 (Tags)
                if (!foundData || json.terms[0].tags) {
                    // 过滤无意义的标签
                    const tags = json.terms[0].tags
                        .filter(t => !['Term', 'TextValue'].includes(t))
                        .slice(0, 2)
                        .join(', ');
                    html += `<li><span class="nlp-label">属性</span><span class="nlp-val" style="font-size:12px">${tags}</span></li>`;
                }

                html += `</ul></div>`;
                instance.setContent(html);
            }
        });
    }

    // --- TTS 语音逻辑 (保持不变) ---
    function playTTS(type) {
        const domains = [
          'https://ms-ra-forwarder-for-ifreetime-2.vercel.app', 
          'https://libre-tts-nu.vercel.app/' 
        ];

        let textToRead = '';
        if (type === 'front') {
          let frontText = document.querySelector('.front-text').innerText.trim();
          if (!frontText) return;
          textToRead = frontText;
        }
        const voice = 'en-US-EricNeural';

        function createAndPlayAudio(domainIndex) {
          if (domainIndex >= domains.length) {
            console.log('TTS Failed');
            return;
          }

          const domain = domains[domainIndex];
          let src = '';

          if (domain.includes('aiyue')) {
            const queryString = new URLSearchParams({
              text: textToRead,
              voiceName: voice,
              speed: 0,
            }).toString();
            src = `${domain}api/aiyue?${queryString}`;
          } else {
            src = `${domain}api/tts?t=${encodeURIComponent(textToRead)}&v=${encodeURIComponent(voice)}&r=0&p=0`;
          }
          
          let existingAudio = document.getElementById('hiddenAudio');
          if (existingAudio) existingAudio.remove();

          const audio = document.createElement('audio');
          audio.id = 'hiddenAudio';
          audio.style.display = 'none';
          audio.crossOrigin = 'anonymous'; 

          const source = document.createElement('source');
          source.src = src;
          source.type = 'audio/mpeg';
          audio.append(source);
          document.body.append(audio);

          audio.onerror = () => createAndPlayAudio(domainIndex + 1);
          audio.play().catch(e => createAndPlayAudio(domainIndex + 1));
        }
        createAndPlayAudio(0);
    }

    // 按钮位置设置
    const playBackButton = document.getElementById('playBackButton');
    playBackButton.style.position = 'fixed';
    playBackButton.style.bottom = '250px';
    playBackButton.style.left = '50%';
    playBackButton.style.transform = 'translateX(-50%)';
    playBackButton.style.zIndex = '999';

    playBackButton.addEventListener('click', function() {
        playTTS('front');
    });

    // --- 初始化入口 ---
    // 增加一点延迟，确保外部脚本已下载解析
    setTimeout(() => {
        initNLP();
        playTTS('front');
    }, 800); 

</script>
