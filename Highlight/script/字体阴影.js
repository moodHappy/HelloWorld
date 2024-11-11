// ==UserScript==
// @name         字体阴影
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change page font to Quicksand, add a stronger text shadow, and randomly bold a word and make it yellow
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 添加 Google Fonts 中的 Quicksand 字体
    const fontURL = 'https://fonts.googleapis.com/css2?family=Quicksand&display=swap';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontURL;
    document.head.appendChild(link);

    // 应用字体和更强的文字阴影样式
    GM_addStyle(`
        body {
            font-family: 'Quicksand', sans-serif !important;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2); /* 设置较强的文字阴影 */
        }
        .random-bold-yellow {
            font-weight: bold;
            color: yellow;
        }
    `);

    // 随机选择并加粗变黄一个单词
    function randomBoldYellowWord() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const textNodes = [];

        // 获取页面中所有的文本节点
        while (node = walker.nextNode()) {
            if (node.nodeValue.trim()) {
                textNodes.push(node);
            }
        }

        if (textNodes.length === 0) return;

        // 随机选择一个文本节点
        const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
        const words = randomNode.nodeValue.split(/\s+/).filter(word => word.length > 0);

        if (words.length === 0) return;

        // 随机选择该文本节点中的一个单词
        const randomWordIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomWordIndex];

        // 创建包含样式的 span 元素替换该单词
        const span = document.createElement('span');
        span.className = 'random-bold-yellow';
        span.textContent = randomWord;

        // 将该单词替换为新的 span 元素
        randomNode.nodeValue = randomNode.nodeValue.replace(randomWord, '');
        randomNode.parentNode.insertBefore(span, randomNode.nextSibling);
    }

    // 页面加载完成后执行
    window.onload = randomBoldYellowWord;

})();