import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
import settings from "./settings/server.json";

const PORT: number = settings.port || 3333;
const VERSION = settings.version || "v1";

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running on: http://localhost:${PORT}/api/${VERSION}/`);
    })
}

startServer();