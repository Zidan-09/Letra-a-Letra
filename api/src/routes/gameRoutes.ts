import { Router } from "express";
import { gameController } from "../controller/gameController";

const gameRouter: Router = Router();

gameRouter.post("/startGame", gameController.startGame);
gameRouter.post("/moveGame", gameController.moveGame);
gameRouter.post("/afk", gameController.passTurn);

export default gameRouter;