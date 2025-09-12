import { Router } from "express";
import { gameController } from "../controller/gameController";

const gameRouter: Router = Router();

gameRouter.get("/startGame/:room_id", gameController.startGame);
gameRouter.post("/revealLetter", gameController.moveGame);
gameRouter.post("/afk", gameController.passTurn);

export default gameRouter;