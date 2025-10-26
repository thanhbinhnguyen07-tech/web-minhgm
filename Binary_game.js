// Bảng quy đổi mã nhị phân sang chữ cái và chữ số (ASCII)
const asciiTable = {
    // Chữ cái
    '01000001': 'A', '01000010': 'B', '01000011': 'C', '01000100': 'D',
    '01000101': 'E', '01000110': 'F', '01000111': 'G', '01001000': 'H',
    '01001001': 'I', '01001010': 'J', '01001011': 'K', '01001100': 'L',
    '01001101': 'M', '01001110': 'N', '01001111': 'O', '01010000': 'P',
    '01010001': 'Q', '01010010': 'R', '01010011': 'S', '01010100': 'T',
    '01010101': 'U', '01010110': 'V', '01010111': 'W', '01011000': 'X',
    '01011001': 'Y', '01011010': 'Z',
    
    // Chữ số
    '00110000': '0', '00110001': '1', '00110010': '2', '00110011': '3',
    '00110100': '4', '00110101': '5', '00110110': '6', '00110111': '7',
    '00111000': '8', '00111001': '9'
};

const words = ['HELLO', 'WORLD', 'CODE', 'GAME', 'BINARY', 'HACKER', 'COMPUTER', 'CYBER', 'FIREWALL', 'NETWORK', 'PROTOCOL', 'VIRUS', 'GREEDY', 'CLOCK'];
const charToBinary = Object.entries(asciiTable).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});

let currentWord = '';
let score = 0;
let time = 30;
let timer;

const binaryCodeElement = document.getElementById('binary-code');
const answerInput = document.getElementById('answer-input');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const messageElement = document.getElementById('message');
const gameContainer = document.querySelector('.game-container');
const cursorElement = document.querySelector('.cursor');

// Hàm tạo một thử thách mới
function generateNewChallenge() {
    answerInput.value = '';
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    
    // Chuyển từ thành chuỗi nhị phân
    let binaryString = '';
    for (let i = 0; i < currentWord.length; i++) {
        binaryString += charToBinary[currentWord[i]] + ' ';
    }
    binaryCodeElement.textContent = binaryString.trim();
    
    messageElement.textContent = '';
    answerInput.focus();
    gameContainer.classList.remove('incorrect');
}

// Hàm xử lý khi người chơi trả lời
function handleAnswer(event) {
    if (event.key === 'Enter') {
        const userAnswer = answerInput.value.toUpperCase();
        if (userAnswer === currentWord) {
            score++;
            scoreElement.textContent = score;
            messageElement.textContent = 'ACCESS GRANTED ✅';
            messageElement.className = 'correct';
            time += 5; // Thưởng thêm 5 giây
            generateNewChallenge();
        } else {
            messageElement.textContent = 'ACCESS DENIED ❌';
            messageElement.className = 'incorrect';
            gameContainer.classList.add('incorrect');
            answerInput.value = '';
        }
    }
}

// Hàm cập nhật đồng hồ
function updateTimer() {
    time--;
    timeElement.textContent = time;
    if (time <= 0 || score == 10) {
        clearInterval(timer);
        endGame();
    }
}

// Hàm kết thúc trò chơi
function endGame() {
    // Chuyển hướng đến trang lock.html và truyền điểm số qua URL
    if (score >= 10) {
        window.location.href = 'loading1.html';
    } else {
        window.location.href = 'lock.html';
    }
}

// Bắt đầu trò chơi
generateNewChallenge();
timer = setInterval(updateTimer, 1000);
answerInput.addEventListener('keydown', handleAnswer);