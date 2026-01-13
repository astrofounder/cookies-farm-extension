# 🍪 Cookies Farm - Browser Profile Warmer

**Cookies Farm** is a Chrome Extension designed to automate "warming up" browser profiles. It simulates human-like browsing activity on high-authority websites to build a credible history and cookies profile. This is useful for anti-detect browsers or maintaining "trust scores" on various platforms.

## ✨ Features

*   **Automated Navigation**: Automatically visits a curated list of high-trust websites (Google, Facebook, Amazon, Reddit, etc.).
*   **Human-Like Behavior**:
    *   **Random Delays**: Waits randomly between 15-45 seconds on each site.
    *   **Smart Scrolling**: Simulates mouse scrolling activity to mimic active reading.
*   **Auto-Start**: Can be configured to run automatically when the browser opens (`onStartup`).
*   **Background Operation**: Runs quietly in a background tab.

## 🚀 Installation

Since this is a custom tool, you need to install it in **Developer Mode**:

1.  Clone or download this repository.
2.  Open Chrome/Chromium browser.
3.  Go to `chrome://extensions`.
4.  Toggle **Developer mode** (top right corner).
5.  Click **Load unpacked**.
6.  Select the folder containing this extension (`Extension Cookies Robot`).

## 🎮 Usage

1.  **Start Farming**:
    *   Click the extension icon 🍪 in the toolbar.
    *   Click **Start Now**.
    *   A new tab will open and begin visiting websites. You can minimize this window but keep the browser open.
2.  **Stop**:
    *   Click **Stop** in the popup menu.
3.  **Status**:
    *   The popup shows whether the "farmer" is currently RUNNING or IDLE.

## ⚠️ Disclaimer

This tool is for educational and testing purposes only. Automated browsing may violate the Terms of Service of certain websites. Use responsibly and at your own risk. The author is not responsible for any account bans or restrictions.

## 🛠️ Tech Stack

*   **Manifest V3**: Compliant with the latest Chrome Extension standards.
*   **Vanilla JS**: No frameworks, lightweight and fast.
