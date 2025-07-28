import { Request, Response } from "express";
import { Chat } from "../models/chat.model";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;
    const userId = req.user?._id;

    const newMessage = await Chat.create({
      projectId,
      sender: userId,
      message,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getProjectMessages = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const messages = await Chat.find({ projectId })
      .populate("sender", "name")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to get messages" });
  }
};
