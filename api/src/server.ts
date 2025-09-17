import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const PORT: number = parseInt(process.env.PORT || "3333");
const VERSION = process.env.VERSION || "v1";

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running on: http://localhost:${PORT}/api/${VERSION}/`)
    })
}

startServer();