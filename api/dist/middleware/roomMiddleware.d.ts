import { Request, Response, NextFunction } from "express";
import { CreateRoom, JoinRoom, LeaveRoom, ChangeRole, RoomParams, ActionParams, RemovePlayer } from "../utils/requests/roomRequests";
export declare const RoomMiddleware: {
    createRoom(req: Request<{}, {}, CreateRoom>, res: Response, next: NextFunction): void;
    joinRoom(req: Request<RoomParams, {}, JoinRoom>, res: Response, next: NextFunction): void;
    changeRole(req: Request<ActionParams, {}, ChangeRole>, res: Response, next: NextFunction): void;
    getRoom(req: Request<RoomParams>, res: Response, next: NextFunction): void;
    leftRoom(req: Request<ActionParams, {}, LeaveRoom>, res: Response, next: NextFunction): void;
    removePlayer(req: Request<ActionParams, {}, RemovePlayer>, res: Response, next: NextFunction): void;
    unbanPlayer(req: Request<ActionParams>, res: Response, next: NextFunction): void;
};
//# sourceMappingURL=roomMiddleware.d.ts.map