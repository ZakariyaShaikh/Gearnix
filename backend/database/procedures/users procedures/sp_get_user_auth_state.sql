DROP PROCEDURE IF EXISTS sp_get_user_auth_state;

DELIMITER $$

CREATE PROCEDURE sp_get_user_auth_state(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        u.user_id,
        u.status,
        r.role_id,
        r.role_name
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.user_id = p_user_id
      AND u.deleted_at IS NULL
    LIMIT 1;
END$$

DELIMITER ;