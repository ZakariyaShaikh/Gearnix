DROP PROCEDURE IF EXISTS sp_delete_product_image;

DELIMITER $$

CREATE PROCEDURE sp_delete_product_image(
    IN p_product_id BIGINT UNSIGNED,
    IN p_image_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_image_url VARCHAR(500) DEFAULT NULL;
    DECLARE v_was_primary TINYINT DEFAULT 0;
    DECLARE v_new_primary_id BIGINT UNSIGNED DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the row, and only accept it if it belongs to this product
    SELECT image_url, is_primary
    INTO v_image_url, v_was_primary
    FROM product_images
    WHERE image_id = p_image_id
      AND product_id = p_product_id
    LIMIT 1
    FOR UPDATE;

    IF v_image_url IS NOT NULL THEN
        DELETE FROM product_images
        WHERE image_id = p_image_id;

        -- If the primary image was removed, promote the next one in order
        IF v_was_primary = 1 THEN
            SELECT image_id
            INTO v_new_primary_id
            FROM product_images
            WHERE product_id = p_product_id
            ORDER BY sort_order ASC
            LIMIT 1;

            IF v_new_primary_id IS NOT NULL THEN
                UPDATE product_images
                SET is_primary = 1
                WHERE image_id = v_new_primary_id;
            END IF;
        END IF;
    END IF;

    COMMIT;

    -- One row: the file to remove from disk (NULL if nothing matched),
    -- and the image that was promoted to primary (NULL if none)
    SELECT
        v_image_url AS deleted_image_url,
        v_new_primary_id AS new_primary_image_id;
END$$

DELIMITER ;