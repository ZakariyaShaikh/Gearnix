import pool from '../config/db.js';

export const getCart = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_cart(?)', [userId]);

    // rows[0] = the cart lines, rows[1] = the totals (always one row)
    return {
        items: rows[0],
        summary: rows[1][0]
    };
};

export const addCartItem = async (userId, productId, quantity) => {
    const [rows] = await pool.query('CALL sp_add_cart_item(?, ?, ?)', [
        userId,
        productId,
        quantity
    ]);

    return rows[0][0];
};

export const updateCartItem = async (userId, productId, quantity) => {
    const [rows] = await pool.query('CALL sp_update_cart_item(?, ?, ?)', [
        userId,
        productId,
        quantity
    ]);

    return rows[0][0];
};

export const removeCartItem = async (userId, productId) => {
    const [rows] = await pool.query('CALL sp_remove_cart_item(?, ?)', [
        userId,
        productId
    ]);

    return rows[0][0];
};