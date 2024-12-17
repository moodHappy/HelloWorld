// API额度显示

// ==UserScript==
// @name         DeepL页面翻译
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  翻译页面中的英文段落和标题，并将中文翻译放置在下方，显示DeepL API剩余额度
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api-free.deepl.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const DEEPL_API_KEY = "057f39ee-7acb-45e6-9530-dc90882c7f1e:fx";
    const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
    const DEEPL_USAGE_URL = "https://api-free.deepl.com/v2/usage"; // DeepL API 额度查询 URL
    const RETRY_DELAY = [1000, 3000, 5000]; // 重试延迟时间
    const REQUEST_DELAY = 500; // 请求间隔
    let lastRequestTime = 0;

    function getElementsToTranslate() {
      return document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const elements = node.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
                    elements.forEach(element => {
                        translateElement(element);
                    })
                      if (["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName?.toLowerCase())){
                          translateElement(node)
                      }
                  }
                });
              }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    function translateElement(element) {
        const text = element.textContent.trim();
        if (text) {
            // 调用 DeepL API 翻译
            translateText(text).then((translatedText) => {
                // 在元素下方插入翻译内容
                const translationElement = document.createElement("div");
                translationElement.style.color = "green"; // 设置翻译文字颜色
                translationElement.style.fontSize = "18px"; // 将字号设置为14px
                translationElement.style.lineHeight = "1.4"; // 设置行距
                translationElement.style.marginTop = "10px";
                translationElement.textContent = translatedText;

                setTimeout(() => {
                  if (element.parentNode){
                    element.parentNode.insertBefore(translationElement, element.nextSibling);
                  }
                }, 100); // 延迟 DOM 操作
            }).catch((error) => {
                console.error("翻译失败:", error);
            });
        }
    }

      function displayUsage(usage) {
        const usageDiv = document.getElementById("deepl-usage-info");
        if (usageDiv) {
          usageDiv.textContent = `DeepL 额度: ${usage.character_limit - usage.character_count} / ${usage.character_limit} 字符`;
          usageDiv.style.position = "fixed";
          usageDiv.style.top = "10px";
          usageDiv.style.left = "10px";
          usageDiv.style.zIndex = 9999;
          usageDiv.style.backgroundColor = 'white';
          usageDiv.style.padding = '5px';
          usageDiv.style.border = '1px solid #ccc';
        } else {
          const newUsageDiv = document.createElement("div");
          newUsageDiv.id = "deepl-usage-info";
          newUsageDiv.style.position = "fixed";
          newUsageDiv.style.top = "10px";
          newUsageDiv.style.left = "10px";
          newUsageDiv.style.zIndex = 9999;
          newUsageDiv.style.backgroundColor = 'white';
          newUsageDiv.style.padding = '5px';
          newUsageDiv.style.border = '1px solid #ccc';
          newUsageDiv.textContent = `DeepL 额度: ${usage.character_limit - usage.character_count} / ${usage.character_limit} 字符`;
          document.body.appendChild(newUsageDiv);
        }

      }

    function fetchUsage() {
        GM_xmlhttpRequest({
            method: "POST",
            url: DEEPL_USAGE_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `auth_key=${DEEPL_API_KEY}`,
            onload: function(response) {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    displayUsage(result);
                } else {
                  console.error("DeepL API 额度请求失败", response);
                }
            },
            onerror: function(error) {
                console.error("DeepL API 额度请求出错:", error);
            }
        });
    }


    // 调用 DeepL API 翻译文本
    function translateText(text, retryCount = 0) {
        return new Promise((resolve, reject) => {
          const currentTime = Date.now();
          const delay = Math.max(0, lastRequestTime + REQUEST_DELAY - currentTime);

          setTimeout(() => {
            lastRequestTime = Date.now();

             GM_xmlhttpRequest({
              method: "POST",
              url: DEEPL_API_URL,
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
              },
                data: `auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(text)}&target_lang=ZH`,
              onload: function(response) {
                  if (response.status === 200) {
                      const result = JSON.parse(response.responseText);
                      resolve(result.translations[0].text);
                  } else {
                    console.error("DeepL API 请求失败", response);
                    if (retryCount < RETRY_DELAY.length) {
                      console.log(`重试第 ${retryCount + 1} 次, 延迟 ${RETRY_DELAY[retryCount]} ms`);
                      setTimeout(() => {
                        translateText(text, retryCount + 1)
                          .then(resolve)
                          .catch(reject);
                      }, RETRY_DELAY[retryCount])
                  } else {
                    reject("翻译失败");
                  }

                }
              },
              onerror: function(error) {
                console.error("DeepL API 请求出错:", error);
                 if (retryCount < RETRY_DELAY.length) {
                      console.log(`重试第 ${retryCount + 1} 次, 延迟 ${RETRY_DELAY[retryCount]} ms`);
                      setTimeout(() => {
                         translateText(text, retryCount + 1)
                          .then(resolve)
                          .catch(reject);
                      }, RETRY_DELAY[retryCount]);
                    } else {
                         reject("翻译失败");
                    }
              }
            });
          }, delay)

        });
    }

      function init() {
        fetchUsage();
        const elementsToTranslate = getElementsToTranslate();
        elementsToTranslate.forEach(element => translateElement(element));
        observeDOMChanges();
      }


    if (document.readyState === "complete" || document.readyState === "interactive") {
      init()
    } else {
        window.addEventListener("load", init);
    }



})();

