DROP PROCEDURE IF EXISTS sp_get_user_password_hash;

DELIMITER $$

CREATE PROCEDURE sp_get_user_password_hash(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT user_id, password_hash
    FROM users
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
    LIMIT 1;
END$$

DELIMITER ;