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
        console.log(`Connected socket: ${socket.id}`);

        socket.on("reconnect_player", ({room_id, nickname}) => {
            const result = RoomService.reconnectRoom(room_id, nickname, socket.id);

            if (result !== ServerResponses.NotFound) {
                console.log(`Reconnected socket: ${socket.id}`);
            }

        })

        socket.on("message", ({ room_id, from, message }) => {
            SendSocket.message(room_id, from, message);
        })

        socket.on("disconnect", () => {
            console.log(`Disconnected socket: ${socket.id}`);
        });
    });

    return io;
};

export const getSocketInstance = (): Server => io;