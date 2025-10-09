import { Server } from "socket.io";
import { RoomService } from "./services/roomServices";
import { ServerResponses } from "./utils/responses/serverResponses";
import { SendSocket } from "./utils/game_utils/sendSocket";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        socket.on("reconnect_player", ({room_id, nickname}) => {
            RoomService.reconnectRoom(room_id, nickname, socket.id);
        })

        socket.on("message", ({ room_id, from, message }) => {
            SendSocket.message(room_id, from, message);
        })
    });

    return io;
};

export const getSocketInstance = (): Server => io;