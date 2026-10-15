DELIMITER $$

CREATE PROCEDURE sp_invalidate_previous_otp(
    IN p_user_id BIGINT UNSIGNED,
    IN p_purpose VARCHAR(40)
)
BEGIN

    UPDATE otp_verifications
    SET invalidated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id
      AND purpose = p_purpose
      AND verified_at IS NULL
      AND invalidated_at IS NULL;

    SELECT
        otp_id,
        invalidated_at
    FROM otp_verifications
    WHERE user_id = p_user_id
      AND purpose = p_purpose
    ORDER BY otp_id DESC
    LIMIT 1;

END $$

DELIMITER ;