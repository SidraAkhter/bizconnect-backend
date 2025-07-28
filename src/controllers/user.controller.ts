import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Getting current user. User in request:", !!req.user);
    console.log("Session:", req.session);
    console.log("Cookies:", req.headers.cookie);
    
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      message: "User fetched successfully",
      user: req.user,
    });
  }
);
