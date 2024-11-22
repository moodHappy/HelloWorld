// ==UserScript==
// @name         页面高频词高亮
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  高亮页面前10个高频词，并排除常见词（从URL加载）
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const commonWordsUrl = 'https://raw.githubusercontent.com/moodHappy/HelloWorld/refs/heads/master/Highlight/script/Remove%20highlight/%E9%AB%98%E9%A2%91%E8%AF%8D%E6%8E%92%E9%99%A4.txt'; // 替换为实际的 URL

    // 函数：从文本中提取所有单词
    function extractWords(text) {
        return text.toLowerCase().match(/\b\w+\b/g) || [];
    }

    // 函数：计算单词频率，排除常见单词
    function getWordFrequency(words, excludeWords) {
        const freqMap = {};
        words.forEach(word => {
            if (!excludeWords.has(word)) {  // 排除常见词
                freqMap[word] = (freqMap[word] || 0) + 1;
            }
        });
        return freqMap;
    }

    // 函数：高亮单词
    function highlightWordInElement(element, word) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (element.nodeType === 3) { // 如果是文本节点
            const match = element.nodeValue.match(regex);
            if (match) {
                const newNode = element.nodeValue.replace(regex, `<span style="color: purple;">$&</span>`);
                const span = document.createElement('span');
                span.innerHTML = newNode;
                element.replaceWith(span);
            }
        }
    }

    // 函数：遍历并高亮内容区域中的文本节点
    function highlightTopWords(excludeWords) {
        // 获取页面的正文区域（排除如header, footer等非内容区域）
        const contentElements = document.body.querySelectorAll('p, div, article, section, span');

        // 提取并计算频率，排除常见单词
        let allWords = [];
        contentElements.forEach(element => {
            allWords = allWords.concat(extractWords(element.innerText));
        });

        const wordFrequency = getWordFrequency(allWords, excludeWords);

        // 获取前10个高频词
        const topWords = Object.keys(wordFrequency)
            .sort((a, b) => wordFrequency[b] - wordFrequency[a])
            .slice(0, 10);

        // 遍历正文区域并高亮前10个高频词
        contentElements.forEach(element => {
            topWords.forEach(word => {
                Array.from(element.childNodes).forEach(child => {
                    highlightWordInElement(child, word);
                });
            });
        });
    }

    // 加载常见单词并执行高亮操作
    const urlWithTimestamp = `${commonWordsUrl}?t=${Date.now()}`; // 动态添加时间戳
    fetch(urlWithTimestamp)
        .then(response => response.text())
        .then(data => {
            // 解析常见单词为集合
            const commonWords = new Set(data.toLowerCase().split('\n').map(word => word.trim()));

            // 执行高亮操作，排除常见单词
            highlightTopWords(commonWords);
        })
        .catch(error => {
            console.error('加载常见单词失败:', error);
            // 即使加载失败，也继续执行高亮操作
            highlightTopWords(new Set());
        });
})();