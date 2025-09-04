export function createRoom() {
    const buttom = document.getElementById("createRoom");

    buttom.addEventListener("click", () => {
        const nickname = document.getElementById("nickname").value;
        
        if (!nickname || nickname == "") {
           return alert("Nickname inválido")
        }

        const socket = io("http://localhost:3333");

        socket.on("connect", () => {
            fetch("http://localhost:3333/room/createRoom", {
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
        console.log(localStorage.getItem("room_id"));

        socket.on("player_joinned", (room) => {
            console.log(room);
            localStorage.setItem("players", JSON.stringify(room.players));
            renderPlayers();
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

        const socket = io("http://localhost:3333");

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

        fetch("http://localhost:3333/room/joinRoom", {
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
            }
        })
    })
}

export function renderPlayers() {
    const playersListDiv = document.getElementById("playersList");
    if (!playersListDiv) return;

    const storagePlayers = JSON.parse(localStorage.getItem("players") || "[]");

    playersListDiv.innerHTML = "";

    storagePlayers.forEach(player => {
        const p = document.createElement("p");
        p.textContent = player.nickname;
        playersListDiv.appendChild(p);
    });
}

createRoom();
joinRoom();
getRoomID();
renderPlayers();

window.addEventListener("storage", (event) => {
    if (event.key === "players") {
        renderPlayers();
    }
})