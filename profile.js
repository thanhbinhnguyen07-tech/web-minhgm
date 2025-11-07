/**
 * ===============================================
 * FILE: profile.js - ĐÃ CHỈNH SỬA CHO CÔ BÌNH
 * CHỨC NĂNG: Xử lý tất cả các hiệu ứng tương tác (Typewriter, Terminal Log, Cursor, Audio FX, Data Analyzer Tabs, Scroll Glitch, Dark Mode)
 * PHONG CÁCH: Terminal / Sci-Fi
 * ===============================================
 */

// --- KHAI BÁO BIẾN ÂM THANH TOÀN CỤC ---
let typingSoundCounterTagline = 0;
const typingSoundIntervalTagline = 4; // Phát âm thanh sau mỗi 4 ký tự cho Tagline

let typingSoundCounterLog = 0;
const typingSoundIntervalLog = 3; // Phát âm thanh sau mỗi 3 ký tự cho Terminal Log

// ===============================================
// 1. HÀM TIỆN ÍCH: PHÁT ÂM THANH (SFX)
// ===============================================
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

// ===============================================
// 2. HIỆU ỨNG: CHUYỂN ĐỔI CHẾ ĐỘ SÁNG/TỐI (Tích hợp SFX)
// ===============================================

// Khai báo biến cần thiết
const toggleButton = document.getElementById('mode-toggle');
const body = document.body;

// Kiểm tra trạng thái đã lưu
const savedMode = localStorage.getItem('darkMode');
if (savedMode === 'enabled') {
    body.classList.add('dark-mode');
    if (toggleButton) {
        toggleButton.innerText = 'Chuyển sang Light Mode ☀️';
    }
}

function toggleDarkMode() {
    // === BỔ SUNG: PHÁT ÂM THANH XÁC NHẬN NGAY KHI CLICK ===
    playSFX('audio-confirm');
    // =======================================================

    if (!toggleButton) return;

    // 1. TẠO HOẶC TÌM LỚP PHỦ GLITCH
    let glitchOverlay = document.querySelector('.glitch-overlay');
    if (!glitchOverlay) {
        glitchOverlay = document.createElement('div');
        glitchOverlay.classList.add('glitch-overlay');
        document.body.appendChild(glitchOverlay);
    }

    // 2. KÍCH HOẠT HIỆU ỨNG GLITCH
    glitchOverlay.classList.add('active');

    // 3. CHỜ GLITCH CHẠY XONG (300ms) ĐỂ CHUYỂN ĐỔI MÀU NỀN
    setTimeout(() => {

        // CHUYỂN ĐỔI CLASS VÀ LƯU TRẠNG THÁI
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');

        if (isDark) {
            localStorage.setItem('darkMode', 'enabled');
            toggleButton.innerText = 'Chuyển sang Light Mode ☀️';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            toggleButton.innerText = 'Chuyển sang Dark Mode 🌙';
        }

        // 4. TẮT HIỆU ỨNG GLITCH (Sau khi chuyển đổi màu)
        glitchOverlay.classList.remove('active');

    }, 300); // Thời gian chờ bằng thời gian animation glitch (0.3s)
}

// GẮN SỰ KIỆN CLICK VÀO HÀM (Cần đảm bảo nút tồn tại)
if (toggleButton) {
    toggleButton.addEventListener('click', toggleDarkMode);
}

