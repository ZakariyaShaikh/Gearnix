DROP PROCEDURE IF EXISTS sp_add_wishlist_item;

DELIMITER $$

CREATE PROCEDURE sp_add_wishlist_item(
    IN p_user_id BIGINT UNSIGNED,
    IN p_product_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_wishlist_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_is_active TINYINT DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- One wishlist per user, created the first time it's needed
    INSERT IGNORE INTO wishlists (user_id) VALUES (p_user_id);

    SELECT wishlist_id
    INTO v_wishlist_id
    FROM wishlists
    WHERE user_id = p_user_id;

    -- Only visible products can be saved
    SELECT is_active
    INTO v_is_active
    FROM products
    WHERE product_id = p_product_id;

    IF v_is_active IS NULL OR v_is_active = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PRODUCT_UNAVAILABLE';
    END IF;

    -- IGNORE only skips the duplicate case here. The product check above
    -- guarantees the foreign key is valid, so no other error is hidden
    INSERT IGNORE INTO wishlist_items (wishlist_id, product_id)
    VALUES (v_wishlist_id, p_product_id);

    COMMIT;

    SELECT product_id, added_at
    FROM wishlist_items
    WHERE wishlist_id = v_wishlist_id
      AND product_id = p_product_id;
END$$

DELIMITER ;