import { getCart, addCartItem, updateCartItem, removeCartItem } from '../models/cart.model.js';

// Maps the procedure's SIGNAL messages to HTTP responses
const CART_ERRORS = {
    PRODUCT_UNAVAILABLE: { statusCode: 404, message: 'This product is not available' },
    INSUFFICIENT_STOCK: {
        statusCode: 409,
        message: 'Not enough stock for the requested quantity'
    },
    CART_ITEM_NOT_FOUND: { statusCode: 404, message: 'This product is not in your cart' },
    QUANTITY_MUST_BE_POSITIVE: { statusCode: 400, message: 'Quantity must be at least 1' }
};

const toCartError = (err) => {
    const key = Object.keys(CART_ERRORS).find((k) => err.sqlMessage?.includes(k));

    if (!key) {
        return err;
    }

    const error = new Error(CART_ERRORS[key].message);
    error.statusCode = CART_ERRORS[key].statusCode;
    return error;
};

export const getCartService = async (userId) => {
    return getCart(userId);
};

export const addCartItemService = async (userId, { product_id, quantity }) => {
    try {
        return await addCartItem(userId, product_id, quantity);
    } catch (err) {
        throw toCartError(err);
    }
};

export const updateCartItemService = async (userId, productId, quantity) => {
    try {
        return await updateCartItem(userId, productId, quantity);
    } catch (err) {
        throw toCartError(err);
    }
};

export const removeCartItemService = async (userId, productId) => {
    try {
        return await removeCartItem(userId, productId);
    } catch (err) {
        throw toCartError(err);
    }
};