// ===============================================
// 3. HIỆU ỨNG: THANH KỸ NĂNG (SKILL BARS)
// ===============================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');

    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');

                setTimeout(() => {
                    bar.style.width = level + '%';
                }, 10);

                observer.unobserve(bar);
            }
        });
    }, {
        threshold: 0.1
    });

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// ===============================================
// 4. HIỆU ỨNG: TYPEWRITER CHO TAGLINE
// ===============================================
function typeWriterEffect() {
    const taglineElement = document.getElementById('typewriter-tagline') || document.getElementById('tagline'); // Bổ sung ID 'tagline'
    if (!taglineElement) return;

    const taglines = [
        '"Thánh Diệt BUG · Kẻ Phá Giới Hạn · Trùm Giải Thuật Toán"',
        '"Code Is Poetry · Logic Is Power"',
        '"Hệ thống đang hoạt động... · ONLINE"',
        '"Debugging Master · Algorithm Conqueror"',
        '"From Zero to Hero in Coding"',
        '"Scripting My Way to Success"',
        '"Building Dreams with Code"',
        '"Coding the Future, One Line at a Time"',
        '"Think Twice, Code Once"'
    ];

    let taglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseTime = 1500;

    function updateCaretColor() {
        let isDarkMode = document.body.classList.contains('dark-mode');
        let caretColor = isDarkMode ? '#3498db' : '#2ecc71';
        taglineElement.style.borderRight = `.15em solid ${caretColor}`;
    }

    function loop() {
        const currentText = taglines[taglineIndex % taglines.length];

        if (isDeleting) {
            taglineElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                taglineIndex++;
                taglineElement.style.animation = `blink-caret .75s step-end infinite`;
                setTimeout(loop, pauseTime / 2);
            } else {
                setTimeout(loop, deletingSpeed);
            }

        } else {
            taglineElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            taglineElement.style.width = '100%';

            // LOGIC PHÁT ÂM THANH TAGLINE
            if (charIndex < currentText.length) {
                typingSoundCounterTagline++;
                if (typingSoundCounterTagline % typingSoundIntervalTagline === 0) {
                    playSFX('audio-typing');
                }
            }


            if (charIndex === currentText.length) {
                isDeleting = true;
                typingSoundCounterTagline = 0; // Reset bộ đếm
                taglineElement.style.animation = `blink-caret .75s step-end infinite`;
                setTimeout(loop, pauseTime);
            } else {
                taglineElement.style.animation = 'none';
                setTimeout(loop, typingSpeed);
            }
        }
        updateCaretColor();
    }

    loop();

    // Cần đảm bảo rằng màu con trỏ cũng đổi khi Dark/Light Mode được bật
    document.getElementById('mode-toggle')?.addEventListener('click', () => {
        setTimeout(updateCaretColor, 100);
    });
}

// ===============================================
// 5. HIỆU ỨNG: TERMINAL LOG TỰ ĐỘNG LẶP LẠI (SELF-HEALING)
// ===============================================
function typeLogEffect() {
    const logElement = document.getElementById('project-terminal-log');
    if (!logElement) return;

    // Các dòng Log gốc
    const initialLogLines = [
        "> Initiating ProjectLog.exe...",
        "[INFO] System Status: ONLINE",
        "[1] Web Profile - Personal ID Matrix. (Status: ONLINE)",
        "[2] Game Clicker - High-speed transaction simulation. (Status: ARCHIVED)",
        "[3] Web Troll - Automated security testing tool. (Status: ONLINE)",
        "[SUCCESS] Log execution complete. Waiting for command."
    ];

    // Các dòng Log Tự Sửa Lỗi và Khởi động lại
    const selfHealLogLines = [
        "> Initiating Self-Check.exe...",
        "[WARNING] Protocol Deviation Detected: 0x4A2F01",
        "[ERROR] Memory Leak Detected (Level 3): System Integrity Compromised.",
        "[FIXING] Re-routing data streams... (Patching vulnerability)",
        "[SUCCESS] Protocol Restored. Resuming Log Feed."
    ];

    // Kết hợp các dòng Log lại để tạo thành chuỗi lặp (GỐC -> SỬA LỖI -> GỐC)
    const fullLogText = [...initialLogLines, ...selfHealLogLines].join('\n');

    logElement.textContent = fullLogText;

    let isDeleting = false;
    let charIndex = 0;

    // Tinh chỉnh tốc độ để quá trình sửa lỗi có vẻ gấp gáp hơn
    const typingSpeed = 30;
    const deletingSpeed = 10;
    const pauseTime = 3500; // Tạm dừng lâu hơn để người dùng đọc được thông báo lỗi
    const cursorAnimation = `terminal-blink-caret .75s step-end infinite`;

    function loopLog() {
        const currentText = fullLogText;

        if (!isDeleting && charIndex < currentText.length) {
            logElement.style.animation = 'none';
        } else {
            logElement.style.animation = cursorAnimation;
        }

        // 1. CHẾ ĐỘ XÓA
        if (isDeleting) {
            logElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                // Ngừng ngắn hơn sau khi xóa xong để bắt đầu gõ lại
                setTimeout(loopLog, pauseTime / 4);
            } else {
                setTimeout(loopLog, deletingSpeed);
            }

            // 2. CHẾ ĐỘ ĐÁNH MÁY
        } else {
            logElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;

            // LOGIC PHÁT ÂM THANH TERMINAL LOG
            if (charIndex < currentText.length) {
                typingSoundCounterLog++;
                if (typingSoundCounterLog % typingSoundIntervalLog === 0) {
                    playSFX('audio-typing');
                }
            }

            if (charIndex === currentText.length) {
                isDeleting = true;
                typingSoundCounterLog = 0; // Reset bộ đếm
                // Tạm dừng LÂU hơn để người dùng đọc thông báo "Protocol Restored"
                setTimeout(loopLog, pauseTime);
            } else {
                setTimeout(loopLog, typingSpeed);
            }
        }
    }

    // Bắt đầu vòng lặp sau 1s
    setTimeout(loopLog, 1000);
}

