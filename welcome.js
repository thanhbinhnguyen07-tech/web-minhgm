const slogans = [
    "Chào mừng đến với mê cung mật mã - nơi chỉ kẻ xứng đáng mới được bước vào!",
    "Nhập sai 3 lần, MINH GM cho thở giữa màn hình tối thui!",
    "Mật mã này không dành cho người yếu tim!",
    "Hãy cẩn thận, mỗi lần nhập sai là một lần bạn tiến gần hơn đến việc bị khóa ngoài!",
    "Chỉ những ai kiên nhẫn mới có thể vượt qua mê cung này!",
    "Muốn vào? Xin mời đoán pass của MINH GM - hacker top 1 chưa chắc phá nổi!",
    "Mỗi lần nhập sai, MINH GM sẽ cười thầm trong bóng tối!",
    "Bạn có 3 cơ hội để nhập sai 😈",
    "Nếu bạn đang ở đây, bạn đang tốn thời gian của chính mình hoặc bạn đang dại dột"
];

let timer;
let isSuccess = false;
let cnt = 0;

function typewriterEffect(element, text, index, callback) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typewriterEffect(element, text, index + 1, callback), 50);
    } else if (callback) {
        callback();
    }
}

function eraseSlogan(element, callback) {
    if (element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        setTimeout(() => eraseSlogan(element, callback), 25);
    } else if (callback) {
        callback();
    }
}

function startSloganLoop() {
    if (isSuccess) {
        return;
    }
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    const sloganDisplay = document.getElementById('slogan-display');
    typewriterEffect(sloganDisplay, randomSlogan, 0, () => {
        setTimeout(() => {
            eraseSlogan(sloganDisplay, () => {
                setTimeout(startSloganLoop, 500);
            });
        }, 2000);
    });
}

const introText = "CHÀO MỪNG ĐẾN VỚI LÃNH ĐỊA CẤP CAO CỦA MINH GM";
const text = document.querySelector('.welcome-screen h1');
let index = 0;
let direction = 1;

function typeWriter() {
    text.textContent = introText.substring(0, index);
    index += direction;
    if (index > introText.length + 5 || index < -5) {
        direction *= -1;
    }
    setTimeout(typeWriter, 100);
}

const fakeButton = document.querySelectorAll('.fake-button');
fakeButton.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = "lock.html";
    });
});

const hiddenButton = document.getElementById('hidden-button');
hiddenButton.addEventListener('click', () => {
    isSuccess = true;
    clearTimeout(timer); // Đảm bảo timer được hủy bỏ
    alert("Chúc mừng bạn đã tìm thấy nút ẩn! Bạn đã vượt qua thử thách.");
    window.location.href = "loading.html"; // Chuyển hướng ngay lập tức
});

window.onload = function () {
    startSloganLoop();
    typeWriter();
    const glitchLines = document.querySelectorAll('.glitch-lines span');
    glitchLines.forEach(line => {
        line.style.setProperty('--random-factor', Math.random());
    });

    timer = setTimeout(() => {
        if (!isSuccess && cnt < 3) {
            alert("Thời gian đã hết!⏰ Hệ thống sẽ bắt đầu quá trình tự huỷ");
            alert("Hệ thống sẽ tự động làm mới trang sau 3 giây để bạn có thể thử lại.");
            alert("Ha ha, đùa thôi 🤣");
            alert("Đùa tí, gì mà căng zậy 😜");
            cnt++;
            window.location.reload();
        }
    }, 60000);
};