"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const app_config_1 = require("../config/app.config");
const auth_controller_1 = require("../controllers/auth.controller");
const failedUrl = `${app_config_1.config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = (0, express_1.Router)();
authRoutes.post("/register", auth_controller_1.registerUserController);
authRoutes.post("/login", auth_controller_1.loginController);
authRoutes.post("/logout", auth_controller_1.logOutController);
// Add a check login status endpoint
authRoutes.get("/check-status", auth_controller_1.checkGoogleLoginStatus);
// Update the Google auth route to save the redirectUrl in session
authRoutes.get("/google", (req, res, next) => {
    // Save the redirectUrl to session if provided
    if (req.query.redirectUrl && req.session) {
        console.log("Saving redirectUrl to session:", req.query.redirectUrl);
        req.session.redirectUrl = req.query.redirectUrl;
    }
    else if (req.query.redirectUrl) {
        console.log("Warning: Can't save redirectUrl, session not available");
    }
    next();
}, passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
authRoutes.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: failedUrl,
    session: true,
}), auth_controller_1.googleLoginCallback);
exports.default = authRoutes;
