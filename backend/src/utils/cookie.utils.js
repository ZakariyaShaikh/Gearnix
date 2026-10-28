import { refreshTokenDays } from './refresh-token.utils.js';

export const REFRESH_COOKIE_NAME = 'refresh_token';

const isProduction = () => process.env.NODE_ENV === 'production';

export const refreshCookieOptions = () => ({
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: refreshTokenDays() * 24 * 60 * 60 * 1000
});