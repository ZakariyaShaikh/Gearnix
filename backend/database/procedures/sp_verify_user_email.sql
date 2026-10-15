DELIMITER $$

CREATE PROCEDURE sp_verify_user_email(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN

    UPDATE users
    SET
        is_email_verified = 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id;

    SELECT
        user_id,
        email,
        is_email_verified
    FROM users
    WHERE user_id = p_user_id;

END $$

DELIMITER ;