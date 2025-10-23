"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roomController_1 = require("../controller/roomController");
const roomMiddleware_1 = require("../middleware/roomMiddleware");
const roomRouter = (0, express_1.Router)();
roomRouter.post("/", roomMiddleware_1.RoomMiddleware.createRoom, roomController_1.RoomController.createRoom);
roomRouter.post("/:room_id/players", roomMiddleware_1.RoomMiddleware.joinRoom, roomController_1.RoomController.joinRoom);
roomRouter.patch("/:room_id/players/:player_id", roomMiddleware_1.RoomMiddleware.changeRole, roomController_1.RoomController.changeRole);
roomRouter.get("/", roomController_1.RoomController.getRooms);
roomRouter.get("/:room_id", roomMiddleware_1.RoomMiddleware.getRoom, roomController_1.RoomController.getRoom);
roomRouter.delete("/:room_id/players/:player_id", roomMiddleware_1.RoomMiddleware.leftRoom, roomController_1.RoomController.leaveRoom);
roomRouter.post("/:room_id/players/:player_id/remove", roomMiddleware_1.RoomMiddleware.removePlayer, roomController_1.RoomController.removePlayer);
roomRouter.post("/:room_id/players/:player_id/unban", roomMiddleware_1.RoomMiddleware.unbanPlayer, roomController_1.RoomController.unbanPlayer);
exports.default = roomRouter;
//# sourceMappingURL=roomRoutes.js.map