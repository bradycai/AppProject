// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     AI Chat Logic
  --------------------------- */
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const responseEl = document.getElementById("response");

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
    }
  });
});
