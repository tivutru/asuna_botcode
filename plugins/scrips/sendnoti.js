module.exports.config = {
	name: "sendnoti",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "CatalizCS",
	description: "Gửi tin nhắn tới các nhóm!",
	commandCategory: "system",
	usages: "sendnoti [Text]",
	cooldowns: 5,
	info: [
		{
			key: "Text",
			prompt: "Đoạn văn bản bạn muốn gửi tới mọi người",
			type: 'Văn bản',
			example: 'Hello Em'
		}
	]
};

module.exports.run = async ({ api, event, args, client }) => {
	const fs = require("fs-extra");
		const axios = require("axios");
		
	if (!args[0])
	return api.sendMessage("Vui lòng nhập tin nhắn bạn muốn gửi đến tất cả các nhóm");
		const formSend = {
		  body: "𝒏𝒐𝒕𝒊𝒇𝒊𝒄𝓪𝒕𝒊𝒐𝒏\n───────────\n" + args.join(" ")
		};
		const attachmentSend = [];
		const arrPathSave = [];
		
		async function getAttachments(attachments) {
		  let startFile = 0;
		  for (const data of attachments) {
			const ext = data.type == "photo" ? "jpg" :
			data.type == "video" ? "mp4" : 
			data.type == "animated_image" ? "gif" : 
			data.type == "audio" ? "mp3" : 
			"txt";
			const pathSave = __dirname + `/cache/notification${startFile}.${ext}`;
			++startFile;
			const url = data.url;
			const res = await axios.get(url, {
			  responseType: "arraybuffer"
			});
			fs.writeFileSync(pathSave, Buffer.from(res.data));
			attachmentSend.push(fs.createReadStream(pathSave));
			arrPathSave.push(pathSave);
		  }
		}
		
		if (event.messageReply) {
		  if (event.messageReply.attachments.length > 0) {
			await getAttachments(event.messageReply.attachments);
		  }
		}
		else if (event.attachments.length > 0) {
		  await getAttachments(event.attachments);
		}
		
		if (attachmentSend.length > 0) formSend.attachment = attachmentSend;
		const allThreadID = (await api.getThreadList(500, null, ["INBOX"])).filter(item => item.isGroup === true && item.threadID != event.threadID).map(item => item = item.threadID);
		
		let sendSucces = 0;
		let sendError = [];
		
		for (let tid of allThreadID) {
		  let errorWhenSend = false;
		  api.sendMessage(formSend, tid, async function (err) {
			if (err) {
			  sendError.push(tid);
			  errorWhenSend = true;
			}
			await new Promise(resolve => setTimeout(resolve, 250));
		  });
		  if (errorWhenSend === true) continue;
		  ++sendSucces;
		}
		
		api.sendMessage(`Đã gửi thông báo đến ${sendSucces} nhóm thành công\n${sendError.length > 0 ? `Có lỗi xảy ra khi gửi đến ${sendError.length} nhóm` : ""}`);
		for (const pathSave of arrPathSave) fs.unlinkSync(pathSave);
	  
	 };