INSERT INTO users
    (role_id, username, email, password_hash, profile_image, status, is_email_verified, created_at, updated_at, deleted_at)
SELECT
    r.role_id,
    v.username,
    v.email,
    '$2b$12$cZaML7C.E9vdhpeKHp8qHOHijxeBBMi6hSjFLWb2KH32B0855MZUS',
    NULL,
    'active',
    1,
    NOW(),
    NOW(),
    NULL
FROM roles r
JOIN (
    SELECT 'test_user1' AS username, 'yourname+test1@gmail.com' AS email
    UNION ALL SELECT 'test_user2', 'yourname+test2@gmail.com'
    UNION ALL SELECT 'test_user3', 'yourname+test3@gmail.com'
    UNION ALL SELECT 'test_user4', 'yourname+test4@gmail.com'
    UNION ALL SELECT 'test_user5', 'yourname+test5@gmail.com'
) AS v
WHERE r.role_name = 'Customer';