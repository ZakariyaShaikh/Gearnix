INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('order.manage', 'Manage Own Orders', 'order', 'Place and view your own orders', 1, NOW(), NOW());

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key = 'order.manage'
WHERE r.role_name = 'Customer';

-- Grant order.manage to Super Admin for admin order management
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key = 'order.manage'
WHERE r.role_name = 'Super Admin';