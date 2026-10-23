import pool from '../config/db.js';

export const checkoutCart = async (userId, addressId, orderNumber) => {
    const [rows] = await pool.query('CALL sp_checkout(?, ?, ?)', [
        userId,
        addressId,
        orderNumber
    ]);

    // rows[0] = the order, rows[1] = its items
    return {
        order: rows[0][0],
        items: rows[1]
    };
};

export const attachPayment = async (userId, orderId, providerOrderId, amountPaise) => {
    const [rows] = await pool.query('CALL sp_attach_payment(?, ?, ?, ?)', [
        userId,
        orderId,
        providerOrderId,
        amountPaise
    ]);

    return rows[0][0];
};

export const markOrderPaid = async (userId, orderId, providerOrderId, providerPaymentId) => {
    const [rows] = await pool.query('CALL sp_mark_order_paid(?, ?, ?, ?)', [
        userId,
        orderId,
        providerOrderId,
        providerPaymentId
    ]);

    return rows[0][0];
};

export const cancelUnpaidOrder = async (userId, orderId) => {
    const [rows] = await pool.query('CALL sp_cancel_unpaid_order(?, ?)', [userId, orderId]);

    return rows[0][0];
};