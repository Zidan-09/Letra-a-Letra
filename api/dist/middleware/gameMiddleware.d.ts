import { Request, Response, NextFunction } from "express";
import { DiscardPower, Movement, PassTurn, StartGame } from "../utils/requests/gameRequests";
import { RoomParams } from "../utils/requests/roomRequests";
export declare const GameMiddleware: {
    startGame(req: Request<RoomParams, {}, StartGame>, res: Response, next: NextFunction): void;
    validateMovement(req: Request<RoomParams, {}, Movement>, res: Response, next: NextFunction): void;
    passTurn(req: Request<RoomParams, {}, PassTurn>, res: Response, next: NextFunction): void;
    passBecauseEffect(req: Request<RoomParams, {}, PassTurn>, res: Response, next: NextFunction): void;
    discardPower(req: Request<RoomParams, {}, DiscardPower>, res: Response, next: NextFunction): void;
};
//# sourceMappingURL=gameMiddleware.d.ts.map