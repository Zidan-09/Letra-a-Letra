import { Router } from "express";
import { PlayerController } from "../controller/playerController";

const playerRouter: Router = Router();

playerRouter.get("/getPlayer/:player_id", PlayerController.getPlayer);

export default playerRouter;