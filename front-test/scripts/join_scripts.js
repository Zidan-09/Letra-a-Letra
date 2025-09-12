const backBtn = document.getElementById("back-btn");
const joinBtn = document.getElementById("join-btn");
const roomsPanel = document.getElementById("rooms-panel");

const customCodeBtn = document.getElementById("custom-code-btn");
const customPopup = document.getElementById("custom-code-popup");
const closePopup = document.getElementById("close-popup");
const customRoomInput = document.getElementById("custom-room-id");

let selectedRoomId = null;

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

customCodeBtn.addEventListener("click", () => customPopup.style.display = "flex");
closePopup.addEventListener("click", () => customPopup.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === customPopup) customPopup.style.display = "none";
});

function selectRoom(roomId, element) {
  selectedRoomId = roomId;
  document.querySelectorAll(".room-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
}

async function fetchRooms() {
  try {
    const res = await fetch("http://localhost:3333/v1/room/getRooms");
    const json = await res.json();
    const rooms = json.data.filter(r => !r.privateRoom);

    roomsPanel.innerHTML = "";

    rooms.forEach(room => {
      const div = document.createElement("div");
      div.classList.add("room-item");
      div.textContent = `${room.room_id} - Tema: ${room.theme} - Jogadores: ${room.players?.length || 0}`;
      div.addEventListener("click", () => selectRoom(room.room_id, div));
      roomsPanel.appendChild(div);
    });

  } catch (err) {
    console.error("Erro ao buscar salas:", err);
  }
}

joinBtn.addEventListener("click", () => {
  const nickname = localStorage.getItem("nickname");
  if (!nickname) {
    alert("Nickname não encontrado, volte para a Home.");
    window.location.href = "index.html";
    return;
  }

  const roomId = customRoomInput.value.trim() || selectedRoomId;
  if (!roomId) {
    alert("Selecione uma sala ou insira um código.");
    return;
  }

  localStorage.setItem("room_id", roomId);
  localStorage.setItem("action_type", "join"); // indica que é para entrar na sala

  window.location.href = "game.html"; // redireciona e o restante será feito no game_scripts
});

fetchRooms();