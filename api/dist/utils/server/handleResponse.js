"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleResponse = void 0;
const serverResponses_1 = require("../responses/serverResponses");
exports.HandleResponse = {
    serverResponse(res, statusCode, success, message, data) {
        res.status(statusCode).json({
            success: success,
            message: message,
            data: data ? data : null
        });
    },
    errorResponse(res) {
        res.status(500).json({
            success: false,
            message: serverResponses_1.ServerResponses.ServerError,
        });
    }
};
//# sourceMappingURL=handleResponse.js.map