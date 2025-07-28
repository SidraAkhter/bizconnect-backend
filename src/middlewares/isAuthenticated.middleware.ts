import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../utils/appError";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("Auth middleware - Session:", req.session);
  console.log("Auth middleware - User:", req.user);
  
  if (!req.user || !req.user._id) {
    console.error("Authentication failed: No user in request");
    throw new UnauthorizedException("Unauthorized. Please log in.");
  }
  next();
};

export default isAuthenticated;
