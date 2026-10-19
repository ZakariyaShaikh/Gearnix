DROP PROCEDURE IF EXISTS sp_replace_role_permissions;

DELIMITER $$

CREATE PROCEDURE sp_replace_role_permissions(
    IN p_role_id BIGINT UNSIGNED,
    IN p_permission_keys JSON
)
BEGIN
    DECLARE v_locked TINYINT DEFAULT NULL;
    DECLARE v_requested INT DEFAULT 0;
    DECLARE v_found INT DEFAULT 0;
    DECLARE v_old_manage INT DEFAULT 0;
    DECLARE v_new_manage INT DEFAULT 0;
    DECLARE v_other_managers INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Guard 1: the role must exist. FOR UPDATE locks it until COMMIT
    SELECT is_locked
    INTO v_locked
    FROM roles
    WHERE role_id = p_role_id
    FOR UPDATE;

    IF v_locked IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ROLE_NOT_FOUND';
    END IF;

    -- Guard 2: locked roles (Super Admin) cannot be edited
    IF v_locked = 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ROLE_LOCKED';
    END IF;

    -- Guard 3: every requested key must be a real, active permission
    SET v_requested = (
        SELECT COUNT(DISTINCT jt.permission_key)
        FROM JSON_TABLE(
            p_permission_keys,
            '$[*]' COLUMNS (permission_key VARCHAR(100) PATH '$')
        ) AS jt
    );

    SET v_found = (
        SELECT COUNT(DISTINCT p.permission_id)
        FROM JSON_TABLE(
            p_permission_keys,
            '$[*]' COLUMNS (permission_key VARCHAR(100) PATH '$')
        ) AS jt
        INNER JOIN permissions p
            ON p.permission_key = jt.permission_key
           AND p.is_active = 1
    );

    IF v_found <> v_requested THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'UNKNOWN_PERMISSION';
    END IF;

    -- Guard 4: don't remove user.update_role if no other active user could still manage roles
    SET v_old_manage = (
        SELECT COUNT(*)
        FROM role_permissions rp
        INNER JOIN permissions p ON p.permission_id = rp.permission_id
        WHERE rp.role_id = p_role_id
          AND p.permission_key = 'user.update_role'
    );

    SET v_new_manage = (
        SELECT COUNT(*)
        FROM JSON_TABLE(
            p_permission_keys,
            '$[*]' COLUMNS (permission_key VARCHAR(100) PATH '$')
        ) AS jt
        WHERE jt.permission_key = 'user.update_role'
    );

    IF v_old_manage > 0 AND v_new_manage = 0 THEN
        SET v_other_managers = (
            SELECT COUNT(*)
            FROM users u
            INNER JOIN role_permissions rp ON rp.role_id = u.role_id
            INNER JOIN permissions p ON p.permission_id = rp.permission_id
            WHERE p.permission_key = 'user.update_role'
              AND u.role_id <> p_role_id
              AND u.deleted_at IS NULL
              AND u.status = 'active'
        );

        IF v_other_managers = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'LAST_ROLE_MANAGER';
        END IF;
    END IF;

    -- All guards passed: replace the permission set
    DELETE FROM role_permissions
    WHERE role_id = p_role_id;

    INSERT INTO role_permissions (role_id, permission_id)
    SELECT DISTINCT p_role_id, p.permission_id
    FROM JSON_TABLE(
        p_permission_keys,
        '$[*]' COLUMNS (permission_key VARCHAR(100) PATH '$')
    ) AS jt
    INNER JOIN permissions p
        ON p.permission_key = jt.permission_key
       AND p.is_active = 1;

    COMMIT;

    -- Result set 1: the role
    SELECT role_id, role_name, is_locked
    FROM roles
    WHERE role_id = p_role_id;

    -- Result set 2: its new permissions
    SELECT p.permission_id, p.permission_key, p.permission_name, p.module
    FROM role_permissions rp
    INNER JOIN permissions p ON p.permission_id = rp.permission_id
    WHERE rp.role_id = p_role_id
    ORDER BY p.permission_key;
END$$

DELIMITER ;