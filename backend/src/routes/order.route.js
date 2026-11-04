import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    checkout,
    verifyPayment,
    cancelOrder,
    listOrders,
    getOrder,
    requestRefund,
    requestRefundAdmin,
    retryRefund,
    retryOrderRefund
} from '../controllers/order.controller.js';
import {
    validateCheckout,
    validateVerifyPayment,
    validateOrderIdParam,
    validateOrderListQuery,
    validateRefundRequest,
    validateRefundIdParam
} from '../validators/order.validator.js';

const router = express.Router();

router.get(
    '/',
    authenticate,
    requirePermission('order.manage'),
    validateOrderListQuery,
    listOrders
);

router.get(
    '/:id',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    getOrder
);

router.post(
    '/checkout',
    authenticate,
    requirePermission('order.manage'),
    validateCheckout,
    checkout
);

router.post(
    '/:id/verify-payment',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    validateVerifyPayment,
    verifyPayment
);

router.post(
    '/:id/cancel',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    cancelOrder
);

// Customer refund request: sirf apne paid order par
router.post(
    '/:id/refund',
    authenticate,
    requirePermission('order.manage'),
    validateOrderIdParam,
    validateRefundRequest,
    requestRefund
);

// Admin refund request: koi bhi paid order par
router.post(
    '/admin/:id/refund',
    authenticate,
    requirePermission('order.refund'),
    validateOrderIdParam,
    validateRefundRequest,
    requestRefundAdmin
);

// Admin retry by order ID: latest refund for the order is retried
router.post(
    '/admin/:id/refund/retry',
    authenticate,
    requirePermission('order.refund'),
    validateOrderIdParam,
    retryOrderRefund
);

// Admin retry: pehle jo refund Razorpay tak nahi pahuncha, use dobara bhejna
router.post(
    '/admin/refunds/:refundId/retry',
    authenticate,
    requirePermission('order.refund'),
    validateRefundIdParam,
    retryRefund
);

export default router;