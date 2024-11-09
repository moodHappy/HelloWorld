// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果并朗读文本
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = 'white';
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.maxWidth = '300px';
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果并朗读文本
            fetchTranslation(selectedText);
            speakText(selectedText); // 调用朗读功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 显示翻译结果
                showTranslation(translation);
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 显示翻译结果
    function showTranslation(translation) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;
        const left = range.left + window.scrollX;

        translationBox.textContent = translation;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.left = `${left}px`;
        translationBox.style.display = 'block';

        // 5秒后自动隐藏翻译框
        setTimeout(() => {
            translationBox.style.display = 'none';
        }, 5000);
    }

    // 朗读选中的文本（英文）
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 设置语言为英文
        speechSynthesis.speak(utterance);
    }
})();