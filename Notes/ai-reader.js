/**
 * AI Reader - 全自动通用版
 * 功能：自动加载依赖 (CSS/JS)，自动初始化，支持通过 script 标签属性配置
 */

(function() {
    // --- 配置部分 ---
    // 获取当前正在运行的 script 标签，以便读取配置
    const currentScript = document.currentScript;
    
    // 基础依赖配置
    const RESOURCES = {
        css: [
            'https://unpkg.com/tippy.js@6/animations/shift-away.css',
            'https://unpkg.com/tippy.js@6/themes/light-border.css',
            // 如果你不想在 HTML 里写 CSS link，可以在这里把你的 CSS 也加进去：
            'https://cdn.jsdelivr.net/gh/moodHappy/HelloWorld@master/Notes/ai-reader.css' 
        ],
        js: [
            'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
            'https://unpkg.com/@popperjs/core@2',
            'https://unpkg.com/tippy.js@6', // Tippy 依赖 Popper
            'https://unpkg.com/compromise@14.10.0/builds/compromise.min.js'
        ]
    };

    // --- 核心类定义 (你的原有逻辑) ---
    class AIReader {
        constructor(config = {}) {
            this.containerSelector = config.containerSelector || 'body'; // 默认处理整个 Body
            this.apiKey = config.apiKey || localStorage.getItem('groq_api_key') || '';
            this.model = config.model || localStorage.getItem('groq_model') || 'meta-llama/llama-4-maverick-17b-128e-instruct';
            this.prompt = config.prompt || "你是一位精通中英文的语言专家。请分析我提供的句子：\n1. 判断难度等级 (A1-C2)。\n2. 详细解释核心语法结构。\n3. 提供准确、优美的中文翻译。\n请使用 Markdown 格式输出。";
            
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
            console.log('AI Reader: 正在启动...');
            this._injectModalHTML();
            await this._loadWordLists();
            this.processContent();
            this._bindGlobalEvents();
        }

        processContent() {
            const container = document.querySelector(this.containerSelector);
            if (!container) return;

            // 避免重复处理
            if(container.getAttribute('data-ai-reader-processed')) return;
            container.setAttribute('data-ai-reader-processed', 'true');

            // 清理旧按钮
            container.querySelectorAll('.ai-analyze-btn').forEach(b => b.remove());

            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);

            nodes.forEach(node => {
                // 跳过特定标签
                if (node.parentElement && ['SPAN', 'SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.parentElement.tagName)) return;
                
                const text = node.nodeValue;
                if (!text.trim()) return;

                const fragment = document.createDocumentFragment();

                if (text.includes('.')) {
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

            this._initTippy();
        }

        _highlightText(text, container) {
            const parts = text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/g);
            parts.forEach(part => {
                if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                    const span = document.createElement('span');
                    span.className = 'clickable-word';
                    span.textContent = part;

                    if (this._checkInSet(part, this.excludedWords)) {
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
            if (!this.lemmaCache.has(lower)) {
                let root = lower;
                if (window.nlp) {
                    try { const doc = window.nlp(lower); doc.compute('root'); const foundRoot = doc.text('root'); if (foundRoot) root = foundRoot; } catch(e) {}
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

        async _handleAnalyzeClick(target) {
            if(!this.apiKey) { 
                const inputKey = prompt("请输入 Groq API Key 以使用 AI 分析功能:");
                if(inputKey) { this.apiKey = inputKey; localStorage.setItem('groq_api_key', inputKey); }
                else return;
            }
            
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

            const cacheKey = `ar_cache_${this._hash(sentence + this.model)}`;
            const cached = this._getFromCache(cacheKey);
            if(cached) { contentBox.innerHTML = `<div class="ar-result-content">${marked.parse(cached)}</div>`; return; }

            try {
                const result = await this._callAPI(sentence);
                this._saveToCache(cacheKey, result);
                contentBox.innerHTML = `<div class="ar-result-content">${marked.parse(result)}</div>`;
            } catch(e) { contentBox.innerHTML = `<p style="color:red">分析失败: ${e.message}</p>`; }
        }

        async _callAPI(text) {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: this.model, messages: [{role: "system", content: this.prompt}, {role: "user", content: `Analyze: "${text}"`}], temperature: 0.7 })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.error?.message || "API Request Failed");
            return data.choices[0]?.message?.content || "";
        }

        _initTippy() {
            if(window._arTippy) window._arTippy.forEach(i => i.destroy());
            window._arTippy = tippy('.clickable-word', {
                trigger: 'click', interactive: true, theme: 'light-border', placement: 'bottom', animation: 'shift-away', allowHTML: true, maxWidth: 300,
                onShow: (instance) => {
                    const word = instance.reference.innerText.trim();
                    instance.setContent('<div class="dict-popup"><span class="dict-loading">🔍 Searching...</span></div>');
                    Promise.all([this._fetchTrans(word), this._fetchPhonetics(word)]).then(([trans, ipa]) => instance.setContent(this._formatDict(word, trans, ipa)));
                }
            });
        }
        async _fetchTrans(text) { const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(text)}`); return await res.json(); }
        async _fetchPhonetics(text) { try { const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(text)}`); const d = await r.json(); return d[0]?.phonetics.find(p => p.text)?.text || null; } catch(e) { return null; } }
        _formatDict(word, trans, ipa) {
            const esc = word.replace(/'/g, "\\'");
            const basic = trans[0]?.[0]?.[0] || '';
            let html = `<div class="dict-popup"><div class="dict-header-row"><div class="dict-word-line"><span class="dict-head-word">${word}</span>${ipa ? `<span class="dict-ipa">${ipa}</span>` : ''}<span class="dict-speaker-btn" onclick="window.AIReaderPlay('${esc}', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></span></div><div class="dict-basic-trans">${basic}</div></div>`;
            if(trans[1]) { html += `<div class="dict-details">`; trans[1].slice(0,2).forEach(entry => { html += `<div style="margin-bottom:4px"><span class="dict-pos-tag">${entry[0]}.</span><span style="font-size:13px;color:#444">` + entry[1].slice(0,3).join("; ") + `</span></div>`; }); html += `</div>`; }
            return html + `</div>`;
        }
        async _loadWordLists() {
            const fetchSet = async (url) => { if(!url) return new Set(); try { const r = await fetch(url); const t = await r.text(); return new Set(t.split(/\s+/).map(w=>w.trim().toLowerCase()).filter(w=>w)); } catch { return new Set(); } };
            const [b, r, e] = await Promise.all([fetchSet(this.urls.blue), fetchSet(this.urls.red), fetchSet(this.urls.exclude)]);
            this.blueWords = b; this.redWords = r; this.excludedWords = e;
        }
        _injectModalHTML() {
            if(document.getElementById('arResultModal')) return;
            const div = document.createElement('div');
            div.innerHTML = `<div id="arResultModal" class="ar-modal-overlay"><div class="ar-modal-card"><div class="ar-modal-header"><div class="ar-modal-title">AI 分析</div><button class="ar-close-btn" onclick="document.getElementById('arResultModal').classList.remove('active')">✕</button></div><div class="ar-modal-body"><div id="arOriginalSentence" class="ar-original-sentence"></div><div id="arResultContent" class="ar-result-content"></div></div></div></div>`;
            document.body.appendChild(div);
            document.getElementById('arResultModal').onclick = (e) => { if(e.target.id === 'arResultModal') e.target.classList.remove('active'); };
        }
        _bindGlobalEvents() {
            window.AIReaderPlay = (text, btn) => { btn.classList.add('playing'); const audio = new Audio(`https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`); audio.onended = () => btn.classList.remove('playing'); audio.play().catch(() => btn.classList.remove('playing')); };
        }
        _hash(str) { let h = 0; for(let i=0; i<str.length; i++) h = ((h<<5)-h)+str.charCodeAt(i)|0; return Math.abs(h); }
        _getFromCache(k) { const i = JSON.parse(localStorage.getItem(k)); return (i && Date.now()-i.t < 86400000) ? i.c : null; }
        _saveToCache(k, c) { try { localStorage.setItem(k, JSON.stringify({c, t:Date.now()})); } catch(e){} }
    }

    // --- 自动加载器 (Loader) ---
    function loadResource(type, url) {
        return new Promise((resolve, reject) => {
            if (type === 'css') {
                if (document.querySelector(`link[href="${url}"]`)) return resolve();
                const link = document.createElement('link');
                link.rel = 'stylesheet'; link.href = url;
                link.onload = resolve; link.onerror = reject;
                document.head.appendChild(link);
            } else {
                if (document.querySelector(`script[src="${url}"]`)) return resolve();
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve; script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    async function bootstrap() {
        // 1. 加载 CSS
        RESOURCES.css.forEach(url => loadResource('css', url));

        // 2. 加载 JS 依赖 (顺序加载)
        for (const url of RESOURCES.js) {
            await loadResource('js', url);
        }

        // 3. 读取 HTML 标签上的配置
        const config = {
            blueUrl: currentScript?.getAttribute('data-blue-url'),
            redUrl: currentScript?.getAttribute('data-red-url'),
            excludeUrl: currentScript?.getAttribute('data-exclude-url'),
            apiKey: currentScript?.getAttribute('data-api-key')
        };

        // 4. 启动！
        if (!window.aiReaderInstance) {
            window.aiReaderInstance = new AIReader(config);
            console.log("AI Reader Auto-Loaded.");
        }
    }

    // 执行启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();