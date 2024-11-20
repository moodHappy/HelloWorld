// ==UserScript==
// @name         关键词高亮（支持分组）
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Highlight keywords on a webpage with grouping and custom colors. Supports inflection matching. Includes feature to remove highlights using keywords from a remote URL.
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

// CSS for highlighted text with groups
GM_addStyle(`
  .highlighted.group-1 { color: red; font-weight: bold; }
  .highlighted.group-2 { color: green; font-weight: bold; }
  .highlighted.group-3 { color: blue; font-weight: bold; }
  .highlighted.group-4 { color: orange; font-weight: bold; }
  .highlighted.group-5 { color: purple; font-weight: bold; }
`);

// Function to get stored grouped keywords
async function getGroupedKeywords() {
  return (await GM_getValue("groupedKeywords", {}));
}

// Function to save grouped keywords
async function setGroupedKeywords(groupedKeywords) {
  await GM_setValue("groupedKeywords", groupedKeywords);
}

// Function to remove highlights for specific keywords
async function removeHighlightsByKeywords(container, keywordsToRemove) {
  const keywordsRegex = new RegExp(
    keywordsToRemove.map(word => `\\b${word}\\b`).join("|"),
    "gi"
  );

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function (node) {
        return node.classList?.contains("highlighted") && keywordsRegex.test(node.textContent)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const nodesToRemove = [];
  while (walker.nextNode()) {
    nodesToRemove.push(walker.currentNode);
  }

  nodesToRemove.forEach(node => {
    const parent = node.parentNode;
    parent.replaceChild(document.createTextNode(node.textContent), node);
    parent.normalize(); // Merge adjacent text nodes
  });
}

// Function to highlight grouped keywords with inflection matching
async function doHighlight(container) {
  const groupedKeywords = await getGroupedKeywords();
  if (!Object.keys(groupedKeywords).length) return;

  const groupRegexes = Object.entries(groupedKeywords).map(([group, keywords]) => {
    const patterns = keywords.map(wordText => {
      return '\\b(' +
        wordText + '|' +
        wordText + 's?' + '|' +
        wordText.replace(/y$/, 'i') + 'es?' + '|' +
        wordText + 'ed' + '|' +
        wordText + 'ing' + '|' +
        wordText + 'd' + '|' +
        wordText + 'er' + '|' +
        wordText + 'est' + '|' +
        wordText + 'ly' + '|' +
        wordText.replace(/y$/, 'ily') + '|' +
        wordText.replace(/ic$/, 'ically') + '|' +
        wordText.replace(/le$/, 'ly') +
        ')\\b';
    }).join("|");
    return { regex: new RegExp(patterns, "gi"), group };
  });

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        return groupRegexes.some(({ regex }) => regex.test(node.nodeValue))
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodesToHighlight = [];
  while (walker.nextNode()) {
    nodesToHighlight.push(walker.currentNode);
  }

  nodesToHighlight.forEach(node => {
    let highlightedHTML = node.nodeValue;
    groupRegexes.forEach(({ regex, group }) => {
      highlightedHTML = highlightedHTML.replace(regex, match => `<span class="highlighted group-${group}">${match}</span>`);
    });
    const span = document.createElement("span");
    span.innerHTML = highlightedHTML;
    node.parentNode.replaceChild(span, node);
  });
}

// Menu command to import keywords from a remote TXT file
GM_registerMenuCommand("Import Keywords from URL", async () => {
  const baseURL = prompt("Enter the base URL of the TXT file (timestamp will be added automatically):");
  if (!baseURL) return alert("URL is required.");

  try {
    const timestampedURL = `${baseURL}?t=${Date.now()}`;
    const response = await fetch(timestampedURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const text = await response.text();
    const keywords = text.split(/\r?\n/).filter(word => word.trim());

    if (!keywords.length) return alert("No keywords found in the file.");

    const groupedKeywords = await getGroupedKeywords();
    const group = prompt("Enter group number (1-5) to add these keywords:");
    if (!group || isNaN(group) || group < 1 || group > 5) return alert("Invalid group number.");

    if (!groupedKeywords[group]) groupedKeywords[group] = [];
    keywords.forEach(keyword => {
      if (!groupedKeywords[group].includes(keyword)) {
        groupedKeywords[group].push(keyword);
      }
    });

    await setGroupedKeywords(groupedKeywords);
    alert(`Imported ${keywords.length} keywords into group ${group}.`);
    await doHighlight(document.body);
  } catch (error) {
    alert(`Failed to fetch keywords: ${error.message}`);
  }
});

// Menu command to remove highlights using keywords from a remote URL
GM_registerMenuCommand("Remove Highlights from URL", async () => {
  const baseURL = prompt("Enter the base URL of the TXT file for keywords to remove (timestamp will be added automatically):");
  if (!baseURL) return alert("URL is required.");

  try {
    const timestampedURL = `${baseURL}?t=${Date.now()}`;
    const response = await fetch(timestampedURL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const text = await response.text();
    const keywordsToRemove = text.split(/\r?\n/).filter(word => word.trim());

    if (!keywordsToRemove.length) return alert("No keywords found in the file.");

    // First, remove highlights for the keywords to be removed
    await removeHighlightsByKeywords(document.body, keywordsToRemove);

    // Then, remove those keywords from the stored groupedKeywords
    const groupedKeywords = await getGroupedKeywords();
    Object.entries(groupedKeywords).forEach(([group, keywords]) => {
      groupedKeywords[group] = keywords.filter(keyword => !keywordsToRemove.includes(keyword));
    });

    await setGroupedKeywords(groupedKeywords);
    alert(`Removed highlights for ${keywordsToRemove.length} keywords.`);
  } catch (error) {
    alert(`Failed to fetch keywords: ${error.message}`);
  }
});

// Initial highlighting
(async () => {
  await doHighlight(document.body);
})();