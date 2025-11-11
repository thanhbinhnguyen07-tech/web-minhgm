/**
 * ===============================================
 * FILE: profile.js - ĐÃ SỬA LỖI VÀ HOÀN THIỆN (FULL FEATURES)
 * CHỨC NĂNG: Xử lý tất cả các hiệu ứng tương tác + LOGIC 100 SAO VÀ GAME PYTHON
 * PHONG CÁCH: Terminal / Sci-Fi
 * ===============================================
 */

// --- KHAI BÁO BIẾN ÂM THANH & LOGIC GAME TOÀN CỤC ---
let typingSoundCounterTagline = 0;
const typingSoundIntervalTagline = 4;
let typingSoundCounterLog = 0;
const typingSoundIntervalLog = 3;

// === BIẾN LOGIC GAME PYTHON & STAR COUNTER ===
let cppChallengesData = [];
let pythonChallengesData = [];
let currentCppChallenge = null;
let currentPythonChallenge = null;
let starCount = parseInt(localStorage.getItem('starCount')) || 0; // Lấy số sao đã lưu
let lastResetDate = localStorage.getItem('lastResetDate');
const maxStars = 100;

// === KHAI BÁO CÁC PHẦN TỬ DOM (sẽ được gán trong window.onload) ===
let starCountElement = null; // Hiển thị số sao

// C++ Modal Elements
let cppChallengeModal = null;
let cppChallengeContainer = null;
let cppChallengeInput = null;
let cppResultElement = null;
let cppNextBtn = null;

// Python Modal Elements
let pythonChallengeModal = null;
let pythonChallengeContainer = null;
let pythonChallengeInput = null;
let pythonResultElement = null;


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
// 2. LOGIC MỚI: HỆ THỐNG STAR COUNTER
// ===============================================

// --- HÀM 1: CẬP NHẬT GIAO DIỆN SAO ---
function updateStarDisplay() {
    if (starCountElement) {
        starCountElement.textContent = starCount;
    }
}

// --- HÀM 2: CỘNG SAO (Được gọi khi trả lời đúng) ---
function addStar(count = 1) {
    if (starCount < maxStars) {
        starCount += count;
        // Giới hạn không vượt quá 100
        if (starCount > maxStars) {
            starCount = maxStars;
        }
        localStorage.setItem('starCount', starCount);
        updateStarDisplay();
        
        // Thêm hiệu ứng đặc biệt khi thu thập sao (ví dụ: rung nhẹ)
        const scoreDisplay = document.querySelector('.score-display');
        if (scoreDisplay) {
            scoreDisplay.classList.add('jiggle-active'); // Giả định có class CSS jiggle-active
            setTimeout(() => {
                scoreDisplay.classList.remove('jiggle-active');
            }, 300);
        }
    }
}


