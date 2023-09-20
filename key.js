const readline = require('readline');

// Đặt key và pass bạn muốn
const secretKey = 'ASUNA';
const secretPass = 'Hoangquan';

// Hàm để hỏi người dùng nhập key và pass
function askForCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Nhập key: ', (key) => {
      rl.question('Nhập pass: ', (pass) => {
        rl.close();
        resolve({ key, pass });
      });
    });
  });
}

// Hàm chạy đoạn mã chính khi có key và pass hợp lệ
async function runMainCode() {
  // Hỏi người dùng nhập key và pass
  const { key, pass } = await askForCredentials();

  // Kiểm tra key và pass
  if (key === secretKey && pass === secretPass) {
    console.log('Key và pass đúng! Đoạn mã của bạn sẽ được chạy.');
    // Thêm đoạn mã của bạn vào đây
    // Ví dụ: yourFunction();
  } else {
    console.log('Key hoặc pass không đúng. Đoạn mã không chạy.');
  }
}

// Gọi hàm chạy đoạn mã chính
runMainCode();
