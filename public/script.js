// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     AI Chat Logic
  --------------------------- */
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatBox = document.getElementById("chatBox");

  if (input && sendBtn && chatBox) {
    // Helper to show messages in chat
    const addMessage = (text, sender) => {
      const msg = document.createElement("div");
      msg.classList.add("message", sender);
      msg.textContent = text;
      chatBox.appendChild(msg);
      chatBox.scrollTop = chatBox.scrollHeight;
    };

    // Send message to backend
    sendBtn.addEventListener("click", async () => {
      const userText = input.value.trim();
      if (!userText) return;

      addMessage(userText, "user");
      input.value = "";

      // Temporary “thinking” message
      const thinkingMsg = document.createElement("div");
      thinkingMsg.classList.add("message", "ai");
      thinkingMsg.textContent = "Thinking...";
      chatBox.appendChild(thinkingMsg);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: userText }],
          }),
        });

        const data = await res.json();
        if (data.text) {
          thinkingMsg.textContent = data.text;
        } else {
          thinkingMsg.textContent = "⚠️ No response from AI.";
        }
      } catch (err) {
        console.error(err);
        thinkingMsg.textContent = "⚠️ Server error. Try again.";
      }
    });

    // Press Enter to send
    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendBtn.click();
      }
    });
  }

  /* ---------------------------
     Sidebar Logic
  --------------------------- */
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {
    // Restore saved sidebar state
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState === "true") sidebar.classList.add("open");

    // Toggle sidebar open/close
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      localStorage.setItem("sidebarOpen", sidebar.classList.contains("open"));
    });
  }
});
