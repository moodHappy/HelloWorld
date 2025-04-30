## 二版

// ==UserScript==
// @name         单词高亮 + AI
// @namespace    http://your.website.com/
// @version      1.7 // Increment version for AI source display
// @description  高亮页面指定单词。点击时，同时查询AI解释并直接朗读该单词（使用美国Eric语音）。AI解释弹窗出来后，再显示发音按钮。使用显眼的红色下划线，带简单缓存。支持移动端双击关闭弹窗。弹窗显示AI分析来源。
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

    // --- Cache Implementation ---
    // Cache stores { word.toLowerCase(): { explanation: "...", source: "..." } }
    const aiCache = {};

    function getCachedExplanation(word) {
        return aiCache[word.toLowerCase()];
    }

    function setCachedExplanation(word, explanation, source) {
        aiCache[word.toLowerCase()] = { explanation: explanation, source: source };
    }
    // --- End Cache Implementation ---

    // --- TTS Configuration ---
    // TTS 服务域名数组。脚本会尝试使用这些域名构建请求URL。
    const ttsDomain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];
    // TTS 语音名称。当前配置为微软美国男声 Eric。
    let voice = 'en-US-EricNeural';
    // 如果你需要修改为其他语音，并且脚本的其他部分不再强制设置特定语音，
    // 你可以在这里修改 voice 的值为你希望使用的、且TTS服务支持的语音名称。
    // --- End Cache Implementation ---


    const primaryAI = {
        name: 'ChatGPT', // Added name for identification
        url: 'https://free.v36.cm/v1/chat/completions',
        apiKey: 'sk-7NEyEPLHDfmprWdPEb3036Ec568b40Ab9b444eD37fAeE436',
        model: 'gpt-3.5-turbo'
    };

    const backupAI = {
        name: 'Sambanova', // Added name for identification
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
            overflow: auto; /* Allow scrolling on modal if content is too large */
        }
        #ai-result-content {
            background: white; padding: 20px; border-radius: 8px;
            max-width: 90%; max-height: 90%; overflow-y: auto; position: relative;
            color: #333;
            box-sizing: border-box; /* Include padding in max-width/height */
        }
         @media (max-width: 600px) {
            #ai-result-content {
                max-width: 95%;
                max-height: 95%;
                padding: 15px;
            }
        }
        #ai-close-btn {
            position: absolute; top: 10px; right: 15px; font-size: 22px; cursor: pointer;
        }
        #word-info {
            display: none; /* Initially hidden */
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
         #word-to-read {
             font-weight: bold;
             font-size: 1.2em;
             word-break: break-word; /* Prevent long words from overflowing */
         }
        #play-word-tts {
            margin-left: 10px;
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            font-size: 1em;
        }
        #play-word-tts:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
         #ai-source-info {
             font-size: 0.9em;
             color: #777;
             text-align: right;
             margin-top: 10px;
         }
        #ai-body {
            white-space: pre-wrap;
            word-break: break-word;
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
                <div id="word-info">
                    <span id="word-to-read"></span>
                    <button id="play-word-tts">🔊 Play</button>
                </div>
                <div id="ai-body"></div>
                <div id="ai-source-info"></div> </div>`;
        document.body.appendChild(modal);

        const modalContent = document.getElementById('ai-result-content');
        const closeBtn = document.getElementById('ai-close-btn');
        const playButton = document.getElementById('play-word-tts');
        const wordInfoDiv = document.getElementById('word-info');


        closeBtn.onclick = () => modal.style.display = 'none';

        // Modal overlay click handler
        modal.onclick = (e) => {
            // Close only if the click is directly on the modal background, not the content box
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };

        // Add double-tap/double-click handler to the modal for closing
        modal.addEventListener('dblclick', (e) => {
             // Prevent double-click text selection on some browsers
            e.preventDefault();
            // Close the modal
            modal.style.display = 'none';
        });


        modalContent.onclick = e => e.stopPropagation(); // Prevent clicks inside modal content from closing modal

        // Add event listener for the play button inside the modal
        playButton.addEventListener('click', () => {
             const wordToRead = document.getElementById('word-to-read').textContent;
             if (wordToRead) {
                 playTTS(wordToRead);
             }
        });
    }

    // Added isSuccess flag and aiSource parameter to control display of word-info and source
    function showModal(content, word = '', isSuccess = false, aiSource = '') {
        const modal = document.getElementById('ai-result-modal');
        const wordToReadSpan = document.getElementById('word-to-read');
        const aiBody = document.getElementById('ai-body');
        const playButton = document.getElementById('play-word-tts');
        const wordInfoDiv = document.getElementById('word-info');
        const aiSourceInfoDiv = document.getElementById('ai-source-info'); // Get the new source div

        if (!modal || !wordToReadSpan || !aiBody || !playButton || !wordInfoDiv || !aiSourceInfoDiv) {
            console.error("Modal elements not found.");
            return;
        }

        // Set the word in the modal
        wordToReadSpan.textContent = word;

        // Display content (AI explanation, loading spinner, or error)
        if (typeof content === 'string') {
             // Basic markdown to HTML conversion (handle bold and newlines) for displaying content
            let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
            formattedContent = formattedContent.replace(/\n/g, '<br>'); // Newlines
            aiBody.innerHTML = `<div style="white-space: pre-wrap; word-break: break-word;">${formattedContent}</div>`;
        } else { // Assuming content is the loading spinner element
             aiBody.innerHTML = ''; // Clear previous content
             aiBody.appendChild(content); // Append the loader element
        }

        // --- Show word info and play button only on AI success ---
        if (isSuccess) {
            wordInfoDiv.style.display = 'flex'; // Or 'block' depending on layout
            // Reset play button state when shown for success
            playButton.disabled = false;
            playButton.textContent = '🔊 Play';

             // Display AI source info
             aiSourceInfoDiv.textContent = `分析来源: ${aiSource}`;
             aiSourceInfoDiv.style.display = 'block';
        } else {
            wordInfoDiv.style.display = 'none';
            aiSourceInfoDiv.style.display = 'none'; // Hide source info during loading/error
        }
        // --- End modification ---

        modal.style.display = 'flex';
    }

     function showLoading(word = '') {
         const loaderDiv = document.createElement('div');
         loaderDiv.className = 'loader';
         const loadingText = document.createElement('p');
         loadingText.style.textAlign = 'center';
         loadingText.textContent = 'AI 正在思考中...';

         const loadingContainer = document.createElement('div');
         loadingContainer.appendChild(loaderDiv);
         loadingContainer.appendChild(loadingText);

         // Pass the loading container element to showModal, set isSuccess to false for loading
         showModal(loadingContainer, word, false);
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

            // Check if the text node contains text that is only whitespace or empty
            if (!node.nodeValue.trim()) continue;

            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            const text = textNode.nodeValue;
            if (!text) return;

            // Use a regex to find words while respecting word boundaries
            // Also handle potential punctuation attached to words
             const regex = /\b([a-zA-Z]+(?:['’](?:s|d|ll|ve|re)|))\b/g; // Improved regex to handle common contractions/possessives
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
                        // --- Keep calling playTTS directly on click ---
                        playTTS(word);
                        // --- Keep calling callAI for the explanation modal ---
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
                // And prevent replacing if the fragment is just the original text node (no highlights found)
                if (fragment.childNodes.length !== 1 || fragment.firstChild.nodeType !== Node.TEXT_NODE || containsHighlight) {
                     textNode.parentNode.replaceChild(fragment, textNode);
                }
            }
        });
    }


    function playTTS(word) {
        // This function is called directly on click, and also by the modal button.
        // We don't update the modal button state here when called directly on click,
        // only the modal button's own listener should manage its state.

        // Construct TTS URLs
        const audioUrls = ttsDomain.map(domain => {
            // Encode the word for the URL
            const encodedWord = encodeURIComponent(word);
            // Assuming speed 1.0
            return `${domain}/api/aiyue?text=${encodedWord}&voiceName=${encodeURIComponent(voice)}&speed=1.0`;
        });

        // Create audio element and sources
        // Create a new audio element each time to avoid interference
        const audio = new Audio();

        audioUrls.forEach(url => {
            const source = document.createElement('source');
            source.src = url;
            source.type = 'audio/mpeg'; // Assume MP3, adjust if needed
            audio.appendChild(source);
        });

        // Add error handling for audio playback
        audio.addEventListener('error', (e) => {
            console.error("Audio playback error for word:", word, e);
            // Optionally, notify the user with a temporary message somewhere
        });

        // Attempt to play the audio
        audio.play().catch(error => {
            console.error("Audio play failed for word:", word, error);
            // Handle cases where play() promise is rejected (e.g., user gesture required, though click should satisfy this)
        });

         // Clean up the audio element after playback or error to avoid memory leaks
         audio.addEventListener('ended', () => audio.remove());
         audio.addEventListener('error', () => audio.remove());
    }


    function callAI(word) {
        const cached = getCachedExplanation(word);

        if (cached) {
            console.log(`Cache hit for "${word}". Displaying cached explanation.`);
            // Pass true for isSuccess and the cached source
            showModal(cached.explanation, word, true, cached.source);
            return; // Stop here, no AI call needed for explanation
        }

        console.log(`Cache miss for "${word}". Calling AI...`);
        // Pass false for isSuccess as we are showing loading
        showLoading(word);

        const messages = [
            { role: "system", content: "你是一个专业的英语学习助手，请尽量详细解释这个词或句子的音标、意思、例句、词性、词根、用法，并附上翻译。" },
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
                        if (reply) {
                            // Store the successful response in cache along with the AI source name
                            setCachedExplanation(word, reply, ai.name);
                            resolve({ explanation: reply, source: ai.name }); // Resolve with explanation and source
                        } else {
                            reject("AI 返回内容为空。");
                        }
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
            .then(result => showModal(result.explanation, word, true, result.source)) // Pass success, explanation, word, and source
            .catch(primaryErr => {
                console.warn("Primary AI failed, trying backup:", primaryErr);
                sendRequest(backupAI)
                    .then(result => showModal(result.explanation, word, true, result.source)) // Pass success, explanation, word, and source
                    .catch(backupErr => {
                        console.error("Backup AI also failed:", backupErr);
                        // Pass false for error, no source info in case of complete failure
                        showModal(`<p style="color:red;text-align:center">主备AI请求均失败：<br>主AI: ${primaryErr}<br>备用AI: ${backupErr}</p>`, word, false, '');
                    });
            });
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