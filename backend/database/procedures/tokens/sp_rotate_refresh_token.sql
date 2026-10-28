DROP PROCEDURE IF EXISTS sp_rotate_refresh_token;

DELIMITER $$

CREATE PROCEDURE sp_rotate_refresh_token(
    IN p_old_hash CHAR(64),
    IN p_new_hash CHAR(64),
    IN p_lifetime_days INT UNSIGNED,
    IN p_user_agent VARCHAR(255),
    IN p_ip_address VARCHAR(45)
)
BEGIN
    DECLARE v_token_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_user_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_expires_at DATETIME DEFAULT NULL;
    DECLARE v_revoked_at DATETIME DEFAULT NULL;
    DECLARE v_status VARCHAR(20) DEFAULT 'NOT_FOUND';

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the presented token so two refreshes can't race on it
    SELECT refresh_token_id, user_id, expires_at, revoked_at
    INTO v_token_id, v_user_id, v_expires_at, v_revoked_at
    FROM refresh_tokens
    WHERE token_hash = p_old_hash
    FOR UPDATE;

    IF v_token_id IS NULL THEN
        SET v_status = 'NOT_FOUND';

    ELSEIF v_revoked_at IS NOT NULL THEN
        -- A revoked token came back: it may have been copied. End every session for this user
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE user_id = v_user_id
          AND revoked_at IS NULL;

        SET v_status = 'REUSED';

    ELSEIF v_expires_at < NOW() THEN
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE refresh_token_id = v_token_id;

        SET v_status = 'EXPIRED';

    ELSE
        -- Normal refresh: retire the old token, issue the new one
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE refresh_token_id = v_token_id;

        INSERT INTO refresh_tokens
            (user_id, token_hash, expires_at, user_agent, ip_address)
        VALUES
            (v_user_id, p_new_hash, NOW() + INTERVAL p_lifetime_days DAY, p_user_agent, p_ip_address);

        SET v_status = 'ROTATED';
    END IF;

    COMMIT;

    -- status: ROTATED, REUSED, EXPIRED or NOT_FOUND. user_id is NULL when not found
    SELECT v_status AS status, v_user_id AS user_id;
END$$

DELIMITER ;