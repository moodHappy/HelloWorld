// 性能优化

// ==UserScript==
// @name         高亮关键词并支持多种变形
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

    // 配置关键词组及其相关属性
    const keywordGroups = {
        group1: { url: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt", color: "green", keywords: [] },
        group2: { url: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt", color: "blue", keywords: [] },
        group3: { url: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt", color: "red", keywords: [] },
        delete: { url: "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt", regexList: [] },
    };

    const regexCache = new Map(); // 正则缓存

    const addTimestamp = url => `${url}?t=${Date.now()}`;

    // 异步加载关键词
    function loadKeywordsAsync(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: addTimestamp(url),
                onload: function (response) {
                    if (response.status === 200) {
                        const keywords = response.responseText.split("\n").map(word => word.trim()).filter(Boolean);
                        resolve(keywords);
                    } else {
                        reject(new Error(`Failed to load keywords from ${url}`));
                    }
                },
            });
        });
    }

    // 构建单词的变形正则
    function buildRegex(word) {
        if (regexCache.has(word)) return regexCache.get(word);
        const regex = new RegExp(
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
        regexCache.set(word, regex);
        return regex;
    }

    // 恢复已高亮的节点
    function traverseAndRestore(node, regexList) {
        if (node.nodeType === 1) { // 元素节点
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

    // 遍历并高亮节点
    function traverseAndHighlight(node, keywords, color) {
        const regexList = keywords.map(buildRegex);
        if (node.nodeType === 3) { // 文本节点
            regexList.forEach(regex => highlightTextNode(node, regex, color));
        } else if (node.nodeType === 1 && node.childNodes && !/^(script|style|iframe)$/i.test(node.tagName)) { // 元素节点
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseAndHighlight(node.childNodes[i], keywords, color);
            }
        }
    }

    // 主函数
    async function main() {
        try {
            // 加载删除规则
            keywordGroups.delete.regexList = (await loadKeywordsAsync(keywordGroups.delete.url)).map(buildRegex);

            // 加载每个关键词组
            await Promise.all(
                Object.entries(keywordGroups).map(async ([group, { url, keywords }]) => {
                    if (group !== "delete") {
                        keywordGroups[group].keywords = await loadKeywordsAsync(url);
                    }
                })
            );

            // 优先处理删除高亮
            traverseAndRestore(document.body, keywordGroups.delete.regexList);

            // 按分组高亮关键词
            Object.values(keywordGroups).forEach(({ keywords, color }) => {
                if (keywords && color) {
                    traverseAndHighlight(
                        document.body,
                        keywords.filter(k => !keywordGroups.delete.regexList.some(regex => regex.test(k))),
                        color
                    );
                }
            });

            // 监听 DOM 变化并动态处理
            const observer = new MutationObserver(() => {
                debounceHighlight();
            });
            observer.observe(document.body, { childList: true, subtree: true });

        } catch (error) {
            console.error("Error in main:", error);
        }
    }

    // 高亮操作的节流函数
    let pending = false;
    function debounceHighlight() {
        if (pending) return;
        pending = true;
        setTimeout(() => {
            traverseAndRestore(document.body, keywordGroups.delete.regexList);
            Object.values(keywordGroups).forEach(({ keywords, color }) => {
                if (keywords && color) {
                    traverseAndHighlight(
                        document.body,
                        keywords.filter(k => !keywordGroups.delete.regexList.some(regex => regex.test(k))),
                        color
                    );
                }
            });
            pending = false;
        }, 100);
    }

    // 启动脚本
    main();
})();

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

    const urlGroup1 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt";
    const urlGroup2 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt";
    const urlGroup3 = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt";
    const deleteUrl = "https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt";

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