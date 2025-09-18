import { Router } from "express";
import { PlayerController } from "../controller/playerController";

const playerRouter: Router = Router();

playerRouter.post("/getPlayer", PlayerController.getPlayer);

export default playerRouter;