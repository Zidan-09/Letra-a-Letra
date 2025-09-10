import express, { Application } from "express";
import cors from 'cors';
import roomRouter from "./routes/roomRoutes";
import gameRouter from "./routes/gameRoutes";
import playerRouter from "./routes/playerRoutes";
require('dotenv').config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const VERSION: string = process.env.VERSION || "v1"

app.use(`${VERSION}/room`, roomRouter);
app.use(`${VERSION}/game`, gameRouter);
app.use(`${VERSION}/player`, playerRouter);

export default app;