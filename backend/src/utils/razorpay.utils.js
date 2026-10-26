import crypto from 'crypto';

const safeEqual = (a, b) => {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);

    // timingSafeEqual needs equal lengths, and it avoids leaking information through timing
    if (bufferA.length !== bufferB.length) {
        return false;
    }

    return crypto.timingSafeEqual(bufferA, bufferB);
};

// Checkout payments: Razorpay signs "order_id|payment_id"
export const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
    const expected = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    return safeEqual(expected, signature);
};

// Webhooks: Razorpay signs the exact raw request body with the webhook secret
export const verifyWebhookSignature = ({ body, signature, secret }) => {
    if (!Buffer.isBuffer(body) || typeof signature !== 'string') {
        return false;
    }

    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    return safeEqual(expected, signature);
};