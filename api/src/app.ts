import express, { Application, json } from "express";
import gameRouter from "./routes/gameplayRoutes";

const app: Application = express();

app.use(json());

app.use(gameRouter);

export default app;