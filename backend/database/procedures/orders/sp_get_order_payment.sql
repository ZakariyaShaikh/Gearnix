DROP PROCEDURE IF EXISTS sp_get_order_payment;

DELIMITER $$

CREATE PROCEDURE sp_get_order_payment(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED,
    IN p_provider_order_id VARCHAR(100)
)
BEGIN
    -- Only returns a payment that belongs to this user's order
    SELECT
        p.payment_id,
        p.order_id,
        p.provider_order_id,
        p.amount_paise,
        p.status
    FROM payments p
    INNER JOIN orders o ON o.order_id = p.order_id
    WHERE o.order_id = p_order_id
      AND o.user_id = p_user_id
      AND p.provider_order_id = p_provider_order_id
    LIMIT 1;
END$$

DELIMITER ;