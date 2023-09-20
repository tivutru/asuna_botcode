const fs = require('fs');
const ytdl = require('ytdl-core');
const { resolve } = require('path');
const moment = require("moment-timezone");
const axios = require("axios");

var gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");

async function downloadVideoFromYoutube(link, path) {
  if (!link) return 'Thiếu liên kết';
  var resolveFunc = function () { };
  var returnPromise = new Promise(function (resolve) {
    resolveFunc = resolve;
  });
  ytdl(link, {
    filter: format =>
      format.qualityLabel && format.container === 'mp4' && format.hasVideo && format.hasAudio
  }).pipe(fs.createWriteStream(path))
    .on("close", async () => {
      var data = await ytdl.getInfo(link)
      var result = {
        dur: Number(data.videoDetails.lengthSeconds),
        title: data.videoDetails.title
      }
      resolveFunc(result)
    })
  return returnPromise;
}

module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hoàng Quân",
  description: "Phát video thông qua liên kết YouTube hoặc từ khoá tìm kiếm",
  commandCategory: "Tiện ích",
  usages: "[searchVideo]",
  cooldowns: 0
}

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { createReadStream, unlinkSync } = require("fs-extra");
  try {
	api.sendMessage('💻Download video missing 30ss => 1min💽', event.threadID);
    var path = `${__dirname}/cache/video-${event.senderID}.mp4`
    var data = await downloadVideoFromYoutube('https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1], path);
    if (fs.statSync(path).size > 2621440000) return api.sendMessage('Kích thước tập tin vượt quá giới hạn. Vui lòng tải lại với dung lượng nhỏ hơn!', event.threadID, () => fs.unlinkSync(path), event.messageID);
    api.unsendMessage(handleReply.messageID)
    return api.sendMessage({
      body: `=[🎬VIDEO ASUNA🎬]=\n`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID)
  } catch (e) {
    return console.log(e)
  }
}

module.exports.convertHMS = function (value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
}

module.exports.run = async function ({ api, event, args, client }) {
  api.sendMessage("Đang xử lý yêu cầu của bạn 🛠⚙️\nQuá trình này sẽ mất 5s⏳⏳", event.threadID, event.messageID);
  if (args.length == 0 || !args) return api.sendMessage('» Vui lòng cung cấp từ khóa hoặc liên kết để tìm kiếm!', event.threadID, event.messageID);
  const keywordSearch = args.join(" ");
  var path = `${__dirname}/cache/video-${event.senderID}.mp4`
  if (fs.existsSync(path)) {
    fs.unlinkSync(path)
  }
  if (args.join(" ").indexOf("https://") == 0) {
    try {
      var data = await downloadVideoFromYoutube(args.join(" "), path);
      if (fs.statSync(path).size > 2621440000) return api.sendMessage('Kích thước tập tin vượt quá giới hạn. Vui lòng tải lại với dung lượng nhỏ hơn!', event.threadID, () => fs.unlinkSync(path), event.messageID);
      return api.sendMessage({
        body: `== [ 🎬 Video ] ==\n➝『🎬』Tên video: ${data.title} ( ${this.convertHMS(data.dur)} )`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID)
    } catch (e) {
      return console.log(e)
    }
  } else {
    try {
      var link = [], msg = "", num = 1;
      var imgthumnail = []
      const Youtube = require('youtube-search-api');
      var data = (await Youtube.GetListByKeyword(keywordSearch, false, 6)).items;
      for (let value of data) {
        link.push(value.id);
        let folderthumnail = __dirname + `/cache/${link.length}.png`;
        let linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;
        let getthumnail = (await axios.get(`${linkthumnail}`, {
          responseType: 'arraybuffer'
        })).data;

        fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));
        imgthumnail.push(fs.createReadStream(__dirname + `/cache/${link.length}.png`));

        msg += (`${num}. ${value.title} ( ${value.length.simpleText} )\n━━━━━━━━\n`);
        num++;
      }

      var body = `Có ${link.length} kết quả tìm được với từ khóa:\n━━━━━━━━\n${msg}Hãy reply (phản hồi) để chọn một kết quả và tải video về.`;

      return api.sendMessage({
        attachment: imgthumnail,
        body: body
      }, event.threadID, (error, info) => client.handleReply.push({
        type: 'reply',
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        link
      }), event.messageID);
    } catch (e) {
      return api.sendMessage('Đã xảy ra lỗi, vui lòng thử lại trong giây lát!!\n' + e, event.threadID, event.messageID);
    }
  }
}
