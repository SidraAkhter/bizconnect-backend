import { Router } from "express";
import {
  changeWorkspaceMemberRoleController,
  createWorkspaceController,
  deleteWorkspaceByIdController,
  getAllWorkspacesUserIsMemberController,
  getWorkspaceAnalyticsController,
  getWorkspaceByIdController,
  getWorkspaceMembersController,
  updateWorkspaceByIdController,
} from "../controllers/workspace.controller";

const workspaceRoutes = Router();

// 🌟 Match frontend: POST /workspaces
workspaceRoutes.post("/", createWorkspaceController);

// 🌟 Match frontend: PATCH /workspaces/:id
workspaceRoutes.patch("/:id", updateWorkspaceByIdController);

// 🌟 Match frontend: DELETE /workspaces/:id
workspaceRoutes.delete("/:id", deleteWorkspaceByIdController);

// 🌟 Match frontend: GET /workspaces
workspaceRoutes.get("/", getAllWorkspacesUserIsMemberController);

// 🌟 Match frontend: GET /workspaces/:id
workspaceRoutes.get("/:id", getWorkspaceByIdController);

// 🌟 Match frontend: GET /workspaces/:id/members
workspaceRoutes.get("/:id/members", getWorkspaceMembersController);

// 🌟 Match frontend: GET /workspaces/:id/analytics
workspaceRoutes.get("/:id/analytics", getWorkspaceAnalyticsController);

// 🌟 Match frontend: PATCH /workspaces/:id/members/role
workspaceRoutes.patch("/:id/members/role", changeWorkspaceMemberRoleController);

export default workspaceRoutes;
console.log("✅ Workspace routes loaded");
