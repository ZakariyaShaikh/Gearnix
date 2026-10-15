DELIMITER $$

CREATE PROCEDURE sp_create_otp(
    IN p_user_id BIGINT UNSIGNED,
    IN p_purpose VARCHAR(40),
    IN p_otp_hash VARCHAR(255),
    IN p_expires_at DATETIME,
    IN p_max_attempts INT UNSIGNED
)
BEGIN

    INSERT INTO otp_verifications (
        user_id,
        purpose,
        otp_hash,
        expires_at,
        attempt_count,
        max_attempts,
        created_at
    )
    VALUES (
        p_user_id,
        p_purpose,
        p_otp_hash,
        p_expires_at,
        0,
        p_max_attempts,
        CURRENT_TIMESTAMP
    );

    SELECT
        otp_id,
        user_id,
        purpose,
        expires_at,
        attempt_count,
        max_attempts,
        created_at
    FROM otp_verifications
    WHERE otp_id = LAST_INSERT_ID();

END $$

DELIMITER ;