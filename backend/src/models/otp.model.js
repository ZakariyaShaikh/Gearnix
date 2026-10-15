import pool from '../config/db.js';

export const createOtp = async ({
    userId,
    purpose,
    otpHash,
    expiresAt,
    maxAttempts
}) => {
    const [rows] = await pool.query(
        'CALL sp_create_otp(?, ?, ?, ?, ?)',
        [
            userId,
            purpose,
            otpHash,
            expiresAt,
            maxAttempts
        ]
    );

    return rows[0][0] ?? null;
};

export const getActiveOtp = async ({
    userId,
    purpose
}) => {
    const [rows] = await pool.query(
        'CALL sp_get_active_otp(?, ?)',
        [
            userId,
            purpose
        ]
    );

    return rows[0][0] ?? null;
};

export const incrementOtpAttempt = async (otpId) => {
    const [rows] = await pool.query(
        'CALL sp_increment_otp_attempt(?)',
        [otpId]
    );

    return rows[0][0] ?? null;
};

export const markOtpVerified = async (otpId) => {
    const [rows] = await pool.query(
        'CALL sp_mark_otp_verified(?)',
        [otpId]
    );

    return rows[0][0] ?? null;
};

export const invalidatePreviousOtp = async ({
    userId,
    purpose
}) => {
    const [rows] = await pool.query(
        'CALL sp_invalidate_previous_otp(?, ?)',
        [
            userId,
            purpose
        ]
    );

    return rows[0][0] ?? null;
};