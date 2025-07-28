import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";

export const debugSessionController = asyncHandler(
  async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
      session: req.session,
      user: req.user,
      isAuthenticated: req.isAuthenticated && req.isAuthenticated(),
      cookies: req.headers.cookie,
      headers: req.headers,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    });
  }
);

export const debugWorkspaceController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.id;
    return res.status(HTTPSTATUS.OK).json({
      requestedWorkspace: workspaceId,
      user: req.user,
      userCurrentWorkspace: req.user?.currentWorkspace,
      isAuthenticated: req.isAuthenticated && req.isAuthenticated(),
      cookies: req.headers.cookie,
    });
  }
); 