// ===============================================
// 3. HIỆU ỨNG: CHUYỂN ĐỔI CHẾ ĐỘ SÁNG/TỐI (Tích hợp SFX)
// ===============================================

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
// 4. HIỆU ỨNG: THANH KỸ NĂNG (SKILL BARS)
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
// 5. HIỆU ỨNG: TYPEWRITER CHO TAGLINE
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
// 6. HIỆU ỨNG: TERMINAL LOG TỰ ĐỘNG LẶP LẠI (SELF-HEALING)
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

    // logElement.textContent = fullLogText; // Không hiển thị ngay mà chờ typewriter

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
// 7. HIỆU ỨNG: CUSTOM TERMINAL CURSOR
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

    const interactiveElements = 'a, button, input, .skill-item, .project-log-section, .encrypted-data-block, #mode-toggle, .tab-button';
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
// 8. HIỆU ỨNG: DATA ANALYZER TABS
// ===============================================
function dataAnalyzerTabs() {
const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const glitchDuration = 50;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // playSFX('audio-confirm'); <--- Sếp có thể bỏ comment nếu muốn có SFX

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
// 9. HIỆU ỨNG: GIÁN ĐOẠN DỮ LIỆU KHI SCROLL
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
// 10. HIỆU ỨNG: PHẢN HỒI TRẠNG THÁI HỆ THỐNG (JIGGLE)
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
// 11. HIỆU ỨNG: NGHIÊNG 3D THEO VÙNG (TILT EFFECT)
// ===============================================
function tiltEffect() {
    const TILT_TARGET_SELECTOR = '.project-log-section, .skill-item'; // Thêm .skill-item
    const tiltTargets = document.querySelectorAll(TILT_TARGET_SELECTOR);

    if (tiltTargets.length === 0) return;

    const maxTilt = 5;
    const perspective = 700;

    tiltTargets.forEach(target => {
        let frameId = null;

        function updateTilt(event) {
            const currentTarget = event.currentTarget;

            if (frameId) {
                cancelAnimationFrame(frameId);
            }

            frameId = requestAnimationFrame(() => {
                const rect = currentTarget.getBoundingClientRect();

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const mouseX = (event.clientX - centerX) / (rect.width / 2);
                const mouseY = (event.clientY - centerY) / (rect.height / 2);

                const rotateY = -mouseX * maxTilt;
                const rotateX = mouseY * maxTilt;

                currentTarget.style.transition = 'none';
                currentTarget.style.transform = `perspective(${perspective}px) 
                    rotateX(${rotateX.toFixed(2)}deg) 
                    rotateY(${rotateY.toFixed(2)}deg)
                `;
            });
        }

        function resetTilt() {
            if (frameId) {
                cancelAnimationFrame(frameId);
                frameId = null;
            }

            target.style.transition = 'transform 0.4s ease-out';
            target.style.transform = 'none';

            setTimeout(() => {
                target.style.transition = 'none';
            }, 400);
        }

        target.addEventListener('mousemove', updateTilt);
        target.addEventListener('mouseleave', resetTilt);

        target.style.transformStyle = 'preserve-3d';
    });
}

// ===============================================
// 12. LOGIC GAME CHUNG & C++ (HOÀN THIỆN)
// ===============================================

// --- HÀM TẢI DỮ LIỆU CHUNG ---
async function fetchChallenges(url, dataArray) {
    try {
const response = await fetch(url);
        const data = await response.json();
        // Cập nhật mảng dữ liệu đã truyền vào
        dataArray.splice(0, dataArray.length, ...data);
        console.log(`${url} Loaded:`, dataArray.length);
    } catch (error) {
        console.error(`Lỗi: Không thể tải dữ liệu thử thách từ ${url}:`, error);
    }
}
// --- HÀM TẢI (LOAD) NỘI DUNG CHALLENGE CHUNG (ĐÃ FIX LOGIC) ---
function loadChallenge(
    challengeList, // Chỉ cần danh sách dữ liệu (cppChallengesData hoặc pythonChallengesData)
    challengeContainer, 
    challengeInput, 
    resultElement,
    challengeTitleId,
    challengeNumberId
) {
    if (challengeList.length === 0) {
        if (resultElement) resultElement.textContent = 'Hệ thống đang tải dữ liệu...';
        return;
    }

    // 1. CHỌN NGẪU NHIÊN VÀ CẬP NHẬT BIẾN TOÀN CỤC
    const randomIndex = Math.floor(Math.random() * challengeList.length);
    const currentChallengeObject = challengeList[randomIndex];
    
    // *** PHẦN QUAN TRỌNG: GÁN KẾT QUẢ VÀO BIẾN TOÀN CỤC CHÍNH XÁC ***
    if (challengeList === cppChallengesData) {
        currentCppChallenge = currentChallengeObject;
    } else if (challengeList === pythonChallengesData) {
        currentPythonChallenge = currentChallengeObject;
    }
    // ***************************************************************

    // 2. CẬP NHẬT GIAO DIỆN
    if (challengeContainer) {
        challengeContainer.textContent = currentChallengeObject.code_snippet;
    }
    
    // Cập nhật tiêu đề và số thứ tự (nếu có)
    const titleElement = document.getElementById(challengeTitleId);
    if (titleElement) titleElement.textContent = currentChallengeObject.title;

    // Reset Form & Kết quả
    if (challengeInput) challengeInput.value = '';
    if (resultElement) {
        // Reset kết quả về trạng thái ban đầu
        resultElement.innerHTML = 'Nhập đáp án và click "Chạy Code"';
        resultElement.classList.remove('correct', 'incorrect');
    }

    // Kích hoạt âm thanh tải mới
    playSFX('audio-typing');
}
// ===============================================
// LOGIC C++ CHALLENGE
// ===============================================

function loadRandomCppChallenge() {
    // Tái sử dụng hàm chung
    loadChallenge(
        cppChallengesData, 
        cppChallengeContainer, 
        cppChallengeInput, 
        cppResultElement, 
        'cpp-challenge-title', 
        'cpp-challenge-number'
    );
}

function openCppChallenge() {
    if (cppChallengeModal) {
        cppChallengeModal.style.display = 'block';
        const loadAttempt = () => {
            if (cppChallengesData.length > 0) {
                if (!currentCppChallenge) {
                    loadRandomCppChallenge();
                }
            } else {
                setTimeout(loadAttempt, 100); // Thử lại sau 100ms
            }
        };
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 300);
        }
    }
}

