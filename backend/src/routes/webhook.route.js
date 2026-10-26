import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhook.controller.js';

const router = express.Router();

// express.raw() keeps the body as bytes, so the signature can be checked
router.post(
    '/razorpay',
    express.raw({ type: 'application/json' }),
    handleRazorpayWebhook
);

export default router;