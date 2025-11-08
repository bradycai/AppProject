// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple non-streaming chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model = "gemini-2.0-flash", temperature = 0.3 } = req.body;

    // messages = [{role:"user"|"model"|"system", content:"..."}]
    const modelHandle = genAI.getGenerativeModel({ model });

    // Convert simple chat array -> one prompt for Flash/Pro

    // flash runs fast but pro is better for detailed response (prioritize using flash first)
    const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");

    const result = await modelHandle.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
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

    // Server sent events (SSE) headers for chunks
    // real time updates from the model to the program
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // send message chunks as they arrive (like ChatGPT typewriter animation)
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
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
