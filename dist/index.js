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
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const isAuthenticated_middleware_1 = __importDefault(require("./middlewares/isAuthenticated.middleware"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const member_route_1 = __importDefault(require("./routes/member.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
// ✅ Passport config
require("./config/passport.config");
// ✅ Express app
const app = (0, express_1.default)();
const BASE_PATH = app_config_1.config.BASE_PATH;
// ✅ Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [app_config_1.config.FRONTEND_ORIGIN, "http://localhost:5173"],
    credentials: true,
}));
app.options("*", (0, cors_1.default)());
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: [app_config_1.config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// ✅ Routes
app.get("/", (req, res) => res.send("Backend running ✅"));
app.use(`${BASE_PATH}/auth`, auth_route_1.default);
app.use(`${BASE_PATH}/user`, isAuthenticated_middleware_1.default, user_route_1.default);
app.use(`${BASE_PATH}/workspaces`, workspace_route_1.default);
app.use(`${BASE_PATH}/member`, isAuthenticated_middleware_1.default, member_route_1.default);
app.use(`${BASE_PATH}/project`, isAuthenticated_middleware_1.default, project_route_1.default);
app.use(`${BASE_PATH}/task`, isAuthenticated_middleware_1.default, task_route_1.default);
app.use(`${BASE_PATH}/dashboard`, isAuthenticated_middleware_1.default, dashboard_route_1.default);
app.use(errorHandler_middleware_1.errorHandler);
// ✅ Create HTTP Server
const server = http_1.default.createServer(app);
// ✅ Socket.IO Setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [app_config_1.config.FRONTEND_ORIGIN, "http://localhost:5173"],
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
const PORT = app_config_1.config.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await (0, database_config_1.default)();
});
