import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem
} from '../controllers/cart.controller.js';
import {
    validateAddCartItem,
    validateUpdateCartItem,
    validateCartProductParam
} from '../validators/cart.validator.js';

const router = express.Router();

router.get(
    '/',
    authenticate,
    requirePermission('cart.manage'),
    getCart
);

router.post(
    '/items',
    authenticate,
    requirePermission('cart.manage'),
    validateAddCartItem,
    addCartItem
);

router.patch(
    '/items/:productId',
    authenticate,
    requirePermission('cart.manage'),
    validateCartProductParam,
    validateUpdateCartItem,
    updateCartItem
);

router.delete(
    '/items/:productId',
    authenticate,
    requirePermission('cart.manage'),
    validateCartProductParam,
    removeCartItem
);

export default router;