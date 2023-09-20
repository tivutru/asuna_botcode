module.exports.config = {
    name: "chatgpt",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "rin",
    description: "Chat GPT",
    commandCategory: "Chat GPT",
    usages: "[args]",
    cooldowns: 5,
    dependencies: [
    "axios"
    ]
    }
    const d = require("axios");
    async function chatgpt(a, b, c) {
    const g = (a) => encodeURIComponent(a);
    try {
    var { data: j } = await d({ url: `http://103.118.30.235:5000/chatgpt?text=${g(a)}`, method: "GET" });
    return { error: !1, data: j }
    } catch (p) {
    return { error: !0, data: {} }
    }
    }
    module.exports.onLoad = async function () {
    "undefined" == typeof global.chat && (global.chat = {}), "undefined" == typeof global.chat.chatgpt && (global.chat.chatgpt = new Map);
    };
    module.exports.event = async function ({ api: b, event: a }) {
    const { threadID: c, messageID: d, senderID: e, body: f } = a, g = (e) => b.sendMessage(e, c, d);
    if (global.chat.chatgpt.has(c)) {
    if (e == b.getCurrentUserID() || "" == f || d == global.chat.chatgpt.get(c)) return;
    var { data: h, error: i } = await chatgpt(f, b, a);
    return !0 == i ? void 0 : !1 == h.success ? g(h.error) : g(h.chatgptsay)
    }
    }
    module.exports.run = async function ({ api: b, event: a, args: c }) {
    const { threadID: d, messageID: e } = a, f = (c) => b.sendMessage(c, d, e);
    const axios = require("axios");
    if (0 == c.length) return f("Thiếu câu hỏi");
    switch (c[0]) {
    case "on":
    return global.chat.chatgpt.has(d) ? f("Chat GPT vẫn đang bật") : (global.chat.chatgpt.set(d, e), f("Chat GPT on."));
    case "off":
    return global.chat.chatgpt.has(d) ? (global.chat.chatgpt.delete(d), f("Chat GPT off")) : f("Chưa bật Chat GPT");
    default:
    axios.get(encodeURI(`http://103.118.30.235:5000/chatgpt?text=${c.join(" ")}`)).then(res => {
    if (res.data.code == "300" || res.data.code == "404") {
    b.sendMessage("Đã có lỗi sảy ra",d,e)
    } else {
    return b.sendMessage(res.data.chatgptsay, d, e);
    }
    })
    
    }
    };