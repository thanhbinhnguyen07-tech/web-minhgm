// Danh sách 15 mật khẩu cho 15 màn chơi
const allPasswords = [
    "C0d3br34k3r2025",
    "Qu4ntumK3y_0710",
    "4p0ll011_L4nd1ng",
    "3n1gm4_C1ph3r",
    "G4l1l30_T3l3sc0p3",
    "Fu510nPr0t0c0l_X",
    "B1t5tr34m_M4tr1x",
    "Pr0j3ct_5t4rdu5t",
    "Cyb3rn3t1c5_C0r3",
    "43th3r1um_G4t3",
    "V01d_5c4nn3r_99",
    "Chr0n05_P4r4d0x",
    "N3xu5_P01nt_D3lt4",
    "53r4ph1m_Gu4rd14n",
    "0r10n_N3bul4_23"
];

const blankInputTrolls = [
    "Cứ để trống thế à? Hacker mà ngại gõ phím sao?",
    "Nhập gì vào đi chứ, hay là sợ thua?",
    "Bí rồi à? Hay sợ rồi?",
    "Hệ thống không tự động nhập đâu, đừng có lười thế!",
    "Ấn enter trong khi chưa nhập gì là một nghệ thuật... của sự bỏ cuộc."
];

// Thêm danh sách các ký tự đặc biệt
const specialChars = "!@#$%^&*()_+=-[]{};:'\"\\|`~";

let currentLevel = 1; // Bắt đầu từ màn 1
let attemptsLeft = 3; // Số lần nhập sai cho mỗi màn chơi
let currentPassword = ''; // Mật khẩu ngẫu nhiên cho màn chơi hiện tại

const passwordInput = document.getElementById('password-input');
const enterButton = document.getElementById('enter-button');
const errorMessage = document.getElementById('error-message');
const message = document.getElementById('message');
const passwordTitle = document.getElementById('password-title');

// Hàm lấy mật khẩu ngẫu nhiên từ danh sách
function getRandomPassword() {
    const randomIndex = Math.floor(Math.random() * allPasswords.length);
    return allPasswords[randomIndex];
}

// Hàm lấy câu troll ngẫu nhiên
function getRandomTroll() {
    const randomIndex = Math.floor(Math.random() * blankInputTrolls.length);
    return blankInputTrolls[randomIndex];
}

// Hàm xóa thông báo lỗi sau một khoảng thời gian
function clearErrorMessage() {
    setTimeout(() => {
        errorMessage.textContent = "";
    }, 2000);
}

// Hàm tạo mật khẩu đúng bằng cách ghép password ngẫu nhiên, thời gian hiện tại và một ký tự đặc biệt
function generateCorrectPassword() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const randomPass = getRandomPassword();
    const randomChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    return `${randomPass}_${hours}${minutes}${randomChar}`;
}

// Cập nhật giao diện và bắt đầu màn chơi mới
function startNewLevel() {
    currentPassword = generateCorrectPassword();
    attemptsLeft = 3; // Reset số lần thử cho màn mới

    passwordTitle.textContent = `(Màn ${currentLevel} / 15)`;
    message.textContent = "Nhập mật khẩu để tiếp tục.";
    passwordInput.value = "";
    passwordInput.disabled = false;
    enterButton.disabled = false;
    errorMessage.textContent = "";

    // Gợi ý cho người chơi biết cách nhập mật khẩu
    // Cô có thể xóa dòng này nếu muốn người chơi tự tìm ra
    console.log("Mật khẩu đúng là: " + currentPassword);
}

// Lắng nghe sự kiện click và Enter
enterButton.addEventListener('click', checkPassword);
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// Hàm kiểm tra mật khẩu và hiển thị thông điệp troll
function checkPassword() {
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === '') {
        errorMessage.textContent = getRandomTroll();
        attemptsLeft--;
        clearErrorMessage();

        if (attemptsLeft === 0) {
            errorMessage.textContent = "Hết lượt rồi, hệ thống đã khóa!";
            passwordInput.disabled = true;
            enterButton.disabled = true;
            setTimeout(() => {
                window.location.href = "lock.html";
            }, 3000);
        }
    } else if (enteredPassword === currentPassword) {
        currentLevel++;
        if (currentLevel <= 15) {
            message.textContent = `Mật khẩu hợp lệ. Hệ thống đang tải màn ${currentLevel}...`;
            setTimeout(startNewLevel, 1500);
        } else {
            message.textContent = "Chúc mừng! Bạn đã hoàn thành tất cả các màn chơi!";
            errorMessage.textContent = "";
            passwordInput.disabled = true;
            enterButton.disabled = true;
            setTimeout(() => {
                alert("ĐANG MỞ CỔNG...");
                window.location.href = "Binary_game.html";
            }, 1500);
        }
    } else {
        attemptsLeft--;
        if (attemptsLeft === 2) {
            errorMessage.textContent = "Sai rồi, " + (Math.random() > 0.5 ? "tập trung vào nào!" : "nghĩ lại đi!");
            clearErrorMessage();
        } else if (attemptsLeft === 1) {
            errorMessage.textContent = "Lần thử cuối cùng! Vẫn sai là ăn đòn đấy!";
            clearErrorMessage();
        } else if (attemptsLeft === 0) {
            errorMessage.textContent = "Quá chậm rồi, hệ thống đã khóa! Hẹn gặp lại!";
            passwordInput.disabled = true;
            enterButton.disabled = true;
            setTimeout(() => {
                window.location.href = "lock.html";
            }, 3000);
        }
    }
}

// Bắt đầu trò chơi khi trang tải xong
window.onload = startNewLevel;