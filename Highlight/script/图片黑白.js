// ==UserScript==
// @name         Mobile Grayscale Images (Shadow DOM Solution)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Use Shadow DOM to enforce grayscale on all images
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (window.innerWidth <= 768) {
        document.querySelectorAll('img').forEach(img => {
            const wrapper = document.createElement('div');
            const shadow = wrapper.attachShadow({ mode: 'open' });

            // Clone the image inside the Shadow DOM
            const clonedImg = img.cloneNode();
            shadow.appendChild(clonedImg);

            // Apply styles inside the Shadow DOM
            const style = document.createElement('style');
            style.textContent = `
                img {
                    filter: grayscale(100%) !important;
                }
            `;
            shadow.appendChild(style);

            // Replace the original image with the Shadow DOM wrapper
            img.replaceWith(wrapper);
        });
    }
})();