// VELO BOT MENU v1 (FILES neeche scripts se apne aap update hoti hai, haath se mat badalna)
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
const SITE = "https://velo-c-website-velo-c.vercel.app";
const SUPPORT_EMAIL = "thecrackedxgaming@gmail.com";
const SUPPORT_TG = "https://t.me/Thecrackedx";
const PAGE_SIZE = 8;

const CATEGORIES = [
  { icon: "🎮", label: "Gaming APKs & Mods", live: true },
  { icon: "🛠️", label: "AI Editing Tools", live: false },
  { icon: "🎬", label: "Video Resources", live: false },
  { icon: "💎", label: "Premium Packs", live: false },
];

const tg = (method, body) =>
  fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cleanVer = (v) => String(v || "").replace(/\.apk$/i, "").trim() || "Latest";
const has = (k) => Object.prototype.hasOwnProperty.call(FILES, k);
const allKeys = () => Object.keys(FILES);
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const short = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const BACK = [{ text: "🏠 Menu", callback_data: "menu" }];
const kb = (rows) => ({ inline_keyboard: rows });

const viewMenu = () => ({
  text:
    "👋 <b>Welcome to Velo C Downloads</b>\n\n" +
    "Your official delivery bot for gaming APKs, tools and resources.\n\n" +
    `📦 <b>${allKeys().length}</b> files available\n` +
    "⚡ Delivered directly in this chat\n\n" +
    "Choose an option below:",
  markup: kb([
    [{ text: "📂 Categories", callback_data: "cats" }, { text: "📋 Game List", callback_data: "list:0" }],
    [{ text: "📜 Rules", callback_data: "rules" }, { text: "ℹ️ How It Works", callback_data: "help" }],
    [{ text: "🌐 Website", url: SITE }, { text: "💬 Support", callback_data: "support" }],
  ]),
});

const viewCategories = () => ({
  text: "📂 <b>Categories</b>\n\nSelect a category to browse:",
  markup: kb([
    ...CATEGORIES.map((c) => [
      {
        text: `${c.icon} ${c.label}` + (c.live ? ` (${allKeys().length})` : " · Soon"),
        callback_data: c.live ? "list:0" : "soon",
      },
    ]),
    BACK,
  ]),
});

const gameButton = (k) => [{ text: short(`${FILES[k].name} · ${FILES[k].size}`, 56), callback_data: `g:${k}` }];

const viewList = (page) => {
  const keys = allKeys();
  if (!keys.length) {
    return { text: "📋 <b>Game List</b>\n\nNo games have been added yet. Please check back soon.", markup: { inline_keyboard: [BACK] } };
  }
  const pages = Math.max(1, Math.ceil(keys.length / PAGE_SIZE));
  const p = Math.min(Math.max(Number.isFinite(page) ? page : 0, 0), pages - 1);
  const slice = keys.slice(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE);
  const nav = [];
  if (p > 0) nav.push({ text: "◀ Prev", callback_data: `list:${p - 1}` });
  nav.push({ text: `${p + 1}/${pages}`, callback_data: "noop" });
  if (p < pages - 1) nav.push({ text: "Next ▶", callback_data: `list:${p + 1}` });
  return {
    text:
      "🎮 <b>Gaming APKs &amp; Mods</b>\n" +
      `<i>Page ${p + 1} of ${pages} · ${keys.length} games</i>\n\n` +
      "Tap a game to receive the file.\n" +
      "Or type a name to search.",
    markup: kb([...slice.map(gameButton), nav, [{ text: "📂 Categories", callback_data: "cats" }, ...BACK]]),
  };
};

const viewSearch = (q) => {
  const tokens = norm(q).split(" ").filter(Boolean);
  const hits = tokens.length
    ? allKeys().filter((k) => {
        const hay = norm(FILES[k].name + " " + k);
        return tokens.every((t) => hay.includes(t));
      })
    : [];
  const shown = hits.slice(0, 10);
  if (!shown.length) {
    return {
      text: `🔎 No match found for <b>${esc(q)}</b>.\n\nTry a different name or browse the Game List.`,
      markup: { inline_keyboard: [[{ text: "📋 Game List", callback_data: "list:0" }], BACK] },
    };
  }
  return {
    text:
      `🔎 <b>${hits.length}</b> result${hits.length > 1 ? "s" : ""} for <b>${esc(q)}</b>` +
      (hits.length > shown.length ? ` (showing first ${shown.length})` : "") +
      "\n\nTap a game to receive the file.",
    markup: { inline_keyboard: [...shown.map(gameButton), BACK] },
  };
};

const viewRules = () => ({
  text:
    "📜 <b>Rules &amp; Terms of Use</b>\n\n" +
    "1. <b>Personal use only.</b> Files are provided for personal, non-commercial use.\n" +
    "2. <b>Use at your own risk.</b> Modified apps are not affiliated with the original publishers. Back up your data first.\n" +
    "3. <b>No resale or re-uploading.</b> Do not sell our files or pass them off as your own.\n" +
    "4. <b>Respect the community.</b> No spam, abuse or misuse of this bot.\n" +
    "5. <b>Support developers.</b> If you enjoy a game, consider buying the original.\n" +
    "6. <b>Availability.</b> Files may be updated or removed at any time.\n\n" +
    "By using this bot you agree to these rules.",
  markup: { inline_keyboard: [BACK] },
});

