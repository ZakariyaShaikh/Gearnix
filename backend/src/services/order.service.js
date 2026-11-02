import crypto from 'crypto';
import {
    razorpay,
    RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET,
    RAZORPAY_WEBHOOK_SECRET
} from '../config/razorpay.js';
import {
    checkoutCart,
    attachPayment,
    markOrderPaid,
    markOrderPaidByProvider,
    cancelUnpaidOrder,
    getOrderPayment,
    listOrders,
    listAllOrders,
    getOrderDetail
} from '../models/order.model.js';
import {
    verifyRazorpaySignature,
    verifyWebhookSignature
} from '../utils/razorpay.utils.js';

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
    // 1. Signature check: no database or network work until this passes
    const signatureValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        secret: RAZORPAY_KEY_SECRET
    });

    if (!signatureValid) {
        const error = new Error('Payment verification failed');
        error.statusCode = 400;
        throw error;
    }

    // 2. We must have started a payment for this order, with this Razorpay order ID
    const stored = await getOrderPayment(userId, orderId, razorpay_order_id);

    if (!stored) {
        const error = new Error('No payment was started for this order');
        error.statusCode = 404;
        throw error;
    }

    // 3. Ask Razorpay directly what happened to this payment
    let remote;

    try {
        remote = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (err) {
        const error = new Error('Payment could not be confirmed with Razorpay');
        error.statusCode = 400;
        throw error;
    }

    // 4. Captured, in rupees, for this order, and for exactly the amount we stored
    const matches =
        remote.order_id === razorpay_order_id &&
        remote.status === 'captured' &&
        remote.currency === 'INR' &&
        Number(remote.amount) === Number(stored.amount_paise);

    if (!matches) {
        const error = new Error('Payment is not captured or does not match this order');
        error.statusCode = 400;
        throw error;
    }

    // 5. Record the payment (idempotent)
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

// Problems that retrying can never fix. The webhook acknowledges these and logs them
const WEBHOOK_SKIP_REASONS = ['PAYMENT_NOT_FOUND', 'AMOUNT_MISMATCH', 'ORDER_NOT_PAYABLE'];

export const handleRazorpayWebhookService = async (rawBody, signature) => {
    // 1. Check the signature against the exact bytes Razorpay sent
    const valid = verifyWebhookSignature({
        body: rawBody,
        signature,
        secret: RAZORPAY_WEBHOOK_SECRET
    });

    if (!valid) {
        const error = new Error('Invalid webhook signature');
        error.statusCode = 400;
        throw error;
    }

    // 2. Parse the event
    let event;

    try {
        event = JSON.parse(rawBody.toString('utf8'));
    } catch (err) {
        const error = new Error('Invalid webhook body');
        error.statusCode = 400;
        throw error;
    }

    // 3. Only captured payments change anything
    if (event.event !== 'payment.captured') {
        return { processed: false, reason: 'event_ignored', event: event.event };
    }

    const payment = event.payload?.payment?.entity;

    if (!payment?.id || !payment?.order_id || !Number.isInteger(payment?.amount)) {
        const error = new Error('Webhook payload is missing payment details');
        error.statusCode = 400;
        throw error;
    }

    // 4. Apply it. The procedure is idempotent, so a repeated event is harmless
    try {
        const order = await markOrderPaidByProvider(payment.order_id, payment.id, payment.amount);

        return { processed: true, order_id: order.order_id, status: order.status };
    } catch (err) {
        const skipReason = WEBHOOK_SKIP_REASONS.find((key) => err.sqlMessage?.includes(key));

        if (skipReason) {
            // Money was captured, but the order can't take it. Someone must check it for a refund
            console.error('[razorpay webhook] not applied', {
                reason: skipReason,
                payment_id: payment.id,
                order_id: payment.order_id,
                amount: payment.amount
            });

            return { processed: false, reason: skipReason.toLowerCase() };
        }

        // Same payment ID recorded for another order: never fixed by retrying
        if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage?.includes('uq_payments_provider_payment')) {
            console.error('[razorpay webhook] payment already recorded elsewhere', payment.id);

            return { processed: false, reason: 'payment_already_recorded' };
        }

        // Anything else is unexpected: let the error reach the controller, so Razorpay retries
        throw err;
    }
};

export const listOrdersService = async (userId, { page, limit }) => {
    const offset = (page - 1) * limit;

    const { total, items } = await listOrders(userId, limit, offset);

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
};

export const listAllOrdersService = async ({ page, limit, status, search }) => {
    const offset = (page - 1) * limit;

    const { total, items } = await listAllOrders({ status, search, limit, offset });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
};

export const getOrderDetailService = async (userId, orderId) => {
    const { order, items, payment } = await getOrderDetail(userId, orderId);

    // Missing and someone else's orders return the same response
    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    return {
        ...order,
        items,
        payment
    };
};