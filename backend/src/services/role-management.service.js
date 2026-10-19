import { listRoles, replaceRolePermissions } from '../models/role-management.model.js';

// Maps the procedure's SIGNAL messages to HTTP responses
const ROLE_ERRORS = {
    ROLE_NOT_FOUND: { statusCode: 404, message: 'Role not found' },
    ROLE_LOCKED: {
        statusCode: 403,
        message: 'This role is locked and its permissions cannot be changed'
    },
    UNKNOWN_PERMISSION: {
        statusCode: 400,
        message: 'One or more permission keys do not exist or are inactive'
    },
    LAST_ROLE_MANAGER: {
        statusCode: 409,
        message: 'Cannot remove role management from the last role that can manage roles'
    }
};

// Attaches each role's permissions to the role itself
export const listRolesService = async () => {
    const { roles, permissions } = await listRoles();

    const permissionsByRole = new Map();

    for (const p of permissions) {
        if (!permissionsByRole.has(p.role_id)) {
            permissionsByRole.set(p.role_id, []);
        }

        permissionsByRole.get(p.role_id).push({
            permission_key: p.permission_key,
            permission_name: p.permission_name,
            module: p.module
        });
    }

    return roles.map((role) => ({
        role_id: role.role_id,
        role_name: role.role_name,
        description: role.description,
        is_system_role: Boolean(role.is_system_role),
        is_active: Boolean(role.is_active),
        is_locked: Boolean(role.is_locked),
        user_count: Number(role.user_count),
        permissions: permissionsByRole.get(role.role_id) || []
    }));
};

export const replaceRolePermissionsService = async (roleId, permissionKeys) => {
    try {
        const result = await replaceRolePermissions(roleId, permissionKeys);

        if (!result) {
            const error = new Error('Role not found');
            error.statusCode = 404;
            throw error;
        }

        return {
            role_id: result.role.role_id,
            role_name: result.role.role_name,
            is_locked: Boolean(result.role.is_locked),
            permissions: result.permissions.map((p) => ({
                permission_key: p.permission_key,
                permission_name: p.permission_name,
                module: p.module
            }))
        };
    } catch (err) {
        const known = Object.keys(ROLE_ERRORS).find((key) =>
            err.sqlMessage?.includes(key)
        );

        if (known) {
            const error = new Error(ROLE_ERRORS[known].message);
            error.statusCode = ROLE_ERRORS[known].statusCode;
            throw error;
        }

        throw err;
    }
};