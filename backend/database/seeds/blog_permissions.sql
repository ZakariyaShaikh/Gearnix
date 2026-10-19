-- 1. Create the four blog permissions
INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('blog.read',   'Read Blogs',   'blog', 'View blogs in the admin area', 1, NOW(), NOW()),
    ('blog.create', 'Create Blogs', 'blog', 'Create new blogs',             1, NOW(), NOW()),
    ('blog.update', 'Update Blogs', 'blog', 'Edit existing blogs',          1, NOW(), NOW()),
    ('blog.delete', 'Delete Blogs', 'blog', 'Delete blogs',                 1, NOW(), NOW());

-- 2. Blog Admin: read, create, update (no delete)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN ('blog.read', 'blog.create', 'blog.update')
WHERE r.role_name = 'Blog Admin';

-- 3. Super Admin: all four blog permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r
JOIN permissions p
  ON p.permission_key IN ('blog.read', 'blog.create', 'blog.update', 'blog.delete')
WHERE r.role_name = 'Super Admin';