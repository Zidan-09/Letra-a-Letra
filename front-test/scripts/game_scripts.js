document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS
  const waitingStage = document.getElementById("waiting-stage");
  const gameStage = document.getElementById("game-stage");

  const roomDisplay = document.getElementById("room-display");
  const playersListWaiting = document.getElementById("players-list-waiting");
  const logsList = document.getElementById("logs-panel");

  const playBtn = document.getElementById("start-btn"); // corrigido id
  const backBtn = document.getElementById("back-btn-waiting"); // corrigido id

  const board = document.getElementById("board");

  // VARIÁVEIS
  const nickname = localStorage.getItem("nickname");
  let room_id = localStorage.getItem("room_id");
  const actionType = localStorage.getItem("action_type"); // create ou join
  let players = [];

  // SETUP
  roomDisplay.textContent = room_id || "Desconhecida";
  playBtn.disabled = true;

  // LOG
  function addLog(msg) {
    if (!logsList) return;
    const li = document.createElement("li");
    li.textContent = msg;
    logsList.appendChild(li);
    logsList.scrollTop = logsList.scrollHeight;
  }

  // LISTA DE JOGADORES
  function updatePlayersWaiting() {
    playersListWaiting.innerHTML = "";
    players.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.nickname} - Pontos: ${p.score || 0}`;
      playersListWaiting.appendChild(li);
    });
  }

  // TABULEIRO 10x10
  function createBoard(rows = 10, cols = 10) {
    board.innerHTML = "";
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.textContent = "";
        cell.addEventListener("click", async () => {
          await fetch("http://localhost:3333/game/moveGame", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              room_id,
              player_id: socket.id,
              movement: "REVEAL",
              x,
              y
            })
          }).catch(err => console.error(err));
        });
        board.appendChild(cell);
      }
    }
    board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    board.style.gridGap = "5px";
  }

  // CONEXÃO SOCKET
  const socket = io("http://localhost:3333");

  socket.on("connect", async () => {
    addLog(`Conectado ao servidor, socket id: ${socket.id}`);

    try {
      if (actionType === "create") {
        const body = {
          socket_id: socket.id,
          nickname,
          privateRoom: localStorage.getItem("privateRoom") === "true"
        };

        const res = await fetch("http://localhost:3333/room/createRoom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        room_id = data.data.room_id;
        localStorage.setItem("room_id", room_id);
        roomDisplay.textContent = room_id;
        addLog("Sala criada com sucesso!");
      } else if (actionType === "join") {
        const body = {
          socket_id: socket.id,
          nickname,
          room_id
        };

        const res = await fetch("http://localhost:3333/room/joinRoom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        const data = await res.json();
        addLog("Entrou na sala com sucesso!");
      }
    } catch (err) {
      console.error(err);
      addLog("Erro ao processar a sala.");
    }
  });

  // SOCKET EVENTS

  // Jogador entrou
  socket.on("player_joinned", (roomData) => {
    players = roomData.players || [];
    updatePlayersWaiting();
    if (players.length > 0) addLog(`${players[players.length - 1].nickname} entrou na sala`);
    playBtn.disabled = players.length < 2;
  });

  // Jogador saiu
  socket.on("player_left", (roomData) => {
    players = roomData.players || [];
    updatePlayersWaiting();
    addLog("Um jogador saiu da sala");
    playBtn.disabled = players.length < 2;
  });

  // Partida iniciada
  socket.on("game_started", (gameData) => {
    waitingStage.style.display = "none";
    gameStage.style.display = "flex";

    createBoard(10, 10);
    localStorage.setItem("first", gameData.first.player_id);

    addLog(`Partida iniciada! Primeiro jogador: ${gameData.first.nickname}`);
    addLog(`Palavras a serem encontradas: ${gameData.words.join(", ")}`);
  });

  // Movimento recebido
  socket.on("movement", (res) => {
    const { movement, player_id, data } = res;

    if (movement === "REVEAL") {
      const cell = board.querySelector(`.cell[data-x='${data.cell.x}'][data-y='${data.cell.y}']`);
      first = localStorage.getItem("first");

      if (cell) {
        cell.textContent = data.letter

        if (first === player_id) {
          cell.style.border = "2px solid blue"
        } else {
          cell.style.border = "2px solid orange"
        }
      };

      addLog(`Letra revelada em (${data.cell.x},${data.cell.y}): ${data.letter}`);
      if (data.completedWord) {
        addLog(`Palavra completada: ${data.completedWord.word}`);

        for (let [i, o] of data.completedWord.positions) {

          const cell = board.querySelector(`.cell[data-x='${i}'][data-y='${o}']`);
          if (!cell) continue;

          if (first === player_id) {
            cell.style.backgroundColor = "blue"
          } else {
            cell.style.backgroundColor = "orange"
          }

          cell.style.color = "white"
        }
      };
    }
  });

  socket.on("game_over", (data) => {
    const { winner } = data;
    addLog(`Vencedor: ${winner.nickname}`)
    
    setTimeout(() => {
      waitingStage.style.display = "flex";
      gameStage.style.display = "none";
      playBtn.disabled = false;
    }, 2000)
  })

  // BOTÕES
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  playBtn.addEventListener("click", async () => {
    try {
      await fetch(`http://localhost:3333/game/startGame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id,
          theme: localStorage.getItem("theme")
        })
      })
      addLog("Solicitado início da partida...");
      playBtn.disabled = true;
    } catch (err) {
      console.error(err);
      addLog("Erro ao iniciar a partida.");
    }
  });

  // Inicializa tabuleiro
  createBoard();
});