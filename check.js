// === HÀM SHA-256 CHO VIỆC MÃ HÓA TOKEN (DÁN VÀO ĐẦU check.js) ===
async function sha256(message) {
    // Chuyển chuỗi thành mảng byte
    const msgBuffer = new TextEncoder().encode(message);

    // Mã hóa bằng Web Cryptography API
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Chuyển mảng byte hash sang chuỗi hex (64 ký tự)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    console.log("SHA-256 Hash Generated:", hashHex);
    return hashHex;
}
// =================================================================
// === CODE ĐÃ FIX CỨNG ID LẦN CUỐI VÀ API ===
// === CODE ĐÃ FIX CỨNG ID LẦN CUỐI VÀ API & THÊM LOGIC ĐẾM LƯỢT TRUY CẬP ===
function trackUserAccess(user) {
    console.log("Attempting to track user:", user.name, "at", new Date().toLocaleString()); 

    // 1. Link API Chính Xác:
    const TRACKING_API_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeBw_CQme2SDFOUJ9cEbdoLZ0H83mTB3AsWPWDct2Ld6aYvYQ/formResponse';
    
    // --- BỔ SUNG LOGIC ĐẾM SỐ LẦN TRUY CẬP ---
    const userKey = normalizeString(user.name); // Tạo key từ tên chuẩn hóa (ví dụ: TRUONG TUAN MINH)
    
    // 1.1. Đọc số lần truy cập cũ
    let accessCount = parseInt(localStorage.getItem(`accessCount_${userKey}`) || 0); 
    
    // 1.2. Tăng số lần truy cập lên 1
    accessCount++;
    
    // 1.3. Lưu lại số lần truy cập mới vào LocalStorage
    localStorage.setItem(`accessCount_${userKey}`, accessCount);
    // -------------------------------------------------------------

    // 2. Chuẩn bị dữ liệu (FormData)
    const formData = new FormData();
    
    // 3. ENTRY IDs CHÍNH XÁC TỪ PAYLOAD CỦA SẾP
    const Q1_NAME = 'entry.1648617329'; 
    const Q2_DOB = 'entry.694182112';   
    const Q3_CLASS = 'entry.548262119';  
    const Q4_TIME = 'entry.1527842383';  
    // ENTRY ID MỚI (GIẢ ĐỊNH) DÀNH CHO SỐ LẦN TRUY CẬP
    const Q5_ACCESS_COUNT = 'entry.327321207'; // <-- CẦN SỬA Ở BƯỚC 2 DƯỚI ĐÂY!
    
    // 4. Gửi dữ liệu đi
    formData.append(Q1_NAME, user.name);
    formData.append(Q2_DOB, user.dob);
    formData.append(Q3_CLASS, user.class);
    formData.append(Q4_TIME, new Date().toLocaleString('vi-VN')); 
    formData.append(Q5_ACCESS_COUNT, accessCount); // <-- Gửi số lần truy cập
    
    fetch(TRACKING_API_URL, {
        method: 'POST',
        mode: 'no-cors', 
        body: formData 
    })
    .then(response => {
        console.log(`Tracking request sent. ${user.name} access count: ${accessCount}`);
    })
    .catch(error => {
        console.error('Tracking Error:', error);
    });
}
// ==========================================
// *** MASTER LIST: DỮ LIỆU XÁC THỰC LỚP 9.1 ***
// Sếp đã cung cấp Danh sách Học sinh Trường THCS Đặng Thai Mai
// Ku Gemini đã trích xuất: 41 học sinh
// ===========================================

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
const VALID_USERS = [
    // Thông tin của Sếp Minh (Người dùng VIP)
    { name: "TRƯƠNG TUẤN MINH", dob: "28/12/2011", class: "9.1", token: "e395f94d9b4646f88c699a39355f24df741530b3eb9f8b810add591acb50e9cf", greeting: "Chào mừng, SẾP MINH! Hệ thống Terminal đã xác thực danh tính VIP. Toàn quyền truy cập." },
    { name: "NGUYỄN VĂN NHẬT HUY", dob: "23/04/2011", class: "9.5", greeting: "Xin chào Nguyễn Văn Nhật Huy! Đã xác thực thành viên Lớp 9.5 - Bạn của MinhGM. Truy cập đã được cấp phép." },
    // Thêm các bạn khác từ danh sách Sếp đã gửi (Phải nhập chữ IN HOA không dấu để đơn giản hóa logic kiểm tra)
    { name: "VÕ TRƯỜNG AN", dob: "07/11/2011", class: "9.1", greeting: "Xin chào Võ Trường An! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGÔ QUỐC ANH", dob: "13/07/2010", class: "9.1", greeting: "Xin chào Ngô Quốc Anh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN THANH BẠCH", dob: "27/09/2011", class: "9.1", greeting: "Xin chào Nguyễn Thanh Bạch! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ÔNG VĂN GIA BẢO", dob: "16/04/2011", class: "9.1", greeting: "Xin chào Ông Văn Gia Bảo! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TẤN PHẠM THANH CẢNH", dob: "25/06/2011", class: "9.1", greeting: "Xin chào Tấn Phạm Thanh Cảnh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRẦN VIẾT CHÂU", dob: "03/09/2011", class: "9.1", greeting: "Xin chào Trần Viết Châu! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "DƯƠNG TẤN NAM CƯỜNG", dob: "21/10/2011", class: "9.1", greeting: "Xin chào Dương Tấn Nam Cường! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN THÀNH ĐẠT", dob: "14/03/2011", class: "9.1", greeting: "Xin chào Nguyễn Thành Đạt! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "LÊ THỊ THÙY GIANG", dob: "06/12/2011", class: "9.1", greeting: "Xin chào Lê Thị Thùy Giang! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN THỊ BÍCH HẰNG", dob: "14/02/2011", class: "9.1", greeting: "Xin chào Nguyễn Thị Bích Hằng! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGÔ THỊ BÍCH HIỀN", dob: "27/12/2011", class: "9.1", greeting: "Xin chào Ngô Thị Bích Hiền! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN VÕ ANH HOÀNG", dob: "15/02/2011", class: "9.1", greeting: "Xin chào Nguyễn Võ Anh Hoàng! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ĐẶNG QUANG HUY", dob: "30/11/2011", class: "9.1", greeting: "Xin chào Đặng Quang Huy! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ÔNG THỊ BÍCH HUYỀN", dob: "22/04/2011", class: "9.1", greeting: "Xin chào Ông Thị Bích Huyền! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "LÊ VĂN HƯNG", dob: "04/02/2010", class: "9.1", greeting: "Xin chào Lê Văn Hưng! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRẦN ĐÌNH NGUYÊN KHANG", dob: "08/03/2011", class: "9.1", greeting: "Xin chào Trần Đình Nguyên Khang! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ĐẶNG LÊ NGỌC KHÁNH", dob: "09/09/2011", class: "9.1", greeting: "Xin chào Đặng Lê Ngọc Khánh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRẦN QUỐC KIỆT", dob: "08/10/2011", class: "9.1", greeting: "Xin chào Trần Quốc Kiệt! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN THÁI THÙY LINH", dob: "02/09/2011", class: "9.1", greeting: "Xin chào Nguyễn Thái Thùy Linh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRỊNH NGUYÊN QUANG LINH", dob: "31/07/2011", class: "9.1", greeting: "Xin chào Trịnh Nguyên Quang Linh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ĐẶNG NHẬT LONG", dob: "21/02/2011", class: "9.1", greeting: "Xin chào Đặng Nhật Long! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN QUỐC LONG", dob: "23/09/2011", class: "9.1", greeting: "Xin chào Nguyễn Quốc Long! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGÔ TẤN LỘC", dob: "26/05/2011", class: "9.1", greeting: "Xin chào Ngô Tấn Lộc! Đã xác thực thành viên Lớp 9.1. Truy cấp đã được cấp phép." },
    { name: "TỪ THỊ PHƯƠNG MAI", dob: "01/06/2011", class: "9.1", greeting: "Xin chào Từ Thị Phương Mai! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "PHÙNG GIA MINH", dob: "05/02/2011", class: "9.1", greeting: "Xin chào Phùng Gia Minh! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    // **TRƯƠNG TUẤN MINH** (đã ở trên)
    { name: "TẠ LÊ HỒNG NGÂN", dob: "21/09/2011", class: "9.1", greeting: "Xin chào Tạ Lê Hồng Ngân! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "HỨA THẢO NGUYÊN", dob: "06/06/2011", class: "9.1", greeting: "Xin chào Hứa Thảo Nguyên! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "CAO TRẦN BẢO NHI", dob: "18/10/2011", class: "9.1", greeting: "Xin chào Cao Trần Bảo Nhi! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN NGỌC BẢO NHƯ", dob: "01/01/2011", class: "9.1", greeting: "Xin chào Nguyễn Ngọc Bảo Như! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGÔ VĂN PHÁT", dob: "18/07/2011", class: "9.1", greeting: "Xin chào Ngô Văn Phát! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "LƯỜNG KHẮC PHÚC", dob: "23/05/2011", class: "9.1", greeting: "Xin chào Lường Khắc Phúc! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN VĂN THÀNH", dob: "24/12/2011", class: "9.1", greeting: "Xin chào Nguyễn Văn Thành! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRẦN THỊ THANH THẢO", dob: "06/01/2011", class: "9.1", greeting: "Xin chào Trần Thị Thanh Thảo! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "PHAN NGỌC ANH THƯ", dob: "19/06/2011", class: "9.1", greeting: "Xin chào Phan Ngọc Anh Thư! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "LÊ TRẦN BẢO TÍN", dob: "05/07/2011", class: "9.1", greeting: "Xin chào Lê Trần Bảo Tín! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ĐỖ HUỲNH QUỲNH TRÂM", dob: "02/08/2011", class: "9.1", greeting: "Xin chào Đỗ Huỳnh Quỳnh Trâm! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN MINH TRÍ", dob: "14/07/2011", class: "9.1", greeting: "Xin chào Nguyễn Minh Trí! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "ĐOÀN LÂM TRÚC", dob: "19/04/2011", class: "9.1", greeting: "Xin chào Đoàn Lâm Trúc! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "NGUYỄN HỮU HOÀNG VY", dob: "04/05/2011", class: "9.1", greeting: "Xin chào Nguyễn Hữu Hoàng Vy! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
    { name: "TRẦN PHAN ANH THƯ", dob: "19/11/2010", class: "9.1", greeting: "Xin chào Trần Phan Anh Thư! Đã xác thực thành viên Lớp 9.1. Truy cập đã được cấp phép." },
];
// ===========================================
// *** HÀM HIỆU ỨNG TYPEWRITER ***
// ===========================================
let lineIndex = 0;
let charIndex = 0;
let messageLines = [
    "MinhGM >> System Initializing... OS v0.1.2",
    "MinhGM >> Connecting to Decentralized Authentication Server...",
    "MinhGM >> Status: ONLINE. Access Protocol Activated.",
    "MinhGM >> System Firewall: Green.",
    "MinhGM >> System Ready. Please Enter Required Credentials Below."
];

function typeWriter() {
    const outputElement = document.getElementById('ai-greeting');
    
    if (lineIndex < messageLines.length) {
        let currentLine = messageLines[lineIndex];
        if (charIndex < currentLine.length) {
            outputElement.innerHTML += currentLine.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50); // Tốc độ gõ
        } else {
            outputElement.innerHTML += '<br>'; // Xuống dòng
            lineIndex++;
            charIndex = 0;
            setTimeout(typeWriter, 500); // Chờ 0.5s trước khi gõ dòng tiếp theo
        }
    } else {
        // Hoàn thành Typewriter, hiển thị Form
        document.getElementById('auth-form').style.display = 'block';
    }
}
// Hiệu ứng Matrix nền
const canvas = document.getElementById('matrixCanvas');
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
    ctx.fillStyle = "#7efefe8f";
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
// ===========================================
// *** HÀM XÁC THỰC 3 CHIỀU ***
// ===========================================
function normalizeString(str) {
    // Chuyển về chữ hoa, bỏ dấu, loại bỏ khoảng trắng thừa
    str = str.toUpperCase();
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\s+/g, ' ').trim(); // Loại bỏ khoảng trắng thừa
    return str;
}

// Chuyển hàm thành async function
// =================================================================
// === HÀM XÁC THỰC MỚI (ĐÃ FIX LỖI VIP) ===
// =================================================================
async function verifyAccess() { 
    const name = normalizeString(document.getElementById('input-name').value);
    const dob = document.getElementById('input-dob').value.trim();
    const classInput = document.getElementById('input-class').value.trim();
    const tokenInput = document.getElementById('input-token').value.trim(); 
    
    const statusElement = document.getElementById('system-status');
    statusElement.innerHTML = ''; 
    
    // 1. Kiểm tra trường trống chung
    if (!name || (!tokenInput && (!dob || !classInput))) {
        statusElement.innerHTML = '<span style="color:#ff0000;">[ERROR] System Integrity Check FAILED. All required fields must be filled.</span>';
        return;
    }

    let foundUser = null;
    const VIP_NAME_NORMALIZED = "TRUONG TUAN MINH";

    // 2. LOGIC XÁC THỰC SẾP MINH (CHỈ CẦN TÊN VÀ TOKEN)
    if (name === VIP_NAME_NORMALIZED && tokenInput) {
        const userVIP = VALID_USERS.find(user => normalizeString(user.name) === VIP_NAME_NORMALIZED);
        
        if (userVIP) {
            const hashedTokenInput = await sha256(tokenInput); 
            
            if (hashedTokenInput === userVIP.token) { 
                foundUser = userVIP; // Xác thực Token thành công
            } else {
                // Token SAI
                playSFX('audio-denied');
                statusElement.innerHTML = `<span style="color:#ff0000;">[SECURITY ALERT] IDENTITY CONFLICT. </span><br><span style="color:#ff00ff;">Invalid Token. DENIED.</span><br>Logging attempted entry...`;
                console.warn('Invalid VIP token — redirecting to lock0.html');
                    // dùng replace để không lưu trang trước vào lịch sử
                setTimeout(() => { window.location.replace("lock0.html"); }, 3000);
                return;
            }
        }
    }
    
    // 3. LOGIC XÁC THỰC NGƯỜI DÙNG THƯỜNG (CẦN TÊN + DOB + CLASS)
    if (!foundUser) { // Nếu chưa tìm thấy Sếp Minh, mới chạy tìm kiếm người dùng thường
        foundUser = VALID_USERS.find(user => {
            return normalizeString(user.name) === name && 
                   user.dob === dob && 
                   user.class === classInput;
        });
    }

    // 4. XỬ LÝ KẾT QUẢ CUỐI CÙNG
    if (foundUser) {
        // LOGIC THÀNH CÔNG
        statusElement.innerHTML = `<span style="color:#00ff00;">[SUCCESS] Identity Confirmed. ${foundUser.greeting}</span><br>System Redirecting to Main Console in 3 seconds...`;
        
        localStorage.setItem('username', foundUser.name);
        trackUserAccess(foundUser); 
        
        setTimeout(() => {
            window.location.href = 'welcome.html'; 
        }, 3000);
        

    } else {
        // LOGIC THẤT BẠI
        playSFX('audio-denied');
        statusElement.innerHTML = `<span style="color:#ff0000;">[WARNING] ACCESS DENIED. </span><br><span style="color:#ff00ff;">Unauthorized Personnel Detected. System Firewall Initialized.</span><br>Logging attempted entry...`;
        setTimeout(() => {
            window.location.href = 'lock0.html'; 
        }, 3000);
    }
}
// =================================================================

function checkNameForToken() {
    const nameInput = document.getElementById('input-name');
    const tokenLine = document.getElementById('token-input-line');
    const conditionalFields = document.getElementById('conditional-fields');
    const normalizedName = normalizeString(nameInput.value);

    // Tên chuẩn hóa của Sếp Minh
    const VIP_NAME = "TRUONG TUAN MINH"; 

    if (normalizedName === VIP_NAME) {
        // Nếu là Sếp Minh:
        tokenLine.style.display = 'flex'; // Hiển thị trường Token
        conditionalFields.style.display = 'none'; // Ẩn trường DOB và Class
    } else {
        // Nếu không phải Sếp Minh:
        tokenLine.style.display = 'none'; // Ẩn trường Token
        conditionalFields.style.display = 'block'; // Hiện trường DOB và Class (đã gói gọn)
    }
}
function startBackgroundMusic() {
    const music = document.getElementById('background-music');
    
    // Kiểm tra xem phần tử audio có tồn tại và đang bị tạm dừng (paused) hay không
    if (music && music.paused) {
        music.play().then(() => {
            console.log('✅ Nhạc nền đã được kích hoạt thành công!');
            
            // QUAN TRỌNG: Gỡ bỏ Listener sau khi nhạc đã phát, tránh gọi lại nhiều lần
            document.removeEventListener('click', startBackgroundMusic);
            document.removeEventListener('keydown', startBackgroundMusic);
            
        }).catch(error => {
            // Nếu vẫn có lỗi (ví dụ: người dùng chưa cho phép âm thanh), ghi log
            console.warn("⚠️ Trình duyệt vẫn chặn Autoplay. Cần thêm tương tác khác.");
        });
    }
}
// Bắt đầu hiệu ứng Typewriter khi trang được tải
window.onload = function() {
    typeWriter();
    startBackgroundMusic();
    resizeCanvas();
    setInterval(drawMatrix, 35);
};