/* ai-reader.js - 核心逻辑库
 * 依赖: Tippy.js, Marked.js, Compromise.js (可选但推荐)
 */

class AIReader {
    constructor(config = {}) {
        this.containerSelector = config.containerSelector || '#content';
        this.apiKey = config.apiKey || localStorage.getItem('groq_api_key') || '';
        this.model = config.model || localStorage.getItem('groq_model') || 'meta-llama/llama-4-maverick-17b-128e-instruct';
        this.prompt = config.prompt || localStorage.getItem('groq_prompt') || "你是一位精通中英文的语言专家。请分析我提供的句子：\n1. 判断难度等级 (A1-C2)。\n2. 详细解释核心语法结构。\n3. 提供准确、优美的中文翻译。\n请使用 Markdown 格式输出。";

        // 词表 URLs
        this.urls = {
            blue: config.blueUrl || localStorage.getItem('highlight_url_blue'),
            red: config.redUrl || localStorage.getItem('highlight_url_red'),
            exclude: config.excludeUrl || localStorage.getItem('highlight_url_exclude')
        };

        this.blueWords = new Set();
        this.redWords = new Set();
        this.excludedWords = new Set();
        this.lemmaCache = new Map();

        this.init();
    }

    async init() {
        console.log('AI Reader: Initializing...');
        this._injectModalHTML(); // 1. 注入模态框
        await this._loadWordLists(); // 2. 加载词表
        this.processContent(); // 3. 处理文本
        this._bindGlobalEvents(); // 4. 绑定音频播放等全局事件
    }

    // --- 核心：处理文本，注入 Span 和 按钮 ---
    processContent() {
        const container = document.querySelector(this.containerSelector);
        if (!container) {
            console.warn(`AI Reader: Container ${this.containerSelector} not found.`);
            return;
        }

        // 清理旧按钮
        container.querySelectorAll('.ai-analyze-btn').forEach(b => b.remove());

        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            if (node.parentElement && ['SPAN', 'SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) return;

            const text = node.nodeValue;
            if (!text.trim()) return;

            const fragment = document.createDocumentFragment();

            if (text.includes('.')) {
                // 按句号分割
                const parts = text.split(/(\.)/);
                parts.forEach(part => {
                    if (part === '.') {
                        fragment.appendChild(document.createTextNode('.'));
                        fragment.appendChild(this._createAnalyzeBtn());
                    } else if (part.length > 0) {
                        this._highlightText(part, fragment);
                    }
                });
            } else {
                this._highlightText(text, fragment);
            }

            node.parentNode.replaceChild(fragment, node);
        });

        // 初始化 Tippy (查词)
        this._initTippy();
    }

