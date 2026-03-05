const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const Jimp = require("jimp"); // জিম্প ইমপোর্ট করা হলো

module.exports = {
  config: {
    name: "chor",
    aliases: ["thief"],
    version: "1.0.2",
    author: "Joshua Sy", 
    countDown: 5,
    role: 0,
    shortDescription: "Scooby doo template memes",
    category: "fun",
    guide: { en: "{pn} @mention" }
  },

  // Circle image function - Fixed version
  circle: async function (imagePath) {
    try {
      const image = await Jimp.read(imagePath);
      image.circle();
      return await image.getBufferAsync(Jimp.MIME_PNG);
    } catch (err) {
      throw new Error("Failed to process circle image.");
    }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, mentions, senderID } = event;
    
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.ensureDirSync(cacheDir);

    const chorPath = path.join(cacheDir, `chor_${Date.now()}.png`);
    const id = Object.keys(mentions)[0] || senderID;

    try {
      api.setMessageReaction("⏳", messageID, () => {}, true);

      const canvas = createCanvas(500, 670);
      const ctx = canvas.getContext('2d');
      
      // Background Image
      const background = await loadImage('https://i.imgur.com/ES28alv.png');
      
      // Avatar URL
      const avatarUrl = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
      
      // Get avatar and make it circle
      const circleAvatarBuffer = await this.circle(avatarUrl);
      const avatarImg = await loadImage(circleAvatarBuffer);

      // Draw process
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(avatarImg, 48, 410, 111, 111);

      const imageBuffer = canvas.toBuffer();
      fs.writeFileSync(chorPath, imageBuffer);

      const msgBody = "╭──────•◈•───────╮\n👑🐼  ARIFUL HOSSAIN ♪♤ \n\nমুরগির দুধ চুরি করতে গিয়া ধরা থাইসে_ 🐸👻\n\n BOT OWNER ARIFUL ッ\n╰──────•◈•───────╯";

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage({
        body: msgBody,
        attachment: fs.createReadStream(chorPath)
      }, threadID, () => {
        if (fs.existsSync(chorPath)) fs.unlinkSync(chorPath);
      }, messageID);

    } catch (e) {
      console.error(e);
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(`❌ | Error: ${e.message}`, threadID, messageID);
    }
  }
};
