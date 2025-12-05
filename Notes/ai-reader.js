/**
 * AI Reader Universal Script
 * 包含：AI 句子分析 (Groq API) + 点击查词 (Custom Popup)
 * 依赖：marked.js (必须先引入)
 */

const AIReader = (function() {
    // --- 配置与状态 ---
    const CONFIG = {
        groqApiUrl: "https://api.groq.com/openai/v1/chat/completions",
        defaultModel: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        // 默认 Prompt
        defaultPrompt: "你是一位精通中英文的语言专家。请分析我提供的句子：\n1. 判断难度等级。\n2. 详细解释核心语法结构。\n3. 提供准确、优美的中文翻译。\n请使用 Markdown 格式输出。",
        ignoreTags: ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'BUTTON']
    };

    let _settings = {
        apiKey: localStorage.getItem('groq_api_key') || '',
        model: localStorage.getItem('groq_model') || CONFIG.defaultModel,
        prompt: localStorage.getItem('groq_prompt') || CONFIG.defaultPrompt,
        blueWords: new Set(),
        redWords: new Set(),
        excludeWords: new Set()
    };

    // 缓存
    const _cache = new Map();
    const _lemmaCache = new Map();

    // DOM 元素引用
    let _modalOverlay, _modalOriginal, _modalContent;
    let _popupEl;

    // --- 初始化 ---
    function init(containerSelector = 'body') {
        _injectModalDOM();
        _injectPopupDOM();
        _loadWordLists().then(() => {
            const containers = document.querySelectorAll(containerSelector);
            containers.forEach(el => processContainer(el));
        });
        
        // 全局点击监听：处理弹窗关闭
        document.addEventListener('click', (e) => {
            if (_popupEl && _popupEl.classList.contains('visible')) {
                // 如果点击的不是单词，也不是弹窗本身，则关闭
                if (!e.target.closest('.ai-word') && !e.target.closest('.ai-dict-popup')) {
                    _hidePopup();
                }
            }
        });

        console.log("AI Reader Initialized.");
    }

    // --- DOM 注入 ---
    function _injectModalDOM() {
        if (document.getElementById('aiReaderModal')) return;
        const html = `
            <div id="aiReaderModal" class="ai-modal-overlay">
                <div class="ai-modal-card">
                    <div class="ai-modal-header">
                        <div class="ai-modal-title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            <span>AI 分析</span>
                        </div>
                        <button class="ai-close-btn" onclick="AIReader.closeModal()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <div class="ai-modal-body">
                        <div id="aiOriginalText" class="ai-original-text"></div>
                        <div id="aiResultContent" class="ai-result-content"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        _modalOverlay = document.getElementById('aiReaderModal');
        _modalOriginal = document.getElementById('aiOriginalText');
        _modalContent = document.getElementById('aiResultContent');

        // 点击遮罩关闭
        _modalOverlay.addEventListener('click', (e) => {
            if (e.target === _modalOverlay) closeModal();
        });
    }

    function _injectPopupDOM() {
        if (document.getElementById('aiDictPopup')) return;
        const div = document.createElement('div');
        div.id = 'aiDictPopup';
        div.className = 'ai-dict-popup';
        document.body.appendChild(div);
        _popupEl = div;
    }

    // --- 核心处理逻辑 ---
    function processContainer(element) {
        if (!element) return;
        
        // 1. 清理旧按钮
        element.querySelectorAll('.ai-analyze-btn').forEach(b => b.remove());

        // 2. 遍历文本节点
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (CONFIG.ignoreTags.includes(node.parentNode.tagName)) return NodeFilter.FILTER_REJECT;
                if (node.parentNode.classList.contains('ai-word')) return NodeFilter.FILTER_REJECT; // 避免重复处理
                if (node.nodeValue.trim().length === 0) return NodeFilter.FILTER_SKIP;
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const nodes = [];
        while(walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            if (node.nodeValue.includes('.')) {
                _processSentenceNode(node);
            } else {
                _processWordNode(node);
            }
        });
    }

    function _processSentenceNode(textNode) {
        const fragment = document.createDocumentFragment();
        const segments = textNode.nodeValue.split(/(\.)/);

        segments.forEach(seg => {
            if (seg === '.') {
                fragment.appendChild(document.createTextNode('.'));
                const btn = document.createElement('span');
                btn.className = 'ai-analyze-btn';
                btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>';
                btn.onclick = (e) => _handleAnalyzeClick(e.target);
                fragment.appendChild(btn);
            } else if (seg.length > 0) {
                _highlightWordsInText(seg, fragment);
            }
        });
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    function _processWordNode(textNode) {
        const fragment = document.createDocumentFragment();
        _highlightWordsInText(textNode.nodeValue, fragment);
        textNode.parentNode.replaceChild(fragment, textNode);
    }

    function _highlightWordsInText(text, container) {
        // 分割单词和非单词字符
        const parts = text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/g);
        parts.forEach(part => {
            if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                const span = document.createElement('span');
                span.className = 'ai-word';
                span.textContent = part;
                
                // 颜色逻辑
                const lower = part.toLowerCase();
                const lemma = _getLemma(lower);
                
                if (_settings.excludeWords.has(lower) || _settings.excludeWords.has(lemma)) {
                    // Do nothing (just clickable)
                } else if (_settings.redWords.has(lower) || _settings.redWords.has(lemma)) {
                    span.classList.add('ai-highlight-red');
                } else if (_settings.blueWords.has(lower) || _settings.blueWords.has(lemma)) {
                    span.classList.add('ai-highlight-blue');
                }

                // 点击事件
                span.onclick = (e) => {
                    e.stopPropagation();
                    _showDictPopup(part, span);
                };

                container.appendChild(span);
            } else {
                container.appendChild(document.createTextNode(part));
            }
        });
    }

    // --- NLP & 词表 ---
    function _getLemma(word) {
        if (_lemmaCache.has(word)) return _lemmaCache.get(word);
        let root = word;
        // 如果页面引入了 compromise (nlp)，则使用它
        if (window.nlp) {
            try { root = window.nlp(word).compute('root').text('root') || word; } catch(e){}
        }
        _lemmaCache.set(word, root);
        return root;
    }

    async function _loadWordLists() {
        // 从 localStorage 获取 URL
        const urls = {
            blue: localStorage.getItem('highlight_url_blue'),
            red: localStorage.getItem('highlight_url_red'),
            exclude: localStorage.getItem('highlight_url_exclude')
        };
        
        const fetchList = async (url, set) => {
            if (!url) return;
            try {
                const res = await fetch(url);
                const text = await res.text();
                text.split(/\s+/).forEach(w => w && set.add(w.toLowerCase()));
            } catch(e) { console.warn("Failed to load list:", url); }
        };

        await Promise.all([
            fetchList(urls.blue, _settings.blueWords),
            fetchList(urls.red, _settings.redWords),
            fetchList(urls.exclude, _settings.excludeWords)
        ]);
    }

    // --- AI 分析逻辑 ---
    async function _handleAnalyzeClick(target) {
        const btn = target.closest('.ai-analyze-btn');
        if (!btn) return;
        
        btn.classList.add('processing');
        const sentence = _extractSentence(btn);
        
        _modalOriginal.textContent = sentence;
        _modalContent.innerHTML = '<div class="ai-spinner"></div><p style="text-align:center;color:#888;">AI 正在思考中...</p>';
        _modalOverlay.classList.add('active');

        // 缓存检查
        const cacheKey = `ai_ana_${sentence}_${_settings.model}`;
        if (_cache.has(cacheKey)) {
            _renderMarkdown(_cache.get(cacheKey));
            btn.classList.remove('processing');
            return;
        }

        try {
            if (!_settings.apiKey) throw new Error("未配置 Groq API Key。请设置 localStorage.getItem('groq_api_key')。");
            
            const messages = [
                { role: "system", content: _settings.prompt },
                { role: "user", content: `Analyze this sentence: "${sentence}"` }
            ];

            const response = await fetch(CONFIG.groqApiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${_settings.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: _settings.model,
                    messages: messages,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            
            const content = data.choices[0].message.content;
            _cache.set(cacheKey, content);
            _renderMarkdown(content);

        } catch (err) {
            _modalContent.innerHTML = `<p style="color:#d93025">错误: ${err.message}</p>`;
        } finally {
            btn.classList.remove('processing');
        }
    }

    function _extractSentence(btnNode) {
        // 向前遍历直到上一个句号
        let text = "";
        let curr = btnNode.previousSibling;
        while (curr) {
            if (curr.nodeType === 3) { // Text
                text = curr.nodeValue + text;
                if (text.lastIndexOf('.') > -1 && text.lastIndexOf('.') < text.length - 1) {
                    text = text.substring(text.lastIndexOf('.') + 1);
                    break;
                }
            } else if (curr.classList && curr.classList.contains('ai-analyze-btn')) {
                break;
            } else {
                text = curr.textContent + text;
            }
            curr = curr.previousSibling;
        }
        return text.trim();
    }

    function _renderMarkdown(text) {
        if (window.marked) {
            _modalContent.innerHTML = window.marked.parse(text);
        } else {
            _modalContent.innerHTML = `<pre style="white-space:pre-wrap">${text}</pre>`;
        }
    }

    function closeModal() {
        _modalOverlay.classList.remove('active');
    }

    // --- 查词与弹窗逻辑 (Custom Popup) ---
    async function _showDictPopup(word, triggerEl) {
        // 1. 设置加载状态
        _popupEl.innerHTML = '<div style="color:#666;font-style:italic;">🔍 Searching...</div>';
        _positionPopup(triggerEl); // 初步定位
        _popupEl.classList.add('visible');

        // 高亮当前点击词
        document.querySelectorAll('.active-word').forEach(el => el.classList.remove('active-word'));
        triggerEl.classList.add('active-word');

        try {
            const [transData, ipaText] = await Promise.all([
                _fetchTranslation(word),
                _fetchPhonetics(word)
            ]);
            
            _popupEl.innerHTML = _buildDictHTML(word, transData, ipaText);
            _positionPopup(triggerEl); // 内容加载后重新定位（因为高度变了）

        } catch (e) {
            _popupEl.innerHTML = `<div style="color:red">Error: ${e.message}</div>`;
        }
    }

    function _positionPopup(triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        const popupRect = _popupEl.getBoundingClientRect();
        
        let top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;

        // 边界检测
        // 右边界溢出
        if (left + popupRect.width > window.innerWidth) {
            left = window.innerWidth - popupRect.width - 10;
        }
        // 下边界溢出（翻转到上方）
        if (top + popupRect.height > window.scrollY + window.innerHeight) {
            top = rect.top + window.scrollY - popupRect.height - 8;
        }

        _popupEl.style.top = `${top}px`;
        _popupEl.style.left = `${left}px`;
    }

    function _hidePopup() {
        _popupEl.classList.remove('visible');
        document.querySelectorAll('.active-word').forEach(el => el.classList.remove('active-word'));
    }

    async function _fetchTranslation(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        return await res.json();
    }

    async function _fetchPhonetics(text) {
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data[0]?.phonetics.find(p => p.text)?.text || data[0]?.phonetic || null;
        } catch(e) { return null; }
    }

    function _buildDictHTML(word, transData, ipa) {
        const escapedWord = word.replace(/'/g, "\\'");
        const basicTrans = transData[0]?.[0]?.[0] || '';
        const dictEntries = transData[1] || [];

        let html = `
            <div class="ai-dict-header">
                <div class="ai-dict-word-line">
                    <span class="ai-dict-headword">${word}</span>
                    ${ipa ? `<span class="ai-dict-ipa">${ipa}</span>` : ''}
                    <span class="ai-dict-speaker" onclick="AIReader.playAudio('${escapedWord}')">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </span>
                </div>
                <div style="color:#444;margin-top:4px;">${basicTrans}</div>
            </div>
        `;

        if (dictEntries.length > 0) {
            dictEntries.slice(0, 2).forEach(entry => {
                const pos = entry[0];
                const defs = entry[1].slice(0, 3).join('; ');
                html += `<div class="ai-dict-pos-block"><span class="ai-dict-pos-tag">${pos}.</span><span>${defs}</span></div>`;
            });
        }
        return html;
    }

    function playAudio(text) {
        const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
        new Audio(url).play();
    }

    // --- 公开 API ---
    return {
        init: init,
        closeModal: closeModal,
        playAudio: playAudio
    };

})();
