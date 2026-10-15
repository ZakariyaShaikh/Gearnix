DROP PROCEDURE IF EXISTS sp_add_product_images;

DELIMITER $$

CREATE PROCEDURE sp_add_product_images(
    IN p_product_id BIGINT UNSIGNED,
    IN p_image_urls JSON
)
BEGIN
    DECLARE v_base_sort INT UNSIGNED DEFAULT 0;
    DECLARE v_has_primary INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Read the current state first, so the new rows continue the sort order
    -- and the primary rule is checked in the same transaction as the insert
    SET v_base_sort = (
        SELECT COALESCE(MAX(sort_order), 0)
        FROM product_images
        WHERE product_id = p_product_id
    );

    SET v_has_primary = (
        SELECT COUNT(*)
        FROM product_images
        WHERE product_id = p_product_id
          AND is_primary = 1
    );

    INSERT INTO product_images (product_id, image_url, sort_order, is_primary)
    SELECT
        p_product_id,
        jt.image_url,
        v_base_sort + jt.seq,
        CASE
            WHEN jt.seq = 1 AND v_has_primary = 0 THEN 1
            ELSE 0
        END
    FROM JSON_TABLE(
        p_image_urls,
        '$[*]' COLUMNS (
            seq FOR ORDINALITY,
            image_url VARCHAR(500) PATH '$'
        )
    ) AS jt;

    COMMIT;

    SELECT
        image_id,
        product_id,
        image_url,
        sort_order,
        is_primary,
        created_at
    FROM product_images
    WHERE product_id = p_product_id
    ORDER BY sort_order;
END$$

DELIMITER ;