import { NextFunction, Request, Response } from "express";
import { ActionParams, ChangeRole, CreateRoom, JoinRoom, RemovePlayer, RoomParams } from "../utils/requests/roomRequests";
export declare const RoomController: {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response): void;
    joinRoom(req: Request<RoomParams, {}, JoinRoom>, res: Response): void;
    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction): void;
    getRooms(req: Request, res: Response): void;
    getRoom(req: Request<RoomParams>, res: Response): void;
    leaveRoom(req: Request<ActionParams, {}, {}>, res: Response): void;
    removePlayer(req: Request<ActionParams, {}, RemovePlayer>, res: Response): void;
    unbanPlayer(req: Request<ActionParams>, res: Response): void;
};
//# sourceMappingURL=roomController.d.ts.map