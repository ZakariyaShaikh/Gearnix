import {
    findUserByEmail,
    createCustomer,
    findUserForLogin
} from '../models/user.model.js';

import { getUserAuthState } from '../models/user.model.js';
import {
    startSession,
    refreshSession,
    endSession,
    endAllSessions
} from './session.service.js';

import {
    findRoleByName
} from '../models/role.model.js';

import {
    createOtp,
    invalidatePreviousOtp
} from '../models/otp.model.js';

import {
    hashPassword
} from '../utils/password.utils.js';

import {
    generateOtp,
    hashOtp,
    getOtpExpiry
} from '../utils/otp.utils.js';

import {
    sendOtpEmail
} from '../utils/email.utils.js';

import {
    comparePassword
} from '../utils/password.utils.js';

import {
    generateAccessToken
} from '../utils/jwt.utils.js';

import {
    findUserProfile as findUserProfileFromModel
} from '../models/user.model.js';




export const registerUser = async ({
    username,
    email,
    password
}) => {

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const customerRole = await findRoleByName('Customer');

    if (!customerRole) {
        throw new Error('Customer role is not configured');
    }

    const passwordHash = await hashPassword(password);

    const user = await createCustomer({
        roleId: customerRole.role_id,
        username,
        email,
        passwordHash
    });

    await invalidatePreviousOtp({
        userId: user.user_id,
        purpose: 'email_verification'
    });

    const otp = generateOtp();

    const otpHash = await hashOtp(otp);

    const expiresAt = getOtpExpiry();

    await createOtp({
        userId: user.user_id,
        purpose: 'email_verification',
        otpHash,
        expiresAt,
        maxAttempts: 5
    });

    await sendOtpEmail({
        email: user.email,
        username: user.username,
        otp
    });

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        is_email_verified: user.is_email_verified
    };
};

export const getUserProfile = async (userId) => {
    const user = await findUserProfileFromModel(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        profile_image: user.profile_image,
        status: user.status,
        is_email_verified: user.is_email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at
    };
};

export const loginUser = async ({
    email,
    password
}, meta = {}) => {

    const user = await findUserForLogin(email);

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    if (user.status !== 'active') {
        const error = new Error('Account is not active');
        error.statusCode = 403;
        throw error;
    }

    if (!user.is_email_verified) {
        const error = new Error('Please verify your email before logging in');
        error.statusCode = 403;
        throw error;
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken({
        userId: user.user_id,
        roleId: user.role_id,
        roleName: user.role_name
    });

    // A new session for this device. The controller stores it in a cookie
    const refreshToken = await startSession(user.user_id, meta);

    return {
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name,
            profile_image: user.profile_image
        },
        access_token: accessToken,
        refresh_token: refreshToken
    };
};

export const findUserProfileServices = async (userId) => {
    const user = await findUserProfile(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role_name,
        profile_image: user.profile_image,
        status: user.status,
        is_email_verified: user.is_email_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
        deleted_at: user.deleted_at
    };
};

export const refreshAccessService = async (presentedToken, meta = {}) => {
    const result = await refreshSession(presentedToken, meta);

    if (result.status === 'REUSED') {
        console.warn('[auth] reused refresh token. All sessions ended for user', result.userId);
    }

    if (result.status !== 'ROTATED') {
        const error = new Error('Your session has expired. Please log in again');
        error.statusCode = 401;
        throw error;
    }

    // Check the account again: a suspended or deleted user must not get a new token
    const authUser = await getUserAuthState(result.userId);

    if (!authUser || authUser.status !== 'active') {
        await endAllSessions(result.userId);

        const error = new Error('Your account is no longer active');
        error.statusCode = 401;
        throw error;
    }

    return {
        access_token: generateAccessToken({
            userId: authUser.user_id,
            roleId: authUser.role_id,
            roleName: authUser.role_name
        }),
        refresh_token: result.token,
        user: {
            user_id: authUser.user_id,
            role_id: authUser.role_id,
            role_name: authUser.role_name
        }
    };
};

export const logoutService = async (presentedToken) => {
    if (!presentedToken) {
        return 0;
    }

    return endSession(presentedToken);
};

export const logoutAllService = async (userId) => {
    return endAllSessions(userId);
};