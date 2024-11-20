// 优化

// ==UserScript==
// @name         划词翻译（谷歌微软）
// @namespace    http://tampermonkey.net/
// @version      6.4
// @description  支持在移动端设备上单击自动翻译功能，点击文本后自动显示翻译结果、音标、例句、释义并朗读文本，点击页面隐藏翻译框
// @author       YourName
// @match        *://www.theguardian.com/*
// @match        *://www.bbc.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    const voice = 'en-US-EricNeural';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = '#e6ffe6';  // 柔和护眼的淡绿色背景
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';  // 默认隐藏
    translationBox.style.boxSizing = 'border-box';
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    translationBox.style.borderRadius = '8px';
    translationBox.style.width = '100%';  // 设置宽度为页面宽度
    translationBox.style.left = '0';  // 居左对齐
    document.body.appendChild(translationBox);

    // 监听 click 和 touchstart 事件
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('translation-close')) {
            translationBox.style.display = 'none';
            return;
        }
        const selectedText = getWordUnderCursor(event);
        if (selectedText) {
            // 自动弹出翻译结果、音标、例句、释义并朗读文本
            fetchTranslation(selectedText, event);
            playTTS(selectedText); // 调用TTS播放功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 获取光标下的单词
    function getWordUnderCursor(event) {
        const range = document.caretRangeFromPoint(event.clientX, event.clientY);
        if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
            return '';
        }

        const textContent = range.startContainer.textContent;
        const offset = range.startOffset;

        // 通过空格等字符分割文本
        const before = textContent.slice(0, offset).split(/\s+/).pop(); // 获取光标前的部分单词
        const after = textContent.slice(offset).split(/\s+/).shift(); // 获取光标后的部分单词

        const word = before + after; // 拼接完整单词
        return word.trim();
    }

    // 执行翻译的函数，包含释义功能
    function fetchTranslation(text, event) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&dt=bd&dt=rm&dt=ss&dt=md&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                const definitions = data[1]?.[0]?.[1]?.join(', ') || '暂无释义';  // 获取释义

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(text, translation, phonetic, example, definitions, event);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标、例句和释义
    function showTranslation(word, translation, phonetic, example, definitions, event) {
        const top = event.clientY + window.scrollY;

        translationBox.style.top = `${top + 20}px`;  // 翻译框放在点击位置下方

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';  // 叉号
        closeButton.classList.add('translation-close');  // 加上类名，方便选择
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.fontSize = '18px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.color = '#333';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = 'bold';

        // 填充翻译框内容，添加“单词”一栏
        translationBox.innerHTML = `
            <strong>单词：</strong> ${word} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>释义：</strong> ${definitions} <br>
            <strong>例句：</strong> ${example}
        `;

        // 插入关闭按钮
        translationBox.appendChild(closeButton);
        translationBox.style.display = 'block';  // 显示翻译框
    }

    // 播放选中文本的TTS
    function playTTS(selectedText) {
        if (!selectedText) {
            return; // 如果选中的文本为空，退出
        }

        // 生成查询参数
        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0, // 正常语速
        }).toString();

        // 如果已经有音频元素，移除它
        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        // 创建音频元素
        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.style.display = 'none';

        // 为每个域名生成音频源
        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        // 将音频元素插入页面
        document.body.append(audio);

        // 播放音频
        audio.play().catch(error => console.error('TTS播放错误:', error));
    }

})();

// 多释义版本

// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果、音标、例句、释义并朗读文本，点击页面隐藏翻译框
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    const voice = 'en-US-EricNeural';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = '#e6ffe6';  // 柔和护眼的淡绿色背景
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.width = '100%';  // 设置宽度为100%，适应移动端宽度
    translationBox.style.maxWidth = '100%';  // 设置最大宽度为100%
    translationBox.style.left = '0';  // 居左
    translationBox.style.boxSizing = 'border-box';  // 包括padding和border在内的总宽度
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    translationBox.style.borderRadius = '8px';  // 增加圆角，使其看起来更柔和
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果、音标、例句、释义并朗读文本
            fetchTranslation(selectedText);
            playTTS(selectedText); // 调用TTS播放功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数，包含释义功能
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&dt=bd&dt=rm&dt=ss&dt=md&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                const definitions = data[1]?.[0]?.[1]?.join(', ') || '暂无释义';  // 获取释义
                console.log('翻译结果:', translation);  // 调试输出
                console.log('释义:', definitions);  // 调试输出

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(translation, phonetic, example, definitions);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数（模拟，实际需要对接词典 API）
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标、例句和释义
    function showTranslation(translation, phonetic, example, definitions) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;

        translationBox.innerHTML = `
            <strong>翻译：</strong> ${translation} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>释义：</strong> ${definitions} <br>
            <strong>例句：</strong> ${example}
        `;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.display = 'block';

        // 添加点击页面任意地方隐藏翻译框的事件
        document.addEventListener('click', hideTranslationBox);
    }

    // 隐藏翻译框
    function hideTranslationBox() {
        translationBox.style.display = 'none';
        // 移除事件监听器，避免多次点击后重复绑定
        document.removeEventListener('click', hideTranslationBox);
    }

    // 播放选中文本的TTS
    function playTTS(selectedText) {
        if (!selectedText) {
            return; // 如果选中的文本为空，退出
        }

        // 生成查询参数
        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0, // 正常语速
        }).toString();

        // 如果已经有音频元素，移除它
        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        // 创建音频元素
        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.style.display = 'none';

        // 为每个域名生成音频源
        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        // 将音频元素插入页面
        document.body.append(audio);

        // 播放音频
        audio.play();
    }
})();

