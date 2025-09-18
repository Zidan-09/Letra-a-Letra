import express, { Application } from "express";
import cors from 'cors';
import roomRouter from "./routes/roomRoutes";
import gameRouter from "./routes/gameRoutes";
import playerRouter from "./routes/playerRoutes";
import serverConfig from "./config/serverConfig.json";

const app: Application = express();

app.use(cors());
app.use(express.json());

const VERSION: string = serverConfig.version || "v1";

app.use(`/room`, roomRouter);
app.use(`/game`, gameRouter);
app.use(`/player`, playerRouter);

export default app;