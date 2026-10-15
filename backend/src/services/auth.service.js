import {
    findUserByEmail,
    createCustomer,
    findUserForLogin
} from '../models/user.model.js';

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
}) => {

    const user = await findUserForLogin(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (user.status !== 'active') {
        throw new Error('Account is not active');
    }

    if (!user.is_email_verified) {
        throw new Error('Please verify your email before logging in');
    }

    const isPasswordValid = await comparePassword(
        password,
        user.password_hash
    );

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken({
        userId: user.user_id,
        roleId: user.role_id,
        roleName: user.role_name
    });

    return {
        user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name,
            profile_image: user.profile_image
        },
        access_token: accessToken
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