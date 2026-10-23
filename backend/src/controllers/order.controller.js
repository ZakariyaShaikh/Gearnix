import {
    checkoutService,
    verifyPaymentService,
    cancelOrderService
} from '../services/order.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const checkout = async (req, res) => {
    try {
        const result = await checkoutService(req.user.user_id, req.body.address_id);

        return res.status(201).json({
            success: true,
            message: 'Order created. Complete the payment to confirm it',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const order = await verifyPaymentService(req.user.user_id, req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Payment verified and order confirmed',
            data: order
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await cancelOrderService(req.user.user_id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Order cancelled and stock released',
            data: order
        });
    } catch (error) {
        return sendError(res, error);
    }
};