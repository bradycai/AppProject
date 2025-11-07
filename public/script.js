// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const response = document.getElementById("response");

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const userText = input.value;
      response.textContent = `You said: ${userText}`;
      input.value = ""; // clear the text box
    });
  }
});
