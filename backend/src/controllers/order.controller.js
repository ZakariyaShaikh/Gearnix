import {
    checkoutService,
    verifyPaymentService,
    cancelOrderService,
    listOrdersService,
    listAllOrdersService,
    getOrderDetailService,
    requestRefundService
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

export const listOrders = async (req, res) => {
    try {
        const result = await listOrdersService(req.user.user_id, req.listQuery);

        return res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const listAllOrders = async (req, res) => {
    try {
        const result = await listAllOrdersService(req.listQuery);

        return res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getOrder = async (req, res) => {
    try {
        // Already validated as a positive integer by validateOrderIdParam
        const order = await getOrderDetailService(req.user.user_id, req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Order fetched successfully',
            data: order
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const requestRefund = async (req, res) => {
    try {
        // Customer: sirf apna order. userId pass hota hai, isliye ownership check hoga
        const result = await requestRefundService({
            orderId: req.params.id,
            userId: req.user.user_id,
            requestedBy: req.user.user_id,
            reason: req.body.reason
        });

        return res.status(200).json({
            success: true,
            message: 'Refund requested',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const requestRefundAdmin = async (req, res) => {
    try {
        // Admin: koi bhi order. userId null hai, isliye ownership check skip hota hai
        const result = await requestRefundService({
            orderId: req.params.id,
            userId: null,
            requestedBy: req.user.user_id,
            reason: req.body.reason
        });

        return res.status(200).json({
            success: true,
            message: 'Refund requested by admin',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};