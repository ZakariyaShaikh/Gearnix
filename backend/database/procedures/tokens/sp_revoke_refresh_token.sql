DROP PROCEDURE IF EXISTS sp_revoke_refresh_token;

DELIMITER $$

CREATE PROCEDURE sp_revoke_refresh_token(
    IN p_token_hash CHAR(64)
)
BEGIN
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE token_hash = p_token_hash
      AND revoked_at IS NULL;

    -- 1 if this session was ended, 0 if it was already gone
    SELECT ROW_COUNT() AS revoked_count;
END$$

DELIMITER ;