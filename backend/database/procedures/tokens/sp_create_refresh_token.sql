DROP PROCEDURE IF EXISTS sp_create_refresh_token;

DELIMITER $$

CREATE PROCEDURE sp_create_refresh_token(
    IN p_user_id BIGINT UNSIGNED,
    IN p_token_hash CHAR(64),
    IN p_lifetime_days INT UNSIGNED,
    IN p_user_agent VARCHAR(255),
    IN p_ip_address VARCHAR(45)
)
BEGIN
    INSERT INTO refresh_tokens
        (user_id, token_hash, expires_at, user_agent, ip_address)
    VALUES
        (p_user_id, p_token_hash, NOW() + INTERVAL p_lifetime_days DAY, p_user_agent, p_ip_address);

    SELECT refresh_token_id, user_id, expires_at
    FROM refresh_tokens
    WHERE refresh_token_id = LAST_INSERT_ID();
END$$

DELIMITER ;