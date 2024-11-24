// ==UserScript==
// @name         批量生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  收集选中的文本，达到一定数量后一次性保存为CSV文件，便于在Anki导入，提取所在句子并翻译。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem('ankiTextCollection')) || []; // 从 localStorage 获取数据
  const exportThreshold = 5; // 达到此数量后自动导出

  /**
   * 将数据数组保存为CSV文件
   * @param {Array} data - 收集的选中内容数组
   */
  function saveAllToCSV(data) {
    const csvContent =
      "文本|链接|句子|翻译\n" +
      data
        .map(
          (item) =>
            `"${item.text}"|"${item.url}"|"${item.sentence}"|"${item.translation}"`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileURL = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = "anki_texts_batch.csv";
    a.click();
    URL.revokeObjectURL(fileURL);
    alert("已生成 CSV 文件。");
  }

  /**
   * 使用 Google Translate 翻译句子
   * @param {string} text - 要翻译的句子
   * @returns {Promise<string>} - 翻译结果
   */
  async function translateText(text) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      text
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join("") || "翻译获取失败";
    } catch (error) {
      console.error("翻译请求失败：", error);
      return "翻译获取失败";
    }
  }

  /**
   * 获取选中文本所在的句子
   */
  function getSelectedSentence() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    if (!selectedText) return "";

    const anchorNode = selection.anchorNode;
    const parentElement = anchorNode?.parentElement;
    let container = parentElement;

    while (container && container.textContent?.indexOf(selectedText) === -1) {
      container = container.parentElement;
    }

    const textContent = container?.textContent || selectedText;
    const sentenceRegex = new RegExp(`[^.!?]*${selectedText}[^.!?]*[.!?]`, "g");
    const match = textContent.match(sentenceRegex);
    return match ? match[0].trim() : selectedText;
  }

  /**
   * 监听选中的文本并收集数据
   */
  document.addEventListener("selectionchange", async () => {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText) {
      const sentence = getSelectedSentence();
      const currentURL = window.location.href;
      const translation = await translateText(sentence);

      const confirmPush = confirm(
        `是否将以下内容加入到待导出列表？\n\n文本: "${selectedText}"\n链接: "${currentURL}"\n句子: "${sentence}"\n翻译: "${translation}"`
      );

      if (confirmPush) {
        dataCollection.push({
          text: selectedText,
          url: currentURL,
          sentence,
          translation,
        });

        // 将数据保存到 localStorage
        localStorage.setItem('ankiTextCollection', JSON.stringify(dataCollection));

        alert(
          `已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`
        );

        // 当收集的数量达到阈值时，自动导出
        if (dataCollection.length >= exportThreshold) {
          saveAllToCSV(dataCollection);
          dataCollection = []; // 清空列表
          localStorage.removeItem('ankiTextCollection'); // 清空 localStorage 数据
        }
      }
    }
  });

  /**
   * 提供手动导出功能
   */
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      if (dataCollection.length > 0) {
        saveAllToCSV(dataCollection);
        dataCollection = [];
        localStorage.removeItem('ankiTextCollection'); // 清空 localStorage 数据
      } else {
        alert("当前没有可导出的数据。");
      }
    }
  });
})();