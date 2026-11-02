-- 1. Create the admin order read permission
INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('order.read', 'Read All Orders', 'order', 'View all customer orders in the admin area', 1, NOW(), NOW());

-- 2. Grant it to Super Admin only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key = 'order.read'
WHERE r.role_name = 'Super Admin';
