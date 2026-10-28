import crypto from 'crypto';

// A random 64-character string, safe to put in a cookie
export const generateRefreshToken = () => crypto.randomBytes(48).toString('base64url');

// Only this hash is stored in the database
export const hashRefreshToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

// Read at call time, not at import time, so .env is always loaded first
export const refreshTokenDays = () => Number(process.env.REFRESH_TOKEN_DAYS) || 7;