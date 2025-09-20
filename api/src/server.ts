import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
import config from "./config/server.json";

const PORT: number = config.port || 3333;
const VERSION = config.version || "v1";

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running on: http://localhost:${PORT}/api/${VERSION}/`);
    })
}

startServer();