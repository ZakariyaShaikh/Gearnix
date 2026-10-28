DROP PROCEDURE IF EXISTS sp_revoke_all_refresh_tokens;

DELIMITER $$

CREATE PROCEDURE sp_revoke_all_refresh_tokens(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = p_user_id
      AND revoked_at IS NULL;

    -- Used by "log out everywhere" and after a password change
    SELECT ROW_COUNT() AS revoked_count;
END$$

DELIMITER ;