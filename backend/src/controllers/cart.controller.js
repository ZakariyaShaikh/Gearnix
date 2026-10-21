import {
    getCartService,
    addCartItemService,
    updateCartItemService,
    removeCartItemService
} from '../services/cart.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const getCart = async (req, res) => {
    try {
        const cart = await getCartService(req.user.user_id);

        return res.status(200).json({
            success: true,
            message: 'Cart fetched successfully',
            data: cart
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const addCartItem = async (req, res) => {
    try {
        const item = await addCartItemService(req.user.user_id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Item added to cart',
            data: item
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const item = await updateCartItemService(
            req.user.user_id,
            req.params.productId,
            req.body.quantity
        );

        return res.status(200).json({
            success: true,
            message: 'Cart item updated',
            data: item
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const result = await removeCartItemService(req.user.user_id, req.params.productId);

        return res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};