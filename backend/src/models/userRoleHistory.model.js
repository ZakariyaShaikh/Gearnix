import pool from '../config/db.js';

export const createRoleHistory = async ({
    userId,
    oldRoleId,
    newRoleId,
    changedBy,
    reason
}) => {
    const [rows] = await pool.query(
        'CALL sp_create_user_role_history(?, ?, ?, ?, ?)',
        [
            userId,
            oldRoleId,
            newRoleId,
            changedBy,
            reason
        ]
    );

    return rows[0][0] ?? null;
};

export const getUserRoleHistory = async (userId) => {
    const [rows] = await pool.query(
        'CALL sp_get_user_role_history(?)',
        [userId]
    );

    return rows[0] ?? [];
};