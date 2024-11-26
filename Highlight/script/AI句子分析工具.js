// 免费API

// ==UserScript==
// @name         AI句子分析工具-Free
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  选中文本并进行主谓宾、短语结构、关键词、句型分析
// @author       您的名字
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮到页面右下角
    const button = document.createElement('button');
    button.id = 'analyzeButton';
    button.innerText = '分析句子';
    document.body.appendChild(button);

    // 添加按钮样式
    GM_addStyle(`
        #analyzeButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        }
        #analyzeButton:hover {
            background-color: #0056b3;
        }
    `);

    // 按钮点击事件
    button.addEventListener('click', () => {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) {
            alert('请先选中文本！');
            return;
        }

        const apiKey = 'sk-Gf0QKD1zMOrlwXbhNCWzd7d2gHONxDWfUNTKfmpDSsIGO9Mh';
        const apiURL = 'https://api.chatanywhere.org/v1/chat/completions';

        // 构建请求体
        const requestData = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `请对以下句子进行详细分析：
句子: ${selectedText}
要求：
1. 识别主语、谓语、宾语。
2. 提取短语类型及成分（如名词短语、动词短语）。
3. 列出关键词及其意义。
4. 确定句型结构（如主谓宾、主系表等）。
5. 提供简要的语法讲解。
用结构化方式返回结果。`
                }
            ],
            max_tokens: 800
        };

        // 发起请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(requestData),
            onload: (response) => {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const analysis = data.choices[0]?.message?.content || '未返回结果';
                    showResult(analysis);
                } else {
                    alert(`请求失败: ${response.status}`);
                }
            },
            onerror: () => {
                alert('网络请求出错，请检查网络连接！');
            }
        });
    });

    // 显示结果
    function showResult(analysis) {
        // 创建结果窗口
        const resultDiv = document.createElement('div');
        resultDiv.id = 'analysisResult';
        resultDiv.innerHTML = `
            <div id="resultHeader">
                <h3>句子分析结果</h3>
                <button id="closeResult">关闭</button>
            </div>
            <div id="resultContent">${analysis.replace(/\n/g, '<br>')}</div>
        `;
        document.body.appendChild(resultDiv);

        // 样式
        GM_addStyle(`
            #analysisResult {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 10000;
            }
            #resultHeader {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #007bff;
                color: white;
                padding: 10px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }
            #resultHeader h3 {
                margin: 0;
                font-size: 16px;
            }
            #closeResult {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
            }
            #resultContent {
                padding: 10px;
                font-size: 14px;
                line-height: 1.5;
            }
        `);

        // 关闭按钮事件
        document.getElementById('closeResult').addEventListener('click', () => {
            resultDiv.remove();
        });
    }
})();

// ==UserScript==
// @name         AI句子分析工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  选中文本并进行主谓宾、短语结构、关键词、句型分析
// @author       您的名字
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮到页面右下角
    const button = document.createElement('button');
    button.id = 'analyzeButton';
    button.innerText = '分析句子';
    document.body.appendChild(button);

    // 添加按钮样式
    GM_addStyle(`
        #analyzeButton {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        }
        #analyzeButton:hover {
            background-color: #0056b3;
        }
    `);

    // 按钮点击事件
    button.addEventListener('click', () => {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) {
            alert('请先选中文本！');
            return;
        }

        const apiKey = 'sb-c34f78c5f72dd54e1323d235b5b1a0fe4a14cca788191c24';
        const apiURL = 'https://api.openai-sb.com/v1/chat/completions';

        // 构建请求体
        const requestData = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `请对以下句子进行详细分析：
句子: ${selectedText}
要求：
1. 识别主语、谓语、宾语。
2. 提取短语类型及成分（如名词短语、动词短语）。
3. 列出关键词及其意义。
4. 确定句型结构（如主谓宾、主系表等）。
5. 提供简要的语法讲解。
用结构化方式返回结果。`
                }
            ],
            max_tokens: 800
        };

        // 发起请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(requestData),
            onload: (response) => {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const analysis = data.choices[0]?.message?.content || '未返回结果';
                    showResult(analysis);
                } else {
                    alert(`请求失败: ${response.status}`);
                }
            },
            onerror: () => {
                alert('网络请求出错，请检查网络连接！');
            }
        });
    });

    // 显示结果
    function showResult(analysis) {
        // 创建结果窗口
        const resultDiv = document.createElement('div');
        resultDiv.id = 'analysisResult';
        resultDiv.innerHTML = `
            <div id="resultHeader">
                <h3>句子分析结果</h3>
                <button id="closeResult">关闭</button>
            </div>
            <div id="resultContent">${analysis.replace(/\n/g, '<br>')}</div>
        `;
        document.body.appendChild(resultDiv);

        // 样式
        GM_addStyle(`
            #analysisResult {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 10000;
            }
            #resultHeader {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #007bff;
                color: white;
                padding: 10px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }
            #resultHeader h3 {
                margin: 0;
                font-size: 16px;
            }
            #closeResult {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
            }
            #resultContent {
                padding: 10px;
                font-size: 14px;
                line-height: 1.5;
            }
        `);

        // 关闭按钮事件
        document.getElementById('closeResult').addEventListener('click', () => {
            resultDiv.remove();
        });
    }
})();