// 优化显示

// ==UserScript==
// @name         DeepL页面翻译
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  翻译页面中的英文段落和标题，并将中文翻译放置在下方
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api-free.deepl.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const DEEPL_API_KEY = "057f39ee-7acb-45e6-9530-dc90882c7f1e:fx";
    const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
    const RETRY_DELAY = [1000, 3000, 5000]; // 重试延迟时间
    const REQUEST_DELAY = 500; // 请求间隔
    let lastRequestTime = 0;

    function getElementsToTranslate() {
      return document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes) {
                mutation.addedNodes.forEach((node) => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const elements = node.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
                    elements.forEach(element => {
                        translateElement(element);
                    })
                      if (["p", "h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName?.toLowerCase())){
                          translateElement(node)
                      }
                  }
                });
              }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    function translateElement(element) {
        const text = element.textContent.trim();
        if (text) {
            // 调用 DeepL API 翻译
            translateText(text).then((translatedText) => {
                // 在元素下方插入翻译内容
                const translationElement = document.createElement("div");
                translationElement.style.color = "green"; // 设置翻译文字颜色
                translationElement.style.fontSize = "18px"; // 将字号设置为14px
                translationElement.style.lineHeight = "1.4"; // 设置行距
                translationElement.style.marginTop = "10px";
                translationElement.textContent = translatedText;

                setTimeout(() => {
                  if (element.parentNode){
                    element.parentNode.insertBefore(translationElement, element.nextSibling);
                  }
                }, 100); // 延迟 DOM 操作
            }).catch((error) => {
                console.error("翻译失败:", error);
            });
        }
    }



    // 调用 DeepL API 翻译文本
    function translateText(text, retryCount = 0) {
        return new Promise((resolve, reject) => {
          const currentTime = Date.now();
          const delay = Math.max(0, lastRequestTime + REQUEST_DELAY - currentTime);

          setTimeout(() => {
            lastRequestTime = Date.now();

             GM_xmlhttpRequest({
              method: "POST",
              url: DEEPL_API_URL,
              headers: {
                  "Content-Type": "application/x-www-form-urlencoded"
              },
                data: `auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(text)}&target_lang=ZH`,
              onload: function(response) {
                  if (response.status === 200) {
                      const result = JSON.parse(response.responseText);
                      resolve(result.translations[0].text);
                  } else {
                    console.error("DeepL API 请求失败", response);
                    if (retryCount < RETRY_DELAY.length) {
                      console.log(`重试第 ${retryCount + 1} 次, 延迟 ${RETRY_DELAY[retryCount]} ms`);
                      setTimeout(() => {
                        translateText(text, retryCount + 1)
                          .then(resolve)
                          .catch(reject);
                      }, RETRY_DELAY[retryCount])
                  } else {
                    reject("翻译失败");
                  }

                }
              },
              onerror: function(error) {
                console.error("DeepL API 请求出错:", error);
                 if (retryCount < RETRY_DELAY.length) {
                      console.log(`重试第 ${retryCount + 1} 次, 延迟 ${RETRY_DELAY[retryCount]} ms`);
                      setTimeout(() => {
                         translateText(text, retryCount + 1)
                          .then(resolve)
                          .catch(reject);
                      }, RETRY_DELAY[retryCount]);
                    } else {
                         reject("翻译失败");
                    }
              }
            });
          }, delay)

        });
    }

      function init() {
        const elementsToTranslate = getElementsToTranslate();
        elementsToTranslate.forEach(element => translateElement(element));
        observeDOMChanges();
      }


    if (document.readyState === "complete" || document.readyState === "interactive") {
      init()
    } else {
        window.addEventListener("load", init);
    }



})();

// ==UserScript==
// @name         DeepL页面翻译
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  翻译页面中的英文段落和标题，并将中文翻译放置在下方
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api-free.deepl.com
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const DEEPL_API_KEY = "057f39ee-7acb-45e6-9530-dc90882c7f1e:fx";
    const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

    // 选择页面中的段落和标题标签
    const elementsToTranslate = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

    elementsToTranslate.forEach((element) => {
        const text = element.textContent.trim();
        if (text) {
            // 调用 DeepL API 翻译
            translateText(text).then((translatedText) => {
                // 在元素下方插入翻译内容
                const translationElement = document.createElement("div");
                translationElement.style.color = "green"; // 设置翻译文字颜色
translationElement.style.fontSize = "18px"; // 将字号设置为14px
translationElement.style.lineHeight = "1.4"; // 设置行距
                translationElement.style.marginTop = "10px";
                translationElement.textContent = translatedText;

                element.parentNode.insertBefore(translationElement, element.nextSibling);
            });
        }
    });

    // 调用 DeepL API 翻译文本
    function translateText(text) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: DEEPL_API_URL,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `auth_key=${DEEPL_API_KEY}&text=${encodeURIComponent(text)}&target_lang=ZH`,
                onload: function(response) {
                    if (response.status === 200) {
                        const result = JSON.parse(response.responseText);
                        resolve(result.translations[0].text);
                    } else {
                        console.error("DeepL API 请求失败", response);
                        reject("翻译失败");
                    }
                },
                onerror: function(error) {
                    console.error("DeepL API 请求出错", error);
                    reject("翻译失败");
                }
            });
        });
    }
})();