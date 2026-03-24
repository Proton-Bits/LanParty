console.log("Site carregado com animações ✨");

document.querySelectorAll(".player").forEach(card => {
  card.addEventListener("click", () => {
    const name = card.dataset.name;
    const info = card.dataset.info;

    alert(`Jogador: ${name}\nInfo: ${info}`);
  });
});

const yearElement = document.getElementById("year");
const currentYear = new Date().getFullYear();

yearElement.textContent = currentYear;