const viewHelp = () => ({
  text:
    "ℹ️ <b>How It Works</b>\n\n" +
    "<b>Step 1.</b> Pick a game on the Velo C website, or browse it here (Categories or Game List).\n" +
    "<b>Step 2.</b> Tap <b>Download</b>. The file is delivered to this chat.\n" +
    "<b>Step 3.</b> Open the file, allow \"Install unknown apps\" if asked, then tap Install.\n\n" +
    "<b>Requirements</b>\n" +
    "• The Telegram app\n" +
    "• A VPN if Telegram does not open in your region\n" +
    "• Enough free storage (see the file size)\n\n" +
    "<b>Commands</b>\n" +
    "/menu · /games · /categories · /search · /rules · /support",
  markup: { inline_keyboard: [BACK] },
});

const viewSupport = () => ({
  text:
    "💬 <b>Support</b>\n\n" +
    "Found a broken file or have a question?\n\n" +
    `📧 Email: ${SUPPORT_EMAIL}\n` +
    "💬 Telegram: tap the button below\n\n" +
    "Please include the game name and a short description of the problem.",
  markup: { inline_keyboard: [[{ text: "💬 Message on Telegram", url: SUPPORT_TG }], BACK] },
});

const show = (chat, view) =>
  tg("sendMessage", {
    chat_id: chat,
    text: view.text,
    parse_mode: "HTML",
    reply_markup: view.markup,
    disable_web_page_preview: true,
  });

async function deliver(chat, key) {
  const item = FILES[key];
  await tg("sendChatAction", { chat_id: chat, action: "upload_document" });
  await tg("sendMessage", {
    chat_id: chat,
    parse_mode: "HTML",
    text: `⏳ Sending <b>${esc(item.name)}</b>...\nLarge files may take a moment.`,
  });
  await tg("sendDocument", {
    chat_id: chat,
    document: item.file_id,
    parse_mode: "HTML",
    caption:
      `🎮 <b>${esc(item.name)}</b>\n\n` +
      `📦 Version: ${esc(cleanVer(item.version))}\n` +
      `💾 Size: ${esc(item.size)}\n\n` +
      "✅ <b>How to install</b>\n" +
      "1. Open the downloaded file.\n" +
      "2. Allow \"Install unknown apps\" when prompted.\n" +
      "3. Tap Install and enjoy.\n\n" +
      "🌐 Velo C Downloads",
    reply_markup: {
      inline_keyboard: [[{ text: "📋 More Games", callback_data: "list:0" }, ...BACK]],
    },
  });
}

async function onMessage(msg) {
  const chat = msg.chat.id;
  const text = (msg.text || "").trim();
  const isOwner = String(msg.from.id) === String(process.env.OWNER_ID || "");

  const f = msg.document || msg.video;
  if (f) {
    if (isOwner) {
      const sz = f.file_size
        ? f.file_size >= 1073741824
          ? (f.file_size / 1073741824).toFixed(2) + " GB"
          : Math.round(f.file_size / 1048576) + " MB"
        : "? MB";
      await tg("sendMessage", { chat_id: chat, text: (f.file_name || "file") + " | " + sz + " | " + f.file_id });
    }
    return;
  }
  if (!text) return;

  const parts = text.split(/\s+/);
  const cmd = parts[0].toLowerCase().replace(/@\w+$/, "");
  const arg = parts.slice(1).join(" ");

  if (!cmd.startsWith("/")) return show(chat, viewSearch(text));

  if (cmd === "/start") {
    if (arg && has(arg)) return deliver(chat, arg);
    return show(chat, viewMenu());
  }
  if (cmd === "/menu") return show(chat, viewMenu());
  if (cmd === "/games" || cmd === "/list") return show(chat, viewList(0));
  if (cmd === "/categories") return show(chat, viewCategories());
  if (cmd === "/rules") return show(chat, viewRules());
  if (cmd === "/help") return show(chat, viewHelp());
  if (cmd === "/support") return show(chat, viewSupport());
  if (cmd === "/search") {
    if (!arg) {
      return tg("sendMessage", { chat_id: chat, text: "🔎 Type a game name after the command.\nExample: /search free fire" });
    }
    return show(chat, viewSearch(arg));
  }
  if (cmd === "/id" && (isOwner || !process.env.OWNER_ID)) {
    return tg("sendMessage", { chat_id: chat, text: "Your ID: " + msg.from.id });
  }
  return show(chat, viewMenu());
}

async function onCallback(cq) {
  const data = cq.data || "";
  const chat = cq.message && cq.message.chat && cq.message.chat.id;
  const mid = cq.message && cq.message.message_id;
  const answer = (extra) => tg("answerCallbackQuery", { callback_query_id: cq.id, ...(extra || {}) });

  if (!chat || data === "noop") return answer();
  if (data === "soon") return answer({ text: "This category is coming soon.", show_alert: true });

  if (data.startsWith("g:")) {
    const key = data.slice(2);
    if (!has(key)) return answer({ text: "This file is no longer available.", show_alert: true });
    await answer({ text: "Sending your file..." });
    return deliver(chat, key);
  }

  let view = null;
  if (data === "menu") view = viewMenu();
  else if (data === "cats") view = viewCategories();
  else if (data.startsWith("list:")) view = viewList(parseInt(data.slice(5), 10));
  else if (data === "rules") view = viewRules();
  else if (data === "help") view = viewHelp();
  else if (data === "support") view = viewSupport();

  await answer();
  if (!view) return;
  if (typeof cq.message.text === "string") {
    return tg("editMessageText", {
      chat_id: chat,
      message_id: mid,
      text: view.text,
      parse_mode: "HTML",
      reply_markup: view.markup,
      disable_web_page_preview: true,
    });
  }
  return show(chat, view);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("ok");
  const body = req.body || {};
  try {
    if (body.callback_query) await onCallback(body.callback_query);
    else if (body.message) await onMessage(body.message);
  } catch (e) {
    // always answer 200 so Telegram does not retry
  }
  return res.status(200).send("ok");
}
