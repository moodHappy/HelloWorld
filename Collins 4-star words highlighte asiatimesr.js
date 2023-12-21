// ==UserScript==
// @name         Collins 4-star words highlighte asiatimesr
// @namespace    https://bing.com
// @version      1.0
// @description  Highlight the keywords in web pages
// @match        https://asiatimes.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the keywords and the highlight color
    var keywords = ["district", "tear","influence",];
    var color = "blue";

    // Create a regular expression to match the keywords, case-insensitive, whole word only
    var regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");

    // Get all the text nodes in the document
    var textNodes = document.evaluate("//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    // Loop through the text nodes and replace the keywords with a span element with the highlight color
    for (var i = 0; i < textNodes.snapshotLength; i++) {
        var node = textNodes.snapshotItem(i);
        var text = node.nodeValue;
        var parent = node.parentNode;
        var match = regex.exec(text);
        if (match) {
            // Create a document fragment to hold the new nodes
            var fragment = document.createDocumentFragment();
            var index = 0;
            do {
                // Append the text before the match
                fragment.appendChild(document.createTextNode(text.substring(index, match.index)));
                // Create a span element with the highlight color and append the matched text
                var span = document.createElement("span");
                span.style.backgroundColor = color;
                span.appendChild(document.createTextNode(match[0]));
                fragment.appendChild(span);
                // Update the index and match
                index = match.index + match[0].length;
                match = regex.exec(text);
            } while (match);
            // Append the text after the last match
            fragment.appendChild(document.createTextNode(text.substring(index)));
            // Replace the original node with the fragment
            parent.replaceChild(fragment, node);
        }
    }
})();
