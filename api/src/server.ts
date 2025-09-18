import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
import serverConfig from "./config/serverConfig.json";

const PORT: number = serverConfig.port || 3333;
const VERSION = serverConfig.version || "v1";

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running on: http://localhost:${PORT}/api/${VERSION}/`);
    })
}

startServer();