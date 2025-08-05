"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspace_controller_1 = require("../controllers/workspace.controller");
const workspaceRoutes = (0, express_1.Router)();
// 🌟 Match frontend: POST /workspaces
workspaceRoutes.post("/", workspace_controller_1.createWorkspaceController);
// 🌟 Match frontend: PATCH /workspaces/:id
workspaceRoutes.patch("/:id", workspace_controller_1.updateWorkspaceByIdController);
// 🌟 Match frontend: DELETE /workspaces/:id
workspaceRoutes.delete("/:id", workspace_controller_1.deleteWorkspaceByIdController);
// 🌟 Match frontend: GET /workspaces
workspaceRoutes.get("/", workspace_controller_1.getAllWorkspacesUserIsMemberController);
// 🌟 Match frontend: GET /workspaces/:id
workspaceRoutes.get("/:id", workspace_controller_1.getWorkspaceByIdController);
// 🌟 Match frontend: GET /workspaces/:id/members
workspaceRoutes.get("/:id/members", workspace_controller_1.getWorkspaceMembersController);
// 🌟 Match frontend: GET /workspaces/:id/analytics
workspaceRoutes.get("/:id/analytics", workspace_controller_1.getWorkspaceAnalyticsController);
// 🌟 Match frontend: PATCH /workspaces/:id/members/role
workspaceRoutes.patch("/:id/members/role", workspace_controller_1.changeWorkspaceMemberRoleController);
exports.default = workspaceRoutes;
console.log("✅ Workspace routes loaded");
