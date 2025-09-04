import { Server } from "socket.io";
import { roomService } from "./services/roomServices";
import { ServerResponses } from "./utils/responses/serverResponses";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log(`Connected socket: ${socket.id}`);

        socket.on("recconect_player", ({room_id, nickname}) => {
            const result = roomService.reconnectRoom(room_id, nickname, socket.id);

            if (result !== ServerResponses.NotFound) {
                console.log(`Reconnected socket: ${socket.id}`);
            }

        })

        socket.on("disconnect", () => {
            console.log(`Disconnected socket: ${socket.id}`);
        });
    });

    return io;
};

export const getSocketInstance = (): Server => io;