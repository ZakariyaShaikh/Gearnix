import {
    listRolesService,
    replaceRolePermissionsService
} from '../services/role-management.service.js';

export const listRoles = async (req, res) => {
    try {
        const roles = await listRolesService();

        return res.status(200).json({
            success: true,
            message: 'Roles fetched successfully',
            data: roles
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : 'Internal server error'
        });
    }
};

export const updateRolePermissions = async (req, res) => {
    try {
        // Already validated as a positive integer by validateRoleIdParam
        const role = await replaceRolePermissionsService(
            req.params.id,
            req.body.permission_keys
        );

        return res.status(200).json({
            success: true,
            message: 'Role permissions updated successfully',
            data: role
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.statusCode ? error.message : 'Internal server error'
        });
    }
};