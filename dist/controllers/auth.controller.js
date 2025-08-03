"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkGoogleLoginStatus = exports.logOutController = exports.loginController = exports.registerUserController = exports.googleLoginCallback = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const app_config_1 = require("../config/app.config");
const auth_validation_1 = require("../validation/auth.validation");
const http_config_1 = require("../config/http.config");
const auth_service_1 = require("../services/auth.service");
const passport_1 = __importDefault(require("passport"));
exports.googleLoginCallback = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    console.log("Google login callback:", req.user);
    console.log("Session:", req.session);
    // Get the redirectUrl from session if it was saved during the auth initiation
    const redirectUrlBase = (req.session && req.session.redirectUrl) || app_config_1.config.FRONTEND_ORIGIN;
    console.log("Using redirect URL base:", redirectUrlBase);
    if (!req.user) {
        console.error("No user found in request");
        return res.redirect(`${app_config_1.config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_user`);
    }
    // Extract workspace ID, ensuring we handle both string and ObjectId formats
    let workspaceId;
    if (req.user.currentWorkspace) {
        // Handle cases where currentWorkspace could be an ObjectId, string, or object with _id
        workspaceId = typeof req.user.currentWorkspace === 'object' && req.user.currentWorkspace._id
            ? req.user.currentWorkspace._id.toString()
            : req.user.currentWorkspace.toString();
    }
    if (!workspaceId) {
        console.error("No current workspace found in user object:", req.user);
        return res.redirect(`${app_config_1.config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_workspace`);
    }
    // Create a simple HTML page with JavaScript to set a cookie and redirect
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <script>
          // Set a cookie with the user data - properly JSON stringify but don't URL encode
          // as the browser will handle that automatically
          document.cookie = 'auth_user=' + JSON.stringify(${JSON.stringify(req.user)}) + ';path=/;max-age=86400';
          
          // Redirect to the workspace using the dynamic redirectUrl
          window.location.href = '${redirectUrlBase}/workspace/${workspaceId}';
        </script>
      </head>
      <body>
        <h1>Authentication Successful</h1>
        <p>Redirecting to your workspace...</p>
      </body>
      </html>
    `;
    // Send the HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
});
exports.registerUserController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const body = auth_validation_1.registerSchema.parse({
        ...req.body,
    });
    await (0, auth_service_1.registerUserService)(body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "User created successfully",
    });
});
exports.loginController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password",
            });
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(http_config_1.HTTPSTATUS.OK).json({
                message: "Logged in successfully",
                user,
            });
        });
    })(req, res, next);
});
exports.logOutController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    // Log for debugging
    console.log("Logout request received");
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res
                .status(http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to log out" });
        }
        // Clear the session
        req.session = null;
        // Clear auth cookie by setting it to expire in the past
        res.clearCookie('auth_user', {
            path: '/',
            httpOnly: false // Since it's set via client-side JS
        });
        console.log("User logged out successfully");
        return res
            .status(http_config_1.HTTPSTATUS.OK)
            .json({ message: "Logged out successfully" });
    });
});
exports.checkGoogleLoginStatus = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    if (!req.user) {
        return res.status(http_config_1.HTTPSTATUS.UNAUTHORIZED).json({
            success: false,
            message: "Not authenticated",
            user: null
        });
    }
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        success: true,
        message: "Authenticated successfully",
        user: req.user
    });
});
