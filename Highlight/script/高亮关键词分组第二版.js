// 6.0：优化缓存和正则匹配，通过动态监听DOM变化，高效实现关键词高亮。

// ==UserScript==
// @name         高亮关键词
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  支持动态页面内容高亮，修复嵌套问题，优化性能
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const CACHE_EXPIRY = 3600 * 1000; // 缓存有效期（1小时）

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    // 缓存数据
    function getCachedData(key) {
        const cache = JSON.parse(localStorage.getItem(key) || "{}");
        if (cache.expiry && cache.expiry > Date.now()) {
            return cache.data;
        }
        return null;
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify({
            data: data,
            expiry: Date.now() + CACHE_EXPIRY,
        }));
    }

    // 从缓存或请求获取关键词
    async function fetchKeywords(url, cacheKey) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Loaded ${cacheKey} from cache.`);
            return cachedData;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res => {
                    if (res.status === 200) {
                        const keywords = res.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                        setCachedData(cacheKey, keywords);
                        console.log(`Fetched and cached ${cacheKey}.`);
                        resolve(keywords);
                    } else {
                        reject(`Failed to load ${url}`);
                    }
                },
                onerror: err => reject(err),
            });
        });
    }

    // 使用Set来优化匹配效率
    const regexCache = new Map();

    function buildRegex(word) {
        if (regexCache.has(word)) return regexCache.get(word);

        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];

        const regex = new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
        regexCache.set(word, regex); // 使用Map缓存正则
        return regex;
    }

    // 高亮文本节点
    function highlightTextNode(node, regexList, color) {
        if (node.parentNode && node.parentNode.hasAttribute('data-highlighted')) {
            return; // 防止嵌套
        }

        regexList.forEach(regex => {
            if (regex.test(node.nodeValue)) {
                const span = document.createElement("span");
                span.setAttribute("data-highlighted", "true");
                span.innerHTML = node.nodeValue.replace(regex, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
                node.replaceWith(span);
            }
        });
    }

    // 遍历并高亮文本节点
    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) { // 文本节点
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            Array.from(node.childNodes).forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    // 使用IntersectionObserver优化大规模动态加载内容
    function observeDOMChanges(regexes) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    traverseAndHighlight(entry.target, regexes, colors[entry.target.dataset.group]);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-group]').forEach(el => {
            observer.observe(el);
        });
    }

    // 主要功能
    async function main() {
        try {
            const { deleteKeywords, group1Keywords, group2Keywords, group3Keywords } = await Promise.all([
                fetchKeywords(urls.delete, 'deleteKeywords'),
                fetchKeywords(urls.group1, 'group1Keywords'),
                fetchKeywords(urls.group2, 'group2Keywords'),
                fetchKeywords(urls.group3, 'group3Keywords'),
            ]).then(responses => ({
                deleteKeywords: responses[0],
                group1Keywords: responses[1],
                group2Keywords: responses[2],
                group3Keywords: responses[3],
            }));

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            // 初始高亮
            [groupRegexes.group1, groupRegexes.group2, groupRegexes.group3].forEach((regexList, index) => {
                traverseAndHighlight(document.body, regexList, colors[`group${index + 1}`]);
            });

            // 动态监听DOM变化
            observeDOMChanges([...groupRegexes.group1, ...groupRegexes.group2, ...groupRegexes.group3]);

        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();


// 5.0：这个版本通过预编译正则和使用IntersectionObserver优化了动态内容的高效处理。

// ==UserScript==
// @name         高亮关键词
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  支持动态页面内容高亮，修复嵌套问题，优化性能
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const CACHE_EXPIRY = 3600 * 1000; // 缓存有效期（1小时）

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    // 缓存数据
    function getCachedData(key) {
        const cache = JSON.parse(localStorage.getItem(key) || "{}");
        if (cache.expiry && cache.expiry > Date.now()) {
            return cache.data;
        }
        return null;
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify({
            data: data,
            expiry: Date.now() + CACHE_EXPIRY,
        }));
    }

    // 从缓存或请求获取关键词
    async function fetchKeywords(url, cacheKey) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Loaded ${cacheKey} from cache.`);
            return cachedData;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res => {
                    if (res.status === 200) {
                        const keywords = res.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                        setCachedData(cacheKey, keywords);
                        console.log(`Fetched and cached ${cacheKey}.`);
                        resolve(keywords);
                    } else {
                        reject(`Failed to load ${url}`);
                    }
                },
                onerror: err => reject(err),
            });
        });
    }

    // 预编译正则表达式并存储
    const regexCache = {};

    function buildRegex(word) {
        if (regexCache[word]) return regexCache[word];

        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];
        const regex = new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
        regexCache[word] = regex; // 缓存正则
        return regex;
    }

    // 高亮文本节点
    function highlightTextNode(node, regexList, color) {
        if (node.parentNode && node.parentNode.hasAttribute('data-highlighted')) {
            return; // 防止嵌套
        }

        regexList.forEach(regex => {
            if (regex.test(node.nodeValue)) {
                const span = document.createElement("span");
                span.setAttribute("data-highlighted", "true");
                span.innerHTML = node.nodeValue.replace(regex, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
                node.replaceWith(span);
            }
        });
    }

    // 遍历并高亮文本节点
    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) { // 文本节点
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            Array.from(node.childNodes).forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    // 使用IntersectionObserver优化大规模动态加载内容
    function observeDOMChanges(regexes) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    traverseAndHighlight(entry.target, regexes, colors[entry.target.dataset.group]);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('[data-group]').forEach(el => {
            observer.observe(el);
        });
    }

    // 主要功能
    async function main() {
        try {
            const { deleteKeywords, group1Keywords, group2Keywords, group3Keywords } = await Promise.all([
                fetchKeywords(urls.delete, 'deleteKeywords'),
                fetchKeywords(urls.group1, 'group1Keywords'),
                fetchKeywords(urls.group2, 'group2Keywords'),
                fetchKeywords(urls.group3, 'group3Keywords'),
            ]).then(responses => ({
                deleteKeywords: responses[0],
                group1Keywords: responses[1],
                group2Keywords: responses[2],
                group3Keywords: responses[3],
            }));

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            // 初始高亮
            [groupRegexes.group1, groupRegexes.group2, groupRegexes.group3].forEach((regexList, index) => {
                traverseAndHighlight(document.body, regexList, colors[`group${index + 1}`]);
            });

            // 动态监听DOM变化
            observeDOMChanges([...groupRegexes.group1, ...groupRegexes.group2, ...groupRegexes.group3]);

        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();


// v4.0：该版本通过 MutationObserver 动态高亮新文本，提高性能。

// ==UserScript==
// @name         高亮关键词4.0
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  支持动态页面内容高亮，修复嵌套问题，优化性能
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const CACHE_EXPIRY = 3600 * 1000; // 缓存有效期（1小时）

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    function getCachedData(key) {
        const cache = JSON.parse(localStorage.getItem(key) || "{}");
        if (cache.expiry && cache.expiry > Date.now()) {
            return cache.data;
        }
        return null;
    }

    function setCachedData(key, data) {
        localStorage.setItem(key, JSON.stringify({
            data: data,
            expiry: Date.now() + CACHE_EXPIRY,
        }));
    }

    async function fetchKeywords(url, cacheKey) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`Loaded ${cacheKey} from cache.`);
            return cachedData;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res => {
                    if (res.status === 200) {
                        const keywords = res.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                        setCachedData(cacheKey, keywords);
                        console.log(`Fetched and cached ${cacheKey}.`);
                        resolve(keywords);
                    } else {
                        reject(`Failed to load ${url}`);
                    }
                },
                onerror: err => reject(err),
            });
        });
    }

    function buildRegex(word) {
        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];
        return new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
    }

    function highlightTextNode(node, regexList, color) {
        if (node.parentNode && node.parentNode.hasAttribute('data-highlighted')) {
            return; // 防止嵌套
        }

        regexList.forEach(regex => {
            if (regex.test(node.nodeValue)) {
                const span = document.createElement("span");
                span.setAttribute("data-highlighted", "true");
                span.innerHTML = node.nodeValue.replace(regex, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
                node.replaceWith(span);
            }
        });
    }

    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) { // 文本节点
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            Array.from(node.childNodes).forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    async function main() {
        try {
            const { deleteKeywords, group1Keywords, group2Keywords, group3Keywords } = await Promise.all([
                fetchKeywords(urls.delete, 'deleteKeywords'),
                fetchKeywords(urls.group1, 'group1Keywords'),
                fetchKeywords(urls.group2, 'group2Keywords'),
                fetchKeywords(urls.group3, 'group3Keywords'),
            ]).then(responses => ({
                deleteKeywords: responses[0],
                group1Keywords: responses[1],
                group2Keywords: responses[2],
                group3Keywords: responses[3],
            }));

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            // 使用 MutationObserver 监听 DOM 变化
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 3) { // 只处理文本节点
                                [groupRegexes.group1, groupRegexes.group2, groupRegexes.group3].forEach((regexList, index) => {
                                    traverseAndHighlight(node, regexList, colors[`group${index + 1}`]);
                                });
                            }
                        });
                    }
                });
            });

            // 配置 observer
            observer.observe(document.body, {
                childList: true,
                subtree: true, // 监听所有子节点
            });

            // 初次加载时高亮所有文本
            [groupRegexes.group1, groupRegexes.group2, groupRegexes.group3].forEach((regexList, index) => {
                traverseAndHighlight(document.body, regexList, colors[`group${index + 1}`]);
            });

        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();

