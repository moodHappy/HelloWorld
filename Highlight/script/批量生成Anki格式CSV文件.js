// 修复音标输出

// ==UserScript==
// @name         生成Anki格式CSV文件-Free
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;
  let isSaving = false;

  // 配置 ChatGPT API 密钥
  const chatGPTAPIKey = "sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh"; // 替换为您自己的 ChatGPT API 密钥

  // 添加按钮和导出区域
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  // 使用 ChatGPT 获取音标
  async function getPhoneticSymbol(word) {
    const apiURL = "https://api.chatanywhere.org/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${chatGPTAPIKey}`,
    };

    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请为单词 "${word}" 提供音标，只返回音标，并用斜线包裹，如：/音标/。`,
        },
      ],
    });

    

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      const phonetic = result.choices[0]?.message?.content;
      return phonetic || "音标获取失败";
    } catch (error) {
      console.error("获取音标失败：", error);
      return "音标获取失败";
    }
  }

  // 保存为CSV文件
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.customWord}"|"${item.phoneticSymbol}"|"${item.customWordDefinition}"|"${item.text}"|"${item.translation}"|"${item.url}"|"${item.sentenceAnalysis.replace(/\n/g, '<br>')}"` // 将换行符替换为<br>
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

  // 翻译文本
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

  // 获取自定义单词释义
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  // 保存数据到localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));
    } catch (error) {
      console.error("保存到 localStorage 失败：", error);
    }
  }

  // 句子分析功能
  async function analyzeSentence(sentence) {
    const apiURL = "https://api.chatanywhere.org/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh", // 请在这里填写您的 API 密钥
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请分析以下句子并提供：
1. 主语、谓语、宾语；
2. 短语类型及成分（如名词短语、动词短语）；
3. 关键词及其意义；
4. 句型结构（如主谓宾、主系表等）；
5. 简要的语法讲解：
${sentence}`,
        },
      ],
    });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      return result.choices[0].message.content || "句子分析失败";
    } catch (error) {
      console.error("句子分析失败：", error);
      return "句子分析失败";
    }
  }

  // 添加数据到集合
  async function addData() {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);
    const sentenceAnalysis = await analyzeSentence(selectedText);
    const phoneticSymbol = await getPhoneticSymbol(customWord);

    const newData = {
      customWord,
      phoneticSymbol,
      customWordDefinition,
      text: selectedText,
      translation,
      url: currentURL,
      sentenceAnalysis,
    };

    dataCollection.push(newData);

    saveToLocalStorage();

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    }
  }

  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  pushButton.addEventListener("click", async () => {
    if (isSaving) return;
    isSaving = true;
    await addData();
    isSaving = false;
  });

  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });
})();


// 新增音标

// ==UserScript==
// @name         生成Anki格式CSV文件-Free
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;
  let isSaving = false;

  // 配置 ChatGPT API 密钥
  const chatGPTAPIKey = "sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh"; // 替换为您自己的 ChatGPT API 密钥

  // 添加按钮和导出区域
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  // 使用 ChatGPT 获取音标
  async function getPhoneticSymbol(word) {
    const apiURL = "https://api.chatanywhere.org/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${chatGPTAPIKey}`,
    };

    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请为单词 "${word}" 提供音标。`,
        },
      ],
    });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      const phonetic = result.choices[0]?.message?.content;
      return phonetic || "音标获取失败";
    } catch (error) {
      console.error("获取音标失败：", error);
      return "音标获取失败";
    }
  }

  // 保存为CSV文件
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.customWord}"|"${item.phoneticSymbol}"|"${item.customWordDefinition}"|"${item.text}"|"${item.translation}"|"${item.url}"|"${item.sentenceAnalysis.replace(/\n/g, '<br>')}"` // 将换行符替换为<br>
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

  // 翻译文本
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

  // 获取自定义单词释义
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  // 保存数据到localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));
    } catch (error) {
      console.error("保存到 localStorage 失败：", error);
    }
  }

  // 句子分析功能
  async function analyzeSentence(sentence) {
    const apiURL = "https://api.chatanywhere.org/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh", // 请在这里填写您的 API 密钥
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请分析以下句子并提供：
1. 主语、谓语、宾语；
2. 短语类型及成分（如名词短语、动词短语）；
3. 关键词及其意义；
4. 句型结构（如主谓宾、主系表等）；
5. 简要的语法讲解：
${sentence}`,
        },
      ],
    });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      return result.choices[0].message.content || "句子分析失败";
    } catch (error) {
      console.error("句子分析失败：", error);
      return "句子分析失败";
    }
  }

  // 添加数据到集合
  async function addData() {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);
    const sentenceAnalysis = await analyzeSentence(selectedText);
    const phoneticSymbol = await getPhoneticSymbol(customWord);

    const newData = {
      customWord,
      phoneticSymbol,
      customWordDefinition,
      text: selectedText,
      translation,
      url: currentURL,
      sentenceAnalysis,
    };

    dataCollection.push(newData);

    saveToLocalStorage();

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    }
  }

  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  pushButton.addEventListener("click", async () => {
    if (isSaving) return;
    isSaving = true;
    await addData();
    isSaving = false;
  });

  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });
})();


// 免费API

// ==UserScript==
// @name         生成Anki格式CSV文件-Free
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 添加锁机制
  let isSaving = false;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  // 保存为CSV文件
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"|"${item.customWord}"|"${item.customWordDefinition}"|"${item.sentenceAnalysis}"`
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

  // 翻译文本
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

  // 获取自定义单词释义
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  // 保存数据到localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));
    } catch (error) {
      console.error("保存到 localStorage 失败：", error);
    }
  }

  // 句子分析功能
  async function analyzeSentence(sentence) {
    const apiURL = "https://api.chatanywhere.org/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh",
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请分析以下句子并提供：
1. 主语、谓语、宾语；
2. 短语类型及成分（如名词短语、动词短语）；
3. 关键词及其意义；
4. 句型结构（如主谓宾、主系表等）；
5. 简要的语法讲解：
${sentence}`,
        },
      ],
    });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      const content = result.choices[0].message.content || "句子分析失败";

      // 格式化为段落
      const formattedContent = content
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");

      return formattedContent;
    } catch (error) {
      console.error("句子分析失败：", error);
      return "<p>句子分析失败</p>";
    }
  }

  // 添加数据到集合
  async function addData() {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);
    const sentenceAnalysis = await analyzeSentence(selectedText);

    const newData = {
      text: selectedText,
      translation,
      url: currentURL,
      customWord,
      customWordDefinition,
      sentenceAnalysis,
    };

    dataCollection.push(newData);

    // 保存到 localStorage
    saveToLocalStorage();

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 达到阈值时自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage(); // 清空 localStorage
    }
  }

  // 手动导出功能
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 按钮点击事件
  pushButton.addEventListener("click", async () => {
    if (isSaving) return; // 防止重复点击
    isSaving = true;
    await addData();
    isSaving = false;
  });

  // 双击左下角导出
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });

  // 键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });
})();

// 添加AI分析句子

// ==UserScript==
// @name         生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 添加锁机制
  let isSaving = false;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  // 保存为CSV文件
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"|"${item.customWord}"|"${item.customWordDefinition}"|"${item.sentenceAnalysis}"`
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

  // 翻译文本
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

  // 获取自定义单词释义
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  // 保存数据到localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));
    } catch (error) {
      console.error("保存到 localStorage 失败：", error);
    }
  }

  // 句子分析功能
  async function analyzeSentence(sentence) {
    const apiURL = "https://api.openai-sb.com/v1/chat/completions";
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer sb-c34f78c5f72dd54e1323d235b5b1a0fe4a14cca788191c24",
    };
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `请分析以下句子并提供：
1. 主语、谓语、宾语；
2. 短语类型及成分（如名词短语、动词短语）；
3. 关键词及其意义；
4. 句型结构（如主谓宾、主系表等）；
5. 简要的语法讲解：
${sentence}`,
        },
      ],
    });

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const result = await response.json();
      const content = result.choices[0].message.content || "句子分析失败";

      // 格式化为段落
      const formattedContent = content
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");

      return formattedContent;
    } catch (error) {
      console.error("句子分析失败：", error);
      return "<p>句子分析失败</p>";
    }
  }

  // 添加数据到集合
  async function addData() {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);
    const sentenceAnalysis = await analyzeSentence(selectedText);

    const newData = {
      text: selectedText,
      translation,
      url: currentURL,
      customWord,
      customWordDefinition,
      sentenceAnalysis,
    };

    dataCollection.push(newData);

    // 保存到 localStorage
    saveToLocalStorage();

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 达到阈值时自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage(); // 清空 localStorage
    }
  }

  // 手动导出功能
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 按钮点击事件
  pushButton.addEventListener("click", async () => {
    if (isSaving) return; // 防止重复点击
    isSaving = true;
    await addData();
    isSaving = false;
  });

  // 双击左下角导出
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });

  // 键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });
})();

