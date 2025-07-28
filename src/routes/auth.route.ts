import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  checkGoogleLoginStatus,
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);

// Add a check login status endpoint
authRoutes.get("/check-status", checkGoogleLoginStatus);

// Update the Google auth route to save the redirectUrl in session
authRoutes.get(
  "/google",
  (req, res, next) => {
    // Save the redirectUrl to session if provided
    if (req.query.redirectUrl && req.session) {
      console.log("Saving redirectUrl to session:", req.query.redirectUrl);
      req.session.redirectUrl = req.query.redirectUrl as string;
    } else if (req.query.redirectUrl) {
      console.log("Warning: Can't save redirectUrl, session not available");
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: true,
  }),
  googleLoginCallback
);

export default authRoutes;
