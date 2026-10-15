DROP PROCEDURE IF EXISTS sp_update_user_profile_image;

DELIMITER $$

CREATE PROCEDURE sp_update_user_profile_image(
    IN p_user_id BIGINT UNSIGNED,
    IN p_profile_image VARCHAR(500)
)
BEGIN
    UPDATE users
    SET profile_image = p_profile_image,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    -- Return the fresh profile, same shape as the other profile procedures
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