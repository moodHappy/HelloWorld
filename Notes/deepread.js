/**
 * DeepRead.js - 一行代码实现的 AI 沉浸式阅读助手
 * Usage: <script src="deepread.js"></script>
 */

(function() {
    // 防止重复加载
    if (window.DeepReadActive) return;
    window.DeepReadActive = true;

    const CACHE_KEY_PREFIX = 'dr_cache_';
    
    class DeepRead {
        constructor() {
            // 默认配置
            this.config = {
                apiKey: localStorage.getItem('dr_groq_key') || '',
                model: localStorage.getItem('dr_model') || 'meta-llama/llama-4-maverick-17b-128e-instruct',
                prompt: localStorage.getItem('dr_prompt') || "分析句子：\n1. 难度(CEFR)\n2. 语法结构\n3. 中文翻译\nMarkdown格式。",
                blueUrl: localStorage.getItem('dr_url_blue') || '',
                redUrl: localStorage.getItem('dr_url_red') || '',
                excludeUrl: localStorage.getItem('dr_url_exclude') || ''
            };
            
            this.wordLists = { blue: new Set(), red: new Set(), exclude: new Set() };
            this.lemmaCache = new Map();
            this.tippyInstances = [];
            
            // 启动
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
            } else {
                this.init();
            }
        }

        async init() {
            console.log("DeepRead: Starting...");
            this.injectStyles();
            this.injectFloatingUI(); // 注入设置按钮和模态框
            
            await this.loadDependencies();
            await this.loadWordLists(); // 加载生词表
            
            // 只有当有 API Key 或为了展示基本查词功能时，开始处理文本
            // 为了用户体验，直接处理文本以提供查词功能，分析功能没Key会提示
            this.processPage();
            
            console.log("DeepRead: Active.");
        }

        // --- 1. 界面与样式注入 ---

        injectStyles() {
            const css = `
                /* 悬浮设置按钮 */
                #dr-float-btn {
                    position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
                    background: #2c3e50; color: white; border-radius: 50%;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3); cursor: pointer; z-index: 9999;
                    display: flex; align-items: center; justify-content: center; transition: transform 0.2s;
                }
                #dr-float-btn:hover { transform: scale(1.1); background: #34495e; }
                #dr-float-btn svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 2; }

                /* 单词样式 */
                .dr-word { cursor: pointer; border-radius: 3px; transition: 0.2s; }
                .dr-word:hover { background: rgba(0,0,0,0.05); }
                .dr-blue { color: #1967d2; font-weight: 500; }
                .dr-red { color: #d93025; font-weight: 500; }
                
                /* AI 分析按钮 */
                .dr-analyze-btn {
                    display: inline-flex; width: 16px; height: 16px; margin: 0 3px; 
                    background: rgba(139, 115, 85, 0.15); border-radius: 50%; cursor: pointer;
                    color: #8b7355; vertical-align: middle; transition: 0.2s;
                }
                .dr-analyze-btn:hover { background: #8b7355; color: white; transform: scale(1.2); }

                /* 模态框通用 */
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
                    font-family: system-ui, -apple-system, sans-serif;
                }
                .dr-header { padding: 15px 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; }
                .dr-title { font-weight: bold; font-size: 16px; color: #333; }
                .dr-body { padding: 20px; overflow-y: auto; }
                .dr-input-group { margin-bottom: 15px; }
                .dr-label { display: block; font-size: 12px; color: #666; margin-bottom: 5px; }
                .dr-input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
                .dr-btn { width: 100%; padding: 10px; background: #2c3e50; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 10px; }
                .dr-btn:hover { background: #34495e; }
                
                /* 查词 & 结果内容 */
                .dr-dict-pop { text-align: left; font-size: 14px; max-width: 300px; color: #333; }
                .dr-ipa { background: #eee; padding: 0 4px; border-radius: 3px; font-size: 12px; margin: 0 5px; }
                .dr-result-content { line-height: 1.6; font-size: 15px; }
                .dr-result-content h1, .dr-result-content h2 { font-size: 1.2em; border-bottom: 1px dashed #ccc; margin-top: 10px; }
            `;
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }

        injectFloatingUI() {
            // 1. 悬浮按钮
            const btn = document.createElement('div');
            btn.id = 'dr-float-btn';
            btn.title = 'AI 阅读设置';
            btn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>`;
            btn.onclick = () => this.toggleModal('dr-settings-modal');
            document.body.appendChild(btn);

            // 2. 设置模态框
            const settingsHtml = `
                <div id="dr-settings-modal" class="dr-modal">
                    <div class="dr-modal-box">
                        <div class="dr-header">
                            <span class="dr-title">DeepRead 设置</span>
                            <span style="cursor:pointer;font-size:20px;" onclick="document.getElementById('dr-settings-modal').classList.remove('active')">&times;</span>
                        </div>
                        <div class="dr-body">
                            <div class="dr-input-group">
                                <label class="dr-label">Groq API Key (必填)</label>
                                <input type="password" id="dr-input-key" class="dr-input" placeholder="gsk_..." value="${this.config.apiKey}">
                            </div>
                            <div class="dr-input-group">
                                <label class="dr-label">Model</label>
                                <select id="dr-input-model" class="dr-input">
                                    <option value="meta-llama/llama-4-maverick-17b-128e-instruct">Llama 4 (17b)</option>
                                    <option value="llama-3.3-70b-versatile">Llama 3.3 (70b)</option>
                                </select>
                            </div>
                            <div class="dr-input-group">
                                <label class="dr-label" style="color:#1967d2">蓝色高亮词表 URL (可选)</label>
                                <input type="text" id="dr-input-blue" class="dr-input" value="${this.config.blueUrl}">
                            </div>
                            <div class="dr-input-group">
                                <label class="dr-label" style="color:#d93025">红色高亮词表 URL (可选)</label>
                                <input type="text" id="dr-input-red" class="dr-input" value="${this.config.redUrl}">
                            </div>
                            <button class="dr-btn" id="dr-save-btn">保存并应用</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', settingsHtml);

            // 3. AI 结果模态框
            const resultHtml = `
                <div id="dr-result-modal" class="dr-modal">
                    <div class="dr-modal-box">
                        <div class="dr-header">
                            <span class="dr-title">AI 分析</span>
                            <span style="cursor:pointer;font-size:20px;" onclick="document.getElementById('dr-result-modal').classList.remove('active')">&times;</span>
                        </div>
                        <div class="dr-body">
                            <div style="background:#f4f4f4;padding:10px;margin-bottom:15px;border-left:3px solid #666;font-style:italic;" id="dr-sentence-preview"></div>
                            <div id="dr-ai-content" class="dr-result-content"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', resultHtml);

            // 绑定保存事件
            document.getElementById('dr-save-btn').onclick = () => {
                const key = document.getElementById('dr-input-key').value.trim();
                const model = document.getElementById('dr-input-model').value;
                const blue = document.getElementById('dr-input-blue').value.trim();
                const red = document.getElementById('dr-input-red').value.trim();

                localStorage.setItem('dr_groq_key', key);
                localStorage.setItem('dr_model', model);
                localStorage.setItem('dr_url_blue', blue);
                localStorage.setItem('dr_url_red', red);
                
                alert('设置已保存，页面将刷新以应用更改。');
                location.reload();
            };
            
            // 点击遮罩关闭
            document.querySelectorAll('.dr-modal').forEach(m => {
                m.addEventListener('click', e => { if(e.target === m) m.classList.remove('active'); });
            });
            
            // 初始化 Select 选中状态
            document.getElementById('dr-input-model').value = this.config.model;
        }

        // --- 2. 依赖与数据加载 ---

        async loadDependencies() {
            const deps = [
                'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
                'https://unpkg.com/@popperjs/core@2',
                'https://unpkg.com/tippy.js@6',
                'https://unpkg.com/compromise@14.10.0/builds/compromise.min.js',
                'https://unpkg.com/tippy.js@6/animations/shift-away.css'
            ];
            
            const load = (src) => new Promise((resolve) => {
                if(src.endsWith('.css')) {
                    const l = document.createElement('link'); l.rel='stylesheet'; l.href=src;
                    document.head.appendChild(l); resolve();
                } else {
                    if(document.querySelector(`script[src="${src}"]`)) return resolve();
                    const s = document.createElement('script'); s.src=src; s.onload=resolve;
                    document.head.appendChild(s);
                }
            });
            await Promise.all(deps.map(load));
        }

        async loadWordLists() {
            const fetchList = async (url) => {
                if(!url) return new Set();
                try {
                    const t = await (await fetch(url)).text();
                    return new Set(t.split(/\s+/).map(w=>w.trim().toLowerCase()).filter(Boolean));
                } catch(e) { console.error('Load list failed:', url); return new Set(); }
            };
            
            [this.wordLists.blue, this.wordLists.red] = await Promise.all([
                fetchList(this.config.blueUrl),
                fetchList(this.config.redUrl)
            ]);
        }

        // --- 3. 核心文本处理 ---

        processPage() {
            // 简单策略：遍历 Body，跳过 script/style/nav 等
            const ignoreTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'svg', 'NAV', 'FOOTER', 'HEADER', 'NOSCRIPT'];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    if (ignoreTags.includes(node.parentNode.tagName)) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode.isContentEditable) return NodeFilter.FILTER_REJECT;
                    if (node.parentNode.classList.contains('dr-word')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);

            nodes.forEach(node => {
                const text = node.nodeValue;
                if (!text.trim()) return;
                
                // 处理逻辑：如果有句号，分割插入按钮；否则仅高亮单词
                if (/[.!?]/.test(text)) {
                    const frag = document.createDocumentFragment();
                    // 简单正则分割句子，保留标点
                    text.split(/([.!?]+)/).forEach(seg => {
                        if (/[.!?]+/.test(seg)) {
                            frag.appendChild(document.createTextNode(seg));
                            // 在句号后插入分析按钮
                            const btn = document.createElement('span');
                            btn.className = 'dr-analyze-btn';
                            btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:10px;height:10px;fill:currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm0-4h-2V7h2z"/></svg>`;
                            btn.onclick = (e) => this.handleAnalyze(e);
                            frag.appendChild(btn);
                        } else if (seg.trim()) {
                            this.wrapWords(seg, frag);
                        }
                    });
                    node.parentNode.replaceChild(frag, node);
                } else {
                    const frag = document.createDocumentFragment();
                    this.wrapWords(text, frag);
                    node.parentNode.replaceChild(frag, node);
                }
            });

            this.initTippy();
        }

        wrapWords(text, frag) {
            text.split(/([a-zA-Z0-9\u00C0-\u024F]+)/).forEach(part => {
                if (/^[a-zA-Z0-9\u00C0-\u024F]+$/.test(part)) {
                    const span = document.createElement('span');
                    span.className = 'dr-word';
                    span.textContent = part;
                    
                    // 高亮逻辑
                    const lower = part.toLowerCase();
                    let root = lower;
                    if (window.nlp && !this.lemmaCache.has(lower)) {
                        try { root = window.nlp(lower).compute('root').text('root') || lower; } catch(e){}
                        this.lemmaCache.set(lower, root);
                    } else if (this.lemmaCache.has(lower)) {
                        root = this.lemmaCache.get(lower);
                    }

                    if (this.wordLists.red.has(root) || this.wordLists.red.has(lower)) span.classList.add('dr-red');
                    else if (this.wordLists.blue.has(root) || this.wordLists.blue.has(lower)) span.classList.add('dr-blue');
                    
                    frag.appendChild(span);
                } else {
                    frag.appendChild(document.createTextNode(part));
                }
            });
        }

        // --- 4. 交互逻辑 ---

        initTippy() {
            tippy('.dr-word', {
                trigger: 'click', interactive: true, theme: 'light-border',
                animation: 'shift-away', appendTo: document.body, allowHTML: true, maxWidth: 300,
                onShow: (instance) => {
                    const word = instance.reference.innerText.trim();
                    instance.setContent('<div class="dr-dict-pop">Loading...</div>');
                    this.fetchDict(word).then(html => instance.setContent(html));
                }
            });
        }

        async fetchDict(word) {
            // 这里使用一个简单的 Dictionary API + Google Translate
            // 实际应用可替换为更稳定的付费 API
            const escaped = word.replace(/'/g, "\\'");
            try {
                const [trans, dict] = await Promise.all([
                     fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(word)}`).then(r=>r.json()),
                     fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`).then(r=>r.ok?r.json():null)
                ]);
                
                const cn = trans[0]?.[0]?.[0] || '翻译失败';
                const ipa = dict?.[0]?.phonetics?.find(p=>p.text)?.text || '';
                
                // 播放音频的小函数
                window.drPlay = (txt) => new Audio(`https://dict.youdao.com/dictvoice?audio=${txt}&type=2`).play();

                return `
                    <div class="dr-dict-pop">
                        <div style="display:flex;align-items:center;border-bottom:1px solid #eee;padding-bottom:5px;margin-bottom:5px;">
                            <strong style="font-size:16px;color:#d32f2f">${word}</strong>
                            <span class="dr-ipa">${ipa}</span>
                            <span onclick="window.drPlay('${escaped}')" style="cursor:pointer;color:#1976d2;">🔊</span>
                        </div>
                        <div>${cn}</div>
                    </div>
                `;
            } catch (e) { return '查询失败'; }
        }

        async handleAnalyze(e) {
            if (!this.config.apiKey) {
                this.toggleModal('dr-settings-modal');
                alert('请先配置 Groq API Key！');
                return;
            }

            // 提取句子：向前回溯到上一个按钮或句首
            let sentence = "";
            let curr = e.currentTarget.previousSibling;
            while(curr) {
                if (curr.nodeType === 3) {
                    sentence = curr.nodeValue + sentence;
                    if (/[.!?]/.test(sentence) && sentence.search(/[.!?]/) < sentence.length -1) {
                         sentence = sentence.substring(sentence.search(/[.!?]/) + 1);
                         break;
                    }
                } else if (curr.innerText) {
                    sentence = curr.innerText + sentence;
                }
                if (curr.classList && curr.classList.contains('dr-analyze-btn')) break;
                curr = curr.previousSibling;
            }
            sentence = sentence.trim();

            // 显示 UI
            const contentDiv = document.getElementById('dr-ai-content');
            document.getElementById('dr-sentence-preview').innerText = sentence;
            contentDiv.innerHTML = '<div style="text-align:center;padding:20px;color:#8b7355">AI 正在思考...</div>';
            this.toggleModal('dr-result-modal');

            // 缓存检查
            const cacheKey = CACHE_KEY_PREFIX + sentence.slice(0, 20) + '_' + sentence.length;
            const cached = localStorage.getItem(cacheKey);
            if(cached) {
                contentDiv.innerHTML = marked.parse(cached);
                return;
            }

            // API 调用
            try {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: this.config.model,
                        messages: [{role: "system", content: this.config.prompt}, {role: "user", content: `Analyze: "${sentence}"`}],
                        temperature: 0.7
                    })
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.error?.message || 'Error');
                
                const md = data.choices[0]?.message?.content || '无内容';
                localStorage.setItem(cacheKey, md);
                contentDiv.innerHTML = marked.parse(md);
            } catch (err) {
                contentDiv.innerHTML = `<p style="color:red">API Error: ${err.message}</p>`;
            }
        }

        toggleModal(id) {
            const m = document.getElementById(id);
            m.classList.toggle('active');
        }
    }

    new DeepRead();

})();
