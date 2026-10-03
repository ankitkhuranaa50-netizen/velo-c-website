const FILES = {
  game1: {
    file_id: "BQACAgUAAxkBAAMFasDGjvGAj-E-vJxkVyeRfFKcSz8AAuIXAAJOOQFVj6qA_y-Gawo9BA",
    name: "Car Simulator 2 (MOD)",
    version: "1.57.1",
    size: "756 MB",
  },
};

const API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const tg = (method, body) =>
  fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("ok");
  const msg = req.body && req.body.message;
  if (!msg) return res.status(200).send("ok");

  const chat = msg.chat.id;
  const text = msg.text || "";
  const isOwner = String(msg.from.id) === String(process.env.OWNER_ID || "");

  const f = msg.document || msg.video;
  if (f) {
    if (isOwner) await tg("sendMessage", { chat_id: chat, text: "file_id:\n" + f.file_id });
    return res.status(200).send("ok");
  }

  if (text === "/id") {
    await tg("sendMessage", { chat_id: chat, text: "Your ID: " + msg.from.id });
  } else if (text.startsWith("/start")) {
    const item = FILES[text.split(" ")[1]];
    if (item) {
      await tg("sendChatAction", { chat_id: chat, action: "upload_document" });
      await tg("sendMessage", {
        chat_id: chat,
        parse_mode: "HTML",
        text: `⏳ <b>${item.name}</b> bheji ja rahi hai.\nBadi file hai to thoda wait karein.`,
      });
      await tg("sendDocument", {
        chat_id: chat,
        document: item.file_id,
        parse_mode: "HTML",
        caption:
          `🎮 <b>${item.name}</b>\n` +
          `📦 Version: ${item.version}\n` +
          `💾 Size: ${item.size}\n\n` +
          `✅ <b>Install kaise karein:</b>\n` +
          `1. File download hone ke baad open karein\n` +
          `2. "Install unknown apps" allow karein\n` +
          `3. Install karke khelein\n\n` +
          `🌐 Velo C Downloads`,
      });
    } else {
      await tg("sendMessage", {
        chat_id: chat,
        parse_mode: "HTML",
        text: "👋 <b>Velo C Downloads mein swagat hai!</b>\n\nKoi bhi file paane ke liye Velo C website pe jaakar <b>Download</b> button dabayein, file yahin aa jayegi.",
      });
    }
  }
  res.status(200).send("ok");
}