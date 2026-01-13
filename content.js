// Simulate human behavior
function simulateActivity() {
    const totalHeight = document.body.scrollHeight;
    let distance = 0;
    const timer = setInterval(() => {
        const scrollStep = Math.floor(Math.random() * 50) + 10;
        window.scrollBy(0, scrollStep);
        distance += scrollStep;

        if (distance >= totalHeight || distance > 3000) { // Limit scroll to avoid infinite loops on infinite scroll sites
            clearInterval(timer);
            // Scroll back up a bit sometimes
            if (Math.random() > 0.5) {
                window.scrollBy(0, -500);
            }
        }
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simulateActivity);
} else {
    simulateActivity();
}
