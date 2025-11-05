document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("myModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.getElementById("closeModalBtn");

  if (!modal || !openBtn || !closeBtn) return; 

  openBtn.onclick = () => {
    modal.style.display = "flex";
  };

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
});
