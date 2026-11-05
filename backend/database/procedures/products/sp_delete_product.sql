DROP PROCEDURE IF EXISTS sp_delete_product;

DELIMITER $$

CREATE PROCEDURE sp_delete_product(
    IN p_product_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_action VARCHAR(10);

    -- Preserve products referenced by order history; they can no longer be purchased.
    IF EXISTS (
        SELECT 1
        FROM order_items
        WHERE product_id = p_product_id
    ) THEN
        UPDATE products
        SET is_active = 0
        WHERE product_id = p_product_id;

        SET v_action = 'archived';
    ELSE
        SET v_action = 'deleted';
    END IF;

    -- Return the action and image URLs before cascading product image rows.
    SELECT v_action AS action, pi.image_url
    FROM (SELECT p_product_id AS product_id) AS target
    LEFT JOIN product_images AS pi ON pi.product_id = target.product_id;

    IF v_action = 'deleted' THEN
        DELETE FROM products WHERE product_id = p_product_id;
    END IF;
END$$

DELIMITER ;