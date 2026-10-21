DROP PROCEDURE IF EXISTS sp_get_wishlist;

DELIMITER $$

CREATE PROCEDURE sp_get_wishlist(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        wi.product_id,
        p.name,
        p.slug,
        p.price,
        p.stock_quantity,
        p.is_active,
        wi.added_at,
        (p.is_active = 1 AND p.stock_quantity > 0) AS is_available,
        (
            SELECT pi.image_url
            FROM product_images pi
            WHERE pi.product_id = p.product_id
              AND pi.is_primary = 1
            LIMIT 1
        ) AS primary_image_url
    FROM wishlists w
    INNER JOIN wishlist_items wi ON wi.wishlist_id = w.wishlist_id
    INNER JOIN products p ON p.product_id = wi.product_id
    WHERE w.user_id = p_user_id
    ORDER BY wi.added_at DESC;
END$$

DELIMITER ;