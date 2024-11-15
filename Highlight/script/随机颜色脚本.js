// 标记已掌握并 导入导出关键词

// ==UserScript==
// @name         蓝色（支持词形变化）并标记已掌握单词
// @namespace    https://greasyfork.org/zh-TW
// @version      6.0
// @description  给网页关键词及其词形变化改变成蓝色，支持导出和导入已掌握的单词
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

    // 添加输入框功能以手动标记单词为已掌握
    function addKeywordManually() {
        var word = prompt("请输入要标记为已掌握的单词：");
        if (word && !masteredKeywords.includes(word)) {
            masteredKeywords.push(word);
            localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
            alert(`已将 "${word}" 加入已掌握单词列表`);
        } else if (masteredKeywords.includes(word)) {
            alert(`"${word}" 已经在已掌握单词列表中`);
        } else {
            alert('输入无效');
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
                wordText.replace(/ic$/, 'istically') + '|' +
                wordText.replace(/le$/, 'ly') +
            ')\\b', 'gi'); // 构建词形变化的正则表达式

            // 替换匹配的关键词及词形变化为带有颜色的 span
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()};">${match}</span>`;
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

    // 创建功能按钮容器
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'fixed';
    buttonsContainer.style.bottom = '90px'; // 设置按钮底部距离
    buttonsContainer.style.left = '50%'; // 居中
    buttonsContainer.style.transform = 'translateX(-50%)'; // 水平居中
    buttonsContainer.style.display = 'flex'; 
    buttonsContainer.style.gap = '10px'; 
    buttonsContainer.style.justifyContent = 'space-between'; // 按钮均匀分布
    buttonsContainer.style.width = '100%'; // 占据整个宽度
    buttonsContainer.style.maxWidth = '360px'; // 设置最大宽度以适应移动端
    document.body.appendChild(buttonsContainer);

    // 创建导出按钮
    var exportButton = document.createElement('button');
    exportButton.innerText = '导出已掌握';
    exportButton.style.backgroundColor = '#007BFF';
    exportButton.style.color = 'white';
    exportButton.style.border = 'none';
    exportButton.style.padding = '10px';
    exportButton.style.borderRadius = '5px';
    exportButton.style.cursor = 'pointer';
    exportButton.style.flex = '1'; // 占据父容器的相同比例
    buttonsContainer.appendChild(exportButton);
    exportButton.onclick = exportMasteredKeywords;

    // 创建导入按钮
    var importButton = document.createElement('button');
    importButton.innerText = '导入已掌握';
    importButton.style.backgroundColor = '#007BFF';
    importButton.style.color = 'white';
    importButton.style.border = 'none';
    importButton.style.padding = '10px';
    importButton.style.borderRadius = '5px';
    importButton.style.cursor = 'pointer';
    importButton.style.flex = '1'; // 占据父容器的相同比例
    buttonsContainer.appendChild(importButton);
    importButton.onclick = importMasteredKeywords;

    // 创建手动添加按钮
    var addButton = document.createElement('button');
    addButton.innerText = '添加已掌握';
    addButton.style.backgroundColor = '#007BFF';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.padding = '10px';
    addButton.style.borderRadius = '5px';
    addButton.style.cursor = 'pointer';
    addButton.style.flex = '1'; // 占据父容器的相同比例
    buttonsContainer.appendChild(addButton);
    addButton.onclick = addKeywordManually;

// 创建唤出按钮
    var toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.left = '50%';
    toggleButton.style.transform = 'translateX(-50%)';
    toggleButton.style.width = '20px';
    toggleButton.style.height = '20px';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明黑色
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';

    toggleButton.onclick = function() {
        // 切换功能按钮的显示和隐藏
        if (buttonsContainer.style.display === 'none') {
            buttonsContainer.style.display = 'flex';
        } else {
            buttonsContainer.style.display = 'none';
        }
    };

    // 创建唤出按钮的内容（可以加上图标或者文字，但按要求没有文字）
    var toggleButtonIcon = document.createElement('span');
    toggleButtonIcon.style.display = 'block';
    toggleButtonIcon.style.width = '20px';
    toggleButtonIcon.style.height = '20px';
    toggleButtonIcon.style.backgroundColor = ''; // 保持无文字或图标
    toggleButtonIcon.style.borderRadius = '50%';
    toggleButton.appendChild(toggleButtonIcon);

    // 初始时隐藏功能按钮
    buttonsContainer.style.display = 'none';

    // 添加唤出按钮到页面
    document.body.appendChild(toggleButton);
})();

// 排除已掌握数组置于前

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      5.0
// @description  给网页关键词及其词形变化改变成蓝色，完整匹配
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义已掌握的关键词数组
    var masteredKeywords = ['run', 'write', 'study', 'read'];

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

// 分支 新增排除已掌握数组

// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      5.0
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

    // 定义已掌握的关键词数组
    var masteredKeywords = ['run', 'write', 'study', 'read'];

    // 排除已掌握的关键词
    allKeywords = allKeywords.filter(function(keyword) {
        return !masteredKeywords.includes(keyword);
    });

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

// 新增取消高亮功能

// ==UserScript==
// @name         蓝色（支持词形变化） - 可取消高亮
// @namespace    https://greasyfork.org/zh-TW
// @version      3.1
// @description  给网页关键词及其词形变化改变成蓝色，并可永久取消某些单词的高亮
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
    var allKeywords = [
        ...keywords1, ...keywords2, ...keywords3, 
        ...keywords4, ...keywords5, ...keywords6, 
        ...keywords7, ...keywords8, ...keywords9, 
        ...keywords10
    ];

    // 从localStorage获取已取消高亮的单词列表
    var canceledKeywords = JSON.parse(localStorage.getItem('canceledKeywords')) || [];

    // 定义蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;

        // 遍历所有关键词
        for (var i = 0; i < allKeywords.length; i++) {
            var wordText = allKeywords[i].toLowerCase(); 

            // 如果单词在取消高亮的列表中，则跳过
            if (canceledKeywords.includes(wordText)) {
                continue;
            }

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

            // 替换匹配的关键词为蓝色
            text = text.replace(wordFormsRegex, function(match) {
                return `<span style="color:${randomColor()}">${match}</span>`;
            });
        }

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

    // 对所有文本节点执行替换操作
    var textNodes = getTextNodes();
    for (var i = 0; i < textNodes.length; i++) {
        replaceKeywords(textNodes[i]);
    }

    // 创建按钮并插入页面
    var button = document.createElement('button');
    button.textContent = '取消单词高亮';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener('click', function() {
        var wordToCancel = prompt('输入要取消高亮的单词：');
        if (wordToCancel) {
            wordToCancel = wordToCancel.toLowerCase();
            if (!canceledKeywords.includes(wordToCancel)) {
                canceledKeywords.push(wordToCancel);
                localStorage.setItem('canceledKeywords', JSON.stringify(canceledKeywords));
                alert('单词 "' + wordToCancel + '" 已取消高亮。');
                location.reload(); // 刷新页面以应用更改
            } else {
                alert('该单词已经被取消高亮。');
            }
        }
    });
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