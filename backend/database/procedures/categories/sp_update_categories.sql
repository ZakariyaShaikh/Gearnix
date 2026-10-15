DROP PROCEDURE IF EXISTS sp_update_category;

DELIMITER $$

CREATE PROCEDURE sp_update_category(
    IN p_category_id BIGINT UNSIGNED,
    IN p_name VARCHAR(100),
    IN p_slug VARCHAR(120),
    IN p_description VARCHAR(500),
    IN p_update_description TINYINT,
    IN p_is_active TINYINT
)
BEGIN
    -- NULL means "keep the current value"
    UPDATE categories
    SET name = COALESCE(p_name, name),
        slug = COALESCE(p_slug, slug),
        description = IF(p_update_description = 1, p_description, description),
        is_active = COALESCE(p_is_active, is_active),
        updated_at = NOW()
    WHERE category_id = p_category_id;

    SELECT
        category_id,
        name,
        slug,
        description,
        is_active,
        created_at,
        updated_at
    FROM categories
    WHERE category_id = p_category_id
    LIMIT 1;
END$$

DELIMITER ;