// 引入双文件/双色版

// ==UserScript==
// @name         蓝色与绿色关键词高亮（引入文件）
// @namespace    https://greasyfork.org/zh-TW
// @version      13.55
// @description  给网页两组关键词分别高亮蓝色和绿色，支持导出和导入已掌握的单词
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 在线获取关键词（蓝色）
    async function fetchBlueKeywords() {
        const url = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/three.txt';
        const response = await fetch(`${url}?t=${new Date().getTime()}`);
        const text = await response.text();
        return text.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    }

    // 在线获取关键词（绿色）
    async function fetchGreenKeywords() {
        const url = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/keywords/two.txt';
        const response = await fetch(`${url}?t=${new Date().getTime()}`);
        const text = await response.text();
        return text.split('\n').map(keyword => keyword.trim()).filter(keyword => keyword.length > 0);
    }

    // 从 localStorage 中加载已掌握的关键词
    let masteredBlueKeywords = JSON.parse(localStorage.getItem('masteredBlueKeywords')) || [];
    let masteredGreenKeywords = JSON.parse(localStorage.getItem('masteredGreenKeywords')) || [];

    // 生成蓝色和绿色
    function getColor(type) {
        return type === 'blue' ? 'rgb(0,0,255)' : 'rgb(0,128,0)'; // 蓝色或绿色
    }

    // 遍历文本节点并替换关键词
    async function replaceKeywords() {
        const blueKeywords = await fetchBlueKeywords();
        const greenKeywords = await fetchGreenKeywords();

        const filteredBlueKeywords = blueKeywords.filter(keyword => !masteredBlueKeywords.includes(keyword.toLowerCase()));
        const filteredGreenKeywords = greenKeywords.filter(keyword => !masteredGreenKeywords.includes(keyword.toLowerCase()));

        const blueRegex = createRegex(filteredBlueKeywords);
        const greenRegex = createRegex(filteredGreenKeywords);

        const textNodes = getTextNodes();

        textNodes.forEach(node => {
            const originalText = node.textContent;

            if (blueRegex.test(originalText) || greenRegex.test(originalText)) {
                const parent = node.parentNode;
                let newHtml = originalText;

                if (blueRegex.test(originalText)) {
                    newHtml = newHtml.replace(blueRegex, match => `<span style="color:${getColor('blue')}">${match}</span>`);
                }
                if (greenRegex.test(originalText)) {
                    newHtml = newHtml.replace(greenRegex, match => `<span style="color:${getColor('green')}">${match}</span>`);
                }

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newHtml;
                while (tempDiv.firstChild) {
                    parent.insertBefore(tempDiv.firstChild, node);
                }
                parent.removeChild(node);
            }
        });
    }

    // 构建词形变化正则表达式
    function createRegex(keywords) {
        const regexParts = keywords.map(word => {
            const base = word.toLowerCase();
            return `\\b(${base}|${base}s?|${base.replace(/y$/, 'i')}es?|${base}ed|${base}ing|${base}d|${base}er|${base}est|${base}ly|${base.replace(/y$/, 'ily')}|${base.replace(/ic$/, 'ically')}|${base.replace(/le$/, 'ly')})\\b`;
        });
        return new RegExp(regexParts.join('|'), 'gi');
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

    // 按钮操作：标记已掌握单词
    function markAsMastered(keyword, type) {
        const key = type === 'blue' ? 'masteredBlueKeywords' : 'masteredGreenKeywords';
        let masteredKeywords = JSON.parse(localStorage.getItem(key)) || [];
        if (!masteredKeywords.includes(keyword.toLowerCase())) {
            masteredKeywords.push(keyword.toLowerCase());
            localStorage.setItem(key, JSON.stringify(masteredKeywords));
        }
    }

    // 导出已掌握的单词
    function exportMasteredWords() {
        const blueWords = JSON.parse(localStorage.getItem('masteredBlueKeywords')) || [];
        const greenWords = JSON.parse(localStorage.getItem('masteredGreenKeywords')) || [];
        const combinedWords = [...new Set([...blueWords, ...greenWords])];

        const data = combinedWords.join('\n');
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mastered_keywords.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 导入已掌握的单词
    function importMasteredWords() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(event) {
                const text = event.target.result;
                const words = text.split('\n').map(word => word.trim()).filter(word => word.length > 0);
                // 将导入的已掌握单词存入localStorage
                const blueWords = JSON.parse(localStorage.getItem('masteredBlueKeywords')) || [];
                const greenWords = JSON.parse(localStorage.getItem('masteredGreenKeywords')) || [];
                const newBlueWords = [...new Set([...blueWords, ...words])];
                const newGreenWords = [...new Set([...greenWords, ...words])];
                localStorage.setItem('masteredBlueKeywords', JSON.stringify(newBlueWords));
                localStorage.setItem('masteredGreenKeywords', JSON.stringify(newGreenWords));
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 唤出按钮 */
        #trigger-button {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
        }

        /* 按钮容器 */
        #buttons-container {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: none; /* 初始隐藏 */
            flex-direction: row;
            justify-content: space-evenly;
            width: 100%;
            max-width: 360px;
            z-index: 999;
        }

        /* 单个按钮样式 */
        #buttons-container button {
            flex: 1;
            margin: 0 5px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            text-align: center;
        }

        #buttons-container button:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(style);

    // 添加触发按钮
    const triggerButton = document.createElement('button');
    triggerButton.id = 'trigger-button';
    document.body.appendChild(triggerButton);

    // 添加按钮容器及三个按钮
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttons-container';
    document.body.appendChild(buttonsContainer);

    const buttonNames = ['导出已掌握', '导入已掌握', '标记已掌握'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.innerText = name;
        buttonsContainer.appendChild(button);
    });

    // 按钮点击事件绑定
    buttonsContainer.children[0].onclick = exportMasteredWords;
    buttonsContainer.children[1].onclick = importMasteredWords;
    buttonsContainer.children[2].onclick = function () {
        const keyword = prompt('请输入已掌握的单词:');
        if (keyword) {
            markAsMastered(keyword, 'blue');
            markAsMastered(keyword, 'green');
        }
    };