// *** HÀM closeCppChallenge() ĐÃ ĐƯỢC FIX LẠI BIẾN:
function closeCppChallenge() {
    if (cppChallengeModal) { // Đã sửa từ 'challengeModal' thành 'cppChallengeModal'
        cppChallengeModal.style.display = 'none';
    }
}

// *** HÀM checkCppAnswer() ĐÃ ĐƯỢC FIX LẠI BIẾN:
function checkCppAnswer() {
    if (!currentCppChallenge || !cppChallengesData.length === 0) {
        if (cppResultElement) cppResultElement.textContent = 'Hệ thống đang tải dữ liệu C++...';
        loadRandomCppChallenge();
        return;
    }

    const userAnswer = cppChallengeInput.value.trim();
    const correctAnswer = String(currentCppChallenge.correct_answer).trim().toLowerCase();
    const normalizedUserAnswer = userAnswer.toLowerCase();

    playSFX('audio-confirm');

    if (normalizedUserAnswer === correctAnswer) {
        // ĐÚNG -> CỘNG SAO VÀ TẢI THỬ THÁCH MỚI
        addStar(1); 
        cppResultElement.classList.remove('incorrect');
        cppResultElement.classList.add('correct');
        cppResultElement.innerHTML = '✅ CHÍNH XÁC! Bạn đã thu thập được 🌟 1 Sao!';
        
        // Tải thử thách mới sau 1.5s
        setTimeout(loadRandomCppChallenge, 1500);

    } else {
        // SAI
        cppResultElement.classList.remove('correct');
        cppResultElement.classList.add('incorrect');
cppResultElement.innerHTML = `❌ RẤT TIẾC! Đáp án đúng là: ${currentCppChallenge.correct_answer}. <br> Gợi ý: ${currentCppChallenge.explanation}`;
    }

    // Kích hoạt hiệu ứng rung nhẹ (jiggle)
    const modalContent = document.getElementById('cpp-modal-content'); 
    if (modalContent) {
        modalContent.classList.add('jiggle-active');
        setTimeout(() => {
            modalContent.classList.remove('jiggle-active');
        }, 300);
    }
}

// ===============================================
// LOGIC PYTHON CHALLENGE 
// ===============================================

function loadRandomPythonChallenge() {
    // Tái sử dụng hàm chung
    loadChallenge(
        pythonChallengesData, 
        pythonChallengeContainer, 
        pythonChallengeInput, 
        pythonResultElement, 
        'python-challenge-title', 
        'python-challenge-number'
    );
}

function openPythonChallenge() {
    if (pythonChallengeModal) {
        pythonChallengeModal.style.display = 'block';
        const loadAttempt = () => {
            if (pythonChallengesData.length > 0) {
                if (!currentPythonChallenge) {
                    loadRandomPythonChallenge();
                }
            } else {
                setTimeout(loadAttempt, 100); // Thử lại sau 100ms
            }
        };
        loadAttempt();
        const glitchOverlay = document.querySelector('.glitch-overlay');
        if (glitchOverlay) {
            glitchOverlay.classList.add('active');
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
            }, 300);
        }
    }
}

