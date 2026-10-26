DROP PROCEDURE IF EXISTS sp_mark_order_paid_by_provider;

DELIMITER $$

CREATE PROCEDURE sp_mark_order_paid_by_provider(
    IN p_provider_order_id VARCHAR(100),
    IN p_provider_payment_id VARCHAR(100),
    IN p_amount_paise INT UNSIGNED
)
BEGIN
    DECLARE v_payment_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_order_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_expected_paise INT UNSIGNED DEFAULT NULL;
    DECLARE v_status VARCHAR(30) DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Find the payment we started for this Razorpay order, and lock it
    SELECT payment_id, order_id, amount_paise
    INTO v_payment_id, v_order_id, v_expected_paise
    FROM payments
    WHERE provider_order_id = p_provider_order_id
    FOR UPDATE;

    IF v_payment_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PAYMENT_NOT_FOUND';
    END IF;

    -- The amount Razorpay captured must be exactly what we stored
    IF v_expected_paise <> p_amount_paise THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'AMOUNT_MISMATCH';
    END IF;

    -- Lock the order, then check its state
    SELECT status
    INTO v_status
    FROM orders
    WHERE order_id = v_order_id
    FOR UPDATE;

    -- Cancelled orders have released their stock, so they can't become paid
    IF v_status NOT IN ('pending_payment', 'paid') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_PAYABLE';
    END IF;

    -- Idempotent: an order that is already paid is left as it is
    IF v_status = 'pending_payment' THEN
        UPDATE orders
        SET status = 'paid',
            paid_at = NOW(),
            updated_at = NOW()
        WHERE order_id = v_order_id;

        UPDATE payments
        SET status = 'paid',
            provider_payment_id = p_provider_payment_id
        WHERE payment_id = v_payment_id;
    END IF;

    COMMIT;

    SELECT order_id, status
    FROM orders
    WHERE order_id = v_order_id;
END$$

DELIMITER ;