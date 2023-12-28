// ==UserScript==
// @name         Keyword Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight keywords in red color
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const keywords = [
        "fund", "firm", "ever", "cost", "cent", "bite", "beat", "base", "tax", "set",
        // Add all other keywords here
    ];

    const color = "red";

    function highlightKeywords(node) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        while (textNode = walker.nextNode()) {
            for (const keyword of keywords) {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const replacedHTML = textNode.nodeValue.replace(regex, match => `<span style="color: ${color};">${match}</span>`);
                if (replacedHTML !== textNode.nodeValue) {
                    const span = document.createElement('span');
                    span.innerHTML = replacedHTML;
                    textNode.parentNode.replaceChild(span, textNode);
                }
            }
        }
    }

    document.body.addEventListener('DOMNodeInserted', function(event) {
        highlightKeywords(event.target);
    });

    highlightKeywords(document.body);
})();