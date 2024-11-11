// ==UserScript==
// @name         阅读进度指示器（移动端友好）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在页面顶部添加一个进度条，显示你当前阅读的进度，不干扰阅读体验。
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 添加进度条的样式
    GM_addStyle(`
        #reading-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 5px;
            background-color: #3b82f6;
            z-index: 9999;
            transition: width 0.25s ease;
        }
    `);

    // 创建并插入进度条
    let progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    // 计算页面滚动的百分比
    function updateProgressBar() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        let documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let progress = (scrollTop / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    }

    // 在页面滚动时更新进度条
    window.addEventListener('scroll', updateProgressBar);

})();