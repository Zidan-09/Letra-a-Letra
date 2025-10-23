"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playerController_1 = require("../controller/playerController");
const playerMiddleware_1 = require("../middleware/playerMiddleware");
const playerRouter = (0, express_1.Router)();
playerRouter.post("/", playerMiddleware_1.PlayerMiddleware.createPlayer, playerController_1.PlayerController.createPlayer);
playerRouter.get("/:player_id", playerMiddleware_1.PlayerMiddleware.getPlayer, playerController_1.PlayerController.getPlayer);
playerRouter.get("/", playerController_1.PlayerController.getAllPlayers);
playerRouter.delete("/:player_id", playerMiddleware_1.PlayerMiddleware.deletePlayer, playerController_1.PlayerController.deletePlayer);
exports.default = playerRouter;
//# sourceMappingURL=playerRoutes.js.map