// ===============================================
// 6. HIỆU ỨNG: CUSTOM TERMINAL CURSOR
// ===============================================
function customCursorEffect() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', e => {
        requestAnimationFrame(() => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    });

    const interactiveElements = 'a, button, input, .skill-item, .project-log-section, .encrypted-data-block, #mode-toggle'; // Thay .mode-toggle-btn bằng #mode-toggle
    const body = document.body;

    document.querySelectorAll(interactiveElements).forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
            body.classList.remove('cursor-active');
        });
    });
}

// ===============================================
// 7. HIỆU ỨNG: DATA ANALYZER TABS (ĐÃ BỎ SFX)
// ===============================================
function dataAnalyzerTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const glitchDuration = 50;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // playSFX('audio-confirm'); <--- ĐÃ LOẠI BỎ THEO YÊU CẦU CÔ BÌNH

            const targetTabId = button.dataset.tab;
            const currentActivePane = document.querySelector('.tab-pane.active');
            const targetPane = document.getElementById(targetTabId);

            if (currentActivePane) {
                currentActivePane.classList.add('glitch-active');

                setTimeout(() => {
                    currentActivePane.classList.remove('glitch-active');

                    document.querySelector('.tab-button.active').classList.remove('active');
                    currentActivePane.classList.remove('active');

                    button.classList.add('active');
                    targetPane.classList.add('active');

                }, glitchDuration);
            }
        });
    });
}