// v3.0：支持动态内容高亮，防嵌套，性能优化全面提升。

// ==UserScript==
// @name         高亮关键词3.0
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  支持动态页面内容高亮，修复嵌套问题，优化性能
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    async function loadKeywords(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: addTimestamp(url),
                onload: res => res.status === 200
                    ? resolve(res.responseText.split("\n").map(word => word.trim()).filter(Boolean))
                    : reject(`Failed to load ${url}`),
                onerror: err => reject(err),
            });
        });
    }

    function buildRegex(word) {
        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];
        return new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
    }

    function highlightTextNode(node, regexList, color) {
        if (node.parentNode && node.parentNode.hasAttribute('data-highlighted')) {
            return; // 防止嵌套
        }

        const matches = regexList.find(regex => regex.test(node.nodeValue));
        if (matches) {
            const span = document.createElement("span");
            span.setAttribute("data-highlighted", "true");
            span.innerHTML = node.nodeValue.replace(matches, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
            node.replaceWith(span);
        }
    }

    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) { // 文本节点
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            Array.from(node.childNodes).forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    function batchHighlight(nodes, regexes, color) {
        nodes.forEach(node => {
            traverseAndHighlight(node, regexes, color);
        });
    }

    async function main() {
        try {
            const [deleteKeywords, group1Keywords, group2Keywords, group3Keywords] = await Promise.all([
                loadKeywords(urls.delete),
                loadKeywords(urls.group1),
                loadKeywords(urls.group2),
                loadKeywords(urls.group3),
            ]);

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            const highlightGroups = [
                { regexes: groupRegexes.group1, color: colors.group1 },
                { regexes: groupRegexes.group2, color: colors.group2 },
                { regexes: groupRegexes.group3, color: colors.group3 },
            ];

            highlightGroups.forEach(({ regexes, color }) => {
                traverseAndHighlight(document.body, regexes, color);
            });

            const observer = new MutationObserver(mutationsList => {
                const nodesToProcess = [];
                mutationsList.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                nodesToProcess.push(node);
                            }
                        });
                    }
                });

                if (nodesToProcess.length) {
                    requestIdleCallback(() => {
                        highlightGroups.forEach(({ regexes, color }) => {
                            batchHighlight(nodesToProcess, regexes, color);
                        });
                    });
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();

// v2.5：专注性能优化，适合静态页面，一次性快速高亮内容。

// ==UserScript==
// @name         高亮关键词2.5
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  高效高亮关键词，支持单词变形匹配和删除标记规则，优化性能防止卡死
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    async function loadKeywords(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: addTimestamp(url),
                onload: res => res.status === 200
                    ? resolve(res.responseText.split("\n").map(word => word.trim()).filter(Boolean))
                    : reject(`Failed to load ${url}`),
                onerror: err => reject(err),
            });
        });
    }

    function buildRegex(word) {
        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];
        return new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
    }

    function traverseAndRestore(node, regexList) {
        if (node.nodeType === 1) { // Element node
            const spans = node.querySelectorAll("span[data-highlighted]");
            spans.forEach(span => {
                const text = span.textContent;
                if (regexList.some(regex => regex.test(text))) {
                    span.replaceWith(document.createTextNode(text));
                }
            });
        } else if (node.nodeType === 3) { // Text node
            // Nothing to restore in plain text nodes
        }
    }

    function highlightTextNode(node, regexList, color) {
        const matches = regexList.find(regex => regex.test(node.nodeValue));
        if (matches) {
            const span = document.createElement("span");
            span.setAttribute("data-highlighted", "true");
            span.innerHTML = node.nodeValue.replace(matches, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
            node.replaceWith(span);
        }
    }

    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) { // Text node
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            Array.from(node.childNodes).forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    async function main() {
        try {
            const [deleteKeywords, group1Keywords, group2Keywords, group3Keywords] = await Promise.all([
                loadKeywords(urls.delete),
                loadKeywords(urls.group1),
                loadKeywords(urls.group2),
                loadKeywords(urls.group3),
            ]);

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            traverseAndRestore(document.body, deleteRegexList);

            const highlightGroups = [
                { regexes: groupRegexes.group1, color: colors.group1 },
                { regexes: groupRegexes.group2, color: colors.group2 },
                { regexes: groupRegexes.group3, color: colors.group3 },
            ];

            const processNodes = () => {
                highlightGroups.forEach(({ regexes, color }) => {
                    traverseAndHighlight(document.body, regexes, color);
                });
            };

            if (window.requestIdleCallback) {
                requestIdleCallback(processNodes);
            } else {
                setTimeout(processNodes, 100);
            }
        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();

// 2.0 简单直观，适合小型页面或兼容性优先的场景。

// ==UserScript==
// @name         高亮关键词
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  高效高亮关键词，支持单词变形匹配和删除标记规则，优化性能防止卡死
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const urls = {
        group1: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt",
        group2: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt",
        group3: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt",
        delete: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt",
    };

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red",
    };

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    async function loadKeywords(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: addTimestamp(url),
                onload: res => res.status === 200
                    ? resolve(res.responseText.split("\n").map(word => word.trim()).filter(Boolean))
                    : reject(`Failed to load ${url}`),
                onerror: err => reject(err),
            });
        });
    }

    function buildRegex(word) {
        const forms = [
            word,
            `${word}s?`,
            word.replace(/y$/, "i") + "es?",
            `${word}ed`,
            word.replace(/e$/, "") + "ing",
            `${word}ing`,
            `${word}d`,
            `${word}er`,
            `${word}est`,
            `${word}ly`,
            word.replace(/y$/, "ily"),
            word.replace(/ic$/, "ically"),
            word.replace(/le$/, "ly"),
        ];
        return new RegExp(`\\b(${forms.join("|")})\\b`, "gi");
    }

    function traverseAndRestore(node, regexList) {
        if (node.nodeType === 1) {
            const spans = node.querySelectorAll("span[data-highlighted]");
            spans.forEach(span => {
                const text = span.textContent;
                if (regexList.some(regex => regex.test(text))) {
                    span.replaceWith(document.createTextNode(text));
                }
            });
        }
    }

    function highlightTextNode(node, regexList, color) {
        const matches = regexList.find(regex => regex.test(node.nodeValue));
        if (matches) {
            const span = document.createElement("span");
            span.setAttribute("data-highlighted", "true");
            span.innerHTML = node.nodeValue.replace(matches, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
            node.replaceWith(span);
        }
    }

    function traverseAndHighlight(node, regexList, color) {
        if (node.nodeType === 3 && node.nodeValue.trim()) {
            highlightTextNode(node, regexList, color);
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe|noscript|textarea)$/i.test(node.tagName)) {
            node.childNodes.forEach(child => traverseAndHighlight(child, regexList, color));
        }
    }

    async function main() {
        try {
            const [deleteKeywords, group1Keywords, group2Keywords, group3Keywords] = await Promise.all([
                loadKeywords(urls.delete),
                loadKeywords(urls.group1),
                loadKeywords(urls.group2),
                loadKeywords(urls.group3),
            ]);

            const deleteRegexList = deleteKeywords.map(buildRegex);
            const groupRegexes = {
                group1: group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group2: group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
                group3: group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))).map(buildRegex),
            };

            traverseAndRestore(document.body, deleteRegexList);

            const highlightGroups = [
                { regexes: groupRegexes.group1, color: colors.group1 },
                { regexes: groupRegexes.group2, color: colors.group2 },
                { regexes: groupRegexes.group3, color: colors.group3 },
            ];

            const processNodes = () => {
                highlightGroups.forEach(({ regexes, color }) => {
                    traverseAndHighlight(document.body, regexes, color);
                });
            };

            if (window.requestIdleCallback) {
                requestIdleCallback(processNodes);
            } else {
                setTimeout(processNodes, 100);
            }
        } catch (err) {
            console.error("Error during execution:", err);
        }
    }

    main();
})();

