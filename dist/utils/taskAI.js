"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestBestUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const task_model_1 = __importDefault(require("../models/task.model"));
/**
 * Suggest the best user to assign a task to.
 * ✅ Smarter logic: Find the user with the least assigned tasks.
 */
const suggestBestUser = async () => {
    try {
        const users = await user_model_1.default.find();
        if (!users || users.length === 0)
            return null;
        const userTaskCounts = await Promise.all(users.map(async (user) => {
            const taskCount = await task_model_1.default.countDocuments({ assignedTo: user._id });
            return { user, taskCount };
        }));
        const sorted = userTaskCounts.sort((a, b) => a.taskCount - b.taskCount);
        return sorted[0].user;
    }
    catch (err) {
        console.error("❌ Error suggesting best user:", err);
        return null;
    }
};
exports.suggestBestUser = suggestBestUser;
