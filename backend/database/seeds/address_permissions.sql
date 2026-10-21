-- 1. Create the permission
INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('address.manage', 'Manage Addresses', 'address', 'Manage your own delivery addresses', 1, NOW(), NOW());

-- 2. Give it to Customer
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key = 'address.manage'
WHERE r.role_name = 'Customer';