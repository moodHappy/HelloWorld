// ==UserScript==
// @name         高亮关键词
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlight keywords on a webpage, including their inflected forms such as plurals, tenses, and adverbs
// @author       You
// @match        *://*/*
// @exclude      *://www.bbc.com/*
// @exclude      *://bbc.co.uk/*
// @exclude      https://www.google.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL  https://update.greasyfork.org/scripts/518178/%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.user.js
// @updateURL    https://update.greasyfork.org/scripts/518178/%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

// CSS for highlighted text
GM_addStyle(`
  .highlighted {
    color: blue !important;
    font-weight: bold;
  }
`);

// Function to get stored keywords
async function getStoredKeywords() {
  return (await GM_getValue("keywords", [])).map(k => k.trim()).filter(k => k);
}

// Function to save keywords
async function setStoredKeywords(keywords) {
  await GM_setValue("keywords", keywords);
}

// Function to get deleted keywords
async function getDeletedKeywords() {
  return (await GM_getValue("deletedKeywords", [])).map(k => k.trim()).filter(k => k);
}

// Function to save deleted keywords
async function setDeletedKeywords(deletedKeywords) {
  await GM_setValue("deletedKeywords", deletedKeywords);
}

// Function to highlight keywords on the page
async function THmo_doHighlight(container) {
  const keywords = await getStoredKeywords();
  if (!keywords.length) return;

  // Generate the enhanced regex for each keyword
  const keywordPatterns = keywords.map(wordText => {
    return `\\b(${wordText}|` +
           `${wordText}s?|` +
           `${wordText.replace(/y$/, 'i')}es?|` +
           `${wordText}ed|` +
           `${wordText}ing|` +
           `${wordText}d|` +
           `${wordText}er|` +
           `${wordText}est|` +
           `${wordText}ly|` +
           `${wordText.replace(/y$/, 'ily')}|` +
           `${wordText.replace(/ic$/, 'ically')}|` +
           `${wordText.replace(/le$/, 'ly')})\\b`;
  });

  const keywordRegex = new RegExp(keywordPatterns.join("|"), "gi");

  // Use a tree walker to find text nodes
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        return keywordRegex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodesToHighlight = [];
  while (walker.nextNode()) {
    nodesToHighlight.push(walker.currentNode);
  }

  nodesToHighlight.forEach(node => {
    const span = document.createElement("span");
    span.innerHTML = node.nodeValue.replace(keywordRegex, match => `<span class="highlighted">${match}</span>`);
    node.parentNode.replaceChild(span, node);
  });
}

// Function to load keywords from a URL with a timestamp
async function loadKeywordsFromFile(url) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${url}?timestamp=${timestamp}`);
    if (!response.ok) {
      alert(`Failed to fetch keywords from URL: ${response.statusText}`);
      return [];
    }
    const text = await response.text();
    return text.split("\n").map(line => line.trim()).filter(line => line);
  } catch (error) {
    alert(`Error fetching keywords from URL: ${error.message}`);
    return [];
  }
}

// Menu command to load keywords from a URL
GM_registerMenuCommand("Load Keywords from URL", async () => {
  const url = prompt("Enter the URL to load keywords from:", "https://example.com/keywords.txt");
  if (!url) return;
  const newKeywords = await loadKeywordsFromFile(url);
  if (newKeywords.length > 0) {
    const storedKeywords = await getStoredKeywords();
    const combinedKeywords = [...new Set([...storedKeywords, ...newKeywords])];
    await setStoredKeywords(combinedKeywords);
    alert(`Loaded ${newKeywords.length} keywords from the URL.`);
    await THmo_doHighlight(document.body);
  } else {
    alert("No keywords were loaded from the provided URL.");
  }
});

// Menu command to manually add a keyword
GM_registerMenuCommand("Add Keyword", async () => {
  const keyword = prompt("Enter a keyword to add:");
  if (!keyword) return;
  const storedKeywords = await getStoredKeywords();
  if (!storedKeywords.includes(keyword)) {
    storedKeywords.push(keyword);
    await setStoredKeywords(storedKeywords);
    alert(`Added keyword: ${keyword}`);
    await THmo_doHighlight(document.body);
  } else {
    alert(`Keyword "${keyword}" is already in the list.`);
  }
});

// Menu command to view all keywords
GM_registerMenuCommand("View Keywords", async () => {
  const storedKeywords = await getStoredKeywords();
  alert(`Stored Keywords:\n${storedKeywords.join("\n")}`);
});

// Menu command to clear all keywords
GM_registerMenuCommand("Clear Keywords", async () => {
  if (confirm("Are you sure you want to clear all keywords?")) {
    await setStoredKeywords([]);
    alert("All keywords cleared.");
  }
});

// Menu command to delete a specific keyword
GM_registerMenuCommand("Delete Keyword", async () => {
  const storedKeywords = await getStoredKeywords();
  if (!storedKeywords.length) {
    alert("No keywords to delete.");
    return;
  }
  const keywordToDelete = prompt(`Enter a keyword to delete:\n${storedKeywords.join(", ")}`);
  if (!keywordToDelete) return;
  if (storedKeywords.includes(keywordToDelete)) {
    const updatedKeywords = storedKeywords.filter(k => k !== keywordToDelete);
    const deletedKeywords = await getDeletedKeywords();
    await setStoredKeywords(updatedKeywords);
    await setDeletedKeywords([...new Set([...deletedKeywords, keywordToDelete])]);
    alert(`Deleted keyword: ${keywordToDelete}`);
    await THmo_doHighlight(document.body);
  } else {
    alert(`Keyword "${keywordToDelete}" not found.`);
  }
});

// New menu command to cancel highlights from a URL
GM_registerMenuCommand("Cancel Highlights from URL", async () => {
  const url = prompt("Enter the URL to cancel highlights from:", "https://example.com/cancel_keywords.txt");
  if (!url) return;
  const cancelKeywords = await loadKeywordsFromFile(url);
  if (cancelKeywords.length > 0) {
    const storedKeywords = await getStoredKeywords();
    const updatedKeywords = storedKeywords.filter(keyword => !cancelKeywords.includes(keyword));
    await setStoredKeywords(updatedKeywords);
    alert(`Cancelled ${cancelKeywords.length} highlights from the URL.`);
    await THmo_doHighlight(document.body);
  } else {
    alert("No keywords to cancel from the provided URL.");
  }
});

// Initial highlighting
(async () => {
  await THmo_doHighlight(document.body);
})();