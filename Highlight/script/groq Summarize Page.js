// 按钮透明：

// ==UserScript==
// @name         groq Summarize Page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Summarize webpage content in Chinese using Groq API
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.groq.com
// ==/UserScript==

(function () {
    'use strict';

    // 插入按钮
    const button = document.createElement('button');

button.textContent = '总结';
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


    

    // 点击事件
    button.addEventListener('click', function () {
        const pageContent = document.body.innerText; // 获取页面文字内容
        const apiKey = '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'; // 替换为您的 API 密钥
        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        // 显示加载信息
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = '正在总结...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.bottom = '80px';
        loadingMessage.style.right = '20px';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.style.backgroundColor = '#000';
        loadingMessage.style.color = '#fff';
        loadingMessage.style.padding = '10px 20px';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.fontSize = '14px';
        document.body.appendChild(loadingMessage);

        // API 请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{
                    role: 'user',
                    content: `总结页面并翻译成中文，并且只输出翻译且不要中英文混用，分清段落：${pageContent}`
                }]
            }),
            onload: function (response) {
                document.body.removeChild(loadingMessage); // 移除加载信息

                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    const summary = result.choices[0]?.message?.content || '无法生成总结。';

                    // 创建总结弹出框
                    const summaryDiv = document.createElement('div');
                    summaryDiv.textContent = summary;
                    summaryDiv.style.position = 'fixed';
                    summaryDiv.style.top = '50%';
                    summaryDiv.style.left = '50%';
                    summaryDiv.style.transform = 'translate(-50%, -50%)'; // 使弹窗居中
                    summaryDiv.style.zIndex = '9999';
                    summaryDiv.style.backgroundColor = '#fff';
                    summaryDiv.style.color = '#000';
                    summaryDiv.style.padding = '20px';
                    summaryDiv.style.borderRadius = '5px';
                    summaryDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    summaryDiv.classList.add('summary-popup');
                    document.body.appendChild(summaryDiv);

                    // 添加遮罩层，用于点击关闭弹窗
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.zIndex = '9998';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    document.body.appendChild(overlay);

                    // 点击遮罩层隐藏弹窗和遮罩
                    overlay.addEventListener('click', function () {
                        document.body.removeChild(summaryDiv);
                        document.body.removeChild(overlay);
                    });
                } else {
                    alert('总结失败，状态码：' + response.status);
                }
            },
            onerror: function (error) {
                document.body.removeChild(loadingMessage); // 移除加载信息
                alert('API 请求失败：' + error.message);
            }
        });
    });

    // 添加样式：自适应屏幕宽度
    GM_addStyle(`
        .summary-popup {
            width: 600px; /* 默认宽度为600px */
            padding: 30px;
            max-width: 90%; /* 限制最大宽度为屏幕宽度的90% */
            max-height: 70%; /* 设置最大高度 */
            overflow-y: auto;
        }

        /* 自适应移动端 */
        @media (max-width: 768px) {
            .summary-popup {
                width: 90%; /* 使宽度适应屏幕 */
                padding: 20px;
            }
        }
    `);
})();

// ==UserScript==
// @name         groq Summarize Page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Summarize webpage content in Chinese using Groq API
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.groq.com
// ==/UserScript==

(function () {
    'use strict';

    // 插入按钮
    const button = document.createElement('button');
    button.textContent = '总结';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 10px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 点击事件
    button.addEventListener('click', function () {
        const pageContent = document.body.innerText; // 获取页面文字内容
        const apiKey = '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'; // 替换为您的 API 密钥
        const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

        // 显示加载信息
        const loadingMessage = document.createElement('div');
        loadingMessage.textContent = '正在总结...';
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.bottom = '80px';
        loadingMessage.style.right = '20px';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.style.backgroundColor = '#000';
        loadingMessage.style.color = '#fff';
        loadingMessage.style.padding = '10px 20px';
        loadingMessage.style.borderRadius = '5px';
        loadingMessage.style.fontSize = '14px';
        document.body.appendChild(loadingMessage);

        // API 请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{
                    role: 'user',
                    content: `用中文总结以下内容：${pageContent}`
                }]
            }),
            onload: function (response) {
                document.body.removeChild(loadingMessage); // 移除加载信息

                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    const summary = result.choices[0]?.message?.content || '无法生成总结。';

                    // 创建总结弹出框
                    const summaryDiv = document.createElement('div');
                    summaryDiv.textContent = summary;
                    summaryDiv.style.position = 'fixed';
                    summaryDiv.style.top = '50%';
                    summaryDiv.style.left = '50%';
                    summaryDiv.style.transform = 'translate(-50%, -50%)'; // 使弹窗居中
                    summaryDiv.style.zIndex = '9999';
                    summaryDiv.style.backgroundColor = '#fff';
                    summaryDiv.style.color = '#000';
                    summaryDiv.style.padding = '20px';
                    summaryDiv.style.borderRadius = '5px';
                    summaryDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                    summaryDiv.classList.add('summary-popup');
                    document.body.appendChild(summaryDiv);

                    // 添加遮罩层，用于点击关闭弹窗
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.zIndex = '9998';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    document.body.appendChild(overlay);

                    // 点击遮罩层隐藏弹窗和遮罩
                    overlay.addEventListener('click', function () {
                        document.body.removeChild(summaryDiv);
                        document.body.removeChild(overlay);
                    });
                } else {
                    alert('总结失败，状态码：' + response.status);
                }
            },
            onerror: function (error) {
                document.body.removeChild(loadingMessage); // 移除加载信息
                alert('API 请求失败：' + error.message);
            }
        });
    });

    // 添加样式：自适应屏幕宽度
    GM_addStyle(`
        .summary-popup {
            width: 600px; /* 默认宽度为600px */
            padding: 30px;
            max-width: 90%; /* 限制最大宽度为屏幕宽度的90% */
            max-height: 70%; /* 设置最大高度 */
            overflow-y: auto;
        }

        /* 自适应移动端 */
        @media (max-width: 768px) {
            .summary-popup {
                width: 90%; /* 使宽度适应屏幕 */
                padding: 20px;
            }
        }
    `);
})();