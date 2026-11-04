DROP PROCEDURE IF EXISTS sp_get_latest_refund;

DELIMITER $$

CREATE PROCEDURE sp_get_latest_refund(
    IN p_order_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        refund_id,
        order_id,
        status,
        amount_paise,
        provider_refund_id,
        failure_reason,
        reason,
        created_at,
        processed_at
    FROM refunds
    WHERE order_id = p_order_id
    ORDER BY refund_id DESC
    LIMIT 1;
END$$

DELIMITER ;
