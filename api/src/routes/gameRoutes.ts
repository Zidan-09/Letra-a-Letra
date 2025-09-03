import { Router } from "express";
import { gameController } from "../controller/gameController";

const gameRouter: Router = Router();

gameRouter.post("/", gameController.revealCard);

export default gameRouter;