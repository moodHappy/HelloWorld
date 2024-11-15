// ==UserScript==
// @name         红色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      1.3
// @description  给网页关键词及其词形变化改变成红色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 在线获取关键词
    async function fetchKeywords() {
        const url = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/test.txt';
        const response = await fetch(`${url}?t=${new Date().getTime()}`); // 添加时间戳参数
        const text = await response.text();
        return text.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    }

    // 直接返回红色
    function randomColor() {
        return "rgb(255,0,0)"; // 红色
    }

    // 遍历文本节点并替换关键词
    async function replaceKeywords() {
        const keywords = await fetchKeywords();

        // 构建词形变化正则表达式
        const regexParts = keywords.map(word => {
            const base = word.toLowerCase();
            return `\\b(${base}|${base}s?|${base.replace(/y$/, 'i')}es?|${base}ed|${base}ing|${base}d|${base}er|${base}est|${base}ly|${base.replace(/y$/, 'ily')}|${base.replace(/ic$/, 'ically')}|${base.replace(/le$/, 'ly')})\\b`;
        });
        const combinedRegex = new RegExp(regexParts.join('|'), 'gi');

        // 获取所有文本节点
        const textNodes = getTextNodes();

        // 替换关键词
        textNodes.forEach(node => {
            const originalText = node.textContent;
            if (combinedRegex.test(originalText)) {
                const parent = node.parentNode;
                const newHtml = originalText.replace(combinedRegex, match => {
                    return `<span style="color:${randomColor()}">${match}</span>`;
                });
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHtml;
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, node);
                }
                parent.removeChild(node);
            }
        });
    }

    // 获取所有的文本节点
    function getTextNodes() {
        const nodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 执行替换操作
    replaceKeywords();
})();