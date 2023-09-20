const { spawn } = require("child_process");
const express = require("express");
const app = express();
const logger = require("./utils/log.js");

const PORT = process.env.PORT || 8888 || 9999;

app.get("/", function (request, response) {
  const result =
    "This is Disme Project remade by D-Jukie from Miraiv2 source code";
  response.send(result);
});

app.listen(PORT, () => {
  logger.loader(`Bot is running on port: ${PORT}`);
  startBot(0);
});

async function startBot(index) {
  logger(`Starting child process ${index}`, "[ Starting ]");
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "Asuna.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CHILD_INDEX: index,
    },
  });


    child.on("close", (codeExit) => {
        if (codeExit != 0) {
            startBot("Đang khởi động lại...");
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("Đã xảy ra lỗi: " + JSON.stringify(error), "[ Starting ]");
    });
};