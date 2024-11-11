// ==UserScript==
// @name         滑动查词功能（移动端友好）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过滑动选中文字触发查词，避免与其他绑定事件冲突。
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 使用 Cambridge Dictionary 的 URL 模板
    const dictionaryURL = 'https://dictionary.cambridge.org/dictionary/english-chinese-simplified/';

    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;

    // 监听触摸开始事件
    document.body.addEventListener('touchstart', function(event) {
        touchStartY = event.changedTouches[0].screenY; // 获取触摸起始位置
        touchStartTime = Date.now(); // 记录触摸开始时间
    });

    // 监听触摸结束事件
    document.body.addEventListener('touchend', function(event) {
        touchEndY = event.changedTouches[0].screenY; // 获取触摸结束位置

        // 判断滑动的距离是否超过设定阈值
        const swipeDistance = Math.abs(touchEndY - touchStartY);
        const swipeDuration = Date.now() - touchStartTime;

        // 判断是否是上下滑动并且滑动距离大于30px
        if (swipeDistance > 30 && swipeDuration < 500) {
            let selectedText = window.getSelection().toString().trim();
            if (selectedText) {
                window.open(dictionaryURL + encodeURIComponent(selectedText), '_blank');
            }
        }
    });
})();