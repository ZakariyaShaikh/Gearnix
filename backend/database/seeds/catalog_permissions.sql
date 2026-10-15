INSERT INTO permissions
    (permission_key, permission_name, module, description, is_active, created_at, updated_at)
VALUES
    ('product.read',   'Read Products',   'product', 'View products in the admin area', 1, NOW(), NOW()),
    ('product.create', 'Create Products', 'product', 'Create new products',             1, NOW(), NOW()),
    ('product.update', 'Update Products', 'product', 'Edit existing products',          1, NOW(), NOW()),
    ('product.delete', 'Delete Products', 'product', 'Delete products',                 1, NOW(), NOW()),

    ('category.read',   'Read Categories',   'category', 'View categories in the admin area', 1, NOW(), NOW()),
    ('category.create', 'Create Categories', 'category', 'Create new categories',             1, NOW(), NOW()),
    ('category.update', 'Update Categories', 'category', 'Edit existing categories',          1, NOW(), NOW()),
    ('category.delete', 'Delete Categories', 'category', 'Delete categories',                 1, NOW(), NOW());