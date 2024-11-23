// 解决与沉浸式翻译的冲突

// ==UserScript==
// @name         网页笔记推送系统 (透明背景按钮)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  记录网页选中的文本并以 Markdown 格式推送到远程存储。
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // 配置 GitHub 相关信息
  const GITHUB_USERNAME = "moodHappy";
  const GITHUB_REPO = "HelloWorld";
  const GITHUB_FILE_PATH = "Notes/News.md";
  const GITHUB_TOKEN = "";

  /**
   * 获取远程文件的 SHA 值和内容
   */
  async function getFileShaAndContent() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        onload: (response) => {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            resolve({ sha: data.sha, content: decodeBase64(data.content) });
          } else if (response.status === 404) {
            resolve({ sha: null, content: "" }); // 文件不存在
          } else {
            reject(`无法获取文件信息: ${response.responseText}`);
          }
        },
        onerror: (err) => {
          reject(`请求错误: ${err}`);
        },
      });
    });
  }

  /**
   * 更新远程文件内容
   */
  function updateFile(newContent, sha) {
    GM_xmlhttpRequest({
      method: "PUT",
      url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      data: JSON.stringify({
        message: "Update notes",
        content: encodeBase64(newContent),
        sha: sha,
      }),
      onload: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert("笔记已成功推送到 GitHub！");
        } else {
          alert("推送失败：" + response.responseText);
        }
      },
      onerror: (err) => {
        alert("请求错误：" + err);
      },
    });
  }

  /**
   * 将字符串编码为 Base64（支持 Unicode）
   */
  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * 将 Base64 解码为字符串（支持 Unicode）
   */
  function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  /**
   * 格式化当前日期为 `Date: Month Day, Year`
   */
  function getFormattedDate() {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return `*Date: ${new Date().toLocaleDateString("en-US", options)}*`;
  }

  /**
   * 推送选中的文本到远程
   */
  async function pushNoteToRemote() {
    const selectedText = String(window.getSelection().toString().trim());
    if (!selectedText) {
      alert("未选中任何文本，无法推送！");
      return;
    }

    const currentUrl = window.location.href;
    const markdownText = `[${selectedText}](${currentUrl})\n${getFormattedDate()}\n`;

    try {
      const { sha, content } = await getFileShaAndContent();
      const newContent = (content ? content.trim() + "\n\n" : "") + markdownText;
      updateFile(newContent, sha);
    } catch (err) {
      alert("推送笔记失败：" + err);
    }
  }

  /**
   * 创建按钮并使其具有透明背景
   */
  function createTransparentButton() {
    const pushButton = document.createElement("button");
    pushButton.textContent = "推送选中文本";
    pushButton.style.position = "fixed";
    pushButton.style.bottom = "10px";
    pushButton.style.right = "10px";
    pushButton.style.zIndex = 1000;
    pushButton.style.padding = "10px";
    pushButton.style.backgroundColor = "transparent"; // 背景透明
    pushButton.style.border = "2px solid #007bff"; // 边框颜色
    pushButton.style.color = "#007bff"; // 字体颜色
    pushButton.style.borderRadius = "5px";
    pushButton.style.cursor = "pointer";
    pushButton.style.fontWeight = "bold"; // 字体加粗
    pushButton.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.2)"; // 添加阴影效果

    pushButton.addEventListener("click", pushNoteToRemote);
    document.body.appendChild(pushButton);
  }

  // 创建透明按钮
  createTransparentButton();
})();

// 优化

