DELIMITER $$

CREATE PROCEDURE sp_mark_otp_verified(
    IN p_otp_id BIGINT UNSIGNED
)
BEGIN

    UPDATE otp_verifications
    SET verified_at = CURRENT_TIMESTAMP
    WHERE otp_id = p_otp_id
      AND verified_at IS NULL;

    SELECT
        otp_id,
        user_id,
        purpose,
        verified_at
    FROM otp_verifications
    WHERE otp_id = p_otp_id;

END $$

DELIMITER ;