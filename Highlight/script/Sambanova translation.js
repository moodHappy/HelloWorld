
// 优化

// ==UserScript==
// @name         Sambanova Page Translation
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  使用API翻译页面内容，通过向左滑动段落触发翻译或隐藏翻译。
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.sambanova.ai
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式，用于区分已翻译段落
    GM_addStyle(`
        .translated {
            color: blue;
            margin-top: 5px;
            font-style: italic;
        }
    `);

    // 初始化向左滑动翻译或隐藏逻辑
    const elementsToTranslate = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6'); // 获取所有段落和标题
    elementsToTranslate.forEach((element) => {
        let touchStartX = 0;
        let touchEndX = 0;

        // 触摸开始
        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        // 触摸结束
        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) { // 判断滑动距离
                const nextSibling = element.nextSibling;

                if (nextSibling && nextSibling.classList && nextSibling.classList.contains('translated')) {
                    // 如果已翻译，则隐藏翻译内容
                    nextSibling.remove();
                } else {
                    // 如果未翻译，则进行翻译
                    const originalText = element.innerText.trim();
                    if (originalText) {
                        translateText(originalText, (translatedText) => {
                            const translationElement = document.createElement('p');
                            translationElement.className = 'translated'; // 标记为已翻译
                            translationElement.innerText = translatedText;
                            element.parentNode.insertBefore(translationElement, element.nextSibling); // 插入翻译结果
                        });
                    }
                }
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
                    content: `你是一位专业翻译员，擅长英语翻译中文，不要或者，只给一种翻译，请将以下内容翻译成中文：${text}`
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

// 左滑翻译

// ==UserScript==
// @name         Sambanova Page Translation
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  使用API翻译页面内容，通过向左滑动段落触发翻译。
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.sambanova.ai
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式，用于区分已翻译段落
    GM_addStyle(`
        .translated {
            color: blue;
            margin-top: 5px;
            font-style: italic;
        }
    `);

    // 初始化向左滑动翻译逻辑
    const elementsToTranslate = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6'); // 获取所有段落和标题
    elementsToTranslate.forEach((element) => {
        let touchStartX = 0;
        let touchEndX = 0;

        // 触摸开始
        element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        // 触摸结束
        element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) { // 判断滑动距离
                const originalText = element.innerText.trim();
                if (originalText && !element.classList.contains('translated')) {
                    translateText(originalText, (translatedText) => {
                        const translationElement = document.createElement('p');
                        translationElement.className = 'translated'; // 标记为已翻译
                        translationElement.innerText = translatedText;
                        element.parentNode.insertBefore(translationElement, element.nextSibling); // 将翻译结果插入到原内容后面
                    });
                }
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

// 修复未知

// ==UserScript==
// @name         sambanova translation
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