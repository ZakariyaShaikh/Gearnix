import {
    generateRefreshToken,
    hashRefreshToken,
    refreshTokenDays
} from '../utils/refresh-token.utils.js';
import {
    createSessionRow,
    rotateSessionRow,
    revokeSessionRow,
    revokeAllSessionRows
} from '../models/session.model.js';

// Starts a session at login and returns the raw token for the cookie
export const startSession = async (userId, meta = {}) => {
    const token = generateRefreshToken();

    await createSessionRow({
        userId,
        tokenHash: hashRefreshToken(token),
        lifetimeDays: refreshTokenDays(),
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress
    });

    return token;
};

// Exchanges the presented token for a new one.
// Returns { status, userId, token }. token is only set when status is ROTATED
export const refreshSession = async (presentedToken, meta = {}) => {
    const newToken = generateRefreshToken();

    const result = await rotateSessionRow({
        oldHash: hashRefreshToken(presentedToken),
        newHash: hashRefreshToken(newToken),
        lifetimeDays: refreshTokenDays(),
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress
    });

    return {
        status: result.status,
        userId: result.user_id,
        token: result.status === 'ROTATED' ? newToken : null
    };
};

export const endSession = (token) => revokeSessionRow(hashRefreshToken(token));

export const endAllSessions = (userId) => revokeAllSessionRows(userId);