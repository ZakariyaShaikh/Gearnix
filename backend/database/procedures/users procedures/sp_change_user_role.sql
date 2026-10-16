DROP PROCEDURE IF EXISTS sp_change_user_role;

DELIMITER $$

CREATE PROCEDURE sp_change_user_role(
    IN p_target_user_id BIGINT UNSIGNED,
    IN p_new_role_id BIGINT UNSIGNED,
    IN p_changed_by BIGINT UNSIGNED,
    IN p_reason VARCHAR(255)
)
BEGIN
    DECLARE v_old_role_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_new_role_active TINYINT DEFAULT NULL;
    DECLARE v_old_can_manage INT DEFAULT 0;
    DECLARE v_new_can_manage INT DEFAULT 0;
    DECLARE v_other_managers INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Guard 1: nobody changes their own role
    IF p_target_user_id = p_changed_by THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'SELF_ROLE_CHANGE';
    END IF;

    START TRANSACTION;

    -- Guard 2: the target must exist. FOR UPDATE locks the row until COMMIT
    SELECT role_id
    INTO v_old_role_id
    FROM users
    WHERE user_id = p_target_user_id
      AND deleted_at IS NULL
    FOR UPDATE;

    IF v_old_role_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'USER_NOT_FOUND';
    END IF;

    -- Guards 3 and 4: the new role must exist and be active
    SELECT is_active
    INTO v_new_role_active
    FROM roles
    WHERE role_id = p_new_role_id;

    IF v_new_role_active IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ROLE_NOT_FOUND';
    END IF;

    IF v_new_role_active = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ROLE_INACTIVE';
    END IF;

    -- Guard 5: a real change
    IF v_old_role_id = p_new_role_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'SAME_ROLE';
    END IF;

    -- Guard 6: never remove the last user who can manage roles
    SET v_old_can_manage = (
        SELECT COUNT(*)
        FROM role_permissions rp
        JOIN permissions p ON p.permission_id = rp.permission_id
        WHERE rp.role_id = v_old_role_id
          AND p.permission_key = 'user.update_role'
    );

    SET v_new_can_manage = (
        SELECT COUNT(*)
        FROM role_permissions rp
        JOIN permissions p ON p.permission_id = rp.permission_id
        WHERE rp.role_id = p_new_role_id
          AND p.permission_key = 'user.update_role'
    );

    IF v_old_can_manage > 0 AND v_new_can_manage = 0 THEN
        SET v_other_managers = (
            SELECT COUNT(*)
            FROM users u
            JOIN role_permissions rp ON rp.role_id = u.role_id
            JOIN permissions p ON p.permission_id = rp.permission_id
            WHERE p.permission_key = 'user.update_role'
              AND u.user_id <> p_target_user_id
              AND u.deleted_at IS NULL
              AND u.status = 'active'
        );

        IF v_other_managers = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'LAST_ROLE_MANAGER';
        END IF;
    END IF;

    -- All guards passed: change the role and record the history, together
    UPDATE users
    SET role_id = p_new_role_id,
        updated_at = NOW()
    WHERE user_id = p_target_user_id;

    INSERT INTO user_role_history
        (user_id, old_role_id, new_role_id, changed_by, reason)
    VALUES
        (p_target_user_id, v_old_role_id, p_new_role_id, p_changed_by, p_reason);

    COMMIT;

    -- Return the updated user
    SELECT
        u.user_id,
        u.username,
        u.email,
        u.status,
        r.role_id,
        r.role_name
    FROM users u
    INNER JOIN roles r ON r.role_id = u.role_id
    WHERE u.user_id = p_target_user_id;
END$$

DELIMITER ;