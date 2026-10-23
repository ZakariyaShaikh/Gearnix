import crypto from 'crypto';
import { razorpay, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../config/razorpay.js';
import {
    checkoutCart,
    attachPayment,
    markOrderPaid,
    cancelUnpaidOrder
} from '../models/order.model.js';
import { verifyRazorpaySignature } from '../utils/razorpay.utils.js';

// Maps the procedures' SIGNAL messages and known database errors to HTTP responses
const ORDER_ERRORS = {
    ADDRESS_NOT_FOUND: { statusCode: 404, message: 'Address not found' },
    CART_EMPTY: { statusCode: 400, message: 'Your cart is empty' },
    PRODUCT_UNAVAILABLE: {
        statusCode: 409,
        message: 'A product in your cart is no longer available. Remove it and try again'
    },
    INSUFFICIENT_STOCK: {
        statusCode: 409,
        message: 'Not enough stock for an item in your cart'
    },
    ORDER_NOT_FOUND: { statusCode: 404, message: 'Order not found' },
    ORDER_NOT_PAYABLE: { statusCode: 409, message: 'This order can no longer be paid' },
    ORDER_NOT_CANCELLABLE: { statusCode: 409, message: 'Only unpaid orders can be cancelled' },
    PAYMENT_NOT_FOUND: { statusCode: 404, message: 'No payment was started for this order' },
    AMOUNT_MISMATCH: { statusCode: 400, message: 'Payment amount does not match the order' }
};

const toOrderError = (err) => {
    if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage?.includes('uq_payments_provider_payment')) {
        const error = new Error('This payment was already recorded');
        error.statusCode = 409;
        return error;
    }

    const key = Object.keys(ORDER_ERRORS).find((k) => err.sqlMessage?.includes(k));

    if (!key) {
        return err;
    }

    const error = new Error(ORDER_ERRORS[key].message);
    error.statusCode = ORDER_ERRORS[key].statusCode;
    return error;
};

// Human-readable and unique enough to share with the customer, e.g. GX-20261022-3F9A1C0B
const makeOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();

    return `GX-${date}-${random}`;
};

// Money is stored in rupees; Razorpay wants whole paise
const toPaise = (total) => Math.round(Number(total) * 100);

export const checkoutService = async (userId, addressId) => {
    // A rare order-number clash rolls back cleanly, so retrying with a new number is safe
    let result;

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            result = await checkoutCart(userId, addressId, makeOrderNumber());
            break;
        } catch (err) {
            const isNumberClash =
                err.code === 'ER_DUP_ENTRY' && err.sqlMessage?.includes('uq_orders_number');

            if (!isNumberClash || attempt === 3) {
                throw toOrderError(err);
            }
        }
    }

    const { order, items } = result;
    const amountPaise = toPaise(order.total);

    try {
        const providerOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: 'INR',
            receipt: order.order_number,
            notes: { order_id: String(order.order_id) }
        });

        await attachPayment(userId, order.order_id, providerOrder.id, amountPaise);

        return {
            order,
            items,
            payment: {
                key_id: RAZORPAY_KEY_ID,
                razorpay_order_id: providerOrder.id,
                amount_paise: amountPaise,
                currency: 'INR'
            }
        };
    } catch (err) {
        // Could not start payment: give the reserved stock back
        await cancelUnpaidOrder(userId, order.order_id).catch(() => {});

        const error = new Error('Could not start the payment. Please try again');
        error.statusCode = 502;
        throw error;
    }
};

export const verifyPaymentService = async (userId, orderId, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    // Check the signature first, before any database work
    const valid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        secret: RAZORPAY_KEY_SECRET
    });

    if (!valid) {
        const error = new Error('Payment verification failed');
        error.statusCode = 400;
        throw error;
    }

    try {
        return await markOrderPaid(userId, orderId, razorpay_order_id, razorpay_payment_id);
    } catch (err) {
        throw toOrderError(err);
    }
};

export const cancelOrderService = async (userId, orderId) => {
    try {
        return await cancelUnpaidOrder(userId, orderId);
    } catch (err) {
        throw toOrderError(err);
    }
};