import pool from '../config/db.js';

export const getPermissions = async () => {
    const [rows] = await pool.query(
        'CALL sp_get_permissions()'
    );

    return rows[0] ?? [];
};

export const getUserPermissions = async (userId) => {
    const [rows] = await pool.query(
        'CALL sp_get_user_permissions(?)',
        [userId]
    );

    return rows[0] ?? [];
};

export const userHasPermission = async (
    userId,
    permissionKey
) => {
    const [rows] = await pool.query(
        'CALL sp_user_has_permission(?, ?)',
        [
            userId,
            permissionKey
        ]
    );

    return rows[0][0] ?? null;
};

export const checkUserPermission = async ({
    roleId,
    permissionKey
}) => {

    const [rows] = await pool.query(
        'CALL sp_check_user_permission(?, ?)',
        [
            roleId,
            permissionKey
        ]
    );

    return rows[0][0] ?? null;
};