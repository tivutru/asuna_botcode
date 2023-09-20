const chalk = require('chalk');
const randomColor = require('randomcolor');

function showLoading() {
  let value = 0;
  const frameWidth = 40; // Chiều rộng của khung hình loading
  const animationSpeed = 100; // Tốc độ của loading animation (ms)
  const frames = ['|', '/', '-', '\\']; // Các ký tự quay vòng
  const filledChar = '█'; // Ký tự để điền vào khung hình loading
  const hiddenChar = '-'; // Ký tự dòng -

  let filledPercentage = 0; // Mức độ % đã điền vào khung

  const interval = setInterval(() => {
    // Xoá dòng hiện tại trên dòng lệnh
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    // Tính toán frame và màu sắc ngẫu nhiên để tạo hiệu ứng loading
    const frame = frames[value % frames.length];
    const loadingChar = chalk.hex(randomColor())(frame);
    const emptyChar = chalk.gray(' ');

    // Tính toán số lượng ký tự đã điền vào khung dựa trên mức độ % đã điền
    const filledChars = Math.floor((filledPercentage / 100) * frameWidth);
    const emptyChars = frameWidth - filledChars;

    // Tạo khung hình loading với ký tự và màu sắc tương ứng
    const filledBar = chalk.hex(randomColor())(filledChar.repeat(filledChars));
    const hiddenBar = hiddenChar.repeat(emptyChars);

    // Hiển thị khung hình loading và giá trị trong một dòng duy nhất
    process.stdout.write(`[${filledBar}${hiddenBar}] ${loadingChar} ${value}%`);

    // Tăng giá trị value
    value++;

    // Tăng mức độ % đã điền vào khung
    if (filledPercentage < value) {
      filledPercentage++;
    }

    // Khi value đạt 100, dừng loading và xóa interval
    if (value > 100) {
      clearInterval(interval);
      process.stdout.write('\nLoading complete!\n');
    }
  }, animationSpeed);
}

// Gọi hàm showLoading để hiển thị hiệu ứng loading giống như khi tải một package từ npm
showLoading();
