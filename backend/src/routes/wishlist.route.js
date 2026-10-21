import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    getWishlist,
    addWishlistItem,
    removeWishlistItem
} from '../controllers/wishlist.controller.js';
import {
    validateAddWishlistItem,
    validateWishlistProductParam
} from '../validators/wishlist.validator.js';

const router = express.Router();

router.get(
    '/',
    authenticate,
    requirePermission('wishlist.manage'),
    getWishlist
);

router.post(
    '/items',
    authenticate,
    requirePermission('wishlist.manage'),
    validateAddWishlistItem,
    addWishlistItem
);

router.delete(
    '/items/:productId',
    authenticate,
    requirePermission('wishlist.manage'),
    validateWishlistProductParam,
    removeWishlistItem
);

export default router;