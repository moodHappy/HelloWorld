(function() {
    'use strict';

    // ==========================================
    // 0. 配置管理与初始化
    // ==========================================
    const DEFAULT_CONFIG = {
        urls: { red: '', yellow: '', blue: '', green: '', purple: '', exclude: '' },
        listState: { red: true, yellow: true, blue: true, green: true, purple: true, exclude: true },
        style: {
            fontSizeRatio: '100',
            lineHeight: '1.6',
            color: '#333333',
            marginTop: '6px',
            theme: 'card',
            learningMode: false,
            showTTS: true,
            ttsUrl: ''
        },
        behavior: {
            mode: 'blacklist',
            blacklist: [],
            whitelist: []
        }
    };

    function getConfig() {
        let conf = GM_getValue('highlightConfig', DEFAULT_CONFIG);
        if (!conf.style) conf.style = DEFAULT_CONFIG.style;
        if (typeof conf.style.showTTS === 'undefined') conf.style.showTTS = true;
        if (typeof conf.style.ttsUrl === 'undefined') conf.style.ttsUrl = '';
        if (!conf.behavior) conf.behavior = DEFAULT_CONFIG.behavior;
        if (!conf.listState) conf.listState = DEFAULT_CONFIG.listState;
        return conf;
    }

    // 初始化 CSS 变量，响应用户设置
    function initDynamicStyles() {
        const c = getConfig();
        const root = document.documentElement;
        root.style.setProperty('--enlight-line-height', c.style.lineHeight);
        root.style.setProperty('--enlight-color', c.style.color);
        root.style.setProperty('--enlight-margin-top', c.style.marginTop);
        root.style.setProperty('--enlight-font-size-ratio', (parseInt(c.style.fontSizeRatio) || 100) / 100);
    }

    function shouldRun() {
        const c = getConfig();
        const currentUrl = window.location.href;
        const matchRule = (rule, url) => {
            const r = rule.trim();
            if (!r) return false;
            if (r.includes('*')) {
                const escapeRegex = (str) => str.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
                const pattern = "^" + r.split('*').map(escapeRegex).join('.*') + "$";
                return new RegExp(pattern).test(url);
            } else {
                return url.includes(r);
            }
        };
        const checkList = (list) => {
            if (!Array.isArray(list)) return false;
            return list.some(rule => matchRule(rule, currentUrl));
        };
        if (c.behavior.mode === 'whitelist') {
            return checkList(c.behavior.whitelist);
        } else {
            if (checkList(c.behavior.blacklist)) return false;
            return true;
        }
    }

    if (!shouldRun()) {
        GM_registerMenuCommand("⚙️ EnLight 设置 (当前已禁用)", openSettings);
        return;
    }

    // 应用动态样式
    initDynamicStyles();

    // ==========================================
    // 1. 核心基础库 (Compromise NLP)
    // ==========================================
    let nlpReady = typeof window.nlp !== 'undefined';
    let isNlpLoading = false;

    function ensureNlp() {
        if (typeof window.nlp !== 'undefined') { nlpReady = true; return Promise.resolve(); }
        if (isNlpLoading) return new Promise(resolve => {
            const check = setInterval(() => { if(nlpReady){ clearInterval(check); resolve(); } }, 100);
        });
        isNlpLoading = true;
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/compromise@13.11.4/builds/compromise.min.js';
            script.onload = () => { nlpReady = true; isNlpLoading = false; resolve(); };
            script.onerror = () => { isNlpLoading = false; reject(); };
            document.head.appendChild(script);
        });
    }

    // ==========================================
    // 2. 查词弹窗系统 (Shadow DOM)
    // ==========================================
    let popupRoot, popupEl;
    function createShadowPopup() {
        if (document.getElementById('wh-shadow-host')) return;
        const host = document.createElement('div');
        host.id = 'wh-shadow-host';
        host.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; pointer-events: none; z-index: 2147483647;';
        document.body.appendChild(host);
        const shadow = host.attachShadow({mode: 'open'});
        
        // 关键：将外部 CSS 注入到 Shadow DOM 中
        const style = document.createElement('style');
        // 尝试获取 Loader 加载的 CSS 资源
        try {
            style.textContent = GM_getResourceText("enlightCSS");
        } catch(e) {
            console.warn("EnLight: 无法加载 CSS 资源到 ShadowDOM，弹窗样式可能失效。");
        }
        shadow.appendChild(style);
        
        popupEl = document.createElement('div');
        popupEl.id = 'custom-dict-popup';
        shadow.appendChild(popupEl);
        popupRoot = shadow;
    }

    // ==========================================
    // 3. 高亮系统
    // ==========================================
    const wordSets = { red: new Set(), yellow: new Set(), blue: new Set(), green: new Set(), purple: new Set(), exclude: new Set() };
    const COLORS = {
        red: { color: '#FF3B30', label: '红色' },
        yellow: { color: '#F5A623', label: '黄色' },
        blue: { color: '#007AFF', label: '蓝色' },
        green: { color: '#34C759', label: '绿色' },
        purple: { color: '#AF52DE', label: '紫色' },
        exclude: { color: '#666666', label: '排除列表' }
    };

    function hashText(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return 'h' + hash;
    }

    async function loadWordLists() {
        const c = getConfig();
        const promises = Object.keys(c.urls).map(key => {
            if (!c.urls[key]) return Promise.resolve();
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET", url: c.urls[key] + '?t=' + new Date().getTime(),
                    onload: (res) => {
                        if (res.status === 200) {
                            wordSets[key] = new Set(res.responseText.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(Boolean));
                        }
                        resolve();
                    }, onerror: resolve
                });
            });
        });
        await Promise.all(promises);
        startHighlighterObserver();
    }

    function checkSet(word, lemma, colorKey) {
        const set = wordSets[colorKey];
        return set && set.size > 0 && (set.has(word.toLowerCase()) || set.has(lemma));
    }

    function getLemma(word) {
        if (!nlpReady || !window.nlp) return word.toLowerCase();
        const lower = word.toLowerCase();
        if (!window._lemmaCache) window._lemmaCache = new Map();
        if (window._lemmaCache.has(lower)) return window._lemmaCache.get(lower);
        try {
            const doc = window.nlp(lower);
            let root = null;
            root = doc.verbs().toInfinitive().text();
            if (!root) { root = doc.nouns().toSingular().text(); }
            if (!root) { doc.compute('root'); root = doc.text('root'); }
            const result = root ? root.toLowerCase() : lower;
            window._lemmaCache.set(lower, result);
            return result;
        } catch(e) { return lower; }
    }

    function processHighlightChunk(textNodes) {
        if (textNodes.length === 0) return;
        const c = getConfig();
        const CHUNK_SIZE = 50;
        const chunk = textNodes.splice(0, CHUNK_SIZE);

        chunk.forEach(textNode => {
            const text = textNode.nodeValue;
            if (!text || !text.trim()) return;
            const parts = text.split(/([a-zA-Z]+(?:'[a-z]+)?)/g);
            if (parts.length < 2) return;
            const fragment = document.createDocumentFragment();
            let hasReplacement = false;

            parts.forEach(part => {
                if (/^[a-zA-Z]/.test(part)) {
                    const lower = part.toLowerCase();
                    const lemma = getLemma(part);
                    let color = null;
                    const isExcluded = c.listState.exclude && (wordSets.exclude.has(lower) || wordSets.exclude.has(lemma));

                    if (!isExcluded) {
                        for (let k of ['red','yellow','blue','green','purple']) {
                            if (c.listState[k] && checkSet(part, lemma, k)) {
                                color = COLORS[k].color;
                                break;
                            }
                        }
                    }

                    if (color) {
                        const span = document.createElement('span');
                        span.className = 'wh-highlighted'; span.style.color = color; span.textContent = part;
                        fragment.appendChild(span); hasReplacement = true;
                    } else fragment.appendChild(document.createTextNode(part));
                } else fragment.appendChild(document.createTextNode(part));
            });

            if (hasReplacement && textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });

        if (textNodes.length > 0) {
            if (window.requestIdleCallback) window.requestIdleCallback(() => processHighlightChunk(textNodes));
            else setTimeout(() => processHighlightChunk(textNodes), 10);
        }
    }

    function scanNode(element) {
        if (element.dataset.whProcessed || element.closest('.it-trans-block')) return;
        element.dataset.whProcessed = "true";
        const ignoreTags = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'SELECT', 'CODE', 'PRE', 'SVG', 'NOSCRIPT', 'BUTTON', 'A'];
        if (ignoreTags.includes(element.tagName) || element.isContentEditable) return;
        if (element.classList.contains('bbc-live-fix')) return;

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.parentElement && !ignoreTags.includes(node.parentElement.tagName) && !node.parentElement.classList.contains('wh-highlighted')) {
                nodes.push(node);
            }
        }
        if (nodes.length > 0) {
            ensureNlp().then(() => processHighlightChunk(nodes));
        }
    }

    function startHighlighterObserver() {
        const isBBCLive = window.location.href.includes('/live/');
        if (isBBCLive) { document.body.setAttribute('data-bbc-live', 'true'); }

        const selector = 'p, li, h1, h2, h3, h4, h5, h6, td, dd, dt, blockquote, div, span, em, strong';
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => { if (e.isIntersecting) { scanNode(e.target); obs.unobserve(e.target); } });
        }, { rootMargin: '200px' });

        document.querySelectorAll(selector).forEach(el => observer.observe(el));

        new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && n.matches && n.matches(selector)) {
                observer.observe(n);
                if(isTranslationActive) scanAndTranslateSingle(n);
                if(getConfig().style.showTTS && n.matches('p, article p, .article-content p, blockquote')) processTTSNode(n);
            }
        }))).observe(document.body, { childList: true, subtree: true });
    }

    // ==========================================
    // 4. 沉浸式翻译
    // ==========================================
    const translationQueue = [];
    let isTranslating = false;
    let isTranslationActive = false;

    const IGNORE_SELECTORS = [
        'nav', 'header', 'footer', '[role="contentinfo"]', 'time', 'figcaption',
        '[class*="menu"]', '[class*="nav"]', '[class*="header"]',
        '.navigation', '.breadcrumb', '.button', 'button',
        '.lx-c-session-header', '.lx-c-sticky-share',
        '[data-testid*="card-metadata"]', '[data-testid*="card-footer"]',
        '[class*="Metadata"]', '[class*="Byline"]', '[class*="Contributor"]', '[class*="Copyright"]', '[class*="ImageMessage"]'
    ];

    function togglePageTranslation() {
        if (isTranslationActive) {
            document.querySelectorAll('.it-trans-block').forEach(el => el.remove());
            document.querySelectorAll('[data-it-translated]').forEach(el => el.removeAttribute('data-it-translated'));
            isTranslationActive = false;
            showToast('已关闭翻译');
        } else {
            isTranslationActive = true;
            scanAndTranslate();
            showToast('双语翻译已开启');
        }
    }

    function scanAndTranslate() {
        if (!isTranslationActive) return;
        const blocks = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, div');
        blocks.forEach(block => scanAndTranslateSingle(block));
        processTranslationQueue();
    }

    function scanAndTranslateSingle(block) {
        if (!isTranslationActive) return;
        if (block.matches(IGNORE_SELECTORS.join(',')) || block.closest(IGNORE_SELECTORS.join(','))) return;

        const isBBCLive = document.body.getAttribute('data-bbc-live') === 'true';
        if (isBBCLive) {
            if (block.tagName === 'DIV' || block.tagName === 'SPAN') return;
            if (block.tagName === 'LI' && block.querySelector('p, h1, h2, h3, h4, h5, h6, div, ul, ol')) return;
        } else {
            if (block.tagName === 'DIV' && block.querySelector('div, p, li, h1, h2, h3, h4, h5, h6')) return;
            if (block.tagName === 'LI' && block.querySelector('p')) return;
        }

        if (block.hasAttribute('data-it-translated') || block.closest('.it-trans-block') || block.offsetHeight === 0) return;
        const text = block.innerText.trim();

        if (block.tagName === 'DIV' && text.length < 50) return;
        if (text.length < 5) return;
        if (window.dayjs) {
            const d = window.dayjs(text);
            if (d.isValid() && text.length < 40 && (/\d/.test(text) || /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i.test(text))) return;
        }
        if (/^\d+\s*(hrs?|hours?|mins?|minutes?|secs?|seconds?|days?|weeks?)\s+ago/i.test(text)) return;
        if (text.includes('|') && text.length < 40) return;
        if (/^(Getty Images|Reuters|AFP|EPA|AP|Anadolu|BBC|Copyright)/i.test(text)) return;
        if (text.toLowerCase().includes(' via ') && text.length < 60) return;
        if (/^(By|Reporting by|Written by)\s+/i.test(text)) return;
        if (/(correspondent|Editor|Reporter)$/i.test(text) && text.length < 40) return;
        if (/^(Share|More|Menu|Home|Search)$/i.test(text)) return;
        if ((text.match(/[a-zA-Z]/g) || []).length / text.length < 0.3) return;

        block.setAttribute('data-it-translated', 'true');
        translationQueue.push({ element: block, text: text });
    }

    async function processTranslationQueue() {
        if (isTranslating || translationQueue.length === 0) return;
        const item = translationQueue.shift();
        if (!document.body.contains(item.element)) { processTranslationQueue(); return; }

        const textHash = hashText(item.text);
        const cached = await idbKeyval.get(textHash);

        if (cached) {
            renderTranslation(item.element, cached, true);
            processTranslationQueue();
            return;
        }

        isTranslating = true;
        const loadingDiv = document.createElement('div');
        const config = getConfig();
        loadingDiv.className = `it-trans-block theme-${config.style.theme}`;
        loadingDiv.style.opacity = '0.6';
        loadingDiv.innerText = 'Translating...';
        try {
            const computed = window.getComputedStyle(item.element);
            loadingDiv.style.fontSize = computed.fontSize;
            loadingDiv.style.marginLeft = computed.paddingLeft || computed.marginLeft;
        } catch(e){}
        item.element.after(loadingDiv);

        try {
            const transResult = await fetchGoogleTranslation(item.text);
            if (transResult) {
                loadingDiv.remove();
                await idbKeyval.set(textHash, transResult);
                renderTranslation(item.element, transResult, false);
            } else { loadingDiv.remove(); }
        } catch (e) { loadingDiv.innerText = 'Error'; }

        setTimeout(() => { isTranslating = false; processTranslationQueue(); }, 800 + Math.random() * 500);
    }

    function renderTranslation(targetElement, translatedText, isCached) {
        if (!document.body.contains(targetElement)) return;
        if (targetElement.nextElementSibling && targetElement.nextElementSibling.classList.contains('it-trans-block')) return;

        const config = getConfig();
        const div = document.createElement('div');
        div.className = `it-trans-block theme-${config.style.theme}`;
        if (isCached) div.classList.add('it-from-cache');
        div.innerText = translatedText;

        try {
            let styleEl = targetElement;
            if (targetElement.children.length > 0) {
                 const textChild = targetElement.querySelector('span, b, strong, em, i, font');
                 if (textChild && textChild.innerText.length > targetElement.innerText.length * 0.5) styleEl = textChild;
                 else if (targetElement.firstElementChild) styleEl = targetElement.firstElementChild;
            }
            const computed = window.getComputedStyle(styleEl);
            const rect = targetElement.getBoundingClientRect();
            if (rect.width > 0 && rect.width < window.innerWidth) div.style.maxWidth = `100%`;
            div.style.marginLeft = window.getComputedStyle(targetElement).marginLeft;
            if (computed.fontWeight) div.style.fontWeight = computed.fontWeight;
            if (computed.textAlign && computed.textAlign !== 'start') div.style.textAlign = computed.textAlign;
        } catch(e) {}

        if (config.style.learningMode) {
            div.classList.add('it-trans-blur');
            div.onclick = (e) => { e.stopPropagation(); div.classList.toggle('it-trans-blur'); };
        }
        targetElement.after(div);
    }

    async function fetchGoogleTranslation(text) {
        const cleanText = text.replace(/\n/g, ' ');
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(cleanText)}`;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        let result = ''; if (data && data[0]) data[0].forEach(s => { if (s[0]) result += s[0]; });
                        resolve(result);
                    } catch (e) { resolve(null); }
                }, onerror: () => resolve(null)
            });
        });
    }

    // ==========================================
    // 5. 段落朗读 (TTS)
    // ==========================================
    let currentTTSAudio = null;
    let currentTTSBtn = null;

    function playParagraphText(text, btnElement) {
        const dictAudio = document.getElementById('enlight-youdao-audio');
        if (dictAudio) { dictAudio.pause(); dictAudio.remove(); }
        if (popupRoot) popupRoot.querySelectorAll('.cdp-play-btn').forEach(b => b.classList.remove('playing'));

        if (currentTTSBtn === btnElement && currentTTSAudio && !currentTTSAudio.paused) {
            currentTTSAudio.pause(); currentTTSAudio = null; btnElement.classList.remove('playing'); currentTTSBtn = null; return;
        }
        if (currentTTSAudio) { currentTTSAudio.pause(); if (currentTTSBtn) currentTTSBtn.classList.remove('playing'); }

        const cleanText = text.trim();
        if (!cleanText) return;
        btnElement.classList.add('playing');
        currentTTSBtn = btnElement;

        let configUrl = getConfig().style.ttsUrl || '';
        if (!configUrl) {
            showToast('请在设置中配置 TTS 接口地址');
            btnElement.classList.remove('playing');
            currentTTSBtn = null;
            return;
        }
        let baseUrl = configUrl.trim();
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
        if (!baseUrl.includes('/api/aiyue')) baseUrl += '/api/aiyue';

        const voices = ["en-US-EricNeural", "en-US-JennyNeural", "en-US-AvaNeural", "en-US-SteffanNeural"];
        const voice = voices[Math.floor(Math.random() * voices.length)];
        const params = new URLSearchParams({ text: cleanText, voiceName: voice, speed: -10 });
        const audio = new Audio(`${baseUrl}?${params.toString()}`);
        currentTTSAudio = audio;

        audio.onended = () => { btnElement.classList.remove('playing'); currentTTSBtn = null; };
        audio.onerror = () => { btnElement.classList.remove('playing'); currentTTSBtn = null; showToast('播放失败，请检查接口地址'); };
        audio.play().catch(e => { console.error("EnLight TTS Error:", e); btnElement.classList.remove('playing'); });
    }

    function processTTSNode(p) {
        if (p.querySelector('.para-read-btn')) return;
        const text = p.innerText.trim();
        if (text.length < 10) return;
        const btn = document.createElement('span');
        btn.className = 'para-read-btn';
        btn.title = '朗读此段';
        btn.innerHTML = DOMPurify.sanitize(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`);
        btn.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); playParagraphText(text, btn); });
        p.appendChild(btn);
    }

    function initTTS() {
        if (!getConfig().style.showTTS) return;
        const paragraphs = document.querySelectorAll('p, article p, .article-content p, blockquote');
        paragraphs.forEach(processTTSNode);
    }

    // ==========================================
    // 6. 查词弹窗
    // ==========================================
    let touchStartX = 0, touchStartY = 0, isScrollAction = false;
    function initPopup() {
        createShadowPopup();
        document.addEventListener('click', handleGlobalClick);
        window.addEventListener('scroll', _.throttle(() => { if (popupEl && popupEl.classList.contains('active')) closePopup(); }, 200), { passive: true });
        document.addEventListener('touchstart', (e) => { if (e.touches.length > 0) { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; isScrollAction = false; } }, { passive: true });
        document.addEventListener('touchmove', (e) => { if (e.touches.length > 0) { const dx = Math.abs(e.touches[0].clientX - touchStartX); const dy = Math.abs(e.touches[0].clientY - touchStartY); if (dx > 20 || dy > 20) isScrollAction = true; } }, { passive: true });
    }

    function handleGlobalClick(e) {
        if (isScrollAction) return;
        if (e.target.id === 'wh-shadow-host' || e.composedPath().some(el => el.id === 'wh-shadow-host')) return;
        if (Swal.isVisible() && Swal.getPopup().contains(e.target)) return;
        if (e.target.closest('.it-trans-block') || e.target.closest('.para-read-btn')) { closePopup(); return; }

        const clickResult = getWordAtPoint(e.clientX, e.clientY);
        if (clickResult) { e.stopPropagation(); e.preventDefault(); ensureNlp(); showPopup(clickResult.word, clickResult.rect); }
        else { closePopup(); }
    }

    function getWordAtPoint(x, y) {
        let range, textNode;
        if (document.caretRangeFromPoint) range = document.caretRangeFromPoint(x, y);
        else if (document.caretPositionFromPoint) { const pos = document.caretPositionFromPoint(x, y); range = document.createRange(); range.setStart(pos.offsetNode, pos.offset); range.collapse(true); }
        if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) return null;
        textNode = range.startContainer;
        if (['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(textNode.parentNode.tagName)) return null;
        const text = textNode.nodeValue;
        let start = range.startOffset, end = range.startOffset;
        while (start > 0 && /[a-zA-Z']/.test(text[start - 1])) start--;
        while (end < text.length && /[a-zA-Z']/.test(text[end])) end++;
        let word = text.substring(start, end).trim();
        if (!word || !/[a-zA-Z]/.test(word) || word.length > 45) return null;
        const rect = document.createRange(); rect.setStart(textNode, start); rect.setEnd(textNode, end);
        return { word: word, rect: rect.getBoundingClientRect() };
    }

    async function showPopup(word, rect) {
        if (!popupEl) return;
        const loadingHtml = DOMPurify.sanitize(`
            <div class="g-header">
                <div class="g-word-row"><span class="g-word">${word}</span></div>
                <button class="cdp-play-btn" id="cdp-play-btn-init">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
            </div><div class="g-msg">Loading...</div>`);
        popupEl.innerHTML = loadingHtml;
        const initBtn = popupRoot.getElementById('cdp-play-btn-init');
        if(initBtn) initBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, initBtn); };
        playAudioText(word, initBtn);
        positionPopup(rect);
        popupEl.classList.add('active');

        const dictCacheKey = 'dict_v2_' + word.toLowerCase();
        const cachedHtml = await idbKeyval.get(dictCacheKey);

        if (cachedHtml) {
            popupEl.innerHTML = DOMPurify.sanitize(cachedHtml);
            const newBtn = popupRoot.getElementById('cdp-play-btn-final');
            if(newBtn) newBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, newBtn); };
            positionPopup(rect);
        } else {
            GM_xmlhttpRequest({
                method: "GET", url: `https://dict.youdao.com/w/eng/${encodeURIComponent(word)}/`,
                headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
                onload: function(res) {
                    if (res.status === 200) {
                        const html = parseYoudaoHtml(res.responseText, word);
                        const sanitizedHtml = DOMPurify.sanitize(html);
                        popupEl.innerHTML = sanitizedHtml;
                        idbKeyval.set(dictCacheKey, sanitizedHtml);
                        const newBtn = popupRoot.getElementById('cdp-play-btn-final');
                        if(newBtn) newBtn.onclick = (e) => { e.stopPropagation(); playAudioText(word, newBtn); };
                        positionPopup(rect);
                    } else { popupEl.innerHTML += `<div style="color:red;margin-top:5px;">Connection failed.</div>`; }
                },
                onerror: function() { popupEl.innerHTML += `<div style="color:red;margin-top:5px;">Network error.</div>`; }
            });
        }
    }

    function parseYoudaoHtml(html, originalWord) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        let phone = "";
        const phoneEl = doc.querySelector('.baav .phonetic');
        if (phoneEl) { const raw = phoneEl.textContent.replace(/[\[\]]/g, ""); phone = `[${raw}]`; }
        
        let tagsHtml = "";
        const rankEl = doc.querySelector('.via.rank');
        if (rankEl) tagsHtml += `<span class="g-tag collins">${rankEl.textContent.trim()}</span>`;
        const examEl = doc.querySelector('.baav .exam_type');
        if (examEl) { const exams = examEl.textContent.trim().split(/\s+/); exams.forEach(t => { if(t) tagsHtml += `<span class="g-tag">${t}</span>`; }); }

        let starLevel = 0;
        const starEls = doc.querySelectorAll('[class*="star star"]');
        starEls.forEach(el => { const match = el.className.match(/star(\d)/); if (match) { const lvl = parseInt(match[1]); if (lvl > starLevel) starLevel = lvl; } });
        let starsHtml = '';
        if (starLevel > 0) { const active = '★'.repeat(starLevel); const inactive = '★'.repeat(5 - starLevel); starsHtml = `<span class="g-stars" title="Collins ${starLevel} Stars"><span class="g-stars-active">${active}</span>${inactive}</span>`; }

        let defs = [];
        const lis = doc.querySelectorAll('#phrsListTab .trans-container ul li');
        lis.forEach(li => defs.push(li.textContent.trim()));
        if (defs.length === 0) { const web = doc.querySelectorAll('#tWebTrans .wt-container .title span'); if (web.length > 0) web.forEach(s => defs.push(s.textContent.trim())); }
        const defsHtml = defs.length > 0 ? `<ul class="g-list">${defs.slice(0, 4).map(d => `<li><span class="g-bullet">•</span>${d}</li>`).join('')}</ul>` : `<div class="g-msg">No definitions found.</div>`;

        return `<div class="g-header"><div class="g-word-row"><span class="g-word">${originalWord}</span></div><button class="cdp-play-btn" id="cdp-play-btn-final"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></button></div>${ (phone || tagsHtml || starsHtml) ? `<div class="g-meta">${phone ? `<span class="g-phonetic">${phone}</span>` : ''}${tagsHtml}${starsHtml}</div>` : '' }${defsHtml}`;
    }

    function positionPopup(rect) {
        if (!popupEl) return;
        const popupWidth = 290, gap = 12, winW = window.innerWidth, winH = window.innerHeight;
        let left = rect.left + (rect.width / 2) - (popupWidth / 2);
        if (left < 10) left = 10; else if (left + popupWidth > winW - 10) left = winW - popupWidth - 10;
        let top = rect.bottom + gap;
        const popupH = popupEl.offsetHeight || 150;
        if (top + popupH > winH - 10 && rect.top > popupH + 20) top = rect.top - popupH - gap;
        else if (top + popupH > winH) top = winH - popupH - 10;
        popupEl.style.top = `${top}px`; popupEl.style.left = `${left}px`;
    }

    function closePopup() {
        if (popupEl && popupEl.classList.contains('active')) {
            popupEl.classList.remove('active');
            const existingAudio = document.getElementById('enlight-youdao-audio');
            if (existingAudio) { existingAudio.pause(); existingAudio.remove(); }
        }
    }

    function playAudioText(text, btn) {
        if(!text) return;
        if (currentTTSAudio) { currentTTSAudio.pause(); if (currentTTSBtn) currentTTSBtn.classList.remove('playing'); }
        const existingAudio = document.getElementById('enlight-youdao-audio');
        if (existingAudio) { existingAudio.pause(); existingAudio.remove(); }
        if (popupRoot) popupRoot.querySelectorAll('.cdp-play-btn').forEach(b => b.classList.remove('playing'));
        if(btn) btn.classList.add('playing');
        const ttsUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=2`;
        const audio = document.createElement('audio');
        audio.id = 'enlight-youdao-audio'; audio.style.display = 'none'; audio.src = ttsUrl;
        audio.onended = () => { if(btn) btn.classList.remove('playing'); };
        audio.onerror = () => { if(btn) btn.classList.remove('playing'); };
        document.body.appendChild(audio);
        audio.play().catch(() => { if(btn) btn.classList.remove('playing'); });
    }

    function showToast(msg) {
        const Toast = Swal.mixin({
            toast: true, position: 'top', showConfirmButton: false, timer: 2000,
            timerProgressBar: false, background: 'rgba(0,0,0,0.85)', color: '#fff',
            didOpen: (toast) => { toast.addEventListener('mouseenter', Swal.stopTimer); toast.addEventListener('mouseleave', Swal.resumeTimer); }
        });
        Toast.fire({ icon: 'info', title: msg });
    }

    // ==========================================
    // 7. 设置界面
    // ==========================================
    function openSettings() {
        const c = getConfig();
        const tempListState = {...c.listState};
        let urlInputs = '';
        ['red','yellow','blue','green','purple','exclude'].forEach(k => {
            const isEnabled = c.listState[k];
            const color = COLORS[k].color;
            urlInputs += `<div style="margin-bottom:12px;text-align:left;"><div style="margin-bottom:4px;display:flex;align-items:center;"><span class="wh-color-dot" data-color="${k}" style="display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:8px;cursor:pointer;border:2px solid ${color};background-color:${isEnabled?color:'transparent'};transition:background 0.2s;"></span><label style="font-size:12px;font-weight:bold;color:${k==='exclude'?'#666':color}">${COLORS[k].label}</label></div><input type="text" id="wh-input-${k}" value="${c.urls[k]||''}" class="swal2-input" style="width:100%;height:36px;margin:0;font-size:14px;"></div>`;
        });

        const htmlContent = `
        <div style="max-height:60vh;overflow-y:auto;padding:0 5px;text-align:left;">
            <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">🛡️ 运行模式</div>
            <select id="wh-behavior-mode" class="swal2-select" style="width:100%;margin:0 0 15px 0;"><option value="blacklist" ${c.behavior.mode==='blacklist'?'selected':''}>⚫ 黑名单模式</option><option value="whitelist" ${c.behavior.mode==='whitelist'?'selected':''}>⚪ 白名单模式</option></select>
            <div style="margin-bottom:15px;"><label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">黑名单 (一行一个)</label><textarea id="wh-behavior-blacklist" class="swal2-textarea" rows="3" style="margin:0;width:100%;font-size:13px;">${c.behavior.blacklist.join('\n')}</textarea></div>
            <div style="margin-bottom:15px;"><label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">白名单 (一行一个)</label><textarea id="wh-behavior-whitelist" class="swal2-textarea" rows="3" style="margin:0;width:100%;font-size:13px;">${c.behavior.whitelist.join('\n')}</textarea></div>
            <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">🎨 外观</div>
            <div style="margin-bottom:10px;display:flex;align-items:center;gap:10px;font-size:13px;"><input type="checkbox" id="wh-style-learning" ${c.style.learningMode ? 'checked' : ''}><label for="wh-style-learning">🎓 学习模式 (译文默认模糊)</label></div>
            <div style="margin-bottom:15px;display:flex;align-items:center;gap:10px;font-size:13px;"><input type="checkbox" id="wh-style-tts" ${c.style.showTTS ? 'checked' : ''}><label for="wh-style-tts">🔊 段落朗读 (TTS)</label></div>
            <div style="margin-bottom:15px;"><label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">字体大小比例 (%)</label><input type="number" id="wh-style-fontSizeRatio" value="${c.style.fontSizeRatio}" class="swal2-input" style="width:100%;height:36px;margin:0;font-size:14px;"></div>
            <div style="margin-bottom:15px;"><label style="display:block;font-size:13px;font-weight:bold;margin-bottom:5px;color:#444;">TTS 接口地址</label><input type="text" id="wh-style-ttsUrl" placeholder="https://..." value="${c.style.ttsUrl||''}" class="swal2-input" style="width:100%;height:36px;margin:0;font-size:14px;"></div>
            <div style="margin-bottom:15px;"><select id="wh-style-theme" class="swal2-select" style="width:100%;margin:0;"><option value="card" ${c.style.theme==='card'?'selected':''}>卡片 (默认)</option><option value="minimal" ${c.style.theme==='minimal'?'selected':''}>极简</option><option value="dashed" ${c.style.theme==='dashed'?'selected':''}>虚线笔记</option><option value="underline" ${c.style.theme==='underline'?'selected':''}>下划线</option><option value="dark" ${c.style.theme==='dark'?'selected':''}>暗黑高亮</option></select></div>
            <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">📚 词库订阅</div>${urlInputs}
            <div style="font-size:14px;font-weight:bold;color:#007AFF;border-bottom:2px solid #f0f0f0;padding-bottom:5px;margin:15px 0 10px 0;">⚙️ 数据管理</div>
            <div style="display:flex;gap:10px;margin-top:10px;"><button type="button" id="wh-btn-export" class="swal2-confirm swal2-styled" style="flex:1;background:#6c757d;margin:0;">📤 导出</button><button type="button" id="wh-btn-import" class="swal2-confirm swal2-styled" style="flex:1;background:#6c757d;margin:0;">📥 导入</button><input type="file" id="wh-file-input" accept=".json" style="display:none"></div>
        </div>`;

        Swal.fire({
            title: 'EnLight 设置', html: htmlContent, showCancelButton: true, confirmButtonText: '保存', cancelButtonText: '关闭', width: 450, allowOutsideClick: false,
            didOpen: (popup) => {
                popup.querySelectorAll('.wh-color-dot').forEach(dot => { dot.addEventListener('click', () => { const k = dot.getAttribute('data-color'); tempListState[k] = !tempListState[k]; dot.style.backgroundColor = tempListState[k] ? COLORS[k].color : 'transparent'; }); });
                popup.querySelector('#wh-btn-export').addEventListener('click', () => {
                    const curConf = getConfig();
                    curConf.behavior.mode = popup.querySelector('#wh-behavior-mode').value;
                    curConf.behavior.blacklist = popup.querySelector('#wh-behavior-blacklist').value.split('\n').filter(s=>s.trim());
                    curConf.behavior.whitelist = popup.querySelector('#wh-behavior-whitelist').value.split('\n').filter(s=>s.trim());
                    curConf.listState = tempListState;
                    ['red','yellow','blue','green','purple','exclude'].forEach(k=>curConf.urls[k]=popup.querySelector(`#wh-input-${k}`).value.trim());
                    const blob = new Blob([JSON.stringify(curConf, null, 2)], {type: "application/json"});
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = `enlight_config_${new Date().toISOString().slice(0,10)}.json`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                    Swal.showValidationMessage('配置已导出');
                });
                const btnImport = popup.querySelector('#wh-btn-import'); const fileInput = popup.querySelector('#wh-file-input');
                btnImport.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0]; if(!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => { try { const parsed = JSON.parse(event.target.result); if(parsed.urls && parsed.style) { GM_setValue('highlightConfig', parsed); Swal.fire('成功', '配置导入成功，即将刷新', 'success').then(() => location.reload()); } else Swal.showValidationMessage('JSON 格式错误'); } catch(ex) { Swal.showValidationMessage('JSON 解析失败'); } };
                    reader.readAsText(file);
                });
            },
            preConfirm: () => {
                const n = getConfig();
                ['red','yellow','blue','green','purple','exclude'].forEach(k=>n.urls[k]=document.getElementById(`wh-input-${k}`).value.trim());
                n.style.fontSizeRatio = document.getElementById('wh-style-fontSizeRatio').value.trim() || '100';
                n.style.theme = document.getElementById('wh-style-theme').value;
                n.style.learningMode = document.getElementById('wh-style-learning').checked;
                n.style.showTTS = document.getElementById('wh-style-tts').checked;
                n.style.ttsUrl = document.getElementById('wh-style-ttsUrl').value.trim();
                n.behavior.mode = document.getElementById('wh-behavior-mode').value;
                n.behavior.blacklist = document.getElementById('wh-behavior-blacklist').value.split('\n').filter(s=>s.trim());
                n.behavior.whitelist = document.getElementById('wh-behavior-whitelist').value.split('\n').filter(s=>s.trim());
                n.listState = tempListState;
                GM_setValue('highlightConfig', n);
                return true;
            }
        }).then((result) => { if (result.isConfirmed) location.reload(); });
    }

    // ==========================================
    // 8. 其他功能
    // ==========================================
    const _historyWrap = function(type) {
        const orig = history[type];
        return function() { const rv = orig.apply(this, arguments); const e = new Event(type); e.arguments = arguments; window.dispatchEvent(e); return rv; };
    };
    history.pushState = _historyWrap('pushState'); history.replaceState = _historyWrap('replaceState');
    function reinit() { if (!shouldRun()) return; setTimeout(() => { if (isTranslationActive) scanAndTranslate(); startHighlighterObserver(); initTTS(); }, 1000); }
    window.addEventListener('popstate', reinit); window.addEventListener('pushState', reinit); window.addEventListener('replaceState', reinit);

    function initGesture() {
        const hammer = new Hammer(document.body, { touchAction: 'pan-y', cssProps: { userSelect: 'text', touchCallout: 'default', contentZooming: '', userDrag: '', tapHighlightColor: '' } });
        hammer.get('tap').set({ pointers: 2, interval: 500, threshold: 10 });
        hammer.on('tap', () => { if (Date.now() - (window._lastTapTime || 0) < 500) return; window._lastTapTime = Date.now(); togglePageTranslation(); });
    }

    GM_registerMenuCommand("🎓 开启/关闭 学习模式", () => {
        const c = getConfig(); c.style.learningMode = !c.style.learningMode; GM_setValue('highlightConfig', c);
        showToast(`学习模式已${c.style.learningMode ? '开启' : '关闭'} (即将刷新)`); setTimeout(() => location.reload(), 1000);
    });
    GM_registerMenuCommand("🗑️ 清空翻译/词典缓存", () => idbKeyval.clear().then(() => showToast('缓存已清空')));
    GM_registerMenuCommand("⚙️ EnLight 设置", openSettings);

    initPopup(); initGesture(); loadWordLists(); setTimeout(initTTS, 1000);
})();
