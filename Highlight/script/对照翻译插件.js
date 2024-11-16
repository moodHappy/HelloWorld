// ==UserScript==
// @name         Bilingual Boost for BBC Mobile
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display bilingual translations and enable word lookup for English learners on BBC mobile.
// @author       You
// @match        *://www.bbc.com/*
// @match        *://m.bbc.com/*
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
            font-size: 18px;
            color: #333;
            max-width: 100%;
            word-wrap: break-word;
        }
    `);

    // API for translation
    const translateAPI = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=";

    // Function to translate text
    const translateText = async (text) => {
        const response = await fetch(translateAPI + encodeURIComponent(text));
        const data = await response.json();
        return data[0][0][0];
    };

    // Translate BBC article titles and headings
    const translateHeadings = async () => {
        document.querySelectorAll('h1, h2, h3').forEach(async (heading) => {
            const text = heading.innerText.trim();
            if (text.length > 0) {
                const translation = await translateText(text);

                // Add translation box after the heading
                const translationBox = document.createElement('div');
                translationBox.className = 'translation-box';
                translationBox.innerText = translation;
                heading.after(translationBox);
            }
        });
    };

    // Translate BBC article paragraphs and text content
    const translateParagraphs = async () => {
        document.querySelectorAll('p').forEach(async (para) => {
            const text = para.innerText.trim();
            if (text.length > 0) {
                const translation = await translateText(text);

                // Add translation box below the paragraph
                const translationBox = document.createElement('div');
                translationBox.className = 'translation-box';
                translationBox.innerText = translation;
                para.after(translationBox);
            }
        });
    };

    // Call the translation functions
    translateHeadings();
    translateParagraphs();

    // Word lookup functionality
    document.addEventListener('dblclick', (e) => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            alert(`Looking up: ${selection}`);
            // Add dictionary API or links for word details here
        }
    });

})();