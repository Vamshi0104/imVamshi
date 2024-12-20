document.addEventListener('DOMContentLoaded', function () {
    const resumeLink = document.getElementById('resumeLink');
    const resumeLink1 = document.getElementById('resumeLink1');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progressContainer = document.getElementById('progress-container');
    const notification = document.getElementById('notification');
    let clickTimer = null;

    resumeLink.addEventListener('click', function (e) {
        e.preventDefault();

        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                window.open(resumeLink.href, '_blank');
                clickTimer = null;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            startDownloadSimulation(resumeLink.href);
        }
    });

    resumeLink1.addEventListener('click', function (e) {
        e.preventDefault();

        if (clickTimer === null) {
            clickTimer = setTimeout(() => {
                window.open(resumeLink1.href, '_blank');
                clickTimer = null;
            }, 300);
        } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            startDownloadSimulation(resumeLink1.href);
        }
    });

    function startDownloadSimulation(url) {
        progressContainer.style.display = 'block';
        let width = 0;
        const interval = setInterval(() => {
            width += 10;
            progressBar.style.width = width + '%';
            progressText.innerText = width + '%';
            if (width >= 100) {
                clearInterval(interval);
                progressContainer.style.display = 'none';
                showNotification();
                // Simulate the actual file download after progress completes
                const link = document.createElement('a');
                link.href = url;
                link.download = 'RESUME-VAMSHI_KRISHNA_MADHAVAN.pdf';
                link.click();
            }
        }, 100); // Increase width by 10% every 100ms
    }

    function showNotification() {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});