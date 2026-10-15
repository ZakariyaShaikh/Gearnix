DELIMITER $$

CREATE PROCEDURE sp_find_user_by_email(
    IN p_email VARCHAR(255)
)
BEGIN

    SELECT
        user_id,
        role_id,
        username,
        email,
        password_hash,
        profile_image,
        status,
        is_email_verified,
        created_at,
        updated_at,
        deleted_at
    FROM users
    WHERE email = p_email
    LIMIT 1;

END $$

DELIMITER ;