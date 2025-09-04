import { createServer } from "http";
import app from "./app";
require('dotenv').config();

const PORT = process.env.PORT || 3333;

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server Running on: http://localhost:${PORT}`)
})