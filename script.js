console.log("Site carregado com animações ✨");

document.querySelectorAll(".player").forEach(card => {
  card.addEventListener("click", () => {
    alert("Você clicou no jogador!");
  });
});