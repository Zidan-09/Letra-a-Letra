import { Router } from "express";
import { gameController } from "../controller/gameController";
import { GameMiddleware } from "../middleware/gameMiddleware";

const gameRouter: Router = Router();

gameRouter.post("/:room_id/start", GameMiddleware.startGame, gameController.startGame);
gameRouter.post("/:room_id/move", GameMiddleware.validateMovement, gameController.moveGame);
gameRouter.post("/:room_id/pass", GameMiddleware.passTurn, gameController.passTurn);
gameRouter.post("/:room_id/effect/pass", GameMiddleware.passBecauseEffect, gameController.passBecauseEffect);
gameRouter.patch("/:room_id/discard", GameMiddleware.discardPower, gameController.discardPower);

export default gameRouter;