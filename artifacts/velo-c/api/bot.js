const FILES = {
  // key: { file_id, caption }
  game1: { file_id: "BQACAgUAAxkBAAMFasDGjvGAj-E-vJxkVyeRfFKcSz8AAuIXAAJOOQFVj6qA_y-Gawo9BA", caption: "Game 1" },
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

  // Owner file bheje to uska file_id wapas mil jaata hai
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
      await tg("sendMessage", { chat_id: chat, text: "Aapki file aa rahi hai, thoda wait karein..." });
      await tg("sendDocument", { chat_id: chat, document: item.file_id, caption: item.caption });
    } else {
      await tg("sendMessage", { chat_id: chat, text: "Velo C pe wapas jaakar download button dabayein." });
    }
  }
  res.status(200).send("ok");
}