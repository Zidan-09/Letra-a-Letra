import { Router } from "express";
import { gameController } from "../controller/gameController";
import { GameMiddleware } from "../middleware/gameMiddleware";

const gameRouter: Router = Router();

gameRouter.post("/startGame", GameMiddleware.startGame, gameController.startGame);
gameRouter.post("/moveGame", GameMiddleware.validateMovement, gameController.moveGame);
gameRouter.post("/afk", GameMiddleware.passTurn, gameController.passTurn);

export default gameRouter;