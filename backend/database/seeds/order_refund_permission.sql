INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('order.refund', 'Refund Orders', 'order', 'Refund any paid order (admin)', 1, NOW(), NOW());

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p ON p.permission_key = 'order.refund'
WHERE r.role_name = 'Super Admin';