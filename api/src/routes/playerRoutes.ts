import { Router } from "express";
import { PlayerController } from "../controller/playerController";

const playerRouter: Router = Router();

playerRouter.get("/getPlayer", PlayerController.getPlayer);

export default playerRouter;