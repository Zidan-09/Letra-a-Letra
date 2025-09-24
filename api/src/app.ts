import express, { Application } from "express";
import cors from 'cors';
import roomRouter from "./routes/roomRoutes";
import gameRouter from "./routes/gameRoutes";
import playerRouter from "./routes/playerRoutes";
import settings from "./settings/server.json";

const app: Application = express();

app.use(cors());
app.use(express.json());

const VERSION: string = settings.version || "v1";

app.use(`/api/${VERSION}/room`, roomRouter);
app.use(`/api/${VERSION}/game`, gameRouter);
app.use(`/api/${VERSION}/player`, playerRouter);

export default app;