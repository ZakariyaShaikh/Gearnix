DROP PROCEDURE IF EXISTS sp_list_products;

DELIMITER $$

CREATE PROCEDURE sp_list_products(
    IN p_include_inactive TINYINT,
    IN p_category_slug VARCHAR(120),
    IN p_search VARCHAR(100),
    IN p_limit INT UNSIGNED,
    IN p_offset INT UNSIGNED
)
BEGIN
    -- Result set 1: total number of matching products (for pagination)
    SELECT COUNT(*) AS total
    FROM products p
    WHERE (p_include_inactive = 1 OR p.is_active = 1)
      AND (p_search IS NULL OR LOCATE(LOWER(p_search), LOWER(p.name)) > 0)
      AND (p_category_slug IS NULL OR EXISTS (
            SELECT 1
            FROM product_categories pc
            JOIN categories c ON c.category_id = pc.category_id
            WHERE pc.product_id = p.product_id
              AND c.slug = p_category_slug
              AND c.is_active = 1
      ));

    -- Result set 2: the current page of products
    SELECT
        p.product_id,
        p.name,
        p.slug,
        p.price,
        p.stock_quantity,
        p.is_active,
        p.created_at,
        (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.product_id
              AND pi.is_primary = 1
            LIMIT 1
        ) AS primary_image_url
    FROM products p
    WHERE (p_include_inactive = 1 OR p.is_active = 1)
      AND (p_search IS NULL OR LOCATE(LOWER(p_search), LOWER(p.name)) > 0)
      AND (p_category_slug IS NULL OR EXISTS (
            SELECT 1
            FROM product_categories pc
            JOIN categories c ON c.category_id = pc.category_id
            WHERE pc.product_id = p.product_id
              AND c.slug = p_category_slug
              AND c.is_active = 1
      ))
    ORDER BY p.created_at DESC, p.product_id DESC
    LIMIT p_limit OFFSET p_offset;
END$$

DELIMITER ;