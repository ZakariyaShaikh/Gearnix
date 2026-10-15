DELIMITER $$

CREATE PROCEDURE sp_find_user_profile(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN

    SELECT
        user_id,
        role_id,
        username,
        email,
        profile_image,
        status,
        is_email_verified,
        created_at,
        updated_at,
        deleted_at
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;

END $$

DELIMITER ;