// 高级进阶版5.0

// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果、音标和例句并朗读文本，点击页面隐藏翻译框
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 配置域名
    const domain = [
        'https://ms-ra-forwarder-for-ifreetime-beta-two.vercel.app/',
    ];

    // 声音设置
    const voice = 'en-US-EricNeural';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = '#e6ffe6';  // 柔和护眼的淡绿色背景
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.width = '100%';  // 设置宽度为100%，适应移动端宽度
    translationBox.style.maxWidth = '100%';  // 设置最大宽度为100%
    translationBox.style.left = '0';  // 居左
    translationBox.style.boxSizing = 'border-box';  // 包括padding和border在内的总宽度
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    translationBox.style.borderRadius = '8px';  // 增加圆角，使其看起来更柔和
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果、音标和例句并朗读文本
            fetchTranslation(selectedText);
            playTTS(selectedText); // 调用TTS播放功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(translation, phonetic, example);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数（模拟，实际需要对接词典 API）
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标和例句
    function showTranslation(translation, phonetic, example) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;

        translationBox.innerHTML = `
            <strong>翻译：</strong> ${translation} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>例句：</strong> ${example}
        `;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.display = 'block';

        // 添加点击页面任意地方隐藏翻译框的事件
        document.addEventListener('click', hideTranslationBox);
    }

    // 隐藏翻译框
    function hideTranslationBox() {
        translationBox.style.display = 'none';
        // 移除事件监听器，避免多次点击后重复绑定
        document.removeEventListener('click', hideTranslationBox);
    }

    // 播放选中文本的TTS
    function playTTS(selectedText) {
        if (!selectedText) {
            return; // 如果选中的文本为空，退出
        }

        // 生成查询参数
        const queryString = new URLSearchParams({
            text: selectedText,
            voiceName: voice,
            speed: 0, // 正常语速
        }).toString();

        // 如果已经有音频元素，移除它
        let existingAudio = document.getElementById('hiddenAudioExample');
        if (existingAudio) {
            existingAudio.remove();
        }

        // 创建音频元素
        const audio = document.createElement('audio');
        audio.id = 'hiddenAudioExample';
        audio.style.display = 'none';

        // 为每个域名生成音频源
        for (const url of domain) {
            const source = document.createElement('source');
            source.src = `${url}api/aiyue?${queryString}`;
            source.type = 'audio/mpeg';
            audio.append(source);
        }

        // 将音频元素插入页面
        document.body.append(audio);

        // 播放音频
        audio.play();
    }
})();

// 高级进阶版

// ==UserScript==
// @name         划词翻译和音标显示
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果、音标和例句并朗读文本，点击页面隐藏翻译框
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = '#e6ffe6';  // 柔和护眼的淡绿色背景
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.width = '100%';  // 设置宽度为100%，适应移动端宽度
    translationBox.style.maxWidth = '100%';  // 设置最大宽度为100%
    translationBox.style.left = '0';  // 居左
    translationBox.style.boxSizing = 'border-box';  // 包括padding和border在内的总宽度
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    translationBox.style.borderRadius = '8px';  // 增加圆角，使其看起来更柔和
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果、音标和例句并朗读文本
            fetchTranslation(selectedText);
            speakText(selectedText); // 调用朗读功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(translation, phonetic, example);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数（模拟，实际需要对接词典 API）
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标和例句
    function showTranslation(translation, phonetic, example) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;

        translationBox.innerHTML = `
            <strong>翻译：</strong> ${translation} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>例句：</strong> ${example}
        `;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.display = 'block';

        // 添加点击页面任意地方隐藏翻译框的事件
        document.addEventListener('click', hideTranslationBox);
    }

    // 隐藏翻译框
    function hideTranslationBox() {
        translationBox.style.display = 'none';
        // 移除事件监听器，避免多次点击后重复绑定
        document.removeEventListener('click', hideTranslationBox);
    }

    // 朗读选中的文本（英文）
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 设置语言为英文
        speechSynthesis.speak(utterance);
    }
})();