// 1.8

// ==UserScript==
// @name         高亮关键词
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  高效高亮关键词，支持单词变形匹配和删除标记规则，优化性能防止卡死
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    // 判断页面是否为英语
    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const urlGroup1 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt";
    const urlGroup2 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt";
    const urlGroup3 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt";
    const deleteUrl = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt";

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red"
    };

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    // 加载关键词
    function loadKeywords(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: addTimestamp(url),
                onload: response => {
                    if (response.status === 200) {
                        const keywords = response.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                        resolve(keywords);
                    } else {
                        reject(`Failed to load: ${url}`);
                    }
                },
                onerror: err => reject(err)
            });
        });
    }

    // 构建正则
    function buildRegex(word) {
        return new RegExp(
            '\\b(' +
            word + '|' +
            word + 's?' + '|' +
            word.replace(/y$/, 'i') + 'es?' + '|' +
            word + 'ed' + '|' +
            word.replace(/e$/, '') + 'ing' + '|' +
            word + 'ing' + '|' +
            word + 'd' + '|' +
            word + 'er' + '|' +
            word + 'est' + '|' +
            word + 'ly' + '|' +
            word.replace(/y$/, 'ily') + '|' +
            word.replace(/ic$/, 'ically') + '|' +
            word.replace(/le$/, 'ly') +
            ')\\b',
            'gi'
        );
    }

    // 恢复被高亮的文本
    function traverseAndRestore(node, regexList) {
        if (node.nodeType === 1) {
            const spans = node.querySelectorAll("span[data-highlighted]");
            spans.forEach(span => {
                const text = span.textContent;
                if (regexList.some(regex => regex.test(text))) {
                    span.replaceWith(document.createTextNode(text));
                }
            });
        }
    }

    // 高亮文本节点
    function highlightTextNode(node, keywordRegex, color) {
        const matches = node.nodeValue.match(keywordRegex);
        if (matches) {
            const span = document.createElement("span");
            span.setAttribute("data-highlighted", "true");
            span.innerHTML = node.nodeValue.replace(keywordRegex, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
            node.replaceWith(span);
        }
    }

    // 遍历节点并高亮
    function traverseAndHighlight(node, keywords, color) {
        const regexList = keywords.map(buildRegex);
        if (node.nodeType === 3) { // 文本节点
            regexList.forEach(regex => highlightTextNode(node, regex, color));
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe)$/i.test(node.tagName)) { // 元素节点
            node.childNodes.forEach(child => traverseAndHighlight(child, keywords, color));
        }
    }

    // 主逻辑
    async function main() {
        try {
            const [deleteKeywords, group1Keywords, group2Keywords, group3Keywords] = await Promise.all([
                loadKeywords(deleteUrl),
                loadKeywords(urlGroup1),
                loadKeywords(urlGroup2),
                loadKeywords(urlGroup3)
            ]);

            const deleteRegexList = deleteKeywords.map(buildRegex);

            // 恢复默认颜色
            traverseAndRestore(document.body, deleteRegexList);

            // 高亮关键词
            traverseAndHighlight(document.body, group1Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))), colors.group1);
            traverseAndHighlight(document.body, group2Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))), colors.group2);
            traverseAndHighlight(document.body, group3Keywords.filter(k => !deleteRegexList.some(regex => regex.test(k))), colors.group3);
        } catch (err) {
            console.error("Error during main execution:", err);
        }
    }

    main();
})();

