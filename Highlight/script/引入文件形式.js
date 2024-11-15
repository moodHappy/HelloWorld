//新版

// ==UserScript==
// @name         蓝色（支持词形变化）引入文件
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