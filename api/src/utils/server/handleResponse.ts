import { Response } from "express";
import { ServerResponses } from "../responses/serverResponses";

export const HandleResponse = {
    serverResponse(res: Response, statusCode: number, success: boolean, message: string, data?: any) {
        res.status(statusCode).json({
            success: success,
            message: message,
            ...(data !== undefined ? { data } : {})
        })
    },

    errorResponse(res: Response) {
        res.status(500).json({
            success: false,
            message: ServerResponses.ServerError,
        })
    }
}