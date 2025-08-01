import chatRoutes from "./routes/chat.route";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "http";
import { Server } from "socket.io";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

// Configs
import "./config/passport.config";

// Routes & middlewares
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import dashboardRoutes from "./routes/dashboard.route"; // ✅ Make sure file is in routes
import { debugSessionController, debugWorkspaceController } from "./controllers/debug.controller";

// ✅ Declare early
const app = express();
const BASE_PATH = config.BASE_PATH;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [config.FRONTEND_ORIGIN, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Preflight for all routes
app.options("*", cors());

// Session setup
app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running ✅" });
});

app.get(`${BASE_PATH}/debug-session`, debugSessionController);
app.get(`${BASE_PATH}/debug-workspace/:id`, debugWorkspaceController);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/dashboard`, isAuthenticated, dashboardRoutes); // ✅ Correct position

// Error handler
app.use(errorHandler);

// SOCKET.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [config.FRONTEND_ORIGIN, "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_room", (room) => socket.join(room));
  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

// Start server
server.listen(config.PORT, async () => {
  console.log(`🚀 Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});
