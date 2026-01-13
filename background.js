// List of high authority domains to visit
const TARGET_SITES = [
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.facebook.com",
    "https://www.amazon.com",
    "https://www.wikipedia.org",
    "https://www.twitter.com",
    "https://www.instagram.com",
    "https://www.linkedin.com",
    "https://www.reddit.com",
    "https://www.microsoft.com",
    "https://www.pinterest.com",
    "https://www.netflix.com",
    "https://www.tumblr.com",
    "https://www.paypal.com",
    "https://www.imgur.com",
    "https://stackoverflow.com",
    "https://www.apple.com",
    "https://www.adobe.com",
    "https://www.wordpress.org",
    "https://github.com"
];

// Initialize implementation mapping for Alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "nextVisit") {
        processNextSite();
    }
});

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        logs: ["Extension Installed"],
        isRunning: false,
        currentIndex: 0,
        farmingTabId: null
    });
});

// Listen for messages from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start") {
        startFarming();
        sendResponse({ status: "started" });
    } else if (request.action === "stop") {
        stopFarming();
        sendResponse({ status: "stopped" });
    } else if (request.action === "getStatus") {
        chrome.storage.local.get(['isRunning', 'currentIndex'], (result) => {
            sendResponse({
                isRunning: result.isRunning || false,
                currentIndex: result.currentIndex || 0
            });
        });
        return true; // Keep channel open for async response
    }
});

function startFarming() {
    chrome.storage.local.get(['isRunning'], async (result) => {
        if (result.isRunning) return;

        // Shuffle sites
        shuffleArray(TARGET_SITES);

        const tab = await chrome.tabs.create({ active: false });

        chrome.storage.local.set({
            isRunning: true,
            currentIndex: 0,
            farmingTabId: tab.id
        }, () => {
            log("Starting Farming Session...");
            processNextSite();
        });
    });
}

function stopFarming() {
    chrome.storage.local.get(['farmingTabId'], (result) => {
        if (result.farmingTabId) {
            chrome.tabs.remove(result.farmingTabId).catch(() => { });
        }

        log("Farming Finished. Closing Browser...");

        chrome.storage.local.set({
            isRunning: false,
            farmingTabId: null
        }, () => {
            chrome.alarms.clear("nextVisit");
            // Close all tabs in the current window to close the profile
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const tabIds = tabs.map(tab => tab.id);
                chrome.tabs.remove(tabIds);
            });
        });
    });
}

function processNextSite() {
    chrome.storage.local.get(['isRunning', 'farmingTabId', 'currentIndex'], (data) => {
        if (!data.isRunning || !data.farmingTabId) return;

        let currentIndex = data.currentIndex || 0;

        if (currentIndex >= TARGET_SITES.length) {
            log("Cycle complete. Farming finished.");
            stopFarming();
            return;
        }

        const url = TARGET_SITES[currentIndex];
        log(`Visiting: ${url}`);

        chrome.tabs.update(data.farmingTabId, { url: url }, (tab) => {
            if (chrome.runtime.lastError) {
                log("Error updating tab: " + chrome.runtime.lastError.message);
                stopFarming();
                return;
            }

            // Inject content script for scrolling
            setTimeout(() => {
                chrome.tabs.get(data.farmingTabId, (currentTab) => {
                    if (!chrome.runtime.lastError && currentTab) {
                        chrome.scripting.executeScript({
                            target: { tabId: data.farmingTabId },
                            files: ['content.js']
                        }).catch(() => { });
                    }
                });
            }, 5000);

            // Schedule next visit using Alarms (Persistence)
            const delayInMinutes = (Math.floor(Math.random() * (45 - 15 + 1) + 15)) / 60; // Convert seconds to minutes
            chrome.alarms.create("nextVisit", { delayInMinutes: delayInMinutes });

            chrome.storage.local.set({ currentIndex: currentIndex + 1 });
        });
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function log(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `[${timestamp}] ${message}`;
    console.log(logMsg);

    chrome.storage.local.get(['logs'], (result) => {
        let logs = result.logs || [];
        logs.unshift(logMsg);
        if (logs.length > 50) logs = logs.slice(0, 50);
        chrome.storage.local.set({ logs: logs });
    });
}
