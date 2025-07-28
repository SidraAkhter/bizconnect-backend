import express from "express";
import { sendMessage, getProjectMessages } from "../controllers/chat.controller";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";

const router = express.Router();

router.post("/:projectId", isAuthenticated, sendMessage);
router.get("/:projectId", isAuthenticated, getProjectMessages);

export default router;
