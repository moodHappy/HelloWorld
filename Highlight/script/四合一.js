// ==UserScript==
// @name         四合一
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改页面字体为 Quicksand，添加较强的文字阴影，随机加粗并变黄一个单词，添加阅读进度指示器，移动端回到顶部按钮，和阅读位置记忆功能。
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

// 字体阴影、阅读进度指示器、回到顶部按钮和阅读位置记忆

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
        #reading-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 5px;
            background-color: #3b82f6;
            z-index: 9999;
            transition: width 0.25s ease;
        }
        #back-to-top-btn {
            position: fixed;
            left: 20px;
            bottom: 60px;
            padding: 10px;
            background-color: #000;
            color: #fff;
            border: none;
            border-radius: 50%;
            z-index: 9999;
            display: none;
            cursor: pointer;
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

    // 创建并插入进度条
    let progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    // 计算页面滚动的百分比并更新进度条
    function updateProgressBar() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    // 页面滚动时更新进度条
    window.addEventListener('scroll', updateProgressBar);

    // 页面加载完成后执行
    window.onload = function() {
        randomBoldYellowWord();
        updateProgressBar();  // 初始化进度条
    };

    // 创建一个回到顶部的按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top-btn';
    backToTopButton.textContent = '↑';  // 按钮显示内容，可以根据需要更改
    document.body.appendChild(backToTopButton);

    let lastScrollTop = 0;  // 保存上一次滚动位置

    // 点击按钮时，页面平滑滚动到顶部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 当用户滚动时，显示或隐藏按钮，且根据滚动方向控制显示
    window.addEventListener('scroll', () => {
        let currentScrollTop = window.scrollY;  // 当前滚动位置

        if (currentScrollTop > 200) {
            // 向上滚动时显示按钮
            if (currentScrollTop < lastScrollTop) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';  // 向下滚动时隐藏按钮
            }
        } else {
            backToTopButton.style.display = 'none';  // 滚动小于200px时隐藏按钮
        }

        lastScrollTop = currentScrollTop;  // 更新上一次滚动位置
    });

    // 阅读位置记忆功能
    const currentUrl = window.location.href;

    // 检查本地存储是否有保存的阅读进度
    const savedScrollPosition = localStorage.getItem(currentUrl);

    // 如果有保存的进度，则恢复到保存的位置
    if (savedScrollPosition) {
        window.scrollTo(0, savedScrollPosition);
    }

    // 每次页面滚动时保存当前的滚动位置
    window.addEventListener('scroll', function() {
        localStorage.setItem(currentUrl, window.scrollY);
    });

})();