// ==UserScript==
// @name         Bilingual Boost
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display bilingual translations and enable word lookup for English learners.
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Add style for translation box
    GM_addStyle(`
        .translation-box {
            background: #f8f9fa;
            padding: 5px;
            margin-top: 5px;
            border-left: 3px solid #007bff;
            font-size: 14px;
            color: #333;
        }
    `);

    // API for translation
    const translateAPI = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=";

    // Add translation below paragraphs
    document.querySelectorAll('p').forEach(async (para) => {
        const text = para.innerText.trim();
        if (text.length > 0) {
            const response = await fetch(translateAPI + encodeURIComponent(text));
            const data = await response.json();
            const translation = data[0][0][0];
            
            // Add translation box
            const translationBox = document.createElement('div');
            translationBox.className = 'translation-box';
            translationBox.innerText = translation;
            para.after(translationBox);
        }
    });

    // Word lookup functionality
    document.addEventListener('dblclick', (e) => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            alert(`Looking up: ${selection}`);
            // Add dictionary API or links for word details here
        }
    });
})();