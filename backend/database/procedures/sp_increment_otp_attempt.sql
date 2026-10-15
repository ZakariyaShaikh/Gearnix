DELIMITER $$

CREATE PROCEDURE sp_increment_otp_attempt(
    IN p_otp_id BIGINT UNSIGNED
)
BEGIN

    UPDATE otp_verifications
    SET attempt_count = attempt_count + 1
    WHERE otp_id = p_otp_id
      AND verified_at IS NULL;

    SELECT
        otp_id,
        attempt_count,
        max_attempts
    FROM otp_verifications
    WHERE otp_id = p_otp_id;

END $$

DELIMITER ;