// ===============================================
// 8. HIỆU ỨNG: GIÁN ĐOẠN DỮ LIỆU KHI SCROLL
// ===============================================
function dataGlitchOnScrollEffect() {
    const sections = document.querySelectorAll('.section-container');
    if (sections.length === 0) return;

    let scrollTimeout;
    const glitchDuration = 100;

    document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);

        sections.forEach(section => {
            section.classList.add('glitch-active');
            section.style.animation = `section-glitch-jitter 0.05s infinite alternate`;

            let overlay = section.querySelector('.glitch-on-scroll-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.classList.add('glitch-on-scroll-overlay');
                section.appendChild(overlay);
            }
        });

        scrollTimeout = setTimeout(() => {
            sections.forEach(section => {
                section.classList.remove('glitch-active');
                section.style.animation = '';
            });
        }, glitchDuration);
    });
}
// ===============================================
// 8. HIỆU ỨNG: PHẢN HỒI TRẠNG THÁI HỆ THỐNG (JIGGLE)
// ===============================================
function systemFeedbackEffect() {
    const body = document.body;
    // Danh sách các phần tử đã được đánh dấu là có tương tác (interactive)
    const interactiveElementsSelector = 'a, button, input, .skill-item, .tab-button, #mode-toggle';
    const glitchDuration = 150; // Thời gian chạy animation Jiggle

    document.addEventListener('click', (e) => {
        // Kiểm tra xem phần tử được click CÓ PHẢI là phần tử tương tác không.
        const isInteractive = e.target.closest(interactiveElementsSelector);

        // Nếu không phải là phần tử tương tác, hệ thống sẽ "từ chối" lệnh
        if (!isInteractive) {
            // 1. Phát âm thanh từ chối (SFX Denied - Cô cần chuẩn bị audio-denied)
            playSFX('audio-denied'); // Giả định ID âm thanh Denied

            // 2. Kích hoạt hiệu ứng rung lắc nhẹ lên Body
            body.classList.add('jiggle-active');

            // 3. Tắt hiệu ứng sau thời gian chạy animation
            setTimeout(() => {
                body.classList.remove('jiggle-active');
            }, glitchDuration);
        }
    });
}
// ===============================================
// 10. HIỆU ỨNG: NGHIÊNG 3D THEO VÙNG (ĐÃ TỐI ƯU CÔ LẬP KHỐI)
// ===============================================
function tiltEffect() {
    // 1. Chỉ định các phần tử sẽ áp dụng hiệu ứng (Cô có thể tùy chỉnh)
    // Em chọn một số class phổ biến trên các khối nội dung lớn:
    const TILT_TARGET_SELECTOR = '.project-log-section';
    const tiltTargets = document.querySelectorAll(TILT_TARGET_SELECTOR);

    if (tiltTargets.length === 0) return;

    // Cài đặt mức độ nghiêng (Giữ ở mức vừa phải để đảm bảo chữ không tràn)
    const maxTilt = 5;     // Giảm xuống 5 độ (từ 8 độ)
    const perspective = 700; // Giảm độ sâu phối cảnh

    tiltTargets.forEach(target => {
        let frameId = null; // frameId riêng cho từng phần tử

        // ----------------------------------------------------
        // HÀM 1: KÍCH HOẠT VÀ TÍNH TOÁN (ĐƯỢC GỌI KHI MOUSEMOVE)
        // ----------------------------------------------------
        function updateTilt(event) {
            // Sử dụng event.currentTarget để đảm bảo chúng ta luôn làm việc 
            // với phần tử mà event listener được gắn (chính là 'target')
            const currentTarget = event.currentTarget;

            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                const rect = currentTarget.getBoundingClientRect();

                // Tính toán vị trí chuột so với TRUNG TÂM của khối đang di chuột
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const mouseX = (event.clientX - centerX) / (rect.width / 2);
                const mouseY = (event.clientY - centerY) / (rect.height / 2);

                // Tính toán góc nghiêng
                const rotateY = -mouseX * maxTilt;
                const rotateX = mouseY * maxTilt;

                // Áp dụng CSS Transform 3D
                currentTarget.style.transition = 'none'; // Tắt transition trong quá trình di chuyển
                currentTarget.style.transform = `
                    perspective(${perspective}px) 
                    rotateX(${rotateX.toFixed(2)}deg) 
                    rotateY(${rotateY.toFixed(2)}deg)
                `;
            });
        }

        // ----------------------------------------------------
        // HÀM 2: RESET (khi chuột rời khỏi khối)
        // ----------------------------------------------------
        function resetTilt() {
            if (frameId) {
                cancelAnimationFrame(frameId);
                frameId = null;
            }

            // Kích hoạt transition MƯỢT MÀ để khối quay về vị trí 0,0,0
            target.style.transition = 'transform 0.4s ease-out';
            target.style.transform = 'none';

            // Tắt transition sau khi hoàn thành
            setTimeout(() => {
                target.style.transition = 'none';
            }, 400);
        }

        // 3. Gắn sự kiện LẮNG NGHE ĐỘC LẬP CHO TỪNG PHẦN TỬ
        target.addEventListener('mousemove', updateTilt);
        target.addEventListener('mouseleave', resetTilt);

        // Thiết lập CSS 3D ban đầu
        target.style.transformStyle = 'preserve-3d';
    });
}
// ===============================================
// 11. LOGIC GAME C++: LOAD DỮ LIỆU, HIỂN THỊ & KIỂM TRA
// ===============================================

// Khai báo các biến DOM cần thiết cho game (giả định các ID này sẽ được thêm vào HTML)
let challengesData = [];
let currentChallenge = null; // Biến lưu trữ thử thách hiện tại
// --- CHANGED: Don't query DOM at top-level (elements may not exist yet) ---
let challengeModal = null;
let challengeContainer = null;
let challengeInput = null;
let resultElement = null;

// --- HÀM 1: LOAD DỮ LIỆU TỪ JSON (Chạy 1 lần khi trang tải) ---
async function loadChallenges() {
    try {
        const response = await fetch('c_plus_plus_challenges.json'); // Thay tên file nếu cần
        challengesData = await response.json();
        console.log("C++ Challenges Loaded:", challengesData.length);

        // Gán sự kiện cho Nút Thử Thách Khác (nếu tồn tại)
        const nextBtn = document.getElementById('next-challenge-btn');
        if (nextBtn) {
            // Đảm bảo nút này gọi hàm loadRandomChallenge()
            nextBtn.addEventListener('click', loadRandomChallenge);
        }
    } catch (error) {
        console.error("Lỗi: Không thể tải dữ liệu thử thách C++:", error);
        if (challengeContainer) challengeContainer.textContent = "// LỖI HỆ THỐNG: KHÔNG TẢI ĐƯỢC DỮ LIỆU C++.";
    }
}

