

// 配置项：
// 用户名：moodHappy
// 仓库名：HelloWorld
// 目标文件的完整路径：Highlight/script/Remove highlight/3.txt
// 个人访问令牌：your-token-here


// 新增提示已存在，避免重复添加

// ==UserScript==
// @name         推送已掌握单词到GitHub
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  长按选中的文本，确认后追加到 GitHub 文件中，但避免重复添加。
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // 配置 GitHub 信息
  const GITHUB_USERNAME = "moodHappy";
  const GITHUB_REPO = "HelloWorld";
  const GITHUB_FILE_PATH = "Highlight/script/Remove highlight/3.txt";
  const GITHUB_TOKEN = "";

  // 记录上次取消的时间戳
  let lastCancelTime = 0;
  const CANCEL_INTERVAL = 60 * 1000; // 1分钟，单位为毫秒

  /**
   * 获取文件的 SHA 值和当前内容
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
   * 更新文件内容
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
        message: "Append selected content",
        content: btoa(newContent),
        sha: sha,
      }),
      onload: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert("内容已成功推送到 GitHub 文件中！");
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
   * 触发长按事件处理函数
   */
  document.addEventListener("selectionchange", async () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const now = Date.now();

      // 检查是否在取消的冷却时间内
      if (now - lastCancelTime < CANCEL_INTERVAL) {
        console.log("冷却时间内，取消弹窗操作。");
        return;
      }

      setTimeout(() => {
        const confirmPush = confirm(`是否将以下内容推送到 GitHub？\n\n"${selectedText}"`);
        if (confirmPush) {
          getFileShaAndContent()
            .then(({ sha, content }) => {
              const existingWords = content.split("\n").map((word) => word.trim());
              if (existingWords.includes(selectedText)) {
                alert("该单词已存在！");
              } else {
                const newContent = content + `\n${selectedText}`;
                updateFile(newContent, sha);
              }
            })
            .catch((err) => alert("操作失败：" + err));
        } else {
          // 记录取消操作的时间
          lastCancelTime = Date.now();
        }
      }, 300); // 避免频繁触发
    }
  });
})();

// ==UserScript==
// @name         推送已掌握单词到GitHub
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  长按选中的文本，确认后追加到 GitHub 文件中
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  // 配置 GitHub 个人信息
  const GITHUB_USERNAME = "moodHappy";
  const GITHUB_REPO = "HelloWorld";
  const GITHUB_FILE_PATH = "Highlight/script/Remove highlight/3.txt";
  const GITHUB_TOKEN = "";

  /**
   * 获取文件的 SHA 值和当前内容
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
   * 更新文件内容
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
        message: "Append selected content",
        content: btoa(newContent),
        sha: sha,
      }),
      onload: (response) => {
        if (response.status === 200 || response.status === 201) {
          alert("内容已成功推送到 GitHub 文件中！");
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
   * 触发长按事件处理函数
   */
  document.addEventListener("selectionchange", async () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      setTimeout(() => {
        const confirmPush = confirm(`是否将以下内容推送到 GitHub？\n\n"${selectedText}"`);
        if (confirmPush) {
          getFileShaAndContent()
            .then(({ sha, content }) => {
              const newContent = content + `\n${selectedText}`;
              updateFile(newContent, sha);
            })
            .catch((err) => alert("操作失败：" + err));
        }
      }, 300); // 避免频繁触发
    }
  });
})();