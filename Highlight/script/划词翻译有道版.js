// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  单击页面单词，详细中文释义，适配移动端。
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517649/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/517649/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.style.position = 'absolute';
    popup.style.backgroundColor = '#f0f0f0'; // 浅灰色背景
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '8px';
    popup.style.padding = '15px';
    popup.style.fontSize = '16px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9999';
    popup.style.display = 'none';
    popup.style.width = '90%';
    popup.style.maxWidth = '600px';
    popup.style.wordWrap = 'break-word';
    popup.style.lineHeight = '1.5';
    popup.style.whiteSpace = 'normal';
    popup.style.wordBreak = 'break-word';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    document.body.appendChild(popup);

    // 隐藏弹窗
    function hidePopup() {
        popup.style.display = 'none';
    }

    // 显示弹窗
    function showPopup(word, content, x, y) {
        popup.innerHTML = `
            <div><strong>单词：</strong> ${word}</div>
            <div><strong>释义：</strong></div>
            <ul>${content.meanings.map(meaning => `<li>${meaning}</li>`).join('')}</ul>
        `;
        popup.style.top = `${y + 10}px`; // 弹窗稍微下移
        popup.style.display = 'block';
    }

    // 获取翻译和其他数据（使用Fanyi API）
    function fetchTranslation(word) {
        const apiURL = `https://fanyi.baidu.com/sug`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiURL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `kw=${encodeURIComponent(word)}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data && data.data.length > 0) {
                            const result = data.data[0];
                            const meanings = [result.v];

                            resolve({
                                meanings
                            });
                        } else {
                            reject(new Error('翻译结果为空'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function () {
                    reject(new Error('查询失败'));
                }
            });
        });
    }

    // 自动发音
    function playAudio(word) {
        const audio = new Audio(`https://dict.youdao.com/dictvoice?type=0&audio=${encodeURIComponent(word)}`);
        audio.play();
    }

    // 提取点击位置的单词
    function getWordAtPoint(x, y) {
        const range = document.caretRangeFromPoint(x, y);
        if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
            const textNode = range.startContainer;
            const offset = range.startOffset;
            const text = textNode.nodeValue;

            // 正则匹配完整单词（包括中英文混合）
            const before = text.substring(0, offset).match(/[\w\u4e00-\u9fa5]+$/);
            const after = text.substring(offset).match(/^[\w\u4e00-\u9fa5]+/);

            return (before ? before[0] : '') + (after ? after[0] : '');
        }
        return null;
    }

    // 单词点击事件
    document.addEventListener('click', (event) => {
        const word = getWordAtPoint(event.clientX, event.clientY);
        if (word) {
            const x = event.pageX;
            const y = event.pageY;

            showPopup(word, { meanings: ['加载中...'] }, x, y);

            fetchTranslation(word).then(content => {
                showPopup(word, content, x, y);
                playAudio(word);
            }).catch(() => {
                showPopup(word, { meanings: ['查询失败'] }, x, y);
            });
        } else {
            hidePopup();
        }
    });

    // 点击空白区域隐藏弹窗
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target)) {
            hidePopup();
        }
    });
})();