const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
      name: "edit",
          aliases: ["nanobanana"],
              version: "1.0.7",
                  author: "〲MAMUNツ࿐ T.T　o.O",
                      countDown: 30,
                          role: 0,
                              shortDescription: "Edit image using NanoBanana API",
                                  category: "AI",
                                      guide: {
                                            en: "{pn} <text> (reply to an image)",
                                                },
                                                  },
  onStart: async function ({ message, event, args, api }) {
      const prompt = args.join(" ");
          if (!prompt)
                return message.reply("⚠️ Please provide text for editing the image.");
    if (
          !event.messageReply ||
                !event.messageReply.attachments ||
                      event.messageReply.attachments.length === 0
                          ) {
                                return message.reply("⚠️ Please reply to an image.");
                                    }
    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
          return message.reply("⚠️ Only image reply supported.");
              }
    api.setMessageReaction("⏳", event.messageID, () => {}, true);
    try {
          const imgUrl = attachment.url;
      const requestURL = `https://mahbub-ullash.cyberbot.top/api/nano-banana?prompt=${encodeURIComponent(
              prompt
                    )}&imageUrl=${encodeURIComponent(imgUrl)}`;
      const res = await axios.get(requestURL, { timeout: 60000 });
      if (!res.data || res.data.status !== true || !res.data.image) {
              api.setMessageReaction("⚠️", event.messageID, () => {}, true);
                      return message.reply("❌ API Error: Image not generated.");
                            }
      const finalImageURL = res.data.image;
      // 🔥 Fixed Operator Name
            const operatorName = "〲MAMUNツ࿐ T.T　o.O";
      const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir))
                    fs.mkdirSync(cacheDir, { recursive: true });
      const filePath = path.join(cacheDir, `${Date.now()}.jpg`);
      const response = await axios({
              url: finalImageURL,
                      method: "GET",
                              responseType: "stream",
                                      timeout: 60000,
                                            });
      const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
      await new Promise((resolve, reject) => {
              writer.on("finish", resolve);
                      writer.on("error", reject);
                            });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
      await message.reply(
              {
                        body: `✅ Image generated successfully!\n👤 Operator: 〲MAMUNツ࿐ T.T　o.O`,
                                  attachment: fs.createReadStream(filePath),
                                          }
                                                );
      setTimeout(() => {
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    }, 3000);
    } catch (err) {
          console.error("ERROR:", err.message);
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                      return message.reply("❌ Error while processing image.");
                          }
                            },
                            };
