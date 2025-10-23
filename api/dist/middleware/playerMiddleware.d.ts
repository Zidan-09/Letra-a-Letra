import { Request, Response, NextFunction } from "express";
import { CreatePlayer, DeletePlayer, GetPlayer } from "../utils/requests/playerRequests";
export declare const PlayerMiddleware: {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response, next: NextFunction): void;
    getPlayer(req: Request<GetPlayer>, res: Response, next: NextFunction): void;
    deletePlayer(req: Request<DeletePlayer>, res: Response, next: NextFunction): void;
};
//# sourceMappingURL=playerMiddleware.d.ts.map