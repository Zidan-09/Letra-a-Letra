import { Router } from "express";
import { RoomController } from "../controller/roomController";
import { RoomMiddleware } from "../middleware/roomMiddleware";

const roomRouter: Router = Router();

roomRouter.post("/createRoom", RoomMiddleware.createRoom, RoomController.createRoom);
roomRouter.post("/joinRoom", RoomMiddleware.joinRoom, RoomController.joinRoom);
roomRouter.post("/joinRoomAsSpectator", RoomMiddleware.joinRoom, RoomController.joinAsSpectator);
roomRouter.get("/getRooms", RoomController.getRooms);
roomRouter.post("/leaveRoom", RoomMiddleware.leftRoom, RoomController.leaveRoom);

export default roomRouter;