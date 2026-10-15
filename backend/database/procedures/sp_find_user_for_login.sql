DROP PROCEDURE IF EXISTS sp_find_user_for_login;

DELIMITER $$

CREATE PROCEDURE sp_find_user_for_login(
    IN p_email VARCHAR(255)
)
BEGIN

    SELECT
        u.user_id,
        u.role_id,
        u.username,
        u.email,
        u.password_hash,
        u.profile_image,
        u.status,
        u.is_email_verified,
        r.role_name
    FROM users u
    INNER JOIN roles r
        ON u.role_id = r.role_id
    WHERE u.email = p_email
      AND u.deleted_at IS NULL
    LIMIT 1;

END $$

DELIMITER ;