// 添加选中弹出释义并发音

// ==UserScript==
// @name         沉浸式翻译
// @namespace    http://tampermonkey.net/
// @version      1.8.5
// @description  Display bilingual translations, enable word lookup and pronunciation for English learners on BBC mobile, with a toggle switch using two-finger touch.
// @author       You
// @match        *://www.bbc.com/*
// @match        *://m.bbc.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Add style for translation box
    GM_addStyle(`
        .translation-box {
            background: #f8f9fa;
            padding: 5px;
            margin-top: 5px;
            border-left: 3px solid #007bff;
            font-size: 16px;
            color: #333;
            max-width: 100%;
            word-wrap: break-word;
            display: none; /* Initially hidden */
        }
        .show-translation-btn {
            display: inline-block;
            width: 25px;
            height: 25px;
            font-size: 14px;
            background-color: transparent; /* Transparent background */
            color: transparent; /* Transparent text/icon */
            cursor: pointer;
            border: none;
            border-radius: 50%;
            margin-left: 10px;
            position: relative;
            z-index: 1; /* Ensure it's above content */
        }
        .show-translation-btn::after {
            content: "🔘";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #007bff; /* Icon color */
            font-size: 14px;
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

    // API for pronunciation (Youdao)
    const youdaoAPI = "https://dict.youdao.com/dictvoice?audio=";

    // Function to play pronunciation
    const playPronunciation = (text) => {
        const audio = new Audio(youdaoAPI + encodeURIComponent(text));
        audio.play();
    };

    // Flag to enable/disable translation globally
    let isTranslationEnabled = false;

    // Function to toggle global translation visibility
    const toggleTranslation = () => {
        isTranslationEnabled = !isTranslationEnabled;
        document.querySelectorAll('.translation-box').forEach(box => {
            box.style.display = isTranslationEnabled ? 'block' : 'none';
        });
    };

    // Translate paragraphs and headings with a toggle button per element
    const addTranslationToElements = async () => {
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
        for (const el of elements) {
            const text = el.innerText.trim();
            if (text.length > 0) {
                const translation = await translateText(text);

                // Add translation box below the element
                const translationBox = document.createElement('div');
                translationBox.className = 'translation-box';
                translationBox.innerText = translation;
                el.after(translationBox);

                // Add a transparent toggle button for each element
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'show-translation-btn';
                el.appendChild(toggleBtn);

                // Add event listener to the toggle button
                toggleBtn.addEventListener('click', () => {
                    translationBox.style.display = translationBox.style.display === 'block' ? 'none' : 'block';
                });
            }
        }
    };

    // Initialize translations for paragraphs and headings
    addTranslationToElements();

    // Word lookup and pronunciation functionality on selection
    document.addEventListener('selectionchange', async () => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            // Play pronunciation directly after selection
            playPronunciation(selection);

            // Translate selected text
            const translation = await translateText(selection);

            // Show translation in a simple alert box
            alert(`${selection}：${translation}`);
        }
    });

    // Handle two-finger touch for translation toggle
    let touchStartTime = 0;

    document.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) { // Detect two fingers
            touchStartTime = new Date().getTime();
        }
    });

    document.addEventListener('touchend', (event) => {
        if (event.touches.length === 0 && touchStartTime) { // Check if touch was completed
            const touchDuration = new Date().getTime() - touchStartTime;
            if (touchDuration < 500) { // Ensure it’s a short tap
                toggleTranslation(); // Trigger translation toggle
            }
            touchStartTime = 0; // Reset the timer
        }
    });

})();



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