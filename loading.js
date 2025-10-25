// --- Hiệu ứng nền Matrix ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let columns;
let drops = [];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#39FF14";
    ctx.font = `${fontSize}px VT323`;

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}
setInterval(drawMatrix, 33);

// --- Hiệu ứng hiển thị dòng chữ Loading và Loading Bar ---
const loadingTextElement = document.getElementById('loading-text');
const loadingBar = document.getElementById('loading-bar');
const loadingLines = [
    "DECRYPTING PASSWORD.EXE...",
    "ACCESSING CORE SYSTEM...",
    "INITIALIZING PROTOCOL MINH-GM...",
    "ESTABLISHING SECURE CONNECTION...",
    "BYPASSING FIREWALLS...",
    "LOADING LEVEL 1..."
];
let currentLine = 0;

function showLoadingLines() {
    if (currentLine < loadingLines.length) {
        loadingTextElement.textContent = loadingLines[currentLine];
        // Cập nhật chiều rộng thanh loading
        const progress = (currentLine + 1) / loadingLines.length * 100;
        loadingBar.style.width = `${progress}%`;

        currentLine++;
        setTimeout(showLoadingLines, 1000);
    } else {
        setTimeout(() => {
            window.location.href = "game.html";
        }, 1500);
    }
}

// Bắt đầu hiệu ứng loading khi trang tải xong
window.onload = showLoadingLines;