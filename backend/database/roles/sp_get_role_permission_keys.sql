DROP PROCEDURE IF EXISTS sp_get_role_permission_keys;

DELIMITER $$

CREATE PROCEDURE sp_get_role_permission_keys(
    IN p_role_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        p.permission_key,
        p.module
    FROM role_permissions rp
    INNER JOIN permissions p ON p.permission_id = rp.permission_id
    WHERE rp.role_id = p_role_id
      AND p.is_active = 1
    ORDER BY p.permission_key;
END$$

DELIMITER ;