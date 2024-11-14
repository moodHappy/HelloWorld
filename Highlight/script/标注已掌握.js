// ==UserScript==
// @name         蓝色（支持词形变化）并标记已掌握单词
// @namespace    https://greasyfork.org/zh-TW
// @version      5.3
// @description  给网页关键词及其词形变化改变成蓝色，双击标记为已掌握，支持导出和导入已掌握的单词
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 从 localStorage 中加载已掌握的关键词
    var masteredKeywords = JSON.parse(localStorage.getItem('masteredKeywords')) || ['run', 'write', 'study', 'read'];

    // 定义十个关键词数组
    var keywords1 = ['live', 'play', 'jump'];
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

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

    // 生成蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 双击关键词时，将其标记为已掌握并保存到 localStorage
    function markAsMastered(word) {
        if (!masteredKeywords.includes(word)) {
            masteredKeywords.push(word);
            localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
            alert(`已标记 "${word}" 为已掌握单词`);
        }
    }

    // 导出已掌握单词为JSON格式
    function exportMasteredKeywords() {
        var dataStr = JSON.stringify(masteredKeywords);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        var exportFileDefaultName = 'masteredKeywords.json';

        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // 导入已掌握单词
    function importMasteredKeywords() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var importedKeywords = JSON.parse(e.target.result);
                    if (Array.isArray(importedKeywords)) {
                        masteredKeywords = [...new Set([...masteredKeywords, ...importedKeywords])]; // 合并且去重
                        localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
                        alert('成功导入已掌握单词!');
                    } else {
                        alert('导入的文件格式不正确');
                    }
                } catch (error) {
                    alert('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        };

        input.click(); // 触发文件选择对话框
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase();
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
            ')\\b', 'gi'); // 构建词形变化的正则表达式

            // 替换匹配的关键词及词形变化为带有双击事件的蓝色 span
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()};cursor:pointer;" ondblclick="markAsMastered('${match}')">${match}</span>`;
            });
        }

        // 如果文本发生改变，替换为新的带有颜色的节点
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text;
            parent.replaceChild(span, node);
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

    // 将 markAsMastered 暴露到全局作用域，以便双击事件可以调用
    window.markAsMastered = markAsMastered;
    window.exportMasteredKeywords = exportMasteredKeywords;
    window.importMasteredKeywords = importMasteredKeywords;

    // 添加导出导入按钮到页面上
    var exportButton = document.createElement('button');
    exportButton.innerText = '导出已掌握单词';
    exportButton.style.position = 'fixed';
    exportButton.style.bottom = '10px';
    exportButton.style.left = '10px';
    exportButton.onclick = exportMasteredKeywords;
    document.body.appendChild(exportButton);

    var importButton = document.createElement('button');
    importButton.innerText = '导入已掌握单词';
    importButton.style.position = 'fixed';
    importButton.style.bottom = '10px';
    importButton.style.left = '150px';
    importButton.onclick = importMasteredKeywords;
    document.body.appendChild(importButton);

})();



// 惊喜开始版

// ==UserScript==
// @name         蓝色（支持词形变化）并标记已掌握单词
// @namespace    https://greasyfork.org/zh-TW
// @version      5.2
// @description  给网页关键词及其词形变化改变成蓝色，点击标记为已掌握，支持导出和导入已掌握的单词
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 从 localStorage 中加载已掌握的关键词
    var masteredKeywords = JSON.parse(localStorage.getItem('masteredKeywords')) || ['run', 'write', 'study', 'read'];

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

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

    // 生成蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 点击关键词时，将其标记为已掌握并保存到 localStorage
    function markAsMastered(word) {
        if (!masteredKeywords.includes(word)) {
            masteredKeywords.push(word);
            localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
            alert(`已标记 "${word}" 为已掌握单词`);
        }
    }

    // 导出已掌握单词为JSON格式
    function exportMasteredKeywords() {
        var dataStr = JSON.stringify(masteredKeywords);
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        var exportFileDefaultName = 'masteredKeywords.json';

        var linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // 导入已掌握单词
    function importMasteredKeywords() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = function(event) {
            var file = event.target.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                try {
                    var importedKeywords = JSON.parse(e.target.result);
                    if (Array.isArray(importedKeywords)) {
                        masteredKeywords = [...new Set([...masteredKeywords, ...importedKeywords])]; // 合并且去重
                        localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
                        alert('成功导入已掌握单词!');
                    } else {
                        alert('导入的文件格式不正确');
                    }
                } catch (error) {
                    alert('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        };

        input.click(); // 触发文件选择对话框
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase();
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
            ')\\b', 'gi'); // 构建词形变化的正则表达式

            // 替换匹配的关键词及词形变化为带有点击事件的蓝色 span
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()};cursor:pointer;" onclick="markAsMastered('${match}')">${match}</span>`;
            });
        }

        // 如果文本发生改变，替换为新的带有颜色的节点
        if (text !== node.textContent) {
            var span = document.createElement('span');
            span.innerHTML = text;
            parent.replaceChild(span, node);
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

    // 将 markAsMastered 暴露到全局作用域，以便点击事件可以调用
    window.markAsMastered = markAsMastered;
    window.exportMasteredKeywords = exportMasteredKeywords;
    window.importMasteredKeywords = importMasteredKeywords;

    // 添加导出导入按钮到页面上
    var exportButton = document.createElement('button');
    exportButton.innerText = '导出已掌握单词';
    exportButton.style.position = 'fixed';
    exportButton.style.bottom = '10px';
    exportButton.style.left = '10px';
    exportButton.onclick = exportMasteredKeywords;
    document.body.appendChild(exportButton);

    var importButton = document.createElement('button');
    importButton.innerText = '导入已掌握单词';
    importButton.style.position = 'fixed';
    importButton.style.bottom = '10px';
    importButton.style.left = '150px';
    importButton.onclick = importMasteredKeywords;
    document.body.appendChild(importButton);

})();