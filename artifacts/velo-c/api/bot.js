const FILES = {
  "flip-master": {
    file_id: "BQACAgUAAxkBAAMWasEXSBzcRNITFmu-I6OAbuv1VSEAAj4ZAAJOOQFVyamw8zdTKRQ9BA",
    name: "Flip Master",
    version: "3.4.00.apk",
    size: "143.1 MB",
  },
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
        text: `⏳ <b>${item.name}</b> is being sent.\nLarge files may take a moment, please wait.`,
      });
      await tg("sendDocument", {
        chat_id: chat,
        document: item.file_id,
        parse_mode: "HTML",
        caption:
          `🎮 <b>${item.name}</b>\n` +
          `📦 Version: ${item.version}\n` +
          `💾 Size: ${item.size}\n\n` +
          `✅ <b>How to install:</b>\n` +
          `1. Open the downloaded file.\n` +
          `2. Allow "Install unknown apps" when prompted.\n` +
          `3. Tap Install and enjoy.\n\n` +
          `🌐 Velo C Downloads`,
      });
    } else {
      await tg("sendMessage", {
        chat_id: chat,
        parse_mode: "HTML",
        text: "👋 <b>Welcome to Velo C Downloads!</b>\n\nTo get a file, open the Velo C website and tap the <b>Download</b> button. Your file will be delivered right here.",
      });
    }
  }
  res.status(200).send("ok");
}