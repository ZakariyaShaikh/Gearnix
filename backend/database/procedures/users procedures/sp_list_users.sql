DROP PROCEDURE IF EXISTS sp_list_users;

DELIMITER $$

CREATE PROCEDURE sp_list_users(
    IN p_role_id BIGINT UNSIGNED,
    IN p_search VARCHAR(100),
    IN p_limit INT UNSIGNED,
    IN p_offset INT UNSIGNED
)
BEGIN
    -- Result set 1: total matching users (for pagination)
    SELECT COUNT(*) AS total
    FROM users u
    WHERE u.deleted_at IS NULL
      AND (p_role_id IS NULL OR u.role_id = p_role_id)
      AND (p_search IS NULL
           OR LOCATE(LOWER(p_search), LOWER(u.email)) > 0
           OR LOCATE(LOWER(p_search), LOWER(u.username)) > 0);

    -- Result set 2: the current page of users, with their role
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.status,
        u.is_email_verified,
        u.created_at,
        r.role_id,
        r.role_name
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.deleted_at IS NULL
      AND (p_role_id IS NULL OR u.role_id = p_role_id)
      AND (p_search IS NULL
           OR LOCATE(LOWER(p_search), LOWER(u.email)) > 0
           OR LOCATE(LOWER(p_search), LOWER(u.username)) > 0)
    ORDER BY u.created_at DESC, u.user_id DESC
    LIMIT p_limit OFFSET p_offset;
END$$

DELIMITER ;