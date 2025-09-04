const serverIp = "192.168.0.5"

export function createRoom() {
    const buttom = document.getElementById("createRoom");

    buttom.addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value;
        
        if (!nickname || nickname == "") {
           return alert("Nickname inválido")
        }

        localStorage.setItem("nickname", nickname);

        const socket = io(`http://${serverIp}:3333`);

        socket.on("connect", () => {
            fetch(`http://${serverIp}:3333/room/createRoom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    socket_id: socket.id,
                    nickname: nickname
                })
            }).then(response => response.json()).then(data => {
                if (data.message == "room_created") {
                    localStorage.setItem("room_id", data.data.room_id);
                    localStorage.setItem("players", JSON.stringify(data.data.players));
                    window.location.href = "room.html";
                    alert(localStorage.getItem("room_id"));
                }
            })
        })
    })
}

export function joinRoom() {
    const buttom = document.getElementById("joinRoom");

    buttom.addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value;
        
        if (!nickname || nickname == "") {
           return alert("Nickname inválido")
        }

        const socket = io(`http://${serverIp}:3333`);

        socket.on("connect", () => {
            localStorage.setItem("socket_id", socket.id);
            localStorage.setItem("nickname", nickname);

            window.location.href = "join.html";
        })
    })
}

export function getRoomID() {
    const buttom = document.getElementById("sendRoomId");

    buttom.addEventListener("click", () => {
        const room_id = document.getElementById("room_id").value;

        if (!room_id || room_id == "") {
            return alert("Id de sala inválido")
        }

        fetch(`http://${serverIp}:3333/room/joinRoom`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                socket_id: localStorage.getItem("socket_id"),
                nickname: localStorage.getItem("nickname"),
                room_id: room_id
            })
        }).then(response => response.json()).then(data => {
            if (data.message == 'room_joined') {
                window.location.href = "room.html";
            } else {
                alert("Error")
            }
        })
    })
}

export function renderPlayers() {
    const playersListDiv = document.getElementById("players");

    if (!playersListDiv) return;

    const storagePlayers = JSON.parse(localStorage.getItem("players") || "[]");

    playersListDiv.innerHTML = "";

    storagePlayers.forEach(player => {
        const p = document.createElement("p");
        p.textContent = player.nickname;
        playersListDiv.appendChild(p);
    });
}

export function reconnectPlayers() {
    const room_id = localStorage.getItem("room_id");
    const nickname = localStorage.getItem("nickname");

    if (!room_id || !nickname) return;

    const socket = io(`http://${serverIp}:3333`);

    socket.on("connect", () => {
        socket.emit("reconnect_player", { room_id: room_id, nickname: nickname});

        renderPlayers();
    })

    socket.on("player_joinned", (room) => {
        console.log(room);
        localStorage.setItem("players", JSON.stringify(room.players));
        renderPlayers();
    })
}

window.addEventListener("storage", (event) => {
    if (event.key === "players") {
        renderPlayers();
    }
})

createRoom();
joinRoom();
getRoomID();
renderPlayers();
