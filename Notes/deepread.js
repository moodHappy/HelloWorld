/**
 * DeepRead.js - 修复版 (v1.2)
 * 修复了等待资源加载导致正文不渲染的问题
 */

(function() {
    if (window.DeepReadActive) return;
    window.DeepReadActive = true;

    const CACHE_KEY_PREFIX = 'dr_cache_';
    
    class DeepRead {
        constructor() {
            this.config = {
                apiKey: localStorage.getItem('dr_groq_key') || '',
                model: localStorage.getItem('dr_model') || 'meta-llama/llama-4-maverick-17b-128e-instruct',
                prompt: localStorage.getItem('dr_prompt') || "分析句子：\n1. 难度(CEFR)\n2. 语法结构\n3. 中文翻译\nMarkdown格式。",
                blueUrl: localStorage.getItem('dr_url_blue') || '',
                redUrl: localStorage.getItem('dr_url_red') || '',
            };
            
            this.wordLists = { blue: new Set(), red: new Set() };
            this.lemmaCache = new Map();
            this.dependenciesLoaded = false;
            
            // 立即启动
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }

        init() {
            console.log("DeepRead: Init...");
            this.injectStyles();
            this.injectFloatingUI();
            
            // 关键修复：不等待依赖和词表，直接先处理页面结构（生成按钮）
            this.processPage(); 
            
            // 后台异步加载资源
            this.loadDependencies().then(() => {
                this.dependenciesLoaded = true;
                this.initTippy(); // 资源加载完后再绑定弹窗
            });
            
            this.loadWordLists().then(() => {
                // 词表加载完后，重新扫描高亮（不影响按钮）
                this.applyHighlighting();
            });
        }

        // --- 1. 样式与UI ---

        injectStyles() {
            const css = `
                #dr-float-btn {
                    position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
                    background: #2c3e50; color: white; border-radius: 50%;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: pointer; z-index: 9999;
                    display: flex; align-items: center; justify-content: center; transition: transform 0.2s;
                }
                #dr-float-btn:hover { transform: scale(1.1); background: #34495e; }
                
                .dr-word { cursor: pointer; border-radius: 3px; transition: 0.2s; }
                .dr-word:hover { background: rgba(0,0,0,0.05); }
                .dr-blue { color: #1967d2; font-weight: 500; }
                .dr-red { color: #d93025; font-weight: 500; }
                
                .dr-analyze-btn {
                    display: inline-flex; width: 18px; height: 18px; margin: 0 2px 0 4px; 
                    background: rgba(139, 115, 85, 0.15); border-radius: 50%; cursor: pointer;
                    color: #8b7355; vertical-align: middle; justify-content: center; align-items: center;
                }
                .dr-analyze-btn:hover { background: #8b7355; color: white; transform: scale(1.1); }
                
                /* Modal Styles */
                .dr-modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); z-index: 10000; display: none;
                    align-items: center; justify-content: center; backdrop-filter: blur(2px);
                }
                .dr-modal.active { display: flex; }
                .dr-modal-box {
                    background: white; width: 90%; max-width: 500px; max-height: 85vh;
                    border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    display: flex; flex-direction: column; overflow: hidden;
                    font-family: sans-serif;
                }
                .dr-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f9f9f9; }
                .dr-body { padding: 20px; overflow-y: auto; }
                .dr-input-group { margin-bottom: 15px; }
                .dr-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                .dr-btn { width: 100%; padding: 10px; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; }
                
                .dr-dict-pop { font-size: 14px; max-width: 300px; color: #333; }
                .dr-result-content { line-height: 1.6; font-size: 15px; }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }

        injectFloatingUI() {
            // Settings Button
            const btn = document.createElement('div');
            btn.id = 'dr-float-btn';
            btn.innerHTML = '⚙️';
            btn.onclick = () => document.getElementById('dr-settings-modal').classList.add('active');
            document.body.appendChild(btn);

            // Settings Modal
            const settingsHtml = `
                <div id="dr-settings-modal" class="dr-modal">
                    <div class="dr-modal-box">
                        <div class="dr-header"><strong>DeepRead 设置</strong><span onclick="document.getElementById('dr-settings-modal').classList.remove('active')" style="cursor:pointer">✕</span></div>
                        <div class="dr-body">
                            <div class="dr-input-group"><label>Groq API Key</label><input type="password" id="dr-key" class="dr-input" value="${this.config.apiKey}"></div>
                            <div class="dr-input-group"><label>蓝色词表 URL</label><input type="text" id="dr-blue" class="dr-input" value="${this.config.blueUrl}"></div>
                            <div class="dr-input-group"><label>红色词表 URL</label><input type="text" id="dr-red" class="dr-input" value="${this.config.redUrl}"></div>
                            <button class="dr-btn" id="dr-save">保存并刷新</button>
                        </div>
                    </div>
                </div>
                <div id="dr-result-modal" class="dr-modal">
                    <div class="dr-modal-box">
                        <div class="dr-header"><strong>AI 分析</strong><span onclick="document.getElementById('dr-result-modal').classList.remove('active')" style="cursor:pointer">✕</span></div>
                        <div class="dr-body"><div id="dr-preview" style="background:#eee;padding:10px;margin-bottom:10px;font-style:italic"></div><div id="dr-content" class="dr-result-content"></div></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', settingsHtml);

            document.getElementById('dr-save').onclick = () => {
                localStorage.setItem('dr_groq_key', document.getElementById('dr-key').value.trim());
                localStorage.setItem('dr_url_blue', document.getElementById('dr-blue').value.trim());
                localStorage.setItem('dr_url_red', document.getElementById('dr-red').value.trim());
                location.reload();
            };
            
            document.querySelectorAll('.dr-modal').forEach(m => m.onclick = e => { if(e.target === m) m.classList.remove('active'); });
        }

        // --- 2. 核心文本处理 (立即执行) ---

        processPage() {
            console.log("DeepRead: Processing text nodes...");
            const ignoreTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SVG', 'BUTTON', 'NAV', 'HEADER', 'FOOTER'];
            
            // 使用 TreeWalker 遍历
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    if (ignoreTags.includes(node.parentNode.tagName)) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode.isContentEditable) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode.className && typeof node.parentNode.className === 'string' && node.parentNode.className.includes('dr-')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);

            nodes.forEach(node => {
                const text = node.nodeValue;
                if (!text.trim()) return;

                // 简单的判断：是否包含标点
                if (/[.!?]/.test(text)) {
                    const frag = document.createDocumentFragment();
                    // 分割逻辑：保留标点
                    const parts = text.split(/([.!?]+)/);
                    
                    parts.forEach(part => {
                        if (/[.!?]+/.test(part)) {
                            // 是标点
                            frag.appendChild(document.createTextNode(part));
                            // 添加按钮
                            const btn = document.createElement('span');
                            btn.className = 'dr-analyze-btn';
                            // 使用简单的 HTML 实体作为图标，减少 SVG 渲染压力
                            btn.innerHTML = '✦'; 
                            btn.title = '点击分析';
                            btn.onclick = (e) => this.handleAnalyze(e);
                            frag.appendChild(btn);
                        } else if (part.trim()) {
                            // 是文字
                            this.wrapWords(part, frag);
                        } else {
                            // 是空格
                            frag.appendChild(document.createTextNode(part));
                        }
                    });
                    node.parentNode.replaceChild(frag, node);
                } else {
                    const frag = document.createDocumentFragment();
                    this.wrapWords(text, frag);
                    node.parentNode.replaceChild(frag, node);
                }
            });
        }

        wrapWords(text, frag) {
            // 初始阶段只包裹 dr-word，不加颜色，颜色等词表加载完再加
            text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/).forEach(part => {
                if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                    const span = document.createElement('span');
                    span.className = 'dr-word';
                    span.textContent = part;
                    frag.appendChild(span);
                } else {
                    frag.appendChild(document.createTextNode(part));
                }
            });
        }

        // --- 3. 异步资源加载 ---

        async loadDependencies() {
            const urls = [
                'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
                'https://unpkg.com/@popperjs/core@2',
                'https://unpkg.com/tippy.js@6',
                'https://unpkg.com/tippy.js@6/animations/shift-away.css'
            ];
            // 并行加载，失败不阻塞
            await Promise.all(urls.map(url => {
                return new Promise(resolve => {
                    if (url.endsWith('.css')) {
                        const l = document.createElement('link'); l.rel='stylesheet'; l.href=url;
                        l.onload = resolve; l.onerror = resolve; // 即使失败也继续
                        document.head.appendChild(l);
                    } else {
                        if (document.querySelector(`script[src="${url}"]`)) return resolve();
                        const s = document.createElement('script'); s.src=url;
                        s.onload = resolve; s.onerror = resolve;
                        document.head.appendChild(s);
                    }
                });
            }));
        }

        async loadWordLists() {
            const fetchList = async (url) => {
                if (!url || url.trim() === '') return new Set();
                try {
                    const res = await fetch(url);
                    if(!res.ok) return new Set();
                    const t = await res.text();
                    // 防止把 HTML 当作词表
                    if(t.trim().startsWith('<')) return new Set();
                    return new Set(t.split(/\s+/).map(w => w.trim().toLowerCase()).filter(Boolean));
                } catch (e) { return new Set(); }
            };

            const [b, r] = await Promise.all([
                fetchList(this.config.blueUrl),
                fetchList(this.config.redUrl)
            ]);
            this.wordLists.blue = b;
            this.wordLists.red = r;
        }

        applyHighlighting() {
            // 词表加载完后，给已存在的 span 增加颜色类
            if (this.wordLists.blue.size === 0 && this.wordLists.red.size === 0) return;
            
            document.querySelectorAll('.dr-word').forEach(span => {
                const w = span.textContent.toLowerCase();
                if (this.wordLists.red.has(w)) span.classList.add('dr-red');
                else if (this.wordLists.blue.has(w)) span.classList.add('dr-blue');
            });
        }

        // --- 4. 交互逻辑 ---

        initTippy() {
            if (typeof tippy === 'undefined') return;
            tippy('.dr-word', {
                trigger: 'click', interactive: true, theme: 'light-border',
                animation: 'shift-away', appendTo: document.body, allowHTML: true, maxWidth: 300,
                onShow: (instance) => {
                    const word = instance.reference.innerText;
                    instance.setContent('Loading...');
                    this.fetchDict(word).then(h => instance.setContent(h));
                }
            });
        }

        async fetchDict(word) {
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                const data = await res.json();
                const d = data[0];
                return `
                    <div class="dr-dict-pop">
                        <strong>${d.word}</strong> <small>${d.phonetic || ''}</small>
                        <hr style="margin:5px 0;border:0;border-top:1px solid #eee">
                        <div>${d.meanings[0]?.definitions[0]?.definition || '暂无定义'}</div>
                        <div style="margin-top:5px;color:#666;font-size:0.8em"><a href="https://fanyi.baidu.com/#en/zh/${word}" target="_blank">查看更多</a></div>
                    </div>`;
            } catch(e) { return '查询失败'; }
        }

        async handleAnalyze(e) {
            if (!this.config.apiKey) return alert('请先点击右下角设置 API Key');
            
            // 提取句子
            let text = "";
            let node = e.target.previousSibling;
            while (node) {
                if(node.nodeType === 3) text = node.nodeValue + text;
                else if(node.innerText) text = node.innerText + text;
                if (/[.!?]/.test(node.textContent) && text.length > 5) break; // 简单防死循环
                if (node.classList && node.classList.contains('dr-analyze-btn')) break;
                node = node.previousSibling;
            }
            // 清理并截取
            const cleanText = text.replace(/.*[.!?]\s*/, '').trim(); 
            
            const modal = document.getElementById('dr-result-modal');
            const content = document.getElementById('dr-content');
            document.getElementById('dr-preview').innerText = cleanText;
            content.innerHTML = 'AI 正在分析...';
            modal.classList.add('active');

            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.config.model,
                        messages: [{role: "system", content: this.config.prompt}, {role: "user", content: `Analyze: "${cleanText}"`}],
                        temperature: 0.7
                    })
                });
                const json = await res.json();
                content.innerHTML = (window.marked ? marked.parse(json.choices[0].message.content) : json.choices[0].message.content);
            } catch (err) { content.innerText = 'Error: ' + err.message; }
        }
    }

    new DeepRead();
})();