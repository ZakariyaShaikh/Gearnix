DROP PROCEDURE IF EXISTS sp_get_product_detail;

DELIMITER $$

CREATE PROCEDURE sp_get_product_detail(
    IN p_product_id BIGINT UNSIGNED
)
BEGIN
    -- Result set 1: the product (hidden products return nothing)
    SELECT
        product_id,
        name,
        slug,
        description,
        price,
        stock_quantity,
        is_active,
        created_at,
        updated_at
    FROM products
    WHERE product_id = p_product_id
      AND is_active = 1
    LIMIT 1;

    -- Result set 2: its active categories
    SELECT c.category_id, c.name, c.slug
    FROM product_categories pc
    JOIN categories c ON c.category_id = pc.category_id
    WHERE pc.product_id = p_product_id
      AND c.is_active = 1
    ORDER BY c.name;

    -- Result set 3: its images, primary first, then in upload order
    SELECT image_id, image_url, sort_order, is_primary
    FROM product_images
    WHERE product_id = p_product_id
    ORDER BY is_primary DESC, sort_order ASC;
END$$

DELIMITER ;