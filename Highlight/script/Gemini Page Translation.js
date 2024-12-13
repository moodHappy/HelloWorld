// ==UserScript==
// @name         Gemini Page Translation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Translate webpage content including headings using Google Gemini API
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = 'AIzaSyAoIj7gdg2Ky5NZ18WR_5bhD-ayh-b-aQM';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // 创建一个浮动按钮
    const button = document.createElement('button');
    button.textContent = '翻译';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'transparent'; // 背景透明
    button.style.color = '#007bff'; // 蓝色字体
    button.style.border = '2px solid #007bff'; // 蓝色边框
    button.style.padding = '10px 10px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = 'bold'; // 字体加粗（可选）

    document.body.appendChild(button);

    button.onclick = async function () {
        try {
            // 获取页面的段落和标题内容
            const elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6'));
            if (elements.length === 0) {
                alert('未找到可翻译的内容');
                return;
            }

            // 显示加载状态
            button.disabled = true;
            button.textContent = '正在翻译...';

            for (const element of elements) {
                // 如果元素已经有翻译，跳过
                if (element.nextElementSibling && element.nextElementSibling.classList.contains('translation')) {
                    continue;
                }

                const textContent = element.innerText.trim();
                if (textContent.length === 0) continue; // 跳过空内容

                // 准备API请求数据
                const prompt = `Translate the following English text to Chinese:\n\n${textContent}`;
                const requestData = {
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                };

                // 发送API请求
                const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestData),
                });

                const data = await response.json();

                // 获取翻译结果
                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    const translation = data.candidates[0].content.parts[0].text;

                    // 创建一个元素显示翻译
                    const translationDiv = document.createElement('div');
                    translationDiv.classList.add('translation');
                    translationDiv.style.color = 'green';
                    translationDiv.style.marginTop = '10px';
                    translationDiv.style.fontSize = '18px';
                    translationDiv.textContent = translation;

                    // 插入到元素后
                    element.insertAdjacentElement('afterend', translationDiv);
                } else {
                    console.error('翻译失败', data);
                }
            }

            button.disabled = false;
            button.textContent = '翻译页面';
        } catch (error) {
            console.error('发生错误：', error);
            button.disabled = false;
            button.textContent = '翻译页面';
        }
    };
})();