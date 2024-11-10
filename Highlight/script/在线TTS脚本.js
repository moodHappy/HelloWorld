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