DROP PROCEDURE IF EXISTS sp_get_account_deletion_info;

DELIMITER $$

CREATE PROCEDURE sp_get_account_deletion_info(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        u.user_id,
        u.password_hash,
        r.is_system_role,
        (
            SELECT COUNT(*)
            FROM users o
            WHERE o.role_id = u.role_id
              AND o.user_id <> u.user_id
              AND o.deleted_at IS NULL
              AND o.status = 'active'
        ) AS other_active_holders
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.user_id = p_user_id
      AND u.deleted_at IS NULL
    LIMIT 1;
END$$

DELIMITER ;