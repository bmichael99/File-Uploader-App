    const button = document.querySelector(".copy-button");
    const input = document.querySelector(".copy-input");
    const clickStatus = document.querySelector(".copy-status");
    
    if (button && input) {
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(input.value);
          clickStatus.textContent = "Copied!";
        } catch (err) {
          clickStatus.textContent = "Failed to copy";
          console.error("Copy error:", err);
        }
      });
    }