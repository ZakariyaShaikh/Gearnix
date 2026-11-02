import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    checkout,
    verifyPayment,
    cancelOrder,
    listOrders,
    getOrder,
    listAllOrders
} from '../controllers/order.controller.js';
import {
    validateCheckout,
    validateVerifyPayment,
    validateOrderIdParam,
    validateOrderListQuery,
    validateAdminOrderListQuery
} from '../validators/order.validator.js';

const router = express.Router();

// The customer's order history
router.get(
    '/',
    authenticate,
    requirePermission('order.manage'),
    validateOrderListQuery,
    listOrders
);

// All orders (Super Admin only): status filter, search, pagination
router.get(
    '/admin',
    authenticate,
    requirePermission('order.read'),
    validateAdminOrderListQuery,
    listAllOrders
);

// One order with its items and payment
router.get(
    '/:id',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    getOrder
);

// Turn the cart into an order and start the payment
router.post(
    '/checkout',
    authenticate,
    requirePermission('order.manage'),
    validateCheckout,
    checkout
);

// Confirm a payment after the customer pays on Razorpay
router.post(
    '/:id/verify-payment',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    validateVerifyPayment,
    verifyPayment
);

// Cancel an unpaid order and release its stock
router.post(
    '/:id/cancel',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    cancelOrder
);

export default router;