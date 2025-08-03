"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugWorkspaceController = exports.debugSessionController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
exports.debugSessionController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        session: req.session,
        user: req.user,
        isAuthenticated: req.isAuthenticated && req.isAuthenticated(),
        cookies: req.headers.cookie,
        headers: req.headers,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
    });
});
exports.debugWorkspaceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const workspaceId = req.params.id;
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        requestedWorkspace: workspaceId,
        user: req.user,
        userCurrentWorkspace: req.user?.currentWorkspace,
        isAuthenticated: req.isAuthenticated && req.isAuthenticated(),
        cookies: req.headers.cookie,
    });
});
