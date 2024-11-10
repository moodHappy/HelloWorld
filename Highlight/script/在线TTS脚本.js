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

// 初级版

// ==UserScript==
// @name         自动TTS播放选中文本（适配移动端）
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  选中文本时自动发音，支持移动端 Kiwi 浏览器
// @author       You
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

    // 监听文本选择事件
    function setupTextSelectionListener() {
        // 监听鼠标松开事件或触摸结束事件（移动端）
        document.addEventListener('selectionchange', function() {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                playTTS(selectedText); // 选中后触发TTS播放
            }
        });
    }

    // 初始化
    setupTextSelectionListener();

})();