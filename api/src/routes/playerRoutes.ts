import { Router } from "express";
import { PlayerController } from "../controller/playerController";
import { PlayerMiddleware } from "../middleware/playerMiddleware";

const playerRouter: Router = Router();

playerRouter.post("/", PlayerMiddleware.createPlayer, PlayerController.createPlayer);
playerRouter.get("/:player_id", PlayerMiddleware.getPlayer, PlayerController.getPlayer);

export default playerRouter;