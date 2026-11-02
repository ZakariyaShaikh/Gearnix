DROP PROCEDURE IF EXISTS sp_mark_refund_processed;

DELIMITER $$

CREATE PROCEDURE sp_mark_refund_processed(
    IN p_provider_refund_id VARCHAR(100),
    IN p_amount_paise INT UNSIGNED
)
BEGIN
    DECLARE v_refund_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_order_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_expected INT UNSIGNED DEFAULT NULL;
    DECLARE v_refund_status VARCHAR(20) DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT refund_id, order_id, amount_paise, status
    INTO v_refund_id, v_order_id, v_expected, v_refund_status
    FROM refunds
    WHERE provider_refund_id = p_provider_refund_id
    FOR UPDATE;

    IF v_refund_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'REFUND_NOT_FOUND';
    END IF;

    -- Razorpay ne jo amount refund kiya, wo hamare record se match hona chahiye
    IF v_expected <> p_amount_paise THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'AMOUNT_MISMATCH';
    END IF;

    -- Idempotent: already processed hai to kuch nahi karna
    IF v_refund_status = 'processed' THEN
        COMMIT;
    ELSE
        UPDATE refunds
        SET status = 'processed',
            processed_at = NOW()
        WHERE refund_id = v_refund_id;

        UPDATE orders
        SET status = 'refunded',
            updated_at = NOW()
        WHERE order_id = v_order_id
          AND status = 'refund_pending';

        COMMIT;
    END IF;

    SELECT order_id, status
    FROM orders
    WHERE order_id = v_order_id;
END$$

DELIMITER ;