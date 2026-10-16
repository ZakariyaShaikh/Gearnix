-- 1. Create the four admin permissions
INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('user.read',        'Read Users',        'user', 'View the list of users and their roles', 1, NOW(), NOW()),
    ('user.update_role', 'Update User Roles', 'user', 'Change a user\'s role',                   1, NOW(), NOW()),
    ('role.read',        'Read Roles',        'role', 'View roles and their permissions',       1, NOW(), NOW()),
    ('role.update',      'Update Roles',      'role', 'Change the permissions of a role',       1, NOW(), NOW());

-- 2. Give them to Super Admin only

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN ('user.read', 'user.update_role', 'role.read', 'role.update')
WHERE r.role_name = 'Super Admin';