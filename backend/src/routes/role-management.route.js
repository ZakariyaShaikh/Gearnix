import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    listRoles,
    updateRolePermissions
} from '../controllers/role-management.controller.js';
import {
    validateRoleIdParam,
    validateRolePermissionsBody
} from '../validators/role-management.validator.js';

const router = express.Router();

// List roles with permissions and user counts
router.get(
    '/',
    authenticate,
    requirePermission('role.read'),
    listRoles
);

// Replace a role's full permission set
router.patch(
    '/:id/permissions',
    authenticate,
    requirePermission('role.update'),
    validateRoleIdParam,
    validateRolePermissionsBody,
    updateRolePermissions
);

export default router;