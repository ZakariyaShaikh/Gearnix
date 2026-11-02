DROP PROCEDURE IF EXISTS sp_request_order_refund;

DELIMITER $$

CREATE PROCEDURE sp_request_order_refund(
    IN p_order_id BIGINT UNSIGNED,
    IN p_user_id BIGINT UNSIGNED,
    IN p_requested_by BIGINT UNSIGNED,
    IN p_reason VARCHAR(255)
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;
    DECLARE v_payment_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_amount INT UNSIGNED DEFAULT NULL;
    DECLARE v_provider_payment_id VARCHAR(100) DEFAULT NULL;
    DECLARE v_refund_id BIGINT UNSIGNED DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- p_user_id NULL = admin request (any order). Otherwise the order must belong to this customer
    SELECT status
    INTO v_status
    FROM orders
    WHERE order_id = p_order_id
      AND (p_user_id IS NULL OR user_id = p_user_id)
    FOR UPDATE;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_FOUND';
    END IF;

    -- Only paid orders can be refunded. Unpaid ones use the normal cancel
    IF v_status <> 'paid' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_REFUNDABLE';
    END IF;

    SELECT payment_id, amount_paise, provider_payment_id
    INTO v_payment_id, v_amount, v_provider_payment_id
    FROM payments
    WHERE order_id = p_order_id
      AND status = 'paid'
    ORDER BY payment_id DESC
    LIMIT 1
    FOR UPDATE;

    IF v_payment_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PAYMENT_NOT_FOUND';
    END IF;

    IF EXISTS (SELECT 1 FROM refunds WHERE payment_id = v_payment_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'REFUND_ALREADY_EXISTS';
    END IF;

    -- Stock wapas: order cancel hone par items dobara bikne layak hain
    UPDATE products p
    INNER JOIN order_items oi ON oi.product_id = p.product_id
    SET p.stock_quantity = p.stock_quantity + oi.quantity
    WHERE oi.order_id = p_order_id;

    UPDATE orders
    SET status = 'refund_pending',
        updated_at = NOW()
    WHERE order_id = p_order_id;

    -- Full refund only (v1)
    INSERT INTO refunds (order_id, payment_id, amount_paise, reason, requested_by)
    VALUES (p_order_id, v_payment_id, v_amount, p_reason, p_requested_by);

    SET v_refund_id = LAST_INSERT_ID();

    COMMIT;

    SELECT
        r.refund_id,
        r.order_id,
        r.payment_id,
        r.amount_paise,
        r.status,
        p.provider_payment_id
    FROM refunds r
    INNER JOIN payments p ON p.payment_id = r.payment_id
    WHERE r.refund_id = v_refund_id;
END$$

DELIMITER ;