// 高级版

// ==UserScript==
// @name         划词翻译和音标显示
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果、音标和例句并朗读文本，点击页面隐藏翻译框
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = 'white';
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.maxWidth = '300px';
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果、音标和例句并朗读文本
            fetchTranslation(selectedText);
            speakText(selectedText); // 调用朗读功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(translation, phonetic, example);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数（模拟，实际需要对接词典 API）
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标和例句
    function showTranslation(translation, phonetic, example) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;
        const left = range.left + window.scrollX;

        translationBox.innerHTML = `
            <strong>翻译：</strong> ${translation} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>例句：</strong> ${example}
        `;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.left = `${left}px`;
        translationBox.style.display = 'block';

        // 添加点击页面任意地方隐藏翻译框的事件
        document.addEventListener('click', hideTranslationBox);
    }

    // 隐藏翻译框
    function hideTranslationBox() {
        translationBox.style.display = 'none';
        // 移除事件监听器，避免多次点击后重复绑定
        document.removeEventListener('click', hideTranslationBox);
    }

    // 朗读选中的文本（英文）
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 设置语言为英文
        speechSynthesis.speak(utterance);
    }
})();

// 进阶版

// ==UserScript==
// @name         划词翻译和音标显示
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果、音标和例句并朗读文本
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = 'white';
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.maxWidth = '300px';
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果、音标和例句并朗读文本
            fetchTranslation(selectedText);
            speakText(selectedText); // 调用朗读功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 获取音标和例句
                fetchPhoneticAndExample(text).then(({ phonetic, example }) => {
                    showTranslation(translation, phonetic, example);
                });
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 获取音标和例句的函数（模拟，实际需要对接词典 API）
    function fetchPhoneticAndExample(word) {
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
            .then(response => response.json())
            .then(data => {
                const phonetic = data[0]?.phonetic || '暂无音标';
                const example = data[0]?.meanings[0]?.definitions[0]?.example || '暂无例句';
                return { phonetic, example };
            })
            .catch(() => ({ phonetic: '暂无音标', example: '暂无例句' }));
    }

    // 显示翻译、音标和例句
    function showTranslation(translation, phonetic, example) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;
        const left = range.left + window.scrollX;

        translationBox.innerHTML = `
            <strong>翻译：</strong> ${translation} <br>
            <strong>音标：</strong> ${phonetic} <br>
            <strong>例句：</strong> ${example}
        `;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.left = `${left}px`;
        translationBox.style.display = 'block';

        // 5秒后自动隐藏翻译框
        setTimeout(() => {
            translationBox.style.display = 'none';
        }, 5000);
    }

    // 朗读选中的文本（英文）
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 设置语言为英文
        speechSynthesis.speak(utterance);
    }
})();

//初级版

// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  支持在 Kiwi 浏览器上使用的划词自动翻译功能，选中文本后自动显示翻译结果并朗读文本
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建翻译结果的显示框
    const translationBox = document.createElement('div');
    translationBox.style.position = 'absolute';
    translationBox.style.backgroundColor = 'white';
    translationBox.style.border = '1px solid #ccc';
    translationBox.style.padding = '10px';
    translationBox.style.zIndex = '1000';
    translationBox.style.display = 'none';
    translationBox.style.maxWidth = '300px';
    translationBox.style.fontSize = '14px';
    translationBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(translationBox);

    // 监听 selectionchange 事件
    document.addEventListener('selectionchange', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // 自动弹出翻译结果并朗读文本
            fetchTranslation(selectedText);
            speakText(selectedText); // 调用朗读功能
        } else {
            translationBox.style.display = 'none';  // 如果没有选中任何文本则隐藏翻译框
        }
    });

    // 执行翻译的函数
    function fetchTranslation(text) {
        fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`)
            .then(response => response.json())
            .then(data => {
                const translation = data[0][0][0];
                console.log('翻译结果:', translation);  // 调试输出

                // 显示翻译结果
                showTranslation(translation);
            })
            .catch(err => console.error('翻译错误:', err));
    }

    // 显示翻译结果
    function showTranslation(translation) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0).getBoundingClientRect();
        const top = range.bottom + window.scrollY;
        const left = range.left + window.scrollX;

        translationBox.textContent = translation;
        translationBox.style.top = `${top + 20}px`;  // 翻译框放在文本下方
        translationBox.style.left = `${left}px`;
        translationBox.style.display = 'block';

        // 5秒后自动隐藏翻译框
        setTimeout(() => {
            translationBox.style.display = 'none';
        }, 5000);
    }

    // 朗读选中的文本（英文）
    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';  // 设置语言为英文
        speechSynthesis.speak(utterance);
    }
})();