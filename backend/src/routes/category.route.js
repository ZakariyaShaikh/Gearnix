import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    createCategory,
    getActiveCategories,
    getAllCategories,
    updateCategory
} from '../controllers/category.controller.js';
import {
    validateCreateCategory,
    validateCategoryIdParam,
    validateUpdateCategory
} from '../validators/category.validator.js';

const router = express.Router();

// Public
router.get('/', getActiveCategories);

// Admin list (declared before any "/:id" route)
router.get(
    '/admin',
    authenticate,
    requirePermission('category.read'),
    getAllCategories
);

// Create
router.post(
    '/',
    authenticate,
    requirePermission('category.create'),
    validateCreateCategory,
    createCategory
);

// Update, rename, hide or show
router.patch(
    '/:id',
    authenticate,
    requirePermission('category.update'),
    validateCategoryIdParam,
    validateUpdateCategory,
    updateCategory
);

export default router; 