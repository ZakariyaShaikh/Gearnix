DROP PROCEDURE IF EXISTS sp_cancel_unpaid_order;

DELIMITER $$

CREATE PROCEDURE sp_cancel_unpaid_order(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED,
    IN p_is_admin TINYINT(1) DEFAULT 0
)
BEGIN
    DECLARE v_status VARCHAR(30) DEFAULT NULL;
    DECLARE v_user_is_super_admin TINYINT(1) DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Check if user is super admin
    SELECT COUNT(*) INTO v_user_is_super_admin
    FROM users u
    JOIN role_permissions rp ON rp.role_id = u.role_id
    JOIN roles r ON r.role_id = rp.role_id
    WHERE u.user_id = p_user_id
      AND r.role_name = 'Super Admin';

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Get order status, allowing admin to cancel any order
    IF p_is_admin = 1 THEN
        SELECT status INTO v_status
        FROM orders
        WHERE order_id = p_order_id
        FOR UPDATE;
    ELSE
        SELECT status INTO v_status
        FROM orders
        WHERE order_id = p_order_id
          AND user_id = p_user_id
        FOR UPDATE;
    END IF;

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