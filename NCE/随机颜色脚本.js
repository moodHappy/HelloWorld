// ==UserScript==
// @name         随机颜色关键词
// @namespace    https://greasyfork.org/zh-TW
// @version      1.0
// @description  给网页关键词改变成随机颜色，完整匹配
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义要匹配的关键词，可以修改为您想要的
    var keywords = ["district","fund","firm","ever","cost","cent","bite","beat","base","tax","set","per","cut","bit","race","rate","role","seem","seel","sort","step","wide","among","based","claim","event","final","force","forty","major","month","peace","plant","sense","spend","staff","stage","total","twice","union","white","whole","accept","accord","almost","appear","better","centre","chance","charge","common","course","demand","design","direct","dollar","effect","effort","eleven","enough","expect","figure","former","ground","labour","likely","matter","moment","parent","player","policy","rather","reason","recent","record","remain","social","street","against","attempt","central","century","concern","council","current","economy","further","general","officer","process","produce","product","provide","receive","serious","several","society","special","thought","towards","whether","without","actually","although","announce","campaign","complete","consider","describe","director","economic","election","hospital","increase","industry","interest","national","official","position","possible","pressure","probably","research","security","thousand","authority","available","committee","community","condition","political","programme","secretary","situation","conference","department","experience","university","independent","PrimeMinister"
];

    // 定义一个函数，生成随机颜色
    function randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
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
            span.style.color = randomColor(); // 设置随机颜色
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