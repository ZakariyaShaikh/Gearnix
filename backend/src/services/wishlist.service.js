import { getWishlist, addWishlistItem, removeWishlistItem } from '../models/wishlist.model.js';

// Maps the procedure's SIGNAL messages to HTTP responses
const WISHLIST_ERRORS = {
    PRODUCT_UNAVAILABLE: { statusCode: 404, message: 'This product is not available' },
    WISHLIST_ITEM_NOT_FOUND: {
        statusCode: 404,
        message: 'This product is not in your wishlist'
    }
};

const toWishlistError = (err) => {
    const key = Object.keys(WISHLIST_ERRORS).find((k) => err.sqlMessage?.includes(k));

    if (!key) {
        return err;
    }

    const error = new Error(WISHLIST_ERRORS[key].message);
    error.statusCode = WISHLIST_ERRORS[key].statusCode;
    return error;
};

export const getWishlistService = async (userId) => {
    const items = await getWishlist(userId);

    return {
        items,
        total_items: items.length
    };
};

export const addWishlistItemService = async (userId, productId) => {
    try {
        return await addWishlistItem(userId, productId);
    } catch (err) {
        throw toWishlistError(err);
    }
};

export const removeWishlistItemService = async (userId, productId) => {
    try {
        return await removeWishlistItem(userId, productId);
    } catch (err) {
        throw toWishlistError(err);
    }
};