// 修复存储问题

// ==UserScript==
// @name         生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 添加锁机制
  let isSaving = false;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  // 保存为CSV文件
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"|"${item.customWord}"|"${item.customWordDefinition}"`
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

  // 翻译文本
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

  // 获取自定义单词释义
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  // 保存数据到localStorage
  function saveToLocalStorage() {
    try {
      localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));
    } catch (error) {
      console.error("保存到 localStorage 失败：", error);
    }
  }

  // 添加数据到集合
  async function addData() {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);

    const newData = {
      text: selectedText,
      translation,
      url: currentURL,
      customWord,
      customWordDefinition,
    };

    dataCollection.push(newData);

    // 保存到 localStorage
    saveToLocalStorage();

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 达到阈值时自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage(); // 清空 localStorage
    }
  }

  // 手动导出功能
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      saveToLocalStorage();
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 按钮点击事件
  pushButton.addEventListener("click", async () => {
    if (isSaving) return; // 防止重复点击
    isSaving = true;
    await addData();
    isSaving = false;
  });

  // 双击左下角导出
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });

  // 键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });
})();

// 新增自定义单词翻译

// ==UserScript==
// @name         生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  /**
   * 将数据数组保存为CSV文件
   * @param {Array} data - 收集的选中内容数组
   */
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"|"${item.customWord}"|"${item.customWordDefinition}"`
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
   * 使用 Google Translate 翻译选中文本
   * @param {string} text - 要翻译的文本
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
   * 获取自定义单词的释义
   * @param {string} customWord - 自定义单词
   * @returns {Promise<string>} - 自定义单词的释义
   */
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      return data[0]?.map((item) => item[0]).join(", ") || "释义获取失败";
    } catch (error) {
      console.error("获取释义失败：", error);
      return "释义获取失败";
    }
  }

  /**
   * 监听按钮点击事件并处理数据
   */
  pushButton.addEventListener("click", async () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);

    dataCollection.push({
      text: selectedText,
      translation,
      url: currentURL,
      customWord,
      customWordDefinition,
    });

    // 将数据保存到 localStorage
    localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 当收集的数量达到阈值时，自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection");
    }
  });

  /**
   * 手动导出功能
   */
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection");
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 监听键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });

  // 监听双击左下角事件
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });
})();

