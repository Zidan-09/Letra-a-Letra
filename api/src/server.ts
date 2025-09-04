import { createServer } from "http";
import app from "./app";
import { initSocket } from "./socket";
require('dotenv').config();

const PORT = process.env.PORT || 3333;

function startServer() {
    const httpServer = createServer(app);
    
    initSocket(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server Running on: http://localhost:${PORT}`)
    })
}

startServer();