// ==UserScript==
// @name         网页笔记推送系统
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  记录网页选中的文本并以 Markdown 格式推送到远程存储。
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // 配置 GitHub 相关信息
  const GITHUB_USERNAME = "moodHappy";
  const GITHUB_REPO = "HelloWorld";
  const GITHUB_FILE_PATH = "Notes/News.md";
  const GITHUB_TOKEN = "";

  /**
   * 获取远程文件的 SHA 值和内容
   */
  async function getFileShaAndContent() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        onload: (response) => {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            resolve({ sha: data.sha, content: decodeBase64(data.content) });
          } else if (response.status === 404) {
            // 文件不存在，返回空内容
            resolve({ sha: null, content: "" });
          } else {
            reject(`无法获取文件信息: ${response.responseText}`);
          }
        },
        onerror: (err) => {
          reject(`请求错误: ${err}`);
        },
      });
    });
  }

  /**
   * 更新远程文件内容
   * @param {string} newContent - 新的文件内容
   * @param {string} sha - 当前文件的 SHA 值
   */
  function updateFile(newContent, sha) {
    GM_xmlhttpRequest({
      method: "PUT",
      url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      data: JSON.stringify({
        message: "Update notes",
        content: encodeBase64(newContent),
        sha: sha,
      }),
      onload: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert("笔记已成功推送到 GitHub！");
        } else {
          alert("推送失败：" + response.responseText);
        }
      },
      onerror: (err) => {
        alert("请求错误：" + err);
      },
    });
  }

  /**
   * 将字符串编码为 Base64（支持 Unicode）
   */
  function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * 将 Base64 解码为字符串（支持 Unicode）
   */
  function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
  }

  /**
   * 格式化当前日期为 `Date: Month Day, Year`
   */
  function getFormattedDate() {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return `*Date: ${new Date().toLocaleDateString("en-US", options)}*`;
  }

  /**
   * 推送选中的文本到远程
   */
  async function pushNoteToRemote() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      alert("未选中任何文本，无法推送！");
      return;
    }

    const currentUrl = window.location.href;
    const markdownText = `[${selectedText}](${currentUrl})\n${getFormattedDate()}\n`;

    try {
      const { sha, content } = await getFileShaAndContent();
      const newContent = (content ? content.trim() + "\n\n" : "") + markdownText;
      updateFile(newContent, sha);
    } catch (err) {
      alert("推送笔记失败：" + err);
    }
  }

  /**
   * 添加一个按钮来推送选中的文本
   */
  const pushButton = document.createElement("button");
  pushButton.textContent = "推送选中文本";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "10px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "#007bff";
  pushButton.style.color = "white";
  pushButton.style.border = "none";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";

  pushButton.addEventListener("click", pushNoteToRemote);

  document.body.appendChild(pushButton);
})();

// 有时间戳

// ==UserScript==
// @name         网页笔记推送系统
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  记录网页选中的文本并直接推送到远程存储。
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // 配置 GitHub 相关信息
  const GITHUB_USERNAME = "moodHappy";
  const GITHUB_REPO = "HelloWorld";
  const GITHUB_FILE_PATH = "Notes/News.md";
  const GITHUB_TOKEN = "";

  /**
   * 获取远程文件的 SHA 值和内容
   */
  async function getFileShaAndContent() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        onload: (response) => {
          if (response.status === 200) {
            const data = JSON.parse(response.responseText);
            resolve({ sha: data.sha, content: atob(data.content) });
          } else if (response.status === 404) {
            // 文件不存在，返回空内容
            resolve({ sha: null, content: "" });
          } else {
            reject(`无法获取文件信息: ${response.responseText}`);
          }
        },
        onerror: (err) => {
          reject(`请求错误: ${err}`);
        },
      });
    });
  }

  /**
   * 更新远程文件内容
   * @param {string} newContent - 新的文件内容
   * @param {string} sha - 当前文件的 SHA 值
   */
  function updateFile(newContent, sha) {
    GM_xmlhttpRequest({
      method: "PUT",
      url: `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      data: JSON.stringify({
        message: "Update notes",
        content: btoa(newContent),
        sha: sha,
      }),
      onload: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert("笔记已成功推送到 GitHub！");
        } else {
          alert("推送失败：" + response.responseText);
        }
      },
      onerror: (err) => {
        alert("请求错误：" + err);
      },
    });
  }

  /**
   * 推送选中的文本到远程
   */
  async function pushNoteToRemote() {
    const selectedText = window.getSelection().toString().trim();
    if (!selectedText) {
      alert("未选中任何文本，无法推送！");
      return;
    }

    try {
      const { sha, content } = await getFileShaAndContent();
      const newContent = content + "\n" + `- ${new Date().toISOString()}: ${selectedText}`;
      updateFile(newContent, sha);
    } catch (err) {
      alert("推送笔记失败：" + err);
    }
  }

  /**
   * 添加一个按钮来推送选中的文本
   */
  const pushButton = document.createElement("button");
  pushButton.textContent = "推送选中文本";
  pushButton.style.position = "fixed";
  pushButton.style.bottom = "10px";
  pushButton.style.right = "10px";
  pushButton.style.zIndex = 1000;
  pushButton.style.padding = "10px";
  pushButton.style.backgroundColor = "#007bff";
  pushButton.style.color = "white";
  pushButton.style.border = "none";
  pushButton.style.borderRadius = "5px";
  pushButton.style.cursor = "pointer";

  pushButton.addEventListener("click", pushNoteToRemote);

  document.body.appendChild(pushButton);
})();