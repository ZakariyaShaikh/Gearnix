DROP PROCEDURE IF EXISTS sp_update_user_password;

DELIMITER $$

CREATE PROCEDURE sp_update_user_password(
    IN p_user_id BIGINT UNSIGNED,
    IN p_password_hash VARCHAR(255)
)
BEGIN
    UPDATE users
    SET password_hash = p_password_hash,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    SELECT ROW_COUNT() AS affected_rows;
END$$

DELIMITER ;