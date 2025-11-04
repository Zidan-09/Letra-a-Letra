import { io } from "socket.io-client";
import settings from "../settings.json";

export const socket = io(settings.socket, {
  autoConnect: false,
});