// 新增自定义单词

// ==UserScript==
// @name         生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "逗号分隔文件";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent";
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none";
  exportArea.style.boxShadow = "none";
  exportArea.style.borderRadius = "50%";
  exportArea.style.cursor = "pointer";
  document.body.appendChild(exportArea);

  /**
   * 将数据数组保存为CSV文件
   * @param {Array} data - 收集的选中内容数组
   */
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"|"${item.customWord}"`
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
   * 使用 Google Translate 翻译选中文本
   * @param {string} text - 要翻译的文本
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
   * 获取自定义单词的释义
   * @param {string} customWord - 自定义单词
   * @returns {Promise<string>} - 自定义单词的释义
   */
  async function getCustomWordDefinition(customWord) {
    const apiURL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
      customWord
    )}`;

    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      const definition = data[0]?.map((item) => item[0]).join(", ");
      return `${customWord}: ${definition || "释义获取失败"}`;
    } catch (error) {
      console.error("获取释义失败：", error);
      return `${customWord}: 释义获取失败`;
    }
  }

  /**
   * 监听按钮点击事件并处理数据
   */
  pushButton.addEventListener("click", async () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const customWord = prompt("请为选中文本输入一个自定义单词：", "");
    if (!customWord) {
      alert("自定义单词不能为空！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);
    const customWordDefinition = await getCustomWordDefinition(customWord);

    dataCollection.push({
      text: selectedText,
      translation,
      customWord: customWordDefinition,
      url: currentURL,
    });

    // 将数据保存到 localStorage
    localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 当收集的数量达到阈值时，自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection");
    }
  });

  /**
   * 手动导出功能
   */
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection");
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 监听键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });

  // 监听双击左下角事件
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });
})();

// 生成Anki格式CSV文件

// ==UserScript==
// @name         生成Anki格式CSV文件
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  选中文本，点击按钮生成CSV文件，每存储5次自动导出，支持移动端滚动隐藏按钮，同时支持双击左下角手动导出。
// @author       moodHappy
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let dataCollection = JSON.parse(localStorage.getItem("ankiTextCollection")) || [];
  const exportThreshold = 5;

  // 创建按钮
  const pushButton = document.createElement("button");
  pushButton.innerHTML = "&nbsp;&nbsp;添加到CSV&nbsp;&nbsp;<br>";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "60px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "transparent";
  pushButton.style.border = "2px solid #007bff";
  pushButton.style.color = "#007bff";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";
  pushButton.style.fontWeight = "bold";
  pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)";
  pushButton.style.transition = "opacity 0.3s ease";
  pushButton.style.opacity = "1";
  document.body.appendChild(pushButton);

  let lastScrollY = window.scrollY;

  // 监听滚动事件以隐藏或显示按钮
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      pushButton.style.opacity = "0";
    } else {
      pushButton.style.opacity = "1";
    }

    lastScrollY = currentScrollY;
  });

  // 添加隐藏的左下角区域，用于双击导出
  const exportArea = document.createElement("div");
  exportArea.style.position = "fixed";
  exportArea.style.bottom = "10px";
  exportArea.style.left = "10px";
  exportArea.style.width = "50px";
  exportArea.style.height = "50px";
  exportArea.style.backgroundColor = "transparent"; // 设置完全透明
  exportArea.style.zIndex = 999;
  exportArea.style.border = "none"; // 无边框
  exportArea.style.boxShadow = "none"; // 无阴影
  exportArea.style.borderRadius = "50%"; // 保持形状为圆形
  exportArea.style.cursor = "pointer"; // 鼠标悬停效果
  document.body.appendChild(exportArea);

  /**
   * 将数据数组保存为CSV文件
   * @param {Array} data - 收集的选中内容数组
   */
  function saveAllToCSV(data) {
    const csvContent = data
      .map(
        (item) =>
          `"${item.text}"|"${item.translation}"|"${item.url}"`
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
   * 使用 Google Translate 翻译选中文本
   * @param {string} text - 要翻译的文本
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
   * 监听按钮点击事件并处理数据
   */
  pushButton.addEventListener("click", async () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
      alert("请先选中文本！");
      return;
    }

    const currentURL = window.location.href;
    const translation = await translateText(selectedText);

    dataCollection.push({
      text: selectedText,
      translation,
      url: currentURL,
    });

    // 将数据保存到 localStorage
    localStorage.setItem("ankiTextCollection", JSON.stringify(dataCollection));

    alert(`已添加到列表。目前列表中有 ${dataCollection.length} 条记录。`);

    // 当收集的数量达到阈值时，自动导出
    if (dataCollection.length >= exportThreshold) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection"); // 清空 localStorage 数据
    }
  });

  /**
   * 手动导出功能
   */
  function manualExport() {
    if (dataCollection.length > 0) {
      saveAllToCSV(dataCollection);
      dataCollection = [];
      localStorage.removeItem("ankiTextCollection"); // 清空 localStorage 数据
    } else {
      alert("当前没有可导出的数据。");
    }
  }

  // 监听键盘快捷键 Ctrl + E
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "e") {
      manualExport();
    }
  });

  // 监听双击左下角事件
  exportArea.addEventListener("dblclick", () => {
    manualExport();
  });
})();

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