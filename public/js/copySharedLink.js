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
      
      
      const copyInput = document.querySelector(`.copy-input-${linkId}`);
      const copyButtonMobile = document.querySelector(`.copy-button-mobile-${linkId}`);
      const errorMenu = document.querySelector(`.errors`);

      try{
        await navigator.clipboard.writeText(copyInput.value);
      } catch(err){
        if(!document.querySelector(".error2")){
          const copiedMessage = document.createElement("p");
          copiedMessage.classList.add("error2");
          copiedMessage.classList.add("error");
          copiedMessage.textContent = "Failed to copy!"
          errorMenu.appendChild(copiedMessage);
        }
        return;
      }

      if (window.matchMedia('(min-width: 640px)').matches) {
        const copyButton = document.querySelector(`.copy-button-${linkId}`);
        copyButton.textContent = "Copied!";
        copyButton.classList = `green-button copy-button-green copy-button-${linkId}`;
        await resetCopyLinkButton(copyButton,linkId);
      }else{
        const copiedSvg = document.querySelector(`.copied-${linkId}`);
        copyButtonMobile.style.display = "none";
        copiedSvg.style.display = "revert";
        if(!document.querySelector(".good-error")){
          const copiedMessage = document.createElement("p");
          copiedMessage.classList.add("good-error");
          copiedMessage.textContent = "Copied!"
          errorMenu.appendChild(copiedMessage);
          await resetCopyLinkButtonMobile(copiedSvg,copyButtonMobile,errorMenu,copiedMessage);
        }else{
          await resetCopyLinkButtonMobile(copiedSvg,copyButtonMobile,errorMenu);
        }
        
        
      }

      

      

    }

    async function resetCopyLinkButton(copyButton, linkId){
        setTimeout(() => {
          copyButton.textContent = "Copy";
          copyButton.classList = `darker-blue-button copy-button-${linkId}`;
      }, 3000)
    }

    async function resetCopyLinkButtonMobile(copiedSvg,copyButtonMobile,errorMenu,copiedMessage){
        setTimeout(() => {
          copiedSvg.style.display = "none";
          copyButtonMobile.style.display = "revert";
          if(copiedMessage){
            errorMenu.removeChild(copiedMessage);
            copiedMessage.remove();
          }
      }, 3000)
    }