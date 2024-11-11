// 新增取消高亮功能

// ==UserScript==
// @name         蓝色（支持词形变化）- 进阶版3.0
// @namespace    https://greasyfork.org/zh-TW
// @version      3.1
// @description  给网页关键词及其词形变化改变成蓝色，允许取消特定词汇的高亮
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义关键词数组
    var keywords1 = ['run', 'play', 'jump'];
    var keywords2 = ['speak', 'write', 'read'];
    var keywords3 = ['eat', 'sleep', 'study'];
    var keywords4 = ['work', 'travel', 'sing'];
    var keywords5 = ['cook', 'dance', 'shop'];
    var keywords6 = ['read', 'swim', 'laugh'];
    var keywords7 = ['think', 'listen', 'walk'];
    var keywords8 = ['drive', 'watch', 'meet'];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 合并所有关键词
    var allKeywords = [...keywords1, ...keywords2, ...keywords3, ...keywords4, ...keywords5, ...keywords6, ...keywords7, ...keywords8, ...keywords9, ...keywords10];

    // 获取已取消高亮的单词列表
    var removedKeywords = JSON.parse(localStorage.getItem('removedKeywords')) || [];

    // 生成蓝色
    function randomColor() {
        return "rgb(0,0,255)";
    }

    // 遍历文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        allKeywords.forEach(function(wordText) {
            // 跳过已取消高亮的单词
            if (removedKeywords.includes(wordText)) return;

            var wordFormsRegex = new RegExp('\\b(' +
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

            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}; cursor: pointer;" class="keyword">${match}</span>`;
            });
        });

        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text;
            parent.replaceChild(span, node);
        }
    }

    // 获取所有文本节点
    function getTextNodes() {
        var nodes = [];
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 执行关键词替换
    function highlightKeywords() {
        var textNodes = getTextNodes();
        textNodes.forEach(replaceKeywords);
    }

    // 按钮：取消高亮单词
    function createButton() {
        var button = document.createElement('button');
        button.textContent = '取消高亮单词';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.onclick = function() {
            var wordToRemove = prompt("请输入你要取消高亮的单词:");
            if (wordToRemove) {
                removedKeywords.push(wordToRemove.toLowerCase());
                localStorage.setItem('removedKeywords', JSON.stringify(removedKeywords));
                location.reload(); // 刷新页面以应用取消效果
            }
        };
        document.body.appendChild(button);
    }

    // 主函数
    function init() {
        highlightKeywords(); // 执行高亮
        createButton();      // 创建按钮
    }

    init(); // 初始化脚本

})();

//进阶版3.0

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      3.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义十个关键词数组
    var keywords1 = ['run', 'play', 'jump'];
    var keywords2 = ['speak', 'write', 'read'];
    var keywords3 = ['eat', 'sleep', 'study'];
    var keywords4 = ['work', 'travel', 'sing'];
    var keywords5 = ['cook', 'dance', 'shop'];
    var keywords6 = ['read', 'swim', 'laugh'];
    var keywords7 = ['think', 'listen', 'walk'];
    var keywords8 = ['drive', 'watch', 'meet'];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
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
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 替换匹配的关键词及词形变化为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`; // 替换为带有蓝色的 span
            });
        }

        // 只有当文本发生改变时才进行替换
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text; // 使用 innerHTML 来插入带有颜色的 span
            parent.replaceChild(span, node); // 替换原始文本节点
        }
    }

    // 获取所有的文本节点
    function getTextNodes() {
        var nodes = [];
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 对所有的文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }
})();

// 进阶版2.0

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      2.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义十个关键词数组
    var keywords1 = ['run', 'play', 'jump'];
    var keywords2 = ['speak', 'write', 'read'];
    var keywords3 = ['eat', 'sleep', 'study'];
    var keywords4 = ['work', 'travel', 'sing'];
    var keywords5 = ['cook', 'dance', 'shop'];
    var keywords6 = ['read', 'swim', 'laugh'];
    var keywords7 = ['think', 'listen', 'walk'];
    var keywords8 = ['drive', 'watch', 'meet'];
    var keywords9 = ['learn', 'talk', 'play'];
    var keywords10 = ['study', 'exercise', 'write'];

    // 将所有关键词数组合并为一个数组
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
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
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 替换匹配的关键词及词形变化为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`; // 替换为带有蓝色的 span
            });
        }

        // 只有当文本发生改变时才进行替换
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text; // 使用 innerHTML 来插入带有颜色的 span
            parent.replaceChild(span, node); // 替换原始文本节点
        }
    }

    // 获取所有的文本节点
    function getTextNodes() {
        var nodes = [];
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 对所有的文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }
})();


// 初级版1.0

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      1.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 清空关键词数组，添加一些示例关键词
    var keywords = []; // 示例关键词，可以根据需要扩展

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        for (var i = 0; i < keywords.length; i++) {
            var wordText = keywords[i].toLowerCase(); // 将关键词转换为小写
            var wordFormsRegex = new RegExp('\\b(' +
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
            ')\\b', 'gi'); // 构建词形变化的正则表达式，忽略大小写

            // 匹配词形变化并进行替换
            var match;
            while ((match = wordFormsRegex.exec(text)) !== null) {
                var span = document.createElement("span");
                span.style.color = randomColor(); // 设置为蓝色
                span.textContent = match[0]; // 匹配到的关键词
                var after = node.splitText(match.index);
                after.textContent = after.textContent.slice(match[0].length);
                parent.insertBefore(span, after);
                node = after; // 更新节点位置，继续匹配后续词汇
            }
        }
    }

    // 获取所有的文本节点
    function getTextNodes() {
        var nodes = [];
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node;
        while (node = walker.nextNode()) {
            nodes.push(node);
        }
        return nodes;
    }

    // 对所有的文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }
})();