// --- HÀM 2: CHỌN VÀ HIỂN THỊ THỬ THÁCH NGẪU NHIÊN ---
function loadRandomChallenge() {
    if (challengesData.length === 0) {
        if (resultElement) resultElement.textContent = 'Hệ thống đang tải dữ liệu...';
        return;
    }

    // 1. CHỌN NGẪU NHIÊN VÀ CẬP NHẬT BIẾN TOÀN CỤC
    const randomIndex = Math.floor(Math.random() * challengesData.length);
    currentChallenge = challengesData[randomIndex];

    // 2. CẬP NHẬT GIAO DIỆN
    if (challengeContainer) {
        challengeContainer.textContent = currentChallenge.code_snippet;
    }

    // 3. RESET FORM & KẾT QUẢ
    if (challengeInput) challengeInput.value = '';
    if (resultElement) {
        // Reset kết quả về trạng thái ban đầu
        resultElement.innerHTML = 'Nhập đáp án và click "Chạy Code"';
        resultElement.classList.remove('correct', 'incorrect');
    }

    // Kích hoạt âm thanh tải mới
    playSFX('audio-typing');
}

// --- HÀM 3: XỬ LÝ KÍCH HOẠT POP-UP (Gắn vào HTML C++ Skill) ---
function openCppChallenge() {
    if (challengeModal) {
        challengeModal.style.display = 'block';

        // Tải thử thách ngẫu nhiên lần đầu tiên mở Pop-up (hoặc nếu chưa có)
        if (!currentChallenge) {
            loadRandomChallenge();
        }
        // Kích hoạt hiệu ứng Glitch nhẹ khi mở Pop-up
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 300);
        }
    }
}

// --- HÀM 4: ĐÓNG POP-UP ---
function closeCppChallenge() {
    if (challengeModal) {
        challengeModal.style.display = 'none';
        // Tùy chọn: Reset lại trạng thái hoặc chỉ đơn giản là ẩn đi
    }
}

// --- HÀM 5: KIỂM TRA ĐÁP ÁN (LOGIC CHỦ YẾU DỰA VÀO JSON) ---
function checkAnswer() {
    if (!currentChallenge) {
        if (resultElement) resultElement.textContent = 'Lỗi: Không tìm thấy thử thách.';
        return;
    }

    const userAnswer = challengeInput.value.trim();
    // Chuyển đáp án về dạng chữ thường và loại bỏ khoảng trắng để so sánh linh hoạt
    const correctAnswer = String(currentChallenge.correct_answer).trim().toLowerCase();
    const normalizedUserAnswer = userAnswer.toLowerCase();

    // Phát âm thanh xác nhận trước khi kiểm tra
    playSFX('audio-confirm');

    if (normalizedUserAnswer === correctAnswer) {
        // ĐÚNG
        resultElement.classList.remove('incorrect');
        resultElement.classList.add('correct');
        resultElement.innerHTML = '✅ **CHÍNH XÁC!** Tư duy logic C++ 95% của bạn thật sự đỉnh cao!';
    } else {
        // SAI
        resultElement.classList.remove('correct');
        resultElement.classList.add('incorrect');
        resultElement.innerHTML = `❌ **RẤT TIẾC!** Đáp án đúng là: ${currentChallenge.correct_answer}. <br> Gợi ý: ${currentChallenge.explanation}`;
    }

    // Kích hoạt hiệu ứng rung nhẹ (jiggle) để phản hồi kết quả
    const modalContent = document.getElementById('cpp-modal-content'); // Giả định ID phần nội dung
    if (modalContent) {
        modalContent.classList.add('jiggle-active');
        setTimeout(() => {
            modalContent.classList.remove('jiggle-active');
        }, 300);
    }
}


// ===============================================
// === CẬP NHẬT HÀM KHỞI TẠO CHÍNH (window.onload) ===
// ===============================================
window.onload = function () {
    // --- NEW: query DOM elements after load so they are found ---
    challengeModal = document.getElementById('cpp-modal');
    challengeContainer = document.getElementById('challenge-code');
    challengeInput = document.getElementById('challenge-answer-input');
    resultElement = document.getElementById('challenge-result');

    // 1. Phát Âm thanh Khởi động Hệ thống
    playSFX('audio-boot');

    // ** LÔ GIC GAME C++ MỚI (CHẠY NGAY TỪ ĐẦU) **
    loadChallenges();

    // 2. Kích hoạt các hiệu ứng tương tác
    animateSkillBars();
    typeWriterEffect();
    typeLogEffect();
    customCursorEffect();
    dataAnalyzerTabs();
    dataGlitchOnScrollEffect();
    systemFeedbackEffect();
    tiltEffect();
};