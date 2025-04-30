## 初版

// ==UserScript==
// @name         单词高亮 + AI Edge修复版
// @namespace    http://your.website.com/
// @version      1.8 // Increment version for MutationObserver
// @description  高亮页面指定单词。点击时，同时查询AI解释并直接朗读该单词（使用美国Eric语音）。AI解释弹窗出来后，再显示发音按钮。使用显眼的红色下划线，带简单缓存。支持移动端双击关闭弹窗。弹窗显示AI分析来源。使用MutationObserver处理动态内容。
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-idle // Use document-idle as a good balance point
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const wordsToHighlight = new Set(["blasting", "trump"]); // Add your words here
    const highlightClass = 'tm-highlight-word';

    // TTS 服务域名数组。脚本会尝试使用这些域名构建请求URL。
    const ttsDomain = ['https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/'];
    // TTS 语音名称。当前配置为微软美国男声 Eric。
    let voice = 'en-US-EricNeural';

    // AI Configurations (Primary and Backup)
    const primaryAI = {
        name: 'ChatGPT',
        url: 'https://free.v36.cm/v1/chat/completions',
        apiKey: 'sk-7NEyEPLHDfmprWdPEb3036Ec568b40Ab9b444eD37fAeE436',
        model: 'gpt-3.5-turbo'
    };

    const backupAI = {
        name: 'Sambanova',
        url: 'https://api.sambanova.ai/v1/chat/completions',
        apiKey: '1fbf3ed7-a429-4938-89b1-06a99a654ab6',
        model: 'Meta-Llama-3.1-405B-Instruct'
    };
    // --- End Configuration ---


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


    // --- CSS Styling ---
    GM_addStyle(`
        .${highlightClass} {
            text-decoration: underline solid red !important;
            text-decoration-thickness: 2px !important;
            cursor: pointer;
            color: inherit; /* Keep original text color */
        }
        .${highlightClass}:hover {
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
            word-wrap: break-word; /* Ensure long words wrap */
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
            color: #777;
        }
        #ai-close-btn:hover {
             color: #333;
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
             margin-right: 10px; /* Space between word and button */
         }
        #play-word-tts {
            /* Removed margin-left as word-to-read has margin-right */
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            font-size: 1em;
            transition: background-color 0.2s ease;
        }
         #play-word-tts:hover:not(:disabled) {
             background-color: #e9e9e9;
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
             word-break: break-word; /* Ensure source text wraps */
         }
        #ai-body {
            white-space: pre-wrap; /* Respect newlines from AI */
            word-break: break-break-word; /* Break long words */
        }
        .loader {
            border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%;
            width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 20px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `);
    // --- End CSS Styling ---


    // --- Modal Handling ---
    let aiModal = null;
    let wordToReadSpan = null;
    let playButton = null;
    let aiBodyDiv = null;
    let wordInfoDiv = null;
    let aiSourceInfoDiv = null;

    function createModal() {
        if (aiModal) return; // Prevent creating multiple modals

        aiModal = document.createElement('div');
        aiModal.id = 'ai-result-modal';
        aiModal.innerHTML = `
            <div id="ai-result-content">
                <span id="ai-close-btn">&times;</span>
                <div id="word-info">
                    <span id="word-to-read"></span>
                    <button id="play-word-tts">🔊 Play</button>
                </div>
                <div id="ai-body"></div>
                <div id="ai-source-info"></div> </div>`;
        document.body.appendChild(aiModal);

        const modalContent = document.getElementById('ai-result-content');
        const closeBtn = document.getElementById('ai-close-btn');

        wordToReadSpan = document.getElementById('word-to-read');
        playButton = document.getElementById('play-word-tts');
        aiBodyDiv = document.getElementById('ai-body');
        wordInfoDiv = document.getElementById('word-info');
        aiSourceInfoDiv = document.getElementById('ai-source-info');

        closeBtn.onclick = () => aiModal.style.display = 'none';

        // Modal overlay click handler
        aiModal.onclick = (e) => {
            // Close only if the click is directly on the modal background, not the content box
            if (e.target === aiModal) {
                aiModal.style.display = 'none';
            }
        };

        // Add double-tap/double-click handler to the modal background for closing
        // Add it to the modal itself, not the content, so it works anywhere outside the content box
        aiModal.addEventListener('dblclick', (e) => {
            e.preventDefault(); // Prevent text selection on double-click
            aiModal.style.display = 'none';
        });


        // Prevent clicks inside modal content from closing modal
        if(modalContent) { // Check if modalContent exists
             modalContent.onclick = e => e.stopPropagation();
        }
        // Add event listener for the play button inside the modal
        if(playButton) { // Check if playButton exists
            playButton.addEventListener('click', () => {
                const wordToRead = wordToReadSpan.textContent;
                if (wordToRead) {
                    playTTS(wordToRead);
                }
            });
        }
    }

    function showModal(content, word = '', isSuccess = false, aiSource = '') {
        if (!aiModal || !wordToReadSpan || !aiBodyDiv || !playButton || !wordInfoDiv || !aiSourceInfoDiv) {
            console.error("Modal elements not fully initialized.");
            return;
        }

        // Set the word in the modal
        wordToReadSpan.textContent = word;

        // Display content (AI explanation, loading spinner, or error)
        aiBodyDiv.innerHTML = ''; // Clear previous content

        if (typeof content === 'string') {
             // Basic markdown to HTML conversion (handle bold and newlines) for displaying content
            let formattedContent = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
            // Newlines are handled by white-space: pre-wrap; in CSS

            // Safely parse the HTML string and append nodes
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = formattedContent; // Parse the HTML string
            while (tempDiv.firstChild) {
                 aiBodyDiv.appendChild(tempDiv.firstChild); // Append children safely
            }

            aiBodyDiv.style.whiteSpace = 'pre-wrap'; // Ensure pre-wrap is applied
        } else if (content instanceof HTMLElement) {
             // Assuming content is the loading spinner element
             aiBodyDiv.appendChild(content); // Append the loader element
             aiBodyDiv.style.whiteSpace = 'normal'; // Reset white-space for loader
        }


        // Show word info and play button only on AI success
        if (isSuccess) {
            wordInfoDiv.style.display = 'flex';
            playButton.disabled = false;
            playButton.textContent = '🔊 Play';

            // Display AI source info
            aiSourceInfoDiv.textContent = `分析来源: ${aiSource}`;
            aiSourceInfoDiv.style.display = 'block';
        } else {
            wordInfoDiv.style.display = 'none';
            aiSourceInfoDiv.style.display = 'none'; // Hide source info during loading/error
        }

        aiModal.style.display = 'flex';
    }

     function showLoading(word = '') {
         const loaderDiv = document.createElement('div');
         loaderDiv.className = 'loader';
         const loadingText = document.createElement('p');
         loadingText.style.textAlign = 'center';
         loadingText.textContent = 'AI 正在思考中...';
         loadingText.style.marginTop = '10px'; // Add some space

         const loadingContainer = document.createElement('div');
         loadingContainer.style.display = 'flex';
         loadingContainer.style.flexDirection = 'column';
         loadingContainer.style.alignItems = 'center';
         loadingContainer.style.justifyContent = 'center';

         loadingContainer.appendChild(loaderDiv);
         loadingContainer.appendChild(loadingText);

         // Pass the loading container element to showModal, set isSuccess to false for loading
         showModal(loadingContainer, word, false);
     }
    // --- End Modal Handling ---


    // --- Highlighting Logic ---
    function shouldHighlightWord(word) {
        return wordsToHighlight.has(word.toLowerCase());
    }

     // Helper function to check if a text node's parent chain is eligible for highlighting
     function isNodeEligibleForHighlighting(textNode) {
          // Skip empty or whitespace-only text nodes early
         if (!textNode.nodeValue || !textNode.nodeValue.trim()) return false;

          const parent = textNode.parentElement;
          if (!parent) return false;
          // Exclude script, style, etc. tags
          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'SVG', 'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'OBJECT', 'EMBED', 'IFRAME', 'INPUT', 'BUTTON', 'SELECT', 'OPTION'].includes(parent.tagName)) return false;

          // Check if the parent or any ancestor is an anchor tag (link) or already a highlighted span
          if (parent.closest(`.${highlightClass}`) || parent.closest('a')) return false;

          // Check if the node is within an element that is hidden (optional, can improve performance)
          // This check can be complex and might not be needed depending on site structure
          // if (parent.offsetParent === null && parent.tagName !== 'BODY') return false;

          return true;
     }

    // Processes a single text node, applies highlighting if applicable, and replaces it.
    function processTextNodeForHighlighting(textNode) {
        if (!isNodeEligibleForHighlighting(textNode)) {
            return false; // Node is not eligible
        }

        const text = textNode.nodeValue;
        // Regex: Find words bounded by non-word characters. Handles basic contractions/possessives.
        // \b ensures word boundaries. [a-zA-Z]+ matches one or more letters.
        // (?:['’](?:s|d|ll|ve|re)|) is a non-capturing group matching optional contractions ('s, 'd, etc.).
        const regex = /\b([a-zA-Z]+(?:['’](?:s|d|ll|ve|re)|))\b/g;
        let match;
        let lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let changed = false; // Flag to indicate if any highlighting occurred

        while ((match = regex.exec(text)) !== null) {
            const word = match[1]; // The captured word
            const start = match.index; // Start index of the match
            const end = start + word.length; // End index of the match

            // Add the text before the current word
            if (start > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
            }

            if (shouldHighlightWord(word)) {
                const span = document.createElement('span');
                span.className = highlightClass;
                span.textContent = word; // Use textContent for safety
                // Attach event listener directly when creating the span
                span.addEventListener('click', e => {
                    e.preventDefault(); // Prevent default link/selection behavior
                    e.stopPropagation(); // Stop event bubbling
                    playTTS(word); // Play audio immediately on click
                    callAI(word); // Call AI for explanation modal
                });
                fragment.appendChild(span);
                changed = true; // Mark that we added a highlighted span
            } else {
                // If not highlighted, add the word as plain text
                fragment.appendChild(document.createTextNode(word));
            }

            lastIndex = end; // Move lastIndex past the current match
        }

        // Add any remaining text after the last word
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // Replace the original text node with the new fragment ONLY if changes were made
        // This avoids unnecessary DOM replacements if no words were highlighted in the text node.
        if (changed && textNode.parentNode) {
             textNode.parentNode.replaceChild(fragment, textNode);
             return true; // Indicate that a change was made
        }
        // If no highlights were added, but the fragment might contain the original text node
        // (e.g., textNode "hello" -> fragment contains textNode "hello"), we don't need to replace.
        // The 'changed' flag handles cases where spans were added.
        // If the loop ran but added no spans, and there's only text content in the fragment,
        // we only replace if the original text node was the only child and its content is identical.
        // This edge case is mostly handled by checking 'changed'.

        return changed; // Return whether any highlighting occurred
    }

    // Walks a root node and processes all eligible text nodes within it and its descendants
    function scanAndHighlight(rootNode) {
         if (!rootNode) return;

        // Use a TreeWalker to find eligible text nodes efficiently
        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT, // Look only for text nodes
            {
                acceptNode: (node) => {
                    // Use the eligibility check to filter nodes
                    if (isNodeEligibleForHighlighting(node)) {
                        return NodeFilter.FILTER_ACCEPT; // Accept this node
                    }
                    // If the parent is excluded, reject this node and skip its children
                    if (node.parentElement && (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'SVG', 'IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'OBJECT', 'EMBED', 'IFRAME'].includes(node.parentElement.tagName) || node.parentElement.closest('a'))) {
                         return NodeFilter.FILTER_REJECT;
                    }
                    // If the parent is a highlight, reject this node (shouldn't happen with correct logic but good check)
                     if (node.parentElement && node.parentElement.closest(`.${highlightClass}`)) {
                         return NodeFilter.FILTER_REJECT;
                     }
                    // Otherwise, skip this node but check its children
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        // Collect nodes to process *before* processing them.
        // This avoids issues where DOM modification (replacing text nodes)
        // interferes with the TreeWalker's traversal.
        const nodesToProcess = [];
        let node;
        while ((node = walker.nextNode())) {
            nodesToProcess.push(node);
        }

        // Process the collected nodes
        nodesToProcess.forEach(processTextNodeForHighlighting);
    }
    // --- End Highlighting Logic ---

    // --- Mutation Observer ---
    const observerCallback = (mutations) => {
        mutations.forEach(mutation => {
            // Check for added nodes
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    // Only process element nodes and text nodes that are added
                    // Use a small timeout to batch changes, as many nodes might be added at once.
                    // This prevents scanAndHighlight from running excessively for each tiny DOM change.
                    // Adjust the delay (e.g., 100ms, 200ms) based on performance testing.
                    // A delay of 0 or very small might still be too frequent on some sites.
                    // We can add throttling/debouncing if needed, but a simple timeout is often sufficient.
                    if (addedNode.nodeType === Node.ELEMENT_NODE || addedNode.nodeType === Node.TEXT_NODE) {
                         // Adding a timeout here can sometimes cause issues if nodes are removed very quickly
                         // after being added. Let's try processing directly first. If performance is an issue,
                         // re-introduce debouncing/throttling.

                        // Directly scan and highlight the added node and its descendants
                        scanAndHighlight(addedNode);
                    }
                });
            }
             // Can add other mutation types if needed, e.g., 'characterData' for text changes
        });
    };

    // Set up the Mutation Observer
    const observer = new MutationObserver(observerCallback);

    // Start observing the document body for changes
    // Configure to watch for additions/removals of nodes and changes within the subtree
    // We start observing immediately. The initial scan will cover the content present at load.
    observer.observe(document.body, {
        childList: true, // Observe direct children additions/removals
        subtree: true    // Observe changes in the entire subtree
        // characterData: true // Optional: Observe text changes within text nodes (can be noisy)
    });
    // --- End Mutation Observer ---


    // --- AI API Call ---
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
            { role: "system", content: "你是一个专业的英语学习助手，请详细解释这个词或句子的音标、意思、例句及翻译、词性，并附上翻译。尽量包含常用的音标，但不强求词根信息，保持回复简洁且信息丰富。请使用双星号 **...** 来标记核心词汇或重要信息，方便用户快速识别。" },
            { role: "user", content: `请解释和翻译这个英文词或句子：\n"${word}"` }
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
                timeout: 25000, // Increased timeout slightly
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        // Check for common AI response structures
                        const reply = json.choices?.[0]?.message?.content || json.output?.choices?.[0]?.message?.content;

                        if (reply) {
                            // Store the successful response in cache along with the AI source name
                            setCachedExplanation(word, reply, ai.name);
                            resolve({ explanation: reply, source: ai.name }); // Resolve with explanation and source
                        } else {
                             console.error("AI returned empty or unexpected response:", json);
                            reject("AI 返回内容为空或格式异常。");
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

        // Attempt primary AI, then backup
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
    // --- End AI API Call ---


    // --- TTS Playback ---
    function playTTS(word) {
        if (!word) return;

        // Construct TTS URLs
        const audioUrls = ttsDomain.map(domain => {
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
            source.type = 'audio/mpeg'; // Assume MP3, adjust if needed based on service
            audio.appendChild(source);
        });

        // Add event listeners for error and ending to clean up
        const cleanUp = () => {
            if (audio && audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        };
        audio.addEventListener('ended', cleanUp);
        audio.addEventListener('error', (e) => {
             console.error("Audio playback error for word:", word, e);
             cleanUp(); // Clean up on error as well
             // Optionally, provide visual feedback to the user
             if (playButton && playButton.textContent === '🔊 Playing...') {
                 playButton.textContent = 'Playback Failed';
                 // Maybe disable button temporarily or reset text after a delay
             }
        });

        // Update modal button state if it's visible and playing
        if (playButton && playButton.textContent === '🔊 Play') {
             playButton.textContent = '🔊 Playing...';
             playButton.disabled = true; // Disable button while playing
             audio.addEventListener('ended', () => {
                 if (playButton.textContent === '🔊 Playing...') { // Only reset if it's still in playing state
                     playButton.textContent = '🔊 Play';
                     playButton.disabled = false;
                 }
             });
             audio.addEventListener('error', () => {
                  if (playButton.textContent === '🔊 Playing...') { // Only reset if it's still in playing state
                      playButton.textContent = '🔊 Play'; // Or "Failed"
                      playButton.disabled = false;
                  }
             });
        }


        // Attempt to play the audio
        audio.play().catch(error => {
            console.error("Audio play failed for word:", word, error);
            // Handle cases where play() promise is rejected (e.g., user gesture required, though click should satisfy this)
             if (playButton && playButton.textContent === '🔊 Playing...') {
                 playButton.textContent = 'Play Failed'; // Indicate failure on the button
                 playButton.disabled = false;
             }
            cleanUp(); // Clean up on play failure as well
        });
    }
    // --- End TTS Playback ---


    // --- Initialization ---
    // Use document-idle to wait until the browser is generally free
    // This is often a good time for scripts that modify the DOM
    // and need access to elements, balancing readiness with not blocking rendering.
    // The MutationObserver will handle anything loaded or changed later.

     function initializeScript() {
         console.log("Script initialized. Starting initial scan and observing DOM changes.");
         createModal(); // Create modal early, it's hidden by default
         scanAndHighlight(document.body); // Perform initial scan on the entire body
         // The observer is already started and will catch subsequent changes.
     }

     // Wait for the 'document-idle' state. If it's already idle or beyond, run immediately.
    if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'idle') {
        initializeScript();
    } else {
        // Wait for the 'readystatechange' event and check for 'interactive' or 'complete' or 'idle'
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete' || document.readyState === 'interactive' || document.readyState === 'idle') {
                 initializeScript();
            }
        }, { once: true }); // Use { once: true } to automatically remove the listener after it fires
    }

    // --- End Initialization ---

})();
