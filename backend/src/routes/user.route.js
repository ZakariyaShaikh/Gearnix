import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadProfileImage } from '../middlewares/upload.middleware.js';
import {
    getProfile,
    updateProfile,
    changePassword,
    updateProfileImage,
    deleteAccount
} from '../controllers/user.controller.js';
import {
    validateUpdateProfile,
    validateChangePassword,
    validateDeleteAccount
} from '../validators/user.validator.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, validateUpdateProfile, updateProfile);
router.patch('/change-password', authenticate, validateChangePassword, changePassword);
router.patch('/profile-image', authenticate, uploadProfileImage, updateProfileImage);
router.delete('/account', authenticate, validateDeleteAccount, deleteAccount);

export default router;