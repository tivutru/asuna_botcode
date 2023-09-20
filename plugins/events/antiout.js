module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "0.0.1",
    credits: "Hoàng",
    description: "Listen events"
};

module.exports.run = async({ event, api, client, Users }) => {
    let settings = client.threadSetting.get(event.threadID) || {};
    if (!settings["antiout"]) return;
   
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    let name = (await Users.getData(event.logMessageData.leftParticipantFbId)).name || (await api.getUserInfo(event.logMessageData.leftParticipantFbId))[event.logMessageData.leftParticipantFbId].name
    let type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời" : "bị quản trị viên đá";
    if (type == "tự rời") {
        api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
            if (error) {
                api.sendMessage(`Không thể thêm lại thành viên ${name} vào nhóm  `, event.threadID)
            } else api.sendMessage(`${name} Đã Out Nhưng Còn Chế Độ Antiout `, event.threadID);
        })
    }
}

