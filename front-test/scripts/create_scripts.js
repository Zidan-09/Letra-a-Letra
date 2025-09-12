const backBtn = document.getElementById("back-btn");
const createBtn = document.getElementById("create-btn");

const themeSelect = document.getElementById("theme");
const turnTimeInput = document.getElementById("turn_time");
const privateRoomCheckbox = document.getElementById("private_room");

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

createBtn.addEventListener("click", () => {
  const nickname = localStorage.getItem("nickname");
  if (!nickname) {
    alert("Nickname não encontrado, volte para a Home.");
    window.location.href = "index.html";
    return;
  }

  const theme = themeSelect.value;
  let turn_time = parseInt(turnTimeInput.value);
  if (isNaN(turn_time) || turn_time < 5) turn_time = 15;
  if (turn_time > 30) turn_time = 30;
  const privateRoom = privateRoomCheckbox.checked;

  localStorage.setItem("action_type", "create"); // indica que é para criar sala
  localStorage.setItem("theme", theme);
  localStorage.setItem("turn_time", turn_time);
  localStorage.setItem("privateRoom", privateRoom);

  window.location.href = "game.html"; // redireciona e o restante será feito no game_scripts
});