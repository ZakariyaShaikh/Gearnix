import pool from '../config/db.js';

export const listRoles = async () => {
    const [rows] = await pool.query('CALL sp_list_roles()');

    // rows[0] = roles, rows[1] = each role's permissions
    return {
        roles: rows[0],
        permissions: rows[1]
    };
};

export const replaceRolePermissions = async (roleId, permissionKeys) => {
    const [rows] = await pool.query('CALL sp_replace_role_permissions(?, ?)', [
        roleId,
        JSON.stringify(permissionKeys)
    ]);

    // rows[0] = the role, rows[1] = its new permissions
    if (!rows[0][0]) {
        return null;
    }

    return {
        role: rows[0][0],
        permissions: rows[1]
    };
};