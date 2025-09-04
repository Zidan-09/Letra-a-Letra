import express, { Application } from "express";
import cors from 'cors';
import roomRouter from "./routes/roomRoutes";
import gameRouter from "./routes/gameRoutes";
import playerRouter from "./routes/playerRoutes";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/room", roomRouter);
app.use("/game", gameRouter);
app.use("/player", playerRouter);

export default app;