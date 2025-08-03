"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_config_1 = require("./config/app.config");
const database_config_1 = __importDefault(require("./config/database.config"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
// Configs
require("./config/passport.config");
// Routes & middlewares
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const isAuthenticated_middleware_1 = __importDefault(require("./middlewares/isAuthenticated.middleware"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const member_route_1 = __importDefault(require("./routes/member.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route")); // ✅ Make sure file is in routes
const debug_controller_1 = require("./controllers/debug.controller");
// ✅ Declare early
const app = (0, express_1.default)();
const BASE_PATH = app_config_1.config.BASE_PATH;
// Middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [app_config_1.config.FRONTEND_ORIGIN, "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
    exposedHeaders: ["set-cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
// Preflight for all routes
app.options("*", (0, cors_1.default)());
// Session setup
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [app_config_1.config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
}));
// Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Backend is running ✅" });
});
app.get(`${BASE_PATH}/debug-session`, debug_controller_1.debugSessionController);
app.get(`${BASE_PATH}/debug-workspace/:id`, debug_controller_1.debugWorkspaceController);
app.use(`${BASE_PATH}/auth`, auth_route_1.default);
app.use(`${BASE_PATH}/user`, isAuthenticated_middleware_1.default, user_route_1.default);
app.use(`${BASE_PATH}/workspace`, isAuthenticated_middleware_1.default, workspace_route_1.default);
app.use(`${BASE_PATH}/member`, isAuthenticated_middleware_1.default, member_route_1.default);
app.use(`${BASE_PATH}/project`, isAuthenticated_middleware_1.default, project_route_1.default);
app.use(`${BASE_PATH}/task`, isAuthenticated_middleware_1.default, task_route_1.default);
app.use(`${BASE_PATH}/dashboard`, isAuthenticated_middleware_1.default, dashboard_route_1.default); // ✅ Correct position
// Error handler
app.use(errorHandler_middleware_1.errorHandler);
// SOCKET.IO Setup
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [app_config_1.config.FRONTEND_ORIGIN, "http://localhost:5173"],
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
const PORT = process.env.PORT || app_config_1.config.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`🚀 Server listening on port ${PORT} in ${app_config_1.config.NODE_ENV}`);
    await (0, database_config_1.default)();
});
