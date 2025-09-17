import { Router } from "express";
import { gameController } from "../controller/gameController";
import { ValidateMovement } from "../middlewares/validateMovement";

const gameRouter: Router = Router();

gameRouter.post("/startGame", gameController.startGame);
gameRouter.post("/moveGame", ValidateMovement, gameController.moveGame);
gameRouter.post("/afk", gameController.passTurn);

export default gameRouter;