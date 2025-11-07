// Wait until the page loads
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const button = document.getElementById("submitBtn");
  const response = document.getElementById("response");

  // When button is clicked
  button.addEventListener("click", () => {
    const userText = input.value; // get what they typed
    response.textContent = `You typed: ${userText}`;
  });
});
