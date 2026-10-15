DROP PROCEDURE IF EXISTS sp_get_categories;

DELIMITER $$

CREATE PROCEDURE sp_get_categories(
    IN p_include_inactive TINYINT
)
BEGIN
    SELECT
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at
    FROM categories
    WHERE p_include_inactive = 1
       OR is_active = 1
    ORDER BY name ASC;
END$$

DELIMITER ;