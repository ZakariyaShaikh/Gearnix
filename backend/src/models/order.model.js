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

export const getOrderPayment = async (userId, orderId, providerOrderId) => {
    const [rows] = await pool.query('CALL sp_get_order_payment(?, ?, ?)', [
        userId,
        orderId,
        providerOrderId
    ]);

    return rows[0][0] || null;
};

export const markOrderPaidByProvider = async (providerOrderId, providerPaymentId, amountPaise) => {
    const [rows] = await pool.query('CALL sp_mark_order_paid_by_provider(?, ?, ?)', [
        providerOrderId,
        providerPaymentId,
        amountPaise
    ]);

    return rows[0][0];
};

export const listOrders = async (userId, limit, offset) => {
    const [rows] = await pool.query('CALL sp_list_orders(?, ?, ?)', [userId, limit, offset]);

    // rows[0] = the count, rows[1] = the page of orders
    return {
        total: Number(rows[0][0].total),
        items: rows[1]
    };
};

export const listAllOrders = async ({ status, search, limit, offset }) => {
    const [rows] = await pool.query('CALL sp_list_all_orders(?, ?, ?, ?)', [
        status,
        search,
        limit,
        offset
    ]);

    // rows[0] = the count, rows[1] = the page of orders
    return {
        total: Number(rows[0][0].total),
        items: rows[1]
    };
};

export const getOrderDetail = async (userId, orderId) => {
    const [rows] = await pool.query('CALL sp_get_order_detail(?, ?)', [userId, orderId]);

    // rows[0] = the order, rows[1] = its items, rows[2] = the latest payment
    return {
        order: rows[0][0] || null,
        items: rows[1],
        payment: rows[2][0] || null
    };
};

export const findStaleOrderIds = async (olderThanMinutes) => {
    // A plain read: it only finds candidates. The procedure re-checks each one under a lock
    const [rows] = await pool.query(
        "SELECT order_id FROM orders WHERE status = 'pending_payment' AND created_at < NOW() - INTERVAL ? MINUTE ORDER BY created_at LIMIT 100",
        [olderThanMinutes]
    );

    return rows.map((row) => row.order_id);
};

export const cancelStaleOrder = async (orderId, olderThanMinutes) => {
    const [rows] = await pool.query('CALL sp_cancel_stale_order(?, ?)', [
        orderId,
        olderThanMinutes
    ]);

    return Number(rows[0][0].cancelled) === 1;
};

export const requestOrderRefund = async ({ orderId, userId, requestedBy, reason }) => {
    const [rows] = await pool.query('CALL sp_request_order_refund(?, ?, ?, ?)', [
        orderId,
        userId ?? null,
        requestedBy,
        reason ?? null
    ]);

    return rows[0][0];
};

export const attachRefundProviderId = async (refundId, providerRefundId) => {
    const [rows] = await pool.query('CALL sp_attach_refund_provider_id(?, ?)', [
        refundId,
        providerRefundId
    ]);

    return rows[0][0];
};