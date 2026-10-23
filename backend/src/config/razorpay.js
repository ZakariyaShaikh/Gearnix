import Razorpay from 'razorpay';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in .env');
}

export const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
});

// Safe to send to the frontend. The secret is never exported
export const RAZORPAY_KEY_ID = keyId;
export const RAZORPAY_KEY_SECRET = keySecret;