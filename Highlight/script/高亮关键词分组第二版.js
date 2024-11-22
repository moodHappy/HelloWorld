// 性能优越，无页面动态更新

// ==UserScript==
// @name         精确关键词高亮
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  高效精确高亮关键词，避免误高亮，提升性能
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
    'use strict';

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

    async function loadKeywords(url, cacheKey, retries = 3) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) return JSON.parse(cached);

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: addTimestamp(url),
                        onload: res => res.status === 200 ? resolve(res.responseText) : reject(res.status),
                        onerror: err => reject(err),
                    });
                });

                const keywords = response.split("\n").map(w => w.trim()).filter(Boolean);
                localStorage.setItem(cacheKey, JSON.stringify(keywords));
                return keywords;
            } catch (err) {
                console.warn(`Attempt ${attempt + 1} to load ${url} failed.`);
            }
        }

        throw new Error(`Failed to load ${url} after ${retries} attempts`);
    }

    function buildPreciseRegex(wordText) {
        return new RegExp('\\b(' +
            wordText + '|' +
            wordText + 's?' + '|' +
            wordText.replace(/y$/, 'i') + 'es?' + '|' +
            wordText + 'ed' + '|' +
            wordText + 'ing' + '|' +
            wordText + 'd' + '|' +
            wordText + 'er' + '|' +
            wordText + 'est' + '|' +
            wordText + 'ly' + '|' +
            wordText.replace(/y$/, 'ily') + '|' +
            wordText.replace(/ic$/, 'ically') + '|' +
            wordText.replace(/le$/, 'ly') +
        ')\\b', 'gi');
    }

    function highlightText(node, regex, color) {
        const matches = node.nodeValue.match(regex);
        if (!matches) return;

        const parent = node.parentNode;
        const fragment = document.createDocumentFragment();

        let lastIndex = 0;
        matches.forEach(match => {
            const matchIndex = node.nodeValue.indexOf(match, lastIndex);

            if (matchIndex > lastIndex) {
                fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, matchIndex)));
            }

            const span = document.createElement("span");
            span.textContent = match;
            span.style.color = color;
            span.style.fontWeight = "bold";
            fragment.appendChild(span);

            lastIndex = matchIndex + match.length;
        });

        if (lastIndex < node.nodeValue.length) {
            fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
        }

        parent.replaceChild(fragment, node);
    }

    function traverseNodes(node, regex, color) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: n => /\S/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
        });

        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        nodes.forEach(textNode => highlightText(textNode, regex, color));
    }

    async function main() {
        try {
            const [deleteKeywords, group1Keywords, group2Keywords, group3Keywords] = await Promise.all([
                loadKeywords(urls.delete, "deleteKeywords"),
                loadKeywords(urls.group1, "group1Keywords"),
                loadKeywords(urls.group2, "group2Keywords"),
                loadKeywords(urls.group3, "group3Keywords"),
            ]);

            const deleteSet = new Set(deleteKeywords);

            const groups = [
                { keywords: group1Keywords.filter(w => !deleteSet.has(w)), color: colors.group1 },
                { keywords: group2Keywords.filter(w => !deleteSet.has(w)), color: colors.group2 },
                { keywords: group3Keywords.filter(w => !deleteSet.has(w)), color: colors.group3 },
            ];

            groups.forEach(({ keywords, color }) => {
                const regex = new RegExp(`\\b(${keywords.map(w => buildPreciseRegex(w).source).join("|")})\\b`, "gi");
                traverseNodes(document.body, regex, color);
            });
        } catch (err) {
            console.error("Script failed to execute:", err);
        }
    }

    main();
})();

// 2.0 支持页面动态更新

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