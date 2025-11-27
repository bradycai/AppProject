// src/server.js
// temp
import express from "express";
import cors from "cors";
import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve all static files from /public
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// ✅ Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ✅ Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -----------------------------
// Chat Endpoint
// -----------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model = "gemini-2.0-flash", temperature = 0.3 } = req.body;
    const modelHandle = genAI.getGenerativeModel({ model });

    const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    const result = await modelHandle.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature },
    });

    res.json({ text: result.response.text() });
  } catch (err) {
    console.error("❌ Gemini API Error:", err);
    res.status(err.status || 500).json({
      error: err.message || "Server error",
    });
  }
});

// ✅ Catch-all route for unmatched URLs (optional)
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicPath, "index.html"));
});

// -----------------------------
// Start server
// -----------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ AIVY server running at http://localhost:${PORT}`);
  console.log(`🧩 Serving static files from: ${publicPath}`);
});
