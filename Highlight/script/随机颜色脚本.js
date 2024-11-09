// ==UserScript==
// @name         蓝色
// @namespace    https://greasyfork.org/zh-TW
// @version      1.0
// @description  给网页关键词改变成蓝色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 清空关键词数组
    var keywords = [];

    // 直接返回蓝色
    function randomColor() {
        return "rgb(0,0,255)"; // 蓝色
    }

    // 遍历所有的文本节点，查找并替换关键词
    function replaceKeywords(node) {
        var text = node.textContent;
        var parent = node.parentNode;
        var index = -1;
        for (var i = 0; i < keywords.length; i++) {
            var keyword = keywords[i];
            var regex = new RegExp("\\b" + keyword + "\\b", "g"); // 使用正则表达式，完整匹配关键词
            var match = regex.exec(text);
            if (match) {
                index = match.index;
                break;
            }
        }
        if (index > -1) {
            var span = document.createElement("span");
            span.style.color = randomColor(); // 设置为蓝色
            span.textContent = text.slice(index, index + keyword.length);
            var after = node.splitText(index);
            after.textContent = after.textContent.slice(keyword.length);
            parent.insertBefore(span, after);
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