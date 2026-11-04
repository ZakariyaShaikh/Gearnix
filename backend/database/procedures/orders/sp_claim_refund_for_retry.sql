DROP PROCEDURE IF EXISTS sp_claim_refund_for_retry;

DELIMITER $$

CREATE PROCEDURE sp_claim_refund_for_retry(
    IN p_refund_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_claimed INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Atomic claim: sirf ek caller refund ko "claimed" kar sakta hai
    UPDATE refunds r
    INNER JOIN orders o ON o.order_id = r.order_id
    SET r.provider_refund_id = CONCAT('claim_', r.refund_id)
    WHERE r.refund_id = p_refund_id
      AND r.status = 'created'
      AND r.provider_refund_id IS NULL
      AND o.status = 'refund_pending';

    SET v_claimed = ROW_COUNT();

    IF v_claimed = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'REFUND_NOT_RETRYABLE';
    END IF;

    COMMIT;

    -- Razorpay call ke liye details
    SELECT
        r.refund_id,
        r.order_id,
        r.amount_paise,
        p.provider_payment_id
    FROM refunds r
    INNER JOIN payments p ON p.payment_id = r.payment_id
    WHERE r.refund_id = p_refund_id;
END$$

DELIMITER ;