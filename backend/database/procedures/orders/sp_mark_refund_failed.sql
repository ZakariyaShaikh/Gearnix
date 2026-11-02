DROP PROCEDURE IF EXISTS sp_mark_refund_failed;

DELIMITER $$

CREATE PROCEDURE sp_mark_refund_failed(
    IN p_provider_refund_id VARCHAR(100),
    IN p_failure_reason VARCHAR(255)
)
BEGIN
    DECLARE v_refund_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_order_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_refund_status VARCHAR(20) DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT refund_id, order_id, status
    INTO v_refund_id, v_order_id, v_refund_status
    FROM refunds
    WHERE provider_refund_id = p_provider_refund_id
    FOR UPDATE;

    IF v_refund_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'REFUND_NOT_FOUND';
    END IF;

    -- Processed refund ko failed nahi kar sakte. Failed ko dobara failed karna safe hai
    IF v_refund_status = 'processed' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'REFUND_ALREADY_PROCESSED';
    END IF;

    UPDATE refunds
    SET status = 'failed',
        failure_reason = LEFT(p_failure_reason, 255)
    WHERE refund_id = v_refund_id;

    UPDATE orders
    SET status = 'refund_failed',
        updated_at = NOW()
    WHERE order_id = v_order_id
      AND status = 'refund_pending';

    COMMIT;

    SELECT order_id, status
    FROM orders
    WHERE order_id = v_order_id;
END$$

DELIMITER ;