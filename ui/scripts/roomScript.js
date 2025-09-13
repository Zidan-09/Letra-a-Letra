// roomScript.js
import { socket, reconnectPlayers, renderPlayers, serverIp } from "../scripts/script.js";

const room_id = localStorage.getItem("room_id");
const id = document.getElementById("room_id")
id.textContent = room_id;

const startBtn = document.getElementById("startGame");
const panelDiv = document.querySelector(".panel");
const allDiv = document.getElementById("all");
const gameDiv = document.getElementById("game");
const gridDiv = document.getElementById("grid");

reconnectPlayers();

socket.on("player_joinned", (room) => {
  localStorage.setItem("players", JSON.stringify(room.players));
  renderPlayers(room.players);

  startBtn.disabled = room.players.length < 2;
});

socket.on("player_left", (room) => {
  localStorage.setItem("players", JSON.stringify(room.players));
  renderPlayers(room.players);

  startBtn.disabled = room.players.length < 2;
});

startBtn.addEventListener("click", () => {

  if (!room_id) return alert("DEBUG: Não tem id guardado");

  fetch(`http://${serverIp}:3333/game/startGame/${room_id}`).then(res => res.json())
});

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

socket.on("game_started", ({first, words}) => {
    localStorage.setItem("first", first);
    localStorage.setItem("words", words);
    allDiv.style.display = "flex"
    panelDiv.style.display = "none";
    gameDiv.style.display = "block";
    createGrid();
    renderWords(words);
})

socket.on("letter_revealed", ({ x, y, data, player_id }) => {  // Socket deve enviar o player_id separado e sempre
  const btn = document.querySelector(`button[data-x="${x}"][data-y="${y}"]`);
  if (btn) {

    if (typeof data == "string") {
      btn.textContent = data;
    } else {
      btn.textContent = data.letter;
    }

    
    btn.classList.remove("blue", "orange");
    const first = localStorage.getItem("first");
    if (player_id === first) {
      btn.classList.add("blue");
    } else {
      btn.classList.add("orange");
    }

    btn.disabled = true
  }
});

function renderWords(wordList) {
    const wordsList = document.getElementById("words");
    if (!wordsList) return;

    wordsList.innerHTML = "";

    (wordList || JSON.parse(localStorage.getItem("words") || "[]")).forEach(word => {
        const p = document.createElement("p");
        p.textContent = word;
        wordsList.appendChild(p);
    });
}

export function leaveRoom() {
  const buttom = document.getElementById("leaveRoom");
  if (!buttom) return;

  buttom.addEventListener("click", () => {
    fetch(`http://${serverIp}:3333/room/leaveRoom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: room_id,
        player_id: socket.id
      })
    }).then(
      res => res.json()
    ).then(data => {
      if (data.success) {
        window.location.href = "index.html"
      } else {
        alert(data.message)
      }
    })
  })
}

leaveRoom();