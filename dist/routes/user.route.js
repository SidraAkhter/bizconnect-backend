"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const userRoutes = (0, express_1.Router)();
userRoutes.get("/current", user_controller_1.getCurrentUserController);
// Debug endpoint to check session
userRoutes.get("/debug-session", (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    return res.json({
        session: req.session,
        user: req.user,
        isAuthenticated: req.isAuthenticated(),
    });
}));
exports.default = userRoutes;
