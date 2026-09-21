// Vercel Serverless Function — replaces artifacts/api-server/src/routes/chat.ts
// Vercel auto-detects any file inside /api as a serverless function.
// Since the frontend already calls fetch('/api/chat'), NO frontend code
// needs to change — this file just needs to exist at this exact path.

import OpenAI from "openai";

const SYSTEM_PROMPT = `You are Velo AI, a helpful and friendly assistant for "Velo C" — the ultimate destination for high-speed direct downloads. Velo C specializes in:
- Premium gaming configs (BGMI, Free Fire, Call of Duty, and other popular games)
- AI-powered editing tools (CapCut, Remini, AI Face Swap, and more)
- High-quality video assets and sound effects
- Exclusive premium packs for creators and gamers worldwide

Your personality: Enthusiastic, knowledgeable about gaming and content creation, always helpful, uses a slightly casual tone. Keep responses concise and under 100 words unless more detail is genuinely needed.

When users ask about:
- "game" or games → Enthusiastically recommend BGMI configs, Free Fire mods, Call of Duty packs available on Velo C
- "edit" or "editing tool" → Recommend CapCut, Remini, AI Face Swap tools from the Editing Tools section
- "download" → Guide them to click the category cards on the homepage to find what they need
- "hello" or greetings → Greet them warmly and briefly explain what Velo C offers

Always be positive and encourage users to explore the Velo C categories.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { message } = req.body || {};

  if (!message || typeof message !== "string" || message.trim() === "") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      error: "AI service is not configured. Please add the OPENAI_API_KEY environment variable in Vercel.",
    });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message.trim() },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);

    if (raw.includes("429") || raw.includes("quota") || raw.includes("rate limit")) {
      res.status(429).json({ error: "⚠️ Rate limit reached. Please wait a moment and try again." });
      return;
    }
    if (raw.includes("401") || raw.includes("403") || raw.includes("Incorrect API key")) {
      res.status(401).json({ error: "⚠️ Invalid API key. Please update OPENAI_API_KEY in Vercel." });
      return;
    }

    res.status(500).json({ error: "Failed to get AI response. Please try again." });
  }
}
