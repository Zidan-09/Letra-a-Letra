// Pega os elementos
const nicknameInput = document.getElementById("nickname");
const createBtn = document.getElementById("create-room");
const joinBtn = document.getElementById("join-room");

function saveNickname() {
  const nick = nicknameInput.value.trim();
  if (!nick) {
    alert("Digite um nickname primeiro!");
    return null;
  }
  localStorage.setItem("nickname", nick);
  return nick;
}

createBtn.addEventListener("click", () => {
  const nick = saveNickname();
  if (!nick) return;

  window.location.href = "create.html";
});

joinBtn.addEventListener("click", () => {
  const nick = saveNickname();
  if (!nick) return;

  window.location.href = "join.html";
});