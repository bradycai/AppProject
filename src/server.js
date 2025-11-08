// src/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- only needed to resolve ../public in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// If front-end is served by this same server, CORS is optional.
// You can leave it on; it won't hurt.
app.use(cors());
app.use(express.json());

// NEW: serve your static frontend from /public (sibling of /src)
app.use(express.static(path.join(__dirname, "..", "public")));

// Optional: quick check for missing key (helps avoid silent 500s)
if (!process.env.GEMINI_API_KEY) {
  console.warn("Warning: GEMINI_API_KEY is not set in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple non-streaming chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model = "gemini-2.0-flash", temperature = 0.3 } = req.body;

    const modelHandle = genAI.getGenerativeModel({ model });
    const prompt = (messages || [])
      .map(m => `${(m.role || "user").toUpperCase()}: ${m.content || ""}`)
      .join("\n");

    const result = await modelHandle.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt || "Hello!" }] }],
      generationConfig: { temperature },
    });

    const text = result.response.text();
    res.json({ text });
  } catch (err) {
    const code = err.status || 500;
    res.status(code).json({
      error: {
        code,
        message: err.message || "Server error",
        type: "GEMINI_ERROR",
      },
    });
  }
});

// (Optional) streaming endpoint
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { prompt, model = "gemini-2.0-flash", temperature = 0.3 } = req.body;

    const modelHandle = genAI.getGenerativeModel({ model });
    const stream = await modelHandle.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    for await (const chunk of stream.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/ai.html`);
});
