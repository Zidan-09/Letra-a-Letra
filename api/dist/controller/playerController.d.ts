import { Request, Response } from "express";
import { CreatePlayer, DeletePlayer, GetPlayer } from "../utils/requests/playerRequests";
export declare const PlayerController: {
    createPlayer(req: Request<{}, {}, CreatePlayer>, res: Response): void;
    getPlayer(req: Request<GetPlayer>, res: Response): void;
    getAllPlayers(req: Request, res: Response): void;
    deletePlayer(req: Request<DeletePlayer>, res: Response): void;
};
//# sourceMappingURL=playerController.d.ts.map