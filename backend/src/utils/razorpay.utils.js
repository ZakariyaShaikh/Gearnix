import crypto from 'crypto';

// Razorpay signs "order_id|payment_id" with your key secret (HMAC-SHA256)
export const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
    const expected = crypto
        .createHmac('sha256', secret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(signature);

    // timingSafeEqual needs equal lengths, and it avoids leaking information through timing
    if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};