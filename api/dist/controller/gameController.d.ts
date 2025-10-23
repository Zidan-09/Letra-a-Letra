import { Request, Response } from 'express';
import { DiscardPower, Movement, PassTurn, StartGame } from '../utils/requests/gameRequests';
import { RoomParams } from '../utils/requests/roomRequests';
export declare const gameController: {
    startGame(req: Request<RoomParams, {}, StartGame>, res: Response): void;
    moveGame(req: Request<RoomParams, {}, Movement>, res: Response): void;
    passTurn(req: Request<RoomParams, {}, PassTurn>, res: Response): void;
    passBecauseEffect(req: Request<RoomParams, {}, PassTurn>, res: Response): void;
    discardPower(req: Request<RoomParams, {}, DiscardPower>, res: Response): void;
};
//# sourceMappingURL=gameController.d.ts.map