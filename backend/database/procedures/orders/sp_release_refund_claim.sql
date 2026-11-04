DROP PROCEDURE IF EXISTS sp_release_refund_claim;

DELIMITER $$

CREATE PROCEDURE sp_release_refund_claim(
    IN p_refund_id BIGINT UNSIGNED
)
BEGIN
    -- Razorpay call fail hone par claim hatao, taki retry dobara ho sake
    UPDATE refunds
    SET provider_refund_id = NULL
    WHERE refund_id = p_refund_id
      AND provider_refund_id = CONCAT('claim_', p_refund_id);

    SELECT ROW_COUNT() AS released;
END$$

DELIMITER ;