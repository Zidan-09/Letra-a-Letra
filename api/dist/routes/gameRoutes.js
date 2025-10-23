"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gameController_1 = require("../controller/gameController");
const gameMiddleware_1 = require("../middleware/gameMiddleware");
const gameRouter = (0, express_1.Router)();
gameRouter.post("/:room_id/start", gameMiddleware_1.GameMiddleware.startGame, gameController_1.gameController.startGame);
gameRouter.post("/:room_id/move", gameMiddleware_1.GameMiddleware.validateMovement, gameController_1.gameController.moveGame);
gameRouter.post("/:room_id/pass", gameMiddleware_1.GameMiddleware.passTurn, gameController_1.gameController.passTurn);
gameRouter.post("/:room_id/effect/pass", gameMiddleware_1.GameMiddleware.passBecauseEffect, gameController_1.gameController.passBecauseEffect);
gameRouter.patch("/:room_id/discard", gameMiddleware_1.GameMiddleware.discardPower, gameController_1.gameController.discardPower);
exports.default = gameRouter;
//# sourceMappingURL=gameRoutes.js.map