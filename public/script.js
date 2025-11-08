// public/script.js

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const responseEl = document.getElementById("response");

  // If ai.html defines window.API_BASE (e.g., "http://localhost:3001"),
  // we'll use it. Otherwise, we'll call same-origin ("/api/chat").
  const API_BASE = window.API_BASE || "";

  // Keep a tiny history so the server can build context
  const history = [];

  function setBusy(busy) {
    sendBtn.disabled = busy;
    sendBtn.textContent = busy ? "Sending..." : "Send";
  }

  async function sendMessage() {
    const userText = (input.value || "").trim();
    if (!userText) return;

    responseEl.textContent = "Thinking...";
    setBusy(true);
    history.push({ role: "user", content: userText });

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          model: "gemini-2.0-flash",
          temperature: 0.3
        })
      });

      // If the server returns a non-2xx status, surface the message
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.text ?? "No response";
      history.push({ role: "model", content: text });
      responseEl.textContent = text;
    } catch (e) {
      responseEl.textContent = "Network/API error: " + e.message;
    } finally {
      input.value = "";
      input.focus();
      setBusy(false);
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
});
