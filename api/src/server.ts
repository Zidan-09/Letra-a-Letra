import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
import settings from "./settings/server.json";

const PORT: number = Number(process.env.PORT) || 3333;
const VERSION = settings.version || "v1";

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running, version: ${VERSION}, on port: ${PORT}`);
    })
}

startServer();