const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "亗•𝘔𝘈𝘔𝘜𝘕✿᭄",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       :
 亗ARIFUL ISLAM
│🧸 Nɪᴄᴋ       :
  ARIFUL
│ 🎂 Aɢᴇ        :
 18+
│ 💘 Rᴇʟᴀᴛɪᴏɴ :
 Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ :
 Sᴛᴜᴅᴇɴᴛ 
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ :
 MANIKGONJ  
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📞 WhatsApp  :
 wa.me/+96599894039
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/jHK8K7C.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
