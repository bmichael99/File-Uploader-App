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

    async function copyClick(linkId){
      console.log("clicked");
      const copyInput = document.querySelector(`.copy-input-${linkId}`);
      const copyButton = document.querySelector(`.copy-button-${linkId}`);

      copyButton.textContent = "Copied!";
      copyButton.classList = `green-button copy-button-${linkId}`;

      await navigator.clipboard.writeText(copyInput.value);
      await resetLinkButton(copyButton,linkId);
    }

    async function resetLinkButton(copyButton, linkId){
        setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.classList = `darker-blue-button copy-button-${linkId}`;
      }, 3000)
    }