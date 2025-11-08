// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     AI Chat Logic
  --------------------------- */
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const response = document.getElementById("response");

<<<<<<< HEAD
  if (input && sendBtn && responseEl) {
    sendBtn.addEventListener("click", () => {
      const userText = input.value.trim();

      if (userText !== "") {
        responseEl.textContent = `You said: ${userText}`;
        input.value = "";
      }
    });

    // Allow pressing Enter to send
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
    if (savedState === "true") {
      sidebar.classList.add("open");
=======
  // Handle "Send" button click
  sendBtn.addEventListener("click", () => {
    const userText = input.value.trim();

    if (userText !== "") {
      response.textContent = `You said: ${userText}`;
      input.value = "";
    }
  });

  // Allow pressing Enter to send
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendBtn.click();
>>>>>>> parent of 28416a6 (ai functionality)
    }

    // Toggle sidebar open/close
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      localStorage.setItem("sidebarOpen", sidebar.classList.contains("open"));
    });
  }
});