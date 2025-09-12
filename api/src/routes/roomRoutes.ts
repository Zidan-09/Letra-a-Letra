import { Router } from "express";
import { RoomController } from "../controller/roomController";

const roomRouter: Router = Router();

roomRouter.post("/createRoom", RoomController.createRoom);
roomRouter.post("/joinRoom", RoomController.joinRoom);
roomRouter.get("/getRooms", RoomController.getRooms);
roomRouter.post("/leaveRoom", RoomController.leaveRoom);

export default roomRouter;