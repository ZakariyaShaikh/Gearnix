DROP PROCEDURE IF EXISTS sp_update_cart_item;

DELIMITER $$

CREATE PROCEDURE sp_update_cart_item(
    IN p_user_id BIGINT UNSIGNED,
    IN p_product_id BIGINT UNSIGNED,
    IN p_quantity INT UNSIGNED
)
BEGIN
    DECLARE v_found_qty INT UNSIGNED DEFAULT NULL;
    DECLARE v_stock INT UNSIGNED DEFAULT 0;
    DECLARE v_is_active TINYINT DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_quantity = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'QUANTITY_MUST_BE_POSITIVE';
    END IF;

    START TRANSACTION;

    -- The item must already be in this user's cart
    SELECT ci.quantity
    INTO v_found_qty
    FROM carts c
    INNER JOIN cart_items ci ON ci.cart_id = c.cart_id
    WHERE c.user_id = p_user_id
      AND ci.product_id = p_product_id
    FOR UPDATE;

    IF v_found_qty IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CART_ITEM_NOT_FOUND';
    END IF;

    SELECT stock_quantity, is_active
    INTO v_stock, v_is_active
    FROM products
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF v_is_active = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PRODUCT_UNAVAILABLE';
    END IF;

    IF p_quantity > v_stock THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'INSUFFICIENT_STOCK';
    END IF;

    UPDATE cart_items ci
    INNER JOIN carts c ON c.cart_id = ci.cart_id
    SET ci.quantity = p_quantity
    WHERE c.user_id = p_user_id
      AND ci.product_id = p_product_id;

    COMMIT;

    SELECT ci.product_id, ci.quantity
    FROM carts c
    INNER JOIN cart_items ci ON ci.cart_id = c.cart_id
    WHERE c.user_id = p_user_id
      AND ci.product_id = p_product_id;
END$$

DELIMITER ;