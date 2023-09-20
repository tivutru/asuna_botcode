module.exports.config = {
name: "joinNoti",
eventType: ["log:subscribe"],
version: "1.0.4",
credits: "Tao mang name Gia Quân đã fix",
description: "ThÃ´ng bÃ¡o bot hoáº·c ngÆ°á» i vÃ o nhÃ³m",

};

module.exports.run = async function({ api, event, Users, global, client }) {

const { join } = require("path");
const { threadID } = event;
if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
return api.sendMessage(`TessTinggg....`, threadID);
}
else {
try {

const { createReadStream, existsSync, mkdirSync, readFileSync } = require("fs-extra");
let { threadName, participantIDs } = await api.getThreadInfo(threadID);
const get = JSON.parse(readFileSync(__dirname + "/../scrips/cache/autosetname.json"))
console.log(get)
 settings = client.threadSetting.get(parseInt(threadID)) || {};
 path = join(__dirname, "cache", "joinGif");
 pathGif = join(path, `${threadID}.gif`);

var mentions = [], nameArray = [], memLength = [], i = 0;

for (id in event.logMessageData.addedParticipants) {
const userName = event.logMessageData.addedParticipants[id].fullName;
nameArray.push(userName);
mentions.push({ tag: userName, id });
memLength.push(participantIDs.length - i++);
await Users.createData(id, { name: userName, data: {} });

if(get.some(item => item.threadID == event.threadID)){
const getName = get.find(item => item.threadID == event.threadID)
if(getName.setname == ""){
	api.changeNickname(`${userName} (TVM)`, event.threadID, event.logMessageData.addedParticipants[id].userFbId);
api.sendMessage(`Welcome aboard ${threadName} Chào mừng ${userName} chào mừng bạn đã đến với nhóm ❤️ chúc bạn có một niềm vui mới nha`, event.logMessageData.addedParticipants[id].userFbId)
return api.sendMessage(`Đã kích hoạt tự động đặt biệt danh cho ${userName} là (TVM)`, threadID)
} else {
api.sendMessage(`Welcome aboard ${threadName} Chào mừng ${userName} Chào mừng bạn đã đến với nhóm ❤️ chúc bạn có một niềm vui mới nha`, event.logMessageData.addedParticipants[id].userFbId)
api.changeNickname(`${getName.setname} ${userName}`, event.threadID, event.logMessageData.addedParticipants[id].userFbId);
return api.sendMessage(`Đã kích hoạt tự động đặt biệt danh cho ${userName} là \n${getName.setname} ${userName}`, threadID)
}
} else {
api.changeNickname(`${userName} (TVM)`, event.threadID, event.logMessageData.addedParticipants[id].userFbId);
api.sendMessage(`Welcome aboard ${threadName} Chào mừng ${userName} chào mừng bạn đã đến với nhóm ❤️ chúc bạn có một niềm vui mới nha`, event.logMessageData.addedParticipants[id].userFbId)
return api.sendMessage(`Đã kích hoạt tự động đặt biệt danh cho ${userName} là  (TVM)`, threadID)
}
}
memLength.sort((a, b) => a - b);

(typeof threadData.customJoin == "undefined") ? msg = "Welcome aboard {name}.\nChào mừng bạn đến với {threadName}.\n{type} là  thành viên thứ {soThanhVien} của nhóm  ❤️ chúc bạn có một niềm vui mới nha" : msg = threadData.customJoin;
msg = msg
.replace(/\{name}/g, nameArray.join(', '))
.replace(/\{type}/g, (memLength.length > 1) ?  'cÃ¡c báº¡n' : 'báº¡n')
.replace(/\{soThanhVien}/g, memLength.join(', '))
.replace(/\{threadName}/g, threadName);

if (existsSync(path)) mkdirSync(path, { recursive: true });

if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
else formPush = { body: msg, mentions }

return api.sendMessage(formPush, threadID);
} catch (e) { return console.log(e) };
}
}
