DELIMITER $$

CREATE PROCEDURE sp_find_role_by_name(
    IN p_role_name VARCHAR(50)
)
BEGIN

    SELECT
        role_id,
        role_name,
        description,
        is_system_role,
        is_active
    FROM roles
    WHERE role_name = p_role_name
      AND is_active = 1
    LIMIT 1;

END $$

DELIMITER ;