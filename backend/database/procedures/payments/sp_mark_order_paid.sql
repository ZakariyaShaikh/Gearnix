DROP PROCEDURE IF EXISTS sp_mark_order_paid;

DELIMITER $$

CREATE PROCEDURE sp_mark_order_paid(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED,
    IN p_provider_order_id VARCHAR(100),
    IN p_provider_payment_id VARCHAR(100)
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;
    DECLARE v_payment_id BIGINT UNSIGNED DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT status
    INTO v_status
    FROM orders
    WHERE order_id = p_order_id
      AND user_id = p_user_id
    FOR UPDATE;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_FOUND';
    END IF;

    -- Only unpaid or already-paid orders can be marked paid.
    -- Cancelled orders have released their stock, so they can't be paid
    IF v_status NOT IN ('pending_payment', 'paid') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_PAYABLE';
    END IF;

    -- The payment must match the Razorpay order that was created for this order
    SELECT payment_id
    INTO v_payment_id
    FROM payments
    WHERE order_id = p_order_id
      AND provider_order_id = p_provider_order_id
    FOR UPDATE;

    IF v_payment_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PAYMENT_NOT_FOUND';
    END IF;

    -- Idempotent: an order that is already paid is left as it is
    IF v_status = 'pending_payment' THEN
        UPDATE orders
        SET status = 'paid',
            paid_at = NOW(),
            updated_at = NOW()
        WHERE order_id = p_order_id;

        UPDATE payments
        SET status = 'paid',
            provider_payment_id = p_provider_payment_id
        WHERE payment_id = v_payment_id;
    END IF;

    COMMIT;

    SELECT order_id, order_number, status, total, paid_at
    FROM orders
    WHERE order_id = p_order_id;
END$$

DELIMITER ;