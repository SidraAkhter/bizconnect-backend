"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
exports.getCurrentUserController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    console.log("Getting current user. User in request:", !!req.user);
    console.log("Session:", req.session);
    console.log("Cookies:", req.headers.cookie);
    if (!req.user) {
        return res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED).json({
            message: "User not authenticated",
        });
    }
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User fetched successfully",
        user: req.user,
    });
});
