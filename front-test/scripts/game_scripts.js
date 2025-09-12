const nicknameDisplay = document.getElementById("nickname-display");
const roomDisplay = document.getElementById("room-display");
const turnDisplay = document.getElementById("turn-display");

const board = document.getElementById("board");
const playersList = document.getElementById("players-list");
const logsList = document.getElementById("logs-list");

const passTurnBtn = document.getElementById("pass-turn-btn");
const endGameBtn = document.getElementById("end-game-btn");

const nickname = localStorage.getItem("nickname");
let room_id = localStorage.getItem("room_id");
const actionType = localStorage.getItem("action_type"); // create ou join

nicknameDisplay.textContent = nickname || "Desconhecido";
roomDisplay.textContent = room_id || "Desconhecida";

// Conecta ao Socket.IO
const socket = io("http://localhost:3333");

socket.on("connect", async () => {
  addLog(`Conectado ao servidor, socket id: ${socket.id}`);

  try {
    let body = { socket_id: socket.id, nickname };

    if (actionType === "create") {
      body.theme = localStorage.getItem("theme");
      body.turn_time = parseInt(localStorage.getItem("turn_time"));
      body.privateRoom = localStorage.getItem("privateRoom") === "true";

      const response = await fetch("http://localhost:3333/v1/room/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      room_id = data.room_id || room_id; // atualiza caso o backend gere um id
      localStorage.setItem("room_id", room_id);
      roomDisplay.textContent = room_id;
      addLog("Sala criada com sucesso!");

    } else if (actionType === "join") {
      body.room_id = room_id;

      const response = await fetch("http://localhost:3333/v1/room/joinRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      addLog("Entrou na sala com sucesso!");
    }

    // Aqui você pode atualizar jogadores, tabuleiro etc
  } catch (err) {
    console.error(err);
    addLog("Erro ao processar a sala.");
  }
});

// Funções do tabuleiro
function createBoard(rows = 10, cols = 10) {
  board.innerHTML = "";
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = "";
    cell.addEventListener("click", () => handleCellClick(i));
    board.appendChild(cell);
  }
}

function handleCellClick(index) {
  addLog(`Célula ${index} clicada`);
}

// Jogadores e logs
let players = [];
function updatePlayers() {
  playersList.innerHTML = "";
  players.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nickname} - Pontos: ${p.points || 0}`;
    playersList.appendChild(li);
  });
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  logsList.appendChild(li);
  logsList.scrollTop = logsList.scrollHeight;
}

// Botões
passTurnBtn.addEventListener("click", () => {
  addLog("Turno passado");
});

endGameBtn.addEventListener("click", () => {
  addLog("Jogo finalizado");
});

// Inicializa tabuleiro
createBoard();