// 1.6初版

// ==UserScript==
// @name         高亮关键词并支持多种变形
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  高效高亮关键词，支持单词变形匹配和删除标记规则，优化性能防止卡死
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

    // 判断页面是否为英语
    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    const urlGroup1 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt";
    const urlGroup2 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt";
    const urlGroup3 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt";
    const deleteUrl = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt";

    const colors = {
        group1: "green",
        group2: "blue",
        group3: "red"
    };

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    function loadKeywords(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: addTimestamp(url),
            onload: function (response) {
                if (response.status === 200) {
                    const keywords = response.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                    callback(keywords);
                }
            }
        });
    }

    function buildRegex(word) {
        return new RegExp(
            '\\b(' +
            word + '|' +
            word + 's?' + '|' +
            word.replace(/y$/, 'i') + 'es?' + '|' +
            word + 'ed' + '|' +
            word + 'ing' + '|' +
            word + 'd' + '|' +
            word + 'er' + '|' +
            word + 'est' + '|' +
            word + 'ly' + '|' +
            word.replace(/y$/, 'ily') + '|' +
            word.replace(/ic$/, 'ically') + '|' +
            word.replace(/le$/, 'ly') +
            ')\\b',
            'gi'
        );
    }

    function traverseAndRestore(node, regexList) {
        if (node.nodeType === 1) {
            const spans = node.querySelectorAll("span[data-highlighted]");
            spans.forEach(span => {
                const text = span.textContent;
                const matches = regexList.some(regex => regex.test(text));
                if (matches) {
                    span.replaceWith(document.createTextNode(text));
                }
            });
        }
    }

    function highlightTextNode(node, keywordRegex, color) {
        const matches = node.nodeValue.match(keywordRegex);
        if (matches) {
            const span = document.createElement("span");
            span.setAttribute("data-highlighted", "true"); // 标记为高亮
            span.innerHTML = node.nodeValue.replace(keywordRegex, match => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
            node.replaceWith(span);
        }
    }

    function traverseAndHighlight(node, keywords, color) {
        const regexList = keywords.map(buildRegex);
        if (node.nodeType === 3) { // Text node
            regexList.forEach(regex => highlightTextNode(node, regex, color));
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe)$/i.test(node.tagName)) { // Element node
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseAndHighlight(node.childNodes[i], keywords, color);
            }
        }
    }

    function main() {
        let group1Keywords = [];
        let group2Keywords = [];
        let group3Keywords = [];
        let deleteKeywords = [];

        loadKeywords(deleteUrl, (keywords) => {
            deleteKeywords = keywords.map(buildRegex);

            loadKeywords(urlGroup1, (keywords) => {
                group1Keywords = keywords;
                loadKeywords(urlGroup2, (keywords) => {
                    group2Keywords = keywords;
                    loadKeywords(urlGroup3, (keywords) => {
                        group3Keywords = keywords;

                        // 优先处理删除高亮（恢复默认颜色）
                        traverseAndRestore(document.body, deleteKeywords);

                        // 按分组高亮关键词
                        traverseAndHighlight(document.body, group1Keywords.filter(k => !deleteKeywords.some(regex => regex.test(k))), colors.group1);
                        traverseAndHighlight(document.body, group2Keywords.filter(k => !deleteKeywords.some(regex => regex.test(k))), colors.group2);
                        traverseAndHighlight(document.body, group3Keywords.filter(k => !deleteKeywords.some(regex => regex.test(k))), colors.group3);
                    });
                });
            });
        });
    }

    main();
})();