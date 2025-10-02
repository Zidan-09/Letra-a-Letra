import { createContext, useContext, useEffect } from "react";
import { socket } from "../utils/socket";

const SocketContext = createContext(socket);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
    return useContext(SocketContext);
}