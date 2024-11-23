// 滚动隐藏按钮

// ==UserScript==
// @name         热门新闻抓取系统 (滚动隐藏按钮，带翻译)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  点击按钮获取当天最热门新闻，并显示中文翻译。按钮在滚动时隐藏。
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// ==/UserScript==

(function () {
  "use strict";

  // 配置 NewsAPI 相关信息
  const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
  const API_KEY = "dac6abc0634b4de08429b2580628dba8"; // 你的 NewsAPI 密钥
  const COUNTRY = "us"; // 新闻国家代码，例如 "us" 表示美国

  /**
   * 从 NewsAPI 获取当天最热门新闻
   */
  function fetchTopNews() {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${NEWS_API_URL}?country=${COUNTRY}&apiKey=${API_KEY}`,
      onload: (response) => {
        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
          } else {
            alert("未找到热门新闻！");
          }
        } else {
          alert("新闻抓取失败：" + response.responseText);
        }
      },
      onerror: (err) => {
        alert("请求错误：" + err);
      },
    });
  }

  /**
   * 使用Google Translate API翻译新闻标题
   */
  function translateText(text, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
      onload: function (response) {
        try {
          const result = JSON.parse(response.responseText);
          const translatedText = result[0][0][0]; // 获取翻译结果
          callback(translatedText);
        } catch (e) {
          callback("翻译失败");
        }
      },
      onerror: function () {
        callback("翻译失败");
      }
    });
  }

  /**
   * 显示新闻列表，并翻译每个标题
   */
  function displayNews(articles) {
    let newsContent = "当天最热门新闻：\n\n";
    articles.slice(0, 5).forEach((article, index) => {
      const title = article.title;
      translateText(title, function (translatedTitle) {
        newsContent += `${index + 1}. ${title}\n（翻译：${translatedTitle}）\n${article.url}\n\n`;
        // 每获取到翻译结果就显示新闻内容
        if (index === articles.length - 1 || index === 4) {
          const userChoice = confirm(newsContent + "点击确定以阅读第一条新闻。");
          if (userChoice && articles[0].url) {
            GM_openInTab(articles[0].url, { active: true });
          }
        }
      });
    });
  }

  /**
   * 创建按钮并使其在滚动时隐藏
   */
  function createTransparentButton() {
    const fetchButton = document.createElement("button");
    fetchButton.textContent = "获取热门新闻";
    fetchButton.style.position = "fixed";
    fetchButton.style.top = "10px"; // 显示在右上角
    fetchButton.style.right = "10px";
    fetchButton.style.zIndex = "9999"; // 高优先级，避免被覆盖
    fetchButton.style.padding = "10px 15px";
    fetchButton.style.backgroundColor = "transparent"; // 背景透明
    fetchButton.style.border = "2px solid #28a745"; // 边框颜色
    fetchButton.style.color = "#28a745"; // 字体颜色
    fetchButton.style.borderRadius = "5px";
    fetchButton.style.cursor = "pointer";
    fetchButton.style.fontWeight = "bold"; // 字体加粗
    fetchButton.style.boxShadow = "0 4px 8px rgba(40, 167, 69, 0.2)"; // 添加阴影效果
    fetchButton.style.transition = "opacity 0.5s"; // 淡入淡出效果
    fetchButton.addEventListener("click", fetchTopNews);
    document.body.appendChild(fetchButton);

    // 添加滚动事件监听器，控制按钮隐藏/显示
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        // 向下滚动时隐藏按钮
        fetchButton.style.opacity = "0";
        fetchButton.style.pointerEvents = "none"; // 禁用点击
      } else {
        // 向上滚动时显示按钮
        fetchButton.style.opacity = "1";
        fetchButton.style.pointerEvents = "auto"; // 恢复点击
      }
      lastScrollY = currentScrollY;
    });
  }

  // 创建透明按钮
  createTransparentButton();
})();

// ==UserScript==
// @name         热门新闻抓取系统 (移动端右上角按钮，中文翻译)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击按钮获取当天最热门新闻，并显示中文翻译
// @author       moodHappy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// ==/UserScript==

(function () {
  "use strict";

  // 配置 NewsAPI 相关信息
  const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
  const API_KEY = "dac6abc0634b4de08429b2580628dba8"; // 你的 NewsAPI 密钥
  const COUNTRY = "us"; // 新闻国家代码，例如 "us" 表示美国

  /**
   * 从 NewsAPI 获取当天最热门新闻
   */
  function fetchTopNews() {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${NEWS_API_URL}?country=${COUNTRY}&apiKey=${API_KEY}`,
      onload: (response) => {
        if (response.status === 200) {
          const data = JSON.parse(response.responseText);
          if (data.articles && data.articles.length > 0) {
            displayNews(data.articles);
          } else {
            alert("未找到热门新闻！");
          }
        } else {
          alert("新闻抓取失败：" + response.responseText);
        }
      },
      onerror: (err) => {
        alert("请求错误：" + err);
      },
    });
  }

  /**
   * 使用Google Translate API翻译新闻标题
   */
  function translateText(text, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
      onload: function (response) {
        try {
          const result = JSON.parse(response.responseText);
          const translatedText = result[0][0][0]; // 获取翻译结果
          callback(translatedText);
        } catch (e) {
          callback("翻译失败");
        }
      },
      onerror: function () {
        callback("翻译失败");
      }
    });
  }

  /**
   * 显示新闻列表，并翻译每个标题
   */
  function displayNews(articles) {
    let newsContent = "当天最热门新闻：\n\n";
    articles.slice(0, 5).forEach((article, index) => {
      const title = article.title;
      translateText(title, function (translatedTitle) {
        newsContent += `${index + 1}. ${title}\n（翻译：${translatedTitle}）\n${article.url}\n\n`;
        // 每获取到翻译结果就显示新闻内容
        if (index === articles.length - 1 || index === 4) {
          const userChoice = confirm(newsContent + "点击确定以阅读第一条新闻。");
          if (userChoice && articles[0].url) {
            GM_openInTab(articles[0].url, { active: true });
          }
        }
      });
    });
  }

  /**
   * 创建按钮并使其在移动端显示于右上角
   */
  function createTransparentButton() {
    const fetchButton = document.createElement("button");
    fetchButton.textContent = "获取热门新闻";
    fetchButton.style.position = "fixed";
    fetchButton.style.top = "10px"; // 显示在右上角
    fetchButton.style.right = "10px";
    fetchButton.style.zIndex = "9999"; // 高优先级，避免被覆盖
    fetchButton.style.padding = "10px 15px";
    fetchButton.style.backgroundColor = "transparent"; // 背景透明
    fetchButton.style.border = "2px solid #28a745"; // 边框颜色
    fetchButton.style.color = "#28a745"; // 字体颜色
    fetchButton.style.borderRadius = "5px";
    fetchButton.style.cursor = "pointer";
    fetchButton.style.fontWeight = "bold"; // 字体加粗
    fetchButton.style.boxShadow = "0 4px 8px rgba(40, 167, 69, 0.2)"; // 添加阴影效果
    fetchButton.addEventListener("click", fetchTopNews);
    document.body.appendChild(fetchButton);
  }

  // 创建透明按钮
  createTransparentButton();
})();