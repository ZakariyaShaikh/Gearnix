import crypto from 'crypto';
import bcrypt from 'bcrypt';

const OTP_SALT_ROUNDS = 10;
const OTP_EXPIRY_MINUTES = 10;

export const generateOtp = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

export const hashOtp = async (otp) => {
    return bcrypt.hash(otp, OTP_SALT_ROUNDS);
};

export const compareOtp = async (otp, otpHash) => {
    return bcrypt.compare(otp, otpHash);
};

export const getOtpExpiry = () => {
    const expiresAt = new Date();

    expiresAt.setMinutes(
        expiresAt.getMinutes() + OTP_EXPIRY_MINUTES
    );

    return expiresAt;
};