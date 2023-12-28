// ==UserScript==
// @name Keyword Highlighter
// @namespace https://www.bing.com
// @description A script to highlight keywords in red
// @include *
// @grant none
// ==/UserScript==

// Define the keywords to highlight
var keywords = ["fund", "firm", "ever", "cost", "cent", "bite", "beat", "base", "tax", "set", "per", "cut", "bit", "race", "rate", "role", "seem", "seel", "sort", "step", "wide", "among", "based", "claim", "event", "final", "force", "forty", "major", "month", "peace", "plant", "sense", "spend", "staff", "stage", "total", "twice", "union", "white", "whole", "accept", "accord", "almost", "appear", "better", "centre", "chance", "charge", "common", "course", "demand", "design", "direct", "dollar", "effect", "effort", "eleven", "enough", "expect", "figure", "former", "ground", "labour", "likely", "matter", "moment", "parent", "player", "policy", "rather", "reason", "recent", "record", "remain", "social", "street", "against", "attempt", "central", "century", "concern", "council", "current", "economy", "further", "general", "officer", "process", "produce", "product", "provide", "receive", "serious", "several", "society", "special", "thought", "towards", "whether", "without", "actually", "although", "announce", "campaign", "complete", "consider", "describe", "director", "economic", "election", "hospital", "increase", "industry", "interest", "national", "official", "position", "possible", "pressure", "probably", "research", "security", "thousand", "authority", "available", "committee", "community", "condition", "political", "programme", "secretary", "situation", "conference", "department", "experience", "university", "independent", "Prime Minister"];

// Create a regular expression to match the keywords
var regex = new RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");

// Create a style element to define the highlight color
var style = document.createElement("style");
style.textContent = ".keyword-highlight { color: red; }";
document.head.appendChild(style);

// Iterate over all text nodes in the document
var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
var node;
while (node = walker.nextNode()) {
  // Skip nodes that are inside scripts, styles, or comments
  if (node.parentNode.nodeName === "SCRIPT" || node.parentNode.nodeName === "STYLE" || node.nodeType === Node.COMMENT_NODE) {
    continue;
  }
  // Replace the keywords with span elements with the highlight class
  var html = node.nodeValue.replace(regex, "<span class='keyword-highlight'>$1</span>");
  // Create a temporary div element to parse the html
  var div = document.createElement("div");
  div.innerHTML = html;
  // Replace the original node with the parsed nodes
  while (div.firstChild) {
    node.parentNode.insertBefore(div.firstChild, node);
  }
  node.parentNode.removeChild(node);
}
