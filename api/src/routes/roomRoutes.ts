import { Router } from "express";
import { RoomController } from "../controller/roomController";

const roomRouter: Router = Router();

roomRouter.post("/createRoom", RoomController.createRoom);
roomRouter.post("/joinRoom", RoomController.joinRoom);
roomRouter.get("/getRoom", RoomController.getRoom);

export default roomRouter;