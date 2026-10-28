import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
    register,
    login,
    verifyEmail,
    resendOtp,
    refresh,
    logout,
    logoutAll
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/login', login);

// No access token needed: these use the refresh cookie
router.post('/refresh', refresh);
router.post('/logout', logout);

// Needs a valid access token: ends every session for this user
router.post('/logout-all', authenticate, logoutAll);

export default router;