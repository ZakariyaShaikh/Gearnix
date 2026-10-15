import { registerUser,loginUser } from '../services/auth.service.js';
import { validateRegisterInput } from '../validators/auth.validator.js';
import {
    verifyEmailOtp , resendEmailOtp
} from '../services/otp.service.js';


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

        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await loginUser({
            email,
            password
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

