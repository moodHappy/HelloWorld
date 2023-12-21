// ==UserScript==
// @name         Change Keyword Color
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Change the color of keywords on web pages according to their categories
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
        "category1": ["a", "able", "about", "accept", "accord", "according to", "account", "across", "act", "action", "actually", "after", "again", "against", "age", "ago", "agree", "aid", "air", "all", "allow", "almost", "along", "already", "also", "although", "always", "among", "and", "announce", "another", "answer", "any", "anything", "appear", "area", "arm", "army", "around", "art", "as", "ask", "at", "attack", "attempt", "authority", "available", "away", "back", "bad"], // red
        "category2": ["district", "tear", "balance", "cash", "gay", "damage", "entry", "long-term", "myself", "particular", "aim", "nature", "accuse", "plus", "ice", "teacher", "declare", "hurt", "crime", "anyone", "bill", "station", "network", "immediately", "stuff", "useful", "fifteenth", "ally", "gold", "Dr", "wonderful", "independence", "address", "novel", "refugee", "minority", "manager", "notice", "attend", "shape", "interview", "domestic", "basis", "excellent", "inside", "structure", "spirit", "female", "sleep", "note"], // yellow
        "category3": ["register", "somewhere", "stupid", "mystery", "crucial", "construction", "lie", "inning", "mate", "ski", "communication", "technical", "rhythm", "dig", "enable", "steam", "exception", "script", "allied", "formula", "beginning", "destruction", "definitely", "yours", "so-called", "guitar", "exposure", "reward", "raid", "steel", "suicide", "offensive", "merely", "hint", "merchant", "brilliant", "admire", "inspector", "regime", "pool", "colonel", "neat", "basically", "done", "racing", "resignation", "agenda", "embassy", "valley", "laboratory"], // blue
        "category4": ["sour", "freely", "educated", "engaged", "prohibit", "tan", "dispose", "voyage", "doll", "copper", "obsession", "leaflet", "rubber", "unrest", "pathetic", "unwilling", "obituary", "infant", "rehearsal", "berry", "disastrous", "reconciliation", "spike", "pave", "pudding", "sneak", "customs", "winger", "cupboard", "diminish", "glamorous", "mainstream", "dictionary", "weave", "trapped", "contemplate", "settler", "migrate", "pulse", "oz", "distinguished", "dried", "slot", "municipal", "equality", "stranger", "grim", "suburban", "boast", "umpire"], // green
        "category5": ["aback", "abandonment", "abate", "abdomen", "abdominal", "abduct", "aberration", "abide", "abiding", "abject", "ablaze", "abnormal", "abnormality", "abolition", "aboriginal", "abort", "abortive", "abound", "abrasive", "abreast", "absentee", "absorbed", "absorbing", "absorption", "abstain", "abstention", "abstinence", "abstraction", "abundance", "abundant", "abusive", "abyss", "AC", "acceleration", "accelerator", "accentuate", "accolade", "accompaniment", "accomplice", "accomplishment", "accordance", "accordion", "accountancy", "accredit", "accrue", "accumulation", "accused", "accustom", "accustomed"] // purple
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