import { Router } from "express";
import { gameController } from "../controller/gameController";

const gameRouter: Router = Router();

gameRouter.post("/revealLetter", gameController.revealLetter);

export default gameRouter;