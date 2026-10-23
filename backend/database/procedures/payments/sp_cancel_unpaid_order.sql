DROP PROCEDURE IF EXISTS sp_cancel_unpaid_order;

DELIMITER $$

CREATE PROCEDURE sp_cancel_unpaid_order(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;

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

    -- Paid orders need a refund, and cancelled ones are already done
    IF v_status <> 'pending_payment' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ORDER_NOT_CANCELLABLE';
    END IF;

    -- Give the reserved stock back
    UPDATE products p
    INNER JOIN order_items oi ON oi.product_id = p.product_id
    SET p.stock_quantity = p.stock_quantity + oi.quantity
    WHERE oi.order_id = p_order_id;

    UPDATE orders
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE order_id = p_order_id;

    UPDATE payments
    SET status = 'failed'
    WHERE order_id = p_order_id
      AND status = 'created';

    COMMIT;

    SELECT order_id, order_number, status, total
    FROM orders
    WHERE order_id = p_order_id;
END$$

DELIMITER ;