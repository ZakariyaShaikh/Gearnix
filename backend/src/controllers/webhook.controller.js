import { handleRazorpayWebhookService } from '../services/order.service.js';

export const handleRazorpayWebhook = async (req, res) => {
    try {
        // req.body is the raw Buffer, because the route uses express.raw()
        const result = await handleRazorpayWebhookService(
            req.body,
            req.headers['x-razorpay-signature']
        );

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error('[razorpay webhook] unexpected error', error);

        // 500 makes Razorpay retry, which is what we want for temporary failures
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};