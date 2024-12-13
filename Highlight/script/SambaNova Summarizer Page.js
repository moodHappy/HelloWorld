// ==UserScript==
// @name         SambaNova Summarizer Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  使用 SambaNova API 总结页面内容
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 添加按钮到页面
    const button = document.createElement('button');
    button.id = 'summarizeButton';
    button.innerText = '总结';
    document.body.appendChild(button);

    // 添加样式
    GM_addStyle(`
        #summarizeButton {
            position: fixed;
            bottom: 220px;
            right: 10px;
            z-index: 9999;
            padding: 10px 10px;
            font-size: 14px;
            background-color: transparent;  /* 背景透明 */
            color: #007bff;  /* 蓝色字体 */
            border: 2px solid #007bff;  /* 蓝色边框 */
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;  /* 字体加粗 */
            transition: opacity 0.3s ease; /* 平滑过渡 */
        }
        #summarizeButton.hidden {
            opacity: 0;  /* 隐藏按钮 */
        }
        #summarizeButton:hover {
            background-color: #0056b3; /* 悬浮背景色 */
        }
    `);

    let lastScrollY = window.scrollY; // 上次的滚动位置
    let isButtonHidden = false; // 按钮是否隐藏

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && !isButtonHidden) {
            // 向下滚动，隐藏按钮
            button.classList.add('hidden');
            isButtonHidden = true;
        } else if (window.scrollY < lastScrollY && isButtonHidden) {
            // 向上滚动，显示按钮
            button.classList.remove('hidden');
            isButtonHidden = false;
        }
        lastScrollY = window.scrollY; // 更新上次滚动位置
    });

    // 点击按钮时的处理逻辑
    button.addEventListener('click', () => {
        const content = document.body.innerText; // 获取页面主要文本内容
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6'; // 替换为你的 SambaNova API 密钥
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions'; // 使用提供的API URL

        // 提示用户加载中
        button.innerText = '总结中...';
        button.disabled = true;

        // 发送请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'Meta-Llama-3.1-405B-Instruct',  // 使用你提供的 Meta-Llama-3.1-8B-Instruct 模型
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    alert('总结结果：\n' + result.choices[0].message.content);
                } else {
                    alert('请求失败，请稍后再试！');
                }
                button.innerText = '总结';
                button.disabled = false;
            },
            onerror: () => {
                alert('网络错误，请检查网络连接！');
                button.innerText = '总结内容';
                button.disabled = false;
            }
        });
    });
})();