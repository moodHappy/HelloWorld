## 初版

// ==UserScript==
// @name         单词高亮 + AI 解释（双AI） 
// @namespace    http://your.website.com/
// @version      1.0
// @description  高亮页面指定单词并点击查询 AI 解释（主备AI），使用显眼的红色下划线
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const wordsToHighlight = new Set(["blasting", "trump"]);
    const highlightClass = 'tm-highlight-word';

    const primaryAI = {
        url: 'https://free.v36.cm/v1/chat/completions',
        apiKey: 'sk-7NEyEPLHDfmprWdPEb3036Ec568b40Ab9b444eD37fAeE436',
        model: 'gpt-3.5-turbo'
    };

    const backupAI = {
        url: 'https://api.sambanova.ai/v1/chat/completions',
        apiKey: '1fbf3ed7-a429-4938-89b1-06a99a654ab6',
        model: 'Meta-Llama-3.1-405B-Instruct'
    };

    GM_addStyle(`
        .${highlightClass} {
            /* Modified: Changed to a thicker solid red underline */
            text-decoration: underline solid red !important;
            text-decoration-thickness: 2px !important; /* Adjust thickness as needed */
            cursor: pointer;
            color: inherit; /* Keep original text color */
        }
        .${highlightClass}:hover {
            /* Optional: Change color on hover if desired, keeping it red for consistency */
            text-decoration-color: darkred !important;
        }
        #ai-result-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.6); display: none;
            justify-content: center; align-items: center; z-index: 10001;
        }
        #ai-result-content {
            background: white; padding: 20px; border-radius: 8px;
            max-width: 90%; max-height: 90%; overflow-y: auto; position: relative;
            color: #333;
        }
        #ai-close-btn {
            position: absolute; top: 10px; right: 15px; font-size: 22px; cursor: pointer;
        }
        .loader {
            border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%;
            width: 30px; height: 30px; animation: spin 1s linear infinite; margin: auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `);

    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'ai-result-modal';
        modal.innerHTML = `
            <div id="ai-result-content">
                <span id="ai-close-btn">&times;</span>
                <div id="ai-body"><div class="loader"></div><p style="text-align:center">AI 正在思考中...</p></div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('ai-close-btn').onclick = () => modal.style.display = 'none';
        modal.onclick = () => modal.style.display = 'none';
        document.getElementById('ai-result-content').onclick = e => e.stopPropagation();
    }

    function showModal(content) {
        document.getElementById('ai-body').innerHTML = content;
        document.getElementById('ai-result-modal').style.display = 'flex';
    }

    function shouldHighlightWord(word) {
        return wordsToHighlight.has(word.toLowerCase());
    }

    function highlightTextNodes() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        let node;
        const textNodes = [];

        while ((node = walker.nextNode())) {
            if (!node.parentElement) continue;
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'SVG'].includes(node.parentElement.tagName)) continue;
             // Prevent highlighting within elements that are already highlighted or links
            if (node.parentElement.closest(`.${highlightClass}`) || node.parentElement.closest('a')) continue;
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.nodeValue;
            if (!text || !text.trim()) return;

            // Use a regex to find words while respecting word boundaries
            const regex = /\b([a-zA-Z]+)\b/g;
            let match;
            let lastIndex = 0;
            const fragment = document.createDocumentFragment();

            while ((match = regex.exec(text)) !== null) {
                const word = match[1];
                const start = match.index;
                const end = start + word.length;

                // Add the text before the current word
                if (start > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
                }

                if (shouldHighlightWord(word)) {
                    const span = document.createElement('span');
                    span.className = highlightClass;
                    span.textContent = word;
                    span.addEventListener('click', e => {
                        e.preventDefault();
                        e.stopPropagation();
                        callAI(word);
                    });
                    fragment.appendChild(span);
                } else {
                    // If not highlighted, add the word as plain text
                    fragment.appendChild(document.createTextNode(word));
                }

                lastIndex = end;
            }

            // Add any remaining text after the last word
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            // Replace the original text node with the new fragment if changes were made
            if (fragment.childNodes.length > 0 && textNode.parentNode) {
                 // Check if any part of the fragment contains the highlight class before replacing
                let containsHighlight = false;
                for (const node of fragment.childNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains(highlightClass)) {
                        containsHighlight = true;
                        break;
                    }
                }
                // Only replace if there's something to replace or if highlighting occurred
                if (fragment.childNodes.length > 1 || (fragment.childNodes.length === 1 && fragment.firstChild.nodeType !== Node.TEXT_NODE) || containsHighlight) {
                     textNode.parentNode.replaceChild(fragment, textNode);
                }
            }
        });
    }


    function callAI(word) {
        showModal(`<div class="loader"></div><p style="text-align:center">AI 正在思考中...</p>`);

        const messages = [
            { role: "system", content: "你是一个专业的英语学习助手，请尽量详细解释这个词或句子的意思、例句、词性、词根、用法，并附上翻译。" },
            { role: "user", content: `请解释这个英文词或句子，并翻译：\n"${word}"` }
        ];

        const sendRequest = (ai) => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: ai.url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ai.apiKey}`
                },
                data: JSON.stringify({
                    model: ai.model,
                    messages: messages,
                    temperature: 0.7
                }),
                timeout: 20000, // 20 seconds timeout
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        const reply = json.choices?.[0]?.message?.content;
                        if (reply) resolve(reply);
                        else reject("AI 返回内容为空。");
                    } catch (e) {
                        console.error("Error parsing AI response:", e);
                        reject("AI 返回解析失败。");
                    }
                },
                onerror: (err) => {
                     console.error("GM_xmlhttpRequest Error:", err);
                     reject(`AI 请求出错: ${err.statusText || err.status || 'Unknown error'}`);
                },
                ontimeout: () => reject("AI 请求超时。")
            });
        });

        sendRequest(primaryAI)
            .then(showSuccess)
            .catch(primaryErr => {
                console.warn("Primary AI failed, trying backup:", primaryErr);
                sendRequest(backupAI)
                    .then(showSuccess)
                    .catch(backupErr => {
                        console.error("Backup AI also failed:", backupErr);
                        showModal(`<p style="color:red;text-align:center">主备AI请求均失败：<br>主AI: ${primaryErr}<br>备用AI: ${backupErr}</p>`);
                    });
            });

        function showSuccess(content) {
            // Basic markdown to HTML conversion (handle bold and newlines)
            let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
             formattedContent = formattedContent.replace(/\n/g, '<br>'); // Newlines

            showModal(`<div style="white-space: pre-wrap; word-break: break-word;">${formattedContent}</div>`);
        }
    }

    // Use requestAnimationFrame to wait for the DOM to be fully ready and rendered
    // This can help avoid issues with partial DOM loading
    function runWhenReady() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            createModal();
            highlightTextNodes();
        } else {
            requestAnimationFrame(runWhenReady);
        }
    }

    runWhenReady();


})();