"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectMessages = exports.sendMessage = void 0;
const chat_model_1 = require("../models/chat.model");
const sendMessage = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { message } = req.body;
        const userId = req.user?._id;
        const newMessage = await chat_model_1.Chat.create({
            projectId,
            sender: userId,
            message,
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
};
exports.sendMessage = sendMessage;
const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;
        const messages = await chat_model_1.Chat.find({ projectId })
            .populate("sender", "name")
            .sort({ timestamp: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get messages" });
    }
};
exports.getProjectMessages = getProjectMessages;
