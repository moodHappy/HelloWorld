// ==UserScript==
// @name         Change Keyword Color
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Change the color of keywords on web pages according to their categories
   @match        *://*/*
   @exclude      *://*/*?q=*
   @exclude      *://*/*?s=*
   @exclude      *://*/*?search=*
   @grant        none

// @match        *://*/*
// @exclude        *://google.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the keywords and their categories
    // You can add or remove keywords as you wish
    // Each category has a different color
    var keywords = {
        "category1": ['accept', 'accord', 'according to', 'account', 'across', 'act', 'action', 'actually', 'after', 'again', 'against', 'age', 'ago', 'agree'], // red
        "category2": ["two"], // yellow
        "category3": ["three"], // blue
        "category4": ["four"], // green
        "category5": ["five"] // purple
    };

    // Define the colors for each category
    // You can change the colors as you wish
    var colors = {
        "category1": "red",
        "category2": "yellow",
        "category3": "blue",
        "category4": "green",
        "category5": "purple"
    };

    // Get all the text nodes in the document
    // You can modify the selector as you wish
    var textNodes = document.evaluate("//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // Loop through the text nodes and replace the keywords with colored spans
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var parent = node.parentNode;
        var text = node.nodeValue;

        // Loop through the categories and the keywords
        for (var category in keywords) {
            var words = keywords[category];
            for (var j = 0; j < words.length; j++) {
                var word = words[j];
                var regex = new RegExp("\\b" + word + "\\b", "gi"); // match the whole word, case insensitive
                var color = colors[category];
                var span = "<span style='color:" + color + "'>" + word + "</span>"; // create a colored span
                text = text.replace(regex, span); // replace the word with the span
            }
        }

        // Replace the original text node with the new HTML
        var div = document.createElement("div");
        div.innerHTML = text;
        var frag = document.createDocumentFragment();
        while (div.firstChild) {
            frag.appendChild(div.firstChild);
        }
        parent.replaceChild(frag, node);
    }
})();