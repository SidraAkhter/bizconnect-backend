import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "cookie-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import http from "http";
import { Server } from "socket.io";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import dashboardRoutes from "./routes/dashboard.route";

// ✅ Passport config
import "./config/passport.config";

// ✅ Express app
const app = express();
import Workspace from "./models/workspace.model"; // model ka path sahi ho

const BASE_PATH = config.BASE_PATH; // ✅ move this up

// ✅ Debug route (place early)
app.get("/api/v1/debug/workspace", async (req, res) => {
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (err) {
    console.error("❌ Debug route error:", err);
    res.status(500).send("Error fetching workspaces");
  }
});


// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [config.FRONTEND_ORIGIN, "http://localhost:5173"],
    credentials: true,
  })
);
app.options("*", cors());

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
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.get("/", (req, res) => res.send("Backend running ✅"));
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspaces`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes);
app.use(`${BASE_PATH}/dashboard`, isAuthenticated, dashboardRoutes);
app.use(errorHandler);

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: [config.FRONTEND_ORIGIN, "http://localhost:5173"],
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

// ✅ Start Server
const PORT = config.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDatabase();
});

