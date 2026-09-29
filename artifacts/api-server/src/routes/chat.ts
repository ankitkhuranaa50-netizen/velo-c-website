import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// System prompt that gives Velo AI its Velo C personality
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

router.post("/chat", async (req, res): Promise<void> => {
  const { message } = req.body as { message?: string };

  if (!message || typeof message !== "string" || message.trim() === "") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    req.log.error("OPENAI_API_KEY is not configured");
    res.status(503).json({
      error: "AI service is not configured. Please add the OPENAI_API_KEY secret.",
    });
    return;
  }

  try {
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    req.log.info({ messageLength: message.trim().length }, "Sending message to OpenRouter");

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
    res.json({ reply });
  } catch (err: unknown) {
    req.log.error({ err }, "OpenAI API error");

    const raw = err instanceof Error ? err.message : String(err);

    if (raw.includes("429") || raw.includes("quota") || raw.includes("rate limit")) {
      res.status(429).json({
        error: "⚠️ OpenAI rate limit reached. Please wait a moment and try again.",
      });
      return;
    }
    if (raw.includes("401") || raw.includes("403") || raw.includes("Incorrect API key")) {
      res.status(401).json({
        error: "⚠️ Invalid OpenAI API key. Please update OPENAI_API_KEY in Replit Secrets.",
      });
      return;
    }

    res.status(500).json({ error: "Failed to get AI response. Please try again." });
  }
});

export default router;
