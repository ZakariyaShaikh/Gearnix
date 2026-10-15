DROP PROCEDURE IF EXISTS sp_check_user_permission;

DELIMITER $$

CREATE PROCEDURE sp_check_user_permission(
    IN p_role_id BIGINT UNSIGNED,
    IN p_permission_key VARCHAR(100)
)
BEGIN

    SELECT
        rp.role_id,
        p.permission_id,
        p.permission_key,
        p.permission_name
    FROM role_permissions rp
    INNER JOIN permissions p
        ON rp.permission_id = p.permission_id
    WHERE rp.role_id = p_role_id
      AND p.permission_key = p_permission_key
      AND p.is_active = 1
    LIMIT 1;

END $$

DELIMITER ;