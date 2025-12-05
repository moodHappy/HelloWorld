/**
 * AI Reader - Universal JS Library
 * Features:
 * 1. AI Sentence Analysis (Groq API)
 * 2. Smart Dictionary Lookup (Clickable words, Custom Popup)
 * 3. Text Highlighting based on remote word lists (Red/Blue/Exclude)
 *
 * Usage:
 * AIReader.init({
 * containerId: 'content-div-id', // The ID of the element containing text
 * excludeUrl: '...', // Optional default
 * blueUrl: '...',    // Optional default
 * redUrl: '...'      // Optional default
 * });
 */

(function(global) {
    const CONFIG = {
        api_url: "https://api.groq.com/openai/v1/chat/completions",
        default_model: "meta-llama/llama-4-maverick-17b-128e-instruct",
        default_prompt: "你是一位精通中英文的语言专家。请分析我提供的句子：\n1. 判断难度等级 (A1-C2)。\n2. 详细解释核心语法结构。\n3. 提供准确、优美的中文翻译。\n请使用 Markdown 格式输出。",
        cache_prefix: 'air_cache_v1_'
    };

    let state = {
        container: null,
        blueWords: new Set(),
        redWords: new Set(),
        excludedWords: new Set(),
        lemmaCache: new Map(),
        lastClickedIndex: -1,
        activePopup: null
    };

    // --- 依赖加载器 ---
    function loadScript(url, checkObj) {
        return new Promise((resolve) => {
            if (global[checkObj]) return resolve();
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    // --- 工具函数 ---
    async function fetchWords(url) {
        if (!url) return new Set();
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const text = await res.text();
            return new Set(text.split(/\s+/).map(w => w.trim().toLowerCase()).filter(w => w.length > 0));
        } catch (e) {
            console.warn("AIReader: Failed to load list", url);
            return new Set();
        }
    }

    function getLemma(word) {
        const lower = word.toLowerCase();
        if (state.lemmaCache.has(lower)) return state.lemmaCache.get(lower);
        let root = lower;
        if (global.nlp) {
            try {
                const doc = nlp(lower);
                doc.compute('root');
                const found = doc.text('root');
                if (found) root = found;
            } catch (e) {}
        }
        state.lemmaCache.set(lower, root);
        return root;
    }

    function checkInSet(word, set) {
        const lower = word.toLowerCase();
        if (set.has(lower)) return true;
        const lemma = getLemma(lower);
        return set.has(lemma);
    }

    // --- DOM 注入 (Modal & Popup) ---
    function injectUIComponents() {
        const html = `
        <div id="air-dict-popup"></div>

        <div id="air-fab-settings" title="AI Reader Settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
        </div>

        <div id="air-result-modal" class="air-modal-overlay">
            <div class="air-modal-card">
                <div class="air-modal-header">
                    <div class="air-modal-title">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        <span>AI 句法分析</span>
                    </div>
                    <button class="air-close-btn" data-target="air-result-modal">✕</button>
                </div>
                <div class="air-modal-body">
                    <div class="air-original-sentence" id="air-original-text"></div>
                    <div id="air-analysis-content"></div>
                </div>
            </div>
        </div>

        <div id="air-settings-modal" class="air-modal-overlay">
            <div class="air-modal-card">
                <div class="air-modal-header">
                    <h3 class="air-modal-title">AI Reader 设置</h3>
                    <button class="air-close-btn" data-target="air-settings-modal">✕</button>
                </div>
                <div class="air-modal-body">
                    <div class="air-input-group">
                        <label class="air-label">GROQ API Key</label>
                        <input type="password" id="air-input-key" class="air-input" placeholder="gsk_...">
                    </div>
                    <div class="air-input-group">
                        <label class="air-label" style="color:#1967d2">High-Freq URL (Blue)</label>
                        <input type="text" id="air-input-blue" class="air-input">
                    </div>
                    <div class="air-input-group">
                        <label class="air-label" style="color:#d93025">Important URL (Red)</label>
                        <input type="text" id="air-input-red" class="air-input">
                    </div>
                    <div class="air-input-group">
                        <label class="air-label">Exclude URL</label>
                        <input type="text" id="air-input-exclude" class="air-input">
                    </div>
                    <div class="air-input-group">
                        <label class="air-label">System Prompt</label>
                        <textarea id="air-input-prompt" class="air-textarea" rows="4"></textarea>
                    </div>
                    <button id="air-btn-save" class="air-btn-primary">保存并刷新</button>
                    <div style="margin-top:15px;text-align:center;font-size:12px;color:#999">
                        <a href="#" id="air-clear-cache" style="color:#8b7355">清空缓存</a>
                    </div>
                </div>
            </div>
        </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        bindUIEvents();
    }

    // --- 文本处理核心 ---
    function processTextNode(node) {
        if (node.parentElement && ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentElement.tagName)) return node;
        
        const text = node.nodeValue;
        if (!text.trim()) return node;

        const fragment = document.createDocumentFragment();
        
        // 1. Split by sentence delimiters for analysis buttons
        const sentences = text.split(/(\.)/); // Simple split by period

        sentences.forEach(segment => {
            if (segment === '.') {
                // Add period text
                fragment.appendChild(document.createTextNode('.'));
                // Add Analysis Button
                const btn = document.createElement('span');
                btn.className = 'air-analyze-btn';
                btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>';
                btn.dataset.airAction = 'analyze';
                fragment.appendChild(btn);
            } else if (segment.length > 0) {
                // 2. Process words inside the sentence
                processWordsInSegment(segment, fragment);
            }
        });

        return fragment;
    }

    function processWordsInSegment(text, container) {
        // Split keeping delimiters
        const parts = text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/g);
        
        parts.forEach(part => {
            if (!part) return;
            if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                // It is a word
                const span = document.createElement('span');
                span.className = 'air-clickable-word';
                span.textContent = part;

                // Color logic
                if (checkInSet(part, state.excludedWords)) {
                    // Excluded - plain clickable
                } else if (checkInSet(part, state.redWords)) {
                    span.classList.add('air-highlight-red');
                } else if (checkInSet(part, state.blueWords)) {
                    span.classList.add('air-highlight-blue');
                }
                
                container.appendChild(span);
            } else {
                // Punctuation/Spaces
                container.appendChild(document.createTextNode(part));
            }
        });
    }

    function traverseAndProcess(node) {
        if (node.nodeType === 3) { // Text Node
            if(node.parentNode && node.parentNode.classList.contains('air-clickable-word')) return;
            const processed = processTextNode(node);
            if (processed !== node) {
                node.parentNode.replaceChild(processed, node);
            }
        } else if (node.nodeType === 1) { // Element
            // Skip existing AI elements
            if (node.classList.contains('air-analyze-btn') || node.id.startsWith('air-')) return;
            
            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(traverseAndProcess);
        }
    }

    // --- 查词功能 (Popup Logic) ---
    async function handleWordClick(target) {
        const word = target.innerText.trim();
        const popup = document.getElementById('air-dict-popup');
        
        // 1. Position Popup
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        let top = rect.bottom + scrollTop + 8;
        let left = rect.left + scrollLeft;
        
        // Edge detection (Basic)
        if (left + 280 > window.innerWidth) {
            left = window.innerWidth - 300;
        }

        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
        popup.innerHTML = `<div class="air-dict-loading"><span class="air-spinner" style="width:14px;height:14px;border-width:2px;margin:0"></span> Searching...</div>`;
        popup.classList.add('active');
        state.activePopup = popup;

        // 2. Fetch Data
        try {
            const [trans, ipa] = await Promise.all([
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&dt=bd&q=${encodeURIComponent(word)}`).then(r=>r.json()).catch(()=>null),
                fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`).then(r=>r.json()).then(d=>d[0]?.phonetics?.find(p=>p.text)?.text).catch(()=>null)
            ]);
            renderDictContent(popup, word, trans, ipa);
        } catch (e) {
            popup.innerHTML = "Error loading definition.";
        }
    }

    function renderDictContent(container, word, transData, ipa) {
        const safeWord = word.replace(/'/g, "\\'");
        const basicTrans = transData && transData[0] ? transData[0][0][0] : "无释义";
        
        let html = `
            <div class="air-dict-header">
                <span class="air-dict-word">${word}</span>
                ${ipa ? `<span class="air-dict-ipa">${ipa}</span>` : ''}
                <span class="air-dict-speaker" onclick="AIReader.playAudio('${safeWord}', this)">
                   <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </span>
            </div>
            <div style="margin-bottom:6px; color:#444;">${basicTrans}</div>
        `;

        if (transData && transData[1]) {
            transData[1].slice(0, 2).forEach(entry => {
                html += `
                <div style="margin-bottom:4px; font-size:13px; line-height:1.4;">
                    <span class="air-dict-pos">${entry[0]}.</span>
                    <span style="color:#555">${entry[1].slice(0,3).join('; ')}</span>
                </div>`;
            });
        }
        
        container.innerHTML = html;
    }

    // --- 分析功能 (API) ---
    async function handleAnalyzeClick(target) {
        // Highlight active button
        document.querySelectorAll('.air-analyze-btn').forEach(b => b.classList.remove('air-btn-active'));
        target.classList.add('air-btn-active');
        
        // Extract sentence
        let text = "";
        let curr = target.previousSibling;
        while(curr) {
            // Stop if we hit a block element or another analyze button
            if (curr.nodeType === 1 && (curr.classList.contains('air-analyze-btn') || getComputedStyle(curr).display === 'block')) break;
            text = (curr.textContent || curr.innerText) + text;
            // Stop if we hit a period inside text (simple heuristic)
            if (text.trim().endsWith('.')) break; // Logic can be improved
            curr = curr.previousSibling;
        }
        // Basic cleanup
        const sentence = text.split('.').pop() + "."; // Get last segment ending in dot
        
        const modal = document.getElementById('air-result-modal');
        const originalBox = document.getElementById('air-original-text');
        const contentBox = document.getElementById('air-analysis-content');
        
        originalBox.textContent = sentence.trim();
        contentBox.innerHTML = '<div class="air-spinner"></div><p style="text-align:center;color:#888">AI 正在分析...</p>';
        modal.classList.add('active');

        // Check Cache
        const apiKey = localStorage.getItem('air_key');
        const prompt = localStorage.getItem('air_prompt') || CONFIG.default_prompt;
        const cacheKey = CONFIG.cache_prefix + btoa(encodeURIComponent(sentence + prompt)).slice(0, 32);
        
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            contentBox.innerHTML = `<div class="air-ai-content">${marked.parse(JSON.parse(cached).content)}</div>`;
            return;
        }

        if (!apiKey) {
            contentBox.innerHTML = '<p style="color:#d93025">请点击右下角设置按钮配置 API Key。</p>';
            return;
        }

        try {
            const res = await fetch(CONFIG.api_url, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: CONFIG.default_model,
                    messages: [{role: "system", content: prompt}, {role: "user", content: `Analyze: "${sentence}"`}],
                    temperature: 0.7
                })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            const content = data.choices[0].message.content;
            
            localStorage.setItem(cacheKey, JSON.stringify({ content, timestamp: Date.now() }));
            contentBox.innerHTML = `<div class="air-ai-content">${marked.parse(content)}</div>`;
        } catch (e) {
            contentBox.innerHTML = `<p style="color:#d93025">请求出错: ${e.message}</p>`;
        }
    }

    // --- 事件绑定 ---
    function bindUIEvents() {
        // Global Delegation
        document.addEventListener('click', (e) => {
            // Close Popup if clicking outside
            const popup = document.getElementById('air-dict-popup');
            if (popup && popup.classList.contains('active') && !popup.contains(e.target) && !e.target.classList.contains('air-clickable-word')) {
                popup.classList.remove('active');
            }

            // Click Word
            if (e.target.classList.contains('air-clickable-word')) {
                handleWordClick(e.target);
            }

            // Click Analyze
            if (e.target.closest('.air-analyze-btn')) {
                handleAnalyzeClick(e.target.closest('.air-analyze-btn'));
            }

            // Close Modals
            if (e.target.classList.contains('air-modal-overlay')) {
                e.target.classList.remove('active');
            }
            if (e.target.classList.contains('air-close-btn')) {
                const targetId = e.target.getAttribute('data-target');
                document.getElementById(targetId).classList.remove('active');
            }
        });

        // Settings FAB
        document.getElementById('air-fab-settings').onclick = () => {
            document.getElementById('air-input-key').value = localStorage.getItem('air_key') || '';
            document.getElementById('air-input-blue').value = localStorage.getItem('air_url_blue') || '';
            document.getElementById('air-input-red').value = localStorage.getItem('air_url_red') || '';
            document.getElementById('air-input-exclude').value = localStorage.getItem('air_url_exclude') || '';
            document.getElementById('air-input-prompt').value = localStorage.getItem('air_prompt') || CONFIG.default_prompt;
            document.getElementById('air-settings-modal').classList.add('active');
        };

        // Save Settings
        document.getElementById('air-btn-save').onclick = () => {
            localStorage.setItem('air_key', document.getElementById('air-input-key').value.trim());
            localStorage.setItem('air_url_blue', document.getElementById('air-input-blue').value.trim());
            localStorage.setItem('air_url_red', document.getElementById('air-input-red').value.trim());
            localStorage.setItem('air_url_exclude', document.getElementById('air-input-exclude').value.trim());
            localStorage.setItem('air_prompt', document.getElementById('air-input-prompt').value);
            location.reload();
        };

        // Clear Cache
        document.getElementById('air-clear-cache').onclick = (e) => {
            e.preventDefault();
            Object.keys(localStorage).forEach(k => k.startsWith(CONFIG.cache_prefix) && localStorage.removeItem(k));
            alert('缓存已清空');
        };
    }

    // --- 初始化 ---
    const AIReader = {
        init: async function(options = {}) {
            console.log("AIReader Initializing...");
            
            // 1. Load Dependencies if missing
            await Promise.all([
                loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js', 'marked'),
                loadScript('https://unpkg.com/compromise@14.10.0/builds/compromise.min.js', 'nlp')
            ]);

            // 2. Load Word Lists
            const blueUrl = localStorage.getItem('air_url_blue') || options.blueUrl;
            const redUrl = localStorage.getItem('air_url_red') || options.redUrl;
            const excludeUrl = localStorage.getItem('air_url_exclude') || options.excludeUrl;

            await Promise.all([
                fetchWords(blueUrl).then(s => state.blueWords = s),
                fetchWords(redUrl).then(s => state.redWords = s),
                fetchWords(excludeUrl).then(s => state.excludedWords = s)
            ]);

            // 3. Inject UI
            injectUIComponents();

            // 4. Process Container
            const containerId = options.containerId || 'content';
            const container = document.getElementById(containerId);
            if (container) {
                state.container = container;
                // Remove existing processing if re-running (simplistic check)
                if(!container.querySelector('.air-analyze-btn')) {
                    traverseAndProcess(container);
                }
            } else {
                console.warn(`AIReader: Container #${containerId} not found.`);
            }
        },

        playAudio: function(text, btn) {
            const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
            const audio = new Audio(url);
            if(btn) btn.classList.add('playing');
            audio.onended = () => btn && btn.classList.remove('playing');
            audio.play();
        }
    };

    global.AIReader = AIReader;

})(window);
