// ==UserScript==
// @name         关键词高亮（支持分组）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Highlight keywords on a webpage with grouping and custom colors. Supports inflection matching and bulk removal via JSON.
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

// Function to get deleted keywords
async function getDeletedKeywords() {
  return (await GM_getValue("deletedKeywords", []));
}

// Function to save deleted keywords
async function setDeletedKeywords(deletedKeywords) {
  await GM_setValue("deletedKeywords", deletedKeywords);
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
      acceptNode: function(node) {
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

// Menu command to add a keyword to a group
GM_registerMenuCommand("Add Keyword to Group", async () => {
  const groupedKeywords = await getGroupedKeywords();
  const group = prompt("Enter group number (1-5):");
  if (!group || isNaN(group) || group < 1 || group > 5) return alert("Invalid group number.");
  const keyword = prompt("Enter a keyword to add:");
  if (!keyword) return;

  if (!groupedKeywords[group]) groupedKeywords[group] = [];
  if (!groupedKeywords[group].includes(keyword)) {
    groupedKeywords[group].push(keyword);
    await setGroupedKeywords(groupedKeywords);
    alert(`Added keyword "${keyword}" to group ${group}.`);
    await doHighlight(document.body);
  } else {
    alert(`Keyword "${keyword}" is already in group ${group}.`);
  }
});

// Menu command to delete a specific keyword from a group
GM_registerMenuCommand("Delete Keyword from Group", async () => {
  const groupedKeywords = await getGroupedKeywords();
  const deletedKeywords = await getDeletedKeywords();
  const group = prompt("Enter group number (1-5):");
  if (!group || isNaN(group) || group < 1 || group > 5 || !groupedKeywords[group]) {
    return alert("Invalid group number.");
  }
  const keywordToDelete = prompt(
    `Enter a keyword to delete from group ${group}:\n${groupedKeywords[group].join(", ")}`
  );
  if (!keywordToDelete) return;

  if (groupedKeywords[group].includes(keywordToDelete)) {
    groupedKeywords[group] = groupedKeywords[group].filter(k => k !== keywordToDelete);
    if (!groupedKeywords[group].length) delete groupedKeywords[group];
    deletedKeywords.push({ group, keyword: keywordToDelete });
    await setGroupedKeywords(groupedKeywords);
    await setDeletedKeywords(deletedKeywords);

    alert(`Deleted keyword "${keywordToDelete}" from group ${group}.`);
    document.body.innerHTML = document.body.innerHTML; // Reset DOM to clear old highlights
    await doHighlight(document.body); // Reapply highlights
  } else {
    alert(`Keyword "${keywordToDelete}" not found in group ${group}.`);
  }
});

// Menu command to export deleted keywords as JSON
GM_registerMenuCommand("Export Deleted Keywords", async () => {
  const deletedKeywords = await getDeletedKeywords();
  const json = JSON.stringify(deletedKeywords, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "deleted_keywords.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Menu command to import deleted keywords from JSON
GM_registerMenuCommand("Import Deleted Keywords", async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json";
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const importedKeywords = JSON.parse(reader.result);
        if (!Array.isArray(importedKeywords)) throw new Error("Invalid JSON format.");
        const deletedKeywords = await getDeletedKeywords();
        const mergedKeywords = [...deletedKeywords, ...importedKeywords];
        await setDeletedKeywords(mergedKeywords);
        alert("Keywords imported successfully.");
      } catch (error) {
        alert("Failed to import keywords: " + error.message);
      }
    };
    reader.readAsText(file);
  });
  fileInput.click();
});

// Menu command to clear all keywords
GM_registerMenuCommand("Clear All Keywords", async () => {
  if (confirm("Are you sure you want to clear all keywords?")) {
    await setGroupedKeywords({});
    document.body.innerHTML = document.body.innerHTML; // Reset DOM to clear highlights
    alert("All keywords cleared.");
  }
});

// Initial highlighting
(async () => {
  await doHighlight(document.body);
})();