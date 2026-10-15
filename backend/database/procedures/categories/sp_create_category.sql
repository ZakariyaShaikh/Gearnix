DROP PROCEDURE IF EXISTS sp_create_category;

DELIMITER $$

CREATE PROCEDURE sp_create_category(
    IN p_name VARCHAR(100),
    IN p_slug VARCHAR(120),
    IN p_description VARCHAR(500)
)
BEGIN
    INSERT INTO categories (name, slug, description)
    VALUES (p_name, p_slug, p_description);

    SELECT
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at
    FROM categories
    WHERE category_id = LAST_INSERT_ID();
END$$

DELIMITER ;