    // --- 内部：高亮逻辑 ---
    _highlightText(text, container) {
        const parts = text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/g);
        parts.forEach(part => {
            if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                const span = document.createElement('span');
                span.className = 'clickable-word';
                span.textContent = part;

                if (this._checkInSet(part, this.excludedWords)) {
                    // Excluded: do nothing (just clickable)
                } else if (this._checkInSet(part, this.redWords)) {
                    span.classList.add('highlight-red');
                } else if (this._checkInSet(part, this.blueWords)) {
                    span.classList.add('highlight-blue');
                }
                container.appendChild(span);
            } else {
                container.appendChild(document.createTextNode(part));
            }
        });
    }

    _checkInSet(word, set) {
        const lower = word.toLowerCase();
        if (set.has(lower)) return true;

        // 尝试还原词根 (依赖 compromise.js)
        if (!this.lemmaCache.has(lower)) {
            let root = lower;
            if (window.nlp) {
                try {
                    const doc = window.nlp(lower);
                    doc.compute('root');
                    const foundRoot = doc.text('root');
                    if (foundRoot) root = foundRoot;
                } catch(e) {}
            }
            this.lemmaCache.set(lower, root);
        }
        return set.has(this.lemmaCache.get(lower));
    }

    _createAnalyzeBtn() {
        const span = document.createElement('span');
        span.className = 'ai-analyze-btn';
        span.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>';
        span.onclick = (e) => this._handleAnalyzeClick(e.target);
        return span;
    }

    // --- 内部：AI 分析逻辑 ---
    async _handleAnalyzeClick(target) {
        if(!this.apiKey) { alert('请先配置 API Key (AIReader config)'); return; }

        const btn = target.closest('.ai-analyze-btn');
        document.querySelectorAll('.ai-analyze-btn').forEach(b => b.classList.remove('last-clicked'));
        btn.classList.add('last-clicked');

        const sentence = this._extractSentence(btn);
        this._openModal(sentence);
    }

    _extractSentence(node) {
        let t = "", c = node.previousSibling;
        while(c) {
            if(c.nodeType === 3) { 
                t = c.nodeValue + t; 
                if(t.lastIndexOf('.') > -1 && t.lastIndexOf('.') < t.length-1) { t=t.substring(t.lastIndexOf('.')+1); break; } 
            }
            else if(c.classList?.contains('ai-analyze-btn')) break;
            else if(c.tagName === 'SPAN') t = c.innerText + t;
            else t = c.innerText + t;
            c = c.previousSibling;
        }
        return t.trim();
    }

    async _openModal(sentence) {
        const modal = document.getElementById('arResultModal');
        const originalBox = document.getElementById('arOriginalSentence');
        const contentBox = document.getElementById('arResultContent');

        originalBox.innerText = sentence;
        contentBox.innerHTML = '<div class="ar-spinner"></div><p style="text-align:center;color:#666">正在请求 AI 分析...</p>';
        modal.classList.add('active');

        // Cache Check
        const cacheKey = `ar_cache_${this._hash(sentence + this.model)}`;
        const cached = this._getFromCache(cacheKey);
        if(cached) {
            contentBox.innerHTML = `<div class="ar-result-content">${marked.parse(cached)}</div>`;
            return;
        }

        try {
            const result = await this._callAPI(sentence);
            this._saveToCache(cacheKey, result);
            contentBox.innerHTML = `<div class="ar-result-content">${marked.parse(result)}</div>`;
        } catch(e) {
            contentBox.innerHTML = `<p style="color:red">分析失败: ${e.message}</p>`;
        }
    }

    async _callAPI(text) {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: this.model,
                messages: [{role: "system", content: this.prompt}, {role: "user", content: `Analyze: "${text}"`}],
                temperature: 0.7
            })
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.error?.message || "API Request Failed");
        return data.choices[0]?.message?.content || "";
    }

    // --- 内部：查词与 Tippy ---
    _initTippy() {
        if(window._arTippy) window._arTippy.forEach(i => i.destroy());
        window._arTippy = tippy('.clickable-word', {
            trigger: 'click', interactive: true, theme: 'light-border',
            placement: 'bottom', animation: 'shift-away', allowHTML: true, maxWidth: 300,
            onShow: (instance) => {
                const word = instance.reference.innerText.trim();
                instance.setContent('<div class="dict-popup"><span class="dict-loading">🔍 Searching...</span></div>');
                Promise.all([this._fetchTrans(word), this._fetchPhonetics(word)])
                    .then(([trans, ipa]) => instance.setContent(this._formatDict(word, trans, ipa)));
            }
        });
    }

    async _fetchTrans(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        return await res.json();
    }

    async _fetchPhonetics(text) {
        try {
            const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`);
            const d = await r.json();
            return d[0]?.phonetics.find(p => p.text)?.text || null;
        } catch(e) { return null; }
    }

    _formatDict(word, trans, ipa) {
        const esc = word.replace(/'/g, "\\'");
        const basic = trans[0]?.[0]?.[0] || '';
        let html = `<div class="dict-popup">
            <div class="dict-header-row">
                <div class="dict-word-line">
                    <span class="dict-head-word">${word}</span>
                    ${ipa ? `<span class="dict-ipa">${ipa}</span>` : ''}
                    <span class="dict-speaker-btn" onclick="window.AIReaderPlay('${esc}', this)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </span>
                </div>
                <div class="dict-basic-trans">${basic}</div>
            </div>`;

        if(trans[1]) {
            html += `<div class="dict-details">`;
            trans[1].slice(0,2).forEach(entry => {
                html += `<div style="margin-bottom:4px"><span class="dict-pos-tag">${entry[0]}.</span>`;
                html += `<span style="font-size:13px;color:#444">` + entry[1].slice(0,3).join("; ") + `</span></div>`;
            });
            html += `</div>`;
        }
        return html + `</div>`;
    }

    // --- 辅助功能 ---
    async _loadWordLists() {
        const fetchSet = async (url) => {
            if(!url) return new Set();
            try { const r = await fetch(url); const t = await r.text(); 
                  return new Set(t.split(/\s+/).map(w=>w.trim().toLowerCase()).filter(w=>w)); }
            catch { return new Set(); }
        };
        const [b, r, e] = await Promise.all([fetchSet(this.urls.blue), fetchSet(this.urls.red), fetchSet(this.urls.exclude)]);
        this.blueWords = b; this.redWords = r; this.excludedWords = e;
    }

    // --- 修改点：_injectModalHTML 方法更新 ---
    _injectModalHTML() {
        if(document.getElementById('arResultModal')) return;
        const div = document.createElement('div');
        div.innerHTML = `
            <div id="arResultModal" class="ar-modal-overlay">
                <div class="ar-modal-card">
                    <div class="ar-modal-header">
                        <div class="ar-modal-title">AI 分析</div>
                        <button class="ar-close-btn" onclick="document.getElementById('arResultModal').classList.remove('active')">✕</button>
                    </div>
                    <div class="ar-modal-body">
                        <div id="arOriginalSentence" class="ar-original-sentence"></div>
                        <div id="arResultContent" class="ar-result-content"></div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(div);

        const modal = document.getElementById('arResultModal');

        // 原有功能：单击遮罩背景关闭
        modal.onclick = (e) => {
            if(e.target.id === 'arResultModal') e.target.classList.remove('active');
        };

        // 【新增功能】：双击任意区域关闭 (支持移动端/桌面端)
        // 注意：因为事件冒泡，双击 modal 内部的内容也会触发此事件，从而关闭弹窗
        modal.ondblclick = (e) => {
            modal.classList.remove('active');
        };
    }

    _bindGlobalEvents() {
        // 全局播放函数暴露给 Window，因为 Tippy 内容是动态的 HTML 字符串
        window.AIReaderPlay = (text, btn) => {
            btn.classList.add('playing');
            const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`);
            audio.onended = () => btn.classList.remove('playing');
            audio.play().catch(() => btn.classList.remove('playing'));
        };
    }

    _hash(str) {
        let h = 0; for(let i=0; i<str.length; i++) h = ((h<<5)-h)+str.charCodeAt(i)|0; return Math.abs(h);
    }
    _getFromCache(k) { const i = JSON.parse(localStorage.getItem(k)); return (i && Date.now()-i.t < 86400000) ? i.c : null; }
    _saveToCache(k, c) { try { localStorage.setItem(k, JSON.stringify({c, t:Date.now()})); } catch(e){} }
}
