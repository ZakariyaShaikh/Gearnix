DROP PROCEDURE IF EXISTS sp_attach_payment;

DELIMITER $$

CREATE PROCEDURE sp_attach_payment(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED,
    IN p_provider_order_id VARCHAR(100),
    IN p_amount_paise INT UNSIGNED
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;
    DECLARE v_total DECIMAL(10,2) DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the order, and only accept it if it belongs to this user
    SELECT status, total
    INTO v_status, v_total
    FROM orders
    WHERE order_id = p_order_id
      AND user_id = p_user_id
    FOR UPDATE;

    IF v_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_FOUND';
    END IF;

    IF v_status <> 'pending_payment' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_PAYABLE';
    END IF;

    -- The amount must be exactly the order total, converted to paise
    IF p_amount_paise <> ROUND(v_total * 100) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'AMOUNT_MISMATCH';
    END IF;

    INSERT INTO payments (order_id, provider_order_id, amount_paise)
    VALUES (p_order_id, p_provider_order_id, p_amount_paise);

    COMMIT;

    SELECT payment_id, order_id, provider_order_id, amount_paise, status
    FROM payments
    WHERE provider_order_id = p_provider_order_id;
END$$

DELIMITER ;