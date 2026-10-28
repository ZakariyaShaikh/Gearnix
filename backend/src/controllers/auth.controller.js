import {
    registerUser,
    loginUser,
    refreshAccessService,
    logoutService,
    logoutAllService
} from '../services/auth.service.js';
import { validateRegisterInput } from '../validators/auth.validator.js';
import {
    verifyEmailOtp,
    resendEmailOtp
} from '../services/otp.service.js';
import {
    REFRESH_COOKIE_NAME,
    refreshCookieOptions
} from '../utils/cookie.utils.js';


export const register = async (req, res, next) => {
    try {

        const errors = validateRegisterInput(req.body);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const user = await registerUser(req.body);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: user
        });

    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {

        const {
            email,
            otp
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const result = await verifyEmailOtp({
            email,
            otp
        });

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const resendOtp = async (req, res, next) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const result = await resendEmailOtp({
            email
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const meta = {
            userAgent: req.get('user-agent'),
            ipAddress: req.ip
        };

        // The refresh token goes in the cookie, never in the response body
        const { refresh_token, ...data } = await loginUser({ email, password }, meta);

        res.cookie(REFRESH_COOKIE_NAME, refresh_token, refreshCookieOptions());

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data
        });

    } catch (error) {
        next(error);
    }
};

const clearRefreshCookie = (res) => {
    // clearCookie must use the same path and flags as the cookie it removes, without maxAge
    const { maxAge, ...options } = refreshCookieOptions();
    res.clearCookie(REFRESH_COOKIE_NAME, options);
};

const sendSessionError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const refresh = async (req, res) => {
    const presentedToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!presentedToken) {
        return res.status(401).json({
            success: false,
            message: 'Please log in'
        });
    }

    try {
        const meta = {
            userAgent: req.get('user-agent'),
            ipAddress: req.ip
        };

        const { refresh_token, ...data } = await refreshAccessService(presentedToken, meta);

        res.cookie(REFRESH_COOKIE_NAME, refresh_token, refreshCookieOptions());

        return res.status(200).json({
            success: true,
            message: 'Session refreshed',
            data
        });
    } catch (error) {
        clearRefreshCookie(res);
        return sendSessionError(res, error);
    }
};

export const logout = async (req, res) => {
    try {
        await logoutService(req.cookies?.[REFRESH_COOKIE_NAME]);
        clearRefreshCookie(res);

        return res.status(200).json({
            success: true,
            message: 'Logged out'
        });
    } catch (error) {
        return sendSessionError(res, error);
    }
};

export const logoutAll = async (req, res) => {
    try {
        await logoutAllService(req.user.user_id);
        clearRefreshCookie(res);

        return res.status(200).json({
            success: true,
            message: 'Logged out of all devices'
        });
    } catch (error) {
        return sendSessionError(res, error);
    }
};

