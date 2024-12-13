// 修复未知

// ==UserScript==
// @name         页面翻译工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使用API翻译页面内容，并将翻译结果插入到每段文字下面，包括标题。
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.sambanova.ai
// ==/UserScript==

(function () {
    'use strict';

    // 添加一个按钮到页面
    const button = document.createElement('button');
    button.innerText = '翻译页面';
    button.id = 'translateButton';
    document.body.appendChild(button);

    // 添加样式
    GM_addStyle(`
        #translateButton {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        #translateButton:hover {
            background-color: #0056b3;
        }
    `);

    // 点击按钮时执行翻译
    button.addEventListener('click', () => {
        // 翻译页面标题
        const title = document.title;
        translateText(title, (translatedText) => {
            const translationTitle = document.createElement('h1');
            translationTitle.style.color = 'blue'; // 设置翻译标题的样式
            translationTitle.innerText = translatedText;
            document.body.insertBefore(translationTitle, document.body.firstChild); // 插入翻译后的标题
        });

        const paragraphs = document.querySelectorAll('p'); // 获取页面中的所有段落
        paragraphs.forEach((p) => {
            const originalText = p.innerText.trim();
            if (originalText) {
                // 将每段文字拆分为多个部分以避免过长
                const textChunks = splitText(originalText, 200); // 每次最大200字符
                textChunks.forEach(chunk => {
                    translateText(chunk, (translatedText) => {
                        const translationElement = document.createElement('p');
                        translationElement.style.color = 'blue'; // 设置翻译内容的样式
                        translationElement.innerText = translatedText;
                        p.parentNode.insertBefore(translationElement, p.nextSibling); // 将翻译结果插入到原段落后面
                    });
                });
            }
        });
    });

    // 将文本按指定长度分块
    function splitText(text, maxLength) {
        const chunks = [];
        for (let i = 0; i < text.length; i += maxLength) {
            chunks.push(text.substring(i, i + maxLength));
        }
        return chunks;
    }

    // 调用API进行翻译
    function translateText(text, callback) {
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';

        const requestBody = {
            model: 'Meta-Llama-3.1-405B-Instruct',
            messages: [
                {
                    role: 'user',
                    content: `请将以下内容翻译成中文：${text}`
                }
            ]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(requestBody),
            onload: function (response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    const translatedText = responseData.choices[0].message.content.trim();
                    callback(translatedText);
                } else {
                    console.error('翻译API请求失败', response);
                    callback('翻译失败');
                }
            },
            onerror: function (error) {
                console.error('翻译API请求出错', error);
                callback('翻译失败');
            }
        });
    }
})();


// ==UserScript==
// @name         sambanova translation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用API翻译页面内容，并将翻译结果插入到每段文字下面。
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.sambanova.ai
// ==/UserScript==

(function () {
    'use strict';

    // 添加一个按钮到页面
    const button = document.createElement('button');
    button.innerText = '翻译页面';
    button.id = 'translateButton';
    document.body.appendChild(button);

    // 添加样式
    GM_addStyle(`
        #translateButton {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        #translateButton:hover {
            background-color: #0056b3;
        }
    `);

    // 点击按钮时执行翻译
    button.addEventListener('click', () => {
        const paragraphs = document.querySelectorAll('p'); // 获取页面中的所有段落
        paragraphs.forEach((p) => {
            const originalText = p.innerText.trim();
            if (originalText) {
                translateText(originalText, (translatedText) => {
                    const translationElement = document.createElement('p');
                    translationElement.style.color = 'blue'; // 设置翻译内容的样式
                    translationElement.innerText = translatedText;
                    p.parentNode.insertBefore(translationElement, p.nextSibling); // 将翻译结果插入到原段落后面
                });
            }
        });
    });

    // 调用API进行翻译
    function translateText(text, callback) {
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';

        const requestBody = {
            model: 'Meta-Llama-3.1-405B-Instruct',
            messages: [
                {
                    role: 'user',
                    content: `请将以下内容翻译成中文：${text}`
                }
            ]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(requestBody),
            onload: function (response) {
                if (response.status === 200) {
                    const responseData = JSON.parse(response.responseText);
                    const translatedText = responseData.choices[0].message.content.trim();
                    callback(translatedText);
                } else {
                    console.error('翻译API请求失败', response);
                    callback('翻译失败');
                }
            },
            onerror: function (error) {
                console.error('翻译API请求出错', error);
                callback('翻译失败');
            }
        });
    }
})();