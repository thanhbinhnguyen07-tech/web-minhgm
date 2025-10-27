document.addEventListener('DOMContentLoaded', () => {
    // --- Các biến cần thiết ---
    const realButton = document.getElementById('real-button');
    const fakeButton = document.getElementById('fake-button');
    const scoreDisplay = document.getElementById('score-display');
    const timerDisplay = document.getElementById('timer-display');
    const gameContainer = document.querySelector('.game-container');
    const overlay = document.getElementById('overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlayButton = document.getElementById('overlay-button');
    let score = 0;
    let timer = 60;
    let timerInterval;

    const gameWidth = window.innerWidth - 150; // Trừ đi chiều rộng của nút để nút không bị ra ngoài màn hình
    const gameHeight = window.innerHeight - 150; // Trừ đi chiều cao của nút

    // --- Các hàm xử lý logic ---
    const moveButtons = () => {
        const randomX1 = Math.random() * gameWidth;
        const randomY1 = Math.random() * gameHeight;
        const randomX2 = Math.random() * gameWidth;
        const randomY2 = Math.random() * gameHeight;

        realButton.style.left = `${randomX1}px`;
        realButton.style.top = `${randomY1}px`;
        fakeButton.style.left = `${randomX2}px`;
        fakeButton.style.top = `${randomY2}px`;
    };

    const updateScore = () => {
        scoreDisplay.innerText = `Điểm: ${score}`;
    };

    const updateTimer = () => {
        timerDisplay.innerText = `Thời gian: ${timer}s`;
    };

    const endGame = () => {
        clearInterval(timerInterval);
        gameContainer.style.pointerEvents = 'none'; // Vô hiệu hóa click

        if (score <= -500 || score >= 100) {
            overlayText.innerText = "Chúc mừng bạn đã vượt qua thử thách!";
            overlayText.style.color = '#34d399'; // Màu xanh lá
            overlay.classList.remove('hidden');
            // Chuyển hướng đến màn hình mật khẩu sau 3s
            setTimeout(() => {
                window.location.href = 'password.html'; // Sếp thay tên file cho đúng nhé
            }, 3000);
        } else {
            overlayText.innerText = "Bạn chưa đủ trình! Chơi lại đi!";
            overlayText.style.color = '#dc2626'; // Màu đỏ
            overlay.classList.remove('hidden');
            overlayButton.classList.remove('hidden');
        }
    };

    const resetGame = () => {
        score = 1;
        timer = 60;
        updateScore();
        updateTimer();
        moveButtons();
        realButton.style.transform = 'scale(1)';
        overlay.classList.add('hidden');
        overlayButton.classList.add('hidden');
        gameContainer.style.pointerEvents = 'auto'; // Cho phép click lại
        startTimer();
    };

    const startTimer = () => {
        timerInterval = setInterval(() => {
            timer--;
            updateTimer();
            if (timer <= 0) {
                endGame();
            }
        }, 1000);
    };
    // --- CÁC "CÔNG TẮC" MỚI THÊM VÀO ĐỂ BẮT ĐẦU TRÒ CHƠI ---

    // Khởi động trò chơi khi trang tải xong
    moveButtons();
    startTimer();

    // Lắng nghe sự kiện click trên các nút và màn hình
    realButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài body
        score++;
        updateScore();
        realButton.style.transform = `scale(${1 - score * 0.01})`; // Thu nhỏ nút thật
        moveButtons();
    });

    fakeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài body
        score--;
        updateScore();
        moveButtons();
    });

    document.body.addEventListener('click', () => {
        score--;
        updateScore();
    });

    overlayButton.addEventListener('click', () => {
        resetGame();
    });
});