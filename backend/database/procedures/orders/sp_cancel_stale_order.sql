DROP PROCEDURE IF EXISTS sp_cancel_stale_order;

DELIMITER $$

CREATE PROCEDURE sp_cancel_stale_order(
    IN p_order_id BIGINT UNSIGNED,
    IN p_older_than_minutes INT UNSIGNED
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;
    DECLARE v_cancelled INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the order and re-check its state and age, both inside the lock.
    -- The job's earlier read is only a hint, so this check is the one that counts
    SELECT status
    INTO v_status
    FROM orders
    WHERE order_id = p_order_id
      AND status = 'pending_payment'
      AND created_at < NOW() - INTERVAL p_older_than_minutes MINUTE
    FOR UPDATE;

    IF v_status IS NOT NULL THEN
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

        SET v_cancelled = 1;
    END IF;

    COMMIT;

    -- 1 if this call cancelled the order, 0 if it was left alone
    SELECT v_cancelled AS cancelled;
END$$

DELIMITER ;