DELIMITER $$

CREATE PROCEDURE sp_create_customer(
    IN p_role_id BIGINT UNSIGNED,
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_password_hash VARCHAR(255)
)
BEGIN

    INSERT INTO users (
        role_id,
        username,
        email,
        password_hash,
        status,
        is_email_verified,
        created_at,
        updated_at
    )
    VALUES (
        p_role_id,
        p_username,
        p_email,
        p_password_hash,
        'active',
        0,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    SELECT
        user_id,
        role_id,
        username,
        email,
        status,
        is_email_verified,
        created_at
    FROM users
    WHERE user_id = LAST_INSERT_ID();

END $$

DELIMITER ;