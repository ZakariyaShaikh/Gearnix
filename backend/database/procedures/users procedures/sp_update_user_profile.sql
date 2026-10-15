DROP PROCEDURE IF EXISTS sp_update_user_profile;

DELIMITER $$

CREATE PROCEDURE sp_update_user_profile(
    IN p_user_id BIGINT UNSIGNED,
    IN p_username VARCHAR(50)
)
BEGIN
    UPDATE users
    SET username = p_username,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    -- Return the fresh profile (same columns as sp_get_user_profile)
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.profile_image,
        u.status,
        u.is_email_verified,
        u.created_at,
        u.updated_at,
        r.role_id,
        r.role_name
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.user_id = p_user_id
      AND u.deleted_at IS NULL
    LIMIT 1;
END$$

DELIMITER ;