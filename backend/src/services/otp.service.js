import {
    findUserByEmail
} from '../models/user.model.js';

import {
    createOtp,
    getActiveOtp,
    incrementOtpAttempt,
    invalidatePreviousOtp,
    markOtpVerified
} from '../models/otp.model.js';

import {
    verifyUserEmail
} from '../models/user.model.js';

import {
    compareOtp
} from '../utils/otp.utils.js';
import { generateOtp, getOtpExpiry, hashOtp } from '../utils/otp.utils.js';
import { sendOtpEmail } from '../utils/email.utils.js';

export const verifyEmailOtp = async ({
    email,
    otp
}) => {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    if (user.is_email_verified) {
        throw new Error('Email is already verified');
    }

    const otpRecord = await getActiveOtp({
        userId: user.user_id,
        purpose: 'email_verification'
    });

    if (!otpRecord) {
        throw new Error(
            'OTP is invalid or has expired'
        );
    }

    if (
        otpRecord.attempt_count >=
        otpRecord.max_attempts
    ) {
        throw new Error(
            'Maximum OTP attempts exceeded'
        );
    }

    const isOtpValid = await compareOtp(
        otp,
        otpRecord.otp_hash
    );

    if (!isOtpValid) {

        await incrementOtpAttempt(
            otpRecord.otp_id
        );

        throw new Error('Invalid OTP');
    }

    await markOtpVerified(
        otpRecord.otp_id
    );

    await verifyUserEmail(
        user.user_id
    );

    return {
        user_id: user.user_id,
        email: user.email,
        is_email_verified: true
    };
};

export const resendEmailOtp = async ({
    email
}) => {

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('User not found');
    }

    if (user.is_email_verified) {
        throw new Error(
            'Email is already verified'
        );
    }

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
        email: user.email
    };
};