import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";

export const getMeController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      message: "User info fetched successfully",
      user: req.user,
    });
  }
);


export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("Google login callback:", req.user);
    console.log("Session:", req.session);
    
    // Get the redirectUrl from session if it was saved during the auth initiation
    const redirectUrlBase = (req.session && req.session.redirectUrl) || config.FRONTEND_ORIGIN;
    console.log("Using redirect URL base:", redirectUrlBase);
    
    if (!req.user) {
      console.error("No user found in request");
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_user`
      );
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
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure&error=no_workspace`
      );
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
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    // Log for debugging
    console.log("Logout request received");
    
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
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
        .status(HTTPSTATUS.OK)
        .json({ message: "Logged out successfully" });
    });
  }
);

export const checkGoogleLoginStatus = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        success: false,
        message: "Not authenticated",
        user: null
      });
    }
    
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Authenticated successfully",
      user: req.user
    });
  }
);
