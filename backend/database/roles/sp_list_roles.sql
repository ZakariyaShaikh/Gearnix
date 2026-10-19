DROP PROCEDURE IF EXISTS sp_list_roles;

DELIMITER $$

CREATE PROCEDURE sp_list_roles()
BEGIN
    -- Result set 1: every role, with how many active users hold it
    SELECT
        r.role_id,
        r.role_name,
        r.description,
        r.is_system_role,
        r.is_active,
        r.is_locked,
        (
            SELECT COUNT(*)
            FROM users u
            WHERE u.role_id = r.role_id
              AND u.deleted_at IS NULL
        ) AS user_count
    FROM roles r
    ORDER BY r.role_id;

    -- Result set 2: each role's active permissions
    SELECT
        rp.role_id,
        p.permission_id,
        p.permission_key,
        p.permission_name,
        p.module
    FROM role_permissions rp
    INNER JOIN permissions p ON p.permission_id = rp.permission_id
    WHERE p.is_active = 1
    ORDER BY rp.role_id, p.permission_key;
END$$

DELIMITER ;