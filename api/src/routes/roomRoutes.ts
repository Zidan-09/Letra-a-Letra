import { Router } from "express";
import { RoomController } from "../controller/roomController";
import { RoomMiddleware } from "../middlewares/roomMiddleware";

const roomRouter: Router = Router();

roomRouter.post("/createRoom", RoomMiddleware.createRoom, RoomController.createRoom);
roomRouter.post("/joinRoom", RoomMiddleware.joinRoom, RoomController.joinRoom);
roomRouter.get("/getRooms", RoomController.getRooms);
roomRouter.post("/leaveRoom", RoomMiddleware.leftRoom, RoomController.leaveRoom);

export default roomRouter;