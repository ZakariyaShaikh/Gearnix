import pool from '../config/db.js';

export const findRoleByName = async (roleName) => {
    const [rows] = await pool.query(
        'CALL sp_find_role_by_name(?)',
        [roleName]
    );

    return rows[0][0] ?? null;
};

export const getRoles = async () => {
    const [rows] = await pool.query(
        'CALL sp_get_roles()'
    );

    return rows[0] ?? [];
};

export const getRoleById = async (roleId) => {
    const [rows] = await pool.query(
        'CALL sp_get_role_by_id(?)',
        [roleId]
    );

    return rows[0][0] ?? null;
};