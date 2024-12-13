// ==UserScript==
// @name         Gemini Summarizer Page
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Summarize current webpage using Google Gemini API
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'AIzaSyAoIj7gdg2Ky5NZ18WR_5bhD-ayh-b-aQM';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    // 创建一个浮动按钮
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

    // 创建弹窗背景
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10000;
    `;

    // 创建结果显示框
    const resultDiv = document.createElement('div');
    resultDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-height: 80vh;
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        z-index: 10001;
        overflow-y: auto;
        line-height: 1.8; /* 设置行距 */
    `;

    overlay.appendChild(resultDiv);
    document.body.appendChild(button);
    document.body.appendChild(overlay);

    // 点击弹窗外关闭弹窗
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    };

    button.onclick = async function() {
        try {
            // 获取页面主要内容
            const mainContent = document.body.innerText.substring(0, 5000); // 限制内容长度
            
            // 准备提示词
            const prompt = `请用中文总结以下网页的主要内容：\n\n${mainContent}`;

            // 准备API请求数据
            const requestData = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            };

            // 显示加载提示
            resultDiv.innerHTML = '正在生成摘要...';
            overlay.style.display = 'block';

            // 发送API请求
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                resultDiv.innerHTML = `<h3>页面摘要：</h3><p>${data.candidates[0].content.parts[0].text}</p>`;
            } else {
                resultDiv.innerHTML = '无法生成摘要，请稍后重试。';
            }

        } catch (error) {
            resultDiv.innerHTML = `发生错误：${error.message}`;
        }
    };
})();