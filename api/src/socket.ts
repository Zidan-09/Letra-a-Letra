import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log(`Connected socket: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Disconnected socket: ${socket.id}`);
        });
    });

    return io;
};

export const getSocketInstance = (): Server => io;