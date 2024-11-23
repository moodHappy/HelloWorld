

//有时间戳

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