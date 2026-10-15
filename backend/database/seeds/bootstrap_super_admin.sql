START TRANSACTION;

SET @target_email = 'abrham00003@gmail.com';   -- change this
SET @super_admin_role_id = (SELECT role_id FROM roles WHERE role_name = 'Super Admin');
SET @target_user_id = (
    SELECT user_id FROM users
    WHERE email = @target_email COLLATE utf8mb4_unicode_ci
      AND deleted_at IS NULL
);
SET @old_role_id = (SELECT role_id FROM users WHERE user_id = @target_user_id);

INSERT INTO user_role_history (user_id, old_role_id, new_role_id, changed_by, reason)
VALUES (@target_user_id, @old_role_id, @super_admin_role_id, @target_user_id,
        'Initial Super Admin bootstrap');

UPDATE users
SET role_id = @super_admin_role_id,
    updated_at = NOW()
WHERE user_id = @target_user_id;

COMMIT;