// 触发按钮事件绑定
    triggerButton.addEventListener('click', () => {
        const isVisible = buttonsContainer.style.display === 'flex';
        buttonsContainer.style.display = isVisible ? 'none' : 'flex';
    });

    // 初次加载时替换网页中的关键词
    replaceKeywords();

})();


// 引入文件版

// ==UserScript==
// @name         三星蓝色（引入文件）
// @namespace    https://greasyfork.org/zh-TW
// @version      11.0
// @description  给网页关键词及其词形变化改变成蓝色，支持导出和导入已掌握的单词
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
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

    // 从 localStorage 中加载已掌握的关键词
    let masteredKeywords = JSON.parse(localStorage.getItem('masteredKeywords')) || [];

    // 生成蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历文本节点并替换关键词
    async function replaceKeywords() {
        const allKeywords = await fetchKeywords();

        // 排除已掌握的关键词
        const filteredKeywords = allKeywords.filter(keyword => !masteredKeywords.includes(keyword.toLowerCase()));

        // 构建词形变化正则表达式
        const regexParts = filteredKeywords.map(word => {
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

    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 唤出按钮 */
        #trigger-button {
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
        }

        /* 按钮容器 */
        #buttons-container {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: none; /* 初始隐藏 */
            flex-direction: row;
            justify-content: space-evenly;
            width: 100%;
            max-width: 360px;
            z-index: 999;
        }

        /* 单个按钮样式 */
        #buttons-container button {
            flex: 1;
            margin: 0 5px;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            text-align: center;
        }

        #buttons-container button:hover {
            background-color: #0056b3;
        }
    `;
    document.head.appendChild(style);

    // 添加触发按钮
    const triggerButton = document.createElement('button');
    triggerButton.id = 'trigger-button';
    document.body.appendChild(triggerButton);

    // 添加按钮容器及三个按钮
    const buttonsContainer = document.createElement('div');
    buttonsContainer.id = 'buttons-container';
    document.body.appendChild(buttonsContainer);

    const buttonNames = ['导出已掌握', '导入已掌握', '添加已掌握'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.innerText = name;
        buttonsContainer.appendChild(button);
    });

    // 按钮功能实现
    function exportMasteredKeywords() {
        const dataStr = JSON.stringify(masteredKeywords);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'masteredKeywords.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    function importMasteredKeywords() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const importedKeywords = JSON.parse(e.target.result);
                    if (Array.isArray(importedKeywords)) {
                        masteredKeywords = [...new Set([...masteredKeywords, ...importedKeywords])];
                        localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
                        alert('成功导入已掌握单词!');
                    } else {
                        alert('导入的文件格式不正确');
                    }
                } catch {
                    alert('导入失败，请检查文件格式');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    function addKeywordManually() {
        const word = prompt("请输入要标记为已掌握的单词：");
        if (word && !masteredKeywords.includes(word)) {
            masteredKeywords.push(word.toLowerCase());
            localStorage.setItem('masteredKeywords', JSON.stringify(masteredKeywords));
            alert(`已将 "${word}" 加入已掌握单词列表`);
        } else if (masteredKeywords.includes(word)) {
            alert(`"${word}" 已经在已掌握单词列表中`);
        } else {
            alert('输入无效');
        }
    }

    // 按钮点击事件绑定
    buttonsContainer.children[0].onclick = exportMasteredKeywords;
    buttonsContainer.children[1].onclick = importMasteredKeywords;
    buttonsContainer.children[2].onclick = addKeywordManually;

    // 触发按钮事件绑定
    triggerButton.addEventListener('click', () => {
        const isVisible = buttonsContainer.style.display === 'flex';
        buttonsContainer.style.display = isVisible ? 'none' : 'flex';
    });

    // 初始关键词替换
    replaceKeywords();
})();


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