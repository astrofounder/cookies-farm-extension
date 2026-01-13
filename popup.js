document.addEventListener('DOMContentLoaded', () => {
    updateStatus();
    updateLogs();

    // Refresh status and logs every second
    setInterval(() => {
        updateStatus();
        updateLogs();
    }, 1000);

    document.getElementById('startBtn').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "start" }, (response) => {
            updateStatus();
        });
    });

    document.getElementById('stopBtn').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "stop" }, (response) => {
            updateStatus();
        });
    });
});

function updateStatus() {
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
        const statusText = document.getElementById('statusText');
        if (response && response.isRunning) {
            statusText.textContent = "RUNNING";
            statusText.style.color = "green";
        } else {
            statusText.textContent = "IDLE";
            statusText.style.color = "red";
        }
    });
}

function updateLogs() {
    chrome.storage.local.get(['logs'], (result) => {
        const logContainer = document.getElementById('logContainer');
        const logs = result.logs || [];

        logContainer.innerHTML = logs.map(log =>
            `<div class="log-entry">${log}</div>`
        ).join('');
    });
}
