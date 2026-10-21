import pool from '../config/db.js';

export const getWishlist = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_wishlist(?)', [userId]);

    // One result set: the saved products
    return rows[0];
};

export const addWishlistItem = async (userId, productId) => {
    const [rows] = await pool.query('CALL sp_add_wishlist_item(?, ?)', [
        userId,
        productId
    ]);

    return rows[0][0];
};

export const removeWishlistItem = async (userId, productId) => {
    const [rows] = await pool.query('CALL sp_remove_wishlist_item(?, ?)', [
        userId,
        productId
    ]);

    return rows[0][0];
};