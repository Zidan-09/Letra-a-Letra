import { Server } from "socket.io";
import { RoomService } from "./services/roomService";
import { sendMessage } from "./utils/socket/message";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("reconnect_player", ({ room_id, nickname }) => {
      RoomService.reconnectRoom(room_id, nickname, socket.id);
    });

    socket.on("message", ({ room_id, from, message }) => {
      sendMessage(room_id, from, message);
    });
  });

  return io;
};

export const getSocketInstance = (): Server => io;
