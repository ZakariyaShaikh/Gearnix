ALTER TABLE roles
    ADD COLUMN is_locked TINYINT(1) NOT NULL DEFAULT 0 AFTER is_system_role;

-- Lock Super Admin so its permissions can never be edited
UPDATE roles
SET is_locked = 1
WHERE role_name = 'Super Admin';