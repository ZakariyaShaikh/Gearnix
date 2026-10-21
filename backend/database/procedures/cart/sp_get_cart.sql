DROP PROCEDURE IF EXISTS sp_get_cart;

DELIMITER $$

CREATE PROCEDURE sp_get_cart(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    -- Result set 1: each line, with the product's live price and availability
    SELECT
        ci.product_id,
        p.name,
        p.slug,
        p.price,
        p.stock_quantity,
        p.is_active,
        ci.quantity,
        (p.price * ci.quantity) AS line_total,
        (p.is_active = 1 AND p.stock_quantity >= ci.quantity) AS is_available,
        (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.product_id
              AND pi.is_primary = 1
            LIMIT 1
        ) AS primary_image_url
    FROM carts c
    INNER JOIN cart_items ci ON ci.cart_id = c.cart_id
    INNER JOIN products p ON p.product_id = ci.product_id
    WHERE c.user_id = p_user_id
    ORDER BY ci.added_at ASC;

    -- Result set 2: totals. Subtotal counts only items that can be bought right now
    SELECT
        COALESCE(SUM(ci.quantity), 0) AS total_items,
        COALESCE(SUM(
            CASE
                WHEN p.is_active = 1 AND p.stock_quantity >= ci.quantity
                THEN p.price * ci.quantity
                ELSE 0
            END
        ), 0) AS subtotal
    FROM carts c
    INNER JOIN cart_items ci ON ci.cart_id = c.cart_id
    INNER JOIN products p ON p.product_id = ci.product_id
    WHERE c.user_id = p_user_id;
END$$

DELIMITER ;