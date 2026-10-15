-- Super Admin: all catalog permissions (including delete)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN (
      'product.read', 'product.create', 'product.update', 'product.delete',
      'category.read', 'category.create', 'category.update', 'category.delete'
  )
WHERE r.role_name = 'Super Admin';

-- Product Admin: read/create/update only, no delete
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN (
      'product.read', 'product.create', 'product.update',
      'category.read', 'category.create', 'category.update'
  )
WHERE r.role_name = 'Product Admin';