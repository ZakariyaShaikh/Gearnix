DROP PROCEDURE IF EXISTS sp_get_product_by_id;

DELIMITER $$

CREATE PROCEDURE sp_get_product_by_id(
    IN p_product_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        product_id,
        name,
        slug,
        price,
        stock_quantity,
        is_active,
        created_by,
        created_at,
        updated_at
    FROM products
    WHERE product_id = p_product_id
    LIMIT 1;
END$$

DELIMITER ;