// src/services/socket.ts
import { io } from "socket.io-client";

const SERVER_IP = "localhost";
const URL = `http://${SERVER_IP}:3333`;

// Cria e exporta uma única instância do socket para todo o app
export const socket = io(URL, {
    //PRESTAR ATENÇÃO NISSO AQUI
  autoConnect: false // Vamos nos conectar manualmente quando precisarmos
});



// export function reconnectPlayers() {
//     const room_id = localStorage.getItem("room_id");
//     const nickname = localStorage.getItem("nickname");

//     if (!room_id || !nickname) return;

//     // Cria socket global
//     socket = io(`http://${serverIp}:3333`);

//     socket.on("connect", () => {
//         console.log("Socket conectado:", socket.id);
//         socket.emit("reconnect_player", { room_id, nickname });
//     });

//     setupSocketListeners();
// }