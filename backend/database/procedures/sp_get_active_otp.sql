DROP PROCEDURE IF EXISTS sp_get_active_otp;

DELIMITER $$

CREATE PROCEDURE sp_get_active_otp(
    IN p_user_id BIGINT UNSIGNED,
    IN p_purpose VARCHAR(40)
)
BEGIN

    SELECT
        otp_id,
        user_id,
        purpose,
        otp_hash,
        expires_at,
        attempt_count,
        max_attempts,
        verified_at,
        invalidated_at,
        created_at
    FROM otp_verifications
    WHERE user_id = p_user_id
      AND purpose = p_purpose
      AND verified_at IS NULL
      AND invalidated_at IS NULL
      AND expires_at > CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1;

END $$

DELIMITER ;