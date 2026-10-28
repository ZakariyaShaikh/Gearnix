import pool from '../config/db.js';

export const createSessionRow = async ({ userId, tokenHash, lifetimeDays, userAgent, ipAddress }) => {
    const [rows] = await pool.query('CALL sp_create_refresh_token(?, ?, ?, ?, ?)', [
        userId,
        tokenHash,
        lifetimeDays,
        userAgent ?? null,
        ipAddress ?? null
    ]);

    return rows[0][0];
};

export const rotateSessionRow = async ({ oldHash, newHash, lifetimeDays, userAgent, ipAddress }) => {
    const [rows] = await pool.query('CALL sp_rotate_refresh_token(?, ?, ?, ?, ?)', [
        oldHash,
        newHash,
        lifetimeDays,
        userAgent ?? null,
        ipAddress ?? null
    ]);

    // { status, user_id }
    return rows[0][0];
};

export const revokeSessionRow = async (tokenHash) => {
    const [rows] = await pool.query('CALL sp_revoke_refresh_token(?)', [tokenHash]);

    return Number(rows[0][0].revoked_count);
};

export const revokeAllSessionRows = async (userId) => {
    const [rows] = await pool.query('CALL sp_revoke_all_refresh_tokens(?)', [userId]);

    return Number(rows[0][0].revoked_count);
};