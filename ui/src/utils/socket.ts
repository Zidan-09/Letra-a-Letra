import { io } from "socket.io-client";

export const socket = io("http://192.168.149.104:3333", {
    autoConnect: false
})