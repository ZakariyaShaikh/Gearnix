DROP PROCEDURE IF EXISTS sp_attach_refund_provider_id;

DELIMITER $$

CREATE PROCEDURE sp_attach_refund_provider_id(
    IN p_refund_id BIGINT UNSIGNED,
    IN p_provider_refund_id VARCHAR(100)
)
BEGIN
    -- Sirf tab save karo jab abhi tak koi ID nahi hai (dobara call safe hai)
    UPDATE refunds
    SET provider_refund_id = p_provider_refund_id
    WHERE refund_id = p_refund_id
      AND provider_refund_id IS NULL;

    SELECT refund_id, provider_refund_id, status
    FROM refunds
    WHERE refund_id = p_refund_id;
END$$

DELIMITER ;