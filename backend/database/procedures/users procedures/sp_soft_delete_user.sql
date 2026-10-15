DROP PROCEDURE IF EXISTS sp_soft_delete_user;

DELIMITER $$

CREATE PROCEDURE sp_soft_delete_user(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    UPDATE users
    SET deleted_at = NOW(),
        status = 'deleted',
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    SELECT ROW_COUNT() AS affected_rows;
END$$

DELIMITER ;