function closePythonChallenge() {
    if (pythonChallengeModal) {
        pythonChallengeModal.style.display = 'none';
    }
}

function checkPythonAnswer() {
    if (!currentPythonChallenge || !pythonChallengeInput) {
        if (pythonResultElement) pythonResultElement.textContent = 'Lỗi: Không tìm thấy thử thách.';
        return;
    }

    const userAnswer = pythonChallengeInput.value.trim();
    // Đáp án của Python Challenge là code Pythonic, nên so sánh chính xác hơn
    const correctAnswer = String(currentPythonChallenge.correct_answer).trim();

    playSFX('audio-confirm');

    // So sánh chuỗi code (cần chính xác, không cần lowercase)
    if (userAnswer === correctAnswer) {
        // ĐÚNG -> CỘNG SAO VÀ TẢI THỬ THÁCH MỚI
        addStar(1); 
        pythonResultElement.classList.remove('incorrect');
        pythonResultElement.classList.add('correct');
        pythonResultElement.innerHTML = '✅ PYTHONIC! Code tối ưu. Bạn đã thu thập được 🌟 **1 Sao**!';
        
        // Tải thử thách mới sau 1.5s
        setTimeout(loadRandomPythonChallenge, 1500);

    } else {
        // SAI
        pythonResultElement.classList.remove('correct');
        pythonResultElement.classList.add('incorrect');
        pythonResultElement.innerHTML = `❌ CHƯA PYTHONIC! Code tối ưu là: <code>${currentPythonChallenge.correct_answer}</code>. <br> Gợi ý: ${currentPythonChallenge.explanation}`;
    }

    // Kích hoạt hiệu ứng rung nhẹ (jiggle)
const modalContent = document.getElementById('python-modal-content'); 
    if (modalContent) {
        modalContent.classList.add('jiggle-active');
        setTimeout(() => {
            modalContent.classList.remove('jiggle-active');
        }, 300);
    }
}

// ===============================================
// === HÀM KHỞI TẠO CHÍNH (window.onload) ===
// ===============================================
window.onload = function () {
    // 1. GÁN CÁC BIẾN DOM CẦN THIẾT
    starCountElement = document.getElementById('star-count');
    
    // C++
    cppChallengeModal = document.getElementById('cpp-modal');
    cppChallengeContainer = document.getElementById('challenge-code');
    cppChallengeInput = document.getElementById('challenge-answer-input');
    cppResultElement = document.getElementById('challenge-result');
    cppNextBtn = document.getElementById('next-challenge-btn'); 

    // Python
    pythonChallengeModal = document.getElementById('python-modal');
    pythonChallengeContainer = document.getElementById('python-code-snippet'); 
    pythonChallengeInput = document.getElementById('python-input'); 
    pythonResultElement = document.getElementById('python-challenge-result');

    // Gán sự kiện Nút Thử Thách Khác C++
    if (cppNextBtn) {
        cppNextBtn.addEventListener('click', loadRandomCppChallenge);
    }

    // 2. CẬP NHẬT TRẠNG THÁI SAO KHI TẢI XONG
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
        console.warn('DAILY RESET - Đặt lại số sao về 0');
        starCount = 0;
        localStorage.setItem('starCount', starCount);
        localStorage.setItem('lastResetDate', today);
    }
    updateStarDisplay();
    playSFX('audio-boot');

    // 3. TẢI DỮ LIỆU GAME (C++ và Python chạy đồng thời)
    fetchChallenges('c_plus_plus_challenges.json', cppChallengesData);
    fetchChallenges('python_challenges.json', pythonChallengesData);

    // 4. Kích hoạt tất cả các hiệu ứng tương tác (ĐÃ KHÔI PHỤC VÀ BỎ COMMENT)
    animateSkillBars();
    typeWriterEffect();
    typeLogEffect();
    customCursorEffect(); // ĐÃ KHÔI PHỤC
    dataAnalyzerTabs(); // ĐÃ KHÔI PHỤC
    dataGlitchOnScrollEffect(); // ĐÃ KHÔI PHỤC
    systemFeedbackEffect(); // ĐÃ KHÔI PHỤC
    tiltEffect(); // ĐÃ KHÔI PHỤC
};