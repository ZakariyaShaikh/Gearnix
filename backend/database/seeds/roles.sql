INSERT INTO roles (role_name, description, is_system_role, is_active, created_at, updated_at)
VALUES
    ('Blog Admin',    'Can read, create and update blogs',       1, 1, NOW(), NOW()),
    ('Product Admin', 'Can read, create and update products',    1, 1, NOW(), NOW()),
    ('Super Admin',   'Full administrative access',              1, 1, NOW(), NOW());