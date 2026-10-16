DROP PROCEDURE IF EXISTS sp_set_primary_product_image;

DELIMITER $$

CREATE PROCEDURE sp_set_primary_product_image(
    IN p_product_id BIGINT UNSIGNED,
    IN p_image_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_belongs INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SET v_belongs = (
        SELECT COUNT(*)
        FROM product_images
        WHERE image_id = p_image_id
          AND product_id = p_product_id
    );

    IF v_belongs = 1 THEN
        -- Step 1: clear the current primary (must happen first)
        UPDATE product_images
        SET is_primary = 0
        WHERE product_id = p_product_id
          AND is_primary = 1;

        -- Step 2: set the new primary
        UPDATE product_images
        SET is_primary = 1
        WHERE image_id = p_image_id;
    END IF;

    COMMIT;

    -- Return the product's images, primary first, so Node can check the result
    SELECT
        image_id,
        product_id,
        image_url,
        sort_order,
        is_primary
    FROM product_images
    WHERE product_id = p_product_id
    ORDER BY is_primary DESC, sort_order ASC;
END$$

DELIMITER ;