// 优化点击弹窗外隐藏弹窗

// ==UserScript==
// @name         SambaNova Summarizer Page with TTS
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  使用 SambaNova API 总结页面内容并朗读，仅保留晓晓语音，美化弹窗，朗读按钮调整到弹窗上方，弹窗高度与页面高度相同，点击弹窗外区域隐藏弹窗, 限制10秒内重复点击
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    let voice = 'zh-CN-XiaoxiaoNeural'; // 默认且唯一语音为晓晓
    GM_setValue('selectedVoice', voice); // 强制设置晓晓

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
            background-color: transparent;
            color: #007bff;
            border: 2px solid #007bff;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s ease;
        }
        #summarizeButton.hidden {
            opacity: 0;
        }
        #summarizeButton:hover {
            background-color: #0056b3;
        }

        #summaryOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
            z-index: 10000;
            display: none;
        }

        #summaryContainer {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            background-color: #f0f8f0; /* 淡淡的绿色背景 */
            border: 1px solid #d3e4d3;
            padding: 15px;
            width: 85%;
            max-width: 600px;
             height: 100%; /* 弹窗高度等于页面高度 */
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            border-radius: 0px; /* 取消圆角 */
            box-sizing: border-box;
        }
        #summaryContainer #summaryText {
            white-space: pre-line;
            flex-grow: 1;
            overflow-y: auto;
             margin-bottom: 10px;
            padding-right: 5px; /* 防止滚动条遮挡文字 */
        }
         #summaryContainer #closeSummary {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 18px;
            color: #777;
            transition: color 0.3s ease;
        }
         #summaryContainer #closeSummary:hover {
             color: #333;
        }
         #summaryContainer #ttsButtonContainer {
            display: flex;
            justify-content: center;
            padding-bottom: 10px; /* 修改为底部padding */
            border-bottom: 1px solid #d3e4d3; /* 修改为底部border */
            margin-top: 0px; /* 移除上边距 */
        }
        #summaryContainer #ttsButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
             font-size: 15px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             transition: background-color 0.3s ease;
        }
        #summaryContainer #ttsButton:hover {
            background-color: #45a049;
        }
        #summaryContainer #summaryContentWrapper {
            flex-grow: 1; /* 让内容区域占据剩余空间 */
            display: flex;
            flex-direction: column;
            overflow-y: auto; /* 添加内容超出时滚动 */
        }

         @media (max-width: 600px) {
            #summaryContainer {
                padding: 10px;
            }
            #summaryContainer #closeSummary {
                 font-size: 16px;
            }
         }
    `);

    let lastScrollY = window.scrollY;
    let isButtonHidden = false;

    // 创建半透明背景覆盖层
     const summaryOverlay = document.createElement('div');
    summaryOverlay.id = 'summaryOverlay';
    document.body.appendChild(summaryOverlay);
    summaryOverlay.style.display = 'none';

    // 创建总结容器
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summaryContainer';
    summaryContainer.innerHTML = `
       <span id="closeSummary">×</span>
       <div id="ttsButtonContainer">
           <button id="ttsButton">朗读</button>
       </div>
       <div id="summaryContentWrapper">
            <div id="summaryText"></div>
       </div>

    `;
    document.body.appendChild(summaryContainer);

    // 初始时隐藏总结容器
    summaryContainer.style.display = 'none';

    // 关闭总结容器
    const closeSummaryButton = document.getElementById('closeSummary');
    closeSummaryButton.addEventListener('click', () => {
        summaryContainer.style.display = 'none';
        summaryOverlay.style.display = 'none';
    });

    // 点击弹窗外区域隐藏弹窗
    summaryOverlay.addEventListener('click', () => {
        summaryContainer.style.display = 'none';
        summaryOverlay.style.display = 'none';
    });


    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && !isButtonHidden) {
            button.classList.add('hidden');
            isButtonHidden = true;
        } else if (window.scrollY < lastScrollY && isButtonHidden) {
            button.classList.remove('hidden');
            isButtonHidden = false;
        }
        lastScrollY = window.scrollY;
    });

    let currentSummary = null;
    let lastClickTime = 0;
    const cooldownTime = 10000; // 10 seconds

    // 点击按钮时的处理逻辑
    button.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < cooldownTime) {
          console.log('请等待10秒');
            return; // 如果在冷却时间内，则不执行
        }

        lastClickTime = now;
        const content = document.body.innerText;
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';

        button.innerText = '总结中...';
        button.disabled = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'Meta-Llama-3.1-405B-Instruct',
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    currentSummary = result.choices[0].message.content;
                    const summaryTextDiv = document.getElementById('summaryText');
                    summaryTextDiv.textContent = currentSummary;
                    summaryContainer.style.display = 'flex';
                     summaryOverlay.style.display = 'block';
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

    // 监听朗读按钮
    const ttsButton = document.getElementById('ttsButton');
    ttsButton.addEventListener('click', () => {
        if (currentSummary) {
            playTTS(currentSummary);
        } else {
            console.log('没有总结内容');
        }
    });


    function playTTS(selectedText) {
        if (!selectedText) {
            console.log("Selected text is empty, skipping TTS.");
            return;
        }

        console.log("Text to speak:", selectedText);

        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0,
        }).toString();


        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.muted = true;
        //audio.style.display = 'none'; //  暂时取消隐藏，方便调试

        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        document.body.append(audio);

        audio.addEventListener('loadstart', () => {
            console.log('Audio loadstart:', audio.src);
        });

        audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loadedmetadata:', audio.duration);
        });

        audio.addEventListener('canplaythrough', () => {
            console.log('Audio canplaythrough');

            audio.play()
                .then(() => {
                    console.log("TTS started successfully.");
                    audio.muted = false;
                })
                .catch(error => {
                    console.error('TTS play error after canplaythrough:', error);
                    if (audio.muted) {
                        audio.muted = false;
                        audio.play().catch(mutedPlayError => {
                            console.error('尝试取消静音后播放错误:', mutedPlayError);
                        });
                    }

                });
        });

        audio.addEventListener('error', (error) => {
            console.error('Audio element error:', error);
            console.error('Error code:', audio.error.code);
            if (audio.error) {
                if (audio.error.code === MediaError.MEDIA_ERR_NETWORK) {
                    alert("音频加载失败，网络连接可能存在问题，请稍后再试。");
                } else if (audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    alert("音频格式不支持，请检查音源。");
                } else {
                    alert("音频加载失败,未知错误。");
                }
            }
        });
     }
})();

// 朗读按钮播放逻辑优化

// ==UserScript==
// @name         SambaNova Summarizer Page with TTS
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  使用 SambaNova API 总结页面内容并朗读，仅保留晓晓语音，美化弹窗，朗读按钮调整到弹窗上方，弹窗高度与页面高度相同, 限制10秒内重复点击
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    let voice = 'zh-CN-XiaoxiaoNeural'; // 默认且唯一语音为晓晓
    GM_setValue('selectedVoice', voice); // 强制设置晓晓

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
            background-color: transparent;
            color: #007bff;
            border: 2px solid #007bff;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s ease;
        }
        #summarizeButton.hidden {
            opacity: 0;
        }
        #summarizeButton:hover {
            background-color: #0056b3;
        }

        #summaryContainer {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            background-color: #f0f8f0; /* 淡淡的绿色背景 */
            border: 1px solid #d3e4d3;
            padding: 15px;
            width: 85%;
            max-width: 600px;
             height: 100%; /* 弹窗高度等于页面高度 */
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            border-radius: 0px; /* 取消圆角 */
            box-sizing: border-box;
        }
        #summaryContainer #summaryText {
            white-space: pre-line;
            flex-grow: 1;
            overflow-y: auto;
             margin-bottom: 10px;
            padding-right: 5px; /* 防止滚动条遮挡文字 */
        }
         #summaryContainer #closeSummary {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 18px;
            color: #777;
            transition: color 0.3s ease;
        }
         #summaryContainer #closeSummary:hover {
             color: #333;
        }
         #summaryContainer #ttsButtonContainer {
            display: flex;
            justify-content: center;
            padding-bottom: 10px; /* 修改为底部padding */
            border-bottom: 1px solid #d3e4d3; /* 修改为底部border */
            margin-top: 0px; /* 移除上边距 */
        }
        #summaryContainer #ttsButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
             font-size: 15px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             transition: background-color 0.3s ease;
        }
        #summaryContainer #ttsButton:hover {
            background-color: #45a049;
        }
        #summaryContainer #summaryContentWrapper {
            flex-grow: 1; /* 让内容区域占据剩余空间 */
            display: flex;
            flex-direction: column;
            overflow-y: auto; /* 添加内容超出时滚动 */
        }

         @media (max-width: 600px) {
            #summaryContainer {
                padding: 10px;
            }
            #summaryContainer #closeSummary {
                 font-size: 16px;
            }
         }
    `);

    let lastScrollY = window.scrollY;
    let isButtonHidden = false;

    // 创建总结容器
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summaryContainer';
    summaryContainer.innerHTML = `
       <span id="closeSummary">×</span>
       <div id="ttsButtonContainer">
           <button id="ttsButton">朗读</button>
       </div>
       <div id="summaryContentWrapper">
            <div id="summaryText"></div>
       </div>

    `;
    document.body.appendChild(summaryContainer);

    // 初始时隐藏总结容器
    summaryContainer.style.display = 'none';

    // 关闭总结容器
    const closeSummaryButton = document.getElementById('closeSummary');
    closeSummaryButton.addEventListener('click', () => {
        summaryContainer.style.display = 'none';
    });

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && !isButtonHidden) {
            button.classList.add('hidden');
            isButtonHidden = true;
        } else if (window.scrollY < lastScrollY && isButtonHidden) {
            button.classList.remove('hidden');
            isButtonHidden = false;
        }
        lastScrollY = window.scrollY;
    });

    let currentSummary = null;
    let lastClickTime = 0;
    const cooldownTime = 10000; // 10 seconds

    // 点击按钮时的处理逻辑
    button.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < cooldownTime) {
          console.log('请等待10秒');
            return; // 如果在冷却时间内，则不执行
        }

        lastClickTime = now;
        const content = document.body.innerText;
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';

        button.innerText = '总结中...';
        button.disabled = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'Meta-Llama-3.1-405B-Instruct',
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    currentSummary = result.choices[0].message.content;
                    const summaryTextDiv = document.getElementById('summaryText');
                    summaryTextDiv.textContent = currentSummary;
                    summaryContainer.style.display = 'block';
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

    // 监听朗读按钮
    const ttsButton = document.getElementById('ttsButton');
    ttsButton.addEventListener('click', () => {
        if (currentSummary) {
            playTTS(currentSummary);
        } else {
            console.log('没有总结内容');
        }
    });


    function playTTS(selectedText) {
        if (!selectedText) {
            console.log("Selected text is empty, skipping TTS.");
            return;
        }

        console.log("Text to speak:", selectedText);

        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0,
        }).toString();


        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.muted = true;
        //audio.style.display = 'none'; //  暂时取消隐藏，方便调试

        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        document.body.append(audio);

        audio.addEventListener('loadstart', () => {
            console.log('Audio loadstart:', audio.src);
        });

        audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loadedmetadata:', audio.duration);
        });

        audio.addEventListener('canplaythrough', () => {
            console.log('Audio canplaythrough');

            audio.play()
                .then(() => {
                    console.log("TTS started successfully.");
                    audio.muted = false;
                })
                .catch(error => {
                    console.error('TTS play error after canplaythrough:', error);
                    if (audio.muted) {
                        audio.muted = false;
                        audio.play().catch(mutedPlayError => {
                            console.error('尝试取消静音后播放错误:', mutedPlayError);
                        });
                    }

                });
        });

        audio.addEventListener('error', (error) => {
            console.error('Audio element error:', error);
            console.error('Error code:', audio.error.code);
            if (audio.error) {
                if (audio.error.code === MediaError.MEDIA_ERR_NETWORK) {
                    alert("音频加载失败，网络连接可能存在问题，请稍后再试。");
                } else if (audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    alert("音频格式不支持，请检查音源。");
                } else {
                    alert("音频加载失败,未知错误。");
                }
            } else {
                alert("音频加载失败,未知错误。");
            }
        });

        audio.addEventListener('abort', () => {
            console.log('Audio loading aborted.');
        });

        audio.load();
    }
})();

