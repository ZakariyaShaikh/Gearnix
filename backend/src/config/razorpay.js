import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

if (!keyId || !keySecret || !webhookSecret) {
    throw new Error(
        'RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET must be set in .env'
    );
}

export const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
});

// Safe to send to the frontend. The secrets are never exported to routes or responses
export const RAZORPAY_KEY_ID = keyId;
export const RAZORPAY_KEY_SECRET = keySecret;
export const RAZORPAY_WEBHOOK_SECRET = webhookSecret;