"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkspaceByIdController = exports.updateWorkspaceByIdController = exports.changeWorkspaceMemberRoleController = exports.getWorkspaceAnalyticsController = exports.getWorkspaceMembersController = exports.getAllWorkspacesUserIsMemberController = exports.createWorkspaceController = exports.getMyWorkspacesController = exports.getWorkspaceByIdController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const workspace_validation_1 = require("../validation/workspace.validation");
const http_config_1 = require("../config/http.config");
const workspace_service_1 = require("../services/workspace.service");
const member_service_1 = require("../services/member.service");
const role_enum_1 = require("../enums/role.enum");
const roleGuard_1 = require("../utils/roleGuard");
const workspace_model_1 = __importDefault(require("../models/workspace.model"));
const workspaceMember_model_1 = __importDefault(require("../models/workspaceMember.model"));
// ✅ GET: /api/workspaces/:id
exports.getWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    console.log("🔍 Route Hit: GET /api/workspaces/:id");
    console.log("👉 Workspace ID:", req.params.id);
    console.log("👉 User:", req.user);
    if (req.params.id === "undefined") {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid workspace ID: 'undefined'",
            error: "INVALID_WORKSPACE_ID",
        });
    }
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    const { workspace } = await (0, workspace_service_1.getWorkspaceByIdService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace,
    });
});
// ✅ GET: /api/workspaces/my
exports.getMyWorkspacesController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const ownedWorkspaces = await workspace_model_1.default.find({ owner: userId });
    const memberWorkspaces = await workspaceMember_model_1.default.find({
        userId: userId,
    }).distinct("workspaceId");
    const sharedWorkspaces = await workspace_model_1.default.find({
        _id: { $in: memberWorkspaces },
    });
    const allWorkspaces = [...ownedWorkspaces, ...sharedWorkspaces];
    return res.status(http_config_1.HTTPSTATUS.OK).json(allWorkspaces);
});
// ✅ POST: /api/workspaces
exports.createWorkspaceController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const body = workspace_validation_1.createWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;
    const { workspace } = await (0, workspace_service_1.createWorkspaceService)(userId, body);
    return res.status(http_config_1.HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
});
// ✅ GET: /api/workspaces
exports.getAllWorkspacesUserIsMemberController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    const { workspaces } = await (0, workspace_service_1.getAllWorkspacesUserIsMemberService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User workspaces fetched successfully",
        workspaces,
    });
});
// ✅ GET: /api/workspaces/:id/members
exports.getWorkspaceMembersController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { members, roles } = await (0, workspace_service_1.getWorkspaceMembersService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace members retrieved successfully",
        members,
        roles,
    });
});
// ✅ GET: /api/workspaces/:id/analytics
exports.getWorkspaceAnalyticsController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    if (req.params.id === "undefined") {
        return res.status(http_config_1.HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid workspace ID: 'undefined'",
            error: "INVALID_WORKSPACE_ID",
        });
    }
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.VIEW_ONLY]);
    const { analytics } = await (0, workspace_service_1.getWorkspaceAnalyticsService)(workspaceId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace analytics retrieved successfully",
        analytics,
    });
});
// ✅ PATCH: /api/workspaces/:id/members/role
exports.changeWorkspaceMemberRoleController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const { memberId, roleId } = workspace_validation_1.changeRoleSchema.parse(req.body);
    const userId = req.user?._id;
    const { role } = await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.CHANGE_MEMBER_ROLE]);
    const { member } = await (0, workspace_service_1.changeMemberRoleService)(workspaceId, memberId, roleId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Member Role changed successfully",
        member,
    });
});
// ✅ PATCH: /api/workspaces/:id
exports.updateWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const { name, description } = workspace_validation_1.updateWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;
    const { role } = await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.EDIT_WORKSPACE]);
    const { workspace } = await (0, workspace_service_1.updateWorkspaceByIdService)(workspaceId, name, description);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace,
    });
});
// ✅ DELETE: /api/workspaces/:id
exports.deleteWorkspaceByIdController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const workspaceId = workspace_validation_1.workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await (0, member_service_1.getMemberRoleInWorkspace)(userId, workspaceId);
    (0, roleGuard_1.roleGuard)(role, [role_enum_1.Permissions.DELETE_WORKSPACE]);
    const { currentWorkspace } = await (0, workspace_service_1.deleteWorkspaceService)(workspaceId, userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace,
    });
});
