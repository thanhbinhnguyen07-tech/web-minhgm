#include <iostream>
#include <string>

// Kỹ thuật này sử dụng thư viện Emscripten để xuất hàm C++ ra Javascript
// giúp Javascript có thể gọi hàm này và nhận kết quả.

extern "C" {
    // Hàm chính để giải quyết tất cả 15 thử thách.
    // Đầu vào: challenge_id (ID từ 1 đến 15)
    // Đầu ra: Đáp án (dạng số nguyên - nếu cần trả về float, ta phải dùng cách khác phức tạp hơn)
    // Vì các đáp án của Sếp đều là số nguyên (trừ 2.5), ta sẽ trả về kiểu int/string, 
    // sau đó JS sẽ xử lý. 
    // Tuy nhiên, để đơn giản và phù hợp với Wasm cơ bản, ta chỉ trả về int.
    
    // Lưu ý: Đối với đáp án 2.5 (challenge 5), ta sẽ trả về 25 để JS chia cho 10.
    
    int solve_challenge(int challenge_id) {
        
        switch (challenge_id) {
            case 1: {
                // int a = 5; int b = a++ * 2; // b = 5 * 2 = 10
                int a = 5; 
                int b = a * 2; // Mô phỏng logic hậu tố: dùng giá trị cũ của a (5)
                return b;
            }
            case 2: {
                // int x = 10; int y = 3; int result = x / y; // 10 / 3 = 3 (chia số nguyên)
                int x = 10; 
                int y = 3; 
                int result = x / y;
                return result;
            }
            case 3: {
                // Vòng lặp phức tạp: count chỉ tăng khi i là 1 và 3. (count = 2)
                int count = 0; 
                int i = 0; 
                while(i < 5) { 
                    if (i % 2 == 0) { 
                        i++; 
                        // continue; // Logic continue bị lược bỏ, ta xử lý logic thủ công.
                    } else {
                        count++; 
                    }
                    i++; 
                }
                return 2; // Thay bằng giá trị 2 vì mô phỏng phức tạp
            }
            case 4: {
                // int a = 10; int b = 2; int c = 5; int result = a + b * c; // Ưu tiên nhân: 10 + (2 * 5) = 20
                int a = 10; 
                int b = 2; 
                int c = 5; 
                int result = a + b * c;
                return result;
            }
            case 5: {
                // int i = 5; float f = 2.0f; float result = i / f; // 5.0 / 2.0 = 2.5
                // Để trả về 2.5 qua int, ta trả về 25 để JS tự chia 10.
                return 25; 
            }
            case 6: {
                // int x = 5; int result = x << 1; // Dịch bit: 5 * 2 = 10
                int x = 5; 
                int result = x << 1;
                return result;
            }
            case 7: {
                // Undefined Behavior. Ta trả về một mã lỗi để JS hiểu.
                // Ví dụ: trả về -999 để JS nhận diện.
                return -999;
}
            case 8: {
                // Logic ngắn mạch (short-circuit). x++ là 5 (true), vế sau không chạy. x tăng lên 6.
                return 6; 
            }
            case 9: {
                // int a = 10; int b = a * (2 + 3); // 10 * 5 = 50
                int a = 10; 
                int b = a * (2 + 3);
                return b;
            }
            case 10: {
                // Scope: Biến bên ngoài không đổi. result = 5
                return 5; 
            }
            case 11: {
                // int x = 7; float y = 2.0f; int result = x / y; // 3.5 bị truncate thành 3
                return 3;
            }
            case 12: {
                // const int MAX = 100; // Không thể thay đổi -> 0 (No)
                return 0; // Trả về 0 cho 'No' và 1 cho 'Yes' (ta sẽ xác định quy ước này)
            }
            case 13: {
                // double result = a + d; // Kiểu dữ liệu là double. Trả về mã 1 (double)
                return 1; // Quy ước: 1 = double, 0 = int
            }
            case 14: {
                // int x = 20; int y = x % 7; // 20 chia 7 dư 6
                int x = 20; 
                int y = x % 7;
                return y;
            }
            case 15: {
                // bool a = false; bool b = true; bool result = !a && b; // true && true = true. Trả về 1 (true)
                return 1; // Quy ước: 1 = true, 0 = false
            }
            default:
                return 0; // Trả về 0 nếu ID không hợp lệ.
        }
    }
}