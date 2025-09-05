// roomScript.js
import { socket, reconnectPlayers, renderPlayers } from "../scripts/script.js";

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
  panelDiv.style.display = "none";
  gameDiv.style.display = "block";
  createGrid();

  socket.emit("startGame", {
    room_id: localStorage.getItem("room_id")
  });
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
        socket.emit("cellClick", {
          room_id: localStorage.getItem("room_id"),
          player_id: socket.id, // pode trocar se usar outro id de player
          x,
          y
        });
      });
      gridDiv.appendChild(btn);
    }
  }
}

// Receber atualização de célula do servidor
socket.on("cellUpdate", ({ x, y, letter }) => {
  const btn = document.querySelector(`button[data-x="${x}"][data-y="${y}"]`);
  if (btn) {
    btn.textContent = letter;
    btn.disabled = true; // opcional
  }
});