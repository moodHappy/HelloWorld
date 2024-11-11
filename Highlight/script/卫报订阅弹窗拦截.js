// ==UserScript==
// @name         Block The Guardian Subscription Popup (Advanced)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hide subscription popups and overlays on The Guardian website (mobile)
// @author       You
// @match        https://www.theguardian.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide popups and overlays
    function hidePopups() {
        const popupSelectors = [
            '.site-message',                 // Example class name of the popup
            '[class*="subscription"]',        // Class containing "subscription"
            '[id*="subscription"]',           // ID containing "subscription"
            '[class*="overlay"]',             // Overlay class
            '[class*="paywall"]',             // Paywall class
            'div[data-target="membership-prompt"]', // Data attribute example
            'iframe',                         // Hide iframes in case of popup ads
        ];

        // Loop through the selectors and hide matched elements
        popupSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none'; // Hide the popup instead of removing it
            });
        });
    }

    // Initial attempt to hide any popups when the page loads
    hidePopups();

    // Mutation observer to monitor DOM changes for dynamically loaded content
    const observer = new MutationObserver(() => {
        hidePopups();
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Delay the execution to ensure that popups loaded later are hidden
    setTimeout(() => {
        hidePopups();
    }, 3000); // Delay of 3 seconds (adjust if necessary)

})();