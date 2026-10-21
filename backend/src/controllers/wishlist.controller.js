import {
    getWishlistService,
    addWishlistItemService,
    removeWishlistItemService
} from '../services/wishlist.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const getWishlist = async (req, res) => {
    try {
        const wishlist = await getWishlistService(req.user.user_id);

        return res.status(200).json({
            success: true,
            message: 'Wishlist fetched successfully',
            data: wishlist
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const addWishlistItem = async (req, res) => {
    try {
        const item = await addWishlistItemService(req.user.user_id, req.body.product_id);

        return res.status(200).json({
            success: true,
            message: 'Saved to wishlist',
            data: item
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const removeWishlistItem = async (req, res) => {
    try {
        const result = await removeWishlistItemService(req.user.user_id, req.params.productId);

        return res.status(200).json({
            success: true,
            message: 'Removed from wishlist',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};