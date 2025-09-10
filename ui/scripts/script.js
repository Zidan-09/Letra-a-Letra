export const serverIp = "localhost";
export let socket; // socket global para usar em todas as funções

/** Renderiza a lista de players */
export function renderPlayers(playersList) {
    const playersListDiv = document.getElementById("players");
    if (!playersListDiv) return;

    playersListDiv.innerHTML = "";

    (playersList || JSON.parse(localStorage.getItem("players") || "[]")).forEach(player => {
        const p = document.createElement("p");
        p.textContent = player.nickname;
        playersListDiv.appendChild(p);
    });
}

/** Cria sala */
export function createRoom() {
    const button = document.getElementById("createRoom");
    if (!button) return;

    button.addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value.trim();
        if (!nickname) return alert("Nickname inválido");

        localStorage.setItem("nickname", nickname);

        // Cria socket somente aqui
        socket = io(`http://${serverIp}:3333`);

        socket.on("connect", () => {
            fetch(`http://${serverIp}:3333/room/createRoom`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ socket_id: socket.id, nickname })
            })
            .then(res => res.json())
            .then(data => {
                if (data.message === "room_created") {
                    localStorage.setItem("room_id", data.data.room_id);
                    localStorage.setItem("players", JSON.stringify(data.data.players));
                    window.location.href = "room.html";
                }
            });
        });

        setupSocketListeners();
    });
}

/** Entra na tela de join */
export function joinRoom() {
    const button = document.getElementById("joinRoom");
    if (!button) return;

    button.addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value.trim();
        if (!nickname) return alert("Nickname inválido");

        localStorage.setItem("nickname", nickname);

        // Cria socket apenas aqui para futura reconexão
        socket = io(`http://${serverIp}:3333`);

        socket.on("connect", () => {
            window.location.href = "join.html";
        });

        setupSocketListeners();
    });
}

/** Pega o ID da sala e entra */
export function getRoomID() {
    const button = document.getElementById("sendRoomId");
    if (!button) return;

    button.addEventListener("click", () => {
        const room_id = document.getElementById("room_id").value.trim();
        if (!room_id) return alert("Id de sala inválido");

        fetch(`http://${serverIp}:3333/room/joinRoom`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                socket_id: socket.id,
                nickname: localStorage.getItem("nickname"),
                room_id
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "room_joinned") {
                localStorage.setItem("room_id", room_id);
                window.location.href = "room.html";
            } else {
                alert(data.message);
            }
        });
    });
}

/** Reconecta player na sala */
export function reconnectPlayers() {
    const room_id = localStorage.getItem("room_id");
    const nickname = localStorage.getItem("nickname");

    if (!room_id || !nickname) return;

    // Cria socket global
    socket = io(`http://${serverIp}:3333`);

    socket.on("connect", () => {
        console.log("Socket conectado:", socket.id);
        socket.emit("reconnect_player", { room_id, nickname });
    });

    setupSocketListeners();
}

/** Setup dos listeners de socket comuns */
function setupSocketListeners() {
    if (!socket) return;

    // Atualiza lista de players
    socket.on("player_joinned", (room) => {
        localStorage.setItem("players", JSON.stringify(room.players));
        renderPlayers(room.players);
    });

    socket.on("disconnect", () => {
        console.log("Socket desconectado");
    });
}

/** Atualiza lista quando houver mudanças no localStorage (opcional) */
window.addEventListener("storage", (event) => {
    if (event.key === "players") renderPlayers();
});

/** Inicializa funções principais */
createRoom();
joinRoom();
getRoomID();
renderPlayers(JSON.parse(localStorage.getItem("players") || "[]"));