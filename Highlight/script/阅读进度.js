// ==UserScript==
// @name         阅读进度
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动保存网页的阅读进度并在下次访问时恢复到离开的地方
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    const currentUrl = window.location.href;

    // 检查本地存储是否有保存的阅读进度
    const savedScrollPosition = localStorage.getItem(currentUrl);

    // 如果有保存的进度，则恢复到保存的位置
    if (savedScrollPosition) {
        window.scrollTo(0, savedScrollPosition);
    }

    // 每次页面滚动时保存当前的滚动位置
    window.addEventListener('scroll', function() {
        localStorage.setItem(currentUrl, window.scrollY);
    });
})();