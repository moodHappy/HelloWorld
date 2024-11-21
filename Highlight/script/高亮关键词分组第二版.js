// 判断页面是否英语版

// ==UserScript==
// @name         Highlight English Words
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight English words based on remote keyword lists.
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // 判断页面是否为英语
    if (!document.documentElement.lang || !document.documentElement.lang.startsWith('en')) {
        console.log("Not an English page. Script halted.");
        return;
    }

    // 四组URL，带时间戳
    const timestamp = new Date().getTime();
    const highlightUrls = [
        `https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/2-2.txt?${timestamp}`,
        `https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/3.txt?${timestamp}`,
        `https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/45.txt?${timestamp}`,
    ];
    const cancelHighlightUrl = `https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/3.txt?${timestamp}`;

    const colors = ["red", "blue", "green"]; // 三组高亮颜色
    const highlightWords = [[], [], []]; // 存储高亮单词
    const cancelWords = []; // 存储取消高亮的单词

    // Fetch remote keyword lists
    function fetchKeywords(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    callback(response.responseText.split('\n').map(word => word.trim()).filter(Boolean));
                } else {
                    console.error(`Failed to fetch keywords from ${url}`);
                }
            }
        });
    }

    // Fetch all keywords
    function fetchAllKeywords() {
        highlightUrls.forEach((url, index) => {
            fetchKeywords(url, words => highlightWords[index] = words);
        });
        fetchKeywords(cancelHighlightUrl, words => {
            cancelWords.push(...words);
            processPage();
        });
    }

    // 创建正则匹配器
    function createWordRegex(wordText) {
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

    // 处理页面：高亮单词
    function processPage() {
        const allHighlightWords = new Set();
        highlightWords.forEach(words => words.forEach(word => allHighlightWords.add(word)));
        const cancelWordSet = new Set(cancelWords);

        // 优先取消高亮
        const cancelRegexes = Array.from(cancelWordSet).map(createWordRegex);
        const highlightRegexes = highlightWords.map(words => words.filter(word => !cancelWordSet.has(word)).map(createWordRegex));

        function highlightNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                const parent = node.parentNode;

                // 取消高亮
                cancelRegexes.forEach(regex => {
                    text = text.replace(regex, match => match);
                });

                // 高亮单词
                highlightRegexes.forEach((regexes, groupIndex) => {
                    regexes.forEach(regex => {
                        text = text.replace(regex, match => `<span style="color: ${colors[groupIndex]}">${match}</span>`);
                    });
                });

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = text;
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, node);
                }
                parent.removeChild(node);
            } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
                node.childNodes.forEach(highlightNode);
            }
        }

        document.body.childNodes.forEach(highlightNode);
    }

    // Fetch and process
    fetchAllKeywords();
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