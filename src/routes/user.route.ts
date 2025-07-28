import { Router } from "express";
import { Request, Response } from "express";
import {
  getCurrentUserController,
  // Add other controllers here if they exist
} from "../controllers/user.controller";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

// Debug endpoint to check session
userRoutes.get("/debug-session", asyncHandler(
  async (req: Request, res: Response) => {
    return res.json({
      session: req.session,
      user: req.user,
      isAuthenticated: req.isAuthenticated(),
    });
  }
));

export default userRoutes;
