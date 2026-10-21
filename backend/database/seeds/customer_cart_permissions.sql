-- 1. Create the two permissions
INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('cart.manage',     'Manage Cart',     'cart',     'Use the shopping cart',     1, NOW(), NOW()),
    ('wishlist.manage', 'Manage Wishlist', 'wishlist', 'Use the wishlist',          1, NOW(), NOW());

-- 2. Give both to Customer
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN ('cart.manage', 'wishlist.manage')
WHERE r.role_name = 'Customer';