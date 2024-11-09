// ==UserScript==
// @name         蓝色（支持词形变化）
// @namespace    https://greasyfork.org/zh-TW
// @version      1.1
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