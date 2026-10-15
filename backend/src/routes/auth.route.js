import express from 'express';

import {
    register,
    login,
    verifyEmail,
    resendOtp
} from '../controllers/auth.controller.js';

const router = express.Router();


router.post(
    '/register',
    register
);

router.post(
    '/verify-email',
    verifyEmail
);

router.post(
    '/resend-otp',
    resendOtp
);

router.post(
    '/login',
    login
);

export default router;