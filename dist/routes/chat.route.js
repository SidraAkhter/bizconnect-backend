"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const isAuthenticated_middleware_1 = __importDefault(require("../middlewares/isAuthenticated.middleware"));
const router = express_1.default.Router();
router.post("/:projectId", isAuthenticated_middleware_1.default, chat_controller_1.sendMessage);
router.get("/:projectId", isAuthenticated_middleware_1.default, chat_controller_1.getProjectMessages);
exports.default = router;
