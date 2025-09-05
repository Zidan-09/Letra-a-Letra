// roomScript.js
import { socket, reconnectPlayers, renderPlayers, serverIp } from "../scripts/script.js";

const room_id = localStorage.getItem("room_id");
const id = document.getElementById("room_id")
id.textContent = room_id;

const startBtn = document.getElementById("startGame");
const panelDiv = document.querySelector(".panel");
const gameDiv = document.getElementById("game");
const gridDiv = document.getElementById("grid");

// Reconectar players na sala
reconnectPlayers();

// Atualizar lista de players
socket.on("player_joinned", (room) => {
  localStorage.setItem("players", JSON.stringify(room.players));
  renderPlayers(room.players);

  // Habilita Start se tiver pelo menos 2 players
  startBtn.disabled = room.players.length < 2;
});

// Iniciar jogo
startBtn.addEventListener("click", () => {

  if (!room_id) return alert("DEBUG: Não tem id guardado");

  fetch(`http://${serverIp}:3333/game/startGame/${room_id}`).then(res => res.json()).then(data => {
    console.log(data);
  })
});

// Criar grade 10x10
function createGrid() {
  gridDiv.innerHTML = "";
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const btn = document.createElement("button");
      btn.dataset.x = x;
      btn.dataset.y = y;
      btn.textContent = "";
      btn.addEventListener("click", () => {
        fetch(`http://${serverIp}:3333/game/revealLetter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            room_id: room_id,
            player_id: socket.id,
            x: x,
            y: y
          })
        })
      });
      gridDiv.appendChild(btn);
    }
  }
}

socket.on("game_started", () => {
    panelDiv.style.display = "none";
    gameDiv.style.display = "block";
    createGrid();
})

socket.on("letter_revealed", ({ x, y, letter }) => {
  const btn = document.querySelector(`button[data-x="${x}"][data-y="${y}"]`);
  if (btn) {
    btn.textContent = letter;
    btn.disabled = true; // opcional
  }
});