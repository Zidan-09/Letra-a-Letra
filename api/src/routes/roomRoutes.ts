import { Router } from "express";
import { RoomController } from "../controller/roomController";
import { RoomMiddleware } from "../middleware/roomMiddleware";

const roomRouter: Router = Router();

roomRouter.post("/", RoomMiddleware.createRoom, RoomController.createRoom);
roomRouter.post(
  "/:room_id/players",
  RoomMiddleware.joinRoom,
  RoomController.joinRoom
);
roomRouter.patch(
  "/:room_id/players/:player_id",
  RoomMiddleware.changeRole,
  RoomController.changeRole
);
roomRouter.get("/", RoomController.getRooms);
roomRouter.get("/:room_id", RoomMiddleware.getRoom, RoomController.getRoom);
roomRouter.delete(
  "/:room_id/players/:player_id",
  RoomMiddleware.leftRoom,
  RoomController.leaveRoom
);
roomRouter.post(
  "/:room_id/players/:player_id/remove",
  RoomMiddleware.removePlayer,
  RoomController.removePlayer
);
roomRouter.post(
  "/:room_id/players/:player_id/unban",
  RoomMiddleware.unbanPlayer,
  RoomController.unbanPlayer
);

export default roomRouter;
