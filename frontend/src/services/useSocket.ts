import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (url = "http://localhost:3333") => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(url);
    const s = socketRef.current;

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url]);

  return socketRef;
};
