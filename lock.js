function playSFX(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        // Reset audio để nó có thể phát lại ngay lập tức
        audio.currentTime = 0;
        audio.play().catch(e => {
            // Ngăn lỗi Autoplay thường xảy ra trên trình duyệt
        });
    }
}
window.onload = function () {
    playSFX('audio-denied');
};
const returnButton = document.getElementById('return-button');
returnButton.addEventListener('click', () => {
    window.location.href = "welcome.html";
});