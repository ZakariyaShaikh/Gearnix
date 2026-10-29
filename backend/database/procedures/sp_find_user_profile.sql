DROP PROCEDURE IF EXISTS sp_find_user_profile;

DELIMITER $$

CREATE PROCEDURE sp_find_user_profile(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN

    SELECT
        u.user_id,
        u.role_id,
        r.role_name,
        u.username,
        u.email,
        u.profile_image,
        u.status,
        u.is_email_verified,
        u.created_at,
        u.updated_at,
        u.deleted_at
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.user_id = p_user_id
      AND u.deleted_at IS NULL
    LIMIT 1;

END $$

DELIMITER ;
