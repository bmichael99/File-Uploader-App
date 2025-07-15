const createFolderButton = document.querySelector(".create-folder-button");
const modal = document.querySelector(".create-folder-modal");
const closeCreateFolderButton = document.querySelector(".close-create-folder-modal");

createFolderButton.addEventListener("click", (e) => {
  modal.showModal();
})

closeCreateFolderButton.addEventListener("click", (e) => {
  modal.close();
})