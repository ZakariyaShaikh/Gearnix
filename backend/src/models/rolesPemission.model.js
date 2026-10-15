import pool from '../config/db.js';

export const getRolePermissions = async (roleId) => {
    const [rows] = await pool.query(
        'CALL sp_get_role_permissions(?)',
        [roleId]
    );

    return rows[0] ?? [];
};

export const assignPermissionToRole = async ({
    roleId,
    permissionId
}) => {
    const [rows] = await pool.query(
        'CALL sp_assign_permission_to_role(?, ?)',
        [
            roleId,
            permissionId
        ]
    );

    return rows[0][0] ?? null;
};

export const removePermissionFromRole = async ({
    roleId,
    permissionId
}) => {
    const [rows] = await pool.query(
        'CALL sp_remove_permission_from_role(?, ?)',
        [
            roleId,
            permissionId
        ]
    );

    return rows[0][0] ?? null;
};