// 朗读上方

// ==UserScript==
// @name         SambaNova Summarizer Page with TTS
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  使用 SambaNova API 总结页面内容并朗读，仅保留晓晓语音，美化弹窗，朗读按钮调整到弹窗上方，弹窗高度与页面高度相同
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    let voice = 'zh-CN-XiaoxiaoNeural'; // 默认且唯一语音为晓晓
    GM_setValue('selectedVoice', voice); // 强制设置晓晓

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
            background-color: transparent;
            color: #007bff;
            border: 2px solid #007bff;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s ease;
        }
        #summarizeButton.hidden {
            opacity: 0;
        }
        #summarizeButton:hover {
            background-color: #0056b3;
        }

        #summaryContainer {
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            background-color: #f0f8f0; /* 淡淡的绿色背景 */
            border: 1px solid #d3e4d3;
            padding: 15px;
            width: 85%;
            max-width: 600px;
             height: 100%; /* 弹窗高度等于页面高度 */
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            border-radius: 0px; /* 取消圆角 */
            box-sizing: border-box;
        }
        #summaryContainer #summaryText {
            white-space: pre-line;
            flex-grow: 1;
            overflow-y: auto;
             margin-bottom: 10px;
            padding-right: 5px; /* 防止滚动条遮挡文字 */
        }
         #summaryContainer #closeSummary {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 18px;
            color: #777;
            transition: color 0.3s ease;
        }
         #summaryContainer #closeSummary:hover {
             color: #333;
        }
         #summaryContainer #ttsButtonContainer {
            display: flex;
            justify-content: center;
            padding-bottom: 10px; /* 修改为底部padding */
            border-bottom: 1px solid #d3e4d3; /* 修改为底部border */
            margin-top: 0px; /* 移除上边距 */
        }
        #summaryContainer #ttsButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
             font-size: 15px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             transition: background-color 0.3s ease;
        }
        #summaryContainer #ttsButton:hover {
            background-color: #45a049;
        }
        #summaryContainer #summaryContentWrapper {
            flex-grow: 1; /* 让内容区域占据剩余空间 */
            display: flex;
            flex-direction: column;
            overflow-y: auto; /* 添加内容超出时滚动 */
        }

         @media (max-width: 600px) {
            #summaryContainer {
                padding: 10px;
            }
            #summaryContainer #closeSummary {
                 font-size: 16px;
            }
         }
    `);

    let lastScrollY = window.scrollY;
    let isButtonHidden = false;

    // 创建总结容器
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summaryContainer';
    summaryContainer.innerHTML = `
       <span id="closeSummary">×</span>
       <div id="ttsButtonContainer">
           <button id="ttsButton">朗读</button>
       </div>
       <div id="summaryContentWrapper">
            <div id="summaryText"></div>
       </div>

    `;
    document.body.appendChild(summaryContainer);

    // 初始时隐藏总结容器
    summaryContainer.style.display = 'none';

    // 关闭总结容器
    const closeSummaryButton = document.getElementById('closeSummary');
    closeSummaryButton.addEventListener('click', () => {
        summaryContainer.style.display = 'none';
    });

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && !isButtonHidden) {
            button.classList.add('hidden');
            isButtonHidden = true;
        } else if (window.scrollY < lastScrollY && isButtonHidden) {
            button.classList.remove('hidden');
            isButtonHidden = false;
        }
        lastScrollY = window.scrollY;
    });

    let currentSummary = null;
    // 点击按钮时的处理逻辑
    button.addEventListener('click', () => {
        const content = document.body.innerText;
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';

        button.innerText = '总结中...';
        button.disabled = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'Meta-Llama-3.1-405B-Instruct',
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    currentSummary = result.choices[0].message.content;
                    const summaryTextDiv = document.getElementById('summaryText');
                    summaryTextDiv.textContent = currentSummary;
                    summaryContainer.style.display = 'block';
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

    // 监听朗读按钮
    const ttsButton = document.getElementById('ttsButton');
    ttsButton.addEventListener('click', () => {
        if (currentSummary) {
            playTTS(currentSummary);
        } else {
            console.log('没有总结内容');
        }
    });


    function playTTS(selectedText) {
        if (!selectedText) {
            console.log("Selected text is empty, skipping TTS.");
            return;
        }

        console.log("Text to speak:", selectedText);

        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0,
        }).toString();


        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.muted = true;
        //audio.style.display = 'none'; //  暂时取消隐藏，方便调试

        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        document.body.append(audio);

        audio.addEventListener('loadstart', () => {
            console.log('Audio loadstart:', audio.src);
        });

        audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loadedmetadata:', audio.duration);
        });

        audio.addEventListener('canplaythrough', () => {
            console.log('Audio canplaythrough');

            audio.play()
                .then(() => {
                    console.log("TTS started successfully.");
                    audio.muted = false;
                })
                .catch(error => {
                    console.error('TTS play error after canplaythrough:', error);
                    if (audio.muted) {
                        audio.muted = false;
                        audio.play().catch(mutedPlayError => {
                            console.error('尝试取消静音后播放错误:', mutedPlayError);
                        });
                    }

                });
        });

        audio.addEventListener('error', (error) => {
            console.error('Audio element error:', error);
            console.error('Error code:', audio.error.code);
            if (audio.error) {
                if (audio.error.code === MediaError.MEDIA_ERR_NETWORK) {
                    alert("音频加载失败，网络连接可能存在问题，请稍后再试。");
                } else if (audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    alert("音频格式不支持，请检查音源。");
                } else {
                    alert("音频加载失败,未知错误。");
                }
            } else {
                alert("音频加载失败,未知错误。");
            }
        });

        audio.addEventListener('abort', () => {
            console.log('Audio loading aborted.');
        });

        audio.load();
    }
})();

// 总结并朗读

// ==UserScript==
// @name         SambaNova Summarizer Page with TTS
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  使用 SambaNova API 总结页面内容并朗读，仅保留晓晓语音，美化弹窗
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    let voice = 'zh-CN-XiaoxiaoNeural'; // 默认且唯一语音为晓晓
    GM_setValue('selectedVoice', voice); // 强制设置晓晓

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
            background-color: transparent;
            color: #007bff;
            border: 2px solid #007bff;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: opacity 0.3s ease;
        }
        #summarizeButton.hidden {
            opacity: 0;
        }
        #summarizeButton:hover {
            background-color: #0056b3;
        }

        #summaryContainer {
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            background-color: #f0f8f0; /* 淡淡的绿色背景 */
            border: 1px solid #d3e4d3;
            padding: 15px;
            width: 85%;
            max-width: 600px;
            max-height: 60%;
            display: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            border-radius: 8px;
        }
        #summaryContainer #summaryText {
            white-space: pre-line;
            flex-grow: 1;
            overflow-y: auto;
             margin-bottom: 10px;
            padding-right: 5px; /* 防止滚动条遮挡文字 */
        }
         #summaryContainer #closeSummary {
            position: absolute;
            top: 8px;
            right: 8px;
            cursor: pointer;
            font-size: 18px;
            color: #777;
            transition: color 0.3s ease;
        }
         #summaryContainer #closeSummary:hover {
             color: #333;
        }
         #summaryContainer #ttsButtonContainer {
            display: flex;
            justify-content: center;
            padding-top: 10px;
            border-top: 1px solid #d3e4d3;
            margin-top: auto;
        }
        #summaryContainer #ttsButton {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
             font-size: 15px;
             box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
             transition: background-color 0.3s ease;
        }
        #summaryContainer #ttsButton:hover {
            background-color: #45a049;
        }

        @media (max-width: 600px) {
            #summaryContainer {
                padding: 10px;
            }
            #summaryContainer #closeSummary {
                 font-size: 16px;
            }
        }
    `);

    let lastScrollY = window.scrollY;
    let isButtonHidden = false;

    // 创建总结容器
    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'summaryContainer';
    summaryContainer.innerHTML = `
       <span id="closeSummary">×</span>
       <div id="summaryText"></div>
        <div id="ttsButtonContainer">
           <button id="ttsButton">朗读</button>
       </div>
    `;
    document.body.appendChild(summaryContainer);

    // 初始时隐藏总结容器
    summaryContainer.style.display = 'none';

    // 关闭总结容器
    const closeSummaryButton = document.getElementById('closeSummary');
    closeSummaryButton.addEventListener('click', () => {
        summaryContainer.style.display = 'none';
    });

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && !isButtonHidden) {
            button.classList.add('hidden');
            isButtonHidden = true;
        } else if (window.scrollY < lastScrollY && isButtonHidden) {
            button.classList.remove('hidden');
            isButtonHidden = false;
        }
        lastScrollY = window.scrollY;
    });

    let currentSummary = null;
    // 点击按钮时的处理逻辑
    button.addEventListener('click', () => {
        const content = document.body.innerText;
        const apiKey = '1fbf3ed7-a429-4938-89b1-06a99a654ab6';
        const apiUrl = 'https://api.sambanova.ai/v1/chat/completions';

        button.innerText = '总结中...';
        button.disabled = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify({
                model: 'Meta-Llama-3.1-405B-Instruct',
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
                    { role: "user", content: content }
                ]
            }),
            onload: (response) => {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                    currentSummary = result.choices[0].message.content;
                    const summaryTextDiv = document.getElementById('summaryText');
                    summaryTextDiv.textContent = currentSummary;
                    summaryContainer.style.display = 'block';
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

    // 监听朗读按钮
    const ttsButton = document.getElementById('ttsButton');
    ttsButton.addEventListener('click', () => {
        if (currentSummary) {
            playTTS(currentSummary);
        } else {
            console.log('没有总结内容');
        }
    });


    function playTTS(selectedText) {
        if (!selectedText) {
            console.log("Selected text is empty, skipping TTS.");
            return;
        }

        console.log("Text to speak:", selectedText);

        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0,
        }).toString();


        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.muted = true;
        //audio.style.display = 'none'; //  暂时取消隐藏，方便调试

        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        document.body.append(audio);

        audio.addEventListener('loadstart', () => {
            console.log('Audio loadstart:', audio.src);
        });

        audio.addEventListener('loadedmetadata', () => {
            console.log('Audio loadedmetadata:', audio.duration);
        });

        audio.addEventListener('canplaythrough', () => {
            console.log('Audio canplaythrough');

            audio.play()
                .then(() => {
                    console.log("TTS started successfully.");
                    audio.muted = false;
                })
                .catch(error => {
                    console.error('TTS play error after canplaythrough:', error);
                    if (audio.muted) {
                        audio.muted = false;
                        audio.play().catch(mutedPlayError => {
                            console.error('尝试取消静音后播放错误:', mutedPlayError);
                        });
                    }

                });
        });

        audio.addEventListener('error', (error) => {
            console.error('Audio element error:', error);
            console.error('Error code:', audio.error.code);
            if (audio.error) {
                if (audio.error.code === MediaError.MEDIA_ERR_NETWORK) {
                    alert("音频加载失败，网络连接可能存在问题，请稍后再试。");
                } else if (audio.error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
                    alert("音频格式不支持，请检查音源。");
                } else {
                    alert("音频加载失败,未知错误。");
                }
            } else {
                alert("音频加载失败,未知错误。");
            }
        });

        audio.addEventListener('abort', () => {
            console.log('Audio loading aborted.');
        });

        audio.load();
    }
})();

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
                    { role: "system", content: "You are a helpful assistant. Please summarize the following content in Chinese, regardless of its original language." },
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