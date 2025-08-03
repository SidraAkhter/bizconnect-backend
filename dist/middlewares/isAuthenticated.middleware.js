"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
const isAuthenticated = (req, res, next) => {
    console.log("Auth middleware - Session:", req.session);
    console.log("Auth middleware - User:", req.user);
    if (!req.user || !req.user._id) {
        console.error("Authentication failed: No user in request");
        throw new appError_1.UnauthorizedException("Unauthorized. Please log in.");
    }
    next();
};
exports.default = isAuthenticated;
